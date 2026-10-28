import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { COVERAGES } from '../../../core/data/coverages';
import { findState } from '../../../core/data/states';
import { InsuranceApi } from '../../../core/services/insurance-api.service';
import { QuoteStore } from '../../../core/services/quote-store.service';
import { Icon } from '../../../shared/ui/icon.component';
import { Money } from '../../../shared/ui/money.component';

@Component({
  selector: 'app-summary-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, ReactiveFormsModule, Icon, Money],
  template: `
    <div class="step">
      <header class="step-head">
        <h1 tabindex="-1">Review and bind</h1>
        <p class="lede">Check the details. Binding issues the policy immediately and posts the first invoice to your dashboard.</p>
      </header>

      <section class="review" aria-labelledby="rv-business">
        <div class="review-head">
          <h2 id="rv-business">Business</h2>
          <a routerLink="/quote/business" class="edit">Edit</a>
        </div>
        <dl class="dl">
          <div><dt>Name</dt><dd>{{ store.draft().businessName }}</dd></div>
          <div><dt>Class</dt><dd>{{ store.businessClass()?.name }}</dd></div>
          <div><dt>Years in business</dt><dd class="tnum">{{ store.draft().yearsInBusiness }}</dd></div>
        </dl>
      </section>

      <section class="review" aria-labelledby="rv-location">
        <div class="review-head">
          <h2 id="rv-location">Location and payroll</h2>
          <a routerLink="/quote/location" class="edit">Edit</a>
        </div>
        <dl class="dl">
          <div><dt>Location</dt><dd>{{ stateName() }} {{ store.draft().zip }}</dd></div>
          <div><dt>Employees</dt><dd class="tnum">{{ store.draft().employees }}</dd></div>
          <div><dt>Annual payroll</dt><dd class="tnum">{{ '$' + store.draft().annualPayroll.toLocaleString() }}</dd></div>
          <div><dt>Annual revenue</dt><dd class="tnum">{{ '$' + store.draft().annualRevenue.toLocaleString() }}</dd></div>
          <div><dt>Equipment and inventory</dt><dd class="tnum">{{ '$' + store.draft().propertyValue.toLocaleString() }}</dd></div>
        </dl>
      </section>

      <section class="review" aria-labelledby="rv-coverage">
        <div class="review-head">
          <h2 id="rv-coverage">Coverage</h2>
          <a routerLink="/quote/coverage" class="edit">Edit</a>
        </div>
        <table class="table">
          <thead><tr><th scope="col">Coverage</th><th scope="col">Limit</th><th scope="col" class="num">Annual</th></tr></thead>
          <tbody>
            @for (row of coverageRows(); track row.id) {
              <tr>
                <td><span class="swatch" [style.background]="'var(--line-' + row.id + ')'" aria-hidden="true"></span>{{ row.name }}</td>
                <td>{{ row.limit }}</td>
                <td class="num"><app-money [value]="row.annual" /></td>
              </tr>
            }
          </tbody>
        </table>
      </section>

      <div class="bind">
        <label class="agree">
          <input type="checkbox" [formControl]="agree" />
          <span>I confirm these details are accurate and I understand this is a demonstration, not a real insurance contract.</span>
        </label>
        @if (error(); as message) {
          <p class="error" role="alert"><app-icon name="alert" [size]="14" /> {{ message }}</p>
        }
        <div class="actions">
          <a class="btn btn-secondary" routerLink="/quote/coverage"><app-icon name="arrowLeft" [size]="18" />Back</a>
          <button type="button" class="btn btn-primary bind-btn" (click)="bind()" [disabled]="!agree.value || store.binding()" [attr.aria-busy]="store.binding()">
            @if (store.binding()) {
              <app-icon name="refresh" [size]="18" class="spin" /> Binding
            } @else {
              Bind policy for <app-money [value]="store.premium().annual" /> a year
            }
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './steps.scss',
})
export class SummaryStep {
  protected readonly store = inject(QuoteStore);
  private readonly api = inject(InsuranceApi);
  private readonly router = inject(Router);
  protected readonly agree = new FormControl(false, { nonNullable: true });
  protected readonly error = signal<string | null>(null);

  protected readonly stateName = computed(() => findState(this.store.draft().state)?.name ?? this.store.draft().state);

  protected readonly coverageRows = computed(() =>
    this.store.premium().lines
      .filter((l) => l.kind === 'coverage')
      .map((l) => {
        const def = COVERAGES[l.coverage!];
        const limit = def.limits.find((x) => x.id === this.store.draft().coverages[l.coverage!].limit)?.label ?? '';
        return { id: l.coverage!, name: def.name, limit, annual: l.amount };
      }),
  );

  protected bind(): void {
    if (!this.agree.value || this.store.binding()) return;
    this.error.set(null);
    this.store.binding.set(true);
    this.api.bind(this.store.draft()).subscribe({
      next: (policy) => {
        this.store.binding.set(false);
        this.store.boundPolicy.set(policy);
        this.router.navigateByUrl('/quote/bound');
      },
      error: (err: Error) => {
        this.store.binding.set(false);
        this.error.set(err.message || 'Something went wrong while binding. Try again.');
      },
    });
  }
}
