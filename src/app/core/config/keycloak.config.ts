import { KeycloakConfig, KeycloakOnLoad, KeycloakPkceMethod } from 'keycloak-js';
import { environment } from '../../../environments/environment';

/**
 * Configuración de Keycloak
 */
export const keycloakConfig: KeycloakConfig = {
  url: environment.keycloak.url,
  realm: environment.keycloak.realm,
  clientId: environment.keycloak.clientId
};

/**
 * Obtiene las opciones de inicialización de Keycloak con redirectUri correcto
 */
export function getKeycloakInitOptions() {
  return {
    config: keycloakConfig,
    initOptions: {
      onLoad: 'check-sso' as KeycloakOnLoad,
      pkceMethod: 'S256' as KeycloakPkceMethod,
      checkLoginIframe: false,
      enableLogging: true,
      redirectUri: `${window.location.origin}${window.location.pathname}`
    },
    enableBearerInterceptor: false,
    bearerExcludedUrls: [
      '/assets',
      'assets'
    ]
  };
}

/**
 * Exporta como variable para compatibilidad hacia atrás
 */
export const keycloakInitOptions = getKeycloakInitOptions();
