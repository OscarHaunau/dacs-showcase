import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RaffleStateService } from '../core/services/raffle-state.service';
import { StatsCardsComponent } from '../components/stats-cards/stats-cards';
import { CountdownComponent } from '../components/countdown/countdown';
import { BuyersTableComponent } from '../components/buyers-table/buyers-table';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, StatsCardsComponent, BuyersTableComponent, CountdownComponent],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminComponent {
  constructor(
    public servicio: RaffleStateService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.servicio.establecerSorteoActual(id);
  }

  volver() {
    this.router.navigate(['/raffle']);
  }

  exportarCSV() {
    const sorteo = this.servicio.sorteoActual();
    if (!sorteo) return;

    // Crear filas del CSV
    const filas = sorteo.buyers.map(comprador =>
      `${comprador.name},${comprador.email},${comprador.phone},${comprador.numberBought}`
    );

    // Agregar encabezado
    const csv = ['Nombre,Email,Telefono,Numero', ...filas].join('\n');

    // Generar archivo y descargarlo
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sorteo.alias}-compradores.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
}
