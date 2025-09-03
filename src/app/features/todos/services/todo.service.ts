import { Injectable, signal, inject, computed, effect } from '@angular/core';
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

  public todos$ = this.todos.asReadonly();

  public completedTodos = computed(() => this.todos().filter((todo) => todo.status === 'done'));

  public pendingTodos = computed(() => this.todos().filter((todo) => todo.status === 'todo'));

  public inProgressTodos = computed(() =>
    this.todos().filter((todo) => todo.status === 'in-progress'),
  );

  public highPriorityTodos = computed(() =>
    this.todos().filter((todo) => todo.priority === 'high'),
  );

  public todoStats = computed(() => ({
    total: this.todos().length,
    completed: this.completedTodos().length,
    inProgress: this.inProgressTodos().length,
    pending: this.pendingTodos().length,
    highPriority: this.highPriorityTodos().length,
    completionRate:
      this.todos().length > 0 ? (this.completedTodos().length / this.todos().length) * 100 : 0,
  }));

  constructor() {
    // Restaurer les todos depuis localStorage au démarrage
    this.loadTodosFromStorage();

    effect(() => {
      const todos = this.todos();
      console.warn(`Todos mis à jour: ${todos.length} todos`);

      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('todos', JSON.stringify(todos));
      }
    });
  }

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
        this.todos.update((current) => current.map((t) => (t.id === id ? updatedTodo : t)));
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

  async moveTodo(id: number, newStatus: 'todo' | 'in-progress' | 'done'): Promise<void> {
    try {
      await this.delay(200);
      this.todos.update((current) =>
        current.map((todo) =>
          todo.id === id ? { ...todo, status: newStatus, updatedAt: new Date() } : todo,
        ),
      );
      this.errorService.addError('Tâche déplacée avec succès !', 'info');
    } catch (error) {
      this.errorService.addError('Erreur lors du déplacement de la tâche', 'error');
      throw error;
    }
  }

  private loadTodosFromStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const savedTodos = localStorage.getItem('todos');
        if (savedTodos) {
          const parsedTodos = JSON.parse(savedTodos);
          // Convertir les dates string en objets Date
          const todosWithDates = parsedTodos.map((todo: unknown) => ({
            ...todo as Todo,
            createdAt: new Date((todo as Todo).createdAt),
            updatedAt: new Date((todo as Todo).updatedAt)
          }));
          this.todos.set(todosWithDates);
          console.warn(`Todos restaurés depuis localStorage: ${todosWithDates.length} todos`);
        }
      } catch (error) {
        console.error('Erreur lors de la restauration des todos depuis localStorage:', error);
        // En cas d'erreur, on garde les todos par défaut
      }
    }
  }
}
