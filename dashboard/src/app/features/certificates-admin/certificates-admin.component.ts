import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { AdminApiService } from '../../core/services/admin-api.service';
import { Certificate } from '../../core/models/admin.models';
import { AdminIconComponent } from '../../shared/components/admin-icon.component';

@Component({
  selector: 'app-certificates-admin',
  standalone: true,
  imports: [FormsModule, ModalComponent, AdminIconComponent],
  template: `
    <div class="certs-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">إدارة شهادات الجودة والاعتمادات الدولية</h1>
          <p class="page-desc">شهادات ISO، اعتمادات وزارات الزراعة، وتراخيص التصنيع لمصنع TAPCO</p>
        </div>
        <button class="btn btn-primary" (click)="openCreateModal()">
          <app-admin-icon name="plus" [size]="16" />
          <span>إضافة شهادة جديدة</span>
        </button>
      </div>

      @if (isLoading()) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>جاري تحميل الشهادات...</p>
        </div>
      } @else {
        <div class="certs-grid">
          @for (cert of certificates(); track cert.id) {
            <div class="cert-card card-base">
              <div class="cert-preview-box">
                @if (cert.image_url) {
                  <img [src]="cert.image_url" [alt]="cert.title_ar" />
                } @else {
                  <app-admin-icon name="award" [size]="48" />
                }
              </div>

              <div class="cert-info">
                <h3 class="cert-title-ar">{{ cert.title_ar }}</h3>
                <span class="cert-title-en">{{ cert.title_en }}</span>
                <span class="badge badge-gray">الترتيب: {{ cert.order || 0 }}</span>
              </div>

              <div class="card-actions">
                <button class="btn btn-outline btn-sm" (click)="openEditModal(cert)">
                  <app-admin-icon name="edit" [size]="14" />
                  <span>تعديل</span>
                </button>
                <button class="btn btn-outline btn-sm btn-danger-soft" (click)="confirmDelete(cert)">
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
        [header]="modalMode() === 'create' ? 'إضافة شهادة جودة جديدة' : 'تعديل بيانات الشهادة'"
        size="md"
        [dismissable]="true"
      >
        <div class="dialog-content-body pt-2">
          <div class="form-group">
            <label>اسم الشهادة بالعربية <span class="req">*</span></label>
            <input type="text" [(ngModel)]="formData.title_ar" class="form-input" placeholder="مثال: شهادة ISO 9001 لنظم إدارة الجودة" />
          </div>

          <div class="form-group">
            <label>اسم الشهادة بالإنجليزية <span class="req">*</span></label>
            <input type="text" [(ngModel)]="formData.title_en" class="form-input" placeholder="e.g. ISO 9001 Quality Management System" />
          </div>

          <div class="form-group">
            <label>ترتيب الظهور</label>
            <input type="number" [(ngModel)]="formData.order" class="form-input" />
          </div>

          <div class="form-group">
            <label>صورة الشهادة <span class="req">*</span></label>
            <input type="file" (change)="onImageSelected($event)" accept="image/*" class="form-file" />
            @if (imagePreview()) {
              <div class="preview-box">
                <img [src]="imagePreview()" alt="معاينة" />
              </div>
            }
          </div>

          @if (errorMessage()) {
            <div class="alert alert-danger mt-3">{{ errorMessage() }}</div>
          }
        </div>

        <div modal-footer>
          <button class="btn btn-outline" (click)="closeModal()">إلغاء</button>
          <button class="btn btn-primary" [disabled]="isSubmitting()" (click)="saveCertificate()">
            @if (isSubmitting()) {
              <div class="spinner-sm"></div>
              <span>جاري الحفظ...</span>
            } @else {
              <span>حفظ الشهادة</span>
            }
          </button>
        </div>
      </app-modal>
    </div>
  `,
  styles: [`
    .certs-page { display: flex; flex-direction: column; gap: 1.5rem; }
    .page-header { display: flex; align-items: center; justify-content: space-between; }
    .page-title { font-size: 1.6rem; font-weight: 800; color: var(--admin-green-900); margin: 0; }
    .page-desc { font-size: 0.9rem; color: var(--admin-text-muted); margin-top: 0.25rem; }

    .certs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1.25rem;
    }

    .cert-card {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 1rem;
    }

    .cert-preview-box {
      width: 100%;
      height: 180px;
      border-radius: var(--radius-md);
      background: #f8fafc;
      border: 1px solid var(--admin-border);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      color: var(--admin-bronze-500);

      img { width: 100%; height: 100%; object-fit: contain; padding: 0.5rem; }
    }

    .cert-info { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; }
    .cert-title-ar { font-size: 1.05rem; font-weight: 700; color: var(--admin-green-900); margin: 0; }
    .cert-title-en { font-size: 0.8rem; color: var(--admin-text-muted); font-family: var(--font-latin); }

    .card-actions { display: flex; gap: 0.5rem; width: 100%; justify-content: center; border-top: 1px solid var(--admin-border); padding-top: 0.85rem; margin-top: auto; }
    .btn-danger-soft { color: #ef4444; border-color: #fee2e2; &:hover { background: #fef2f2; border-color: #fca5a5; } }

    .dialog-content-body { display: flex; flex-direction: column; gap: 1rem; }

    .form-group {
      display: flex; flex-direction: column; gap: 0.35rem;
      label { font-size: 0.85rem; font-weight: 600; color: var(--admin-text); }
      .req { color: #ef4444; }
    }
    .preview-box {
      margin-top: 0.5rem; width: 100%; height: 120px; border-radius: var(--radius-sm); overflow: hidden; border: 1px solid var(--admin-border);
      img { width: 100%; height: 100%; object-fit: contain; }
    }
    .loading-state { padding: 3rem; text-align: center; color: var(--admin-text-muted); display: flex; flex-direction: column; align-items: center; gap: 1rem; }
  `]
})
export class CertificatesAdminComponent implements OnInit {
  private readonly api = inject(AdminApiService);

