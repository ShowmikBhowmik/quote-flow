import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** A text-shaped placeholder. Width is a CSS length so rows can vary. */
@Component({
  selector: 'app-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
    '[style.inline-size]': 'width()',
    '[style.block-size]': 'height()',
  },
  template: '',
  styles: `
    :host {
      display: block;
      border-radius: 3px;
      background: var(--skeleton);
      background-image: linear-gradient(90deg, transparent 0, var(--skeleton-shine) 50%, transparent 100%);
      background-size: 200% 100%;
      animation: shimmer 1.4s linear infinite;
    }
    @keyframes shimmer { from { background-position: 150% 0; } to { background-position: -50% 0; } }
    @media (prefers-reduced-motion: reduce) { :host { animation: none; } }
  `,
})
export class Skeleton {
  readonly width = input('100%');
  readonly height = input('0.9em');
}
