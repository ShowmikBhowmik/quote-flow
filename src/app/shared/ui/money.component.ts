import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, signal, untracked } from '@angular/core';

const EASE = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * A dollar figure that counts to its new value instead of jumping.
 *
 * Assistive technology reads the settled value only; the moving digits are
 * presentation. Under `prefers-reduced-motion` the number snaps.
 */
@Component({
  selector: 'app-money',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="sr-only">{{ format(value()) }}</span>
    <span aria-hidden="true" class="digits" [class.moving]="moving()">{{ format(shown()) }}</span>
  `,
  styles: `
    :host { display: inline; font-variant-numeric: tabular-nums; font-feature-settings: 'tnum'; }
    .moving { color: var(--brass-text); }
  `,
})
export class Money {
  readonly value = input.required<number>();
  /** Duration of the count-up in milliseconds. */
  readonly duration = input(420);
  readonly cents = input(false);

  protected readonly shown = signal(0);
  protected readonly moving = signal(false);

  private readonly destroyRef = inject(DestroyRef);
  private frame = 0;
  private initialised = false;

  constructor() {
    effect(() => {
      const target = this.value();
      const from = untracked(this.shown);
      cancelAnimationFrame(this.frame);

      const reduce = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      if (!this.initialised || reduce || from === target) {
        this.initialised = true;
        this.shown.set(target);
        this.moving.set(false);
        return;
      }

      const start = performance.now();
      const duration = this.duration();
      this.moving.set(true);
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        this.shown.set(Math.round(from + (target - from) * EASE(t)));
        if (t < 1) {
          this.frame = requestAnimationFrame(tick);
        } else {
          this.moving.set(false);
        }
      };
      this.frame = requestAnimationFrame(tick);
    });
    this.destroyRef.onDestroy(() => cancelAnimationFrame(this.frame));
  }

  protected format(n: number): string {
    const negative = n < 0;
    const abs = Math.abs(n);
    const body = this.cents()
      ? abs.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : Math.round(abs).toLocaleString('en-US');
    return `${negative ? '−' : ''}$${body}`;
  }
}
