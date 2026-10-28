import { UsState } from '../models/quote.model';

export const US_STATES: readonly UsState[] = [
  { code: 'AZ', name: 'Arizona', factor: 0.95 },
  { code: 'CA', name: 'California', factor: 1.25 },
  { code: 'CO', name: 'Colorado', factor: 1.0 },
  { code: 'FL', name: 'Florida', factor: 1.2 },
  { code: 'GA', name: 'Georgia', factor: 0.95 },
  { code: 'IL', name: 'Illinois', factor: 1.05 },
  { code: 'MA', name: 'Massachusetts', factor: 1.15 },
  { code: 'MI', name: 'Michigan', factor: 0.95 },
  { code: 'MN', name: 'Minnesota', factor: 0.9 },
  { code: 'NC', name: 'North Carolina', factor: 0.9 },
  { code: 'NE', name: 'Nebraska', factor: 0.85 },
  { code: 'NJ', name: 'New Jersey', factor: 1.2 },
  { code: 'NY', name: 'New York', factor: 1.3 },
  { code: 'OH', name: 'Ohio', factor: 0.9 },
  { code: 'OR', name: 'Oregon', factor: 1.0 },
  { code: 'PA', name: 'Pennsylvania', factor: 1.0 },
  { code: 'TX', name: 'Texas', factor: 1.0 },
  { code: 'VA', name: 'Virginia', factor: 0.9 },
  { code: 'WA', name: 'Washington', factor: 1.05 },
  { code: 'WI', name: 'Wisconsin', factor: 0.9 },
];

export function findState(code: string): UsState | undefined {
  return US_STATES.find((s) => s.code === code);
}
