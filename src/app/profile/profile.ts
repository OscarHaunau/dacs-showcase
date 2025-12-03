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
  constructor(public profileSvc: UserProfileService) {}

  get profile(): UserProfile { return this.profileSvc.profile(); }

  onFile(evt: Event) {
    const input = evt.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.profileSvc.setAvatarFile(file);
  }

  save() {
    this.profileSvc.update({ ...this.profile });
  }
}