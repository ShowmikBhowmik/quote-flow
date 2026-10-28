import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { findClass } from '../../core/data/business-classes';
import { COVERAGES } from '../../core/data/coverages';
import { CoverageId, PolicyStatus } from '../../core/models/quote.model';
import { InsuranceApi } from '../../core/services/insurance-api.service';
import { Chip, ChipTone } from '../../shared/ui/status-chip.component';
import { Icon } from '../../shared/ui/icon.component';
import { Money } from '../../shared/ui/money.component';
import { Skeleton } from '../../shared/ui/skeleton.component';

const TONE: Record<PolicyStatus, ChipTone> = { active: 'posted', pending: 'amber', expired: 'neutral' };

@Component({
  selector: 'app-policies',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, Chip, Icon, Money, Skeleton],
  template: `
    <div class="panel-head">
      <h2>Policies</h2>
      <button type="button" class="btn btn-quiet btn-sm" (click)="policies.reload()" [disabled]="policies.isLoading()"><app-icon name="refresh" [size]="16" />Refresh</button>
    </div>

    @if (policies.isLoading()) {
      <div class="skeleton-rows" aria-busy="true" aria-label="Loading policies">
        @for (i of [1, 2, 3]; track i) {
          <div class="skeleton-row"><app-skeleton /><app-skeleton width="70%" /><app-skeleton width="50%" /><app-skeleton width="40%" /></div>
        }
      </div>
    } @else if (policies.error()) {
      <p class="error-box" role="alert"><app-icon name="alert" [size]="16" /> Policies could not be loaded. <button type="button" class="btn btn-quiet btn-sm" (click)="policies.reload()">Try again</button></p>
    } @else if (policies.hasValue()) {
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Policy</th>
              <th scope="col" class="hide-sm">Coverage</th>
              <th scope="col" class="hide-sm">Term</th>
              <th scope="col">Status</th>
              <th scope="col" class="num">Annual premium</th>
            </tr>
          </thead>
          <tbody>
            @for (p of policies.value(); track p.number) {
              <tr>
                <td>
                  <span class="primary mono">{{ p.number }}</span>
                  <span class="sub">{{ p.businessName }} · {{ className(p.classCode) }}</span>
                  <span class="lines show-sm" role="img" [attr.aria-label]="coverageLabel(p.coverages)">
                    @for (c of p.coverages; track c.id) { <span [style.background]="'var(--line-' + c.id + ')'"></span> }
                  </span>
                </td>
                <td class="hide-sm">
                  <span class="lines" role="img" [attr.aria-label]="coverageLabel(p.coverages)">
                    @for (c of p.coverages; track c.id) { <span [style.background]="'var(--line-' + c.id + ')'" [title]="name(c.id)"></span> }
                  </span>
                  <span class="sub">{{ coverageLabel(p.coverages) }}</span>
                </td>
                <td class="mono hide-sm">{{ p.effectiveDate | date: 'MMM d, y' }} <span class="faint">to</span> {{ p.expirationDate | date: 'MMM d, y' }}</td>
                <td><app-chip [tone]="tone(p.status)">{{ p.status }}</app-chip></td>
                <td class="num primary"><app-money [value]="p.annualPremium" /></td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
  styleUrl: './dashboard.scss',
})
export class Policies {
  private readonly api = inject(InsuranceApi);
  protected readonly policies = rxResource({ stream: () => this.api.listPolicies() });

  protected tone(status: PolicyStatus): ChipTone {
    return TONE[status];
  }
  protected name(id: CoverageId): string {
    return COVERAGES[id].shortName;
  }
  protected className(code: string): string {
    return findClass(code)?.name ?? code;
  }
  protected coverageLabel(coverages: readonly { id: CoverageId }[]): string {
    return coverages.map((c) => COVERAGES[c.id].shortName).join(', ');
  }
}
