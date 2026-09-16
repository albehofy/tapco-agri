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
      <!-- Card Media -->
      <div class="card-media">
        <a [routerLink]="['/products', product.slug]" class="media-link" [title]="i18n.getLocalized(product, 'name')">
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
              {{ i18n.getLocalized(product.category, 'name') }}
            </span>
          }
          @if (product.is_featured) {
            <span class="featured-badge">
              ★ {{ i18n.currentLang() === 'ar' ? 'مميز' : 'Featured' }}
            </span>
          }
        </div>

        <!-- Formulation Tag Floating -->
        @if (product.formulation_code) {
          <div class="formulation-floating-tag">
            {{ product.formulation_code }}
          </div>
        }
      </div>

      <!-- Card Body -->
      <div class="card-body">
        <h3 class="product-title">
          <a [routerLink]="['/products', product.slug]">
            {{ i18n.getLocalized(product, 'name') }}
          </a>
        </h3>

        @if (product.active_ingredient_ar || product.active_ingredient_en) {
          <div class="active-ingredient">
            <span class="ai-label">{{ i18n.t('product.active_ingredient') }}:</span>
            <span class="ai-val">{{ i18n.getLocalized(product, 'active_ingredient') }}</span>
          </div>
        }

        <!-- Technical Specs Pills -->
        <div class="specs-row">
          @if (product.concentration) {
            <span class="spec-tag conc-tag">
              {{ product.concentration }}
            </span>
          }
          @if (product.pre_harvest_interval !== null && product.pre_harvest_interval !== undefined) {
            <span class="spec-tag phi-tag">
              PHI: {{ product.pre_harvest_interval }} {{ i18n.t('product.days') }}
            </span>
          }
          @if (product.toxicity_class) {
            <span class="spec-tag tox-tag tox-{{ product.toxicity_class }}">
              Class {{ product.toxicity_class }}
            </span>
          }
        </div>
      </div>

      <!-- Card Footer -->
      <div class="card-footer">
        <a [routerLink]="['/products', product.slug]" class="btn-card-details">
          <span>{{ i18n.t('catalog.details') }}</span>
          <app-icon [name]="i18n.isRtl() ? 'arrow-left' : 'arrow-right'" [size]="15" />
        </a>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      display: flex;
      flex-direction: column;
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid #e5ece8;
      overflow: hidden;
      height: 100%;
      box-shadow: 0 2px 10px rgba(10, 45, 34, 0.04);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        
        box-shadow: 0 12px 30px rgba(10, 45, 34, 0.1);
        border-color: #c4883b;

        .product-img {
          
        }

        .btn-card-details {
          background: #0f382c;
          color: #ffffff;
          border-color: #0f382c;

          app-icon {
            
          }
        }
      }
    }

    .card-media {
      position: relative;
      background: #fbfcfb;
      border-bottom: 1px solid #edf2ef;
      aspect-ratio: 1 / 1;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .media-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      padding: 1.25rem;
    }

    .product-img {
      max-width: 85%;
      max-height: 85%;
      object-fit: contain;
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .media-badges {
      position: absolute;
      top: 0.75rem;
      left: 0.75rem;
      right: 0.75rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 0.5rem;
      pointer-events: none;
      z-index: 2;
    }

    .cat-pill {
      font-size: 0.75rem;
      font-weight: 700;
      color: #0f382c;
      background: rgba(220, 240, 232, 0.95);
      border: 1px solid rgba(15, 56, 44, 0.15);
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
      backdrop-filter: blur(4px);
    }

    .featured-badge {
      font-size: 0.725rem;
      font-weight: 700;
      color: #8c5d25;
      background: rgba(250, 235, 217, 0.95);
      border: 1px solid rgba(196, 138, 68, 0.3);
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
      backdrop-filter: blur(4px);
    }

    .formulation-floating-tag {
      position: absolute;
      bottom: 0.65rem;
      inset-inline-end: 0.65rem;
      font-family: var(--font-latin);
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      color: #ffffff;
      background: #0f382c;
      padding: 0.2rem 0.55rem;
      border-radius: 6px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    }

    .card-body {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      flex: 1;
    }

    .product-title {
      font-size: 1.05rem;
      font-weight: 700;
      line-height: 1.4;
      margin: 0;

      a {
        color: #0a261e;
        transition: color 0.2s ease;

        &:hover {
          color: #c4883b;
        }
      }
    }

    .active-ingredient {
      font-size: 0.825rem;
      line-height: 1.5;
      color: #53645e;

      .ai-label {
        font-weight: 600;
        color: #0f382c;
        margin-inline-end: 0.35rem;
      }

      .ai-val {
        color: #64748b;
      }
    }

    .specs-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
      margin-top: auto;
      padding-top: 0.5rem;
    }

    .spec-tag {
      font-size: 0.725rem;
      font-weight: 600;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      border: 1px solid #e2e8e4;
      background: #f8faf9;
      color: #475569;
    }

    .phi-tag {
      background: #fef3c7;
      color: #92400e;
      border-color: #fde68a;
    }

    .tox-tag {
      font-weight: 700;
      &.tox-I { background: #fee2e2; color: #991b1b; border-color: #fecaca; }
      &.tox-II { background: #ffedd5; color: #9a3412; border-color: #fed7aa; }
      &.tox-III { background: #e0f2fe; color: #075985; border-color: #bae6fd; }
      &.tox-IV { background: #dcfce7; color: #166534; border-color: #bbf7d0; }
    }

    .card-footer {
      padding: 0.85rem 1.25rem 1.15rem;
      border-top: 1px solid #edf2ef;
    }

    .btn-card-details {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.6rem 1rem;
      font-size: 0.875rem;
      font-weight: 700;
      border-radius: 8px;
      background: #f4f7f5;
      color: #0f382c;
      border: 1px solid #dce4e0;
      transition: all 0.25s ease;

      app-icon {
        transition: transform 0.25s ease;
      }
    }

    html[dir="rtl"] .btn-card-details:hover app-icon {
      
    }
    html[dir="ltr"] .btn-card-details:hover app-icon {
      
    }
  `]
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  readonly i18n = inject(I18nService);
}
