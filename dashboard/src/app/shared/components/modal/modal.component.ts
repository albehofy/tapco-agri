import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (visible) {
      <div class="modal-backdrop" (click)="onBackdropClick()">
        <div class="modal-box" (click)="$event.stopPropagation()" role="dialog" aria-modal="true">
          <div class="modal-header">
            <h3 class="modal-title">{{ header }}</h3>
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
      background: rgba(10, 38, 30, 0.55);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      animation: backdropIn 0.18s ease;
    }
    @keyframes backdropIn { from { opacity: 0; } to { opacity: 1; } }
    .modal-box {
      background: #ffffff;
      border-radius: 14px;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.28);
      width: 100%;
      max-width: 590px;
      max-height: 92vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: modalIn 0.22s cubic-bezier(0.34, 1.4, 0.64, 1);
    }
    @keyframes modalIn {
      from { opacity: 0; transform: scale(0.94) translateY(14px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.2rem 1.5rem;
      border-bottom: 1px solid #e2e8e4;
      flex-shrink: 0;
    }
    .modal-title { font-size: 1.1rem; font-weight: 700; color: #0a261e; margin: 0; }
    .modal-close-btn {
      display: flex; align-items: center; justify-content: center;
      width: 32px; height: 32px; border-radius: 8px; border: none;
      background: transparent; color: #7c8e87; cursor: pointer;
      transition: background 0.15s, color 0.15s;
    }
    .modal-close-btn:hover { background: #f1f5f2; color: #14201b; }
    .modal-body { padding: 1.5rem; overflow-y: auto; flex: 1; }
    .modal-footer {
      display: flex; align-items: center; justify-content: flex-end;
      gap: 0.75rem; padding: 1rem 1.5rem;
      border-top: 1px solid #e2e8e4; flex-shrink: 0;
    }
    .modal-footer:empty { display: none; }
  `]
})
export class ModalComponent {
  @Input() visible = false;
  @Input() header = '';
  @Input() dismissable = true;
  @Output() visibleChange = new EventEmitter<boolean>();

  @HostListener('document:keydown.escape')
  onEsc(): void { if (this.visible && this.dismissable) this.close(); }

  onBackdropClick(): void { if (this.dismissable) this.close(); }

  close(): void {
    this.visible = false;
    this.visibleChange.emit(false);
  }
}
