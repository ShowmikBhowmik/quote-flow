import { ChangeDetectionStrategy, Component, computed, inject, signal, viewChildren } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { COVERAGE_LIST } from '../../../core/data/coverages';
import { CoverageId } from '../../../core/models/quote.model';
import { QuoteStore } from '../../../core/services/quote-store.service';
import { Icon } from '../../../shared/ui/icon.component';
import { CoverageCard } from '../coverage-card.component';

@Component({
  selector: 'app-coverage-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, CoverageCard],
  template: `
    <div class="step">
      <header class="step-head">
        <h1 tabindex="-1">Choose your coverage</h1>
        <p class="lede">
          @if (store.businessClass(); as cls) {
            We pre-selected what most {{ cls.name.toLowerCase() }} businesses carry. Toggle anything; the premium reprices as you go.
          } @else {
            Toggle anything; the premium reprices as you go.
          }
        </p>
      </header>

      <div class="cards" role="group" aria-label="Coverages">
        @for (def of coverages; track def.id) {
          <app-coverage-card
            [definition]="def"
            [selection]="store.draft().coverages[def.id]"
            [annual]="annualFor(def.id)"
            [recommended]="isRecommended(def.id)"
            [dimmed]="expandedId() !== null && expandedId() !== def.id"
            (toggle)="store.setCoverage(def.id, $event)"
            (limitChange)="store.setCoverage(def.id, true, $event)"
          />
        }
      </div>

      @if (noEmployeesWithWc()) {
        <p class="callout" role="status"><app-icon name="info" [size]="18" /> You entered no employees, so workers' comp is rated at the minimum premium. Most states only require it once you hire.</p>
      }

      <p class="error" role="alert" [hidden]="!showEmptyError()"><app-icon name="alert" [size]="14" /> Select at least one coverage to continue.</p>

      <div class="actions">
        <a class="btn btn-secondary" routerLink="/quote/location"><app-icon name="arrowLeft" [size]="18" />Back</a>
        <button type="button" class="btn btn-primary" (click)="continue()">Review quote<app-icon name="arrowRight" [size]="18" /></button>
      </div>
    </div>
  `,
  styleUrl: './steps.scss',
})
export class CoverageStep {
  protected readonly store = inject(QuoteStore);
  private readonly router = inject(Router);
  protected readonly coverages = COVERAGE_LIST;
  private readonly cards = viewChildren(CoverageCard);
  protected readonly showEmptyError = signal(false);

  protected readonly expandedId = computed<CoverageId | null>(() => {
    const open = this.cards().find((c) => c.expanded());
    return open ? open.definition().id : null;
  });

  protected readonly noEmployeesWithWc = computed(
    () => this.store.draft().employees === 0 && this.store.draft().coverages.wc.selected,
  );

  constructor() {
    this.store.applyRecommendations();
  }

  protected annualFor(id: CoverageId): number | null {
    return this.store.premium().lines.find((l) => l.coverage === id)?.amount ?? null;
  }

  protected isRecommended(id: CoverageId): boolean {
    return this.store.businessClass()?.recommended.includes(id) ?? false;
  }

  protected continue(): void {
    if (!this.store.coverageComplete()) {
      this.showEmptyError.set(true);
      return;
    }
    this.router.navigateByUrl('/quote/summary');
  }
}
