import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../../features/todos/services/todo.service';
import { PriorityPipe } from '../../pipes/priority.pipe';
import { HighlightDirective } from '../../directives/highlight.directive';

@Component({
  selector: 'app-signals-demo',
  standalone: true,
  imports: [CommonModule, PriorityPipe, HighlightDirective],
  template: `
    <div class="max-w-6xl mx-auto p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">Démonstration des Signals Avancés</h2>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Démonstration des Signals -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Signals en Action</h3>

          <div class="space-y-4">
            <div class="p-4 bg-blue-50 rounded-lg">
              <h4 class="font-medium text-blue-900 mb-2">Signal Writable</h4>
              <div class="flex items-center space-x-2 mb-2">
                <input
                  [value]="counter()"
                  (input)="updateCounter($event)"
                  type="number"
                  class="px-3 py-1 border border-gray-300 rounded text-sm w-20"
                />
                <span class="text-sm text-gray-600">Valeur actuelle: {{ counter() }}</span>
              </div>
              <div class="flex space-x-2">
                <button
                  (click)="increment()"
                  class="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  +1
                </button>
                <button
                  (click)="decrement()"
                  class="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  -1
                </button>
                <button
                  (click)="reset()"
                  class="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                >
                  Reset
                </button>
              </div>
            </div>

            <div class="p-4 bg-green-50 rounded-lg">
              <h4 class="font-medium text-green-900 mb-2">Signal Computed</h4>
              <div class="space-y-2 text-sm">
                <p><strong>Double:</strong> {{ double() }}</p>
                <p><strong>Triple:</strong> {{ triple() }}</p>
                <p><strong>Carré:</strong> {{ square() }}</p>
                <p><strong>Est pair:</strong> {{ isEven() ? 'Oui' : 'Non' }}</p>
                <p><strong>Est positif:</strong> {{ isPositive() ? 'Oui' : 'Non' }}</p>
              </div>
            </div>

            <div class="p-4 bg-purple-50 rounded-lg">
              <h4 class="font-medium text-purple-900 mb-2">Signal Effect</h4>
              <div class="text-sm text-purple-700">
                <p>Dernière mise à jour: {{ lastUpdate() }}</p>
                <p>Nombre de changements: {{ changeCount() }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Comparaison avec l'ancienne méthode -->
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Avantages des Signals</h3>

          <div class="space-y-4">
            <div class="p-4 bg-yellow-50 rounded-lg">
              <h4 class="font-medium text-yellow-900 mb-2">⚡ Performance</h4>
              <ul class="text-sm text-yellow-800 space-y-1">
                <li>• Détection de changements granulaire</li>
                <li>• Pas de cycle de détection complet</li>
                <li>• Mise à jour uniquement des composants concernés</li>
              </ul>
            </div>

            <div class="p-4 bg-indigo-50 rounded-lg">
              <h4 class="font-medium text-indigo-900 mb-2">🧠 Simplicité</h4>
              <ul class="text-sm text-indigo-800 space-y-1">
                <li>• Pas de subscribe()/unsubscribe()</li>
                <li>• Pas de gestion de la mémoire</li>
                <li>• Syntaxe plus intuitive</li>
              </ul>
            </div>

            <div class="p-4 bg-emerald-50 rounded-lg">
              <h4 class="font-medium text-emerald-900 mb-2">🔒 Type Safety</h4>
              <ul class="text-sm text-emerald-800 space-y-1">
                <li>• Typage strict par défaut</li>
                <li>• Moins d'erreurs runtime</li>
                <li>• Meilleur support IDE</li>
              </ul>
            </div>

            <div class="p-4 bg-rose-50 rounded-lg">
              <h4 class="font-medium text-rose-900 mb-2">🔄 Réactivité</h4>
              <ul class="text-sm text-rose-800 space-y-1">
                <li>• Mise à jour automatique du template</li>
                <li>• Pas d'async pipe nécessaire</li>
                <li>• Gestion automatique du cycle de vie</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Démonstration des computed signals du TodoService -->
      <div class="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Signals Computed du TodoService</h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <h4 class="font-medium text-gray-900 mb-2">Tâches à faire</h4>
            <p class="text-2xl font-bold text-blue-600">{{ todoService.pendingTodos().length }}</p>
            <div class="mt-2 space-y-1">
              @for (todo of todoService.pendingTodos(); track todo.id) {
                <div
                  class="p-2 bg-white rounded border-l-2 border-blue-400 text-sm"
                  [appHighlight]="
                    todo.priority === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'transparent'
                  "
                >
                  <div class="font-medium">{{ todo.title }}</div>
                  <div class="text-xs text-gray-500">Priorité: {{ todo.priority | priority }}</div>
                </div>
              }
            </div>
          </div>

          <div class="p-4 bg-gray-50 rounded-lg">
            <h4 class="font-medium text-gray-900 mb-2">Tâches en cours</h4>
            <p class="text-2xl font-bold text-yellow-600">
              {{ todoService.inProgressTodos().length }}
            </p>
            <div class="mt-2 space-y-1">
              @for (todo of todoService.inProgressTodos(); track todo.id) {
                <div
                  class="p-2 bg-white rounded border-l-2 border-yellow-400 text-sm"
                  [appHighlight]="
                    todo.priority === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'transparent'
                  "
                >
                  <div class="font-medium">{{ todo.title }}</div>
                  <div class="text-xs text-gray-500">Priorité: {{ todo.priority | priority }}</div>
                </div>
              }
            </div>
          </div>

          <div class="p-4 bg-gray-50 rounded-lg">
            <h4 class="font-medium text-gray-900 mb-2">Tâches terminées</h4>
            <p class="text-2xl font-bold text-green-600">
              {{ todoService.completedTodos().length }}
            </p>
            <div class="mt-2 space-y-1">
              @for (todo of todoService.completedTodos(); track todo.id) {
                <div
                  class="p-2 bg-white rounded border-l-2 border-green-400 text-sm"
                  [appHighlight]="
                    todo.priority === 'high' ? 'rgba(34, 197, 94, 0.1)' : 'transparent'
                  "
                >
                  <div class="font-medium line-through">{{ todo.title }}</div>
                  <div class="text-xs text-gray-500">Priorité: {{ todo.priority | priority }}</div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SignalsDemoComponent {
  public todoService = inject(TodoService);

  public counter = signal(0);
  public lastUpdate = signal(new Date());
  public changeCount = signal(0);

  public double = computed(() => this.counter() * 2);
  public triple = computed(() => this.counter() * 3);
  public square = computed(() => this.counter() ** 2);
  public isEven = computed(() => this.counter() % 2 === 0);
  public isPositive = computed(() => this.counter() > 0);

  constructor() {
    effect(() => {
      const currentValue = this.counter();
      this.lastUpdate.set(new Date());
      this.changeCount.update((count) => count + 1);
      console.warn(`Signal counter mis à jour: ${currentValue}`);
    });
  }

  updateCounter(event: Event): void {
    const value = parseInt((event.target as HTMLInputElement).value) || 0;
    this.counter.set(value);
  }

  increment(): void {
    this.counter.update((value) => value + 1);
  }

  decrement(): void {
    this.counter.update((value) => value - 1);
  }

  reset(): void {
    this.counter.set(0);
  }
}
