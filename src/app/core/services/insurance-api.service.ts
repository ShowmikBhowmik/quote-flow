import { inject, Injectable, signal } from '@angular/core';
import { Observable, of, throwError, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Claim, Invoice, Policy, QuoteDraft } from '../models/quote.model';
import { SEED_CLAIMS, SEED_INVOICES, SEED_POLICIES } from '../data/seed';
import { RatingService } from './rating.service';

const STORAGE_KEY = 'quote-flow.account.v1';

interface AccountState {
  policies: Policy[];
  invoices: Invoice[];
  claims: Claim[];
}

/**
 * An in-memory stand-in for the carrier's API.
 *
 * Every call goes through a short, realistic delay so loading states are real.
 * Bound policies are written to sessionStorage so a refresh keeps the dashboard
 * honest for the length of the visit.
 */
@Injectable({ providedIn: 'root' })
export class InsuranceApi {
  private readonly rating = inject(RatingService);
  private readonly state = signal<AccountState>(this.restore());

  /** Simulated network latency. Tests set this to 0. */
  latencyMs = 650;

  listPolicies(): Observable<Policy[]> {
    return this.respond(() => this.state().policies);
  }

  listInvoices(): Observable<Invoice[]> {
    return this.respond(() => this.state().invoices);
  }

  listClaims(): Observable<Claim[]> {
    return this.respond(() => this.state().claims);
  }

  getPolicy(number: string): Observable<Policy> {
    return this.respond(() => {
      const found = this.state().policies.find((p) => p.number === number);
      if (!found) throw new Error(`Policy ${number} not found`);
      return found;
    });
  }

  /** Binds the draft into a policy and issues its first invoice. */
  bind(draft: QuoteDraft): Observable<Policy> {
    return timer(this.latencyMs * 2).pipe(
      map(() => {
        const premium = this.rating.rate(draft);
        if (premium.empty) throw new Error('Select at least one coverage before binding.');

        const effective = new Date();
        effective.setDate(effective.getDate() + 1);
        const expiration = new Date(effective);
        expiration.setFullYear(expiration.getFullYear() + 1);

        const number = this.nextPolicyNumber();
        const policy: Policy = {
          number,
          businessName: draft.businessName,
          classCode: draft.classCode,
          state: draft.state,
          coverages: premium.lines
            .filter((l) => l.kind === 'coverage')
            .map((l) => ({ id: l.coverage!, limit: draft.coverages[l.coverage!].limit, annual: l.amount })),
          annualPremium: premium.annual,
          effectiveDate: iso(effective),
          expirationDate: iso(expiration),
          status: 'active',
        };

        const due = new Date(effective);
        due.setDate(due.getDate() + 30);
        const invoice: Invoice = {
          number: `INV-${number.slice(-6)}-01`,
          policyNumber: number,
          description: 'First installment, annual term',
          amount: Math.round(premium.annual / 12),
          issuedDate: iso(new Date()),
          dueDate: iso(due),
          status: 'due',
        };

        this.state.update((s) => ({
          ...s,
          policies: [policy, ...s.policies],
          invoices: [invoice, ...s.invoices],
        }));
        this.persist();
        return policy;
      }),
    );
  }

  payInvoice(number: string): Observable<Invoice> {
    return timer(this.latencyMs).pipe(
      switchMap(() => {
        const current = this.state().invoices.find((i) => i.number === number);
        if (!current) return throwError(() => new Error(`Invoice ${number} not found`));
        const paid: Invoice = { ...current, status: 'paid' };
        this.state.update((s) => ({
          ...s,
          invoices: s.invoices.map((i) => (i.number === number ? paid : i)),
        }));
        this.persist();
        return of(paid);
      }),
    );
  }

  private respond<T>(read: () => T): Observable<T> {
    return timer(this.latencyMs).pipe(map(read));
  }

  private nextPolicyNumber(): string {
    const year = new Date().getFullYear();
    const serial = (this.state().policies.length + 4817).toString().padStart(6, '0');
    return `NL-${year}-${serial}`;
  }

  private restore(): AccountState {
    try {
      const raw = globalThis.sessionStorage?.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as AccountState;
    } catch {
      // Storage unavailable (private mode, SSR); fall back to seed data.
    }
    return { policies: [...SEED_POLICIES], invoices: [...SEED_INVOICES], claims: [...SEED_CLAIMS] };
  }

  private persist(): void {
    try {
      globalThis.sessionStorage?.setItem(STORAGE_KEY, JSON.stringify(this.state()));
    } catch {
      // Ignore; the session simply will not survive a refresh.
    }
  }
}

function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}
