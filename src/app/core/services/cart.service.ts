
import { Injectable, inject, computed, signal, effect } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CartItem, OrderRequest, Product, ProductAdditional, OrderResponse, Garnish } from '../models/types';
import { OrderService } from './orders.service';
import { MenuService } from './menu.service';

interface CartStorage {
  date: string;
  items: CartItem[];
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_KEY_CART = 'pablo_cocina_cart_v3';
  private orderService = inject(OrderService);
  private menuService = inject(MenuService);

  // Pure signals — no BehaviorSubject
  private readonly _cartItems = signal<CartItem[]>([]);
  readonly cartItems = this._cartItems.asReadonly();

  readonly totalItems = computed(() => 
    this.cartItems().reduce((acc, item) => acc + item.quantity, 0)
  );

  readonly totalPrice = computed(() => 
    this.cartItems().reduce((acc, item) => acc + item.subtotal, 0)
  );

  constructor() {
    // Load from storage on init
    const saved = this.loadFromStorage();
    if (saved.length > 0) {
      this._cartItems.set(saved);
    }

    // Auto-save to storage on changes
    effect(() => {
      this.saveToStorage(this._cartItems());
    });

    // Listen to product updates to invalidate cart items
    effect(() => {
      const products = this.menuService.products();
      // Just trigger re-evaluation — validation happens on checkout
      if (products.length > 0 && this._cartItems().length > 0) {
        this.validateCartItems(products);
      }
    });
  }

  /**
   * Signal loop guard: prevents infinite re-triggers when signals derive from each other.
   * Uses Set-based comparison by productId instead of fragile internalId deep equality.
   */
  private validateCartItems(products: Product[]) {
    const currentItems = this._cartItems();
    const filtered = currentItems.filter(item => products.some(p => p.id === item.productId));
    // Guard: only update if productId structure actually changed
    const currentIds = new Set(currentItems.map(i => i.productId));
    const filteredIds = new Set(filtered.map(i => i.productId));
    if (currentItems.length === filtered.length && 
        currentIds.size === filteredIds.size && 
        [...currentIds].every(id => filteredIds.has(id))) {
      return; // No structural change — skip update to prevent signal loop
    }
    this._cartItems.set(filtered);
  }

  addItem(product: Product, selectedAdditionals: ProductAdditional[], selectedGarnishes: Garnish[], quantity: number = 1) {
    this._cartItems.update(items => {
      const existingItemIndex = items.findIndex(
        i => i.productId === product.id
      );

      if (existingItemIndex !== -1) {
        return items.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + quantity, subtotal: (item.quantity + quantity) * item.price }
            : item
        );
      }

      const subtotal = product.price * quantity;
      return [...items, {
        internalId: crypto.randomUUID(),
        productId: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.price,
        quantity,
        selectedAdditionals,
        selectedGarnishes,
        subtotal
      }];
    });
  }

  removeItem(internalId: string) {
    this._cartItems.update(items => items.filter(item => item.internalId !== internalId));
  }

  updateQuantity(internalId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(internalId);
      return;
    }
    this._cartItems.update(items =>
      items.map(item =>
        item.internalId === internalId
          ? { ...item, quantity, subtotal: item.price * quantity }
          : item
      )
    );
  }

  clearCart() {
    this._cartItems.set([]);
  }

  getCartForCheckout(): OrderRequest {
    const items = this.cartItems().map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      additionalIds: item.selectedAdditionals.map(a => a.id),
      garnishIds: item.selectedGarnishes.map(g => g.id)
    }));
    return { items };
  }

  placeOrder(): Promise<OrderResponse> {
    const payload = this.getCartForCheckout();
    return new Promise((resolve, reject) => {
      this.orderService.createOrder(payload).subscribe({
        next: (order) => {
          this.clearCart();
          resolve(order);
        },
        error: (err) => reject(err)
      });
    });
  }

  /**
   * Checkout with customer details — returns Observable for component compatibility.
   */
  checkout(details: { customerName?: string; phone?: string; deliveryType?: string; address?: string; paymentMethod?: string; notes?: string }): Observable<OrderResponse> {
    const payload: OrderRequest = {
      ...this.getCartForCheckout(),
      customerName: details.customerName,
      phone: details.phone,
      deliveryAddress: details.deliveryType === 'delivery' ? details.address : undefined,
      paymentMethod: details.paymentMethod as 'cash' | 'transfer' | undefined,
      notes: details.notes
    };
    return this.orderService.createOrder(payload).pipe(
      tap(() => this.clearCart())
    );
  }

  private loadFromStorage(): CartItem[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY_CART);
      if (!stored) return [];
      const parsed: CartStorage = JSON.parse(stored);
      return parsed.items || [];
    } catch {
      return [];
    }
  }

  private saveToStorage(items: CartItem[]) {
    try {
      const data: CartStorage = { date: new Date().toISOString(), items };
      localStorage.setItem(this.STORAGE_KEY_CART, JSON.stringify(data));
    } catch {
      // Silently fail — storage full or unavailable
    }
  }
}
