import { Claim, Invoice, Policy } from '../models/quote.model';

/** Demo account data. Every name, number and amount is invented. */

export const SEED_POLICIES: readonly Policy[] = [
  {
    number: 'NL-2026-004815',
    businessName: 'Fernway Coffee Roasters',
    classCode: 'CAFE',
    state: 'OR',
    coverages: [
      { id: 'gl', limit: '1m-2m', annual: 742 },
      { id: 'bop', limit: '100k', annual: 963 },
      { id: 'wc', limit: 'statutory', annual: 1_890 },
    ],
    annualPremium: 3_260,
    effectiveDate: '2026-03-01',
    expirationDate: '2027-03-01',
    status: 'active',
  },
  {
    number: 'NL-2025-004611',
    businessName: 'Fernway Coffee Roasters',
    classCode: 'CAFE',
    state: 'OR',
    coverages: [
      { id: 'gl', limit: '500k-1m', annual: 580 },
      { id: 'bop', limit: '50k', annual: 611 },
    ],
    annualPremium: 1_142,
    effectiveDate: '2025-03-01',
    expirationDate: '2026-03-01',
    status: 'expired',
  },
];

export const SEED_INVOICES: readonly Invoice[] = [
  {
    number: 'INV-004815-08',
    policyNumber: 'NL-2026-004815',
    description: 'Installment 8 of 12',
    amount: 272,
    issuedDate: '2026-10-01',
    dueDate: '2026-10-31',
    status: 'due',
  },
  {
    number: 'INV-004815-07',
    policyNumber: 'NL-2026-004815',
    description: 'Installment 7 of 12',
    amount: 272,
    issuedDate: '2026-09-01',
    dueDate: '2026-09-30',
    status: 'overdue',
  },
  {
    number: 'INV-004815-06',
    policyNumber: 'NL-2026-004815',
    description: 'Installment 6 of 12',
    amount: 272,
    issuedDate: '2026-08-01',
    dueDate: '2026-08-31',
    status: 'paid',
  },
  {
    number: 'INV-004815-05',
    policyNumber: 'NL-2026-004815',
    description: 'Installment 5 of 12',
    amount: 272,
    issuedDate: '2026-07-01',
    dueDate: '2026-07-31',
    status: 'paid',
  },
  {
    number: 'INV-004611-12',
    policyNumber: 'NL-2025-004611',
    description: 'Installment 12 of 12',
    amount: 95,
    issuedDate: '2026-02-01',
    dueDate: '2026-02-28',
    status: 'paid',
  },
];

export const SEED_CLAIMS: readonly Claim[] = [
  {
    number: 'CLM-26-01192',
    policyNumber: 'NL-2026-004815',
    coverage: 'bop',
    description: 'Espresso machine damaged by a burst pipe in the back room.',
    filedDate: '2026-09-14',
    amount: 6_400,
    status: 'review',
  },
  {
    number: 'CLM-26-00731',
    policyNumber: 'NL-2026-004815',
    coverage: 'gl',
    description: 'Customer slipped on a wet entry mat; medical costs reimbursed.',
    filedDate: '2026-05-22',
    amount: 1_850,
    status: 'paid',
  },
  {
    number: 'CLM-25-02044',
    policyNumber: 'NL-2025-004611',
    coverage: 'bop',
    description: 'Front window broken overnight; glass replaced.',
    filedDate: '2025-11-03',
    amount: 920,
    status: 'closed',
  },
];
