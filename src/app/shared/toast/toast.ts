import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (toastService.showToast()) {
      <div class="toast-container" [class]="toastService.toastType()">
        <div class="toast-content">
          <span class="toast-icon">
            @if (toastService.toastType() === 'success') { ✅ }
            @if (toastService.toastType() === 'error') { ❌ }
            @if (toastService.toastType() === 'warning') { ⚠️ }
          </span>
          <span class="toast-message">{{ toastService.toastMessage() }}</span>
        </div>
        <button class="toast-close" (click)="toastService.hide()">×</button>
      </div>
    }
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 99999;
      background: white;
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      display: flex;
      align-items: flex-start; /* ← CAMBIATO DA center a flex-start */
      gap: 12px;
      min-width: 300px;
      max-width: 90%; /* ← Si adatta allo schermo */
      animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }

    .toast-container.success {
      border-left: 4px solid #10b981;
    }

    .toast-container.error {
      border-left: 4px solid #ef4444;
    }

    .toast-container.warning {
      border-left: 4px solid #f59e0b;
    }

    .toast-content {
      display: flex;
      align-items: flex-start; /* ← CAMBIATO */
      gap: 8px;
      flex: 1;
      min-width: 0; /* ← IMPORTANTE per il text wrapping */
    }

    .toast-icon {
      font-size: 20px;
      flex-shrink: 0; /* ← L'icona non si riduce */
      margin-top: 2px; /* ← Allineamento con il testo */
    }

    .toast-message {
      color: #1f2937;
      font-size: 14px;
      line-height: 1.5; /* ← Spazio tra le righe */
      word-wrap: break-word; /* ← Va a capo */
      word-break: break-word; /* ← Spezza le parole lunghe */
      overflow-wrap: break-word; /* ← Compatibilità */
      flex: 1;
      white-space: pre-wrap; /* ← Rispetta gli "a capo" */
    }

    .toast-close {
      background: none;
      border: none;
      font-size: 24px;
      color: #9ca3af;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0; /* ← Il bottone chiudi non si riduce */
      margin-top: -2px; /* ← Allineamento */
    }

    .toast-close:hover {
      color: #6b7280;
    }

    /* ← RESPONSIVE per schermi piccoli */
    @media (max-width: 600px) {
      .toast-container {
        max-width: 95%;
        min-width: 280px;
      }
      
      .toast-message {
        font-size: 13px;
      }
    }
  `]
})
export class Toast {
  constructor(public toastService: ToastService) {}
}