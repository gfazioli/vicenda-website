/**
 * Where supporting the work happens, the same everywhere it is offered: the
 * product bar, the footer's links and sponsor wall, and the mobile menu
 * (`app/_meta.tsx`). Beside `Discord/discord.ts`, which does the same for the
 * community.
 */

/** GitHub Sponsors, the page itself. */
export const SPONSOR_URL = 'https://github.com/sponsors/gfazioli';

/** A one-off donation, through Stripe. */
export const COFFEE_URL = 'https://donate.stripe.com/fZu4gy4Tn3b1dgudGx0co00';

/** Dark ink on the coffee's yellow: white on Mantine's yellow-6 is 1.9:1. */
export const COFFEE_INK = '#3b2600';

/** Every link to them opens in a new tab, the same way everywhere. */
export const externalLinkProps = { target: '_blank', rel: 'noopener noreferrer' } as const;
