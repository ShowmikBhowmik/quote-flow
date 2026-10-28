import { computed, inject, Injectable, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, map, shareReplay } from 'rxjs/operators';
import { findClass } from '../data/business-classes';
import { COVERAGES } from '../data/coverages';
import { CoverageId, Policy, Premium, QuoteDraft } from '../models/quote.model';
import { RatingService } from './rating.service';

export type StepId = 'business' | 'location' | 'coverage' | 'summary' | 'bound';

export interface Step {
  readonly id: StepId;
  readonly label: string;
  readonly path: string;
}

export const STEPS: readonly Step[] = [
  { id: 'business', label: 'Business', path: '/quote/business' },
  { id: 'location', label: 'Location', path: '/quote/location' },
  { id: 'coverage', label: 'Coverage', path: '/quote/coverage' },
  { id: 'summary', label: 'Review', path: '/quote/summary' },
  { id: 'bound', label: 'Bound', path: '/quote/bound' },
];

const DRAFT_KEY = 'quote-flow.draft.v1';

export const EMPTY_DRAFT: QuoteDraft = {
  businessName: '',
  classCode: '',
  yearsInBusiness: 0,
  state: '',
  zip: '',
  employees: 0,
  annualPayroll: 0,
  annualRevenue: 0,
  propertyValue: 0,
  coverages: {
    gl: { selected: false, limit: COVERAGES.gl.defaultLimit },
    bop: { selected: false, limit: COVERAGES.bop.defaultLimit },
    wc: { selected: false, limit: COVERAGES.wc.defaultLimit },
    pl: { selected: false, limit: COVERAGES.pl.defaultLimit },
  },
};

/**
 * Single source of truth for the quote in progress.
 *
 * The draft is a signal; the premium is an RxJS stream derived from it
 * (debounced so typing a payroll figure reprices once, not per keystroke)
 * and exposed back as a signal for templates.
 */
@Injectable({ providedIn: 'root' })
export class QuoteStore {
  private readonly rating = inject(RatingService);
  private readonly draftState = signal<QuoteDraft>(this.restore());

  readonly draft = this.draftState.asReadonly();

  /** Live premium: draft → debounce → rate. Shared so every subscriber sees one calculation. */
  readonly premium$ = toObservable(this.draftState).pipe(
    debounceTime(120),
    map((draft) => this.rating.rate(draft)),
    distinctUntilChanged(samePremium),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  readonly premium = toSignal(this.premium$, { initialValue: this.rating.rate(this.draftState()) });

  readonly businessClass = computed(() => findClass(this.draftState().classCode));

  readonly selectedCoverages = computed(() =>
    (Object.keys(this.draftState().coverages) as CoverageId[]).filter((id) => this.draftState().coverages[id].selected),
  );

  readonly businessComplete = computed(() => {
    const d = this.draftState();
    return d.businessName.trim().length >= 2 && !!findClass(d.classCode) && d.yearsInBusiness >= 0;
  });

  readonly locationComplete = computed(() => {
    const d = this.draftState();
    return /^\d{5}$/.test(d.zip) && d.state.length === 2 && d.annualRevenue > 0 && d.employees >= 0;
  });

  readonly coverageComplete = computed(() => this.selectedCoverages().length > 0);

  /** The last policy bound in this session, shown on the confirmation step. */
  readonly boundPolicy = signal<Policy | null>(null);

  readonly binding = signal(false);

  patch(partial: Partial<QuoteDraft>): void {
    const classChanged = partial.classCode !== undefined && partial.classCode !== this.draftState().classCode;
    this.draftState.update((d) => ({ ...d, ...partial }));
    // A newly chosen class pre-selects what that class usually carries, so the
    // ledger starts posting on the very next step and reacts to payroll as it is typed.
    if (classChanged) this.applyRecommendations();
    this.persist();
  }

  setCoverage(id: CoverageId, selected: boolean, limit?: string): void {
    this.draftState.update((d) => ({
      ...d,
      coverages: {
        ...d.coverages,
        [id]: { selected, limit: limit ?? d.coverages[id].limit },
      },
    }));
    this.persist();
  }

  /** Pre-select what the chosen class usually carries, without overriding a visitor's own choices. */
  applyRecommendations(): void {
    const cls = this.businessClass();
    if (!cls) return;
    const anySelected = this.selectedCoverages().length > 0;
    if (anySelected) return;
    this.draftState.update((d) => {
      const coverages = { ...d.coverages };
      for (const id of cls.recommended) coverages[id] = { ...coverages[id], selected: true };
      return { ...d, coverages };
    });
    this.persist();
  }

  canAccess(step: StepId): boolean {
    switch (step) {
      case 'business':
        return true;
      case 'location':
        return this.businessComplete();
      case 'coverage':
        return this.businessComplete() && this.locationComplete();
      case 'summary':
        return this.businessComplete() && this.locationComplete() && this.coverageComplete();
      case 'bound':
        return this.boundPolicy() !== null;
    }
  }

  /** The furthest step the visitor is allowed to be on; guards redirect here. */
  firstIncompleteStep(): Step {
    if (!this.businessComplete()) return STEPS[0];
    if (!this.locationComplete()) return STEPS[1];
    if (!this.coverageComplete()) return STEPS[2];
    return STEPS[3];
  }

  reset(): void {
    this.draftState.set(EMPTY_DRAFT);
    this.boundPolicy.set(null);
    try {
      globalThis.sessionStorage?.removeItem(DRAFT_KEY);
    } catch {
      // ignore
    }
  }

  private restore(): QuoteDraft {
    try {
      const raw = globalThis.sessionStorage?.getItem(DRAFT_KEY);
      if (raw) return { ...EMPTY_DRAFT, ...(JSON.parse(raw) as QuoteDraft) };
    } catch {
      // ignore
    }
    return EMPTY_DRAFT;
  }

  private persist(): void {
    try {
      globalThis.sessionStorage?.setItem(DRAFT_KEY, JSON.stringify(this.draftState()));
    } catch {
      // ignore
    }
  }
}

function samePremium(a: Premium, b: Premium): boolean {
  if (a.annual !== b.annual || a.lines.length !== b.lines.length) return false;
  return a.lines.every((line, i) => line.id === b.lines[i].id && line.amount === b.lines[i].amount && line.detail === b.lines[i].detail);
}
