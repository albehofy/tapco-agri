import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-password-input',
  standalone: true,
  imports: [FormsModule],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PasswordInputComponent),
    multi: true
  }],
  template: `
    <div class="pw-wrap">
      <input
        [type]="showPassword ? 'text' : 'password'"
        [value]="value"
        (input)="onInput($event)"
        (blur)="onTouched()"
        [placeholder]="placeholder"
        [name]="name"
        [attr.dir]="dir"
        class="form-input pw-input"
      />
      <button type="button" class="pw-toggle" (click)="showPassword = !showPassword" tabindex="-1" [attr.aria-label]="showPassword ? 'إخفاء' : 'إظهار'">
        @if (showPassword) {
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
        } @else {
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        }
      </button>
    </div>
  `,
  styles: [`
    .pw-wrap { position: relative; display: flex; align-items: center; }
    .pw-input { width: 100%; padding-inline-end: 2.75rem; }
    .pw-toggle {
      position: absolute;
      inset-inline-end: 0.65rem;
      display: flex; align-items: center; justify-content: center;
      background: transparent; border: none; cursor: pointer;
      color: #7c8e87; padding: 0.25rem; border-radius: 4px;
      transition: color 0.15s;
    }
    .pw-toggle:hover { color: #124336; }
  `]
})
export class PasswordInputComponent implements ControlValueAccessor {
  @Input() placeholder = '••••••••';
  @Input() name = 'password';
  @Input() dir = 'ltr';

  value = '';
  showPassword = false;

  onChange: (v: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(v: string): void { this.value = v ?? ''; }
  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }

  onInput(e: Event): void {
    this.value = (e.target as HTMLInputElement).value;
    this.onChange(this.value);
  }
}
