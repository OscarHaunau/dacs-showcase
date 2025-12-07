import { Injectable } from '@angular/core';
import { KeycloakService as KeycloakAngularService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { keycloakInitOptions } from '../config/keycloak.config';

/**
 * Servicio personalizado para manejar Keycloak
 */
@Injectable({
  providedIn: 'root'
})
export class KeycloakService {
  private userProfileSubject = new BehaviorSubject<KeycloakProfile | null>(null);
  public userProfile$ = this.userProfileSubject.asObservable();
  private initialized = false;

  constructor(private keycloak: KeycloakAngularService) {}

  /**
   * Inicializa el perfil del usuario
   */
  private async initializeUserProfile(): Promise<void> {
    if (!this.initialized) return;
    try {
      const profile = await this.keycloak.loadUserProfile();
      this.userProfileSubject.next(profile);
    } catch (error) {
      console.error('Error cargando perfil de usuario:', error);
    }
  }

  /**
   * Verifica si el usuario está logueado
   */
  isLoggedIn(): boolean {
    // if not initialized, assume the user is not logged in (no auto-initialization)
    if (!this.initialized) return false;
    return this.keycloak.isLoggedIn();
  }

  /**
   * Obtiene el token de acceso
   */
  async getToken(): Promise<string> {
    await this.init();
    return this.keycloak.getToken();
  }

  /**
   * Obtiene el perfil del usuario actual
   */
  getUserProfile(): KeycloakProfile | null {
    return this.userProfileSubject.value;
  }

  /**
   * Obtiene los roles del usuario
   */
  getUserRoles(): string[] {
    if (!this.initialized) return [];
    return this.keycloak.getUserRoles();
  }

  /**
   * Verifica si el usuario tiene un rol específico
   */
  hasRole(role: string): boolean {
    if (!this.initialized) return false;
    return this.keycloak.isUserInRole(role);
  }

  /**
   * Verifica si el usuario tiene alguno de los roles especificados
   */
  hasAnyRole(roles: string[]): boolean {
    if (!this.initialized) return false;
    return roles.some(role => this.hasRole(role));
  }

  /**
   * Verifica si el usuario tiene todos los roles especificados
   */
  hasAllRoles(roles: string[]): boolean {
    return roles.every(role => this.hasRole(role));
  }

  /**
   * Inicia el proceso de login
   */
  login(): Promise<void> {
    return this.init().then(() => this.keycloak.login());
  }

  register(): Promise<void> {
    return this.init().then(() => this.keycloak.register());
  }

  /**
   * Cierra la sesión
   */
  logout(): Promise<void> {
    return this.init().then(() => this.keycloak.logout());
  }

  /**
   * Obtiene la URL de la cuenta de usuario
   */
  getAccountUrl(): string {
    // getKeycloakInstance will be available only after init
    if (!this.initialized) return '';
    return this.keycloak.getKeycloakInstance().createAccountUrl();
  }

  /**
   * Obtiene el nombre completo del usuario
   */
  getFullName(): string {
    const profile = this.getUserProfile();
    if (profile?.firstName && profile?.lastName) {
      return `${profile.firstName} ${profile.lastName}`;
    }
    return profile?.username || 'Usuario';
  }

  /**
   * Obtiene el email del usuario
   */
  getEmail(): string {
    const profile = this.getUserProfile();
    return profile?.email || '';
  }

  /**
   * Obtiene el username del usuario
   */
  getUsername(): string {
    const profile = this.getUserProfile();
    return profile?.username || '';
  }

  /**
   * Refresca el perfil del usuario
   */
  async refreshUserProfile(): Promise<void> {
    if (!this.initialized) return;
    try {
      const profile = await this.keycloak.loadUserProfile();
      this.userProfileSubject.next(profile);
    } catch (error) {
      console.error('Error refrescando perfil de usuario:', error);
    }
  }

  /**
   * Inicializa Keycloak de forma perezosa si no se inicializó aún.
   */
  async init(): Promise<void> {
    if (this.initialized) return;
    try {
      await this.keycloak.init(keycloakInitOptions as any);
      this.initialized = true;
      await this.initializeUserProfile();
    } catch (e) {
      console.warn('Keycloak init falló, continuando sin Keycloak', e);
    }
  }
}
