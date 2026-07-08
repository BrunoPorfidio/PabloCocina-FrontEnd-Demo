import { Injectable, signal, computed, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { User } from '../models/types';
import { safeParseJSON, safeStringify } from './jwt-helper';
import { AuthHttpService } from './auth-http.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly SESSION_KEY = 'pablo_session_jwt_v1';
  private httpService = inject(AuthHttpService);

  // Current logged in user
  readonly currentUser = signal<User | null>(this.loadSession());

  readonly isLoggedIn = computed(() => this.currentUser() !== null);
  readonly isAdmin = computed(() => this.currentUser()?.role === 'ADMIN' || this.currentUser()?.role === 'admin');

  // Computed for Full Name display
  readonly userFullName = computed(() => {
    const user = this.currentUser();
    if (!user) return '';
    const full = `${user.firstName} ${user.lastName || ''}`.trim();
    return full || user.email;
  });

  constructor() {
    // If logged in on app start, try to refresh profile data in background
    if (this.isLoggedIn()) {
      this.refreshProfile().subscribe();
    }
  }

  // ── Session Management ──────────────────────────────────────────────

  private loadSession(): User | null {
    const stored = localStorage.getItem(this.SESSION_KEY);
    return safeParseJSON<User | null>(stored, null);
  }

  private saveSession(user: User, token: string) {
    const userWithToken = { ...user, token };
    localStorage.setItem(this.SESSION_KEY, safeStringify(userWithToken));
    this.currentUser.set(userWithToken);
  }

  getToken(): string | undefined {
    return this.currentUser()?.token;
  }

  logout() {
    localStorage.removeItem(this.SESSION_KEY);
    this.currentUser.set(null);
  }

  // ── HTTP Facades ────────────────────────────────────────────────────

  /**
   * Refreshes profile data from the backend and updates the session.
   */
  refreshProfile(skipLoading = false): Observable<User | null> {
    const user = this.currentUser();
    if (!user || !user.id) {
      return of(null);
    }

    return this.httpService.refreshProfile(user.id, skipLoading).pipe(
      map(apiUser => {
        if (apiUser) {
          const current = this.currentUser();
          const tokenToUse = current?.token || '';
          const updatedUser: User = {
            id: apiUser.id || current?.id || '',
            role: apiUser.role || current?.role || 'customer',
            email: apiUser.email || current?.email || '',
            firstName: apiUser.firstName || current?.firstName || '',
            lastName: apiUser.lastName || current?.lastName || '',
            phone: apiUser.phone || current?.phone || '',
            address: apiUser.address || current?.address || '',
            token: tokenToUse,
          };
          if (tokenToUse) {
            this.saveSession(updatedUser, tokenToUse);
          }
          return updatedUser;
        }
        return null;
      })
    );
  }

  /**
   * Updates the current user's profile and refreshes local state.
   */
  updateProfile(data: Partial<User>): Observable<boolean> {
    const user = this.currentUser();
    if (!user) return of(false);

    return this.httpService.updateProfile(user.id, data).pipe(
      map(apiUser => {
        if (apiUser) {
          const updated = { ...user, ...apiUser };
          this.saveSession(updated, user.token!);
          return true;
        }
        // Even if the API doesn't return the full user, optimistically update local state
        const updated = { ...user, ...data };
        this.saveSession(updated, user.token!);
        return true;
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
    return this.httpService.register(data, role, skipLoading);
  }

  /**
   * Authenticates the user, saves the session, and enriches the profile
   * from the database in a single flow.
   */
  login(
    email: string,
    password: string,
    skipLoading = false,
  ): Observable<{ success: boolean; message?: string }> {
    return this.httpService.login(email, password, skipLoading).pipe(
      switchMap(result => {
        if (result.success && result.user && result.token) {
          // Save session immediately so the interceptor has the token
          this.saveSession(result.user, result.token);

          // Enrich with full profile from DB
          return this.httpService.refreshProfile(result.user.id).pipe(
            map(fullUser => {
              if (fullUser) {
                this.saveSession(fullUser, result.token!);
              }
              return { success: true };
            })
          );
        }
        return of({ success: result.success, message: result.message });
      })
    );
  }

  /**
   * Fetches users filtered by role (used in the admin staff panel).
   */
  getUsersByRole(role: string): Observable<User[]> {
    return this.httpService.getUsersByRole(role);
  }
}
