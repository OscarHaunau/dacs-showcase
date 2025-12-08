import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'rifa_terms_accepted';

@Injectable({ providedIn: 'root' })
export class TermsConsentService {
  private acceptedSig = signal<boolean>(this.readAccepted());

  private readAccepted(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch { return false; }
  }

  accepted() { return this.acceptedSig(); }

  accept() {
    try { localStorage.setItem(STORAGE_KEY, 'true'); } catch {}
    this.acceptedSig.set(true);
  }
  reset() {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    this.acceptedSig.set(false);
  }
}