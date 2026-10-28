import { BusinessClass } from '../models/quote.model';

export const BUSINESS_CLASSES: readonly BusinessClass[] = [
  { code: 'CAFE', name: 'Cafe or coffee shop', group: 'Food & drink', glFactor: 1.15, wcRate: 2.1, plFactor: 0.6, recommended: ['gl', 'bop', 'wc'] },
  { code: 'REST', name: 'Restaurant', group: 'Food & drink', glFactor: 1.35, wcRate: 2.4, plFactor: 0.6, recommended: ['gl', 'bop', 'wc'] },
  { code: 'BAKE', name: 'Bakery', group: 'Food & drink', glFactor: 1.1, wcRate: 2.0, plFactor: 0.6, recommended: ['gl', 'bop', 'wc'] },
  { code: 'CONT', name: 'General contractor', group: 'Trades', glFactor: 1.8, wcRate: 7.8, plFactor: 1.2, recommended: ['gl', 'wc'] },
  { code: 'ELEC', name: 'Electrician', group: 'Trades', glFactor: 1.6, wcRate: 4.9, plFactor: 1.1, recommended: ['gl', 'wc'] },
  { code: 'PLMB', name: 'Plumber', group: 'Trades', glFactor: 1.55, wcRate: 5.3, plFactor: 1.1, recommended: ['gl', 'wc'] },
  { code: 'LAND', name: 'Landscaping', group: 'Trades', glFactor: 1.45, wcRate: 6.2, plFactor: 0.9, recommended: ['gl', 'wc'] },
  { code: 'CLEN', name: 'Cleaning service', group: 'Trades', glFactor: 1.3, wcRate: 4.1, plFactor: 0.8, recommended: ['gl', 'wc'] },
  { code: 'ITCO', name: 'IT consultant', group: 'Professional services', glFactor: 0.7, wcRate: 0.3, plFactor: 1.3, recommended: ['gl', 'pl'] },
  { code: 'MKTG', name: 'Marketing agency', group: 'Professional services', glFactor: 0.75, wcRate: 0.35, plFactor: 1.15, recommended: ['gl', 'pl'] },
  { code: 'ACCT', name: 'Accounting or bookkeeping', group: 'Professional services', glFactor: 0.65, wcRate: 0.25, plFactor: 1.4, recommended: ['gl', 'pl'] },
  { code: 'ARCH', name: 'Architecture or design studio', group: 'Professional services', glFactor: 0.8, wcRate: 0.4, plFactor: 1.5, recommended: ['gl', 'pl'] },
  { code: 'RETL', name: 'Retail boutique', group: 'Retail & personal care', glFactor: 0.95, wcRate: 1.4, plFactor: 0.5, recommended: ['gl', 'bop'] },
  { code: 'SALN', name: 'Hair or nail salon', group: 'Retail & personal care', glFactor: 1.0, wcRate: 1.1, plFactor: 0.7, recommended: ['gl', 'bop', 'wc'] },
  { code: 'FITN', name: 'Fitness studio', group: 'Retail & personal care', glFactor: 1.2, wcRate: 1.9, plFactor: 0.8, recommended: ['gl', 'bop', 'wc'] },
  { code: 'PHOT', name: 'Photography studio', group: 'Retail & personal care', glFactor: 0.8, wcRate: 0.6, plFactor: 0.9, recommended: ['gl', 'bop', 'pl'] },
];

export const CLASS_GROUPS = ['Food & drink', 'Trades', 'Professional services', 'Retail & personal care'] as const;

export function findClass(code: string): BusinessClass | undefined {
  return BUSINESS_CLASSES.find((c) => c.code === code);
}
