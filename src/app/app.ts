import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { NotificationsComponent } from './shared/components/notifications/notifications.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, NotificationsComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <app-header></app-header>
      <main class="container mx-auto px-4 py-8">
        <router-outlet></router-outlet>
      </main>
      <app-notifications></app-notifications>
    </div>
  `,
  styles: [],
})
export class AppComponent {
  title = 'todo-list-app';
}
