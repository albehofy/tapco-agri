import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { AdminApiService } from '../../core/services/admin-api.service';
import { BlogPost } from '../../core/models/admin.models';
import { AdminIconComponent } from '../../shared/components/admin-icon.component';

@Component({
  selector: 'app-blog-admin',
  standalone: true,
  imports: [FormsModule, CommonModule, SlicePipe, Dialog, AdminIconComponent],
  template: `
    <div class="blog-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">إدارة المدونة والإرشاد الزراعي</h1>
          <p class="page-desc">نشر مقالات الإرشاد الزراعي، مكافحة الآفات، ونصائح التسميد مع تحسين محركات البحث SEO</p>
        </div>
        <button class="btn btn-primary" (click)="openCreateModal()">
          <app-admin-icon name="plus" [size]="16" />
          <span>إضافة مقال جديد</span>
        </button>
      </div>

      <!-- Articles Grid/Table -->
      @if (isLoading()) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>جاري تحميل المقالات...</p>
        </div>
      } @else if (posts().length === 0) {
        <div class="empty-state card-base">
          <app-admin-icon name="file-text" [size]="48" />
          <h3>لا توجد مقالات منشورة بعد</h3>
          <p>ابدأ بإضافة مقالات إرشادية وتثقيفية لتعزيز ظهور TAPCO</p>
          <button class="btn btn-primary" (click)="openCreateModal()">إضافة أول مقال</button>
        </div>
      } @else {
        <div class="posts-grid">
          @for (post of posts(); track post.id) {
            <div class="post-card card-base">
              <div class="post-thumb">
                @if (post.cover_image_url) {
                  <img [src]="post.cover_image_url" [alt]="post.title_ar" />
                } @else {
                  <app-admin-icon name="file-text" [size]="36" />
                }
                <div class="post-status-tag" [class.published]="post.is_published">
                  {{ post.is_published ? 'منشور' : 'مسودة' }}
                </div>
              </div>

              <div class="post-content">
                <h3 class="post-title-ar">{{ post.title_ar }}</h3>
                <span class="post-title-en">{{ post.title_en }}</span>
                <p class="post-excerpt">{{ post.excerpt_ar || (post.content_ar | slice:0:100) }}...</p>

                <div class="post-meta">
                  <span>الكاتب: {{ post.author_name || 'مهندس زراعي TAPCO' }}</span>
                  <span>{{ post.published_at || (post.created_at | slice:0:10) }}</span>
                </div>
              </div>

              <div class="card-actions">
                <button class="btn btn-outline btn-sm" (click)="openEditModal(post)">
                  <app-admin-icon name="edit" [size]="14" />
                  <span>تعديل</span>
                </button>
                <button class="btn btn-outline btn-sm btn-danger-soft" (click)="confirmDelete(post)">
                  <app-admin-icon name="trash" [size]="14" />
                  <span>حذف</span>
                </button>
              </div>
            </div>
          }
        </div>
      }

      <!-- PrimeNG Dialog -->
      <p-dialog
        [visible]="showModal()"
        (visibleChange)="showModal.set($event)"
        [modal]="true"
        [header]="modalMode() === 'create' ? 'كتابة مقال إرشادي جديد' : 'تعديل المقال'"
        [style]="{ width: '90vw', maxWidth: '680px' }"
        [draggable]="false"
        [resizable]="false"
        [dismissableMask]="true"
      >
        <div class="dialog-content-body pt-2">
          <div class="form-tabs">
            <button class="ftab-btn" [class.active]="activeTab === 'content'" (click)="activeTab = 'content'">
              المحتوى الأساسي
            </button>
            <button class="ftab-btn" [class.active]="activeTab === 'seo'" (click)="activeTab = 'seo'">
              إعدادات الـ SEO والنشر
            </button>
          </div>

          @if (activeTab === 'content') {
            <div class="tab-content-pane">
              <div class="form-group">
                <label>عنوان المقال بالعربية <span class="req">*</span></label>
                <input type="text" [(ngModel)]="formData.title_ar" class="form-input" placeholder="مثال: أفضل طرق مكافحة دودة الحشد الخريفية..." />
              </div>

              <div class="form-group">
                <label>عنوان المقال بالإنجليزية <span class="req">*</span></label>
                <input type="text" [(ngModel)]="formData.title_en" class="form-input" placeholder="e.g. Best practices for managing fall armyworm..." />
              </div>

              <div class="form-group">
                <label>المقتطف / النبذة المختصرة (عربي)</label>
                <textarea [(ngModel)]="formData.excerpt_ar" rows="2" class="form-textarea" placeholder="ملخص سريع يظهر في بطاقة المقال"></textarea>
              </div>

              <div class="form-group">
                <label>المقتطف / النبذة المختصرة (English)</label>
                <textarea [(ngModel)]="formData.excerpt_en" rows="2" class="form-textarea" placeholder="Short summary for card view"></textarea>
              </div>

              <div class="form-group">
                <label>نص المقال الكامل (عربي) <span class="req">*</span></label>
                <textarea [(ngModel)]="formData.content_ar" rows="6" class="form-textarea" placeholder="اكتب نص المقال والإرشادات الزراعية هنا..."></textarea>
              </div>

              <div class="form-group">
                <label>نص المقال الكامل (English) <span class="req">*</span></label>
                <textarea [(ngModel)]="formData.content_en" rows="6" class="form-textarea" placeholder="Write full article content here..."></textarea>
              </div>

              <div class="form-group">
                <label>صورة الغلاف</label>
                <input type="file" (change)="onCoverSelected($event)" accept="image/*" class="form-file" />
                @if (coverPreview()) {
                  <div class="preview-box">
                    <img [src]="coverPreview()" alt="معاينة" />
                  </div>
                }
              </div>
            </div>
          } @else {
            <div class="tab-content-pane">
              <div class="form-group">
                <label>اسم الكاتب / المؤلف</label>
                <input type="text" [(ngModel)]="formData.author_name" class="form-input" placeholder="مهندس زراعي TAPCO" />
              </div>

              <div class="form-group">
                <label class="checkbox-label">
                  <input type="checkbox" [(ngModel)]="formData.is_published" />
                  <span>نشر المقال فوراً على الموقع العام</span>
                </label>
              </div>

              <hr class="divider" />

              <div class="form-group">
                <label>عنوان الـ SEO (Meta Title - عربي)</label>
                <input type="text" [(ngModel)]="formData.meta_title_ar" class="form-input" />
              </div>

              <div class="form-group">
                <label>عنوان الـ SEO (Meta Title - English)</label>
                <input type="text" [(ngModel)]="formData.meta_title_en" class="form-input" />
              </div>

              <div class="form-group">
                <label>وصف الـ SEO (Meta Description - عربي)</label>
                <textarea [(ngModel)]="formData.meta_description_ar" rows="2" class="form-textarea"></textarea>
              </div>

              <div class="form-group">
                <label>وصف الـ SEO (Meta Description - English)</label>
                <textarea [(ngModel)]="formData.meta_description_en" rows="2" class="form-textarea"></textarea>
              </div>
            </div>
          }

          @if (errorMessage()) {
            <div class="alert alert-danger mt-3">{{ errorMessage() }}</div>
          }
        </div>

        <ng-template pTemplate="footer">
          <button class="btn btn-outline" (click)="closeModal()">إلغاء</button>
          <button class="btn btn-primary" [disabled]="isSubmitting()" (click)="savePost()">
            @if (isSubmitting()) {
              <div class="spinner-sm"></div>
              <span>جاري النشر...</span>
            } @else {
              <span>حفظ المقال</span>
            }
          </button>
        </ng-template>
      </p-dialog>
    </div>
  `,
  styles: [`
    .blog-page { display: flex; flex-direction: column; gap: 1.5rem; }
    .page-header { display: flex; align-items: center; justify-content: space-between; }
    .page-title { font-size: 1.6rem; font-weight: 800; color: var(--admin-green-900); margin: 0; }
    .page-desc { font-size: 0.9rem; color: var(--admin-text-muted); margin-top: 0.25rem; }

    .posts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.25rem;
    }

    .post-card {
      padding: 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .post-thumb {
      height: 180px;
      background: var(--admin-green-50);
      color: var(--admin-green-700);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;

      img { width: 100%; height: 100%; object-fit: cover; }
    }

    .post-status-tag {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      background: #f1f5f9;
      color: var(--admin-text-muted);
      padding: 0.2rem 0.6rem;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 700;

      &.published { background: #dcfce7; color: #166534; }
    }

    .post-content {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      flex: 1;
    }

    .post-title-ar { font-size: 1.1rem; font-weight: 700; color: var(--admin-green-900); margin: 0; line-height: 1.4; }
    .post-title-en { font-size: 0.8rem; color: var(--admin-text-muted); font-family: var(--font-latin); }
    .post-excerpt { font-size: 0.85rem; color: var(--admin-text-muted); margin: 0.35rem 0; line-height: 1.5; }

    .post-meta {
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: var(--admin-text-muted);
      margin-top: auto;
      padding-top: 0.5rem;
      border-top: 1px dashed var(--admin-border);
    }

    .card-actions {
      padding: 0.85rem 1.25rem;
      background: #fafafa;
      border-top: 1px solid var(--admin-border);
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }

    .btn-danger-soft { color: #ef4444; border-color: #fee2e2; &:hover { background: #fef2f2; border-color: #fca5a5; } }

    .dialog-content-body { display: flex; flex-direction: column; gap: 1rem; }

    .form-tabs {
      display: flex;
      gap: 0.5rem;
      border-bottom: 1px solid var(--admin-border);
      padding-bottom: 0.5rem;
    }

    .ftab-btn {
      background: none; border: none; padding: 0.5rem 1rem; border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 600; color: var(--admin-text-muted); cursor: pointer;
      &.active { background: var(--admin-green-50); color: var(--admin-green-800); font-weight: 700; }
    }

    .tab-content-pane { display: flex; flex-direction: column; gap: 1rem; }
    .form-group {
      display: flex; flex-direction: column; gap: 0.35rem;
      label { font-size: 0.85rem; font-weight: 600; color: var(--admin-text); }
      .req { color: #ef4444; }
    }
    .checkbox-label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
    .divider { border: 0; border-top: 1px solid var(--admin-border); margin: 0.5rem 0; }
    .preview-box {
      margin-top: 0.5rem; height: 90px; border-radius: var(--radius-sm); overflow: hidden; border: 1px solid var(--admin-border);
      img { width: 100%; height: 100%; object-fit: cover; }
    }
    .loading-state, .empty-state { padding: 3rem; text-align: center; color: var(--admin-text-muted); display: flex; flex-direction: column; align-items: center; gap: 1rem; }
  `]
})
export class BlogAdminComponent implements OnInit {
  private readonly api = inject(AdminApiService);

