import { Group } from '@mantine/core';
import { IconCoffee, IconHeartFilled } from '@tabler/icons-react';

export default {
  index: {
    display: 'hidden',
  },
  docs: {
    type: 'page',
    title: 'Documentation',
  },
  download: {
    type: 'page',
    title: 'Download',
    href: '/download',
  },
  community: {
    title: 'Community',
    type: 'menu',
    items: {
      // Release news only, on Vicenda's own Substack — the sibling sites'
      // shape. (This entry once pointed at ANOTHER product's Substack, carried
      // over with the template, and was removed rather than fixed; the app
      // has its own publication now.)
      newsletter: {
        title: 'Newsletter',
        href: 'https://vicenda.substack.com',
      },
      issues: {
        title: 'Report an Issue',
        href: 'mailto:feedback@vicenda.app?subject=Vicenda%20feedback',
      },
    },
  },
  about: {
    type: 'page',
    title: 'About',
    href: 'https://gfazioli.github.io/',
  },
  support: {
    title: 'Support',
    type: 'menu',
    items: {
      // Scrolls to the on-page Sponsors section (footer) — internal anchor,
      // so Nextra shows no external arrow.
      sponsor: {
        title: (
          <Group component="span" gap={8} wrap="nowrap" align="center">
            <IconHeartFilled size={16} />
            Sponsor
          </Group>
        ),
        href: '#sponsors',
      },
      // External donation link — Nextra keeps the ↗ external indicator.
      coffee: {
        title: (
          <Group component="span" gap={8} wrap="nowrap" align="center">
            <IconCoffee size={16} />
            Buy me a coffee
          </Group>
        ),
        href: 'https://donate.stripe.com/fZu4gy4Tn3b1dgudGx0co00',
      },
    },
  },
};
