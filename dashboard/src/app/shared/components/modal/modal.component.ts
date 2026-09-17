import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (visible) {
      <div class="modal-backdrop" (click)="onBackdropClick()">
        <div
          class="modal-box"
          [class.size-sm]="size === 'sm'"
          [class.size-md]="size === 'md'"
          [class.size-lg]="size === 'lg'"
          [class.size-xl]="size === 'xl'"
          [ngStyle]="style"
          (click)="$event.stopPropagation()"
          role="dialog"
          aria-modal="true"
        >
          <div class="modal-header">
            <div class="modal-header-meta">
              <h3 class="modal-title">{{ header }}</h3>
              @if (subtitle) {
                <span class="modal-subtitle">{{ subtitle }}</span>
              }
            </div>
            <button class="modal-close-btn" (click)="close()" type="button" aria-label="إغلاق">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div class="modal-body">
            <ng-content />
          </div>

          <div class="modal-footer">
            <ng-content select="[modal-footer]" />
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(10, 38, 30, 0.65);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem 1rem;
      animation: backdropIn 0.2s ease-out;
    }

    @keyframes backdropIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }

    .modal-box {
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 24px 70px rgba(10, 38, 30, 0.3), 0 10px 30px rgba(0, 0, 0, 0.12);
      border: 1px solid rgba(18, 67, 54, 0.14);
      width: 100%;
      max-width: 620px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: modalIn 0.24s cubic-bezier(0.16, 1, 0.3, 1);

      /* Invisible smooth scroll like sidebar */
      scrollbar-width: none !important;
      -ms-overflow-style: none !important;
      &::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }

      &.size-sm { max-width: 480px; }
      &.size-md { max-width: 620px; }
      &.size-lg { max-width: 840px; }
      &.size-xl { max-width: 980px; }
    }

    @keyframes modalIn {
      from { opacity: 0; transform: scale(0.95) translateY(12px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.25rem 2rem;
      border-bottom: 1px solid #edf2ef;
      background: linear-gradient(180deg, #ffffff 0%, #fafcfb 100%);
      flex-shrink: 0;
    }

    .modal-header-meta {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .modal-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: #0a261e;
      margin: 0;
      letter-spacing: -0.01em;
    }

    .modal-subtitle {
      font-size: 0.8rem;
      color: #688a7e;
    }

    .modal-close-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      border-radius: 8px;
      border: 1px solid #e2e8e5;
      background: #f8faf9;
      color: #53645e;
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover {
        background: #fee2e2;
        border-color: #fca5a5;
        color: #b91c1c;
      }
    }

    .modal-body {
      padding: 2rem 2.25rem 2.5rem;
      overflow-y: auto;
      flex: 1;
      -webkit-overflow-scrolling: touch;

      /* Invisible smooth scroll like sidebar */
      scrollbar-width: none !important;
      -ms-overflow-style: none !important;
      &::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }
    }

    .modal-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1.15rem 2rem;
      border-top: 1px solid #edf2ef;
      background: #fafcfb;
      flex-shrink: 0;
    }

    .modal-footer:empty {
      display: none;
    }
  `]
})
export class ModalComponent {
  @Input() visible = false;
  @Input() header = '';
  @Input() subtitle = '';
  @Input() dismissable = true;
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() style: Record<string, any> | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();

  @HostListener('document:keydown.escape')
  onEsc(): void { if (this.visible && this.dismissable) this.close(); }

  onBackdropClick(): void { if (this.dismissable) this.close(); }

  close(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
