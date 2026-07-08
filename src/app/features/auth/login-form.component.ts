
import { Component, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { UiService } from '../../core/services/ui.service';
import { API_CONFIG } from '../../core/config/api.config';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
      
      <!-- Decorative Header -->
      <div class="bg-gray-900 text-white p-6 text-center relative overflow-hidden">
        <div class="relative z-10">
          <div class="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg border-2 border-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
          </div>
          <h2 class="text-2xl font-bold tracking-wide">Bienvenido</h2>
          <p class="text-gray-400 text-sm">Ingresa para ordenar</p>
        </div>
        <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>
      </div>

      <div class="p-8">
        <!-- No (ngSubmit) — use button click to avoid page refresh without FormsModule -->
        <form class="space-y-5">
          <div class="space-y-1">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Usuario / Email</label>
            <input 
              type="text" 
              [value]="email()"
              (input)="email.set($any($event.target).value)"
              name="email"
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow dark:text-white"
              placeholder="cliente@email.com"
              (keydown.enter)="attemptLogin()"
            >
          </div>

          <div class="space-y-1">
            <label class="text-xs font-bold text-gray-500 uppercase tracking-wider">Contraseña</label>
            <div class="relative">
              <input 
                [type]="showPassword() ? 'text' : 'password'" 
                [value]="password()"
                (input)="password.set($any($event.target).value)"
                name="password"
                class="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-shadow dark:text-white"
                placeholder="••••••••"
                (keydown.enter)="attemptLogin()"
              >
              <button 
                type="button"
                (click)="togglePassword()"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-xs font-medium"
                tabindex="-1"
              >
                {{ showPassword() ? 'OCULTAR' : 'MOSTRAR' }}
              </button>
            </div>
          </div>

          @if (error()) {
            <div class="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50 rounded-lg flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500 mt-0.5 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <p class="text-sm text-red-700 dark:text-red-300 whitespace-pre-line">{{ error() }}</p>
            </div>
          }

          <button 
            type="button"
            (click)="attemptLogin()" 
            class="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-200 dark:shadow-none transition-colors"
          >
            Entrar a la Cocina
          </button>
        </form>

        @if (API_CONFIG.isDemoMode) {
          <div class="mt-4 p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/50 rounded-lg">
            <p class="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1.5">
              🧪 Demo — credenciales de prueba
            </p>
            <div class="flex flex-col gap-1 text-xs text-amber-800 dark:text-amber-300">
              <div class="flex items-center gap-2">
                <code class="bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 rounded text-[11px] font-mono font-bold">admin</code>
                <span class="text-amber-500">/</span>
                <code class="bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 rounded text-[11px] font-mono font-bold">admin</code>
                <span class="text-amber-600 dark:text-amber-400 ml-auto text-[10px]">👑 Admin</span>
              </div>
              <div class="flex items-center gap-2">
                <code class="bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 rounded text-[11px] font-mono font-bold">cliente</code>
                <span class="text-amber-500">/</span>
                <code class="bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 rounded text-[11px] font-mono font-bold">cliente</code>
                <span class="text-amber-600 dark:text-amber-400 ml-auto text-[10px]">🙋 Cliente</span>
              </div>
            </div>
          </div>
        }

        <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-center">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            ¿Primera vez aquí? 
            <button type="button" (click)="goToRegister.emit()" class="text-orange-600 font-bold hover:underline">
              Crear cuenta
            </button>
          </p>
        </div>
      </div>
    </div>
  `
})
export class LoginFormComponent {
  goToRegister = output();
  loginSuccess = output();
  
  readonly API_CONFIG = API_CONFIG;

  authService = inject(AuthService);
  uiService = inject(UiService);
  
  email = signal('');
  password = signal('');
  showPassword = signal(false);
  error = signal<string | null>(null);

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  attemptLogin() {
    const email = this.email().trim();
    const password = this.password().trim();

    if (!email || !password) {
      this.error.set('Ingresa usuario y contraseña');
      return;
    }

    this.authService.login(email, password).subscribe({
      next: (result) => {
        if (result.success) {
          this.error.set(null);
          this.loginSuccess.emit();

          // Redirect admin to admin panel, close modal for regular users
          if (this.authService.isAdmin()) {
            this.uiService.setView('admin');
          }
        } else {
          this.error.set(result.message || 'Error desconocido');
        }
      },
      error: () => {
        this.error.set('Error de conexión con el servidor');
      }
    });
  }
}
