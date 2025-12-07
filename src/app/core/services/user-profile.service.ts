import { Injectable } from '@angular/core';

export type UserRole = 'user' | 'admin';

export interface UserProfile {
  name: string;
  alias: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

const STORAGE_KEY = 'rifa_user_profile_v1';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private profileData: UserProfile = this.read();

  profile() { return this.profileData; }

  update(partial: Partial<UserProfile>) {
    const next = { ...this.profileData, ...partial };
    this.profileData = next;
    this.persist(next);
  }

  async setAvatarFile(file: File) {
    const dataUrl = await this.fileToDataUrl(file);
    this.update({ avatar: dataUrl });
  }

  private async fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private read(): UserProfile {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {}
    return { name: 'Usuario', alias: 'usuario', email: 'user@example.com', role: 'user' };
  }

  private persist(p: UserProfile) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {}
  }
}