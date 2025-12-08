import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RaffleNumber } from '../../core/models/raffle';

@Component({
  selector: 'app-number-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './number-grid.html',
  styleUrls: ['./number-grid.css']
})
export class NumberGridComponent {
  @Input() numbers: RaffleNumber[] = [];
  @Output() select = new EventEmitter<number>();
}