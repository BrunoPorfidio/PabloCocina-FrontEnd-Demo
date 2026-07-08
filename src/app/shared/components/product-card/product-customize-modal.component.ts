import { Component, input, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, ProductAdditional, Garnish } from '../../../core/models/types';
import { CartService } from '../../../core/services/cart.service';
import { MenuService } from '../../../core/services/menu.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-product-customize-modal',
  standalone: true,
  imports: [CommonModule],
  host: { class: 'flex flex-col' },
  template: `
    <!-- 1. Garnishes Selection -->
    @if (product().garnishes && product().garnishes!.length > 0) {
      <div class="mb-4 pt-2 border-t border-gray-100 dark:border-gray-700">
        <label class="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-2">
          Elige tu guarnición:
        </label>
        <div class="grid grid-cols-2 gap-2">
          @for (g of product().garnishes; track g.id) {
            @if(g.active) {
              <label
                class="text-xs px-2 py-2 rounded-lg border transition-colors select-none flex items-center gap-1.5 w-full h-auto min-h-[36px] cursor-pointer"
                [class.bg-orange-100]="isGarnishSelected(g)"
                [class.dark:bg-orange-900]="isGarnishSelected(g)"
                [class.border-orange-500]="isGarnishSelected(g)"
                [class.text-orange-700]="isGarnishSelected(g)"
                [class.dark:text-orange-300]="isGarnishSelected(g)"
                [class.border-gray-200]="!isGarnishSelected(g)"
                [class.dark:border-gray-600]="!isGarnishSelected(g)"
                [class.text-gray-600]="!isGarnishSelected(g)"
                [class.dark:text-gray-300]="!isGarnishSelected(g)"
                [class.hover:border-orange-300]="!isGarnishSelected(g)"
              >
                <input type="checkbox" [checked]="isGarnishSelected(g)" (change)="toggleGarnish(g)" class="hidden">
                <span class="whitespace-normal text-center leading-tight break-words flex-1">{{ g.name }}</span>
                @if (isGarnishSelected(g)) {
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                }
              </label>
            }
          }
        </div>
      </div>
    }

    <!-- 2. Additionals -->
    @if (activeAdditionals().length > 0) {
      <div class="mb-4 pt-2 border-t border-gray-100 dark:border-gray-700">
        <label class="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
          Adicionales:
        </label>
        <div class="grid grid-cols-2 gap-2">
          @for (add of activeAdditionals(); track add.id) {
            <button
              (click)="toggleAdditional(add)"
              class="text-xs px-2 py-2 rounded-lg border transition-colors select-none flex items-center justify-center gap-1 w-full h-auto min-h-[36px]"
              [class.bg-orange-100]="isAdditionalSelected(add)"
              [class.dark:bg-orange-900]="isAdditionalSelected(add)"
              [class.border-orange-500]="isAdditionalSelected(add)"
              [class.text-orange-700]="isAdditionalSelected(add)"
              [class.dark:text-orange-300]="isAdditionalSelected(add)"
              [class.border-gray-200]="!isAdditionalSelected(add)"
              [class.dark:border-gray-600]="!isAdditionalSelected(add)"
              [class.text-gray-600]="!isAdditionalSelected(add)"
              [class.dark:text-gray-300]="!isAdditionalSelected(add)"
              [class.hover:border-orange-300]="!isAdditionalSelected(add)"
            >
              <span class="whitespace-normal text-center leading-tight break-words">{{ add.name }}</span>
              @if (add.price > 0) {
                <span class="opacity-75 font-semibold whitespace-nowrap ml-1">+\${{add.price}}</span>
              }
              @if (isAdditionalSelected(add)) {
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="flex-shrink-0 ml-1"><polyline points="20 6 9 17 4 12"/></svg>
              }
            </button>
          }
        </div>
      </div>
    }

  `
})
export class ProductCustomizeModalComponent {
  product = input.required<Product>();

  private cartService = inject(CartService);
  private menuService = inject(MenuService);
  private toastService = inject(ToastService);

  quantity = signal(1);
  selectedAdditionals = signal<ProductAdditional[]>([]);
  selectedGarnishes = signal<Garnish[]>([]);

  isBeverage = computed(() => {
    const catId = this.product().category;
    const category = this.menuService.categories().find(c => c.id === catId);
    const catName = category ? category.name.toLowerCase() : (this.product().categoryName?.toLowerCase() || '');
    return catName.includes('bebida') || catName.includes('gaseosa') || catName.includes('refresco');
  });

  activeAdditionals = computed(() => {
    return this.product().additionals?.filter(v => v.active !== false) || [];
  });

  currentPrice = computed(() => {
    const base = this.product().price;
    const addsTotal = this.selectedAdditionals().reduce((sum, v) => sum + v.price, 0);
    return base + addsTotal;
  });

  // --- Additionals Logic ---
  toggleAdditional(v: ProductAdditional) {
    this.selectedAdditionals.update(current => {
      const exists = current.find(item => item.id === v.id);
      if (exists) {
        return current.filter(item => item.id !== v.id);
      }
      return [...current, v];
    });
  }
  isAdditionalSelected(v: ProductAdditional): boolean {
    return this.selectedAdditionals().some(item => item.id === v.id);
  }

  // --- Garnishes Logic ---
  toggleGarnish(g: Garnish) {
    this.selectedGarnishes.update(current => {
      const exists = current.find(item => item.id === g.id);
      if (exists) return current.filter(item => item.id !== g.id);
      return [...current, g];
    });
  }
  isGarnishSelected(g: Garnish): boolean {
    return this.selectedGarnishes().some(item => item.id === g.id);
  }

  increment() {
    const stock = this.product().stock ?? 0;
    if (this.quantity() < stock) {
      this.quantity.update(q => q + 1);
    }
  }
  decrement() { this.quantity.update(q => Math.max(1, q - 1)); }

  add() {
    const stock = this.product().stock ?? 0;
    if (this.quantity() > stock) {
      this.toastService.error("No hay suficiente stock.");
      return;
    }

    if (this.isBeverage() && this.activeAdditionals().length > 0 && this.selectedAdditionals().length === 0) {
      this.toastService.warning("Por favor, selecciona una variante (sabor/tipo) para la bebida.");
      return;
    }

    this.cartService.addItem(
      this.product(),
      this.selectedAdditionals(),
      this.selectedGarnishes(),
      this.quantity()
    );
    this.quantity.set(1);
    this.selectedAdditionals.set([]);
    this.selectedGarnishes.set([]);

    this.toastService.success("Producto agregado al carrito");
  }
}
