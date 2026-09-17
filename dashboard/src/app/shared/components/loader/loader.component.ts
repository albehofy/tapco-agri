import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminIconComponent } from '../admin-icon.component';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule, AdminIconComponent],
  template: `
    <div
      class="tapco-admin-loader"
      [class.mode-fullscreen]="mode === 'fullscreen'"
      [class.mode-overlay]="mode === 'overlay'"
      [class.mode-inline]="mode === 'inline'"
      [class.size-sm]="size === 'sm'"
      [class.size-md]="size === 'md'"
      [class.size-lg]="size === 'lg'"
    >
      <div class="loader-content">
        <div class="orbital-spinner">
          <div class="glow-aura"></div>
          <div class="orbit-ring ring-outer"></div>
          <div class="orbit-ring ring-inner"></div>
          <div class="core-emblem">
            <app-admin-icon name="sprout" [size]="iconSize" class="core-icon" />
          </div>
        </div>

        @if (showText) {
          <div class="loader-text-wrap">
            <span class="loader-primary-text">{{ text || 'جاري معالجة البيانات...' }}</span>
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

    .tapco-admin-loader {
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;

      &.mode-fullscreen {
        position: fixed;
        inset: 0;
        z-index: 99999;
        background: rgba(10, 38, 30, 0.7);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);

        .loader-primary-text { color: #ffffff; }
        .loader-sub-text { color: rgba(255, 255, 255, 0.75); }
      }

      &.mode-overlay {
        position: absolute;
        inset: 0;
        z-index: 40;
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(4px);
        border-radius: inherit;
      }

      &.mode-inline {
        padding: 3rem 1.5rem;
        width: 100%;
      }
    }

    .loader-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      text-align: center;
    }

    .orbital-spinner {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .glow-aura {
      position: absolute;
      inset: -15%;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(24, 89, 72, 0.35) 0%, rgba(196, 138, 68, 0.15) 50%, transparent 70%);
      filter: blur(10px);
      animation: pulse-aura 2.4s ease-in-out infinite alternate;
    }

    .orbit-ring {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
    }

    .ring-outer {
      border: 3px solid transparent;
      border-top-color: var(--tapco-green-600, #185948);
      border-right-color: var(--tapco-bronze-400, #d8a25f);
      animation: spin-cw 1.1s cubic-bezier(0.55, 0.15, 0.45, 0.85) infinite;
    }

    .ring-inner {
      border: 2px dashed transparent;
      border-bottom-color: var(--tapco-bronze-500, #c48a44);
      border-left-color: var(--tapco-green-400, #27866e);
      animation: spin-ccw 1.6s linear infinite;
    }

    .core-emblem {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: linear-gradient(135deg, #0a261e 0%, #124336 100%);
      color: #d8a25f;
      box-shadow: 0 4px 14px rgba(10, 38, 30, 0.35);
      animation: pulse-core 2.4s ease-in-out infinite;
      z-index: 2;
    }

    .size-sm {
      .orbital-spinner { width: 34px; height: 34px; }
      .ring-outer { width: 34px; height: 34px; border-width: 2px; }
      .ring-inner { width: 24px; height: 24px; border-width: 1.5px; }
      .core-emblem { width: 20px; height: 20px; }
      .loader-primary-text { font-size: 0.8rem; }
    }

    .size-md {
      .orbital-spinner { width: 64px; height: 64px; }
      .ring-outer { width: 64px; height: 64px; border-width: 3px; }
      .ring-inner { width: 48px; height: 48px; border-width: 2px; }
      .core-emblem { width: 36px; height: 36px; }
      .loader-primary-text { font-size: 0.95rem; }
    }

    .size-lg {
      .orbital-spinner { width: 92px; height: 92px; }
      .ring-outer { width: 92px; height: 92px; border-width: 4px; }
      .ring-inner { width: 70px; height: 70px; border-width: 2.5px; }
      .core-emblem { width: 52px; height: 52px; }
      .loader-primary-text { font-size: 1.15rem; }
    }

    .loader-text-wrap {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      align-items: center;
    }

    .loader-primary-text {
      font-weight: 700;
      color: #0a261e;
      letter-spacing: -0.01em;
    }

    .loader-sub-text {
      font-size: 0.8rem;
      color: #6c757d;
    }

    @keyframes spin-cw {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes spin-ccw {
      0% { transform: rotate(360deg); }
      100% { transform: rotate(0deg); }
    }

    @keyframes pulse-core {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.08); }
    }

    @keyframes pulse-aura {
      0% { opacity: 0.4; transform: scale(0.95); }
      100% { opacity: 0.9; transform: scale(1.15); }
    }
  `]
})
export class LoaderComponent {
  @Input() mode: 'inline' | 'fullscreen' | 'overlay' = 'inline';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() text = '';
  @Input() subtitle = '';
  @Input() showText = true;

  get iconSize(): number {
    switch (this.size) {
      case 'sm': return 12;
      case 'lg': return 24;
      case 'md':
      default: return 18;
    }
  }
}