  readonly posts = signal<BlogPost[]>([]);
  readonly isLoading = signal(true);
  readonly showModal = signal(false);
  readonly modalMode = signal<'create' | 'edit'>('create');
  readonly editingId = signal<number | null>(null);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly coverPreview = signal<string | null>(null);

  activeTab: 'content' | 'seo' = 'content';
  selectedCover: File | null = null;

  formData = {
    title_ar: '',
    title_en: '',
    excerpt_ar: '',
    excerpt_en: '',
    content_ar: '',
    content_en: '',
    author_name: 'مهندس زراعي TAPCO',
    is_published: true,
    meta_title_ar: '',
    meta_title_en: '',
    meta_description_ar: '',
    meta_description_en: ''
  };

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts(): void {
    this.isLoading.set(true);
    this.api.getBlogPosts().subscribe({
      next: (res) => {
        this.posts.set(res.data || []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  openCreateModal(): void {
    this.modalMode.set('create');
    this.editingId.set(null);
    this.activeTab = 'content';
    this.formData = {
      title_ar: '',
      title_en: '',
      excerpt_ar: '',
      excerpt_en: '',
      content_ar: '',
      content_en: '',
      author_name: 'مهندس زراعي TAPCO',
      is_published: true,
      meta_title_ar: '',
      meta_title_en: '',
      meta_description_ar: '',
      meta_description_en: ''
    };
    this.selectedCover = null;
    this.coverPreview.set(null);
    this.errorMessage.set('');
    this.showModal.set(true);
  }

  openEditModal(post: BlogPost): void {
    this.modalMode.set('edit');
    this.editingId.set(post.id);
    this.activeTab = 'content';
    this.formData = {
      title_ar: post.title_ar,
      title_en: post.title_en,
      excerpt_ar: post.excerpt_ar || '',
      excerpt_en: post.excerpt_en || '',
      content_ar: post.content_ar || '',
      content_en: post.content_en || '',
      author_name: post.author_name || 'مهندس زراعي TAPCO',
      is_published: !!post.is_published,
      meta_title_ar: post.meta_title_ar || '',
      meta_title_en: post.meta_title_en || '',
      meta_description_ar: post.meta_description_ar || '',
      meta_description_en: post.meta_description_en || ''
    };
    this.selectedCover = null;
    this.coverPreview.set(post.cover_image_url || null);
    this.errorMessage.set('');
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  onCoverSelected(e: Event): void {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.selectedCover = input.files[0];
      const reader = new FileReader();
      reader.onload = () => this.coverPreview.set(reader.result as string);
      reader.readAsDataURL(this.selectedCover);
    }
  }

  savePost(): void {
    if (!this.formData.title_ar || !this.formData.title_en || !this.formData.content_ar || !this.formData.content_en) {
      this.errorMessage.set('يرجى ملء العنوان والمحتوى بالعربية والإنجليزية');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');

    const form = new FormData();
    Object.entries(this.formData).forEach(([k, v]) => {
      form.append(k, v !== null && v !== undefined ? v.toString() : '');
    });
    if (this.selectedCover) form.append('cover_image', this.selectedCover);

    const req$ = this.modalMode() === 'create'
      ? this.api.createBlogPost(form)
      : this.api.updateBlogPost(this.editingId()!, form);

    req$.subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.closeModal();
        this.loadPosts();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.message || 'حدث خطأ أثناء حفظ المقال');
      }
    });
  }

  confirmDelete(post: BlogPost): void {
    if (confirm(`هل أنت متأكد من حذف مقال "${post.title_ar}"؟`)) {
      this.api.deleteBlogPost(post.id).subscribe({
        next: () => this.loadPosts(),
        error: (err) => alert(err.error?.message || 'تعذر حذف المقال')
      });
    }
  }
}
