import { Component, input } from '@angular/core';

export interface Metric {
  label: string;
  value: string;
  hint?: string;
  tone?: 'free' | 'occupied' | 'neutral';
}

/** Row of stat cards (shadcn dashboard "section cards"): 2×2 on mobile, 4 across on desktop. */
@Component({
  selector: 'app-metric-strip',
  template: `
    <dl class="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      @for (metric of metrics(); track metric.label) {
        <div class="panel flex flex-col gap-1 p-4 sm:p-5">
          <dt class="flex items-center gap-2 text-[13px] text-muted">
            @if (metric.tone && metric.tone !== 'neutral') {
              <span class="dot" [class]="metric.tone === 'free' ? 'bg-success' : 'bg-danger'" aria-hidden="true"></span>
            }
            {{ metric.label }}
          </dt>
          @if (loading()) {
            <dd class="skeleton mt-1 h-8 w-20"></dd>
          } @else {
            <dd class="text-2xl font-semibold tracking-tight tabular-nums sm:text-[28px] sm:leading-9">{{ metric.value }}</dd>
          }
          @if (metric.hint) {
            <dd class="text-[13px] text-muted">{{ metric.hint }}</dd>
          }
        </div>
      }
    </dl>
  `
})
export class MetricStrip {
  readonly metrics = input.required<Metric[]>();
  readonly loading = input(false);
}
