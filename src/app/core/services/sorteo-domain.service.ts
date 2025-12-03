import { Injectable, signal, computed } from '@angular/core';
import { Sorteo } from '../models/domain/sorteo';
import { Premio } from '../models/domain/premio';
import { Numero } from '../models/domain/numero';
import { Participante } from '../models/domain/participante';
import { Compra } from '../models/domain/compra';
import { TransaccionPago } from '../models/domain/transaccion-pago';
import { MetodoPago, EstadoNumero } from '../models/domain/enums';

@Injectable({ providedIn: 'root' })
export class SorteoDomainService {
  private sorteosSig = signal<Sorteo[]>([]);
  private participantesSig = signal<Participante[]>([]);
  private comprasSig = signal<Compra[]>([]);
  private currentId = signal<string | null>(null);

  sorteos = computed(() => this.sorteosSig());
  participantes = computed(() => this.participantesSig());
  compras = computed(() => this.comprasSig());
  actual(): Sorteo | undefined { return this.sorteosSig().find(s => s.id === this.currentId()); }

  crearSorteo(datos: { nombrePremio: string; descripcionPremio: string; valorPremio: number; descripcion: string; precioNumero: number; }): Sorteo {
    const premio = new Premio(`P-${Date.now()}`, datos.nombrePremio, datos.descripcionPremio, datos.valorPremio);
    const sorteo = new Sorteo(`S-${Date.now()}`, datos.nombrePremio, datos.descripcion, datos.precioNumero, new Date(), true, premio);
    this.sorteosSig.set([...this.sorteosSig(), sorteo]);
    this.currentId.set(sorteo.id);
    return sorteo;
  }

  seleccionar(id: string) { this.currentId.set(id); }

  generarNumeros(inicial: number, cantidad: number) {
    const s = this.actual();
    if (!s) return;
    s.generarNumeros(inicial, cantidad);
    this.sorteosSig.set([...this.sorteosSig()]);
  }

  registrarParticipante(nombre: string, dni: string, email: string, telefono: string): Participante {
    const p = new Participante(`U-${Date.now()}`, nombre, dni, email, telefono);
    this.participantesSig.set([...this.participantesSig(), p]);
    return p;
  }

  registrarCompra(participanteId: string, numeroValor: number, metodo: MetodoPago): { ok: boolean; mensaje: string; comprobante?: string } {
    const s = this.actual();
    if (!s) return { ok: false, mensaje: 'No hay sorteo seleccionado.' };
    const participante = this.participantesSig().find(u => u.id === participanteId);
    if (!participante) return { ok: false, mensaje: 'Participante no encontrado.' };
    const numero = s.numeros.find(n => n.valor === numeroValor);
    if (!numero) return { ok: false, mensaje: 'Número inexistente.' };
    if (numero.estado !== EstadoNumero.DISPONIBLE) return { ok: false, mensaje: 'Número no disponible.' };

    const compra = new Compra(`C-${Date.now()}`, new Date(), metodo, participante, numero);
    compra.registrarCompra(participante, numero, metodo);
    const trans = new TransaccionPago(`T-${Date.now()}`, new Date(), `Pago ${metodo}`);
    compra.procesarPago(trans, s.precioNumero);
    compra.confirmarPagoTransaccion();
    const comprobante = compra.generarComprobante();
    this.comprasSig.set([...this.comprasSig(), compra]);
    this.sorteosSig.set([...this.sorteosSig()]);
    return { ok: true, mensaje: 'Compra registrada', comprobante };
  }

  estadisticas(s?: Sorteo) {
    const sorteo = s ?? this.actual();
    if (!sorteo) return { total: 0, vendidos: 0, enProceso: 0, disponibles: 0 };
    const total = sorteo.numeros.length;
    const vendidos = sorteo.numeros.filter(n => n.estado === EstadoNumero.VENDIDO).length;
    const enProceso = sorteo.numeros.filter(n => n.estado === EstadoNumero.EN_PROCESO).length;
    const disponibles = total - vendidos - enProceso;
    return { total, vendidos, enProceso, disponibles };
  }
}