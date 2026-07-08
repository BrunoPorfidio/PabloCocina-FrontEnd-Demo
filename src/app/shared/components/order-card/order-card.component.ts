import { Component, input, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { OrderResponse, ORDER_STATUS } from '../../../core/models/types';
import { OrderService } from '../../../core/services/orders.service';

@Component({
  selector: 'app-order-card',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    <div class="rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 transition-all hover:shadow-md flex flex-col h-full relative"
         [class.animate-pop-in]="order()._isNew"
         [class.new-order-highlight]="order().status !== orderStatus.PRINTED && order().status !== orderStatus.DELIVERED && order().status !== orderStatus.CANCELLED"
         [class.bg-white]="order().status !== orderStatus.PRINTED"
         [class.dark:bg-gray-800]="order().status !== orderStatus.PRINTED"
         [class.bg-gray-100]="order().status === orderStatus.PRINTED"
         [class.dark:bg-gray-900]="order().status === orderStatus.PRINTED"
         [class.opacity-90]="order().status === orderStatus.PRINTED">
      
      <!-- Status Stripe -->
      <div class="h-1 w-full rounded-t-xl" 
          [class.bg-blue-500]="order().status === orderStatus.TO_PRINT || order().status === orderStatus.CONFIRMED || order().status === orderStatus.PENDING"
          [class.bg-purple-500]="order().status === orderStatus.PRINTED"
          [class.bg-green-500]="order().status === orderStatus.DELIVERED"
          [class.bg-red-500]="order().status === orderStatus.CANCELLED">
      </div>

      <div class="p-4 flex flex-col flex-grow">
        <!-- Header -->
        <div class="flex justify-between items-start mb-3 border-b border-gray-200 dark:border-gray-700 pb-3">
          <div>
            <span class="text-2xl font-black text-gray-900 dark:text-white block tracking-tight">#{{ order().number }}</span>
            <span class="text-[10px] font-bold uppercase tracking-wider text-gray-500">{{ order().createdAt | date:'HH:mm' }} hs</span>
          </div>
          <div class="text-right">
              <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border" 
                  [class.bg-blue-50]="order().status === orderStatus.TO_PRINT || order().status === orderStatus.CONFIRMED || order().status === orderStatus.PENDING" 
                  [class.text-blue-700]="order().status === orderStatus.TO_PRINT || order().status === orderStatus.CONFIRMED || order().status === orderStatus.PENDING" 
                  [class.border-blue-200]="order().status === orderStatus.TO_PRINT || order().status === orderStatus.CONFIRMED || order().status === orderStatus.PENDING"
                  [class.bg-purple-50]="order().status === orderStatus.PRINTED" [class.text-purple-700]="order().status === orderStatus.PRINTED" [class.border-purple-200]="order().status === orderStatus.PRINTED"
                  [class.bg-green-50]="order().status === orderStatus.DELIVERED" [class.text-green-700]="order().status === orderStatus.DELIVERED" [class.border-green-200]="order().status === orderStatus.DELIVERED"
                  [class.bg-red-50]="order().status === orderStatus.CANCELLED" [class.text-red-700]="order().status === orderStatus.CANCELLED" [class.border-red-200]="order().status === orderStatus.CANCELLED">
                  {{ order().status === orderStatus.TO_PRINT ? 'NUEVO' : (order().status || orderStatus.PENDING) }}
              </span>
          </div>
        </div>

        <!-- Customer Info -->
        <div class="mb-3 p-2 rounded-lg" [class.bg-gray-50]="order().status !== orderStatus.PRINTED" [class.dark:bg-gray-700/30]="order().status !== orderStatus.PRINTED" [class.bg-white]="order().status === orderStatus.PRINTED" [class.dark:bg-gray-800]="order().status === orderStatus.PRINTED">
            <p class="font-bold text-gray-900 dark:text-white text-sm truncate" title="{{ order().details?.customerName }}">
              👤 {{ order().details?.customerName || 'Cliente' }}
            </p>
            <div class="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>{{ order().details?.deliveryType === 'delivery' ? '🛵' : '👜' }}</span>
              <span class="truncate">{{ order().details?.deliveryType === 'delivery' ? 'Delivery' : 'Retiro' }}</span>
            </div>
            @if (order().details?.notes) {
              <div class="mt-2 text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 p-1.5 rounded border border-orange-100 dark:border-orange-800/30 italic">
                  "{{ order().details?.notes }}"
              </div>
            }
        </div>

        <!-- Items List -->
        <div class="space-y-2 mb-4 flex-grow overflow-y-auto max-h-[150px] pr-1 custom-scrollbar">
          @for (item of order().items; track $index) {
              <div class="text-sm border-b border-gray-100 dark:border-gray-700/50 last:border-0 pb-1 last:pb-0">
                  <div class="flex justify-between items-start">
                      <div class="flex gap-2">
                          <span class="font-bold text-gray-900 dark:text-white min-w-[20px]">{{ item.quantity }}x</span>
                          <span class="text-gray-700 dark:text-gray-300 leading-tight">{{ item.productName }}</span>
                      </div>
                  </div>
                  
                  @if ((item.additionals && item.additionals.length > 0) || (item.garnishes && item.garnishes.length > 0)) {
                      <div class="pl-7 text-[11px] text-gray-500 dark:text-gray-400 space-y-0.5 mt-0.5">
                          @for (add of item.additionals; track add.name) {
                              <div class="flex items-center gap-1">
                                  <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
                                  <span>{{ add.name }}</span>
                              </div>
                          }
                          @for (g of item.garnishes; track g.name) {
                              <div class="flex items-center gap-1 text-orange-600/80 dark:text-orange-400/80">
                                  <span class="w-1 h-1 bg-orange-300 rounded-full"></span>
                                  <span>{{ g.name }}</span>
                              </div>
                          }
                      </div>
                  }
              </div>
          }
        </div>

        <!-- Footer Actions -->
        <div class="mt-auto pt-3 border-t border-gray-200 dark:border-gray-700">
          <div class="flex justify-between items-center mb-3">
              <span class="text-xs text-gray-500 uppercase font-bold">Total</span>
              <span class="text-lg font-black text-gray-900 dark:text-white">$ {{ order().total }}</span>
          </div>
          
          <div class="grid grid-cols-1 gap-2">
              <button (click)="printOrder(order())" 
                  class="w-full py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                  [class.bg-gray-900]="order().status !== orderStatus.PRINTED"
                  [class.dark:bg-white]="order().status !== orderStatus.PRINTED"
                  [class.text-white]="order().status !== orderStatus.PRINTED"
                  [class.dark:text-gray-900]="order().status !== orderStatus.PRINTED"
                  [class.hover:opacity-90]="order().status !== orderStatus.PRINTED"
                  
                  [class.bg-gray-200]="order().status === orderStatus.PRINTED"
                  [class.dark:bg-gray-700]="order().status === orderStatus.PRINTED"
                  [class.text-gray-700]="order().status === orderStatus.PRINTED"
                  [class.dark:text-gray-300]="order().status === orderStatus.PRINTED"
                  [class.hover:bg-gray-300]="order().status === orderStatus.PRINTED"
                  [class.dark:hover:bg-gray-600]="order().status === orderStatus.PRINTED">
                  
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                  {{ order().status === orderStatus.PRINTED ? 'Volver a imprimir ticket' : 'Imprimir Ticket' }}
              </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class OrderCardComponent {
  order = input.required<OrderResponse>();
  readonly = input(false);
  readonly orderStatus = ORDER_STATUS;

  private orderService = inject(OrderService);

  printOrder(order: OrderResponse) {
    this.orderService.updateOrderLocally(order.id, { status: this.orderStatus.PRINTED });
    this.orderService.setPrintingOrder(order);
    this.orderService.updateOrderStatus(order.id, this.orderStatus.PRINTED).subscribe(() => {
      setTimeout(() => {
        window.print();
        this.orderService.setPrintingOrder(null);
      }, 100);
    });
  }
}
