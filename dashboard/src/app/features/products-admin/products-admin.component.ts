import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { AdminApiService } from '../../core/services/admin-api.service';
import { Product, Category, Supplier, Crop, Pest } from '../../core/models/admin.models';
import { AdminIconComponent } from '../../shared/components/admin-icon.component';

@Component({
  selector: 'app-products-admin',
  standalone: true,
  imports: [FormsModule, ModalComponent, AdminIconComponent],
  template: `
    <div class="products-admin-page">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">إدارة المنتجات والمبيدات الزراعية</h1>
          <p class="page-desc">إضافة وتعديل بيانات المبيدات، الصور، ملفات الـ PDF، ونسب الخلط والمكافحة</p>
        </div>
        <button class="btn btn-primary" (click)="openCreateModal()">
          <app-admin-icon name="plus" [size]="16" />
          <span>إضافة منتج جديد</span>
        </button>
      </div>

      <!-- Filters & Search Toolbar -->
      <div class="toolbar-box card-base">
        <div class="search-field">
          <app-admin-icon name="search" [size]="18" class="search-icon" />
          <input
            type="text"
            [(ngModel)]="search"
            (keyup.enter)="loadProducts(1)"
            placeholder="بحث بالاسم أو المادة الفعالة..."
            class="form-input"
          />
        </div>

        <div class="custom-select-wrap">
          <select class="form-select filter-select" [(ngModel)]="categoryFilter" (change)="loadProducts(1)">
            <option [ngValue]="''">كافة الفئات</option>
            @for (opt of categoryFilterOptions(); track opt.value) {
              <option [ngValue]="opt.value">{{ opt.label }}</option>
            }
          </select>
        </div>

        <div class="custom-select-wrap">
          <select class="form-select filter-select" [(ngModel)]="activeFilter" (change)="loadProducts(1)">
            <option [ngValue]="''">كافة الحالات</option>
            @for (opt of activeFilterOptions; track opt.value) {
              <option [ngValue]="opt.value">{{ opt.label }}</option>
            }
          </select>
        </div>

        <button class="btn btn-outline" (click)="loadProducts(1)">
          <span>تصفية</span>
        </button>
      </div>

      <!-- Products Table -->
      @if (isLoading()) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>جاري تحميل المنتجات...</p>
        </div>
      } @else {
        <div class="table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>صورة</th>
                <th>اسم المنتج (عربي / English)</th>
                <th>الفئة</th>
                <th>المادة الفعالة</th>
                <th>كود الصياغة</th>
                <th>فترة الأمان (PHI)</th>
                <th>الحالة</th>
                <th>مميز</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              @for (prod of products(); track prod.id) {
                <tr>
                  <td>
                    <div class="prod-thumb">
                      @if (prod.main_image_url) {
                        <img [src]="prod.main_image_url" [alt]="prod.name_ar" />
                      } @else {
                        <app-admin-icon name="sprout" [size]="20" />
                      }
                    </div>
                  </td>
                  <td>
                    <div class="prod-names">
                      <strong>{{ prod.name_ar }}</strong>
                      <span class="en-name">{{ prod.name_en }}</span>
                    </div>
                  </td>
                  <td>{{ prod.category?.name_ar }}</td>
                  <td>{{ prod.active_ingredient_ar || '-' }}</td>
                  <td>
                    @if (prod.formulation_code) {
                      <span class="badge badge-gray">{{ prod.formulation_code }}</span>
                    } @else {
                      <span>-</span>
                    }
                  </td>
                  <td>{{ prod.pre_harvest_interval ? prod.pre_harvest_interval + ' يوم' : '-' }}</td>
                  <td>
                    <span class="badge" [class.badge-green]="prod.is_active" [class.badge-gray]="!prod.is_active">
                      {{ prod.is_active ? 'نشط' : 'معطل' }}
                    </span>
                  </td>
                  <td>
                    @if (prod.is_featured) {
                      <span class="badge badge-bronze">مميز</span>
                    } @else {
                      <span class="text-muted">-</span>
                    }
                  </td>
                  <td>
                    <div class="actions-cell">
                      <button class="action-btn edit" (click)="openEditModal(prod)" title="تعديل">
                        <app-admin-icon name="edit" [size]="16" />
                      </button>
                      <button class="action-btn delete" (click)="deleteProduct(prod.id)" title="حذف">
                        <app-admin-icon name="trash" [size]="16" />
                      </button>
                    </div>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="9" class="text-center py-5 text-muted">لا توجد منتجات مسجلة تطابق هذا البحث</td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        @if (lastPage() > 1) {
          <div class="pagination-bar">
            <button class="btn btn-outline btn-sm" [disabled]="currentPage() === 1" (click)="loadProducts(currentPage() - 1)">السابق</button>
            <span class="page-info">صفحة {{ currentPage() }} من {{ lastPage() }} (إجمالي {{ total() }} منتج)</span>
            <button class="btn btn-outline btn-sm" [disabled]="currentPage() === lastPage()" (click)="loadProducts(currentPage() + 1)">التالي</button>
          </div>
        }
      }

      <!-- PrimeNG Dialog for Product Add/Edit -->
      <app-modal
        [visible]="isModalOpen()"
        (visibleChange)="isModalOpen.set($event)"
        [header]="isEditing() ? 'تعديل منتج: ' + editingProduct()?.name_ar : 'إضافة منتج زراعي جديد'"
        [subtitle]="isEditing() ? 'تعديل المواصفات الفنية، صور العبوات، والملفات المعتمدة' : 'أدخل بيانات المركب والمواصفات والآفات المستهدفة'"
        size="xl"
        [style]="{ width: '95vw', maxWidth: '980px' }"
        [dismissable]="true"
      >
        <!-- Tabs -->
        <div class="modal-tabs">
          <button type="button" class="tab-btn" [class.active]="activeTab === 'ar'" (click)="activeTab = 'ar'">البيانات بالعربية</button>
          <button type="button" class="tab-btn" [class.active]="activeTab === 'en'" (click)="activeTab = 'en'">English Data</button>
          <button type="button" class="tab-btn" [class.active]="activeTab === 'specs'" (click)="activeTab = 'specs'">المواصفات والتصنيف</button>
          <button type="button" class="tab-btn" [class.active]="activeTab === 'targets'" (click)="activeTab = 'targets'">المحاصيل والآفات</button>
          <button type="button" class="tab-btn" [class.active]="activeTab === 'files'" (click)="activeTab = 'files'">الملفات والصور والـ PDF</button>
        </div>

        <form (submit)="saveProduct($event)" class="modal-form">
          <!-- Tab 1: Arabic -->
          @if (activeTab === 'ar') {
            <div class="tab-pane">
              <div class="form-group">
                <label class="form-label">الاسم التجاري (بالعربي) *</label>
                <input type="text" [(ngModel)]="form.name_ar" name="name_ar" required class="form-input" />
              </div>

              <div class="form-group">
                <label class="form-label">المادة الفعالة (بالعربي)</label>
                <input type="text" [(ngModel)]="form.active_ingredient_ar" name="active_ingredient_ar" class="form-input" />
              </div>

              <div class="form-group">
                <label class="form-label">المجموعة الكيميائية (بالعربي)</label>
                <input type="text" [(ngModel)]="form.chemical_group_ar" name="chemical_group_ar" class="form-input" />
              </div>

              <div class="form-group">
                <label class="form-label">كلمة التحذير / الإشارة (خطر / تحذير / احترس)</label>
                <input type="text" [(ngModel)]="form.hazard_signal_word_ar" name="hazard_signal_word_ar" class="form-input" />
              </div>

              <div class="form-group">
                <label class="form-label">الوصف وخصائص المركب (بالعربي)</label>
                <textarea [(ngModel)]="form.description_ar" name="description_ar" rows="3" class="form-textarea"></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">تعليمات الاستخدام والجرعات (بالعربي)</label>
                <textarea [(ngModel)]="form.usage_instructions_ar" name="usage_instructions_ar" rows="3" class="form-textarea"></textarea>
              </div>
            </div>
          }

          <!-- Tab 2: English -->
          @if (activeTab === 'en') {
            <div class="tab-pane" dir="ltr">
              <div class="form-group">
                <label class="form-label">Trade Name (English) *</label>
                <input type="text" [(ngModel)]="form.name_en" name="name_en" required class="form-input" />
              </div>

              <div class="form-group">
                <label class="form-label">Active Ingredient (English)</label>
                <input type="text" [(ngModel)]="form.active_ingredient_en" name="active_ingredient_en" class="form-input" />
              </div>

              <div class="form-group">
                <label class="form-label">Chemical Family (English)</label>
                <input type="text" [(ngModel)]="form.chemical_group_en" name="chemical_group_en" class="form-input" />
              </div>

              <div class="form-group">
                <label class="form-label">Signal Word (Danger / Warning / Caution)</label>
                <input type="text" [(ngModel)]="form.hazard_signal_word_en" name="hazard_signal_word_en" class="form-input" />
              </div>

              <div class="form-group">
                <label class="form-label">Description (English)</label>
                <textarea [(ngModel)]="form.description_en" name="description_en" rows="3" class="form-textarea"></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">Usage Instructions & Dosages (English)</label>
                <textarea [(ngModel)]="form.usage_instructions_en" name="usage_instructions_en" rows="3" class="form-textarea"></textarea>
              </div>
            </div>
          }

          <!-- Tab 3: Specs -->
          @if (activeTab === 'specs') {
            <div class="tab-pane form-grid-2">
              <div class="form-group">
                <label class="form-label">الفئة *</label>
                <div class="custom-select-wrap">
                  <select class="form-select w-full" [(ngModel)]="form.category_id" name="category_id">
                    @for (opt of formCategoryOptions(); track opt.value) {
                      <option [ngValue]="opt.value">{{ opt.label }}</option>
                    }
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">الشركة المصنعة / المورّد</label>
                <div class="custom-select-wrap">
                  <select class="form-select w-full" [(ngModel)]="form.supplier_id" name="supplier_id">
                    @for (opt of formSupplierOptions(); track opt.value) {
                      <option [ngValue]="opt.value">{{ opt.label }}</option>
                    }
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">التركيز والنوع (مثال: 20% SL أو 72% WP)</label>
                <input type="text" [(ngModel)]="form.concentration" name="concentration" class="form-input" />
              </div>

              <div class="form-group">
                <label class="form-label">كود الصياغة (EC, WP, SC, SL, WG, SG, GR, SP)</label>
                <div class="custom-select-wrap">
                  <select class="form-select w-full" [(ngModel)]="form.formulation_code" name="formulation_code">
                    @for (opt of formulationCodeOptions; track opt.value) {
                      <option [ngValue]="opt.value">{{ opt.label }}</option>
                    }
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">تصنيف السمّية (Toxicity Class)</label>
                <div class="custom-select-wrap">
                  <select class="form-select w-full" [(ngModel)]="form.toxicity_class" name="toxicity_class">
                    @for (opt of toxicityOptions; track opt.value) {
                      <option [ngValue]="opt.value">{{ opt.label }}</option>
                    }
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">فترة ما قبل الحصاد PHI (بالأيام)</label>
                <input type="number" [(ngModel)]="form.pre_harvest_interval" name="pre_harvest_interval" min="0" class="form-input" />
              </div>

              <div class="form-group">
                <label class="form-label">سعات العبوات المتوفرة</label>
                <input type="text" [(ngModel)]="form.packaging_sizes" name="packaging_sizes" placeholder="مثال: 250 مل، 1 لتر، 5 لتر" class="form-input" />
              </div>

              <div class="form-group">
                <label class="form-label">ترتيب العرض</label>
                <input type="number" [(ngModel)]="form.order" name="order" class="form-input" />
              </div>

              <div class="form-group check-group">
                <label class="checkbox-label">
                  <input type="checkbox" [(ngModel)]="form.is_active" name="is_active" />
                  <span>المنتج نشط ومتاح في الكتالوج العام</span>
                </label>

                <label class="checkbox-label">
                  <input type="checkbox" [(ngModel)]="form.is_featured" name="is_featured" />
                  <span>منتج مميز (يظهر في الصفحة الرئيسية)</span>
                </label>
              </div>
            </div>
          }

          <!-- Tab 4: Crops & Pests -->
          @if (activeTab === 'targets') {
            <div class="tab-pane">
              <div class="targets-section">
                <h3>المحاصيل المستهدفة المتوافقة</h3>
                <div class="checkbox-grid">
                  @for (crop of crops(); track crop.id) {
                    <label class="crop-checkbox-card" [class.selected]="isCropSelected(crop.id)">
                      <input type="checkbox" [checked]="isCropSelected(crop.id)" (change)="toggleCrop(crop.id)" />
                      <span>{{ crop.name_ar }} ({{ crop.name_en }})</span>
                    </label>
                  }
                </div>
              </div>

              <div class="targets-section mt-4">
                <h3>الآفات والأمراض التي يكافحها المنتج</h3>
                <div class="checkbox-grid">
                  @for (pest of pests(); track pest.id) {
                    <label class="pest-checkbox-card" [class.selected]="isPestSelected(pest.id)">
                      <input type="checkbox" [checked]="isPestSelected(pest.id)" (change)="togglePest(pest.id)" />
                      <span>{{ pest.name_ar }} ({{ pest.name_en }})</span>
                    </label>
                  }
                </div>
              </div>
            </div>
          }

          <!-- Tab 5: Files & PDFs -->
          @if (activeTab === 'files') {
            <div class="tab-pane">
              <div class="file-upload-block">
                <label class="form-label">الصورة الأساسية للمنتج (PNG, JPG, WebP - الحد الأقصى 2MB)</label>
                <input type="file" (change)="onMainImageSelected($event)" accept="image/*" class="form-input" />
                @if (mainImagePreview()) {
                  <div class="img-preview"><img [src]="mainImagePreview()" alt="Preview" /></div>
                }
              </div>

              <div class="file-upload-block">
                <label class="form-label">ملف النشرة الفنية (Datasheet PDF - الحد الأقصى 10MB)</label>
                <input type="file" (change)="onDatasheetSelected($event)" accept="application/pdf" class="form-input" />
                @if (isEditing() && editingProduct()?.datasheet_pdf_url) {
                  <div class="file-status">ملف الداتاشيت مرفوع حاليًا: <a [href]="editingProduct()!.datasheet_pdf_url!" target="_blank">معاينة الملف</a></div>
                }
              </div>

              <div class="file-upload-block">
                <label class="form-label">ملف صحيفة سلامة المواد (MSDS PDF - الحد الأقصى 10MB)</label>
                <input type="file" (change)="onMsdsSelected($event)" accept="application/pdf" class="form-input" />
                @if (isEditing() && editingProduct()?.msds_pdf_url) {
                  <div class="file-status">ملف MSDS مرفوع حاليًا: <a [href]="editingProduct()!.msds_pdf_url!" target="_blank">معاينة الملف</a></div>
                }
              </div>

              <div class="file-upload-block">
                <label class="form-label">صور إضافية لمعرض الصور (Gallery - اختيار متعدد)</label>
                <input type="file" multiple (change)="onGallerySelected($event)" accept="image/*" class="form-input" />
              </div>
            </div>
          }

          @if (formError()) {
            <div class="error-box mt-3">{{ formError() }}</div>
          }

          <div class="modal-footer pt-3">
            <button type="button" class="btn btn-outline" (click)="closeModal()">إلغاء</button>
            <button type="submit" [disabled]="isSaving()" class="btn btn-primary">
              <span>{{ isSaving() ? 'جاري الحفظ...' : (isEditing() ? 'تحديث المنتج' : 'حفظ المنتج') }}</span>
            </button>
          </div>
        </form>
      </app-modal>
    </div>
  `,
  styles: [`
    .products-admin-page {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .page-title {
      font-size: 1.6rem;
      font-weight: 800;
      color: var(--admin-green-900);
    }

    .page-desc {
      font-size: 0.9rem;
      color: var(--admin-text-muted);
    }

    .toolbar-box {
      padding: 1rem 1.25rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .search-field {
      position: relative;
      flex: 1;
      min-width: 240px;
      display: flex;
      align-items: center;

      .search-icon {
        position: absolute;
        right: 0.75rem;
        color: var(--admin-text-light);
      }

      .form-input {
        padding-right: 2.25rem;
      }
    }

    .filter-select {
      min-width: 180px;
    }

    .prod-thumb {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-sm);
      background: var(--admin-green-50);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      color: var(--admin-green-700);

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }

    .prod-names {
      display: flex;
      flex-direction: column;

      strong {
        color: var(--admin-green-900);
        font-size: 0.9rem;
      }

      .en-name {
        font-family: var(--font-latin);
        font-size: 0.775rem;
        color: var(--admin-text-muted);
      }
    }

    .actions-cell {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .action-btn {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--admin-border);
      background: #ffffff;
      color: var(--admin-text-muted);
      transition: all 0.15s ease;

      &.edit:hover {
        background: var(--admin-green-50);
        color: var(--admin-green-700);
        border-color: var(--admin-green-600);
      }

      &.delete:hover {
        background: #fee2e2;
        color: var(--admin-danger);
        border-color: #fca5a5;
      }
    }

    .pagination-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-top: 1rem;

      .page-info {
        font-size: 0.85rem;
        color: var(--admin-text-muted);
      }
    }

    .modal-tabs {
      display: flex;
      align-items: center;
      background: #f1f5f3;
      padding: 0.35rem;
      border-radius: var(--radius-md);
      gap: 0.35rem;
      overflow-x: auto;
      margin-bottom: 1.75rem;
      scrollbar-width: none !important;
      -ms-overflow-style: none !important;
      &::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }

      .tab-btn {
        flex: 1;
        padding: 0.65rem 1rem;
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--admin-text-muted);
        border-radius: var(--radius-sm);
        white-space: nowrap;
        transition: all 0.15s ease;
        text-align: center;
        border: none;
        background: transparent;
        cursor: pointer;

        &:hover {
          color: var(--admin-green-900);
          background: rgba(255, 255, 255, 0.6);
        }

        &.active {
          color: var(--admin-green-900);
          background: #ffffff;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(10, 38, 30, 0.08);
        }
      }
    }

    .tab-pane {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      padding-bottom: 1rem;
    }

    .form-grid-2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;

      @media (max-width: 640px) {
        grid-template-columns: 1fr;
      }
    }

    .check-group {
      grid-column: 1 / -1;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--admin-text);
      cursor: pointer;
    }

    .targets-section {
      h3 {
        font-size: 0.95rem;
        font-weight: 700;
        margin-bottom: 0.75rem;
        color: var(--admin-green-900);
      }
    }

    .checkbox-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 0.5rem;
    }

    .crop-checkbox-card,
    .pest-checkbox-card {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--admin-border);
      border-radius: var(--radius-sm);
      font-size: 0.8rem;
      cursor: pointer;
      background: #ffffff;
      transition: all 0.15s ease;

      &.selected {
        background: var(--admin-green-50);
        border-color: var(--admin-green-600);
        font-weight: 700;
        color: var(--admin-green-900);
      }
    }

    .file-upload-block {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;

      .img-preview {
        width: 80px;
        height: 80px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--admin-border);
        overflow: hidden;
        margin-top: 0.5rem;

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }

      .file-status {
        font-size: 0.8rem;
        color: var(--admin-text-muted);

        a {
          color: var(--admin-bronze-600);
          text-decoration: underline;
        }
      }
    }

    .modal-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.85rem;
      border-top: 1px solid var(--admin-border);
      position: sticky;
      bottom: -2.5rem;
      background: #ffffff;
      padding: 1.25rem 0 0.5rem;
      z-index: 20;
    }

    .error-box {
      padding: 0.75rem;
      background: #fee2e2;
      color: var(--admin-danger);
      border-radius: var(--radius-sm);
      font-size: 0.85rem;
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
export class ProductsAdminComponent implements OnInit {
  private readonly api = inject(AdminApiService);

  readonly products = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly suppliers = signal<Supplier[]>([]);
  readonly crops = signal<Crop[]>([]);
  readonly pests = signal<Pest[]>([]);

  readonly isLoading = signal(false);
  readonly isSaving = signal(false);
  readonly isModalOpen = signal(false);
  readonly isEditing = signal(false);
  readonly editingProduct = signal<Product | null>(null);

  readonly currentPage = signal(1);
  readonly lastPage = signal(1);
  readonly total = signal(0);

  search = '';
  categoryFilter = '';
  activeFilter = '';

  activeTab: 'ar' | 'en' | 'specs' | 'targets' | 'files' = 'ar';
  formError = signal('');

  readonly categoryFilterOptions = computed(() => [
    { label: 'كافة الفئات', value: '' },
    ...this.categories().map((c) => ({ label: `${c.name_ar} (${c.name_en})`, value: c.id.toString() }))
  ]);

  readonly activeFilterOptions = [
    { label: 'كافة الحالات', value: '' },
    { label: 'نشط فقط', value: '1' },
    { label: 'معطل', value: '0' }
  ];

  readonly formCategoryOptions = computed(() => [
    { label: 'اختر الفئة *', value: null },
    ...this.categories().map((c) => ({ label: `${c.name_ar} (${c.name_en})`, value: c.id }))
  ]);

  readonly formSupplierOptions = computed(() => [
    { label: 'لا يوجد مورد محدد', value: null },
    ...this.suppliers().map((s) => ({ label: s.name, value: s.id }))
  ]);

  readonly formulationCodeOptions = [
    { label: 'EC - مستحلب مركز (Emulsifiable Concentrate)', value: 'EC' },
    { label: 'SC - معلق مركز (Suspension Concentrate)', value: 'SC' },
    { label: 'SL - سائل مركز قابل للذوبان (Soluble Liquid)', value: 'SL' },
    { label: 'WP - مسحوق قابل للبلل (Wettable Powder)', value: 'WP' },
    { label: 'WG - حبيبات قابلة للانتشار (Water Dispersible Granules)', value: 'WG' },
    { label: 'SG - حبيبات قابلة للذوبان (Water Soluble Granules)', value: 'SG' },
    { label: 'GR - حبيبات للتربة (Granules)', value: 'GR' },
    { label: 'SP - مسحوق قابل للذوبان (Soluble Powder)', value: 'SP' }
  ];

  readonly toxicityOptions = [
    { label: 'Class I - شديد السمية (أحمر)', value: 'I' },
    { label: 'Class II - متوسط السمية (أصفر)', value: 'II' },
    { label: 'Class III - قليل السمية (أزرق)', value: 'III' },
    { label: 'Class IV - آمن / غير سام (أخضر)', value: 'IV' }
  ];

  form: any = {
    category_id: null,
    supplier_id: null,
    name_ar: '',
    name_en: '',
    active_ingredient_ar: '',
    active_ingredient_en: '',
    concentration: '',
    formulation_code: 'EC',
    chemical_group_ar: '',
    chemical_group_en: '',
    description_ar: '',
    description_en: '',
    usage_instructions_ar: '',
    usage_instructions_en: '',
    pre_harvest_interval: 7,
    toxicity_class: 'III',
    hazard_signal_word_ar: 'تحذير',
    hazard_signal_word_en: 'Warning',
    packaging_sizes: '1L, 5L',
    is_featured: false,
    is_active: true,
    order: 0,
    crop_ids: [] as number[],
    pest_ids: [] as number[]
  };

  mainImageFile: File | null = null;
  datasheetFile: File | null = null;
  msdsFile: File | null = null;
  galleryFiles: File[] = [];
  mainImagePreview = signal<string | null>(null);

  ngOnInit(): void {
    this.loadFilterMetadata();
    this.loadProducts(1);
  }

  loadFilterMetadata(): void {
    this.api.getAllCategories().subscribe(res => res.data && this.categories.set(res.data));
    this.api.getSuppliers().subscribe(res => res.data && this.suppliers.set(res.data));
    this.api.getCrops().subscribe(res => res.data && this.crops.set(res.data));
    this.api.getPests().subscribe(res => res.data && this.pests.set(res.data));
  }

  loadProducts(page = 1): void {
    this.isLoading.set(true);
    this.api.getProducts({
      page,
      search: this.search,
      category_id: this.categoryFilter,
      is_active: this.activeFilter
    }).subscribe({
      next: (res) => {
        this.products.set(res.data);
        this.currentPage.set(res.meta.current_page);
        this.lastPage.set(res.meta.last_page);
        this.total.set(res.meta.total);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  openCreateModal(): void {
    this.isEditing.set(false);
    this.editingProduct.set(null);
    this.formError.set('');
    this.activeTab = 'ar';
    this.form = {
      category_id: this.categories()[0]?.id || null,
      supplier_id: null,
      name_ar: '',
      name_en: '',
      active_ingredient_ar: '',
      active_ingredient_en: '',
      concentration: '',
      formulation_code: 'EC',
      chemical_group_ar: '',
      chemical_group_en: '',
      description_ar: '',
      description_en: '',
      usage_instructions_ar: '',
      usage_instructions_en: '',
      pre_harvest_interval: 7,
      toxicity_class: 'III',
      hazard_signal_word_ar: 'تحذير',
      hazard_signal_word_en: 'Warning',
      packaging_sizes: '1L, 5L',
      is_featured: false,
      is_active: true,
      order: 0,
      crop_ids: [],
      pest_ids: []
    };
    this.mainImageFile = null;
    this.datasheetFile = null;
    this.msdsFile = null;
    this.galleryFiles = [];
    this.mainImagePreview.set(null);
    this.isModalOpen.set(true);
  }

  openEditModal(prod: Product): void {
    this.isEditing.set(true);
    this.editingProduct.set(prod);
    this.formError.set('');
    this.activeTab = 'ar';
    this.form = {
      category_id: prod.category_id,
      supplier_id: prod.supplier_id,
      name_ar: prod.name_ar,
      name_en: prod.name_en,
      active_ingredient_ar: prod.active_ingredient_ar || '',
      active_ingredient_en: prod.active_ingredient_en || '',
      concentration: prod.concentration || '',
      formulation_code: prod.formulation_code || 'EC',
      chemical_group_ar: prod.chemical_group_ar || '',
      chemical_group_en: prod.chemical_group_en || '',
      description_ar: prod.description_ar || '',
      description_en: prod.description_en || '',
      usage_instructions_ar: prod.usage_instructions_ar || '',
      usage_instructions_en: prod.usage_instructions_en || '',
      pre_harvest_interval: prod.pre_harvest_interval || 0,
      toxicity_class: prod.toxicity_class || 'III',
      hazard_signal_word_ar: prod.hazard_signal_word_ar || 'تحذير',
      hazard_signal_word_en: prod.hazard_signal_word_en || 'Warning',
      packaging_sizes: prod.packaging_sizes || '',
      is_featured: prod.is_featured,
      is_active: prod.is_active,
      order: prod.order,
      crop_ids: prod.crops ? prod.crops.map(c => c.id) : [],
      pest_ids: prod.pests ? prod.pests.map(p => p.id) : []
    };
    this.mainImageFile = null;
    this.datasheetFile = null;
    this.msdsFile = null;
    this.galleryFiles = [];
    this.mainImagePreview.set(prod.main_image_url || null);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  isCropSelected(id: number): boolean {
    return this.form.crop_ids.includes(id);
  }

  toggleCrop(id: number): void {
    const idx = this.form.crop_ids.indexOf(id);
    if (idx > -1) {
      this.form.crop_ids.splice(idx, 1);
    } else {
      this.form.crop_ids.push(id);
    }
  }

  isPestSelected(id: number): boolean {
    return this.form.pest_ids.includes(id);
  }

  togglePest(id: number): void {
    const idx = this.form.pest_ids.indexOf(id);
    if (idx > -1) {
      this.form.pest_ids.splice(idx, 1);
    } else {
      this.form.pest_ids.push(id);
    }
  }

  onMainImageSelected(e: any): void {
    const file = e.target.files[0];
    if (file) {
      this.mainImageFile = file;
      const reader = new FileReader();
      reader.onload = () => this.mainImagePreview.set(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  onDatasheetSelected(e: any): void {
    this.datasheetFile = e.target.files[0] || null;
  }

  onMsdsSelected(e: any): void {
    this.msdsFile = e.target.files[0] || null;
  }

  onGallerySelected(e: any): void {
    if (e.target.files) {
      this.galleryFiles = Array.from(e.target.files);
    }
  }

  saveProduct(e: Event): void {
    e.preventDefault();
    if (!this.form.name_ar || !this.form.name_en || !this.form.category_id) {
      this.formError.set('يرجى ملء الحقول الإلزامية: الاسم بالعربي، الاسم بالإنجليزي، والفئة');
      return;
    }

    this.isSaving.set(true);
    this.formError.set('');

    const fd = new FormData();
    Object.keys(this.form).forEach(key => {
      if (key === 'crop_ids' || key === 'pest_ids') {
        this.form[key].forEach((id: number) => fd.append(`${key}[]`, id.toString()));
      } else if (this.form[key] !== null && this.form[key] !== undefined) {
        fd.append(key, typeof this.form[key] === 'boolean' ? (this.form[key] ? '1' : '0') : this.form[key]);
      }
    });

    if (this.mainImageFile) fd.append('main_image', this.mainImageFile);
    if (this.datasheetFile) fd.append('datasheet_pdf', this.datasheetFile);
    if (this.msdsFile) fd.append('msds_pdf', this.msdsFile);
    this.galleryFiles.forEach((file, index) => {
      fd.append(`gallery_images[${index}]`, file);
    });

    const request$ = this.isEditing()
      ? this.api.updateProduct(this.editingProduct()!.id, fd)
      : this.api.createProduct(fd);

    request$.subscribe({
      next: (res) => {
        this.isSaving.set(false);
        this.closeModal();
        this.loadProducts(this.currentPage());
      },
      error: (err) => {
        this.isSaving.set(false);
        this.formError.set(err?.error?.message || 'حدث خطأ أثناء حفظ المنتج، يرجى مراجعة البيانات.');
      }
    });
  }

  deleteProduct(id: number): void {
    if (!confirm('هل أنت متأكد من رغبتك في حذف هذا المنتج نهائيًا؟')) return;
    this.api.deleteProduct(id).subscribe({
      next: () => this.loadProducts(this.currentPage()),
      error: (err) => alert(err?.error?.message || 'تعذر حذف المنتج')
    });
  }
}
