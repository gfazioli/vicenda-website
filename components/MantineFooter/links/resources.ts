import config from '@/config';

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
    // IN THE FOOTER, and not only in the docs nav and the product bar,
    // because that is where a reader looks for it: reachable at a URL somebody
    // already knows is not the same as visible. The footer is the one place
    // present on every page.
    key: 'privacy',
    title: 'Privacy',
    href: '/docs/privacy',
  },
  {
    key: 'discord',
    title: 'Discord',
    href: config.community.discord,
    newWindow: true,
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
