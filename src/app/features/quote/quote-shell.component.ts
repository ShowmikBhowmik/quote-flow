import { ChangeDetectionStrategy, Component, computed, ElementRef, inject, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { QuoteStore, StepId, STEPS } from '../../core/services/quote-store.service';
import { Stepper } from '../../shared/ui/stepper.component';
import { PremiumLedger } from './premium-ledger.component';

/**
 * Two columns: the current step on the left, the premium ledger on the right.
 * On narrow screens the ledger docks to the bottom of the viewport.
 */
@Component({
  selector: 'app-quote-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Stepper, PremiumLedger],
  template: `
    <div class="wrap" [class.bound]="step() === 'bound'">
      <div class="step-col" #stepCol>
        @if (step() !== 'bound') {
          <app-stepper [current]="step()" />
        }
        <router-outlet (activate)="focusHeading()" />
      </div>
      @if (step() !== 'bound') {
        <aside class="ledger-col" aria-label="Premium">
          <app-premium-ledger [premium]="store.premium()" [compact]="step() === 'business'" />
        </aside>
      }
    </div>
  `,
  styles: `
    .wrap { max-inline-size: var(--content-max); margin-inline: auto; padding: var(--s-6) var(--s-5) var(--s-7); display: grid; grid-template-columns: minmax(0, 7fr) minmax(300px, 5fr); gap: var(--s-8); align-items: start; }
    .wrap.bound { grid-template-columns: minmax(0, 1fr); max-inline-size: 820px; }
    .step-col { display: grid; gap: var(--s-6); min-inline-size: 0; }
    .ledger-col { position: sticky; inset-block-start: calc(var(--header-h) + var(--s-5)); }
    @media (max-width: 960px) {
      .wrap { grid-template-columns: minmax(0, 1fr); gap: var(--s-5); padding: var(--s-5) var(--s-4) calc(var(--s-7) + 96px); }
      .ledger-col { position: static; }
    }
  `,
})
export class QuoteShell {
  protected readonly store = inject(QuoteStore);
  private readonly router = inject(Router);
  private readonly stepCol = viewChild.required<ElementRef<HTMLElement>>('stepCol');
  private navigations = 0;

  private readonly url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  protected readonly step = computed<StepId>(() => {
    const url = this.url();
    return STEPS.find((s) => url.startsWith(s.path))?.id ?? 'business';
  });

  /** Move focus to the new step's heading so keyboard and screen-reader users land in the right place. */
  protected focusHeading(): void {
    this.navigations += 1;
    if (this.navigations === 1) return;
    queueMicrotask(() => {
      const heading = this.stepCol().nativeElement.querySelector<HTMLElement>('h1');
      heading?.focus({ preventScroll: false });
    });
  }
}
