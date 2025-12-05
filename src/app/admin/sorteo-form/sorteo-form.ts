import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RaffleStateService } from '../../core/services/raffle-state.service';
import { SorteoService } from '../../core/services/sorteo.service';
import { SorteoDto } from '../../core/models/dto/sorteo-dto';
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
    private state: RaffleStateService,
    private sorteoService: SorteoService
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
      const dto: SorteoDto = {
        nombre: this.name,
        descripcion: this.description,
        fechaSorteo: this.raffleDate || new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        precioNumero: Number(this.price),
        estado: true,
      };
      // Save to backend
      this.sorteoService.saveSorteo(dto).subscribe(s => {
        // refresh local list and navigate to saved sorteo
        this.state.refreshRaffles();
        const newId = s.id !== undefined ? `S-${s.id}` : `S-${Date.now()}`;
        this.router.navigate(['/admin', newId]);
      });
    } else {
      const r = this.state.getRaffleById(this.id!);
      if (!r) return;

      const dto: SorteoDto = {
        id: Number(r.id.toString().replace(/^S-/, '')) || undefined,
        nombre: this.name,
        descripcion: this.description,
        fechaSorteo: this.raffleDate,
        precioNumero: Number(this.price),
        estado: true,
      };
      this.sorteoService.saveSorteo(dto).subscribe(() => {
        this.state.refreshRaffles();
        this.router.navigate(['/admin', r.id]);
      });
    }
  }

  cancel() {
    this.router.navigate(['/raffle']);
  }
}
