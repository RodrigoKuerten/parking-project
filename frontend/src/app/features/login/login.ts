import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideEye, lucideEyeOff, lucideSquareParking } from '@ng-icons/lucide';
import { AuthService } from '../../core/auth.service';
import { errorMessage } from '../../core/error';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgIcon],
  providers: [provideIcons({ lucideArrowRight, lucideEye, lucideEyeOff, lucideSquareParking })],
  templateUrl: './login.html'
})
export class LoginPage {
  /** Bound from the query string by withComponentInputBinding. */
  readonly returnUrl = input<string>();

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly form = inject(FormBuilder).nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly showPassword = signal(false);

  protected invalid(name: 'email' | 'password'): boolean {
    const control = this.form.controls[name];
    return control.invalid && control.touched;
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { email, password } = this.form.getRawValue();
    this.loading.set(true);
    this.error.set(null);
    this.auth.login(email.trim(), password).subscribe({
      next: () => {
        // Only follow internal paths to avoid an open redirect.
        const target = this.returnUrl();
        const safe = target && target.startsWith('/') && !target.startsWith('//') ? target : '/dashboard';
        void this.router.navigateByUrl(safe);
      },
      error: error => {
        this.loading.set(false);
        this.error.set(errorMessage(error));
      }
    });
  }
}
