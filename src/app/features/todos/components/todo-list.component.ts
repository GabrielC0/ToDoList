import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TodoService } from '../services/todo.service';
import { Todo, CreateTodoRequest } from '../models/todo.model';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-6xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Mes tâches</h1>

        <form
          (ngSubmit)="addTodo()"
          class="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
        >
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="md:col-span-2">
              <input
                [(ngModel)]="newTodo.title"
                name="title"
                type="text"
                placeholder="Titre de la tâche"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <select
                [(ngModel)]="newTodo.priority"
                name="priority"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Faible</option>
                <option value="medium">Moyenne</option>
                <option value="high">Élevée</option>
              </select>
            </div>
            <div>
              <button
                type="submit"
                class="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Ajouter
              </button>
            </div>
          </div>
        </form>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">À faire</h2>
            <span class="text-sm text-gray-500">{{ getTodosByStatus('todo').length }} tâches</span>
          </div>
          <div class="p-4 space-y-3">
            @for (todo of getTodosByStatus('todo'); track todo.id) {
              <div class="p-3 bg-gray-50 rounded-md border border-gray-200">
                <div class="flex justify-between items-start mb-2">
                  <h3 class="font-medium text-gray-900">{{ todo.title }}</h3>
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    [ngClass]="{
                      'bg-red-100 text-red-800': todo.priority === 'high',
                      'bg-yellow-100 text-yellow-800': todo.priority === 'medium',
                      'bg-green-100 text-green-800': todo.priority === 'low',
                    }"
                  >
                    {{ getPriorityLabel(todo.priority) }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 mb-3">{{ todo.description }}</p>
                <div class="flex gap-2">
                  <button
                    (click)="updateTodoStatus(todo.id, 'in-progress')"
                    class="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    Commencer
                  </button>
                  <button
                    (click)="deleteTodo(todo.id)"
                    class="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            }
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">En cours</h2>
            <span class="text-sm text-gray-500"
              >{{ getTodosByStatus('in-progress').length }} tâches</span
            >
          </div>
          <div class="p-4 space-y-3">
            @for (todo of getTodosByStatus('in-progress'); track todo.id) {
              <div class="p-3 bg-blue-50 rounded-md border border-blue-200">
                <div class="flex justify-between items-start mb-2">
                  <h3 class="font-medium text-gray-900">{{ todo.title }}</h3>
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    [ngClass]="{
                      'bg-red-100 text-red-800': todo.priority === 'high',
                      'bg-yellow-100 text-yellow-800': todo.priority === 'medium',
                      'bg-green-100 text-green-800': todo.priority === 'low',
                    }"
                  >
                    {{ getPriorityLabel(todo.priority) }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 mb-3">{{ todo.description }}</p>
                <div class="flex gap-2">
                  <button
                    (click)="updateTodoStatus(todo.id, 'done')"
                    class="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                  >
                    Terminer
                  </button>
                  <button
                    (click)="deleteTodo(todo.id)"
                    class="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            }
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Terminé</h2>
            <span class="text-sm text-gray-500">{{ getTodosByStatus('done').length }} tâches</span>
          </div>
          <div class="p-4 space-y-3">
            @for (todo of getTodosByStatus('done'); track todo.id) {
              <div class="p-3 bg-green-50 rounded-md border border-green-200">
                <div class="flex justify-between items-start mb-2">
                  <h3 class="font-medium text-gray-900 line-through">{{ todo.title }}</h3>
                  <span
                    class="px-2 py-1 text-xs font-medium rounded-full"
                    [ngClass]="{
                      'bg-red-100 text-red-800': todo.priority === 'high',
                      'bg-yellow-100 text-yellow-800': todo.priority === 'medium',
                      'bg-green-100 text-green-800': todo.priority === 'low',
                    }"
                  >
                    {{ getPriorityLabel(todo.priority) }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 mb-3 line-through">{{ todo.description }}</p>
                <div class="flex gap-2">
                  <button
                    (click)="deleteTodo(todo.id)"
                    class="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class TodoListComponent {
  todos = signal<Todo[]>([]);
  newTodo: CreateTodoRequest = {
    title: '',
    description: '',
    priority: 'medium',
  };

  private todoService = inject(TodoService);

  constructor() {
    this.loadTodos();
  }

  async loadTodos(): Promise<void> {
    this.todos.set(await this.todoService.getAllTodos());
  }

  async addTodo(): Promise<void> {
    if (!this.newTodo.title.trim()) return;

    await this.todoService.createTodo(this.newTodo);
    this.newTodo = { title: '', description: '', priority: 'medium' };
    await this.loadTodos();
  }

  async updateTodoStatus(id: number, status: 'todo' | 'in-progress' | 'done'): Promise<void> {
    const todo = this.todos().find((t) => t.id === id);
    if (todo) {
      await this.todoService.updateTodo(id, { ...todo, status });
      await this.loadTodos();
    }
  }

  async deleteTodo(id: number): Promise<void> {
    await this.todoService.deleteTodo(id);
    await this.loadTodos();
  }

  getTodosByStatus(status: 'todo' | 'in-progress' | 'done'): Todo[] {
    return this.todos().filter((todo) => todo.status === status);
  }

  getPriorityLabel(priority: 'low' | 'medium' | 'high'): string {
    const labels = {
      low: 'Faible',
      medium: 'Moyenne',
      high: 'Élevée',
    };
    return labels[priority];
  }
}
