import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../core/services/i18n.service';
import { ApiService } from '../../core/services/api.service';
import { Product } from '../../core/models/tapco.models';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { IconComponent } from '../../shared/components/icon.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, FormsModule, ProductCardComponent, IconComponent],
  template: `
    @if (isLoading()) {
      <div class="loading-container">
        <div class="spinner"></div>
        <p>{{ i18n.currentLang() === 'ar' ? 'جاري تحميل تفاصيل المنتج...' : 'Loading product details...' }}</p>
      </div>
    } @else if (!product()) {
      <div class="tapco-container section-padding">
        <div class="not-found-card card-base">
          <h2>{{ i18n.currentLang() === 'ar' ? 'عذرًا، لم يتم العثور على هذا المنتج' : 'Product Not Found' }}</h2>
          <a routerLink="/products" class="btn btn-bronze">{{ i18n.t('hero.cta_products') }}</a>
        </div>
      </div>
    } @else {
      <div class="product-detail-page">
        <!-- Breadcrumbs bar -->
        <div class="breadcrumbs-bar">
          <div class="tapco-container">
            <nav class="breadcrumb-nav">
              <a routerLink="/">{{ i18n.t('nav.home') }}</a>
              <span class="sep">/</span>
              <a routerLink="/products">{{ i18n.t('nav.products') }}</a>
              @if (product()?.category) {
                <span class="sep">/</span>
                <a [routerLink]="['/products']" [queryParams]="{category: product()!.category!.slug}">
                  {{ i18n.getLocalized(product()!.category, 'name') }}
                </a>
              }
              <span class="sep">/</span>
              <span class="current">{{ i18n.getLocalized(product()!, 'name') }}</span>
            </nav>
          </div>
        </div>

        <section class="section-padding">
          <div class="tapco-container">
            <div class="product-main-grid">
              <!-- Left: Image Gallery -->
              <div class="gallery-col">
                <div class="main-preview-box card-base">
                  @if (selectedImage()) {
                    <img [src]="selectedImage()!" [alt]="i18n.getLocalized(product()!, 'name')" class="preview-img" />
                  } @else {
                    <div class="preview-placeholder">
                      <app-icon name="sprout" [size]="72" class="placeholder-icon" />
                      <span class="formula-label">{{ product()!.formulation_code || 'TAPCO' }}</span>
                    </div>
                  }
                </div>

                <!-- Gallery Thumbnails -->
                @if (product()!.images && product()!.images!.length > 0) {
                  <div class="thumbnails-row">
                    @if (product()!.main_image_url) {
                      <button
                        class="thumb-btn"
                        [class.active]="selectedImage() === product()!.main_image_url"
                        (click)="selectedImage.set(product()!.main_image_url!)"
                      >
                        <img [src]="product()!.main_image_url!" alt="Thumb" />
                      </button>
                    }
                    @for (img of product()!.images!; track img.id) {
                      <button
                        class="thumb-btn"
                        [class.active]="selectedImage() === img.image_url"
                        (click)="selectedImage.set(img.image_url!)"
                      >
                        <img [src]="img.image_url!" alt="Thumb" />
                      </button>
                    }
                  </div>
                }
              </div>

              <!-- Right: Specs & Actions -->
              <div class="info-col">
                <div class="info-badges-row">
                  @if (product()!.category) {
                    <span class="badge-tag green">
                      {{ i18n.getLocalized(product()!.category, 'name') }}
                    </span>
                  }
                  @if (product()!.formulation_code) {
                    <span class="formulation-badge">
                      {{ product()!.formulation_code }}
                    </span>
                  }
                  @if (product()!.toxicity_class) {
                    <span class="badge-tag tox-badge-{{ product()!.toxicity_class }}">
                      {{ i18n.t('product.toxicity') }}: Class {{ product()!.toxicity_class }}
                    </span>
                  }
                </div>

                <h1 class="product-headline">{{ i18n.getLocalized(product()!, 'name') }}</h1>

                @if (product()!.supplier) {
                  <p class="supplier-label">
                    <span>{{ i18n.t('catalog.filter_supplier') }}:</span>
                    <strong>{{ product()!.supplier!.name }}</strong>
                  </p>
                }

                <!-- Key Specifications Table -->
                <div class="specs-grid card-base">
                  @if (product()!.active_ingredient_ar || product()!.active_ingredient_en) {
                    <div class="spec-cell">
                      <span class="cell-label">{{ i18n.t('product.active_ingredient') }}</span>
                      <span class="cell-value highlight">{{ i18n.getLocalized(product()!, 'active_ingredient') }}</span>
                    </div>
                  }
                  @if (product()!.concentration) {
                    <div class="spec-cell">
                      <span class="cell-label">{{ i18n.t('product.concentration') }}</span>
                      <span class="cell-value">{{ product()!.concentration }}</span>
                    </div>
                  }
                  @if (product()!.chemical_group_ar || product()!.chemical_group_en) {
                    <div class="spec-cell">
                      <span class="cell-label">{{ i18n.t('product.chemical_group') }}</span>
                      <span class="cell-value">{{ i18n.getLocalized(product()!, 'chemical_group') }}</span>
                    </div>
                  }
                  @if (product()!.pre_harvest_interval !== null && product()!.pre_harvest_interval !== undefined) {
                    <div class="spec-cell">
                      <span class="cell-label">{{ i18n.t('product.phi') }}</span>
                      <span class="cell-value warning-text">{{ product()!.pre_harvest_interval }} {{ i18n.t('product.days') }}</span>
                    </div>
                  }
                  @if (product()!.hazard_signal_word_ar || product()!.hazard_signal_word_en) {
                    <div class="spec-cell">
                      <span class="cell-label">{{ i18n.t('product.hazard_word') }}</span>
                      <span class="cell-value danger-text">{{ i18n.getLocalized(product()!, 'hazard_signal_word') }}</span>
                    </div>
                  }
                  @if (product()!.packaging_sizes) {
                    <div class="spec-cell">
                      <span class="cell-label">{{ i18n.t('product.packaging') }}</span>
                      <span class="cell-value">{{ product()!.packaging_sizes }}</span>
                    </div>
                  }
                </div>

                <!-- Call to actions -->
                <div class="actions-block">
                  <button class="btn btn-bronze quote-trigger-btn" (click)="isQuoteModalOpen.set(true)">
                    <app-icon name="mail" [size]="18" />
                    <span>{{ i18n.t('product.request_quote') }}</span>
                  </button>

                  <a
                    [href]="getWhatsAppLink()"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn btn-whatsapp"
                  >
                    <app-icon name="message-circle" [size]="18" />
                    <span>{{ i18n.t('product.whatsapp_inquiry') }}</span>
                  </a>
                </div>

                <!-- PDF Downloads -->
                @if (product()!.datasheet_pdf_url || product()!.msds_pdf_url) {
                  <div class="pdf-downloads-row">
                    @if (product()!.datasheet_pdf_url) {
                      <a [href]="product()!.datasheet_pdf_url" target="_blank" download class="btn btn-outline pdf-btn">
                        <app-icon name="download" [size]="16" />
                        <span>{{ i18n.t('product.download_datasheet') }}</span>
                      </a>
                    }
                    @if (product()!.msds_pdf_url) {
                      <a [href]="product()!.msds_pdf_url" target="_blank" download class="btn btn-outline pdf-btn">
                        <app-icon name="download" [size]="16" />
                        <span>{{ i18n.t('product.download_msds') }}</span>
                      </a>
                    }
                  </div>
                }
              </div>
            </div>

            <!-- Details Tabs / Sections -->
            <div class="product-description-section">
              <!-- Description -->
              @if (product()!.description_ar || product()!.description_en) {
                <div class="content-block card-base">
                  <h3 class="block-title">{{ i18n.t('product.description') }}</h3>
                  <p class="block-text">{{ i18n.getLocalized(product()!, 'description') }}</p>
                </div>
              }

              <!-- Usage instructions -->
              @if (product()!.usage_instructions_ar || product()!.usage_instructions_en) {
                <div class="content-block card-base">
                  <h3 class="block-title">{{ i18n.t('product.usage') }}</h3>
                  <p class="block-text">{{ i18n.getLocalized(product()!, 'usage_instructions') }}</p>
                </div>
              }

              <!-- Suitable Crops Table -->
              @if (product()!.crops && product()!.crops!.length > 0) {
                <div class="content-block card-base">
                  <h3 class="block-title">{{ i18n.t('product.crops_table') }}</h3>
                  <div class="table-responsive">
                    <table class="data-table">
                      <thead>
                        <tr>
                          <th>{{ i18n.t('product.crop') }}</th>
                          <th>{{ i18n.t('product.dosage_note') }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (crop of product()!.crops!; track crop.id) {
                          <tr>
                            <td class="font-bold">{{ i18n.getLocalized(crop, 'name') }}</td>
                            <td>{{ i18n.getLocalized(crop.pivot, 'dosage_note') || (i18n.currentLang() === 'ar' ? 'حسب توصيات النشرة الفنية' : 'Follow standard label guidelines') }}</td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              }

              <!-- Target Pests Table -->
              @if (product()!.pests && product()!.pests!.length > 0) {
                <div class="content-block card-base">
                  <h3 class="block-title">{{ i18n.t('product.pests_table') }}</h3>
                  <div class="table-responsive">
                    <table class="data-table">
                      <thead>
                        <tr>
                          <th>{{ i18n.t('product.pest') }}</th>
                          <th>{{ i18n.t('product.pest_type') }}</th>
                        </tr>
                      </thead>
                      <tbody>
                        @for (pest of product()!.pests!; track pest.id) {
                          <tr>
                            <td class="font-bold">{{ i18n.getLocalized(pest, 'name') }}</td>
                            <td>
                              <span class="badge-tag green">{{ pest.type }}</span>
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              }
            </div>

            <!-- Related Products -->
            @if (product()!.related_products && product()!.related_products!.length > 0) {
              <div class="related-products-section">
                <h3 class="section-title text-center">{{ i18n.t('product.related') }}</h3>
                <div class="grid-cards" style="margin-top: 2rem;">
                  @for (rel of product()!.related_products!; track rel.id) {
                    <app-product-card [product]="rel" />
                  }
                </div>
              </div>
            }
          </div>
        </section>

        <!-- Quote Modal -->
        @if (isQuoteModalOpen()) {
          <div class="modal-backdrop" (click)="isQuoteModalOpen.set(false)">
            <div class="modal-dialog card-base" (click)="$event.stopPropagation()">
              <div class="modal-header">
                <h3>{{ i18n.t('modal.quote_title') }}</h3>
                <button class="close-modal-btn" (click)="isQuoteModalOpen.set(false)">
                  <app-icon name="x" [size]="22" />
                </button>
              </div>

              @if (quoteSuccess()) {
                <div class="modal-success-alert">
                  <app-icon name="check" [size]="24" />
                  <p>{{ i18n.t('modal.success') }}</p>
                  <button class="btn btn-primary" (click)="isQuoteModalOpen.set(false); quoteSuccess.set(false)">
                    {{ i18n.t('modal.close') }}
                  </button>
                </div>
              } @else {
                <form (submit)="submitQuote($event)" class="modal-form">
                  <div class="modal-prod-summary">
                    <span class="sm-label">{{ i18n.t('modal.quote_product') }}:</span>
                    <strong>{{ i18n.getLocalized(product()!, 'name') }}</strong>
                  </div>

                  <div class="form-row">
                    <label>{{ i18n.t('contact.name') }} *</label>
                    <input type="text" [(ngModel)]="quoteForm.name" name="name" required class="form-input" />
                  </div>

                  <div class="form-row">
                    <label>{{ i18n.t('contact.phone') }} *</label>
                    <input type="tel" [(ngModel)]="quoteForm.phone" name="phone" required class="form-input" />
                  </div>

                  <div class="form-row">
                    <label>{{ i18n.t('contact.email') }}</label>
                    <input type="email" [(ngModel)]="quoteForm.email" name="email" class="form-input" />
                  </div>

                  <div class="form-row">
                    <label>{{ i18n.t('contact.message') }} *</label>
                    <textarea [(ngModel)]="quoteForm.message" name="message" rows="3" required class="form-input"></textarea>
                  </div>

                  @if (quoteError()) {
                    <p class="error-text">{{ quoteError() }}</p>
                  }

                  <button type="submit" [disabled]="isSubmittingQuote()" class="btn btn-bronze" style="width: 100%;">
                    <span>{{ isSubmittingQuote() ? i18n.t('contact.submitting') : i18n.t('modal.submit') }}</span>
                  </button>
                </form>
              }
            </div>
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .loading-container {
      padding: 6rem 2rem;
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

    .breadcrumbs-bar {
      background: #f4f7f5;
      padding: 0.85rem 0;
      border-bottom: 1px solid var(--tapco-border);
      font-size: 0.875rem;
    }

    .breadcrumb-nav {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
      color: var(--tapco-text-muted);

      a:hover {
        color: var(--tapco-green-700);
      }

      .current {
        color: var(--tapco-green-900);
        font-weight: 600;
      }
    }

    .product-main-grid {
      display: grid;
      grid-template-columns: 1fr 1.3fr;
      gap: 3.5rem;
      align-items: flex-start;
      margin-bottom: 4rem;
    }

    .main-preview-box {
      aspect-ratio: 4 / 3;
      background: #fcfdfc;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .preview-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .preview-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      color: var(--tapco-green-700);
    }

    .formula-label {
      font-family: var(--font-latin);
      font-weight: 800;
      font-size: 1.1rem;
      background: var(--tapco-green-100);
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-sm);
    }

    .thumbnails-row {
      display: flex;
      gap: 0.75rem;
      margin-top: 1rem;
      overflow-x: auto;
      padding-bottom: 0.5rem;
    }

    .thumb-btn {
      width: 72px;
      height: 72px;
      border-radius: var(--radius-sm);
      border: 2px solid var(--tapco-border);
      overflow: hidden;
      flex-shrink: 0;
      background: #ffffff;
      transition: border-color 0.2s ease;

      &.active, &:hover {
        border-color: var(--tapco-green-700);
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .info-col {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .info-badges-row {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      flex-wrap: wrap;
    }

    .product-headline {
      font-size: clamp(1.75rem, 2.75vw, 2.35rem);
      font-weight: 800;
      color: var(--tapco-green-900);
      line-height: 1.25;
    }

    .supplier-label {
      font-size: 0.95rem;
      color: var(--tapco-text-muted);
      strong { color: var(--tapco-green-900); margin-inline-start: 0.35rem; }
    }

    .specs-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      padding: 1.25rem;
      gap: 1.25rem;
      background: #fbfdfc;
    }

    .spec-cell {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .cell-label {
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--tapco-text-light);
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .cell-value {
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--tapco-text-main);

      &.highlight {
        color: var(--tapco-green-800);
      }
      &.warning-text {
        color: #b45309;
      }
      &.danger-text {
        color: #dc2626;
      }
    }

    .actions-block {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
      margin-top: 0.5rem;
    }

    .quote-trigger-btn {
      padding: 0.75rem 1.5rem;
      font-size: 0.95rem;
    }

    .pdf-downloads-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
      padding-top: 0.75rem;
      border-top: 1px solid var(--tapco-border-subtle);
    }

    .pdf-btn {
      font-size: 0.825rem;
      padding: 0.45rem 0.85rem;
    }

    /* Content Blocks */
    .product-description-section {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      margin-bottom: 4rem;
    }

    .content-block {
      padding: 2rem;
    }

    .block-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--tapco-green-900);
      margin-bottom: 1rem;
      position: relative;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid var(--tapco-border-subtle);
    }

    .block-text {
      font-size: 1rem;
      line-height: 1.8;
      color: var(--tapco-text-main);
      white-space: pre-line;
    }

    /* Data Table */
    .table-responsive {
      overflow-x: auto;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.925rem;
      text-align: start;

      th, td {
        padding: 0.85rem 1rem;
        border-bottom: 1px solid var(--tapco-border-subtle);
      }

      th {
        background: var(--tapco-bg-muted);
        color: var(--tapco-green-900);
        font-weight: 700;
      }

      .font-bold {
        font-weight: 700;
        color: var(--tapco-green-900);
      }
    }

    /* Modal */
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 3000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }

    .modal-dialog {
      width: 100%;
      max-width: 500px;
      padding: 2rem;
      background: #ffffff;
      box-shadow: var(--shadow-lg);
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.25rem;
      h3 { font-size: 1.25rem; color: var(--tapco-green-900); }
    }

    .close-modal-btn {
      color: var(--tapco-text-muted);
    }

    .modal-prod-summary {
      background: var(--tapco-green-50);
      padding: 0.75rem 1rem;
      border-radius: var(--radius-sm);
      margin-bottom: 1.25rem;
      font-size: 0.9rem;
      color: var(--tapco-green-900);
    }

    .modal-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-row {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;

      label {
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--tapco-text-main);
      }
    }

    .form-input {
      padding: 0.65rem 0.85rem;
      border: 1.5px solid var(--tapco-border);
      border-radius: var(--radius-md);
      font-size: 0.9rem;
      &:focus {
        outline: none;
        border-color: var(--tapco-green-700);
      }
    }

    .modal-success-alert {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem 0;
      color: var(--tapco-success);
    }

    .error-text {
      color: var(--tapco-danger);
      font-size: 0.85rem;
    }

    @media (max-width: 991px) {
      .product-main-grid {
        grid-template-columns: 1fr;
      }
      .specs-grid {
        grid-template-columns: 1fr;
      }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  readonly i18n = inject(I18nService);
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);

  readonly product = signal<Product | null>(null);
  readonly selectedImage = signal<string | null>(null);
  readonly isLoading = signal(true);

  // Quote modal
  readonly isQuoteModalOpen = signal(false);
  readonly isSubmittingQuote = signal(false);
  readonly quoteSuccess = signal(false);
  readonly quoteError = signal('');

  quoteForm = {
    name: '',
    phone: '',
    email: '',
    message: '',
  };

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.loadProduct(slug);
      }
    });
  }

  loadProduct(slug: string): void {
    this.isLoading.set(true);
    this.api.getProductBySlug(slug).subscribe({
      next: (res) => {
        if (res.data) {
          this.product.set(res.data);
          this.selectedImage.set(res.data.main_image_url || null);
          this.quoteForm.message = this.i18n.currentLang() === 'ar'
            ? `السلام عليكم، أود الاستفسار وطلب عرض سعر لمنتج (${res.data.name_ar}). الكمية المطلوبة: `
            : `Hello, I would like to request a price quotation for (${res.data.name_en}). Required quantity: `;
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.product.set(null);
        this.isLoading.set(false);
      }
    });
  }

  getWhatsAppLink(): string {
    const prod = this.product();
    if (!prod) return 'https://wa.me/201012345678';
    const prodName = this.i18n.getLocalized(prod, 'name');
    const msg = this.i18n.currentLang() === 'ar'
      ? `مرحبًا TAPCO، أود الاستفسار عن منتج: ${prodName}`
      : `Hello TAPCO, I would like to inquire about product: ${prodName}`;
    return `https://wa.me/201012345678?text=${encodeURIComponent(msg)}`;
  }

  submitQuote(e: Event): void {
    e.preventDefault();
    if (!this.quoteForm.name || !this.quoteForm.phone) return;

    this.isSubmittingQuote.set(true);
    this.quoteError.set('');

    this.api.submitInquiry({
      name: this.quoteForm.name,
      phone: this.quoteForm.phone,
      email: this.quoteForm.email || null,
      product_id: this.product()?.id,
      message: this.quoteForm.message,
      source: 'product_page',
    }).subscribe({
      next: () => {
        this.isSubmittingQuote.set(false);
        this.quoteSuccess.set(true);
      },
      error: (err) => {
        this.isSubmittingQuote.set(false);
        this.quoteError.set(err?.error?.message || 'Failed to submit quote request. Please try again.');
      }
    });
  }
}
