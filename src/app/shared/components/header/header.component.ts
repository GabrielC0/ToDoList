import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  template: `
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-xl font-semibold text-gray-900">
              <a routerLink="/" class="hover:text-blue-600 transition-colors"> ToDoList </a>
            </h1>
          </div>

          <nav class="flex items-center space-x-6">
            <a routerLink="/todos" class="text-gray-600 hover:text-blue-600 transition-colors">
              Mes tâches
            </a>
            <a routerLink="/admin" class="text-gray-600 hover:text-blue-600 transition-colors">
              Admin
            </a>
            <button
              (click)="logout()"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Déconnexion
            </button>
          </nav>
        </div>
      </div>
    </header>
  `,
  styles: [],
})
export class HeaderComponent {
  logout(): void {
    // TODO: Implémenter la logique de déconnexion
    // console.log('Déconnexion');
  }
}
