import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { I18nService } from '../../core/services/i18n.service';
import { ApiService } from '../../core/services/api.service';
import { BlogPost } from '../../core/models/tapco.models';
import { IconComponent } from '../../shared/components/icon.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe, IconComponent, LoaderComponent],
  template: `
    <div class="blog-page">
      <!-- Page Hero Header -->
      <section class="page-hero">
        <div class="tapco-container">
          <span class="badge-tag bronze">{{ i18n.t('blog.title') }}</span>
          <h1 class="page-title">{{ i18n.t('blog.title') }}</h1>
          <p class="page-subtitle">{{ i18n.t('blog.subtitle') }}</p>
        </div>
      </section>

      <section class="section-padding">
        <div class="tapco-container">
          <!-- Search Toolbar -->
          <div class="blog-toolbar card-base">
            <div class="search-wrap">
              <app-icon name="search" [size]="18" class="search-icon" />
              <input
                type="text"
                [(ngModel)]="searchQuery"
                (keyup.enter)="loadPosts(1)"
                [placeholder]="i18n.currentLang() === 'ar' ? 'ابحث في مقالات الإرشاد الزراعي...' : 'Search agronomic articles...'"
                class="search-input"
              />
            </div>
            <button class="btn btn-primary" (click)="loadPosts(1)">
              <span>{{ i18n.currentLang() === 'ar' ? 'بحث' : 'Search' }}</span>
            </button>
          </div>

          @if (isLoading()) {
            <app-loader size="md" [text]="i18n.currentLang() === 'ar' ? 'جاري تحميل المقالات والأبحاث الزراعية...' : 'Loading agricultural research & articles...'" />
          } @else if (posts().length === 0) {
            <div class="empty-box card-base">
              <app-icon name="layers" [size]="52" class="empty-icon" />
              <h3>{{ i18n.currentLang() === 'ar' ? 'لم يتم العثور على مقالات.' : 'No articles found.' }}</h3>
            </div>
          } @else {
            <div class="blog-grid">
              @for (post of posts(); track post.id) {
                <article class="post-card card-base">
                  <div class="post-media">
                    @if (post.cover_image_url) {
                      <img [src]="post.cover_image_url" [alt]="i18n.getLocalized(post, 'title')" class="post-img" />
                    } @else {
                      <div class="post-placeholder">
                        <app-icon name="sprout" [size]="48" />
                      </div>
                    }
                  </div>

                  <div class="post-body">
                    <div class="post-meta">
                      <span class="meta-item">
                        <app-icon name="user" [size]="14" />
                        {{ post.author_name }}
                      </span>
                      @if (post.published_at) {
                        <span class="meta-item">
                          <app-icon name="calendar" [size]="14" />
                          {{ post.published_at | date:'mediumDate' }}
                        </span>
                      }
                    </div>

                    <h3 class="post-title">
                      <a [routerLink]="['/blog', post.slug]">
                        {{ i18n.getLocalized(post, 'title') }}
                      </a>
                    </h3>

                    <p class="post-excerpt">
                      {{ i18n.getLocalized(post, 'excerpt') }}
                    </p>

                    <a [routerLink]="['/blog', post.slug]" class="read-more-btn">
                      <span>{{ i18n.t('blog.read_more') }}</span>
                      <app-icon [name]="i18n.isRtl() ? 'arrow-left' : 'arrow-right'" [size]="16" />
                    </a>
                  </div>
                </article>
              }
            </div>
          }
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

    .blog-toolbar {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.25rem;
      margin-bottom: 3rem;
      max-width: 700px;
    }

    .search-wrap {
      position: relative;
      flex: 1;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      right: 0.75rem;
      color: var(--tapco-text-light);
    }

    html[dir="ltr"] .search-icon {
      right: auto;
      left: 0.75rem;
    }

    .search-input {
      width: 100%;
      padding: 0.65rem 2.25rem 0.65rem 0.85rem;
      border: 1.5px solid var(--tapco-border);
      border-radius: var(--radius-md);
      font-size: 0.9rem;
      &:focus {
        outline: none;
        border-color: var(--tapco-green-700);
      }
    }

    html[dir="ltr"] .search-input {
      padding: 0.65rem 0.85rem 0.65rem 2.25rem;
    }

    .blog-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 2rem;
    }

    .post-card {
      overflow: hidden;
      display: flex;
      flex-direction: column;
      background: #ffffff;
    }

    .post-media {
      aspect-ratio: 16 / 9;
      background: #eaf3ef;
      overflow: hidden;
    }

    .post-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .post-card:hover .post-img {
      
    }

    .post-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--tapco-green-700);
    }

    .post-body {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      flex: 1;
    }

    .post-meta {
      display: flex;
      align-items: center;
      gap: 1rem;
      font-size: 0.8rem;
      color: var(--tapco-text-light);
    }

    .meta-item {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
    }

    .post-title {
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--tapco-green-900);
      line-height: 1.4;

      a {
        color: inherit;
        &:hover { color: var(--tapco-bronze-600); }
      }
    }

    .post-excerpt {
      font-size: 0.925rem;
      line-height: 1.6;
      color: var(--tapco-text-muted);
    }

    .read-more-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--tapco-bronze-600);
      margin-top: auto;
      padding-top: 0.75rem;
      transition: gap 0.2s ease;

      &:hover {
        gap: 0.7rem;
        color: var(--tapco-bronze-700);
      }
    }

    .loading-box, .empty-box {
      padding: 4rem 2rem;
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

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 480px) {
      .blog-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class BlogListComponent implements OnInit {
  readonly i18n = inject(I18nService);
  private readonly api = inject(ApiService);

  readonly posts = signal<BlogPost[]>([]);
  readonly isLoading = signal(true);
  searchQuery = '';

  ngOnInit(): void {
    this.loadPosts(1);
  }

  loadPosts(page = 1): void {
    this.isLoading.set(true);
    this.api.getBlogPosts(page, this.searchQuery).subscribe({
      next: (res) => {
        this.posts.set(res?.data || []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }
}
