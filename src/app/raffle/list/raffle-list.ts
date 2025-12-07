import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RaffleStateService } from '../../core/services/raffle-state.service';
import { Raffle } from '../../core/models/raffle';
import { RaffleCardComponent } from '../../components/raffle-card/raffle-card';
import { KeycloakService } from '../../core/services/keycloak.service';

@Component({
  selector: 'app-raffle-list',
  standalone: true,
  imports: [CommonModule, RaffleCardComponent],
  templateUrl: './raffle-list.html',
  styleUrls: ['./raffle-list.css']
})
export class RaffleListComponent {
  query = signal('');
  raffles = signal<Raffle[]>([]);

  constructor(
    private state: RaffleStateService,
    private router: Router
    , private keycloak: KeycloakService
  ) {
    // efecto de búsqueda
    effect(() => {
      const q = this.query().toLowerCase().trim();
      const base = this.state.getRaffles();

      if (!q) {
        this.raffles.set(base);
        return;
      }

      this.raffles.set(
        base.filter(r =>
          r.name.toLowerCase().includes(q) ||
          r.organizer.toLowerCase().includes(q)
        )
      );
    });

    // estado inicial
    this.raffles.set(this.state.getRaffles());
  }

  viewRaffle(id: string) {
    this.router.navigate(['/raffle', id]);
  }

  login() {
    this.keycloak.login().catch(e => console.warn('Login error', e));
  }

  hasFetchError(): boolean {
    try {
      return this.state.fetchError();
    } catch (e) {
      return false;
    }
  }
}
