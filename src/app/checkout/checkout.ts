import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RaffleStateService } from '../core/services/raffle-state.service';
import { Raffle } from '../core/models/raffle';
import { UserProfileService } from '../core/services/user-profile.service';
import { ToastService } from '../core/services/toast.service';
import { MercadoPagoService } from '../core/services/mercado-pago.service';
import { Buyer } from '../core/models/raffle';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.html',
  styleUrls: ['./checkout.css']
})
export class CheckoutComponent {
  raffle: Raffle | undefined;
  number = 0;
  name = '';
  email = '';
  phone = '';
  paying = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private state: RaffleStateService,
    private profile: UserProfileService,
    private toast: ToastService,
    private gateway: MercadoPagoService
  ) {
    const id = this.route.snapshot.paramMap.get('id')!;
    const num = Number(this.route.snapshot.paramMap.get('number'));
    this.number = num;
    this.raffle = this.state.getRaffleById(id);
    const p = this.profile.profile();
    this.name = p.name; this.email = p.email; this.phone = '';
  }

  async submit() {
    if (!this.raffle || this.paying) return;

    const buyer: Buyer = { id: crypto.randomUUID(), name: this.name, email: this.email, phone: this.phone, numberBought: this.number };

    this.paying = true;
    this.state.updateNumberStatus(this.raffle.id, this.number, 'processing');

    const result = await this.gateway.pay(this.raffle.price, `${this.raffle.name} número ${this.number}`);

    this.paying = false;

    if (result.success) {
      this.state.updateNumberStatus(this.raffle.id, this.number, 'sold', buyer);
      this.toast.show(result.message ?? 'Compra confirmada. ¡Número vendido!', 'success');
    } else {
      this.state.updateNumberStatus(this.raffle.id, this.number, 'available');
      this.toast.show(result.message ?? 'Pago fallido, intenta nuevamente.', 'error');
    }

    this.router.navigate(['/raffle', this.raffle!.id]);
  }

  cancel() { if (this.raffle) this.router.navigate(['/raffle', this.raffle.id]); }}
