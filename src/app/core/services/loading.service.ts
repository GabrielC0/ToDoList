import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private requestCount = signal(0);

  public isLoading = this.requestCount.asReadonly();

  incrementRequestCount(): void {
    this.requestCount.update((count) => count + 1);
  }

  decrementRequestCount(): void {
    this.requestCount.update((count) => Math.max(0, count - 1));
  }

  resetRequestCount(): void {
    this.requestCount.set(0);
  }
}
