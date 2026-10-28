# Quote Flow

A small-business insurance quote-and-bind product, built as a demo of the Angular that direct-to-business carriers ship every day.

**Live:** https://showmikbhowmik.github.io/quote-flow/

## What's in it

- **Quote flow** — five steps: business → location & payroll → coverage → review → bound. Every step is a reactive form with inline validation, and later steps are guarded until earlier ones are complete.
- **The premium ledger** — the signature piece. Every input posts a line into a passbook-style ledger on the right, and the annual balance counts to its new figure instead of jumping. Toggle a coverage off and its line is struck through before it leaves. The number is explainable: each line carries the arithmetic that made it.
- **Coverage cards** — General Liability, Business Owner's Policy, Workers' Compensation and Professional Liability, each a real switch with limit options and an expandable "what it covers" panel. The card you open lifts; the others dim.
- **Bind** — a confirmation checkbox, a simulated two-second bind, and a policy number stamped onto the confirmation.
- **Dashboard** — policies, invoices and claims for a fictional policyholder, with skeleton loading, status chips, a pay-now action, a claims filter with a designed empty state, and the policy you just bound at the top of the list.
- **Keyboard access throughout**, focus management on step change, live-region announcements for the premium, and `prefers-reduced-motion` support.

## Stack

Angular 20 · standalone components · signals · reactive forms · RxJS (the premium is a debounced stream derived from the draft signal) · `rxResource` for the dashboard loads · `animate.enter` / `animate.leave` for the ledger · zoneless change detection · hand-written CSS tokens · self-hosted Public Sans.

The backend is an in-memory service with simulated latency. Bound policies and paid invoices persist to `sessionStorage` for the length of the visit.

```bash
npm install
npm start            # dev server on http://localhost:4200
npm test             # unit tests (Vitest)
npm run e2e          # end-to-end tests (Playwright, Chromium + Pixel 7 profile)
npm run build        # production build in dist/quote-flow/browser
npm run build:pages  # same, with base href /quote-flow/ and a 404.html for SPA routing
```

## Tests

- `src/app/core/services/rating.service.spec.ts` — the rating engine: factors, minimums, credits, totals, determinism.
- `src/app/core/services/quote-store.service.spec.ts` — step gating, recommendations, persistence, the debounced premium stream.
- `src/app/shared/ui/money.component.spec.ts` — the animated figure's formatting and screen-reader text.
- `e2e/quote-flow.spec.ts` — the full flow from a blank form to a bound policy on the dashboard, live repricing, validation and focus, route guards, keyboard operation, and axe accessibility scans on every screen.

## Deploy

Pushes to `main` run the unit and end-to-end suites, build with `--base-href /quote-flow/`, and publish to GitHub Pages through `.github/workflows/deploy.yml`.

## Notes

- The rating engine in `rating.service.ts` is deterministic and deliberately simple: base rate × class factor × territory × exposure × limit, then credits and a fee. The factors are invented.
- Northlane Mutual, Fernway Coffee Roasters and every policy, invoice and claim are fictional.
- Icons are a single inline SVG set in `icon.component.ts`, drawn on one 24px grid at one stroke weight.
