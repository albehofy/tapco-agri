import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { I18nService } from '../../../core/services/i18n.service';
import { IconComponent } from '../icon.component';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div
      class="tapco-loader-container"
      [class.mode-fullscreen]="mode === 'fullscreen'"
      [class.mode-overlay]="mode === 'overlay'"
      [class.mode-inline]="mode === 'inline'"
      [class.size-sm]="size === 'sm'"
      [class.size-md]="size === 'md'"
      [class.size-lg]="size === 'lg'"
    >
      <div class="loader-content">
        <!-- Multi-Stage Orbital Agrochemical Spinner -->
        <div class="orbital-spinner">
          <div class="glow-aura"></div>
          <div class="orbit-ring ring-outer"></div>
          <div class="orbit-ring ring-inner"></div>
          
          <div class="core-emblem">
            <app-icon name="sprout" [size]="iconSize" class="core-icon" />
          </div>
        </div>

        <!-- Shimmering Text Feedback -->
        @if (showText) {
          <div class="loader-text-wrap">
            <span class="loader-primary-text">
              {{ text || (i18n.currentLang() === 'ar' ? 'جاري التحميل...' : 'Loading...') }}
            </span>
            @if (subtitle) {
              <span class="loader-sub-text">{{ subtitle }}</span>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: contents;
    }

    .tapco-loader-container {
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;
      transition: opacity 0.3s ease;

      &.mode-fullscreen {
        position: fixed;
        inset: 0;
        z-index: 9999;
        background: rgba(5, 25, 20, 0.72);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);

        .loader-primary-text {
          color: #ffffff;
        }
        .loader-sub-text {
          color: rgba(255, 255, 255, 0.75);
        }
      }

      &.mode-overlay {
        position: absolute;
        inset: 0;
        z-index: 50;
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
        border-radius: inherit;
      }

      &.mode-inline {
        padding: 3.5rem 1.5rem;
        width: 100%;
      }
    }

    .loader-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.25rem;
      text-align: center;
    }

    /* Orbital Spinner */
    .orbital-spinner {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Glow Aura */
    .glow-aura {
      position: absolute;
      inset: -15%;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(24, 89, 72, 0.35) 0%, rgba(196, 138, 68, 0.15) 50%, transparent 70%);
      filter: blur(10px);
      animation: pulse-aura 2.4s ease-in-out infinite alternate;
      pointer-events: none;
    }

    /* Orbit Rings */
    .orbit-ring {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
    }

    .ring-outer {
      border: 3px solid transparent;
      border-top-color: var(--tapco-green-600);
      border-right-color: var(--tapco-bronze-400);
      animation: spin-clockwise 1.1s cubic-bezier(0.55, 0.15, 0.45, 0.85) infinite;
      box-shadow: 0 0 12px rgba(24, 89, 72, 0.25);
    }

    .ring-inner {
      border: 2px dashed transparent;
      border-bottom-color: var(--tapco-bronze-500);
      border-left-color: var(--tapco-green-400);
      animation: spin-counter 1.6s linear infinite;
    }

    /* Core Emblem */
    .core-emblem {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--tapco-green-900) 0%, var(--tapco-green-800) 100%);
      color: var(--tapco-bronze-300);
      box-shadow: 0 4px 14px rgba(10, 38, 30, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.2);
      animation: pulse-core 2.4s ease-in-out infinite;
      z-index: 2;
    }

    .core-icon {
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
    }

    /* Sizing Variants */
    .size-sm {
      .orbital-spinner { width: 36px; height: 36px; }
      .ring-outer { width: 36px; height: 36px; border-width: 2px; }
      .ring-inner { width: 26px; height: 26px; border-width: 1.5px; }
      .core-emblem { width: 22px; height: 22px; }
      .loader-content { gap: 0.5rem; }
      .loader-primary-text { font-size: 0.8rem; }
    }

    .size-md {
      .orbital-spinner { width: 68px; height: 68px; }
      .ring-outer { width: 68px; height: 68px; border-width: 3px; }
      .ring-inner { width: 50px; height: 50px; border-width: 2px; }
      .core-emblem { width: 38px; height: 38px; }
      .loader-primary-text { font-size: 0.95rem; }
    }

    .size-lg {
      .orbital-spinner { width: 100px; height: 100px; }
      .ring-outer { width: 100px; height: 100px; border-width: 4px; }
      .ring-inner { width: 74px; height: 74px; border-width: 2.5px; }
      .core-emblem { width: 56px; height: 56px; }
      .loader-primary-text { font-size: 1.15rem; }
    }

    /* Text Wrap */
    .loader-text-wrap {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      align-items: center;
    }

    .loader-primary-text {
      font-weight: 700;
      color: var(--tapco-green-900);
      letter-spacing: -0.01em;
      background: linear-gradient(90deg, var(--tapco-green-900) 0%, var(--tapco-bronze-600) 50%, var(--tapco-green-900) 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shimmer-text 2.5s linear infinite;
    }

    .loader-sub-text {
      font-size: 0.8rem;
      color: var(--tapco-text-muted);
      font-weight: 500;
    }

    /* Keyframe Animations */
    @keyframes spin-clockwise {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes spin-counter {
      0% { transform: rotate(360deg); }
      100% { transform: rotate(0deg); }
    }

    @keyframes pulse-core {
      0%, 100% {
        transform: scale(1);
        box-shadow: 0 4px 14px rgba(10, 38, 30, 0.35);
      }
      50% {
        transform: scale(1.08);
        box-shadow: 0 6px 20px rgba(196, 138, 68, 0.45);
      }
    }

    @keyframes pulse-aura {
      0% { opacity: 0.4; transform: scale(0.95); }
      100% { opacity: 0.9; transform: scale(1.15); }
    }

    @keyframes shimmer-text {
      0% { background-position: 200% center; }
      100% { background-position: -200% center; }
    }
  `]
})
export class LoaderComponent {
  readonly i18n = inject(I18nService);

  @Input() mode: 'inline' | 'fullscreen' | 'overlay' = 'inline';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() text = '';
  @Input() subtitle = '';
  @Input() showText = true;

  get iconSize(): number {
    switch (this.size) {
      case 'sm': return 12;
      case 'lg': return 26;
      case 'md':
      default: return 18;
    }
  }
}
