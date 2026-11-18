import { Injectable, signal } from '@angular/core';
import { ToastTone } from './models';

export interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private sequence = 0;

  show(message: string, tone: ToastTone = 'success'): void {
    const id = ++this.sequence;
    this.toasts.update(current => [...current, { id, message, tone }]);
    setTimeout(() => this.dismiss(id), 5200);
  }

  dismiss(id: number): void {
    this.toasts.update(current => current.filter(toast => toast.id !== id));
  }
}
