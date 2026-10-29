/**
 * Vicenda's mascot: the envelope. The app icon's pearl envelope with its
 * cobalt V, on two little legs, with a morning sun rising behind its top edge
 * (the owner chose this one, concept A "Busta", over a swallow and a sorting
 * card on 2026-10-29). Drawn for this site from our own icon, as netfox.app's
 * fox, lancetta.app's and findergit.app's characters are from theirs: a
 * vendor's character inviting clicks on this app would read as an endorsement
 * it never gave (user, 2026-09-23, on Lancetta).
 *
 * The grids ARE the drawing: `SpriteSvg.tsx` turns each run of one letter into
 * a rectangle, so what is below is what the page draws, cell for cell. 22
 * cells wide, 18 tall, at 4 px a cell. One letter per colour (`PALETTE`), `.`
 * empty. Every layer is drawn at full width, so a row here is a row of the
 * sprite; `top` says which row it starts on, and the layers are painted in
 * the order `compose` paints them: the sun behind the envelope, the arms and
 * the legs over it.
 *
 * Five poses, as the owner saw them: standing; two frames of a walk (`LEGS`),
 * one foot lifted and then the other; the wave, the left arm raised from the
 * shoulder in a staircase whose every step shares an EDGE with the last -- a
 * diagonal of single cells touches only at corners, and at this size reads
 * as a row of dots, not as an arm (measured on lancetta.app's) -- to a pearl
 * hand held up beside the envelope; and the eyes shut (`BLINK`), the one row
 * that closes them.
 *
 * Ported from netfox.app's `sprite.ts`: the layers, `runs` and `compose` work
 * the same way, and only the drawing is this site's.
 */

/**
 * The drawing's colours: the icon's pearl and cobalt, the morning gold of the
 * sun. Hex, since an SVG attribute cannot take `var()`; the two the site's
 * stylesheets also use are its tokens (`--vic-cobalt`, `--vic-sun` in
 * theme/global.css), and `sprite.test.ts` holds those together.
 */
export const PALETTE = {
  /** The outline, the eyes, the smile. */
  K: '#050c24',
  /** Pearl: the envelope's paper, and the raised hand. */
  P: '#eef2f9',
  /** Ice: the paper's shade along the bottom. */
  I: '#c3d1e8',
  /** --vic-cobalt: the icon's V, the envelope's flap. */
  C: '#0047b0',
  /** The shine in each eye. */
  W: '#ffffff',
  /** The arms and legs: a light sky, readable on the night ground. */
  L: '#3d9bff',
  /** --vic-sun: the morning gold of the sun behind its top edge. */
  A: '#ffc24a',
  /** Peach: the cheeks. */
  O: '#ff9a7a',
} as const;

export type Colour = keyof typeof PALETTE;

export const WIDTH = 22;
export const HEIGHT = 18;

/** Rows 0-1: the sun, rising behind the envelope's top edge, and two rays. */
export const SUN = [
  // Kept one row a line, like every layer here, by this comment: the
  // formatter would put short strings on one line and lose the picture.
  '......A..AAAA..A......',
  '........AAAAAA........',
];

/** Rows 2-14: the envelope, its V, the eyes open, the cheeks and the smile. */
export const BODY = [
  '...KKKKKKKKKKKKKKKK...',
  '...KCCPPPPPPPPPPCCK...',
  '...KPCCPPPPPPPPCCPK...',
  '...KPPCCPPPPPPCCPPK...',
  '...KPPPCCPPPPCCPPPK...',
  '...KPPPPCCPPCCPPPPK...',
  '...KPPPPPCCCCPPPPPK...',
  '...KPPPPPPCCPPPPPPK...',
  '...KPPKWPPPPPPKWPPK...',
  '...KPPKKPPPPPPKKPPK...',
  '...KPOPPPKPPKPPPOPK...',
  '...KIIIIIIKKIIIIIIK...',
  '...KKKKKKKKKKKKKKKK...',
];
export const BODY_TOP = 2;

/**
 * Row 10: the eyes shut. Painted over the open eyes, the paper covers their
 * top row and leaves the bottom one, a line: the blink.
 */
export const BLINK = ['......PP......PP......'];
export const BLINK_TOP = 10;

/**
 * Rows 5-11: the arms. Standing, both hang at the envelope's sides; waving,
 * the left one is up, and the right one lifts a row with it.
 */
export const ARMS = {
  stand: [
    '......................',
    '......................',
    '......................',
    '......................',
    '......................',
    '..L................L..',
    '..L................L..',
  ],
  point: [
    'PP....................',
    'PP....................',
    'LL....................',
    '.LL...................',
    '..L................L..',
    '...................L..',
    '......................',
  ],
} as const;
export const ARMS_TOP = 5;

/**
 * Rows 15-17: the legs. Standing, both feet on the ground; walking, one foot
 * is lifted a row while the other stands.
 */
export const LEGS = {
  stand: ['.......LL....LL.......', '.......LL....LL.......', '......LLL....LLL......'],
  stepA: ['.......LL....LL.......', '.......LL....LLL......', '......LLL.............'],
  stepB: ['.......LL....LL.......', '......LLL....LL.......', '.............LLL......'],
} as const;
export const LEGS_TOP = 15;

/** The centre of the sun, in cells: where its light spreads from (netfox.app's ping). */
export const PING = { x: 11, y: 1 } as const;

export interface Cell {
  x: number;
  y: number;
  width: number;
  colour: Colour;
}

/** Each horizontal run of one colour in `rows`, as one rectangle, `top` rows down. */
export function runs(rows: readonly string[], top = 0): Cell[] {
  const cells: Cell[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const colour = row[x];
      if (colour === '.') {
        x += 1;
        continue;
      }
      let width = 1;
      while (row[x + width] === colour) {
        width += 1;
      }
      cells.push({ x, y: y + top, width, colour: colour as Colour });
      x += width;
    }
  });
  return cells;
}

export type Pose = 'stand' | 'stepA' | 'stepB' | 'point' | 'blink';

/**
 * One whole pose as rows, the layers painted in order, for the tests and for
 * reading the drawing as the page shows it. `SpriteSvg.tsx` draws the same
 * layers as rectangles in the same order.
 */
export function compose(pose: Pose): string[] {
  const grid = Array.from({ length: HEIGHT }, () => Array<string>(WIDTH).fill('.'));
  const paint = (rows: readonly string[], top: number) =>
    rows.forEach((row, y) =>
      [...row].forEach((c, x) => {
        if (c !== '.') {
          grid[top + y][x] = c;
        }
      })
    );
  paint(SUN, 0);
  paint(BODY, BODY_TOP);
  if (pose === 'blink') {
    paint(BLINK, BLINK_TOP);
  }
  paint(pose === 'point' ? ARMS.point : ARMS.stand, ARMS_TOP);
  paint(pose === 'stepA' || pose === 'stepB' ? LEGS[pose] : LEGS.stand, LEGS_TOP);
  return grid.map((row) => row.join(''));
}
