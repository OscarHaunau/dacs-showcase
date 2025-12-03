import { EstadoTransaccion } from './enums';

export class TransaccionPago {
  constructor(
    public id: string,
    public fechaTransaccion: Date,
    public detalle: string,
    public estado: EstadoTransaccion = EstadoTransaccion.PENDIENTE,
    public monto?: number,
  ) {}

  registrarOperacionExitosa(id: string, monto: number): void {
    this.id = id;
    this.monto = monto;
    this.actualizarEstadoTransaccion(EstadoTransaccion.APROBADA);
  }

  actualizarEstadoTransaccion(estado: EstadoTransaccion): void {
    this.estado = estado;
  }
}