import { Component, inject, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-cart-checkout-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- Checkout Form -->
    <div class="border-t border-gray-100 dark:border-gray-800 pt-6 mt-4">
      <h3 class="font-bold text-lg mb-4 text-gray-800 dark:text-white">Datos para el pedido</h3>
      
      @if (!isLoggedIn()) {
        <div class="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 text-center mb-4">
          <p class="text-sm text-orange-800 dark:text-orange-200 mb-2 font-medium">Debes iniciar sesión o registrarte para finalizar.</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">Tus items se guardarán.</p>
        </div>
      }

      <form [formGroup]="checkoutForm" class="space-y-4" [class.opacity-50]="!isLoggedIn()">
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tu Nombre <span class="text-red-500">*</span></label>
            <input type="text" formControlName="name" class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-shadow placeholder-gray-400" placeholder="Ej: Juan Perez" [readOnly]="!isLoggedIn()">
            @if (checkoutForm.get('name')?.invalid && checkoutForm.get('name')?.touched) {
              <p class="text-red-500 text-xs mt-1">El nombre es obligatorio.</p>
            }
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Teléfono <span class="text-red-500">*</span></label>
            <input type="tel" formControlName="phone" class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-shadow placeholder-gray-400" placeholder="Ej: 1122334455" [readOnly]="!isLoggedIn()">
            @if (checkoutForm.get('phone')?.invalid && checkoutForm.get('phone')?.touched) {
              <p class="text-red-500 text-xs mt-1">Teléfono obligatorio (solo números).</p>
            }
          </div>
        </div>

        <!-- Delivery Toggle -->
        <div class="grid grid-cols-2 gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <button type="button" 
            class="py-2 text-sm font-medium rounded-md transition-colors"
            [class.bg-orange-600]="deliveryType() === 'delivery'"
            [class.text-white]="deliveryType() === 'delivery'"
            [class.text-gray-600]="deliveryType() !== 'delivery'"
            [class.bg-gray-100]="deliveryType() !== 'delivery'"
            [class.dark:bg-gray-700]="deliveryType() !== 'delivery'"
            [class.dark:text-gray-300]="deliveryType() !== 'delivery'"
            (click)="setDelivery('delivery')">🚚 Delivery</button>
          <button type="button"
            class="py-2 text-sm font-medium rounded-md transition-colors"
            [class.bg-white]="deliveryType() === 'pickup'"
            [class.dark:bg-gray-700]="deliveryType() === 'pickup'"
            [class.shadow-sm]="deliveryType() === 'pickup'"
            [class.text-orange-600]="deliveryType() === 'pickup'"
            [class.dark:text-orange-400]="deliveryType() === 'pickup'"
            [class.text-gray-500]="deliveryType() !== 'pickup'"
            [class.dark:text-gray-400]="deliveryType() !== 'pickup'"
            (click)="setDelivery('pickup')">Retiro</button>
        </div>

        @if (deliveryType() === 'delivery') {
          <div class="animate-fade-in">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dirección exacta <span class="text-red-500">*</span></label>
            <input type="text" formControlName="address" class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none placeholder-gray-400" placeholder="Calle, Altura, Piso..." [readOnly]="!isLoggedIn()">
          </div>
        } @else {
          <div class="animate-fade-in p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
            <div class="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-600 dark:text-orange-400 mt-0.5 shrink-0"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <div>
                <p class="text-sm font-bold text-orange-800 dark:text-orange-300">Dirección de Retiro</p>
                <p class="text-sm text-orange-700 dark:text-orange-400">Av. Siempre Viva 123, CABA</p>
                <p class="text-xs text-orange-600 dark:text-orange-500 mt-1">Te esperamos en el local. Pasá a retirar tu pedido.</p>
              </div>
            </div>
          </div>
        }

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Método de Pago</label>
          <select formControlName="paymentMethod" class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none">
            <option value="cash">Efectivo</option>
            <option value="transfer">Transferencia Bancaria</option>
          </select>

          @if (checkoutForm.get('paymentMethod')?.value === 'transfer') {
            <div class="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg animate-fade-in">
              <div class="flex gap-2 items-start mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-600 dark:text-blue-400 mt-0.5"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
                <span class="text-sm font-bold text-blue-800 dark:text-blue-300">Datos Bancarios</span>
              </div>
              <div class="text-sm text-blue-900 dark:text-blue-100 pl-6 space-y-1 font-mono">
                <p>Alias: <span class="font-bold select-all">PABLO.COCINA.MP</span></p>
                <p>CBU: <span class="font-bold select-all">0000003100000012345678</span></p>
                <p class="text-xs opacity-80 mt-1 font-sans">* Enviar comprobante al WhatsApp</p>
              </div>
            </div>
          }
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Aclaraciones (Opcional)</label>
          <textarea formControlName="notes" rows="2" class="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none placeholder-gray-400" placeholder="Sin mayonesa, timbre roto, etc."></textarea>
        </div>

      </form>
    </div>

    <!-- Footer Actions -->
    <div class="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
      <div class="flex justify-between items-center mb-4">
        <span class="text-gray-600 dark:text-gray-400 font-medium">Total a pagar</span>
        <span class="text-2xl font-bold text-gray-900 dark:text-white">$ {{ totalPrice() }}</span>
      </div>
      
      <button 
        (click)="onSubmit()" 
        [disabled]="isProcessing() || (isLoggedIn() && (checkoutForm.invalid || (deliveryType() === 'delivery' && !checkoutForm.get('address')?.value)))"
        class="w-full bg-orange-600 hover:bg-orange-700 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-orange-200 dark:shadow-none transition-colors flex justify-center items-center gap-2 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed"
      >
        @if (isProcessing()) {
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Procesando...</span>
        } @else {
            @if (!isLoggedIn()) {
                <span>Ingresar para Pedir</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            } @else {
                <span>Confirmar Pedido</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            }
        }
      </button>
    </div>
  `
})
export class CartCheckoutFormComponent {
  totalPrice = input.required<number>();
  isLoggedIn = input(false);
  isProcessing = input(false);

  submitForm = output<any>();
  requireAuth = output<void>();
  close = output<void>();

  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  deliveryType = signal<'delivery' | 'pickup'>('pickup');

  checkoutForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
    address: [''],
    paymentMethod: ['cash', Validators.required],
    notes: ['']
  });

  constructor() {
    effect(() => {
      if (!this.authService.currentUser()) return;
      const user = this.authService.currentUser()!;
      this.checkoutForm.patchValue({
        name: this.authService.userFullName() || '',
        phone: user.phone || '',
        address: user.address || ''
      });
      if (user.address) {
        this.setDelivery('delivery');
      }
    });
  }

  setDelivery(type: 'delivery' | 'pickup') {
    this.deliveryType.set(type);
    if (type === 'delivery') {
      this.checkoutForm.get('address')?.setValidators([Validators.required]);
      const userAddress = this.authService.currentUser()?.address;
      if (!this.checkoutForm.get('address')?.value && userAddress) {
        this.checkoutForm.get('address')?.setValue(userAddress ?? null);
      }
    } else {
      this.checkoutForm.get('address')?.clearValidators();
    }
    this.checkoutForm.get('address')?.updateValueAndValidity();
  }

  onSubmit() {
    if (!this.isLoggedIn()) {
      this.requireAuth.emit();
      return;
    }

    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const formVal = this.checkoutForm.value;
    this.submitForm.emit({
      customerName: formVal.name || '',
      phone: formVal.phone || '',
      deliveryType: this.deliveryType(),
      address: formVal.address || '',
      paymentMethod: (formVal.paymentMethod as 'cash' | 'transfer') || 'cash',
      notes: formVal.notes || ''
    });
  }
}
