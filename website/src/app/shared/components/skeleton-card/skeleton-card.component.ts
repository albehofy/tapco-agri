import { Component } from '@angular/core';

@Component({
  selector: 'app-skeleton-card',
  standalone: true,
  template: `
    <div class="skeleton-card card-base">
      <div class="skeleton-img-wrap shimmer"></div>
      <div class="skeleton-content">
        <div class="skeleton-meta">
          <div class="skeleton-badge shimmer"></div>
          <div class="skeleton-pill shimmer"></div>
        </div>
        <div class="skeleton-title shimmer"></div>
        <div class="skeleton-subtitle shimmer"></div>
        <div class="skeleton-footer">
          <div class="skeleton-tag shimmer"></div>
          <div class="skeleton-btn shimmer"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    .skeleton-card {
      height: 100%;
      border-radius: var(--radius-lg);
      background: #ffffff;
      border: 1px solid var(--tapco-border-subtle);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .skeleton-img-wrap {
      width: 100%;
      height: 220px;
      background: #eef3f1;
    }

    .skeleton-content {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      flex: 1;
    }

    .skeleton-meta {
      display: flex;
      justify-content: space-between;
      gap: 0.5rem;
    }

    .skeleton-badge {
      width: 65px;
      height: 20px;
      border-radius: var(--radius-full);
      background: #eef3f1;
    }

    .skeleton-pill {
      width: 50px;
      height: 20px;
      border-radius: var(--radius-full);
      background: #eef3f1;
    }

    .skeleton-title {
      width: 85%;
      height: 22px;
      border-radius: var(--radius-sm);
      background: #eef3f1;
    }

    .skeleton-subtitle {
      width: 60%;
      height: 16px;
      border-radius: var(--radius-sm);
      background: #eef3f1;
    }

    .skeleton-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
      padding-top: 0.85rem;
      border-top: 1px solid var(--tapco-border-subtle);
    }

    .skeleton-tag {
      width: 70px;
      height: 18px;
      border-radius: var(--radius-sm);
      background: #eef3f1;
    }

    .skeleton-btn {
      width: 90px;
      height: 32px;
      border-radius: var(--radius-md);
      background: #eef3f1;
    }

    .shimmer {
      background: linear-gradient(
        90deg,
        rgba(238, 243, 241, 0.7) 0%,
        rgba(255, 255, 255, 0.9) 50%,
        rgba(238, 243, 241, 0.7) 100%
      );
      background-size: 200% 100%;
      animation: shimmer-pulse 1.6s infinite ease-in-out;
    }

    @keyframes shimmer-pulse {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `]
})
export class SkeletonCardComponent {}
