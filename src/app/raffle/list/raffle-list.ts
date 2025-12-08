import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RaffleStateService } from '../../core/services/raffle-state.service';
import { Raffle } from '../../core/models/raffle';
import { RaffleCardComponent } from '../../components/raffle-card/raffle-card';

@Component({
  selector: 'app-raffle-list',
  standalone: true,
  imports: [CommonModule, RaffleCardComponent],
  templateUrl: './raffle-list.html',
  styleUrls: ['./raffle-list.css']
})
export class RaffleListComponent {
  busqueda = signal('');
  sorteos = signal<Raffle[]>([]);

  constructor(
    private servicio: RaffleStateService,
    private router: Router
  ) {
    // Filtrar sorteos en tiempo real según búsqueda
    effect(() => {
      const textoBusqueda = this.busqueda().toLowerCase().trim();
      const todosSorteos = this.servicio.obtenerSorteos();

      if (!textoBusqueda) {
        this.sorteos.set(todosSorteos);
        return;
      }

      const sorteosFiltrados = todosSorteos.filter(sorteo =>
        sorteo.name.toLowerCase().includes(textoBusqueda) ||
        sorteo.organizer.toLowerCase().includes(textoBusqueda)
      );

      this.sorteos.set(sorteosFiltrados);
    });

    // Cargar sorteos inicialmente
    this.sorteos.set(this.servicio.obtenerSorteos());
  }

  verSorteo(id: string) {
    this.router.navigate(['/raffle', id]);
  }
}
