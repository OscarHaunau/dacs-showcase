import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RaffleStateService } from '../../core/services/raffle-state.service';
import { Raffle } from '../../core/models/raffle';
import { CountdownComponent } from '../../components/countdown/countdown';
import { NumberGridComponent } from '../../components/number-grid/number-grid';
import { PurchaseModalComponent } from '../../components/purchase-modal/purchase-modal';
import { ToastService } from '../../core/services/toast.service';
import { UserProfileService } from '../../core/services/user-profile.service';
import { Buyer } from '../../core/models/raffle';
import { MercadoPagoService } from '../../core/services/mercado-pago.service';

@Component({
  selector: 'app-raffle-detail',
  standalone: true,
  imports: [CommonModule, CountdownComponent, NumberGridComponent, PurchaseModalComponent],
  templateUrl: './raffle-detail.html',
  styleUrls: ['./raffle-detail.css']
})
export class RaffleDetailComponent {
  raffle: Raffle | null = null;
  selectedNumber: number | null = null;
  showModal = false;
  showConfetti = false;
  paying = false;

  constructor(private state: RaffleStateService, private route: ActivatedRoute, private router: Router, private toast: ToastService, public profileSvc: UserProfileService, private gateway: MercadoPagoService) {
    this.loadRaffle();
  }

  loadRaffle() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) return;

    const found = this.state.getRaffleById(id);
    if (!found) return;

    this.state.setCurrentRaffle(id);
    this.raffle = { ...found };
  }

  back() { this.router.navigate(['/raffle']); }
  goAdmin() { if (this.raffle) this.router.navigate(['/admin', this.raffle.id]); }
  pickNumber(n: number) { this.selectedNumber = n; this.showModal = true; }
  cancelModal() { this.showModal = false; }
  async submitPurchase(data: { name: string; email: string; phone: string }) {
    if (!this.raffle || this.selectedNumber === null || this.paying) return;

    const raffleId = this.raffle.id;
    const number = this.selectedNumber;
    const buyer: Buyer = { id: crypto.randomUUID(), ...data, numberBought: number };

    this.paying = true;
    this.state.updateNumberStatus(raffleId, number, 'processing');

    const result = await this.gateway.pay(this.raffle.price, `${this.raffle.name} número ${number}`);

    this.showModal = false;
    this.paying = false;

    if (result.success) {
      this.state.updateNumberStatus(raffleId, number, 'sold', buyer);
      this.handleSuccess(result.message);
    } else {
      this.state.updateNumberStatus(raffleId, number, 'available');
      this.handleFailure(result.message);
    }
  }

  private handleSuccess(message?: string) {
    this.toast.show(message ?? 'Compra confirmada. ¡Número vendido!', 'success');
    this.showConfetti = true;
    setTimeout(() => this.showConfetti = false, 2500);
  }

  private handleFailure(message?: string) {
    this.toast.show(message ?? 'Pago fallido, intenta nuevamente.', 'error');
  }
}