import { Component, input } from '@angular/core';

/** License plate shown as a mono "code" chip. */
@Component({
  selector: 'app-plate',
  host: { class: 'inline-flex' },
  template: `
    <span
      class="inline-flex items-center rounded-md border border-border bg-subtle font-mono font-medium tracking-wide text-foreground"
      [class]="size() === 'lg' ? 'h-9 px-3 text-lg' : 'h-6 px-1.5 text-[13px]'"
    >{{ value() }}</span>
  `
})
export class Plate {
  readonly value = input.required<string>();
  readonly size = input<'sm' | 'lg'>('sm');
}
