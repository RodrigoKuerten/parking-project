import { Injectable, computed, signal } from '@angular/core';
import { UserAccount, UserRole } from './models';

const TOKEN_KEY = 'patio.token';
const USER_KEY = 'patio.user';
const MAX_TIMEOUT_MS = 2_147_483_647;

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

  private expiryTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    const token = this.tokenState();
    if (token && this.isExpired(token)) {
      this.clear();
    } else if (token) {
      this.scheduleExpiry(token);
    }
  }

  start(token: string, user: UserAccount): void {
    sessionStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    this.tokenState.set(token);
    this.userState.set(user);
    this.scheduleExpiry(token);
  }

  updateUser(user: UserAccount): void {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    this.userState.set(user);
  }

  clear(): void {
    if (this.expiryTimer !== null) {
      clearTimeout(this.expiryTimer);
      this.expiryTimer = null;
    }
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    this.tokenState.set(null);
    this.userState.set(null);
  }

  hasAnyRole(...roles: UserRole[]): boolean {
    const role = this.role();
    return role !== null && roles.includes(role);
  }


  private scheduleExpiry(token: string): void {
    if (this.expiryTimer !== null) {
      clearTimeout(this.expiryTimer);
    }
    const expiresAt = this.expiresAtMs(token);
    if (expiresAt === null) {
      return;
    }

    const delay = Math.min(expiresAt - Date.now(), MAX_TIMEOUT_MS);
    this.expiryTimer = setTimeout(() => {
      this.expiryTimer = null;
      if (this.isExpired(token)) {
        this.clear();
      } else {
        this.scheduleExpiry(token);
      }
    }, Math.max(0, delay));
  }

  private isExpired(token: string): boolean {
    const expiresAt = this.expiresAtMs(token);
    return expiresAt === null || expiresAt <= Date.now();
  }

  private expiresAtMs(token: string): number | null {
    try {
      const payload = token.split('.')[1];
      const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalized.padEnd(normalized.length + (4 - (normalized.length % 4)) % 4, '=');
      const claims = JSON.parse(atob(padded)) as { exp?: number };
      return typeof claims.exp === 'number' ? claims.exp * 1000 : null;
    } catch {
      return null;
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
