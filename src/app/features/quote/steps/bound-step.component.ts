import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { COVERAGES } from '../../../core/data/coverages';
import { QuoteStore } from '../../../core/services/quote-store.service';
import { Icon } from '../../../shared/ui/icon.component';
import { Money } from '../../../shared/ui/money.component';

@Component({
  selector: 'app-bound-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon, Money, DatePipe],
  template: `
    @if (store.boundPolicy(); as policy) {
      <div class="step bound">
        <header class="step-head">
          <p class="sr-only">Policy bound.</p>
          <h1 tabindex="-1" class="policy-number tnum" data-testid="policy-number">{{ policy.number }}</h1>
          <p class="lede">{{ policy.businessName }} is covered from {{ policy.effectiveDate | date }} to {{ policy.expirationDate | date }}.</p>
        </header>

        <div class="stamp" aria-hidden="true">Bound</div>

        <table class="table">
          <thead><tr><th scope="col">Coverage</th><th scope="col">Limit</th><th scope="col" class="num">Annual</th></tr></thead>
          <tbody>
            @for (c of policy.coverages; track c.id) {
              <tr>
                <td><span class="swatch" [style.background]="'var(--line-' + c.id + ')'" aria-hidden="true"></span>{{ coverageName(c.id) }}</td>
                <td>{{ limitLabel(c.id, c.limit) }}</td>
                <td class="num"><app-money [value]="c.annual" /></td>
              </tr>
            }
            <tr class="total"><td colspan="2">Annual premium</td><td class="num"><app-money [value]="policy.annualPremium" /></td></tr>
          </tbody>
        </table>

        <p class="next">Your first invoice is on the dashboard. Documents would normally arrive by email within a few minutes.</p>

        <div class="actions">
          <a class="btn btn-primary" routerLink="/dashboard/policies">Open the dashboard<app-icon name="arrowRight" [size]="18" /></a>
          <button type="button" class="btn btn-secondary" (click)="startOver()">Start another quote</button>
        </div>
      </div>
    }
  `,
  styleUrl: './steps.scss',
})
export class BoundStep {
  protected readonly store = inject(QuoteStore);
  private readonly router = inject(Router);

  protected coverageName(id: keyof typeof COVERAGES): string {
    return COVERAGES[id].name;
  }

  protected limitLabel(id: keyof typeof COVERAGES, limit: string): string {
    return COVERAGES[id].limits.find((l) => l.id === limit)?.label ?? limit;
  }

  protected startOver(): void {
    this.store.reset();
    this.router.navigateByUrl('/quote/business');
  }
}
