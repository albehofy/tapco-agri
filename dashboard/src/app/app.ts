import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, Router, Scroll } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { filter } from 'rxjs';
import { LoadingService } from './core/services/loading.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('dashboard');
  readonly loadingService = inject(LoadingService);
  private readonly router = inject(Router);
  private readonly viewportScroller = inject(ViewportScroller);
  private previousPath = '';

  constructor() {
    this.router.events.pipe(
      filter((e): e is Scroll => e instanceof Scroll)
    ).subscribe(e => {
      if (e.position) {
        this.viewportScroller.scrollToPosition(e.position);
      } else if (e.anchor) {
        this.viewportScroller.scrollToAnchor(e.anchor);
      } else {
        const routerEvent = e.routerEvent;
        const currentUrl = ('urlAfterRedirects' in routerEvent ? routerEvent.urlAfterRedirects : routerEvent.url) || '';
        const currentPath = currentUrl.split('?')[0];
        if (currentPath !== this.previousPath) {
          this.viewportScroller.scrollToPosition([0, 0]);
        }
        this.previousPath = currentPath;
      }
    });
  }
}
