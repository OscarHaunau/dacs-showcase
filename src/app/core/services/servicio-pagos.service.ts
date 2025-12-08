import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CrearOrdenRequest,
  CrearOrdenResponse,
  EstadoOrdenResponse,
  MisComprasResponse
} from '../models/modelos-pago';

@Injectable({ providedIn: 'root' })
export class ServicioPagos {
  private http = inject(HttpClient);
  private baseUrl = `${environment.backendForFrontendUrl}/pagos`;

  /**
   * Crea una orden de pago en el backend y obtiene el link de MercadoPago
   *
   * @param request - Datos del sorteo, número y comprador
   * @returns Observable con ordenId, mpPreferenceId e initPoint (URL de MP)
   */
  crearOrdenPago(request: CrearOrdenRequest): Observable<CrearOrdenResponse> {
    return this.http.post<CrearOrdenResponse>(
      `${this.baseUrl}/crear`,
      request
    );
  }

  /**
   * Consulta el estado actual de una orden de pago
   *
   * @param ordenId - ID de la orden
   * @returns Observable con todos los detalles de la orden
   */
  obtenerEstadoOrden(ordenId: string): Observable<EstadoOrdenResponse> {
    return this.http.get<EstadoOrdenResponse>(
      `${this.baseUrl}/orden/${ordenId}`
    );
  }

  /**
   * Obtiene el historial de compras del usuario actual
   *
   * @returns Observable con lista de compras del usuario
   */
  obtenerMisCompras(): Observable<MisComprasResponse> {
    return this.http.get<MisComprasResponse>(
      `${this.baseUrl}/mis-compras`
    );
  }
}
