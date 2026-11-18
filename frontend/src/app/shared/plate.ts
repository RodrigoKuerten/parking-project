import { Component, input } from '@angular/core';

@Component({
  selector: 'app-plate',
  template: `
    <span
      class="inline-flex flex-col overflow-hidden rounded-[3px] border border-line bg-white align-middle"
      [title]="'License plate ' + value()"
    >
      <span class="h-[3px] w-full bg-plate"></span>
      <span
        class="font-mono font-semibold tracking-[0.14em] text-ink"
        [class]="size() === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-sm'"
      >
        {{ value() }}
      </span>
    </span>
  `
})
export class PlateComponent {
  readonly value = input.required<string>();
  readonly size = input<'sm' | 'md'>('sm');
}
