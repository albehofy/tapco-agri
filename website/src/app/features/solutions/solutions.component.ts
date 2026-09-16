import { Component, inject, OnInit, signal } from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';
import { ApiService } from '../../core/services/api.service';
import { Crop, Pest, Product } from '../../core/models/tapco.models';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { IconComponent } from '../../shared/components/icon.component';

@Component({
  selector: 'app-solutions',
  standalone: true,
  imports: [ProductCardComponent, IconComponent],
  template: `
    <div class="solutions-page">
      <!-- Page Hero Header -->
      <section class="page-hero">
        <div class="tapco-container">
          <span class="badge-tag bronze">{{ i18n.t('solutions.title') }}</span>
          <h1 class="page-title">{{ i18n.t('solutions.title') }}</h1>
          <p class="page-subtitle">{{ i18n.t('solutions.subtitle') }}</p>
        </div>
      </section>

      <section class="section-padding">
        <div class="tapco-container">
          <!-- Interactive Problem Solver Wizard -->
          <div class="wizard-container card-base">
            <!-- Step 1: Select Crop -->
            <div class="wizard-step">
              <div class="step-header">
                <span class="step-num">1</span>
                <h3>{{ i18n.t('solutions.step1') }}</h3>
              </div>
              <div class="chips-row">
                @for (crop of crops(); track crop.id) {
                  <button
                    class="chip-btn"
                    [class.selected]="selectedCrop()?.id === crop.id"
                    (click)="chooseCrop(crop)"
                  >
                    <app-icon name="sprout" [size]="16" class="chip-icon" />
                    <span>{{ i18n.getLocalized(crop, 'name') }}</span>
                  </button>
                }
              </div>
            </div>

            <!-- Step 2: Select Pest / Disease -->
            <div class="wizard-step">
              <div class="step-header">
                <span class="step-num">2</span>
                <h3>{{ i18n.t('solutions.step2') }}</h3>
              </div>
              <div class="chips-row">
                @for (pest of pests(); track pest.id) {
                  <button
                    class="chip-btn"
                    [class.selected]="selectedPest()?.id === pest.id"
                    (click)="choosePest(pest)"
                  >
                    <app-icon [name]="pest.type === 'fungus' ? 'sprout' : (pest.type === 'nematode' ? 'dna' : 'bug')" [size]="16" class="chip-icon" />
                    <span>{{ i18n.getLocalized(pest, 'name') }}</span>
                  </button>
                }
              </div>
            </div>
          </div>

          <!-- Matching Results Section -->
          <div class="results-section">
            <div class="results-header">
              <h2 class="section-title">{{ i18n.t('solutions.recommended') }}</h2>
              @if (selectedCrop() || selectedPest()) {
                <div class="active-criteria">
                  @if (selectedCrop()) {
                    <span class="criteria-pill">
                      {{ i18n.t('product.crop') }}: <strong>{{ i18n.getLocalized(selectedCrop(), 'name') }}</strong>
                      <button (click)="chooseCrop(null)" class="clear-pill">×</button>
                    </span>
                  }
                  @if (selectedPest()) {
                    <span class="criteria-pill">
                      {{ i18n.t('product.pest') }}: <strong>{{ i18n.getLocalized(selectedPest(), 'name') }}</strong>
                      <button (click)="choosePest(null)" class="clear-pill">×</button>
                    </span>
                  }
                </div>
              }
            </div>

            @if (isLoading()) {
              <div class="loading-box">
                <div class="spinner"></div>
                <p>{{ i18n.currentLang() === 'ar' ? 'جاري مطابقة المركبات العلاجية...' : 'Matching chemical treatments...' }}</p>
              </div>
            } @else if (matchedProducts().length === 0) {
              <div class="empty-state card-base">
                <app-icon name="shield" [size]="52" class="empty-icon" />
                <p>{{ i18n.t('solutions.no_match') }}</p>
              </div>
            } @else {
              <div class="grid-cards">
                @for (prod of matchedProducts(); track prod.id) {
                  <app-product-card [product]="prod" />
                }
              </div>
            }
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .page-hero {
      background: linear-gradient(135deg, var(--tapco-green-900) 0%, var(--tapco-green-800) 100%);
      color: #ffffff;
      padding: 3.5rem 2.5rem;
      border-radius: 16px;
      margin-top: 2rem;
      margin-bottom: 3rem;
      border-bottom: 3px solid var(--tapco-bronze-500);
      box-shadow: 0 4px 20px rgba(10, 38, 30, 0.08);
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

    .wizard-container {
      padding: 2.5rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
      margin-bottom: 3.5rem;
      background: #ffffff;
    }

    .wizard-step {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .step-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;

      h3 {
        font-size: 1.2rem;
        font-weight: 700;
        color: var(--tapco-green-900);
      }
    }

    .step-num {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--tapco-bronze-500);
      color: #ffffff;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
    }

    .chips-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.65rem;
    }

    .chip-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 1.15rem;
      border-radius: var(--radius-full);
      border: 1.5px solid var(--tapco-border);
      background: var(--tapco-bg-page);
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--tapco-text-main);
      transition: all 0.2s ease;

      &:hover {
        border-color: var(--tapco-green-600);
        background: var(--tapco-green-50);
      }

      &.selected {
        background: var(--tapco-green-700);
        color: #ffffff;
        border-color: var(--tapco-green-800);
        box-shadow: 0 4px 12px rgba(18, 67, 54, 0.25);

        .chip-icon {
          color: var(--tapco-bronze-400);
        }
      }
    }

    .chip-icon {
      color: var(--tapco-green-700);
    }

    .results-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .results-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .active-criteria {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      flex-wrap: wrap;
    }

    .criteria-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 0.85rem;
      border-radius: var(--radius-full);
      background: var(--tapco-green-100);
      color: var(--tapco-green-900);
      font-size: 0.85rem;
      font-weight: 500;

      .clear-pill {
        font-weight: 800;
        font-size: 1rem;
        cursor: pointer;
        padding: 0 0.2rem;
        &:hover { color: var(--tapco-danger); }
      }
    }

    .loading-box, .empty-state {
      padding: 4rem 2rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .empty-state {
      background: #ffffff;
      color: var(--tapco-text-muted);
      font-size: 1.05rem;
    }

    .empty-icon {
      color: var(--tapco-bronze-500);
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3.5px solid var(--tapco-border);
      border-top-color: var(--tapco-green-700);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class SolutionsComponent implements OnInit {
  readonly i18n = inject(I18nService);
  private readonly api = inject(ApiService);

  readonly crops = signal<Crop[]>([]);
  readonly pests = signal<Pest[]>([]);
  readonly matchedProducts = signal<Product[]>([]);
  readonly isLoading = signal(false);

  readonly selectedCrop = signal<Crop | null>(null);
  readonly selectedPest = signal<Pest | null>(null);

  ngOnInit(): void {
    this.api.getCrops().subscribe(res => res?.data && this.crops.set(res.data));
    this.api.getPests().subscribe(res => res?.data && this.pests.set(res.data));
    this.searchSolutions();
  }

  chooseCrop(crop: Crop | null): void {
    this.selectedCrop.set(crop);
    this.searchSolutions();
  }

  choosePest(pest: Pest | null): void {
    this.selectedPest.set(pest);
    this.searchSolutions();
  }

  searchSolutions(): void {
    const cropSlug = this.selectedCrop()?.slug;
    const pestSlug = this.selectedPest()?.slug;

    this.isLoading.set(true);
    this.api.getProducts({
      crop: cropSlug,
      pest: pestSlug,
      per_page: 12,
    }).subscribe({
      next: (res) => {
        this.matchedProducts.set(res?.data || []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}
