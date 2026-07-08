
import { Injectable, signal, DestroyRef, inject } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject, Observable } from 'rxjs';
import { OrderResponse, StockUpdateResponse, MenuUpdateEvent } from '../models/types';
import { API_CONFIG } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private client: Client | null = null;
  private destroyRef = inject(DestroyRef);
  
  // Signal-based connection state (replaces BehaviorSubject)
  readonly isConnected = signal(false);
  
  // Subjects for event streams (kept as Subjects since they need Observable-based API)
  private newOrderSubject = new Subject<OrderResponse>();
  private stockUpdateSubject = new Subject<StockUpdateResponse>();
  private menuUpdateSubject = new Subject<MenuUpdateEvent>();

  constructor() {
    // In demo mode, skip WebSocket connection entirely
    if (API_CONFIG.isDemoMode) {
      return;
    }

    const socketUrl = `${API_CONFIG.baseUrl}/ws-pablococina`;

    this.client = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      reconnectDelay: 5000,
      connectionTimeout: 3000,
      debug: () => {}
    });

    this.client.onConnect = () => {
      this.isConnected.set(true);

      this.client!.subscribe('/topic/admin/new-order', (message: Message) => {
        if (message.body) {
          try {
            const order: OrderResponse = JSON.parse(message.body);
            this.newOrderSubject.next(order);
          } catch (e) {
            console.error('Error parseando orden del socket', e);
          }
        }
      });

      this.client!.subscribe('/topic/product/stock-update', (message: Message) => {
          if (message.body) {
              try {
                  const update: StockUpdateResponse = JSON.parse(message.body);
                  this.stockUpdateSubject.next(update);
              } catch (e) {
                  console.error('Error parseando actualización de stock', e);
              }
          }
      });

      this.client!.subscribe('/topic/menu/updates', (message: Message) => {
          if (message.body) {
              try {
                  const event: MenuUpdateEvent = JSON.parse(message.body);
                  this.menuUpdateSubject.next(event);
              } catch (e) {
                  console.error('Error parseando actualización de menú', e);
              }
          }
      });
    };

    this.client.onStompError = (frame) => {
      console.error('Error en Broker STOMP:', frame.headers['message']);
      this.isConnected.set(false);
    };

    this.client.onWebSocketClose = () => {
       this.isConnected.set(false);
    };

    // Cleanup on destroy
    this.destroyRef.onDestroy(() => {
      this.disconnect();
    });
  }

  public connect() {
    if (!this.client || this.client.active) return;
    this.client.activate();
  }

  public disconnect() {
    if (this.client && this.client.active) {
        this.client.deactivate();
    }
    this.isConnected.set(false);
  }

  public getNewOrders(): Observable<OrderResponse> {
    return this.newOrderSubject.asObservable();
  }

  public onStockUpdate(): Observable<StockUpdateResponse> {
      return this.stockUpdateSubject.asObservable();
  }
  
  public getStockUpdates(): Observable<StockUpdateResponse> {
      return this.onStockUpdate();
  }

  public onMenuUpdate(): Observable<MenuUpdateEvent> {
      return this.menuUpdateSubject.asObservable();
  }
}
