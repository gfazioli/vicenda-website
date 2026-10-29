import { act, fireEvent, render, screen } from '@/test-utils';
import { dismissGuide, guideMemory } from './guide';
import { DELAY_MS, HeroGuide, RESIZE_SETTLE_MS, WAKE_MS, WALK_MS } from './HeroGuide';
import { MORNING } from './lines';

describe('HeroGuide', () => {
  let observers: { callback: IntersectionObserverCallback }[];
  // The window's width, and the hero's bottom edge. The anchor -- the table
  // and the strip under it -- is where a 1440-wide window lays it out: from
  // 645 to 1364 across, its bottom (the envelope's feet) at 582, 22px above
  // the hero's: 589px left for the bubble.
  let windowWidth: number;
  let heroBottom: number;

  beforeEach(() => {
    guideMemory.dismissed = false;
    guideMemory.said = -1;
    observers = [];
    windowWidth = 1440;
    heroBottom = 604;
    // jsdom has none. This one only records its callback, so a test can say
    // when the table "comes into view".
    globalThis.IntersectionObserver = class {
      callback: IntersectionObserverCallback;
      constructor(callback: IntersectionObserverCallback) {
        this.callback = callback;
        observers.push(this);
      }
      observe() {}
      disconnect() {}
    } as unknown as typeof IntersectionObserver;
    // jsdom lays nothing out: every width it reports is 0.
    Object.defineProperty(document.documentElement, 'clientWidth', {
      configurable: true,
      get: () => windowWidth,
    });
    jest.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function rect(
      this: Element
    ) {
      return (
        this.tagName === 'SECTION'
          ? { bottom: heroBottom }
          : { left: 645, right: 1364, bottom: 582 }
      ) as DOMRect;
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    delete (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver;
    delete (document.documentElement as { clientWidth?: number }).clientWidth;
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  /** The hero around it: its one link, and the table's stage. */
  function Hero() {
    return (
      <section>
        <a href="#how-it-works">See how it works</a>
        <div>
          <HeroGuide />
        </div>
      </section>
    );
  }

  const walker = () => screen.queryByRole('button', { name: /^Show (another|the) line$/ });
  const phase = () => walker()?.parentElement?.getAttribute('data-phase');
  const said = (text: string) => screen.queryByText(text);
  const [first, second, third] = MORNING.lines;
  const tableInView = () =>
    act(() =>
      observers
        .at(-1)
        ?.callback(
          [{ isIntersecting: true } as IntersectionObserverEntry],
          {} as IntersectionObserver
        )
    );
  const wait = (ms: number) => act(() => jest.advanceTimersByTime(ms));
  const arrived = () => {
    tableInView();
    wait(DELAY_MS + WALK_MS + WAKE_MS + 50);
  };

  it('waits for the table to come into view, walks in, wakes, then says the morning', () => {
    render(<Hero />);
    wait(10_000);
    expect(walker()).toBeNull();

    tableInView();
    wait(DELAY_MS + 50);
    expect(phase()).toBe('walking');
    expect(said(first)).toBeNull();

    wait(WALK_MS);
    expect(phase()).toBe('waking');
    expect(said(first)).toBeNull();

    wait(WAKE_MS);
    expect(phase()).toBe('pointing');
    expect(said(MORNING.label)).toBeInTheDocument();
    expect(said(first)).toBeInTheDocument();
  });

  it('hands the stylesheet the room it measured for the bubble', () => {
    const { container } = render(<Hero />);
    arrived();
    const anchor = container.querySelector<HTMLElement>('[data-guide-anchor]')!;
    expect(anchor.style.getPropertyValue('--vic-guide-room')).toBe('589px');
  });

  it('does not come where there is no room beside it for what it says', () => {
    windowWidth = 900;
    render(<Hero />);
    tableInView();
    wait(10_000);
    expect(walker()).toBeNull();
  });

  it('does not come where the hero’s foot is too short to stand on', () => {
    // Below 48em the hero's foot is 56px, and the envelope with its drop 84.
    heroBottom = 560;
    render(<Hero />);
    tableInView();
    wait(10_000);
    expect(walker()).toBeNull();
  });

  const resizeTo = (width: number) => {
    windowWidth = width;
    act(() => {
      window.dispatchEvent(new Event('resize'));
    });
  };

  it('leaves when a resize takes that room away', () => {
    render(<Hero />);
    arrived();
    expect(said(first)).toBeInTheDocument();
    resizeTo(900);
    expect(walker()).toBeNull();
  });

  it('comes once a window that was too narrow is made wide enough', () => {
    // Review of netfox.app's #82: the table came into view in a narrow window,
    // and the observer had already let go, so widening it never brought it.
    windowWidth = 900;
    render(<Hero />);
    tableInView();
    wait(10_000);
    expect(walker()).toBeNull();
    resizeTo(1440);
    wait(RESIZE_SETTLE_MS + 50);
    expect(phase()).toBe('walking');
    wait(WALK_MS + WAKE_MS);
    expect(said(first)).toBeInTheDocument();
  });

  it('walks in again, from the start, when the room comes back mid-walk', () => {
    render(<Hero />);
    tableInView();
    wait(DELAY_MS + 1000);
    expect(phase()).toBe('walking');
    resizeTo(900);
    expect(walker()).toBeNull();
    resizeTo(1440);
    wait(RESIZE_SETTLE_MS + 50);
    expect(phase()).toBe('walking');
    // Where the first walk would have ended: this one is still on its way.
    wait(WALK_MS - 1000);
    expect(phase()).toBe('walking');
    wait(1000 + WAKE_MS);
    expect(said(first)).toBeInTheDocument();
  });

  it('hands the keyboard focus to the hero’s link before a resize sends it off', () => {
    render(<Hero />);
    arrived();
    act(() => screen.getByRole('button', { name: 'Dismiss' }).focus());
    resizeTo(900);
    expect(walker()).toBeNull();
    expect(document.activeElement).toBe(screen.getByRole('link', { name: 'See how it works' }));
  });

  it('says the next line on a click on it or on Next, then starts over', () => {
    render(<Hero />);
    arrived();
    fireEvent.click(walker()!);
    expect(said(second)).toBeInTheDocument();
    expect(said(first)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Next line' }));
    expect(said(third)).toBeInTheDocument();
    for (let i = 3; i <= MORNING.lines.length; i += 1) {
      fireEvent.click(walker()!);
    }
    expect(said(first)).toBeInTheDocument();
  });

  it('names the envelope for what a click on it does', () => {
    // Before it waves there is no line to show "another" of; a click then
    // lands it with the first one.
    render(<Hero />);
    tableInView();
    wait(DELAY_MS + 50);
    expect(screen.getByRole('button', { name: 'Show the line' })).toBeInTheDocument();
    wait(WALK_MS + WAKE_MS);
    expect(screen.getByRole('button', { name: 'Show another line' })).toBeInTheDocument();
  });

  it('is out of reach while it fades out', () => {
    const { container } = render(<Hero />);
    arrived();
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    const hint = container.querySelector('[data-phase]')!;
    expect(hint.getAttribute('data-phase')).toBe('leaving');
    expect(hint).toHaveAttribute('inert');
  });

  it('says each new line out loud, once, from a region that stays put', () => {
    render(<Hero />);
    arrived();
    const region = said(first)!.closest('[aria-live]');
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(region).toHaveAttribute('aria-atomic', 'true');
    expect(region!.closest('button')).toBeNull();
    // What it reads out: the label, a space, the line.
    expect(region).toHaveTextContent(`${MORNING.label} ${first}`);
    const nextButton = screen.getByRole('button', { name: 'Next line' });
    // The visible "Next" starts the name (WCAG 2.5.3).
    expect(nextButton).toHaveTextContent(/^Next/);
    fireEvent.click(nextButton);
    // The same region, saying the next one; the same name on Next, and on no
    // button the line, which the region alone says.
    expect(said(second)!.closest('[aria-live]')).toBe(region);
    expect(screen.getByRole('button', { name: 'Next line' })).toBe(nextButton);
    expect(screen.queryByRole('button', { name: (name) => name.includes(second) })).toBeNull();
  });

  it('lands at once when clicked on the way in', () => {
    render(<Hero />);
    tableInView();
    wait(DELAY_MS + 50);
    expect(phase()).toBe('walking');
    fireEvent.click(walker()!);
    expect(phase()).toBe('pointing');
    expect(said(first)).toBeInTheDocument();
    // The walk's own timers, still pending, change nothing when they run out.
    wait(WALK_MS + WAKE_MS);
    expect(phase()).toBe('pointing');
  });

  it('hands the keyboard focus to the hero’s link when dismissed', () => {
    render(<Hero />);
    arrived();
    const dismiss = screen.getByRole('button', { name: 'Dismiss' });
    act(() => dismiss.focus());
    fireEvent.click(dismiss);
    expect(document.activeElement).toBe(screen.getByRole('link', { name: 'See how it works' }));
  });

  it('leaves when dismissed, and stays gone for the rest of the load', () => {
    const page = render(<Hero />);
    arrived();
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    wait(400);
    expect(walker()).toBeNull();
    page.unmount();

    // Off to the docs and back through a link: the home page mounts again.
    render(<Hero />);
    tableInView();
    wait(10_000);
    expect(walker()).toBeNull();
  });

  it('goes when the envelope is dismissed in the corner of the window', () => {
    // One character in three places (`guide.ts`): sent away from one, it goes
    // from all of them.
    render(<Hero />);
    arrived();
    act(() => dismissGuide());
    wait(400);
    expect(walker()).toBeNull();
  });

  it('comes back on the way home if it was never dismissed, and goes on from there', () => {
    const page = render(<Hero />);
    arrived();
    page.unmount();

    // One envelope for the life of the page: back home, it says the next one.
    render(<Hero />);
    arrived();
    expect(said(second)).toBeInTheDocument();
  });

  it('arrives after the delay where nothing can say the table is in view', () => {
    delete (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver;
    render(<Hero />);
    wait(DELAY_MS + WALK_MS + WAKE_MS + 50);
    expect(said(first)).toBeInTheDocument();
  });

  it('stands already waving, with no walk, for a reader who asked for less motion', () => {
    jest.spyOn(window, 'matchMedia').mockImplementation(
      (query: string) =>
        ({
          matches: query.includes('prefers-reduced-motion'),
          media: query,
          addEventListener: () => undefined,
          removeEventListener: () => undefined,
        }) as unknown as MediaQueryList
    );
    render(<Hero />);
    tableInView();
    wait(DELAY_MS + 50);
    expect(phase()).toBe('pointing');
    expect(said(first)).toBeInTheDocument();
  });
});
