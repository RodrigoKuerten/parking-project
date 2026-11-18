import { Component, OnInit, computed, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCircleAlert,
  lucideLoaderCircle,
  lucidePencil,
  lucideRefreshCw,
  lucideShieldCheck,
  lucideUserPlus,
  lucideUsers
} from '@ng-icons/lucide';
import { ApiService } from '../../core/api.service';
import { errorMessage } from '../../core/error';
import { formatShortDateTime } from '../../core/format';
import { UserAccount, UserRole } from '../../core/models';
import { roleBadgeClass, roleLabel } from '../../core/roles';
import { SessionService } from '../../core/session.service';
import { ToastService } from '../../core/toast.service';
import { ModalComponent } from '../../shared/modal';

function optionalPasswordPolicy(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string | null;
  if (!value) {
    return null;
  }
  if (value.length < 8 || value.length > 72) {
    return { passwordLength: true };
  }
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) {
    return { passwordStrength: true };
  }
  return null;
}

@Component({
  selector: 'app-users',
  imports: [ReactiveFormsModule, NgIcon, ModalComponent],
  viewProviders: [
    provideIcons({
      lucideCircleAlert,
      lucideLoaderCircle,
      lucidePencil,
      lucideRefreshCw,
      lucideShieldCheck,
      lucideUserPlus,
      lucideUsers
    })
  ],
  templateUrl: './users.html'
})
export class UsersComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly session = inject(SessionService);

  readonly users = signal<UserAccount[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly modalOpen = signal(false);
  readonly editing = signal<UserAccount | null>(null);
  readonly saving = signal(false);
  readonly formError = signal<string | null>(null);

  readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(160)]],
    role: ['ATTENDANT' as UserRole, [Validators.required]],
    active: [true],
    password: ['', [optionalPasswordPolicy]]
  });

  readonly activeCount = computed(() => this.users().filter(user => user.active).length);
  readonly adminCount = computed(() => this.users().filter(user => user.role === 'ADMIN').length);
  readonly managerCount = computed(() => this.users().filter(user => user.role === 'MANAGER').length);
  readonly isSelfEditing = computed(() => this.editing()?.id === this.session.user()?.id);

  readonly roleLabel = roleLabel;
  readonly roleBadgeClass = roleBadgeClass;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    this.api.getUsers().subscribe({
      next: users => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: error => {
        this.error.set(errorMessage(error));
        this.loading.set(false);
      }
    });
  }

  openCreate(): void {
    this.editing.set(null);
    this.form.reset({ name: '', email: '', role: 'ATTENDANT', active: true, password: '' });
    this.form.controls.email.enable();
    this.form.controls.role.enable();
    this.form.controls.active.enable();
    this.configurePassword(true);
    this.formError.set(null);
    this.modalOpen.set(true);
  }

  openEdit(user: UserAccount): void {
    this.editing.set(user);
    this.form.reset({
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active,
      password: ''
    });
    this.form.controls.email.disable();

    if (user.id === this.session.user()?.id) {
      this.form.controls.role.disable();
      this.form.controls.active.disable();
    } else {
      this.form.controls.role.enable();
      this.form.controls.active.enable();
    }

    this.configurePassword(false);
    this.formError.set(null);
    this.modalOpen.set(true);
  }

  closeModal(): void {
    if (!this.saving()) {
      this.modalOpen.set(false);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.saving.set(true);
    this.formError.set(null);

    if (this.editing()) {
      const target = this.editing()!;
      this.api.updateUser(target.id, {
        name: value.name.trim(),
        role: value.role,
        active: value.active,
        newPassword: value.password ? value.password : null
      }).subscribe({
        next: () => this.completeSave('User updated.'),
        error: error => {
          this.saving.set(false);
          this.formError.set(errorMessage(error));
        }
      });
    } else {
      this.api.createUser({
        name: value.name.trim(),
        email: value.email.trim(),
        password: value.password,
        role: value.role
      }).subscribe({
        next: () => this.completeSave('User created.'),
        error: error => {
          this.saving.set(false);
          this.formError.set(errorMessage(error));
        }
      });
    }
  }

  initials(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 0) {
      return '?';
    }
    return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
  }

  isCurrentUser(user: UserAccount): boolean {
    return user.id === this.session.user()?.id;
  }

  lastLogin(user: UserAccount): string {
    return user.lastLoginAt ? formatShortDateTime(user.lastLoginAt) : 'Never';
  }

  private configurePassword(required: boolean): void {
    const control = this.form.controls.password;
    control.setValidators(required ? [Validators.required, optionalPasswordPolicy] : [optionalPasswordPolicy]);
    control.updateValueAndValidity({ emitEvent: false });
  }

  private completeSave(message: string): void {
    this.saving.set(false);
    this.modalOpen.set(false);
    this.toast.show(message);
    this.load();
  }
}
