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
    <div class="product-card">
      <!-- Card Media Frame -->
      <div class="card-media">
        <a [routerLink]="['/products', product.slug]" class="media-link">
          <img
            [src]="product.main_image_url || '/images/product-bottle.jpg'"
            [alt]="i18n.getLocalized(product, 'name')"
            loading="lazy"
            class="product-img"
          />
        </a>

        <!-- Top Badges Overlay -->
        <div class="media-badges">
          @if (product.category) {
            <span class="cat-pill">
              <app-icon name="leaf" [size]="11" class="pill-icon" />
              <span>{{ i18n.getLocalized(product.category, 'name') }}</span>
            </span>
          } @else {
            <span></span>
          }
          @if (product.is_featured) {
            <span class="featured-badge">
              ★ {{ i18n.currentLang() === 'ar' ? 'مميز' : 'Featured' }}
            </span>
          }
        </div>
      </div>

      <!-- Card Body -->
      <div class="card-body">
        <!-- Category Eyebrow -->
        @if (product.category) {
          <span class="category-eyebrow">
            {{ i18n.getLocalized(product.category, 'name') }}
          </span>
        }

        <!-- Product Title -->
        <h3 class="product-title">
          <a [routerLink]="['/products', product.slug]">
            {{ i18n.getLocalized(product, 'name') }}
          </a>
        </h3>

        <!-- Active Ingredient Block -->
        @if (product.active_ingredient_ar || product.active_ingredient_en) {
          <div class="active-ingredient-card">
            <span class="ai-label">{{ i18n.t('product.active_ingredient') }}</span>
            <span class="ai-val" [title]="i18n.getLocalized(product, 'active_ingredient')">
              {{ i18n.getLocalized(product, 'active_ingredient') }}
            </span>
          </div>
        }

        <!-- Technical Specs Strip (3-Column Clean Micro Sheet) -->
        <div class="specs-grid">
          <div class="spec-col">
            <span class="spec-col-lbl">{{ i18n.currentLang() === 'ar' ? 'التركيز' : 'FORMULATION' }}</span>
            <span class="spec-col-val" [title]="product.concentration || product.formulation_code || '—'">
              {{ product.concentration || product.formulation_code || '—' }}
            </span>
          </div>
          <div class="spec-col">
            <span class="spec-col-lbl">{{ i18n.currentLang() === 'ar' ? 'الأمان' : 'PHI' }}</span>
            <span class="spec-col-val phi">
              {{ product.pre_harvest_interval !== null && product.pre_harvest_interval !== undefined ? product.pre_harvest_interval + ' ' + i18n.t('product.days') : '—' }}
            </span>
          </div>
          <div class="spec-col">
            <span class="spec-col-lbl">{{ i18n.currentLang() === 'ar' ? 'السمّية' : 'TOXICITY' }}</span>
            <span class="spec-col-val tox" [class]="'tox-' + product.toxicity_class">
              {{ product.toxicity_class ? 'Class ' + product.toxicity_class : '—' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Card Footer -->
      <div class="card-footer">
        <a [routerLink]="['/products', product.slug]" class="btn-card-details">
          <span>{{ i18n.t('catalog.details') }}</span>
          <div class="btn-arrow-circle">
            <app-icon [name]="i18n.isRtl() ? 'arrow-left' : 'arrow-right'" [size]="13" />
          </div>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      display: flex;
      flex-direction: column;
      background: #ffffff;
      border-radius: 20px;
      border: 1px solid #e1e9e5;
      padding: 0.75rem;
      height: 100%;
      box-shadow: 0 4px 20px rgba(10, 38, 30, 0.04);
      transition: border-color 0.25s ease, background-color 0.25s ease;

      &:hover {
        border-color: rgba(196, 138, 68, 0.5);

        .product-img {
          transform: scale(1.05);
        }

        .active-ingredient-card {
          background: #eef6f2;
        }

        .btn-card-details {
          background: #154c3e;
          border-color: #154c3e;

          .btn-arrow-circle {
            background: rgba(255, 255, 255, 0.25);
          }
        }
      }
    }

    .card-media {
      position: relative;
      background: #f1f3f2;
      border-radius: 14px;
      aspect-ratio: 1 / 1;
      overflow: hidden;
      display: block;
    }

    .media-link {
      display: block;
      width: 100%;
      height: 100%;
      padding: 0;
      position: relative;
      background: #f1f3f2;
    }

    .product-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .media-badges {
      position: absolute;
      top: 0.65rem;
      left: 0.65rem;
      right: 0.65rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 0.5rem;
      pointer-events: none;
      z-index: 3;
    }

    .cat-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.725rem;
      font-weight: 700;
      color: #0f382c;
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(18, 67, 54, 0.12);
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
      box-shadow: 0 2px 8px rgba(10, 38, 30, 0.06);

      .pill-icon {
        color: var(--tapco-green-600);
      }
    }

    .featured-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.7rem;
      font-weight: 800;
      color: #ffffff;
      background: linear-gradient(135deg, #c4883b 0%, #a46d2a 100%);
      border: 1px solid rgba(255, 255, 255, 0.35);
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
      box-shadow: 0 2px 8px rgba(196, 138, 68, 0.25);
    }

    .card-body {
      padding: 0.85rem 0.25rem 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      flex: 1;
    }

    .category-eyebrow {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--tapco-green-600);
      line-height: 1;
    }

    .product-title {
      font-size: 1.125rem;
      font-weight: 800;
      line-height: 1.35;
      letter-spacing: -0.015em;
      margin: 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      min-height: 2.7em;

      a {
        color: #0a261e;
        text-decoration: none;
        transition: color 0.2s ease;

        &:hover {
          color: var(--tapco-green-700);
        }
      }
    }

    .active-ingredient-card {
      background: #f7faf8;
      border-radius: 8px;
      border: 1px solid #eaf0ec;
      border-inline-start: 3px solid var(--tapco-green-600);
      padding: 0.45rem 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      transition: background-color 0.2s ease;
    }

    .ai-label {
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--tapco-green-700);
    }

    .ai-val {
      font-size: 0.825rem;
      font-weight: 600;
      color: #12382c;
      line-height: 1.35;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .specs-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.35rem;
      padding: 0.5rem 0.6rem;
      background: #f8faf9;
      border-radius: 10px;
      border: 1px solid #eef3f0;
      margin-top: auto;
    }

    .spec-col {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      align-items: center;
      text-align: center;
      border-inline-end: 1px solid #e2ece7;

      &:last-child {
        border-inline-end: none;
      }
    }

    .spec-col-lbl {
      font-size: 0.625rem;
      font-weight: 700;
      color: #71877f;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .spec-col-val {
      font-size: 0.775rem;
      font-weight: 700;
      color: #0f382c;
      font-family: var(--font-latin);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;

      &.phi {
        color: #b45309;
      }

      &.tox {
        &.tox-I   { color: #b91c1c; }
        &.tox-II  { color: #c2410c; }
        &.tox-III { color: #0284c7; }
        &.tox-IV  { color: #16a34a; }
      }
    }

    .card-footer {
      padding: 0.25rem 0.25rem 0.25rem;
      background: transparent;
    }

    .btn-card-details {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 0.65rem;
      padding-inline-start: 1.15rem;
      padding-inline-end: 0.75rem;
      font-size: 0.875rem;
      font-weight: 700;
      border-radius: 12px;
      background: #0e372c;
      color: #ffffff;
      border: 1px solid #0e372c;
      text-decoration: none;
      transition: background 0.22s ease, border-color 0.22s ease;

      .btn-arrow-circle {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.15);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: background 0.22s ease, transform 0.22s ease;
      }

      &:hover {
        background: #154c3e;
        border-color: #154c3e;

        .btn-arrow-circle {
          background: rgba(255, 255, 255, 0.25);
        }
      }
    }

    html[dir="rtl"] .product-card:hover .btn-card-details .btn-arrow-circle {
      transform: translateX(-3px);
    }
    html[dir="ltr"] .product-card:hover .btn-card-details .btn-arrow-circle {
      transform: translateX(3px);
    }
  `]
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  readonly i18n = inject(I18nService);
}
