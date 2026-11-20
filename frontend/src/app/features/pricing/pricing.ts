import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePencil } from '@ng-icons/lucide';
import { ApiService } from '../../core/api.service';
import { PricingConfig } from '../../core/models';
import { errorMessage } from '../../core/error';
import { formatCurrency, formatShortDateTime } from '../../core/format';
import { SessionService } from '../../core/session.service';
import { ToastService } from '../../core/toast.service';
import { t } from '../../core/i18n';
import { EmptyState } from '../../shared/empty-state';
import { PageHeader } from '../../shared/page-header';

const MONEY = [Validators.required, Validators.min(0.01), Validators.pattern(/^\d{1,8}(\.\d{1,2})?$/)];

@Component({
  selector: 'app-pricing',
  imports: [ReactiveFormsModule, NgIcon, EmptyState, PageHeader],
  providers: [provideIcons({ lucidePencil })],
  templateUrl: './pricing.html'
})
export class PricingPage implements OnInit {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);

  protected readonly canEdit = inject(SessionService).hasAnyRole('ADMIN', 'MANAGER');
  protected readonly config = signal<PricingConfig | null>(null);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly editing = signal(false);
  protected readonly saving = signal(false);
  protected readonly formError = signal<string | null>(null);
  protected readonly fmt = { formatCurrency, formatShortDateTime };
  protected readonly t = t;

  protected readonly form = inject(FormBuilder).nonNullable.group({
    firstHourRate: [0, MONEY],
    additionalHourRate: [0, MONEY],
    dailyRate: [0, MONEY],
    graceMinutes: [0, [Validators.required, Validators.min(0), Validators.max(120)]],
    roundingMinutes: [15, [Validators.required, Validators.min(5), Validators.max(60)]]
  });

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.api.getPricing().subscribe({
      next: config => {
        this.config.set(config);
        this.error.set(null);
        this.loading.set(false);
      },
      error: error => {
        this.error.set(errorMessage(error));
        this.loading.set(false);
      }
    });
  }

  protected startEdit(): void {
    const c = this.config();
    if (!c) {
      return;
    }
    const { updatedAt: _ignored, ...values } = c;
    this.form.reset(values);
    this.formError.set(null);
    this.editing.set(true);
  }

  protected invalid(name: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[name];
    return control.invalid && control.touched;
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.saving.set(true);
    this.formError.set(null);
    this.api.updatePricing(value).subscribe({
      next: config => {
        this.config.set(config);
        this.saving.set(false);
        this.editing.set(false);
        this.toast.show(t('pricing.updated'));
      },
      error: error => {
        this.saving.set(false);
        this.formError.set(errorMessage(error));
      }
    });
  }
}
