import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { AdminIconComponent } from '../../shared/components/admin-icon.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, AdminIconComponent],
  template: `
    <div class="login-page">
      <div class="login-card card-base">
        <!-- Brand Header -->
        <div class="login-brand">
          <div class="brand-logo-t">T</div>
          <h1>TAPCO Agriculture</h1>
          <p class="login-sub">لوحة التحكم المركزية للمصنع والإدارة</p>
        </div>

        @if (errorMessage()) {
          <div class="login-error-alert">
            <app-admin-icon name="x" [size]="18" />
            <span>{{ errorMessage() }}</span>
          </div>
        }

        <form (submit)="handleLogin($event)" class="login-form">
          <div class="form-group">
            <label class="form-label">البريد الإلكتروني</label>
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              required
              class="form-input"
              dir="ltr"
              placeholder="admin@tapco-agri.com"
            />
          </div>

          <div class="form-group">
            <label class="form-label">كلمة المرور</label>
            <input
              type="password"
              [(ngModel)]="password"
              name="password"
              required
              class="form-input"
              dir="ltr"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" [disabled]="isLoading()" class="btn btn-primary login-submit-btn">
            <span>{{ isLoading() ? 'جاري التحقق...' : 'تسجيل الدخول' }}</span>
          </button>
        </form>

        <div class="login-footer">
          <p>بيانات الدخول الافتراضية للمسؤول:</p>
          <code>admin&#64;tapco-agri.com / admin123</code>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--admin-green-900) 0%, #061914 100%);
      padding: 1.5rem;
    }

    .login-card {
      width: 100%;
      max-width: 440px;
      padding: 2.75rem 2.25rem;
      background: #ffffff;
      border-radius: var(--radius-lg);
      box-shadow: 0 12px 35px rgba(0, 0, 0, 0.35);
    }

    .login-brand {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 2rem;

      .brand-logo-t {
        width: 52px;
        height: 52px;
        border-radius: var(--radius-md);
        background: linear-gradient(135deg, var(--admin-bronze-500) 0%, var(--admin-bronze-600) 100%);
        color: #ffffff;
        font-size: 1.75rem;
        font-weight: 900;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0.25rem;
      }

      h1 {
        font-family: var(--font-latin);
        font-size: 1.5rem;
        font-weight: 900;
        letter-spacing: 0.05em;
        color: var(--admin-green-900);
      }

      .login-sub {
        font-size: 0.85rem;
        color: var(--admin-text-muted);
      }
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .login-submit-btn {
      width: 100%;
      padding: 0.75rem;
      font-size: 0.95rem;
      margin-top: 0.5rem;
    }

    .login-error-alert {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #fee2e2;
      color: var(--admin-danger);
      padding: 0.75rem 1rem;
      border-radius: var(--radius-sm);
      font-size: 0.85rem;
      margin-bottom: 1.25rem;
    }

    .login-footer {
      margin-top: 2rem;
      padding-top: 1.25rem;
      border-top: 1px solid var(--admin-border-subtle);
      text-align: center;
      font-size: 0.775rem;
      color: var(--admin-text-light);

      code {
        display: inline-block;
        margin-top: 0.35rem;
        padding: 0.2rem 0.5rem;
        background: var(--admin-green-50);
        color: var(--admin-green-800);
        border-radius: 4px;
        font-family: monospace;
      }
    }
  `]
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  email = 'admin@tapco-agri.com';
  password = 'admin123';
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');

  handleLogin(e: Event): void {
    e.preventDefault();
    if (!this.email || !this.password) return;

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.auth.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          this.router.navigate(['/admin/dashboard']);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err?.error?.message || 'بيانات الدخول غير صحيحة، يرجى المحاولة ثانية.');
      }
    });
  }
}
