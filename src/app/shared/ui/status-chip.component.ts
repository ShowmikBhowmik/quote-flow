import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type ChipTone = 'neutral' | 'posted' | 'amber' | 'stamp' | 'navy';

@Component({
  selector: 'app-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.data-tone]': 'tone()' },
  template: `<ng-content />`,
  styles: `
    :host { display: inline-flex; align-items: center; gap: 6px; padding: 2px 8px; border-radius: 2px; font-size: var(--t-xs); font-weight: 600; letter-spacing: 0.02em; text-transform: uppercase; line-height: 1.5; white-space: nowrap; }
    :host::before { content: ''; inline-size: 6px; block-size: 6px; border-radius: 50%; background: currentColor; }
    :host([data-tone='neutral']) { color: var(--ink-2); background: var(--surface-2); }
    :host([data-tone='posted']) { color: var(--posted); background: var(--posted-tint); }
    :host([data-tone='amber']) { color: var(--amber-ink); background: var(--amber-tint); }
    :host([data-tone='stamp']) { color: var(--stamp); background: var(--stamp-tint); }
    :host([data-tone='navy']) { color: var(--navy-text); background: var(--navy-tint); }
  `,
})
export class Chip {
  readonly tone = input<ChipTone>('neutral');
}
