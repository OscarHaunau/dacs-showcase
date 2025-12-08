export type RaffleNumberStatus = 'available' | 'sold' | 'processing';

export interface RaffleNumber {
  number: number;
  status: RaffleNumberStatus;
  buyerId?: string;
}

export interface Buyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  numberBought: number;
}

export interface Raffle {
  id: string;
  name: string;
  organizer: string;
  alias: string;
  description: string;
  raffleDate: string;
  price: number;
  numbers: RaffleNumber[];
  buyers: Buyer[];
}