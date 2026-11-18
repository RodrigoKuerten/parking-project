import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCarFront,
  lucideHistory,
  lucideLayoutDashboard,
  lucideLogIn,
  lucideLogOut,
  lucideMenu,
  lucidePlus,
  lucideSlidersHorizontal,
  lucideSquareParking,
  lucideUsers,
  lucideX
} from '@ng-icons/lucide';
import { filter } from 'rxjs';
import { AuthService } from '../core/auth.service';
import { formatLongDate } from '../core/format';
import { UserRole } from '../core/models';
import { roleLabel } from '../core/roles';
import { SessionService } from '../core/session.service';
import { ToastService } from '../core/toast.service';
import { ToastContainerComponent } from '../shared/toast-container';

interface NavItem {
  label: string;
  path: string;
  icon: string;
  roles?: UserRole[];
}

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIcon, ToastContainerComponent],
  viewProviders: [
    provideIcons({
      lucideCarFront,
      lucideHistory,
      lucideLayoutDashboard,
      lucideLogIn,
      lucideLogOut,
      lucideMenu,
      lucidePlus,
      lucideSlidersHorizontal,
      lucideSquareParking,
      lucideUsers,
      lucideX
    })
  ],
  templateUrl: './shell.html'
})
export class ShellComponent {
  private readonly router = inject(Router);
  private readonly session = inject(SessionService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  readonly navItems: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: 'lucideLayoutDashboard' },
    { label: 'Check in', path: '/check-in', icon: 'lucideLogIn' },
    { label: 'Yard', path: '/yard', icon: 'lucideCarFront' },
    { label: 'Spots', path: '/spots', icon: 'lucideSquareParking' },
    { label: 'History', path: '/history', icon: 'lucideHistory' },
    { label: 'Pricing', path: '/pricing', icon: 'lucideSlidersHorizontal' },
    { label: 'Users', path: '/users', icon: 'lucideUsers', roles: ['ADMIN'] }
  ];

  readonly today = formatLongDate(new Date());
  readonly mobileOpen = signal(false);
  readonly pageTitle = signal('Dashboard');
  readonly user = this.session.user;
  readonly roleLabel = roleLabel;
  readonly visibleNav = computed(() =>
    this.navItems.filter(item => !item.roles || this.session.hasAnyRole(...item.roles))
  );
  readonly initials = computed(() => {
    const name = this.session.user()?.name?.trim();
    if (!name) {
      return '?';
    }
    const parts = name.split(/\s+/);
    return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
  });

  constructor() {
    this.setPageTitle(this.router.url);
    if (this.session.isAuthenticated()) {
      this.auth.refreshSession().subscribe({ error: () => undefined });
    }
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe(event => {
        this.setPageTitle(event.urlAfterRedirects);
        this.mobileOpen.set(false);
      });
  }

  logout(): void {
    this.auth.logout();
    this.toast.show('Signed out.', 'info');
    void this.router.navigate(['/login']);
  }

  private setPageTitle(url: string): void {
    const path = url.split('?')[0];
    const item = this.navItems.find(navItem => path.startsWith(navItem.path));
    this.pageTitle.set(item?.label ?? 'Dashboard');
  }
}
