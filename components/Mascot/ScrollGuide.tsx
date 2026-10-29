'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { IconX } from '@tabler/icons-react';
import { useReducedMotion } from '@mantine/hooks';
import { dismissGuide, guideMemory, onGuideDismissed, sayNext } from './guide';
import { DELAY_MS, MIN_BUBBLE_PX, roomBeside, WAKE_MS } from './HeroGuide';
import { type GuideSection, linesFor, MORNING, SECTION_ATTRIBUTE, SECTION_LINES } from './lines';
import { Mascot } from './Mascot';
import { PING } from './sprite';
import classes from './Mascot.module.css';

/** Where the envelope is: nowhere, in the corner of the window, or on the Support card. */
type Place = 'none' | 'corner' | 'card';
type Phase = 'hidden' | 'arriving' | 'here' | 'leaving';
/** Closed; opened to say the morning, as under the table; opened by the reader. */
type Bubble = 'closed' | 'hero' | 'asked';

/** Matches `corner-in` in the stylesheet. */
export const CORNER_IN_MS = 900;
/** Matches `card-in`. */
export const CARD_IN_MS = 420;
/** Matches the fade on the way out. */
export const LEAVE_MS = 260;
/**
 * How long the morning stays open in the corner. Under the table it stays,
 * over nothing; in the corner it covers the page, so it folds away and the
 * envelope is left, for a click to open it again.
 */
export const HERO_FOLD_MS = 8000;
/** After the last scroll event, before its legs stop. */
export const STILL_MS = 160;
/**
 * How much of the Support card has to be on screen for the envelope to go to
 * it. It leaves once none of it is, so a card half in view does not send it
 * back and forth.
 */
export const CARD_RATIO = 0.3;

/** What it says on the Support card: the FAQ's own words, so no new claim. */
export const SPONSOR_LINE =
  'Vicenda is free, a personal project. If it is useful to you, sponsoring the work is welcome.';

/** What the page has said about where the envelope belongs. */
interface Seen {
  /** A beat has passed since the page mounted. */
  ready: boolean;
  /** The hero's sorting table has been on screen, or is above it. */
  reached: boolean;
  /** The table is on screen now. */
  rowVisible: boolean;
  /** The envelope under the table has room to stand there (`HeroGuide`). */
  heroRoom: boolean;
  /** Enough of the Support card is on screen. */
  card: boolean;
}

/** Where the envelope belongs, from what the page last said. */
function placeFor(page: Seen): Place {
  if (guideMemory.dismissed || !page.ready) {
    return 'none';
  }
  if (page.card) {
    return 'card';
  }
  // Before the table, nowhere; beside it, the hero's envelope, where it has room.
  if (!page.reached || (page.rowVisible && page.heroRoom)) {
    return 'none';
  }
  return 'corner';
}

/**
 * The section the reader is in: the last one whose top has come up past the
 * middle of the window, read when the reader asks rather than watched, since
 * only a click needs it. None above the first: the hero, whose words are the
 * morning's.
 */
export function sectionInView(): GuideSection | null {
  const middle = window.innerHeight / 2;
  let found: GuideSection | null = null;
  for (const el of document.querySelectorAll<HTMLElement>(`[${SECTION_ATTRIBUTE}]`)) {
    if (el.getBoundingClientRect().top > middle) {
      break;
    }
    const name = el.getAttribute(SECTION_ATTRIBUTE);
    if (name && name in SECTION_LINES) {
      found = name as GuideSection;
    }
  }
  return found;
}

/** How long a line stays in the announcer before it is cleared. */
const SPOKEN_MS = 1500;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * The envelope that follows the reader down the home page, ported from
 * netfox.app's fox (its `ScrollGuide`), which the user asked for there with
 * *"che seguisse lo scroll della home page e suggerisse anche lo sponsor nel
 * footer"*. Past the hero it rides in the corner of the window, walking while
 * the page scrolls and standing when it stops; a click on it says a line for
 * the section the reader is in (`lines.ts`), where Netfox's translates machine
 * speak, and Next says the section's next one. At the footer it goes to the
 * Support card and suggests sponsoring the project.
 *
 * Where the hero leaves no room for it under the sorting table (a phone, any
 * window under 48em), `HeroGuide` does not come, and this one says the morning
 * from the corner instead: once the table is in view it walks in, blinks
 * awake, and says the first line, folded away again once the table is
 * scrolled past. Where there is room, it comes only once the table is. One
 * envelope at a time, then: never in the corner while the one under the table
 * is on screen, and never in the corner while it stands on the card.
 *
 * Nothing it says on its own is announced: it moves with the scroll, and a
 * screen reader reading something else should not be interrupted by it. What
 * the reader asks for is, from a live region that comes with the envelope.
 */
