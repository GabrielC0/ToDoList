import { Injectable, signal } from '@angular/core';

export interface AppError {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: Date;
  statusCode?: number;
  url?: string;
  details?: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private errors = signal<AppError[]>([]);

  public errors$ = this.errors.asReadonly();

  addError(message: string, type: 'error' | 'warning' | 'info' = 'error', details?: unknown): void {
    const error: AppError = {
      id: this.generateId(),
      message,
      type,
      timestamp: new Date(),
      details,
    };

    this.errors.update((errors) => [error, ...errors]);
    this.logError(error);
  }

  addHttpError(statusCode: number, message: string, url?: string): void {
    let type: 'error' | 'warning' | 'info' = 'error';

    if (statusCode >= 500) {
      type = 'error';
    } else if (statusCode >= 400) {
      type = 'warning';
    } else {
      type = 'info';
    }

    this.addError(message, type, { statusCode, url });
  }

  removeError(errorId: string): void {
    this.errors.update((errors) => errors.filter((error) => error.id !== errorId));
  }

  clearErrors(): void {
    this.errors.set([]);
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private logError(error: AppError): void {
    const logMessage = `[${error.type.toUpperCase()}] ${error.message}`;

    switch (error.type) {
      case 'error':
        console.error(logMessage, error);
        break;
      case 'warning':
        console.warn(logMessage, error);
        break;
      case 'info':
        console.warn(logMessage, error);
        break;
    }
  }
}
