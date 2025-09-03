import { Routes } from '@angular/router';

export const TODOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/todo-list.component').then((m) => m.TodoListComponent),
  },
];
