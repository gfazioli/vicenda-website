import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { cssBlock, cssValue } from '@/test-utils/css';
import { STAND_OFF_PX, UNDER_TABLE_PX } from './HeroGuide';
import { HEIGHT } from './sprite';

/*
 * Layout is not something jsdom draws, so these read the stylesheet's shape;
 * the geometry they hold was measured in a browser.
 */
const css = readFileSync(join(__dirname, 'Mascot.module.css'), 'utf8');

/** The phone media block that restyles the card's bubble: the top-level one, after its comment. */
const phone = () => cssBlock(css, '*/\n@media (max-width: $mantine-breakpoint-sm) {');

describe('the envelope under the table', () => {
  it('stands where `HeroGuide` measures it standing', () => {
    // The room for its bubble is worked out in script from these two
    // lengths: the strip under the table, and how far in from its left edge.
    expect(cssValue(cssBlock(css, '.anchor {'), 'inset')).toBe(`0 0 -${UNDER_TABLE_PX}px`);
    expect(cssValue(cssBlock(css, '.hint {'), 'left')).toBe(`${STAND_OFF_PX}px`);
    expect(cssValue(cssBlock(css, '.feet {'), 'left')).toBe(`${STAND_OFF_PX}px`);
  });

  it('blinks once, never on a loop', () => {
    // Every motion on the home page plays once (`Welcome.tsx`); the preview
    // blinked every few seconds for ever.
    for (const match of css.matchAll(/animation:\s*blink[^;]*;/g)) {
      expect(match[0]).toMatch(/ 1;$/);
    }
    expect(cssValue(cssBlock(css, '\n.blink {'), 'opacity')).toBe('0');
  });
});

describe('the envelope in the corner', () => {
  it('rides above the hero’s table, whose cards stack up to z-index 30', () => {
    // The corner is z-index 10, under the bar and every overlay; the table
    // keeps its cards' stacking to itself, or they cover the envelope.
    expect(cssValue(cssBlock(css, '\n.corner {'), 'z-index')).toBe('10');
    const hero = readFileSync(join(__dirname, '../Welcome/Hero.module.css'), 'utf8');
    expect(cssValue(cssBlock(hero, '\n.stage {'), 'isolation')).toBe('isolate');
  });
});

describe('the Support card bubble on a phone', () => {
  // On a phone the bubble hangs from its bottom, so a line that wraps to more
  // rows grows up into the room above the card instead of down over the
  // card's title (it covered it at 320-430px on netfox.app).
  it('hangs from its bottom, above the card, not from the top of the mascot', () => {
    const bubble = cssBlock(phone(), '.cardBubble {');
    expect(cssValue(bubble, 'top')).toBe('auto');
    expect(cssValue(bubble, 'bottom')).toBe('rem(4px)');
    expect(cssValue(bubble, 'transform-origin')).toBe('bottom right');
  });

  it('keeps the tail where it was, measured up from the feet of a sprite this tall', () => {
    // The tail sat 14px down a bubble 4px above the top of the sprite: 20px
    // from its top to the tail's lower corner. From the feet that is the
    // sprite's height less 20px, less the 4px the bubble stands above the card.
    const tail = cssBlock(phone(), '.cardBubble::before {');
    expect(cssValue(tail, 'top')).toBe('auto');
    expect(cssValue(tail, 'bottom')).toBe(`calc(var(--cell) * ${HEIGHT} - rem(24px))`);
  });
});
