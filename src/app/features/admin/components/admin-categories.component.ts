
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MenuService } from '../../../core/services/menu.service';
import { Category } from '../../../core/models/types';

@Component({
  selector: 'app-admin-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">Categorías</h2>
        <button (click)="openModal()" class="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
          + Nueva Categoría
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">Icono</th>
              <th scope="col" class="px-6 py-3">Nombre</th>
              <th scope="col" class="px-6 py-3">Estado</th>
              <th scope="col" class="px-6 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            @for (category of menuService.categories(); track category.id) {
              <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-6 py-4 text-xl">{{ category.icon }}</td>
                <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">{{ category.name }}</td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 rounded-full text-xs font-bold"
                    [class.bg-green-100]="category.active" [class.text-green-800]="category.active"
                    [class.bg-red-100]="!category.active" [class.text-red-800]="!category.active">
                    {{ category.active ? 'Activa' : 'Inactiva' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <button (click)="editCategory(category)" class="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-3">Editar</button>
                  <button (click)="deleteCategory(category)" class="font-medium text-red-600 dark:text-red-500 hover:underline">Eliminar</button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="4" class="px-6 py-4 text-center">No hay categorías registradas</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    @if (isModalOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-scale-in">
          <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white">
              {{ isEditing() ? 'Editar Categoría' : 'Nueva Categoría' }}
            </h3>
            <button (click)="closeModal()" class="text-gray-400 hover:text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          
          <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()" class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
              <input type="text" formControlName="name" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all" placeholder="Ej. Hamburguesas">
            </div>

            <div class="flex items-center gap-2">
              <input type="checkbox" formControlName="active" id="active" class="w-4 h-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500">
              <label for="active" class="text-sm font-medium text-gray-700 dark:text-gray-300">Activa</label>
            </div>

            <div class="pt-4 flex gap-3">
              <button type="button" (click)="closeModal()" class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Cancelar
              </button>
              <button type="submit" [disabled]="categoryForm.invalid" class="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class AdminCategoriesComponent {
  menuService = inject(MenuService);
  fb = inject(FormBuilder);

  isModalOpen = signal(false);
  isEditing = signal(false);
  currentId = signal<string | null>(null);

  categoryForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    active: [true]
  });

  openModal() {
    this.isEditing.set(false);
    this.currentId.set(null);
    this.categoryForm.reset({ active: true });
    this.isModalOpen.set(true);
  }

  editCategory(category: Category) {
    this.isEditing.set(true);
    this.currentId.set(category.id);
    this.categoryForm.patchValue({
      name: category.name,
      active: category.active
    });
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  deleteCategory(category: Category) {
    if (confirm(`¿Estás seguro de eliminar la categoría "${category.name}"?`)) {
      this.menuService.admin.deleteCategory(category.id);
    }
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      const formValue = this.categoryForm.value;
      const categoryData: Category = {
        id: this.currentId() || '',
        name: formValue.name!,
        active: formValue.active!
      };

      if (this.isEditing()) {
        this.menuService.admin.updateCategory(categoryData);
      } else {
        this.menuService.admin.addCategory(categoryData);
      }
      this.closeModal();
    }
  }
}
