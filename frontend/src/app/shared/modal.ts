import { AfterViewInit, Component, ElementRef, OnDestroy, input, output, viewChild } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideX } from '@ng-icons/lucide';

@Component({
  selector: 'app-modal',
  imports: [NgIcon],
  viewProviders: [provideIcons({ lucideX })],
  template: `
    <dialog
      #dialog
      class="m-auto max-h-[90vh] w-[calc(100%-2rem)] overflow-y-auto rounded-card border border-line bg-surface p-0 text-ink shadow-2xl"
      [class.max-w-lg]="!wide()"
      [class.max-w-2xl]="wide()"
      aria-labelledby="dialog-title"
      (cancel)="onCancel($event)"
      (click)="onBackdrop($event)"
    >
      <div class="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
        <div>
          <h2 id="dialog-title" class="text-lg font-semibold tracking-tight">{{ title() }}</h2>
          @if (subtitle()) {
            <p class="mt-0.5 text-xs text-muted">{{ subtitle() }}</p>
          }
        </div>
        <button
          type="button"
          class="-mr-1 -mt-1 rounded-[3px] p-1.5 text-muted transition-colors hover:bg-paper hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal"
          aria-label="Close dialog"
          (click)="close()"
        >
          <ng-icon name="lucideX" size="18" />
        </button>
      </div>
      <div class="p-5 sm:p-6">
        <ng-content />
      </div>
    </dialog>
  `
})
export class ModalComponent implements AfterViewInit, OnDestroy {
  readonly title = input.required<string>();
  readonly subtitle = input<string>('');
  readonly wide = input(false);
  readonly closed = output<void>();

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  ngAfterViewInit(): void {
    this.dialog().nativeElement.showModal();
    document.body.classList.add('overflow-hidden');
  }

  ngOnDestroy(): void {
    document.body.classList.remove('overflow-hidden');
  }

  close(): void {
    const dialog = this.dialog().nativeElement;
    if (dialog.open) {
      dialog.close();
    }
    document.body.classList.remove('overflow-hidden');
    this.closed.emit();
  }

  onCancel(event: Event): void {
    event.preventDefault();
    this.close();
  }

  onBackdrop(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) {
      this.close();
    }
  }
}
