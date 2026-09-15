import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../core/services/admin-api.service';
import { Pest } from '../../core/models/admin.models';
import { AdminIconComponent } from '../../shared/components/admin-icon.component';

@Component({
  selector: 'app-pests-admin',
  standalone: true,
  imports: [FormsModule, AdminIconComponent],
  template: `
    <div class="pests-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">إدارة الآفات والأمراض النباتية</h1>
          <p class="page-desc">سجل الحشرات، الفطريات، البكتيريا، النيماتودا، والحشائش لربطها ببرامج المكافحة</p>
        </div>
        <button class="btn btn-primary" (click)="openCreateModal()">
          <app-admin-icon name="plus" [size]="16" />
          <span>إضافة آفة جديدة</span>
        </button>
      </div>

      @if (isLoading()) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>جاري تحميل الآفات والأمراض...</p>
        </div>
      } @else {
        <div class="pests-grid">
          @for (pest of pests(); track pest.id) {
            <div class="pest-card card-base">
              <div class="pest-top">
                <div class="pest-img-box">
                  @if (pest.image_url) {
                    <img [src]="pest.image_url" [alt]="pest.name_ar" />
                  } @else {
                    <app-admin-icon name="bug" [size]="28" />
                  }
                </div>
                <div class="pest-names">
                  <h3 class="pest-name-ar">{{ pest.name_ar }}</h3>
                  <span class="pest-name-en">{{ pest.name_en }}</span>
                </div>
              </div>

              <div class="pest-details">
                <div class="pest-badge-row">
                  <span class="pest-type-badge" [class]="'type-' + pest.type">
                    {{ getTypeName(pest.type) }}
                  </span>
                  <span class="badge badge-green">{{ pest.products_count || 0 }} مبيد معالج</span>
                </div>
              </div>

              <div class="card-actions">
                <button class="btn btn-outline btn-sm" (click)="openEditModal(pest)">
                  <app-admin-icon name="edit" [size]="14" />
                  <span>تعديل</span>
                </button>
                <button class="btn btn-outline btn-sm btn-danger-soft" (click)="confirmDelete(pest)">
                  <app-admin-icon name="trash" [size]="14" />
                  <span>حذف</span>
                </button>
              </div>
            </div>
          }
        </div>
      }

      <!-- Modal -->
      @if (showModal()) {
        <div class="modal-backdrop" (click)="closeModal()">
          <div class="modal-dialog" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h3>{{ modalMode() === 'create' ? 'إضافة آفة / مرض نباتي' : 'تعديل بيانات الآفة' }}</h3>
              <button class="close-btn" (click)="closeModal()">
                <app-admin-icon name="x" [size]="20" />
              </button>
            </div>

            <div class="modal-body">
              <div class="form-group">
                <label>اسم الآفة بالعربية <span class="req">*</span></label>
                <input type="text" [(ngModel)]="formData.name_ar" class="form-input" placeholder="مثال: البياض الدقيقي، سوسة النخيل..." />
              </div>

              <div class="form-group">
                <label>اسم الآفة بالإنجليزية <span class="req">*</span></label>
                <input type="text" [(ngModel)]="formData.name_en" class="form-input" placeholder="e.g. Powdery Mildew, Red Palm Weevil..." />
              </div>

              <div class="form-group">
                <label>نوع الآفة / التصنيف البيولوجي <span class="req">*</span></label>
                <select [(ngModel)]="formData.type" class="form-select">
                  <option value="insect">حشرة (Insect)</option>
                  <option value="fungal">مرض فطري (Fungal Disease)</option>
                  <option value="bacterial">مرض بكتيري (Bacterial Disease)</option>
                  <option value="weed">حشائش ضارة (Weed)</option>
                  <option value="nematicide">نيماتودا (Nematode)</option>
                </select>
              </div>

              <div class="form-group">
                <label>صورة الآفة</label>
                <input type="file" (change)="onImageSelected($event)" accept="image/*" class="form-file" />
                @if (imagePreview()) {
                  <div class="preview-box">
                    <img [src]="imagePreview()" alt="معاينة" />
                  </div>
                }
              </div>

              @if (errorMessage()) {
                <div class="alert alert-danger">{{ errorMessage() }}</div>
              }
            </div>

            <div class="modal-footer">
              <button class="btn btn-outline" (click)="closeModal()">إلغاء</button>
              <button class="btn btn-primary" [disabled]="isSubmitting()" (click)="savePest()">
                @if (isSubmitting()) {
                  <div class="spinner-sm"></div>
                  <span>جاري الحفظ...</span>
                } @else {
                  <span>حفظ البيانات</span>
                }
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .pests-page { display: flex; flex-direction: column; gap: 1.5rem; }
    .page-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }
    .page-title { font-size: 1.6rem; font-weight: 800; color: var(--admin-green-900); margin: 0; }
    .page-desc { font-size: 0.9rem; color: var(--admin-text-muted); margin-top: 0.25rem; }

    .pests-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.25rem;
    }

    .pest-card {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .pest-top {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .pest-img-box {
      width: 54px;
      height: 54px;
      border-radius: var(--radius-md);
      background: #fef3c7;
      color: #b45309;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      flex-shrink: 0;

      img { width: 100%; height: 100%; object-fit: cover; }
    }

    .pest-names {
      display: flex;
      flex-direction: column;
    }

    .pest-name-ar { font-size: 1.05rem; font-weight: 700; color: var(--admin-green-900); margin: 0; }
    .pest-name-en { font-size: 0.8rem; color: var(--admin-text-muted); font-family: var(--font-latin); }

    .pest-details { display: flex; flex-direction: column; gap: 0.5rem; }
    .pest-badge-row { display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; }

    .pest-type-badge {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.2rem 0.6rem;
      border-radius: var(--radius-full);

      &.type-insect { background: #fee2e2; color: #991b1b; }
      &.type-fungal { background: #e0e7ff; color: #3730a3; }
      &.type-bacterial { background: #fef3c7; color: #92400e; }
      &.type-weed { background: #dcfce7; color: #166534; }
      &.type-nematicide { background: #fae8ff; color: #86198f; }
    }

    .card-actions { display: flex; gap: 0.5rem; width: 100%; justify-content: flex-end; border-top: 1px solid var(--admin-border); padding-top: 0.85rem; }
    .btn-danger-soft { color: #ef4444; border-color: #fee2e2; &:hover { background: #fef2f2; border-color: #fca5a5; } }

    /* Modal */
    .modal-backdrop {
      position: fixed; inset: 0; background: rgba(0,0,0,0.5);
      z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem;
    }
    .modal-dialog {
      background: #ffffff; border-radius: var(--radius-lg); width: 100%; max-width: 480px; overflow: hidden; box-shadow: var(--shadow-xl);
    }
    .modal-header {
      padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--admin-border); display: flex; align-items: center; justify-content: space-between;
      h3 { margin: 0; font-size: 1.15rem; font-weight: 700; color: var(--admin-green-900); }
    }
    .close-btn { background: none; border: none; color: var(--admin-text-muted); cursor: pointer; }
    .modal-body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
    .form-group {
      display: flex; flex-direction: column; gap: 0.35rem;
      label { font-size: 0.85rem; font-weight: 600; color: var(--admin-text); }
      .req { color: #ef4444; }
    }
    .preview-box {
      margin-top: 0.5rem; width: 70px; height: 70px; border-radius: var(--radius-sm); overflow: hidden; border: 1px solid var(--admin-border);
      img { width: 100%; height: 100%; object-fit: cover; }
    }
    .modal-footer {
      padding: 1rem 1.5rem; background: #f8fafc; border-top: 1px solid var(--admin-border); display: flex; justify-content: flex-end; gap: 0.75rem;
    }
    .loading-state { padding: 3rem; text-align: center; color: var(--admin-text-muted); display: flex; flex-direction: column; align-items: center; gap: 1rem; }
  `]
})
export class PestsAdminComponent implements OnInit {
  private readonly api = inject(AdminApiService);

