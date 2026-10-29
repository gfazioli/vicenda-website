import { Profiler } from 'react';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@/test-utils';
import { NewsletterModal } from './NewsletterModal';
import { DISMISSED_KEY, PROMPT_OPEN_ATTRIBUTE } from './prompt-open';

/*
 * The prompt watches the scroll on every page of the site, so what it costs
 * per scroll event is the point: it used to render on each one, forever.
 * Frames are queued by hand, so a test says exactly when the check runs.
 * Ported with the watcher from findergit.app.
 */
describe('NewsletterModal', () => {
  let frames: Map<number, FrameRequestCallback>;
  let nextFrame: number;

  const runFrames = () =>
    act(() => {
      const due = [...frames.values()];
      frames.clear();
      due.forEach((callback) => callback(performance.now()));
    });

  // A plain, writable property in jsdom.
  const setScrollY = (y: number) => {
    (window as { scrollY: number }).scrollY = y;
  };

  const scrollTo = (y: number) => {
    setScrollY(y);
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
  };

  const isOpen = () => screen.queryByRole('dialog') !== null;

  beforeEach(() => {
    localStorage.clear();
    frames = new Map();
    nextFrame = 1;
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      frames.set(nextFrame, callback);
      return nextFrame++;
    });
    jest.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
      frames.delete(id);
    });
    setScrollY(0);
  });

  afterEach(() => {
    // Unmounted while the doubles are still in place: its cleanup cancels a
    // frame the mock queued, which the real cancelAnimationFrame never issued.
    cleanup();
    document.documentElement.removeAttribute(PROMPT_OPEN_ATTRIBUTE);
    jest.restoreAllMocks();
  });

  it('opens once the page has scrolled past 1200px, and not before', () => {
    render(<NewsletterModal />);
    scrollTo(1000);
    runFrames();
    expect(isOpen()).toBe(false);

    scrollTo(1300);
    runFrames();
    expect(isOpen()).toBe(true);
  });

  it('is a dialog with a name of its own, and so is the button the focus lands on', async () => {
    render(<NewsletterModal />);
    scrollTo(1300);
    runFrames();
    expect(screen.getByRole('dialog')).toHaveAccessibleName('Subscribe to the Vicenda newsletter');
    // Mantine moves the focus in on a timer of its own.
    await waitFor(() => expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus());
  });

  it('reads the scroll at most once a frame', () => {
    render(<NewsletterModal />);
    runFrames();
    for (let y = 100; y <= 1000; y += 100) {
      scrollTo(y);
    }
    expect(frames.size).toBe(1);
  });

  it('stops watching the scroll once it has opened', () => {
    render(<NewsletterModal />);
    scrollTo(1300);
    runFrames();
    expect(isOpen()).toBe(true);

    // The open modal queues frames of its own; a scroll must add none.
    const queued = frames.size;
    scrollTo(2000);
    expect(frames.size).toBe(queued);
  });

  it('opens on a page that loads already past the trigger', () => {
    setScrollY(3000);
    render(<NewsletterModal />);
    runFrames();
    expect(isOpen()).toBe(true);
  });

  it('marks <html> while it is open, for the envelope, and clears the mark when it closes', () => {
    // The envelope in the corner steps aside while the prompt is open
    // (`Mascot/ScrollGuide`), and comes back once the mark has gone.
    const marked = () => document.documentElement.getAttribute(PROMPT_OPEN_ATTRIBUTE);
    render(<NewsletterModal />);
    expect(marked()).toBeNull();
    scrollTo(1300);
    runFrames();
    expect(isOpen()).toBe(true);
    expect(marked()).toBe('open');
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(marked()).toBeNull();
  });

  it('remembers that the visitor closed it', () => {
    render(<NewsletterModal />);
    scrollTo(1300);
    runFrames();
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(localStorage.getItem(DISMISSED_KEY)).toBe('true');
  });

  it('opens at most once per page load, even where storage refuses the answer', () => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    render(<NewsletterModal />);
    scrollTo(1300);
    runFrames();
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(isOpen()).toBe(false);

    scrollTo(1600);
    runFrames();
    expect(isOpen()).toBe(false);
  });

  it('stays closed when the visitor closed it in another tab since the page loaded', () => {
    render(<NewsletterModal />);
    runFrames();
    localStorage.setItem(DISMISSED_KEY, 'true');
    scrollTo(1300);
    runFrames();
    expect(isOpen()).toBe(false);
  });

  it('renders nothing for a scroll once the visitor has closed it', () => {
    localStorage.setItem(DISMISSED_KEY, 'true');
    let commits = 0;
    render(
      <Profiler id="prompt" onRender={() => commits++}>
        <NewsletterModal />
      </Profiler>
    );
    runFrames();
    commits = 0;

    for (let y = 100; y <= 3000; y += 100) {
      scrollTo(y);
    }
    runFrames();
    expect(commits).toBe(0);
    expect(frames.size).toBe(0);
    expect(isOpen()).toBe(false);
  });
});
