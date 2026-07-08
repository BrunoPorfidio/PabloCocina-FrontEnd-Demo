import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center py-12 px-4 text-center"
         [class.bg-white]="!ghost()"
         [class.dark:bg-gray-800]="!ghost()"
         [class.rounded-xl]="!ghost()"
         [class.border-dashed]="!ghost()"
         [class.border]="!ghost()"
         [class.border-gray-300]="!ghost()"
         [class.dark:border-gray-700]="!ghost()">
      
      @if (icon()) {
        <span class="text-5xl block mb-4">{{ icon() }}</span>
      }
      
      <h3 class="text-lg font-bold text-gray-700 dark:text-gray-300 mb-1">
        {{ title() }}
      </h3>
      
      @if (description()) {
        <p class="text-sm text-gray-400 dark:text-gray-500 mb-6 max-w-xs">
          {{ description() }}
        </p>
      }
      
      @if (actionLabel()) {
        <button (click)="action.emit()"
                class="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800">
          {{ actionLabel() }}
        </button>
      }
    </div>
  `
})
export class EmptyStateComponent {
  readonly icon = input<string>();
  readonly title = input.required<string>();
  readonly description = input<string>();
  readonly actionLabel = input<string>();
  readonly ghost = input(false);
  readonly action = output<void>();
}
