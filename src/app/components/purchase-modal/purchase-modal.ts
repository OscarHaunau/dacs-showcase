import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-purchase-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './purchase-modal.html',
  styleUrls: ['./purchase-modal.css']
})
export class PurchaseModalComponent {
  @Input() visible = false;
  @Input() number: number | null = null;
  @Input() loading = false;
  @Output() cancel = new EventEmitter<void>();
  @Output() submit = new EventEmitter<{ name: string; email: string; phone: string }>();
}