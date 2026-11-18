import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleAlert, lucideCircleCheck, lucideInfo, lucideX } from '@ng-icons/lucide';
import { ToastTone } from '../core/models';
import { ToastService } from '../core/toast.service';

@Component({
  selector: 'app-toast-container',
  imports: [NgIcon],
  viewProviders: [provideIcons({ lucideCircleAlert, lucideCircleCheck, lucideInfo, lucideX })],
  template: `
    <div
      class="fixed bottom-4 right-4 z-50 flex w-[min(92vw,380px)] flex-col gap-2"
      aria-live="polite"
    >
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="flex items-start gap-3 border border-line border-l-[3px] bg-surface p-3 shadow-lg"
          [class.border-l-available]="toast.tone === 'success'"
          [class.border-l-occupied]="toast.tone === 'error'"
          [class.border-l-plate]="toast.tone === 'info'"
          [attr.role]="toast.tone === 'error' ? 'alert' : 'status'"
        >
          <ng-icon
            [name]="iconFor(toast.tone)"
            size="18"
            class="mt-0.5 shrink-0"
            [class.text-available]="toast.tone === 'success'"
            [class.text-occupied]="toast.tone === 'error'"
            [class.text-plate]="toast.tone === 'info'"
          />
          <p class="flex-1 text-sm leading-snug text-ink">{{ toast.message }}</p>
          <button
            type="button"
            class="-mr-1 -mt-1 rounded-[3px] p-1 text-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
            aria-label="Dismiss notification"
            (click)="toastService.dismiss(toast.id)"
          >
            <ng-icon name="lucideX" size="15" />
          </button>
        </div>
      }
    </div>
  `
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);

  iconFor(tone: ToastTone): string {
    if (tone === 'error') {
      return 'lucideCircleAlert';
    }
    if (tone === 'info') {
      return 'lucideInfo';
    }
    return 'lucideCircleCheck';
  }
}
