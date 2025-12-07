import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // Asegúrate de importar esto si usas HttpClient
import { KeycloakService as KeycloakAngularService } from 'keycloak-angular';
import { KeycloakService as AppKeycloakService } from './core/services/keycloak.service';
// Keycloak init options are imported lazily where required (e.g., in KeycloakService)
import { INTERCEPTOR_CONFIG } from './core/config/interceptor.config';
import { routes } from './app.routes';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs);

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    AppKeycloakService,
    { provide: LOCALE_ID, useValue: 'es' }
  ]
};

// Añadimos los providers al final para que se ejecuten en el bootstrap
// Not auto-initializing Keycloak on app startup to avoid redirecting the user
// to the Keycloak login screen. We initialize it lazily in the service when needed.
appConfig.providers!.push(
  KeycloakAngularService,
  ...INTERCEPTOR_CONFIG
);
