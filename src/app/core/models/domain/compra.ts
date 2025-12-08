import { MetodoPago } from './enums';
import { Participante } from './participante';
import { Numero } from './numero';
import { TransaccionPago } from './transaccion-pago';
import { EstadoNumero } from './enums';

export class Compra {
  constructor(
    public id: string,
    public fechaHora: Date,
    public metodo: MetodoPago,
    public participante: Participante,
    public numero: Numero,
    public transaccion?: TransaccionPago,
  ) {}

  registrarCompra(participante: Participante, numero: Numero, metodoPago: MetodoPago): void {
    this.participante = participante;
    this.numero = numero;
    this.metodo = metodoPago;
    this.fechaHora = new Date();
    this.numero.registrarCompra(this.id);
  }

  validarDisponibilidad(numero: Numero): boolean {
    return numero.estado === EstadoNumero.DISPONIBLE;
  }

  generarComprobante(): string {
    return `COMP-${this.id}-${this.numero.valor}-${this.participante.dni}`;
  }

  cancelarCompra(idCompra: string): void {
    if (idCompra !== this.id) return;
    this.numero.cambiarEstadoNumero(EstadoNumero.DISPONIBLE);
  }

  procesarPago(transaccion: TransaccionPago, monto: number): void {
    this.transaccion = transaccion;
    this.transaccion.registrarOperacionExitosa(this.id, monto);
  }

  confirmarPagoTransaccion(): void {
    this.numero.cambiarEstadoNumero(EstadoNumero.VENDIDO);
  }
}