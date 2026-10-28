---
name: Quote Flow
description: Small-business insurance priced like a passbook balance; every input posts a line and the balance rolls.
colors:
  paper: "#f5f1e8"
  paper-2: "#ede8dc"
  surface: "#fbf9f4"
  surface-2: "#ebe6da"
  ink: "#1a1e2b"
  ink-2: "#4b5160"
  ink-3: "#646b7a"
  rule: "#d9d3c5"
  rule-strong: "#b9b2a2"
  navy: "#13294b"
  navy-hover: "#1b3762"
  navy-ink: "#f5f1e8"
  navy-text: "#13294b"
  navy-tint: "#dfe5ef"
  brass: "#a67c2e"
  brass-text: "#8a6522"
  brass-on-navy: "#d1a94f"
  brass-tint: "#f1e6cc"
  accent: "#13294b"
  accent-ink: "#f5f1e8"
  accent-hover: "#1b3762"
  stamp: "#b4372f"
  stamp-tint: "#f6ddd9"
  posted: "#186a42"
  posted-tint: "#dff0e5"
  amber-ink: "#8a5a00"
  amber-tint: "#f7e8c3"
  focus: "#1f5fb8"
  skeleton: "#e6e0d2"
  line-gl: "#2458c5"
  line-bop: "#1f7a4d"
  line-wc: "#c77d0a"
  line-pl: "#b4372f"
typography:
  display:
    fontFamily: "Public Sans Variable, Public Sans, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "3.5rem"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.03em"
    fontFeature: "tnum"
  headline:
    fontFamily: "Public Sans Variable, Public Sans, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  subhead:
    fontFamily: "Public Sans Variable, Public Sans, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Public Sans Variable, Public Sans, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.015em"
  card-title:
    fontFamily: "Public Sans Variable, Public Sans, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    letterSpacing: "-0.01em"
  lede:
    fontFamily: "Public Sans Variable, Public Sans, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Public Sans Variable, Public Sans, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  body-sm:
    fontFamily: "Public Sans Variable, Public Sans, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.5
  label:
    fontFamily: "Public Sans Variable, Public Sans, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    letterSpacing: "0.04em"
  button:
    fontFamily: "Public Sans Variable, Public Sans, system-ui, -apple-system, Segoe UI, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.005em"
rounded:
  chip: "2px"
  control: "4px"
  card: "6px"
  sheet: "10px"
spacing:
  s-1: "4px"
  s-2: "8px"
  s-3: "12px"
  s-4: "16px"
  s-5: "24px"
  s-6: "32px"
  s-7: "48px"
  s-8: "64px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "0 24px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "0 24px"
    height: "44px"
  button-secondary-hover:
    backgroundColor: "{colors.surface-2}"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ink-2}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "44px"
  button-sm:
    padding: "0 12px"
    height: "34px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "44px"
  limit-pill:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.control}"
    padding: "0 12px"
    height: "32px"
  limit-pill-selected:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.accent-ink}"
  chip-neutral:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink-2}"
    typography: "{typography.label}"
    rounded: "{rounded.chip}"
    padding: "2px 8px"
  chip-posted:
    backgroundColor: "{colors.posted-tint}"
    textColor: "{colors.posted}"
  chip-amber:
    backgroundColor: "{colors.amber-tint}"
    textColor: "{colors.amber-ink}"
  chip-stamp:
    backgroundColor: "{colors.stamp-tint}"
    textColor: "{colors.stamp}"
  chip-navy:
    backgroundColor: "{colors.navy-tint}"
    textColor: "{colors.navy-text}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "16px 24px"
  ledger:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "24px 24px 16px"
  callout:
    backgroundColor: "{colors.navy-tint}"
    textColor: "{colors.navy-text}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.control}"
    padding: "12px 16px"
  error-box:
    backgroundColor: "{colors.stamp-tint}"
    textColor: "{colors.stamp}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.control}"
    padding: "12px 16px"
  top-bar:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.navy-ink}"
    height: "56px"
---

<!-- impeccable:design-schema 1 -->

