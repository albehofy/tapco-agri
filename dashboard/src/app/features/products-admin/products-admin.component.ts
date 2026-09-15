import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../core/services/admin-api.service';
import { Product, Category, Supplier, Crop, Pest } from '../../core/models/admin.models';
import { AdminIconComponent } from '../../shared/components/admin-icon.component';

@Component({
  selector: 'app-products-admin',
  standalone: true,
  imports: [FormsModule, AdminIconComponent],
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

        <select [(ngModel)]="categoryFilter" (change)="loadProducts(1)" class="form-select filter-select">
          <option value="">كافة الفئات</option>
          @for (cat of categories(); track cat.id) {
            <option [value]="cat.id">{{ cat.name_ar }} ({{ cat.name_en }})</option>
          }
        </select>

        <select [(ngModel)]="activeFilter" (change)="loadProducts(1)" class="form-select filter-select">
          <option value="">كافة الحالات</option>
          <option value="1">نشط فقط</option>
          <option value="0">معطل</option>
        </select>

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
                    }
                  </td>
                  <td>
                    @if (prod.pre_harvest_interval !== null && prod.pre_harvest_interval !== undefined) {
                      <span class="badge badge-yellow">{{ prod.pre_harvest_interval }} يوم</span>
                    } @else {
                      -
                    }
                  </td>
                  <td>
                    @if (prod.is_active) {
                      <span class="badge badge-green">نشط</span>
                    } @else {
                      <span class="badge badge-red">معطل</span>
                    }
                  </td>
                  <td>
                    @if (prod.is_featured) {
                      <span class="badge badge-yellow">★ مميز</span>
                    } @else {
                      <span class="text-muted">-</span>
                    }
                  </td>
                  <td>
                    <div class="table-actions">
                      <button class="btn-icon" (click)="openEditModal(prod)" title="تعديل">
                        <app-admin-icon name="edit" [size]="16" />
                      </button>
                      <button class="btn-icon danger" (click)="deleteProduct(prod.id)" title="حذف">
                        <app-admin-icon name="trash" [size]="16" />
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        @if (lastPage() > 1) {
          <div class="pagination-bar">
            <button class="btn btn-outline" [disabled]="currentPage() === 1" (click)="loadProducts(currentPage() - 1)">
              السابق
            </button>
            <span class="page-info">{{ currentPage() }} / {{ lastPage() }}</span>
            <button class="btn btn-outline" [disabled]="currentPage() === lastPage()" (click)="loadProducts(currentPage() + 1)">
              التالي
            </button>
          </div>
        }
      }

      <!-- Add / Edit Modal -->
      @if (isModalOpen()) {
        <div class="modal-overlay" (click)="closeModal()">
          <div class="modal-content large" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>{{ isEditing() ? 'تعديل منتج: ' + editingProduct()?.name_ar : 'إضافة منتج زراعي جديد' }}</h2>
              <button class="btn-icon" (click)="closeModal()">
                <app-admin-icon name="x" [size]="20" />
              </button>
            </div>

            <!-- Tabs -->
            <div class="modal-tabs">
              <button class="tab-btn" [class.active]="activeTab === 'ar'" (click)="activeTab = 'ar'">البيانات بالعربية</button>
              <button class="tab-btn" [class.active]="activeTab === 'en'" (click)="activeTab = 'en'">English Data</button>
              <button class="tab-btn" [class.active]="activeTab === 'specs'" (click)="activeTab = 'specs'">المواصفات والتصنيف</button>
              <button class="tab-btn" [class.active]="activeTab === 'targets'" (click)="activeTab = 'targets'">المحاصيل والآفات</button>
              <button class="tab-btn" [class.active]="activeTab === 'files'" (click)="activeTab = 'files'">الملفات والصور والـ PDF</button>
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
                    <select [(ngModel)]="form.category_id" name="category_id" required class="form-select">
                      <option value="">اختر الفئة</option>
                      @for (cat of categories(); track cat.id) {
                        <option [value]="cat.id">{{ cat.name_ar }} ({{ cat.name_en }})</option>
                      }
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">الشركة المصنعة / المورّد</label>
                    <select [(ngModel)]="form.supplier_id" name="supplier_id" class="form-select">
                      <option value="">لا يوجد مورد محدد</option>
                      @for (sup of suppliers(); track sup.id) {
                        <option [value]="sup.id">{{ sup.name }}</option>
                      }
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">التركيز والنوع (مثال: 20% SL أو 72% WP)</label>
                    <input type="text" [(ngModel)]="form.concentration" name="concentration" class="form-input" />
                  </div>

                  <div class="form-group">
                    <label class="form-label">كود الصياغة (EC, WP, SC, SL, WG, SG, GR, SP)</label>
                    <select [(ngModel)]="form.formulation_code" name="formulation_code" class="form-select">
                      <option value="EC">EC - مستحلب مركز (Emulsifiable Concentrate)</option>
                      <option value="SC">SC - معلق مركز (Suspension Concentrate)</option>
                      <option value="SL">SL - سائل مركز قابل للذوبان (Soluble Liquid)</option>
                      <option value="WP">WP - مسحوق قابل للبلل (Wettable Powder)</option>
                      <option value="WG">WG - حبيبات قابلة للانتشار (Water Dispersible Granules)</option>
                      <option value="SG">SG - حبيبات قابلة للذوبان (Water Soluble Granules)</option>
                      <option value="GR">GR - حبيبات للتربة (Granules)</option>
                      <option value="SP">SP - مسحوق قابل للذوبان (Soluble Powder)</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">تصنيف السمّية (Toxicity Class)</label>
                    <select [(ngModel)]="form.toxicity_class" name="toxicity_class" class="form-select">
                      <option value="I">Class I - شديد السمية (أحمر)</option>
                      <option value="II">Class II - متوسط السمية (أصفر)</option>
                      <option value="III">Class III - قليل السمية (أزرق)</option>
                      <option value="IV">Class IV - آمن / غير سام (أخضر)</option>
                    </select>
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

                  <div class="form-checkboxes">
                    <label class="checkbox-label">
                      <input type="checkbox" [(ngModel)]="form.is_active" name="is_active" />
                      <span>تفعيل ظهور المنتج في الموقع العام</span>
                    </label>

                    <label class="checkbox-label">
                      <input type="checkbox" [(ngModel)]="form.is_featured" name="is_featured" />
                      <span>منتج مميز في الصفحة الرئيسية (Featured)</span>
                    </label>
                  </div>
                </div>
              }

              <!-- Tab 4: Targets -->
              @if (activeTab === 'targets') {
                <div class="tab-pane">
                  <div class="targets-section">
                    <h4>المحاصيل الموصى بها (اختر المحاصيل المناسبة):</h4>
                    <div class="checkbox-grid">
                      @for (crop of crops(); track crop.id) {
                        <label class="checkbox-pill" [class.selected]="selectedCropIds.includes(crop.id)">
                          <input type="checkbox" [checked]="selectedCropIds.includes(crop.id)" (change)="toggleCrop(crop.id)" />
                          <span>{{ crop.name_ar }}</span>
                        </label>
                      }
                    </div>
                  </div>

                  <div class="targets-section" style="margin-top: 1.5rem;">
                    <h4>الآفات والأمراض المستهدفة (اختر الآفات التي يكافحها المنتج):</h4>
                    <div class="checkbox-grid">
                      @for (pest of pests(); track pest.id) {
                        <label class="checkbox-pill" [class.selected]="selectedPestIds.includes(pest.id)">
                          <input type="checkbox" [checked]="selectedPestIds.includes(pest.id)" (change)="togglePest(pest.id)" />
                          <span>{{ pest.name_ar }} ({{ pest.type }})</span>
                        </label>
                      }
                    </div>
                  </div>
                </div>
              }

              <!-- Tab 5: Files -->
              @if (activeTab === 'files') {
                <div class="tab-pane">
                  <div class="file-upload-block">
                    <label class="form-label">الصورة الرئيسية للمنتج (jpg, png, webp - بحد أقصى 2MB)</label>
                    <input type="file" (change)="onMainImageSelected($event)" accept="image/*" class="form-input" />
                    @if (isEditing() && editingProduct()?.main_image_url) {
                      <div class="preview-mini">
                        <span>الصورة الحالية:</span>
                        <img [src]="editingProduct()!.main_image_url!" alt="Current" />
                      </div>
                    }
                  </div>

                  <div class="file-upload-block">
                    <label class="form-label">النشرة الفنية للمنتج Datasheet (PDF فقط - بحد أقصى 10MB)</label>
                    <input type="file" (change)="onDatasheetSelected($event)" accept=".pdf,application/pdf" class="form-input" />
                    @if (isEditing() && editingProduct()?.datasheet_pdf_url) {
                      <div class="file-status">ملف PDF مرفوع حاليًا: <a [href]="editingProduct()!.datasheet_pdf_url!" target="_blank">معاينة الملف</a></div>
                    }
                  </div>

                  <div class="file-upload-block">
                    <label class="form-label">صحيفة بيانات السلامة MSDS (PDF فقط - بحد أقصى 10MB)</label>
                    <input type="file" (change)="onMsdsSelected($event)" accept=".pdf,application/pdf" class="form-input" />
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
                <div class="error-box">{{ formError() }}</div>
              }

              <div class="modal-footer">
                <button type="button" class="btn btn-outline" (click)="closeModal()">إلغاء</button>
                <button type="submit" [disabled]="isSaving()" class="btn btn-primary">
                  <span>{{ isSaving() ? 'جاري الحفظ...' : (isEditing() ? 'تحديث المنتج' : 'حفظ المنتج') }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      }
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
      width: auto;
      min-width: 170px;
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
      border: 1px solid var(--admin-border-subtle);

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .prod-names {
      display: flex;
      flex-direction: column;
      strong { color: var(--admin-green-900); }
      .en-name { font-size: 0.75rem; color: var(--admin-text-muted); font-family: var(--font-latin); }
    }

    .table-actions {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .pagination-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-top: 1rem;
    }

    .page-info {
      font-weight: 600;
      color: var(--admin-text-muted);
    }

    /* Modal Tabs */
    .modal-tabs {
      display: flex;
      gap: 0.5rem;
      border-bottom: 2px solid var(--admin-border-subtle);
      margin-bottom: 1.5rem;
      overflow-x: auto;
    }

    .tab-btn {
      padding: 0.65rem 1rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--admin-text-muted);
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      white-space: nowrap;

      &.active {
        color: var(--admin-green-700);
        border-bottom-color: var(--admin-green-700);
      }
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
      h2 { font-size: 1.35rem; color: var(--admin-green-900); }
    }

    .tab-pane {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
    }

    .form-checkboxes {
      grid-column: 1 / -1;
      display: flex;
      gap: 2rem;
      margin-top: 0.5rem;
    }

    .checkbox-label {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      cursor: pointer;
    }

    .checkbox-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 0.65rem;
      margin-top: 0.75rem;
    }

    .checkbox-pill {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--admin-border);
      border-radius: var(--radius-sm);
      font-size: 0.85rem;
      cursor: pointer;
      background: #ffffff;

      &.selected {
        background: var(--admin-green-50);
        border-color: var(--admin-green-700);
        color: var(--admin-green-900);
        font-weight: 600;
      }
    }

    .file-upload-block {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      padding: 0.75rem;
      border: 1px dashed var(--admin-border);
      border-radius: var(--radius-sm);
      background: #fdfdfd;
    }

    .preview-mini {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      img { width: 36px; height: 36px; object-fit: cover; border-radius: 4px; }
    }

    .file-status {
      font-size: 0.8rem;
      color: var(--admin-text-muted);
      a { color: var(--admin-green-700); font-weight: 600; text-decoration: underline; }
    }

    .modal-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid var(--admin-border-subtle);
    }

    .error-box {
      background: #fee2e2;
      color: var(--admin-danger);
      padding: 0.75rem;
      border-radius: var(--radius-sm);
      font-size: 0.85rem;
      margin-top: 1rem;
    }

    .loading-state {
      padding: 4rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .spinner {
      width: 36px;
      height: 36px;
      border: 3px solid var(--admin-border);
      border-top-color: var(--admin-green-700);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class ProductsAdminComponent implements OnInit {
  private readonly api = inject AdminApiService;

  readonly products = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly suppliers = signal<Supplier[]>([]);
  readonly crops = signal<Crop[]>([]);
  readonly pests = signal<Pest[]>([]);

  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly isModalOpen = signal(false);
  readonly isEditing = signal(false);
  readonly editingProduct = signal<Product | null>(null);
  readonly formError = signal('');

  readonly currentPage = signal(1);
  readonly lastPage = signal(1);

  search = '';
  categoryFilter = '';
  activeFilter = '';
  activeTab: 'ar' | 'en' | 'specs' | 'targets' | 'files' = 'ar';

  selectedCropIds: number[] = [];
  selectedPestIds: number[] = [];

  mainImageFile: File | null = null;
  datasheetPdfFile: File | null = null;
  msdsPdfFile: File | null = null;
  galleryFiles: File[] = [];

  form: any = {
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
    hazard_signal_word_ar: 'احترس',
    hazard_signal_word_en: 'Caution',
    packaging_sizes: '1 لتر، 5 لتر',
    category_id: '',
    supplier_id: '',
    order: 0,
    is_active: true,
    is_featured: false,
  };

  ngOnInit(): void {
    this.loadProducts(1);
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
      is_active: this.activeFilter,
      per_page: 15,
    }).subscribe({
      next: (res) => {
        this.products.set(res.data || []);
        if (res.meta) {
          this.currentPage.set(res.meta.current_page);
          this.lastPage.set(res.meta.last_page);
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  openCreateModal(): void {
    this.isEditing.set(false);
    this.editingProduct.set(null);
    this.activeTab = 'ar';
    this.selectedCropIds = [];
    this.selectedPestIds = [];
    this.mainImageFile = null;
    this.datasheetPdfFile = null;
    this.msdsPdfFile = null;
    this.galleryFiles = [];
    this.form = {
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
      hazard_signal_word_ar: 'احترس',
      hazard_signal_word_en: 'Caution',
      packaging_sizes: '1 لتر، 5 لتر',
      category_id: this.categories()[0]?.id || '',
      supplier_id: '',
      order: 0,
      is_active: true,
      is_featured: false,
    };
    this.isModalOpen.set(true);
  }

  openEditModal(p: Product): void {
    this.isEditing.set(true);
    this.editingProduct.set(p);
    this.activeTab = 'ar';
    this.selectedCropIds = p.crops?.map(c => c.id) || [];
    this.selectedPestIds = p.pests?.map(pest => pest.id) || [];
    this.mainImageFile = null;
    this.datasheetPdfFile = null;
    this.msdsPdfFile = null;
    this.galleryFiles = [];

    this.form = {
      name_ar: p.name_ar,
      name_en: p.name_en,
      active_ingredient_ar: p.active_ingredient_ar || '',
      active_ingredient_en: p.active_ingredient_en || '',
      concentration: p.concentration || '',
      formulation_code: p.formulation_code || 'EC',
      chemical_group_ar: p.chemical_group_ar || '',
      chemical_group_en: p.chemical_group_en || '',
      description_ar: p.description_ar || '',
      description_en: p.description_en || '',
      usage_instructions_ar: p.usage_instructions_ar || '',
      usage_instructions_en: p.usage_instructions_en || '',
      pre_harvest_interval: p.pre_harvest_interval || 0,
      toxicity_class: p.toxicity_class || 'III',
      hazard_signal_word_ar: p.hazard_signal_word_ar || '',
      hazard_signal_word_en: p.hazard_signal_word_en || '',
      packaging_sizes: p.packaging_sizes || '',
      category_id: p.category_id,
      supplier_id: p.supplier_id || '',
      order: p.order || 0,
      is_active: p.is_active,
      is_featured: p.is_featured,
    };
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  toggleCrop(id: number): void {
    if (this.selectedCropIds.includes(id)) {
      this.selectedCropIds = this.selectedCropIds.filter(i => i !== id);
    } else {
      this.selectedCropIds.push(id);
    }
  }

  togglePest(id: number): void {
    if (this.selectedPestIds.includes(id)) {
      this.selectedPestIds = this.selectedPestIds.filter(i => i !== id);
    } else {
      this.selectedPestIds.push(id);
    }
  }

  onMainImageSelected(e: any): void {
    if (e.target.files?.[0]) this.mainImageFile = e.target.files[0];
  }

  onDatasheetSelected(e: any): void {
    if (e.target.files?.[0]) this.datasheetPdfFile = e.target.files[0];
  }

  onMsdsSelected(e: any): void {
    if (e.target.files?.[0]) this.msdsPdfFile = e.target.files[0];
  }

  onGallerySelected(e: any): void {
    if (e.target.files) this.galleryFiles = Array.from(e.target.files);
  }

  saveProduct(e: Event): void {
    e.preventDefault();
    this.isSaving.set(true);
    this.formError.set('');

    const fd = new FormData();
    Object.entries(this.form).forEach(([key, val]) => {
      if (val !== null && val !== undefined) {
        if (typeof val === 'boolean') {
          fd.append(key, val ? '1' : '0');
        } else {
          fd.append(key, val.toString());
        }
      }
    });

    this.selectedCropIds.forEach(id => fd.append('crop_ids[]', id.toString()));
    this.selectedPestIds.forEach(id => fd.append('pest_ids[]', id.toString()));

    if (this.mainImageFile) fd.append('main_image', this.mainImageFile);
    if (this.datasheetPdfFile) fd.append('datasheet_pdf', this.datasheetPdfFile);
    if (this.msdsPdfFile) fd.append('msds_pdf', this.msdsPdfFile);
    this.galleryFiles.forEach(file => fd.append('gallery_images[]', file));

    const req$ = this.isEditing()
      ? this.api.updateProduct(this.editingProduct()!.id, fd)
      : this.api.createProduct(fd);

    req$.subscribe({
      next: (res) => {
        this.isSaving.set(false);
        if (res.success) {
          this.closeModal();
          this.loadProducts(this.currentPage());
        }
      },
      error: (err) => {
        this.isSaving.set(false);
        this.formError.set(err?.error?.message || 'فشل حفظ المنتج. يرجى مراجعة الحقول.');
      }
    });
  }

  deleteProduct(id: number): void {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟ سيتم حذف جميع الصور والملفات المرتبطة.')) return;

    this.api.deleteProduct(id).subscribe({
      next: () => this.loadProducts(this.currentPage())
    });
  }
}
