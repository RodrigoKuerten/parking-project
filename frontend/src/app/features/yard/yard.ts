import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowRight,
  lucideCarFront,
  lucideCircleAlert,
  lucideCircleCheck,
  lucideClock,
  lucideLoaderCircle,
  lucideRefreshCw,
  lucideSearch,
  lucideX
} from '@ng-icons/lucide';
import { ApiService } from '../../core/api.service';
import { errorMessage } from '../../core/error';
import {
  formatCurrency,
  formatDuration,
  formatShortDateTime,
  formatTime
} from '../../core/format';
import { CheckOutPreview, OpenSession } from '../../core/models';
import { ToastService } from '../../core/toast.service';
import { ModalComponent } from '../../shared/modal';
import { PlateComponent } from '../../shared/plate';

@Component({
  selector: 'app-yard',
  imports: [RouterLink, NgIcon, ModalComponent, PlateComponent],
  viewProviders: [
    provideIcons({
      lucideArrowRight,
      lucideCarFront,
      lucideCircleAlert,
      lucideCircleCheck,
      lucideClock,
      lucideLoaderCircle,
      lucideRefreshCw,
      lucideSearch,
      lucideX
    })
  ],
  templateUrl: './yard.html'
})
export class YardComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly sessions = signal<OpenSession[]>([]);
  readonly search = signal('');
  readonly now = signal(Date.now());

  readonly selected = signal<OpenSession | null>(null);
  readonly preview = signal<CheckOutPreview | null>(null);
  readonly previewLoading = signal(false);
  readonly previewError = signal<string | null>(null);
  readonly actionError = signal<string | null>(null);
  readonly confirming = signal(false);
  readonly completed = signal<CheckOutPreview | null>(null);

  readonly filteredSessions = computed(() => {
    const term = this.search().trim().toLowerCase();
    if (!term) {
      return this.sessions();
    }
    return this.sessions().filter(
      session =>
        session.licensePlate.toLowerCase().includes(term) ||
        session.model.toLowerCase().includes(term) ||
        session.color.toLowerCase().includes(term)
    );
  });

  readonly formatCurrency = formatCurrency;
  readonly formatDuration = formatDuration;
  readonly formatShortDateTime = formatShortDateTime;
  readonly formatTime = formatTime;

  ngOnInit(): void {
    this.load();
    const timer = setInterval(() => this.now.set(Date.now()), 30_000);
    this.destroyRef.onDestroy(() => clearInterval(timer));
  }

  load(showLoading = true): void {
    if (showLoading) {
      this.loading.set(true);
    }
    this.error.set(null);
    this.api.getOpenSessions().subscribe({
      next: sessions => {
        this.sessions.set(sessions);
        this.loading.set(false);
      },
      error: error => {
        this.error.set(errorMessage(error));
        this.loading.set(false);
      }
    });
  }

  setSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  clearSearch(): void {
    this.search.set('');
  }

  elapsedMinutes(session: OpenSession): number {
    return Math.max(0, Math.floor((this.now() - new Date(session.entryAt).getTime()) / 60_000));
  }

  openCheckout(session: OpenSession): void {
    this.selected.set(session);
    this.preview.set(null);
    this.previewError.set(null);
    this.actionError.set(null);
    this.completed.set(null);
    this.loadPreview(session);
  }

  closeCheckout(): void {
    if (this.confirming()) {
      return;
    }
    this.selected.set(null);
    this.preview.set(null);
    this.completed.set(null);
    this.previewError.set(null);
    this.actionError.set(null);
  }

  loadPreview(session: OpenSession): void {
    this.previewLoading.set(true);
    this.previewError.set(null);
    this.actionError.set(null);

    this.api.previewCheckOut(session.licensePlate).subscribe({
      next: preview => {
        this.preview.set(preview);
        this.previewLoading.set(false);
      },
      error: error => {
        this.previewError.set(errorMessage(error));
        this.previewLoading.set(false);
      }
    });
  }

  confirmCheckout(): void {
    const preview = this.preview();
    if (!preview) {
      return;
    }
    this.confirming.set(true);
    this.actionError.set(null);

    this.api.checkOut(preview.licensePlate).subscribe({
      next: receipt => {
        this.confirming.set(false);
        this.completed.set(receipt);
        this.toast.show(`Check-out complete. Spot ${receipt.spotNumber} is available again.`);
        this.load(false);
      },
      error: error => {
        this.confirming.set(false);
        this.actionError.set(errorMessage(error));
      }
    });
  }
}
