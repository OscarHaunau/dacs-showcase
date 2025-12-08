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
  modo: 'edit' | 'new' = 'new';
  id: string | null = null;

  nombre = '';
  organizador = '';
  alias = '';
  descripcion = '';
  fechaSorteo = '';
  precio = 1;
  cantidad = 100;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private servicio: RaffleStateService
  ) {
    this.id = this.route.snapshot.paramMap.get('id');

    if (this.id) {
      const sorteo = this.servicio.obtenerSorteoPorId(this.id);

      if (sorteo) {
        this.modo = 'edit';
        this.nombre = sorteo.name;
        this.organizador = sorteo.organizer;
        this.alias = sorteo.alias;
        this.descripcion = sorteo.description;
        this.fechaSorteo = sorteo.raffleDate;
        this.precio = sorteo.price > 0 ? sorteo.price : 1;
        this.cantidad = sorteo.numbers.length || 100;
      }
    }
  }

  guardar() {
    if (this.precio <= 0) {
      alert('El precio debe ser mayor a 0.');
      return;
    }

    if (this.modo === 'new') {
      // Crear nuevo sorteo
      const ahora = new Date();
      const id = `raffle-${this.alias || crypto.randomUUID()}`;
      const cantidadNumeros = 100;

      // Generar números disponibles
      const numeros = [];
      for (let i = 1; i <= cantidadNumeros; i++) {
        numeros.push({
          number: i,
          status: 'available' as const
        });
      }

      // Fecha por defecto: 3 días desde ahora
      const fechaPorDefecto = new Date(ahora.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();

      const nuevoSorteo: Raffle = {
        id,
        name: this.nombre,
        organizer: this.organizador,
        alias: this.alias || id,
        description: this.descripcion,
        raffleDate: this.fechaSorteo || fechaPorDefecto,
        price: Number(this.precio),
        numbers: numeros,
        buyers: []
      };

      this.servicio.agregarSorteo(nuevoSorteo);
      this.router.navigate(['/admin', nuevoSorteo.id]);
    } else {
      // Editar sorteo existente
      const sorteo = this.servicio.obtenerSorteoPorId(this.id!);
      if (!sorteo) return;

      const sorteoActualizado: Raffle = {
        ...sorteo,
        name: this.nombre,
        organizer: this.organizador,
        alias: this.alias,
        description: this.descripcion,
        raffleDate: this.fechaSorteo,
        price: Number(this.precio),
        numbers: sorteo.numbers // La cantidad de números no cambia al editar
      };

      this.servicio.actualizarSorteo(sorteoActualizado);
      this.router.navigate(['/admin', sorteo.id]);
    }
  }

  cancelar() {
    this.router.navigate(['/raffle']);
  }
}
