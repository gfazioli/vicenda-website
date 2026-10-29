import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { theme } from '../../theme';
import {
  ARMS,
  ARMS_TOP,
  BLINK,
  BLINK_TOP,
  BODY,
  BODY_TOP,
  compose,
  HEIGHT,
  LEGS,
  LEGS_TOP,
  PALETTE,
  PING,
  runs,
  SUN,
  WIDTH,
} from './sprite';

const layers: [readonly string[], number][] = [
  [SUN, 0],
  [BODY, BODY_TOP],
  [BLINK, BLINK_TOP],
  [ARMS.stand, ARMS_TOP],
  [ARMS.point, ARMS_TOP],
  [LEGS.stand, LEGS_TOP],
  [LEGS.stepA, LEGS_TOP],
  [LEGS.stepB, LEGS_TOP],
];

/** The cells of `rows` holding one of `letters`, as "x,y". */
function cellsOf(rows: readonly string[], letters: string, top = 0) {
  const found = new Set<string>();
  rows.forEach((row, y) =>
    [...row].forEach((c, x) => {
      if (letters.includes(c)) {
        found.add(`${x},${y + top}`);
      }
    })
  );
  return found;
}

/*
 * The five poses as the owner chose them (concept A of
 * `vicenda-mascot-sprites-v1.mjs`, 2026-10-29), printed from that file's own
 * `compose`: the layers here have to paint exactly this, cell for cell.
 */
const ENVELOPE = [
  '......A..AAAA..A......',
  '........AAAAAA........',
  '...KKKKKKKKKKKKKKKK...',
  '...KCCPPPPPPPPPPCCK...',
  '...KPCCPPPPPPPPCCPK...',
  '...KPPCCPPPPPPCCPPK...',
  '...KPPPCCPPPPCCPPPK...',
  '...KPPPPCCPPCCPPPPK...',
  '...KPPPPPCCCCPPPPPK...',
  '...KPPPPPPCCPPPPPPK...',
  '..LKPPKWPPPPPPKWPPKL..',
  '..LKPPKKPPPPPPKKPPKL..',
  '...KPOPPPKPPKPPPOPK...',
  '...KIIIIIIKKIIIIIIK...',
  '...KKKKKKKKKKKKKKKK...',
];
const STANDING = ['.......LL....LL.......', '.......LL....LL.......', '......LLL....LLL......'];
const CHOSEN = {
  stand: [...ENVELOPE, ...STANDING],
  stepA: [
    ...ENVELOPE,
    '.......LL....LL.......',
    '.......LL....LLL......',
    '......LLL.............',
  ],
  stepB: [
    ...ENVELOPE,
    '.......LL....LL.......',
    '......LLL....LL.......',
    '.............LLL......',
  ],
  point: [
    ...ENVELOPE.slice(0, 5),
    'PP.KPPCCPPPPPPCCPPK...',
    'PP.KPPPCCPPPPCCPPPK...',
    'LL.KPPPPCCPPCCPPPPK...',
    '.LLKPPPPPCCCCPPPPPK...',
    '..LKPPPPPPCCPPPPPPKL..',
    '...KPPKWPPPPPPKWPPKL..',
    '...KPPKKPPPPPPKKPPK...',
    ...ENVELOPE.slice(12),
    ...STANDING,
  ],
  blink: [...ENVELOPE.slice(0, 10), '..LKPPPPPPPPPPPPPPKL..', ...ENVELOPE.slice(11), ...STANDING],
} as const;

