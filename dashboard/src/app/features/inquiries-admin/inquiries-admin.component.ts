import { Component, inject, OnInit, signal } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../core/services/admin-api.service';
import { Inquiry } from '../../core/models/admin.models';
import { AdminIconComponent } from '../../shared/components/admin-icon.component';

import { ModalComponent } from '../../shared/components/modal/modal.component';

@Component({
  selector: 'app-inquiries-admin',
  standalone: true,
  imports: [FormsModule, SlicePipe, AdminIconComponent, ModalComponent],
  template: `
    <div class="inquiries-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">رسائل واستفسارات العملاء</h1>
          <p class="page-desc">متابعة طلبات التسعير، استفسارات المنتجات، والطلبات الواردة من الموقع الإلكتروني</p>
        </div>
      </div>

      <!-- Filters & Stats -->
      <div class="filter-strip card-base">
        <div class="filter-tabs">
          <button class="tab-btn" [class.active]="statusFilter() === ''" (click)="setStatusFilter('')">
            الكل ({{ totalCount() }})
          </button>
          <button class="tab-btn badge-new" [class.active]="statusFilter() === 'new'" (click)="setStatusFilter('new')">
            جديدة لم تُقرأ
          </button>
          <button class="tab-btn badge-contacted" [class.active]="statusFilter() === 'contacted'" (click)="setStatusFilter('contacted')">
            تم التواصل
          </button>
          <button class="tab-btn badge-closed" [class.active]="statusFilter() === 'closed'" (click)="setStatusFilter('closed')">
            مغلقة / مكتملة
          </button>
        </div>

        <div class="search-wrap">
          <app-admin-icon name="search" [size]="16" class="search-icon" />
          <input
            type="text"
            [(ngModel)]="searchTerm"
            (keyup.enter)="loadInquiries(1)"
            placeholder="بحث بالاسم أو الهاتف أو الإيميل..."
            class="form-input search-input"
          />
        </div>
      </div>

      <!-- Inquiries Table -->
      @if (isLoading()) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>جاري تحميل الاستفسارات...</p>
        </div>
      } @else if (inquiries().length === 0) {
        <div class="empty-state card-base">
          <app-admin-icon name="inbox" [size]="48" />
          <h3>لا توجد استفسارات في هذا القسم</h3>
          <p>لم يتم العثور على أي رسائل تطابق معايير البحث المحددة</p>
        </div>
      } @else {
        <div class="table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>الحالة</th>
                <th>اسم العميل</th>
                <th>رقم الهاتف</th>
                <th>البريد الإلكتروني</th>
                <th>المنتج المعني</th>
                <th>المصدر</th>
                <th>تاريخ الإرسال</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              @for (inq of inquiries(); track inq.id) {
                <tr [class.is-new-row]="inq.status === 'new'">
                  <td>
                    <span class="status-pill" [class]="'status-' + inq.status">
                      {{ getStatusText(inq.status) }}
                    </span>
                  </td>
                  <td>
                    <strong>{{ inq.name }}</strong>
                  </td>
                  <td>
                    <div class="phone-cell">
                      <span>{{ inq.phone }}</span>
                      <a [href]="getWhatsAppLink(inq.phone)" target="_blank" class="wa-btn" title="مراسلة واتساب">
                        واتساب
                      </a>
                    </div>
                  </td>
                  <td>{{ inq.email || '-' }}</td>
                  <td>
                    @if (inq.product) {
                      <span class="badge badge-green">{{ inq.product.name_ar }}</span>
                    } @else {
                      <span class="text-muted">استفسار عام</span>
                    }
                  </td>
                  <td>
                    <span class="badge badge-gray">{{ getSourceText(inq.source) }}</span>
                  </td>
                  <td>{{ inq.created_at | slice:0:10 }}</td>
                  <td>
                    <div class="row-actions">
                      <button class="btn btn-outline btn-sm" (click)="openDetailModal(inq)" title="عرض الرسالة وتعديل الملاحظات">
                        <app-admin-icon name="eye" [size]="14" />
                        <span>تفاصيل</span>
                      </button>
                      <button class="icon-btn-sm delete" (click)="confirmDelete(inq)" title="حذف">
                        <app-admin-icon name="trash" [size]="14" />
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        @if (totalPages() > 1) {
          <div class="pagination-bar">
            <button class="btn btn-outline btn-sm" [disabled]="currentPage() === 1" (click)="loadInquiries(currentPage() - 1)">
              السابق
            </button>
            <span class="page-info">صفحة {{ currentPage() }} من {{ totalPages() }}</span>
            <button class="btn btn-outline btn-sm" [disabled]="currentPage() === totalPages()" (click)="loadInquiries(currentPage() + 1)">
              التالي
            </button>
          </div>
        }
      }

      <!-- PrimeNG Dialog -->
      @if (activeInquiry()) {
        <app-modal
[visible]="showDetailModal()"
          (visibleChange)="showDetailModal.set($event)"
          [header]="'تفاصيل استفسار: ' + activeInquiry()!.name"
          
        [dismissable]="true">
          <div class="dialog-content-body pt-2">
            <div class="inquiry-info-grid">
              <div class="info-block">
                <span class="lbl">اسم العميل</span>
                <span class="val">{{ activeInquiry()!.name }}</span>
              </div>
              <div class="info-block">
                <span class="lbl">رقم الهاتف</span>
                <span class="val">{{ activeInquiry()!.phone }}</span>
              </div>
              <div class="info-block">
                <span class="lbl">البريد الإلكتروني</span>
                <span class="val">{{ activeInquiry()!.email || 'غير محدد' }}</span>
              </div>
              <div class="info-block">
                <span class="lbl">المنتج المرتبط</span>
                <span class="val">{{ activeInquiry()!.product?.name_ar || 'استفسار عام / بدون منتج' }}</span>
              </div>
              <div class="info-block">
                <span class="lbl">تاريخ الإرسال</span>
                <span class="val">{{ activeInquiry()!.created_at }}</span>
              </div>
              <div class="info-block">
                <span class="lbl">المصدر</span>
                <span class="val">{{ getSourceText(activeInquiry()!.source) }}</span>
              </div>
            </div>

            <div class="message-box">
              <span class="lbl">نص الرسالة والاستفسار:</span>
              <p class="msg-content">{{ activeInquiry()!.message }}</p>
            </div>

            <hr class="divider" />

            <div class="form-group">
              <label>تحديث حالة الاستفسار</label>
              <div class="custom-select-wrap">
              <select class="form-select" [(ngModel)]="statusUpdate">
                <option [ngValue]="null">...</option>
                @for (opt of statusOptions; track opt.value) {
                  <option [ngValue]="opt.value">{{ opt.label }}</option>
                }
              </select>
            </div>
            </div>

            <div class="form-group">
              <label>ملاحظات داخلية للمسؤول (Admin Note)</label>
              <textarea
                [(ngModel)]="adminNoteUpdate"
                rows="3"
                class="form-textarea"
                placeholder="سجل ملاحظاتك هنا مثل: تم الاتصال، إرسال عرض سعر، لا يوجد رد..."
              ></textarea>
            </div>

            @if (saveStatusError()) {
              <div class="alert alert-danger">{{ saveStatusError() }}</div>
            }
          </div>

          <div modal-footer>
            <a [href]="getWhatsAppLink(activeInquiry()!.phone)" target="_blank" class="btn btn-outline wa-action-btn">
              <span>محادثة واتساب مباشرة</span>
            </a>
            <button class="btn btn-outline" (click)="closeDetailModal()">إغلاق</button>
            <button class="btn btn-primary" [disabled]="isSavingStatus()" (click)="saveInquiryStatus()">
              @if (isSavingStatus()) {
                <div class="spinner-sm"></div>
                <span>جاري الحفظ...</span>
              } @else {
                <span>تحديث الحالة والملاحظة</span>
              }
            </button>
          </div>
        </app-modal>
      }
    </div>
  `,
  styles: [`
    .inquiries-page { display: flex; flex-direction: column; gap: 1.5rem; }
    .page-header { display: flex; align-items: center; justify-content: space-between; }
    .page-title { font-size: 1.6rem; font-weight: 800; color: var(--admin-green-900); margin: 0; }
    .page-desc { font-size: 0.9rem; color: var(--admin-text-muted); margin-top: 0.25rem; }

    .filter-strip {
      padding: 0.85rem 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .filter-tabs {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .tab-btn {
      background: none;
      border: 1px solid var(--admin-border);
      padding: 0.45rem 0.85rem;
      border-radius: var(--radius-full);
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--admin-text-muted);
      cursor: pointer;
      transition: all 0.15s;

      &:hover {
        background: #f8fafc;
        color: var(--admin-text);
      }

      &.active {
        background: var(--admin-green-800);
        color: #ffffff;
        border-color: var(--admin-green-800);
      }
    }

    .search-wrap {
      position: relative;
      width: 320px;
      max-width: 100%;
    }

    .search-icon {
      position: absolute;
      right: 0.85rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--admin-text-muted);
    }

    .search-input {
      padding-right: 2.25rem;
    }

    .is-new-row {
      background: rgba(196, 138, 68, 0.05);
      font-weight: 600;
    }

    .status-pill {
      display: inline-block;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 0.25rem 0.6rem;
      border-radius: var(--radius-full);

      &.status-new { background: #fef3c7; color: #92400e; }
      &.status-contacted { background: #e0e7ff; color: #3730a3; }
      &.status-closed { background: #dcfce7; color: #166534; }
    }

    .phone-cell {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .wa-btn {
      font-size: 0.7rem;
      background: #25d366;
      color: #ffffff;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 700;

      &:hover { opacity: 0.9; }
    }

    .row-actions {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .icon-btn-sm {
      background: none; border: none; padding: 0.35rem; border-radius: var(--radius-sm); cursor: pointer; color: var(--admin-text-muted);
      &.delete:hover { color: #ef4444; background: #fef2f2; }
    }

    .pagination-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 1rem 0;
    }

    .page-info { font-size: 0.85rem; color: var(--admin-text-muted); }

    .dialog-content-body { display: flex; flex-direction: column; gap: 1rem; }

    .inquiry-info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.85rem;
      background: #f8fafc;
      padding: 1rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--admin-border);
    }

    .info-block {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      .lbl { font-size: 0.75rem; color: var(--admin-text-muted); font-weight: 600; }
      .val { font-size: 0.9rem; font-weight: 700; color: var(--admin-text); }
    }

    .message-box {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      .lbl { font-size: 0.85rem; font-weight: 700; color: var(--admin-green-900); }
      .msg-content {
        background: #fafafa;
        border: 1px solid var(--admin-border);
        border-radius: var(--radius-sm);
        padding: 0.85rem;
        font-size: 0.9rem;
        line-height: 1.5;
        white-space: pre-line;
        margin: 0;
      }
    }

    .divider { border: 0; border-top: 1px solid var(--admin-border); margin: 0.5rem 0; }

    .form-group {
      display: flex; flex-direction: column; gap: 0.35rem;
      label { font-size: 0.85rem; font-weight: 600; color: var(--admin-text); }
    }

    .wa-action-btn {
      color: #15803d;
      border-color: #bbf7d0;
      &:hover { background: #f0fdf4; }
    }

    .empty-state {
      padding: 3rem; text-align: center; color: var(--admin-text-muted); display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
      h3 { margin: 0; font-size: 1.15rem; color: var(--admin-text); }
      p { margin: 0; font-size: 0.85rem; }
    }

    .loading-state { padding: 3rem; text-align: center; color: var(--admin-text-muted); display: flex; flex-direction: column; align-items: center; gap: 1rem; }
    .w-full { width: 100%; }
  
    .custom-select-wrap { position: relative; }
    .form-select {
      width: 100%;
      padding: 0.55rem 2.25rem 0.55rem 0.75rem;
      border: 1px solid var(--admin-border);
      border-radius: var(--radius-sm);
      background: #fff;
      font-size: 0.9rem;
      color: var(--admin-text);
      appearance: none;
      -webkit-appearance: none;
      cursor: pointer;
      line-height: 1.4;
    }
    .form-select:focus {
      outline: none;
      border-color: var(--admin-green-600);
      box-shadow: 0 0 0 3px rgba(18,67,54,0.12);
    }
    .custom-select-wrap::after {
      content: '';
      position: absolute;
      inset-inline-end: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      width: 0; height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 5px solid #53645e;
      pointer-events: none;
    }`]
})
export class InquiriesAdminComponent implements OnInit {
  private readonly api = inject(AdminApiService);

