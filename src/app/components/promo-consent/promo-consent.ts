import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TermsConsentService } from '../../core/services/terms-consent.service';

@Component({
  selector: 'app-promo-consent',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './promo-consent.html',
  styleUrls: ['./promo-consent.css']
})
export class PromoConsentComponent {
  checked = signal(false);
  constructor(public terms: TermsConsentService) {}
  visible() { return !this.terms.accepted(); }
  toggleChecked() { this.checked.set(!this.checked()); }
  accept() { if (this.checked()) this.terms.accept(); }
}