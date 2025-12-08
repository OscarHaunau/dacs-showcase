import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RaffleStateService } from '../../core/services/raffle-state.service';
import { ServicioPagos } from '../../core/services/servicio-pagos.service';
import { Raffle } from '../../core/models/raffle';
import { CountdownComponent } from '../../components/countdown/countdown';
import { NumberGridComponent } from '../../components/number-grid/number-grid';
import { PurchaseModalComponent } from '../../components/purchase-modal/purchase-modal';
import { ToastService } from '../../core/services/toast.service';
import { UserProfileService } from '../../core/services/user-profile.service';

@Component({
  selector: 'app-raffle-detail',
  standalone: true,
  imports: [CommonModule, CountdownComponent, NumberGridComponent, PurchaseModalComponent],
  templateUrl: './raffle-detail.html',
  styleUrls: ['./raffle-detail.css']
})
export class RaffleDetailComponent {
  sorteo = signal<Raffle | null>(null);
  cuentaRegresiva = signal<string>('');
  numeroSeleccionado = signal<number | null>(null);
  mostrarModal = signal(false);
  mostrarConfetti = signal(false);

  // Estados para el flujo de pago
  cargandoPago = signal(false);
  errorPago = signal<string | null>(null);

  constructor(
    private servicio: RaffleStateService,
    private servicioPagos: ServicioPagos,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService,
    public profileSvc: UserProfileService
  ) {
    const id = this.route.snapshot.paramMap.get('id')!;
    const sorteoEncontrado = this.servicio.obtenerSorteoPorId(id);

    if (sorteoEncontrado) {
      this.servicio.establecerSorteoActual(id);
      this.sorteo.set(sorteoEncontrado);
      this.iniciarCuentaRegresiva(sorteoEncontrado.raffleDate);
    }
  }

  iniciarCuentaRegresiva(fechaObjetivo: string) {
    const tiempoObjetivo = new Date(fechaObjetivo).getTime();

    const actualizar = () => {
      const ahora = Date.now();
      const diferencia = Math.max(tiempoObjetivo - ahora, 0);

      const dias = Math.floor(diferencia / (24 * 60 * 60 * 1000));
      const horas = Math.floor((diferencia % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
      const minutos = Math.floor((diferencia % (60 * 60 * 1000)) / (60 * 1000));
      const segundos = Math.floor((diferencia % (60 * 1000)) / 1000);

      this.cuentaRegresiva.set(`${dias}d ${horas}h ${minutos}m ${segundos}s`);
    };

    actualizar();
    setInterval(actualizar, 1000);
  }

  volver() {
    this.router.navigate(['/raffle']);
  }

  irAAdmin() {
    if (this.sorteo()) {
      this.router.navigate(['/admin', this.sorteo()!.id]);
    }
  }

  seleccionarNumero(numero: number) {
    this.numeroSeleccionado.set(numero);
    this.mostrarModal.set(true);
    this.errorPago.set(null);
  }

  cancelarModal() {
    this.mostrarModal.set(false);
    this.cargandoPago.set(false);
    this.errorPago.set(null);
  }

  confirmarCompra(datos: { name: string; email: string; phone: string }) {
    if (!this.sorteo() || this.numeroSeleccionado() === null) return;

    const idSorteo = this.sorteo()!.id;
    const numero = this.numeroSeleccionado()!;

    // Activar estado de carga
    this.cargandoPago.set(true);
    this.errorPago.set(null);

    // Crear orden de pago en el backend
    this.servicioPagos.crearOrdenPago({
      sorteoId: idSorteo,
      numero: numero,
      comprador: datos
    }).subscribe({
      next: (respuesta) => {
        // Marcar número como "processing" inmediatamente
        this.servicio.actualizarEstadoNumero(
          idSorteo,
          numero,
          'processing'
        );

        // Redirigir a MercadoPago
        window.location.href = respuesta.initPoint;
      },
      error: (err) => {
        console.error('Error al crear orden de pago:', err);
        this.cargandoPago.set(false);

        // Mostrar error específico si el backend lo provee
        const mensajeError = err.error?.mensaje || 'No se pudo procesar la compra. Intentá nuevamente.';
        this.errorPago.set(mensajeError);
        this.toast.show(mensajeError, 'error');
      }
    });
  }
}
