import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { COVERAGES } from '../../core/data/coverages';
import { ClaimStatus, CoverageId } from '../../core/models/quote.model';
import { InsuranceApi } from '../../core/services/insurance-api.service';
import { Chip, ChipTone } from '../../shared/ui/status-chip.component';
import { Icon } from '../../shared/ui/icon.component';
import { Money } from '../../shared/ui/money.component';
import { Skeleton } from '../../shared/ui/skeleton.component';

const TONE: Record<ClaimStatus, ChipTone> = { filed: 'navy', review: 'amber', approved: 'posted', paid: 'posted', closed: 'neutral' };
const STAGES: readonly ClaimStatus[] = ['filed', 'review', 'approved', 'paid'];
const OPEN = new Set<ClaimStatus>(['filed', 'review', 'approved']);

type Filter = 'all' | 'open' | 'settled';

@Component({
  selector: 'app-claims',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, Chip, Icon, Money, Skeleton],
  template: `
    <div class="panel-head">
      <h2>Claims</h2>
      <label class="filter">
        Show
        <select class="select" [value]="filter()" (change)="filter.set($any($event.target).value)" aria-label="Filter claims">
          <option value="all">All claims</option>
          <option value="open">Open</option>
          <option value="settled">Settled</option>
        </select>
      </label>
    </div>

    @if (claims.isLoading()) {
      <div class="skeleton-rows" aria-busy="true" aria-label="Loading claims">
        @for (i of [1, 2, 3]; track i) {
          <div class="skeleton-row"><app-skeleton /><app-skeleton width="80%" /><app-skeleton width="50%" /><app-skeleton width="40%" /></div>
        }
      </div>
    } @else if (claims.error()) {
      <p class="error-box" role="alert"><app-icon name="alert" [size]="16" /> Claims could not be loaded. <button type="button" class="btn btn-quiet btn-sm" (click)="claims.reload()">Try again</button></p>
    } @else if (visible().length === 0) {
      <div class="empty" role="status">
        <app-icon name="file" [size]="28" />
        <strong>No {{ filter() === 'all' ? '' : filter() }} claims</strong>
        <p>@if (filter() === 'open') { Nothing is waiting on review. When you file a claim it shows here with its progress. } @else { Try a different filter. }</p>
      </div>
    } @else {
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Claim</th>
              <th scope="col" class="hide-sm">Coverage</th>
              <th scope="col" class="hide-sm">Filed</th>
              <th scope="col" class="hide-sm">Progress</th>
              <th scope="col">Status</th>
              <th scope="col" class="num">Amount</th>
            </tr>
          </thead>
          <tbody>
            @for (c of visible(); track c.number) {
              <tr>
                <td><span class="primary mono">{{ c.number }}</span><span class="sub">{{ c.description }} <span class="show-sm">· {{ coverageName(c.coverage) }}</span></span></td>
                <td class="hide-sm"><span class="lines"><span [style.background]="'var(--line-' + c.coverage + ')'"></span></span><span class="sub">{{ coverageName(c.coverage) }}</span></td>
                <td class="mono hide-sm">{{ c.filedDate | date: 'MMM d, y' }}</td>
                <td class="hide-sm">
                  <span class="timeline" role="img" [attr.aria-label]="progressLabel(c.status)">
                    @for (stage of stages; track stage; let i = $index) {
                      @if (i > 0) { <b></b> }
                      <i [class.on]="stageIndex(c.status) > i" [class.now]="stageIndex(c.status) === i && c.status !== 'paid'" [class.stop]="c.status === 'closed'"></i>
                    }
                  </span>
                </td>
                <td><app-chip [tone]="tone(c.status)">{{ c.status === 'review' ? 'Under review' : c.status }}</app-chip></td>
                <td class="num primary"><app-money [value]="c.amount" /></td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
  styleUrl: './dashboard.scss',
})
export class Claims {
  private readonly api = inject(InsuranceApi);
  protected readonly claims = rxResource({ stream: () => this.api.listClaims() });
  protected readonly filter = signal<Filter>('all');
  protected readonly stages = STAGES;

  protected readonly visible = computed(() => {
    const list = this.claims.hasValue() ? this.claims.value() : [];
    switch (this.filter()) {
      case 'open':
        return list.filter((c) => OPEN.has(c.status));
      case 'settled':
        return list.filter((c) => !OPEN.has(c.status));
      default:
        return list;
    }
  });

  protected tone(status: ClaimStatus): ChipTone {
    return TONE[status];
  }
  protected coverageName(id: CoverageId): string {
    return COVERAGES[id].shortName;
  }
  protected stageIndex(status: ClaimStatus): number {
    return status === 'closed' ? STAGES.length : STAGES.indexOf(status);
  }
  protected progressLabel(status: ClaimStatus): string {
    if (status === 'closed') return 'Closed';
    if (status === 'paid') return 'Paid, all stages complete';
    return `Stage ${STAGES.indexOf(status) + 1} of ${STAGES.length}`;
  }
}
