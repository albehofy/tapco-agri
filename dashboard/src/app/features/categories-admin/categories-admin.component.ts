import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { AdminApiService } from '../../core/services/admin-api.service';
import { Category } from '../../core/models/admin.models';
import { AdminIconComponent } from '../../shared/components/admin-icon.component';

@Component({
  selector: 'app-categories-admin',
  standalone: true,
  imports: [FormsModule, ModalComponent, AdminIconComponent],
  template: `
    <div class="categories-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">إدارة الفئات والأقسام الشجرية</h1>
          <p class="page-desc">تنظيم فئات المبيدات والأسمدة، الفئات الرئيسية والفرعية، وترتيب ظهورها</p>
        </div>
        <button class="btn btn-primary" (click)="openCreateModal()">
          <app-admin-icon name="plus" [size]="16" />
          <span>إضافة فئة جديدة</span>
        </button>
      </div>

      @if (isLoading()) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>جاري تحميل الفئات...</p>
        </div>
      } @else {
        <div class="categories-grid">
          @for (cat of categoriesTree(); track cat.id) {
            <div class="category-card card-base">
              <div class="cat-header">
                <div class="cat-title-group">
                  <div class="cat-icon-badge">
                    @if (cat.image_url) {
                      <img [src]="cat.image_url" [alt]="cat.name_ar" />
                    } @else {
                      <app-admin-icon name="layers" [size]="20" />
                    }
                  </div>
                  <div>
                    <h3 class="cat-name-ar">{{ cat.name_ar }}</h3>
                    <span class="cat-name-en">{{ cat.name_en }}</span>
                  </div>
                </div>

                <div class="cat-actions">
                  <span class="badge badge-green">{{ cat.products_count || 0 }} منتج</span>
                  <button class="icon-btn edit" (click)="openEditModal(cat)" title="تعديل">
                    <app-admin-icon name="edit" [size]="16" />
                  </button>
                  <button class="icon-btn delete" (click)="confirmDelete(cat)" title="حذف">
                    <app-admin-icon name="trash" [size]="16" />
                  </button>
                </div>
              </div>

              <!-- Subcategories -->
              @if (cat.children && cat.children.length > 0) {
                <div class="subcategories-section">
                  <div class="subs-label">الأقسام الفرعية ({{ cat.children.length }}):</div>
                  <div class="sub-list">
                    @for (sub of cat.children; track sub.id) {
                      <div class="sub-item">
                        <div class="sub-names">
                          <span class="sub-ar">{{ sub.name_ar }}</span>
                          <span class="sub-en">{{ sub.name_en }}</span>
                        </div>
                        <div class="sub-actions">
                          <span class="badge badge-gray">{{ sub.products_count || 0 }} منتج</span>
                          <button class="icon-btn-sm edit" (click)="openEditModal(sub)" title="تعديل">
                            <app-admin-icon name="edit" [size]="14" />
                          </button>
                          <button class="icon-btn-sm delete" (click)="confirmDelete(sub)" title="حذف">
                            <app-admin-icon name="trash" [size]="14" />
                          </button>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              } @else {
                <div class="no-subs">
                  <span>لا توجد أقسام فرعية تحت هذه الفئة</span>
                  <button class="link-btn" (click)="openCreateSubModal(cat)">+ إضافة قسم فرعي</button>
                </div>
              }

              <div class="cat-footer">
                <button class="btn btn-outline btn-sm" (click)="openCreateSubModal(cat)">
                  <app-admin-icon name="plus" [size]="14" />
                  <span>إضافة قسم فرعي تابع</span>
                </button>
              </div>
            </div>
          }
        </div>
      }

      <app-modal
        [visible]="showModal()"
        (visibleChange)="showModal.set($event)"
        [header]="modalMode() === 'create' ? 'إضافة فئة جديدة' : 'تعديل بيانات الفئة'"
        size="md"
        [dismissable]="true"
      >
        <div class="form-grid pt-2">
          <div class="form-group">
            <label>الاسم بالعربية <span class="req">*</span></label>
            <input type="text" [(ngModel)]="formData.name_ar" class="form-input" placeholder="مثال: مبيدات حشرية" />
          </div>
          <div class="form-group">
            <label>الاسم بالإنجليزية <span class="req">*</span></label>
            <input type="text" [(ngModel)]="formData.name_en" class="form-input" placeholder="e.g. Insecticides" />
          </div>

          <div class="form-group full-width">
            <label>الفئة الرئيسية (الأصلية)</label>
            <div class="custom-select-wrap">
              <select class="form-select" [(ngModel)]="formData.parent_id">
                <option [ngValue]="null">-- بدون فئة أصلية (فئة رئيسية جذرية) --</option>
                @for (opt of parentCategoryOptions(); track opt.value) {
                  <option [ngValue]="opt.value">{{ opt.label }}</option>
                }
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>أيقونة الرمز (SVG Key)</label>
            <input type="text" [(ngModel)]="formData.icon" class="form-input" placeholder="layers, bug, sprout..." />
          </div>

          <div class="form-group">
            <label>ترتيب الظهور</label>
            <input type="number" [(ngModel)]="formData.order" class="form-input" />
          </div>

          <div class="form-group full-width">
            <label>صورة الفئة</label>
            <input type="file" (change)="onImageSelected($event)" accept="image/*" class="form-file" />
            @if (imagePreview()) {
              <div class="preview-box">
                <img [src]="imagePreview()" alt="معاينة" />
              </div>
            }
          </div>
        </div>

        @if (errorMessage()) {
          <div class="alert alert-danger mt-3">{{ errorMessage() }}</div>
        }

        <div modal-footer>
          <button class="btn btn-outline" (click)="closeModal()">إلغاء</button>
          <button class="btn btn-primary" [disabled]="isSubmitting()" (click)="saveCategory()">
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
    .categories-page {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .page-title {
      font-size: 1.6rem;
      font-weight: 800;
      color: var(--admin-green-900);
      margin: 0;
    }

    .page-desc {
      font-size: 0.9rem;
      color: var(--admin-text-muted);
      margin-top: 0.25rem;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
      gap: 1.25rem;
    }

    .category-card {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      border: 1px solid var(--admin-border);
    }

    .cat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      border-bottom: 1px solid var(--admin-border);
      padding-bottom: 0.85rem;
    }

    .cat-title-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .cat-icon-badge {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      background: var(--admin-green-50);
      color: var(--admin-green-700);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .cat-name-ar {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--admin-green-900);
      margin: 0;
    }

    .cat-name-en {
      font-size: 0.8rem;
      color: var(--admin-text-muted);
      font-family: var(--font-latin);
    }

    .cat-actions {
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }

    .icon-btn, .icon-btn-sm {
      background: none;
      border: none;
      padding: 0.35rem;
      border-radius: var(--radius-sm);
      cursor: pointer;
      color: var(--admin-text-muted);
      transition: all 0.15s;

      &:hover {
        background: #f1f5f9;
      }

      &.edit:hover {
        color: var(--admin-green-700);
        background: var(--admin-green-50);
      }

      &.delete:hover {
        color: #ef4444;
        background: #fef2f2;
      }
    }

    .subcategories-section {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .subs-label {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--admin-text-muted);
    }

    .sub-list {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .sub-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 0.75rem;
      background: #f8fafc;
      border-radius: var(--radius-sm);
      border: 1px solid #edf2f7;
    }

    .sub-names {
      display: flex;
      flex-direction: column;
    }

    .sub-ar {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--admin-text);
    }

    .sub-en {
      font-size: 0.75rem;
      color: var(--admin-text-muted);
      font-family: var(--font-latin);
    }

    .sub-actions {
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }

    .no-subs {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.85rem;
      color: var(--admin-text-muted);
      padding: 0.5rem;
      background: #fafafa;
      border-radius: var(--radius-sm);
    }

    .link-btn {
      background: none;
      border: none;
      color: var(--admin-bronze-600);
      font-weight: 700;
      font-size: 0.8rem;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }

    .cat-footer {
      margin-top: auto;
      padding-top: 0.5rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;

      label {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--admin-text);
      }

      .req {
        color: #ef4444;
      }
    }

    .preview-box {
      margin-top: 0.5rem;
      width: 60px;
      height: 60px;
      border-radius: var(--radius-sm);
      overflow: hidden;
      border: 1px solid var(--admin-border);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .loading-state {
      padding: 3rem;
      text-align: center;
      color: var(--admin-text-muted);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .w-full {
      width: 100%;
    }
  `]
})
export class CategoriesAdminComponent implements OnInit {
  private readonly api = inject(AdminApiService);

