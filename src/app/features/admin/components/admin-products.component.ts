

import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuService } from '../../../core/services/menu.service';
import { Product } from '../../../core/models/types';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="animate-fade-in">
        <div class="flex flex-col sm:flex-row justify-between gap-4 mb-6">
            <h2 class="text-xl font-bold text-gray-800 dark:text-white">Gestión de Menú</h2>
            <button (click)="openModal()" class="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-transform active:scale-95">
                <span>+</span> Nuevo Producto
            </button>
        </div>
        
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                <thead class="bg-gray-50 dark:bg-gray-700/50 text-xs uppercase text-gray-700 dark:text-gray-300 font-bold tracking-wider">
                <tr>
                    <th class="px-6 py-4">Producto</th>
                    <th class="px-6 py-4">Precio</th>
                    <th class="px-6 py-4">Stock</th>
                    <th class="px-6 py-4">Categoría</th>
                    <th class="px-6 py-4 text-right">Acciones</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                @for (product of visibleProducts(); track product.id) {
                    <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-3">
                            <img [src]="product.imageUrl || 'https://via.placeholder.com/40'" class="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0">
                            <div>
                                <span class="font-bold text-gray-900 dark:text-white block">{{product.name}}</span>
                                @if (product.isDishOfTheDay) {
                                    <span class="text-[10px] bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300 px-1.5 py-0.5 rounded font-bold">🔥 Plato del Día</span>
                                }
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 font-mono">$ {{product.price}}</td>
                    <td class="px-6 py-4">
                        <span class="px-2 py-1 rounded text-xs font-bold"
                            [class.bg-green-100]="(product.stock || 0) > 10" [class.text-green-700]="(product.stock || 0) > 10"
                            [class.bg-yellow-100]="(product.stock || 0) <= 10 && (product.stock || 0) > 0" [class.text-yellow-700]="(product.stock || 0) <= 10 && (product.stock || 0) > 0"
                            [class.bg-red-100]="(product.stock || 0) === 0" [class.text-red-700]="(product.stock || 0) === 0">
                            {{ product.stock || 0 }} u.
                        </span>
                    </td>
                    <td class="px-6 py-4">
                        <span class="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded text-xs font-bold">
                            {{ getCategoryName(product.category) }}
                        </span>
                    </td>
                    <td class="px-6 py-4 text-right">
                        <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button (click)="editProduct(product)" class="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                                ✏️
                            </button>
                            <button (click)="deleteProduct(product.id)" class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                                🗑️
                            </button>
                        </div>
                    </td>
                    </tr>
                }
            </tbody>
            </table>
            </div>
        </div>

        <!-- Modal -->
        @if (showModal()) {
            <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
                <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-scale-in max-h-[90vh] overflow-y-auto">
                    <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
                        <h3 class="text-lg font-bold text-gray-900 dark:text-white">
                            {{ isEditing() ? 'Editar Producto' : 'Nuevo Producto' }}
                        </h3>
                        <button (click)="closeModal()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                            ✕
                        </button>
                    </div>
                    
                    <form [formGroup]="productForm" (ngSubmit)="onSubmit()" class="p-6 space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="col-span-2">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                                <input formControlName="name" type="text" class="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Precio</label>
                                <input formControlName="price" type="number" class="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stock Inicial</label>
                                <input formControlName="stock" type="number" class="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Categoría</label>
                                <select formControlName="category" class="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all">
                                    <option value="">Seleccionar...</option>
                                    @for (cat of menuService.categories(); track cat.id) {
                                        <option [value]="cat.id">{{ cat.name }}</option>
                                    }
                                </select>
                            </div>

                            <div class="col-span-2">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción</label>
                                <textarea formControlName="description" rows="3" class="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all"></textarea>
                            </div>

                            <div class="col-span-2">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL Imagen</label>
                                <input formControlName="imageUrl" type="text" class="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all" placeholder="https://...">
                            </div>

                            <div class="col-span-2 flex items-center gap-3">
                                <input formControlName="isDishOfTheDay" type="checkbox" id="dishDay" class="w-5 h-5 text-orange-600 rounded focus:ring-orange-500">
                                <label for="dishDay" class="text-sm font-medium text-gray-700 dark:text-gray-300">Es Plato del Día (Destacado)</label>
                            </div>
                        </div>
                        
                        <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700 mt-4">
                            <button type="button" (click)="closeModal()" class="px-4 py-2 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                Cancelar
                            </button>
                            <button type="submit" [disabled]="productForm.invalid" class="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg shadow-lg shadow-orange-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                Guardar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        }
    </div>
  `
})
export class AdminProductsComponent {
  menuService = inject(MenuService);
  fb = inject(FormBuilder);

  showModal = signal(false);
  isEditing = signal(false);
  editingId = signal<string | null>(null);

  productForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [100, [Validators.required, Validators.min(0)]], // Default stock 100
    category: ['', Validators.required],
    description: [''],
    imageUrl: [''],
    isDishOfTheDay: [false]
  });

  visibleProducts = computed(() => {
      return this.menuService.products().filter(p => !p.name.includes('__CONFIG'));
  });

  getCategoryName(id: string): string {
      const cat = this.menuService.categories().find(c => c.id === id);
      return cat ? cat.name : 'Sin Categoría';
  }

  openModal() {
    this.isEditing.set(false);
    this.editingId.set(null);
    this.productForm.reset({ price: 0, stock: 100, isDishOfTheDay: false });
    this.showModal.set(true);
  }

  editProduct(product: Product) {
    this.isEditing.set(true);
    this.editingId.set(product.id);
    this.productForm.patchValue({
        name: product.name,
        price: product.price,
        stock: product.stock || 0,
        category: product.category,
        description: product.description,
        imageUrl: product.imageUrl,
        isDishOfTheDay: product.isDishOfTheDay
    });
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  onSubmit() {
    if (this.productForm.invalid) return;

    const formValue = this.productForm.value;
    const productData: Partial<Product> = {
        name: formValue.name,
        price: formValue.price,
        stock: formValue.stock,
        category: formValue.category,
        description: formValue.description,
        imageUrl: formValue.imageUrl,
        isDishOfTheDay: formValue.isDishOfTheDay
    };

    if (this.isEditing() && this.editingId()) {
        this.menuService.admin.updateProduct({ ...productData, id: this.editingId()! });
    } else {
        this.menuService.admin.addProduct(productData);
    }
    this.closeModal();
  }

  deleteProduct(id: string) {
      if (confirm('¿Estás seguro de eliminar este producto?')) {
          this.menuService.admin.deleteProduct(id);
      }
  }
}
