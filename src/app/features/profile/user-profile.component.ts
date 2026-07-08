import { Component, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { ProfileFormComponent } from './profile-form.component';
import { ProfileOrdersComponent } from './profile-orders.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ProfileFormComponent, ProfileOrdersComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 pb-20 animate-fade-in">

      <!-- Header / Nav -->
      <div class="max-w-4xl mx-auto mb-8 flex items-center justify-between">
        <h2 class="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
          <span>👤</span> Mi Cuenta
        </h2>
        <button (click)="back.emit()"
          class="text-sm font-bold text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Volver al Menú
        </button>
      </div>

      <div class="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- LEFT COLUMN: User Card + Tabs -->
        <div class="lg:col-span-1 space-y-4">
          <div
            class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
            <div
              class="w-20 h-20 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
              {{ authService.currentUser()?.firstName?.charAt(0) || 'U' }}
            </div>
            <h3 class="font-bold text-lg text-gray-900 dark:text-white">{{ authService.userFullName() }}</h3>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">{{ authService.currentUser()?.email }}</p>

            <div class="flex flex-col gap-2">
              <button (click)="setTab('profile')"
                class="w-full py-2 px-4 rounded-xl font-bold text-sm transition-all text-left flex items-center gap-3"
                [class.bg-orange-600]="activeTab() === 'profile'" [class.text-white]="activeTab() === 'profile'"
                [class.bg-gray-50]="activeTab() !== 'profile'" [class.text-gray-600]="activeTab() !== 'profile'"
                [class.dark:bg-gray-700]="activeTab() !== 'profile'" [class.dark:text-gray-300]="activeTab() !== 'profile'">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Mis Datos
              </button>
              <button (click)="setTab('orders')"
                class="w-full py-2 px-4 rounded-xl font-bold text-sm transition-all text-left flex items-center gap-3"
                [class.bg-orange-600]="activeTab() === 'orders'" [class.text-white]="activeTab() === 'orders'"
                [class.bg-gray-50]="activeTab() !== 'orders'" [class.text-gray-600]="activeTab() !== 'orders'"
                [class.dark:bg-gray-700]="activeTab() !== 'orders'" [class.dark:text-gray-300]="activeTab() !== 'orders'">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>
                Mis Pedidos
              </button>
            </div>
          </div>
        </div>

        <!-- RIGHT COLUMN: Content -->
        <div class="lg:col-span-2">
          @if (activeTab() === 'profile') {
            <app-profile-form />
          }

          @if (activeTab() === 'orders') {
            <app-profile-orders />
          }
        </div>
      </div>
    </div>
  `
})
export class UserProfileComponent {
  back = output();
  protected authService = inject(AuthService);

  activeTab = signal<'profile' | 'orders'>('profile');

  setTab(tab: 'profile' | 'orders') {
    this.activeTab.set(tab);
  }
}
