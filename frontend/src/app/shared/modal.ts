import { Component, ElementRef, OnDestroy, OnInit, input, output, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';
import { t } from '../core/i18n';

let sequence = 0;
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Dialog with backdrop, Esc, scroll lock, focus trap and focus return (audit §4.5 Modais). */
@Component({
  selector: 'app-modal',
  imports: [NgIcon],
  providers: [provideIcons({ lucideX })],
  host: { '(document:keydown)': 'onKeydown($event)' },
  template: `
    <div class="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div class="absolute inset-0 bg-black/50 backdrop-enter" (click)="closed.emit()" aria-hidden="true"></div>
      <section
        #dialog
        role="dialog"
        aria-modal="true"
        [attr.aria-labelledby]="titleId"
        class="dialog-enter relative flex max-h-[92dvh] w-full flex-col rounded-t-xl border border-border bg-background shadow-lg sm:rounded-xl"
        [class.sm:max-w-md]="size() === 'sm'"
        [class.sm:max-w-lg]="size() === 'md'"
      >
        <header class="flex items-start justify-between gap-4 px-6 pt-6 pb-2">
          <div>
            @if (eyebrow()) {
              <p class="eyebrow mb-1">{{ eyebrow() }}</p>
            }
            <h2 [id]="titleId" class="text-lg leading-none font-semibold tracking-tight">{{ heading() }}</h2>
          </div>
          <button type="button" class="btn btn-ghost btn-icon -mr-2 -mt-1" [attr.aria-label]="t('modal.close')" (click)="closed.emit()">
            <ng-icon name="lucideX" size="18" />
          </button>
        </header>
        <div class="overflow-y-auto px-6 py-4"><ng-content /></div>
        <ng-content select="[modal-footer]" />
      </section>
    </div>
  `,
  styles: `
    .backdrop-enter { animation: fade 200ms var(--ease-standard) both; }
    .dialog-enter { animation: rise 220ms var(--ease-enter) both; }
    @keyframes fade { from { opacity: 0; } }
    @keyframes rise { from { opacity: 0; transform: translateY(8px); } }
  `
})
export class Modal implements OnInit, OnDestroy {
  readonly heading = input.required<string>();
  readonly eyebrow = input<string>();
  readonly size = input<'sm' | 'md'>('md');
  readonly closed = output<void>();

  protected readonly t = t;
  protected readonly titleId = `modal-title-${++sequence}`;
  private readonly dialog = viewChild.required<ElementRef<HTMLElement>>('dialog');
  private readonly opener = document.activeElement as HTMLElement | null;

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
    queueMicrotask(() => {
      const root = this.dialog().nativeElement;
      const target = root.querySelector<HTMLElement>('[autofocus]') ?? this.focusables()[1] ?? this.focusables()[0];
      target?.focus();
    });
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
    this.opener?.focus?.();
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closed.emit();
      return;
    }
    if (event.key !== 'Tab') {
      return;
    }
    const items = this.focusables();
    if (items.length === 0) {
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  private focusables(): HTMLElement[] {
    return Array.from(this.dialog().nativeElement.querySelectorAll<HTMLElement>(FOCUSABLE));
  }
}
