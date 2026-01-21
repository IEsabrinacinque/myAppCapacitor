import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ToastService {

  // Signals per il toast
  public showToast = signal(false);
  public toastMessage = signal('');
  public toastType = signal<'success' | 'error' | 'warning'>('success');

  constructor() {}

  /**
   * Mostra un toast
   */
  show(messaggio: string, tipo: 'success' | 'error' | 'warning' = 'success') {
    this.toastMessage.set(messaggio);
    this.toastType.set(tipo);
    this.showToast.set(true);

    // Nascondi dopo 5 secondi
    setTimeout(() => {
      this.showToast.set(false);
    }, 5000);
  }

  /**
   * Nascondi il toast manualmente
   */
  hide() {
    this.showToast.set(false);
  }
}