
import { Injectable, signal, inject, DestroyRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category, Product, ApiResponse, MenuUpdateEvent } from '../models/types';
import { API_CONFIG } from '../config/api.config';
import { map, catchError, of } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WebSocketService } from './websocket.service';
import { ErrorHandlerService } from './error-handler.service';
import { MenuAdminService } from './menu-admin.service';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private http: HttpClient = inject(HttpClient);
  private wsService: WebSocketService = inject(WebSocketService);
  private errorHandler = inject(ErrorHandlerService);
  readonly admin = inject(MenuAdminService);
  
  readonly products = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly loading = signal(true);
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.loadCategories();
    this.loadProducts();
    
    // Subscribe to real-time stock updates (with auto-cleanup)
    this.wsService.onStockUpdate().pipe(
        takeUntilDestroyed(this.destroyRef)
    ).subscribe(update => {
        try {
            const stockValue = update.newStock !== undefined ? update.newStock : (update.stock ?? 0);
            this.updateProductStock(update.productId, stockValue, update.available);
        } catch (e) {
            this.errorHandler.showError(e, 'MenuService');
        }
    });

    // Subscribe to real-time menu updates (CRUD, with auto-cleanup)
    this.wsService.onMenuUpdate().pipe(
        takeUntilDestroyed(this.destroyRef)
    ).subscribe(event => {
        this.handleMenuUpdate(event);
    });

    // Reload products / categories after admin CRUD
    this.admin.changes$.pipe(
        takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
        this.loadProducts();
        this.loadCategories();
    });
  }

  private handleMenuUpdate(event: MenuUpdateEvent) {
      try {
          if (!event || !event.type) {
              this.loadProducts();
              return;
          }
          
          if (event.type === 'PRODUCT_CREATED' && event.product) {
              const product: Product = event.product;
              this.products.update(current => [...current, this.mapProduct(product)]);
          } else if (event.type === 'PRODUCT_UPDATED' && event.product) {
              const product: Product = event.product;
              this.products.update(current => current.map(p => p.id === product.id ? this.mapProduct(product) : p));
          } else if (event.type === 'PRODUCT_DELETED' && event.productId) {
              this.products.update(current => current.filter(p => p.id !== event.productId));
          } else {
              // Fallback: reload all if payload is insufficient
              this.loadProducts();
          }
      } catch (e) {
          this.errorHandler.showError(e, 'MenuService');
          this.loadProducts();
      }
  }

  private mapProduct(p: Product): Product {
      // Infer availability: Trust backend 'available' if present, otherwise true if stock > 0
      const isAvailable = p.available !== undefined ? p.available : ((p.stock ?? 0) > 0);

      return {
        ...p,
        category: p.categoryId || p.category || 'uncategorized',
        stock: p.stock !== undefined ? p.stock : 100,
        available: isAvailable,
        additionals: p.additionals || [],
        garnishes: p.garnishes || [],
        isDishOfTheDay: p.dishOfTheDay || p.isDishOfTheDay || false
      };
  }

  loadProducts() {
    // GET /menu
    this.http.get<ApiResponse<Product[]>>(`${API_CONFIG.baseUrl}/menu`)
      .pipe(
        map((res: ApiResponse<Product[]>) => {
            // Seguridad: verificar si viene en .data o directo
            const rawData = res.data || (Array.isArray(res) ? (res as unknown as Product[]) : []);
            
            return rawData.map(p => this.mapProduct(p));
        }),
        catchError(err => {
            this.errorHandler.showError(err, 'MenuService');
            return of([]);
        })
      )
      .subscribe({
        next: (data) => {
          this.products.set(data);
          this.loading.set(false);
        }
      });
  }

  // Método para actualización en tiempo real vía WebSocket
  updateProductStock(productId: string, newStock: number, available: boolean) {
      this.products.update(currentProducts => 
          currentProducts.map(p => {
              if (p.id === productId) {
                  // Logic fix: If stock is positive, force available to true unless explicitly false in payload?
                  // Actually, if stock > 0, it should be available.
                  // If the backend sends available=false but stock=5, it might be manually disabled.
                  // But for the "restock from 0 to 2" case, usually available should become true.
                  
                  // Let's trust the backend 'available' if provided, BUT if it's undefined/null, infer from stock.
                  // Also, if the user explicitly said "actualice de 0 a 2 pero sigue sin stock", 
                  // it implies 'available' might be stuck at false.
                  
                  // Robust logic:
                  // 1. Use new stock
                  // 2. If available is explicitly provided, use it.
                  // 3. If not, infer: stock > 0 -> true.
                  
                  const isAvailable = available !== undefined ? available : (newStock > 0);

                  return {
                      ...p,
                      stock: newStock,
                      available: isAvailable
                  };
              }
              return p;
          })
      );
  }

  // Método para descontar stock localmente (simulación optimista)
  decrementStock(productId: string, quantity: number) {
      this.products.update(currentProducts => 
          currentProducts.map(p => {
              if (p.id === productId) {
                  const newStock = Math.max(0, (p.stock || 0) - quantity);
                  return {
                      ...p,
                      stock: newStock,
                      available: newStock > 0 // Auto-disable if stock hits 0
                  };
              }
              return p;
          })
      );
  }

  loadCategories() {
    // GET /menu/categories
    this.http.get<ApiResponse<Category[]>>(`${API_CONFIG.baseUrl}/menu/categories`)
      .pipe(
          map((res: ApiResponse<Category[]>) => {
             // Seguridad: verificar si viene en .data o directo
             const rawData = res.data || (Array.isArray(res) ? (res as unknown as Category[]) : []);
             return rawData;
          }),
          catchError(err => {
            this.errorHandler.showError(err, 'MenuService');
            return of([]);
          })
      )
      .subscribe({
        next: (data) => {
          const decorated = data.map((c: Category) => ({
            ...c,
            icon: c.icon || this.getIconForCategory(c.name)
          }));
          this.categories.set(decorated);
        }
      });
  }

  private getIconForCategory(name: string): string {
    if (!name) return '🍽️';
    const n = name.toLowerCase();
    // Spanish names (backend)
    if (n.includes('hamburguesa')) return '🍔';
    if (n.includes('pizza')) return '🍕';
    if (n.includes('bebida') || n.includes('gaseosa')) return '🥤';
    if (n.includes('postre') || n.includes('helado')) return '🍰';
    if (n.includes('ensalada')) return '🥗';
    if (n.includes('empanada')) return '🥟';
    if (n.includes('sanguche') || n.includes('sandwich')) return '🥪';
    // English names (demo mode)
    if (n.includes('burger')) return '🍔';
    if (n.includes('mexican') || n.includes('taco') || n.includes('burrito')) return '🌮';
    if (n.includes('drink') || n.includes('beverage') || n.includes('soda')) return '🥤';
    if (n.includes('dessert') || n.includes('sweet')) return '🍰';
    if (n.includes('side') || n.includes('extra') || n.includes('acomp')) return '🍟';
    return '🍽️';
  }

}
