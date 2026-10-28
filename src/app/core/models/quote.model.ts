/** Coverage identifiers. The order here is the order lines post into the ledger. */
export type CoverageId = 'gl' | 'bop' | 'wc' | 'pl';

export const COVERAGE_ORDER: readonly CoverageId[] = ['gl', 'bop', 'wc', 'pl'];

export interface LimitOption {
  /** Stable key used in forms and the URL. */
  readonly id: string;
  /** Human label, e.g. "$1M / $2M". */
  readonly label: string;
  /** Multiplier applied to the coverage's base premium. */
  readonly factor: number;
}

export interface CoverageDefinition {
  readonly id: CoverageId;
  readonly name: string;
  readonly shortName: string;
  /** One sentence a business owner understands. */
  readonly summary: string;
  /** What it does and does not do, shown when the card expands. */
  readonly covers: readonly string[];
  readonly excludes: readonly string[];
  readonly limits: readonly LimitOption[];
  readonly defaultLimit: string;
  /** The exposure this coverage is rated on, for the ledger sub-label. */
  readonly ratedOn: 'revenue' | 'payroll' | 'property';
}

export interface BusinessClass {
  readonly code: string;
  readonly name: string;
  readonly group: 'Food & drink' | 'Trades' | 'Professional services' | 'Retail & personal care';
  /** General liability class factor. 1.0 is the book average. */
  readonly glFactor: number;
  /** Workers' compensation rate per $100 of payroll. */
  readonly wcRate: number;
  /** Professional liability class factor. */
  readonly plFactor: number;
  /** Coverages typically carried by this class; used to pre-select on the coverage step. */
  readonly recommended: readonly CoverageId[];
}

export interface UsState {
  readonly code: string;
  readonly name: string;
  /** Territory factor. 1.0 is the book average. */
  readonly factor: number;
}

export interface CoverageSelection {
  readonly selected: boolean;
  readonly limit: string;
}

/** Everything the rating engine needs. Kept flat so it serialises to sessionStorage cleanly. */
export interface QuoteDraft {
  readonly businessName: string;
  readonly classCode: string;
  readonly yearsInBusiness: number;
  readonly state: string;
  readonly zip: string;
  readonly employees: number;
  readonly annualPayroll: number;
  readonly annualRevenue: number;
  readonly propertyValue: number;
  readonly coverages: Readonly<Record<CoverageId, CoverageSelection>>;
}

export type LedgerLineKind = 'coverage' | 'credit' | 'fee' | 'total';

export interface LedgerLine {
  /** Stable across recalculations so the ledger can animate changes per line. */
  readonly id: string;
  readonly kind: LedgerLineKind;
  readonly label: string;
  /** Explains how the amount was reached, e.g. "Payroll $240,000 at $2.10 per $100". */
  readonly detail?: string;
  readonly coverage?: CoverageId;
  /** Annual amount in whole dollars. Credits are negative. */
  readonly amount: number;
}

export interface Premium {
  readonly lines: readonly LedgerLine[];
  readonly annual: number;
  readonly monthly: number;
  /** True when nothing is selected; the ledger shows an empty state. */
  readonly empty: boolean;
}

export type PolicyStatus = 'active' | 'pending' | 'expired';

export interface Policy {
  readonly number: string;
  readonly businessName: string;
  readonly classCode: string;
  readonly state: string;
  readonly coverages: readonly { id: CoverageId; limit: string; annual: number }[];
  readonly annualPremium: number;
  readonly effectiveDate: string;
  readonly expirationDate: string;
  readonly status: PolicyStatus;
}

export type InvoiceStatus = 'paid' | 'due' | 'overdue';

export interface Invoice {
  readonly number: string;
  readonly policyNumber: string;
  readonly description: string;
  readonly amount: number;
  readonly issuedDate: string;
  readonly dueDate: string;
  readonly status: InvoiceStatus;
}

export type ClaimStatus = 'filed' | 'review' | 'approved' | 'paid' | 'closed';

export interface Claim {
  readonly number: string;
  readonly policyNumber: string;
  readonly coverage: CoverageId;
  readonly description: string;
  readonly filedDate: string;
  readonly amount: number;
  readonly status: ClaimStatus;
}
