import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserProfileService } from '../services/user-profile.service';
import { RaffleStateService } from '../services/raffle-state.service';

export const adminGuard: CanActivateFn = (ruta) => {
  const router = inject(Router);
  const perfilServicio = inject(UserProfileService);
  const sorteoServicio = inject(RaffleStateService);

  const perfil = perfilServicio.profile();

  // Verificar si el usuario es administrador
  if (perfil.role !== 'admin') {
    router.navigate(['/profile']);
    return false;
  }

  // Si no hay ID en la ruta, permitir acceso (ej: /admin/new)
  const idSorteo = ruta.paramMap.get('id');
  if (!idSorteo) {
    return true;
  }

  // Verificar que el sorteo existe
  const sorteo = sorteoServicio.obtenerSorteoPorId(idSorteo);
  if (!sorteo) {
    router.navigate(['/raffle']);
    return false;
  }

  // Verificar que el admin sea dueño del sorteo
  const esDuenio =
    sorteo.organizer === perfil.name ||
    sorteo.alias === perfil.alias;

  if (!esDuenio) {
    router.navigate(['/raffle', idSorteo]);
    return false;
  }

  return true;
};
