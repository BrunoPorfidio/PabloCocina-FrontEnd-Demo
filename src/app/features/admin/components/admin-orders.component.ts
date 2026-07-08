
import { Component, inject, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../core/services/orders.service';
import { OrderFilters, OrderStatus } from '../../../core/models/types';
import { DemoService } from '../../../core/demo/demo.service';
import { AdminOrdersSkeletonComponent } from '../../../shared/components/skeletons/admin-orders-skeleton.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { OrderCardComponent } from '../../../shared/components/order-card/order-card.component';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, AdminOrdersSkeletonComponent, EmptyStateComponent, OrderCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6">
      <!-- Filters -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 flex flex-wrap gap-4 items-center justify-between sticky top-0 z-10">
        <div class="flex gap-4 items-center flex-wrap">
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Pedidos</h2>
            <select [(ngModel)]="filterStatus" (change)="applyFilters()" class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm outline-none focus:ring-2 focus:ring-orange-500">
                <option value="">Todos</option>
                <option value="TO_PRINT">Para Imprimir</option>
                <option value="PRINTED">Impresos</option>
            </select>
            <input type="date" [(ngModel)]="filterDate" (change)="applyFilters()" class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-sm outline-none focus:ring-2 focus:ring-orange-500">
        </div>
        <button (click)="refresh()" class="p-2 text-gray-500 hover:text-orange-600 transition-colors bg-gray-100 dark:bg-gray-700 rounded-lg" title="Actualizar">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/></svg>
        </button>
        <!-- Demo buttons -->
        <button (click)="generateDemoOrder()" [disabled]="isGenerating()" class="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold text-sm rounded-lg hover:from-orange-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-orange-500/25 flex items-center gap-2">
          @if (isGenerating()) {
            <svg class="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
            Simulando...
          } @else {
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
            Simular Pedido
          }
        </button>
        <button (click)="generateBurstOrders()" class="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-sm rounded-lg hover:from-purple-700 hover:to-pink-600 transition-all shadow-lg hover:shadow-purple-500/25 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          Ráfaga ⚡
        </button>
      </div>

      <!-- Orders Grid (Tickets) -->
      @if (orderService.loading() && orderService.orders().length === 0) {
        <app-admin-orders-skeleton></app-admin-orders-skeleton>
      } @else {
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        @for (order of orderService.orders(); track order.id) {
          <app-order-card [order]="order"></app-order-card>
        } @empty {
            <app-empty-state class="col-span-full" icon="📭" title="No hay pedidos para mostrar" description="Los pedidos nuevos aparecerán aquí automáticamente"></app-empty-state>
        }
      </div>

      <!-- Pagination -->
      <div class="flex justify-center gap-2 mt-6 pb-8">
        <button 
            [disabled]="orderService.paginationState().first"
            (click)="changePage(orderService.paginationState().page - 1)"
            class="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm">
            Anterior
        </button>
        <span class="px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 self-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            {{ orderService.paginationState().page + 1 }} / {{ orderService.paginationState().totalPages }}
        </span>
        <button 
            [disabled]="orderService.paginationState().last"
            (click)="changePage(orderService.paginationState().page + 1)"
            class="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm">
            Siguiente
        </button>
      </div>
      }
    </div>
  `
})
export class AdminOrdersComponent {
  orderService = inject(OrderService);
  private demoService = inject(DemoService);
  
  readonly isGenerating = signal(false);
  
  filterStatus = '';
  // Initialize with LOCAL today's date in Argentina Timezone
  filterDate = (() => {
      const now = new Date();
      const argDate = new Date(now.toLocaleString("en-US", {timeZone: "America/Argentina/Buenos_Aires"}));
      const year = argDate.getFullYear();
      const month = String(argDate.getMonth() + 1).padStart(2, '0');
      const day = String(argDate.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
  })();
  
  // Track newly arrived orders for entrance animation only
  // recentlyArrivedIds = signal<Set<string>>(new Set()); // REMOVED: Using _isNew flag
  private previousFirstOrderId: string | null = null; 

  constructor() {
    this.refresh();
    
    // Detect new orders arriving via WebSocket for SOUND
    effect(() => {
        const orders = this.orderService.orders();
        if (orders.length > 0) {
            const firstOrder = orders[0];
            
            // Check if it's a new order arrival
            if (this.previousFirstOrderId && firstOrder.id !== this.previousFirstOrderId) {
                // Check if it's truly new (created recently)
                const isRecent = (new Date().getTime() - new Date(firstOrder.createdAt).getTime()) < 60000; 
                
                // If it's recent AND marked as new (from WebSocket), play sound
                if (isRecent && firstOrder._isNew) {
                    this.playNotificationSound();
                }
            }
            this.previousFirstOrderId = firstOrder.id;
        }
    });
  }

  playNotificationSound() {
      try {
          type WindowWithWebkitAudio = Window & { webkitAudioContext: typeof window.AudioContext };
          const AudioContext = window.AudioContext || (window as unknown as WindowWithWebkitAudio).webkitAudioContext;
          if (!AudioContext) return;
          
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          // "Ding" sound
          osc.type = 'sine';
          osc.frequency.setValueAtTime(500, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(1000, ctx.currentTime + 0.1);
          
          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
          
          osc.start();
          osc.stop(ctx.currentTime + 0.5);
      } catch (e) {
          console.error('Error playing sound', e);
      }
  }

  refresh() {
    this.applyFilters();
  }

  generateDemoOrder() {
    this.isGenerating.set(true);
    this.demoService.generateOrder();
    this.playNotificationSound();
    // Reload orders list from interceptor (which now includes the new demo order)
    this.applyFilters();
    setTimeout(() => this.isGenerating.set(false), 1500);
  }

  generateBurstOrders() {
    this.demoService.generateBulkOrders(5);
    setTimeout(() => this.applyFilters(), 1600);
  }

  applyFilters() {
    const filters: OrderFilters = {};
    
    // Map "TO_PRINT" to include other initial statuses if the backend doesn't handle it strictly
    // Or just send what we have. Assuming backend handles 'TO_PRINT' or we might need to send multiple.
    // For now, let's trust the value, but if user selects "Para Imprimir", we might want to see PENDING too.
    // However, user asked for simple filters.
    if (this.filterStatus) filters.status = this.filterStatus as OrderStatus;
    
    // Always use the date filter if set (which is default now)
    if (this.filterDate) filters.dateSpecific = new Date(this.filterDate);
    
    this.orderService.getOrders(filters, 0, 10);
  }

  changePage(page: number) {
    const filters: OrderFilters = {};
    if (this.filterStatus) filters.status = this.filterStatus as OrderStatus;
    if (this.filterDate) filters.dateSpecific = new Date(this.filterDate);
    
    this.orderService.getOrders(filters, page, 10);
  }

}
