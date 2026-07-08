
import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../../core/services/menu.service';
import { AuthService } from '../../core/auth/auth.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { MenuListSkeletonComponent } from '../../shared/components/skeletons/menu-list-skeleton.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-menu-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent, MenuListSkeletonComponent, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="sticky top-[63px] z-20 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 transition-all duration-300">
        <div class="relative w-full flex items-center justify-between md:justify-center">
            <nav class="flex-grow md:flex-grow-0 min-w-0 flex overflow-x-auto gap-6 px-4 py-2 items-center hide-scroll snap-x snap-proximity scrollbar-hide" style="-webkit-overflow-scrolling: touch; scroll-snap-type: x proximity;">
                <button (click)="searchQuery.set(''); scrollTo('top')" class="flex-shrink-0 group flex items-center gap-2 py-2 border-b-2 border-transparent hover:border-orange-500 transition-all text-gray-500 dark:text-gray-400 hover:text-orange-600 cursor-pointer whitespace-nowrap">
                    <span class="text-xl">🍽️</span><span class="text-sm font-medium">Todo</span>
                </button>
                @for (cat of menuService.categories(); track cat.id) {
                    <button (click)="scrollTo(cat.id)" class="flex-shrink-0 group flex items-center gap-2 py-2 border-b-2 border-transparent hover:border-orange-500 transition-all text-gray-500 dark:text-gray-400 hover:text-orange-600 cursor-pointer whitespace-nowrap">
                        <span class="text-xl">{{ cat.icon }}</span><span class="text-sm font-medium">{{ cat.name }}</span>
                    </button>
                }
            </nav>
            <div class="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2 flex-shrink-0"></div>
            <button (click)="toggleSearch()" class="flex-shrink-0 p-3 mr-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors" [class.text-orange-600]="isSearchOpen()">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </button>
        </div>

        @if (isSearchOpen()) {
            <div class="max-w-4xl mx-auto px-4 py-3 flex gap-3 items-center animate-slide-in border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <input type="text" [(ngModel)]="searchQuery" placeholder="Buscar platos..." class="flex-grow px-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm outline-none dark:text-white" autofocus>
                <select [(ngModel)]="sortOrder" class="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm px-3 py-2 outline-none cursor-pointer dark:text-white">
                    <option value="none">Orden</option>
                    <option value="asc">Precio: Menor</option>
                    <option value="desc">Precio: Mayor</option>
                </select>
            </div>
        }
    </div>

    <div class="max-w-4xl mx-auto p-4 w-full min-h-[80vh]">
        <div id="top"></div>

        @if (menuService.loading()) {
            <app-menu-skeleton></app-menu-skeleton>
        } @else {

        @if (!searchQuery()) {
            <div class="mb-8 bg-gradient-to-r from-orange-500 to-red-600 dark:from-orange-600 dark:to-red-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden animate-fade-in">
                <div class="relative z-10">
                    <h2 class="text-2xl font-bold mb-2">
                        {{ authService.currentUser() ? '¡Hola, ' + authService.currentUser()?.firstName + '!' : '¡Bienvenido!' }}
                    </h2>
                    <p class="opacity-90 text-sm">¿Qué te preparamos hoy?</p>
                </div>
            </div>

            @if (dishOfTheDayProducts().length > 0) {
                <section class="mb-12 animate-fade-in">
                    <div class="flex items-center gap-3 mb-6">
                        <span class="text-3xl animate-bounce-short">🔥</span>
                        <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Plato del Día</h2>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        @for (product of dishOfTheDayProducts(); track product.id) {
                            <app-product-card [product]="product" [priority]="true"></app-product-card>
                        } @empty {
                            <app-empty-state class="col-span-full" icon="🍽️" title="No hay plato del día disponible" [ghost]="true"></app-empty-state>
                        }
                    </div>
                </section>
            }
        }

        <div class="space-y-12 pb-24">
            @for (group of groupedMenu(); track group.id) {
                <section [id]="group.id" class="scroll-mt-48 animate-fade-in">
                    <div class="flex items-center gap-3 mb-6">
                        <span class="text-3xl">{{ group.icon }}</span>
                        <h2 class="text-2xl font-bold text-gray-800 dark:text-white">{{ group.name }}</h2>
                        <div class="h-px bg-gray-200 dark:bg-gray-700 flex-grow ml-4"></div>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        @for (product of group.products; track product.id; let i = $index) {
                            <app-product-card [product]="product" [priority]="i < 4"></app-product-card>
                        }
                    </div>
                </section>
            } @empty {
                <app-empty-state icon="🔍" title="No se encontraron productos" description="Intenta con otros filtros" actionLabel="Limpiar Filtros" (action)="searchQuery.set('')"></app-empty-state>
            }
        </div>
    }
    </div>
  `
})
export class MenuListComponent {
  menuService = inject(MenuService);
  authService = inject(AuthService);

  searchQuery = signal('');
  sortOrder = signal<'none' | 'asc' | 'desc'>('none');
  isSearchOpen = signal(false);

  dishOfTheDayProducts = computed(() => {
    return this.menuService.products().filter(p => p.isDishOfTheDay && !p.name.includes('__CONFIG'));
  });

  groupedMenu = computed(() => {
    let allProducts = this.menuService.products();
    allProducts = allProducts.filter(p => !p.name.includes('__CONFIG'));

    if (this.searchQuery()) {
        const q = this.searchQuery().toLowerCase();
        allProducts = allProducts.filter(p => p.name.toLowerCase().includes(q));
    }

    if (this.sortOrder() === 'asc') {
        allProducts = [...allProducts].sort((a, b) => a.price - b.price);
    } else if (this.sortOrder() === 'desc') {
        allProducts = [...allProducts].sort((a, b) => b.price - a.price);
    }
    
    return this.menuService.categories().map(cat => {
      const products = allProducts
        .filter(p => p.category === cat.id)
        // Sort logic for Dish of the day prioritization within categories if needed
        .sort((a, _b) => (this.sortOrder() === 'none' && a.isDishOfTheDay ? -1 : 0));

      return { ...cat, products };
    }).filter(group => group.products.length > 0); 
  });

  toggleSearch() {
    this.isSearchOpen.update(v => !v);
  }

  scrollTo(id: string) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
