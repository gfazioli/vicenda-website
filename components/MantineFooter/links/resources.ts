export const resources = [
  {
    key: 'docs',
    title: 'Documentation',
    href: '/docs',
  },
  {
    key: 'getting-started',
    title: 'Getting Started',
    href: '/docs/getting-started',
  },
  {
    // IN THE FOOTER, and not only in the docs nav, because that is where a
    // reader — and a Google OAuth reviewer — looks for it. Google's
    // restricted-scope requirements say the privacy policy must be "visible to
    // users, hosted within the same domain as your application's home page":
    // reachable at a URL somebody already knows is not the same as visible.
    // The footer is the one place present on every page.
    key: 'privacy',
    title: 'Privacy',
    href: '/docs/privacy',
  },
  {
    key: 'issues',
    title: 'Report an Issue',
    href: 'mailto:feedback@vicenda.app?subject=Vicenda%20feedback',
  },
  {
    key: 'undolog',
    title: 'Undolog Blog',
    href: 'https://undolog.com',
    newWindow: true,
  },
];
