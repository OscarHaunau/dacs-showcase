import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastContainerComponent } from './components/toast/toast';
import { PromoConsentComponent } from './components/promo-consent/promo-consent';
import { TopbarComponent } from './components/topbar/topbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastContainerComponent, PromoConsentComponent, TopbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('dacs-fe');
  toggleDark() {
    document.body.classList.toggle('dark');
  }
}
