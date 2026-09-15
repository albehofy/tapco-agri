import { Component, inject, OnInit, signal } from '@angular/core';
import { AdminApiService } from '../../core/services/admin-api.service';
import { ActivityLog } from '../../core/models/admin.models';
import { AdminIconComponent } from '../../shared/components/admin-icon.component';

@Component({
  selector: 'app-activity-logs-admin',
  standalone: true,
  imports: [AdminIconComponent],
  template: `
    <div class="logs-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">سجل العمليات والنشاطات (Audit Logs)</h1>
          <p class="page-desc">سجل زمني غير قابل للتعديل لكافة الإجراءات والعمليات المنفذة في لوحة الإدارة لضمان الشفافية والأمان</p>
        </div>
        <button class="btn btn-outline" (click)="loadLogs(currentPage())">
          <span>تحديث السجل</span>
        </button>
      </div>

      @if (isLoading()) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>جاري استرجاع سجل النشاطات...</p>
        </div>
      } @else if (logs().length === 0) {
        <div class="empty-state card-base">
          <app-admin-icon name="activity" [size]="48" />
          <h3>لا توجد سجلات نشاط مسجلة</h3>
        </div>
      } @else {
        <div class="table-wrap card-base">
          <table class="admin-table">
            <thead>
              <tr>
                <th>التاريخ والوقت</th>
                <th>المستخدم المسؤول</th>
                <th>نوع الإجراء</th>
                <th>الكائن المتأثر</th>
                <th>تفاصيل الإجراء</th>
              </tr>
            </thead>
            <tbody>
              @for (log of logs(); track log.id) {
                <tr>
                  <td>
                    <span class="log-time" dir="ltr">{{ log.created_at }}</span>
                  </td>
                  <td>
                    <div class="user-pill">
                      <strong>{{ log.admin_user?.name || 'مستخدم غير معروف' }}</strong>
                      <span class="user-email">{{ log.admin_user?.email || '' }}</span>
                    </div>
                  </td>
                  <td>
                    <span class="action-tag" [class]="getActionClass(log.action)">
                      {{ getActionLabel(log.action) }}
                    </span>
                  </td>
                  <td>
                    @if (log.model_type) {
                      <span class="model-badge">
                        {{ getModelName(log.model_type) }} #{{ log.model_id }}
                      </span>
                    } @else {
                      <span class="text-muted">-</span>
                    }
                  </td>
                  <td>
                    <div class="details-snippet">
                      {{ formatDetails(log.details) }}
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
            <button class="btn btn-outline btn-sm" [disabled]="currentPage() === 1" (click)="loadLogs(currentPage() - 1)">
              السابق
            </button>
            <span class="page-info">صفحة {{ currentPage() }} من {{ totalPages() }}</span>
            <button class="btn btn-outline btn-sm" [disabled]="currentPage() === totalPages()" (click)="loadLogs(currentPage() + 1)">
              التالي
            </button>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .logs-page { display: flex; flex-direction: column; gap: 1.5rem; }
    .page-header { display: flex; align-items: center; justify-content: space-between; }
    .page-title { font-size: 1.6rem; font-weight: 800; color: var(--admin-green-900); margin: 0; }
    .page-desc { font-size: 0.9rem; color: var(--admin-text-muted); margin-top: 0.25rem; }

    .log-time { font-family: monospace; font-size: 0.8rem; color: var(--admin-text-muted); }

    .user-pill {
      display: flex;
      flex-direction: column;
      strong { font-size: 0.85rem; color: var(--admin-green-900); }
      .user-email { font-size: 0.75rem; color: var(--admin-text-muted); direction: ltr; text-align: right; }
    }

    .action-tag {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 700;

      &.action-create { background: #dcfce7; color: #166534; }
      &.action-update { background: #e0f2fe; color: #0369a1; }
      &.action-delete { background: #fee2e2; color: #991b1b; }
      &.action-auth { background: #fef3c7; color: #92400e; }
      &.action-other { background: #f1f5f9; color: #475569; }
    }

    .model-badge {
      font-family: monospace;
      font-size: 0.75rem;
      background: #f8fafc;
      border: 1px solid var(--admin-border);
      padding: 0.15rem 0.4rem;
      border-radius: var(--radius-sm);
    }

    .details-snippet {
      font-size: 0.8rem;
      color: var(--admin-text-muted);
      max-width: 320px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .pagination-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 1rem 0;
    }

    .page-info { font-size: 0.85rem; color: var(--admin-text-muted); }

    .loading-state, .empty-state { padding: 3rem; text-align: center; color: var(--admin-text-muted); display: flex; flex-direction: column; align-items: center; gap: 1rem; }
  `]
})
export class ActivityLogsAdminComponent implements OnInit {
  private readonly api = inject(AdminApiService);

  readonly logs = signal<ActivityLog[]>([]);
  readonly isLoading = signal(true);
  readonly currentPage = signal(1);
  readonly totalPages = signal(1);

  ngOnInit(): void {
    this.loadLogs(1);
  }

  loadLogs(page = 1): void {
    this.isLoading.set(true);
    this.currentPage.set(page);

    this.api.getActivityLogs(page).subscribe({
      next: (res) => {
        this.logs.set(res.data || []);
        if (res.meta) {
          this.totalPages.set(res.meta.last_page || 1);
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  getActionLabel(action: string): string {
    if (action.includes('create')) return 'إضافة جديد';
    if (action.includes('update')) return 'تعديل وتحديث';
    if (action.includes('delete')) return 'حذف كائن';
    if (action.includes('login')) return 'تسجيل دخول';
    if (action.includes('logout')) return 'تسجيل خروج';
    return action;
  }

  getActionClass(action: string): string {
    if (action.includes('create')) return 'action-create';
    if (action.includes('update')) return 'action-update';
    if (action.includes('delete')) return 'action-delete';
    if (action.includes('login') || action.includes('logout')) return 'action-auth';
    return 'action-other';
  }

  getModelName(modelType: string): string {
    const parts = modelType.split('\\');
    return parts[parts.length - 1];
  }

  formatDetails(details: any): string {
    if (!details) return '-';
    if (typeof details === 'string') return details;
    return JSON.stringify(details);
  }
}
