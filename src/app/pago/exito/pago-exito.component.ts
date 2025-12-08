import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ServicioPagos } from '../../core/services/servicio-pagos.service';
import { RaffleStateService } from '../../core/services/raffle-state.service';
import { EstadoOrdenResponse } from '../../core/models/modelos-pago';

@Component({
  selector: 'app-pago-exito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pago-exito.component.html',
  styleUrls: ['./pago-exito.component.css']
})
export class PagoExitoComponent implements OnInit {
  detallesOrden = signal<EstadoOrdenResponse | null>(null);
  cargando = signal(true);
  error = signal<string | null>(null);
  mostrarConfetti = signal(true);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private servicioPagos: ServicioPagos,
    private servicioSorteos: RaffleStateService
  ) {}

  ngOnInit() {
    // Extraer ordenId de los query params (viene como external_reference de MP)
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

        // Actualizar el estado del número en el sorteo
        if (orden.estado === 'aprobado') {
          this.servicioSorteos.actualizarEstadoNumero(
            orden.sorteoId,
            orden.numero,
            'sold',
            {
              id: ordenId,
              name: orden.comprador.name,
              email: orden.comprador.email,
              phone: orden.comprador.phone,
              numberBought: orden.numero
            }
          );
        }

        // Ocultar confetti después de 3 segundos
        setTimeout(() => this.mostrarConfetti.set(false), 3000);
      },
      error: (err) => {
        console.error('Error al obtener detalles de la orden:', err);
        this.error.set('No se pudieron cargar los detalles de tu compra');
        this.cargando.set(false);
      }
    });
  }

  volverAlSorteo() {
    const sorteoId = this.detallesOrden()?.sorteoId;
    if (sorteoId) {
      this.router.navigate(['/raffle', sorteoId]);
    } else {
      this.router.navigate(['/raffle']);
    }
  }

  verMisCompras() {
    this.router.navigate(['/profile/purchases']);
  }
}
