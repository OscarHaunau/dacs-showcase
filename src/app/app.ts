import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KeycloakService } from './core/services/keycloak.service';
import { RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from './components/toast/toast';
import { PromoConsentComponent } from './components/promo-consent/promo-consent';
import { TopbarComponent } from './components/topbar/topbar';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, ToastContainerComponent, PromoConsentComponent, TopbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('dacs-fe');
  constructor() {}
}
