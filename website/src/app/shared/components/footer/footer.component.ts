import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../../core/services/i18n.service';
import { LogoComponent } from '../logo.component';
import { IconComponent } from '../icon.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, LogoComponent, IconComponent],
  template: `
    <footer class="tapco-footer">
      <div class="tapco-container footer-content">
        <div class="footer-grid">
          <!-- Col 1: About TAPCO -->
          <div class="footer-col brand-col">
            <app-logo [height]="44" [inverted]="true" />
            <p class="footer-bio">
              {{ i18n.t('footer.desc') }}
            </p>
            <div class="social-links">
              <a href="https://facebook.com/tapcoagri" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="Facebook">
                <app-icon name="globe" [size]="18" />
              </a>
              <a href="https://linkedin.com/company/tapco-agri" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="LinkedIn">
                <app-icon name="activity" [size]="18" />
              </a>
              <a href="https://instagram.com/tapcoagri" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="Instagram">
                <app-icon name="external-link" [size]="18" />
              </a>
            </div>
          </div>

          <!-- Col 2: Quick Links -->
          <div class="footer-col">
            <h4 class="col-title">{{ i18n.t('footer.quick_links') }}</h4>
            <ul class="col-links">
              <li><a routerLink="/">{{ i18n.t('nav.home') }}</a></li>
              <li><a routerLink="/about">{{ i18n.t('nav.about') }}</a></li>
              <li><a routerLink="/products">{{ i18n.t('nav.products') }}</a></li>
              <li><a routerLink="/solutions">{{ i18n.t('nav.solutions') }}</a></li>
              <li><a routerLink="/blog">{{ i18n.t('nav.blog') }}</a></li>
              <li><a routerLink="/contact">{{ i18n.t('nav.contact') }}</a></li>
            </ul>
          </div>

          <!-- Col 3: Product Categories -->
          <div class="footer-col">
            <h4 class="col-title">{{ i18n.t('footer.products_cat') }}</h4>
            <ul class="col-links">
              <li><a [routerLink]="['/products']" [queryParams]="{category: 'insecticides'}">{{ i18n.currentLang() === 'ar' ? 'مبيدات حشرية' : 'Insecticides' }}</a></li>
              <li><a [routerLink]="['/products']" [queryParams]="{category: 'fungicides'}">{{ i18n.currentLang() === 'ar' ? 'مبيدات فطرية' : 'Fungicides' }}</a></li>
              <li><a [routerLink]="['/products']" [queryParams]="{category: 'nematicides'}">{{ i18n.currentLang() === 'ar' ? 'مبيدات نيماتودية' : 'Nematicides' }}</a></li>
              <li><a [routerLink]="['/products']" [queryParams]="{category: 'acaricides'}">{{ i18n.currentLang() === 'ar' ? 'مبيدات أكاروسية' : 'Acaricides' }}</a></li>
              <li><a [routerLink]="['/products']" [queryParams]="{category: 'foliar-nutrients'}">{{ i18n.currentLang() === 'ar' ? 'مغذيات ورقية ومخلبيات' : 'Foliar Nutrients' }}</a></li>
              <li><a [routerLink]="['/products']" [queryParams]="{category: 'soil-conditioners'}">{{ i18n.currentLang() === 'ar' ? 'مصححات تربة وهوميك' : 'Soil Conditioners' }}</a></li>
            </ul>
          </div>

          <!-- Col 4: Contact & Locations -->
          <div class="footer-col">
            <h4 class="col-title">{{ i18n.t('footer.contact_info') }}</h4>
            <div class="footer-contacts">
              <div class="contact-item">
                <app-icon name="map-pin" [size]="18" class="contact-icon" />
                <span>{{ i18n.currentLang() === 'ar' ? 'المجمع الصناعي، مدينة السادات، المنوفية، مصر' : '5th Industrial Zone, Sadat City, Menofia, Egypt' }}</span>
              </div>
              <div class="contact-item">
                <app-icon name="phone" [size]="18" class="contact-icon" />
                <a href="tel:+20223456789" dir="ltr">+20 2 2345 6789</a>
              </div>
              <div class="contact-item">
                <app-icon name="message-circle" [size]="18" class="contact-icon" />
                <a href="https://wa.me/201012345678" target="_blank" dir="ltr">+20 10 1234 5678</a>
              </div>
              <div class="contact-item">
                <app-icon name="mail" [size]="18" class="contact-icon" />
                <a href="mailto:info@tapco-agri.com">info&#64;tapco-agri.com</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Copyright Bar -->
        <div class="footer-bottom">
          <p class="copyright-text">{{ i18n.t('footer.rights') }}</p>
          <div class="bottom-badges">
            <span class="iso-badge">ISO 9001:2015</span>
            <span class="iso-badge">ISO 14001</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .tapco-footer {
      background: linear-gradient(180deg, var(--tapco-green-900) 0%, #061914 100%);
      color: #e5ede9;
      padding-top: 4.5rem;
      padding-bottom: 2rem;
      margin-top: 4rem;
      border-top: 3px solid var(--tapco-bronze-500);
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1.2fr 1.8fr;
      gap: 2.5rem;
      padding-bottom: 3.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .brand-col {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .footer-bio {
      font-size: 0.925rem;
      line-height: 1.7;
      color: #b7c7c0;
      max-width: 360px;
    }

    .social-links {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .social-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: var(--radius-full);
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
      transition: all 0.2s ease;

      &:hover {
        background: var(--tapco-bronze-500);
        transform: translateY(-2px);
      }
    }

    .col-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 1.25rem;
      position: relative;
      padding-bottom: 0.5rem;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 32px;
        height: 2px;
        background: var(--tapco-bronze-500);
      }
    }

    html[dir="rtl"] .col-title::after {
      left: auto;
      right: 0;
    }

    .col-links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.65rem;

      li a {
        color: #b7c7c0;
        font-size: 0.9rem;
        transition: color 0.2s ease, transform 0.2s ease;
        display: inline-block;

        &:hover {
          color: var(--tapco-bronze-400);
          transform: translateX(4px);
        }
      }
    }

    html[dir="rtl"] .col-links li a:hover {
      transform: translateX(-4px);
    }

    .footer-contacts {
      display: flex;
      flex-direction: column;
      gap: 0.9rem;
    }

    .contact-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      font-size: 0.885rem;
      color: #b7c7c0;

      .contact-icon {
        color: var(--tapco-bronze-400);
        margin-top: 2px;
        flex-shrink: 0;
      }

      a {
        color: inherit;
        &:hover {
          color: #ffffff;
        }
      }
    }

    .footer-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding-top: 2rem;
      font-size: 0.825rem;
      color: #8fa099;
    }

    .bottom-badges {
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }

    .iso-badge {
      display: inline-block;
      padding: 0.2rem 0.55rem;
      border-radius: var(--radius-sm);
      background: rgba(255, 255, 255, 0.07);
      border: 1px solid rgba(255, 255, 255, 0.12);
      font-size: 0.75rem;
      font-weight: 600;
      color: #c9d8d1;
    }

    @media (max-width: 991px) {
      .footer-grid {
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
      }
    }

    @media (max-width: 600px) {
      .footer-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      .footer-bottom {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class FooterComponent {
  readonly i18n = inject(I18nService);
}
