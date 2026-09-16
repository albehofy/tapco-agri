import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../core/services/admin-api.service';
import { Crop } from '../../core/models/admin.models';
import { AdminIconComponent } from '../../shared/components/admin-icon.component';

import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-crops-admin',
  standalone: true,
  imports: [FormsModule, AdminIconComponent, ModalComponent],
  template: `
    <div class="crops-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">إدارة المحاصيل الزراعية</h1>
          <p class="page-desc">قاعدة بيانات المحاصيل الزراعية لربطها ببرامج مكافحة الآفات والتسميد</p>
        </div>
        <button class="btn btn-primary" (click)="openCreateModal()">
          <app-admin-icon name="plus" [size]="16" />
          <span>إضافة محصول جديد</span>
        </button>
      </div>

      @if (isLoading()) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>جاري تحميل المحاصيل...</p>
        </div>
      } @else {
        <div class="crops-grid">
          @for (crop of crops(); track crop.id) {
            <div class="crop-card card-base">
              <div class="crop-img-box">
                @if (crop.image_url) {
                  <img [src]="crop.image_url" [alt]="crop.name_ar" />
                } @else {
                  <app-admin-icon name="sprout" [size]="32" />
                }
              </div>

              <div class="crop-info">
                <h3 class="crop-name-ar">{{ crop.name_ar }}</h3>
                <span class="crop-name-en">{{ crop.name_en }}</span>
                <div class="crop-meta">
                  <span class="badge badge-green">{{ crop.products_count || 0 }} منتج متوافق</span>
                </div>
              </div>

              <div class="card-actions">
                <button class="btn btn-outline btn-sm" (click)="openEditModal(crop)">
                  <app-admin-icon name="edit" [size]="14" />
                  <span>تعديل</span>
                </button>
                <button class="btn btn-outline btn-sm btn-danger-soft" (click)="confirmDelete(crop)">
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
        [header]="modalMode() === 'create' ? 'إضافة محصول زراعي جديد' : 'تعديل بيانات المحصول'"
        
        [dismissable]="true">
        <div class="dialog-content-body pt-2">
          <div class="form-group">
            <label>اسم المحصول بالعربية <span class="req">*</span></label>
            <input type="text" [(ngModel)]="formData.name_ar" class="form-input" placeholder="مثال: القمح، الطماطم، الموالح..." />
          </div>

          <div class="form-group">
            <label>اسم المحصول بالإنجليزية <span class="req">*</span></label>
            <input type="text" [(ngModel)]="formData.name_en" class="form-input" placeholder="e.g. Wheat, Tomato, Citrus..." />
          </div>

          <div class="form-group">
            <label>صورة المحصول</label>
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
          <button class="btn btn-primary" [disabled]="isSubmitting()" (click)="saveCrop()">
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
    .crops-page { display: flex; flex-direction: column; gap: 1.5rem; }
    .page-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
    .page-title { font-size: 1.6rem; font-weight: 800; color: var(--admin-green-900); margin: 0; }
    .page-desc { font-size: 0.9rem; color: var(--admin-text-muted); margin-top: 0.25rem; }

    .crops-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1.25rem;
    }

    .crop-card {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 0.85rem;
    }

    .crop-img-box {
      width: 76px;
      height: 76px;
      border-radius: 50%;
      background: var(--admin-green-50);
      color: var(--admin-green-700);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border: 2px solid var(--admin-green-100);

      img { width: 100%; height: 100%; object-fit: cover; }
    }

    .crop-info { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; }
    .crop-name-ar { font-size: 1.1rem; font-weight: 700; color: var(--admin-green-900); margin: 0; }
    .crop-name-en { font-size: 0.8rem; color: var(--admin-text-muted); font-family: var(--font-latin); }
    .crop-meta { margin-top: 0.35rem; }

    .card-actions { display: flex; gap: 0.5rem; width: 100%; justify-content: center; border-top: 1px solid var(--admin-border); padding-top: 0.85rem; }
    .btn-danger-soft { color: #ef4444; border-color: #fee2e2; &:hover { background: #fef2f2; border-color: #fca5a5; } }

    .dialog-content-body { display: flex; flex-direction: column; gap: 1rem; }

    .form-group {
      display: flex; flex-direction: column; gap: 0.35rem;
      label { font-size: 0.85rem; font-weight: 600; color: var(--admin-text); }
      .req { color: #ef4444; }
    }
    .preview-box {
      margin-top: 0.5rem; width: 70px; height: 70px; border-radius: 50%; overflow: hidden; border: 1px solid var(--admin-border);
      img { width: 100%; height: 100%; object-fit: cover; }
    }
    .loading-state { padding: 3rem; text-align: center; color: var(--admin-text-muted); display: flex; flex-direction: column; align-items: center; gap: 1rem; }
  `]
})
export class CropsAdminComponent implements OnInit {
  private readonly api = inject(AdminApiService);

  readonly crops = signal<Crop[]>([]);
  readonly isLoading = signal(true);
  readonly showModal = signal(false);
  readonly modalMode = signal<'create' | 'edit'>('create');
  readonly editingId = signal<number | null>(null);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly imagePreview = signal<string | null>(null);

  selectedFile: File | null = null;
  formData = { name_ar: '', name_en: '' };

  ngOnInit(): void {
    this.loadCrops();
  }

  loadCrops(): void {
    this.isLoading.set(true);
    this.api.getCrops().subscribe({
      next: (res) => {
        this.crops.set(res.data || []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  openCreateModal(): void {
    this.modalMode.set('create');
    this.editingId.set(null);
    this.formData = { name_ar: '', name_en: '' };
    this.selectedFile = null;
    this.imagePreview.set(null);
    this.errorMessage.set('');
    this.showModal.set(true);
  }

  openEditModal(crop: Crop): void {
    this.modalMode.set('edit');
    this.editingId.set(crop.id);
    this.formData = {
      name_ar: crop.name_ar,
      name_en: crop.name_en
    };
    this.selectedFile = null;
    this.imagePreview.set(crop.image_url || null);
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

  saveCrop(): void {
    if (!this.formData.name_ar || !this.formData.name_en) {
      this.errorMessage.set('يرجى كتابة الاسم بالعربية والإنجليزية');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const form = new FormData();
    form.append('name_ar', this.formData.name_ar);
    form.append('name_en', this.formData.name_en);
    if (this.selectedFile) form.append('image', this.selectedFile);

    const req$ = this.modalMode() === 'create'
      ? this.api.createCrop(form)
      : this.api.updateCrop(this.editingId()!, form);

    req$.subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.closeModal();
        this.loadCrops();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.message || 'حدث خطأ أثناء حفظ المحصول');
      }
    });
  }

  confirmDelete(crop: Crop): void {
    if (confirm(`هل أنت متأكد من حذف محصول "${crop.name_ar}"؟`)) {
      this.api.deleteCrop(crop.id).subscribe({
        next: () => this.loadCrops(),
        error: (err) => alert(err.error?.message || 'تعذر حذف المحصول')
      });
    }
  }
}
