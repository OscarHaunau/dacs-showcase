import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Buyer } from '../../core/models/raffle';

@Component({
  selector: 'app-buyers-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './buyers-table.html',
  styleUrls: ['./buyers-table.css']
})
export class BuyersTableComponent {
  @Input() buyers: Buyer[] = [];
  hidePhone = false;
  query = '';
  get filtered() {
    const q = this.query.toLowerCase();
    return this.buyers.filter(b =>
      b.name.toLowerCase().includes(q) || b.email.toLowerCase().includes(q) || b.phone.toLowerCase().includes(q)
    );
  }
}