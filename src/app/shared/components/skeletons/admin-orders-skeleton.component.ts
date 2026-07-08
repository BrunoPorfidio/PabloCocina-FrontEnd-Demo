import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-orders-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      @for (i of [1,2,3,4]; track i) {
        <div class="rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 overflow-hidden animate-pulse">
          <div class="h-1 bg-gray-200 dark:bg-gray-700"></div>
          <div class="p-4 space-y-3">
            <div class="flex justify-between">
              <div class="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div class="h-5 w-14 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            </div>
            <div class="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div class="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div class="space-y-2 pt-2">
              <div class="h-8 bg-gray-100 dark:bg-gray-700/50 rounded-lg"></div>
              <div class="h-8 bg-gray-100 dark:bg-gray-700/50 rounded-lg"></div>
            </div>
            <div class="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
              <div class="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div class="flex gap-2">
                <div class="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div class="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class AdminOrdersSkeletonComponent {}
