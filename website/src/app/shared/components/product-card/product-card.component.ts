import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../core/models/tapco.models';
import { I18nService } from '../../../core/services/i18n.service';
import { IconComponent } from '../icon.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink, IconComponent],
  template: `
    <div class="product-card card-base">
      <!-- Card Image & Badges Header -->
      <div class="card-media">
        <a [routerLink]="['/products', product.slug]" class="media-link">
          @if (product.main_image_url) {
            <img [src]="product.main_image_url" [alt]="i18n.getLocalized(product, 'name')" loading="lazy" class="product-img" />
          } @else {
            <div class="product-placeholder">
              <div class="chemical-glyph">
                <app-icon name="sprout" [size]="48" class="glyph-icon" />
                <span class="formula-code">{{ product.formulation_code || 'TAPCO' }}</span>
              </div>
            </div>
          }
        </a>

        <!-- Top Badges Overlay -->
        <div class="media-badges">
          @if (product.category) {
            <span class="badge-tag green">
              {{ i18n.getLocalized(product.category, 'name') }}
            </span>
          }
          @if (product.is_featured) {
            <span class="badge-tag bronze">
              ★ {{ i18n.currentLang() === 'ar' ? 'مميز' : 'Featured' }}
            </span>
          }
        </div>
      </div>

      <!-- Card Body -->
      <div class="card-body">
        <div class="title-row">
          <h3 class="product-title">
            <a [routerLink]="['/products', product.slug]">
              {{ i18n.getLocalized(product, 'name') }}
            </a>
          </h3>
          @if (product.formulation_code) {
            <span class="formulation-badge">{{ product.formulation_code }}</span>
          }
        </div>

        @if (product.active_ingredient_ar || product.active_ingredient_en) {
          <p class="active-ingredient">
            <span class="ai-label">{{ i18n.t('product.active_ingredient') }}:</span>
            <span class="ai-val">{{ i18n.getLocalized(product, 'active_ingredient') }}</span>
          </p>
        }

        <!-- Key specs tags -->
        <div class="specs-tags">
          @if (product.concentration) {
            <span class="spec-pill">
              {{ product.concentration }}
            </span>
          }
          @if (product.pre_harvest_interval !== null && product.pre_harvest_interval !== undefined) {
            <span class="spec-pill phi">
              PHI: {{ product.pre_harvest_interval }} {{ i18n.t('product.days') }}
            </span>
          }
          @if (product.toxicity_class) {
            <span class="spec-pill tox-badge-{{ product.toxicity_class }}">
              Class {{ product.toxicity_class }}
            </span>
          }
        </div>
      </div>

      <!-- Card Footer -->
      <div class="card-footer">
        <a [routerLink]="['/products', product.slug]" class="btn btn-primary card-cta-btn">
          <span>{{ i18n.t('catalog.details') }}</span>
          <app-icon [name]="i18n.isRtl() ? 'arrow-left' : 'arrow-right'" [size]="16" />
        </a>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      height: 100%;
      background: #ffffff;
    }

    .card-media {
      position: relative;
      background: #f7faf8;
      border-bottom: 1px solid var(--tapco-border-subtle);
      aspect-ratio: 4 / 3;
      overflow: hidden;
    }

    .media-link {
      display: block;
      width: 100%;
      height: 100%;
    }

    .product-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .product-card:hover .product-img {
      transform: scale(1.05);
    }

    .product-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: radial-gradient(circle, #eaf3ef 0%, #d8eae1 100%);
    }

    .chemical-glyph {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      color: var(--tapco-green-700);

      .formula-code {
        font-family: var(--font-latin);
        font-weight: 800;
        font-size: 0.85rem;
        letter-spacing: 0.1em;
        background: rgba(18, 67, 54, 0.1);
        padding: 0.15rem 0.5rem;
        border-radius: var(--radius-sm);
      }
    }

    .media-badges {
      position: absolute;
      top: 0.75rem;
      left: 0.75rem;
      right: 0.75rem;
      display: flex;
      justify-content: space-between;
      pointer-events: none;
    }

    .card-body {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      flex: 1;
    }

    .title-row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 0.5rem;
    }

    .product-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--tapco-green-900);
      line-height: 1.35;

      a {
        color: inherit;
        &:hover {
          color: var(--tapco-bronze-600);
        }
      }
    }

    .active-ingredient {
      font-size: 0.85rem;
      line-height: 1.4;
      color: var(--tapco-text-muted);

      .ai-label {
        font-weight: 600;
        margin-inline-end: 0.35rem;
      }
    }

    .specs-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-top: auto;
    }

    .spec-pill {
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.2rem 0.55rem;
      border-radius: var(--radius-sm);
      background: var(--tapco-bg-muted);
      color: var(--tapco-text-muted);
      border: 1px solid var(--tapco-border);

      &.phi {
        background: #fef3c7;
        color: #92400e;
        border-color: #fde68a;
      }
    }

    .card-footer {
      padding: 0.75rem 1.25rem 1.25rem;
      border-top: 1px solid var(--tapco-border-subtle);
    }

    .card-cta-btn {
      width: 100%;
      padding: 0.6rem 1rem;
      font-size: 0.875rem;
    }
  `]
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  readonly i18n = inject(I18nService);
}
