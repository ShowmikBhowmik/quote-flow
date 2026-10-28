import { Routes } from '@angular/router';
import { stepGuard } from './core/quote.guards';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'quote' },
  {
    path: 'quote',
    loadComponent: () => import('./features/quote/quote-shell.component').then((m) => m.QuoteShell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'business' },
      {
        path: 'business',
        title: 'Your business · Quote Flow',
        loadComponent: () => import('./features/quote/steps/business-step.component').then((m) => m.BusinessStep),
      },
      {
        path: 'location',
        title: 'Location & payroll · Quote Flow',
        canActivate: [stepGuard('location')],
        loadComponent: () => import('./features/quote/steps/location-step.component').then((m) => m.LocationStep),
      },
      {
        path: 'coverage',
        title: 'Coverage · Quote Flow',
        canActivate: [stepGuard('coverage')],
        loadComponent: () => import('./features/quote/steps/coverage-step.component').then((m) => m.CoverageStep),
      },
      {
        path: 'summary',
        title: 'Review & bind · Quote Flow',
        canActivate: [stepGuard('summary')],
        loadComponent: () => import('./features/quote/steps/summary-step.component').then((m) => m.SummaryStep),
      },
      {
        path: 'bound',
        title: 'Policy bound · Quote Flow',
        canActivate: [stepGuard('bound')],
        loadComponent: () => import('./features/quote/steps/bound-step.component').then((m) => m.BoundStep),
      },
    ],
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard-shell.component').then((m) => m.DashboardShell),
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'policies' },
      { path: 'policies', title: 'Policies · Quote Flow', loadComponent: () => import('./features/dashboard/policies.component').then((m) => m.Policies) },
      { path: 'invoices', title: 'Invoices · Quote Flow', loadComponent: () => import('./features/dashboard/invoices.component').then((m) => m.Invoices) },
      { path: 'claims', title: 'Claims · Quote Flow', loadComponent: () => import('./features/dashboard/claims.component').then((m) => m.Claims) },
    ],
  },
  { path: '**', redirectTo: 'quote' },
];
