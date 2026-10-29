import { COFFEE_URL, SPONSOR_URL } from '../../Support/support';

export const highlights = [
  {
    key: 'release-notes',
    title: 'Release Notes',
    href: '/docs/release-notes',
  },
  {
    key: 'sponsor',
    title: 'Sponsor',
    href: `${SPONSOR_URL}?o=esb`,
    newWindow: true,
  },
  {
    key: 'buy-me-a-coffee',
    title: 'Buy me a coffee',
    href: COFFEE_URL,
    newWindow: true,
  },
];
