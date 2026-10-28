import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { CoverageDefinition, CoverageSelection } from '../../core/models/quote.model';
import { Icon } from '../../shared/ui/icon.component';
import { Money } from '../../shared/ui/money.component';

/**
 * One coverage. The header is a real checkbox so it toggles from the keyboard;
 * "Details" expands the card to show what it covers and the limit options.
 */
@Component({
  selector: 'app-coverage-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Icon, Money],
  host: {
    '[class.selected]': 'selection().selected',
    '[class.expanded]': 'expanded()',
    '[class.dimmed]': 'dimmed()',
    '[attr.data-coverage]': 'definition().id',
    '[style.--line]': 'lineVar()',
  },
  template: `
    <div class="head">
      <input
        class="switch"
        type="checkbox"
        role="switch"
        [id]="'cov-' + definition().id"
        [checked]="selection().selected"
        (change)="toggle.emit($any($event.target).checked)"
        [attr.aria-describedby]="'cov-' + definition().id + '-summary'"
      />
      <label class="title" [for]="'cov-' + definition().id">
        <span class="name">{{ definition().name }}</span>
        @if (recommended()) { <span class="rec">Recommended</span> }
      </label>
      <span class="price" [class.quiet]="!selection().selected" aria-live="off">
        @if (selection().selected && annual() !== null) {
          <app-money [value]="annual()!" /><span class="per">/yr</span>
        } @else {
          <span class="off">Off</span>
        }
      </span>
    </div>
    <p class="summary" [id]="'cov-' + definition().id + '-summary'">{{ definition().summary }}</p>
    <div class="row">
      @if (selection().selected && definition().limits.length > 1) {
        <fieldset class="limits">
          <legend class="sr-only">{{ definition().name }} limit</legend>
          @for (limit of definition().limits; track limit.id) {
            <label class="limit" [class.on]="limit.id === selection().limit">
              <input type="radio" [name]="'limit-' + definition().id" [value]="limit.id" [checked]="limit.id === selection().limit" (change)="limitChange.emit(limit.id)" />
              <span>{{ limit.label }}</span>
            </label>
          }
        </fieldset>
      }
      <button type="button" class="details" (click)="expanded.set(!expanded())" [attr.aria-expanded]="expanded()" [attr.aria-controls]="'cov-' + definition().id + '-details'">
        {{ expanded() ? 'Hide details' : 'What it covers' }}
        <app-icon name="chevronDown" [size]="16" />
      </button>
    </div>
    <div class="details-panel" [id]="'cov-' + definition().id + '-details'" [hidden]="!expanded()">
      <div class="cols">
        <div>
          <h3>Covers</h3>
          <ul>@for (item of definition().covers; track item) { <li><app-icon name="check" [size]="16" />{{ item }}</li> }</ul>
        </div>
        <div>
          <h3>Does not cover</h3>
          <ul class="no">@for (item of definition().excludes; track item) { <li><app-icon name="x" [size]="16" />{{ item }}</li> }</ul>
        </div>
      </div>
    </div>
  `,
  styles: `
    :host { display: block; background: var(--surface); border: 1px solid var(--rule); border-radius: 6px; padding: var(--s-4) var(--s-5); transition: border-color 200ms var(--ease), opacity 200ms var(--ease), transform 200ms var(--ease), box-shadow 200ms var(--ease); }
    :host(.selected) { border-color: color-mix(in srgb, var(--line) 45%, var(--rule)); }
    :host(.expanded) { box-shadow: var(--shadow); }
    :host(.dimmed) { opacity: 0.55; }
    :host(:has(.switch:focus-visible)) { outline: 2px solid var(--focus); outline-offset: 2px; }
    .head { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; gap: var(--s-3); align-items: center; }
    .switch { appearance: none; inline-size: 40px; block-size: 24px; margin: 0; border-radius: 12px; background: var(--rule-strong); position: relative; cursor: pointer; transition: background 200ms var(--ease); flex: none; }
    .switch::after { content: ''; position: absolute; inset-block-start: 3px; inset-inline-start: 3px; inline-size: 18px; block-size: 18px; border-radius: 50%; background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,0.25); transition: transform 200ms var(--ease); }
    .switch:checked { background: var(--line); }
    .switch:checked::after { transform: translateX(16px); }
    .switch:focus-visible { outline: none; }
    .title { display: flex; align-items: baseline; gap: var(--s-2); flex-wrap: wrap; cursor: pointer; min-inline-size: 0; }
    .name { font-size: var(--t-md); font-weight: 600; letter-spacing: -0.01em; }
    .rec { font-size: var(--t-xs); font-weight: 600; color: var(--navy-text); background: var(--navy-tint); padding: 1px 6px; border-radius: 2px; }
    .price { font-size: var(--t-md); font-weight: 600; font-variant-numeric: tabular-nums; white-space: nowrap; }
    .per { font-size: var(--t-xs); color: var(--ink-2); font-weight: 500; margin-inline-start: 2px; }
    .off { font-size: var(--t-sm); color: var(--ink-3); font-weight: 500; }
    .summary { margin-block-start: var(--s-3); color: var(--ink-2); font-size: var(--t-sm); line-height: 1.5; max-inline-size: 60ch; }
    .row { display: flex; align-items: center; justify-content: space-between; gap: var(--s-3); flex-wrap: wrap; margin-block-start: var(--s-3); }
    .limits { display: flex; flex-wrap: wrap; gap: var(--s-2); margin: 0; padding: 0; border: 0; }
    .limit { position: relative; display: inline-flex; align-items: center; min-block-size: 32px; padding: 0 var(--s-3); border: 1px solid var(--rule-strong); border-radius: var(--radius); font-size: var(--t-sm); font-weight: 500; cursor: pointer; background: var(--paper); transition: background 160ms var(--ease), border-color 160ms var(--ease), color 160ms var(--ease); }
    .limit input { position: absolute; inset: 0; opacity: 0; margin: 0; cursor: pointer; }
    .limit.on { background: var(--accent); border-color: var(--accent); color: var(--accent-ink); }
    .limit:hover:not(.on) { border-color: var(--ink-3); }
    .limit:has(input:focus-visible) { outline: 2px solid var(--focus); outline-offset: 2px; }
    .details { display: inline-flex; align-items: center; gap: var(--s-1); margin-inline-start: auto; background: none; border: 0; padding: var(--s-1) 0; font: inherit; font-size: var(--t-sm); font-weight: 600; color: var(--navy-text); cursor: pointer; border-radius: 2px; }
    .details app-icon { transition: transform 200ms var(--ease); }
    :host(.expanded) .details app-icon { transform: rotate(180deg); }
    .details-panel { margin-block-start: var(--s-4); padding-block-start: var(--s-4); border-block-start: 1px solid var(--rule); }
    .cols { display: grid; grid-template-columns: 1fr 1fr; gap: var(--s-5); }
    h3 { font-size: var(--t-xs); text-transform: uppercase; letter-spacing: 0.04em; color: var(--ink-2); font-weight: 600; }
    ul { list-style: none; margin: var(--s-2) 0 0; padding: 0; display: grid; gap: var(--s-2); font-size: var(--t-sm); }
    li { display: flex; gap: var(--s-2); align-items: flex-start; line-height: 1.45; }
    li app-icon { color: var(--posted); margin-block-start: 3px; }
    .no li app-icon { color: var(--ink-3); }
    @media (max-width: 600px) {
      .cols { grid-template-columns: 1fr; }
      :host { padding: var(--s-4); }
      .head { grid-template-columns: auto minmax(0, 1fr); }
      .price { grid-column: 2; justify-self: start; font-size: var(--t-base); }
      .name { font-size: var(--t-base); }
    }
  `,
})
export class CoverageCard {
  readonly definition = input.required<CoverageDefinition>();
  readonly selection = input.required<CoverageSelection>();
  readonly annual = input<number | null>(null);
  readonly recommended = input(false);
  readonly dimmed = input(false);
  readonly toggle = output<boolean>();
  readonly limitChange = output<string>();
  readonly expanded = signal(false);
  protected readonly lineVar = computed(() => `var(--line-${this.definition().id})`);
}
