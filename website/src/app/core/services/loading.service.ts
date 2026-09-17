import { Injectable, inject, signal, computed } from '@angular/core';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private readonly router = inject(Router);

  private readonly _isNavigating = signal(false);
  private readonly _httpRequestsCount = signal(0);
  private readonly _manualLoading = signal(false);

  readonly isNavigating = this._isNavigating.asReadonly();
  readonly httpRequestsCount = this._httpRequestsCount.asReadonly();
  readonly manualLoading = this._manualLoading.asReadonly();

  readonly isLoading = computed(() => {
    return this._isNavigating() || this._httpRequestsCount() > 0 || this._manualLoading();
  });

  constructor() {
    this.initRouterEvents();
  }

  private initRouterEvents(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this._isNavigating.set(true);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        setTimeout(() => {
          this._isNavigating.set(false);
        }, 150);
      }
    });
  }

  startHttp(): void {
    this._httpRequestsCount.update((c) => c + 1);
  }

  stopHttp(): void {
    this._httpRequestsCount.update((c) => Math.max(0, c - 1));
  }

  show(): void {
    this._manualLoading.set(true);
  }

  hide(): void {
    this._manualLoading.set(false);
  }
}
