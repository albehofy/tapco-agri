import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../core/services/admin-api.service';
import { Supplier } from '../../core/models/admin.models';
import { AdminIconComponent } from '../../shared/components/admin-icon.component';

import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-suppliers-admin',
  standalone: true,
  imports: [FormsModule, AdminIconComponent, ModalComponent],
  template: `
    <div class="suppliers-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">إدارة الشركات والموردين</h1>
          <p class="page-desc">قائمة الشركات المصنعة والشركاء التجاريين لمنتجات TAPCO الزراعية</p>
        </div>
        <button class="btn btn-primary" (click)="openCreateModal()">
          <app-admin-icon name="plus" [size]="16" />
          <span>إضافة شركة / مورد</span>
        </button>
      </div>

      @if (isLoading()) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>جاري تحميل الشركات...</p>
        </div>
      } @else {
        <div class="suppliers-grid">
          @for (sup of suppliers(); track sup.id) {
            <div class="supplier-card card-base">
              <div class="sup-logo-box">
                @if (sup.logo_url) {
                  <img [src]="sup.logo_url" [alt]="sup.name" />
                } @else {
                  <app-admin-icon name="truck" [size]="32" />
                }
              </div>

              <div class="sup-info">
                <h3 class="sup-name">{{ sup.name }}</h3>
                @if (sup.website) {
                  <a [href]="sup.website" target="_blank" class="sup-link">{{ sup.website }}</a>
                } @else {
                  <span class="no-link">لا يوجد موقع إلكتروني مسجل</span>
                }
                <div class="sup-meta">
                  <span class="badge badge-green">{{ sup.products_count || 0 }} منتج مرتبط</span>
                  <span class="badge badge-gray">الترتيب: {{ sup.order || 0 }}</span>
                </div>
              </div>

              <div class="card-actions">
                <button class="btn btn-outline btn-sm" (click)="openEditModal(sup)">
                  <app-admin-icon name="edit" [size]="14" />
                  <span>تعديل</span>
                </button>
                <button class="btn btn-outline btn-sm btn-danger-soft" (click)="confirmDelete(sup)">
                  <app-admin-icon name="trash" [size]="14" />
                  <span>حذف</span>
                </button>
              </div>
            </div>
          }
        </div>
      }

      <!-- PrimeNG Dialog -->
      <app-modal
[visible]="showModal()"
        (visibleChange)="showModal.set($event)"
        [header]="modalMode() === 'create' ? 'إضافة مورد / شركة جديدة' : 'تعديل بيانات الشركة'"
        
        [dismissable]="true">
        <div class="dialog-content-body pt-2">
          <div class="form-group">
            <label>اسم الشركة <span class="req">*</span></label>
            <input type="text" [(ngModel)]="formData.name" class="form-input" placeholder="مثال: Syngenta, Bayer..." />
          </div>

          <div class="form-group">
            <label>رابط الموقع الإلكتروني (اختياري)</label>
            <input type="url" [(ngModel)]="formData.website" class="form-input" placeholder="https://..." />
          </div>

          <div class="form-group">
            <label>ترتيب العرض</label>
            <input type="number" [(ngModel)]="formData.order" class="form-input" />
          </div>

          <div class="form-group">
            <label>شعار الشركة (Logo)</label>
            <input type="file" (change)="onLogoSelected($event)" accept="image/*" class="form-file" />
            @if (logoPreview()) {
              <div class="preview-box">
                <img [src]="logoPreview()" alt="معاينة" />
              </div>
            }
          </div>

          @if (errorMessage()) {
            <div class="alert alert-danger mt-3">{{ errorMessage() }}</div>
          }
        </div>

        <div modal-footer>
          <button class="btn btn-outline" (click)="closeModal()">إلغاء</button>
          <button class="btn btn-primary" [disabled]="isSubmitting()" (click)="saveSupplier()">
            @if (isSubmitting()) {
              <div class="spinner-sm"></div>
              <span>جاري الحفظ...</span>
            } @else {
              <span>حفظ البيانات</span>
            }
          </button>
        </div>
      </app-modal>
    </div>
  `,
  styles: [`
    .suppliers-page { display: flex; flex-direction: column; gap: 1.5rem; }
    .page-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
    .page-title { font-size: 1.6rem; font-weight: 800; color: var(--admin-green-900); margin: 0; }
    .page-desc { font-size: 0.9rem; color: var(--admin-text-muted); margin-top: 0.25rem; }

    .suppliers-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.25rem;
    }

    .supplier-card {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 1rem;
    }

    .sup-logo-box {
      width: 80px;
      height: 80px;
      border-radius: var(--radius-md);
      background: #f8fafc;
      border: 1px solid var(--admin-border);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      color: var(--admin-text-muted);

      img { width: 100%; height: 100%; object-fit: contain; padding: 0.25rem; }
    }

    .sup-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;
    }

    .sup-name { font-size: 1.15rem; font-weight: 700; color: var(--admin-green-900); margin: 0; }
    .sup-link { font-size: 0.8rem; color: var(--admin-bronze-600); text-decoration: underline; direction: ltr; }
    .no-link { font-size: 0.8rem; color: var(--admin-text-muted); }

    .sup-meta { display: flex; gap: 0.5rem; margin-top: 0.5rem; }

    .card-actions { display: flex; gap: 0.5rem; width: 100%; justify-content: center; border-top: 1px solid var(--admin-border); padding-top: 1rem; }

    .btn-danger-soft {
      color: #ef4444;
      border-color: #fee2e2;
      &:hover { background: #fef2f2; border-color: #fca5a5; }
    }

    .dialog-content-body { display: flex; flex-direction: column; gap: 1rem; }

    .form-group {
      display: flex; flex-direction: column; gap: 0.35rem;
      label { font-size: 0.85rem; font-weight: 600; color: var(--admin-text); }
      .req { color: #ef4444; }
    }
    .preview-box {
      margin-top: 0.5rem; width: 70px; height: 70px; border-radius: var(--radius-sm); overflow: hidden; border: 1px solid var(--admin-border);
      img { width: 100%; height: 100%; object-fit: contain; }
    }
    .loading-state { padding: 3rem; text-align: center; color: var(--admin-text-muted); display: flex; flex-direction: column; align-items: center; gap: 1rem; }
  `]
})
export class SuppliersAdminComponent implements OnInit {
  private readonly api = inject(AdminApiService);

