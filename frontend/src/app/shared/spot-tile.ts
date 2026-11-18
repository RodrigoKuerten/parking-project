import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ParkingSpot } from '../core/models';
import { PlateComponent } from './plate';

@Component({
  selector: 'app-spot-tile',
  imports: [RouterLink, PlateComponent],
  template: `
    <a
      [routerLink]="spot().status === 'AVAILABLE' ? ['/check-in'] : ['/yard']"
      [queryParams]="spot().status === 'AVAILABLE' ? { spot: spot().id } : {}"
      [attr.aria-label]="ariaLabel()"
      [class]="
        'group flex flex-col justify-between border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 ' +
        (dense() ? 'min-h-[70px] p-2 ' : 'min-h-[116px] p-4 ') +
        (spot().status === 'AVAILABLE'
          ? 'border-line bg-surface hover:border-available/60 hover:bg-available-soft/40'
          : 'border-asphalt bg-asphalt text-white hover:bg-asphalt-soft')
      "
    >
      <div class="flex items-start justify-between gap-2">
        <span
          class="font-mono font-semibold tabular-nums leading-none"
          [class]="dense() ? 'text-sm' : 'text-xl'"
        >
          {{ spot().number }}
        </span>
        <span
          class="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full"
          [class]="spot().status === 'AVAILABLE' ? 'bg-available' : 'bg-signal'"
        ></span>
      </div>

      <div class="mt-2">
        @if (spot().status === 'AVAILABLE') {
          <span class="text-[11px] font-medium text-available">Free</span>
        } @else if (dense()) {
          <span class="block truncate font-mono text-[9px] font-semibold tracking-[0.04em] text-signal">
            {{ spot().licensePlate }}
          </span>
        } @else {
          <app-plate [value]="spot().licensePlate ?? 'OCCUPIED'" size="md" />
        }
      </div>
    </a>
  `
})
export class SpotTileComponent {
  readonly spot = input.required<ParkingSpot>();
  readonly dense = input(false);

  readonly ariaLabel = computed(() => {
    const current = this.spot();
    return current.status === 'AVAILABLE'
      ? `Check in to spot ${current.number}`
      : `Spot ${current.number} occupied by ${current.licensePlate}. Open the yard.`;
  });
}
