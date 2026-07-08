import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { API_CONFIG } from '../../../core/config/api.config';

@Component({
  selector: 'app-demo-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (visible() && API_CONFIG.isDemoMode) {
      <div
        class="relative z-40 overflow-hidden border-b border-amber-500/30"
        role="status"
        aria-label="Modo demostración activo"
      >
        <!-- Animated gradient background -->
        <div
          class="absolute inset-0 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 animate-gradient-shift opacity-90"
          aria-hidden="true"
        ></div>

        <!-- Content -->
        <div class="relative flex items-center justify-between px-4 py-1.5 text-xs text-white">
          <div class="flex items-center gap-2 flex-wrap">
            <!-- Pill badge -->
            <span
              class="inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 font-bold uppercase tracking-wider text-[10px] backdrop-blur-sm"
            >
              <span class="relative flex h-1.5 w-1.5">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span class="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400"></span>
              </span>
              Demo activo
            </span>

            <span class="font-medium text-white/90">
              <span class="hidden sm:inline">Explorando PabloCocina sin backend — </span>
              <span class="font-semibold text-white">admin / admin</span>
              <span class="text-white/70"> o </span>
              <span class="font-semibold text-white">cliente / cliente</span>
            </span>
          </div>

          <div class="flex items-center gap-2">
            <span class="hidden sm:inline text-white/60">🧪 Modo portfolio</span>

            <!-- Dismiss button -->
            <button
              (click)="dismiss()"
              class="flex h-5 w-5 items-center justify-center rounded-full text-white/60 hover:bg-white/20 hover:text-white transition-colors"
              aria-label="Cerrar banner de demostración"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-3.5 w-3.5">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    @keyframes gradient-shift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .animate-gradient-shift {
      background-size: 200% 200%;
      animation: gradient-shift 4s ease infinite;
    }
  `]
})
export class DemoBannerComponent {
  readonly API_CONFIG = API_CONFIG;
  readonly visible = signal(true);

  dismiss(): void {
    this.visible.set(false);
  }
}
