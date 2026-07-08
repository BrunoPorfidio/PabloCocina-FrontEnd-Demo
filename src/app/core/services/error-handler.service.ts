import { Injectable, inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { ToastService } from './toast.service';

/**
 * Centralized error handling for services.
 * Logs errors with context prefix and shows user-friendly toast notifications.
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  private toast = inject(ToastService);

  /**
   * Extracts a user-friendly message from an error object.
   * Tries backend error format first, then standard Error.message, then fallback.
   */
  private extractMessage(error: unknown): string {
    return (
      (error as any)?.error?.errors?.[0]?.description ??
      (error as any)?.message ??
      'Ocurrió un error inesperado'
    );
  }

  /**
   * Logs error and shows toast. Returns throwError for re-throw in catchError.
   */
  handleError(error: unknown, context: string): Observable<never> {
    console.error(`[${context}]`, error);
    this.toast.error(this.extractMessage(error), 5000);
    return throwError(() => error);
  }

  /**
   * Logs error and shows toast without re-throwing.
   * Use when you need to return a fallback value after the error.
   */
  showError(error: unknown, context: string): void {
    console.error(`[${context}]`, error);
    this.toast.error(this.extractMessage(error), 5000);
  }
}
