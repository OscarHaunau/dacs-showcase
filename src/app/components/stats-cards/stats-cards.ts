import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-cards.html',
  styleUrls: ['./stats-cards.css']
})
export class StatsCardsComponent {
  @Input() sold = 0;
  @Input() available = 0;
  @Input() processing = 0;
  @Input() revenue = 0;
  @Input() total = 0;
}