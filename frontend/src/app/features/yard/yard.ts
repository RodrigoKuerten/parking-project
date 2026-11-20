import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideClock, lucideReceipt, lucideRefreshCw, lucideSearch } from '@ng-icons/lucide';
import { ApiService } from '../../core/api.service';
import { CheckOutPreview, OpenSession } from '../../core/models';
import { errorMessage } from '../../core/error';
import { formatCurrency, formatDuration, formatShortDateTime, formatTime, normalizePlate } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { EmptyState } from '../../shared/empty-state';
import { Modal } from '../../shared/modal';
import { PageHeader } from '../../shared/page-header';
import { Plate } from '../../shared/plate';

type CheckoutStep = 'loading' | 'preview' | 'saving' | 'done' | 'error';

@Component({
  selector: 'app-yard',
  imports: [RouterLink, NgIcon, EmptyState, Modal, PageHeader, Plate],
  providers: [provideIcons({ lucideClock, lucideReceipt, lucideRefreshCw, lucideSearch })],
  templateUrl: './yard.html'
})
export class YardPage implements OnInit {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly sessions = signal<OpenSession[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly query = signal('');

  protected readonly checkoutPlate = signal<string | null>(null);
  protected readonly step = signal<CheckoutStep>('loading');
  protected readonly preview = signal<CheckOutPreview | null>(null);
  protected readonly checkoutError = signal<string | null>(null);

  protected readonly fmt = { formatCurrency, formatDuration, formatShortDateTime, formatTime };

  protected readonly filtered = computed(() => {
    const q = this.query().trim().toUpperCase();
    const plateQ = normalizePlate(q);
    const rows = [...this.sessions()].sort((a, b) => b.parkingMinutes - a.parkingMinutes);
    if (!q) {
      return rows;
    }
    return rows.filter(
      s => (plateQ && s.licensePlate.includes(plateQ)) || s.spotNumber.toUpperCase().includes(q) || s.model.toUpperCase().includes(q)
    );
  });
  protected readonly estimatedTotal = computed(() => this.sessions().reduce((sum, s) => sum + (s.estimatedAmount ?? 0), 0));

  ngOnInit(): void {
    this.load();
    const timer = setInterval(() => this.load(true), 60_000);
    this.destroyRef.onDestroy(() => clearInterval(timer));
  }

  protected load(silent = false): void {
    if (!silent) {
      this.loading.set(true);
    }
    this.api.getOpenSessions().subscribe({
      next: sessions => {
        this.sessions.set(sessions);
        this.error.set(null);
        this.loading.set(false);
      },
      error: error => {
        this.loading.set(false);
        if (!silent) {
          this.error.set(errorMessage(error));
        }
      }
    });
  }

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  /** Enter in the search box with exactly one match opens its checkout. */
  protected onSearchEnter(): void {
    const rows = this.filtered();
    if (rows.length === 1) {
      this.openCheckout(rows[0].licensePlate);
    }
  }

  protected openCheckout(plate: string): void {
    this.checkoutPlate.set(plate);
    this.step.set('loading');
    this.preview.set(null);
    this.checkoutError.set(null);
    this.api.previewCheckOut(plate).subscribe({
      next: preview => {
        this.preview.set(preview);
        this.step.set('preview');
      },
      error: error => {
        this.checkoutError.set(errorMessage(error));
        this.step.set('error');
      }
    });
  }

  protected confirmCheckout(): void {
    const plate = this.checkoutPlate();
    if (!plate) {
      return;
    }
    this.step.set('saving');
    this.api.checkOut(plate).subscribe({
      next: result => {
        this.preview.set(result);
        this.step.set('done');
        this.toast.show(`${result.licensePlate} checked out · ${formatCurrency(result.amount)}.`);
        this.load(true);
      },
      error: error => {
        this.checkoutError.set(errorMessage(error));
        this.step.set('error');
        this.load(true);
      }
    });
  }

  protected closeCheckout(): void {
    if (this.step() !== 'saving') {
      this.checkoutPlate.set(null);
    }
  }
}
