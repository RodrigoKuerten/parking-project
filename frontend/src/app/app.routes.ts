import { Routes } from '@angular/router';
import { authGuard, guestGuard, roleGuard } from './core/guards';
import { t } from './core/i18n';

/** Page titles follow the active language; Angular re-evaluates them on each navigation. */
const pageTitle = (key: Parameters<typeof t>[0]) => () => `${t(key)} · Patio`;

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    title: pageTitle('login.signIn'),
    loadComponent: () => import('./features/login/login').then(m => m.LoginPage)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/shell').then(m => m.Shell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        title: pageTitle('nav.dashboard'),
        loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardPage)
      },
      {
        path: 'check-in',
        title: pageTitle('nav.checkIn'),
        loadComponent: () => import('./features/check-in/check-in').then(m => m.CheckInPage)
      },
      {
        path: 'yard',
        title: pageTitle('nav.yard'),
        loadComponent: () => import('./features/yard/yard').then(m => m.YardPage)
      },
      {
        path: 'spots',
        title: pageTitle('nav.spots'),
        loadComponent: () => import('./features/spots/spots').then(m => m.SpotsPage)
      },
      {
        path: 'history',
        title: pageTitle('nav.history'),
        loadComponent: () => import('./features/history/history').then(m => m.HistoryPage)
      },
      {
        path: 'pricing',
        title: pageTitle('nav.pricing'),
        loadComponent: () => import('./features/pricing/pricing').then(m => m.PricingPage)
      },
      {
        path: 'users',
        title: pageTitle('nav.users'),
        canActivate: [roleGuard('ADMIN')],
        loadComponent: () => import('./features/users/users').then(m => m.UsersPage)
      },
      {
        path: 'settings',
        title: pageTitle('nav.settings'),
        loadComponent: () => import('./features/settings/settings').then(m => m.SettingsPage)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
