import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LoadingService } from '../../../core/services/loading.service';
import { AdminIconComponent } from '../admin-icon.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AdminIconComponent],
  template: `
    <div class="admin-layout">
      <!-- Sidebar Backdrop on Mobile -->
      @if (isMobileSidebarOpen()) {
        <div class="sidebar-backdrop" (click)="isMobileSidebarOpen.set(false)"></div>
      }

      <!-- Sidebar -->
      <aside class="admin-sidebar" [class.mobile-open]="isMobileSidebarOpen()">
        <div class="sidebar-header">
          <div class="brand-box">
            <span class="brand-logo-t">T</span>
            <div class="brand-meta">
              <span class="brand-name">TAPCO</span>
              <span class="brand-sub">Admin Console</span>
            </div>
          </div>
          <button class="close-sidebar-btn" (click)="isMobileSidebarOpen.set(false)">
            <app-admin-icon name="x" [size]="20" />
          </button>
        </div>

        <nav class="sidebar-nav">
          <div class="nav-section-label">لوحة التحكم والعمليات</div>
          <a routerLink="/admin/dashboard" routerLinkActive="active" (click)="closeMobile()" class="nav-item">
            <app-admin-icon name="grid" [size]="18" />
            <span>نظرة عامة</span>
          </a>

          <a routerLink="/admin/inquiries" routerLinkActive="active" (click)="closeMobile()" class="nav-item">
            <app-admin-icon name="inbox" [size]="18" />
            <span>رسائل واستفسارات العملاء</span>
          </a>

          <div class="nav-section-label">إدارة الكتالوج الزراعي</div>
          <a routerLink="/admin/products" routerLinkActive="active" (click)="closeMobile()" class="nav-item">
            <app-admin-icon name="package" [size]="18" />
            <span>المنتجات والمبيدات</span>
          </a>

          <a routerLink="/admin/categories" routerLinkActive="active" (click)="closeMobile()" class="nav-item">
            <app-admin-icon name="layers" [size]="18" />
            <span>الفئات الشجرية</span>
          </a>

          <a routerLink="/admin/suppliers" routerLinkActive="active" (click)="closeMobile()" class="nav-item">
            <app-admin-icon name="truck" [size]="18" />
            <span>الشركات والموردون</span>
          </a>

          <a routerLink="/admin/crops" routerLinkActive="active" (click)="closeMobile()" class="nav-item">
            <app-admin-icon name="sprout" [size]="18" />
            <span>المحاصيل الزراعية</span>
          </a>

          <a routerLink="/admin/pests" routerLinkActive="active" (click)="closeMobile()" class="nav-item">
            <app-admin-icon name="bug" [size]="18" />
            <span>الآفات والأمراض</span>
          </a>

          <div class="nav-section-label">المحتوى والفروع</div>
          <a routerLink="/admin/blog" routerLinkActive="active" (click)="closeMobile()" class="nav-item">
            <app-admin-icon name="file-text" [size]="18" />
            <span>المدونة والإرشاد</span>
          </a>

          <a routerLink="/admin/branches" routerLinkActive="active" (click)="closeMobile()" class="nav-item">
            <app-admin-icon name="map-pin" [size]="18" />
            <span>الفروع والمراكز</span>
          </a>

          <a routerLink="/admin/certificates" routerLinkActive="active" (click)="closeMobile()" class="nav-item">
            <app-admin-icon name="award" [size]="18" />
            <span>شهادات الجودة</span>
          </a>

          <div class="nav-section-label">النظام والأمان</div>
          <a routerLink="/admin/settings" routerLinkActive="active" (click)="closeMobile()" class="nav-item">
            <app-admin-icon name="settings" [size]="18" />
            <span>الإعدادات العامة</span>
          </a>

          @if (auth.currentUser()?.role === 'Admin' || auth.hasPermission('users.manage')) {
            <a routerLink="/admin/users" routerLinkActive="active" (click)="closeMobile()" class="nav-item">
              <app-admin-icon name="users" [size]="18" />
              <span>المستخدمون والصلاحيات</span>
            </a>
          }

          <a routerLink="/admin/activity-logs" routerLinkActive="active" (click)="closeMobile()" class="nav-item">
            <app-admin-icon name="activity" [size]="18" />
            <span>سجل النشاطات</span>
          </a>
        </nav>

        <div class="sidebar-footer">
          <div class="user-strip">
            <div class="avatar-pill">
              {{ (auth.currentUser()?.name || 'A').substring(0, 1) }}
            </div>
            <div class="user-text">
              <span class="u-name">{{ auth.currentUser()?.name || 'المسؤول' }}</span>
              <span class="u-role">{{ auth.currentUser()?.role || 'Admin' }}</span>
            </div>
          </div>

          <button class="logout-action-btn" (click)="auth.logout()" title="تسجيل الخروج">
            <app-admin-icon name="log-out" [size]="18" />
          </button>
        </div>
      </aside>

      <!-- Main Area -->
      <div class="main-wrapper">
        <!-- Topbar -->
        <header class="admin-topbar">
          <button class="mobile-toggle" (click)="isMobileSidebarOpen.set(true)">
            <app-admin-icon name="menu" [size]="22" />
          </button>

          <div class="topbar-left">
            <span class="dashboard-badge">نظام إدارة مصنع TAPCO الزراعي</span>
            @if (loading.isLoading()) {
              <div class="topbar-sync-indicator">
                <span class="sync-dot"></span>
                <span>جاري المزامنة...</span>
              </div>
            }
          </div>

          <div class="topbar-right">
            <a href="http://localhost:4200" target="_blank" class="btn btn-outline preview-site-btn">
              <app-admin-icon name="eye" [size]="16" />
              <span>زيارة الموقع العام</span>
            </a>

            <button class="btn btn-outline" (click)="auth.logout()">
              <app-admin-icon name="log-out" [size]="16" />
              <span>خروج</span>
            </button>
          </div>
        </header>

        <!-- Page Body Content -->
        <main class="admin-page-content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      min-height: 100vh;
      background: var(--admin-bg);
    }

    /* Sidebar */
    .admin-sidebar {
      width: 270px;
      background: var(--admin-sidebar-bg);
      color: #ffffff;
      display: flex;
      flex-direction: column;
      position: sticky;
      top: 0;
      height: 100vh;
      z-index: 1000;
      box-shadow: 2px 0 12px rgba(0, 0, 0, 0.1);
      flex-shrink: 0;
      scrollbar-width: none;
      -ms-overflow-style: none;
      &::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
      }
    }

    .sidebar-header {
      padding: 1.25rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }

    .brand-box {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .brand-logo-t {
      width: 38px;
      height: 38px;
      border-radius: var(--radius-sm);
      background: linear-gradient(135deg, var(--admin-bronze-500) 0%, var(--admin-bronze-600) 100%);
      color: #ffffff;
      font-size: 1.35rem;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .brand-meta {
      display: flex;
      flex-direction: column;
    }

    .brand-name {
      font-family: var(--font-latin);
      font-weight: 900;
      font-size: 1.15rem;
      letter-spacing: 0.08em;
      color: var(--admin-bronze-500);
    }

    .brand-sub {
      font-size: 0.75rem;
      color: #a7bfb6;
    }

    .close-sidebar-btn {
      display: none;
      color: #ffffff;
    }

    .sidebar-nav {
      flex: 1;
      padding: 1.25rem 0.85rem;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      scrollbar-width: none;
      -ms-overflow-style: none;
      &::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
      }
    }

    .nav-section-label {
      font-size: 0.75rem;
      font-weight: 700;
      color: #688a7e;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      padding: 0.75rem 0.75rem 0.35rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.65rem 0.85rem;
      border-radius: var(--radius-sm);
      font-size: 0.875rem;
      font-weight: 600;
      color: #c9ddd5;
      transition: all 0.15s ease;

      &:hover {
        background: var(--admin-sidebar-hover);
        color: #ffffff;
      }

      &.active {
        background: var(--admin-sidebar-active);
        color: #ffffff;
        border-inline-start: 4px solid var(--admin-bronze-500);
        font-weight: 700;
      }
    }

    .sidebar-footer {
      padding: 1rem 1.25rem;
      background: rgba(0, 0, 0, 0.15);
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .user-strip {
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }

    .avatar-pill {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: var(--admin-green-700);
      color: #ffffff;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-text {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }

    .u-name {
      font-size: 0.85rem;
      font-weight: 700;
      color: #ffffff;
    }

    .u-role {
      font-size: 0.7rem;
      color: var(--admin-bronze-500);
    }

    .logout-action-btn {
      color: #a7bfb6;
      padding: 0.35rem;
      border-radius: var(--radius-sm);
      &:hover {
        color: #ffffff;
        background: rgba(255, 255, 255, 0.1);
      }
    }

    /* Main Area */
    .main-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .admin-topbar {
      height: 64px;
      background: #ffffff;
      border-bottom: 1px solid var(--admin-border);
      padding: 0 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 500;
    }

    .mobile-toggle {
      display: none;
      color: var(--admin-text);
      padding: 0.35rem;
    }

    .dashboard-badge {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--admin-green-800);
      background: var(--admin-green-50);
      padding: 0.3rem 0.8rem;
      border-radius: var(--radius-full);
      border: 1px solid rgba(18, 67, 54, 0.15);
    }

    .topbar-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .admin-page-content {
      flex: 1;
      padding: 2.25rem 2.25rem 4rem;
      min-height: calc(100vh - 64px);
    }

    @media (max-width: 991px) {
      .admin-sidebar {
        position: fixed;
        top: 0;
        bottom: 0;
        right: 0;
        transform: translateX(100%);
        transition: transform 0.25s ease;

        &.mobile-open {
          transform: translateX(0);
        }
      }

      .mobile-toggle {
        display: inline-flex;
      }

      .close-sidebar-btn {
        display: inline-flex;
      }

      .sidebar-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.45);
        z-index: 999;
      }
    }

    .topbar-sync-indicator {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--admin-green-800);
      background: var(--admin-green-50);
      padding: 0.2rem 0.65rem;
      border-radius: var(--radius-full);
      border: 1px solid rgba(18, 67, 54, 0.15);
    }

    .sync-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--admin-bronze-500);
      box-shadow: 0 0 6px var(--admin-bronze-500);
      animation: pulse-sync-dot 1.2s infinite alternate ease-in-out;
    }

    @keyframes pulse-sync-dot {
      0% { opacity: 0.3; transform: scale(0.85); }
      100% { opacity: 1; transform: scale(1.15); }
    }
  `]
})
export class DashboardLayoutComponent {
  readonly auth = inject(AuthService);
  readonly loading = inject(LoadingService);
  readonly isMobileSidebarOpen = signal(false);

  closeMobile(): void {
    this.isMobileSidebarOpen.set(false);
  }
}
