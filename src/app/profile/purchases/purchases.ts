import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RaffleStateService } from '../../core/services/raffle-state.service';
import { UserProfileService } from '../../core/services/user-profile.service';

@Component({
  selector: 'app-purchases',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './purchases.html',
  styleUrls: ['./purchases.css']
})
export class PurchasesComponent {
  constructor(private state: RaffleStateService, private profileSvc: UserProfileService) {}

  purchases = computed(() => {
    const email = this.profileSvc.profile().email.toLowerCase();
    const raffles = this.state.getRaffles();
    const rows = [] as Array<{ raffleId: string; raffleName: string; alias: string; number: number; price: number; date: string }>;
    for (const r of raffles) {
      for (const b of r.buyers) {
        if (b.email.toLowerCase() === email) {
          rows.push({ raffleId: r.id, raffleName: r.name, alias: r.alias, number: b.numberBought, price: r.price, date: r.raffleDate });
        }
      }
    }
    return rows;
  });
}