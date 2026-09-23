import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthLoginResponse, DiscordRedirectResponse, User, UserResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly TOKEN_KEY = 'codequest_token';
  private readonly USER_KEY = 'codequest_user';
  private readonly apiUrl = environment.apiUrl;

  // Reactive State with Signals (AC-1, AC-2, AC-3)
  // Rehydrate immediately from localStorage on startup to prevent flicker/logout on reload
  private readonly currentUserSignal = signal<User | null>(this.getStoredUser());
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUserSignal());
  readonly isLoading = signal<boolean>(false);

  constructor() {
    this.initAuth();
  }

  /**
   * Initialize session if token exists in storage.
   * Validates token validity in background with the backend.
   */
  private initAuth(): void {
    const token = this.getToken();
    if (token) {
      this.loadCurrentUser().subscribe();
    }
  }

  /**
   * Get the current stored bearer token.
   */
  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  /**
   * Store token in localStorage.
   */
  setToken(token: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  /**
   * Remove token from storage.
   */
  clearToken(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  /**
   * Retrieve cached user profile from localStorage.
   */
  getStoredUser(): User | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      const data = localStorage.getItem(this.USER_KEY);
      if (data) {
        try {
          return JSON.parse(data) as User;
        } catch {
          localStorage.removeItem(this.USER_KEY);
        }
      }
    }
    return null;
  }

  /**
   * Persist user profile to localStorage for synchronous rehydration on reload.
   */
  setStoredUser(user: User): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  /**
   * Remove stored user from localStorage.
   */
  clearStoredUser(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(this.USER_KEY);
    }
  }

  /**
   * Start Discord OAuth2 flow by querying backend redirect endpoint (AC-1).
   */
  loginWithDiscord(): void {
    this.isLoading.set(true);
    this.http.get<DiscordRedirectResponse>(`${this.apiUrl}/auth/discord/redirect?format=json`).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.url) {
          window.location.href = res.url;
        }
      },
      error: () => {
        this.isLoading.set(false);
        // Fallback to direct redirect
        window.location.href = `${this.apiUrl}/auth/discord/redirect`;
      },
    });
  }

  /**
   * Login using local development mock profile.
   */
  mockLogin(customId?: string): Observable<User> {
    this.isLoading.set(true);
    const url = customId
      ? `${this.apiUrl}/auth/mock-login?id=${encodeURIComponent(customId)}`
      : `${this.apiUrl}/auth/mock-login`;

    return this.http.get<AuthLoginResponse>(url).pipe(
      tap((res) => {
        this.setToken(res.token);
        this.setStoredUser(res.user);
        this.currentUserSignal.set(res.user);
        this.isLoading.set(false);
      }),
      map((res) => res.user),
      catchError((err) => {
        this.isLoading.set(false);
        throw err;
      })
    );
  }

  /**
   * Process callback after OAuth redirect (AC-2).
   */
  handleAuthCallback(token: string): Observable<User | null> {
    this.setToken(token);
    return this.loadCurrentUser();
  }

  /**
   * Fetch authenticated user details from /api/auth/user.
   */
  loadCurrentUser(): Observable<User | null> {
    const token = this.getToken();
    if (!token) {
      this.clearSession();
      return of(null);
    }

    this.isLoading.set(true);
    return this.http.get<UserResponse>(`${this.apiUrl}/auth/user`).pipe(
      map((res) => res.data),
      tap((user) => {
        this.setStoredUser(user);
        this.currentUserSignal.set(user);
        this.isLoading.set(false);
      }),
      catchError((error) => {
        // Only invalidate local session if server explicitly returned 401 Unauthorized
        if (error?.status === 401) {
          this.clearSession();
        }
        this.isLoading.set(false);
        return of(this.currentUserSignal());
      })
    );
  }

  /**
   * Logout user by revoking token on backend and clearing local state.
   */
  logout(): void {
    const token = this.getToken();
    if (token) {
      this.http.post(`${this.apiUrl}/auth/logout`, {}).pipe(
        catchError(() => of(null))
      ).subscribe();
    }
    this.clearSession();
    this.router.navigate(['/']);
  }

  /**
   * Cleans local session state.
   */
  private clearSession(): void {
    this.clearToken();
    this.clearStoredUser();
    this.currentUserSignal.set(null);
  }
}
