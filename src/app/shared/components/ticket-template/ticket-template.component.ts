
import { Component, input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { OrderResponse } from '../../../core/models/types';

@Component({
  selector: 'app-ticket-template',
  standalone: true,
  imports: [CommonModule, DatePipe],
  template: `
    @if (order()) {
      <div id="printable-ticket" class="hidden-on-screen p-2 text-black font-mono text-xs leading-tight max-w-[80mm] mx-auto bg-white">
        
        <!-- Header -->
        <div class="text-center mb-4 border-b border-black border-dashed pb-2">
          <!-- Logo for Ticket (Grayscale) -->
          @if (logoUrl()) {
            <img [src]="logoUrl()" alt="Logo" class="w-16 h-auto mx-auto mb-2 ticket-logo">
          } @else {
            <h1 class="text-xl font-black uppercase mb-1">PabloCocina</h1>
          }
          
          <p class="text-[10px]">La mejor comida casera</p>
          <p class="text-[10px] mt-1">{{ order()!.createdAt | date:'dd/MM/yyyy HH:mm' }}</p>
        </div>

        <!-- Order Info -->
        <div class="mb-4 text-center">
          <h2 class="text-3xl font-black my-2">#{{ order()!.number }}</h2>
          @if (order()?.details; as details) {
            <p class="uppercase font-bold">{{ details.customerName }}</p>
            @if (details.phone) {
              <p class="text-[10px]">{{ details.phone }}</p>
            }
            <p class="uppercase text-[10px] mt-1">
              {{ details.deliveryType === 'delivery' ? '🛵 ENVÍO A DOMICILIO' : '👜 RETIRO EN LOCAL' }}
            </p>
            @if (details.deliveryType === 'delivery') {
              <p class="mt-1 font-bold border p-1 border-black">{{ details.address }}</p>
            }
          }
        </div>

        <!-- Items -->
        <div class="border-b border-black border-dashed pb-2 mb-2">
          <div class="flex font-bold border-b border-black mb-1 pb-1">
            <span class="w-8">Cant</span>
            <span class="flex-grow">Producto</span>
            <span class="w-12 text-right">Total</span>
          </div>
          
          @for (item of order()!.items; track $index) {
            <div class="mb-2">
              <div class="flex items-start">
                <span class="w-8 font-bold text-sm">{{ item.quantity }}</span>
                <div class="flex-grow">
                  <!-- Snapshot usage: item.productName -->
                  <span class="font-bold block">{{ item.productName }}</span>
                  
                  <!-- Additionals -->
                  @if (item.additionals && item.additionals.length > 0) {
                    <div class="text-[10px] italic">
                      @for (v of item.additionals; track v.name) {
                        + {{ v.name }} <br>
                      }
                    </div>
                  }

                  <!-- Garnishes -->
                  @if (item.garnishes && item.garnishes.length > 0) {
                      <div class="text-[10px] italic">
                        @for (g of item.garnishes; track g.name) {
                            • {{ g.name }} <br>
                        }
                      </div>
                  }
                </div>
                <span class="w-12 text-right font-bold">{{ item.subtotal }}</span>
              </div>
            </div>
          }
        </div>

        <!-- Totals -->
        <div class="flex justify-between items-center text-lg font-black mb-2">
          <span>TOTAL</span>
          <span>$ {{ order()!.total }}</span>
        </div>

        <div class="text-[10px] uppercase mb-4">
          <p>MÉTODO DE PAGO: <span class="font-bold">{{ order()!.details?.paymentMethod === 'cash' ? 'EFECTIVO' : 'TRANSFERENCIA' }}</span></p>
        </div>

        @if (order()!.details?.notes) {
          <div class="border border-black p-2 mb-4">
            <p class="font-bold underline">NOTA:</p>
            <p class="font-bold text-sm">{{ order()!.details?.notes }}</p>
          </div>
        }

        <!-- Footer -->
        <div class="text-center text-[10px] mt-6 border-t border-black border-dashed pt-2">
          <p>¡Gracias por tu compra!</p>
          <p>www.pablococina.com</p>
        </div>

      </div>
    }
  `,
  styles: [`
    /* Default: Hide on screen */
    .hidden-on-screen {
      display: none;
    }

    /* Print: Show only this, hide everything else */
    @media print {
      :host {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        margin: 0;
        padding: 0;
        background: white;
        z-index: 9999;
      }

      .hidden-on-screen {
        display: block !important;
      }

      /* Force black and white text */
      * {
        color: black !important;
        background: transparent !important;
        box-shadow: none !important;
        text-shadow: none !important;
      }
      
      /* 
         Fix for Image being black:
         Removed brightness(0). 
         Added grayscale and contrast for clarity on thermal paper.
      */
      .ticket-logo {
        -webkit-filter: grayscale(100%) contrast(150%);
        filter: grayscale(100%) contrast(150%);
      }
    }
  `]
})
export class TicketTemplateComponent {
  order = input<OrderResponse | null>(null);
  logoUrl = input<string>('');
}
