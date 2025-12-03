import { Injectable, computed, signal } from '@angular/core';
import { Buyer, Raffle, RaffleNumber, RaffleNumberStatus } from '../models/raffle';

@Injectable({ providedIn: 'root' })
export class RaffleStateService {
  // In-memory data
  private rafflesSig = signal<Raffle[]>(this.generateMockRaffles());
  private currentIdSig = signal<string | null>(null);

  raffles = computed(() => this.rafflesSig());
  currentRaffle = computed(() => {
    const id = this.currentIdSig();
    return this.rafflesSig().find(r => r.id === id) ?? null;
  });

  setCurrentRaffle(id: string) {
    this.currentIdSig.set(id);
  }

  getRaffles(): Raffle[] {
    return this.rafflesSig();
  }

  getRaffleById(id: string): Raffle | undefined {
    return this.rafflesSig().find(r => r.id === id);
  }

  addRaffle(r: Raffle) {
    this.rafflesSig.set([...this.rafflesSig(), r]);
  }

  updateRaffle(next: Raffle) {
    this.rafflesSig.set(this.rafflesSig().map(r => r.id === next.id ? next : r));
  }

  setNumbers(raffleId: string, count: number) {
    const next = this.rafflesSig().map(r => {
      if (r.id !== raffleId) return r;
      const nums = Array.from({ length: count }, (_, i) => ({ number: i + 1, status: 'available' as RaffleNumberStatus }));
      return { ...r, numbers: nums, buyers: [] };
    });
    this.rafflesSig.set(next);
  }

  updateNumberStatus(raffleId: string, number: number, status: RaffleNumberStatus, buyer?: Buyer) {
    const updated = this.rafflesSig().map(r => {
      if (r.id !== raffleId) return r;
      const numbers = r.numbers.map(n =>
        n.number === number ? { ...n, status, buyerId: buyer?.id } : n
      );
      let buyers = r.buyers;
      if (buyer && status === 'sold') {
        // prevent duplicates by number
        buyers = buyers.filter(b => b.numberBought !== number).concat(buyer);
      }
      if (status !== 'sold') {
        buyers = buyers.filter(b => b.numberBought !== number);
      }
      return { ...r, numbers, buyers };
    });
    this.rafflesSig.set(updated);
  }

  simulatePurchase(raffleId: string, number: number, buyerData: Omit<Buyer, 'id'|'numberBought'>, onResult: (success: boolean) => void) {
    const id = crypto.randomUUID();
    const buyer: Buyer = { id, ...buyerData, numberBought: number };
    // Set to processing immediately
    this.updateNumberStatus(raffleId, number, 'processing');
    // Simulate async payment 1.2s
    setTimeout(() => {
      const success = Math.random() < 0.7; // 70% success
      if (success) {
        this.updateNumberStatus(raffleId, number, 'sold', buyer);
      } else {
        this.updateNumberStatus(raffleId, number, 'available');
      }
      onResult(success);
    }, 1200);
  }

  // Stats helpers
  getStats(raffle: Raffle) {
    const sold = raffle.numbers.filter(n => n.status === 'sold').length;
    const processing = raffle.numbers.filter(n => n.status === 'processing').length;
    const available = raffle.numbers.filter(n => n.status === 'available').length;
    const revenue = sold * raffle.price;
    return { sold, processing, available, revenue };
  }

  // Results
  private results = new Map<string, { ganador: number; respaldo?: number; fuenteNombre?: string; fuenteUrl?: string; fecha: string }>();
  publishResult(raffleId: string, ganador: number, respaldo: number | undefined, fuenteNombre: string | undefined, fuenteUrl: string | undefined) {
    const fecha = new Date().toISOString();
    this.results.set(raffleId, { ganador, respaldo, fuenteNombre, fuenteUrl, fecha });
  }
  getResult(raffleId: string) { return this.results.get(raffleId); }

  private generateMockRaffles(): Raffle[] {
    const createNumbers = (): RaffleNumber[] => Array.from({ length: 100 }, (_, i) => ({
      number: i + 1,
      status: 'available'
    }));

    // Seed a few sold numbers for realism
    const seedSold = (nums: RaffleNumber[], soldList: number[]): RaffleNumber[] =>
      nums.map(n => soldList.includes(n.number) ? { ...n, status: 'sold' } : n);

    const r1Nums = seedSold(createNumbers(), [3, 7, 15, 21, 34, 55, 88]);
    const r2Nums = seedSold(createNumbers(), [1, 2, 10, 50, 99]);

    const buyers1: Buyer[] = [
      { id: crypto.randomUUID(), name: 'María López', email: 'maria@example.com', phone: '1133344455', numberBought: 3 },
      { id: crypto.randomUUID(), name: 'Juan Pérez', email: 'juan@example.com', phone: '1144455566', numberBought: 7 },
    ];

    const buyers2: Buyer[] = [
      { id: crypto.randomUUID(), name: 'Ana Torres', email: 'ana@example.com', phone: '1122233344', numberBought: 1 },
    ];

    const now = new Date();
    const plus3d = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const plus5d = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);

    return [
      {
        id: 'raffle-eco-bike',
        name: 'Sorteo Bicicleta EcoX',
        organizer: 'Green Raffles',
        alias: 'eco-bike',
        description: 'Ganá una bicicleta eléctrica EcoX de última generación. Batería de larga duración y diseño moderno.',
        raffleDate: plus3d.toISOString(),
        price: 10000,
        numbers: r1Nums,
        buyers: buyers1
      },
      {
        id: 'raffle-iphone',
        name: 'iPhone 15 Pro Verde',
        organizer: 'Tech Verde',
        alias: 'iphone15pro',
        description: 'Participá por un iPhone 15 Pro color verde bosque. Tecnología de punta y rendimiento extremo.',
        raffleDate: plus5d.toISOString(),
        price: 25000,
        numbers: r2Nums,
        buyers: buyers2
      }
    ];
  }
}