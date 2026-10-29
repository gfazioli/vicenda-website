/**
 * The home page's sections that the product bar links to, in page order.
 * Every id here is an anchor the page renders; `Welcome.test.tsx` checks that,
 * because a link to an anchor that does not exist scrolls nowhere and nothing
 * reports it. It is also the list the bar's scroll spy walks.
 */
export const productSections = [
  { id: 'overview', label: 'Overview' },
  { id: 'how-it-works', label: 'How it works' },
  { id: 'faq', label: 'FAQ' },
] as const;

export type ProductSectionId = (typeof productSections)[number]['id'];

/**
 * What the bar shows, in its order (#43): the three sections above, plus the
 * two pages that are not a place on the home page. Absolute hrefs (`/#faq`,
 * not `#faq`), because the bar is on every page and a bare fragment from
 * inside the docs scrolls nowhere.
 *
 * Privacy is the policy page for now; the home page's "On your Mac" section
 * comes with the next step of the rewrite.
 */
export const menus: { section: ProductSectionId | null; href: string; label: string }[] = [
  { section: 'overview', href: '/#overview', label: 'Overview' },
  { section: 'how-it-works', href: '/#how-it-works', label: 'How it works' },
  { section: null, href: '/docs/privacy', label: 'Privacy' },
  { section: null, href: '/docs', label: 'Docs' },
  { section: 'faq', href: '/#faq', label: 'FAQ' },
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
