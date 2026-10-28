import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';
import { EMPTY_DRAFT, QuoteStore } from './quote-store.service';

describe('QuoteStore', () => {
  let store: QuoteStore;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({});
    store = TestBed.inject(QuoteStore);
    store.reset();
  });

  it('starts empty with every step after the first locked', () => {
    expect(store.draft()).toEqual(EMPTY_DRAFT);
    expect(store.canAccess('business')).toBe(true);
    expect(store.canAccess('location')).toBe(false);
    expect(store.canAccess('coverage')).toBe(false);
    expect(store.canAccess('summary')).toBe(false);
    expect(store.canAccess('bound')).toBe(false);
  });

  it('unlocks steps as each one completes', () => {
    store.patch({ businessName: 'Fernway', classCode: 'CAFE', yearsInBusiness: 2 });
    expect(store.canAccess('location')).toBe(true);
    expect(store.firstIncompleteStep().id).toBe('location');

    store.patch({ state: 'OR', zip: '97201', employees: 2, annualPayroll: 80_000, annualRevenue: 200_000, propertyValue: 20_000 });
    expect(store.canAccess('coverage')).toBe(true);
    // The class pre-selected its usual coverages, so review is already reachable.
    expect(store.canAccess('summary')).toBe(true);
    expect(store.firstIncompleteStep().id).toBe('summary');

    for (const id of store.selectedCoverages()) store.setCoverage(id, false);
    expect(store.canAccess('summary')).toBe(false);
    expect(store.firstIncompleteStep().id).toBe('coverage');
  });

  it('pre-selects the class recommendations when a class is chosen, and only when nothing is selected yet', () => {
    store.patch({ classCode: 'ITCO' });
    expect(store.selectedCoverages()).toEqual(['gl', 'pl']);

    store.setCoverage('pl', false);
    store.applyRecommendations();
    expect(store.selectedCoverages()).toEqual(['gl']);
  });

  it('keeps the limit when a coverage is toggled off and on', () => {
    store.setCoverage('gl', true, '2m-4m');
    store.setCoverage('gl', false);
    store.setCoverage('gl', true);
    expect(store.draft().coverages.gl.limit).toBe('2m-4m');
  });

  it('persists the draft to sessionStorage', () => {
    store.patch({ businessName: 'Fernway' });
    expect(JSON.parse(sessionStorage.getItem('quote-flow.draft.v1')!).businessName).toBe('Fernway');
  });

  it('reprices through the debounced premium stream', async () => {
    store.patch({ businessName: 'Fernway', classCode: 'CAFE', yearsInBusiness: 0, state: 'OR', zip: '97201', employees: 0, annualPayroll: 0, annualRevenue: 150_000, propertyValue: 0 });
    store.setCoverage('bop', false);
    store.setCoverage('wc', false);
    store.setCoverage('gl', true, '500k-1m');
    const premium = await firstValueFrom(store.premium$.pipe(filter((p) => !p.empty)));
    // 420 × 1.15 × 1.0 × 1.0 × 1.0 = 483
    expect(premium.lines.find((l) => l.coverage === 'gl')?.amount).toBe(483);
    expect(premium.annual).toBe(483 + 25);
  });
});