export function ScrollGuide() {
  const reduced = useReducedMotion();
  const reducedNow = useRef(reduced);
  const [at, setAt] = useState<Place>('none');
  const [phase, setPhase] = useState<Phase>('hidden');
  // Where it is and what it is doing, as the timers and observers see it.
  // Every change goes through `go`, which keeps the two together.
  const now = useRef<{ at: Place; phase: Phase }>({ at: 'none', phase: 'hidden' });
  const go = useCallback((nextAt: Place, nextPhase: Phase) => {
    now.current = { at: nextAt, phase: nextPhase };
    setAt(nextAt);
    setPhase(nextPhase);
  }, []);
  const [bubble, setBubbleState] = useState<Bubble>('closed');
  const bubbleNow = useRef<Bubble>('closed');
  const setBubble = useCallback((next: Bubble) => {
    bubbleNow.current = next;
    setBubbleState(next);
  }, []);
  // Whose line it is saying, and which: the morning's (no section) or a
  // section's. Read by the next ask, which goes on in the same section.
  const [said, setSaidState] = useState<{ section: GuideSection | null; index: number }>({
    section: null,
    index: 0,
  });
  const saidNow = useRef(said);
  const setSaid = useCallback((next: { section: GuideSection | null; index: number }) => {
    saidNow.current = next;
    setSaidState(next);
  }, []);
  // The morning has been said from here, once, on arrival.
  const told = useRef(false);
  // What the announcer says: set only by what the reader asks for, and
  // cleared a moment later, so the same line can be said again and a screen
  // reader reading the page does not meet it a second time.
  const [spoken, setSpoken] = useState('');
  const hush = useRef<number | undefined>(undefined);
  // One ping per mount of the rings.
  const [pings, setPings] = useState(0);
  const [moving, setMoving] = useState(false);
  const movingNow = useRef(false);
  // The Support card, once found: the envelope is drawn into it there.
  const [card, setCard] = useState<HTMLElement | null>(null);
  // The envelope's box, in whichever place it is.
  const box = useRef<HTMLDivElement>(null);
  // Where the reader opened the bubble: half a window of scroll away, it folds.
  const openedAt = useRef(0);
  // What the page says about where the envelope belongs.
  const seen = useRef<Seen>({
    ready: false,
    reached: false,
    rowVisible: false,
    heroRoom: true,
    card: false,
  });
  const timers = useRef(new Set<number>());

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

  /**
   * The keyboard was on the envelope, which is about to go: hand the focus to
   * a control on screen rather than let it drop, and without scrolling, so
   * the reader stays where they are. The last one before the envelope on the
   * page that is in view; else any in view; else, with none in view, the last
   * one before it. It rides in the corner at any height of the page, so the
   * control before it in the markup is usually a screen or more away (Codex,
   * round 1 of netfox.app's #83).
   */
  const handFocusBack = useCallback(() => {
    const el = box.current;
    if (!el?.contains(document.activeElement)) {
      return;
    }
    const others = [...document.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
      (other) => !el.contains(other) && other.getClientRects().length > 0
    );
    const before = others.filter(
      (other) => el.compareDocumentPosition(other) & Node.DOCUMENT_POSITION_PRECEDING
    );
    const inView = (other: HTMLElement) => {
      const { top, bottom, left, right } = other.getBoundingClientRect();
      return bottom > 0 && top < window.innerHeight && right > 0 && left < window.innerWidth;
    };
    const target = before.filter(inView).at(-1) ?? others.find(inView) ?? before.at(-1);
    target?.focus({ preventScroll: true });
  }, []);

  const ping = useCallback(() => setPings((count) => count + 1), []);

  /** Once it stands in the corner with the hero's table in view, it says the morning. */
  const arrived = useCallback(
    (place: Place) => {
      ping();
      if (place !== 'corner' || !seen.current.rowVisible || told.current) {
        return;
      }
      // The reader may have clicked it in the meantime: what they asked for
      // stays, and folds when they scroll on, not on this timer (Codex, round
      // 1 of netfox.app's #83).
      const open = () => {
        if (
          now.current.at === 'corner' &&
          now.current.phase === 'here' &&
          seen.current.rowVisible &&
          bubbleNow.current === 'closed' &&
          !told.current
        ) {
          told.current = true;
          setSaid({ section: null, index: sayNext(MORNING.lines.length) });
          setBubble('hero');
          later(() => {
            if (bubbleNow.current === 'hero') {
              setBubble('closed');
            }
          }, HERO_FOLD_MS);
        }
      };
      if (reducedNow.current) {
        open();
      } else {
        later(open, WAKE_MS);
      }
    },
    [later, ping, setBubble, setSaid]
  );

  /** Moves the envelope to where it belongs: out of where it is first, then in. */
  const sync = useCallback(
    function syncPlace() {
      const want = placeFor(seen.current);
      const { at: here, phase: doing } = now.current;
      if (doing === 'leaving' || here === want) {
        return;
      }
      if (here !== 'none') {
        handFocusBack();
        cancelTimers();
        movingNow.current = false;
        setMoving(false);
        setBubble('closed');
        go(here, 'leaving');
        later(
          () => {
            go('none', 'hidden');
            syncPlace();
          },
          reducedNow.current ? 0 : LEAVE_MS
        );
        return;
      }
      if (reducedNow.current) {
        go(want, 'here');
        arrived(want);
        return;
      }
      go(want, 'arriving');
      later(
        () => {
          if (now.current.at === want && now.current.phase === 'arriving') {
            go(want, 'here');
            arrived(want);
          }
        },
        want === 'corner' ? CORNER_IN_MS : CARD_IN_MS
      );
    },
    [arrived, cancelTimers, go, handFocusBack, later, setBubble]
  );

  // Ready a beat after the page mounts, as the one under the table is.
  useEffect(() => {
    const id = window.setTimeout(() => {
      seen.current.ready = true;
      sync();
    }, DELAY_MS);
    return () => {
      window.clearTimeout(id);
      cancelTimers();
    };
  }, [sync, cancelTimers]);

  // The hero's sorting table: whether the reader has reached it, whether it
  // is on screen, and whether the envelope under it has room to stand there.
  useEffect(() => {
    const row = document.querySelector('[data-guide-anchor]');
    const page = seen.current;
    // Where nothing can say where the table is, the envelope stays under it
    // (`HeroGuide` has its own way in) and never comes to the corner.
    if (!row || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }
    const saw = (visible: boolean, bottom: number) => {
      page.rowVisible = visible;
      // Above the window counts: a page reloaded halfway down has passed it.
      page.reached = visible || bottom <= 0;
      page.heroRoom = roomBeside(row) >= MIN_BUBBLE_PX;
      if (!visible && bubbleNow.current === 'hero') {
        setBubble('closed');
      }
      sync();
    };
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[entries.length - 1];
      saw(entry.isIntersecting, entry.boundingClientRect.bottom);
    });
    observer.observe(row);
    // An observer reports a CHANGE in what is visible, and a jump straight
    // past the table -- from below the window to above it, never on screen in
    // between -- is none: the reader was past the hero and the envelope never
    // came (measured on netfox.app with `scrollTo` 3200 px from the top at
    // 1440 x 900, by the findergit.app session porting it). A jump has no
    // frames in between, so the table is measured once the scroll settles,
    // and acted on only if that disagrees with what the observer last said.
    let settle: number | undefined;
    const scrolled = () => {
      window.clearTimeout(settle);
      settle = window.setTimeout(() => {
        const { top, bottom } = row.getBoundingClientRect();
        const visible = bottom > 0 && top < window.innerHeight;
        if (visible !== page.rowVisible || (visible || bottom <= 0) !== page.reached) {
          saw(visible, bottom);
        }
      }, STILL_MS);
    };
    window.addEventListener('scroll', scrolled, { passive: true });
    const resized = () => {
      page.heroRoom = roomBeside(row) >= MIN_BUBBLE_PX;
      sync();
    };
    window.addEventListener('resize', resized);
    return () => {
      observer.disconnect();
      window.clearTimeout(settle);
      window.removeEventListener('scroll', scrolled);
      window.removeEventListener('resize', resized);
    };
  }, [sync, setBubble]);

  // The footer's Support card.
  useEffect(() => {
    const el = document.getElementById('sponsors');
    if (!el || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }
    setCard(el);
    const page = seen.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        const was = page.card;
        if (entry.isIntersecting && entry.intersectionRatio >= CARD_RATIO) {
          page.card = true;
        } else if (!entry.isIntersecting) {
          page.card = false;
        }
        if (page.card !== was) {
          sync();
        }
      },
      { threshold: [0, CARD_RATIO] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [sync]);

  // Its legs go while the page scrolls, and a bubble the reader opened folds
  // once they have scrolled half a window on. One listener, passive; the state
  // changes only when it starts and when it stops.
  useEffect(() => {
    let still: number | undefined;
    const scrolled = () => {
      if (now.current.at === 'corner' && now.current.phase === 'here' && !reducedNow.current) {
        if (!movingNow.current) {
          movingNow.current = true;
          setMoving(true);
        }
        window.clearTimeout(still);
        still = window.setTimeout(() => {
          movingNow.current = false;
          setMoving(false);
        }, STILL_MS);
      }
      if (
        bubbleNow.current === 'asked' &&
        Math.abs(window.scrollY - openedAt.current) > window.innerHeight / 2
      ) {
        setBubble('closed');
      }
    };
    window.addEventListener('scroll', scrolled, { passive: true });
    return () => {
      window.clearTimeout(still);
      window.removeEventListener('scroll', scrolled);
    };
  }, [setBubble]);

  // Dismissed here, or under the table: it goes from everywhere.
  useEffect(() => onGuideDismissed(sync), [sync]);

  // Reduce Motion switched on mid-way: arrive now, and stand still.
  useEffect(() => {
    reducedNow.current = reduced;
    if (!reduced) {
      return;
    }
    movingNow.current = false;
    setMoving(false);
    if (now.current.phase === 'arriving') {
      cancelTimers();
      go(now.current.at, 'here');
      arrived(now.current.at);
    }
  }, [reduced, arrived, cancelTimers, go]);

  useEffect(() => () => window.clearTimeout(hush.current), []);

  /**
   * A line, asked for, said out loud: the section's next one if the reader is
   * still in the section it last spoke for, else the first of the section
   * they are in now. Above the first section it is the morning, which goes on
   * from wherever the envelope under the table stopped.
   */
  const tell = () => {
    const section = sectionInView();
    const { label, lines } = linesFor(section);
    const last = saidNow.current;
    const index =
      section === null
        ? sayNext(lines.length)
        : last.section === section
          ? (last.index + 1) % lines.length
          : 0;
    setSaid({ section, index });
    ping();
    setSpoken(`${label}: ${lines[index]}`);
    window.clearTimeout(hush.current);
    hush.current = window.setTimeout(() => setSpoken(''), SPOKEN_MS);
  };

  /**
   * The reader asked, on the envelope or on Next: the next line, in a bubble
   * that is theirs from now on, so it folds only once they scroll on.
   */
  const ask = () => {
    // Asked for, the morning is no longer the envelope's to open.
    told.current = true;
    tell();
    if (bubbleNow.current !== 'asked') {
      openedAt.current = window.scrollY;
      setBubble('asked');
    }
  };

  /** The envelope itself: lands it if it is on its way in, then says the next line. */
  const fromEnvelope = () => {
    const { at: here, phase: doing } = now.current;
    if (here !== 'corner' || doing === 'leaving' || doing === 'hidden') {
      return;
    }
    if (doing === 'arriving') {
      cancelTimers();
      go('corner', 'here');
    }
    ask();
  };

  const rings = (
    <span
      key={`ping-${pings}`}
      className={classes.pings}
      style={{ left: `calc(var(--cell) * ${PING.x})`, top: `calc(var(--cell) * ${PING.y})` }}
    >
      <span className={classes.ring} />
      <span className={classes.ring} />
    </span>
  );

  const dismiss = (
    <button type="button" className={classes.dismiss} aria-label="Dismiss" onClick={dismissGuide}>
      <IconX size={12} stroke={2.2} />
    </button>
  );

  const words = linesFor(said.section);
  const inCorner = at === 'corner' && (
    <div
      ref={box}
      className={classes.corner}
      data-phase={phase}
      data-moving={moving ? '' : undefined}
      inert={phase === 'leaving'}
    >
      <button
        type="button"
        className={classes.walker}
        aria-label={bubble === 'closed' ? 'Show a line' : 'Show another line'}
        onClick={fromEnvelope}
      >
        {/* Keyed on the ping, so every new line replays the hop and the blink. */}
        <Mascot
          key={`envelope-${pings}`}
          walking={phase === 'arriving' || moving}
          pointing={bubble !== 'closed'}
        />
        {phase === 'here' && pings > 0 && rings}
      </button>
      {/* Mounted with the envelope, before anything is said: a live region
          has to be there before its words change to be heard (CodeRabbit on
          netfox.app's #82), and the bubble opens with a line already in it. */}
      <div className={classes.announcer} aria-live="polite" aria-atomic="true">
        {spoken}
      </div>
      {bubble !== 'closed' && phase === 'here' && (
        <div className={classes.cornerBubble}>
          <div className={classes.say}>
            <span key={`${said.section}-${said.index}`} className={classes.caption}>
              <span className={classes.label}>{`${words.label} `}</span>
              <span>{words.lines[said.index]}</span>
            </span>
            <button type="button" className={classes.next} aria-label="Next line" onClick={ask}>
              Next →
            </button>
          </div>
          {dismiss}
        </div>
      )}
    </div>
  );

  const onCard =
    at === 'card' &&
    card &&
    createPortal(
      <div ref={box} className={classes.card} data-phase={phase} inert={phase === 'leaving'}>
        <span className={classes.sitter}>
          <Mascot key={`envelope-${pings}`} pointing />
          {phase === 'here' && rings}
        </span>
        <div className={classes.cardBubble}>
          <p className={classes.cardLine}>{SPONSOR_LINE}</p>
          {dismiss}
        </div>
      </div>,
      card
    );

  return (
    <>
      {inCorner}
      {onCard}
    </>
  );
}
