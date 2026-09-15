import { Component, inject, OnInit, signal } from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';
import { ApiService } from '../../core/services/api.service';
import { Branch } from '../../core/models/tapco.models';
import { IconComponent } from '../../shared/components/icon.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="about-page">
      <!-- Page Header -->
      <section class="page-hero">
        <div class="tapco-container">
          <span class="badge-tag bronze">{{ i18n.t('about.title') }}</span>
          <h1 class="page-title">{{ i18n.t('about.title') }}</h1>
          <p class="page-subtitle">{{ i18n.t('about.subtitle') }}</p>
        </div>
      </section>

      <!-- Story & Values -->
      <section class="section-padding">
        <div class="tapco-container">
          <div class="story-grid">
            <div class="story-content">
              <span class="badge-tag green">{{ i18n.t('about.story_title') }}</span>
              <h2 class="section-title">{{ i18n.t('about.story_title') }}</h2>
              <p class="story-text">{{ i18n.t('about.story_p1') }}</p>
              <p class="story-text">{{ i18n.t('about.story_p2') }}</p>

              <div class="pillars-row">
                <div class="pillar-card card-base">
                  <div class="pillar-icon">
                    <app-icon name="shield" [size]="24" />
                  </div>
                  <h4>{{ i18n.t('about.mission_title') }}</h4>
                  <p>{{ i18n.t('about.mission_desc') }}</p>
                </div>

                <div class="pillar-card card-base">
                  <div class="pillar-icon bronze">
                    <app-icon name="sprout" [size]="24" />
                  </div>
                  <h4>{{ i18n.t('about.vision_title') }}</h4>
                  <p>{{ i18n.t('about.vision_desc') }}</p>
                </div>
              </div>
            </div>

            <!-- Side Infographic -->
            <div class="story-visual">
              <div class="factory-info-card card-base">
                <div class="factory-img-box">
                  <app-icon name="layers" [size]="64" class="factory-icon" />
                  <span class="factory-title">TAPCO Industrial Complex</span>
                </div>
                <div class="factory-details">
                  <div class="fd-row">
                    <span class="fd-label">{{ i18n.currentLang() === 'ar' ? 'الموقع' : 'Location' }}</span>
                    <span class="fd-val">{{ i18n.currentLang() === 'ar' ? 'مدينة السادات - المنطقة الصناعية' : 'Sadat City Industrial Zone' }}</span>
                  </div>
                  <div class="fd-row">
                    <span class="fd-label">{{ i18n.currentLang() === 'ar' ? 'خطوط الإنتاج' : 'Formulation Lines' }}</span>
                    <span class="fd-val">EC, SC, SL, WP, GR</span>
                  </div>
                  <div class="fd-row">
                    <span class="fd-label">{{ i18n.currentLang() === 'ar' ? 'معايير الجودة' : 'Standards' }}</span>
                    <span class="fd-val">ISO 9001:2015, ISO 14001</span>
                  </div>
                  <div class="fd-row">
                    <span class="fd-label">{{ i18n.currentLang() === 'ar' ? 'الرقابة والتحليل' : 'Analytical QC' }}</span>
                    <span class="fd-val">HPLC, GC, Spectrophotometry</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Branches & Distribution Network -->
      <section class="section-padding branches-section">
        <div class="tapco-container">
          <div class="section-header text-center">
            <span class="badge-tag green">{{ i18n.t('about.branches_title') }}</span>
            <h2 class="section-title">{{ i18n.t('about.branches_title') }}</h2>
            <p class="section-subtitle">{{ i18n.t('about.branches_subtitle') }}</p>
          </div>

          <div class="branches-grid">
            @for (b of branches(); track b.id) {
              <div class="branch-card card-base">
                <div class="branch-header">
                  <div class="branch-pin">
                    <app-icon name="map-pin" [size]="20" />
                  </div>
                  <h3 class="branch-name">{{ i18n.getLocalized(b, 'name') }}</h3>
                </div>

                <p class="branch-address">
                  {{ i18n.getLocalized(b, 'address') }}
                </p>

                <div class="branch-meta">
                  <div class="meta-row">
                    <app-icon name="phone" [size]="16" class="meta-icon" />
                    <a [href]="'tel:' + b.phone" dir="ltr">{{ b.phone }}</a>
                  </div>
                  @if (b.whatsapp) {
                    <div class="meta-row">
                      <app-icon name="message-circle" [size]="16" class="meta-icon" />
                      <a [href]="'https://wa.me/' + b.whatsapp.replace('+', '')" target="_blank" dir="ltr">{{ b.whatsapp }}</a>
                    </div>
                  }
                  @if (b.working_hours_ar || b.working_hours_en) {
                    <div class="meta-row">
                      <app-icon name="clock" [size]="16" class="meta-icon" />
                      <span>{{ i18n.getLocalized(b, 'working_hours') }}</span>
                    </div>
                  }
                </div>

                @if (b.lat && b.lng) {
                  <a
                    [href]="'https://www.google.com/maps?q=' + b.lat + ',' + b.lng"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="btn btn-outline map-link-btn"
                  >
                    <app-icon name="external-link" [size]="14" />
                    <span>{{ i18n.currentLang() === 'ar' ? 'عرض على خرائط Google' : 'Open in Google Maps' }}</span>
                  </a>
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

    .story-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      align-items: flex-start;
      gap: 3.5rem;
    }

    .story-content {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .story-text {
      font-size: 1.05rem;
      line-height: 1.8;
      color: var(--tapco-text-muted);
    }

    .pillars-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-top: 1rem;
    }

    .pillar-card {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      h4 {
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--tapco-green-900);
      }

      p {
        font-size: 0.875rem;
        line-height: 1.6;
        color: var(--tapco-text-muted);
      }
    }

    .pillar-icon {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-md);
      background: var(--tapco-green-100);
      color: var(--tapco-green-800);
      display: flex;
      align-items: center;
      justify-content: center;

      &.bronze {
        background: var(--tapco-bronze-100);
        color: var(--tapco-bronze-700);
      }
    }

    .factory-info-card {
      overflow: hidden;
      border-top: 4px solid var(--tapco-bronze-500);
    }

    .factory-img-box {
      background: linear-gradient(135deg, var(--tapco-green-900) 0%, #0d382c 100%);
      color: #ffffff;
      padding: 3rem 1.5rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .factory-icon {
      color: var(--tapco-bronze-400);
    }

    .factory-title {
      font-family: var(--font-latin);
      font-weight: 700;
      font-size: 1.1rem;
      letter-spacing: 0.05em;
    }

    .factory-details {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .fd-row {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      font-size: 0.875rem;
      border-bottom: 1px solid var(--tapco-border-subtle);
      padding-bottom: 0.5rem;

      &:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }
    }

    .fd-label {
      font-weight: 600;
      color: var(--tapco-text-muted);
    }

    .fd-val {
      font-weight: 700;
      color: var(--tapco-green-900);
      text-align: end;
    }

    /* Branches */
    .branches-section {
      background: var(--tapco-bg-muted);
    }

    .branches-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2rem;
    }

    .branch-card {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .branch-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .branch-pin {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-sm);
      background: var(--tapco-green-100);
      color: var(--tapco-green-800);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .branch-name {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--tapco-green-900);
    }

    .branch-address {
      font-size: 0.9rem;
      color: var(--tapco-text-muted);
      line-height: 1.5;
    }

    .branch-meta {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: auto;
    }

    .meta-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: var(--tapco-text-muted);

      .meta-icon {
        color: var(--tapco-bronze-600);
      }

      a {
        color: inherit;
        &:hover { color: var(--tapco-green-800); }
      }
    }

    .map-link-btn {
      width: 100%;
      font-size: 0.85rem;
      padding: 0.55rem;
    }

    @media (max-width: 991px) {
      .story-grid {
        grid-template-columns: 1fr;
      }
      .pillars-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AboutComponent implements OnInit {
  readonly i18n = inject(I18nService);
  private readonly api = inject(ApiService);

  readonly branches = signal<Branch[]>([]);

  ngOnInit(): void {
    this.api.getBranches().subscribe({
      next: (res) => res?.data && this.branches.set(res.data)
    });
  }
}
