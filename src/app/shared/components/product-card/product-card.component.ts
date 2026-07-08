
import { Component, input, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Product } from '../../../core/models/types';
import { ProductCustomizeModalComponent } from './product-customize-modal.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, ProductCustomizeModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Wrapper div handles the fire border positioning relative to the card -->
    <div class="relative h-full rounded-xl transition-shadow duration-300 group"
         [class.hover:shadow-md]="!product().isDishOfTheDay"
         [class.fire-wrapper]="product().isDishOfTheDay && isAvailable()"
         [class.opacity-75]="!isAvailable()">
      
      <!-- MAIN CARD CONTENT -->
      <div 
        class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden flex flex-col h-[35rem] relative z-10"
        [class.border-gray-100]="!product().isDishOfTheDay"
        [class.dark:border-gray-700]="!product().isDishOfTheDay"
        [class.border]="!product().isDishOfTheDay"
        [class.shadow-sm]="!product().isDishOfTheDay"
      >
        
        <!-- Dish of the Day Badge -->
        @if (product().isDishOfTheDay && isAvailable()) {
          <div class="absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 text-white text-xs font-bold uppercase tracking-wider text-center py-1.5 shadow-lg flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" class="animate-pulse"><path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a5.5 5.5 0 11-11 0c0-3.042 3.235-5.236 5-8.192-.63.75-1.5 2.035-1.5 3.192 0 .636.5 1.5 1 2.5z"/></svg>
            Plato del Día
          </div>
        }

        <!-- Image Section (tamaño uniforme) -->
        <div class="relative w-full h-48 flex-shrink-0 overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-t-xl group-hover:opacity-95 transition-opacity">
          <!-- Out of Stock Overlay -->
          @if (!isAvailable()) {
            <div class="absolute inset-0 z-20 flex items-center justify-center bg-black/70">
              <span class="bg-gray-800 text-white px-4 py-2 rounded-lg font-bold uppercase tracking-widest shadow-lg transform -rotate-6 border-2 border-white/20">
                AGOTADO
              </span>
            </div>
          }

          <img 
            [ngSrc]="product().imageUrl" 
            [priority]="priority() || product().isDishOfTheDay"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            class="object-cover transform transition-transform duration-500"
            [class.group-hover:scale-105]="isAvailable()"
            [class.grayscale]="!isAvailable()"
            alt="{{product().name}}">
            
          <div class="absolute top-2 right-2 bg-white/95 dark:bg-gray-900/95 px-3 py-1.5 rounded-lg text-sm font-bold text-gray-800 dark:text-white shadow-sm z-10" [class.mt-8]="product().isDishOfTheDay && isAvailable()">
            $ {{ product().price }}
          </div>
        </div>
        
        <!-- Scrollable Content Area (solo contenido — sin botones) -->
        <div class="flex-grow overflow-y-auto min-h-0 card-content">
          <div class="px-4 pt-4 flex flex-col">
            <h3 class="font-bold text-lg text-gray-800 dark:text-gray-100 leading-tight mb-1 flex items-start justify-between gap-2">
              {{ product().name }}
            </h3>
            
            <!-- Stock Indicator -->
            <div class="mb-2 h-5">
               @if (isAvailable()) {
                  @if ((product().stock ?? 0) < 5) {
                      <div class="inline-flex items-center gap-1.5">
                          <span class="relative flex h-2 w-2">
                            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span class="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                          </span>
                          <span class="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-tight animate-pulse">¡Quedan {{ product().stock ?? 0 }}!</span>
                      </div>
                  } @else {
                      <div class="inline-flex items-center gap-1.5 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full border border-green-100 dark:border-green-800">
                          <span class="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                          <span class="text-[10px] font-bold text-green-700 dark:text-green-300">Stock: {{ product().stock ?? 0 }}</span>
                      </div>
                  }
               }
            </div>

            <!-- Description with Read More logic -->
            <div class="relative mb-4">
               <p class="text-sm text-gray-500 dark:text-gray-400"
                  [class.line-clamp-2]="!isExpanded() && hasLongDescription()"
               >
                  {{ product().description }}
               </p>
               
               @if (hasLongDescription()) {
                 <button 
                   (click)="toggleExpanded()" 
                   class="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline mt-1 focus:outline-none"
                 >
                   {{ isExpanded() ? 'Ver menos' : 'Ver más' }}
                 </button>
               }
            </div>

            <app-product-customize-modal #customize [product]="product()" />
          </div>
        </div>

        <!-- ALWAYS VISIBLE: Actions Footer (fuera del scroll) -->
        <div class="flex-shrink-0 border-t border-gray-100 dark:border-gray-700 px-4 py-3 flex items-center justify-between bg-white dark:bg-gray-800">
          <!-- Quantity Stepper -->
          <div class="flex items-center bg-gray-50 dark:bg-gray-700 rounded-lg p-1">
            <button (click)="customize.decrement()" class="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-300 hover:text-orange-600 font-bold transition-colors" [disabled]="customize.quantity() <= 1">-</button>
            <span class="w-8 text-center text-sm font-bold text-gray-800 dark:text-white">{{ customize.quantity() }}</span>
            <button (click)="customize.increment()"
              class="w-8 h-8 flex items-center justify-center text-gray-500 dark:text-gray-300 hover:text-orange-600 font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              [disabled]="customize.quantity() >= (product().stock ?? 0)"
            >+</button>
          </div>

          <!-- Add Button -->
          <button
            (click)="customize.add()"
            class="text-white dark:text-white px-4 py-2 rounded-lg text-sm font-medium shadow transition-colors flex items-center gap-2 active:transform active:scale-95"
            [class.bg-gradient-to-r]="product().isDishOfTheDay"
            [class.from-orange-600]="product().isDishOfTheDay"
            [class.to-red-600]="product().isDishOfTheDay"
            [class.hover:from-orange-500]="product().isDishOfTheDay"
            [class.hover:to-red-500]="product().isDishOfTheDay"
            [class.bg-gray-900]="!product().isDishOfTheDay"
            [class.dark:bg-orange-600]="!product().isDishOfTheDay"
            [class.hover:bg-gray-800]="!product().isDishOfTheDay"
            [class.dark:hover:bg-orange-500]="!product().isDishOfTheDay"
          >
            <span>Agregar</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Subtle scrollbar for card content */
    .card-content::-webkit-scrollbar { width: 4px; }
    .card-content::-webkit-scrollbar-track { background: transparent; }
    .card-content::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 99px; }
    .dark .card-content::-webkit-scrollbar-thumb { background: #4b5563; }

    .fire-wrapper { margin: 4px; position: relative; }
    .fire-wrapper::before {
      content: ""; position: absolute; inset: -4px; z-index: 0;
      background: linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #ff0000, #ff7300, #fffb00);
      background-size: 400% 400%; border-radius: 1rem; animation: fire-border 3s ease infinite;
    }
    .fire-wrapper::after {
      content: ""; position: absolute; inset: -4px; z-index: -1;
      background: linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #ff0000);
      background-size: 400% 400%; border-radius: 1rem; animation: fire-border 3s ease infinite;
      filter: blur(12px); opacity: 0.8;
    }
    @keyframes fire-border {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `]
})
export class ProductCardComponent {
  product = input.required<Product>();
  priority = input(false);

  // Logic for Show More/Less
  isExpanded = signal(false);

  // Threshold for showing the "Show More" button (approx characters)
  readonly DESCRIPTION_THRESHOLD = 85;

  // Computed helpers for stock state
  isAvailable = computed(() => {
      const stock = this.product().stock ?? 0;
      return this.product().available && stock > 0;
  });

  // Computed to check if description is long enough
  hasLongDescription = computed(() => {
      const desc = this.product().description;
      return desc && desc.length > this.DESCRIPTION_THRESHOLD;
  });

  toggleExpanded() {
      this.isExpanded.update(v => !v);
  }
}
