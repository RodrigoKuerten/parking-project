import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePlus } from '@ng-icons/lucide';
import { ApiService } from '../../core/api.service';
import { ParkingSpot, SpotStatus } from '../../core/models';
import { errorMessage } from '../../core/error';
import { formatPercent } from '../../core/format';
import { SessionService } from '../../core/session.service';
import { ToastService } from '../../core/toast.service';
import { EmptyState } from '../../shared/empty-state';
import { MetricStrip, Metric } from '../../shared/metric-strip';
import { PageHeader } from '../../shared/page-header';
import { SpotTile } from '../../shared/spot-tile';

type Filter = 'ALL' | SpotStatus;

@Component({
  selector: 'app-spots',
  imports: [ReactiveFormsModule, NgIcon, EmptyState, MetricStrip, PageHeader, SpotTile],
  providers: [provideIcons({ lucidePlus })],
  templateUrl: './spots.html'
})
export class SpotsPage implements OnInit {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);

  protected readonly canManage = inject(SessionService).hasAnyRole('ADMIN', 'MANAGER');
  protected readonly spots = signal<ParkingSpot[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly filter = signal<Filter>('ALL');
  protected readonly saving = signal(false);
  protected readonly formError = signal<string | null>(null);
  protected readonly form = inject(FormBuilder).nonNullable.group({
    number: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9-]{1,10}$/)]]
  });

  protected readonly filters: { value: Filter; label: string }[] = [
    { value: 'ALL', label: 'All' },
    { value: 'AVAILABLE', label: 'Free' },
    { value: 'OCCUPIED', label: 'Occupied' }
  ];

  protected readonly counts = computed(() => {
    const all = this.spots();
    const occupied = all.filter(s => s.status === 'OCCUPIED').length;
    return { ALL: all.length, OCCUPIED: occupied, AVAILABLE: all.length - occupied };
  });
  protected readonly visible = computed(() => {
    const f = this.filter();
    return f === 'ALL' ? this.spots() : this.spots().filter(s => s.status === f);
  });
  protected readonly metrics = computed<Metric[]>(() => {
    const c = this.counts();
    return [
      { label: 'Total spots', value: String(c.ALL) },
      { label: 'Free', value: String(c.AVAILABLE), tone: 'free' },
      { label: 'Occupied', value: String(c.OCCUPIED), tone: 'occupied' },
      { label: 'Occupancy', value: c.ALL ? formatPercent((c.OCCUPIED / c.ALL) * 100) : '—', tone: 'neutral' }
    ];
  });

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.api.getSpots().subscribe({
      next: spots => {
        this.spots.set(spots);
        this.error.set(null);
        this.loading.set(false);
      },
      error: error => {
        this.error.set(errorMessage(error));
        this.loading.set(false);
      }
    });
  }

  protected addSpot(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const number = this.form.getRawValue().number.trim().toUpperCase();
    this.saving.set(true);
    this.formError.set(null);
    this.api.createSpot(number).subscribe({
      next: spot => {
        this.saving.set(false);
        this.spots.update(list => [...list, spot]);
        this.form.reset();
        this.toast.show(`Spot ${spot.number} added.`);
      },
      error: error => {
        this.saving.set(false);
        this.formError.set(errorMessage(error));
      }
    });
  }
}
