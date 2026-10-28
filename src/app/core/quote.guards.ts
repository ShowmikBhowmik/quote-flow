import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { QuoteStore, StepId } from './services/quote-store.service';

/** Keeps the visitor from deep-linking past a step they have not completed. */
export function stepGuard(step: StepId): CanActivateFn {
  return () => {
    const store = inject(QuoteStore);
    const router = inject(Router);
    if (store.canAccess(step)) return true;
    return router.parseUrl(store.firstIncompleteStep().path);
  };
}
