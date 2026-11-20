import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight, lucideFunnelX, lucideSearch } from '@ng-icons/lucide';
import { ApiService } from '../../core/api.service';
import { Movement } from '../../core/models';
import { errorMessage } from '../../core/error';
import { formatCurrency, formatDuration, formatShortDateTime, normalizePlate } from '../../core/format';
import { t } from '../../core/i18n';
import { EmptyState } from '../../shared/empty-state';
import { MetricStrip, Metric } from '../../shared/metric-strip';
import { PageHeader } from '../../shared/page-header';
import { Plate } from '../../shared/plate';

const PAGE_SIZE = 15;

@Component({
  selector: 'app-history',
  imports: [FormsModule, NgIcon, EmptyState, MetricStrip, PageHeader, Plate],
  providers: [provideIcons({ lucideChevronLeft, lucideChevronRight, lucideFunnelX, lucideSearch })],
  templateUrl: './history.html'
})
export class HistoryPage implements OnInit {
  private readonly api = inject(ApiService);

  protected plate = '';
  protected from = '';
  protected to = '';
  protected readonly rows = signal<Movement[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly page = signal(0);
  protected readonly hasFilters = signal(false);

  protected readonly fmt = { formatCurrency, formatDuration, formatShortDateTime };
  protected readonly t = t;
  protected readonly pageCount = computed(() => Math.max(1, Math.ceil(this.rows().length / PAGE_SIZE)));
  protected readonly pageRows = computed(() => this.rows().slice(this.page() * PAGE_SIZE, (this.page() + 1) * PAGE_SIZE));
  protected readonly rangeLabel = computed(() => {
    const total = this.rows().length;
    if (total === 0) {
      return t('history.zero');
    }
    const start = this.page() * PAGE_SIZE + 1;
    return t('history.range', { start, end: Math.min(total, start + PAGE_SIZE - 1), total });
  });
  protected readonly metrics = computed<Metric[]>(() => {
    const rows = this.rows();
    const closed = rows.filter(r => r.status === 'CLOSED');
    const revenue = closed.reduce((sum, r) => sum + (r.amount ?? 0), 0);
    const avgMinutes = closed.length ? closed.reduce((sum, r) => sum + r.parkingMinutes, 0) / closed.length : 0;
    return [
      { label: t('metric.movements'), value: String(rows.length) },
      { label: t('metric.stillParked'), value: String(rows.length - closed.length), tone: 'occupied' },
      { label: t('metric.revenue'), value: formatCurrency(revenue), tone: 'free' },
      { label: t('metric.avgStay'), value: closed.length ? formatDuration(avgMinutes) : '—' }
    ];
  });

  ngOnInit(): void {
    this.search();
  }

  protected search(): void {
    if (this.from && this.to && this.from > this.to) {
      this.error.set(t('history.dateError'));
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    const licensePlate = normalizePlate(this.plate);
    this.hasFilters.set(Boolean(licensePlate || this.from || this.to));
    this.api.getHistory({ licensePlate, from: this.from || undefined, to: this.to || undefined }).subscribe({
      next: rows => {
        this.rows.set(rows);
        this.page.set(0);
        this.loading.set(false);
      },
      error: error => {
        this.error.set(errorMessage(error));
        this.loading.set(false);
      }
    });
  }

  protected clear(): void {
    this.plate = '';
    this.from = '';
    this.to = '';
    this.search();
  }
}