  readonly pests = signal<Pest[]>([]);
  readonly isLoading = signal(true);
  readonly showModal = signal(false);
  readonly modalMode = signal<'create' | 'edit'>('create');
  readonly editingId = signal<number | null>(null);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly imagePreview = signal<string | null>(null);

  selectedFile: File | null = null;
  formData = { name_ar: '', name_en: '', type: 'insect' };

  ngOnInit(): void {
    this.loadPests();
  }

  loadPests(): void {
    this.isLoading.set(true);
    this.api.getPests().subscribe({
      next: (res) => {
        this.pests.set(res.data || []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  getTypeName(type: string): string {
    switch (type) {
      case 'insect': return 'حشرات ضارة';
      case 'fungal': return 'أمراض فطرية';
      case 'bacterial': return 'أمراض بكتيرية';
      case 'weed': return 'حشائش ونباتات ضارة';
      case 'nematicide': return 'نيماتودا';
      default: return type;
    }
  }

  openCreateModal(): void {
    this.modalMode.set('create');
    this.editingId.set(null);
    this.formData = { name_ar: '', name_en: '', type: 'insect' };
    this.selectedFile = null;
    this.imagePreview.set(null);
    this.errorMessage.set('');
    this.showModal.set(true);
  }

  openEditModal(pest: Pest): void {
    this.modalMode.set('edit');
    this.editingId.set(pest.id);
    this.formData = {
      name_ar: pest.name_ar,
      name_en: pest.name_en,
      type: pest.type || 'insect'
    };
    this.selectedFile = null;
    this.imagePreview.set(pest.image_url || null);
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

  savePest(): void {
    if (!this.formData.name_ar || !this.formData.name_en) {
      this.errorMessage.set('يرجى كتابة الاسم بالعربية والإنجليزية');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const form = new FormData();
    form.append('name_ar', this.formData.name_ar);
    form.append('name_en', this.formData.name_en);
    form.append('type', this.formData.type);
    if (this.selectedFile) form.append('image', this.selectedFile);

    const req$ = this.modalMode() === 'create'
      ? this.api.createPest(form)
      : this.api.updatePest(this.editingId()!, form);

    req$.subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.closeModal();
        this.loadPests();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.message || 'حدث خطأ أثناء حفظ الآفة');
      }
    });
  }

  confirmDelete(pest: Pest): void {
    if (confirm(`هل أنت متأكد من حذف آفة "${pest.name_ar}"؟`)) {
      this.api.deletePest(pest.id).subscribe({
        next: () => this.loadPests(),
        error: (err) => alert(err.error?.message || 'تعذر حذف الآفة')
      });
    }
  }
}
