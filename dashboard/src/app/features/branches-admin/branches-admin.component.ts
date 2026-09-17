import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { AdminApiService } from '../../core/services/admin-api.service';
import { Branch } from '../../core/models/admin.models';
import { AdminIconComponent } from '../../shared/components/admin-icon.component';

@Component({
  selector: 'app-branches-admin',
  standalone: true,
  imports: [FormsModule, ModalComponent, AdminIconComponent],
  template: `
    <div class="branches-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">إدارة الفروع ومراكز التوزيع</h1>
          <p class="page-desc">مراكز البيع المعتمدة، الفروع الإقليمية، أرقام التواصل، والإحداثيات الجغرافية</p>
        </div>
        <button class="btn btn-primary" (click)="openCreateModal()">
          <app-admin-icon name="plus" [size]="16" />
          <span>إضافة فرع جديد</span>
        </button>
      </div>

      @if (isLoading()) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>جاري تحميل الفروع...</p>
        </div>
      } @else {
        <div class="branches-grid">
          @for (br of branches(); track br.id) {
            <div class="branch-card card-base">
              <div class="branch-header">
                <div class="pin-badge">
                  <app-admin-icon name="map-pin" [size]="20" />
                </div>
                <div>
                  <h3 class="branch-name">{{ br.name_ar }}</h3>
                  <span class="branch-sub">{{ br.name_en }}</span>
                </div>
              </div>

              <div class="branch-details">
                <div class="detail-row">
                  <span class="lbl">العنوان:</span>
                  <span class="val">{{ br.address_ar }}</span>
                </div>
                <div class="detail-row">
                  <span class="lbl">الهاتف:</span>
                  <span class="val" dir="ltr">{{ br.phone }}</span>
                </div>
                @if (br.whatsapp) {
                  <div class="detail-row">
                    <span class="lbl">واتساب:</span>
                    <span class="val" dir="ltr">{{ br.whatsapp }}</span>
                  </div>
                }
                @if (br.working_hours_ar) {
                  <div class="detail-row">
                    <span class="lbl">أوقات العمل:</span>
                    <span class="val">{{ br.working_hours_ar }}</span>
                  </div>
                }
                @if (br.lat && br.lng) {
                  <div class="detail-row">
                    <span class="lbl">الإحداثيات:</span>
                    <span class="val coords" dir="ltr">{{ br.lat }}, {{ br.lng }}</span>
                  </div>
                }
              </div>

              <div class="card-actions">
                <button class="btn btn-outline btn-sm" (click)="openEditModal(br)">
                  <app-admin-icon name="edit" [size]="14" />
                  <span>تعديل</span>
                </button>
                <button class="btn btn-outline btn-sm btn-danger-soft" (click)="confirmDelete(br)">
                  <app-admin-icon name="trash" [size]="14" />
                  <span>حذف</span>
                </button>
              </div>
            </div>
          }
        </div>
      }

      <app-modal
        [visible]="showModal()"
        (visibleChange)="showModal.set($event)"
        [header]="modalMode() === 'create' ? 'إضافة فرع جديد' : 'تعديل بيانات الفرع'"
        size="lg"
        [dismissable]="true"
      >
        <div class="form-grid pt-2">
          <div class="form-group">
            <label>اسم الفرع بالعربية <span class="req">*</span></label>
            <input type="text" [(ngModel)]="formData.name_ar" class="form-input" placeholder="الفرع الرئيسي - الرياض" />
          </div>
          <div class="form-group">
            <label>اسم الفرع بالإنجليزية <span class="req">*</span></label>
            <input type="text" [(ngModel)]="formData.name_en" class="form-input" placeholder="Main Branch - Riyadh" />
          </div>

          <div class="form-group full-width">
            <label>العنوان بالعربية <span class="req">*</span></label>
            <input type="text" [(ngModel)]="formData.address_ar" class="form-input" />
          </div>
          <div class="form-group full-width">
            <label>العنوان بالإنجليزية <span class="req">*</span></label>
            <input type="text" [(ngModel)]="formData.address_en" class="form-input" />
          </div>

          <div class="form-group">
            <label>رقم الهاتف <span class="req">*</span></label>
            <input type="text" [(ngModel)]="formData.phone" class="form-input" dir="ltr" placeholder="+966..." />
          </div>
          <div class="form-group">
            <label>رقم الواتساب</label>
            <input type="text" [(ngModel)]="formData.whatsapp" class="form-input" dir="ltr" placeholder="+966..." />
          </div>

          <div class="form-group">
            <label>ساعات العمل بالعربية</label>
            <input type="text" [(ngModel)]="formData.working_hours_ar" class="form-input" placeholder="السبت - الخميس 8 ص - 5 م" />
          </div>
          <div class="form-group">
            <label>ساعات العمل بالإنجليزية</label>
            <input type="text" [(ngModel)]="formData.working_hours_en" class="form-input" placeholder="Sat - Thu 8 AM - 5 PM" />
          </div>

          <div class="form-group">
            <label>خط العرض (Latitude)</label>
            <input type="number" step="0.0001" [(ngModel)]="formData.lat" class="form-input" placeholder="24.7136" />
          </div>
          <div class="form-group">
            <label>خط الطول (Longitude)</label>
            <input type="number" step="0.0001" [(ngModel)]="formData.lng" class="form-input" placeholder="46.6753" />
          </div>

          <div class="form-group full-width">
            <label>ترتيب الظهور</label>
            <input type="number" [(ngModel)]="formData.order" class="form-input" />
          </div>
        </div>

        @if (errorMessage()) {
          <div class="alert alert-danger mt-3">{{ errorMessage() }}</div>
        }

        <div modal-footer>
          <button class="btn btn-outline" (click)="closeModal()">إلغاء</button>
          <button class="btn btn-primary" [disabled]="isSubmitting()" (click)="saveBranch()">
            @if (isSubmitting()) {
              <div class="spinner-sm"></div>
              <span>جاري الحفظ...</span>
            } @else {
              <span>حفظ الفرع</span>
            }
          </button>
        </div>
      </app-modal>
    </div>
  `,
  styles: [`
    .branches-page { display: flex; flex-direction: column; gap: 1.5rem; }
    .page-header { display: flex; align-items: center; justify-content: space-between; }
    .page-title { font-size: 1.6rem; font-weight: 800; color: var(--admin-green-900); margin: 0; }
    .page-desc { font-size: 0.9rem; color: var(--admin-text-muted); margin-top: 0.25rem; }

    .branches-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.25rem;
    }

    .branch-card {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .branch-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      border-bottom: 1px solid var(--admin-border);
      padding-bottom: 0.85rem;
    }

    .pin-badge {
      width: 42px;
      height: 42px;
      border-radius: var(--radius-md);
      background: var(--admin-green-50);
      color: var(--admin-green-700);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .branch-name { font-size: 1.05rem; font-weight: 700; color: var(--admin-green-900); margin: 0; }
    .branch-sub { font-size: 0.8rem; color: var(--admin-text-muted); font-family: var(--font-latin); }

    .branch-details {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      font-size: 0.85rem;
    }

    .detail-row {
      display: flex;
      gap: 0.5rem;
      .lbl { color: var(--admin-text-muted); font-weight: 600; width: 85px; flex-shrink: 0; }
      .val { color: var(--admin-text); font-weight: 600; }
      .coords { color: var(--admin-bronze-600); font-family: monospace; font-size: 0.8rem; }
    }

    .card-actions {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
      border-top: 1px solid var(--admin-border);
      padding-top: 0.85rem;
      margin-top: auto;
    }

    .btn-danger-soft { color: #ef4444; border-color: #fee2e2; &:hover { background: #fef2f2; border-color: #fca5a5; } }

    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .full-width { grid-column: 1 / -1; }
    .form-group {
      display: flex; flex-direction: column; gap: 0.35rem;
      label { font-size: 0.85rem; font-weight: 600; color: var(--admin-text); }
      .req { color: #ef4444; }
    }

    .loading-state { padding: 3rem; text-align: center; color: var(--admin-text-muted); display: flex; flex-direction: column; align-items: center; gap: 1rem; }
  `]
})
export class BranchesAdminComponent implements OnInit {
  private readonly api = inject(AdminApiService);

