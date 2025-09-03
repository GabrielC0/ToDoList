import { Injectable, signal, inject } from '@angular/core';
import { LoginRequest, RegisterRequest, User } from '../models/user.model';
import { ErrorService } from '../../../core/services/error.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private errorService = inject(ErrorService);

  private currentUser = signal<User | null>(null);
  public currentUser$ = this.currentUser.asReadonly();
  private isInitialized = signal(false);

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth(): Promise<void> {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          // Vérifier que l'utilisateur existe toujours dans la liste
          const existingUser = this.users().find(u => u.id === user.id && u.email === user.email);
          if (existingUser) {
            this.currentUser.set(existingUser);
            console.warn('Session restaurée pour:', existingUser.email);
          } else {
            // L'utilisateur n'existe plus, nettoyer localStorage
            localStorage.removeItem('currentUser');
            console.warn('Utilisateur supprimé, session nettoyée');
          }
        } catch {
          localStorage.removeItem('currentUser');
          this.errorService.addError('Erreur lors de la restauration de la session', 'warning');
        }
      }
    }
    this.isInitialized.set(true);
  }

  async waitForInitialization(): Promise<void> {
    while (!this.isInitialized()) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }

  private users = signal<User[]>([
    {
      id: 1,
      name: 'Admin',
      email: 'admin@admin.com',
      password: 'admin123',
      role: 'admin',
      createdAt: new Date('2024-01-01'),
    },
  ]);

  private delay(milliseconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  async login(
    credentials: LoginRequest,
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      await this.delay(500);
      const user = this.users().find(
        (u) => u.email === credentials.email && u.password === credentials.password,
      );
      if (user) {
        this.setCurrentUser(user);
        this.errorService.addError('Connexion réussie !', 'info');
        return { success: true, user };
      }
      this.errorService.addError('Email ou mot de passe incorrect', 'error');
      return { success: false, error: 'Email ou mot de passe incorrect' };
    } catch {
      this.errorService.addError('Erreur lors de la connexion', 'error');
      return { success: false, error: 'Erreur lors de la connexion' };
    }
  }

  async register(
    data: RegisterRequest,
  ): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      await this.delay(600);
      if (this.users().some((u) => u.email === data.email)) {
        this.errorService.addError('Cet email est déjà utilisé', 'warning');
        return { success: false, error: 'Cet email est déjà utilisé' };
      }
      if (data.password !== data.confirmPassword) {
        this.errorService.addError('Les mots de passe ne correspondent pas', 'warning');
        return { success: false, error: 'Les mots de passe ne correspondent pas' };
      }
      const newUser: User = {
        id: Date.now(),
        name: data.name,
        email: data.email,
        password: data.password,
        role: 'user',
        createdAt: new Date(),
      };
      this.users.update((current) => [...current, newUser]);
      this.setCurrentUser(newUser);
      this.errorService.addError('Compte créé avec succès !', 'info');
      return { success: true, user: newUser };
    } catch {
      this.errorService.addError('Erreur lors de la création du compte', 'error');
      return { success: false, error: 'Erreur lors de la création du compte' };
    }
  }

  async logout(): Promise<void> {
    try {
      await this.delay(200);
      this.currentUser.set(null);
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('currentUser');
      }
      this.errorService.addError('Déconnexion réussie', 'info');
    } catch {
      this.errorService.addError('Erreur lors de la déconnexion', 'warning');
    }
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  getToken(): string | null {
    const user = this.currentUser();
    return user ? `mock-token-${user.id}` : null;
  }

  setCurrentUser(user: User): void {
    this.currentUser.set(user);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  isAdmin(): boolean {
    return this.currentUser()?.role === 'admin';
  }

  async getAllUsers(): Promise<User[]> {
    try {
      await this.delay(400);
      if (!this.isAdmin()) {
        throw new Error('Accès non autorisé');
      }
      return this.users().map((u) => ({ ...u, password: '***' }));
    } catch (error) {
      this.errorService.addError('Erreur lors du chargement des utilisateurs', 'error');
      throw error;
    }
  }

  async deleteUser(userId: number): Promise<void> {
    try {
      await this.delay(300);
      if (!this.isAdmin()) {
        throw new Error('Accès non autorisé');
      }
      const index = this.users().findIndex((u) => u.id === userId);
      if (index !== -1) {
        this.users.update((current) => current.filter((u) => u.id !== userId));
        this.errorService.addError('Utilisateur supprimé avec succès', 'info');
      }
    } catch (error) {
      this.errorService.addError('Erreur lors de la suppression de l\'utilisateur', 'error');
      throw error;
    }
  }
}
