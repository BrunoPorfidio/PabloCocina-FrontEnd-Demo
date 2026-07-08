
import { Component, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/auth/auth.service';
import { ScheduleService } from '../../core/services/schedule.service';
import { CartCheckoutFormComponent } from './cart-checkout-form.component';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, CartCheckoutFormComponent],
  template: `
    <div class="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60 transition-opacity" (click)="close.emit()"></div>
      
      <!-- Panel (full width on mobile, 28rem on sm+) -->
      <div class="relative w-full sm:max-w-md h-full bg-white dark:bg-gray-900 shadow-2xl flex flex-col animate-slide-in">
        
        <!-- Header -->
        <div class="p-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-gray-850">
          <h2 class="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            Tu Pedido
          </h2>
          <button (click)="close.emit()" class="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500 dark:text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        @if (isSuccess()) {
          <div class="flex-grow flex flex-col items-center justify-center p-8 text-center animate-fade-in">
            <div class="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-green-600 dark:text-green-400"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">¡Pedido Confirmado!</h3>
            <p class="text-gray-600 dark:text-gray-300 mb-8">Tu número de orden es <span class="font-bold text-xl">#{{ createdOrderNumber() }}</span>.</p>
            <button (click)="close.emit()" class="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-xl font-bold">Cerrar</button>
          </div>
        } @else {
          <!-- Scrollable Content -->
          <div class="flex-grow overflow-y-auto p-4 space-y-6 relative">
            
            <!-- OVERLAY MODAL FOR TIME LIMIT -->
            @if (showTimeLimitModal()) {
               <div class="absolute inset-0 z-20 bg-white/95 dark:bg-gray-900/95 flex flex-col items-center justify-center text-center p-6 animate-fade-in">
                  <div class="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4 text-red-600 dark:text-red-500 text-4xl">
                     ⏰
                  </div>
                  <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-2">Cocina Cerrada</h3>
                  <p class="text-gray-600 dark:text-gray-300 mb-6">
                      Ya son más de las 11:00 AM. <br>
                      Los pedidos han finalizado por hoy.
                  </p>
                  <button (click)="close.emit()" class="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-xl font-bold w-full max-w-xs shadow-lg">
                      Entendido
                  </button>
               </div>
            }

            <!-- STOCK ERROR MODAL -->
            @if (stockErrors().length > 0) {
               <div class="absolute inset-0 z-30 bg-white/95 dark:bg-gray-900/95 flex flex-col items-center justify-center text-center p-6 animate-fade-in">
                  <div class="w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mb-4 text-orange-600 dark:text-orange-500 text-4xl">
                     ⚠️
                  </div>
                  <h3 class="text-2xl font-black text-gray-900 dark:text-white mb-2">Stock Insuficiente</h3>
                  <div class="text-gray-600 dark:text-gray-300 mb-6 space-y-2 w-full max-w-sm">
                      <p>Lo sentimos, hubo cambios en el stock:</p>
                      <ul class="text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 p-4 rounded-xl text-left list-disc pl-8 space-y-1 border border-red-100 dark:border-red-900/30">
                          @for (msg of stockErrors(); track msg) {
                              <li>{{ msg }}</li>
                          }
                      </ul>
                      <p class="text-sm mt-4 font-medium">Por favor, revisa tu pedido o elige otro platillo disponible del menú.</p>
                  </div>
                  <button (click)="stockErrors.set([])" class="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-3 rounded-xl font-bold w-full max-w-xs shadow-lg hover:scale-105 transition-transform">
                      Entendido
                  </button>
               </div>
            }

            <!-- Empty State -->
            @if (cart.cartItems().length === 0) {
              <div class="flex flex-col items-center justify-center h-64 text-center">
                <div class="w-16 h-16 bg-orange-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                </div>
                <p class="text-gray-500 dark:text-gray-400 font-medium">Tu carrito está vacío</p>
                <button (click)="close.emit()" class="mt-4 text-orange-600 dark:text-orange-400 font-bold text-sm hover:underline">Volver al menú</button>
              </div>
            } @else {
              <!-- Items List -->
              <ul class="space-y-4">
                @for (item of cart.cartItems(); track item.internalId) {
                  <li class="flex gap-3 items-start bg-gray-50 dark:bg-gray-850 p-3 rounded-xl">
                    <div class="flex-1">
                      <div class="flex justify-between items-start">
                        <!-- Snapshot Usage: item.name instead of item.product.name -->
                        <h4 class="font-bold text-gray-800 dark:text-white text-sm sm:text-base">{{ item.name }}</h4>
                        <p class="font-semibold text-gray-900 dark:text-white">$ {{ item.subtotal }}</p>
                      </div>
                      
                      <!-- Selected Variants -->
                      @if (item.selectedAdditionals && item.selectedAdditionals.length > 0) {
                        <div class="flex flex-wrap gap-1 mt-1">
                          @for (v of item.selectedAdditionals; track v.name) {
                            <span class="text-[10px] bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 px-1.5 py-0.5 rounded">
                              + {{ v.name }}
                            </span>
                          }
                        </div>
                      }

                      <!-- Selected Garnishes -->
                      @if (item.selectedGarnishes && item.selectedGarnishes.length > 0) {
                          <div class="text-[11px] text-gray-500 dark:text-gray-400 italic mt-1">
                              @for (g of item.selectedGarnishes; track g.id) {
                                  • {{ g.name }} <br>
                              }
                          </div>
                      }
                      
                      <div class="flex items-center gap-3 mt-3">
                        <div class="flex items-center border border-gray-200 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800">
                          <button (click)="cart.updateQuantity(item.internalId, -1)" 
                            class="px-2 py-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            [class.opacity-50]="item.quantity === 1"
                            (click)="item.quantity === 1 ? cart.removeItem(item.internalId) : null"
                          >−</button>
                          <span class="px-2 text-sm font-semibold text-gray-800 dark:text-gray-200">{{ item.quantity }}</span>
                          <button (click)="cart.updateQuantity(item.internalId, 1)" class="px-2 py-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">+</button>
                        </div>
                        <button (click)="cart.removeItem(item.internalId)" class="text-xs text-red-500 hover:text-red-600 dark:hover:text-red-400 hover:underline ml-auto">Eliminar</button>
                      </div>
                    </div>
                  </li>
                }
              </ul>

              <app-cart-checkout-form
                [totalPrice]="cart.totalPrice()"
                [isLoggedIn]="authService.isLoggedIn()"
                [isProcessing]="isProcessing()"
                (submitForm)="submitOrder($event)"
                (requireAuth)="requireAuth.emit()"
                (close)="close.emit()"
              />
            }
          </div>
        }
      </div>
    </div>
  `

})
export class CartDrawerComponent {
  close = output();
  requireAuth = output(); 
  
