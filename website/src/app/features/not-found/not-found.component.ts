import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/services/i18n.service';
import { IconComponent } from '../../shared/components/icon.component';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, IconComponent],
  template: `
    <div class="notfound-page tapco-container">
      <div class="notfound-box card-base">
        <div class="notfound-glyph">
          <app-icon name="sprout" [size]="72" class="glyph-icon" />
          <span class="code-tag">404</span>
        </div>
        <h1 class="notfound-title">{{ i18n.t('notfound.title') }}</h1>
        <p class="notfound-desc">{{ i18n.t('notfound.desc') }}</p>
        <a routerLink="/" class="btn btn-bronze home-btn">
          <app-icon [name]="i18n.isRtl() ? 'arrow-right' : 'arrow-left'" [size]="18" />
          <span>{{ i18n.t('notfound.btn') }}</span>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .notfound-page {
      min-height: 70vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 4rem 1rem;
    }

    .notfound-box {
      max-width: 540px;
      width: 100%;
      padding: 4rem 2rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.25rem;
      background: #ffffff;
    }

    .notfound-glyph {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.5rem;

      .glyph-icon {
        color: var(--tapco-green-100);
      }

      .code-tag {
        position: absolute;
        font-family: var(--font-latin);
        font-size: 2.75rem;
        font-weight: 900;
        color: var(--tapco-green-800);
        letter-spacing: 0.05em;
      }
    }

    .notfound-title {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--tapco-green-900);
    }

    .notfound-desc {
      font-size: 1rem;
      color: var(--tapco-text-muted);
      line-height: 1.6;
    }

    .home-btn {
      margin-top: 1rem;
      padding: 0.75rem 1.75rem;
    }
  `]
})
export class NotFoundComponent {
  readonly i18n = inject(I18nService);
}
