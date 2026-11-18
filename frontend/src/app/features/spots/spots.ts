import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCircleAlert,
  lucideLoaderCircle,
  lucidePlus,
  lucideRefreshCw,
  lucideSquareParking
} from '@ng-icons/lucide';
import { ApiService } from '../../core/api.service';
import { errorMessage } from '../../core/error';
import { formatPercent } from '../../core/format';
import { ParkingSpot } from '../../core/models';
import { SessionService } from '../../core/session.service';
import { ToastService } from '../../core/toast.service';
import { ModalComponent } from '../../shared/modal';
import { SpotTileComponent } from '../../shared/spot-tile';

@Component({
  selector: 'app-spots',
  imports: [NgIcon, ReactiveFormsModule, ModalComponent, SpotTileComponent],
  viewProviders: [
    provideIcons({
      lucideCircleAlert,
      lucideLoaderCircle,
      lucidePlus,
      lucideRefreshCw,
      lucideSquareParking
    })
  ],
  templateUrl: './spots.html'
})
export class SpotsComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly session = inject(SessionService);

  readonly canManage = computed(() => this.session.hasAnyRole('ADMIN', 'MANAGER'));

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly spots = signal<ParkingSpot[]>([]);
  readonly addOpen = signal(false);
  readonly saving = signal(false);
  readonly formError = signal<string | null>(null);

  readonly form = this.formBuilder.nonNullable.group({
    number: ['', [Validators.required, Validators.pattern(/^[A-Za-z0-9-]{1,10}$/)]]
  });

  readonly availableCount = computed(() => this.spots().filter(spot => spot.status === 'AVAILABLE').length);
  readonly occupiedCount = computed(() => this.spots().filter(spot => spot.status === 'OCCUPIED').length);
  readonly occupancyRate = computed(() => {
    const total = this.spots().length;
    return total === 0 ? 0 : Math.round((this.occupiedCount() * 1000) / total) / 10;
  });

  readonly formatPercent = formatPercent;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.api.getSpots().subscribe({
      next: spots => {
        this.spots.set(spots);
        this.loading.set(false);
      },
      error: error => {
        this.error.set(errorMessage(error));
        this.loading.set(false);
      }
    });
  }

  openAdd(): void {
    if (!this.canManage()) {
      return;
    }
    this.form.reset({ number: '' });
    this.formError.set(null);
    this.addOpen.set(true);
  }

  create(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    this.formError.set(null);

    this.api.createSpot(this.form.controls.number.value.trim()).subscribe({
      next: spot => {
        this.saving.set(false);
        this.addOpen.set(false);
        this.toast.show(`Spot ${spot.number} added to the lot.`);
        this.load();
      },
      error: error => {
        this.saving.set(false);
        this.formError.set(errorMessage(error));
      }
    });
  }
}
