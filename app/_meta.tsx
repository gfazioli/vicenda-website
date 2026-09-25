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
  // The home page's FAQ, as the sibling sites link their Features grid. An
  // absolute anchor, so it also works from inside the docs.
  faq: {
    type: 'page',
    title: 'FAQ',
    href: '/#faq',
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
      // The GitHub Sponsors page itself. This was `#sponsors`, which scrolled
      // to the footer's sponsor card, one step short of the page where
      // sponsoring happens. External, so Nextra adds its arrow like the coffee.
      sponsor: {
        title: (
          <Group component="span" gap={8} wrap="nowrap" align="center">
            <IconHeartFilled size={16} />
            Sponsor
          </Group>
        ),
        href: 'https://github.com/sponsors/gfazioli',
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
