
import { Component, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-register-pot',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="flex flex-col items-center justify-center w-full relative p-2 transition-all duration-500"
         [class.min-h-[500px]]="cookingState() === 'idle'"
         [class.min-h-[250px]]="cookingState() !== 'idle'"
    >
      
      <!-- SMOKE ANIMATION -->
      @if (cookingState() === 'cooking') {
        <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full z-0 opacity-0 animate-steam">
          <div class="flex gap-2 justify-center">
             <span class="w-3 h-3 md:w-4 md:h-4 bg-gray-200 rounded-full animate-steam-rise delay-100"></span>
             <span class="w-5 h-5 md:w-6 md:h-6 bg-gray-300 rounded-full animate-steam-rise delay-300"></span>
             <span class="w-3 h-3 md:w-4 md:h-4 bg-gray-200 rounded-full animate-steam-rise delay-500"></span>
          </div>
        </div>
      }

      <!-- THE POT LID -->
      <!-- Adjusted width: w-[90vw] for mobile, maxing at standard sizes -->
      <div 
        class="w-[90vw] sm:w-[28rem] md:w-[32rem] h-16 md:h-24 bg-orange-700 rounded-t-[50%] relative z-20 transition-all duration-700 ease-in-out shadow-xl flex items-end justify-center border-b-4 md:border-b-8 border-orange-800"
        [class.translate-y-1]="cookingState() === 'idle'"
        [class.translate-y-2]="cookingState() === 'cooking'" 
        [class.-rotate-12]="cookingState() === 'done'"
        [class.translate-y-[-40px]]="cookingState() === 'done'"
        [class.translate-x-[40px]]="cookingState() === 'done'"
      >
        <!-- Handle -->
        <div class="w-16 md:w-24 h-4 md:h-6 bg-orange-900 rounded-full absolute -top-2 md:-top-3 left-1/2 -translate-x-1/2 shadow-lg border-b border-orange-950"></div>
        <!-- Shine -->
        <div class="absolute top-4 md:top-6 left-10 md:left-16 w-24 md:w-40 h-4 md:h-8 bg-white opacity-10 rounded-full -rotate-6 blur-sm"></div>
      </div>

      <!-- THE POT BODY -->
      <div 
        class="w-[90vw] sm:w-[28rem] md:w-[32rem] bg-orange-600 rounded-b-3xl shadow-2xl relative z-10 transition-all duration-500 ease-in-out overflow-hidden border-t-0"
        [class.animate-wiggle]="cookingState() === 'cooking'"
        [class.h-auto]="cookingState() === 'idle'"
        [class.min-h-[350px]]="cookingState() === 'idle'"
        [class.h-[280px]]="cookingState() === 'cooking' || cookingState() === 'done'"
      >
        <!-- CONTENT INSIDE POT -->
        <div class="h-full w-full bg-white dark:bg-gray-800 p-4 md:p-8 flex flex-col transition-opacity duration-300 relative border-x-4 border-b-4 border-orange-700/30 rounded-b-[1.2rem]">
          
          <!-- Registration Form -->
          @if (cookingState() === 'idle') {
            <h2 class="text-lg md:text-xl font-bold text-center text-orange-600 dark:text-orange-500 mb-3 md:mb-6 uppercase tracking-wider flex items-center justify-center gap-2">
              <span>📝</span> Ingredientes
            </h2>
            
            <form [formGroup]="registerForm" (ngSubmit)="startCooking()" class="space-y-2 md:space-y-4 animate-fade-in">
              
              <!-- Compact Grid for Mobile -->
              <div class="grid grid-cols-2 gap-2 md:gap-4">
                <div class="space-y-1">
                   <input formControlName="firstName" type="text" placeholder="Nombre" 
                    class="w-full py-2 px-3 md:p-3 rounded-lg text-sm outline-none transition-colors border 
                    bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-orange-500 
                    dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder-gray-400">
                </div>
                
                <div class="space-y-1">
                   <input formControlName="lastName" type="text" placeholder="Apellido" 
                    class="w-full py-2 px-3 md:p-3 rounded-lg text-sm outline-none transition-colors border 
                    bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-orange-500 
                    dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder-gray-400">
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2 md:gap-4">
                 <input formControlName="phone" type="tel" placeholder="Teléfono" 
                  class="w-full py-2 px-3 md:p-3 rounded-lg text-sm outline-none transition-colors border 
                  bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-orange-500 
                  dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder-gray-400">
                 
                 <input formControlName="address" type="text" placeholder="Dirección" 
                  class="w-full py-2 px-3 md:p-3 rounded-lg text-sm outline-none transition-colors border 
                  bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-orange-500 
                  dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder-gray-400">
              </div>

              <input formControlName="email" type="email" placeholder="Email" 
                class="w-full py-2 px-3 md:p-3 rounded-lg text-sm outline-none transition-colors border 
                bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-orange-500 
                dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder-gray-400">
              
              <div class="relative">
                <input 
                  formControlName="password" 
                  [type]="showPassword() ? 'text' : 'password'" 
                  placeholder="Contraseña" 
                  class="w-full py-2 px-3 md:p-3 pr-10 rounded-lg text-sm outline-none transition-colors border 
                  bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-500 focus:border-orange-500 
                  dark:bg-gray-900 dark:border-gray-700 dark:text-white dark:placeholder-gray-400"
                >
                <button 
                  type="button" 
                  (click)="togglePassword()"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  tabindex="-1"
                >
                  @if (showPassword()) {
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                  } @else {
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              
              @if (errorMsg()) {
                <p class="text-red-500 text-xs text-center font-bold bg-red-50 dark:bg-red-900/30 py-1 md:py-2 rounded">{{ errorMsg() }}</p>
              }

              <button 
                type="submit" 
                [disabled]="registerForm.invalid"
                class="w-full bg-orange-700 hover:bg-orange-800 text-white font-bold py-2.5 md:py-3.5 rounded-xl transition-all disabled:opacity-50 mt-2 md:mt-4 text-sm md:text-base shadow-lg shadow-orange-900/20 active:scale-95 flex items-center justify-center gap-2"
              >
                <span>🍳</span> ¡Cocinar Cuenta!
              </button>
            </form>
            
            <button (click)="goToLogin.emit()" class="text-xs text-center w-full mt-2 md:mt-4 text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 underline transition-colors">
              ¿Ya tienes cuenta? Ingresar
            </button>
          }

          <!-- Success Message -->
          @if (cookingState() === 'done') {
            <div class="absolute inset-0 bg-green-50 dark:bg-green-900/40 flex flex-col items-center justify-center text-center p-4 animate-fade-in z-50 rounded-b-[1.2rem]">
              <div class="text-5xl md:text-6xl mb-4 animate-bounce">👨‍🍳</div>
              <h3 class="text-xl md:text-2xl font-bold text-green-700 dark:text-green-400 leading-tight mb-2">¡Cuenta Lista!</h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 mb-8">Tus datos están listos.</p>
              <button (click)="finishRegistration()" class="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full font-bold text-base shadow-lg transition-transform active:scale-95">
                Continuar
              </button>
            </div>
          }
        </div>
        
        <!-- Pot Shine -->
        <div class="absolute top-0 right-8 w-16 h-full bg-white opacity-5 skew-x-6 pointer-events-none z-30"></div>
      </div>

      <!-- Legs (Responsive Width) -->
      <div class="flex justify-between w-[70vw] sm:w-[20rem] md:w-[24rem] -mt-3 relative z-0 px-4 transition-all duration-500"
           [class.opacity-0]="cookingState() === 'cooking'" 
           [class.opacity-100]="cookingState() !== 'cooking'">
        <div class="w-6 h-6 md:w-8 md:h-8 bg-orange-800 rounded-full shadow-md"></div>
        <div class="w-6 h-6 md:w-8 md:h-8 bg-orange-800 rounded-full shadow-md"></div>
      </div>

    </div>
  `,
  styles: [`
    @keyframes wiggle {
      0%, 100% { transform: rotate(-1deg); }
      50% { transform: rotate(1deg); }
    }
    .animate-wiggle {
      animation: wiggle 0.15s ease-in-out infinite;
    }
    @keyframes steam {
      0% { opacity: 0; transform: translateY(0) scale(1); }
      50% { opacity: 0.6; }
      100% { opacity: 0; transform: translateY(-40px) scale(1.5); }
    }
    .animate-steam {
      animation: steam 2s infinite;
    }
    .animate-steam-rise {
       animation: steam 1.5s infinite;
    }
    .delay-100 { animation-delay: 0.1s; }
    .delay-300 { animation-delay: 0.3s; }
    .delay-500 { animation-delay: 0.5s; }
  `]
})
export class RegisterPotComponent {
  goToLogin = output();
  registerSuccess = output();
  
  authService = inject(AuthService);
  fb: FormBuilder = inject(FormBuilder);

  cookingState = signal<'idle' | 'cooking' | 'done'>('idle');
  errorMsg = signal('');
  showPassword = signal(false);

  registerForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    address: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  startCooking() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.cookingState.set('cooking');

    // Wait 2.5s for pot animation
    setTimeout(() => {
      const val = this.registerForm.value;
      
      // Pass skipLoading = true to avoid double loading screen
      this.authService.register({
        firstName: val.firstName!,
        lastName: val.lastName!,
        phone: val.phone!,
        address: val.address!,
        email: val.email!,
        password: val.password!
      }, 'customer', true).subscribe({
        next: (success) => {
          if (success) {
            // Also skip loading on login
            this.authService.login(val.email!, val.password!, true).subscribe({
              next: () => {
                this.cookingState.set('done');
              },
              error: () => {
                 this.cookingState.set('done');
              }
            });
          } else {
            this.cookingState.set('idle');
            this.errorMsg.set('El email ya está registrado o error de datos.');
          }
        },
        error: () => {
          this.cookingState.set('idle');
          this.errorMsg.set('Error de conexión.');
        }
      });
    }, 2500);
  }

  finishRegistration() {
    this.registerSuccess.emit();
  }
}
