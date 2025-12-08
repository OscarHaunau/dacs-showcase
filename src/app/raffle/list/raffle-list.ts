import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RaffleStateService } from '../../core/services/raffle-state.service';
import { Raffle } from '../../core/models/raffle';
import { RaffleCardComponent } from '../../components/raffle-card/raffle-card';

@Component({
  selector: 'app-raffle-list',
  standalone: true,
  imports: [CommonModule, RaffleCardComponent],
  templateUrl: './raffle-list.html',
  styleUrls: ['./raffle-list.css']
})
export class RaffleListComponent {
  query = '';
  raffles: Raffle[] = [];
  private allRaffles: Raffle[] = [];

  constructor(private state: RaffleStateService, private router: Router) {
    this.allRaffles = this.state.getRaffles();
    this.raffles = this.allRaffles;
  }

  onSearch(value: string) {
    this.query = value.toLowerCase().trim();
    this.raffles = this.query ? this.filterRaffles() : this.allRaffles;
  }

  viewRaffle(id: string) {
    this.router.navigate(['/raffle', id]);
  }

  private filterRaffles() {
    return this.allRaffles.filter(r =>
      r.name.toLowerCase().includes(this.query) ||
      r.organizer.toLowerCase().includes(this.query)
    );
  }
}
