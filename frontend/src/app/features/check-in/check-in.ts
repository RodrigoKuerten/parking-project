import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideCircleCheck, lucidePlus } from '@ng-icons/lucide';
import { ApiService } from '../../core/api.service';
import { OpenSession, ParkingSpot } from '../../core/models';
import { errorMessage } from '../../core/error';
import { formatCurrency, formatShortDateTime, isValidPlate, limitPlateLetter, normalizePlate } from '../../core/format';
import { ToastService } from '../../core/toast.service';
import { t, TranslationKey } from '../../core/i18n';
import { colorLabel } from '../../core/format';
import { PageHeader } from '../../shared/page-header';
import { Plate } from '../../shared/plate';
import { SpotTile } from '../../shared/spot-tile';

function plateValidator(control: AbstractControl<string>): ValidationErrors | null {
  return control.value && !isValidPlate(control.value) ? { plate: true } : null;
}

/** `value` is sent to the API in English; `key` only translates the button label. */
const COLORS: { value: string; key: TranslationKey }[] = [
  { value: 'White', key: 'color.White' },
  { value: 'Black', key: 'color.Black' },
  { value: 'Silver', key: 'color.Silver' },
  { value: 'Gray', key: 'color.Gray' },
  { value: 'Red', key: 'color.Red' },
  { value: 'Blue', key: 'color.Blue' },
  { value: 'Green', key: 'color.Green' },
  { value: 'Yellow', key: 'color.Yellow' },
  { value: 'Orange', key: 'color.Orange' },
  { value: 'Brown', key: 'color.Brown' },
  { value: 'Gold', key: 'color.Gold' },
  { value: 'Beige', key: 'color.Beige' },
  { value: 'Purple', key: 'color.Purple' }
];

@Component({
  selector: 'app-check-in',
  imports: [ReactiveFormsModule, RouterLink, NgIcon, PageHeader, Plate, SpotTile],
  providers: [provideIcons({ lucideArrowRight, lucideCircleCheck, lucidePlus })],
  templateUrl: './check-in.html'
})
export class CheckInPage implements OnInit {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);

  protected readonly t = t;
  protected readonly colorLabel = colorLabel;
  protected readonly colors = COLORS;
  protected readonly form = inject(FormBuilder).nonNullable.group({
    licensePlate: ['', [Validators.required, plateValidator]],
    model: ['', [Validators.required, Validators.maxLength(80)]],
    color: ['', [Validators.required, Validators.maxLength(30)]]
  });
  protected readonly spots = signal<ParkingSpot[]>([]);
  protected readonly spotsLoading = signal(true);
  protected readonly selectedSpotId = signal<number | null>(null);
  protected readonly saving = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly receipt = signal<OpenSession | null>(null);

  protected readonly available = computed(() => this.spots().filter(spot => spot.status === 'AVAILABLE'));
  protected readonly fmt = { formatCurrency, formatShortDateTime };

  ngOnInit(): void {
    this.loadSpots();
  }

  protected loadSpots(): void {
    this.spotsLoading.set(true);
    this.api.getSpots().subscribe({
      next: spots => {
        this.spots.set(spots);
        this.spotsLoading.set(false);
        const selected = this.selectedSpotId();
        if (selected !== null && !spots.some(spot => spot.id === selected && spot.status === 'AVAILABLE')) {
          this.selectedSpotId.set(null);
        }
      },
      error: () => this.spotsLoading.set(false)
    });
  }

  protected onPlateInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = limitPlateLetter(normalizePlate(input.value));
    this.form.controls.licensePlate.setValue(value);
    input.value = value;
  }

  protected toggleSpot(id: number): void {
    this.selectedSpotId.update(current => (current === id ? null : id));
  }

  protected invalid(name: 'licensePlate' | 'model' | 'color'): boolean {
    const control = this.form.controls[name];
    return control.invalid && control.touched;
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.saving.set(true);
    this.error.set(null);
    this.api
      .checkIn({ licensePlate: value.licensePlate, model: value.model.trim(), color: value.color.trim(), spotId: this.selectedSpotId() })
      .subscribe({
        next: session => {
          this.saving.set(false);
          this.receipt.set(session);
          this.toast.show(t('checkin.toast', { plate: session.licensePlate, spot: session.spotNumber }));
        },
        error: error => {
          this.saving.set(false);
          this.error.set(errorMessage(error));
          this.loadSpots();
        }
      });
  }

  protected reset(): void {
    this.receipt.set(null);
    this.selectedSpotId.set(null);
    this.form.reset();
    this.loadSpots();
  }
}