describe('the mascot sprite', () => {
  it('is drawn on one grid, 22 by 18, every layer inside it', () => {
    for (const [rows, top] of layers) {
      expect(rows.every((row) => row.length === WIDTH)).toBe(true);
      expect(top + rows.length).toBeLessThanOrEqual(HEIGHT);
    }
    // The legs stand on the last row, under the envelope.
    expect(LEGS_TOP + LEGS.stand.length).toBe(HEIGHT);
    expect(BODY_TOP + BODY.length).toBe(LEGS_TOP);
  });

  it('paints, pose for pose, the drawing the owner chose', () => {
    for (const [pose, rows] of Object.entries(CHOSEN)) {
      expect([pose, compose(pose as keyof typeof CHOSEN)]).toEqual([pose, rows]);
    }
  });

  it('uses no colour the palette does not name', () => {
    const used = new Set(
      layers
        .map(([rows]) => rows.join(''))
        .join('')
        .replace(/\./g, '')
    );
    expect([...used].filter((c) => !(c in PALETTE))).toEqual([]);
  });

  it('shares the icon’s cobalt and the sun’s gold with the site’s tokens', () => {
    // Hex in the sprite, since an SVG attribute cannot take var(); this is
    // what keeps the two from drifting apart. The cobalt lives in the theme's
    // `vicenda` ladder (`--vic-cobalt` aliases its shade 8), the gold in
    // theme/global.css.
    const css = readFileSync(join(__dirname, '../../theme/global.css'), 'utf8');
    expect(css).toMatch(/--vic-cobalt:\s*var\(--mantine-color-vicenda-8\);/);
    expect(PALETTE.C).toBe(theme.colors?.vicenda?.[8]?.toLowerCase());
    expect(PALETTE.A).toBe(css.match(/--vic-sun:\s*(#[0-9a-f]{6});/i)?.[1]?.toLowerCase());
  });

  it('spreads its light from the middle of the sun behind its top edge', () => {
    const stand = compose('stand');
    expect(stand[PING.y][PING.x]).toBe('A');
    // The sun is the only gold, and it is all above the envelope's top edge.
    const gold = [...cellsOf(stand, 'A')].map((c) => Number(c.split(',')[1]));
    expect(Math.max(...gold)).toBeLessThan(BODY_TOP);
  });

  it('waves with an arm whose every step shares an edge with the last', () => {
    // A diagonal of single cells touches only at corners and reads as dots.
    // Walk the left arm from the hand along shared edges: it has to reach the
    // envelope's side, and take every cell of the arm with it.
    const left = ARMS.point.map((row) => row.slice(0, 3));
    const arm = cellsOf(left, 'LP', ARMS_TOP);
    const hand = [...cellsOf(left, 'P', ARMS_TOP)];
    const seen = new Set([hand[0]]);
    const queue = [hand[0]];
    while (queue.length) {
      const [x, y] = queue.shift()!.split(',').map(Number);
      for (const next of [`${x + 1},${y}`, `${x - 1},${y}`, `${x},${y + 1}`, `${x},${y - 1}`]) {
        if (arm.has(next) && !seen.has(next)) {
          seen.add(next);
          queue.push(next);
        }
      }
    }
    expect(seen).toEqual(arm);
    // The shoulder: the arm meets the envelope's outline, edge to edge.
    const outline = cellsOf(BODY, 'K', BODY_TOP);
    const shoulder = [...arm].filter((cell) => {
      const [x, y] = cell.split(',').map(Number);
      return outline.has(`${x + 1},${y}`);
    });
    expect(shoulder.length).toBeGreaterThan(0);
    // The hand is up, above the eyes, and pearl so it reads as a hand.
    expect(Math.max(...hand.map((c) => Number(c.split(',')[1])))).toBeLessThan(BLINK_TOP);
  });

  it('walks by lifting one foot, then the other', () => {
    const grounded = (legs: readonly string[]) => cellsOf([legs[2]], 'L');
    expect(grounded(LEGS.stand).size).toBe(6);
    expect(grounded(LEGS.stepA).size).toBe(3);
    expect(grounded(LEGS.stepB).size).toBe(3);
    expect([...grounded(LEGS.stepA)].some((c) => grounded(LEGS.stepB).has(c))).toBe(false);
    expect(compose('stepA')).not.toEqual(compose('stepB'));
  });

  it('blinks by closing the eyes, and changes nothing else', () => {
    const open = compose('stand');
    const shut = compose('blink');
    const changed = open.flatMap((row, y) =>
      [...row].flatMap((c, x) => (c === shut[y][x] ? [] : [`${x},${y}`]))
    );
    // The eyes' top row, the pupils and their shine: four cells, no more.
    expect(changed).toEqual(['6,10', '7,10', '14,10', '15,10']);
  });
});

describe('runs', () => {
  it('turns each run of one colour into one rectangle, rows down from `top`', () => {
    expect(runs(['.KKP', 'CC..'], 10)).toEqual([
      { x: 1, y: 10, width: 2, colour: 'K' },
      { x: 3, y: 10, width: 1, colour: 'P' },
      { x: 0, y: 11, width: 2, colour: 'C' },
    ]);
  });
});
