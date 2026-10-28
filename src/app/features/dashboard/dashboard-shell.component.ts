import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { InsuranceApi } from '../../core/services/insurance-api.service';
import { Icon } from '../../shared/ui/icon.component';
import { Money } from '../../shared/ui/money.component';
import { Skeleton } from '../../shared/ui/skeleton.component';

@Component({
  selector: 'app-dashboard-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Icon, Money, Skeleton],
  template: `
    <div class="wrap">
      <header class="head">
        <div>
          <h1>Fernway Coffee Roasters</h1>
          <p class="muted">Account overview. Demo data for a fictional policyholder.</p>
        </div>
        <a routerLink="/quote/business" class="btn btn-secondary btn-sm">New quote<app-icon name="arrowRight" [size]="16" /></a>
      </header>

      <dl class="snapshot" aria-busy="{{ snapshot.isLoading() }}">
        <div>
          <dt>Active policies</dt>
          <dd class="tnum">@if (snapshot.hasValue()) { {{ snapshot.value().activePolicies }} } @else { <app-skeleton width="2ch" height="1.4em" /> }</dd>
        </div>
        <div>
          <dt>Annual premium</dt>
          <dd class="tnum">@if (snapshot.hasValue()) { <app-money [value]="snapshot.value().annualPremium" /> } @else { <app-skeleton width="6ch" height="1.4em" /> }</dd>
        </div>
        <div>
          <dt>Balance due</dt>
          <dd class="tnum" [class.due]="snapshot.hasValue() && snapshot.value().balanceDue > 0">@if (snapshot.hasValue()) { <app-money [value]="snapshot.value().balanceDue" /> } @else { <app-skeleton width="5ch" height="1.4em" /> }</dd>
        </div>
        <div>
          <dt>Open claims</dt>
          <dd class="tnum">@if (snapshot.hasValue()) { {{ snapshot.value().openClaims }} } @else { <app-skeleton width="2ch" height="1.4em" /> }</dd>
        </div>
      </dl>

      <nav class="tabs" aria-label="Dashboard sections">
        <a routerLink="policies" routerLinkActive="active" ariaCurrentWhenActive="page">Policies</a>
        <a routerLink="invoices" routerLinkActive="active" ariaCurrentWhenActive="page">Invoices</a>
        <a routerLink="claims" routerLinkActive="active" ariaCurrentWhenActive="page">Claims</a>
      </nav>

      <section class="panel">
        <router-outlet />
      </section>
    </div>
  `,
  styles: `
    .wrap { max-inline-size: var(--content-max); margin-inline: auto; padding: var(--s-6) var(--s-5) var(--s-7); display: grid; gap: var(--s-5); min-inline-size: 0; }
    .wrap > * { min-inline-size: 0; }
    .head { display: flex; align-items: flex-start; justify-content: space-between; gap: var(--s-4); flex-wrap: wrap; }
    .head p { margin-block-start: var(--s-1); }
    .snapshot { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; margin: 0; border-block: 1px solid var(--rule); }
    .snapshot > div { padding: var(--s-4) var(--s-5) var(--s-4) 0; display: grid; gap: var(--s-1); border-inline-end: 1px solid var(--rule); }
    .snapshot > div + div { padding-inline-start: var(--s-5); }
    .snapshot > div:last-child { border-inline-end: 0; }
    dt { font-size: var(--t-xs); text-transform: uppercase; letter-spacing: 0.04em; color: var(--ink-2); font-weight: 600; }
    dd { margin: 0; font-size: var(--t-lg); font-weight: 600; }
    dd.due { color: var(--stamp); }
    .tabs { display: flex; gap: var(--s-1); border-block-end: 1px solid var(--rule); }
    .tabs a { padding: var(--s-2) var(--s-3) var(--s-3); margin-block-end: -1px; color: var(--ink-2); text-decoration: none; font-weight: 500; font-size: var(--t-sm); border-block-end: 2px solid transparent; transition: color 160ms var(--ease), border-color 160ms var(--ease); }
    .tabs a:hover { color: var(--ink); }
    .tabs a.active { color: var(--ink); border-block-end-color: var(--brass); font-weight: 600; }
    @media (max-width: 760px) {
      .wrap { padding-inline: var(--s-4); }
      .snapshot { grid-template-columns: 1fr 1fr; }
      .snapshot > div { border-inline-end: 0; padding-inline-end: var(--s-3); }
      .snapshot > div:nth-child(odd) { border-inline-end: 1px solid var(--rule); }
      .snapshot > div:nth-child(even) { padding-inline-start: var(--s-4); }
      .snapshot > div:nth-child(3) { padding-inline-start: 0; border-block-start: 1px solid var(--rule); }
      .snapshot > div:nth-child(4) { border-block-start: 1px solid var(--rule); }
    }
  `,
})
export class DashboardShell {
  private readonly api = inject(InsuranceApi);

  /** One request fan-out, mapped to the four figures the header shows. */
  protected readonly snapshot = rxResource({
    stream: () =>
      forkJoin({ policies: this.api.listPolicies(), invoices: this.api.listInvoices(), claims: this.api.listClaims() }).pipe(
        map(({ policies, invoices, claims }) => ({
          activePolicies: policies.filter((p) => p.status === 'active').length,
          annualPremium: policies.filter((p) => p.status === 'active').reduce((sum, p) => sum + p.annualPremium, 0),
          balanceDue: invoices.filter((i) => i.status !== 'paid').reduce((sum, i) => sum + i.amount, 0),
          openClaims: claims.filter((c) => c.status === 'filed' || c.status === 'review' || c.status === 'approved').length,
        })),
      ),
  });
}
