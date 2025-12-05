import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // Asegúrate de importar esto si usas HttpClient
import { KeycloakService as KeycloakAngularService } from 'keycloak-angular';
import { keycloakInitOptions } from './core/config/keycloak.config';
import { INTERCEPTOR_CONFIG } from './core/config/interceptor.config';
import { routes } from './app.routes';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs);

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(), // Proveer HttpClient en la configuración de la aplicación
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    { provide: LOCALE_ID, useValue: 'es' }
  ]
};

// Inicializador de Keycloak para arrancar la app después de autenticar
export function initializeKeycloak(keycloak: KeycloakAngularService) {
  return async () => {
    console.log('[Keycloak] initializeKeycloak: starting keycloak.init');
    // If current path is public (raffle list/detail), avoid initializing Keycloak at bootstrap
    const pathname = window.location.pathname || '/';
    const publicPaths = ['/', '/raffle', '/terms', '/domain', '/home'];
    if (publicPaths.some(p => pathname === p || pathname.startsWith(p + '/'))) {
      console.log('[Keycloak] initializeKeycloak: skipping initialization for public path', pathname);
      return true;
    }
    let ok = false;
    try {
      ok = await keycloak.init(keycloakInitOptions);
      console.log('[Keycloak] initializeKeycloak: init result =>', ok);
    } catch (error) {
      console.error('[Keycloak] initializeKeycloak: init error =>', error);
      ok = false;
    }

    // If we are logged in, remove the hash fragment (code & state) to avoid reprocessing.
    try {
      if (await keycloak.isLoggedIn()) {
        // Clean the fragment to avoid repeated handling by the adapter
        if (window.location.hash && (window.location.hash.includes('code=') || window.location.hash.includes('access_token=') || window.location.hash.includes('state='))) {
          const url = window.location.pathname + window.location.search;
          window.history.replaceState({}, document.title, url);
          console.log('[Keycloak] initializeKeycloak: cleaned URL fragment');
        }
      }
    } catch (e) {
      console.warn('[Keycloak] initializeKeycloak: error checking login status or cleaning hash', e);
    }
    return ok;
  };
}

// Añadimos los providers al final para que se ejecuten en el bootstrap
appConfig.providers!.push(
  { provide: APP_INITIALIZER, useFactory: initializeKeycloak, multi: true, deps: [KeycloakAngularService] },
  KeycloakAngularService,
  ...INTERCEPTOR_CONFIG
);