  readonly inquiries = signal<Inquiry[]>([]);
  readonly isLoading = signal(true);
  readonly statusFilter = signal<string>('');
  readonly searchTerm = '';
  readonly totalCount = signal(0);
  readonly currentPage = signal(1);
  readonly totalPages = signal(1);

  readonly showDetailModal = signal(false);
  readonly activeInquiry = signal<Inquiry | null>(null);
  readonly isSavingStatus = signal(false);
  readonly saveStatusError = signal('');

  readonly statusOptions = [
    { label: 'جديدة (لم يُتواصل بعد)', value: 'new' },
    { label: 'تم التواصل والمتابعة', value: 'contacted' },
    { label: 'مغلقة / مكتملة', value: 'closed' }
  ];

  statusUpdate = 'new';
  adminNoteUpdate = '';

  ngOnInit(): void {
    this.loadInquiries(1);
  }

  loadInquiries(page = 1): void {
    this.isLoading.set(true);
    this.currentPage.set(page);

    const params: any = { page };
    if (this.statusFilter()) params.status = this.statusFilter();
    if (this.searchTerm) params.search = this.searchTerm;

    this.api.getInquiries(params).subscribe({
      next: (res) => {
        this.inquiries.set(res.data || []);
        if (res.meta) {
          this.totalCount.set(res.meta.total || 0);
          this.totalPages.set(res.meta.last_page || 1);
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  setStatusFilter(st: string): void {
    this.statusFilter.set(st);
    this.loadInquiries(1);
  }

  getStatusText(st: string): string {
    switch (st) {
      case 'new': return 'جديدة';
      case 'contacted': return 'تم التواصل';
      case 'closed': return 'مغلقة';
      default: return st;
    }
  }

  getSourceText(src: string): string {
    switch (src) {
      case 'product': return 'صفحة منتج';
      case 'contact_form': return 'نموذج اتصل بنا';
      case 'general': return 'استفسار عام';
      default: return src || 'الموقع';
    }
  }

  getWhatsAppLink(phone: string): string {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanPhone}`;
  }

  openDetailModal(inq: Inquiry): void {
    this.activeInquiry.set(inq);
    this.statusUpdate = inq.status;
    this.adminNoteUpdate = inq.admin_note || '';
    this.saveStatusError.set('');
    this.showDetailModal.set(true);
  }

  closeDetailModal(): void {
    this.showDetailModal.set(false);
    this.activeInquiry.set(null);
  }

  saveInquiryStatus(): void {
    const inq = this.activeInquiry();
    if (!inq) return;

    this.isSavingStatus.set(true);
    this.saveStatusError.set('');

    this.api.updateInquiry(inq.id, {
      status: this.statusUpdate,
      admin_note: this.adminNoteUpdate
    }).subscribe({
      next: (res) => {
        this.isSavingStatus.set(false);
        this.closeDetailModal();
        this.loadInquiries(this.currentPage());
      },
      error: (err) => {
        this.isSavingStatus.set(false);
        this.saveStatusError.set(err.error?.message || 'حدث خطأ أثناء تحديث الاستفسار');
      }
    });
  }

  confirmDelete(inq: Inquiry): void {
    if (confirm(`هل أنت متأكد من حذف استفسار العميل "${inq.name}"؟`)) {
      this.api.deleteInquiry(inq.id).subscribe({
        next: () => this.loadInquiries(this.currentPage()),
        error: (err) => alert(err.error?.message || 'تعذر حذف الاستفسار')
      });
    }
  }
}
