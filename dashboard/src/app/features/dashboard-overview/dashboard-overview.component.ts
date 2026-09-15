import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AdminApiService } from '../../core/services/admin-api.service';
import { DashboardStats } from '../../core/models/admin.models';
import { AdminIconComponent } from '../../shared/components/admin-icon.component';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [RouterLink, DatePipe, AdminIconComponent],
  template: `
    <div class="overview-page">
      <div class="page-header">
        <div>
          <h1 class="page-title">نظرة عامة على النظام</h1>
          <p class="page-desc">مؤشرات الأداء والعمليات اليومية لمصنع ومنتجات TAPCO</p>
        </div>

        <a routerLink="/admin/products" class="btn btn-primary">
          <app-admin-icon name="plus" [size]="16" />
          <span>إضافة منتج زراعي جديد</span>
        </a>
      </div>

      @if (isLoading()) {
        <div class="loading-state">
          <div class="spinner"></div>
          <p>جاري تحديث البيانات الإحصائية...</p>
        </div>
      } @else if (stats()) {
        <!-- Metrics Cards Grid -->
        <div class="metrics-grid">
          <div class="metric-card card-base">
            <div class="metric-icon-box green">
              <app-admin-icon name="package" [size]="24" />
            </div>
            <div class="metric-data">
              <span class="m-val">{{ stats()!.counts.products }}</span>
              <span class="m-title">إجمالي المنتجات المسجلة</span>
            </div>
            <span class="m-subtext">نشط حاليًا: {{ stats()!.counts.active_products }}</span>
          </div>

          <div class="metric-card card-base">
            <div class="metric-icon-box bronze">
              <app-admin-icon name="inbox" [size]="24" />
            </div>
            <div class="metric-data">
              <span class="m-val">{{ stats()!.counts.inquiries_new }}</span>
              <span class="m-title">استفسارات جديدة غير معالجة</span>
            </div>
            <span class="m-subtext">إجمالي الوارد: {{ stats()!.counts.inquiries_total }}</span>
          </div>

          <div class="metric-card card-base">
            <div class="metric-icon-box blue">
              <app-admin-icon name="layers" [size]="24" />
            </div>
            <div class="metric-data">
              <span class="m-val">{{ stats()!.counts.categories }}</span>
              <span class="m-title">فئات المبيدات والأسمدة</span>
            </div>
            <span class="m-subtext">شاملة الفئات الفرعية</span>
          </div>

          <div class="metric-card card-base">
            <div class="metric-icon-box purple">
              <app-admin-icon name="truck" [size]="24" />
            </div>
            <div class="metric-data">
              <span class="m-val">{{ stats()!.counts.suppliers }}</span>
              <span class="m-title">الشركات والموردون</span>
            </div>
            <span class="m-subtext">شراكات توريد دولية</span>
          </div>
        </div>

        <!-- Recent Inquiries & Activity Logs -->
        <div class="overview-dual-grid">
          <!-- Recent Inquiries -->
          <div class="overview-section card-base">
            <div class="section-title-bar">
              <div class="title-wrap">
                <app-admin-icon name="inbox" [size]="20" />
                <h3>آخر استفسارات وطلبات عروض الأسعار</h3>
              </div>
              <a routerLink="/admin/inquiries" class="see-all-link">عرض الكل</a>
            </div>

            <div class="table-wrap">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>العميل / المزرعة</th>
                    <th>الهاتف</th>
                    <th>المنتج المطلوب</th>
                    <th>الحالة</th>
                    <th>التاريخ</th>
                    <th>إجراء</th>
                  </tr>
                </thead>
                <tbody>
                  @for (inq of stats()!.recent_inquiries; track inq.id) {
                    <tr>
                      <td><strong>{{ inq.name }}</strong></td>
                      <td dir="ltr">{{ inq.phone }}</td>
                      <td>{{ inq.product?.name_ar || 'استفسار عام' }}</td>
                      <td>
                        @switch (inq.status) {
                          @case ('new') { <span class="badge badge-yellow">جديدة</span> }
                          @case ('contacted') { <span class="badge badge-blue">تم التواصل</span> }
                          @case ('closed') { <span class="badge badge-green">مكتملة</span> }
                        }
                      </td>
                      <td>{{ inq.created_at | date:'shortDate' }}</td>
                      <td>
                        <button class="btn btn-outline" (click)="cycleStatus(inq)" style="padding: 0.25rem 0.6rem; font-size: 0.75rem;">
                          تغيير الحالة
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>

          <!-- Recent Products -->
          <div class="overview-section card-base">
            <div class="section-title-bar">
              <div class="title-wrap">
                <app-admin-icon name="package" [size]="20" />
                <h3>أحدث المنتجات المضافة</h3>
              </div>
              <a routerLink="/admin/products" class="see-all-link">عرض الكل</a>
            </div>

            <div class="table-wrap">
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>اسم المنتج</th>
                    <th>الفئة</th>
                    <th>المادة الفعالة</th>
                    <th>الزيارات</th>
                  </tr>
                </thead>
                <tbody>
                  @for (p of stats()!.recent_products; track p.id) {
                    <tr>
                      <td>
                        <a [routerLink]="['/admin/products']" class="product-link">
                          <strong>{{ p.name_ar }}</strong>
                          <span class="en-name">{{ p.name_en }}</span>
                        </a>
                      </td>
                      <td>{{ p.category?.name_ar }}</td>
                      <td>{{ p.active_ingredient_ar || '-' }}</td>
                      <td>{{ p.views_count }}</td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .overview-page {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .page-title {
      font-size: 1.65rem;
      font-weight: 800;
      color: var(--admin-green-900);
    }

    .page-desc {
      font-size: 0.9rem;
      color: var(--admin-text-muted);
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
    }

    .metric-card {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      position: relative;
    }

    .metric-icon-box {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;

      &.green { background: #dcfce7; color: #166534; }
      &.bronze { background: var(--admin-bronze-100); color: var(--admin-bronze-600); }
      &.blue { background: #e0f2fe; color: #075985; }
      &.purple { background: #f3e8ff; color: #7e22ce; }
    }

    .metric-data {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }

    .m-val {
      font-size: 2rem;
      font-weight: 800;
      color: var(--admin-green-900);
    }

    .m-title {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--admin-text-muted);
    }

    .m-subtext {
      font-size: 0.75rem;
      color: var(--admin-text-light);
      border-top: 1px solid var(--admin-border-subtle);
      padding-top: 0.5rem;
    }

    .overview-dual-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 2rem;
    }

    .overview-section {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .section-title-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .title-wrap {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--admin-green-900);
        h3 { font-size: 1.15rem; font-weight: 700; }
      }

      .see-all-link {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--admin-bronze-600);
        &:hover { text-decoration: underline; }
      }
    }

    .product-link {
      display: flex;
      flex-direction: column;
      .en-name {
        font-size: 0.75rem;
        color: var(--admin-text-light);
        font-family: var(--font-latin);
      }
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
      width: 40px;
      height: 40px;
      border: 3.5px solid var(--admin-border);
      border-top-color: var(--admin-green-700);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class DashboardOverviewComponent implements OnInit {
  private readonly api = inject(AdminApiService);

  readonly stats = signal<DashboardStats | null>(null);
  readonly isLoading = signal(true);

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading.set(true);
    this.api.getDashboardStats().subscribe({
      next: (res) => {
        if (res.data) {
          this.stats.set(res.data);
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  cycleStatus(inq: any): void {
    const nextStatus = inq.status === 'new' ? 'contacted' : (inq.status === 'contacted' ? 'closed' : 'new');
    this.api.updateInquiry(inq.id, { status: nextStatus }).subscribe({
      next: (res) => {
        if (res.data) {
          inq.status = res.data.status;
        }
      }
    });
  }
}
