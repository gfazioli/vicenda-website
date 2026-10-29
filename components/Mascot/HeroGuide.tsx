'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { IconX } from '@tabler/icons-react';
import { useReducedMotion } from '@mantine/hooks';
import { dismissGuide, guideMemory, onGuideDismissed, sayNext } from './guide';
import { MORNING } from './lines';
import { Mascot, SCALE } from './Mascot';
import { HEIGHT, PING, WIDTH } from './sprite';
import classes from './Mascot.module.css';

type Phase = 'hidden' | 'walking' | 'sniffing' | 'pointing' | 'leaving';

/** After the table comes into view, a beat before it sets out. */
export const DELAY_MS = 700;
/** Matches `walk-in` in the stylesheet. */
export const WALK_MS = 2200;
/** The hop, the blink and the sun's two rings (`hop`, `blink`, `ping`), before the hand goes up. */
export const SNIFF_MS = 1100;
/** Matches the fade on `.hint`. */
const LEAVE_MS = 260;
/** After the last resize event, before it walks in again. */
export const RESIZE_SETTLE_MS = 400;

/** How far right of the table's left edge it stands, under the Bin (`.hint`'s `left`). */
export const STAND_OFF_PX = 32;
/** Between the table's bottom edge and the top of its sun (`.anchor`'s `bottom`). */
const DROP_PX = 12;
/** Between the envelope and its bubble (`.bubble`'s `left`). */
const BUBBLE_GAP_PX = 10;
/** Kept clear at the window's right edge. */
const EDGE_PX = 24;
/**
 * The narrowest bubble worth drawing: a line still reads as a sentence at
 * this width. With less room than this beside it under the table, or no room
 * under the table at all, the envelope does not come there, and the one in
 * the corner of the window does its job instead (`ScrollGuide`).
 */
export const MIN_BUBBLE_PX = 200;

/**
 * The width left for the bubble right of the envelope under the table, in px;
 * nothing when the hero leaves no room under the table for it to stand
 * (below 48em, where the hero's foot is 56px and the envelope with its drop
 * is 84). `ScrollGuide` asks the same question, so the two never both come,
 * or both stay away.
 *
 * The anchor is the table's box and the strip under it where the envelope
 * stands (`.anchor`), so its bottom is the envelope's feet, and the hero,
 * whose overflow is hidden, has to reach that far.
 */
export function roomBeside(anchor: Element) {
  const box = anchor.getBoundingClientRect();
  const hero = anchor.closest('section')?.getBoundingClientRect();
  if (hero && box.bottom > hero.bottom + 0.5) {
    return 0;
  }
  return (
    Math.min(box.right, document.documentElement.clientWidth - EDGE_PX) -
    box.left -
    STAND_OFF_PX -
    WIDTH * SCALE -
    BUBBLE_GAP_PX
  );
}

/** The anchor reaches this far under the table: the drop and the envelope. */
export const UNDER_TABLE_PX = DROP_PX + HEIGHT * SCALE;

/**
 * The hero says Vicenda turns a morning of mail into a few decisions, and its
 * picture sorts one card into the Bin; the envelope says the morning that
 * leaves, one line at a time. It is the app icon's envelope, walking -- see
 * `sprite.ts` for the drawing and why it is ours -- and it comes in from the
 * right along the sorting table's bottom edge once the table is in view,
 * stops under the Bin, blinks awake as the sun behind it sends out its light,
 * then raises a hand and says the first line of the morning (`lines.ts`). A
 * click on it, or on Next, says the next one. Ported from netfox.app's fox,
 * which stands beside its hero's buttons and translates machine speak.
 *
 * Under the table, not beside the button: the copy's column leaves no room
 * right of "See how it works" before the table starts, and the strip under
 * the table is empty ground at every width with a hero foot tall enough.
 *
 * It arrives on EVERY load, and nothing is decided before mount, so the served
 * markup carries none of it. A reader who asked for reduced motion gets it
 * standing in place, already waving: settled, not skipped. Where the hero
 * leaves no room for it under the table, or for what it says beside it
 * (`roomBeside`), it does not come, and the envelope in the window's corner
 * says it instead; a resize that takes the room away sends it off, and one
 * that gives it back brings it in again. Dismissed here or anywhere else, it
 * goes (`guide.ts`).
 */
