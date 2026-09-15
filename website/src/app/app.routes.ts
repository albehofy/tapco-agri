import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    title: 'TAPCO | حلول وقاية المحاصيل والمستلزمات الزراعية',
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about.component').then(m => m.AboutComponent),
    title: 'عن مصنع TAPCO | الريادة في وقاية النبات',
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/products-list.component').then(m => m.ProductsListComponent),
    title: 'دليل المنتجات الزراعية | TAPCO',
  },
  {
    path: 'products/:slug',
    loadComponent: () => import('./features/products/product-detail.component').then(m => m.ProductDetailComponent),
  },
  {
    path: 'solutions',
    loadComponent: () => import('./features/solutions/solutions.component').then(m => m.SolutionsComponent),
    title: 'مركز الحلول والتشخيص الزراعي | TAPCO',
  },
  {
    path: 'blog',
    loadComponent: () => import('./features/blog/blog-list.component').then(m => m.BlogListComponent),
    title: 'المدونة والإرشاد الزراعي | TAPCO',
  },
  {
    path: 'blog/:slug',
    loadComponent: () => import('./features/blog/blog-detail.component').then(m => m.BlogDetailComponent),
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/contact.component').then(m => m.ContactComponent),
    title: 'تواصل معنا | TAPCO',
  },
  {
    path: '404',
    loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'الصفحة غير موجودة | TAPCO',
  },
  {
    path: '**',
    redirectTo: '404',
  }
];
