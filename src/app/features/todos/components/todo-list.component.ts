import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TodoService } from '../services/todo.service';
import { PriorityPipe } from '../../../shared/pipes/priority.pipe';
import { HighlightDirective } from '../../../shared/directives/highlight.directive';
import { CreateTodoRequest } from '../models/todo.model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PriorityPipe, HighlightDirective],
  template: `
    <div class="max-w-7xl mx-auto p-6">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Gestionnaire de Tâches</h1>
        <p class="text-gray-600">Organisez vos tâches avec le système Kanban en temps réel</p>
      </div>

      <!-- Formulaire de création de tâche -->
      <div class="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Créer une nouvelle tâche</h2>

        <form [formGroup]="todoForm" (ngSubmit)="onSubmit()" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Titre -->
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
                Titre de la tâche *
              </label>
              <input
                id="title"
                type="text"
                formControlName="title"
                placeholder="Ex: Réviser Angular"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                [class.border-red-500]="isFieldInvalid('title')"
              />
              @if (isFieldInvalid('title')) {
                <p class="mt-1 text-sm text-red-600">{{ getFieldError('title') }}</p>
              }
            </div>

            <!-- Priorité -->
            <div>
              <label for="priority" class="block text-sm font-medium text-gray-700 mb-1">
                Priorité *
              </label>
              <select
                id="priority"
                formControlName="priority"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Faible</option>
                <option value="medium">Moyenne</option>
                <option value="high">Haute</option>
              </select>
            </div>
          </div>

          <!-- Description -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              formControlName="description"
              rows="3"
              placeholder="Détails de la tâche (optionnel)"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          <!-- Bouton de soumission -->
          <div class="flex justify-end">
            <button
              type="submit"
              [disabled]="todoForm.invalid || loading()"
              class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              @if (loading()) {
                <span
                  class="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                ></span>
                Création...
              } @else {
                Créer la tâche
              }
            </button>
          </div>
        </form>
      </div>

      <!-- Dashboard des statistiques -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Statistiques en temps réel</h2>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div class="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h3 class="text-sm font-medium text-gray-500">Total</h3>
            <p class="text-2xl font-bold text-gray-900">{{ todoService.todoStats().total }}</p>
          </div>
          <div class="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h3 class="text-sm font-medium text-gray-500">Complétés</h3>
            <p class="text-2xl font-bold text-green-600">{{ todoService.todoStats().completed }}</p>
          </div>
          <div class="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h3 class="text-sm font-medium text-gray-500">En cours</h3>
            <p class="text-2xl font-bold text-blue-600">{{ todoService.todoStats().inProgress }}</p>
          </div>
          <div class="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h3 class="text-sm font-medium text-gray-500">Priorité haute</h3>
            <p class="text-2xl font-bold text-red-600">
              {{ todoService.todoStats().highPriority }}
            </p>
          </div>
          <div class="bg-white p-4 rounded-lg shadow border border-gray-200">
            <h3 class="text-sm font-medium text-gray-500">Taux de complétion</h3>
            <p class="text-2xl font-bold text-purple-600">
              {{ todoService.todoStats().completionRate | number: '1.0-0' }}%
            </p>
          </div>
        </div>
      </div>

      <!-- Colonnes Kanban -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- À faire -->
        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
            <span>À faire</span>
            <span class="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">{{
              todoService.pendingTodos().length
            }}</span>
          </h3>
          <div class="space-y-3 min-h-[400px]">
            @for (todo of todoService.pendingTodos(); track todo.id) {
              <div
                class="bg-white p-4 rounded-lg shadow-sm border-l-4 border-gray-400 cursor-pointer hover:shadow-md transition-shadow"
                [appHighlight]="todo.priority === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'transparent'"
                [appHighlightDelay]="todo.priority === 'high' ? 500 : 0"
                (click)="moveTodo(todo.id, 'in-progress')"
                (keydown.enter)="moveTodo(todo.id, 'in-progress')"
                (keydown.space)="moveTodo(todo.id, 'in-progress')"
                tabindex="0"
                role="button"
                [attr.aria-label]="'Déplacer la tâche ' + todo.title + ' vers En cours'"
              >
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-medium text-gray-900">{{ todo.title }}</h4>
                  <span
                    class="px-2 py-1 text-xs font-semibold rounded-full"
                    [class.bg-red-100]="todo.priority === 'high'"
                    [class.text-red-800]="todo.priority === 'high'"
                    [class.bg-yellow-100]="todo.priority === 'medium'"
                    [class.text-yellow-800]="todo.priority === 'medium'"
                    [class.bg-green-100]="todo.priority === 'low'"
                    [class.text-green-800]="todo.priority === 'low'"
                  >
                    {{ todo.priority | priority }}
                  </span>
                </div>
                @if (todo.description) {
                  <p class="text-sm text-gray-600 mb-3">{{ todo.description }}</p>
                }
                <div class="flex justify-between items-center text-xs text-gray-500">
                  <span>Créé le {{ todo.createdAt | date: 'dd/MM/yyyy' }}</span>
                  <span class="text-blue-600">Cliquez pour commencer</span>
                </div>
              </div>
            }
            @if (todoService.pendingTodos().length === 0) {
              <div class="text-center text-gray-500 py-8">
                <p>Aucune tâche à faire</p>
              </div>
            }
          </div>
        </div>

        <!-- En cours -->
        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
            <span>En cours</span>
            <span class="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">{{
              todoService.inProgressTodos().length
            }}</span>
          </h3>
          <div class="space-y-3 min-h-[400px]">
            @for (todo of todoService.inProgressTodos(); track todo.id) {
              <div
                class="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-400 cursor-pointer hover:shadow-md transition-shadow"
                [appHighlight]="todo.priority === 'high' ? 'rgba(239, 68, 68, 0.1)' : 'transparent'"
                [appHighlightDelay]="todo.priority === 'high' ? 500 : 0"
                (click)="moveTodo(todo.id, 'done')"
                (keydown.enter)="moveTodo(todo.id, 'done')"
                (keydown.space)="moveTodo(todo.id, 'done')"
                tabindex="0"
                role="button"
                [attr.aria-label]="'Marquer la tâche ' + todo.title + ' comme terminée'"
              >
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-medium text-gray-900">{{ todo.title }}</h4>
                  <span
                    class="px-2 py-1 text-xs font-semibold rounded-full"
                    [class.bg-red-100]="todo.priority === 'high'"
                    [class.text-red-800]="todo.priority === 'high'"
                    [class.bg-yellow-100]="todo.priority === 'medium'"
                    [class.text-yellow-800]="todo.priority === 'medium'"
                    [class.bg-green-100]="todo.priority === 'low'"
                    [class.text-green-800]="todo.priority === 'low'"
                  >
                    {{ todo.priority | priority }}
                  </span>
                </div>
                @if (todo.description) {
                  <p class="text-sm text-gray-600 mb-3">{{ todo.description }}</p>
                }
                <div class="flex justify-between items-center text-xs text-gray-500">
                  <span>Mis à jour le {{ todo.updatedAt | date: 'dd/MM/yyyy' }}</span>
                  <span class="text-green-600">Cliquez pour terminer</span>
                </div>
              </div>
            }
            @if (todoService.inProgressTodos().length === 0) {
              <div class="text-center text-gray-500 py-8">
                <p>Aucune tâche en cours</p>
              </div>
            }
          </div>
        </div>

        <!-- Terminé -->
        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
            <span>Terminé</span>
            <span class="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">{{
              todoService.completedTodos().length
            }}</span>
          </h3>
          <div class="space-y-3 min-h-[400px]">
            @for (todo of todoService.completedTodos(); track todo.id) {
              <div
                class="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-400"
                [appHighlight]="todo.priority === 'high' ? 'rgba(34, 197, 94, 0.1)' : 'transparent'"
                [appHighlightDelay]="todo.priority === 'high' ? 500 : 0"
              >
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-medium text-gray-900 line-through">{{ todo.title }}</h4>
                  <span
                    class="px-2 py-1 text-xs font-semibold rounded-full"
                    [class.bg-red-100]="todo.priority === 'high'"
                    [class.text-red-800]="todo.priority === 'high'"
                    [class.bg-yellow-100]="todo.priority === 'medium'"
                    [class.text-yellow-800]="todo.priority === 'medium'"
                    [class.bg-green-100]="todo.priority === 'low'"
                    [class.text-green-800]="todo.priority === 'low'"
                  >
                    {{ todo.priority | priority }}
                  </span>
                </div>
                @if (todo.description) {
                  <p class="text-sm text-gray-600 mb-3 line-through">{{ todo.description }}</p>
                }
                <div class="flex justify-between items-center text-xs text-gray-500">
                  <span>Terminé le {{ todo.updatedAt | date: 'dd/MM/yyyy' }}</span>
                  <span class="text-green-600">✓ Complété</span>
                </div>
              </div>
            }
            @if (todoService.completedTodos().length === 0) {
              <div class="text-center text-gray-500 py-8">
                <p>Aucune tâche terminée</p>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TodoListComponent {
  private fb = inject(FormBuilder);
  todoService = inject(TodoService);

  todoForm: FormGroup;
  loading = signal(false);

  constructor() {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      priority: ['medium', [Validators.required]],
    });
  }

  async onSubmit() {
    if (this.todoForm.valid) {
      this.loading.set(true);

      try {
        const todoData: CreateTodoRequest = {
          title: this.todoForm.value.title,
          description: this.todoForm.value.description,
          priority: this.todoForm.value.priority,
        };

        await this.todoService.createTodo(todoData);

        // Réinitialiser le formulaire
        this.todoForm.reset({
          title: '',
          description: '',
          priority: 'medium',
        });

        // Marquer le formulaire comme non touché
        this.todoForm.markAsUntouched();
      } catch (error) {
        console.error('Erreur lors de la création de la tâche:', error);
      } finally {
        this.loading.set(false);
      }
    }
  }

  async moveTodo(id: number, newStatus: 'todo' | 'in-progress' | 'done'): Promise<void> {
    try {
      await this.todoService.moveTodo(id, newStatus);
    } catch (error) {
      console.error('Erreur lors du déplacement de la tâche:', error);
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.todoForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.todoForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return 'Ce champ est requis';
      if (field.errors['minlength'])
        return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
    }
    return '';
  }
}
