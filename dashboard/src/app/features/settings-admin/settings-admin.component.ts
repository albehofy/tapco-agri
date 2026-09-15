import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../core/services/admin-api.service';
import { AdminIconComponent } from '../../shared/components/admin-icon.component';

interface SettingField {
  ar: string;
  en: string;
}

interface AppSettings {
  phone: SettingField;
  whatsapp: SettingField;
  email: SettingField;
  emergency_hotline: SettingField;
  address: SettingField;
  years_experience: SettingField;
  registered_products: SettingField;
  authorized_distributors: SettingField;
  hectares_served: SettingField;
  about_vision: SettingField;
  about_mission: SettingField;
  facebook_url: SettingField;
  twitter_url: SettingField;
  linkedin_url: SettingField;
  youtube_url: SettingField;
}

@Component({
  selector: 'app-settings-admin',
  standalone: true,
  imports: [FormsModule, AdminIconComponent],
  template: `
    <div class="settings-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">إعدادات النظام والموقع</h1>
          <p class="page-desc">البيانات التعريفية، وسائل الاتصال، شبكات التواصل، الإحصائيات، ونصوص الرؤية والرسالة</p>
        </div>
        <button class="btn btn-primary" [disabled]="isSaving()" (click)="saveAllSettings()">
          @if (isSaving()) {
            <div class="spinner-sm"></div>
            <span>جاري الحفظ...</span>
          } @else {
            <app-admin-icon name="check" [size]="16" />
            <span>حفظ كافة التغييرات</span>
          }
        </button>
      </div>

      @if (saveSuccessMessage()) {
        <div class="alert alert-success">{{ saveSuccessMessage() }}</div>
      }
      @if (saveErrorMessage()) {
        <div class="alert alert-danger">{{ saveErrorMessage() }}</div>
      }

      @if (isLoading()) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>جاري تحميل الإعدادات...</p>
        </div>
      } @else {
        <div class="settings-sections">
          <!-- Section 1: Contact Information -->
          <div class="card-base settings-card">
            <div class="sec-header">
              <app-admin-icon name="inbox" [size]="20" />
              <h3>بيانات الاتصال والتواصل</h3>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label>رقم الهاتف المباشر</label>
                <input type="text" [(ngModel)]="settings.phone.ar" class="form-input" dir="ltr" />
              </div>

              <div class="form-group">
                <label>رقم الواتساب المباشر</label>
                <input type="text" [(ngModel)]="settings.whatsapp.ar" class="form-input" dir="ltr" />
              </div>

              <div class="form-group">
                <label>البريد الإلكتروني للشركة</label>
                <input type="email" [(ngModel)]="settings.email.ar" class="form-input" dir="ltr" />
              </div>

              <div class="form-group">
                <label>الخط الساخن للطوارئ / الدعم الفني</label>
                <input type="text" [(ngModel)]="settings.emergency_hotline.ar" class="form-input" dir="ltr" />
              </div>

              <div class="form-group">
                <label>العنوان الرئيسي (بالعربية)</label>
                <input type="text" [(ngModel)]="settings.address.ar" class="form-input" />
              </div>

              <div class="form-group">
                <label>العنوان الرئيسي (English)</label>
                <input type="text" [(ngModel)]="settings.address.en" class="form-input" />
              </div>
            </div>
          </div>

          <!-- Section 2: Stats Counters -->
          <div class="card-base settings-card">
            <div class="sec-header">
              <app-admin-icon name="activity" [size]="20" />
              <h3>أرقام وإحصائيات النجاح في الصفحة الرئيسية</h3>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label>سنوات الخبرة</label>
                <input type="text" [(ngModel)]="settings.years_experience.ar" class="form-input" />
              </div>

              <div class="form-group">
                <label>عدد المنتجات المعتمدة</label>
                <input type="text" [(ngModel)]="settings.registered_products.ar" class="form-input" />
              </div>

              <div class="form-group">
                <label>عدد الموزعين والوكلاء المعتمدين</label>
                <input type="text" [(ngModel)]="settings.authorized_distributors.ar" class="form-input" />
              </div>

              <div class="form-group">
                <label>المساحة المحمية / هكتار مخدوم</label>
                <input type="text" [(ngModel)]="settings.hectares_served.ar" class="form-input" />
              </div>
            </div>
          </div>

          <!-- Section 3: Vision & Mission -->
          <div class="card-base settings-card">
            <div class="sec-header">
              <app-admin-icon name="award" [size]="20" />
              <h3>رؤية ورسالة وقيم الشركة</h3>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label>رؤية الشركة (عربي)</label>
                <textarea [(ngModel)]="settings.about_vision.ar" rows="3" class="form-textarea"></textarea>
              </div>
              <div class="form-group">
                <label>Vision Statement (English)</label>
                <textarea [(ngModel)]="settings.about_vision.en" rows="3" class="form-textarea"></textarea>
              </div>

              <div class="form-group">
                <label>رسالة الشركة (عربي)</label>
                <textarea [(ngModel)]="settings.about_mission.ar" rows="3" class="form-textarea"></textarea>
              </div>
              <div class="form-group">
                <label>Mission Statement (English)</label>
                <textarea [(ngModel)]="settings.about_mission.en" rows="3" class="form-textarea"></textarea>
              </div>
            </div>
          </div>

          <!-- Section 4: Social Links -->
          <div class="card-base settings-card">
            <div class="sec-header">
              <app-admin-icon name="settings" [size]="20" />
              <h3>روابط شبكات التواصل الاجتماعي</h3>
            </div>

            <div class="form-grid">
              <div class="form-group">
                <label>رابط صفحة فيسبوك</label>
                <input type="url" [(ngModel)]="settings.facebook_url.ar" class="form-input" dir="ltr" placeholder="https://facebook.com/..." />
              </div>

              <div class="form-group">
                <label>رابط منصة إكس / تويتر</label>
                <input type="url" [(ngModel)]="settings.twitter_url.ar" class="form-input" dir="ltr" placeholder="https://x.com/..." />
              </div>

              <div class="form-group">
                <label>رابط صفحة لينكد إن</label>
                <input type="url" [(ngModel)]="settings.linkedin_url.ar" class="form-input" dir="ltr" placeholder="https://linkedin.com/..." />
              </div>

              <div class="form-group">
                <label>رابط قناة يوتيوب</label>
                <input type="url" [(ngModel)]="settings.youtube_url.ar" class="form-input" dir="ltr" placeholder="https://youtube.com/..." />
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .settings-page { display: flex; flex-direction: column; gap: 1.5rem; }
    .page-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
    .page-title { font-size: 1.6rem; font-weight: 800; color: var(--admin-green-900); margin: 0; }
    .page-desc { font-size: 0.9rem; color: var(--admin-text-muted); margin-top: 0.25rem; }

    .settings-sections { display: flex; flex-direction: column; gap: 1.5rem; }
    .settings-card { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.25rem; }

    .sec-header {
      display: flex; align-items: center; gap: 0.75rem; border-bottom: 1px solid var(--admin-border); padding-bottom: 0.75rem;
      color: var(--admin-green-800);
      h3 { margin: 0; font-size: 1.15rem; font-weight: 700; color: var(--admin-green-900); }
    }

    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
    .form-group {
      display: flex; flex-direction: column; gap: 0.35rem;
      label { font-size: 0.85rem; font-weight: 600; color: var(--admin-text); }
    }

    .alert { padding: 0.85rem 1.25rem; border-radius: var(--radius-sm); font-size: 0.9rem; font-weight: 600; }
    .alert-success { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
    .alert-danger { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }

    .loading-state { padding: 3rem; text-align: center; color: var(--admin-text-muted); display: flex; flex-direction: column; align-items: center; gap: 1rem; }

    @media (max-width: 768px) {
      .form-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class SettingsAdminComponent implements OnInit {
  private readonly api = inject(AdminApiService);

  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly saveSuccessMessage = signal('');
  readonly saveErrorMessage = signal('');

  settings: AppSettings = {
    phone: { ar: '+966 11 000 0000', en: '+966 11 000 0000' },
    whatsapp: { ar: '+966 50 000 0000', en: '+966 50 000 0000' },
    email: { ar: 'info@tapco-agri.com', en: 'info@tapco-agri.com' },
    emergency_hotline: { ar: '920000000', en: '920000000' },
    address: { ar: 'الرياض - المنطقة الصناعية الثانية - المملكة العربية السعودية', en: 'Riyadh - 2nd Industrial City - Saudi Arabia' },
    years_experience: { ar: '25+', en: '25+' },
    registered_products: { ar: '120+', en: '120+' },
    authorized_distributors: { ar: '45+', en: '45+' },
    hectares_served: { ar: '500,000+', en: '500,000+' },
    about_vision: { ar: 'أن نكون الخيار الزراعي الموثوق الأول لحماية المحاصيل وتعزيز الأمن الغذائي المستدام.', en: 'To be the foremost trusted agricultural partner safeguarding crops and bolstering sustainable food security.' },
    about_mission: { ar: 'تقديم حلول ومبيدات زراعية عالية الكفاءة وصديقة للبيئة تلبي تطلعات المزارعين بأعلى معايير الجودة الدولية.', en: 'Delivering highly efficacious and environmentally sound agrochemical solutions meeting the highest global standards.' },
    facebook_url: { ar: 'https://facebook.com/tapco-agri', en: 'https://facebook.com/tapco-agri' },
    twitter_url: { ar: 'https://x.com/tapco_agri', en: 'https://x.com/tapco_agri' },
    linkedin_url: { ar: 'https://linkedin.com/company/tapco-agri', en: 'https://linkedin.com/company/tapco-agri' },
    youtube_url: { ar: 'https://youtube.com/@tapco-agri', en: 'https://youtube.com/@tapco-agri' }
  };

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.isLoading.set(true);
    this.api.getSettings().subscribe({
      next: (res) => {
        if (res.data) {
          const keys = Object.keys(res.data) as Array<keyof AppSettings>;
          keys.forEach((k) => {
            const val = res.data[k as string];
            if (val && this.settings[k]) {
              this.settings[k] = {
                ar: val.ar || '',
                en: val.en || val.ar || ''
              };
            }
          });
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  saveAllSettings(): void {
    this.isSaving.set(true);
    this.saveSuccessMessage.set('');
    this.saveErrorMessage.set('');

    this.api.updateSettings(this.settings).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.saveSuccessMessage.set('تم حفظ كافة الإعدادات وتحديثها بنجاح!');
        setTimeout(() => this.saveSuccessMessage.set(''), 4000);
      },
      error: (err) => {
        this.isSaving.set(false);
        this.saveErrorMessage.set(err.error?.message || 'حدث خطأ أثناء حفظ الإعدادات');
      }
    });
  }
}
