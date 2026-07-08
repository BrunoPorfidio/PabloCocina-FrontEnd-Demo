import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-drawer-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col h-full p-4 space-y-4">
      <!-- Header -->
      <div class="flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-gray-800">
        <div class="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-32"></div>
      </div>
      
      <!-- Items -->
      <div class="flex-grow space-y-4">
        @for (i of [1,2,3]; track i) {
          <div class="flex gap-3 items-start p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div class="h-16 w-16 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse flex-shrink-0"></div>
            <div class="flex-grow space-y-2">
              <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/4"></div>
              <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
            </div>
            <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-16"></div>
          </div>
        }
      </div>

      <!-- Divider -->
      <div class="h-px bg-gray-200 dark:bg-gray-700"></div>

      <!-- Total -->
      <div class="flex justify-between items-center">
        <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
        <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24"></div>
      </div>

      <!-- Button -->
      <div class="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse w-full"></div>
    </div>
  `
})
export class CartDrawerSkeletonComponent {}
