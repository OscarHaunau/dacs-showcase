import { Injectable } from '@angular/core';

export interface ToastMsg { id: string; text: string; type: 'success'|'error'|'info'; }

@Injectable({ providedIn: 'root' })
export class ToastService {
  messages: ToastMsg[] = [];
  show(text: string, type: 'success'|'error'|'info' = 'info') {
    const msg = { id: crypto.randomUUID(), text, type };
    this.messages = [...this.messages, msg];
    setTimeout(() => this.dismiss(msg.id), 3000);
  }
  dismiss(id: string) {
    this.messages = this.messages.filter(m => m.id !== id);
  }
}