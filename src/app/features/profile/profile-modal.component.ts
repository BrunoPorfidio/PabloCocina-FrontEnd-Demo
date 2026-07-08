
import { Component, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-profile-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60 transition-opacity" (click)="close.emit()"></div>
      
      <!-- Modal -->
      <div class="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 animate-scale-in border border-gray-100 dark:border-gray-700">
        
        <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <span>✏️</span> Editar Perfil
            </h3>
            <button (click)="close.emit()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
        </div>

        <form [formGroup]="profileForm" (ngSubmit)="save()" class="space-y-4">
            
            <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                    <label class="text-xs font-bold text-gray-500 uppercase">Nombre</label>
                    <input formControlName="firstName" class="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none">
                </div>
                <div class="space-y-1">
                    <label class="text-xs font-bold text-gray-500 uppercase">Apellido</label>
                    <input formControlName="lastName" class="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none">
                </div>
            </div>

            <div class="space-y-1">
                <label class="text-xs font-bold text-gray-500 uppercase">Teléfono</label>
                <input formControlName="phone" type="tel" class="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none">
            </div>

            <div class="space-y-1">
                <label class="text-xs font-bold text-gray-500 uppercase">Dirección</label>
                <input formControlName="address" class="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none">
            </div>

            <div class="pt-4 flex gap-3">
                <button type="button" (click)="close.emit()" class="flex-1 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">Cancelar</button>
                <button 
                    type="submit" 
                    [disabled]="isLoading()"
                    class="flex-1 py-3 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700 transition-colors shadow-lg disabled:opacity-50 flex justify-center items-center gap-2"
                >
                    @if (isLoading()) {
                        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    }
                    Guardar Cambios
                </button>
            </div>

        </form>
      </div>
    </div>
  `
})
export class ProfileModalComponent {
  close = output();
  authService = inject(AuthService);
  fb: FormBuilder = inject(FormBuilder);
  
  isLoading = signal(false);

  // Removed Validators.required to allow optional fields/partial updates
  profileForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    phone: [''],
    address: ['']
  });

  constructor() {
    const user = this.authService.currentUser();
    if (user) {
        this.profileForm.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            address: user.address
        });
    }
  }

  save() {
      // Form is valid even with empty fields now
      if (this.profileForm.invalid) return;
      
      this.isLoading.set(true);
      const val = this.profileForm.value;
      
      const payload = {
          firstName: val.firstName || undefined,
          lastName: val.lastName || undefined,
          phone: val.phone || undefined,
          address: val.address || undefined
      };

      this.authService.updateProfile(payload).subscribe({
          next: (success) => {
              this.isLoading.set(false);
              if(success) {
                  this.close.emit();
              } else {
                  alert('Error al actualizar el perfil.');
              }
          },
          error: () => {
             this.isLoading.set(false);
             alert('Error de conexión.');
          }
      });
  }
}
