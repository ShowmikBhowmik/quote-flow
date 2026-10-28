import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { QuoteStore, Step, StepId, STEPS } from '../../core/services/quote-store.service';
import { Icon } from './icon.component';

/**
 * The five-step rail. Completed steps are links; the current step is announced
 * with aria-current; later steps are inert until their guard would let them through.
 */
@Component({
  selector: 'app-stepper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Icon],
  template: `
    <nav class="stepper" [attr.aria-label]="'Quote progress, step ' + (index() + 1) + ' of ' + steps.length">
      <ol>
        @for (step of steps; track step.id; let i = $index) {
          <li [class.done]="i < index()" [class.current]="i === index()" [class.todo]="i > index()">
            @if (i < index() && current() !== 'bound') {
              <a [routerLink]="step.path"><span class="dot"><app-icon name="check" [size]="12" /></span><span class="label">{{ step.label }}</span></a>
            } @else {
              <span [attr.aria-current]="i === index() ? 'step' : null"><span class="dot">{{ i + 1 }}</span><span class="label">{{ step.label }}</span></span>
            }
          </li>
        }
      </ol>
      <div class="bar" role="presentation"><div class="fill" [style.inline-size.%]="progress()"></div></div>
      <p class="compact" aria-hidden="true">Step {{ index() + 1 }} of {{ steps.length }} <span class="sep">·</span> {{ steps[index()].label }}</p>
    </nav>
  `,
  styles: `
    .stepper { display: grid; gap: var(--s-2); }
    ol { display: flex; list-style: none; margin: 0; padding: 0; gap: var(--s-1); }
    li { flex: 1; min-inline-size: 0; }
    li > a, li > span { display: flex; max-inline-size: 100%; overflow: hidden; align-items: center; gap: var(--s-2); min-block-size: 32px; padding: 0 var(--s-2) 0 0; border-radius: 4px; text-decoration: none; color: var(--ink-2); font-size: var(--t-sm); font-weight: 500; white-space: nowrap; }
    li > a:hover { color: var(--ink); }
    
    li > a:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; }
    .dot { display: inline-grid; place-items: center; inline-size: 22px; block-size: 22px; border-radius: 50%; border: 1.5px solid var(--rule-strong); color: var(--ink-2); font-size: 11px; font-weight: 600; flex: none; font-variant-numeric: tabular-nums; transition: background 200ms var(--ease), border-color 200ms var(--ease), color 200ms var(--ease); }
    .done .dot { background: var(--posted); border-color: var(--posted); color: #fff; }
    .current .dot { background: var(--accent); border-color: var(--accent); color: var(--accent-ink); }
    .current > span { color: var(--ink); font-weight: 600; }
    .todo { color: var(--ink-3); }
    .label { overflow: hidden; text-overflow: ellipsis; }
    .bar { block-size: 3px; background: var(--rule); border-radius: 2px; overflow: hidden; }
    .fill { block-size: 100%; background: var(--accent); border-radius: 2px; transition: inline-size 360ms var(--ease); }
    .compact { display: none; margin: 0; font-size: var(--t-sm); color: var(--ink-2); font-weight: 500; }
    .sep { color: var(--ink-3); margin: 0 var(--s-1); }
    @media (max-width: 760px) {
      ol { display: none; }
      .compact { display: block; }
    }
  `,
})
export class Stepper {
  readonly current = input.required<StepId>();
  protected readonly steps: readonly Step[] = STEPS;
  protected readonly store = inject(QuoteStore);
  protected readonly index = computed(() => Math.max(0, this.steps.findIndex((s) => s.id === this.current())));
  protected readonly progress = computed(() => ((this.index() + 1) / this.steps.length) * 100);
}
