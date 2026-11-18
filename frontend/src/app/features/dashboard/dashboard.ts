import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowRight,
  lucideCarFront,
  lucideCircleAlert,
  lucideLayoutDashboard,
  lucideLogIn,
  lucideLogOut,
  lucideRefreshCw
} from '@ng-icons/lucide';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { errorMessage } from '../../core/error';
import {
  formatCurrency,
  formatPercent,
  formatShortDateTime
} from '../../core/format';
import { Dashboard, ParkingSpot, PricingConfig } from '../../core/models';
import { SessionService } from '../../core/session.service';
import { PlateComponent } from '../../shared/plate';
import { SpotTileComponent } from '../../shared/spot-tile';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, NgIcon, PlateComponent, SpotTileComponent],
  viewProviders: [
    provideIcons({
      lucideArrowRight,
      lucideCarFront,
      lucideCircleAlert,
      lucideLayoutDashboard,
      lucideLogIn,
      lucideLogOut,
      lucideRefreshCw
    })
  ],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly session = inject(SessionService);

  readonly canManagePricing = computed(() => this.session.hasAnyRole('ADMIN', 'MANAGER'));
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly dashboard = signal<Dashboard | null>(null);
  readonly spots = signal<ParkingSpot[]>([]);
  readonly pricing = signal<PricingConfig | null>(null);
  readonly recentCheckOuts = computed(() =>
    (this.dashboard()?.recentMovements ?? [])
      .filter(movement => movement.status === 'CLOSED')
      .slice(0, 3)
  );

  readonly formatCurrency = formatCurrency;
  readonly formatPercent = formatPercent;
  readonly formatShortDateTime = formatShortDateTime;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      dashboard: this.api.getDashboard(),
      spots: this.api.getSpots(),
      pricing: this.api.getPricing()
    }).subscribe({
      next: result => {
        this.dashboard.set(result.dashboard);
        this.spots.set(result.spots);
        this.pricing.set(result.pricing);
        this.loading.set(false);
      },
      error: error => {
        this.error.set(errorMessage(error));
        this.loading.set(false);
      }
    });
  }
}