  readonly categoriesTree = signal<Category[]>([]);
  readonly rootCategories = signal<Category[]>([]);
  readonly isLoading = signal(true);
  readonly showModal = signal(false);
  readonly modalMode = signal<'create' | 'edit'>('create');
  readonly editingId = signal<number | null>(null);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly imagePreview = signal<string | null>(null);

  readonly parentCategoryOptions = computed(() => {
    const list: { label: string; value: number | null }[] = [
      { label: 'بدون فئة أصلية (فئة رئيسية جذرية)', value: null }
    ];
    for (const root of this.rootCategories()) {
      if (root.id !== this.editingId()) {
        list.push({ label: `${root.name_ar} (${root.name_en})`, value: root.id });
      }
    }
    return list;
  });

  selectedFile: File | null = null;

  formData = {
    name_ar: '',
    name_en: '',
    parent_id: null as number | null,
    icon: '',
    order: 0
  };

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading.set(true);
    this.api.getCategoriesTree().subscribe({
      next: (res) => {
        const tree = res.data || [];
        this.categoriesTree.set(tree);
        this.rootCategories.set(tree);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  openCreateModal(): void {
    this.modalMode.set('create');
    this.editingId.set(null);
    this.formData = { name_ar: '', name_en: '', parent_id: null, icon: 'layers', order: 0 };
    this.selectedFile = null;
    this.imagePreview.set(null);
    this.errorMessage.set('');
    this.showModal.set(true);
  }

  openCreateSubModal(parent: Category): void {
    this.openCreateModal();
    this.formData.parent_id = parent.id;
  }

  openEditModal(cat: Category): void {
    this.modalMode.set('edit');
    this.editingId.set(cat.id);
    this.formData = {
      name_ar: cat.name_ar,
      name_en: cat.name_en,
      parent_id: cat.parent_id || null,
      icon: cat.icon || '',
      order: cat.order || 0
    };
    this.selectedFile = null;
    this.imagePreview.set(cat.image_url || null);
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

  saveCategory(): void {
    if (!this.formData.name_ar || !this.formData.name_en) {
      this.errorMessage.set('يرجى كتابة الاسم بالعربية والإنجليزية');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const form = new FormData();
    form.append('name_ar', this.formData.name_ar);
    form.append('name_en', this.formData.name_en);
    if (this.formData.parent_id) {
      form.append('parent_id', this.formData.parent_id.toString());
    }
    if (this.formData.icon) {
      form.append('icon', this.formData.icon);
    }
    form.append('order', (this.formData.order || 0).toString());

    if (this.selectedFile) {
      form.append('image', this.selectedFile);
    }

    const req$ = this.modalMode() === 'create'
      ? this.api.createCategory(form)
      : this.api.updateCategory(this.editingId()!, form);

    req$.subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.closeModal();
        this.loadCategories();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.message || 'حدث خطأ أثناء حفظ الفئة');
      }
    });
  }

  confirmDelete(cat: Category): void {
    if (confirm(`هل أنت متأكد من حذف الفئة "${cat.name_ar}"؟ سيتم حذف الأقسام التابعة والمنتجات المرتبطة قد تتأثر.`)) {
      this.api.deleteCategory(cat.id).subscribe({
        next: () => this.loadCategories(),
        error: (err) => alert(err.error?.message || 'تعذر حذف الفئة')
      });
    }
  }
}
