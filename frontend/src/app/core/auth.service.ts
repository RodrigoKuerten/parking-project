import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoginResponse, UserAccount } from './models';
import { SessionService } from './session.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly session = inject(SessionService);

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>('/api/auth/login', { email, password })
      .pipe(
        tap(response => {
          this.session.start(response.token, response.user);
        })
      );
  }

  refreshSession(): Observable<UserAccount> {
    return this.http
      .get<UserAccount>('/api/auth/me')
      .pipe(tap(user => this.session.updateUser(user)));
  }

  logout(): void {
    this.session.clear();
  }
}
