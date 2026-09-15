import { Component, computed, inject, OnInit, signal, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { I18nService } from '../../core/services/i18n.service';
import { ApiService } from '../../core/services/api.service';
import { Category, Product, Supplier, Crop, Pest } from '../../core/models/tapco.models';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { IconComponent } from '../../shared/components/icon.component';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [FormsModule, Select, ProductCardComponent, IconComponent],
  template: `
    <div class="products-page">
      <!-- Page Hero Header -->
      <section class="page-hero">
        <div class="tapco-container">
          <span class="badge-tag bronze">{{ i18n.t('catalog.title') }}</span>
          <h1 class="page-title">{{ i18n.t('catalog.title') }}</h1>
          <p class="page-subtitle">{{ i18n.t('catalog.subtitle') }}</p>
        </div>
      </section>

      <!-- Main Catalog Layout -->
      <section class="section-padding">
        <div class="tapco-container">
          <div class="catalog-layout">
            <!-- Filter Sidebar -->
            <aside class="catalog-sidebar" [class.mobile-open]="isFilterDrawerOpen()">
              <div class="sidebar-header">
                <div class="sidebar-title-row">
                  <app-icon name="filter" [size]="20" />
                  <h3>{{ i18n.t('catalog.filter_category') }}</h3>
                </div>
                <button class="close-filter-btn" (click)="isFilterDrawerOpen.set(false)">
                  <app-icon name="x" [size]="20" />
                </button>
              </div>

              <!-- Search Bar -->
              <div class="filter-group">
                <div class="search-input-wrap">
                  <app-icon name="search" [size]="18" class="search-icon" />
                  <input
                    type="text"
                    [(ngModel)]="searchQuery"
                    (keyup.enter)="applyFilters()"
                    [placeholder]="i18n.t('catalog.search_placeholder')"
                    class="search-input"
                  />
                </div>
              </div>

              <!-- Categories Filter -->
              <div class="filter-group">
                <h4 class="filter-heading">{{ i18n.t('catalog.filter_category') }}</h4>
                <div class="filter-options">
                  <button
                    class="filter-option-btn"
                    [class.active]="!selectedCategory()"
                    (click)="selectCategory('')"
                  >
                    <span>{{ i18n.t('catalog.all') }}</span>
                  </button>

                  @for (cat of categories(); track cat.id) {
                    <div class="cat-group">
                      <button
                        class="filter-option-btn parent-cat"
                        [class.active]="selectedCategory() === cat.slug"
                        (click)="selectCategory(cat.slug)"
                      >
                        <span>{{ i18n.getLocalized(cat, 'name') }}</span>
                        @if (cat.products_count) {
                          <span class="count-tag">{{ cat.products_count }}</span>
                        }
                      </button>

                      @if (cat.children && cat.children.length > 0) {
                        <div class="sub-filter-options">
                          @for (sub of cat.children; track sub.id) {
                            <button
                              class="filter-option-btn sub-cat"
                              [class.active]="selectedCategory() === sub.slug"
                              (click)="selectCategory(sub.slug)"
                            >
                              <span>{{ i18n.getLocalized(sub, 'name') }}</span>
                              @if (sub.products_count) {
                                <span class="count-tag">{{ sub.products_count }}</span>
                              }
                            </button>
                          }
                        </div>
                      }
                    </div>
                  }
                </div>
              </div>

              <!-- Crops Filter -->
              @if (crops().length > 0) {
                <div class="filter-group">
                  <h4 class="filter-heading">{{ i18n.t('catalog.filter_crop') }}</h4>
                  <p-select
                    [(ngModel)]="selectedCrop"
                    [options]="cropOptions()"
                    optionLabel="label"
                    optionValue="value"
                    (onChange)="applyFilters()"
                    styleClass="w-full filter-p-select"
                  />
                </div>
              }

              <!-- Pests Filter -->
              @if (pests().length > 0) {
                <div class="filter-group">
                  <h4 class="filter-heading">{{ i18n.t('catalog.filter_pest') }}</h4>
                  <p-select
                    [(ngModel)]="selectedPest"
                    [options]="pestOptions()"
                    optionLabel="label"
                    optionValue="value"
                    (onChange)="applyFilters()"
                    styleClass="w-full filter-p-select"
                  />
                </div>
              }

              <!-- Suppliers Filter -->
              @if (suppliers().length > 0) {
                <div class="filter-group">
                  <h4 class="filter-heading">{{ i18n.t('catalog.filter_supplier') }}</h4>
                  <p-select
                    [(ngModel)]="selectedSupplier"
                    [options]="supplierOptions()"
                    optionLabel="label"
                    optionValue="value"
                    (onChange)="applyFilters()"
                    styleClass="w-full filter-p-select"
                  />
                </div>
              }

              <!-- Clear Filters -->
              <button class="btn btn-outline reset-filter-btn" (click)="resetFilters()">
                <app-icon name="x" [size]="16" />
                <span>{{ i18n.t('catalog.clear_filters') }}</span>
              </button>
            </aside>

            <!-- Catalog Content Area -->
            <div class="catalog-content">
              <!-- Top Toolbar -->
              <div class="catalog-toolbar card-base">
                <div class="toolbar-left">
                  <button class="btn btn-outline mobile-filter-trigger" (click)="isFilterDrawerOpen.set(true)">
                    <app-icon name="filter" [size]="18" />
                    <span>{{ i18n.t('catalog.filter_category') }}</span>
                  </button>
                  <span class="results-count-text">
                    <strong>{{ totalCount() }}</strong> {{ i18n.t('catalog.results_count') }}
                  </span>
                </div>

                <div class="toolbar-right">
                  <label class="sort-label">{{ i18n.t('catalog.sort') }}:</label>
                  <p-select
                    [(ngModel)]="sortBy"
                    [options]="sortOptions()"
                    optionLabel="label"
                    optionValue="value"
                    (onChange)="applyFilters()"
                    styleClass="sort-p-select"
                  />
                </div>
              </div>

              <!-- Products Grid -->
              @if (isLoading()) {
                <div class="loading-box">
                  <div class="spinner"></div>
                  <p>{{ i18n.currentLang() === 'ar' ? 'جاري تحميل المنتجات الزراعية...' : 'Loading agrochemicals...' }}</p>
                </div>
              } @else if (products().length === 0) {
                <div class="empty-box card-base">
                  <app-icon name="sprout" [size]="56" class="empty-icon" />
                  <h3>{{ i18n.t('catalog.no_results') }}</h3>
                  <button class="btn btn-bronze" (click)="resetFilters()">
                    {{ i18n.t('catalog.clear_filters') }}
                  </button>
                </div>
              } @else {
                <div class="grid-cards">
                  @for (prod of products(); track prod.id) {
                    <app-product-card [product]="prod" />
                  }
                </div>

                <!-- Pagination -->
                @if (lastPage() > 1) {
                  <div class="pagination-bar">
                    <button
                      class="page-btn"
                      [disabled]="currentPage() === 1"
                      (click)="goToPage(currentPage() - 1)"
                    >
                      <app-icon [name]="i18n.isRtl() ? 'chevron-right' : 'chevron-left'" [size]="18" />
                    </button>

                    <span class="page-indicator">
                      {{ currentPage() }} / {{ lastPage() }}
                    </span>

                    <button
                      class="page-btn"
                      [disabled]="currentPage() === lastPage()"
                      (click)="goToPage(currentPage() + 1)"
                    >
                      <app-icon [name]="i18n.isRtl() ? 'chevron-left' : 'chevron-right'" [size]="18" />
                    </button>
                  </div>
                }
              }
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .page-hero {
      background: linear-gradient(135deg, var(--tapco-green-900) 0%, var(--tapco-green-800) 100%);
      color: #ffffff;
      padding: 4.5rem 0 3.5rem;
      border-bottom: 3px solid var(--tapco-bronze-500);
    }

    .page-title {
      font-size: clamp(2rem, 3.5vw, 2.75rem);
      font-weight: 800;
      margin: 0.75rem 0 0.5rem;
    }

    .page-subtitle {
      font-size: 1.1rem;
      color: #c9d8d1;
      max-width: 680px;
    }

    .catalog-layout {
      display: grid;
      grid-template-columns: 290px 1fr;
      gap: 2.5rem;
      align-items: flex-start;
    }

    /* Sidebar Filters */
    .catalog-sidebar {
      background: #ffffff;
      border: 1px solid var(--tapco-border);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      box-shadow: var(--shadow-sm);
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .sidebar-title-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--tapco-green-900);
      h3 { font-size: 1.15rem; font-weight: 700; }
    }

    .close-filter-btn {
      display: none;
      color: var(--tapco-text-muted);
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .filter-heading {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--tapco-green-900);
      border-bottom: 1px solid var(--tapco-border-subtle);
      padding-bottom: 0.35rem;
    }

    .search-input-wrap {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      right: 0.75rem;
      color: var(--tapco-text-light);
      pointer-events: none;
    }

    html[dir="ltr"] .search-icon {
      right: auto;
      left: 0.75rem;
    }

    .search-input {
      width: 100%;
      padding: 0.65rem 2.25rem 0.65rem 0.85rem;
      border: 1.5px solid var(--tapco-border);
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      background: var(--tapco-bg-page);
      transition: border-color 0.2s ease, box-shadow 0.2s ease;

      &:focus {
        outline: none;
        border-color: var(--tapco-green-700);
        box-shadow: 0 0 0 3px rgba(18, 67, 54, 0.1);
      }
    }

    html[dir="ltr"] .search-input {
      padding: 0.65rem 0.85rem 0.65rem 2.25rem;
    }

    .filter-options {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .filter-option-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      text-align: start;
      padding: 0.5rem 0.65rem;
      border-radius: var(--radius-sm);
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--tapco-text-main);
      transition: background 0.15s ease, color 0.15s ease;

      &:hover {
        background: var(--tapco-green-50);
        color: var(--tapco-green-800);
      }

      &.active {
        background: var(--tapco-green-700);
        color: #ffffff;
        font-weight: 700;
        .count-tag {
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }
      }
    }

    .sub-filter-options {
      padding-inline-start: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin-top: 0.25rem;
    }

    .count-tag {
      font-size: 0.75rem;
      padding: 0.15rem 0.45rem;
      border-radius: var(--radius-full);
      background: var(--tapco-bg-muted);
      color: var(--tapco-text-muted);
    }

    .filter-select {
      width: 100%;
      padding: 0.6rem 0.75rem;
      border: 1.5px solid var(--tapco-border);
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      background: #ffffff;
      color: var(--tapco-text-main);

      &:focus {
        outline: none;
        border-color: var(--tapco-green-700);
      }
    }

    .reset-filter-btn {
      width: 100%;
      font-size: 0.85rem;
      margin-top: 0.5rem;
    }

    /* Catalog Content Area */
    .catalog-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .catalog-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 1.25rem;
      border-radius: var(--radius-md);
      background: #ffffff;
    }

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .mobile-filter-trigger {
      display: none;
      font-size: 0.85rem;
      padding: 0.45rem 0.85rem;
    }

    .results-count-text {
      font-size: 0.9rem;
      color: var(--tapco-text-muted);
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .sort-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--tapco-text-muted);
    }

    .sort-select {
      padding: 0.4rem 0.75rem;
      border: 1px solid var(--tapco-border);
      border-radius: var(--radius-sm);
      font-size: 0.85rem;
      background: #ffffff;
    }

    .loading-box, .empty-box {
      padding: 4rem 2rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .spinner {
      width: 44px;
      height: 44px;
      border: 3.5px solid var(--tapco-border);
      border-top-color: var(--tapco-green-700);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .empty-icon {
      color: var(--tapco-bronze-500);
    }

    .pagination-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-top: 2rem;
    }

    .page-btn {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      border: 1px solid var(--tapco-border);
      background: #ffffff;
      color: var(--tapco-green-900);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;

      &:hover:not(:disabled) {
        background: var(--tapco-green-700);
        color: #ffffff;
        border-color: var(--tapco-green-700);
      }

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
    }

    .page-indicator {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--tapco-text-muted);
    }

    @media (max-width: 991px) {
      .catalog-layout {
        grid-template-columns: 1fr;
      }

      .mobile-filter-trigger {
        display: inline-flex;
      }

      .catalog-sidebar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2000;
        border-radius: 0;
        display: none;
        overflow-y: auto;

        &.mobile-open {
          display: flex;
        }
      }

      .close-filter-btn {
        display: block;
      }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class ProductsListComponent implements OnInit {
  readonly i18n = inject(I18nService);
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly products = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly crops = signal<Crop[]>([]);
  readonly pests = signal<Pest[]>([]);
  readonly suppliers = signal<Supplier[]>([]);

  readonly isLoading = signal(false);
  readonly isFilterDrawerOpen = signal(false);
  readonly totalCount = signal(0);
  readonly currentPage = signal(1);
  readonly lastPage = signal(1);

  searchQuery = '';
  readonly selectedCategory = signal('');
  selectedCrop = '';
  selectedPest = '';
  selectedSupplier = '';
  sortBy = 'order';

  readonly cropOptions = computed(() => [
    { label: this.i18n.t('catalog.all'), value: '' },
    ...this.crops().map(c => ({ label: this.i18n.getLocalized(c, 'name'), value: c.slug }))
  ]);

  readonly pestOptions = computed(() => [
    { label: this.i18n.t('catalog.all'), value: '' },
    ...this.pests().map(p => ({ label: this.i18n.getLocalized(p, 'name'), value: p.slug }))
  ]);

  readonly supplierOptions = computed(() => [
    { label: this.i18n.t('catalog.all'), value: '' },
    ...this.suppliers().map(s => ({ label: s.name, value: s.name }))
  ]);

  readonly sortOptions = computed(() => [
    { label: this.i18n.t('catalog.sort_order'), value: 'order' },
    { label: this.i18n.t('catalog.sort_latest'), value: 'latest' },
    { label: this.i18n.t('catalog.sort_popular'), value: 'popular' }
  ]);

  ngOnInit(): void {
    // Load filter options
    this.api.getCategories().subscribe(res => res?.data && this.categories.set(res.data));
    this.api.getCrops().subscribe(res => res?.data && this.crops.set(res.data));
    this.api.getPests().subscribe(res => res?.data && this.pests.set(res.data));
    this.api.getSuppliers().subscribe(res => res?.data && this.suppliers.set(res.data));

    // Listen to query parameters
    this.route.queryParams.subscribe(params => {
      this.selectedCategory.set(params['category'] || '');
      this.selectedCrop = params['crop'] || '';
      this.selectedPest = params['pest'] || '';
      this.selectedSupplier = params['supplier'] || '';
      this.searchQuery = params['search'] || '';
      this.sortBy = params['sort'] || 'order';
      this.currentPage.set(parseInt(params['page'] || '1', 10));

      this.fetchProducts();
    });
  }

  fetchProducts(): void {
    this.isLoading.set(true);
    this.api.getProducts({
      category: this.selectedCategory(),
      crop: this.selectedCrop,
      pest: this.selectedPest,
      supplier: this.selectedSupplier,
      search: this.searchQuery,
      sort: this.sortBy,
      page: this.currentPage(),
      per_page: 12,
    }).subscribe({
      next: (res) => {
        this.products.set(res.data || []);
        if (res.meta) {
          this.totalCount.set(res.meta.total);
          this.currentPage.set(res.meta.current_page);
          this.lastPage.set(res.meta.last_page);
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  selectCategory(slug: string): void {
    this.selectedCategory.set(slug);
    this.applyFilters(1);
  }

  applyFilters(page = 1): void {
    this.isFilterDrawerOpen.set(false);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        category: this.selectedCategory() || null,
        crop: this.selectedCrop || null,
        pest: this.selectedPest || null,
        supplier: this.selectedSupplier || null,
        search: this.searchQuery || null,
        sort: this.sortBy === 'order' ? null : this.sortBy,
        page: page > 1 ? page : null,
      },
      queryParamsHandling: 'merge',
    });
  }

  resetFilters(): void {
    this.selectedCategory.set('');
    this.selectedCrop = '';
    this.selectedPest = '';
    this.selectedSupplier = '';
    this.searchQuery = '';
    this.sortBy = 'order';
    this.applyFilters(1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.lastPage()) {
      this.applyFilters(page);
    }
  }
}
