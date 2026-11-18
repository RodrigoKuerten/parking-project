import { Injectable, computed, signal } from '@angular/core';
import { UserAccount, UserRole } from './models';

const TOKEN_KEY = 'patio.token';
const USER_KEY = 'patio.user';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly tokenState = signal<string | null>(this.readToken());
  private readonly userState = signal<UserAccount | null>(this.readUser());

  readonly token = this.tokenState.asReadonly();
  readonly user = this.userState.asReadonly();
  readonly role = computed(() => this.userState()?.role ?? null);
  readonly isAuthenticated = computed(() => {
    const token = this.tokenState();
    return token !== null && this.userState() !== null && !this.isExpired(token);
  });

  constructor() {
    const token = this.tokenState();
    if (token && this.isExpired(token)) {
      this.clear();
    }
  }

  start(token: string, user: UserAccount): void {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    this.tokenState.set(token);
    this.userState.set(user);
  }

  updateUser(user: UserAccount): void {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    this.userState.set(user);
  }

  clear(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    this.tokenState.set(null);
    this.userState.set(null);
  }

  hasAnyRole(...roles: UserRole[]): boolean {
    const role = this.role();
    return role !== null && roles.includes(role);
  }

  private isExpired(token: string): boolean {
    try {
      const payload = token.split('.')[1];
      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalized.padEnd(normalized.length + (4 - (normalized.length % 4)) % 4, '=');
      const claims = JSON.parse(atob(padded)) as { exp?: number };
      return typeof claims.exp !== 'number' || claims.exp * 1000 <= Date.now();
    } catch {
      return true;
    }
  }

  private readToken(): string | null {
    try {
      return sessionStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  private readUser(): UserAccount | null {
    try {
      const raw = sessionStorage.getItem(USER_KEY);
      return raw ? (JSON.parse(raw) as UserAccount) : null;
    } catch {
      return null;
    }
  }
}
