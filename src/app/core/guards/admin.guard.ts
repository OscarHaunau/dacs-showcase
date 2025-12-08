import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserProfileService } from '../services/user-profile.service';
import { RaffleStateService } from '../services/raffle-state.service';

export const adminGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const profileSvc = inject(UserProfileService);
  const state = inject(RaffleStateService);
  const p = profileSvc.profile();
  if (p.role !== 'admin') {
    router.navigate(['/profile']);
    return false;
  }
  const id = route.paramMap.get('id');
  if (!id) return true;
  const r = state.getRaffleById(id);
  if (!r) {
    router.navigate(['/raffle']);
    return false;
  }
  const isOwner = r.organizer === p.name || r.alias === p.alias;
  if (!isOwner) {
    router.navigate(['/raffle', id]);
    return false;
  }
  return true;
};