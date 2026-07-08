
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  // Usamos un contador en lugar de un booleano simple.
  // Esto maneja el caso de múltiples peticiones simultáneas.
  // Solo se oculta cuando el contador vuelve a 0.
  private requestCount = signal(0);

  readonly isLoading = signal(false);

  show() {
    this.requestCount.update(c => c + 1);
    this.updateLoadingState();
  }

  hide() {
    this.requestCount.update(c => Math.max(0, c - 1));
    this.updateLoadingState();
  }

  private updateLoadingState() {
    // Si hay al menos 1 petición activa, mostramos el loading
    this.isLoading.set(this.requestCount() > 0);
  }
}