# Design System: Quote Flow

## Overview

**Creative North Star: "The Passbook"**

Quote Flow treats a commercial insurance premium the way a bank passbook treats a balance. Every input the visitor makes posts a line into a ledger that is always on screen; the balance rolls to its new figure in tabular digits; a coverage that is removed is struck through in stamp red before it leaves. The visual world is navy cloth and buff paper: a slim navy header carrying a brass wordmark, a warm paper ground, ink-dark text, hairline rules, and one brass underline beneath the balance. Nothing floats over a gradient and no number is hidden until the end.

The system is deliberately quiet so the number can be loud. One type family (Public Sans, a self-hosted variable font) sets everything from the 56px balance to 12px column labels. Chrome is deleted wherever a rule and spacing do the job: tables separate rows with hairlines, the dashboard snapshot is four figures between two rules, and navigation is text with a brass underline. The four coverages each own a transit-line colour (cobalt, green, amber, scarlet) that appears on the ledger swatch, the card's switch and border tint, and the dashboard's line bars, never as decoration.

The system rejects the insurtech default (white cards, rounded blue buttons, a hero metric floating over a gradient) and its dark neo-brutalist opposite. It also rejects the literal "flow" reading: no water, no waves, no gradients.

**Key Characteristics:**
- A live ledger is the first thing on screen and stays sticky; the premium is never a reveal.
- Navy, paper, ink and brass; brass is reserved for the brand mark, the balance underline, active underlines, and the digits while they move.
- Hairline rules do the work of borders; a single soft shadow is reserved for the docked mobile ledger and an expanded card.
- One family, Public Sans, with tabular figures on every money value.
- Tight radii: 2px chips, 4px controls, 6px cards.
- One easing curve, 150 to 250ms state transitions, and two designed moments: the posting line and the bind stamp.

## Colors

A warm paper ground with ink text, a navy cloth header and action colour, a brass foil accent, and four coverage line colours.

### Primary
- **Navy Cloth** (`navy`): The header bar, the primary action fill (`accent` aliases it), the current stepper dot, the selected limit pill, and the stepper's progress fill. Hover darkens to `navy-hover`. Text on navy is `navy-ink`, the paper colour.
- **Navy Text** (`navy-text`): Links, the "What it covers" disclosure, and the Recommended tag's text; sits on `navy-tint` for the callout and the navy chip.
- **Accent** (`accent`, `accent-ink`, `accent-hover`): Navy with paper ink, hover `navy-hover`. Primary buttons, the selected limit pill, the current step dot, the stepper fill and the checkbox accent all use `accent`, never `navy` directly, so the action colour can be changed in one place.

### Secondary
- **Brass Foil** (`brass`): The 3px balance underline under the annual premium, the top bar's lower hairline (at 35%), the active nav and dashboard tab underline, and the skip link. `brass-on-navy` is the brighter foil used for the wordmark and the mobile ledger handle amount on navy. `brass-text` colours the digits while a money figure is counting. `brass-tint` is the selection highlight.

