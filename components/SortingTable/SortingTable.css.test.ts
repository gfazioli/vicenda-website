import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/*
 * The table's one pass is CSS, so what keeps it honest is the stylesheet's own
 * shape (the same rules `Motion.css.test.ts` holds for the reveals): it runs
 * only without Reduce Motion, moves only what the compositor runs, ends on the
 * layout, and the first pose the keyframes start from is the pose an armed
 * table holds.
 */
const css = readFileSync(join(__dirname, 'SortingTable.module.css'), 'utf8');

/** The text between the braces that follow `header`, which must occur once. */
function body(header: string, source = css) {
  const at = source.indexOf(header);
  if (at < 0 || source.indexOf(header, at + 1) >= 0) {
    throw new Error(`expected exactly one ${JSON.stringify(header)}`);
  }
  const open = source.indexOf('{', at + header.length - 1);
  let depth = 0;
  for (let i = open; i < source.length; i += 1) {
    if (source[i] === '{') {
      depth += 1;
    } else if (source[i] === '}') {
      depth -= 1;
      if (depth === 0) {
        return source.slice(open + 1, i);
      }
    }
  }
  throw new Error(`unclosed ${header}`);
}

/** One declaration's value in a block, e.g. `transform`. */
function value(block: string, property: string) {
  const match = block.match(new RegExp(`(?:^|[\\s;{])${property}:\\s*([^;]+);`));
  if (!match) {
    throw new Error(`no ${property} in ${block}`);
  }
  return match[1].trim().replace(/\s+/g, ' ');
}

const MOTION = '@media screen and (prefers-reduced-motion: no-preference) {';
const keyframes = [...css.matchAll(/@keyframes ([\w-]+) \{/g)].map((match) => match[1]);

describe('SortingTable.module.css, the one pass', () => {
  it('animates nothing outside the no-Reduce-Motion block', () => {
    const outside = css.replace(body(MOTION), '');
    expect(outside).not.toMatch(/\banimation(-name)?:\s*(?!none)/);
    expect(body(MOTION)).toMatch(/animation/);
  });

  it('never loops, and fills only backwards, so it ends on the layout', () => {
    expect(css).not.toMatch(/infinite|animation-iteration-count/);
    expect(css).not.toMatch(/\b(forwards|both)\b/);
    const motion = body(MOTION);
    const shorthands = [...motion.matchAll(/animation: ([^;]+);/g)]
      .map((match) => match[1])
      .filter((one) => one !== 'none');
    expect(shorthands.length).toBeGreaterThan(5);
    for (const one of shorthands) {
      expect(one).toMatch(/\bbackwards$/);
    }
  });

  it.each(keyframes)('@keyframes %s moves only opacity and transform', (name) => {
    const properties = [...body(`@keyframes ${name} {`).matchAll(/([\w-]+):/g)]
      .map((match) => match[1])
      .filter((p) => p !== 'animation-timing-function');
    expect(properties.length).toBeGreaterThan(0);
    expect(properties.filter((p) => p !== 'opacity' && p !== 'transform')).toEqual([]);
  });

  it.each([
    ['.leaving {', 'table-leave', ['opacity', 'transform']],
    ['.rising {', 'table-rise', ['transform']],
    ['.dealt {', 'table-deal', ['transform']],
    ['.countWas {', 'table-count-out', ['opacity', 'transform']],
    ['.countNow {', 'table-count-in', ['opacity', 'transform']],
  ] as const)('an armed %s holds the pose %s starts from', (selector, frames, properties) => {
    const armed = body(`.table[data-armed]:not([data-revealed]) ${selector}`, body(MOTION));
    // The first stop, `from` or `0%`: what is between its braces.
    const from = body(`@keyframes ${frames} {`);
    const first = from.slice(from.indexOf('{') + 1, from.indexOf('}'));
    for (const property of properties) {
      expect(value(armed, property)).toBe(value(first, property));
    }
  });

  it('rests the top card in the Bin, gone, by a trip written in its own lengths', () => {
    const rest = body('.leaving {', css.replace(body(MOTION), ''));
    expect(value(rest, 'opacity')).toBe('0');
    expect(value(rest, 'transform')).toContain('var(--to-bin-x), var(--to-bin-y)');
    // The trip is defined for both layouts: trays beside the hand, and tiles
    // above it on a phone.
    expect(css.match(/--to-bin-x:/g)).toHaveLength(2);
    expect(css.match(/--to-bin-y:/g)).toHaveLength(2);
  });
});
