
import { Injectable, inject, signal, DestroyRef } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, of, finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrderResponse, OrderRequest, ApiResponse, OrderFilters, Page, OrderStatus } from '../models/types';
import { API_CONFIG } from '../config/api.config';
import { WebSocketService } from './websocket.service';
import { ErrorHandlerService } from './error-handler.service';
import { mapOrderResponse } from './order-mapper';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private http: HttpClient = inject(HttpClient);
  private wsService: WebSocketService = inject(WebSocketService);
  private errorHandler = inject(ErrorHandlerService);
  
  // Signal para la lista de órdenes actual
  readonly orders = signal<OrderResponse[]>([]);
  
  // Loading state
  readonly loading = signal(false);
  
  // Signal para el estado de la paginación
  readonly paginationState = signal<{
      page: number; // Índice base 0
      size: number;
      totalPages: number;
      totalElements: number;
      first: boolean;
      last: boolean;
  }>({
      page: 0,
      size: 10,
      totalPages: 0,
      totalElements: 0,
      first: true,
      last: true
  });

  readonly printingOrder = signal<OrderResponse | null>(null);
  private destroyRef = inject(DestroyRef);

  constructor() {
      // Connect to WebSocket and listen for new orders (with auto-cleanup)
      this.wsService.connect();
      this.wsService.getNewOrders().pipe(
          takeUntilDestroyed(this.destroyRef)
      ).subscribe(order => {
          this.prependOrder(order);
      });
  }

  // 1. CREATE ORDER
  createOrder(payload: OrderRequest): Observable<OrderResponse> {
    return this.http.post<ApiResponse<OrderResponse>>(`${API_CONFIG.baseUrl}/order/create-order`, payload)
      .pipe(
        map((res: ApiResponse<OrderResponse>) => mapOrderResponse(res.data)),
        catchError(err => this.errorHandler.handleError(err, 'OrderService'))
      );
  }

  // 2. LOAD USER ORDERS (Método específico para el perfil del usuario)
  loadUserOrders(userId: string, page: number = 0, size: number = 20, dateSpecific?: Date) {
      let params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString());

      this.http.get<ApiResponse<Page<OrderResponse>>>(`${API_CONFIG.baseUrl}/order/user-orders/${userId}`, { params })
        .pipe(
          map((res: ApiResponse<Page<OrderResponse>>) => {
             const rawData = res.data;
             let content: OrderResponse[] = [];
             let pageInfo = {
                 totalPages: 1,
                 totalElements: 0,
                 first: true,
                 last: true,
                 number: 0,
                 size: size
             };
             
             // Manejo robusto: Backend puede devolver Array directo o Page object
             if (rawData && Array.isArray(rawData)) {
                 content = rawData;
                 pageInfo.totalElements = content.length;
             } else if (rawData && rawData.content && Array.isArray(rawData.content)) {
                 content = rawData.content;
                 pageInfo = {
                     totalPages: rawData.totalPages,
                     totalElements: rawData.totalElements,
                     first: rawData.first,
                     last: rawData.last,
                     number: rawData.number,
                     size: rawData.size
                 };
             }
             
             // Mapear órdenes
              const mapped = content.map(o => mapOrderResponse(o));
             
             // Si no viene paginado del server (es un array simple), ordenamos localmente.
             // Si viene paginado, asumimos que el server ya entrega el orden correcto.
             if (Array.isArray(rawData)) {
                 mapped.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
             }

             return { orders: mapped, pageInfo };
          }),
          catchError(err => {
              this.errorHandler.showError(err, 'OrderService');
              return of({ 
                  orders: [], 
                  pageInfo: { totalPages: 0, totalElements: 0, first: true, last: true, number: 0, size } 
              });
          })
        )
        .subscribe(result => {
            let filtered = result.orders;
            
            // Filtro local de fecha (si el backend no lo soporta en este endpoint)
            if (dateSpecific) {
                const dateStr = dateSpecific.toISOString().split('T')[0];
                filtered = result.orders.filter(o => o.createdAt.startsWith(dateStr));
            }

            this.orders.set(filtered);
            
            this.paginationState.set({
                page: result.pageInfo.number,
                size: result.pageInfo.size,
                totalPages: result.pageInfo.totalPages,
                totalElements: result.pageInfo.totalElements,
                first: result.pageInfo.first,
                last: result.pageInfo.last
            });
        });
  }

  // 3. GET ALL ORDERS (ADMIN - PAGINATED)
  getOrders(filters: OrderFilters, page: number = 0, size: number = 10): void {
    // ENFORCE SORTING ON BACKEND
    let params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
        .set('sort', 'createdAt,desc'); 

    if (filters) {
      if (filters.dateSpecific) {
        const dateStr = filters.dateSpecific.toISOString().split('T')[0]; 
        params = params.append('createdAt_specific', dateStr);
      } else {
        if (filters.month) {
          params = params.append('createdAt_month', filters.month.toString());
        }
        if (filters.year) {
          params = params.append('createdAt_year', filters.year.toString());
        }
      }
      if (filters.status) params = params.append('status', filters.status);
      if (filters.userEmail) params = params.append('user.email', filters.userEmail);
    }

    // Esperamos ApiResponse<Page<OrderResponse>>
    this.loading.set(true);
    this.http.get<ApiResponse<Page<OrderResponse>>>(`${API_CONFIG.baseUrl}/order`, { params })
      .pipe(
        catchError(err => {
             this.errorHandler.showError(err, 'OrderService');
             return of<ApiResponse<Page<OrderResponse>>>({ data: { content: [], totalPages: 0, totalElements: 0, number: 0, size: 10, first: true, last: true, empty: true } });
        }),
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: (response) => {
            const pageData = response.data;
            
            // 1. Mapear contenido
            let mappedOrders = (pageData.content || []).map(o => mapOrderResponse(o));
            
            // 2. CLIENT-SIDE SORTING FALLBACK (CRITICAL FIX)
            // Even if backend fails to sort, we sort the current page visually.
            mappedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

            this.orders.set(mappedOrders);

            // 3. Actualizar estado de paginación
            this.paginationState.set({
                page: pageData.number,
                size: pageData.size,
                totalPages: pageData.totalPages,
                totalElements: pageData.totalElements,
                first: pageData.first,
                last: pageData.last
            });
        },
        error: (err) => this.errorHandler.showError(err, 'OrderService')
      });
  }

  // Método auxiliar para WebSocket: Agrega una nueva orden al inicio de la lista
  prependOrder(order: OrderResponse) {
      const mapped = mapOrderResponse(order);
      // Mark as new for animation
      mapped._isNew = true;
      
      this.orders.update(current => {
          // Check if already exists to avoid duplicates
          if (current.some(o => o.id === mapped.id)) return current;
          return [mapped, ...current];
      });
      
      // Opcional: Actualizar el contador total si estamos en la primera página
      this.paginationState.update(state => ({
          ...state,
          totalElements: state.totalElements + 1
      }));
  }

  // 4. UPDATE ORDER STATUS
  updateOrderStatus(orderId: string, status: OrderStatus): Observable<OrderResponse> {
      return this.http.post<ApiResponse<OrderResponse>>(`${API_CONFIG.baseUrl}/order/update-status/${orderId}`, { status })
        .pipe(
            map((res: ApiResponse<OrderResponse>) => mapOrderResponse(res.data))
        );
  }

  // Optimistic update helper
  updateOrderLocally(orderId: string, partial: Partial<OrderResponse>) {
      this.orders.update(current => 
          current.map(o => o.id === orderId ? { ...o, ...partial } : o)
      );
  }

  setPrintingOrder(order: OrderResponse | null) {
      this.printingOrder.set(order);
  }

}
