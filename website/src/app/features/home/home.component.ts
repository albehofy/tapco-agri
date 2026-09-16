import { Component, inject, OnInit, signal, AfterViewInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { I18nService } from '../../core/services/i18n.service';
import { ApiService } from '../../core/services/api.service';
import { Category, Product, Supplier, Certificate, SiteSettings } from '../../core/models/tapco.models';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { IconComponent } from '../../shared/components/icon.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, FormsModule, ProductCardComponent, IconComponent],
  template: `
    <div class="home-page">
      <!-- 1. Editorial Hero Section -->
      <section class="hero-section">
        <div class="tapco-container hero-container">
          <!-- Text & Search Column -->
          <div class="hero-content">
            <div class="enterprise-badge">
              <span class="badge-dot"></span>
              <span class="badge-text">
                {{ i18n.currentLang() === 'ar' ? 'المجمع الصناعي المتكامل • مدينة السادات • جمهورية مصر العربية' : 'Sadat City Industrial Complex • Certified Agrochemicals' }}
              </span>
            </div>

            <h1 class="hero-headline">
              {{ i18n.currentLang() === 'ar' ? 'حلول متقدمة لحماية المحاصيل وتعظيم الإنتاجية الزراعية' : 'Pioneering Formulations for Crop Protection & Yield Maximization' }}
            </h1>

            <p class="hero-description">
              {{ i18n.currentLang() === 'ar' ? 'مصنع رائد في تصنيع وتوزيع المبيدات الحشرية والفطرية والنيماتودية والأسمدة المتخصصة بأعلى معايير النقاوة الدولية وفق اشتراطات منظمة الأغذية والزراعة (FAO) ولجنة مبيدات الآفات الزراعية.' : 'A premier manufacturer and distributor of high-potency insecticides, fungicides, nematicides, and specialty nutrients engineered under strict FAO and international quality standards.' }}
            </p>

            <!-- Quick Catalog Search Box -->
            <form class="hero-search-box" (submit)="onHeroSearch($event)">
              <div class="search-input-wrap">
                <app-icon name="search" [size]="20" class="search-icon" />
                <input
                  type="text"
                  [(ngModel)]="searchQuery"
                  name="searchQuery"
                  [placeholder]="i18n.currentLang() === 'ar' ? 'ابحث عن اسم المبيد، المادة الفعالة، أو نوع الآفة...' : 'Search formulations, active ingredients, or pests...'"
                  class="hero-search-input"
                />
              </div>
              <button type="submit" class="btn-hero-search">
                <span>{{ i18n.currentLang() === 'ar' ? 'بحث في الكتالوج' : 'Search' }}</span>
                <app-icon [name]="i18n.isRtl() ? 'arrow-left' : 'arrow-right'" [size]="16" />
              </button>
            </form>

            <!-- Action Buttons -->
            <div class="hero-actions">
              <a routerLink="/products" class="btn btn-bronze hero-primary-btn">
                <span>{{ i18n.currentLang() === 'ar' ? 'استعراض كافة المنتجات (120+)' : 'Browse Full Catalog (120+)' }}</span>
                <app-icon [name]="i18n.isRtl() ? 'arrow-left' : 'arrow-right'" [size]="18" />
              </a>

              <a
                href="https://wa.me/201012345678?text={{ encodeText(i18n.t('whatsapp.prefill')) }}"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-whatsapp hero-wa-btn"
              >
                <app-icon name="message-circle" [size]="18" />
                <span>{{ i18n.currentLang() === 'ar' ? 'استشارة الدعم الفني المباشر' : 'Consult Technical Support' }}</span>
              </a>
            </div>

            <!-- Trust Micro-Badges -->
            <div class="trust-strip">
              <div class="trust-item">
                <app-icon name="award" [size]="16" class="trust-icon" />
                <span>ISO 9001:2015</span>
              </div>
              <div class="trust-divider"></div>
              <div class="trust-item">
                <app-icon name="check" [size]="16" class="trust-icon" />
                <span>{{ i18n.currentLang() === 'ar' ? 'مطابق لمواصفات FAO & WHO' : 'FAO / WHO Compliant' }}</span>
              </div>
              <div class="trust-divider"></div>
              <div class="trust-item">
                <app-icon name="shield" [size]="16" class="trust-icon" />
                <span>{{ i18n.currentLang() === 'ar' ? 'تسجيل وزارة الزراعة المصرية' : 'Ministry Registered' }}</span>
              </div>
            </div>
          </div>

          <!-- Visual Showcase Column -->
          <div class="hero-visual-wrap">
            <div class="visual-card-frame">
              <img
                src="/images/hero-agriculture.jpg"
                alt="حقول زراعية حديثة - TAPCO Agriculture"
                class="hero-photo"
                loading="eager"
              />
              <div class="visual-gradient-overlay"></div>

              <!-- Floating Credential Card 1 -->
              <div class="floating-badge badge-top">
                <div class="badge-icon-box gold">
                  <app-icon name="award" [size]="22" />
                </div>
                <div>
                  <span class="badge-num">99.8%</span>
                  <span class="badge-sub">{{ i18n.currentLang() === 'ar' ? 'نقاوة المواد الفعالة' : 'Active Purity Rate' }}</span>
                </div>
              </div>

              <!-- Floating Credential Card 2 -->
              <div class="floating-badge badge-bottom">
                <div class="badge-icon-box green">
                  <app-icon name="sprout" [size]="22" />
                </div>
                <div>
                  <span class="badge-title">{{ i18n.currentLang() === 'ar' ? 'مجمع مدينة السادات' : 'Sadat Industrial Plant' }}</span>
                  <span class="badge-sub">{{ i18n.currentLang() === 'ar' ? 'خطوط تصنيع EC / SC / WP' : 'EC / SC / WP Synthesis Lines' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. Strategic KPI Bar -->
      <section class="stats-section">
        <div class="tapco-container">
          <div class="stats-card-container">
            <div class="stat-cell">
              <div class="stat-icon-wrapper">
                <app-icon name="award" [size]="26" />
              </div>
              <div class="stat-data">
                <span class="stat-metric">+25</span>
                <span class="stat-label">{{ i18n.currentLang() === 'ar' ? 'عاماً من الخبرة المصنعية' : 'Years Heritage' }}</span>
              </div>
            </div>

            <div class="stat-cell">
              <div class="stat-icon-wrapper">
                <app-icon name="layers" [size]="26" />
              </div>
              <div class="stat-data">
                <span class="stat-metric">+120</span>
                <span class="stat-label">{{ i18n.currentLang() === 'ar' ? 'مركباً ومبيداً مسجلاً' : 'Registered Formulations' }}</span>
              </div>
            </div>

            <div class="stat-cell">
              <div class="stat-icon-wrapper">
                <app-icon name="globe" [size]="26" />
              </div>
              <div class="stat-data">
                <span class="stat-metric">+15</span>
                <span class="stat-label">{{ i18n.currentLang() === 'ar' ? 'شراكة دولية للمواد الفعالة' : 'Global Chemical Partners' }}</span>
              </div>
            </div>

            <div class="stat-cell">
              <div class="stat-icon-wrapper">
                <app-icon name="map-pin" [size]="26" />
              </div>
              <div class="stat-data">
                <span class="stat-metric">6</span>
                <span class="stat-label">{{ i18n.currentLang() === 'ar' ? 'فروع ومراكز توزيع معتمدة' : 'Distribution Branches' }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. Interactive Crop & Pest Solutions Navigator -->
      <section class="section-padding navigator-section">
        <div class="tapco-container">
          <div class="section-header text-center">
            <span class="category-pretitle">{{ i18n.currentLang() === 'ar' ? 'الدليل الحقلي المتخصص' : 'Specialized Field Guide' }}</span>
            <h2 class="section-heading">{{ i18n.currentLang() === 'ar' ? 'برامج وقاية وتغذية مخصصة حسب المحصول' : 'Custom Crop Protection & Nutrition Programs' }}</h2>
            <p class="section-subtext">
              {{ i18n.currentLang() === 'ar' ? 'اختر نوع المحصول للاطلاع على أبرز الآفات والأمراض وحلول TAPCO الكيميائية الموصى بها ومعدلات الاستخدام وفترات الأمان.' : 'Select a crop to explore target pests, recommended formulations, application rates, and pre-harvest intervals.' }}
            </p>
          </div>

          <!-- Crop Selection Tabs -->
          <div class="crop-tabs-bar">
            <button
              type="button"
              class="crop-tab"
              [class.active]="selectedCrop() === 'citrus'"
              (click)="selectedCrop.set('citrus')"
            >
              <span class="tab-dot"></span>
              <span>{{ i18n.currentLang() === 'ar' ? 'الموالح والحمضيات' : 'Citrus Orchards' }}</span>
            </button>

            <button
              type="button"
              class="crop-tab"
              [class.active]="selectedCrop() === 'wheat'"
              (click)="selectedCrop.set('wheat')"
            >
              <span class="tab-dot"></span>
              <span>{{ i18n.currentLang() === 'ar' ? 'القمح والمحاصيل الحقلية' : 'Wheat & Field Crops' }}</span>
            </button>

            <button
              type="button"
              class="crop-tab"
              [class.active]="selectedCrop() === 'vegetables'"
              (click)="selectedCrop.set('vegetables')"
            >
              <span class="tab-dot"></span>
              <span>{{ i18n.currentLang() === 'ar' ? 'الطماطم ومحاصيل الخضر' : 'Tomatoes & Vegetables' }}</span>
            </button>

            <button
              type="button"
              class="crop-tab"
              [class.active]="selectedCrop() === 'grapes'"
              (click)="selectedCrop.set('grapes')"
            >
              <span class="tab-dot"></span>
              <span>{{ i18n.currentLang() === 'ar' ? 'العنب وبساتين الفاكهة' : 'Grapes & Fruit Orchards' }}</span>
            </button>

            <button
              type="button"
              class="crop-tab"
              [class.active]="selectedCrop() === 'olives'"
              (click)="selectedCrop.set('olives')"
            >
              <span class="tab-dot"></span>
              <span>{{ i18n.currentLang() === 'ar' ? 'الزيتون والنخيل' : 'Olives & Date Palms' }}</span>
            </button>
          </div>

          <!-- Solutions Cards Grid for Selected Crop -->
          <div class="solutions-display-grid">
            @for (sol of currentCropData().items; track sol.slug) {
              <div class="solution-recommendation-card">
                <div class="card-target-pest">
                  <span class="pest-badge">
                    <app-icon name="activity" [size]="14" />
                    <span>{{ i18n.currentLang() === 'ar' ? 'الآفة أو الإصابة المستهدفة' : 'Target Pest / Disease' }}</span>
                  </span>
                  <h4 class="pest-name">{{ i18n.currentLang() === 'ar' ? sol.pestAr : sol.pestEn }}</h4>
                </div>

                <div class="card-solution-body">
                  <span class="rec-label">{{ i18n.currentLang() === 'ar' ? 'المركب الموصى به من تابكو:' : 'Recommended TAPCO Formulation:' }}</span>
                  <h3 class="product-lead-name">{{ i18n.currentLang() === 'ar' ? sol.productAr : sol.productEn }}</h3>

                  <div class="sol-meta-grid">
                    <div class="meta-box">
                      <span class="m-title">{{ i18n.currentLang() === 'ar' ? 'معدل الاستخدام' : 'Dosage Rate' }}</span>
                      <span class="m-desc">{{ sol.rate }}</span>
                    </div>
                    <div class="meta-box">
                      <span class="m-title">{{ i18n.currentLang() === 'ar' ? 'فترة الأمان (PHI)' : 'Pre-Harvest Interval' }}</span>
                      <span class="m-desc phi-highlight">{{ sol.phi }}</span>
                    </div>
                  </div>
                </div>

                <div class="card-action-bar">
                  <a [routerLink]="['/products', sol.slug]" class="btn-view-sol">
                    <span>{{ i18n.currentLang() === 'ar' ? 'بطاقة المركب والجرعات' : 'View Formulation Specs' }}</span>
                    <app-icon [name]="i18n.isRtl() ? 'arrow-left' : 'arrow-right'" [size]="16" />
                  </a>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- 4. Core Categories Showcase -->
      <section class="section-padding categories-section">
        <div class="tapco-container">
          <div class="section-header text-center">
            <span class="category-pretitle">{{ i18n.currentLang() === 'ar' ? 'التصنيفات الرئيسية' : 'Primary Divisions' }}</span>
            <h2 class="section-heading">{{ i18n.t('home.categories_title') }}</h2>
            <p class="section-subtext">{{ i18n.t('home.categories_subtitle') }}</p>
          </div>

          <div class="categories-grid">
            @for (cat of categories(); track cat.id) {
              <div class="category-card">
                <div class="cat-card-header">
                  <div class="cat-icon-frame">
                    <app-icon [name]="cat.icon || 'leaf'" [size]="26" />
                  </div>
                  <span class="cat-items-badge">
                    {{ cat.products_count || 0 }} {{ i18n.currentLang() === 'ar' ? 'مركب مسجل' : 'Products' }}
                  </span>
                </div>

                <h3 class="cat-title">
                  <a [routerLink]="['/products']" [queryParams]="{category: cat.slug}">
                    {{ i18n.getLocalized(cat, 'name') }}
                  </a>
                </h3>

                @if (cat.children && cat.children.length > 0) {
                  <div class="subcategories-tags">
                    @for (sub of cat.children; track sub.id) {
                      <a [routerLink]="['/products']" [queryParams]="{category: sub.slug}" class="sub-chip">
                        {{ i18n.getLocalized(sub, 'name') }}
                      </a>
                    }
                  </div>
                }

                <a [routerLink]="['/products']" [queryParams]="{category: cat.slug}" class="cat-link-footer">
                  <span>{{ i18n.t('catalog.details') }}</span>
                  <app-icon [name]="i18n.isRtl() ? 'arrow-left' : 'arrow-right'" [size]="16" />
                </a>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- 5. Featured Formulations Showcase -->
      <section class="section-padding featured-section">
        <div class="tapco-container">
          <div class="section-header flex-header">
            <div>
              <span class="category-pretitle">{{ i18n.currentLang() === 'ar' ? 'المركبات المتميزة' : 'Flagship Products' }}</span>
              <h2 class="section-heading">{{ i18n.t('home.featured_title') }}</h2>
              <p class="section-subtext">{{ i18n.t('home.featured_subtitle') }}</p>
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

      <!-- 6. Sadat City Industrial Plant & Quality Control Lab -->
      <section class="section-padding factory-showcase-section">
        <div class="tapco-container">
          <div class="factory-grid">
            <div class="factory-info-col">
              <span class="category-pretitle">{{ i18n.currentLang() === 'ar' ? 'القدرة التصنيعية والبحثية' : 'Manufacturing & Quality Assurance' }}</span>
              <h2 class="section-heading">{{ i18n.currentLang() === 'ar' ? 'مجمع صناعي دوائي متقدم للمبيدات بمدينة السادات' : 'High-Precision Agrochemical Synthesis Facility in Sadat City' }}</h2>
              
              <p class="factory-lead">
                {{ i18n.currentLang() === 'ar' ? 'يمتلك مصنع TAPCO في المنطقة الصناعية الخامسة بمدينة السادات أحدث خطوط الإنتاج الآلية لتصنيع المعلقات المركزة (SC) والمستحلبات (EC) والمساحيق القابلة للبلل (WP)، مع رقابة صارمة على كل تشغيلة إنتاجية.' : 'Our modern synthesis complex in the 5th Industrial Zone, Sadat City operates fully automated formulation lines for EC, SC, WP, and SL chemistries, engineered to pharmaceutical-grade consistency.' }}
              </p>

              <div class="qc-pillars-list">
                <div class="qc-pillar">
                  <div class="qc-icon-check">
                    <app-icon name="check" [size]="18" />
                  </div>
                  <div>
                    <h4 class="pillar-title">{{ i18n.currentLang() === 'ar' ? 'مختبرات رقابة كيميائية متطورة (HPLC & GC)' : 'Advanced Analytical QC Laboratory (HPLC & GC)' }}</h4>
                    <p class="pillar-desc">{{ i18n.currentLang() === 'ar' ? 'فحص دقيق لنسبة ونقاوة المادة الفعالة وثبات المستحلب ودرجة الحموضة لكل دفعة قبل التعبئة.' : 'Rigorous active concentration analysis, emulsion stability, and pH verification before bottling.' }}</p>
                  </div>
                </div>

                <div class="qc-pillar">
                  <div class="qc-icon-check">
                    <app-icon name="check" [size]="18" />
                  </div>
                  <div>
                    <h4 class="pillar-title">{{ i18n.currentLang() === 'ar' ? 'تطابق كامل مع معايير FAO & WHO ومنظمة الزراعة' : 'Strict Compliance with FAO, WHO & Ministry Regulations' }}</h4>
                    <p class="pillar-desc">{{ i18n.currentLang() === 'ar' ? 'مسجل ومعتمد رسمياً من لجنة مبيدات الآفات الزراعية بوزارة الزراعة المصرية.' : 'Fully registered and audited by the Egyptian Agricultural Pesticide Committee.' }}</p>
                  </div>
                </div>

                <div class="qc-pillar">
                  <div class="qc-icon-check">
                    <app-icon name="check" [size]="18" />
                  </div>
                  <div>
                    <h4 class="pillar-title">{{ i18n.currentLang() === 'ar' ? 'نظم تعبئة محكمة مانعة للتسرب والغش التجاري' : 'Tamper-Proof & Leak-Free High-Barrier Packaging' }}</h4>
                    <p class="pillar-desc">{{ i18n.currentLang() === 'ar' ? 'عبوات HDPE ثلاثية الطبقات مع أغطية مؤمنة وعلامات أمان مائية لحماية المزارع.' : 'Triple-layer HDPE containers with induction seals and security holograms ensuring origin.' }}</p>
                  </div>
                </div>
              </div>

              <div class="factory-actions">
                <a routerLink="/about" class="btn btn-primary">
                  <span>{{ i18n.t('home.about_btn') }}</span>
                  <app-icon [name]="i18n.isRtl() ? 'arrow-left' : 'arrow-right'" [size]="16" />
                </a>
              </div>
            </div>

            <!-- Factory Visual Box -->
            <div class="factory-visual-col">
              <div class="factory-image-wrapper">
                <img
                  src="/images/factory-lab.jpg"
                  alt="مختبرات ومصانع تابكو - TAPCO QC Laboratory"
                  class="factory-photo"
                  loading="lazy"
                />
                <div class="factory-badge-corner">
                  <app-icon name="award" [size]="24" class="cert-gold-icon" />
                  <div>
                    <span class="f-badge-head">ISO 9001:2015</span>
                    <span class="f-badge-sub">{{ i18n.currentLang() === 'ar' ? 'نظام إدارة الجودة المعتمد' : 'Certified Quality System' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 7. Field Agronomy & Support Advisory -->
      <section class="section-padding agronomy-section">
        <div class="tapco-container">
          <div class="agronomy-grid">
            <div class="agronomy-visual-col">
              <div class="agronomy-frame">
                <img
                  src="/images/agronomist-solutions.jpg"
                  alt="مهندس زراعي تابكو - Technical Field Support"
                  class="agronomy-photo"
                  loading="lazy"
                />
              </div>
            </div>

            <div class="agronomy-text-col">
              <span class="category-pretitle">{{ i18n.currentLang() === 'ar' ? 'فريق الدعم الحقلي' : 'Field Advisory Service' }}</span>
              <h2 class="section-heading">{{ i18n.currentLang() === 'ar' ? 'استشارات فنية وزيارات ميدانية لكبرى المشروعات الزراعية' : 'Agronomic Technical Consultations & On-Site Farm Visits' }}</h2>
              <p class="agronomy-desc">
                {{ i18n.currentLang() === 'ar' ? 'لا يقتصر دور TAPCO على تصنيع المبيد؛ بل نرافق المزارع خطوة بخطوة من خلال طاقم استشاري من نخبة المهندسين الزراعيين لتقديم برامج التسميد والمكافحة المتكاملة (IPM) وتشخيص الأعراض المرضية مجاناً.' : 'We provide end-to-end technical stewardship. Our dedicated agronomists deliver calibrated spray schedules, integrated pest management (IPM) protocols, and rapid on-farm diagnostics.' }}
              </p>

              <div class="agronomy-highlights">
                <div class="high-item">
                  <span class="high-num">1</span>
                  <div>
                    <h5 class="high-title">{{ i18n.currentLang() === 'ar' ? 'تشخيص دقيق للآفة قبل الرش' : 'Pre-Application Pest Diagnostics' }}</h5>
                    <p class="high-p">{{ i18n.currentLang() === 'ar' ? 'فحص عينات الأوراق والتربة لتحديد المركب الأنسب ومنع نشوء سلالات مقاومة.' : 'Field sampling to identify specific pathogens and prevent chemical resistance.' }}</p>
                  </div>
                </div>

                <div class="high-item">
                  <span class="high-num">2</span>
                  <div>
                    <h5 class="high-title">{{ i18n.currentLang() === 'ar' ? 'معايرة آلات الرش وضبط الجرعات' : 'Sprayer Calibration & Dosage Precision' }}</h5>
                    <p class="high-p">{{ i18n.currentLang() === 'ar' ? 'توفير التكاليف وضمان وصول المركب لكافة أجزاء المجموع الخضري بأعلى كفاءة.' : 'Optimizing droplet coverage and reducing active runoff for maximum ROI.' }}</p>
                  </div>
                </div>
              </div>

              <div class="agronomy-cta-wrap">
                <a routerLink="/contact" class="btn btn-bronze">
                  <span>{{ i18n.currentLang() === 'ar' ? 'طلب زيارة فنية لمزرعتك' : 'Request Technical Farm Visit' }}</span>
                  <app-icon [name]="i18n.isRtl() ? 'arrow-left' : 'arrow-right'" [size]="16" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 8. International Chemical Suppliers Strip -->
      <section class="suppliers-section">
        <div class="tapco-container">
          <div class="section-header text-center">
            <span class="category-pretitle">{{ i18n.currentLang() === 'ar' ? 'الشراكات العالمية' : 'Global Supply Chain' }}</span>
            <h2 class="section-heading">{{ i18n.t('home.suppliers_title') }}</h2>
            <p class="section-subtext">{{ i18n.t('home.suppliers_subtitle') }}</p>
          </div>

          <div class="marquee-track-wrap">
            <div class="marquee-track">
              @for (sup of suppliers(); track sup.id) {
                <div class="supplier-pill">
                  <app-icon name="globe" [size]="18" class="sup-icon" />
                  <span class="sup-logo-text">{{ sup.name }}</span>
                </div>
              }
              @for (sup of suppliers(); track 'dup-' + sup.id) {
                <div class="supplier-pill">
                  <app-icon name="globe" [size]="18" class="sup-icon" />
                  <span class="sup-logo-text">{{ sup.name }}</span>
                </div>
              }
            </div>
          </div>
        </div>
      </section>

      <!-- 9. Final Strategic CTA Consultation Banner -->
      <section class="cta-banner-section">
        <div class="tapco-container">
          <div class="cta-banner-card">
            <div class="cta-banner-content">
              <span class="cta-pretitle">{{ i18n.currentLang() === 'ar' ? 'تواصل مباشر مع الإدارة الفنية' : 'Direct Engineering Line' }}</span>
              <h2 class="cta-title">{{ i18n.t('home.cta_box_title') }}</h2>
              <p class="cta-desc">{{ i18n.t('home.cta_box_desc') }}</p>

              <div class="cta-actions-row">
                <a
                  href="https://wa.me/201012345678?text={{ encodeText(i18n.t('whatsapp.prefill')) }}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn-whatsapp cta-btn"
                >
                  <app-icon name="message-circle" [size]="20" />
                  <span>{{ i18n.t('home.cta_box_btn') }}</span>
                </a>

                <a href="tel:+20223456789" class="btn btn-outline-light cta-btn">
                  <app-icon name="phone" [size]="18" />
                  <span dir="ltr">+20 2 2345 6789</span>
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
      background: #ffffff;
    }

    .section-padding {
      padding: 5.5rem 0;
    }

    @media (max-width: 768px) {
      .section-padding {
        padding: 3.5rem 0;
      }
    }

    .section-header {
      margin-bottom: 3.5rem;
      &.text-center {
        text-align: center;
        .section-subtext {
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

    .category-pretitle {
      display: inline-block;
      font-size: 0.8rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #c4883b;
      margin-bottom: 0.65rem;
    }

    .section-heading {
      font-size: clamp(1.6rem, 2.8vw, 2.35rem);
      font-weight: 800;
      color: #0a261e;
      line-height: 1.3;
      margin: 0;
    }

    .section-subtext {
      font-size: clamp(0.95rem, 1.2vw, 1.05rem);
      color: #53645e;
      max-width: 680px;
      margin-top: 0.75rem;
      line-height: 1.7;
    }

    /* 1. Hero Section */
    .hero-section {
      background: linear-gradient(180deg, #f8faf9 0%, #ffffff 100%);
      border-bottom: 1px solid #edf2ef;
      padding: 4rem 0 4.5rem;
      position: relative;
    }

    .hero-container {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      align-items: center;
      gap: 3.5rem;
    }

    .hero-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .enterprise-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 1rem;
      background: #eef7f3;
      border: 1px solid #d1e7dd;
      border-radius: 9999px;
      width: fit-content;

      .badge-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #124336;
      }

      .badge-text {
        font-size: 0.8rem;
        font-weight: 700;
        color: #124336;
      }
    }

    .hero-headline {
      font-size: clamp(2rem, 3.8vw, 3.1rem);
      font-weight: 800;
      color: #0a261e;
      line-height: 1.28;
      letter-spacing: -0.01em;
      margin: 0;
    }

    .hero-description {
      font-size: clamp(1rem, 1.3vw, 1.125rem);
      line-height: 1.75;
      color: #4b5d55;
      margin: 0;
    }

    /* Hero Search Box */
    .hero-search-box {
      display: flex;
      align-items: center;
      background: #ffffff;
      border: 2px solid #e2e8e4;
      border-radius: 12px;
      padding: 0.35rem 0.4rem;
      box-shadow: 0 4px 20px rgba(10, 38, 30, 0.06);
      transition: border-color 0.2s ease, box-shadow 0.2s ease;

      &:focus-within {
        border-color: #124336;
        box-shadow: 0 6px 24px rgba(18, 67, 54, 0.12);
      }
    }

    .search-input-wrap {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex: 1;
      padding: 0 0.85rem;

      .search-icon {
        color: #7c8e87;
        flex-shrink: 0;
      }
    }

    .hero-search-input {
      width: 100%;
      border: none;
      background: transparent;
      font-size: 0.95rem;
      color: #0a261e;
      outline: none;

      &::placeholder {
        color: #8c9e97;
      }
    }

    .btn-hero-search {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.4rem;
      background: #124336;
      color: #ffffff;
      font-size: 0.9rem;
      font-weight: 700;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      white-space: nowrap;
      transition: background 0.2s ease;

      &:hover {
        background: #0a261e;
      }
    }

    .hero-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .hero-primary-btn {
      padding: 0.85rem 1.75rem;
      font-size: 1rem;
    }

    .hero-wa-btn {
      padding: 0.85rem 1.5rem;
      font-size: 1rem;
    }

    .trust-strip {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding-top: 0.75rem;
      border-top: 1px solid #e8eeea;
      flex-wrap: wrap;
    }

    .trust-item {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      font-size: 0.8rem;
      font-weight: 700;
      color: #53645e;

      .trust-icon {
        color: #124336;
      }
    }

    .trust-divider {
      width: 1px;
      height: 16px;
      background: #d8e2dc;
    }

    /* Hero Visual Card */
    .hero-visual-wrap {
      display: flex;
      justify-content: center;
    }

    .visual-card-frame {
      position: relative;
      width: 100%;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(10, 38, 30, 0.15);
      border: 4px solid #ffffff;
    }

    .hero-photo {
      width: 100%;
      height: 100%;
      max-height: 490px;
      object-fit: cover;
      display: block;
    }

    .visual-gradient-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, transparent 60%, rgba(10, 38, 30, 0.4) 100%);
      pointer-events: none;
    }

    .floating-badge {
      position: absolute;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      padding: 0.85rem 1.15rem;
      border-radius: 12px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
      border: 1px solid rgba(255, 255, 255, 0.6);
      display: flex;
      align-items: center;
      gap: 0.85rem;
      z-index: 2;

      &.badge-top {
        top: 1.25rem;
        inset-inline-start: 1.25rem;
      }

      &.badge-bottom {
        bottom: 1.25rem;
        inset-inline-end: 1.25rem;
      }
    }

    .badge-icon-box {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      &.gold {
        background: #fdf5ea;
        color: #c4883b;
      }

      &.green {
        background: #eef7f3;
        color: #124336;
      }
    }

    .badge-num {
      display: block;
      font-size: 1.35rem;
      font-weight: 900;
      color: #0a261e;
      line-height: 1.1;
    }

    .badge-title {
      display: block;
      font-size: 0.9rem;
      font-weight: 800;
      color: #0a261e;
      line-height: 1.2;
    }

    .badge-sub {
      display: block;
      font-size: 0.725rem;
      font-weight: 600;
      color: #53645e;
      margin-top: 2px;
    }

    /* 2. Stats Section */
    .stats-section {
      background: #ffffff;
      padding: 1.5rem 0;
      border-bottom: 1px solid #edf2ef;
    }

    .stats-card-container {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      background: #ffffff;
      border: 1px solid #e2e8e4;
      border-radius: 16px;
      padding: 1.75rem 1rem;
      box-shadow: 0 4px 20px rgba(10, 38, 30, 0.04);
    }

    .stat-cell {
      display: flex;
      align-items: center;
      gap: 1.15rem;
      padding: 0 1.5rem;
      border-inline-end: 1px solid #edf2ef;

      &:last-child {
        border-inline-end: none;
      }
    }

    .stat-icon-wrapper {
      width: 54px;
      height: 54px;
      border-radius: 12px;
      background: #eef7f3;
      color: #124336;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .stat-data {
      display: flex;
      flex-direction: column;
    }

    .stat-metric {
      font-size: 2rem;
      font-weight: 900;
      color: #0a261e;
      line-height: 1.1;
      letter-spacing: -0.02em;
    }

    .stat-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #64748b;
      margin-top: 0.2rem;
    }

    /* 3. Navigator Section */
    .navigator-section {
      background: #fbfcfb;
      border-bottom: 1px solid #edf2ef;
    }

    .crop-tabs-bar {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      flex-wrap: wrap;
      margin-bottom: 2.5rem;
    }

    .crop-tab {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.7rem 1.4rem;
      background: #ffffff;
      border: 1.5px solid #e2e8e4;
      border-radius: 9999px;
      font-size: 0.95rem;
      font-weight: 700;
      color: #475569;
      cursor: pointer;
      transition: all 0.25s ease;

      .tab-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #cbd5e1;
        transition: background 0.25s ease;
      }

      &:hover {
        border-color: #c4883b;
        color: #0a261e;
      }

      &.active {
        background: #124336;
        border-color: #124336;
        color: #ffffff;
        box-shadow: 0 4px 14px rgba(18, 67, 54, 0.2);

        .tab-dot {
          background-color: #c4883b;
        }
      }
    }

    .solutions-display-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .solution-recommendation-card {
      background: #ffffff;
      border: 1px solid #e2e8e4;
      border-radius: 14px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      box-shadow: 0 4px 15px rgba(10, 38, 30, 0.04);
      transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;

      &:hover {
        
        box-shadow: 0 12px 30px rgba(10, 38, 30, 0.08);
        border-color: #c4883b;
      }
    }

    .card-target-pest {
      border-bottom: 1px solid #f1f5f2;
      padding-bottom: 1rem;
    }

    .pest-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.75rem;
      font-weight: 700;
      color: #9a3412;
      background: #fff7ed;
      border: 1px solid #ffedd5;
      padding: 0.2rem 0.55rem;
      border-radius: 4px;
      margin-bottom: 0.5rem;
    }

    .pest-name {
      font-size: 1.1rem;
      font-weight: 700;
      color: #0a261e;
      margin: 0;
    }

    .card-solution-body {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .rec-label {
      font-size: 0.775rem;
      font-weight: 600;
      color: #64748b;
    }

    .product-lead-name {
      font-size: 1.25rem;
      font-weight: 800;
      color: #124336;
      margin: 0;
    }

    .sol-meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }

    .meta-box {
      background: #f8faf9;
      border: 1px solid #edf2ef;
      border-radius: 8px;
      padding: 0.65rem 0.75rem;
      display: flex;
      flex-direction: column;
    }

    .m-title {
      font-size: 0.7rem;
      font-weight: 600;
      color: #64748b;
    }

    .m-desc {
      font-size: 0.85rem;
      font-weight: 700;
      color: #0a261e;
      margin-top: 2px;
    }

    .phi-highlight {
      color: #b45309;
    }

    .card-action-bar {
      margin-top: auto;
      padding-top: 0.5rem;
    }

    .btn-view-sol {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.65rem 1rem;
      font-size: 0.875rem;
      font-weight: 700;
      color: #124336;
      background: #eef7f3;
      border: 1px solid #d1e7dd;
      border-radius: 8px;
      transition: all 0.2s ease;

      &:hover {
        background: #124336;
        color: #ffffff;
      }
    }

    /* 4. Categories Section */
    .categories-section {
      background: #ffffff;
      border-bottom: 1px solid #edf2ef;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.75rem;
    }

    .category-card {
      background: #ffffff;
      border: 1px solid #e2e8e4;
      border-radius: 14px;
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      box-shadow: 0 4px 15px rgba(10, 38, 30, 0.03);
      transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;

      &:hover {
        
        box-shadow: 0 12px 30px rgba(10, 38, 30, 0.08);
        border-color: #124336;

        .cat-icon-frame {
          background: #124336;
          color: #ffffff;
        }

        .cat-link-footer {
          color: #c4883b;
        }
      }
    }

    .cat-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .cat-icon-frame {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      background: #eef7f3;
      color: #124336;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .cat-items-badge {
      font-size: 0.8rem;
      font-weight: 700;
      color: #53645e;
      background: #f1f5f3;
      padding: 0.3rem 0.75rem;
      border-radius: 9999px;
    }

    .cat-title {
      font-size: 1.3rem;
      font-weight: 800;
      color: #0a261e;
      margin: 0;

      a {
        color: inherit;
        &:hover { color: #c4883b; }
      }
    }

    .subcategories-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin: 0.5rem 0 1rem;
    }

    .sub-chip {
      font-size: 0.825rem;
      font-weight: 600;
      color: #53645e;
      background: #f8faf9;
      border: 1px solid #e8eeea;
      padding: 0.25rem 0.65rem;
      border-radius: 6px;
      transition: all 0.2s ease;

      &:hover {
        background: #eef7f3;
        color: #124336;
        border-color: #124336;
      }
    }

    .cat-link-footer {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.9rem;
      font-weight: 700;
      color: #124336;
      margin-top: auto;
      padding-top: 0.5rem;
      transition: gap 0.2s ease, color 0.2s ease;

      &:hover {
        gap: 0.7rem;
      }
    }

    /* 5. Featured Section */
    .featured-section {
      background: #fbfcfb;
      border-bottom: 1px solid #edf2ef;
    }

    /* 6. Factory Showcase Section */
    .factory-showcase-section {
      background: #ffffff;
      border-bottom: 1px solid #edf2ef;
    }

    .factory-grid {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      align-items: center;
      gap: 4rem;
    }

    .factory-info-col {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .factory-lead {
      font-size: 1.05rem;
      line-height: 1.75;
      color: #475569;
      margin: 0;
    }

    .qc-pillars-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .qc-pillar {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }

    .qc-icon-check {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #eef7f3;
      color: #124336;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .pillar-title {
      font-size: 1rem;
      font-weight: 700;
      color: #0a261e;
      margin: 0 0 0.25rem;
    }

    .pillar-desc {
      font-size: 0.875rem;
      line-height: 1.6;
      color: #64748b;
      margin: 0;
    }

    .factory-image-wrapper {
      position: relative;
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(10, 38, 30, 0.12);
      border: 4px solid #ffffff;
    }

    .factory-photo {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .factory-badge-corner {
      position: absolute;
      bottom: 1.25rem;
      inset-inline-start: 1.25rem;
      background: rgba(255, 255, 255, 0.96);
      backdrop-filter: blur(12px);
      padding: 0.85rem 1.25rem;
      border-radius: 12px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .cert-gold-icon {
      color: #c4883b;
    }

    .f-badge-head {
      display: block;
      font-size: 1rem;
      font-weight: 900;
      color: #0a261e;
    }

    .f-badge-sub {
      display: block;
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 600;
    }

    /* 7. Agronomy Advisory Section */
    .agronomy-section {
      background: #fbfcfb;
      border-bottom: 1px solid #edf2ef;
    }

    .agronomy-grid {
      display: grid;
      grid-template-columns: 0.85fr 1.15fr;
      align-items: center;
      gap: 4rem;
    }

    .agronomy-frame {
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(10, 38, 30, 0.12);
      border: 4px solid #ffffff;
    }

    .agronomy-photo {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .agronomy-text-col {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .agronomy-desc {
      font-size: 1.05rem;
      line-height: 1.75;
      color: #475569;
      margin: 0;
    }

    .agronomy-highlights {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .high-item {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
    }

    .high-num {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: #124336;
      color: #ffffff;
      font-size: 1.1rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .high-title {
      font-size: 1rem;
      font-weight: 700;
      color: #0a261e;
      margin: 0 0 0.25rem;
    }

    .high-p {
      font-size: 0.875rem;
      line-height: 1.6;
      color: #64748b;
      margin: 0;
    }

    /* 8. Suppliers Section */
    .suppliers-section {
      background: #ffffff;
      padding: 4.5rem 0;
      border-bottom: 1px solid #edf2ef;
    }

    .marquee-track-wrap {
      overflow: hidden;
      -webkit-mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
      mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
      margin-top: 2rem;
    }

    .marquee-track {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      width: max-content;
      animation: marquee 25s linear infinite;
    }

    .marquee-track-wrap:hover .marquee-track {
      animation-play-state: paused;
    }

    .supplier-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.65rem;
      background: #ffffff;
      padding: 0.85rem 1.75rem;
      border-radius: 12px;
      border: 1px solid #e2e8e4;
      box-shadow: 0 2px 8px rgba(10, 38, 30, 0.04);
      flex-shrink: 0;
      transition: all 0.3s ease;

      &:hover {
        border-color: #c4883b;
        
        box-shadow: 0 6px 20px rgba(196, 138, 68, 0.15);
      }
    }

    .sup-icon {
      color: #124336;
    }

    .sup-logo-text {
      font-family: var(--font-latin);
      font-weight: 700;
      font-size: 1rem;
      color: #0a261e;
      letter-spacing: 0.02em;
      white-space: nowrap;
    }

    /* 9. Final CTA Banner */
    .cta-banner-section {
      padding: 5rem 0;
      background: #fbfcfb;
    }

    .cta-banner-card {
      background: linear-gradient(135deg, #0a261e 0%, #124336 60%, #0e3329 100%);
      border-radius: 20px;
      padding: 4rem 2rem;
      text-align: center;
      box-shadow: 0 20px 50px rgba(10, 38, 30, 0.2);
      border: 1px solid #1a5646;
      color: #ffffff;
    }

    .cta-banner-content {
      max-width: 760px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.25rem;
    }

    .cta-pretitle {
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #d8a25f;
    }

    .cta-title {
      font-size: clamp(1.6rem, 3vw, 2.4rem);
      font-weight: 800;
      color: #ffffff;
      margin: 0;
      line-height: 1.3;
    }

    .cta-desc {
      font-size: 1.05rem;
      color: #d1ded8;
      line-height: 1.7;
      margin: 0;
    }

    .cta-actions-row {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      flex-wrap: wrap;
      justify-content: center;
      margin-top: 1rem;
    }

    .cta-btn {
      padding: 0.85rem 1.85rem;
      font-size: 1rem;
    }

    .btn-outline-light {
      background: rgba(255, 255, 255, 0.08);
      border: 1.5px solid rgba(255, 255, 255, 0.35);
      color: #ffffff;

      &:hover {
        background: rgba(255, 255, 255, 0.18);
        border-color: #ffffff;
      }
    }

    /* Responsive Breakpoints */
    @media (max-width: 991px) {
      .hero-container, .factory-grid, .agronomy-grid {
        grid-template-columns: 1fr;
        gap: 3rem;
      }
      .stats-card-container {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
      }
      .stat-cell:nth-child(2) {
        border-inline-end: none;
      }
    }

    @media (max-width: 640px) {
      .stats-card-container {
        grid-template-columns: 1fr;
        gap: 1.25rem;
      }
      .stat-cell {
        border-inline-end: none;
        border-bottom: 1px solid #edf2ef;
        padding-bottom: 1.25rem;
        &:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
      }
      .hero-search-box {
        flex-direction: column;
        align-items: stretch;
      }
      .btn-hero-search {
        justify-content: center;
      }
    }
  `]
})
export class HomeComponent implements OnInit, AfterViewInit {
  readonly i18n = inject(I18nService);
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  readonly categories = signal<Category[]>([]);
  readonly featuredProducts = signal<Product[]>([]);
  readonly suppliers = signal<Supplier[]>([]);
  readonly certificates = signal<Certificate[]>([]);
  readonly settings = signal<SiteSettings | null>(null);

