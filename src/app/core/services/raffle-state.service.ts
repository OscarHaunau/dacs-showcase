import { Injectable, computed, signal } from '@angular/core';
import { Buyer, Raffle, RaffleNumber, RaffleNumberStatus } from '../models/raffle';

@Injectable({ providedIn: 'root' })
export class RaffleStateService {
  // Datos en memoria (reemplazar con llamadas HTTP al backend)
  private sorteosSig = signal<Raffle[]>(this.generarSorteosDePrueba());
  private idActualSig = signal<string | null>(null);

  // Señales computadas para acceso reactivo
  sorteos = computed(() => this.sorteosSig());
  sorteoActual = computed(() => {
    const id = this.idActualSig();
    return this.sorteosSig().find(s => s.id === id) ?? null;
  });

  establecerSorteoActual(id: string) {
    this.idActualSig.set(id);
  }

  obtenerSorteos(): Raffle[] {
    return this.sorteosSig();
  }

  obtenerSorteoPorId(id: string): Raffle | undefined {
    return this.sorteosSig().find(s => s.id === id);
  }

  agregarSorteo(sorteo: Raffle) {
    this.sorteosSig.set([...this.sorteosSig(), sorteo]);
  }

  actualizarSorteo(sorteo: Raffle) {
    this.sorteosSig.set(
      this.sorteosSig().map(s => s.id === sorteo.id ? sorteo : s)
    );
  }

  establecerNumeros(idSorteo: string, cantidad: number) {
    const sorteosActualizados = this.sorteosSig().map(sorteo => {
      if (sorteo.id !== idSorteo) return sorteo;

      // Generar números desde 1 hasta cantidad
      const numeros: RaffleNumber[] = [];
      for (let i = 1; i <= cantidad; i++) {
        numeros.push({
          number: i,
          status: 'available' as RaffleNumberStatus
        });
      }

      return { ...sorteo, numbers: numeros, buyers: [] };
    });

    this.sorteosSig.set(sorteosActualizados);
  }

  actualizarEstadoNumero(
    idSorteo: string,
    numero: number,
    estado: RaffleNumberStatus,
    comprador?: Buyer
  ) {
    const sorteosActualizados = this.sorteosSig().map(sorteo => {
      if (sorteo.id !== idSorteo) return sorteo;

      // Actualizar estado del número
      const numeros = sorteo.numbers.map(n =>
        n.number === numero ? { ...n, status: estado, buyerId: comprador?.id } : n
      );

      // Actualizar lista de compradores
      let compradores = sorteo.buyers;

      if (comprador && estado === 'sold') {
        // Evitar duplicados: eliminar compra anterior del mismo número y agregar nueva
        compradores = compradores
          .filter(c => c.numberBought !== numero)
          .concat(comprador);
      }

      if (estado !== 'sold') {
        // Si el número ya no está vendido, eliminar comprador asociado
        compradores = compradores.filter(c => c.numberBought !== numero);
      }

      return { ...sorteo, numbers: numeros, buyers: compradores };
    });

    this.sorteosSig.set(sorteosActualizados);
  }

  // Simula la compra de un número (reemplazar con llamada HTTP real)
  comprarNumero(
    idSorteo: string,
    numero: number,
    datosComprador: Omit<Buyer, 'id' | 'numberBought'>,
    alFinalizar: (exitoso: boolean) => void
  ) {
    const id = crypto.randomUUID();
    const comprador: Buyer = {
      id,
      ...datosComprador,
      numberBought: numero
    };

    // Marcar como "procesando" inmediatamente
    this.actualizarEstadoNumero(idSorteo, numero, 'processing');

    // Simular delay de pago (1.2 segundos, 70% de éxito)
    setTimeout(() => {
      const exitoso = Math.random() < 0.7;

      if (exitoso) {
        this.actualizarEstadoNumero(idSorteo, numero, 'sold', comprador);
      } else {
        this.actualizarEstadoNumero(idSorteo, numero, 'available');
      }

      alFinalizar(exitoso);
    }, 1200);
  }

