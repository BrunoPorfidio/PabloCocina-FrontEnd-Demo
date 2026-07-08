
import { Component, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginFormComponent } from './login-form.component';
import { RegisterPotComponent } from './register-pot.component';

@Component({
  selector: 'app-user-auth-modal',
  standalone: true,
  imports: [CommonModule, LoginFormComponent, RegisterPotComponent],
  template: `
    <div class="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/80 transition-opacity" (click)="close.emit()"></div>
      
      <!-- Modal Content (Wrapper) - Increased max-width for the larger pot -->
      <div class="relative w-full max-w-2xl z-10 animate-scale-in flex justify-center">
        <button (click)="close.emit()" class="absolute -top-12 right-0 md:-right-4 text-white hover:text-orange-500 transition-colors z-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        @if (view() === 'login') {
            <div class="w-full max-w-md">
                <app-login-form 
                    (goToRegister)="view.set('register')" 
                    (loginSuccess)="onAuthSuccess()"
                ></app-login-form>
            </div>
        } @else {
            <app-register-pot 
                (goToLogin)="view.set('login')"
                (registerSuccess)="onAuthSuccess()"
            ></app-register-pot>
        }
      </div>
    </div>
  `
})
export class UserAuthModalComponent {
  close = output();
  
  view = signal<'login' | 'register'>('login');

  onAuthSuccess() {
    this.close.emit();
  }
}
