import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { I18nService } from '../../core/services/i18n.service';
import { ApiService } from '../../core/services/api.service';
import { BlogPost } from '../../core/models/tapco.models';
import { IconComponent } from '../../shared/components/icon.component';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [RouterLink, DatePipe, IconComponent],
  template: `
    @if (isLoading()) {
      <div class="loading-box">
        <div class="spinner"></div>
        <p>{{ i18n.currentLang() === 'ar' ? 'جاري تحميل المقال...' : 'Loading article...' }}</p>
      </div>
    } @else if (!post()) {
      <div class="tapco-container section-padding">
        <div class="not-found-card card-base">
          <h2>{{ i18n.currentLang() === 'ar' ? 'عذرًا، لم يتم العثور على هذا المقال' : 'Article Not Found' }}</h2>
          <a routerLink="/blog" class="btn btn-bronze">{{ i18n.t('blog.title') }}</a>
        </div>
      </div>
    } @else {
      <div class="blog-detail-page">
        <!-- Article Header Hero -->
        <section class="article-hero">
          <div class="tapco-container">
            <div class="article-hero-content">
              <span class="badge-tag bronze">{{ i18n.t('blog.title') }}</span>
              <h1 class="article-title">{{ i18n.getLocalized(post()!, 'title') }}</h1>
              
              <div class="article-meta">
                <span class="meta-item">
                  <app-icon name="user" [size]="16" />
                  <strong>{{ post()!.author_name }}</strong>
                </span>
                @if (post()!.published_at) {
                  <span class="meta-item">
                    <app-icon name="calendar" [size]="16" />
                    <span>{{ post()!.published_at | date:'mediumDate' }}</span>
                  </span>
                }
              </div>
            </div>
          </div>
        </section>

        <!-- Main Article Body -->
        <section class="section-padding">
          <div class="tapco-container">
            <div class="article-layout">
              <div class="article-body card-base">
                @if (post()!.cover_image_url) {
                  <div class="article-cover">
                    <img [src]="post()!.cover_image_url!" [alt]="i18n.getLocalized(post()!, 'title')" class="cover-img" />
                  </div>
                }

                @if (post()!.excerpt_ar || post()!.excerpt_en) {
                  <p class="article-lead">
                    {{ i18n.getLocalized(post()!, 'excerpt') }}
                  </p>
                }

                <!-- Render rich HTML content safely -->
                <div class="article-html-content" [innerHTML]="i18n.getLocalized(post()!, 'content')"></div>

                <!-- Share bar -->
                <div class="article-footer-bar">
                  <span class="share-label">{{ i18n.currentLang() === 'ar' ? 'مشاركة المقال:' : 'Share article:' }}</span>
                  <div class="share-buttons">
                    <a [href]="getShareLink('whatsapp')" target="_blank" class="share-btn wa" title="WhatsApp">
                      <app-icon name="message-circle" [size]="18" />
                    </a>
                    <a [href]="getShareLink('facebook')" target="_blank" class="share-btn fb" title="Facebook">
                      <app-icon name="globe" [size]="18" />
                    </a>
                  </div>
                </div>
              </div>

              <!-- Sidebar: Recent Articles -->
              <aside class="article-sidebar">
                <div class="recent-box card-base">
                  <h3 class="side-title">{{ i18n.t('blog.recent') }}</h3>
                  <div class="recent-list">
                    @for (rec of post()!.recent_posts || []; track rec.id) {
                      <a [routerLink]="['/blog', rec.slug]" class="recent-item">
                        <span class="rec-title">{{ i18n.getLocalized(rec, 'title') }}</span>
                        @if (rec.published_at) {
                          <span class="rec-date">{{ rec.published_at | date:'shortDate' }}</span>
                        }
                      </a>
                    }
                  </div>
                </div>

                <!-- CTA Widget -->
                <div class="side-cta card-base">
                  <app-icon name="sprout" [size]="36" class="side-cta-icon" />
                  <h4>{{ i18n.currentLang() === 'ar' ? 'استشارة زراعية مجانية' : 'Free Agronomic Advice' }}</h4>
                  <p>{{ i18n.currentLang() === 'ar' ? 'تواصل مع خبراء TAPCO لحل أي مشكلة في مزرعتك.' : 'Consult TAPCO experts for specialized crop care.' }}</p>
                  <a routerLink="/contact" class="btn btn-bronze" style="width: 100%;">
                    {{ i18n.t('nav.contact') }}
                  </a>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </div>
    }
  `,
  styles: [`
    .article-hero {
      background: linear-gradient(135deg, var(--tapco-green-900) 0%, var(--tapco-green-800) 100%);
      color: #ffffff;
      padding: 4.5rem 0 3.5rem;
      border-bottom: 3px solid var(--tapco-bronze-500);
    }

    .article-hero-content {
      max-width: 850px;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .article-title {
      font-size: clamp(1.85rem, 3.5vw, 2.75rem);
      font-weight: 800;
      line-height: 1.3;
      color: #ffffff;
    }

    .article-meta {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      font-size: 0.9rem;
      color: #c9d8d1;
    }

    .meta-item {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
    }

    .article-layout {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 3rem;
      align-items: flex-start;
    }

    .article-body {
      padding: 2.5rem;
      background: #ffffff;
    }

    .article-cover {
      margin: -2.5rem -2.5rem 2rem;
      aspect-ratio: 16 / 9;
      overflow: hidden;
      background: #eaf3ef;
    }

    .cover-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .article-lead {
      font-size: 1.15rem;
      font-weight: 600;
      line-height: 1.8;
      color: var(--tapco-green-900);
      background: var(--tapco-green-50);
      padding: 1.25rem 1.5rem;
      border-radius: var(--radius-md);
      margin-bottom: 2rem;
      border-inline-start: 4px solid var(--tapco-green-700);
    }

    .article-html-content {
      font-size: 1.05rem;
      line-height: 1.85;
      color: var(--tapco-text-main);

      p { margin-bottom: 1.25rem; }
      h2, h3, h4 {
        color: var(--tapco-green-900);
        margin: 2rem 0 1rem;
        font-weight: 700;
      }
      ul, ol {
        margin-inline-start: 1.5rem;
        margin-bottom: 1.5rem;
        li { margin-bottom: 0.5rem; }
      }
    }

    .article-footer-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid var(--tapco-border);
      padding-top: 1.5rem;
      margin-top: 3rem;
    }

    .share-label {
      font-weight: 600;
      color: var(--tapco-text-muted);
    }

    .share-buttons {
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }

    .share-btn {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      transition: transform 0.2s ease;

      &:hover {  }

      &.wa { background-color: #25D366; }
      &.fb { background-color: #1877F2; }
    }

    .article-sidebar {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .recent-box {
      padding: 1.5rem;
      background: #ffffff;
    }

    .side-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--tapco-green-900);
      margin-bottom: 1.25rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid var(--tapco-border-subtle);
    }

    .recent-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .recent-item {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--tapco-border-subtle);

      &:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }

      .rec-title {
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--tapco-text-main);
        line-height: 1.4;
        &:hover { color: var(--tapco-bronze-600); }
      }

      .rec-date {
        font-size: 0.8rem;
        color: var(--tapco-text-light);
      }
    }

    .side-cta {
      padding: 2rem 1.5rem;
      background: linear-gradient(135deg, var(--tapco-green-900) 0%, #0d382c 100%);
      color: #ffffff;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.85rem;

      .side-cta-icon { color: var(--tapco-bronze-400); }
      h4 { font-size: 1.2rem; font-weight: 700; color: #ffffff; }
      p { font-size: 0.875rem; color: #c9d8d1; line-height: 1.5; }
    }

    .loading-box {
      padding: 6rem 2rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3.5px solid var(--tapco-border);
      border-top-color: var(--tapco-green-700);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @media (max-width: 991px) {
      .article-layout {
        grid-template-columns: 1fr;
      }
      .article-body {
        padding: 1.5rem;
      }
      .article-cover {
        margin: -1.5rem -1.5rem 1.5rem;
      }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class BlogDetailComponent implements OnInit {
  readonly i18n = inject(I18nService);
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);

  readonly post = signal<BlogPost | null>(null);
  readonly isLoading = signal(true);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.loadPost(slug);
      }
    });
  }

  loadPost(slug: string): void {
    this.isLoading.set(true);
    this.api.getBlogPostBySlug(slug).subscribe({
      next: (res) => {
        this.post.set(res.data || null);
        this.isLoading.set(false);
      },
      error: () => {
        this.post.set(null);
        this.isLoading.set(false);
      }
    });
  }

  getShareLink(platform: 'whatsapp' | 'facebook'): string {
    const url = typeof window !== 'undefined' ? window.location.href : 'https://tapco-agri.com';
    const text = this.post() ? this.i18n.getLocalized(this.post()!, 'title') : '';
    if (platform === 'whatsapp') {
      return `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
    }
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  }
}
