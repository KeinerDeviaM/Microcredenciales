import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthenticatedUser, AuthResponse } from './models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'microcredenciales_token';
  private readonly userKey = 'microcredenciales_user';

  token = signal<string | null>(localStorage.getItem(this.tokenKey));
  user = signal<AuthenticatedUser | null>(this.readUser());

  constructor(private readonly http: HttpClient) {}

  login(payload: { email: string; password: string }) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, payload).pipe(
      tap((response) => this.persistSession(response))
    );
  }

  register(payload: { fullName: string; email: string; password: string }) {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, payload).pipe(
      tap((response) => this.persistSession(response))
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.token.set(null);
    this.user.set(null);
  }

  isAuthenticated(): boolean {
    const currentToken = this.token();
    const currentUser = this.user();
    if (!currentToken || !currentUser) {
      return false;
    }
    return new Date(currentUser.expiresAt).getTime() > Date.now();
  }

  isAdmin(): boolean {
    return this.user()?.role === 'ADMIN';
  }

  private persistSession(response: AuthResponse): void {
    const user: AuthenticatedUser = {
      email: response.email,
      fullName: response.fullName,
      role: response.role,
      expiresAt: response.expiresAt
    };
    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.token.set(response.token);
    this.user.set(user);
  }

  private readUser(): AuthenticatedUser | null {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as AuthenticatedUser;
    } catch {
      localStorage.removeItem(this.userKey);
      return null;
    }
  }
}