### Tertiary
- **Coverage Lines** (`line-gl` cobalt, `line-bop` green, `line-wc` amber, `line-pl` scarlet): One colour per coverage, like a transit map. Each appears as the 10px swatch dot on its ledger line, the checked colour of its card's switch, a 45% tint of the card's border when selected, the review swatch, and the 18x6px line bars on the dashboard policy table. Nothing else uses them.
- **Stamp Red** (`stamp`, `stamp-tint`): Void and error only: the struck-through reversal line, invalid field borders, error text, the balance-due figure, the error box, and the stamp chip.
- **Posted Green** (`posted`, `posted-tint`): Bound, paid, credit: completed stepper dots, credit lines in the ledger, the "covers" checkmarks, the bound stamp, and the posted chip.
- **Amber** (`amber-ink`, `amber-tint`): Pending or in-review states on the dashboard (the amber chip, the claim timeline's current dot).

### Neutral
- **Paper** (`paper`): The page ground. `paper-2` is the deeper paper under it, reserved for recessed areas.
- **Surface** (`surface`): Cards, the ledger, inputs, and the hovered table row; one step lighter than paper so a card reads as a sheet laid on the desk. `surface-2` is the pressed/hover tone for secondary and quiet buttons and the neutral chip.
- **Ink** (`ink`): Body text, headings, money. `ink-2` is secondary text (ledes, hints, labels, table headers); `ink-3` is faint text (placeholders, notes, the "Off" state, to-do steps).
- **Rule** (`rule`): Hairline dividers between ledger lines, table rows, panel sections, and card borders. `rule-strong` is the input and secondary button border, table header underline, and the resting switch track.
- **Focus** (`focus`): The 2px focus ring on every control and the input focus border, plus a 25% halo on inputs.
- **Skeleton** (`skeleton`): Loading placeholders with a shimmer highlight.

### Named Rules
**The Brass Is Foil Rule.** Brass is applied to small areas only: the wordmark, a 3px underline, a 2px active-tab rule, the moving digits. It never fills a button or a surface.

**The One Line Per Coverage Rule.** A coverage colour appears only where that coverage is named: its ledger swatch, its switch, its card's border tint, its review swatch, its dashboard bar. Never on a heading, a button, or a background.

**The Stamp Rule.** Red means void or error, green means posted, paid, bound or credit. Neither is used for emphasis.

## Typography

**Display Font:** Public Sans Variable (with Public Sans, system-ui, -apple-system, Segoe UI, sans-serif)
**Body Font:** Public Sans Variable (same stack)
**Label/Mono Font:** none; code and keyboard samples fall back to ui-monospace, SF Mono, Menlo, monospace

**Character:** One humanist grotesque at every size, self-hosted as a variable font. It reads like a form that was typeset by someone who cared: clear at 12px in a column header, assured at 56px as a balance. Money is always set with tabular figures so a rolling number never jitters.

### Hierarchy
- **Display** (600, 3.5rem / 56px, 1.05, -0.03em, tabular): The annual premium in the ledger. Below 960px the open docked ledger shows it at 2.25rem; the closed handle shows it at 1.375rem in brass on navy.
- **Headline** (600, 2.25rem / 36px, 1.2, -0.015em): Each step's h1 and the dashboard account name. The policy number on the bind confirmation uses the same size at weight 700 with +0.02em tracking.
- **Subhead** (600, 1.75rem / 28px, 1.2, -0.015em): The h2 default.
- **Title** (600, 1.375rem / 22px, 1.2, -0.015em): Review section headings, dashboard panel headings, dashboard snapshot figures, the bound stamp.
- **Card Title** (600, 1.125rem / 18px, -0.01em): The coverage name and its price in a coverage card, the wordmark (at 700).
- **Lede** (400, 1.125rem / 18px, 1.5): The one-sentence explanation under each step heading, capped at 58ch.
- **Body** (400, 1rem / 16px, 1.5): Inputs, buttons, monthly figure, definition values. Paragraph measures cap at 46 to 70ch.
- **Body Small** (500, 0.875rem / 14px, 1.5): Ledger line labels and amounts, card summaries, table cells, nav links, stepper labels, hints and errors, footer text.
- **Label** (600, 0.75rem / 12px, 0.04em, uppercase): Table column headers, definition-list terms, the dashboard snapshot terms, the "Covers / Does not cover" headings inside an expanded card. Status chips use the same size at 0.02em. Ledger line details and notes use 12px without the uppercase.
- **Button** (600, 1rem, 1, 0.005em): All buttons; the small variant drops to 0.875rem.

### Named Rules
**The Tabular Money Rule.** Every dollar figure, count, and policy number is set with `font-variant-numeric: tabular-nums`. The balance counts to its new value over 420ms with a cubic ease-out and turns brass while it moves; under reduced motion it snaps.

**The One Family Rule.** There is no display face and no second family. Hierarchy is carried by size, weight (400 to 800) and tracking alone.

## Layout

The page is a centred column of at most 1200px with 24px side gutters (16px below 760px). The quote flow is a two-column grid: the step column takes 7 fractions, the ledger column 5 fractions with a 300px minimum, 64px apart. The ledger column is sticky at 80px from the top (the 56px header plus 24px). The five-step rail runs above the step column; the step itself is a 32px-gapped stack of heading, lede, one group of controls, and a Back/Continue row with Back pushed to the left and the primary action on the right. Two-up field groups use a 24px gap. The bound confirmation collapses to a single 820px column.

Below 960px the grid becomes one column and the ledger detaches: it docks to the bottom of the viewport as a sheet with a 60px navy handle showing the annual figure, and the content gets 96px of extra bottom padding so nothing hides under it. Below 760px the header drops the carrier name, the stepper rail collapses to "Step 3 of 5 · Coverage", and dashboard tables lose their outer padding and secondary columns while the action column stays sticky at the right edge. Below 600px two-column field groups stack, the action row stacks with the primary action on top, and the expanded card's two lists stack.

The dashboard is a single column with a 24px vertical rhythm: account heading, a four-figure snapshot strip divided by hairlines (two-by-two below 760px), a tab row, and the panel.

Spacing uses an 8-point scale with a 4px half-step and a 12px three-quarter step: 4, 8, 12, 16, 24, 32, 48, 64. Controls are 44px tall (34px small); switches 40x24; stepper dots 22px.

**The Ledger Stays Rule.** The premium is visible on every quote step at every width: sticky in the right column on desktop, docked as a sheet on mobile. A step never scrolls it away.

## Elevation & Depth

Depth is tonal and ruled, not cast. A card is one step lighter than the paper (`surface` on `paper`) with a 1px `rule` border; sections separate with hairlines; the header sits on navy. Shadows exist in two places only: the single soft shadow (`--shadow`) lifts the docked mobile ledger off the page and an expanded coverage card off its siblings, and focus states use a 3px translucent halo on inputs. Sibling coverage cards dim to 55% opacity when another card is expanded, so emphasis comes from contrast rather than lift.

### Shadow Vocabulary
- **Lift** (`box-shadow: 0 12px 32px -12px rgba(19, 41, 75, 0.35)`): The docked ledger sheet below 960px and an expanded coverage card. Navy-tinted so it reads as cloth shadow on paper.
- **Focus halo** (`box-shadow: 0 0 0 3px color-mix(in srgb, var(--focus) 25%, transparent)`): Focused inputs and selects, with the border turning `focus`. Invalid fields use a 22% `stamp` halo instead.
- **Sticky column edge** (`box-shadow: -8px 0 8px -8px rgba(0, 0, 0, 0.18)`): The action column of a horizontally scrolling table on phones.
- **Switch knob** (`box-shadow: 0 1px 2px rgba(0,0,0,0.25)`): The 18px white knob on a coverage switch.

### Named Rules
**The One Floating Element Rule.** At rest, nothing on the page casts a shadow. The shadow belongs to the element that has left the page flow (the docked ledger) or the card the visitor has opened.

## Shapes

Corners are tight and rank by object: 2px on chips, tags and focus outlines; 4px on every control (buttons, inputs, selects, limit pills, callouts, the nav link hover, the stamp); 6px on sheets (coverage cards, the ledger, the dashed empty state); 10px on the top corners only of the docked mobile ledger; 3px on skeletons. Switches (12px track, round knob), stepper dots, ledger swatches and timeline dots are full circles. Borders are 1px: `rule` for sheets, `rule-strong` for inputs and secondary buttons; the ledger's total line and the summary total row use a 2px `ink` rule above; the bound stamp is a 3px `posted` outline rotated -8deg. Icons are stroke-only SVG on a 24px grid at 1.75px with round caps and joins, 16 to 20px in use.

**The Hairline Rule.** Separation is a 1px rule in `rule`, never a gap filled with a shadow or a second background. Where a rule would be the only thing on screen, remove it and let spacing speak.

## Components

Everything is set in Public Sans, sits on paper, and changes state in 160 to 200ms on a single ease (`cubic-bezier(0.2, 0, 0, 1)`).

### Buttons
- **Shape:** Tight corners (4px), 44px tall, 24px horizontal padding, 8px gap to an icon.
- **Primary:** `accent` fill with `accent-ink` text (navy on paper); hover to `accent-hover`; press nudges down 1px; disabled at 55% opacity.
- **Secondary:** Transparent with a 1px `rule-strong` border and `ink` text; hover fills `surface-2`. Used for Back and for "New quote" on the dashboard.
- **Quiet:** Transparent, `ink-2` text, 12px padding; hover to `ink` on `surface-2`.
- **Small:** 34px tall, 12px padding, 14px text.
- **Focus:** 2px `focus` outline offset 2px on every button; on navy the outline switches to `brass`.

### Chips
- **Style:** 12px uppercase 600 at 0.02em, 2px corners, 2px 8px padding, a 6px dot in the text colour before the label.
- **Tones:** neutral (`ink-2` on `surface-2`), posted (`posted` on `posted-tint`), amber (`amber-ink` on `amber-tint`), stamp (`stamp` on `stamp-tint`), navy (`navy-text` on `navy-tint`). The "Recommended" tag on a coverage card is the navy tone without the dot or uppercase.

### Cards / Containers
- **Corner Style:** 6px.
- **Background:** `surface` with a 1px `rule` border; a selected coverage card tints the border 45% toward its coverage line colour.
- **Shadow Strategy:** None at rest; the `Lift` shadow only while expanded (see Elevation & Depth). Siblings of an expanded card dim to 55%.
- **Internal Padding:** 16px 24px (16px all round below 600px).
- **Coverage card anatomy:** A 40x24 switch (role switch; checked colour is the coverage line) and the name at 18px 600 on the left, the annual price in tabular 18px or "Off" in `ink-3` on the right; a 14px `ink-2` summary capped at 60ch; a row of limit pills (32px, 4px corners, `paper` fill with `rule-strong` border; selected inverts to `accent`) with a "What it covers" disclosure in `navy-text`; the expanded panel opens below a hairline as two columns of checklist items with `posted` checks and `ink-3` crosses.
- **Callout / Error box:** 12px 16px, 4px corners, 14px text, `navy-tint` or `stamp-tint` with an icon leading.
- **Empty state:** A 1px dashed `rule-strong` border, 6px corners, 48px 16px padding, centred.

### Inputs / Fields
- **Style:** 44px, `surface` fill, 1px `rule-strong` border, 4px corners, 12px padding, 16px text; label 14px 600 above with an 8px gap; hint 14px `ink-2`; a leading affix (the dollar sign) sits 12px in with the text indented 28px. Selects use a custom 18px chevron and no native appearance; number inputs hide spinners; money inputs set tabular figures.
- **Focus:** Border to `focus` and a 3px 25% `focus` halo; no outline.
- **Hover:** Border to `ink-3`.
- **Error / Disabled:** `aria-invalid` turns the border `stamp` and the halo to 22% `stamp`; the error message is 14px `stamp` with an icon. The agree checkbox is a native 20px control with `accent` as its accent colour.

### Navigation
- **Top bar:** 56px, `navy` fill, `navy-ink` text, sticky, with a lower hairline at 35% `brass`. Brand: a 26px line-art mark, the wordmark at 18px 700 in `brass-on-navy`, the carrier name at 12px 70% opacity. Nav links are 14px 500 at 78% opacity with 8px 12px padding; hover lifts to full opacity on an 8% wash; the active link carries a 2px `brass` underline inset 12px. Focus rings on navy are `brass`.
- **Stepper rail:** Five equal cells; each a 22px circle (1.5px `rule-strong` outline with the step number in 11px tabular; completed steps fill `posted` with a check; the current step fills `accent`) beside a 14px label (`ink-2`, current in `ink` 600, remaining in `ink-3`). A 3px `rule` track below with an `accent` fill that animates width over 360ms. Below 760px it collapses to one line of text.
- **Dashboard tabs:** 14px 500 `ink-2` links on a hairline, active in `ink` 600 with a 2px `brass` underline.
- **Tables:** 14px cells, 12px uppercase `ink-2` headers over a `rule-strong` line, rows divided by `rule` hairlines with 12px padding, numeric columns right-aligned and tabular, row hover to `surface`.

### Premium Ledger
The signature component: a `surface` sheet with 6px corners and a 1px `rule` border. The balance block (24px padding) stacks a 14px 600 `ink-2` caption, the 56px tabular annual figure, a 48x3px `brass` underline, and the monthly figure at 16px 500. Below a hairline, each posted line is a three-column grid (10px swatch dot, label and 12px `ink-2` detail, right-aligned tabular amount) with 12px vertical padding and a `rule` hairline beneath; credits turn the amount `posted` and draw a hollow `posted` ring for a dot; fees have no dot; the list closes on an Annual premium total row with a 2px `ink` rule above it. A new line posts by sliding in from 6px above over 220ms; a removed line is struck through in `stamp` (1.5px line-through, text turned `stamp`) and held for 60% of a 760ms void before it collapses. The balance counts to its new value over 420ms and turns `brass-text` while moving. Below 960px the sheet fixes to the bottom of the viewport with 10px top corners and the `Lift` shadow; a 60px navy handle shows "Annual premium" with the figure in `brass-on-navy` at 22px and a chevron that rotates 180deg when the sheet opens to reveal the lines (capped at 60dvh).

### Money
A dollar figure that counts rather than jumps: 420ms, cubic ease-out, tabular digits, `brass-text` while moving, settled value only for assistive technology. Negative values use a true minus sign. Reduced motion snaps.

### Bind Stamp
On the bound confirmation the policy number is the only headline (36px 700, +0.02em) and a "Bound" stamp lands beside it: 22px 800 uppercase at 0.12em, 3px `posted` outline, 4px corners, rotated -8deg, scaling from 1.6 to 1 over 420ms after a 160ms delay.

### Skeleton
A text-shaped block in `skeleton` with 3px corners and a 1.4s linear shimmer in `skeleton-shine`; sized by width and height so rows vary. Dashboard tables and the snapshot load through skeletons, never spinners. Reduced motion stops the shimmer.

## Do's and Don'ts

### Do:
- **Do** keep the premium ledger on screen on every quote step: sticky in the 5/12 column above 960px, docked as a bottom sheet below.
- **Do** set every money figure, count and policy number in tabular figures and let it count to its new value over 420ms, snapping under reduced motion.
- **Do** post changes as lines: a new ledger entry slides in over 220ms; a removed one is struck through in `stamp` before it leaves.
- **Do** use `accent` for the primary action, the current step and the selected pill so the theme can flip it from navy to brass.
- **Do** separate rows and sections with 1px `rule` hairlines and 12 to 24px of space.
- **Do** colour a coverage only with its own line colour, and only on its swatch, switch, border tint and dashboard bar.
- **Do** hold radii to 2px chips, 4px controls, 6px sheets.
- **Do** transition state on `cubic-bezier(0.2, 0, 0, 1)` in 160 to 250ms, and keep the 2px `focus` outline (brass on navy) visible on every control.
- **Do** load with skeletons and label demo data as demo data.

### Don't:
- **Don't** hide the price until the end or float a number over a gradient; the balance is the first thing in the right column.
- **Don't** fill a button or surface with brass in light mode; brass is foil, applied in underlines and the wordmark.
- **Don't** cast a shadow on an element at rest. Only the docked ledger and an expanded coverage card lift.
- **Don't** introduce a second type family, a display face, or an icon font; icons are 1.75px stroke SVG on a 24px grid.
- **Don't** use coverage line colours, stamp red or posted green for emphasis or decoration.
- **Don't** add an uppercase kicker above a heading; 12px uppercase is reserved for column headers and definition terms.
- **Don't** round corners past 6px on a card or 4px on a control, and don't add gradients, waves or any literal "flow" imagery.
- **Don't** choreograph page loads or animate layout; motion belongs to posting, counting, the stepper fill and the bind stamp.
