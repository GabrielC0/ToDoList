import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorService } from '../../../core/services/error.service';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-notifications-demo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Démonstration des Notifications</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Test des Notifications -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Test des Notifications</h3>
          
          <div class="space-y-3">
            <button
              (click)="addSuccessNotification()"
              class="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Notification de Succès
            </button>
            
            <button
              (click)="addWarningNotification()"
              class="w-full px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
            >
              Notification d'Avertissement
            </button>
            
            <button
              (click)="addErrorNotification()"
              class="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Notification d'Erreur
            </button>
            
            <button
              (click)="addHttpError()"
              class="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Erreur HTTP 500
            </button>
            
            <button
              (click)="clearAllNotifications()"
              class="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Effacer Toutes les Notifications
            </button>
          </div>
        </div>
        
        <!-- Test du Loading -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Test du Loading</h3>
          
          <div class="space-y-3">
            <button
              (click)="simulateLoading()"
              class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Simuler Chargement (3s)
            </button>
            
            <button
              (click)="simulateMultipleLoading()"
              class="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              Chargements Multiples
            </button>
            
            <div class="mt-4 p-3 bg-gray-100 rounded-md">
              <p class="text-sm text-gray-700">
                Requêtes actives: <span class="font-semibold">{{ loadingService.isLoading() }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Instructions -->
      <div class="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h4 class="text-lg font-semibold text-blue-900 mb-2">Instructions</h4>
        <ul class="text-sm text-blue-800 space-y-1">
          <li>• Cliquez sur les boutons pour tester les différents types de notifications</li>
          <li>• Les notifications s'auto-suppriment après un délai</li>
          <li>• L'indicateur de chargement apparaît en haut à droite</li>
          <li>• Testez la gestion des erreurs HTTP avec différents codes</li>
        </ul>
      </div>
    </div>
  `
})
export class NotificationsDemoComponent {
  private errorService = inject(ErrorService);
  public loadingService = inject(LoadingService);
  
  addSuccessNotification(): void {
    this.errorService.addError('Opération réussie !', 'info');
  }
  
  addWarningNotification(): void {
    this.errorService.addError('Attention : action requise', 'warning');
  }
  
  addErrorNotification(): void {
    this.errorService.addError('Une erreur est survenue', 'error');
  }
  
  addHttpError(): void {
    this.errorService.addHttpError(500, 'Erreur serveur interne', '/api/users');
  }
  
  clearAllNotifications(): void {
    this.errorService.clearErrors();
  }
  
  async simulateLoading(): Promise<void> {
    this.loadingService.incrementRequestCount();
    await new Promise(resolve => setTimeout(resolve, 3000));
    this.loadingService.decrementRequestCount();
  }
  
  async simulateMultipleLoading(): Promise<void> {
    this.loadingService.incrementRequestCount();
    this.loadingService.incrementRequestCount();
    this.loadingService.incrementRequestCount();
    
    setTimeout(() => this.loadingService.decrementRequestCount(), 1000);
    setTimeout(() => this.loadingService.decrementRequestCount(), 2000);
    setTimeout(() => this.loadingService.decrementRequestCount(), 3000);
  }
}