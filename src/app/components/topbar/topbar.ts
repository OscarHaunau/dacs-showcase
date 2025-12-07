import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { UserProfileService, UserProfile } from '../../core/services/user-profile.service';
import { inject } from '@angular/core';
import { KeycloakService } from '../../core/services/keycloak.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './topbar.html',
  styleUrls: ['./topbar.css']
})
export class TopbarComponent {
	keycloakSvc = inject(KeycloakService);
	constructor(public profileSvc: UserProfileService) {}
	get profile(): UserProfile { return this.profileSvc.profile(); }
	toggleDark() { document.body.classList.toggle('dark'); }
}