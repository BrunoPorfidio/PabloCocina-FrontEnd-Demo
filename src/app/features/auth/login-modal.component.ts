
import { Component, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/80 transition-opacity" (click)="close.emit()"></div>
      
      <!-- Modal -->
      <div class="relative w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 animate-fade-in border border-gray-100 dark:border-gray-700">
        
        <div class="text-center mb-6">
          <div class="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-600 dark:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">Acceso Administrativo</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400">Ingresa la clave para gestionar el menú.</p>
        </div>

        <form (ngSubmit)="attemptLogin()" class="space-y-4">
          <div>
            <input 
              type="password" 
              [(ngModel)]="password" 
              name="password"
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-center text-lg tracking-widest outline-none focus:ring-2 focus:ring-orange-500 dark:text-white transition-all"
              placeholder="••••••"
              autofocus
            >
          </div>

          @if (error()) {
            <div class="text-red-500 text-sm text-center font-medium animate-pulse">
              Contraseña incorrecta
            </div>
          }

          <button 
            type="submit" 
            class="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
          >
            Ingresar
          </button>
        </form>

        <button (click)="close.emit()" class="w-full mt-4 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
          Cancelar y volver al menú
        </button>
      </div>
    </div>
  `
})
export class LoginModalComponent {
  close = output();
  authService = inject(AuthService);
  
  password = '';
  error = signal(false);

  attemptLogin() {
    // Suscribirse al Observable retornado por login
    this.authService.login('admin', this.password).subscribe(result => {
      if (result.success) {
        this.error.set(false);
        this.close.emit();
      } else {
        this.error.set(true);
        this.password = '';
      }
    });
  }
}