  searchQuery = '';
  readonly selectedCrop = signal<string>('citrus');

  readonly cropData: Record<string, {
    items: {
      pestAr: string;
      pestEn: string;
      productAr: string;
      productEn: string;
      slug: string;
      rate: string;
      phi: string;
    }[];
  }> = {
    citrus: {
      items: [
        {
          pestAr: 'ذبابة الفاكهة وصانعات الأنفاق',
          pestEn: 'Fruit Fly & Leafminers',
          productAr: 'تابكونور 20% إس إل',
          productEn: 'Tapconor 20% SL',
          slug: 'tapconor-20-sl',
          rate: '50 سم / 100 لتر ماء',
          phi: '7 أيام'
        },
        {
          pestAr: 'العنكبوت الأحمر والحلم الدودي',
          pestEn: 'Red Spider Mites',
          productAr: 'تابكو-أكارين 10% إي سي',
          productEn: 'Tapco-Acarin 10% EC',
          slug: 'tapco-acarin-10-ec',
          rate: '30 سم / 100 لتر ماء',
          phi: '14 يوم'
        },
        {
          pestAr: 'أعفان الجذور ونيماتودا الموالح',
          pestEn: 'Root Rot & Nematodes',
          productAr: 'تابكوماكس نيماتودا 10% جي',
          productEn: 'Tapcomax Nema 10% G',
          slug: 'tapcomax-nema-10-g',
          rate: '10-15 كجم / فدان',
          phi: '21 يوم'
        }
      ]
    },
    wheat: {
      items: [
        {
          pestAr: 'الصدأ الأصفر والأمراض الفطرية',
          pestEn: 'Yellow Rust & Blights',
          productAr: 'تابكوسيد 72% دبليو بي',
          productEn: 'Tapcoside 72% WP',
          slug: 'tapcoside-72-wp',
          rate: '250 جم / فدان',
          phi: '14 يوم'
        },
        {
          pestAr: 'حشرات المن ودودة سنابل القمح',
          pestEn: 'Aphids & Earworms',
          productAr: 'تابكونور 20% إس إل',
          productEn: 'Tapconor 20% SL',
          slug: 'tapconor-20-sl',
          rate: '50 سم / 100 لتر ماء',
          phi: '7 أيام'
        },
        {
          pestAr: 'تحسين حجم الحبوب والوزن النوعي',
          pestEn: 'Grain Filling & Weight',
          productAr: 'تابكو-جرين بوتاسيوم هومات 85%',
          productEn: 'Tapco-Green Potassium Humate',
          slug: 'tapco-green-potassium-humate-85',
          rate: '1.5 كجم / فدان حقناً',
          phi: 'عضوي آمن'
        }
      ]
    },
    vegetables: {
      items: [
        {
          pestAr: 'الندوة المبكرة والمتأخرة في الطماطم والبطاطس',
          pestEn: 'Early & Late Blight',
          productAr: 'تابكوسيد 72% دبليو بي',
          productEn: 'Tapcoside 72% WP',
          slug: 'tapcoside-72-wp',
          rate: '200 جم / 100 لتر ماء',
          phi: '7 أيام'
        },
        {
          pestAr: 'الذبابة البيضاء والتربس والديدان',
          pestEn: 'Whitefly, Thrips & Worms',
          productAr: 'تابكونور 20% إس إل',
          productEn: 'Tapconor 20% SL',
          slug: 'tapconor-20-sl',
          rate: '50 سم / 100 لتر ماء',
          phi: '3 أيام'
        },
        {
          pestAr: 'تثبيت الأزهار وتحجيم وتلوين الثمار',
          pestEn: 'Fruit Sizing & Coloration',
          productAr: 'تابكو-فولير زنك وبورون بلس',
          productEn: 'Tapco-Foliar Zn + B Plus',
          slug: 'tapco-foliar-zn-b-plus',
          rate: '1 لتر / فدان رشاً ورRowقياً',
          phi: 'عضوي آمن'
        }
      ]
    },
    grapes: {
      items: [
        {
          pestAr: 'البياض الدقيقي والزغبي وأعفان الثمار',
          pestEn: 'Downy & Powdery Mildew',
          productAr: 'تابكوسيد 72% دبليو بي',
          productEn: 'Tapcoside 72% WP',
          slug: 'tapcoside-72-wp',
          rate: '250 جم / 100 لتر ماء',
          phi: '14 يوم'
        },
        {
          pestAr: 'حفار ساق العنب ودودة هريان العنب',
          pestEn: 'Grape Berry Moth',
          productAr: 'تابكونور 20% إس إل',
          productEn: 'Tapconor 20% SL',
          slug: 'tapconor-20-sl',
          rate: '60 سم / 100 لتر ماء',
          phi: '10 أيام'
        },
        {
          pestAr: 'الحلم الأكاروسي وعثة البراعم',
          pestEn: 'Bud Mites & Red Spiders',
          productAr: 'تابكو-أكارين 10% إي سي',
          productEn: 'Tapco-Acarin 10% EC',
          slug: 'tapco-acarin-10-ec',
          rate: '35 سم / 100 لتر ماء',
          phi: '14 يوم'
        }
      ]
    },
    olives: {
      items: [
        {
          pestAr: 'ذبابة ثمار الزيتون وعثة الياسمين',
          pestEn: 'Olive Fruit Fly',
          productAr: 'تابكونور 20% إس إل',
          productEn: 'Tapconor 20% SL',
          slug: 'tapconor-20-sl',
          rate: '50 سم / 100 لتر ماء',
          phi: '14 يوم'
        },
        {
          pestAr: 'مرض عين الطاووس الفطري',
          pestEn: 'Peacock Spot Disease',
          productAr: 'تابكوسيد 72% دبليو بي',
          productEn: 'Tapcoside 72% WP',
          slug: 'tapcoside-72-wp',
          rate: '250 جم / 100 لتر ماء',
          phi: '14 يوم'
        },
        {
          pestAr: 'نيماتودا تقرح الجذور والذبول الوعائي',
          pestEn: 'Root-Knot Nematodes',
          productAr: 'تابكوماكس نيماتودا 10% جي',
          productEn: 'Tapcomax Nema 10% G',
          slug: 'tapcomax-nema-10-g',
          rate: '15 كجم / فدان',
          phi: '21 يوم'
        }
      ]
    }
  };

