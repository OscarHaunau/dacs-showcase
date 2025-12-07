import { Injectable } from '@angular/core';

const STORAGE_KEY = 'rifa_terms_accepted';

@Injectable({ providedIn: 'root' })
export class TermsConsentService {
  private acceptedValue = this.readAccepted();

  private readAccepted(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch { return false; }
  }

  accepted() { return this.acceptedValue; }

  accept() {
    try { localStorage.setItem(STORAGE_KEY, 'true'); } catch {}
    this.acceptedValue = true;
  }
  reset() {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    this.acceptedValue = false;
  }
}