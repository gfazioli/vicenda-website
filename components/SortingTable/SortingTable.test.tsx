import { render, screen } from '@/test-utils';
import { SortingTable } from './SortingTable';
import { deck, dealt, description, leaving, rising } from './table-data';

/** Where the table is laid out when the page mounts (`layoutBox` in useReveal). */
function placeAt(top: number) {
  jest.spyOn(HTMLElement.prototype, 'offsetTop', 'get').mockReturnValue(top);
  jest.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(400);
}

describe('SortingTable', () => {
  beforeEach(() => {
    // jsdom has none; one that never fires is enough to arm.
    globalThis.IntersectionObserver = class {
      observe() {}
      disconnect() {}
    } as unknown as typeof IntersectionObserver;
  });

  afterEach(() => {
    delete (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver;
    jest.restoreAllMocks();
  });

  it('is one picture to assistive technology, and says of what', () => {
    render(<SortingTable />);
    const table = screen.getByRole('img');
    expect(table).toHaveAccessibleName(description);
    expect(description).toMatch(/Bin, Bin and unsubscribe, Later/);
  });

  it('serves the end of the pass: the newsletter in the Bin, its count at 1', () => {
    // What Reduce Motion, paper and a page whose scripts never ran all show,
    // and what stays when the table is on screen at mount.
    placeAt(100);
    const { container } = render(<SortingTable />);
    const table = screen.getByRole('img');
    expect(table).not.toHaveAttribute('data-armed');
    // The Bin is the first tray, and the one whose count has a 0 leaving and
    // a 1 arriving. Every other tray holds one plain 0.
    const counts = [...container.querySelectorAll('[class*="count"]')].filter(
      (el) => el.parentElement?.className.includes('tray') ?? false
    );
    expect(counts.map((el) => el.textContent)).toEqual(['01', '0', '0', '0', '0', '0']);
    expect(table.textContent).toContain(leaving.sender);
    expect(table.textContent).toContain(rising.sender);
    expect(table.textContent).toContain(dealt.sender);
  });

  it('arms it into its first pose when it mounts off screen', () => {
    placeAt(window.innerHeight + 40);
    render(<SortingTable />);
    expect(screen.getByRole('img')).toHaveAttribute('data-armed');
    expect(screen.getByRole('img')).not.toHaveAttribute('data-revealed');
  });

  it('shows invented mail only', () => {
    // No address, no real-looking domain: the senders are made-up names.
    const words = [leaving, rising, dealt, ...deck].map((card) => `${card.sender} ${card.subject}`);
    for (const line of words) {
      expect(line).not.toMatch(/@|\.(com|it|net|org)\b/);
    }
  });
});
