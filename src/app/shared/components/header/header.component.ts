import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';

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
              <a routerLink="/" class="hover:text-blue-600 transition-colors">ToDoList</a>
            </h1>
          </div>

          <nav class="flex items-center space-x-6">
            @if (currentUser()) {
              <a routerLink="/todos" class="text-gray-600 hover:text-blue-600 transition-colors">
                Mes tâches
              </a>
              @if (currentUser()?.role === 'admin') {
                <a routerLink="/admin" class="text-gray-600 hover:text-blue-600 transition-colors">
                  Admin
                </a>
              }
              <a routerLink="/demo" class="text-gray-600 hover:text-blue-600 transition-colors">
                Notifications
              </a>
              <button
                (click)="logout()"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Déconnexion
              </button>
            } @else {
              <a
                routerLink="/auth/login"
                class="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Connexion
              </a>
              <a
                routerLink="/auth/register"
                class="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Inscription
              </a>
              <a routerLink="/demo" class="text-gray-600 hover:text-blue-600 transition-colors">
                Notifications
              </a>
            }
          </nav>
        </div>
      </div>
    </header>
  `,
  styles: [],
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser = this.authService.currentUser$;

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
