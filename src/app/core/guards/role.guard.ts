import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { KeycloakService } from '../services/keycloak.service';

/**
 * Guard para verificar roles específicos
 */
@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private keycloakService: KeycloakService,
    private router: Router
  ) {}
  async canActivate(): Promise<boolean | UrlTree> {
    const loggedIn = await this.keycloakService.isLoggedIn();
    if (!loggedIn) {
      // Se redirige al login Keycloak en vez de a una ruta local inexistente
      this.keycloakService.login().catch(() => {
        // En caso de error de login, se redirige al home como fallback
        this.router.navigate(['/']);
      });
      return false;
    }

    // Verificar si tiene ROLE-A o ROLE-B
    const hasRequiredRole = this.keycloakService.hasAnyRole(['ROLE-A', 'ROLE-B']);
    if (hasRequiredRole) return true;
    return this.router.createUrlTree(['/unauthorized']);
  }
}