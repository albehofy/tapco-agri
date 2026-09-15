import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  PaginatedResponse,
  Category,
  Supplier,
  Crop,
  Pest,
  Product,
  BlogPost,
  Branch,
  Certificate,
  SiteSettings,
  Inquiry
} from '../models/tapco.models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getCategories(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(`${this.apiUrl}/categories`);
  }

  getCategoryBySlug(slug: string): Observable<ApiResponse<Category>> {
    return this.http.get<ApiResponse<Category>>(`${this.apiUrl}/categories/${slug}`);
  }

  getProducts(paramsObj: {
    category?: string;
    supplier?: string;
    crop?: string;
    pest?: string;
    search?: string;
    sort?: string;
    page?: number;
    per_page?: number;
  } = {}): Observable<PaginatedResponse<Product>> {
    let params = new HttpParams();
    Object.entries(paramsObj).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        params = params.set(key, val.toString());
      }
    });

    return this.http.get<PaginatedResponse<Product>>(`${this.apiUrl}/products`, { params });
  }

  getFeaturedProducts(): Observable<ApiResponse<Product[]>> {
    return this.http.get<ApiResponse<Product[]>>(`${this.apiUrl}/products/featured`);
  }

  getProductBySlug(slug: string): Observable<ApiResponse<Product>> {
    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/products/${slug}`);
  }

  getSuppliers(): Observable<ApiResponse<Supplier[]>> {
    return this.http.get<ApiResponse<Supplier[]>>(`${this.apiUrl}/suppliers`);
  }

  getCrops(): Observable<ApiResponse<Crop[]>> {
    return this.http.get<ApiResponse<Crop[]>>(`${this.apiUrl}/crops`);
  }

  getPests(): Observable<ApiResponse<Pest[]>> {
    return this.http.get<ApiResponse<Pest[]>>(`${this.apiUrl}/pests`);
  }

  getBlogPosts(page = 1, search = ''): Observable<PaginatedResponse<BlogPost>> {
    let params = new HttpParams().set('page', page.toString());
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<PaginatedResponse<BlogPost>>(`${this.apiUrl}/blog`, { params });
  }

  getBlogPostBySlug(slug: string): Observable<ApiResponse<BlogPost>> {
    return this.http.get<ApiResponse<BlogPost>>(`${this.apiUrl}/blog/${slug}`);
  }

  getBranches(): Observable<ApiResponse<Branch[]>> {
    return this.http.get<ApiResponse<Branch[]>>(`${this.apiUrl}/branches`);
  }

  getCertificates(): Observable<ApiResponse<Certificate[]>> {
    return this.http.get<ApiResponse<Certificate[]>>(`${this.apiUrl}/certificates`);
  }

  getSettings(): Observable<ApiResponse<SiteSettings>> {
    return this.http.get<ApiResponse<SiteSettings>>(`${this.apiUrl}/settings`);
  }

  submitInquiry(inquiry: Partial<Inquiry>): Observable<ApiResponse<Inquiry>> {
    return this.http.post<ApiResponse<Inquiry>>(`${this.apiUrl}/inquiries`, inquiry);
  }
}
