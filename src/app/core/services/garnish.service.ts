
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Garnish, ApiResponse } from '../models/types';
import { API_CONFIG } from '../config/api.config';
import { map, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GarnishService {
  private http: HttpClient = inject(HttpClient);
  
  readonly garnishes = signal<Garnish[]>([]);

  constructor() {
    this.loadGarnishes();
  }

  loadGarnishes() {
    // GET /menu/garnishes
    this.http.get<ApiResponse<Garnish[]>>(`${API_CONFIG.baseUrl}/menu/garnishes`)
      .pipe(
        map((res: ApiResponse<Garnish[]>) => {
            const rawData = res.data || (Array.isArray(res) ? (res as unknown as Garnish[]) : []);
            return rawData;
        }),
        catchError(err => {
            console.error('Error cargando guarniciones:', err);
            return of([]);
        })
      )
      .subscribe({
        next: (data) => this.garnishes.set(data)
      });
  }

  addGarnish(garnish: Partial<Garnish>) {
    // POST /menu/create-garnish
    this.http.post(`${API_CONFIG.baseUrl}/menu/create-garnish`, garnish)
        .pipe(catchError(e => { console.error('Error creando guarnición', e); return of(null); }))
        .subscribe(() => this.loadGarnishes());
  }

  updateGarnish(garnish: Garnish) {
     // PUT /menu/update-garnish/{id}
    this.http.put(`${API_CONFIG.baseUrl}/menu/update-garnish/${garnish.id}`, garnish)
        .pipe(catchError(e => { console.error('Error actualizando guarnición', e); return of(null); }))
        .subscribe(() => this.loadGarnishes());
  }

  deleteGarnish(id: string) {
    // DELETE /menu/delete-garnish/{id}
    this.http.delete(`${API_CONFIG.baseUrl}/menu/delete-garnish/${id}`)
        .pipe(catchError(e => { console.error('Error borrando guarnición', e); return of(null); }))
        .subscribe(() => this.loadGarnishes());
  }
}
