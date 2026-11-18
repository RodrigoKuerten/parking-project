import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCircleAlert,
  lucideClock,
  lucideLoaderCircle,
  lucideRefreshCw,
  lucideSlidersHorizontal
} from '@ng-icons/lucide';
import { ApiService } from '../../core/api.service';
import { errorMessage } from '../../core/error';
import { formatCurrency, formatShortDateTime } from '../../core/format';
import { SessionService } from '../../core/session.service';
import { ToastService } from '../../core/toast.service';

@Component({
  selector: 'app-pricing',
  imports: [ReactiveFormsModule, NgIcon],
  viewProviders: [
    provideIcons({
      lucideCircleAlert,
      lucideClock,
      lucideLoaderCircle,
      lucideRefreshCw,
      lucideSlidersHorizontal
    })
  ],
  templateUrl: './pricing.html'
})
export class PricingComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly session = inject(SessionService);

  readonly canEdit = computed(() => this.session.hasAnyRole('ADMIN', 'MANAGER'));

  readonly form = this.formBuilder.nonNullable.group({
    firstHourRate: [0, [Validators.required, Validators.min(0.01)]],
    additionalHourRate: [0, [Validators.required, Validators.min(0.01)]],
    dailyRate: [0, [Validators.required, Validators.min(0.01)]],
    graceMinutes: [0, [Validators.required, Validators.min(0), Validators.max(120)]],
    roundingMinutes: [60, [Validators.required, Validators.min(5), Validators.max(60)]]
  });

  readonly loading = signal(true);
  readonly loadError = signal<string | null>(null);
  readonly saving = signal(false);
  readonly saveError = signal<string | null>(null);
  readonly savedAt = signal<string | null>(null);

  readonly formatCurrency = formatCurrency;
  readonly formatShortDateTime = formatShortDateTime;

  constructor() {
    effect(() => {
      if (this.canEdit()) {
        this.form.enable({ emitEvent: false });
      } else {
        this.form.disable({ emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.loadError.set(null);
    this.saveError.set(null);

    this.api.getPricing().subscribe({
      next: config => {
        this.form.patchValue({
          firstHourRate: config.firstHourRate,
          additionalHourRate: config.additionalHourRate,
          dailyRate: config.dailyRate,
          graceMinutes: config.graceMinutes,
          roundingMinutes: config.roundingMinutes
        });
        this.savedAt.set(config.updatedAt);
        this.loading.set(false);
      },
      error: error => {
        this.loadError.set(errorMessage(error));
        this.loading.set(false);
      }
    });
  }

  save(): void {
    if (!this.canEdit() || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.saveError.set(null);

    this.api.updatePricing(this.form.getRawValue()).subscribe({
      next: config => {
        this.saving.set(false);
        this.savedAt.set(config.updatedAt);
        this.toast.show('Pricing rules updated. New check-outs use the new rates.');
      },
      error: error => {
        this.saving.set(false);
        this.saveError.set(errorMessage(error));
      }
    });
  }
}
