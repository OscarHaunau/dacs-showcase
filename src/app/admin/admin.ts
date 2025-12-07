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

  back() {
    this.router.navigate(['/raffle']);
  }

  downloadBuyersCsv() {
    const raffle = this.state.getCurrentRaffle();
    if (!raffle) return;

    const csv = this.createCsvContent(raffle.buyers);
    const fileName = `${raffle.alias}-compradores.csv`;

    this.downloadTextFile(csv, fileName);
  }

  private createCsvContent(buyers: { name: string; email: string; phone: string; numberBought: number }[]) {
    const header = 'Nombre,Email,Telefono,Numero';
    const rows = buyers.map(b => `${b.name},${b.email},${b.phone},${b.numberBought}`);
    return [header, ...rows].join('\n');
  }

  private downloadTextFile(content: string, name: string) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.click();
    URL.revokeObjectURL(url);
  }
}