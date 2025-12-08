import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RaffleStateService } from '../core/services/raffle-state.service';
import { Raffle } from '../core/models/raffle';
import { UserProfileService } from '../core/services/user-profile.service';
import { ToastService } from '../core/services/toast.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class CheckoutComponent {
  sorteo: Raffle | undefined;
  numero = 0;
  nombre = '';
  email = '';
  telefono = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private servicio: RaffleStateService,
    private perfilServicio: UserProfileService,
    private toast: ToastService
  ) {
    const id = this.route.snapshot.paramMap.get('id')!;
    const numeroParam = Number(this.route.snapshot.paramMap.get('number'));

    this.numero = numeroParam;
    this.sorteo = this.servicio.obtenerSorteoPorId(id);

    // Pre-cargar datos del perfil
    const perfil = this.perfilServicio.profile();
    this.nombre = perfil.name;
    this.email = perfil.email;
    this.telefono = '';
  }

  confirmar() {
    if (!this.sorteo) return;

    this.servicio.comprarNumero(
      this.sorteo.id,
      this.numero,
      {
        name: this.nombre,
        email: this.email,
        phone: this.telefono
      },
      (exitoso) => {
        if (exitoso) {
          this.toast.show('Compra confirmada. ¡Número vendido!', 'success');
        } else {
          this.toast.show('Pago fallido, intenta nuevamente.', 'error');
        }
        this.router.navigate(['/raffle', this.sorteo!.id]);
      }
    );
  }

  cancelar() {
    if (this.sorteo) {
      this.router.navigate(['/raffle', this.sorteo.id]);
    }
  }
}
