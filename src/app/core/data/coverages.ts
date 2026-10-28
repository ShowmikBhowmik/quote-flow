import { CoverageDefinition, CoverageId } from '../models/quote.model';

export const COVERAGES: Readonly<Record<CoverageId, CoverageDefinition>> = {
  gl: {
    id: 'gl',
    name: 'General Liability',
    shortName: 'General liability',
    summary: 'Covers injuries to other people and damage to their property that your business causes.',
    covers: [
      'A customer slips in your shop and sues',
      'Your crew damages a client’s floor on a job',
      'Legal defense costs, even if the claim is groundless',
    ],
    excludes: ['Your own property', 'Injuries to your employees', 'Mistakes in professional advice'],
    limits: [
      { id: '500k-1m', label: '$500K / $1M', factor: 1.0 },
      { id: '1m-2m', label: '$1M / $2M', factor: 1.28 },
      { id: '2m-4m', label: '$2M / $4M', factor: 1.65 },
    ],
    defaultLimit: '1m-2m',
    ratedOn: 'revenue',
  },
  bop: {
    id: 'bop',
    name: 'Business Owner’s Policy',
    shortName: 'Property (BOP)',
    summary: 'Protects your building, equipment and inventory, plus lost income if you have to close.',
    covers: [
      'Fire, theft or storm damage to your space and gear',
      'Income you lose while you rebuild',
      'Spoiled stock after a power outage',
    ],
    excludes: ['Floods and earthquakes', 'Vehicles', 'Wear and tear'],
    limits: [
      { id: '50k', label: '$50K contents', factor: 0.7 },
      { id: '100k', label: '$100K contents', factor: 1.0 },
      { id: '250k', label: '$250K contents', factor: 1.6 },
      { id: '500k', label: '$500K contents', factor: 2.4 },
    ],
    defaultLimit: '100k',
    ratedOn: 'property',
  },
  wc: {
    id: 'wc',
    name: 'Workers’ Compensation',
    shortName: 'Workers’ comp',
    summary: 'Pays medical bills and lost wages when an employee is hurt on the job. Required in most states once you hire.',
    covers: [
      'Medical treatment for a work injury',
      'Partial wages while an employee recovers',
      'Employer liability if you are sued over an injury',
    ],
    excludes: ['Injuries off the clock', 'Independent contractors with their own policy'],
    limits: [{ id: 'statutory', label: 'Statutory limits', factor: 1.0 }],
    defaultLimit: 'statutory',
    ratedOn: 'payroll',
  },
  pl: {
    id: 'pl',
    name: 'Professional Liability',
    shortName: 'Professional liability',
    summary: 'Covers claims that your work or advice caused a client to lose money. Also called errors & omissions.',
    covers: [
      'A missed deadline costs a client a contract',
      'An error in a deliverable has to be redone',
      'Defense costs when a client alleges negligence',
    ],
    excludes: ['Bodily injury', 'Intentional wrongdoing', 'Work done before the policy started'],
    limits: [
      { id: '250k', label: '$250K per claim', factor: 0.8 },
      { id: '500k', label: '$500K per claim', factor: 1.0 },
      { id: '1m', label: '$1M per claim', factor: 1.3 },
      { id: '2m', label: '$2M per claim', factor: 1.62 },
    ],
    defaultLimit: '500k',
    ratedOn: 'revenue',
  },
};

export const COVERAGE_LIST: readonly CoverageDefinition[] = [
  COVERAGES.gl,
  COVERAGES.bop,
  COVERAGES.wc,
  COVERAGES.pl,
];
