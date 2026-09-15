export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  message?: string;
}

export interface Role {
  id: number;
  name: string;
  permissions?: string[];
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role?: string | Role;
  role_id?: number;
  permissions?: string[];
  is_active?: boolean;
}

export interface DashboardStats {
  counts: {
    products: number;
    active_products: number;
    categories: number;
    suppliers: number;
    articles: number;
    inquiries_total: number;
    inquiries_new: number;
    inquiries_week: number;
  };
  recent_inquiries: Inquiry[];
  recent_products: Product[];
  recent_activities: ActivityLog[];
}

export interface Category {
  id: number;
  name_ar: string;
  name_en: string;
  slug: string;
  parent_id?: number | null;
  icon?: string | null;
  image?: string | null;
  image_url?: string | null;
  order: number;
  products_count?: number;
  children?: Category[];
  parent?: Category;
}

export interface Supplier {
  id: number;
  name: string;
  logo?: string | null;
  logo_url?: string | null;
  website?: string | null;
  order: number;
  products_count?: number;
}

export interface Crop {
  id: number;
  name_ar: string;
  name_en: string;
  slug: string;
  image?: string | null;
  image_url?: string | null;
  products_count?: number;
}

export interface Pest {
  id: number;
  name_ar: string;
  name_en: string;
  slug: string;
  type: string;
  image?: string | null;
  image_url?: string | null;
  products_count?: number;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image: string;
  image_url?: string;
  order: number;
}

export interface Product {
  id: number;
  category_id: number;
  supplier_id?: number | null;
  name_ar: string;
  name_en: string;
  slug: string;
  active_ingredient_ar?: string | null;
  active_ingredient_en?: string | null;
  concentration?: string | null;
  formulation_code?: string | null;
  chemical_group_ar?: string | null;
  chemical_group_en?: string | null;
  description_ar?: string | null;
  description_en?: string | null;
  usage_instructions_ar?: string | null;
  usage_instructions_en?: string | null;
  pre_harvest_interval?: number | null;
  toxicity_class?: string | null;
  hazard_signal_word_ar?: string | null;
  hazard_signal_word_en?: string | null;
  packaging_sizes?: string | null;
  main_image?: string | null;
  main_image_url?: string | null;
  datasheet_pdf?: string | null;
  datasheet_pdf_url?: string | null;
  msds_pdf?: string | null;
  msds_pdf_url?: string | null;
  is_featured: boolean;
  is_active: boolean;
  views_count: number;
  order: number;
  created_at?: string;
  category?: Category;
  supplier?: Supplier;
  crops?: Crop[];
  pests?: Pest[];
  images?: ProductImage[];
}

export interface BlogPost {
  id: number;
  title_ar: string;
  title_en: string;
  slug: string;
  excerpt_ar?: string | null;
  excerpt_en?: string | null;
  content_ar: string;
  content_en: string;
  cover_image?: string | null;
  cover_image_url?: string | null;
  author_name: string;
  published_at?: string | null;
  is_published: boolean;
  meta_title_ar?: string | null;
  meta_title_en?: string | null;
  meta_description_ar?: string | null;
  meta_description_en?: string | null;
}

export interface Branch {
  id: number;
  name_ar: string;
  name_en: string;
  address_ar: string;
  address_en: string;
  phone: string;
  whatsapp?: string | null;
  working_hours_ar?: string | null;
  working_hours_en?: string | null;
  lat?: number | null;
  lng?: number | null;
  order: number;
}

export interface Certificate {
  id: number;
  title_ar: string;
  title_en: string;
  image: string;
  image_url?: string;
  order: number;
}

export interface Inquiry {
  id: number;
  name: string;
  phone: string;
  email?: string | null;
  product_id?: number | null;
  message: string;
  source: string;
  status: 'new' | 'contacted' | 'closed';
  admin_note?: string | null;
  created_at: string;
  product?: Product;
}

export interface ActivityLog {
  id: number;
  admin_user_id?: number;
  action: string;
  model_type?: string | null;
  model_id?: string | null;
  details?: string | null;
  created_at: string;
  admin_user?: AdminUser;
}

export interface SiteSettings {
  [key: string]: {
    ar: string;
    en: string;
    type?: string;
  };
}
