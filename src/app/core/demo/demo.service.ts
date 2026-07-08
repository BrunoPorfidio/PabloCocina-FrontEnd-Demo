import { Injectable, signal, computed } from '@angular/core';
import { OrderResponse, Product, Category, User, ORDER_STATUS } from '../models/types';
import { DEMO_PRODUCTS, DEMO_CATEGORIES, DEMO_USERS, generateDemoOrder } from './mock-data';

/**
 * Demo-mode service.
 * Manages mock data lifecycle: seeds initial orders so admin panel
 * isn't empty, and provides helpers for the demo interceptor.
 *
 * Order generation is on-demand only (buttons "Simular Pedido" / "Ráfaga"
 * in the admin orders tab). No background intervals — keeps the app snappy.
 */
@Injectable({
  providedIn: 'root'
})
export class DemoService {

  /** All demo products (mutable — CRUD via interceptor updates the signal) */
  readonly products = signal<Product[]>(DEMO_PRODUCTS);
  /** All demo categories (mutable) */
  readonly categories = signal<Category[]>(DEMO_CATEGORIES);
  /** Live orders — seeded on init + generated via buttons */
  readonly orders = signal<OrderResponse[]>([]);
  /** Derived count */
  readonly orderCount = computed(() => this.orders().length);
  /** How many are still TO_PRINT */
  readonly pendingCount = computed(() =>
    this.orders().filter(o => o.status === ORDER_STATUS.TO_PRINT).length
  );

  /** Whether seed has run once */
  private _seeded = false;

  // ──────────────────────────────────────────────
  //  SEED
  // ──────────────────────────────────────────────

  /**
   * Call once from AppComponent to seed initial orders.
   * No background intervals — keeps the app responsive.
   */
  start(): void {
    if (this._seeded) return;
    this._seeded = true;
    this.seedInitialOrders();
  }

  // ──────────────────────────────────────────────
  //  ORDER GENERATION  (on-demand only)
  // ──────────────────────────────────────────────

  /** Seed 5-8 historical orders with a realistic mix of statuses */
  private seedInitialOrders(): void {
    const count = 5 + Math.floor(Math.random() * 4);
    const seeded: OrderResponse[] = [];

    for (let i = 0; i < count; i++) {
      const order = generateDemoOrder();
      const ago = Math.floor(Math.random() * 7200) * 1000;
      order.createdAt = new Date(Date.now() - ago).toISOString();
      order.status = Math.random() < 0.4 ? ORDER_STATUS.PRINTED : ORDER_STATUS.TO_PRINT;
      seeded.push(order);
    }

    seeded.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    this.orders.set(seeded);
  }

  /** Generate a single new demo order and prepend it with entrance animation */
  generateOrder(): OrderResponse {
    const order = generateDemoOrder();
    order._isNew = true;
    this.orders.update(current => [order, ...current]);
    setTimeout(() => {
      this.orders.update(current =>
        current.map(o => o.id === order.id ? { ...o, _isNew: false } as const : o)
      );
    }, 3000);
    return order;
  }

  /** Toggle order status between TO_PRINT / PRINTED */
  toggleOrderStatus(orderId: string): void {
    this.orders.update(current =>
      current.map(o =>
        o.id === orderId
          ? { ...o, status: o.status === ORDER_STATUS.TO_PRINT ? ORDER_STATUS.PRINTED : ORDER_STATUS.TO_PRINT }
          : o
      ) as typeof current
    );
  }

  /** Generate a burst of N demo orders with staggered timing */
  generateBulkOrders(count: number): void {
    for (let i = 0; i < count; i++) {
      setTimeout(() => this.generateOrder(), i * 300);
    }
  }

  // ──────────────────────────────────────────────
  //  USER HELPERS
  // ──────────────────────────────────────────────

  findUser(email: string): User | undefined {
    return DEMO_USERS.find(u => u.email === email);
  }

  findUserByToken(token: string): User | undefined {
    return DEMO_USERS.find(u => u.token === token);
  }

  getAllUsers(): User[] {
    return DEMO_USERS as User[];
  }
}