  readonly branches = signal<Branch[]>([]);
  readonly isLoading = signal(true);
  readonly showModal = signal(false);
  readonly modalMode = signal<'create' | 'edit'>('create');
  readonly editingId = signal<number | null>(null);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');

  formData = {
    name_ar: '',
    name_en: '',
    address_ar: '',
    address_en: '',
    phone: '',
    whatsapp: '',
    working_hours_ar: '',
    working_hours_en: '',
    lat: null as number | null,
    lng: null as number | null,
    order: 0
  };

  ngOnInit(): void {
    this.loadBranches();
  }

  loadBranches(): void {
    this.isLoading.set(true);
    this.api.getBranches().subscribe({
      next: (res) => {
        this.branches.set(res.data || []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  openCreateModal(): void {
    this.modalMode.set('create');
    this.editingId.set(null);
    this.formData = {
      name_ar: '',
      name_en: '',
      address_ar: '',
      address_en: '',
      phone: '',
      whatsapp: '',
      working_hours_ar: '',
      working_hours_en: '',
      lat: null,
      lng: null,
      order: 0
    };
    this.errorMessage.set('');
    this.showModal.set(true);
  }

  openEditModal(br: Branch): void {
    this.modalMode.set('edit');
    this.editingId.set(br.id);
    this.formData = {
      name_ar: br.name_ar,
      name_en: br.name_en,
      address_ar: br.address_ar,
      address_en: br.address_en,
      phone: br.phone,
      whatsapp: br.whatsapp || '',
      working_hours_ar: br.working_hours_ar || '',
      working_hours_en: br.working_hours_en || '',
      lat: br.lat || null,
      lng: br.lng || null,
      order: br.order || 0
    };
    this.errorMessage.set('');
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  saveBranch(): void {
    if (!this.formData.name_ar || !this.formData.name_en || !this.formData.address_ar || !this.formData.phone) {
      this.errorMessage.set('يرجى ملء الحقول الإلزامية (الاسم، العنوان، الهاتف)');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const payload = { ...this.formData };

    const req$ = this.modalMode() === 'create'
      ? this.api.createBranch(payload)
      : this.api.updateBranch(this.editingId()!, payload);

    req$.subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.closeModal();
        this.loadBranches();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.message || 'حدث خطأ أثناء حفظ الفرع');
      }
    });
  }

  confirmDelete(br: Branch): void {
    if (confirm(`هل أنت متأكد من حذف فرع "${br.name_ar}"؟`)) {
      this.api.deleteBranch(br.id).subscribe({
        next: () => this.loadBranches(),
        error: (err) => alert(err.error?.message || 'تعذر حذف الفرع')
      });
    }
  }
}