  readonly suppliers = signal<Supplier[]>([]);
  readonly isLoading = signal(true);
  readonly showModal = signal(false);
  readonly modalMode = signal<'create' | 'edit'>('create');
  readonly editingId = signal<number | null>(null);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly logoPreview = signal<string | null>(null);

  selectedFile: File | null = null;
  formData = { name: '', website: '', order: 0 };

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.isLoading.set(true);
    this.api.getSuppliers().subscribe({
      next: (res) => {
        this.suppliers.set(res.data || []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  openCreateModal(): void {
    this.modalMode.set('create');
    this.editingId.set(null);
    this.formData = { name: '', website: '', order: 0 };
    this.selectedFile = null;
    this.logoPreview.set(null);
    this.errorMessage.set('');
    this.showModal.set(true);
  }

  openEditModal(sup: Supplier): void {
    this.modalMode.set('edit');
    this.editingId.set(sup.id);
    this.formData = {
      name: sup.name,
      website: sup.website || '',
      order: sup.order || 0
    };
    this.selectedFile = null;
    this.logoPreview.set(sup.logo_url || null);
    this.errorMessage.set('');
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  onLogoSelected(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => this.logoPreview.set(reader.result as string);
      reader.readAsDataURL(this.selectedFile);
    }
  }

  saveSupplier(): void {
    if (!this.formData.name) {
      this.errorMessage.set('يرجى كتابة اسم الشركة');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const form = new FormData();
    form.append('name', this.formData.name);
    if (this.formData.website) form.append('website', this.formData.website);
    form.append('order', (this.formData.order || 0).toString());
    if (this.selectedFile) form.append('logo', this.selectedFile);

    const req$ = this.modalMode() === 'create'
      ? this.api.createSupplier(form)
      : this.api.updateSupplier(this.editingId()!, form);

    req$.subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.closeModal();
        this.loadSuppliers();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.message || 'حدث خطأ أثناء حفظ الشركة');
      }
    });
  }

  confirmDelete(sup: Supplier): void {
    if (confirm(`هل أنت متأكد من حذف شركة "${sup.name}"؟`)) {
      this.api.deleteSupplier(sup.id).subscribe({
        next: () => this.loadSuppliers(),
        error: (err) => alert(err.error?.message || 'تعذر حذف الشركة')
      });
    }
  }
}
