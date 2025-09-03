import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorService, AppError } from '../../../core/services/error.service';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Loading Indicator -->
    @if (isLoading() > 0) {
      <div class="fixed top-4 right-4 z-50">
        <div
          class="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2"
        >
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span class="text-sm font-medium">Chargement...</span>
        </div>
      </div>
    }

    <!-- Error Notifications -->
    <div class="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      @for (error of errors(); track error.id) {
        <div
          class="notification-item p-4 rounded-lg shadow-lg border-l-4 transition-all duration-300 ease-in-out transform"
          [class]="getNotificationClasses(error.type)"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center space-x-2">
                <div class="flex-shrink-0">
                  @if (error.type === 'error') {
                    <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  } @else if (error.type === 'warning') {
                    <svg class="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  } @else {
                    <svg class="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fill-rule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  }
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium" [class]="getTextClasses(error.type)">
                    {{ error.message }}
                  </p>
                  @if (error.statusCode) {
                    <p class="text-xs mt-1 opacity-75">Code: {{ error.statusCode }}</p>
                  }
                </div>
              </div>
            </div>
            <button
              (click)="removeNotification(error.id)"
              class="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .notification-item {
        animation: slideInRight 0.3s ease-out;
      }

      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `,
  ],
})
export class NotificationsComponent implements OnInit, OnDestroy {
  private errorService = inject(ErrorService);
  private loadingService = inject(LoadingService);

  errors = this.errorService.errors$;
  isLoading = this.loadingService.isLoading;
  private autoRemoveTimers = new Map<string, NodeJS.Timeout>();
  private currentErrors = new Set<string>();

  ngOnInit(): void {
    this.setupAutoRemoval();
  }

  ngOnDestroy(): void {
    this.clearAllTimers();
  }

  removeNotification(errorId: string): void {
    this.errorService.removeError(errorId);
    this.clearTimer(errorId);
  }

  private setupAutoRemoval(): void {
    const checkForNewErrors = () => {
      const errors = this.errors();
      errors.forEach((error: AppError) => {
        if (!this.currentErrors.has(error.id)) {
          this.currentErrors.add(error.id);
          const timer = setTimeout(() => {
            this.removeNotification(error.id);
            this.currentErrors.delete(error.id);
          }, this.getAutoRemoveDelay(error.type));

          this.autoRemoveTimers.set(error.id, timer);
        }
      });
    };

    // Vérifier immédiatement
    checkForNewErrors();

    // Vérifier périodiquement
    const interval = setInterval(checkForNewErrors, 100);

    // Nettoyer l'intervalle lors de la destruction
    this.ngOnDestroy = () => {
      clearInterval(interval);
      this.clearAllTimers();
    };
  }

  private getAutoRemoveDelay(type: 'error' | 'warning' | 'info'): number {
    switch (type) {
      case 'error':
        return 8000;
      case 'warning':
        return 6000;
      case 'info':
        return 4000;
      default:
        return 5000;
    }
  }

  private clearTimer(errorId: string): void {
    const timer = this.autoRemoveTimers.get(errorId);
    if (timer) {
      clearTimeout(timer);
      this.autoRemoveTimers.delete(errorId);
    }
  }

  private clearAllTimers(): void {
    this.autoRemoveTimers.forEach((timer) => clearTimeout(timer));
    this.autoRemoveTimers.clear();
    this.currentErrors.clear();
  }

  getNotificationClasses(type: 'error' | 'warning' | 'info'): string {
    const baseClasses = 'border-l-4';

    switch (type) {
      case 'error':
        return `${baseClasses} bg-red-50 border-red-400`;
      case 'warning':
        return `${baseClasses} bg-yellow-50 border-yellow-400`;
      case 'info':
        return `${baseClasses} bg-blue-50 border-blue-400`;
      default:
        return `${baseClasses} bg-gray-50 border-gray-400`;
    }
  }

  getTextClasses(type: 'error' | 'warning' | 'info'): string {
    switch (type) {
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-gray-800';
    }
  }
}
