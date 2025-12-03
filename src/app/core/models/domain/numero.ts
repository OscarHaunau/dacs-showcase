import { EstadoNumero } from './enums';

export class Numero {
  constructor(
    public id: string,
    public valor: number,
    public estado: EstadoNumero = EstadoNumero.DISPONIBLE,
    public compraId?: string,
  ) {}

  cambiarEstadoNumero(estado: EstadoNumero): void {
    this.estado = estado;
  }

  esSujeto(): boolean {
    return this.estado === EstadoNumero.DISPONIBLE;
  }

  registrarCompra(idCompra: string): void {
    this.compraId = idCompra;
    this.estado = EstadoNumero.VENDIDO;
  }
}