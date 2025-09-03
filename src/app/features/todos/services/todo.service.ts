import { Injectable, signal, inject } from '@angular/core';
import { CreateTodoRequest, Todo } from '../models/todo.model';
import { ErrorService } from '../../../core/services/error.service';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private errorService = inject(ErrorService);
  
  private todos = signal<Todo[]>([
    {
      id: 1,
      title: 'Apprendre Angular',
      description: 'Étudier les fondamentaux d\'Angular 20+',
      status: 'todo',
      priority: 'high',
      createdBy: 1,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: 2,
      title: 'Créer un projet',
      description: 'Développer une application TodoList',
      status: 'in-progress',
      priority: 'medium',
      createdBy: 1,
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-16'),
    },
    {
      id: 3,
      title: 'Configurer l\'environnement',
      description: 'Installer Node.js, Angular CLI et configurer VS Code',
      status: 'done',
      priority: 'high',
      createdBy: 1,
      createdAt: new Date('2024-01-13'),
      updatedAt: new Date('2024-01-14'),
    },
  ]);

  private delay(milliseconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  async getAllTodos(): Promise<Todo[]> {
    try {
      await this.delay(300);
      return this.todos();
    } catch (error) {
      this.errorService.addError('Erreur lors du chargement des tâches', 'error');
      throw error;
    }
  }

  async getTodoById(id: number): Promise<Todo | undefined> {
    try {
      await this.delay(200);
      return this.todos().find((todo) => todo.id === id);
    } catch (error) {
      this.errorService.addError('Erreur lors de la récupération de la tâche', 'error');
      throw error;
    }
  }

  async createTodo(todoData: CreateTodoRequest): Promise<Todo> {
    try {
      await this.delay(400);
      const newTodo: Todo = {
        id: Date.now(),
        title: todoData.title,
        description: todoData.description ?? '',
        status: 'todo',
        priority: todoData.priority,
        assignedTo: todoData.assignedTo,
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.todos.update((current) => [...current, newTodo]);
      this.errorService.addError('Tâche créée avec succès !', 'info');
      return newTodo;
    } catch (error) {
      this.errorService.addError('Erreur lors de la création de la tâche', 'error');
      throw error;
    }
  }

  async updateTodo(id: number, updates: Partial<Todo>): Promise<Todo | undefined> {
    try {
      await this.delay(300);
      const todo = this.todos().find((t) => t.id === id);
      if (todo) {
        const updatedTodo = { ...todo, ...updates, updatedAt: new Date() };
        this.todos.update((current) =>
          current.map((t) => (t.id === id ? updatedTodo : t))
        );
        this.errorService.addError('Tâche mise à jour avec succès !', 'info');
        return updatedTodo;
      }
      return undefined;
    } catch (error) {
      this.errorService.addError('Erreur lors de la mise à jour de la tâche', 'error');
      throw error;
    }
  }

  async deleteTodo(id: number): Promise<void> {
    try {
      await this.delay(300);
      this.todos.update((current) => current.filter((t) => t.id !== id));
      this.errorService.addError('Tâche supprimée avec succès !', 'info');
    } catch (error) {
      this.errorService.addError('Erreur lors de la suppression de la tâche', 'error');
      throw error;
    }
  }

  getTodosByStatus(status: Todo['status']): Todo[] {
    return this.todos().filter((todo) => todo.status === status);
  }

  getTodosByPriority(priority: Todo['priority']): Todo[] {
    return this.todos().filter((todo) => todo.priority === priority);
  }
}
