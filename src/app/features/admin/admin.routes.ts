import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/admin-placeholder.component').then((m) => m.AdminPlaceholderComponent),
  },
];
