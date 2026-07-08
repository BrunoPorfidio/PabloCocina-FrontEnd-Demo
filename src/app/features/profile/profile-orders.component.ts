import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { OrderService } from '../../core/services/orders.service';
import { OrderResponse } from '../../core/models/types';

@Component({
  selector: 'app-profile-orders',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe],
  template: `
    <div class="space-y-6 animate-fade-in">
      <!-- Filter -->
      <div
        class="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-wrap items-end gap-4">
        <div class="flex-grow">
          <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Filtrar por Fecha</label>
          <input type="text" placeholder="dd/mm/aaaa"
            onfocus="(this.type='date')" onblur="if(!this.value)this.type='text'"
            [formControl]="filterDateControl"
            class="w-full px-3 py-2 rounded-lg border bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white outline-none focus:ring-2 focus:ring-orange-500">
        </div>
        <button (click)="loadOrders()"
          class="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-6 py-2.5 rounded-lg font-bold hover:opacity-90 transition-opacity">
          Buscar
        </button>
        <button (click)="clearFilter()"
          class="text-gray-500 hover:text-orange-600 text-sm font-bold underline">
          Ver Todas
        </button>
      </div>

      <!-- List -->
      @if (orderService.orders().length === 0) {
        <div class="text-center py-12 text-gray-400">
          <p class="text-4xl mb-2">📜</p>
          <p>No se encontraron pedidos.</p>
        </div>
      } @else {
        @for (order of orderService.orders(); track order.id) {
          <div
            class="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div
              class="flex justify-between items-start mb-4 border-b border-gray-100 dark:border-gray-700 pb-3">
              <div>
                <h3 class="text-xl font-black text-gray-900 dark:text-white">#{{ order.number }}</h3>
                <p class="text-xs text-gray-500">{{ order.createdAt | date:'dd MMM yyyy, HH:mm' }}</p>
              </div>
              <div class="text-right">
                <span class="block text-lg font-bold text-green-600">$ {{ order.total }}</span>
                <span
                  class="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                  {{ order.status || 'Confirmado' }}
                </span>
              </div>
            </div>

            <div class="space-y-2 mb-4">
              @for (item of order.items; track $index) {
                <div class="flex justify-between items-start text-sm">
                  <div class="text-gray-700 dark:text-gray-300">
                    <span class="font-bold">{{ item.quantity }}x</span> {{ item.productName }}
                    @if (item.garnishes && item.garnishes.length > 0) {
                      <div class="text-xs text-gray-400 pl-4 italic">
                        @for (g of item.garnishes; track g.name) { • {{ g.name }} }
                      </div>
                    }
                  </div>
                  <span class="text-gray-500 font-medium">$ {{ item.subtotal }}</span>
                </div>
              }
            </div>

            <div class="flex justify-end pt-2">
              <button (click)="viewTicket(order)"
                class="text-orange-600 hover:text-orange-700 text-sm font-bold flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                Ver Ticket
              </button>
            </div>
          </div>
        }

        <!-- Pagination Simple -->
        @if (orderService.paginationState().totalPages > 1) {
          <div class="flex justify-center gap-4 mt-6">
            <button (click)="changePage(-1)" [disabled]="orderService.paginationState().first"
              class="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm disabled:opacity-50">Anterior</button>
            <span
              class="self-center font-bold text-gray-600 dark:text-gray-400">Pág {{ orderService.paginationState().page + 1 }}</span>
            <button (click)="changePage(1)" [disabled]="orderService.paginationState().last"
              class="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm disabled:opacity-50">Siguiente</button>
          </div>
        }
      }
    </div>
  `
})
export class ProfileOrdersComponent {
  private authService = inject(AuthService);
  protected orderService = inject(OrderService);

  filterDateControl = new FormControl('');

  loadOrders(page: number = 0) {
    const userId = this.authService.currentUser()?.id;
    if (!userId) return;

    const dateVal = this.filterDateControl.value;
    const dateSpecific = dateVal ? new Date(dateVal) : undefined;

    this.orderService.loadUserOrders(userId, page, 20, dateSpecific);
  }

  clearFilter() {
    this.filterDateControl.setValue('');
    this.loadOrders();
  }

  changePage(delta: number) {
    const current = this.orderService.paginationState();
    this.loadOrders(current.page + delta);
  }

  viewTicket(order: OrderResponse) {
    this.orderService.setPrintingOrder(order);
    setTimeout(() => window.print(), 100);
  }
}
