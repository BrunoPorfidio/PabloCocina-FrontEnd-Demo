
import { Injectable, computed, inject } from '@angular/core';
import { MenuService } from './menu.service';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
  private menuService = inject(MenuService);
  
  // Nombre especial para el producto que guardará la configuración
  readonly CONFIG_PRODUCT_NAME = '__CONFIG_HOLIDAYS__';

  // 1. Encontrar el producto de configuración en la lista global
  private readonly configProduct = computed(() => 
    this.menuService.products().find(p => p.name === this.CONFIG_PRODUCT_NAME)
  );

  // 2. Extraer las fechas de la descripción
  readonly holidays = computed(() => {
    const product = this.configProduct();
    if (!product || !product.description) return [];
    
    // Si la descripción es el marcador de vacío, retornamos array vacío
    if (product.description === 'NO_DATES') return [];

    return product.description.split(',').filter(d => d.includes('-')); 
  });

  // 3. Verificar si hoy es feriado (Global)
  readonly isTodayHoliday = computed(() => {
    const today = new Date();
    // Argentina Time
    const argDate = new Date(today.toLocaleString("en-US", {timeZone: "America/Argentina/Buenos_Aires"}));
    // Format YYYY-MM-DD manually to avoid locale issues
    const year = argDate.getFullYear();
    const month = String(argDate.getMonth() + 1).padStart(2, '0');
    const day = String(argDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    return this.holidays().includes(dateStr);
  });

  // 4. Verificar horario (11 AM)
  // readonly isKitchenOpen = computed(() => {
  //   const now = new Date();
  //   const argTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Argentina/Buenos_Aires"}));
  //   const hours = argTime.getHours();
  //   return hours < 11;
  // });

  // --- ACTIONS ---

  addHoliday(dateStr: string) {
    if (!dateStr) return;
    
    const currentList = this.holidays();
    if (currentList.includes(dateStr)) return;

    const updatedList = [...currentList, dateStr].sort();
    this.saveToCloud(updatedList);
  }

  removeHoliday(dateStr: string) {
    // Filtramos la fecha que queremos sacar
    const updatedList = this.holidays().filter(d => d !== dateStr);
    
    // SIEMPRE llamamos a saveToCloud (Actualizar), NUNCA borramos el producto físico.
    // Esto es más seguro y evita errores de base de datos.
    this.saveToCloud(updatedList);
  }

  private saveToCloud(dates: string[]) {
    // Si no hay fechas, guardamos un string especial para indicar "Vacío"
    const descriptionPayload = dates.length > 0 ? dates.join(',') : 'NO_DATES';
    
    const existingProduct = this.configProduct();

    // Necesitamos una categoría válida. Usamos la primera disponible.
    const categories = this.menuService.categories();
    const firstCatId = categories.length > 0 ? categories[0].id : null;

    if (!firstCatId) {
        console.error('No hay categorías para guardar la configuración.');
        return;
    }

    if (existingProduct) {
        // ACTUALIZAR SIEMPRE
        this.menuService.admin.updateProduct({
            id: existingProduct.id,
            name: this.CONFIG_PRODUCT_NAME,
            description: descriptionPayload,
            price: 999999, 
            available: false, 
            isDishOfTheDay: false,
            // Asegurar que tenga categoría válida
            category: existingProduct.category || existingProduct.categoryId || firstCatId
        });
    } else {
        // CREAR SOLO SI NO EXISTE
        this.menuService.admin.addProduct({
            name: this.CONFIG_PRODUCT_NAME,
            description: descriptionPayload,
            price: 999999,
            imageUrl: 'https://via.placeholder.com/10', 
            available: false,
            category: firstCatId,
            additionals: [],
            isDishOfTheDay: false
        });
    }
  }
}
