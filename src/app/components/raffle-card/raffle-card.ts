import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Raffle } from '../../core/models/raffle';
import { UserProfileService, UserProfile } from '../../core/services/user-profile.service';

@Component({
  selector: 'app-raffle-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './raffle-card.html',
  styleUrls: ['./raffle-card.css']
})
export class RaffleCardComponent {
  @Input() raffle!: Raffle;
  constructor(private profileSvc: UserProfileService) {}
  get profile(): UserProfile { return this.profileSvc.profile(); }
  get isAdminOwner(): boolean {
    const p = this.profile;
    if (!p || !this.raffle) return false;
    if (p.role !== 'admin') return false;
    return this.raffle.organizer === p.name || this.raffle.alias === p.alias;
  }
  get daysLeft(): number {
    const target = new Date(this.raffle.raffleDate).getTime();
    const diffMs = target - Date.now();
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return Math.max(days, 0);
  }
  get totalNumbers(): number {
    return this.raffle.numbers?.length ?? 0;
  }
}