import { Injectable } from '@angular/core';
import { findClass } from '../data/business-classes';
import { COVERAGES } from '../data/coverages';
import { findState } from '../data/states';
import { COVERAGE_ORDER, CoverageId, LedgerLine, Premium, QuoteDraft } from '../models/quote.model';

/** Base annual premium for each coverage before any factor is applied. */
const BASE: Readonly<Record<CoverageId, number>> = { gl: 420, bop: 310, wc: 0, pl: 380 };

/** Minimum annual premium per coverage, as a carrier would apply. */
const MINIMUM: Readonly<Record<CoverageId, number>> = { gl: 250, bop: 200, wc: 350, pl: 300 };

const POLICY_FEE = 25;

/** Revenue bands drive general and professional liability exposure. */
function revenueFactor(revenue: number): number {
  if (revenue < 100_000) return 0.8;
  if (revenue < 250_000) return 1.0;
  if (revenue < 500_000) return 1.25;
  if (revenue < 1_000_000) return 1.5;
  if (revenue < 2_500_000) return 1.9;
  return 2.4;
}

function revenueBandLabel(revenue: number): string {
  if (revenue < 100_000) return 'under $100K revenue';
  if (revenue < 250_000) return '$100K to $250K revenue';
  if (revenue < 500_000) return '$250K to $500K revenue';
  if (revenue < 1_000_000) return '$500K to $1M revenue';
  if (revenue < 2_500_000) return '$1M to $2.5M revenue';
  return 'over $2.5M revenue';
}

const money = (n: number) => '$' + Math.round(n).toLocaleString('en-US');

/**
 * A deterministic, explainable rating engine.
 *
 * Every line it produces carries the arithmetic that made it, so the premium
 * ledger can show the visitor why the number is what it is. Nothing here is
 * real underwriting; the factors are invented for the demo.
 */
@Injectable({ providedIn: 'root' })
export class RatingService {
  rate(draft: QuoteDraft): Premium {
    const cls = findClass(draft.classCode);
    const state = findState(draft.state);
    const lines: LedgerLine[] = [];

    if (!cls || !state) {
      return { lines, annual: 0, monthly: 0, empty: true };
    }

    const territory = state.factor;
    const selected = COVERAGE_ORDER.filter((id) => draft.coverages[id]?.selected);

    for (const id of selected) {
      const def = COVERAGES[id];
      const limitId = draft.coverages[id].limit;
      const limit = def.limits.find((l) => l.id === limitId) ?? def.limits[0];
      let amount = 0;
      let detail = '';

      switch (id) {
        case 'gl': {
          amount = BASE.gl * cls.glFactor * territory * revenueFactor(draft.annualRevenue) * limit.factor;
          detail = `${cls.name} class, ${revenueBandLabel(draft.annualRevenue)}, ${limit.label}`;
          break;
        }
        case 'bop': {
          const property = draft.propertyValue * 0.0042 * territory;
          amount = (BASE.bop * cls.glFactor * territory + property) * limit.factor;
          detail = `${money(draft.propertyValue)} property at ${state.code} rates, ${limit.label}`;
          break;
        }
        case 'wc': {
          const perHundred = cls.wcRate * territory;
          amount = (draft.annualPayroll / 100) * perHundred;
          detail = `${money(draft.annualPayroll)} payroll at $${perHundred.toFixed(2)} per $100`;
          break;
        }
        case 'pl': {
          amount = BASE.pl * cls.plFactor * territory * revenueFactor(draft.annualRevenue) * limit.factor;
          detail = `${cls.name} class, ${revenueBandLabel(draft.annualRevenue)}, ${limit.label}`;
          break;
        }
      }

      amount = Math.max(Math.round(amount), MINIMUM[id]);
      lines.push({ id: `cov-${id}`, kind: 'coverage', coverage: id, label: def.name, detail, amount });
    }

    if (selected.length === 0) {
      return { lines, annual: 0, monthly: 0, empty: true };
    }

    const subtotal = lines.reduce((sum, l) => sum + l.amount, 0);

    if (selected.length >= 2) {
      const pct = selected.length >= 3 ? 0.1 : 0.05;
      lines.push({
        id: 'credit-bundle',
        kind: 'credit',
        label: 'Multi-policy credit',
        detail: `${Math.round(pct * 100)}% for carrying ${selected.length} coverages together`,
        amount: -Math.round(subtotal * pct),
      });
    }

    if (draft.yearsInBusiness >= 3) {
      const pct = draft.yearsInBusiness >= 10 ? 0.06 : 0.03;
      lines.push({
        id: 'credit-tenure',
        kind: 'credit',
        label: 'Established business credit',
        detail: `${Math.round(pct * 100)}% for ${draft.yearsInBusiness}+ years in business`,
        amount: -Math.round(subtotal * pct),
      });
    }

    lines.push({ id: 'fee-policy', kind: 'fee', label: 'Policy fee', detail: 'One-time, per policy term', amount: POLICY_FEE });

    const annual = lines.reduce((sum, l) => sum + l.amount, 0);
    lines.push({ id: 'total', kind: 'total', label: 'Annual premium', amount: annual });

    return { lines, annual, monthly: Math.round(annual / 12), empty: false };
  }
}
