import { Injectable, signal } from '@angular/core';

export interface ToastMsg { id: string; text: string; type: 'success'|'error'|'info'; }

@Injectable({ providedIn: 'root' })
export class ToastService {
  messages = signal<ToastMsg[]>([]);
  show(text: string, type: 'success'|'error'|'info' = 'info') {
    const msg = { id: crypto.randomUUID(), text, type };
    this.messages.set([...this.messages(), msg]);
    setTimeout(() => this.dismiss(msg.id), 3000);
  }
  dismiss(id: string) {
    this.messages.set(this.messages().filter(m => m.id !== id));
  }
}