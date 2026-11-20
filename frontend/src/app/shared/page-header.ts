import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  template: `
    <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-[28px] leading-tight font-semibold tracking-[-0.03em] sm:text-[32px]">{{ title() }}</h1>
        @if (description()) {
          <p class="mt-1.5 max-w-2xl text-[15px] text-muted">{{ description() }}</p>
        }
      </div>
      <div class="flex flex-wrap gap-2 empty:hidden"><ng-content /></div>
    </div>
  `
})
export class PageHeader {
  readonly title = input.required<string>();
  readonly description = input<string>();
}