  cart = inject(CartService);
  authService = inject(AuthService); 
  scheduleService = inject(ScheduleService);
  
  isSuccess = signal(false);
  isProcessing = signal(false);
  createdOrderNumber = signal(0);
  
  // New state for showing custom alert
  showTimeLimitModal = signal(false);
  stockErrors = signal<string[]>([]);

  submitOrder(details: any) {
    if (!this.authService.isLoggedIn()) {
        this.requireAuth.emit();
        return;
    }

    // CHECK HOLIDAY
    if (this.scheduleService.isTodayHoliday()) {
        alert("El día de hoy no se tomarán pedidos. ¡Los esperamos la próxima!");
        return;
    }

    // CHECK 11 AM TIME LIMIT (USE IN-APP MODAL)
    // if (!this.scheduleService.isKitchenOpen()) {
    //     this.showTimeLimitModal.set(true);
    //     return;
    // }

    this.isProcessing.set(true);

    // Use CartService checkout
    this.cart.checkout(details).subscribe({
        next: (order) => {
            this.createdOrderNumber.set(order.number || 0);
            this.isSuccess.set(true);
            this.isProcessing.set(false);
        },
        error: (err) => {
            if (err.details && Array.isArray(err.details)) {
                this.stockErrors.set(err.details);
            } else {
                alert('Hubo un error al procesar tu pedido. Intenta nuevamente.');
            }
            this.isProcessing.set(false);
        }
    });
  }
}
