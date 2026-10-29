/**
 * The promo films' spring, sampled for CSS -- cross-ported from lancetta.app,
 * which took it from netfox.app (its #77).
 *
 * The sibling sites' films write every move as the closed-form step response
 * of a damped spring -- a frequency `f` in Hz and a damping ratio `zeta` --
 * which is also what SwiftUI's `spring(response: 1 / f, dampingFraction: zeta)`
 * runs in the apps. CSS cannot run a spring, but `linear()` runs any curve
 * sampled finely enough, so every spring this site uses is sampled here into
 * `theme/global.css`, each with its duration: the time its envelope takes to
 * fall under 0.4%. A curve and its duration only make sense as a pair, which is
 * why neither is typed by hand.
 *
 * `springs.test.ts` fails when the stylesheet and this file disagree, and prints
 * the block to paste. The positive control is netfox.app: its landing spring,
 * sampled this way, comes out identical to the last digit, so the three sites
 * move alike.
 */

/**
 * The page's tempo against the app's. Vicenda sorts a card on
 * `spring(response: 0.34, dampingFraction: 0.86)` (`T.spring` in the app's
 * `Tokens.swift`), which is over in about 0.35 s: right for a hand doing the
 * sorting, too quick to follow for a reader watching it once. The page plays
 * that same curve at half speed.
 */
export const PAGE_PACE = 0.5;

/** The app's sort spring, as SwiftUI states it: a response in seconds. */
export const APP_SORT = { response: 0.34, zeta: 0.86 } as const;

export interface Spring {
  /** The custom property; its duration is `<name>-duration`. */
  name: string;
  f: number;
  zeta: number;
  /** What it moves, printed above it. */
  note: string;
}

/**
 * Every spring the site runs. The first two are the films' own, at the films'
 * tempo -- the page is read once, as a film is watched once. `sort` is the
 * app's, at the page's pace, because the hero's sorting table is a copy of the
 * app's and has to move the way it does, only slower.
 */
export const springs: Spring[] = [
  { name: '--vic-spring', f: 1.4, zeta: 0.5, note: 'a card landing: overshoots and settles' },
  { name: '--vic-spring-soft', f: 1.8, zeta: 0.75, note: 'a heading rising: barely overshoots' },
  {
    name: '--vic-spring-sort',
    f: (1 / APP_SORT.response) * PAGE_PACE,
    zeta: APP_SORT.zeta,
    note: 'the app sorting a card, at the page pace',
  },
];

/** The film's `spr`: 0 at rest, 1 once settled, past 1 on the overshoot. */
export function spr(t: number, f: number, zeta: number): number {
  if (t <= 0) {
    return 0;
  }
  const w = 2 * Math.PI * f;
  const a = zeta * w;
  const envelope = Math.exp(-a * t);
  if (zeta >= 1) {
    const r = envelope * (1 + w * t);
    return r < 2e-5 ? 1 : 1 - r;
  }
  if (envelope < 2e-5) {
    return 1;
  }
  const wd = w * Math.sqrt(1 - zeta * zeta);
  return 1 - envelope * (Math.cos(wd * t) + (a / wd) * Math.sin(wd * t));
}

/** Seconds until the envelope is under 0.4%. */
export function settle(f: number, zeta: number): number {
  const w = 2 * Math.PI * f;
  if (zeta < 1) {
    return Math.log(250) / (zeta * w);
  }
  // Critically damped: (1 + wt)e^(-wt) has no closed-form inverse.
  let lo = 0;
  let hi = 100 / w;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if ((1 + w * mid) * Math.exp(-w * mid) > 0.004) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  return hi;
}

const trim = (value: number, digits: number) => String(Number(value.toFixed(digits)));

/** The spring as `linear()` stops, its duration in ms, and how far it overshoots. */
export function sample({ f, zeta }: Spring, points = 48) {
  const duration = settle(f, zeta);
  const stops: string[] = [];
  let peak = 0;
  for (let i = 0; i <= points; i++) {
    const value = spr((i / points) * duration, f, zeta);
    peak = Math.max(peak, value);
    if (i === 0) {
      stops.push('0');
    } else if (i === points) {
      stops.push('1');
    } else {
      stops.push(`${trim(value, 4)} ${trim((i / points) * 100, 2)}%`);
    }
  }
  return { ms: Math.round(duration * 1000), stops, overshoot: (peak - 1) * 100 };
}

/**
 * A spring for Web Animations, which cannot read a custom property: its
 * duration in ms and its `linear()`, straight from the source the stylesheet
 * is generated from. Never parse the stylesheet instead: minified, `879ms` is
 * served as `.879s`, and `parseFloat` reads that as 0.879 ms (lancetta.app's
 * panel lost its spring that way).
 */
export function springFor(name: string) {
  const spring = springs.find((candidate) => candidate.name === name);
  if (!spring) {
    throw new Error(`No spring named ${name}`);
  }
  const { ms, stops } = sample(spring);
  return { ms, easing: `linear(${stops.join(', ')})` };
}

/** The block `theme/global.css` carries between its `springs` markers. */
export function springsCss(): string {
  const lines = springs.flatMap((spring) => {
    const { ms, stops, overshoot } = sample(spring);
    return [
      `  /* f=${trim(spring.f, 2)} Hz, zeta=${spring.zeta}: overshoot ${trim(Math.max(0, overshoot), 1)}%, ${ms} ms -- ${spring.note} */`,
      `  ${spring.name}-duration: ${ms}ms;`,
      `  ${spring.name}: linear(`,
      ...stops.map((stop, i) => `    ${stop}${i < stops.length - 1 ? ',' : ''}`),
      '  );',
    ];
  });
  return lines.join('\n');
}
