import { Injectable } from '@angular/core';
import { Buyer, Raffle, RaffleNumber, RaffleNumberStatus } from '../models/raffle';

@Injectable({ providedIn: 'root' })
export class RaffleStateService {
  private raffles: Raffle[] = this.generateMockRaffles();
  private currentId: string | null = null;
  private results = new Map<string, { ganador: number; respaldo?: number; fuenteNombre?: string; fuenteUrl?: string; fecha: string }>();

  setCurrentRaffle(id: string) {
    this.currentId = id;
  }

  getCurrentRaffle(): Raffle | null {
    if (!this.currentId) {
      return null;
    }

    return this.getRaffleById(this.currentId) ?? null;
  }

  getRaffles(): Raffle[] {
    return [...this.raffles];
  }

  getRaffleById(id: string): Raffle | undefined {
    return this.raffles.find(r => r.id === id);
  }

  addRaffle(raffle: Raffle) {
    this.raffles = [...this.raffles, raffle];
  }

  updateRaffle(next: Raffle) {
    this.raffles = this.raffles.map(r => r.id === next.id ? next : r);
  }

  setNumbers(raffleId: string, count: number) {
    const raffle = this.getRaffleById(raffleId);
    if (!raffle) return;

    const numbers = this.createNumbers(count);
    const updated = { ...raffle, numbers, buyers: [] };
    this.updateRaffle(updated);
  }

  updateNumberStatus(raffleId: string, number: number, status: RaffleNumberStatus, buyer?: Buyer) {
    const raffle = this.getRaffleById(raffleId);
    if (!raffle) return;

    const numbers = raffle.numbers.map(n => n.number === number ? { ...n, status, buyerId: buyer?.id } : n);
    const buyers = this.refreshBuyers(raffle.buyers, status, number, buyer);
    const updated = { ...raffle, numbers, buyers };

    this.updateRaffle(updated);
  }

  simulatePurchase(raffleId: string, number: number, buyerData: Omit<Buyer, 'id'|'numberBought'>, onResult: (success: boolean) => void) {
    if (!this.getRaffleById(raffleId)) return;

    const id = crypto.randomUUID();
    const buyer: Buyer = { id, ...buyerData, numberBought: number };
    this.updateNumberStatus(raffleId, number, 'processing');

    setTimeout(() => {
      const success = Math.random() < 0.7;
      const status = success ? 'sold' : 'available';

      this.updateNumberStatus(raffleId, number, status, buyer);
      onResult(success);
    }, 1200);
  }

  getStats(raffle: Raffle) {
    let sold = 0;
    let processing = 0;
    let available = 0;

    for (const number of raffle.numbers) {
      if (number.status === 'sold') sold++;
      else if (number.status === 'processing') processing++;
      else available++;
    }

    const revenue = sold * raffle.price;
    return { sold, processing, available, revenue };
  }

  publishResult(raffleId: string, ganador: number, respaldo: number | undefined, fuenteNombre: string | undefined, fuenteUrl: string | undefined) {
    const fecha = new Date().toISOString();
    this.results.set(raffleId, { ganador, respaldo, fuenteNombre, fuenteUrl, fecha });
  }

  getResult(raffleId: string) {
    return this.results.get(raffleId);
  }

  private createNumbers(count: number): RaffleNumber[] {
    const numbers: RaffleNumber[] = [];

    for (let i = 0; i < count; i++) {
      numbers.push({ number: i + 1, status: 'available' as RaffleNumberStatus });
    }

    return numbers;
  }

  private refreshBuyers(existing: Buyer[], status: RaffleNumberStatus, number: number, buyer?: Buyer) {
    const withoutNumber = existing.filter(b => b.numberBought !== number);

    if (status === 'sold' && buyer) {
      return [...withoutNumber, buyer];
    }

    return withoutNumber;
  }

  private generateMockRaffles(): Raffle[] {
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();
    const fiveDaysFromNow = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString();

    const raffleOne = this.buildMockRaffle(
      'raffle-eco-bike',
      'Sorteo Bicicleta EcoX',
      'Green Raffles',
      'eco-bike',
      'Ganá una bicicleta eléctrica EcoX de última generación. Batería de larga duración y diseño moderno.',
      10000,
      threeDaysFromNow,
      [3, 7, 15, 21, 34, 55, 88],
      [
        { name: 'María López', email: 'maria@example.com', phone: '1133344455', numberBought: 3 },
        { name: 'Juan Pérez', email: 'juan@example.com', phone: '1144455566', numberBought: 7 }
      ]
    );

    const raffleTwo = this.buildMockRaffle(
      'raffle-iphone',
      'iPhone 15 Pro Verde',
      'Tech Verde',
      'iphone15pro',
      'Participá por un iPhone 15 Pro color verde bosque. Tecnología de punta y rendimiento extremo.',
      25000,
      fiveDaysFromNow,
      [1, 2, 10, 50, 99],
      [
        { name: 'Ana Torres', email: 'ana@example.com', phone: '1122233344', numberBought: 1 }
      ]
    );

    return [raffleOne, raffleTwo];
  }

  private buildMockRaffle(
    id: string,
    name: string,
    organizer: string,
    alias: string,
    description: string,
    price: number,
    raffleDate: string,
    soldNumbers: number[],
    buyers: Array<Omit<Buyer, 'id'>>
  ): Raffle {
    const numbers = this.createNumbers(100).map(n =>
      soldNumbers.includes(n.number) ? { ...n, status: 'sold' as RaffleNumberStatus } : n
    );

    const buyersWithIds: Buyer[] = buyers.map(buyer => ({
      ...buyer,
      id: crypto.randomUUID(),
    }));

    return {
      id,
      name,
      organizer,
      alias,
      description,
      raffleDate,
      price,
      numbers,
      buyers: buyersWithIds,
    };
  }
}