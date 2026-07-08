
import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ScheduleService } from '../../../core/services/schedule.service';

@Component({
  selector: 'app-admin-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  template: `
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
      <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Configuración de Días No Laborables</h2>
      
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Add Date Form -->
        <div class="w-full md:w-1/3 space-y-4">
            <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Agregar Fecha</label>
                <div class="flex gap-2">
                    <input type="date" [(ngModel)]="selectedDate" class="flex-grow px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500">
                    <button (click)="addDate()" [disabled]="!selectedDate" class="px-4 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-colors disabled:opacity-50">
                        +
                    </button>
                </div>
                <p class="text-xs text-gray-500 mt-2">
                    Los días agregados aquí mostrarán el cartel de "Cerrado" y bloquearán pedidos si se configura así.
                </p>
            </div>
        </div>

        <!-- Dates List -->
        <div class="w-full md:w-2/3">
            <h3 class="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Fechas Bloqueadas</h3>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                @for (date of scheduleService.holidays(); track date) {
                    <div class="flex justify-between items-center p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm">
                        <div class="flex items-center gap-3">
                            <span class="text-xl">📅</span>
                            <span class="font-mono font-bold text-gray-900 dark:text-white">{{ date | date:'dd/MM/yyyy' : 'UTC' }}</span>
                        </div>
                        <button (click)="removeDate(date)" class="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-2 rounded-lg transition-colors" title="Eliminar">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        </button>
                    </div>
                } @empty {
                    <div class="col-span-full py-8 text-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
                        No hay días feriados configurados.
                    </div>
                }
            </div>
        </div>
      </div>
    </div>
  `
})
export class AdminScheduleComponent {
  scheduleService = inject(ScheduleService);
  selectedDate = '';

  addDate() {
    if (this.selectedDate) {
        this.scheduleService.addHoliday(this.selectedDate);
        this.selectedDate = '';
    }
  }

  removeDate(date: string) {
    if (confirm(`¿Desbloquear la fecha ${date}?`)) {
        this.scheduleService.removeHoliday(date);
    }
  }
}
