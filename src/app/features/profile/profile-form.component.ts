import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 animate-fade-in">
      <h3 class="font-bold text-xl text-gray-900 dark:text-white mb-6">Editar Información</h3>

      <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-xs font-bold text-gray-500 uppercase">Nombre</label>
            <input formControlName="firstName"
              class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none">
          </div>
          <div class="space-y-1">
            <label class="text-xs font-bold text-gray-500 uppercase">Apellido</label>
            <input formControlName="lastName"
              class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none">
          </div>
        </div>

        <div class="space-y-1">
          <label class="text-xs font-bold text-gray-500 uppercase">Teléfono</label>
          <input formControlName="phone" type="tel"
            class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none">
        </div>

        <div class="space-y-1">
          <label class="text-xs font-bold text-gray-500 uppercase">Dirección</label>
          <input formControlName="address"
            class="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none">
        </div>

        <div class="pt-4 flex justify-end">
          <button type="submit" [disabled]="isSaving()"
            class="px-8 py-3 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700 transition-colors shadow-lg disabled:opacity-50 flex items-center gap-2">
            @if (isSaving()) {
              <span>Guardando...</span>
            } @else {
              <span>Guardar Cambios</span>
            }
          </button>
        </div>
      </form>
    </div>
  `
})
export class ProfileFormComponent {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  isSaving = signal(false);

  profileForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    phone: [''],
    address: ['']
  });

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          address: user.address
        });
      }
    });
  }

  saveProfile() {
    if (this.profileForm.invalid) return;
    this.isSaving.set(true);

    const val = this.profileForm.value;
    const payload = {
      firstName: val.firstName || undefined,
      lastName: val.lastName || undefined,
      phone: val.phone || undefined,
      address: val.address || undefined
    };

    this.authService.updateProfile(payload).subscribe({
      next: () => {
        this.isSaving.set(false);
        alert('Perfil actualizado correctamente');
      },
      error: () => {
        this.isSaving.set(false);
        alert('Error al actualizar');
      }
    });
  }
}
