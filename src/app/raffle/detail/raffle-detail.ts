import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RaffleStateService } from '../../core/services/raffle-state.service';
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
  raffle = signal<Raffle | null>(null);
  countdown = signal<string>('');
  selectedNumber = signal<number | null>(null);
  showModal = signal(false);
  showConfetti = signal(false);

  constructor(private state: RaffleStateService, private route: ActivatedRoute, private router: Router, private toast: ToastService, public profileSvc: UserProfileService) {
    const id = this.route.snapshot.paramMap.get('id')!;
    const r = this.state.getRaffleById(id);
    if (r) {
      this.state.setCurrentRaffle(id);
      this.raffle.set(r);
      this.startCountdown(r.raffleDate);
    }
  }

  startCountdown(targetIso: string) {
    const target = new Date(targetIso).getTime();
    const tick = () => {
      const now = Date.now();
      const d = Math.max(target - now, 0);
      const days = Math.floor(d / (24*60*60*1000));
      const hours = Math.floor((d % (24*60*60*1000)) / (60*60*1000));
      const minutes = Math.floor((d % (60*60*1000)) / (60*1000));
      const seconds = Math.floor((d % (60*1000)) / 1000);
      this.countdown.set(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };
    tick();
    setInterval(tick, 1000);
  }

  back() { this.router.navigate(['/raffle']); }
  goAdmin() { if (this.raffle()) this.router.navigate(['/admin', this.raffle()!.id]); }
  pickNumber(n: number) { this.selectedNumber.set(n); this.showModal.set(true); }
  cancelModal() { this.showModal.set(false); }
  submitPurchase(data: { name: string; email: string; phone: string }) {
    if (!this.raffle() || this.selectedNumber() === null) return;
    const id = this.raffle()!.id;
    const num = this.selectedNumber()!;
    this.state.simulatePurchase(id, num, data, (ok) => {
      this.showModal.set(false);
      if (ok) this.toast.show('Compra confirmada. ¡Número vendido!', 'success');
      else this.toast.show('Pago fallido, intenta nuevamente.', 'error');
      if (ok) {
        this.showConfetti.set(true);
        setTimeout(() => this.showConfetti.set(false), 2500);
      }
    });
  }
}