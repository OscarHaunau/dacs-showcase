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
  price = 1;       // siempre > 0
  count = 100;     // fija

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private state: RaffleStateService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id) {
      const r = this.state.getRaffleById(this.id);
      if (r) {
        this.mode = 'edit';
        this.name = r.name;
        this.organizer = r.organizer;
        this.alias = r.alias;
        this.description = r.description;
        this.raffleDate = r.raffleDate;
        this.price = r.price > 0 ? r.price : 1;
        this.count = r.numbers.length || 100; // solo para mostrar
      }
    }
  }

  save() {
    if (this.price <= 0) {
      alert('El precio debe ser mayor a 0.');
      return;
    }

    if (this.mode === 'new') {
      const now = new Date();
      const id = `raffle-${this.alias || crypto.randomUUID()}`;
      const qty = 100; // fija

      const numbers = Array.from({ length: qty }, (_, i) => ({
        number: i + 1,
        status: 'available' as const
      }));

      const raffle: Raffle = {
        id,
        name: this.name,
        organizer: this.organizer,
        alias: this.alias || id,
        description: this.description,
        raffleDate:
          this.raffleDate ||
          new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        price: Number(this.price),
        numbers,
        buyers: []
      };

      this.state.addRaffle(raffle);
      this.router.navigate(['/admin', raffle.id]);
    } else {
      const r = this.state.getRaffleById(this.id!);
      if (!r) return;

      const updated: Raffle = {
        ...r,
        name: this.name,
        organizer: this.organizer,
        alias: this.alias,
        description: this.description,
        raffleDate: this.raffleDate,
        price: Number(this.price),
        // cantidad de números no cambia
        numbers: r.numbers
      };

      this.state.updateRaffle(updated);
      this.router.navigate(['/admin', r.id]);
    }
  }

  cancel() {
    this.router.navigate(['/raffle']);
  }
}
