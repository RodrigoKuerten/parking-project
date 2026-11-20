import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideRefreshCw } from '@ng-icons/lucide';
import { ApiService } from '../../core/api.service';
import { Dashboard, ParkingSpot } from '../../core/models';
import { errorMessage } from '../../core/error';
import { t } from '../../core/i18n';
import { formatCurrency, formatDuration, formatPercent, formatShortDateTime, formatTime } from '../../core/format';
import { MetricStrip, Metric } from '../../shared/metric-strip';
import { PageHeader } from '../../shared/page-header';
import { Plate } from '../../shared/plate';
import { SpotTile } from '../../shared/spot-tile';
import { EmptyState } from '../../shared/empty-state';

const REFRESH_MS = 30_000;

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, NgIcon, MetricStrip, PageHeader, Plate, SpotTile, EmptyState],
  providers: [provideIcons({ lucideArrowRight, lucideRefreshCw })],
  templateUrl: './dashboard.html'
})
export class DashboardPage implements OnInit {
  private readonly api = inject(ApiService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly data = signal<Dashboard | null>(null);
  protected readonly spots = signal<ParkingSpot[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly updatedAt = signal<Date | null>(null);

  protected readonly fmt = { formatCurrency, formatDuration, formatShortDateTime, formatTime };
  protected readonly t = t;

  protected readonly metrics = computed<Metric[]>(() => {
    const d = this.data();
    return [
      {
        label: t('metric.occupancy'),
        value: d ? formatPercent(d.occupancyRate) : '—',
        hint: d ? t('metric.occupancyHint', { occupied: d.occupiedSpots, total: d.totalSpots }) : undefined,
        tone: 'neutral'
      },
      { label: t('metric.available'), value: d ? String(d.availableSpots) : '—', tone: 'free' },
      { label: t('metric.parked'), value: d ? String(d.parkedVehicles) : '—', tone: 'occupied' },
      {
        label: t('metric.revenueToday'),
        value: d ? formatCurrency(d.revenueToday) : '—',
        hint: d
          ? t(d.checkOutsToday === 1 ? 'metric.checkOutOne' : 'metric.checkOutOther', { count: d.checkOutsToday })
          : undefined
      }
    ];
  });

  protected readonly occupancyWidth = computed(() => `${Math.min(100, this.data()?.occupancyRate ?? 0)}%`);

  ngOnInit(): void {
    this.load();
    const timer = setInterval(() => this.load(true), REFRESH_MS);
    this.destroyRef.onDestroy(() => clearInterval(timer));
  }

  protected load(silent = false): void {
    if (!silent) {
      this.loading.set(true);
    }
    forkJoin({ dashboard: this.api.getDashboard(), spots: this.api.getSpots() }).subscribe({
      next: ({ dashboard, spots }) => {
        this.data.set(dashboard);
        this.spots.set(spots);
        this.error.set(null);
        this.loading.set(false);
        this.updatedAt.set(new Date());
      },
      error: error => {
        this.loading.set(false);
        // Keep the last good snapshot on a failed background refresh.
        if (!silent || !this.data()) {
          this.error.set(errorMessage(error));
        }
      }
    });
  }
}