  readonly certificates = signal<Certificate[]>([]);
  readonly isLoading = signal(true);
  readonly showModal = signal(false);
  readonly modalMode = signal<'create' | 'edit'>('create');
  readonly editingId = signal<number | null>(null);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly imagePreview = signal<string | null>(null);

  selectedFile: File | null = null;
  formData = { title_ar: '', title_en: '', order: 0 };

  ngOnInit(): void {
    this.loadCertificates();
  }

  loadCertificates(): void {
    this.isLoading.set(true);
    this.api.getCertificates().subscribe({
      next: (res) => {
        this.certificates.set(res.data || []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  openCreateModal(): void {
    this.modalMode.set('create');
    this.editingId.set(null);
    this.formData = { title_ar: '', title_en: '', order: 0 };
    this.selectedFile = null;
    this.imagePreview.set(null);
    this.errorMessage.set('');
    this.showModal.set(true);
  }

  openEditModal(cert: Certificate): void {
    this.modalMode.set('edit');
    this.editingId.set(cert.id);
    this.formData = {
      title_ar: cert.title_ar,
      title_en: cert.title_en,
      order: cert.order || 0
    };
    this.selectedFile = null;
    this.imagePreview.set(cert.image_url || null);
    this.errorMessage.set('');
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  onImageSelected(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => this.imagePreview.set(reader.result as string);
      reader.readAsDataURL(this.selectedFile);
    }
  }

  saveCertificate(): void {
    if (!this.formData.title_ar || !this.formData.title_en) {
      this.errorMessage.set('يرجى كتابة عنوان الشهادة بالعربية والإنجليزية');
      return;
    }

    if (this.modalMode() === 'create' && !this.selectedFile) {
      this.errorMessage.set('يرجى إرفاق صورة الشهادة');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const form = new FormData();
    form.append('title_ar', this.formData.title_ar);
    form.append('title_en', this.formData.title_en);
    form.append('order', (this.formData.order || 0).toString());
    if (this.selectedFile) form.append('image', this.selectedFile);

    const req$ = this.modalMode() === 'create'
      ? this.api.createCertificate(form)
      : this.api.updateCertificate(this.editingId()!, form);

    req$.subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.closeModal();
        this.loadCertificates();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.message || 'حدث خطأ أثناء حفظ الشهادة');
      }
    });
  }

  confirmDelete(cert: Certificate): void {
    if (confirm(`هل أنت متأكد من حذف شهادة "${cert.title_ar}"؟`)) {
      this.api.deleteCertificate(cert.id).subscribe({
        next: () => this.loadCertificates(),
        error: (err) => alert(err.error?.message || 'تعذر حذف الشهادة')
      });
    }
  }
}
