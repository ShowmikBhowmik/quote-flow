import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { InvoiceStatus } from '../../core/models/quote.model';
import { InsuranceApi } from '../../core/services/insurance-api.service';
import { Chip, ChipTone } from '../../shared/ui/status-chip.component';
import { Icon } from '../../shared/ui/icon.component';
import { Money } from '../../shared/ui/money.component';
import { Skeleton } from '../../shared/ui/skeleton.component';

const TONE: Record<InvoiceStatus, ChipTone> = { paid: 'posted', due: 'amber', overdue: 'stamp' };

@Component({
  selector: 'app-invoices',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, Chip, Icon, Money, Skeleton],
  template: `
    <div class="panel-head">
      <h2>Invoices</h2>
      <p class="muted" style="font-size: var(--t-sm)">Monthly installments. Paying marks the invoice settled in this demo session.</p>
    </div>

    @if (invoices.isLoading()) {
      <div class="skeleton-rows" aria-busy="true" aria-label="Loading invoices">
        @for (i of [1, 2, 3, 4]; track i) {
          <div class="skeleton-row"><app-skeleton /><app-skeleton width="60%" /><app-skeleton width="50%" /><app-skeleton width="40%" /></div>
        }
      </div>
    } @else if (invoices.error()) {
      <p class="error-box" role="alert"><app-icon name="alert" [size]="16" /> Invoices could not be loaded. <button type="button" class="btn btn-quiet btn-sm" (click)="invoices.reload()">Try again</button></p>
    } @else if (invoices.hasValue()) {
      <div class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Invoice</th>
              <th scope="col" class="hide-sm">Policy</th>
              <th scope="col" class="hide-sm">Due</th>
              <th scope="col">Status</th>
              <th scope="col" class="num">Amount</th>
              <th scope="col" class="stick"><span class="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            @for (inv of invoices.value(); track inv.number) {
              <tr>
                <td><span class="primary mono">{{ inv.number }}</span><span class="sub">{{ inv.description }} <span class="show-sm">· due {{ inv.dueDate | date: 'MMM d' }}</span></span></td>
                <td class="mono hide-sm">{{ inv.policyNumber }}</td>
                <td class="mono hide-sm">{{ inv.dueDate | date: 'MMM d, y' }}</td>
                <td><app-chip [tone]="tone(inv.status)">{{ inv.status }}</app-chip></td>
                <td class="num primary"><app-money [value]="inv.amount" /></td>
                <td class="num stick">
                  @if (inv.status !== 'paid') {
                    <button type="button" class="btn btn-secondary btn-sm" (click)="pay(inv.number)" [disabled]="paying() === inv.number" [attr.aria-busy]="paying() === inv.number">
                      {{ paying() === inv.number ? 'Paying' : 'Pay' }}<span class="hide-sm">&nbsp;now</span>
                    </button>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
  styleUrl: './dashboard.scss',
})
export class Invoices {
  private readonly api = inject(InsuranceApi);
  protected readonly invoices = rxResource({ stream: () => this.api.listInvoices() });
  protected readonly paying = signal<string | null>(null);

  protected tone(status: InvoiceStatus): ChipTone {
    return TONE[status];
  }

  protected pay(number: string): void {
    this.paying.set(number);
    this.api.payInvoice(number).subscribe({
      next: (paid) => {
        this.paying.set(null);
        this.invoices.update((list) => (list ?? []).map((i) => (i.number === paid.number ? paid : i)));
      },
      error: () => this.paying.set(null),
    });
  }
}
