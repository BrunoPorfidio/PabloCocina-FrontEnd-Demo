
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-global-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (loadingService.isLoading()) {
      <div class="fixed inset-0 z-[9999] flex flex-col items-center justify-center animate-fade-in print-hidden" role="status" aria-label="Cargando contenido">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/70" aria-hidden="true"></div>
        
        <!-- Content -->
        <div class="relative z-10 flex flex-col items-center">
          
          <!-- Spinning Logo Container -->
          <div class="w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-2xl border-4 border-orange-500 mb-6 animate-bounce-gentle" aria-hidden="true">
             <!-- The Logo Image spins -->
             <img src="/src/assets/logo.png" alt="" class="w-20 h-20 object-cover rounded-full animate-spin-slow" loading="eager" width="80" height="80" fetchpriority="high">
          </div>

          <!-- Text -->
          <h2 class="text-2xl font-black text-white tracking-widest uppercase mb-1 drop-shadow-lg" aria-hidden="true">
            Pablo<span class="text-orange-500">Cocina</span>
          </h2>
          <div class="flex items-center gap-2">
            <span class="text-gray-300 font-medium tracking-wider">Procesando</span>
            <div class="flex gap-1" aria-hidden="true">
              <span class="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>
              <span class="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse delay-100"></span>
              <span class="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse delay-200"></span>
            </div>
          </div>
          <span class="sr-only">Cargando, por favor espere...</span>
        </div>
      </div>
    }
  `,
  styles: [`
    .animate-spin-slow {
      animation: spin 3s linear infinite;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    @keyframes bounce-gentle {
      0%, 100% { transform: translateY(-5%); }
      50% { transform: translateY(5%); }
    }
    .animate-bounce-gentle {
      animation: bounce-gentle 2s ease-in-out infinite;
    }
    .delay-100 { animation-delay: 0.1s; }
    .delay-200 { animation-delay: 0.2s; }
    
    /* Hide this component completely during print */
    @media print {
      :host {
        display: none !important;
      }
      .print-hidden {
        display: none !important;
      }
    }
  `]
})
export class GlobalLoadingComponent {
  loadingService = inject(LoadingService);
}
