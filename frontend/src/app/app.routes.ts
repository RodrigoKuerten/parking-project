import { Routes } from '@angular/router';
import { authGuard, guestGuard, roleGuard } from './core/guards';
import { ShellComponent } from './layout/shell';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/login/login').then(module => module.LoginComponent)
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then(module => module.DashboardComponent)
      },
      {
        path: 'check-in',
        loadComponent: () => import('./features/check-in/check-in').then(module => module.CheckInComponent)
      },
      {
        path: 'yard',
        loadComponent: () => import('./features/yard/yard').then(module => module.YardComponent)
      },
      {
        path: 'spots',
        loadComponent: () => import('./features/spots/spots').then(module => module.SpotsComponent)
      },
      {
        path: 'history',
        loadComponent: () => import('./features/history/history').then(module => module.HistoryComponent)
      },
      {
        path: 'pricing',
        loadComponent: () => import('./features/pricing/pricing').then(module => module.PricingComponent)
      },
      {
        path: 'users',
        canActivate: [roleGuard('ADMIN')],
        loadComponent: () => import('./features/users/users').then(module => module.UsersComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
