import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product, Category } from '../models/types';
import { API_CONFIG } from '../config/api.config';
import { ErrorHandlerService } from './error-handler.service';

/**
 * Handles admin CRUD operations for menu products and categories.
 *
 * Emits on `changes$` after every successful mutation so that MenuService
 * (or any other subscriber) can react — typically by reloading the full list.
 */
@Injectable({ providedIn: 'root' })
export class MenuAdminService {
  private http = inject(HttpClient);
  private errorHandler = inject(ErrorHandlerService);

  /** Fires after every successful create / update / delete */
  readonly changes$ = new Subject<void>();

  // ── Products ────────────────────────────────────────────────────────

  addProduct(product: Partial<Product> & { garnishIds?: string[] }) {
    const payload = {
      ...product,
      categoryId: product.category,
      dishOfTheDay: product.isDishOfTheDay,
      available: product.available !== undefined ? product.available : (product.stock || 0) > 0,
    };

    this.http
      .post(`${API_CONFIG.baseUrl}/menu/create-product`, payload)
      .pipe(catchError(e => { this.errorHandler.showError(e, 'MenuService'); return of(null); }))
      .subscribe(() => this.changes$.next());
  }

  updateProduct(product: Partial<Product> & { garnishIds?: string[] }) {
    const payload = {
      ...product,
      categoryId: product.category,
      dishOfTheDay: product.isDishOfTheDay,
      available: product.available !== undefined ? product.available : (product.stock || 0) > 0,
    };

    this.http
      .patch(`${API_CONFIG.baseUrl}/menu/update-product/${product.id}`, payload)
      .pipe(catchError(e => { this.errorHandler.showError(e, 'MenuService'); return of(null); }))
      .subscribe(() => this.changes$.next());
  }

  deleteProduct(productId: string) {
    this.http
      .delete(`${API_CONFIG.baseUrl}/menu/delete-product/${productId}`)
      .pipe(catchError(e => { this.errorHandler.showError(e, 'MenuService'); return of(null); }))
      .subscribe(() => this.changes$.next());
  }

  // ── Categories ──────────────────────────────────────────────────────

  addCategory(category: Category) {
    this.http
      .post(`${API_CONFIG.baseUrl}/menu/create-category`, category)
      .pipe(catchError(e => { this.errorHandler.showError(e, 'MenuService'); return of(null); }))
      .subscribe(() => this.changes$.next());
  }

  updateCategory(category: Category) {
    this.http
      .patch(`${API_CONFIG.baseUrl}/menu/update-category/${category.id}`, { name: category.name })
      .pipe(catchError(e => { this.errorHandler.showError(e, 'MenuService'); return of(null); }))
      .subscribe(() => this.changes$.next());
  }

  deleteCategory(id: string) {
    this.http
      .delete(`${API_CONFIG.baseUrl}/menu/categories/${id}`)
      .pipe(catchError(e => { this.errorHandler.showError(e, 'MenuService'); return of(null); }))
      .subscribe(() => this.changes$.next());
  }
}
