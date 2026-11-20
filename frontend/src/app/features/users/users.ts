import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePencil, lucidePlus, lucideSearch } from '@ng-icons/lucide';
import { ApiService } from '../../core/api.service';
import { UserAccount, UserRole } from '../../core/models';
import { errorMessage } from '../../core/error';
import { formatShortDateTime } from '../../core/format';
import { roleBadgeClass, roleLabel } from '../../core/roles';
import { SessionService } from '../../core/session.service';
import { ToastService } from '../../core/toast.service';
import { EmptyState } from '../../shared/empty-state';
import { Modal } from '../../shared/modal';
import { PageHeader } from '../../shared/page-header';
import { PASSWORD_PATTERN } from '../../shared/validation';

@Component({
  selector: 'app-users',
  imports: [ReactiveFormsModule, NgIcon, EmptyState, Modal, PageHeader],
  providers: [provideIcons({ lucidePencil, lucidePlus, lucideSearch })],
  templateUrl: './users.html'
})
export class UsersPage implements OnInit {
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);
  private readonly session = inject(SessionService);

  protected readonly roles: UserRole[] = ['ADMIN', 'MANAGER', 'ATTENDANT'];
  protected readonly roleLabel = roleLabel;
  protected readonly roleBadgeClass = roleBadgeClass;
  protected readonly formatShortDateTime = formatShortDateTime;

  protected readonly users = signal<UserAccount[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);
  protected readonly query = signal('');
  protected readonly roleFilter = signal<UserRole | 'ALL'>('ALL');

  /** null = closed, 'new' = create, otherwise the account being edited. */
  protected readonly editing = signal<UserAccount | 'new' | null>(null);
  protected readonly saving = signal(false);
  protected readonly formError = signal<string | null>(null);
  protected readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(160)]],
    role: ['ATTENDANT' as UserRole, Validators.required],
    active: [true],
    password: ['', Validators.pattern(PASSWORD_PATTERN)]
  });

  protected readonly currentUserId = computed(() => this.session.user()?.id ?? null);
  protected readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    const role = this.roleFilter();
    return this.users().filter(
      u => (role === 'ALL' || u.role === role) && (!q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
    );
  });

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.api.getUsers().subscribe({
      next: users => {
        this.users.set(users);
        this.error.set(null);
        this.loading.set(false);
      },
      error: error => {
        this.error.set(errorMessage(error));
        this.loading.set(false);
      }
    });
  }

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected onRoleFilter(event: Event): void {
    this.roleFilter.set((event.target as HTMLSelectElement).value as UserRole | 'ALL');
  }

  protected openCreate(): void {
    this.form.reset({ name: '', email: '', role: 'ATTENDANT', active: true, password: '' });
    this.form.controls.email.enable();
    this.form.controls.password.setValidators([Validators.required, Validators.pattern(PASSWORD_PATTERN)]);
    this.form.controls.password.updateValueAndValidity();
    this.formError.set(null);
    this.editing.set('new');
  }

  protected openEdit(user: UserAccount): void {
    this.form.reset({ name: user.name, email: user.email, role: user.role, active: user.active, password: '' });
    this.form.controls.email.disable(); // email is not editable via UpdateUserRequest
    this.form.controls.password.setValidators(Validators.pattern(PASSWORD_PATTERN));
    this.form.controls.password.updateValueAndValidity();
    this.formError.set(null);
    this.editing.set(user);
  }

  protected invalid(name: 'name' | 'email' | 'password'): boolean {
    const control = this.form.controls[name];
    return control.invalid && control.touched;
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const target = this.editing();
    const v = this.form.getRawValue();
    const request =
      target === 'new'
        ? this.api.createUser({ name: v.name.trim(), email: v.email.trim(), password: v.password, role: v.role })
        : this.api.updateUser(target!.id, { name: v.name.trim(), role: v.role, active: v.active, newPassword: v.password || null });

    this.saving.set(true);
    this.formError.set(null);
    request.subscribe({
      next: saved => {
        this.saving.set(false);
        this.editing.set(null);
        this.users.update(list => (target === 'new' ? [...list, saved] : list.map(u => (u.id === saved.id ? saved : u))));
        if (saved.id === this.currentUserId()) {
          this.session.updateUser(saved);
        }
        this.toast.show(target === 'new' ? `Account created for ${saved.name}.` : `${saved.name} updated.`);
      },
      error: error => {
        this.saving.set(false);
        this.formError.set(errorMessage(error));
      }
    });
  }
}
