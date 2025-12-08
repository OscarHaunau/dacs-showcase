import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioPagos } from '../../core/services/servicio-pagos.service';
import { RaffleStateService } from '../../core/services/raffle-state.service';
import { EstadoOrdenResponse } from '../../core/models/modelos-pago';

@Component({
  selector: 'app-pago-error',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pago-error.component.html',
  styleUrls: ['./pago-error.component.css']
})
export class PagoErrorComponent implements OnInit {
  detallesOrden = signal<EstadoOrdenResponse | null>(null);
  cargando = signal(true);
  error = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private servicioPagos: ServicioPagos,
    private servicioSorteos: RaffleStateService
  ) {}

  ngOnInit() {
    // Extraer ordenId de los query params
    const params = this.route.snapshot.queryParams;
    const ordenId = params['external_reference'] || params['ordenId'];

    if (!ordenId) {
      this.error.set('No se encontró el número de orden');
      this.cargando.set(false);
      return;
    }

    // Consultar estado de la orden
    this.servicioPagos.obtenerEstadoOrden(ordenId).subscribe({
      next: (orden) => {
        this.detallesOrden.set(orden);
        this.cargando.set(false);

        // Liberar el número, volver a disponible
        this.servicioSorteos.actualizarEstadoNumero(
          orden.sorteoId,
          orden.numero,
          'available'
        );
      },
      error: (err) => {
        console.error('Error al obtener detalles de la orden:', err);
        this.error.set('No se pudieron cargar los detalles de tu compra');
        this.cargando.set(false);
      }
    });
  }

  reintentar() {
    const sorteoId = this.detallesOrden()?.sorteoId;
    if (sorteoId) {
      this.router.navigate(['/raffle', sorteoId]);
    } else {
      this.router.navigate(['/raffle']);
    }
  }

  elegirOtroNumero() {
    this.reintentar();
  }

  volverASorteos() {
    this.router.navigate(['/raffle']);
  }
}
