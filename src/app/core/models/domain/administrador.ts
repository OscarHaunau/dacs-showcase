import { Sorteo } from './sorteo';
import { Premio } from './premio';
import { Resultado } from './resultado';

export class Administrador {
  constructor(
    public id: string,
    public nombre: string,
    public correo: string,
  ) {}

  crearSorteo(premio: Premio, descripcion: string, precioNumero: number, modalidad: string, fechaSorteo: Date): Sorteo {
    const id = `S-${Date.now()}`;
    const sorteo = new Sorteo(id, premio.nombre, descripcion, precioNumero, new Date(), true, premio);
    return sorteo;
  }

  modificarSorteo(sorteo: Sorteo, nuevosDatos: Partial<Omit<Sorteo, 'id'>>): void {
    Object.assign(sorteo, nuevosDatos);
  }

  eliminarSorteo(_sorteo: Sorteo): void {
    console.log('Eliminar sorteo', _sorteo.id);
  }

  verEstadisticasSorteo(sorteo: Sorteo): Record<string, number> {
    const total = sorteo.numeros.length;
    const vendidos = sorteo.numeros.filter(n => n.estado === 'VENDIDO').length;
    const enProceso = sorteo.numeros.filter(n => n.estado === 'EN_PROCESO').length;
    const disponibles = total - vendidos - enProceso;
    return { total, vendidos, enProceso, disponibles };
  }

  exportarEstadisticas(idSorteo: string, filtros?: Record<string, unknown>): string {
    const header = 'idSorteo,fecha,aplicadoFiltro';
    const row = `${idSorteo},${new Date().toISOString()},${Boolean(filtros)}`;
    return [header, row].join('\n');
  }

  publicarResultado(sorteo: Sorteo, numeroGanador: number, numeroRespaldo: number): Resultado {
    const r = new Resultado(`R-${Date.now()}`, numeroGanador, numeroRespaldo, new Date());
    sorteo.resultado = r;
    return r;
  }
}