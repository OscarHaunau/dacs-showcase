// Modelos e interfaces para el sistema de pagos con MercadoPago

export type EstadoPago = 'pendiente' | 'aprobado' | 'rechazado';

export interface DatosComprador {
  name: string;
  email: string;
  phone: string;
}

export interface CrearOrdenRequest {
  sorteoId: string;
  numero: number;
  comprador: DatosComprador;
}

export interface CrearOrdenResponse {
  ordenId: string;
  mpPreferenceId: string;
  initPoint: string; // URL de MercadoPago para redirigir
}

export interface EstadoOrdenResponse {
  ordenId: string;
  sorteoId: string;
  sorteoNombre: string;
  numero: number;
  precio: number;
  estado: EstadoPago;
  mpStatus: string; // Estado original de MercadoPago
  mpPaymentId?: string;
  fechaCreacion: string;
  fechaActualizacion?: string;
  comprador: DatosComprador;
}

export interface CompraUsuario {
  ordenId: string;
  sorteoId: string;
  sorteoNombre: string;
  numero: number;
  precio: number;
  estado: EstadoPago;
  fecha: string;
}

export interface MisComprasResponse {
  compras: CompraUsuario[];
}
