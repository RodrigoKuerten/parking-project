import { Component, inject, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { ToastService } from '../core/toast.service';
import { errorMessage } from '../core/error';
import { Modal } from '../shared/modal';
import { PASSWORD_PATTERN } from '../shared/validation';

@Component({
  selector: 'app-change-password-dialog',
  imports: [Modal, ReactiveFormsModule],
  template: `
    <app-modal heading="Change password" size="sm" (closed)="closed.emit()">
      <form id="password-form" [formGroup]="form" (ngSubmit)="submit()" novalidate class="space-y-4">
        @if (serverError()) {
          <p class="alert-error" role="alert">{{ serverError() }}</p>
        }
        <div>
          <label class="field-label" for="current-password">Current password</label>
          <input id="current-password" class="field" type="password" autocomplete="current-password" formControlName="currentPassword" autofocus
            [attr.aria-invalid]="invalid('currentPassword')" />
          @if (invalid('currentPassword')) {
            <p class="field-error">Enter your current password.</p>
          }
        </div>
        <div>
          <label class="field-label" for="new-password">New password</label>
          <input id="new-password" class="field" type="password" autocomplete="new-password" formControlName="newPassword"
            aria-describedby="new-password-hint" [attr.aria-invalid]="invalid('newPassword')" />
          @if (invalid('newPassword')) {
            <p class="field-error">Use 8–72 characters with at least one letter and one number.</p>
          } @else {
            <p id="new-password-hint" class="field-hint">8–72 characters, at least one letter and one number.</p>
          }
        </div>
      </form>
      <footer modal-footer class="flex flex-col-reverse gap-2 px-6 pt-2 pb-6 sm:flex-row sm:justify-end">
        <button type="button" class="btn btn-secondary" (click)="closed.emit()">Cancel</button>
        <button type="submit" form="password-form" class="btn btn-primary" [disabled]="saving()">
          {{ saving() ? 'Saving…' : 'Update password' }}
        </button>
      </footer>
    </app-modal>
  `
})
export class ChangePasswordDialog {
  readonly closed = output<void>();

  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  protected readonly form = inject(FormBuilder).nonNullable.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.pattern(PASSWORD_PATTERN)]]
  });
  protected readonly saving = signal(false);
  protected readonly serverError = signal<string | null>(null);

  protected invalid(name: 'currentPassword' | 'newPassword'): boolean {
    const control = this.form.controls[name];
    return control.invalid && control.touched;
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { currentPassword, newPassword } = this.form.getRawValue();
    this.saving.set(true);
    this.serverError.set(null);
    this.auth.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.toast.show('Password updated.');
        this.closed.emit();
      },
      error: error => {
        this.saving.set(false);
        this.serverError.set(errorMessage(error));
      }
    });
  }
}
