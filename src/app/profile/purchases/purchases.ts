import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ServicioPagos } from '../../core/services/servicio-pagos.service';
import { CompraUsuario } from '../../core/models/modelos-pago';

@Component({
  selector: 'app-purchases',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './purchases.html',
  styleUrls: ['./purchases.css']
})
export class PurchasesComponent implements OnInit {
  compras = signal<CompraUsuario[]>([]);
  cargando = signal(true);
  error = signal<string | null>(null);

  constructor(private servicioPagos: ServicioPagos) {}

  ngOnInit() {
    this.cargarCompras();
  }

  cargarCompras() {
    this.cargando.set(true);
    this.error.set(null);

    this.servicioPagos.obtenerMisCompras().subscribe({
      next: (respuesta) => {
        this.compras.set(respuesta.compras);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar compras:', err);
        this.error.set('No se pudieron cargar tus compras');
        this.cargando.set(false);
      }
    });
  }

  obtenerColorEstado(estado: string): string {
    switch (estado) {
      case 'aprobado':
        return '#22c55e';
      case 'pendiente':
        return '#fbbf24';
      case 'rechazado':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  }

  obtenerTextoEstado(estado: string): string {
    switch (estado) {
      case 'aprobado':
        return 'Aprobado';
      case 'pendiente':
        return 'Pendiente';
      case 'rechazado':
        return 'Rechazado';
      default:
        return estado;
    }
  }
}
