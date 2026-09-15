import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';
import { ApiService } from '../../core/services/api.service';
import { Category, Product, Supplier, Certificate, SiteSettings } from '../../core/models/tapco.models';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { IconComponent } from '../../shared/components/icon.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ProductCardComponent, IconComponent],
  template: `
    <div class="home-page">
      <!-- 1. Hero Section -->
      <section class="hero-section">
        <div class="hero-pattern-overlay"></div>
        <div class="tapco-container hero-container">
          <div class="hero-content">
            <span class="hero-badge">
              <span class="badge-dot"></span>
              {{ i18n.t('hero.badge') }}
            </span>

            <h1 class="hero-title">
              @if (settings()?.['home_hero_title']) {
                {{ settings()!['home_hero_title'][i18n.currentLang()] }}
              } @else {
                {{ i18n.t('home_hero_title') }}
              }
            </h1>

            <p class="hero-subtitle">
              @if (settings()?.['home_hero_subtitle']) {
                {{ settings()!['home_hero_subtitle'][i18n.currentLang()] }}
              } @else {
                {{ i18n.t('home_hero_subtitle') }}
              }
            </p>

            <div class="hero-actions">
              <a routerLink="/products" class="btn btn-bronze hero-btn">
                <span>{{ i18n.t('hero.cta_products') }}</span>
                <app-icon [name]="i18n.isRtl() ? 'arrow-left' : 'arrow-right'" [size]="18" />
              </a>

              <a routerLink="/solutions" class="btn btn-outline-hero hero-btn">
                <app-icon name="sprout" [size]="18" />
                <span>{{ i18n.t('nav.solutions') }}</span>
              </a>
            </div>
          </div>

          <!-- Hero Graphic Feature Card -->
          <div class="hero-graphic">
            <div class="hero-feature-card">
              <div class="feature-card-header">
                <div class="leaf-badge">
                  <app-icon name="leaf" [size]="30" />
                </div>
                <div>
                  <span class="card-caption">TAPCO Synthetics</span>
                  <h4 class="card-lead">{{ i18n.currentLang() === 'ar' ? 'تصنيع معتمد دوليًا' : 'ISO Certified Agrochemicals' }}</h4>
                </div>
              </div>
              <p class="feature-card-text">
                {{ i18n.currentLang() === 'ar' ? 'حلول وقاية متقدمة لرفع إنتاجية المحاصيل ومقاومة الآفات بأعلى معايير الأمان البيئي.' : 'Pioneering formulations for superior yields, disease resistance, and sustainable food safety.' }}
              </p>
              <div class="feature-metrics">
                <div class="metric-item">
                  <span class="m-val">99.8%</span>
                  <span class="m-lbl">{{ i18n.currentLang() === 'ar' ? 'نقاوة المواد الفعالة' : 'Active Purity' }}</span>
                </div>
                <div class="metric-divider"></div>
                <div class="metric-item">
                  <span class="m-val">25+</span>
                  <span class="m-lbl">{{ i18n.currentLang() === 'ar' ? 'عام خبرة مصنعية' : 'Years Heritage' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. Statistics Counter Bar -->
      <section class="stats-bar">
        <div class="tapco-container">
          <div class="stats-grid">
            <div class="stat-box">
              <div class="stat-icon-wrap">
                <app-icon name="award" [size]="28" />
              </div>
              <div class="stat-info">
                <span class="stat-number">25+</span>
                <span class="stat-label">{{ i18n.t('stats.experience') }}</span>
              </div>
            </div>

            <div class="stat-box">
              <div class="stat-icon-wrap">
                <app-icon name="layers" [size]="28" />
              </div>
              <div class="stat-info">
                <span class="stat-number">120+</span>
                <span class="stat-label">{{ i18n.t('stats.products') }}</span>
              </div>
            </div>

            <div class="stat-box">
              <div class="stat-icon-wrap">
                <app-icon name="globe" [size]="28" />
              </div>
              <div class="stat-info">
                <span class="stat-number">15+</span>
                <span class="stat-label">{{ i18n.t('stats.suppliers') }}</span>
              </div>
            </div>

            <div class="stat-box">
              <div class="stat-icon-wrap">
                <app-icon name="map-pin" [size]="28" />
              </div>
              <div class="stat-info">
                <span class="stat-number">6</span>
                <span class="stat-label">{{ i18n.t('stats.branches') }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. Root Categories Cards Grid -->
      <section class="section-padding categories-section">
        <div class="tapco-container">
          <div class="section-header text-center">
            <span class="badge-tag green">{{ i18n.t('home.categories_title') }}</span>
            <h2 class="section-title">{{ i18n.t('home.categories_title') }}</h2>
            <p class="section-subtitle">{{ i18n.t('home.categories_subtitle') }}</p>
          </div>

          <div class="categories-grid">
            @for (cat of categories(); track cat.id) {
              <div class="cat-card card-base">
                <div class="cat-card-top">
                  <div class="cat-icon-box">
                    <app-icon [name]="cat.icon || 'leaf'" [size]="28" />
                  </div>
                  <span class="cat-prod-count">
                    {{ cat.products_count || 0 }} {{ i18n.currentLang() === 'ar' ? 'منتج' : 'items' }}
                  </span>
                </div>

                <h3 class="cat-card-title">
                  <a [routerLink]="['/products']" [queryParams]="{category: cat.slug}">
                    {{ i18n.getLocalized(cat, 'name') }}
                  </a>
                </h3>

                @if (cat.children && cat.children.length > 0) {
                  <ul class="subcat-list">
                    @for (sub of cat.children; track sub.id) {
                      <li>
                        <a [routerLink]="['/products']" [queryParams]="{category: sub.slug}">
                          {{ i18n.getLocalized(sub, 'name') }}
                        </a>
                      </li>
                    }
                  </ul>
                }

                <a [routerLink]="['/products']" [queryParams]="{category: cat.slug}" class="cat-explore-link">
                  <span>{{ i18n.t('catalog.details') }}</span>
                  <app-icon [name]="i18n.isRtl() ? 'arrow-left' : 'arrow-right'" [size]="16" />
                </a>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- 4. Featured Products Section -->
      <section class="section-padding featured-section">
        <div class="tapco-container">
          <div class="section-header flex-header">
            <div>
              <span class="badge-tag bronze">{{ i18n.t('home.featured_title') }}</span>
              <h2 class="section-title">{{ i18n.t('home.featured_title') }}</h2>
              <p class="section-subtitle">{{ i18n.t('home.featured_subtitle') }}</p>
            </div>
            <a routerLink="/products" class="btn btn-outline view-all-btn">
              <span>{{ i18n.currentLang() === 'ar' ? 'عرض كافة المنتجات' : 'View All Products' }}</span>
              <app-icon [name]="i18n.isRtl() ? 'arrow-left' : 'arrow-right'" [size]="16" />
            </a>
          </div>

          <div class="grid-cards">
            @for (prod of featuredProducts(); track prod.id) {
              <app-product-card [product]="prod" />
            }
          </div>
        </div>
      </section>

      <!-- 5. Suppliers Strip (Grayscale to Color on Hover) -->
      <section class="suppliers-section">
        <div class="tapco-container">
          <div class="section-header text-center">
            <span class="badge-tag green">{{ i18n.t('home.suppliers_title') }}</span>
            <h2 class="section-title">{{ i18n.t('home.suppliers_title') }}</h2>
            <p class="section-subtitle">{{ i18n.t('home.suppliers_subtitle') }}</p>
          </div>

          <div class="suppliers-strip">
            @for (sup of suppliers(); track sup.id) {
              <div class="supplier-pill">
                <span class="sup-logo-text">{{ sup.name }}</span>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- 6. About Factory Preview -->
      <section class="section-padding about-preview-section">
        <div class="tapco-container">
          <div class="about-preview-grid">
            <div class="about-preview-text">
              <span class="badge-tag bronze">{{ i18n.t('home.about_tag') }}</span>
              <h2 class="section-title">{{ i18n.t('home.about_title') }}</h2>
              <p class="about-lead">
                @if (settings()?.['about_short']) {
                  {{ settings()!['about_short'][i18n.currentLang()] }}
                } @else {
                  {{ i18n.t('about.story_p1') }}
                }
              </p>

              <div class="quality-checks">
                <div class="q-item">
                  <app-icon name="check" [size]="18" class="q-icon" />
                  <span>{{ i18n.currentLang() === 'ar' ? 'خطوط تصنيع متطورة للمستحلبات (EC) والمعلقات (SC)' : 'State-of-the-art EC, SC & WP formulation lines' }}</span>
                </div>
                <div class="q-item">
                  <app-icon name="check" [size]="18" class="q-icon" />
                  <span>{{ i18n.currentLang() === 'ar' ? 'مختبر رقابة جودة متقدم لفحص النقاوة وثبات المستحلب' : 'Advanced analytical QC laboratory testing active purity' }}</span>
                </div>
                <div class="q-item">
                  <app-icon name="check" [size]="18" class="q-icon" />
                  <span>{{ i18n.currentLang() === 'ar' ? 'تطابق كامل مع معايير FAO & WHO ومنظمة الزراعة' : 'Strict conformance to FAO, WHO & Ministry regulations' }}</span>
                </div>
              </div>

              <div class="about-action">
                <a routerLink="/about" class="btn btn-primary">
                  <span>{{ i18n.t('home.about_btn') }}</span>
                  <app-icon [name]="i18n.isRtl() ? 'arrow-left' : 'arrow-right'" [size]="16" />
                </a>
              </div>
            </div>

            <!-- Visual Factory Card -->
            <div class="about-preview-visual">
              <div class="visual-card">
                <div class="visual-badge">
                  <app-icon name="award" [size]="24" />
                  <span>ISO 9001:2015</span>
                </div>
                <div class="visual-body">
                  <app-icon name="layers" [size]="56" class="visual-icon" />
                  <h3>TAPCO Synthesis Lab</h3>
                  <p>{{ i18n.currentLang() === 'ar' ? 'مدينة السادات - المنطقة الصناعية الخامسة' : 'Sadat City - 5th Industrial Zone' }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 7. Quality Certificates Section -->
      <section class="section-padding certs-section">
        <div class="tapco-container">
          <div class="section-header text-center">
            <span class="badge-tag green">{{ i18n.t('home.certs_title') }}</span>
            <h2 class="section-title">{{ i18n.t('home.certs_title') }}</h2>
            <p class="section-subtitle">{{ i18n.t('home.certs_subtitle') }}</p>
          </div>

          <div class="certs-grid">
            @for (cert of certificates(); track cert.id) {
              <div class="cert-card card-base">
                <div class="cert-icon-wrap">
                  <app-icon name="award" [size]="36" />
                </div>
                <h4 class="cert-title">{{ i18n.getLocalized(cert, 'title') }}</h4>
                <span class="cert-verified">
                  <app-icon name="check" [size]="14" />
                  {{ i18n.currentLang() === 'ar' ? 'معتمد ومسجل' : 'Accredited & Verified' }}
                </span>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- 8. Final CTA Banner with Direct WhatsApp -->
      <section class="cta-banner-section">
        <div class="tapco-container">
          <div class="cta-banner-card">
            <div class="cta-banner-content">
              <h2 class="cta-title">{{ i18n.t('home.cta_box_title') }}</h2>
              <p class="cta-desc">{{ i18n.t('home.cta_box_desc') }}</p>
              <div class="cta-buttons">
                <a
                  href="https://wa.me/201012345678?text={{ encodeText(i18n.t('whatsapp.prefill')) }}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn-whatsapp cta-btn"
                >
                  <app-icon name="message-circle" [size]="20" />
                  <span>{{ i18n.t('home.cta_box_btn') }}</span>
                </a>
                <a routerLink="/contact" class="btn btn-outline-light cta-btn">
                  <span>{{ i18n.t('nav.contact') }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home-page {
      display: flex;
      flex-direction: column;
    }

    .section-padding {
      padding: 5rem 0;
    }

    @media (max-width: 768px) {
      .section-padding {
        padding: 3rem 0;
      }
    }

    .section-header {
      margin-bottom: 3rem;
      &.text-center {
        text-align: center;
        .section-subtitle {
          margin-left: auto;
          margin-right: auto;
        }
      }
      &.flex-header {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 1.5rem;
        flex-wrap: wrap;
      }
    }

    /* Hero Section */
    .hero-section {
      position: relative;
      background: linear-gradient(135deg, #0a261e 0%, #124336 50%, #0e3329 100%);
      color: #ffffff;
      padding: 5.5rem 0 6rem;
      overflow: hidden;
    }

    .hero-pattern-overlay {
      position: absolute;
      inset: 0;
      background-image: radial-gradient(rgba(196, 138, 68, 0.15) 1px, transparent 1px);
      background-size: 28px 28px;
      opacity: 0.6;
      pointer-events: none;
    }

    .hero-container {
      position: relative;
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      align-items: center;
      gap: 3.5rem;
    }

    .hero-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 0.95rem;
      border-radius: var(--radius-full);
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      font-size: 0.825rem;
      font-weight: 600;
      color: var(--tapco-bronze-400);
      width: fit-content;
    }

    .badge-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: var(--tapco-bronze-500);
    }

    .hero-title {
      font-size: clamp(1.85rem, 3.5vw, 3rem);
      font-weight: 800;
      line-height: 1.25;
      color: #ffffff;
    }

    .hero-subtitle {
      font-size: clamp(1rem, 1.4vw, 1.15rem);
      line-height: 1.7;
      color: #cdd9d3;
      max-width: 580px;
    }

    .hero-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
      margin-top: 0.5rem;
    }

    .hero-btn {
      padding: 0.8rem 1.75rem;
      font-size: 1rem;
    }

    .btn-outline-hero {
      background: rgba(255, 255, 255, 0.08);
      border: 1.5px solid rgba(255, 255, 255, 0.3);
      color: #ffffff;
      &:hover {
        background: rgba(255, 255, 255, 0.18);
        border-color: #ffffff;
      }
    }

    .hero-graphic {
      display: flex;
      justify-content: center;
    }

    .hero-feature-card {
      background: rgba(255, 255, 255, 0.07);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.18);
      border-radius: var(--radius-lg);
      padding: 2rem;
      box-shadow: var(--shadow-lg);
      width: 100%;
      max-width: 420px;
    }

    .feature-card-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.25rem;
    }

    .leaf-badge {
      width: 52px;
      height: 52px;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, var(--tapco-bronze-500) 0%, var(--tapco-bronze-700) 100%);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card-caption {
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      color: var(--tapco-bronze-400);
      text-transform: uppercase;
    }

    .card-lead {
      font-size: 1.15rem;
      font-weight: 700;
      color: #ffffff;
    }

    .feature-card-text {
      font-size: 0.9rem;
      line-height: 1.6;
      color: #b7c8c1;
      margin-bottom: 1.5rem;
    }

    .feature-metrics {
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding-top: 1.25rem;
      border-top: 1px solid rgba(255, 255, 255, 0.12);
    }

    .metric-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .m-val {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--tapco-bronze-400);
    }

    .m-lbl {
      font-size: 0.75rem;
      color: #a3b6ae;
    }

    .metric-divider {
      width: 1px;
      height: 36px;
      background: rgba(255, 255, 255, 0.15);
    }

    /* Stats Bar */
    .stats-bar {
      background: #ffffff;
      box-shadow: 0 8px 30px rgba(10, 38, 30, 0.06);
      position: relative;
      margin-top: -2rem;
      z-index: 10;
      border-radius: var(--radius-lg);
      max-width: 1200px;
      margin-left: auto;
      margin-right: auto;
      border: 1px solid var(--tapco-border);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      padding: 1.75rem 1rem;
      gap: 1.5rem;
    }

    .stat-box {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0 1rem;
      border-inline-end: 1px solid var(--tapco-border-subtle);

      &:last-child {
        border-inline-end: none;
      }
    }

    .stat-icon-wrap {
      width: 52px;
      height: 52px;
      border-radius: var(--radius-md);
      background: var(--tapco-green-50);
      color: var(--tapco-green-700);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-number {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--tapco-green-900);
      line-height: 1.2;
    }

    .stat-label {
      font-size: 0.85rem;
      color: var(--tapco-text-muted);
      font-weight: 500;
    }

    /* Categories Grid */
    .categories-section {
      background: var(--tapco-bg-page);
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2rem;
    }

    .cat-card {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      border-top: 4px solid var(--tapco-green-700);
    }

    .cat-card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .cat-icon-box {
      width: 52px;
      height: 52px;
      border-radius: var(--radius-md);
      background: var(--tapco-green-100);
      color: var(--tapco-green-800);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .cat-prod-count {
      font-size: 0.8rem;
      font-weight: 600;
      padding: 0.25rem 0.65rem;
      border-radius: var(--radius-full);
      background: var(--tapco-bg-muted);
      color: var(--tapco-text-muted);
    }

    .cat-card-title {
      font-size: 1.35rem;
      font-weight: 700;
      color: var(--tapco-green-900);
      a {
        color: inherit;
        &:hover { color: var(--tapco-bronze-600); }
      }
    }

    .subcat-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin: 0.5rem 0 1rem;

      li a {
        display: inline-block;
        font-size: 0.925rem;
        color: var(--tapco-text-muted);
        position: relative;
        padding-inline-start: 1rem;
        transition: color 0.15s ease, transform 0.15s ease;

        &::before {
          content: '•';
          position: absolute;
          left: 0;
          color: var(--tapco-bronze-500);
        }

        &:hover {
          color: var(--tapco-green-700);
          transform: translateX(3px);
        }
      }
    }

    html[dir="rtl"] .subcat-list li a::before {
      left: auto;
      right: 0;
    }
    html[dir="rtl"] .subcat-list li a:hover {
      transform: translateX(-3px);
    }

    .cat-explore-link {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--tapco-bronze-600);
      margin-top: auto;
      padding-top: 0.5rem;
      transition: gap 0.2s ease;

      &:hover {
        gap: 0.7rem;
        color: var(--tapco-bronze-700);
      }
    }

    /* Featured Products */
    .featured-section {
      background: #ffffff;
    }

    /* Suppliers Strip */
    .suppliers-section {
      background: var(--tapco-bg-muted);
      padding: 3.5rem 0;
      border-top: 1px solid var(--tapco-border);
      border-bottom: 1px solid var(--tapco-border);
    }

    .suppliers-strip {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .supplier-pill {
      background: #ffffff;
      padding: 0.85rem 1.75rem;
      border-radius: var(--radius-md);
      border: 1px solid var(--tapco-border);
      box-shadow: var(--shadow-sm);
      filter: grayscale(100%);
      opacity: 0.75;
      transition: all 0.3s ease;

      &:hover {
        filter: grayscale(0%);
        opacity: 1;
        transform: translateY(-2px);
        border-color: var(--tapco-bronze-500);
        box-shadow: var(--shadow-md);
      }
    }

    .sup-logo-text {
      font-family: var(--font-latin);
      font-weight: 700;
      font-size: 1rem;
      color: var(--tapco-green-900);
      letter-spacing: 0.02em;
    }

    /* About Preview */
    .about-preview-section {
      background: #ffffff;
    }

    .about-preview-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      align-items: center;
      gap: 4rem;
    }

    .about-preview-text {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .about-lead {
      font-size: 1.05rem;
      line-height: 1.75;
      color: var(--tapco-text-muted);
    }

    .quality-checks {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin: 0.5rem 0;
    }

    .q-item {
      display: flex;
      align-items: flex-start;
      gap: 0.65rem;
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--tapco-text-main);
    }

    .q-icon {
      color: var(--tapco-green-600);
      flex-shrink: 0;
      margin-top: 3px;
    }

    .visual-card {
      background: linear-gradient(135deg, var(--tapco-green-900) 0%, var(--tapco-green-800) 100%);
      color: #ffffff;
      border-radius: var(--radius-lg);
      padding: 3rem 2rem;
      text-align: center;
      position: relative;
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--tapco-green-700);
    }

    .visual-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: var(--tapco-bronze-500);
      color: #ffffff;
      padding: 0.35rem 0.85rem;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    html[dir="rtl"] .visual-badge {
      right: auto;
      left: 1rem;
    }

    .visual-icon {
      color: var(--tapco-bronze-400);
      margin: 0 auto 1.25rem;
    }

    .visual-body h3 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
      color: #ffffff;
    }

    .visual-body p {
      font-size: 0.9rem;
      color: #c9d8d1;
    }

    /* Certificates */
    .certs-section {
      background: var(--tapco-bg-page);
    }

    .certs-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .cert-card {
      padding: 2rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .cert-icon-wrap {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: var(--tapco-bronze-100);
      color: var(--tapco-bronze-700);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .cert-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--tapco-green-900);
    }

    .cert-verified {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--tapco-success);
    }

    /* CTA Banner */
    .cta-banner-section {
      padding-bottom: 4rem;
    }

    .cta-banner-card {
      background: linear-gradient(135deg, var(--tapco-green-900) 0%, #0d3a2e 100%);
      color: #ffffff;
      border-radius: var(--radius-lg);
      padding: 3.5rem 2rem;
      text-align: center;
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--tapco-green-700);
    }

    .cta-banner-content {
      max-width: 750px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.25rem;
    }

    .cta-title {
      font-size: clamp(1.4rem, 2.5vw, 2.25rem);
      font-weight: 800;
      color: #ffffff;
    }

    .cta-desc {
      font-size: 1.05rem;
      color: #c9d8d1;
      line-height: 1.6;
    }

    .cta-buttons {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 0.5rem;
    }

    .cta-btn {
      padding: 0.75rem 1.75rem;
      font-size: 1rem;
    }

    .btn-outline-light {
      background: transparent;
      border: 1.5px solid rgba(255, 255, 255, 0.4);
      color: #ffffff;
      &:hover {
        background: rgba(255, 255, 255, 0.15);
        border-color: #ffffff;
      }
    }

    /* Responsive adjustments */
    @media (max-width: 991px) {
      .hero-container, .about-preview-grid {
        grid-template-columns: 1fr;
        gap: 2.5rem;
      }
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .stat-box:nth-child(2) {
        border-inline-end: none;
      }
    }

    @media (max-width: 600px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
      .stat-box {
        border-inline-end: none;
        border-bottom: 1px solid var(--tapco-border-subtle);
        padding-bottom: 1rem;
        &:last-child { border-bottom: none; }
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  readonly i18n = inject(I18nService);
  private readonly api = inject(ApiService);

  readonly categories = signal<Category[]>([]);
  readonly featuredProducts = signal<Product[]>([]);
  readonly suppliers = signal<Supplier[]>([]);
  readonly certificates = signal<Certificate[]>([]);
  readonly settings = signal<SiteSettings | null>(null);

  ngOnInit(): void {
    this.api.getCategories().subscribe({
      next: (res) => res?.data && this.categories.set(res.data)
    });

    this.api.getFeaturedProducts().subscribe({
      next: (res) => res?.data && this.featuredProducts.set(res.data)
    });

    this.api.getSuppliers().subscribe({
      next: (res) => res?.data && this.suppliers.set(res.data)
    });

    this.api.getCertificates().subscribe({
      next: (res) => res?.data && this.certificates.set(res.data)
    });

    this.api.getSettings().subscribe({
      next: (res) => res?.data && this.settings.set(res.data)
    });
  }

  encodeText(str: string): string {
    return encodeURIComponent(str);
  }
}
