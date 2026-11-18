import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowRight,
  lucideCircleAlert,
  lucideEye,
  lucideEyeOff,
  lucideGauge,
  lucideKeyRound,
  lucideLoaderCircle,
  lucideLockKeyhole,
  lucideShieldCheck,
  lucideSquareParking,
  lucideUsers
} from '@ng-icons/lucide';
import { AuthService } from '../../core/auth.service';
import { errorMessage } from '../../core/error';
import { UserRole } from '../../core/models';

interface DemoAccount {
  label: string;
  email: string;
  password: string;
  role: UserRole;
}

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgIcon],
  viewProviders: [
    provideIcons({
      lucideArrowRight,
      lucideCircleAlert,
      lucideEye,
      lucideEyeOff,
      lucideGauge,
      lucideKeyRound,
      lucideLoaderCircle,
      lucideLockKeyhole,
      lucideShieldCheck,
      lucideSquareParking,
      lucideUsers
    })
  ],
  templateUrl: './login.html'
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly form = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  readonly submitting = signal(false);
  readonly error = signal<string | null>(null);
  readonly showPassword = signal(false);

  readonly demoAccounts: DemoAccount[] = [
    {
      label: 'Administrator',
      email: 'admin@patio.local',
      password: 'Admin@123',
      role: 'ADMIN'
    },
    {
      label: 'Manager',
      email: 'manager@patio.local',
      password: 'Manager@123',
      role: 'MANAGER'
    },
    {
      label: 'Attendant',
      email: 'attendant@patio.local',
      password: 'Attendant@123',
      role: 'ATTENDANT'
    }
  ];

  togglePassword(): void {
    this.showPassword.update(value => !value);
  }

  fill(account: DemoAccount): void {
    this.form.setValue({ email: account.email, password: account.password });
    this.error.set(null);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const credentials = this.form.getRawValue();
    this.submitting.set(true);
    this.error.set(null);

    this.auth.login(credentials.email.trim(), credentials.password).subscribe({
      next: () => {
        this.submitting.set(false);
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        const target = returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//')
          ? returnUrl
          : '/dashboard';
        void this.router.navigateByUrl(target);
      },
      error: error => {
        this.submitting.set(false);
        this.error.set(errorMessage(error));
      }
    });
  }
}
