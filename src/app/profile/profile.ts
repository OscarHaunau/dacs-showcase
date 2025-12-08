import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserProfileService, UserProfile } from '../core/services/user-profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css']
})
export class ProfileComponent {
  constructor(public perfilServicio: UserProfileService) {}

  get perfil(): UserProfile {
    return this.perfilServicio.profile();
  }

  alSeleccionarArchivo(evento: Event) {
    const input = evento.target as HTMLInputElement;
    const archivo = input.files?.[0];

    if (archivo) {
      this.perfilServicio.setAvatarFile(archivo);
    }
  }

  guardar() {
    this.perfilServicio.update({ ...this.perfil });
  }
}
