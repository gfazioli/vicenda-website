/**
 * The home page's sections that the product bar links to, in page order.
 * Every id here is an anchor the page renders; `Welcome.test.tsx` checks that,
 * because a link to an anchor that does not exist scrolls nowhere and nothing
 * reports it. It is also the list the bar's scroll spy walks.
 */
export const productSections = [{ id: 'overview' }, { id: 'how-it-works' }, { id: 'faq' }] as const;

export type ProductSectionId = (typeof productSections)[number]['id'];

/**
 * What the bar shows, in its order (#43): the three sections above, plus the
 * two pages that are not a place on the home page. Absolute hrefs (`/#faq`,
 * not `#faq`), because the bar is on every page and a bare fragment from
 * inside the docs scrolls nowhere.
 *
 * Privacy is the policy itself: the home page's "On your Mac" says the gist,
 * the policy says all of it.
 */
const toSection = (section: ProductSectionId, label: string) => ({
  section,
  href: `/#${section}`,
  label,
});

export const menus: { section: ProductSectionId | null; href: string; label: string }[] = [
  toSection('overview', 'Overview'),
  toSection('how-it-works', 'How it works'),
  { section: null, href: '/docs/privacy', label: 'Privacy' },
  { section: null, href: '/docs', label: 'Docs' },
  toSection('faq', 'FAQ'),
];

/**
 * Which menu stands for the page that is open, when it is not the home page:
 * the policy for its own URL, Docs for the rest of the docs. Null elsewhere.
 */
export function currentPageMenu(pathname: string): string | null {
  if (pathname === '/docs/privacy') {
    return '/docs/privacy';
  }
  if (pathname === '/docs' || pathname.startsWith('/docs/')) {
    return '/docs';
  }
  return null;
}
