import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/auth-placeholder.component').then((m) => m.AuthPlaceholderComponent),
  },
];
