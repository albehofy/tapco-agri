import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { DashboardLayoutComponent } from './shared/components/dashboard-layout/dashboard-layout.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'admin',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard-overview/dashboard-overview.component').then(
            (m) => m.DashboardOverviewComponent
          )
      },
      {
        path: 'inquiries',
        loadComponent: () =>
          import('./features/inquiries-admin/inquiries-admin.component').then(
            (m) => m.InquiriesAdminComponent
          )
      },
      {
        path: 'products',
        loadComponent: () =>
          import('./features/products-admin/products-admin.component').then(
            (m) => m.ProductsAdminComponent
          )
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./features/categories-admin/categories-admin.component').then(
            (m) => m.CategoriesAdminComponent
          )
      },
      {
        path: 'suppliers',
        loadComponent: () =>
          import('./features/suppliers-admin/suppliers-admin.component').then(
            (m) => m.SuppliersAdminComponent
          )
      },
      {
        path: 'crops',
        loadComponent: () =>
          import('./features/crops-admin/crops-admin.component').then(
            (m) => m.CropsAdminComponent
          )
      },
      {
        path: 'pests',
        loadComponent: () =>
          import('./features/pests-admin/pests-admin.component').then(
            (m) => m.PestsAdminComponent
          )
      },
      {
        path: 'blog',
        loadComponent: () =>
          import('./features/blog-admin/blog-admin.component').then(
            (m) => m.BlogAdminComponent
          )
      },
      {
        path: 'branches',
        loadComponent: () =>
          import('./features/branches-admin/branches-admin.component').then(
            (m) => m.BranchesAdminComponent
          )
      },
      {
        path: 'certificates',
        loadComponent: () =>
          import('./features/certificates-admin/certificates-admin.component').then(
            (m) => m.CertificatesAdminComponent
          )
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings-admin/settings-admin.component').then(
            (m) => m.SettingsAdminComponent
          )
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/users-admin/users-admin.component').then(
            (m) => m.UsersAdminComponent
          )
      },
      {
        path: 'activity-logs',
        loadComponent: () =>
          import('./features/activity-logs-admin/activity-logs-admin.component').then(
            (m) => m.ActivityLogsAdminComponent
          )
      }
    ]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'admin/dashboard'
  },
  {
    path: '**',
    redirectTo: 'admin/dashboard'
  }
];
