import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';
import { Premium } from '../../core/models/quote.model';
import { Icon } from '../../shared/ui/icon.component';
import { Money } from '../../shared/ui/money.component';

/**
 * The passbook. Every rated line posts here as it is added, the balance rolls
 * to its new figure, and a removed coverage is struck through before it leaves.
 */
@Component({
  selector: 'app-premium-ledger',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Money, Icon],
  host: { '[class.open]': 'open()', '[class.compact]': 'compact()' },
  template: `
    <div class="ledger">
      <button type="button" class="handle" (click)="open.set(!open())" [attr.aria-expanded]="open()" aria-controls="ledger-lines">
        <span class="handle-label">Annual premium</span>
        <span class="handle-amount"><app-money [value]="premium().annual" /></span>
        <app-icon class="handle-chevron" name="chevronDown" [size]="18" />
      </button>

      <div class="balance">
        <p class="caption">Estimated annual premium</p>
        <p class="annual" data-testid="annual-premium"><app-money [value]="premium().annual" /></p>
        <p class="monthly">
          @if (premium().empty) {
            <span class="muted">Add a coverage to start pricing</span>
          } @else {
            <span><app-money [value]="premium().monthly" /> a month</span>
          }
        </p>
        <p class="sr-only" aria-live="polite" aria-atomic="true">
          @if (!premium().empty) { Annual premium updated to {{ premium().annual }} dollars. }
        </p>
      </div>

      <div class="lines" id="ledger-lines">
        @if (premium().empty) {
          <p class="empty">
            @if (compact()) {
              Tell us about your business and the price will post here as you go.
            } @else {
              Nothing selected yet. Each coverage you add posts a line here and the balance recalculates.
            }
          </p>
        }
        <ol class="list">
          @for (line of visibleLines(); track line.id) {
            <li class="line" [attr.data-kind]="line.kind" [attr.data-coverage]="line.coverage ?? null" animate.enter="posting" animate.leave="voiding">
              <span class="swatch" aria-hidden="true"></span>
              <span class="text">
                <span class="label">{{ line.label }}</span>
                @if (line.detail) { <span class="detail">{{ line.detail }}</span> }
              </span>
              <span class="amount"><app-money [value]="line.amount" /></span>
            </li>
          }
        </ol>
        @if (!premium().empty) {
          <p class="note">Rates are illustrative. A real quote would be subject to underwriting review.</p>
        }
      </div>
    </div>
  `,
  styles: `
    :host { display: block; }
    .ledger { background: var(--surface); border: 1px solid var(--rule); border-radius: 6px; overflow: hidden; }
    .handle { display: none; }
    .balance { padding: var(--s-5) var(--s-5) var(--s-4); border-block-end: 1px solid var(--rule); }
    .caption { font-size: var(--t-sm); font-weight: 600; color: var(--ink-2); }
    .annual { font-size: var(--t-money); font-weight: 600; letter-spacing: -0.03em; line-height: 1.05; margin-block-start: var(--s-1); color: var(--ink); }
    .annual::after { content: ''; display: block; inline-size: 48px; block-size: 3px; background: var(--brass); margin-block-start: var(--s-3); border-radius: 2px; }
    .monthly { margin-block-start: var(--s-3); font-size: var(--t-base); color: var(--ink); font-weight: 500; }
    .lines { padding: var(--s-2) var(--s-5) var(--s-4); }
    .empty { padding: var(--s-4) 0 var(--s-3); color: var(--ink-2); font-size: var(--t-sm); line-height: 1.55; }
    .list { list-style: none; margin: 0; padding: 0; }
    .line { display: grid; grid-template-columns: 10px minmax(0, 1fr) auto; gap: var(--s-3); align-items: start; padding: var(--s-3) 0; border-block-end: 1px solid var(--rule); overflow: hidden; }
    .line:last-child { border-block-end: 0; }
    .swatch { inline-size: 10px; block-size: 10px; border-radius: 50%; margin-block-start: 6px; background: var(--ink-3); }
    .line[data-coverage='gl'] .swatch { background: var(--line-gl); }
    .line[data-coverage='bop'] .swatch { background: var(--line-bop); }
    .line[data-coverage='wc'] .swatch { background: var(--line-wc); }
    .line[data-coverage='pl'] .swatch { background: var(--line-pl); }
    .line[data-kind='credit'] .swatch { background: transparent; border: 1.5px solid var(--posted); }
    .line[data-kind='fee'] .swatch, .line[data-kind='total'] .swatch { background: transparent; }
    .line[data-kind='total'] { border-block-start: 2px solid var(--ink); margin-block-start: var(--s-1); padding-block-start: var(--s-3); font-weight: 600; }
    .text { display: grid; gap: 2px; min-inline-size: 0; }
    .label { font-size: var(--t-sm); font-weight: 500; }
    .detail { font-size: var(--t-xs); color: var(--ink-2); line-height: 1.4; }
    .amount { font-size: var(--t-sm); font-weight: 500; white-space: nowrap; font-variant-numeric: tabular-nums; }
    .line[data-kind='credit'] .amount { color: var(--posted); }
    .note { margin-block-start: var(--s-3); font-size: var(--t-xs); color: var(--ink-3); line-height: 1.45; }

    /* Posting: a new line slides in under the last entry. Voiding: strike it through, then let it go. */
    .posting { animation: post 220ms var(--ease) both; }
    @keyframes post { from { opacity: 0; transform: translateY(-6px); max-block-size: 0; padding-block: 0; } to { opacity: 1; transform: none; max-block-size: 120px; } }
    .voiding { animation: void-out 760ms var(--ease) both; }
    .voiding .label, .voiding .amount { text-decoration: line-through; text-decoration-color: var(--stamp); text-decoration-thickness: 1.5px; color: var(--stamp); }
    @keyframes void-out { 0% { opacity: 1; max-block-size: 120px; } 60% { opacity: 1; max-block-size: 120px; } 100% { opacity: 0; max-block-size: 0; padding-block: 0; border-block-end-width: 0; } }

    @media (max-width: 960px) {
      :host { position: fixed; inset-inline: 0; inset-block-end: 0; z-index: 30; }
      .ledger { border-radius: 10px 10px 0 0; border-block-end: 0; box-shadow: var(--shadow); }
      .handle { display: grid; grid-template-columns: 1fr auto auto; align-items: center; gap: var(--s-3); inline-size: 100%; min-block-size: 60px; padding: 0 var(--s-4); background: var(--navy); color: var(--navy-ink); border: 0; font: inherit; cursor: pointer; text-align: start; }
      .handle-label { font-size: var(--t-sm); font-weight: 500; opacity: 0.85; }
      .handle-amount { font-size: var(--t-lg); font-weight: 600; font-variant-numeric: tabular-nums; color: var(--brass-on-navy); }
      .handle-chevron { transition: transform 200ms var(--ease); }
      :host(.open) .handle-chevron { transform: rotate(180deg); }
      .balance { display: none; }
      .lines { display: none; max-block-size: min(60dvh, 480px); overflow: auto; }
      :host(.open) .lines { display: block; }
      :host(.open) .balance { display: block; }
      :host(.open) .annual { font-size: var(--t-2xl); }
    }
  `,
})
export class PremiumLedger {
  readonly premium = input.required<Premium>();
  /** On the first step there is nothing to price yet; the ledger says so, briefly. */
  readonly compact = input(false);
  protected readonly open = signal(false);
  /** Every posted line, closing on the balance like a passbook page. */
  protected readonly visibleLines = computed(() => this.premium().lines);
}
