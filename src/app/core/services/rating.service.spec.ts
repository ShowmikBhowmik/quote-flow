import { TestBed } from '@angular/core/testing';
import { QuoteDraft } from '../models/quote.model';
import { EMPTY_DRAFT } from './quote-store.service';
import { RatingService } from './rating.service';

const cafe: QuoteDraft = {
  ...EMPTY_DRAFT,
  businessName: 'Fernway Coffee Roasters',
  classCode: 'CAFE',
  yearsInBusiness: 6,
  state: 'OR',
  zip: '97201',
  employees: 4,
  annualPayroll: 160_000,
  annualRevenue: 420_000,
  propertyValue: 85_000,
  coverages: {
    gl: { selected: true, limit: '1m-2m' },
    bop: { selected: true, limit: '100k' },
    wc: { selected: true, limit: 'statutory' },
    pl: { selected: false, limit: '500k' },
  },
};

describe('RatingService', () => {
  let rating: RatingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    rating = TestBed.inject(RatingService);
  });

  it('returns an empty premium when nothing is selected', () => {
    const premium = rating.rate({ ...cafe, coverages: EMPTY_DRAFT.coverages });
    expect(premium.empty).toBe(true);
    expect(premium.annual).toBe(0);
    expect(premium.lines).toEqual([]);
  });

  it('returns an empty premium when the class or state is unknown', () => {
    expect(rating.rate({ ...cafe, classCode: 'NOPE' }).empty).toBe(true);
    expect(rating.rate({ ...cafe, state: 'ZZ' }).empty).toBe(true);
  });

  it('posts one line per selected coverage, in ledger order', () => {
    const premium = rating.rate(cafe);
    const coverageLines = premium.lines.filter((l) => l.kind === 'coverage').map((l) => l.coverage);
    expect(coverageLines).toEqual(['gl', 'bop', 'wc']);
  });

  it('rates general liability from base, class, territory, revenue band and limit', () => {
    const premium = rating.rate({ ...cafe, coverages: { ...EMPTY_DRAFT.coverages, gl: { selected: true, limit: '1m-2m' } } });
    // 420 base × 1.15 class × 1.0 Oregon × 1.25 revenue band × 1.28 limit = 772.8
    expect(premium.lines.find((l) => l.coverage === 'gl')?.amount).toBe(773);
  });

  it("rates workers' comp per $100 of payroll with the territory factor applied", () => {
    const premium = rating.rate({ ...cafe, coverages: { ...EMPTY_DRAFT.coverages, wc: { selected: true, limit: 'statutory' } } });
    // 160,000 / 100 × (2.10 × 1.0) = 3,360
    expect(premium.lines.find((l) => l.coverage === 'wc')?.amount).toBe(3_360);
    expect(premium.lines.find((l) => l.coverage === 'wc')?.detail).toContain('$2.10 per $100');
  });

  it('applies the minimum premium when payroll is zero', () => {
    const premium = rating.rate({ ...cafe, annualPayroll: 0, coverages: { ...EMPTY_DRAFT.coverages, wc: { selected: true, limit: 'statutory' } } });
    expect(premium.lines.find((l) => l.coverage === 'wc')?.amount).toBe(350);
  });

  it('adds a 5% credit for two coverages and 10% for three or more', () => {
    const two = rating.rate({ ...cafe, yearsInBusiness: 0, coverages: { ...cafe.coverages, wc: { selected: false, limit: 'statutory' } } });
    const three = rating.rate({ ...cafe, yearsInBusiness: 0 });
    const twoSubtotal = two.lines.filter((l) => l.kind === 'coverage').reduce((s, l) => s + l.amount, 0);
    const threeSubtotal = three.lines.filter((l) => l.kind === 'coverage').reduce((s, l) => s + l.amount, 0);
    expect(two.lines.find((l) => l.id === 'credit-bundle')?.amount).toBe(-Math.round(twoSubtotal * 0.05));
    expect(three.lines.find((l) => l.id === 'credit-bundle')?.amount).toBe(-Math.round(threeSubtotal * 0.1));
  });

  it('gives a tenure credit at three years and a larger one at ten', () => {
    expect(rating.rate({ ...cafe, yearsInBusiness: 2 }).lines.find((l) => l.id === 'credit-tenure')).toBeUndefined();
    expect(rating.rate({ ...cafe, yearsInBusiness: 3 }).lines.find((l) => l.id === 'credit-tenure')?.detail).toContain('3%');
    expect(rating.rate({ ...cafe, yearsInBusiness: 12 }).lines.find((l) => l.id === 'credit-tenure')?.detail).toContain('6%');
  });

  it('closes the ledger with a total line that equals the sum of every other line', () => {
    const premium = rating.rate(cafe);
    const total = premium.lines.find((l) => l.kind === 'total');
    const rest = premium.lines.filter((l) => l.kind !== 'total').reduce((s, l) => s + l.amount, 0);
    expect(total?.amount).toBe(rest);
    expect(premium.annual).toBe(rest);
    expect(premium.monthly).toBe(Math.round(rest / 12));
  });

  it('is deterministic', () => {
    expect(rating.rate(cafe)).toEqual(rating.rate(cafe));
  });

  it('prices a higher limit above a lower one', () => {
    const low = rating.rate({ ...cafe, coverages: { ...EMPTY_DRAFT.coverages, gl: { selected: true, limit: '500k-1m' } } });
    const high = rating.rate({ ...cafe, coverages: { ...EMPTY_DRAFT.coverages, gl: { selected: true, limit: '2m-4m' } } });
    expect(high.annual).toBeGreaterThan(low.annual);
  });
});
