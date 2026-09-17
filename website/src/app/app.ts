import { Component, inject } from '@angular/core';
import { RouterOutlet, Router, Scroll } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { WhatsappFloatingComponent } from './shared/components/whatsapp-floating/whatsapp-floating.component';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { LoadingService } from './core/services/loading.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, WhatsappFloatingComponent, LoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  readonly loadingService = inject(LoadingService);
  private readonly router = inject(Router);
  private readonly viewportScroller = inject(ViewportScroller);
  private previousPath = '';

  constructor() {
    this.router.events.pipe(
      filter((e): e is Scroll => e instanceof Scroll)
    ).subscribe(e => {
      if (e.position) {
        // Back / Forward browser navigation: restore previous scroll position
        this.viewportScroller.scrollToPosition(e.position);
      } else if (e.anchor) {
        this.viewportScroller.scrollToAnchor(e.anchor);
      } else {
        const routerEvent = e.routerEvent;
        const currentUrl = ('urlAfterRedirects' in routerEvent ? routerEvent.urlAfterRedirects : routerEvent.url) || '';
        const currentPath = currentUrl.split('?')[0];

        // Only scroll to top if the URL path actually changed (navigating to a new page).
        // If the path is the same (filtering, search query, sorting), retain scroll position!
        if (currentPath !== this.previousPath) {
          this.viewportScroller.scrollToPosition([0, 0]);
        }
        this.previousPath = currentPath;
      }
    });
  }
}
