import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CheckInPayload,
  CheckOutPreview,
  CreateUserPayload,
  Dashboard,
  Movement,
  OpenSession,
  ParkingSpot,
  PricingConfig,
  UpdateUserPayload,
  UserAccount
} from './models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api';

  getDashboard(): Observable<Dashboard> {
    return this.http.get<Dashboard>(`${this.baseUrl}/dashboard`);
  }

  getSpots(): Observable<ParkingSpot[]> {
    return this.http.get<ParkingSpot[]>(`${this.baseUrl}/spots`);
  }

  createSpot(number: string): Observable<ParkingSpot> {
    return this.http.post<ParkingSpot>(`${this.baseUrl}/spots`, { number });
  }

  checkIn(payload: CheckInPayload): Observable<OpenSession> {
    return this.http.post<OpenSession>(`${this.baseUrl}/sessions/check-in`, payload);
  }

  getOpenSessions(): Observable<OpenSession[]> {
    return this.http.get<OpenSession[]>(`${this.baseUrl}/sessions/open`);
  }

  previewCheckOut(licensePlate: string): Observable<CheckOutPreview> {
    return this.http.get<CheckOutPreview>(`${this.baseUrl}/sessions/checkout-preview`, {
      params: new HttpParams().set('licensePlate', licensePlate)
    });
  }

  checkOut(licensePlate: string): Observable<CheckOutPreview> {
    return this.http.post<CheckOutPreview>(`${this.baseUrl}/sessions/check-out`, { licensePlate });
  }

  getHistory(filters: { licensePlate?: string; from?: string; to?: string }): Observable<Movement[]> {
    let params = new HttpParams();
    if (filters.licensePlate?.trim()) {
      params = params.set('licensePlate', filters.licensePlate.trim());
    }
    if (filters.from) {
      params = params.set('from', filters.from);
    }
    if (filters.to) {
      params = params.set('to', filters.to);
    }
    return this.http.get<Movement[]>(`${this.baseUrl}/sessions/history`, { params });
  }

  getPricing(): Observable<PricingConfig> {
    return this.http.get<PricingConfig>(`${this.baseUrl}/pricing`);
  }

  updatePricing(payload: Omit<PricingConfig, 'updatedAt'>): Observable<PricingConfig> {
    return this.http.put<PricingConfig>(`${this.baseUrl}/pricing`, payload);
  }

  getUsers(): Observable<UserAccount[]> {
    return this.http.get<UserAccount[]>(`${this.baseUrl}/users`);
  }

  createUser(payload: CreateUserPayload): Observable<UserAccount> {
    return this.http.post<UserAccount>(`${this.baseUrl}/users`, payload);
  }

  updateUser(id: number, payload: UpdateUserPayload): Observable<UserAccount> {
    return this.http.put<UserAccount>(`${this.baseUrl}/users/${id}`, payload);
  }
}
