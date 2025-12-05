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
  raffle: Raffle | undefined;
  number = 0;
  name = '';
  email = '';
  phone = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private state: RaffleStateService,
    private profile: UserProfileService,
    private toast: ToastService
  ) {
    const id = this.route.snapshot.paramMap.get('id')!;
    const num = Number(this.route.snapshot.paramMap.get('number'));
    this.number = num;
    this.raffle = this.state.getRaffleById(id);
    const p = this.profile.profile();
    this.name = p.name; this.email = p.email; this.phone = '';
  }

  submit() {
    if (!this.raffle) return;
    this.state.simulatePurchase(this.raffle.id, this.number, { name: this.name, email: this.email, phone: this.phone }, (ok) => {
      if (ok) this.toast.show('Compra confirmada. ¡Número vendido!', 'success');
      else this.toast.show('Pago fallido, intenta nuevamente.', 'error');
      this.router.navigate(['/raffle', this.raffle!.id]);
    });
  }

  cancel() { if (this.raffle) this.router.navigate(['/raffle', this.raffle.id]); }}
