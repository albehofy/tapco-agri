import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <svg
      [attr.width]="size"
      [attr.height]="size"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      [attr.stroke-width]="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      [class]="class"
      style="display: inline-block; vertical-align: middle;"
    >
      @switch (name) {
        @case ('leaf') {
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
        }
        @case ('shield') {
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
        }
        @case ('shield-alert') {
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
          <path d="M12 8v4"/>
          <path d="M12 16h.01"/>
        }
        @case ('bug') {
          <path d="m8 2 1.88 1.88"/>
          <path d="M14.12 3.88 16 2"/>
          <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/>
          <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/>
          <path d="M12 20v-9"/>
          <path d="M6.53 9C4.6 8.8 3 7.1 3 5"/>
          <path d="M6 13H2"/>
          <path d="M3 21c0-2.1 1.7-3.9 3.8-4"/>
          <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4"/>
          <path d="M22 13h-4"/>
          <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4"/>
        }
        @case ('sprout') {
          <path d="M7 20h10"/>
          <path d="M10 20c5.5-2.5.8-6.4 3-10"/>
          <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/>
          <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>
        }
        @case ('droplets') {
          <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/>
          <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>
        }
        @case ('droplet') {
          <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>
        }
        @case ('scissors') {
          <circle cx="6" cy="6" r="3"/>
          <path d="M8.12 8.12 12 12"/>
          <path d="M20 4 8.12 15.88"/>
          <circle cx="6" cy="18" r="3"/>
          <path d="M14.8 14.8 20 20"/>
        }
        @case ('activity') {
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        }
        @case ('dna') {
          <path d="M2 15c6.667-6 13.333 0 20-6"/>
          <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993"/>
          <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993"/>
          <path d="m17 6-2.5-2.5"/>
          <path d="m14 8-1-1"/>
          <path d="m7 18 2.5 2.5"/>
          <path d="m3.5 14.5.5.5"/>
          <path d="m20 9 .5.5"/>
          <path d="m6.5 12.5 1 1"/>
          <path d="m16.5 10.5 1 1"/>
          <path d="m10 16 1 1"/>
          <path d="M2 9c6.667 6 13.333 0 20 6"/>
        }
        @case ('zap') {
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
        }
        @case ('layers') {
          <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/>
          <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/>
          <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>
        }
        @case ('search') {
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
        }
        @case ('filter') {
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
        }
        @case ('check') {
          <polyline points="20 6 9 17 4 12"/>
        }
        @case ('phone') {
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
        }
        @case ('mail') {
          <rect width="20" height="16" x="2" y="4" rx="2"/>
          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
        }
        @case ('map-pin') {
          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
          <circle cx="12" cy="10" r="3"/>
        }
        @case ('clock') {
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        }
        @case ('chevron-down') {
          <path d="m6 9 6 6 6-6"/>
        }
        @case ('chevron-up') {
          <path d="m18 15-6-6-6 6"/>
        }
        @case ('chevron-left') {
          <path d="m15 18-6-6 6-6"/>
        }
        @case ('chevron-right') {
          <path d="m9 18 6-6-6-6"/>
        }
        @case ('arrow-left') {
          <path d="m12 19-7-7 7-7"/>
          <path d="M19 12H5"/>
        }
        @case ('arrow-right') {
          <path d="M5 12h14"/>
          <path d="m12 5 7 7-7 7"/>
        }
        @case ('download') {
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" x2="12" y1="15" y2="3"/>
        }
        @case ('external-link') {
          <path d="M15 3h6v6"/>
          <path d="M10 14 21 3"/>
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        }
        @case ('menu') {
          <line x1="4" x2="20" y1="12" y2="12"/>
          <line x1="4" x2="20" y1="6" y2="6"/>
          <line x1="4" x2="20" y1="18" y2="18"/>
        }
        @case ('x') {
          <path d="M18 6 6 18"/>
          <path d="m6 6 12 12"/>
        }
        @case ('message-circle') {
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
        }
        @case ('award') {
          <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.747.468L12 19.746l-4.245 2.138a.5.5 0 0 1-.747-.468l1.515-8.526"/>
          <circle cx="12" cy="8" r="6"/>
        }
        @case ('calendar') {
          <path d="M8 2v4"/>
          <path d="M16 2v4"/>
          <rect width="18" height="18" x="3" y="4" rx="2"/>
          <path d="M3 10h18"/>
        }
        @case ('user') {
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        }
        @case ('alert-triangle') {
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        }
        @default {
          <circle cx="12" cy="12" r="10"/>
        }
      }
    </svg>
  `
})
export class IconComponent {
  @Input() name = 'leaf';
  @Input() size: string | number = 20;
  @Input() strokeWidth: string | number = 2;
  @Input() class = '';
}
