import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** One stroke weight, one grid. Paths are authored on a 24px box. */
const PATHS = {
  check: 'M5 12.5l4.5 4.5L19 7.5',
  chevronDown: 'M6 9.5l6 6 6-6',
  chevronRight: 'M9.5 6l6 6-6 6',
  arrowLeft: 'M19 12H5m6-6l-6 6 6 6',
  arrowRight: 'M5 12h14m-6-6l6 6-6 6',
  sun: 'M12 4V2m0 20v-2m8-8h2M2 12h2m13.66-5.66l1.41-1.41M4.93 19.07l1.41-1.41m0-11.32L4.93 4.93m14.14 14.14l-1.41-1.41M12 8a4 4 0 100 8 4 4 0 000-8z',
  moon: 'M20 14.5A8 8 0 019.5 4a8 8 0 1010.5 10.5z',
  shield: 'M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z',
  building: 'M4 21V5a1 1 0 011-1h9a1 1 0 011 1v16M4 21h16M15 9h4a1 1 0 011 1v11M8 8h3M8 12h3M8 16h3',
  hardHat: 'M4 16h16M6 16v-2a6 6 0 0112 0v2M10 8V5h4v3',
  briefcase: 'M4 8h16v12H4zM9 8V5h6v3M4 13h16',
  bag: 'M5 8h14l-1 13H6L5 8zm4 0V6a3 3 0 016 0v2',
  mapPin: 'M12 21s6-6.2 6-11a6 6 0 10-12 0c0 4.8 6 11 6 11zm0-9a2 2 0 100-4 2 2 0 000 4z',
  users: 'M16 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1m14-8a4 4 0 100-8 4 4 0 000 8zm5 8v-1a4 4 0 00-3-3.9M14 4.1a4 4 0 010 7.8',
  receipt: 'M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21V3zM9 8h6M9 12h6M9 16h4',
  file: 'M14 3H7a1 1 0 00-1 1v16a1 1 0 001 1h10a1 1 0 001-1V8l-4-5zm0 0v5h4',
  alert: 'M12 9v4m0 4h.01M10.3 4.2L2.6 18a2 2 0 001.7 3h15.4a2 2 0 001.7-3L13.7 4.2a2 2 0 00-3.4 0z',
  info: 'M12 16v-4m0-4h.01M12 22a10 10 0 100-20 10 10 0 000 20z',
  x: 'M6 6l12 12M18 6L6 18',
  external: 'M14 4h6v6m0-6L10 14M20 14v6H4V4h6',
  refresh: 'M20 12a8 8 0 01-14.5 4.6M4 12a8 8 0 0114.5-4.6M4 4v4.5h4.5M20 20v-4.5h-4.5',
} as const;

export type IconName = keyof typeof PATHS;

@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[attr.aria-hidden]': 'true', '[style.--icon-size.px]': 'size()' },
  template: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" focusable="false">
      <path [attr.d]="d()" />
    </svg>
  `,
  styles: `
    :host { display: inline-flex; inline-size: var(--icon-size, 20px); block-size: var(--icon-size, 20px); flex: none; vertical-align: middle; }
    svg { inline-size: 100%; block-size: 100%; }
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(20);
  protected readonly d = computed(() => PATHS[this.name()]);
}
