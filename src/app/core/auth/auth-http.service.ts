import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map, catchError, of, Observable, switchMap } from 'rxjs';
import { User, ApiResponse } from '../models/types';
import { API_CONFIG } from '../config/api.config';
import { DemoService } from '../demo/demo.service';
import { ErrorHandlerService } from '../services/error-handler.service';
import { decodeToken } from './jwt-helper';

/**
 * Handles all HTTP operations for authentication and user management.
 *
 * Stateless by design — every method receives the data it needs as parameters
 * and returns raw results. Session management (saveSession / getToken) lives
 * exclusively in AuthService.
 */
@Injectable({ providedIn: 'root' })
export class AuthHttpService {
  private http = inject(HttpClient);
  private demoService = inject(DemoService, { optional: true });
  private errorHandler = inject(ErrorHandlerService);

  /**
   * Fetches fresh user data from the backend by userId.
   * @returns The full User object from the API, or null on failure.
   */
  refreshProfile(userId: string, skipLoading = false): Observable<User | null> {
    let headers = new HttpHeaders();
    if (skipLoading) {
      headers = headers.append('X-Skip-Loading', 'true');
    }

    return this.http.get<ApiResponse<User>>(`${API_CONFIG.baseUrl}/user/${userId}`, { headers }).pipe(
      map((res: ApiResponse<User>) => res.data ?? null),
      catchError(err => {
        this.errorHandler.showError(err, 'AuthService');
        return of(null);
      })
    );
  }

  /**
   * Updates the current user's profile fields.
   * @returns true if the update succeeded.
   */
  updateProfile(userId: string, data: Partial<User>): Observable<User | null> {
    return this.http.patch<ApiResponse<User>>(`${API_CONFIG.baseUrl}/user/update/${userId}`, data).pipe(
      map((res: ApiResponse<User>) => res.data ?? null),
      catchError(err => {
        this.errorHandler.showError(err, 'AuthService');
        return of(null);
      })
    );
  }

  /**
   * Registers a new user.
   */
  register(
    data: { firstName: string; lastName: string; phone: string; address: string; email: string; password: string },
    role = 'customer',
    skipLoading = false,
  ): Observable<boolean> {
    const payload: Record<string, string | boolean> = {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      address: data.address,
      email: data.email,
      password: data.password,
    };

    // Only send role if explicitly ADMIN
    if (role === 'ADMIN' || role === 'admin') {
      payload.role = 'ADMIN';
    }

    let headers = new HttpHeaders();
    if (skipLoading) {
      headers = headers.append('X-Skip-Loading', 'true');
    }

    return this.http.post<ApiResponse<User>>(`${API_CONFIG.baseUrl}/auth/register`, payload, { headers }).pipe(
      map(() => true),
      catchError(err => {
        this.errorHandler.showError(err, 'AuthService');
        return of(false);
      })
    );
  }

  /**
   * Authenticates a user and returns the JWT token + decoded user data.
   *
   * Handles both real JWT tokens and demo‑mode tokens (demo‑jwt‑ prefix).
   * Session persistence is handled by the caller (AuthService).
   */
  login(
    email: string,
    password: string,
    skipLoading = false,
  ): Observable<{ success: boolean; message?: string; user?: User; token?: string }> {
    let headers = new HttpHeaders();
    if (skipLoading) {
      headers = headers.append('X-Skip-Loading', 'true');
    }

    return this.http.post<ApiResponse<string>>(`${API_CONFIG.baseUrl}/auth/login`, { email, password }, { headers }).pipe(
      switchMap((response: ApiResponse<string>) => {
        const token = response.data;

        if (token && typeof token === 'string') {
          // Demo token handling
          if (token.startsWith('demo-jwt-')) {
            if (this.demoService) {
              const demoUser = this.demoService.findUser(email);
              if (demoUser) {
                const user: User = {
                  id: demoUser.id,
                  email: demoUser.email,
                  firstName: demoUser.firstName,
                  lastName: demoUser.lastName,
                  phone: demoUser.phone,
                  role: email === 'admin' ? 'ADMIN' : 'USER',
                  token,
                };
                return of({ success: true, user, token });
              }
            }
          }

          // Real JWT — decode to extract userId & role
          const decoded = decodeToken(token, err => this.errorHandler.showError(err, 'AuthService'));

          if (decoded) {
            // Return a minimal user that AuthService can enrich via refreshProfile
            const tempUser: User = {
              id: decoded.userId,
              firstName: '',
              lastName: '',
              email: decoded.sub,
              role: decoded.role,
              token,
            };
            return of({ success: true, user: tempUser, token });
          }

          return of({ success: false, message: 'Token ilegible' });
        }

        return of({ success: false, message: 'Respuesta inválida' });
      }),
      catchError(err => {
        this.errorHandler.showError(err, 'AuthService');

        let msg = 'Error de conexión';
        if (err.error && Array.isArray(err.error.errors) && err.error.errors.length > 0) {
          const firstError = err.error.errors[0];
          msg = firstError.description || firstError.message || 'Error desconocido';
        } else if (err.error && err.error.message) {
          msg = err.error.message;
        }

        return of({ success: false, message: msg });
      })
    );
  }

  /**
   * Fetches users by role (typically 'ADMIN' for the staff panel).
   */
  getUsersByRole(role: string): Observable<User[]> {
    const params = new HttpParams().set('role', role);
    return this.http.get<ApiResponse<User[]>>(`${API_CONFIG.baseUrl}/user`, { params }).pipe(
      map(res => {
        const data = res.data || (Array.isArray(res) ? res : []);
        return Array.isArray(data) ? data : [];
      }),
      catchError(err => {
        this.errorHandler.showError(err, 'AuthService');
        return of([]);
      })
    );
  }
}
