import { Numero } from './numero';
import { Premio } from './premio';
import { Resultado } from './resultado';

export class Sorteo {
  public numeros: Numero[] = [];
  public resultado?: Resultado;

  constructor(
    public id: string,
    public nombre: string,
    public descripcion: string,
    public precioNumero: number,
    public fechaPublicacion: Date,
    public estado: boolean,
    public premio: Premio,
  ) {}

  agregarNumeros(inicio: number, fin: number): void {
    for (let n = inicio; n <= fin; n++) {
      const idNum = `${this.id}-${n}`;
      if (!this.numeros.find(x => x.valor === n)) {
        this.numeros.push(new Numero(idNum, n));
      }
    }
  }

  obtenerNumeros(): Numero[] { return this.numeros; }

  generarNumeros(inicial: number, cantidad: number): void {
    this.agregarNumeros(inicial, inicial + cantidad - 1);
  }

  cambiarEstadoNuevoSorteo(estado: boolean): void {
    this.estado = estado;
  }
}