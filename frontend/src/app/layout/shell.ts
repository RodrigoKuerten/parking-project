import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCar,
  lucideHistory,
  lucideKeyRound,
  lucideLayoutDashboard,
  lucideLogIn,
  lucideLogOut,
  lucideMenu,
  lucidePlus,
  lucideSettings,
  lucideSquareParking,
  lucideTag,
  lucideUsers,
  lucideX
} from '@ng-icons/lucide';
import { AuthService } from '../core/auth.service';
import { SessionService } from '../core/session.service';
import { UserRole } from '../core/models';
import { roleLabel } from '../core/roles';
import { intlLocale, t, TranslationKey } from '../core/i18n';
import { ChangePasswordDialog } from './change-password-dialog';

interface NavItem {
  path: string;
  label: TranslationKey;
  icon: string;
  roles?: UserRole[];
}

const NAV: { section: TranslationKey; items: NavItem[] }[] = [
  {
    section: 'nav.operation',
    items: [
      { path: '/dashboard', label: 'nav.dashboard', icon: 'lucideLayoutDashboard' },
      { path: '/check-in', label: 'nav.checkIn', icon: 'lucideLogIn' },
      { path: '/yard', label: 'nav.yard', icon: 'lucideCar' },
      { path: '/spots', label: 'nav.spots', icon: 'lucideSquareParking' }
    ]
  },
  {
    section: 'nav.records',
    items: [
      { path: '/history', label: 'nav.history', icon: 'lucideHistory' },
      { path: '/pricing', label: 'nav.pricing', icon: 'lucideTag' },
      { path: '/users', label: 'nav.users', icon: 'lucideUsers', roles: ['ADMIN'] }
    ]
  }
];

const SETTINGS_ITEM: NavItem = { path: '/settings', label: 'nav.settings', icon: 'lucideSettings' };
const ALL_ITEMS = [...NAV.flatMap(group => group.items), SETTINGS_ITEM];

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIcon, ChangePasswordDialog],
  providers: [
    provideIcons({
      lucideCar,
      lucideHistory,
      lucideKeyRound,
      lucideLayoutDashboard,
      lucideLogIn,
      lucideLogOut,
      lucideMenu,
      lucidePlus,
      lucideSettings,
      lucideSquareParking,
      lucideTag,
      lucideUsers,
      lucideX
    })
  ],
  host: { '(document:keydown.escape)': 'menuOpen.set(false)' },
  templateUrl: './shell.html'
})
export class Shell implements OnInit {
  private readonly session = inject(SessionService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly t = t;
  protected readonly settingsItem = SETTINGS_ITEM;
  protected readonly user = this.session.user;
  protected readonly roleLabel = computed(() => roleLabel(this.session.role()));
  protected readonly initials = computed(() =>
    (this.user()?.name ?? '?')
      .split(/\s+/)
      .slice(0, 2)
      .map(part => part[0]?.toUpperCase() ?? '')
      .join('')
  );
  protected readonly nav = computed(() =>
    NAV.map(group => ({
      ...group,
      items: group.items.filter(item => !item.roles || this.session.hasAnyRole(...item.roles))
    }))
  );
  private readonly url = signal(this.router.url);
  protected readonly pageTitle = computed(() => {
    const item = ALL_ITEMS.find(entry => this.url().startsWith(entry.path));
    return item ? t(item.label) : 'Patio';
  });
  protected readonly menuOpen = signal(false);
  protected readonly passwordOpen = signal(false);
  protected readonly now = signal(new Date());
  protected readonly clock = computed(() =>
    this.now().toLocaleTimeString(intlLocale(), { hour: '2-digit', minute: '2-digit' })
  );
  protected readonly today = computed(() =>
    this.now().toLocaleDateString(intlLocale(), { weekday: 'short', month: 'short', day: '2-digit' })
  );

  ngOnInit(): void {
    const timer = setInterval(() => this.now.set(new Date()), 15_000);
    this.destroyRef.onDestroy(() => clearInterval(timer));

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.menuOpen.set(false);
        this.url.set(this.router.url);
      });

    // Keep role/active flag in sync with the server; a 401 is handled by the interceptor.
    this.auth.refreshSession().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({ error: () => undefined });
  }

  protected logout(): void {
    this.auth.logout();
    void this.router.navigate(['/login']);
  }
}
