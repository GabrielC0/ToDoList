import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-placeholder',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      <h1 class="text-2xl font-bold text-gray-900 mb-6 text-center">Administration</h1>

      <div class="space-y-4">
        <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p class="text-yellow-800 text-sm">
            Cette page d'administration sera implémentée plus tard.
          </p>
        </div>

        <a
          routerLink="/todos"
          class="block w-full text-center px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
        >
          Retour aux tâches
        </a>
      </div>
    </div>
  `,
  styles: [],
})
export class AdminPlaceholderComponent {}
