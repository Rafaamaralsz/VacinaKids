import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage),
  },
  {
    path: 'criancas',
    loadComponent: () =>
      import('./pages/children/children.page').then((m) => m.ChildrenPage),
  },
  {
    path: 'criancas/nova',
    loadComponent: () =>
      import('./pages/child-form/child-form.page').then((m) => m.ChildFormPage),
  },
  {
    path: 'criancas/:id/editar',
    loadComponent: () =>
      import('./pages/child-form/child-form.page').then((m) => m.ChildFormPage),
  },
  {
    path: 'criancas/:id/historico',
    loadComponent: () =>
      import('./pages/vaccine-history/vaccine-history.page').then((m) => m.VaccineHistoryPage),
  },
  {
    path: 'criancas/:id',
    loadComponent: () =>
      import('./pages/child-detail/child-detail.page').then((m) => m.ChildDetailPage),
  },
  {
    path: 'campanhas',
    loadComponent: () =>
      import('./pages/campaigns/campaigns.page').then((m) => m.CampaignsPage),
  },
];
