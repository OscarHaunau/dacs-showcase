import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RaffleStateService } from '../../core/services/raffle-state.service';
import { Raffle } from '../../core/models/raffle';

@Component({
  selector: 'app-sorteo-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sorteo-form.html',
  styleUrls: ['./sorteo-form.css']
})
export class SorteoFormComponent {
  mode: 'edit' | 'new' = 'new';
  id: string | null = null;

  name = '';
  organizer = '';
  alias = '';
  description = '';
  raffleDate = '';
  price = 1;
  count = 100;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private state: RaffleStateService
  ) {
    this.loadRaffleFromRoute();
  }

  save() {
    if (this.price <= 0) {
      alert('El precio debe ser mayor a 0.');
      return;
    }

    if (this.mode === 'new') {
      this.createRaffle();
      return;
    }

    this.updateRaffle();
  }

  cancel() {
    this.router.navigate(['/raffle']);
  }

  private loadRaffleFromRoute() {
    this.id = this.route.snapshot.paramMap.get('id');
    if (!this.id) return;

    const raffle = this.state.getRaffleById(this.id);
    if (!raffle) return;

    this.mode = 'edit';
    this.name = raffle.name;
    this.organizer = raffle.organizer;
    this.alias = raffle.alias;
    this.description = raffle.description;
    this.raffleDate = raffle.raffleDate;
    this.price = raffle.price > 0 ? raffle.price : 1;
    this.count = raffle.numbers.length || 100;
  }

  private createRaffle() {
    const id = `raffle-${this.alias || crypto.randomUUID()}`;
    const numbers = this.buildNumbers(100);

    const defaultDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();

    const raffle: Raffle = {
      id,
      name: this.name,
      organizer: this.organizer,
      alias: this.alias || id,
      description: this.description,
      raffleDate: this.raffleDate || defaultDate,
      price: Number(this.price),
      numbers,
      buyers: []
    };

    this.state.addRaffle(raffle);
    this.router.navigate(['/admin', raffle.id]);
  }

  private updateRaffle() {
    const existing = this.id ? this.state.getRaffleById(this.id) : null;
    if (!existing) return;

    const updated: Raffle = {
      ...existing,
      name: this.name,
      organizer: this.organizer,
      alias: this.alias,
      description: this.description,
      raffleDate: this.raffleDate,
      price: Number(this.price),
      numbers: existing.numbers
    };

    this.state.updateRaffle(updated);
    this.router.navigate(['/admin', existing.id]);
  }

  private buildNumbers(count: number) {
    return Array.from({ length: count }, (_, i) => ({
      number: i + 1,
      status: 'available' as const
    }));
  }
}
