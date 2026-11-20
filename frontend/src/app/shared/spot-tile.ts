import { Component, computed, input } from '@angular/core';
import { ParkingSpot } from '../core/models';

/** One parking bay. Status shown by dot AND text, never colour alone. */
@Component({
  selector: 'app-spot-tile',
  host: { class: 'block' },
  template: `
    <div
      class="flex h-full min-h-[72px] flex-col justify-between rounded-lg border px-3 py-2.5 transition-colors duration-150"
      [class]="selected() ? 'border-foreground bg-background ring-[3px] ring-foreground/10' : occupied() ? 'border-border bg-subtle' : 'border-border bg-background hover:bg-accent/50'"
    >
      <span class="data text-sm font-medium">{{ spot().number }}</span>
      <span class="flex items-center gap-1.5 text-xs" [class]="occupied() ? 'text-foreground' : 'text-muted'">
        <span class="dot" [class]="occupied() ? 'bg-danger' : 'bg-success'" aria-hidden="true"></span>
        @if (occupied()) {
          <span class="data truncate">{{ spot().licensePlate ?? 'Occupied' }}</span>
        } @else {
          Free
        }
      </span>
    </div>
  `
})
export class SpotTile {
  readonly spot = input.required<ParkingSpot>();
  readonly selected = input(false);
  protected readonly occupied = computed(() => this.spot().status === 'OCCUPIED');
}
