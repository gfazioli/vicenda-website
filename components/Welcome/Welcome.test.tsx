import { SECTION_ATTRIBUTE, SECTION_LINES } from '../Mascot/lines';
import { productSections } from '../MenuBarHeader/sections';
import { render, screen } from '@/test-utils';
import { Welcome } from './Welcome';

describe('Welcome component', () => {
  it('renders the hero headline, once', () => {
    render(<Welcome />);
    // Read the h1's textContent rather than querying for the string: the
    // headline lives inside TextAnimate, which wraps each word in elements of
    // its own, so `getByText` (an element's OWN text) cannot see it.
    const headlines = screen.getAllByRole('heading', { level: 1 });
    expect(headlines).toHaveLength(1);
    expect(headlines[0].textContent).toBe('Stop noticing your email.');
  });

  it('renders every anchor the product bar links to', () => {
    // A link to an anchor that does not exist scrolls nowhere, and nothing
    // reports it.
    const { container } = render(<Welcome />);
    for (const section of productSections) {
      expect(container.querySelector(`#${section.id}`)).not.toBeNull();
    }
  });

  it('marks, in page order, every section the envelope has lines for', () => {
    // The envelope in the corner speaks for the section the reader is in
    // (`Mascot/ScrollGuide`): a mark with no lines would say nothing, and
    // lines with no mark would never be said.
    const { container } = render(<Welcome />);
    const marked = [...container.querySelectorAll(`[${SECTION_ATTRIBUTE}]`)].map((el) =>
      el.getAttribute(SECTION_ATTRIBUTE)
    );
    expect(marked).toEqual(Object.keys(SECTION_LINES));
  });

  it('sends "See how it works" to the section under the hero', () => {
    render(<Welcome />);
    expect(screen.getByRole('link', { name: /see how it works/i })).toHaveAttribute(
      'href',
      '#how-it-works'
    );
  });

  it('offers no download, and names no cloud AI', () => {
    // Owner, 2026-10-29: no download link until the next version, and nothing
    // about Claude or any cloud AI -- everything runs on the Mac.
    const { container } = render(<Welcome />);
    const hrefs = [...container.querySelectorAll('a[href]')].map((a) => a.getAttribute('href'));
    expect(hrefs.filter((href) => href?.includes('download'))).toEqual([]);
    const hero = container.querySelector('#overview');
    expect(hero?.textContent).not.toMatch(/claude|anthropic|openai|cloud/i);
    expect(hero?.textContent).toMatch(/runs entirely on your Mac/);
  });
});
