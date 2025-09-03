import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

export const adminGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Attendre que le service d'authentification soit initialisé
  await authService.waitForInitialization();

  if (authService.isAuthenticated() && authService.isAdmin()) {
    return true;
  } else {
    router.navigate(['/todos']);
    return false;
  }
};
