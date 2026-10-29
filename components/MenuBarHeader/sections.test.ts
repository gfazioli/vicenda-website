import { currentPageMenu, menus } from './sections';

describe('the product bar', () => {
  it('shows the five menus #43 asks for, in its order, and no download', () => {
    expect(menus.map((menu) => menu.label)).toEqual([
      'Overview',
      'How it works',
      'Privacy',
      'Docs',
      'FAQ',
    ]);
    // No download anywhere until the next version (owner, 2026-10-29).
    expect(menus.some((menu) => /download/i.test(menu.href + menu.label))).toBe(false);
  });

  it('marks the page that is open, and the policy before the docs around it', () => {
    expect(currentPageMenu('/docs/privacy')).toBe('/docs/privacy');
    expect(currentPageMenu('/docs')).toBe('/docs');
    expect(currentPageMenu('/docs/getting-started')).toBe('/docs');
    expect(currentPageMenu('/')).toBeNull();
    // A page whose name only starts like the docs is not the docs.
    expect(currentPageMenu('/docsearch')).toBeNull();
  });
});
