import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      @for (i of [1,2,3,4,5,6]; track i) {
        <div class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
          <!-- Image placeholder -->
          <div class="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          <!-- Content -->
          <div class="p-4 space-y-3">
            <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
            <div class="flex justify-between items-center pt-2">
              <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-20"></div>
              <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse w-28"></div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class MenuListSkeletonComponent {}
