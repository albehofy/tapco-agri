import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, of, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminUser, ApiResponse } from '../models/admin.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = environment.apiUrl;
  private readonly TOKEN_KEY = 'tapco_admin_token';
  private readonly USER_KEY = 'tapco_admin_user';

  readonly token = signal<string | null>(localStorage.getItem(this.TOKEN_KEY));
  readonly currentUser = signal<AdminUser | null>(this.getSavedUser());
  readonly isLoggedIn = computed(() => !!this.token());

  private getSavedUser(): AdminUser | null {
    const raw = localStorage.getItem(this.USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  login(credentials: { email: string; password: string }): Observable<ApiResponse<{ token: string; user: AdminUser }>> {
    return this.http.post<ApiResponse<{ token: string; user: AdminUser }>>(`${this.apiUrl}/admin/login`, credentials).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.setSession(res.data.token, res.data.user);
        }
      })
    );
  }

  logout(): void {
    if (this.token()) {
      this.http.post(`${this.apiUrl}/admin/logout`, {}).subscribe({
        complete: () => this.clearSession(),
        error: () => this.clearSession()
      });
    } else {
      this.clearSession();
    }
  }

  private setSession(token: string, user: AdminUser): void {
    this.token.set(token);
    this.currentUser.set(user);
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private clearSession(): void {
    this.token.set(null);
    this.currentUser.set(null);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/login']);
  }

  checkProfile(): Observable<ApiResponse<AdminUser> | null> {
    if (!this.token()) {
      return of(null);
    }
    return this.http.get<ApiResponse<AdminUser>>(`${this.apiUrl}/admin/me`).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.currentUser.set(res.data);
          localStorage.setItem(this.USER_KEY, JSON.stringify(res.data));
        }
      }),
      catchError(() => {
        this.clearSession();
        return of(null);
      })
    );
  }

  hasPermission(permission: string): boolean {
    const user = this.currentUser();
    if (!user) return false;
    const perms = user.permissions || [];
    if (perms.includes('*') || user.role === 'Admin') return true;
    return perms.includes(permission);
  }
}
