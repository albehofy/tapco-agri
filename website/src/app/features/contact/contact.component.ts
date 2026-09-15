import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../core/services/i18n.service';
import { ApiService } from '../../core/services/api.service';
import { Branch } from '../../core/models/tapco.models';
import { IconComponent } from '../../shared/components/icon.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, IconComponent],
  template: `
    <div class="contact-page">
      <!-- Page Hero Header -->
      <section class="page-hero">
        <div class="tapco-container">
          <span class="badge-tag bronze">{{ i18n.t('contact.title') }}</span>
          <h1 class="page-title">{{ i18n.t('contact.title') }}</h1>
          <p class="page-subtitle">{{ i18n.t('contact.subtitle') }}</p>
        </div>
      </section>

      <section class="section-padding">
        <div class="tapco-container">
          <div class="contact-layout">
            <!-- Left: Form -->
            <div class="form-container card-base">
              <h2 class="form-title">{{ i18n.t('contact.form_title') }}</h2>

              @if (isSuccess()) {
                <div class="alert-box success">
                  <app-icon name="check" [size]="24" />
                  <p>{{ i18n.t('contact.success') }}</p>
                  <button class="btn btn-primary" (click)="isSuccess.set(false); resetForm()">
                    {{ i18n.currentLang() === 'ar' ? 'إرسال رسالة أخرى' : 'Send Another Message' }}
                  </button>
                </div>
              } @else {
                <form (submit)="submitForm($event)" class="contact-form">
                  <div class="form-group">
                    <label>{{ i18n.t('contact.name') }} *</label>
                    <input type="text" [(ngModel)]="formData.name" name="name" required class="form-input" />
                  </div>

                  <div class="form-group">
                    <label>{{ i18n.t('contact.phone') }} *</label>
                    <input type="tel" [(ngModel)]="formData.phone" name="phone" required class="form-input" />
                  </div>

                  <div class="form-group">
                    <label>{{ i18n.t('contact.email') }}</label>
                    <input type="email" [(ngModel)]="formData.email" name="email" class="form-input" />
                  </div>

                  <div class="form-group">
                    <label>{{ i18n.t('contact.message') }} *</label>
                    <textarea [(ngModel)]="formData.message" name="message" rows="4" required class="form-input"></textarea>
                  </div>

                  @if (errorMessage()) {
                    <div class="alert-box error">
                      <p>{{ errorMessage() }}</p>
                    </div>
                  }

                  <button type="submit" [disabled]="isSubmitting()" class="btn btn-bronze submit-btn">
                    <span>{{ isSubmitting() ? i18n.t('contact.submitting') : i18n.t('contact.submit') }}</span>
                    <app-icon [name]="i18n.isRtl() ? 'arrow-left' : 'arrow-right'" [size]="18" />
                  </button>
                </form>
              }
            </div>

            <!-- Right: Direct Contacts & Factory HQ -->
            <div class="info-sidebar">
              <div class="direct-info-card card-base">
                <h3 class="side-heading">{{ i18n.t('contact.info_title') }}</h3>

                <div class="contact-entries">
                  <div class="entry">
                    <div class="entry-icon">
                      <app-icon name="map-pin" [size]="20" />
                    </div>
                    <div>
                      <strong>{{ i18n.currentLang() === 'ar' ? 'المقر الرئيسي والمصنع' : 'Factory & Headquarters' }}</strong>
                      <p>{{ i18n.currentLang() === 'ar' ? 'المنطقة الصناعية الخامسة، مدينة السادات، المنوفية' : '5th Industrial Zone, Sadat City, Egypt' }}</p>
                    </div>
                  </div>

                  <div class="entry">
                    <div class="entry-icon">
                      <app-icon name="phone" [size]="20" />
                    </div>
                    <div>
                      <strong>{{ i18n.currentLang() === 'ar' ? 'الهاتف المباشر' : 'Direct Phone' }}</strong>
                      <p><a href="tel:+20223456789" dir="ltr">+20 2 2345 6789</a></p>
                    </div>
                  </div>

                  <div class="entry">
                    <div class="entry-icon">
                      <app-icon name="message-circle" [size]="20" />
                    </div>
                    <div>
                      <strong>{{ i18n.currentLang() === 'ar' ? 'الدعم الفني والمبيعات (واتساب)' : 'Technical WhatsApp' }}</strong>
                      <p><a href="https://wa.me/201012345678" target="_blank" dir="ltr">+20 10 1234 5678</a></p>
                    </div>
                  </div>

                  <div class="entry">
                    <div class="entry-icon">
                      <app-icon name="mail" [size]="20" />
                    </div>
                    <div>
                      <strong>{{ i18n.currentLang() === 'ar' ? 'البريد الإلكتروني' : 'Email Address' }}</strong>
                      <p><a href="mailto:info@tapco-agri.com">info&#64;tapco-agri.com</a></p>
                    </div>
                  </div>

                  <div class="entry">
                    <div class="entry-icon">
                      <app-icon name="clock" [size]="20" />
                    </div>
                    <div>
                      <strong>{{ i18n.t('contact.working_hours') }}</strong>
                      <p>{{ i18n.currentLang() === 'ar' ? 'السبت - الخميس: 8:00 صباحًا - 5:00 مساءً' : 'Saturday - Thursday: 8:00 AM - 5:00 PM' }}</p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Distribution Hubs Mini List -->
              @if (branches().length > 0) {
                <div class="branches-mini card-base">
                  <h3 class="side-heading">{{ i18n.t('about.branches_title') }}</h3>
                  <div class="mini-branches-list">
                    @for (b of branches(); track b.id) {
                      <div class="mini-branch">
                        <span class="mb-name">{{ i18n.getLocalized(b, 'name') }}</span>
                        <a [href]="'tel:' + b.phone" class="mb-phone" dir="ltr">{{ b.phone }}</a>
                      </div>
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .page-hero {
      background: linear-gradient(135deg, var(--tapco-green-900) 0%, var(--tapco-green-800) 100%);
      color: #ffffff;
      padding: 4.5rem 0 3.5rem;
      border-bottom: 3px solid var(--tapco-bronze-500);
    }

    .page-title {
      font-size: clamp(2rem, 3.5vw, 2.75rem);
      font-weight: 800;
      margin: 0.75rem 0 0.5rem;
    }

    .page-subtitle {
      font-size: 1.1rem;
      color: #c9d8d1;
      max-width: 680px;
    }

    .contact-layout {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 3.5rem;
      align-items: flex-start;
    }

    .form-container {
      padding: 2.5rem;
      background: #ffffff;
    }

    .form-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--tapco-green-900);
      margin-bottom: 1.75rem;
    }

    .contact-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;

      label {
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--tapco-text-main);
      }
    }

    .form-input {
      padding: 0.75rem 0.95rem;
      border: 1.5px solid var(--tapco-border);
      border-radius: var(--radius-md);
      font-size: 0.925rem;
      background: #ffffff;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;

      &:focus {
        outline: none;
        border-color: var(--tapco-green-700);
        box-shadow: 0 0 0 3px rgba(18, 67, 54, 0.1);
      }
    }

    .submit-btn {
      padding: 0.85rem 1.75rem;
      font-size: 1rem;
      margin-top: 0.5rem;
    }

    .alert-box {
      padding: 2rem;
      border-radius: var(--radius-md);
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;

      &.success {
        background: var(--tapco-green-50);
        color: var(--tapco-green-800);
        border: 1px solid var(--tapco-green-100);
      }
      &.error {
        background: #fee2e2;
        color: var(--tapco-danger);
        padding: 1rem;
      }
    }

    .info-sidebar {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .direct-info-card, .branches-mini {
      padding: 2rem;
      background: #ffffff;
    }

    .side-heading {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--tapco-green-900);
      margin-bottom: 1.5rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid var(--tapco-border-subtle);
    }

    .contact-entries {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .entry {
      display: flex;
      align-items: flex-start;
      gap: 0.85rem;

      strong {
        display: block;
        font-size: 0.925rem;
        color: var(--tapco-green-900);
        margin-bottom: 0.15rem;
      }

      p, a {
        font-size: 0.875rem;
        color: var(--tapco-text-muted);
      }

      a:hover {
        color: var(--tapco-green-700);
      }
    }

    .entry-icon {
      width: 42px;
      height: 42px;
      border-radius: var(--radius-sm);
      background: var(--tapco-green-50);
      color: var(--tapco-green-700);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .mini-branches-list {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .mini-branch {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 0.65rem;
      border-bottom: 1px solid var(--tapco-border-subtle);
      font-size: 0.875rem;

      &:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }

      .mb-name {
        font-weight: 600;
        color: var(--tapco-text-main);
      }

      .mb-phone {
        color: var(--tapco-bronze-600);
        font-weight: 600;
      }
    }

    @media (max-width: 991px) {
      .contact-layout {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ContactComponent implements OnInit {
  readonly i18n = inject(I18nService);
  private readonly api = inject(ApiService);

  readonly branches = signal<Branch[]>([]);
  readonly isSubmitting = signal(false);
  readonly isSuccess = signal(false);
  readonly errorMessage = signal('');

  formData = {
    name: '',
    phone: '',
    email: '',
    message: '',
  };

  ngOnInit(): void {
    this.api.getBranches().subscribe({
      next: (res) => res?.data && this.branches.set(res.data)
    });
  }

  submitForm(e: Event): void {
    e.preventDefault();
    if (!this.formData.name || !this.formData.phone || !this.formData.message) return;

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    this.api.submitInquiry({
      name: this.formData.name,
      phone: this.formData.phone,
      email: this.formData.email || null,
      message: this.formData.message,
      source: 'contact_form',
    }).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.isSuccess.set(true);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err?.error?.message || this.i18n.t('contact.error'));
      }
    });
  }

  resetForm(): void {
    this.formData = {
      name: '',
      phone: '',
      email: '',
      message: '',
    };
  }
}
