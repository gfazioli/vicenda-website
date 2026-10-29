import { PROMPT_OPEN_ATTRIBUTE } from '@/components/NewsletterSignup/prompt-open';
import { act, fireEvent, render, screen } from '@/test-utils';
import { dismissGuide, guideMemory, sectionInView } from './guide';
import { DELAY_MS, SNIFF_MS } from './HeroGuide';
import { MORNING, SECTION_ATTRIBUTE, SECTION_LINES } from './lines';
import {
  CARD_IN_MS,
  CORNER_IN_MS,
  HERO_FOLD_MS,
  LEAVE_MS,
  ScrollGuide,
  SPONSOR_LINE,
  STILL_MS,
} from './ScrollGuide';

describe('ScrollGuide', () => {
  // jsdom has no IntersectionObserver. This one records what each observer
  // watches, so a test can say what came into view and what left it.
  let watches: { callback: IntersectionObserverCallback; targets: Element[] }[];
  let windowWidth: number;
  // Where the table's anchor is, for what measures it rather than waiting for
  // its observer: kept in step with what the observer reports.
  let rowRect: Partial<DOMRect>;
  // Where each section's top is, for the one the reader is in. jsdom's
  // window is 768 tall, so its middle is 384.
  let sectionTops: Record<string, number>;

  beforeEach(() => {
    guideMemory.dismissed = false;
    guideMemory.said = -1;
    watches = [];
    windowWidth = 1440;
    sectionTops = { today: 2000, brief: 3000 };
    globalThis.IntersectionObserver = class {
      callback: IntersectionObserverCallback;
      targets: Element[] = [];
      constructor(callback: IntersectionObserverCallback) {
        this.callback = callback;
        watches.push(this);
      }
      observe(target: Element) {
        this.targets.push(target);
      }
      disconnect() {
        this.targets = [];
      }
    } as unknown as typeof IntersectionObserver;
    // jsdom lays nothing out. The table spans 645 to 1364, which in a 1440
    // window leaves the envelope under it the room to come.
    Object.defineProperty(document.documentElement, 'clientWidth', {
      configurable: true,
      get: () => windowWidth,
    });
    rowRect = { left: 645, right: 1364, top: 1190, bottom: 1200 };
    jest.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function rect(
      this: Element
    ) {
      if (this.hasAttribute('data-guide-anchor')) {
        return rowRect as DOMRect;
      }
      const section = this.getAttribute(SECTION_ATTRIBUTE);
      return (section ? { top: sectionTops[section] } : { right: 990 }) as unknown as DOMRect;
    });
    // Rendered, as far as the focus handoff can tell.
    jest.spyOn(Element.prototype, 'getClientRects').mockReturnValue([{}] as unknown as DOMRectList);
    jest.useFakeTimers();
  });

  afterEach(() => {
    document.documentElement.removeAttribute(PROMPT_OPEN_ATTRIBUTE);
    delete (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver;
    delete (document.documentElement as { clientWidth?: number }).clientWidth;
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  const [first, second] = MORNING.lines;
  const wait = (ms: number) => act(() => jest.advanceTimersByTime(ms));

  function Page() {
    return (
      <div>
        <a href="/in-view">In view</a>
        <div data-guide-anchor="" />
        <a href="#how-it-works">See how it works</a>
        <div {...{ [SECTION_ATTRIBUTE]: 'today' }} />
        <div {...{ [SECTION_ATTRIBUTE]: 'brief' }} />
        <ScrollGuide />
        <footer>
          <div id="sponsors">
            <a href="https://github.com/sponsors/gfazioli">Become a sponsor</a>
          </div>
        </footer>
      </div>
    );
  }

  const row = () => document.querySelector('[data-guide-anchor]')!;
  const sponsors = () => document.getElementById('sponsors')!;
  const fire = (target: Element, entry: Partial<IntersectionObserverEntry>) =>
    act(() =>
      watches
        .filter((watch) => watch.targets.includes(target))
        .forEach((watch) =>
          watch.callback(
            [{ target, ...entry } as IntersectionObserverEntry],
            watch as unknown as IntersectionObserver
          )
        )
    );
  const rowAt = (top: number) => {
    rowRect = { left: 645, right: 1364, top, bottom: top + 10 };
    return { boundingClientRect: rowRect as DOMRectReadOnly };
  };
  const rowOnScreen = () => fire(row(), { isIntersecting: true, ...rowAt(390) });
  const rowBelow = () => fire(row(), { isIntersecting: false, ...rowAt(1190) });
  const rowPassed = () => fire(row(), { isIntersecting: false, ...rowAt(-20) });
  const cardShowing = (ratio: number) =>
    fire(sponsors(), { isIntersecting: ratio > 0, intersectionRatio: ratio });

  const corner = () => document.querySelector<HTMLElement>('.corner');
  const onCard = () => sponsors().querySelector<HTMLElement>('.card');
  const envelope = () => screen.queryByRole('button', { name: /^Show (a|another) line$/ });
  const announcer = () => corner()?.querySelector('[aria-live]');

  /** Mounted, a beat later, the table scrolled past: it walks into the corner and stands. */
  const inTheCorner = () => {
    render(<Page />);
    wait(DELAY_MS);
    rowPassed();
    wait(CORNER_IN_MS);
    expect(corner()).toHaveAttribute('data-phase', 'here');
  };

  it('stays away until the reader reaches the table', () => {
    render(<Page />);
    wait(DELAY_MS);
    rowBelow();
    wait(10_000);
    expect(corner()).toBeNull();
  });

  it('comes to the corner after a jump straight past the table, which no observer reports', () => {
    render(<Page />);
    wait(DELAY_MS);
    rowBelow();
    // From below the window to above it with no frame in between: an anchor
    // link, a restored scroll position. Only the scroll event says so.
    rowAt(-2000);
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(corner()).toBeNull();
    wait(STILL_MS);
    expect(corner()).toHaveAttribute('data-phase', 'arriving');
  });

  it('comes to the corner once the table is scrolled past, where the envelope under it has room', () => {
    render(<Page />);
    wait(DELAY_MS);
    rowOnScreen();
    wait(10_000);
    // The envelope under the table is there: one at a time.
    expect(corner()).toBeNull();

    rowPassed();
    expect(corner()).toHaveAttribute('data-phase', 'arriving');
    wait(CORNER_IN_MS);
    expect(corner()).toHaveAttribute('data-phase', 'here');
    // Folded: past the hero it only rides along.
    expect(screen.queryByText(first)).toBeNull();

    rowOnScreen();
    expect(corner()).toHaveAttribute('data-phase', 'leaving');
    wait(LEAVE_MS);
    expect(corner()).toBeNull();
  });

  it('says the morning from the corner where the hero leaves no room, then folds it away', () => {
    windowWidth = 900;
    render(<Page />);
    wait(DELAY_MS);
    rowOnScreen();
    wait(CORNER_IN_MS);
    expect(screen.queryByText(first)).toBeNull();
    wait(SNIFF_MS);
    expect(screen.getByText(first)).toBeInTheDocument();
    expect(screen.getByText(MORNING.label)).toBeInTheDocument();
    // Arrived on its own, so a screen reader is not interrupted by it.
    expect(announcer()).toHaveTextContent('');
    wait(HERO_FOLD_MS);
    expect(screen.queryByText(first)).toBeNull();
    expect(corner()).toHaveAttribute('data-phase', 'here');
  });

  it('keeps what a reader asked for before it could say the morning', () => {
    // Codex, round 1 of netfox.app's #83: a click in the beat before it spoke
    // was replaced by the next line, and folded on the hero's timer.
    windowWidth = 900;
    render(<Page />);
    wait(DELAY_MS);
    rowOnScreen();
    wait(CORNER_IN_MS);
    fireEvent.click(envelope()!);
    expect(screen.getByText(first)).toBeInTheDocument();
    wait(SNIFF_MS);
    expect(screen.getByText(first)).toBeInTheDocument();
    expect(screen.queryByText(second)).toBeNull();
    wait(HERO_FOLD_MS);
    expect(screen.getByText(first)).toBeInTheDocument();
  });

  it('folds the morning as soon as the table is scrolled past', () => {
    windowWidth = 900;
    render(<Page />);
    wait(DELAY_MS);
    rowOnScreen();
    wait(CORNER_IN_MS + SNIFF_MS);
    expect(screen.getByText(first)).toBeInTheDocument();
    rowPassed();
    expect(screen.queryByText(first)).toBeNull();
  });

  it('says the line of the section the reader is in, out loud, and Next goes on', () => {
    inTheCorner();
    sectionTops = { today: 120, brief: 900 };
    const { today } = SECTION_LINES;
    expect(envelope()).toHaveAccessibleName('Show a line');
    fireEvent.click(envelope()!);
    expect(screen.getByText(today.label)).toBeInTheDocument();
    expect(screen.getByText(today.lines[0])).toBeInTheDocument();
    expect(announcer()).toHaveTextContent(`${today.label}: ${today.lines[0]}`);
    expect(envelope()).toHaveAccessibleName('Show another line');

    fireEvent.click(screen.getByRole('button', { name: 'Next line' }));
    expect(screen.getByText(today.lines[1])).toBeInTheDocument();
    expect(announcer()).toHaveTextContent(`${today.label}: ${today.lines[1]}`);
    // Cleared a moment later: the page's text is not said twice to a reader
    // going through it, and the same line can be said again.
    wait(2000);
    expect(announcer()).toHaveTextContent('');
  });

  it('starts over with the first line of the next section the reader comes to', () => {
    inTheCorner();
    sectionTops = { today: 120, brief: 900 };
    fireEvent.click(envelope()!);
    expect(screen.getByText(SECTION_LINES.today.lines[0])).toBeInTheDocument();
    sectionTops = { today: -800, brief: 200 };
    fireEvent.click(screen.getByRole('button', { name: 'Next line' }));
    expect(screen.getByText(SECTION_LINES.brief.label)).toBeInTheDocument();
    expect(screen.getByText(SECTION_LINES.brief.lines[0])).toBeInTheDocument();
  });

  it('says the morning above the first section, going on from the envelope under the table', () => {
    inTheCorner();
    act(() => {
      guideMemory.said = 0;
    });
    fireEvent.click(envelope()!);
    expect(screen.getByText(MORNING.label)).toBeInTheDocument();
    expect(screen.getByText(second)).toBeInTheDocument();
  });

  it('finds the section by its top against the middle of the window', () => {
    render(<Page />);
    expect(sectionInView()).toBeNull();
    sectionTops = { today: 384, brief: 385 };
    expect(sectionInView()).toBe('today');
    sectionTops = { today: -3000, brief: -10 };
    expect(sectionInView()).toBe('brief');
  });

  it('walks while the page scrolls, and stands when it stops', () => {
    inTheCorner();
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(corner()).toHaveAttribute('data-moving');
    wait(STILL_MS);
    expect(corner()).not.toHaveAttribute('data-moving');
  });

  it('folds a bubble the reader opened once they scroll half a window on', () => {
    inTheCorner();
    fireEvent.click(envelope()!);
    expect(screen.getByText(first)).toBeInTheDocument();
    Object.defineProperty(window, 'scrollY', { configurable: true, value: window.innerHeight });
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(screen.queryByText(first)).toBeNull();
    delete (window as { scrollY?: number }).scrollY;
  });

  it('goes to the Support card, in the FAQ’s words, and back to the corner when it has gone', () => {
    inTheCorner();
    cardShowing(0.5);
    expect(corner()).toHaveAttribute('data-phase', 'leaving');
    wait(LEAVE_MS);
    expect(corner()).toBeNull();
    expect(onCard()).toHaveAttribute('data-phase', 'arriving');
    wait(CARD_IN_MS);
    expect(onCard()).toHaveAttribute('data-phase', 'here');
    expect(sponsors()).toHaveTextContent(SPONSOR_LINE);

    // Half out of view, it stays: no back and forth at the edge.
    cardShowing(0.1);
    expect(onCard()).toHaveAttribute('data-phase', 'here');

    cardShowing(0);
    wait(LEAVE_MS);
    expect(onCard()).toBeNull();
    expect(corner()).toHaveAttribute('data-phase', 'arriving');
  });

  it('goes from everywhere when dismissed, and stays gone', () => {
    inTheCorner();
    fireEvent.click(envelope()!);
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(guideMemory.dismissed).toBe(true);
    wait(LEAVE_MS);
    expect(corner()).toBeNull();
    cardShowing(0.5);
    rowPassed();
    wait(10_000);
    expect(corner()).toBeNull();
    expect(onCard()).toBeNull();
  });

  it('leaves when the envelope is dismissed under the table', () => {
    inTheCorner();
    act(() => dismissGuide());
    wait(LEAVE_MS);
    expect(corner()).toBeNull();
  });

  it('is nowhere while the newsletter prompt is open, and comes back once it has gone', async () => {
    inTheCorner();
    // A MutationObserver reports on a microtask, which fake timers do not run.
    await act(async () => {
      document.documentElement.setAttribute(PROMPT_OPEN_ATTRIBUTE, 'open');
    });
    expect(corner()).toHaveAttribute('data-phase', 'leaving');
    wait(LEAVE_MS);
    expect(corner()).toBeNull();
    wait(10_000);
    expect(corner()).toBeNull();

    await act(async () => {
      document.documentElement.removeAttribute(PROMPT_OPEN_ATTRIBUTE);
    });
    expect(corner()).toHaveAttribute('data-phase', 'arriving');
  });

  it('does not set out while the prompt is open when the page is ready', () => {
    document.documentElement.setAttribute(PROMPT_OPEN_ATTRIBUTE, 'open');
    render(<Page />);
    wait(DELAY_MS);
    rowPassed();
    wait(10_000);
    expect(corner()).toBeNull();
  });

  it('hands the keyboard focus to a control in view rather than the one before it', () => {
    // Codex, round 1 of netfox.app's #83: the envelope rides in the corner at
    // any height of the page, so the control before it in the markup is
    // usually off screen.
    inTheCorner();
    const inView = screen.getByRole('link', { name: 'In view' });
    jest.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function rect(
      this: Element
    ) {
      if (this.hasAttribute('data-guide-anchor')) {
        return rowRect as DOMRect;
      }
      return (
        this === inView ? { top: 100, bottom: 120, left: 20, right: 200 } : { right: 990 }
      ) as DOMRect;
    });
    act(() => envelope()!.focus());
    rowOnScreen();
    expect(document.activeElement).toBe(inView);
  });

  it('hands the keyboard focus back when it goes', () => {
    inTheCorner();
    act(() => envelope()!.focus());
    rowOnScreen();
    expect(document.activeElement).toBe(screen.getByRole('link', { name: 'See how it works' }));
  });

  it('is out of reach while it fades out', () => {
    inTheCorner();
    rowOnScreen();
    expect(corner()).toHaveAttribute('inert');
  });

  it('arrives standing, and never walks, for a reader who asked for less motion', () => {
    jest.spyOn(window, 'matchMedia').mockImplementation(
      (query: string) =>
        ({
          matches: query.includes('prefers-reduced-motion'),
          media: query,
          addEventListener: () => undefined,
          removeEventListener: () => undefined,
        }) as unknown as MediaQueryList
    );
    render(<Page />);
    wait(DELAY_MS);
    rowPassed();
    expect(corner()).toHaveAttribute('data-phase', 'here');
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(corner()).not.toHaveAttribute('data-moving');
  });
});
