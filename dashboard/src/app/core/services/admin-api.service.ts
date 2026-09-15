import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  PaginatedResponse,
  DashboardStats,
  Category,
  Supplier,
  Crop,
  Pest,
  Product,
  BlogPost,
  Branch,
  Certificate,
  Inquiry,
  ActivityLog,
  AdminUser,
  Role,
  SiteSettings,
} from '../models/admin.models';

@Injectable({
  providedIn: 'root'
})
export class AdminApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/admin`;

  // Stats
  getDashboardStats(): Observable<ApiResponse<DashboardStats>> {
    return this.http.get<ApiResponse<DashboardStats>>(`${this.apiUrl}/dashboard-stats`);
  }

  // Products
  getProducts(paramsObj: any = {}): Observable<PaginatedResponse<Product>> {
    let params = new HttpParams();
    Object.entries(paramsObj).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params = params.set(k, v.toString());
    });
    return this.http.get<PaginatedResponse<Product>>(`${this.apiUrl}/products`, { params });
  }

  getProduct(id: number): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/products/${id}`);
  }

  createProduct(data: FormData): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(`${this.apiUrl}/products`, data);
  }

  updateProduct(id: number, data: FormData): Observable<ApiResponse<Product>> {
    return this.http.post<ApiResponse<Product>>(`${this.apiUrl}/products/${id}`, data);
  }

  deleteProduct(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/products/${id}`);
  }

  // Categories
  getCategoriesTree(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/categories`);
  }

  getAllCategories(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/categories/all`);
  }

  createCategory(data: FormData): Observable<ApiResponse<Category>> {
    return this.http.post<ApiResponse<Category>>(`${this.apiUrl}/categories`, data);
  }

  updateCategory(id: number, data: FormData): Observable<ApiResponse<Category>> {
    return this.http.post<ApiResponse<Category>>(`${this.apiUrl}/categories/${id}`, data);
  }

  deleteCategory(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/categories/${id}`);
  }

  reorderCategories(items: { id: number; order: number; parent_id: number | null }[]): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(`${this.apiUrl}/categories/reorder`, { items });
  }

  // Suppliers
  getSuppliers(): Observable<ApiResponse<Supplier[]>> {
    return this.http.get<ApiResponse<Supplier[]>>(`${this.apiUrl}/suppliers`);
  }

  createSupplier(data: FormData): Observable<ApiResponse<Supplier>> {
    return this.http.post<ApiResponse<Supplier>>(`${this.apiUrl}/suppliers`, data);
  }

  updateSupplier(id: number, data: FormData): Observable<ApiResponse<Supplier>> {
    return this.http.post<ApiResponse<Supplier>>(`${this.apiUrl}/suppliers/${id}`, data);
  }

  deleteSupplier(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/suppliers/${id}`);
  }

  // Crops
  getCrops(): Observable<ApiResponse<Crop[]>> {
    return this.http.get<ApiResponse<Crop[]>>(`${this.apiUrl}/crops`);
  }

  createCrop(data: FormData): Observable<ApiResponse<Crop>> {
    return this.http.post<ApiResponse<Crop>>(`${this.apiUrl}/crops`, data);
  }

  updateCrop(id: number, data: FormData): Observable<ApiResponse<Crop>> {
    return this.http.post<ApiResponse<Crop>>(`${this.apiUrl}/crops/${id}`, data);
  }

  deleteCrop(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/crops/${id}`);
  }

  // Pests
  getPests(): Observable<ApiResponse<Pest[]>> {
    return this.http.get<ApiResponse<Pest[]>>(`${this.apiUrl}/pests`);
  }

  createPest(data: FormData): Observable<ApiResponse<Pest>> {
    return this.http.post<ApiResponse<Pest>>(`${this.apiUrl}/pests`, data);
  }

  updatePest(id: number, data: FormData): Observable<ApiResponse<Pest>> {
    return this.http.post<ApiResponse<Pest>>(`${this.apiUrl}/pests/${id}`, data);
  }

  deletePest(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/pests/${id}`);
  }

  // Blog
  getBlogPosts(paramsObj: any = {}): Observable<PaginatedResponse<BlogPost>> {
    let params = new HttpParams();
    Object.entries(paramsObj).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params = params.set(k, v.toString());
    });
    return this.http.get<PaginatedResponse<BlogPost>>(`${this.apiUrl}/blog`, { params });
  }

  getBlogPost(id: number): Observable<ApiResponse<BlogPost>> {
    return this.http.get<ApiResponse<BlogPost>>(`${this.apiUrl}/blog/${id}`);
  }

  createBlogPost(data: FormData): Observable<ApiResponse<BlogPost>> {
    return this.http.post<ApiResponse<BlogPost>>(`${this.apiUrl}/blog`, data);
  }

  updateBlogPost(id: number, data: FormData): Observable<ApiResponse<BlogPost>> {
    return this.http.post<ApiResponse<BlogPost>>(`${this.apiUrl}/blog/${id}`, data);
  }

  deleteBlogPost(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/blog/${id}`);
  }

  // Branches
  getBranches(): Observable<ApiResponse<Branch[]>> {
    return this.http.get<ApiResponse<Branch[]>>(`${this.apiUrl}/branches`);
  }

  createBranch(data: any): Observable<ApiResponse<Branch>> {
    return this.http.post<ApiResponse<Branch>>(`${this.apiUrl}/branches`, data);
  }

  updateBranch(id: number, data: any): Observable<ApiResponse<Branch>> {
    return this.http.put<ApiResponse<Branch>>(`${this.apiUrl}/branches/${id}`, data);
  }

  deleteBranch(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/branches/${id}`);
  }

  // Certificates
  getCertificates(): Observable<ApiResponse<Certificate[]>> {
    return this.http.get<ApiResponse<Certificate[]>>(`${this.apiUrl}/certificates`);
  }

  createCertificate(data: FormData): Observable<ApiResponse<Certificate>> {
    return this.http.post<ApiResponse<Certificate>>(`${this.apiUrl}/certificates`, data);
  }

  updateCertificate(id: number, data: FormData): Observable<ApiResponse<Certificate>> {
    return this.http.post<ApiResponse<Certificate>>(`${this.apiUrl}/certificates/${id}`, data);
  }

  deleteCertificate(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/certificates/${id}`);
  }

  // Inquiries
  getInquiries(paramsObj: any = {}): Observable<PaginatedResponse<Inquiry>> {
    let params = new HttpParams();
    Object.entries(paramsObj).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params = params.set(k, v.toString());
    });
    return this.http.get<PaginatedResponse<Inquiry>>(`${this.apiUrl}/inquiries`, { params });
  }

  getInquiry(id: number): Observable<ApiResponse<Inquiry>> {
    return this.http.get<ApiResponse<Inquiry>>(`${this.apiUrl}/inquiries/${id}`);
  }

  updateInquiry(id: number, data: { status: string; admin_note?: string }): Observable<ApiResponse<Inquiry>> {
    return this.http.put<ApiResponse<Inquiry>>(`${this.apiUrl}/inquiries/${id}`, data);
  }

  deleteInquiry(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/inquiries/${id}`);
  }

  // Settings
  getSettings(): Observable<ApiResponse<SiteSettings>> {
    return this.http.get<ApiResponse<SiteSettings>>(`${this.apiUrl}/settings`);
  }

  updateSettings(settings: any): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.apiUrl}/settings`, { settings });
  }

  // Users & Roles
  getUsers(): Observable<ApiResponse<AdminUser[]>> {
    return this.http.get<ApiResponse<AdminUser[]>>(`${this.apiUrl}/users`);
  }

  getRoles(): Observable<ApiResponse<Role[]>> {
    return this.http.get<ApiResponse<Role[]>>(`${this.apiUrl}/roles`);
  }

  createUser(data: any): Observable<ApiResponse<AdminUser>> {
    return this.http.post<ApiResponse<AdminUser>>(`${this.apiUrl}/users`, data);
  }

  updateUser(id: number, data: any): Observable<ApiResponse<AdminUser>> {
    return this.http.put<ApiResponse<AdminUser>>(`${this.apiUrl}/users/${id}`, data);
  }

  deleteUser(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/users/${id}`);
  }

  // Activity Logs
  getActivityLogs(page = 1): Observable<PaginatedResponse<ActivityLog>> {
    return this.http.get<PaginatedResponse<ActivityLog>>(`${this.apiUrl}/activity-logs?page=${page}`);
  }
}
