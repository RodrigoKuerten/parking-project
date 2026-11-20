import { Component, inject } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleAlert, lucideCircleCheck, lucideInfo, lucideX } from '@ng-icons/lucide';
import { ToastService } from '../core/toast.service';
import { t } from '../core/i18n';

@Component({
  selector: 'app-toast-container',
  imports: [NgIcon],
  providers: [provideIcons({ lucideCircleAlert, lucideCircleCheck, lucideInfo, lucideX })],
  template: `
    <div
      class="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-stretch gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-96"
      aria-live="polite"
      role="status"
    >
      @for (toast of toasts.toasts(); track toast.id) {
        <div class="toast pointer-events-auto flex items-start gap-3 rounded-lg border border-border bg-background px-4 py-3 shadow-lg">
          <span class="mt-px" [class]="toneClass[toast.tone]">
            <ng-icon [name]="toneIcon[toast.tone]" size="18" aria-hidden="true" />
          </span>
          <p class="flex-1 text-sm text-foreground">{{ toast.message }}</p>
          <button type="button" class="-m-1 rounded-md p-1 text-muted hover:text-foreground" [attr.aria-label]="t('toast.dismiss')" (click)="toasts.dismiss(toast.id)">
            <ng-icon name="lucideX" size="16" />
          </button>
        </div>
      }
    </div>
  `,
  styles: `
    .toast { animation: toast-in 200ms var(--ease-enter) both; }
    @keyframes toast-in { from { opacity: 0; transform: translateY(6px); } }
  `
})
export class ToastContainer {
  protected readonly toasts = inject(ToastService);
  protected readonly t = t;
  protected readonly toneIcon = { success: 'lucideCircleCheck', error: 'lucideCircleAlert', info: 'lucideInfo' } as const;
  protected readonly toneClass = { success: 'text-success', error: 'text-danger', info: 'text-info' } as const;
}
