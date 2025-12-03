import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RaffleStateService } from '../core/services/raffle-state.service';
import { StatsCardsComponent } from '../components/stats-cards/stats-cards';
import { CountdownComponent } from '../components/countdown/countdown';
import { BuyersTableComponent } from '../components/buyers-table/buyers-table';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterLink, StatsCardsComponent, BuyersTableComponent, CountdownComponent],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css']
})
export class AdminComponent {
  constructor(public state: RaffleStateService, private route: ActivatedRoute, private router: Router) {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.state.setCurrentRaffle(id);
  }
  back() { this.router.navigate(['/raffle']); }
  exportCSV() {
    const r = this.state.currentRaffle();
    if (!r) return;
    const rows = r.buyers.map(b => `${b.name},${b.email},${b.phone},${b.numberBought}`);
    const csv = ['Nombre,Email,Telefono,Numero', ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${r.alias}-compradores.csv`; a.click();
    URL.revokeObjectURL(url);
  }
}