export function HeroGuide() {
  const reduced = useReducedMotion();
  // Read when a timer runs out, not when the page mounts: the hook answers
  // `false` on the first render and the real value after it.
  const reducedNow = useRef(reduced);
  const [phase, setPhase] = useState<Phase>('hidden');
  // The phase as the timers and the observer see it: they run outside React's
  // render, where the state would be a stale closure. Every change goes
  // through `move`, which keeps the two together.
  const phaseNow = useRef<Phase>('hidden');
  const move = useCallback((next: Phase) => {
    phaseNow.current = next;
    setPhase(next);
  }, []);
  const [index, setIndex] = useState(0);
  // One ping per mount of the rings: on arrival, then one per line.
  const [pings, setPings] = useState(0);
  const anchor = useRef<HTMLDivElement>(null);
  const feet = useRef<HTMLSpanElement>(null);
  const hint = useRef<HTMLDivElement>(null);
  const timers = useRef(new Set<number>());
  // Whether the place it stands has come into view: from then on the room
  // decides whether it is there.
  const arrived = useRef(false);
  // Which walk the pending timers belong to. A walk cut short by a resize and
  // started again must not be moved on by the timers of the first one.
  const walk = useRef(0);

  /** The hand goes up with the next line: the one after the last it said anywhere. */
  const point = useCallback(() => {
    setIndex(sayNext(MORNING.lines.length));
    move('pointing');
  }, [move]);

  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(() => {
      timers.current.delete(id);
      fn();
    }, ms);
    timers.current.add(id);
  }, []);

  const cancelTimers = useCallback(() => {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current.clear();
  }, []);

  /** The room for the bubble, handed to the stylesheet as its widest. */
  const measure = useCallback(() => {
    const el = anchor.current;
    if (!el) {
      return 0;
    }
    const room = roomBeside(el);
    el.style.setProperty('--vic-guide-room', `${Math.max(0, Math.floor(room))}px`);
    return room;
  }, []);

  /**
   * The keyboard was on something of the envelope's that is about to go: hand
   * the focus to the hero's own link, the last one before it, rather than let
   * it drop to the page. Netfox's fox stands in its row of buttons and gives
   * it to the last of them; the table here has none, so it is the hero's.
   */
  const handFocusBack = useCallback(() => {
    if (hint.current?.contains(document.activeElement)) {
      const links = anchor.current?.closest('section')?.querySelectorAll<HTMLElement>('a[href]');
      links?.[links.length - 1]?.focus();
    }
  }, []);

  const walkIn = useCallback(() => {
    if (guideMemory.dismissed || phaseNow.current !== 'hidden' || measure() < MIN_BUBBLE_PX) {
      return;
    }
    if (reducedNow.current) {
      point();
      return;
    }
    walk.current += 1;
    const mine = walk.current;
    move('walking');
    later(() => {
      if (walk.current !== mine || phaseNow.current !== 'walking') {
        return;
      }
      move('sniffing');
      later(() => {
        if (walk.current === mine && phaseNow.current === 'sniffing') {
          point();
        }
      }, SNIFF_MS);
    }, WALK_MS);
  }, [later, measure, move, point]);

  useEffect(() => {
    const el = anchor.current;
    if (!el || guideMemory.dismissed) {
      return undefined;
    }
    const arrive = () => {
      arrived.current = true;
      later(walkIn, DELAY_MS);
    };
    // Where nothing can say the table came into view, it comes after the delay.
    if (typeof IntersectionObserver === 'undefined') {
      arrive();
      return cancelTimers;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          arrive();
        }
      },
      { rootMargin: '0px 0px -10% 0px' }
    );
    // Its feet, not the whole table: Netfox's fox watches its row of
    // buttons, which is as tall as the fox, but the table is taller than a
    // screen's last tenth, and stacked under the copy (48em to 75em) its top
    // was in view at load with the strip it stands on below the fold, so it
    // walked in where nobody could see it (measured at 768 x 900).
    observer.observe(feet.current ?? el);
    return () => {
      observer.disconnect();
      cancelTimers();
    };
  }, [later, walkIn, cancelTimers]);

  // The room is the window's to give and take. Made too narrow for what it
  // says, the envelope goes, rather than squeeze its bubble into a column;
  // given the room back -- or given it for the first time, where the table
  // came into view in a narrow window -- it walks in again, from the start,
  // once the resize has settled.
  useEffect(() => {
    let settle: number | undefined;
    const resized = () => {
      window.clearTimeout(settle);
      if (!arrived.current || guideMemory.dismissed) {
        return;
      }
      const now = phaseNow.current;
      if (measure() < MIN_BUBBLE_PX) {
        if (now !== 'hidden' && now !== 'leaving') {
          handFocusBack();
          cancelTimers();
          move('hidden');
        }
      } else if (now === 'hidden') {
        settle = window.setTimeout(walkIn, RESIZE_SETTLE_MS);
      }
    };
    window.addEventListener('resize', resized);
    return () => {
      window.clearTimeout(settle);
      window.removeEventListener('resize', resized);
    };
  }, [measure, handFocusBack, cancelTimers, move, walkIn]);

  // Reduce Motion switched on mid-way: land where it was going, now.
  useEffect(() => {
    reducedNow.current = reduced;
    if (reduced && (phaseNow.current === 'walking' || phaseNow.current === 'sniffing')) {
      point();
    }
  }, [reduced, point]);

  /** A click mid-walk lands it; once it waves, each click says the next line. */
  const next = () => {
    // On its way out it stays on its way out: a key pressed on it as it fades
    // must not bring it back.
    if (phaseNow.current === 'leaving' || phaseNow.current === 'hidden') {
      return;
    }
    if (phaseNow.current !== 'pointing') {
      point();
      return;
    }
    setIndex(sayNext(MORNING.lines.length));
    setPings((now) => now + 1);
  };

  // Dismissed here or wherever else the envelope is (`guide.ts`), it goes
  // from here too, handing back the keyboard's focus if it was on it.
  useEffect(
    () =>
      onGuideDismissed(() => {
        if (phaseNow.current === 'hidden' || phaseNow.current === 'leaving') {
          return;
        }
        handFocusBack();
        cancelTimers();
        move('leaving');
        later(() => move('hidden'), LEAVE_MS);
      }),
    [handFocusBack, cancelTimers, move, later]
  );

  const said = MORNING.lines[index];
  return (
    // Marked for `ScrollGuide`, which watches the same box to know when the
    // envelope belongs here and when in the corner of the window.
    <div ref={anchor} className={classes.anchor} data-guide-anchor="">
      <span ref={feet} className={classes.feet} />
      {phase !== 'hidden' && (
        <div
          ref={hint}
          className={classes.hint}
          data-phase={phase}
          // Fading out, it is out of reach: a Tab during the fade would
          // otherwise land on an envelope about to unmount and drop the focus
          // again (review of netfox.app's #82, round 2).
          inert={phase === 'leaving'}
        >
          <button
            type="button"
            className={classes.walker}
            // Until it waves, a click lands it with the first line.
            aria-label={phase === 'pointing' ? 'Show another line' : 'Show the line'}
            onClick={next}
          >
            {/* Keyed on the ping, so every new line replays the hop and the blink. */}
            <Mascot
              key={`fox-${pings}`}
              walking={phase === 'walking'}
              pointing={phase === 'pointing'}
            />
            {(phase === 'sniffing' || phase === 'pointing') && (
              <span
                key={`ping-${pings}`}
                className={classes.pings}
                style={{ left: PING.x * SCALE, top: PING.y * SCALE }}
              >
                <span className={classes.ring} />
                <span className={classes.ring} />
              </span>
            )}
          </button>
          {phase === 'pointing' && (
            <div className={classes.bubble}>
              <div className={classes.say}>
                {/* Said out loud as it changes: a polite live region, mounted
                    with the bubble and never keyed, around the caption, which
                    is keyed for its fade. Out of any button: inside one it
                    would be part of the button's name rather than a region,
                    and screen readers do not reliably announce a name that
                    changes under the focus (CodeRabbit on netfox.app's #82). */}
                <div aria-live="polite" aria-atomic="true">
                  <span key={index} className={classes.caption}>
                    {/* The space in the label, not between the spans: it is
                        what the region reads out, and oxfmt drops a {' '}. */}
                    <span className={classes.label}>{`${MORNING.label} `}</span>
                    <span>{said}</span>
                  </span>
                </div>
                {/* One name for every line, so the region is the only thing
                    that says the new one; it starts with the visible "Next"
                    (WCAG 2.5.3), and the arrow is not worth reading. */}
                <button
                  type="button"
                  className={classes.next}
                  aria-label="Next line"
                  onClick={next}
                >
                  Next →
                </button>
              </div>
              <button
                type="button"
                className={classes.dismiss}
                aria-label="Dismiss"
                onClick={dismissGuide}
              >
                <IconX size={12} stroke={2.2} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
