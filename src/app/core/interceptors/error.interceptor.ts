import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

/**
 * Interceptor global de errores HTTP
 *
 * Captura todos los errores de las peticiones HTTP y muestra
 * mensajes amigables al usuario mediante el ToastService
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let mensajeError = 'Error al procesar la solicitud';

      // Error de conexión (sin respuesta del servidor)
      if (error.status === 0) {
        mensajeError = 'No se pudo conectar con el servidor. Verificá tu conexión.';
      }
      // Bad Request
      else if (error.status === 400) {
        mensajeError = error.error?.mensaje || 'Los datos enviados no son válidos';
      }
      // Unauthorized
      else if (error.status === 401) {
        mensajeError = 'No tenés autorización para realizar esta acción';
      }
      // Forbidden
      else if (error.status === 403) {
        mensajeError = 'No tenés permisos para acceder a este recurso';
      }
      // Not Found
      else if (error.status === 404) {
        mensajeError = 'El recurso solicitado no fue encontrado';
      }
      // Conflict (ej: número ya vendido)
      else if (error.status === 409) {
        mensajeError = error.error?.mensaje || 'El recurso ya no está disponible';
      }
      // Internal Server Error
      else if (error.status === 500) {
        mensajeError = 'Error interno del servidor. Intentá nuevamente más tarde.';
      }
      // Service Unavailable
      else if (error.status === 503) {
        mensajeError = 'El servicio no está disponible temporalmente';
      }

      // Mostrar toast con el error
      toast.show(mensajeError, 'error');

      // Log del error para debugging
      console.error('Error HTTP:', {
        status: error.status,
        statusText: error.statusText,
        url: error.url,
        mensaje: mensajeError,
        detalles: error.error
      });

      // Re-lanzar el error para que el componente pueda manejarlo si lo necesita
      return throwError(() => error);
    })
  );
};
