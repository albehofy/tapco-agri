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
          <table class="admin-table inquiries-table">
            <thead>
              <tr>
                <th class="col-status">الحالة</th>
                <th class="col-name">اسم العميل</th>
                <th class="col-phone">رقم الهاتف</th>
                <th class="col-email">البريد الإلكتروني</th>
                <th class="col-product">المنتج المعني</th>
                <th class="col-source">المصدر</th>
                <th class="col-date">تاريخ الإرسال</th>
                <th class="col-actions">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              @for (inq of inquiries(); track inq.id) {
                <tr [class.is-new-row]="inq.status === 'new'">
                  <td class="col-status">
                    <span class="status-pill" [class]="'status-' + inq.status">
                      <span class="status-dot"></span>
                      <span>{{ getStatusText(inq.status) }}</span>
                    </span>
                  </td>
                  <td class="col-name">
                    <div class="customer-name" [title]="inq.name">
                      {{ inq.name }}
                    </div>
                  </td>
                  <td class="col-phone">
                    <div class="phone-cell">
                      <span class="phone-number" dir="ltr">{{ inq.phone }}</span>
                      <a [href]="getWhatsAppLink(inq.phone)" target="_blank" class="wa-btn" title="مراسلة واتساب">
                        <svg class="wa-icon" viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                        </svg>
                        <span>واتساب</span>
                      </a>
                    </div>
                  </td>
                  <td class="col-email">
                    @if (inq.email) {
                      <a [href]="'mailto:' + inq.email" class="email-link" dir="ltr" [title]="inq.email">
                        {{ inq.email }}
                      </a>
                    } @else {
                      <span class="text-empty">-</span>
                    }
                  </td>
                  <td class="col-product">
                    @if (inq.product) {
                      <span class="product-pill" [title]="inq.product.name_ar">
                        <app-admin-icon name="package" [size]="13" />
                        <span>{{ inq.product.name_ar }}</span>
                      </span>
                    } @else {
                      <span class="general-pill">استفسار عام</span>
                    }
                  </td>
                  <td class="col-source">
                    <span class="source-pill">
                      {{ getSourceText(inq.source) }}
                    </span>
                  </td>
                  <td class="col-date">
                    <span class="date-badge" dir="ltr">{{ inq.created_at | slice:0:10 }}</span>
                  </td>
                  <td class="col-actions">
                    <div class="row-actions">
                      <button class="btn-details" (click)="openDetailModal(inq)" title="عرض الرسالة وتعديل الملاحظات">
                        <app-admin-icon name="eye" [size]="14" />
                        <span>تفاصيل</span>
                      </button>
                      <button class="btn-delete" (click)="confirmDelete(inq)" title="حذف الاستفسار">
                        <app-admin-icon name="trash" [size]="15" />
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
          size="lg"
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
      background: #ffffff;
      border-radius: var(--radius-md);
      border: 1px solid var(--admin-border);
      padding: 0.85rem 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.25rem;
      flex-wrap: wrap;
      box-shadow: 0 1px 3px rgba(10, 38, 30, 0.04);
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
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      inset-inline-end: 0.85rem;
      color: var(--admin-text-muted);
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      padding: 0.55rem 0.9rem;
      padding-inline-end: 2.4rem;
      border: 1.5px solid var(--admin-border);
      border-radius: var(--radius-full);
      font-size: 0.875rem;
      background: #fbfdfc;
      transition: all 0.2s ease;

      &:focus {
        outline: none;
        background: #ffffff;
        border-color: var(--admin-green-600);
        box-shadow: 0 0 0 3px rgba(18, 67, 54, 0.1);
      }
    }

    /* Inquiries Table No-Wrap & Refinements */
    .inquiries-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;

      th, td {
        white-space: nowrap !important;
        vertical-align: middle;
      }

      th {
        padding: 0.95rem 1.25rem;
        user-select: none;
      }

      td {
        padding: 1rem 1.25rem;
      }

      .col-status { width: 130px; text-align: center; }
      .col-name { min-width: 200px; }
      .col-phone { min-width: 180px; }
      .col-email { min-width: 185px; }
      .col-product { min-width: 175px; }
      .col-source { min-width: 130px; }
      .col-date { min-width: 115px; }
      .col-actions { width: 130px; text-align: center; }
    }

    .is-new-row {
      background: #fffcf4 !important;

      td {
        border-bottom-color: #fef3c7;
      }

      &:hover td {
        background: #fefce8 !important;
      }
    }

    .customer-name {
      display: block;
      font-weight: 700;
      color: var(--admin-green-950, #061e18);
      font-size: 0.925rem;
      white-space: nowrap !important;
      letter-spacing: -0.01em;
    }

    .status-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      font-size: 0.775rem;
      font-weight: 700;
      padding: 0.3rem 0.75rem;
      border-radius: 9999px;
      white-space: nowrap !important;
      line-height: 1.2;

      .status-dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        flex-shrink: 0;
      }

      &.status-new {
        background: #fffbeb;
        color: #b45309;
        border: 1px solid #fde68a;
        .status-dot {
          background: #f59e0b;
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.25);
        }
      }

      &.status-contacted {
        background: #eff6ff;
        color: #1d4ed8;
        border: 1px solid #bfdbfe;
        .status-dot {
          background: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.25);
        }
      }

      &.status-closed {
        background: #f0fdf4;
        color: #15803d;
        border: 1px solid #bbf7d0;
        .status-dot {
          background: #22c55e;
          box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.25);
        }
      }
    }

    .phone-cell {
      display: inline-flex;
      align-items: center;
      gap: 0.65rem;
      direction: ltr;
      white-space: nowrap !important;
    }

    .phone-number {
      font-family: var(--font-latin);
      font-weight: 600;
      color: #1e293b;
      font-size: 0.875rem;
      letter-spacing: 0.02em;
    }

    .wa-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.725rem;
      font-weight: 700;
      background: #25d366;
      color: #ffffff;
      padding: 0.22rem 0.55rem;
      border-radius: 6px;
      text-decoration: none;
      transition: all 0.18s ease;
      box-shadow: 0 1px 3px rgba(37, 211, 102, 0.25);
      white-space: nowrap !important;

      &:hover {
        background: #1ebc57;
      }

      .wa-icon {
        flex-shrink: 0;
      }
    }

    .email-link {
      color: #475569;
      font-size: 0.85rem;
      font-family: var(--font-latin);
      text-decoration: none;
      transition: color 0.15s ease;
      white-space: nowrap !important;

      &:hover {
        color: var(--admin-green-700);
        text-decoration: underline;
      }
    }

    .text-empty {
      color: #94a3b8;
      font-weight: 600;
    }

    .product-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      background: #ecfdf5;
      color: #065f46;
      border: 1px solid #a7f3d0;
      font-weight: 600;
      font-size: 0.8rem;
      white-space: nowrap !important;
    }

    .general-pill {
      display: inline-block;
      padding: 0.35rem 0.8rem;
      border-radius: 9999px;
      background: #f8fafc;
      color: #64748b;
      border: 1px solid #e2e8f0;
      font-size: 0.8rem;
      font-weight: 500;
      white-space: nowrap !important;
    }

    .source-pill {
      display: inline-block;
      padding: 0.3rem 0.75rem;
      border-radius: 9999px;
      background: #f1f5f9;
      color: #475569;
      border: 1px solid #e2e8f0;
      font-size: 0.775rem;
      font-weight: 600;
      white-space: nowrap !important;
    }

    .date-badge {
      color: #64748b;
      font-size: 0.85rem;
      font-family: var(--font-latin);
      font-weight: 500;
      white-space: nowrap !important;
    }

    .row-actions {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.45rem;
      white-space: nowrap !important;
    }

    .btn-details {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.35rem 0.75rem;
      border-radius: 6px;
      border: 1px solid #d1ded8;
      background: #ffffff;
      color: var(--admin-green-900, #0a261e);
      font-size: 0.825rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap !important;

      &:hover {
        background: var(--admin-green-50, #f0f7f4);
        border-color: var(--admin-green-600, #185948);
        color: var(--admin-green-700, #124336);
      }
    }

    .btn-delete {
      width: 32px;
      height: 32px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      border: 1px solid transparent;
      background: transparent;
      color: #94a3b8;
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover {
        background: #fee2e2;
        color: #dc2626;
        border-color: #fca5a5;
      }
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
