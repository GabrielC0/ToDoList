import { Injectable, signal } from '@angular/core';
import { CreateTodoRequest, Todo } from '../models/todo.model';

@Injectable({ providedIn: 'root' })
export class TodoService {
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
    await this.delay(300);
    return this.todos();
  }

  async getTodoById(id: number): Promise<Todo | undefined> {
    await this.delay(200);
    return this.todos().find((todo) => todo.id === id);
  }

  async createTodo(todoData: CreateTodoRequest): Promise<Todo> {
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
    return newTodo;
  }

  async updateTodo(id: number, updates: Partial<Todo>): Promise<Todo | undefined> {
    await this.delay(300);
    let updated: Todo | undefined;
    this.todos.update((current) =>
      current.map((todo) => {
        if (todo.id === id) {
          updated = { ...todo, ...updates, updatedAt: new Date() };
          return updated as Todo;
        }
        return todo;
      }),
    );
    return updated;
  }

  async deleteTodo(id: number): Promise<boolean> {
    await this.delay(250);
    let deleted = false;
    this.todos.update((current) => {
      const initialLength = current.length;
      const filtered = current.filter((todo) => todo.id !== id);
      deleted = filtered.length < initialLength;
      return filtered;
    });
    return deleted;
  }

  getTodosByStatus(status: Todo['status']): Todo[] {
    return this.todos().filter((todo) => todo.status === status);
  }

  getTodosByPriority(priority: Todo['priority']): Todo[] {
    return this.todos().filter((todo) => todo.priority === priority);
  }
}
