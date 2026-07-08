

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminProductsComponent } from './components/admin-products.component';
import { AdminCategoriesComponent } from './components/admin-categories.component';
import { AdminOrdersComponent } from './components/admin-orders.component';
import { AdminStaffComponent } from './components/admin-staff.component';
import { AdminScheduleComponent } from './components/admin-schedule.component';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    CommonModule, 
    AdminProductsComponent, 
    AdminCategoriesComponent, 
    AdminOrdersComponent,
    AdminStaffComponent,
    AdminScheduleComponent
  ], 
  template: `
    <div class="p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-80px)]">
      <div class="max-w-7xl mx-auto w-full">
      
        <!-- Tabs Navigation -->
        <div class="flex gap-6 mb-8 border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
          @for (tab of tabs; track tab.id) {
              <button 
                (click)="activeTab.set(tab.id)"
                class="pb-3 px-1 font-bold text-sm transition-all whitespace-nowrap outline-none"
                [class.text-orange-600]="activeTab() === tab.id"
                [class.border-b-2]="activeTab() === tab.id"
                [class.border-orange-600]="activeTab() === tab.id"
                [class.text-gray-400]="activeTab() !== tab.id"
              >
                {{ tab.label }}
              </button>
          }
        </div>

        <!-- Tab Content Swapper -->
        @switch (activeTab()) {
            @case ('products') {
                <app-admin-products></app-admin-products>
            }
            @case ('categories') {
                <app-admin-categories></app-admin-categories>
            }
            @case ('orders') {
                <app-admin-orders></app-admin-orders>
            }
            @case ('staff') {
                <app-admin-staff></app-admin-staff>
            }
            @case ('schedule') {
                <app-admin-schedule></app-admin-schedule>
            }
            @default {
                <div class="p-8 text-center text-gray-500">Seleccione una opción</div>
            }
        }
      </div>
    </div>
  `
})
export class AdminPanelComponent {
  activeTab = signal<string>('orders');

  tabs = [
      { id: 'products', label: 'Productos' },
      { id: 'categories', label: 'Categorías' },
      { id: 'orders', label: 'Pedidos' },
      { id: 'staff', label: 'Staff' },
      { id: 'schedule', label: 'Feriados' }
  ];
}
