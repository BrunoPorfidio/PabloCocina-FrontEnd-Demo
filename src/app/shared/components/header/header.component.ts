
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiService } from '../../../core/services/ui.service';
import { AuthService } from '../../../core/auth/auth.service';
import { CartService } from '../../../core/services/cart.service';

/**
 * Header Component
 * Handles navigation and user session actions.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  host: {
    class: 'sticky top-0 z-30 block w-full'
  },
  template: `
    <header class="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-100 dark:border-gray-800 transition-colors duration-300 h-16 box-border">
      <div class="max-w-4xl mx-auto px-4 py-2 flex justify-between items-center h-full">
        
        <div class="flex items-center gap-1.5 cursor-pointer" (click)="ui.setView('menu')" role="button" tabindex="0" (keydown.enter)="ui.setView('menu')" aria-label="Ir al menú principal">
          <div class="w-9 h-9 sm:w-10 sm:h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center border border-orange-200 dark:border-gray-700 overflow-hidden shrink-0">
            <img src="/src/assets/logo.png" alt="" class="w-full h-full object-cover" aria-hidden="true">
          </div>
          <div class="flex flex-col min-w-0">
            <h1 class="text-base sm:text-lg font-bold text-gray-900 dark:text-white leading-none tracking-tight truncate">Pablo<span class="text-orange-600">Cocina</span></h1>
            <span class="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-400 font-medium tracking-wider uppercase truncate">
              {{ getViewLabel() }}
            </span>
          </div>
        </div>
        
        <!-- Desktop Navigation (md+) -->
        <div class="hidden md:flex items-center gap-1.5">
          @if (auth.isLoggedIn()) {
            <div class="flex items-center gap-1.5 pl-2 border-l border-gray-200 dark:border-gray-700">
              <button (click)="ui.setView('profile')" class="text-right cursor-pointer group px-1.5 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors" aria-label="Ir a mi perfil">
                <p class="text-xs font-bold text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors flex items-center justify-end gap-1">
                    {{ auth.userFullName() }}
                </p>
                <p class="text-[9px] text-gray-500">{{ auth.isAdmin() ? 'Admin' : 'Cliente' }}</p>
              </button>
              <button (click)="logout()" class="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-red-500" aria-label="Cerrar sesión">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              </button>
            </div>
          } @else {
              <button (click)="ui.openAuthModal()" class="flex items-center gap-2 px-4 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full text-xs font-bold hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-orange-500" aria-label="Iniciar sesión o registrarse">
                  <span>Ingresar</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              </button>
          }

          @if (!auth.isAdmin()) {
            <button (click)="ui.openCart()" class="relative p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ml-1 focus-visible:outline-2 focus-visible:outline-orange-500" aria-label="Abrir carrito ({{ cart.totalItems() }} artículos)">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-700 dark:text-gray-200" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              @if (cart.totalItems() > 0) {
                <span class="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold h-4.5 w-4.5 min-w-[18px] min-h-[18px] flex items-center justify-center rounded-full border border-white dark:border-gray-900" aria-hidden="true">
                  {{ cart.totalItems() }}
                </span>
              }
            </button>
          }
        </div>

        <!-- Mobile Navigation (< md) -->
        <div class="flex md:hidden items-center gap-1">
            @if (!auth.isAdmin()) {
                <button (click)="ui.openCart()" class="relative p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus-visible:outline-2 focus-visible:outline-orange-500" aria-label="Abrir carrito ({{ cart.totalItems() }} artículos)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-700 dark:text-gray-200" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                  @if (cart.totalItems() > 0) {
                    <span class="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold h-4.5 w-4.5 min-w-[18px] min-h-[18px] flex items-center justify-center rounded-full border border-white dark:border-gray-900" aria-hidden="true">
                      {{ cart.totalItems() }}
                    </span>
                  }
                </button>
            }
            <button (click)="isMobileMenuOpen.set(!isMobileMenuOpen())" class="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-orange-500" [attr.aria-expanded]="isMobileMenuOpen()" aria-label="Menú de navegación">
              @if (!isMobileMenuOpen()) {
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              } @else {
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              }
            </button>
        </div>
      </div>

      @if (isMobileMenuOpen()) {
          <div role="dialog" aria-modal="true" aria-label="Menú de navegación" class="md:hidden fixed inset-0 top-16 z-20" (click)="isMobileMenuOpen.set(false)">
            <!-- Backdrop -->
            <div class="absolute inset-0 bg-black/20 dark:bg-black/40" aria-hidden="true"></div>
            <!-- Menu panel -->
            <div class="relative bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-xl px-4 py-4 flex flex-col gap-3" (click)="$event.stopPropagation()" role="menu">
              @if (auth.isLoggedIn()) {
                  <button (click)="ui.setView('profile'); isMobileMenuOpen.set(false)" class="flex items-center justify-between bg-gray-50 dark:bg-gray-800 p-3 rounded-xl w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" role="menuitem" aria-label="Ir a mi perfil">
                      <div class="flex items-center gap-3">
                          <div class="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full flex items-center justify-center font-bold shrink-0">
                              {{ auth.currentUser()?.firstName?.charAt(0) || '?' }}
                          </div>
                          <div class="min-w-0">
                              <p class="font-bold text-gray-900 dark:text-white truncate">{{ auth.userFullName() }}</p>
                              <p class="text-xs text-gray-500 truncate">{{ auth.currentUser()?.email }}</p>
                          </div>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400 shrink-0" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
              } @else {
                  <button (click)="ui.openAuthModal(); isMobileMenuOpen.set(false)" class="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform" role="menuitem" aria-label="Iniciar sesión o registrarse">
                      Ingresar
                  </button>
              }
              


              @if (auth.isLoggedIn()) {
                  <button (click)="logout(); isMobileMenuOpen.set(false)" class="w-full border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 py-3.5 rounded-xl font-bold hover:bg-red-50 dark:hover:bg-red-900/10 active:scale-[0.98] transition-colors" role="menuitem" aria-label="Cerrar sesión">
                      Cerrar Sesión
                  </button>
              }
            </div>
          </div>
      }
    </header>
  `
})
export class HeaderComponent {
  ui = inject(UiService);
  auth = inject(AuthService);
  cart = inject(CartService);
  
  isMobileMenuOpen = signal(false);

  getViewLabel() {
    const view = this.ui.currentView();
    if (view === 'profile') return 'Mi Perfil';
    if (this.auth.isAdmin() && view === 'admin') return 'Gestión';
    return 'Menú Completo';
  }

  logout() {
    this.auth.logout();
    this.ui.setView('menu');
  }
}
