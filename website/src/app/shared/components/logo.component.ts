import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [RouterLink],
  template: `
    <a routerLink="/" class="tapco-logo-wrapper" [class.inverted]="inverted">
      <svg
        [attr.height]="height"
        viewBox="0 0 220 54"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="tapco-logo-svg"
      >
        <defs>
          <linearGradient id="tapcoLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#1b6b55" />
            <stop offset="50%" stop-color="#124336" />
            <stop offset="100%" stop-color="#0a261e" />
          </linearGradient>
          <linearGradient id="tapcoBronzeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#d8a25f" />
            <stop offset="45%" stop-color="#c48a44" />
            <stop offset="100%" stop-color="#8c5d25" />
          </linearGradient>
        </defs>

        <!-- Leaf-styled T Emblem -->
        <g transform="translate(6, 4)">
          <!-- Leaf left lobe / T bar -->
          <path
            d="M 6 12 C 14 5, 30 4, 38 12 C 32 15, 26 18, 22 22 L 22 42 C 22 44, 20 45, 18 45 C 16 45, 14 44, 14 42 L 14 20 C 10 18, 7 15, 6 12 Z"
            fill="url(#tapcoLeafGrad)"
          />
          <!-- Leaf right stylized arc -->
          <path
            d="M 22 14 C 28 8, 38 7, 44 14 C 41 22, 34 26, 26 28 L 22 24 Z"
            fill="#27876a"
            opacity="0.9"
          />
          <!-- Central vein curve -->
          <path
            d="M 18 42 C 18 28, 24 16, 36 9"
            stroke="#dcf0e8"
            stroke-width="2"
            stroke-linecap="round"
          />
        </g>

        <!-- TAPCO Brand Name in Bronze -->
        <text
          x="58"
          y="35"
          font-family="'Inter', sans-serif"
          font-weight="900"
          font-size="28"
          letter-spacing="2.5"
          fill="url(#tapcoBronzeGrad)"
        >
          TAPCO
        </text>

        <!-- Agriculture Sub-line -->
        <text
          x="60"
          y="48"
          font-family="'Inter', sans-serif"
          font-weight="600"
          font-size="8.5"
          letter-spacing="4.5"
          [attr.fill]="inverted ? '#eef7f3' : '#124336'"
          opacity="0.9"
        >
          AGRICULTURE
        </text>
      </svg>
    </a>
  `,
  styles: [`
    .tapco-logo-wrapper {
      display: inline-flex;
      align-items: center;
      text-decoration: none;
      transition: opacity 0.2s ease;
      &:hover {
        opacity: 0.92;
      }
    }
  `]
})
export class LogoComponent {
  @Input() height = 44;
  @Input() inverted = false;
}
