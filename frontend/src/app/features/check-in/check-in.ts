import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCircleAlert,
  lucideCircleCheck,
  lucideClock,
  lucideLoaderCircle,
  lucideLogIn,
  lucideSquareParking
} from '@ng-icons/lucide';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { errorMessage } from '../../core/error';
import { formatCurrency, formatTime, normalizePlate } from '../../core/format';
import { OpenSession, ParkingSpot, PricingConfig } from '../../core/models';
import { PlateComponent } from '../../shared/plate';

@Component({
  selector: 'app-check-in',
  imports: [ReactiveFormsModule, RouterLink, NgIcon, PlateComponent],
  viewProviders: [
    provideIcons({
      lucideCircleAlert,
      lucideCircleCheck,
      lucideClock,
      lucideLoaderCircle,
      lucideLogIn,
      lucideSquareParking
    })
  ],
  templateUrl: './check-in.html'
})
export class CheckInComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);

  readonly loading = signal(true);
  readonly loadError = signal<string | null>(null);
  readonly spots = signal<ParkingSpot[]>([]);
  readonly pricing = signal<PricingConfig | null>(null);
  readonly submitting = signal(false);
  readonly formError = signal<string | null>(null);
  readonly success = signal<OpenSession | null>(null);

  readonly form = this.formBuilder.nonNullable.group({
    licensePlate: ['', [Validators.required, Validators.pattern(/^(?:[A-Z]{3}\d[A-Z]\d{2}|[A-Z]{3}\d{4})$/)]],
    model: ['', [Validators.required, Validators.maxLength(80)]],
    color: ['', [Validators.required, Validators.maxLength(30)]],
    spotId: [0]
  });

  readonly availableSpots = computed(() => this.spots().filter(spot => spot.status === 'AVAILABLE'));
  readonly availableCount = computed(() => this.availableSpots().length);

  readonly formatCurrency = formatCurrency;
  readonly formatTime = formatTime;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.loadError.set(null);

    forkJoin({
      spots: this.api.getSpots(),
      pricing: this.api.getPricing()
    }).subscribe({
      next: result => {
        this.spots.set(result.spots);
        this.pricing.set(result.pricing);
        this.applyPreselectedSpot();
        this.loading.set(false);
      },
      error: error => {
        this.loadError.set(errorMessage(error));
        this.loading.set(false);
      }
    });
  }

  onPlateInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.form.controls.licensePlate.setValue(normalizePlate(input.value), { emitEvent: false });
  }

  platePreview(): string {
    return this.form.controls.licensePlate.value;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.submitting.set(true);
    this.formError.set(null);

    this.api.checkIn({
      licensePlate: value.licensePlate,
      model: value.model.trim(),
      color: value.color.trim(),
      spotId: value.spotId > 0 ? value.spotId : null
    }).subscribe({
      next: session => {
        this.submitting.set(false);
        this.success.set(session);
        this.form.reset({ licensePlate: '', model: '', color: '', spotId: 0 });
        this.loadSpots();
      },
      error: error => {
        this.submitting.set(false);
        this.formError.set(errorMessage(error));
      }
    });
  }

  clearSuccess(): void {
    this.success.set(null);
  }

  private loadSpots(): void {
    this.api.getSpots().subscribe({
      next: spots => this.spots.set(spots),
      error: error => this.formError.set(errorMessage(error))
    });
  }

  private applyPreselectedSpot(): void {
    const spotParam = this.route.snapshot.queryParamMap.get('spot');
    if (!spotParam) {
      return;
    }
    const spotId = Number(spotParam);
    if (this.availableSpots().some(spot => spot.id === spotId)) {
      this.form.controls.spotId.setValue(spotId);
    }
  }
}
