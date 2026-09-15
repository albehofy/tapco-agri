import { Component, inject, signal, HostListener, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { I18nService } from '../../../core/services/i18n.service';
import { ApiService } from '../../../core/services/api.service';
import { Category } from '../../../core/models/tapco.models';
import { LogoComponent } from '../logo.component';
import { IconComponent } from '../icon.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, LogoComponent, IconComponent],
  template: `
    <header class="tapco-header" [class.is-scrolled]="isScrolled()">
      <!-- Top announcement / contacts bar -->
      <div class="top-bar">
        <div class="tapco-container top-bar-content">
          <div class="top-contacts">
            <span class="top-item">
              <app-icon name="phone" [size]="14" />
              <a href="tel:+20223456789" dir="ltr">+20 2 2345 6789</a>
            </span>
            <span class="top-item hide-mobile">
              <app-icon name="mail" [size]="14" />
              <a href="mailto:info@tapco-agri.com">info&#64;tapco-agri.com</a>
            </span>
            <span class="top-item hide-mobile">
              <app-icon name="map-pin" [size]="14" />
              <span>{{ i18n.currentLang() === 'ar' ? 'مدينة السادات • مصر' : 'Sadat City • Egypt' }}</span>
            </span>
          </div>

          <div class="top-actions">
            <!-- Language Switcher -->
            <button
              class="lang-btn"
              (click)="i18n.toggleLanguage()"
              [title]="i18n.currentLang() === 'ar' ? 'Switch to English' : 'التحويل للعربية'"
            >
              <app-icon name="globe" [size]="14" />
              <span class="lang-text">{{ i18n.currentLang() === 'ar' ? 'English' : 'عربي' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Main Navigation Bar -->
      <div class="main-navbar">
        <div class="tapco-container nav-container">
          <!-- Brand Logo -->
          <app-logo [height]="42" />

          <!-- Desktop Navigation Menu -->
          <nav class="desktop-nav">
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">
              {{ i18n.t('nav.home') }}
            </a>
            <a routerLink="/about" routerLinkActive="active" class="nav-link">
              {{ i18n.t('nav.about') }}
            </a>

            <!-- Products dropdown -->
            <div class="nav-dropdown" (mouseenter)="isDropdownOpen.set(true)" (mouseleave)="isDropdownOpen.set(false)">
              <a routerLink="/products" routerLinkActive="active" class="nav-link dropdown-trigger">
                <span>{{ i18n.t('nav.products') }}</span>
                <app-icon name="chevron-down" [size]="14" class="dropdown-chevron" />
              </a>

              @if (isDropdownOpen()) {
                <div class="dropdown-menu">
                  <a routerLink="/products" class="dropdown-item featured-cat">
                    <app-icon name="layers" [size]="16" class="cat-icon" />
                    <span class="cat-name">{{ i18n.t('nav.all_categories') }}</span>
                  </a>
                  @for (cat of rootCategories(); track cat.id) {
                    <a [routerLink]="['/products']" [queryParams]="{category: cat.slug}" class="dropdown-item">
                      <app-icon [name]="cat.icon || 'leaf'" [size]="16" class="cat-icon" />
                      <div class="cat-text">
                        <span class="cat-name">{{ i18n.getLocalized(cat, 'name') }}</span>
                        @if (cat.products_count) {
                          <span class="cat-count">({{ cat.products_count }})</span>
                        }
                      </div>
                    </a>
                  }
                </div>
              }
            </div>

            <a routerLink="/solutions" routerLinkActive="active" class="nav-link">
              {{ i18n.t('nav.solutions') }}
            </a>
            <a routerLink="/blog" routerLinkActive="active" class="nav-link">
              {{ i18n.t('nav.blog') }}
            </a>
            <a routerLink="/contact" routerLinkActive="active" class="nav-link">
              {{ i18n.t('nav.contact') }}
            </a>
          </nav>

          <!-- Action CTA & Mobile Toggle -->
          <div class="nav-right">
            <a
              href="https://wa.me/201012345678?text={{ encodeText(i18n.t('whatsapp.prefill')) }}"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-whatsapp header-wa-btn"
            >
              <app-icon name="message-circle" [size]="18" />
              <span class="wa-label hide-on-narrow">{{ i18n.currentLang() === 'ar' ? 'تواصل واتساب' : 'WhatsApp' }}</span>
            </a>

            <!-- Mobile Hamburger Button -->
            <button class="mobile-toggle-btn" (click)="toggleMobileMenu()" aria-label="Toggle navigation">
              <app-icon [name]="isMobileMenuOpen() ? 'x' : 'menu'" [size]="24" />
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Drawer Menu -->
      @if (isMobileMenuOpen()) {
        <div class="mobile-drawer-overlay" (click)="closeMobileMenu()">
          <div class="mobile-drawer" (click)="$event.stopPropagation()">
            <div class="drawer-header">
              <app-logo [height]="36" />
              <button class="close-drawer-btn" (click)="closeMobileMenu()">
                <app-icon name="x" [size]="22" />
              </button>
            </div>

            <nav class="mobile-nav-links">
              <a routerLink="/" (click)="closeMobileMenu()" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="mobile-nav-link">
                {{ i18n.t('nav.home') }}
              </a>
              <a routerLink="/about" (click)="closeMobileMenu()" routerLinkActive="active" class="mobile-nav-link">
                {{ i18n.t('nav.about') }}
              </a>
              <a routerLink="/products" (click)="closeMobileMenu()" routerLinkActive="active" class="mobile-nav-link">
                {{ i18n.t('nav.products') }}
              </a>

              <!-- Sub categories in mobile -->
              <div class="mobile-sub-cats">
                @for (cat of rootCategories(); track cat.id) {
                  <a [routerLink]="['/products']" [queryParams]="{category: cat.slug}" (click)="closeMobileMenu()" class="mobile-sub-link">
                    <span class="dot">•</span>
                    {{ i18n.getLocalized(cat, 'name') }}
                  </a>
                }
              </div>

              <a routerLink="/solutions" (click)="closeMobileMenu()" routerLinkActive="active" class="mobile-nav-link">
                {{ i18n.t('nav.solutions') }}
              </a>
              <a routerLink="/blog" (click)="closeMobileMenu()" routerLinkActive="active" class="mobile-nav-link">
                {{ i18n.t('nav.blog') }}
              </a>
              <a routerLink="/contact" (click)="closeMobileMenu()" routerLinkActive="active" class="mobile-nav-link">
                {{ i18n.t('nav.contact') }}
              </a>
            </nav>

            <div class="mobile-drawer-footer">
              <button class="btn btn-outline mobile-lang-toggle" (click)="i18n.toggleLanguage(); closeMobileMenu()">
                <app-icon name="globe" [size]="16" />
                <span>{{ i18n.currentLang() === 'ar' ? 'Switch to English' : 'التحويل إلى العربية' }}</span>
              </button>

              <a
                href="https://wa.me/201012345678?text={{ encodeText(i18n.t('whatsapp.prefill')) }}"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-whatsapp"
                style="width: 100%; margin-top: 0.75rem;"
              >
                <app-icon name="message-circle" [size]="18" />
                <span>{{ i18n.currentLang() === 'ar' ? 'تواصل عبر واتساب' : 'WhatsApp Contact' }}</span>
              </a>
            </div>
          </div>
        </div>
      }
    </header>
  `,
  styles: [`
    .tapco-header {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: var(--tapco-bg-surface);
      box-shadow: var(--shadow-sm);
      transition: all 0.3s ease;
      &.is-scrolled {
        box-shadow: 0 4px 20px rgba(10, 38, 30, 0.12);
      }
    }

    .top-bar {
      background-color: var(--tapco-green-900);
      color: #e5ede9;
      font-size: 0.8125rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding: 0.35rem 0;
    }

    .top-bar-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .top-contacts {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .top-item {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      color: #c9d8d1;
      a {
        color: inherit;
        &:hover { color: #ffffff; }
      }
    }

    .lang-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      background: rgba(255, 255, 255, 0.12);
      color: #ffffff;
      padding: 0.25rem 0.65rem;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 600;
      transition: background 0.2s ease;
      &:hover {
        background: rgba(255, 255, 255, 0.22);
      }
    }

    .main-navbar {
      padding: 0.75rem 0;
      background: #ffffff;
    }

    .nav-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }

    .desktop-nav {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .nav-link {
      font-weight: 600;
      font-size: 0.9375rem;
      color: var(--tapco-text-main);
      padding: 0.5rem 0.25rem;
      position: relative;
      transition: color 0.2s ease;

      &:hover, &.active {
        color: var(--tapco-green-700);
      }

      &.active::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2.5px;
        background: var(--tapco-bronze-500);
        border-radius: 2px;
      }
    }

    .nav-dropdown {
      position: relative;
    }

    .dropdown-trigger {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
    }

    .dropdown-chevron {
      transition: transform 0.2s ease;
    }

    .nav-dropdown:hover .dropdown-chevron {
      transform: rotate(180deg);
    }

    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      min-width: 240px;
      background: #ffffff;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      border: 1px solid var(--tapco-border);
      padding: 0.5rem;
      margin-top: 0.5rem;
      z-index: 1001;
      animation: fadeIn 0.2s ease;
    }

    html[dir="rtl"] .dropdown-menu {
      left: auto;
      right: 0;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.6rem 0.75rem;
      border-radius: var(--radius-sm);
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--tapco-text-main);
      transition: background 0.15s ease, color 0.15s ease;

      &:hover {
        background-color: var(--tapco-green-50);
        color: var(--tapco-green-800);
      }

      &.featured-cat {
        font-weight: 700;
        border-bottom: 1px solid var(--tapco-border-subtle);
        margin-bottom: 0.35rem;
        color: var(--tapco-green-700);
      }
    }

    .cat-count {
      font-size: 0.75rem;
      color: var(--tapco-text-light);
      margin-inline-start: 0.25rem;
    }

    .nav-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .header-wa-btn {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }

    .mobile-toggle-btn {
      display: none;
      color: var(--tapco-green-900);
      padding: 0.4rem;
      border-radius: var(--radius-sm);
    }

    /* Mobile Drawer */
    .mobile-drawer-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.45);
      z-index: 2000;
      display: flex;
    }

    .mobile-drawer {
      width: 85%;
      max-width: 320px;
      min-width: 260px;
      height: 100%;
      background: #ffffff;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      box-shadow: var(--shadow-lg);
    }

    .drawer-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--tapco-border);
      margin-bottom: 1rem;
    }

    .mobile-nav-links {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      flex: 1;
    }

    .mobile-nav-link {
      padding: 0.75rem 0.5rem;
      font-weight: 600;
      font-size: 1rem;
      color: var(--tapco-text-main);
      border-radius: var(--radius-sm);

      &.active {
        background-color: var(--tapco-green-50);
        color: var(--tapco-green-700);
      }
    }

    .mobile-sub-cats {
      padding-inline-start: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      margin-bottom: 0.5rem;
    }

    .mobile-sub-link {
      font-size: 0.875rem;
      color: var(--tapco-text-muted);
      padding: 0.35rem 0;
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }

    .mobile-drawer-footer {
      padding-top: 1.25rem;
      border-top: 1px solid var(--tapco-border);
      margin-top: auto;
    }

    .mobile-lang-toggle {
      width: 100%;
      font-size: 0.875rem;
    }

    /* Responsive Breakpoints */
    @media (max-width: 991px) {
      .desktop-nav {
        display: none;
      }
      .mobile-toggle-btn {
        display: inline-flex;
      }
    }

    @media (max-width: 600px) {
      .hide-mobile {
        display: none;
      }
      .hide-on-narrow {
        display: none;
      }
    }

    @media (max-width: 320px) {
      .header-wa-btn {
        padding: 0.4rem 0.6rem;
      }
      .mobile-drawer {
        width: 100%;
        max-width: 100%;
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-6px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class NavbarComponent implements OnInit {
  readonly i18n = inject(I18nService);
  private readonly api = inject(ApiService);

  readonly isScrolled = signal(false);
  readonly isDropdownOpen = signal(false);
  readonly isMobileMenuOpen = signal(false);
  readonly rootCategories = signal<Category[]>([]);

  ngOnInit(): void {
    this.api.getCategories().subscribe({
      next: (res) => {
        if (res?.data) {
          this.rootCategories.set(res.data);
        }
      },
      error: () => {}
    });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled.set(window.scrollY > 20);
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  encodeText(str: string): string {
    return encodeURIComponent(str);
  }
}
