import { Component, inject } from '@angular/core';
import { I18nService } from '../../../core/services/i18n.service';
import { IconComponent } from '../icon.component';

@Component({
  selector: 'app-whatsapp-floating',
  standalone: true,
  imports: [IconComponent],
  template: `
    <aside class="wa-floating-container" [class.is-rtl]="i18n.isRtl()">
      <a
        href="https://wa.me/201012345678?text={{ encodeText(i18n.t('whatsapp.prefill')) }}"
        target="_blank"
        rel="noopener noreferrer"
        class="wa-button"
        [attr.aria-label]="i18n.t('whatsapp.chat')"
      >
        <span class="pulse-ring"></span>
        <app-icon name="message-circle" [size]="28" class="wa-icon" />
        <span class="wa-tooltip">{{ i18n.t('whatsapp.chat') }}</span>
      </a>
    </aside>
  `,
  styles: [`
    .wa-floating-container {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      z-index: 1500;
      display: flex;
      align-items: center;

      &.is-rtl {
        right: auto;
        left: 2rem;
      }
    }

    .wa-button {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: #25D366;
      color: #ffffff;
      box-shadow: 0 6px 24px rgba(37, 211, 102, 0.45);
      transition: transform 0.25s ease, box-shadow 0.25s ease;

      &:hover {
        transform: scale(1.08);
        box-shadow: 0 8px 30px rgba(37, 211, 102, 0.6);

        .wa-tooltip {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
      }
    }

    .pulse-ring {
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 2px solid rgba(37, 211, 102, 0.6);
      animation: pulse 2s infinite cubic-bezier(0.4, 0, 0.6, 1);
    }

    .wa-tooltip {
      position: absolute;
      bottom: 110%;
      left: 50%;
      transform: translateX(-50%) translateY(6px);
      background-color: var(--tapco-green-900);
      color: #ffffff;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.35rem 0.75rem;
      border-radius: var(--radius-sm);
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s ease;
      box-shadow: var(--shadow-md);
      pointer-events: none;

      &::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-width: 5px;
        border-style: solid;
        border-color: var(--tapco-green-900) transparent transparent transparent;
      }
    }

    @media (max-width: 480px) {
      .wa-floating-container {
        bottom: 1.25rem;
        right: 1.25rem;
        &.is-rtl {
          left: 1.25rem;
        }
      }
      .wa-button {
        width: 52px;
        height: 52px;
      }
      .wa-tooltip {
        display: none;
      }
    }

    @keyframes pulse {
      0% { transform: scale(0.95); opacity: 0.9; }
      50% { transform: scale(1.2); opacity: 0; }
      100% { transform: scale(1.25); opacity: 0; }
    }
  `]
})
export class WhatsappFloatingComponent {
  readonly i18n = inject(I18nService);

  encodeText(str: string): string {
    return encodeURIComponent(str);
  }
}
