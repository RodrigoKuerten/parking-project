import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCircleAlert,
  lucideHistory,
  lucideRefreshCw
} from '@ng-icons/lucide';
import { ApiService } from '../../core/api.service';
import { errorMessage } from '../../core/error';
import {
  formatCurrency,
  formatDuration,
  formatShortDateTime
} from '../../core/format';
import { Movement } from '../../core/models';
import { PlateComponent } from '../../shared/plate';

@Component({
  selector: 'app-history',
  imports: [ReactiveFormsModule, NgIcon, PlateComponent],
  viewProviders: [provideIcons({ lucideCircleAlert, lucideHistory, lucideRefreshCw })],
  templateUrl: './history.html'
})
export class HistoryComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly formBuilder = inject(FormBuilder);

  readonly form = this.formBuilder.nonNullable.group({
    licensePlate: [''],
    from: [''],
    to: ['']
  });

  readonly movements = signal<Movement[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly totalCharged = computed(() =>
    this.movements().reduce((total, movement) => total + (movement.amount ?? 0), 0)
  );
  readonly averageTicket = computed(() => {
    const count = this.movements().length;
    return count === 0 ? 0 : this.totalCharged() / count;
  });
  readonly averageStay = computed(() => {
    const count = this.movements().length;
    if (count === 0) {
      return 0;
    }
    const totalMinutes = this.movements().reduce((total, movement) => total + movement.parkingMinutes, 0);
    return Math.round(totalMinutes / count);
  });

  readonly formatCurrency = formatCurrency;
  readonly formatDuration = formatDuration;
  readonly formatShortDateTime = formatShortDateTime;

  ngOnInit(): void {
    this.apply();
  }

  apply(): void {
    const filters = this.form.getRawValue();
    if (filters.from && filters.to && filters.from > filters.to) {
      this.error.set('The start date cannot be after the end date.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.api.getHistory({
      licensePlate: filters.licensePlate,
      from: filters.from,
      to: filters.to
    }).subscribe({
      next: movements => {
        this.movements.set(movements);
        this.loading.set(false);
      },
      error: error => {
        this.error.set(errorMessage(error));
        this.loading.set(false);
      }
    });
  }

  clear(): void {
    this.form.reset({ licensePlate: '', from: '', to: '' });
    this.apply();
  }
}
