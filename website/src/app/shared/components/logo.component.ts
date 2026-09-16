import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [RouterLink],
  template: `
    <a routerLink="/" class="tapco-logo-wrapper" [class.inverted]="inverted">
      <img
        [src]="inverted ? '/tapco-logo-footer.png' : '/tapco-horizontal-logo.png'"
        alt="TAPCO Agriculture - مصنع تابكو للمستلزمات الزراعية"
        [style.height.px]="height"
        class="tapco-logo-img"
      />
    </a>
  `,
  styles: [`
    .tapco-logo-wrapper {
      display: inline-flex;
      align-items: center;
      text-decoration: none;
      transition: transform 0.2s ease, opacity 0.2s ease;
      
      &:hover {
        opacity: 0.95;
        
      }
    }

    .tapco-logo-img {
      width: auto;
      object-fit: contain;
      display: block;
    }
  `]
})
export class LogoComponent {
  @Input() height = 46;
  @Input() inverted = false;
}
