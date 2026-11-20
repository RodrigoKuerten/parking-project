import { Routes } from '@angular/router';
import { authGuard, guestGuard, roleGuard } from './core/guards';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    title: 'Sign in · Patio',
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
        title: 'Dashboard · Patio',
        loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardPage)
      },
      {
        path: 'check-in',
        title: 'Check-in · Patio',
        loadComponent: () => import('./features/check-in/check-in').then(m => m.CheckInPage)
      },
      {
        path: 'yard',
        title: 'Yard · Patio',
        loadComponent: () => import('./features/yard/yard').then(m => m.YardPage)
      },
      {
        path: 'spots',
        title: 'Spots · Patio',
        loadComponent: () => import('./features/spots/spots').then(m => m.SpotsPage)
      },
      {
        path: 'history',
        title: 'History · Patio',
        loadComponent: () => import('./features/history/history').then(m => m.HistoryPage)
      },
      {
        path: 'pricing',
        title: 'Pricing · Patio',
        loadComponent: () => import('./features/pricing/pricing').then(m => m.PricingPage)
      },
      {
        path: 'users',
        title: 'Users · Patio',
        canActivate: [roleGuard('ADMIN')],
        loadComponent: () => import('./features/users/users').then(m => m.UsersPage)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
