import { Component, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleAlert, lucideInbox, lucideSearch } from '@ng-icons/lucide';

/** shadcn "Empty": small icon + title + one line + optional action. */
@Component({
  selector: 'app-empty-state',
  imports: [NgIcon],
  providers: [provideIcons({ lucideInbox, lucideSearch, lucideCircleAlert })],
  template: `
    <div class="flex flex-col items-center px-6 py-14 text-center">
      <span
        class="mb-4 grid size-10 place-items-center rounded-lg"
        [class]="tone() === 'error' ? 'bg-danger/10 text-danger' : 'bg-accent text-foreground'"
      >
        <ng-icon [name]="icon()" size="20" aria-hidden="true" />
      </span>
      <p class="text-base font-medium tracking-tight">{{ title() }}</p>
      @if (description()) {
        <p class="mt-1 max-w-sm text-sm text-muted">{{ description() }}</p>
      }
      <div class="mt-5 empty:hidden"><ng-content /></div>
    </div>
  `
})
export class EmptyState {
  readonly title = input.required<string>();
  readonly description = input<string>();
  readonly icon = input<'lucideInbox' | 'lucideSearch' | 'lucideCircleAlert'>('lucideInbox');
  readonly tone = input<'neutral' | 'error'>('neutral');
}