  currentCropData() {
    return this.cropData[this.selectedCrop()] || this.cropData['citrus'];
  }

  ngOnInit(): void {
    this.api.getCategories().subscribe({
      next: (res) => res?.data && this.categories.set(Array.isArray(res.data) ? res.data : [])
    });

    this.api.getFeaturedProducts().subscribe({
      next: (res) => res?.data && this.featuredProducts.set(Array.isArray(res.data) ? res.data : [])
    });

    this.api.getSuppliers().subscribe({
      next: (res) => res?.data && this.suppliers.set(Array.isArray(res.data) ? res.data : [])
    });

    this.api.getCertificates().subscribe({
      next: (res) => res?.data && this.certificates.set(Array.isArray(res.data) ? res.data : [])
    });

    this.api.getSettings().subscribe({
      next: (res) => res?.data && this.settings.set(res.data)
    });
  }

  ngAfterViewInit(): void {
    // Smooth scroll indicator or entrance actions
  }

  onHeroSearch(e: Event): void {
    e.preventDefault();
    const query = this.searchQuery.trim();
    if (query) {
      this.router.navigate(['/products'], { queryParams: { search: query } });
    } else {
      this.router.navigate(['/products']);
    }
  }

  encodeText(str: string): string {
    return encodeURIComponent(str);
  }
}