  // Calcula estadísticas de un sorteo
  calcularEstadisticas(sorteo: Raffle) {
    let vendidos = 0;
    let procesando = 0;
    let disponibles = 0;

    for (const numero of sorteo.numbers) {
      if (numero.status === 'sold') vendidos++;
      else if (numero.status === 'processing') procesando++;
      else if (numero.status === 'available') disponibles++;
    }

    const recaudacion = vendidos * sorteo.price;

    return {
      vendidos,
      procesando,
      disponibles,
      recaudacion
    };
  }

  // Gestión de resultados
  private resultados = new Map<string, {
    ganador: number;
    respaldo?: number;
    fuenteNombre?: string;
    fuenteUrl?: string;
    fecha: string;
  }>();

  publicarResultado(
    idSorteo: string,
    ganador: number,
    respaldo: number | undefined,
    fuenteNombre: string | undefined,
    fuenteUrl: string | undefined
  ) {
    const fecha = new Date().toISOString();
    this.resultados.set(idSorteo, {
      ganador,
      respaldo,
      fuenteNombre,
      fuenteUrl,
      fecha
    });
  }

  obtenerResultado(idSorteo: string) {
    return this.resultados.get(idSorteo);
  }

  // Genera datos de prueba (eliminar cuando se conecte con backend real)
  private generarSorteosDePrueba(): Raffle[] {
    // Crear 100 números disponibles
    const crearNumeros = (): RaffleNumber[] => {
      const numeros: RaffleNumber[] = [];
      for (let i = 1; i <= 100; i++) {
        numeros.push({ number: i, status: 'available' });
      }
      return numeros;
    };

    // Marcar algunos números como vendidos para simular actividad
    const marcarVendidos = (numeros: RaffleNumber[], vendidos: number[]): RaffleNumber[] => {
      return numeros.map(n =>
        vendidos.includes(n.number) ? { ...n, status: 'sold' as RaffleNumberStatus } : n
      );
    };

    const numerosSorteo1 = marcarVendidos(crearNumeros(), [3, 7, 15, 21, 34, 55, 88]);
    const numerosSorteo2 = marcarVendidos(crearNumeros(), [1, 2, 10, 50, 99]);

    const compradores1: Buyer[] = [
      {
        id: crypto.randomUUID(),
        name: 'María López',
        email: 'maria@example.com',
        phone: '1133344455',
        numberBought: 3
      },
      {
        id: crypto.randomUUID(),
        name: 'Juan Pérez',
        email: 'juan@example.com',
        phone: '1144455566',
        numberBought: 7
      },
    ];

    const compradores2: Buyer[] = [
      {
        id: crypto.randomUUID(),
        name: 'Ana Torres',
        email: 'ana@example.com',
        phone: '1122233344',
        numberBought: 1
      },
    ];

    const ahora = new Date();
    const en3Dias = new Date(ahora.getTime() + 3 * 24 * 60 * 60 * 1000);
    const en5Dias = new Date(ahora.getTime() + 5 * 24 * 60 * 60 * 1000);

    return [
      {
        id: 'raffle-eco-bike',
        name: 'Sorteo Bicicleta EcoX',
        organizer: 'Green Raffles',
        alias: 'eco-bike',
        description: 'Ganá una bicicleta eléctrica EcoX de última generación. Batería de larga duración y diseño moderno.',
        raffleDate: en3Dias.toISOString(),
        price: 10000,
        numbers: numerosSorteo1,
        buyers: compradores1
      },
      {
        id: 'raffle-iphone',
        name: 'iPhone 15 Pro Verde',
        organizer: 'Tech Verde',
        alias: 'iphone15pro',
        description: 'Participá por un iPhone 15 Pro color verde bosque. Tecnología de punta y rendimiento extremo.',
        raffleDate: en5Dias.toISOString(),
        price: 25000,
        numbers: numerosSorteo2,
        buyers: compradores2
      }
    ];
  }
}
