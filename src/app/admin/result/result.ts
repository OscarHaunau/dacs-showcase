import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RaffleStateService } from '../../core/services/raffle-state.service';

@Component({
  selector: 'app-admin-result',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './result.html',
  styleUrls: ['./result.css']
})
export class AdminResultComponent {
  id: string;
  ganador: number | null = null;
  respaldo: number | null = null;
  fuenteNombre: string = '';
  fuenteUrl: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public servicio: RaffleStateService
  ) {
    this.id = this.route.snapshot.paramMap.get('id')!;
  }

  publicar() {
    if (this.ganador === null) {
      alert('Debes seleccionar un número ganador.');
      return;
    }

    this.servicio.publicarResultado(
      this.id,
      this.ganador,
      this.respaldo ?? undefined,
      this.fuenteNombre || undefined,
      this.fuenteUrl || undefined
    );

    this.router.navigate(['/admin', this.id]);
  }

  cancelar() {
    this.router.navigate(['/admin', this.id]);
  }
}
