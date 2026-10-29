import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { CADENCE_REVALIDATE_SECONDS } from './fetch-release-cadence';

const home = () => readFileSync(join(process.cwd(), 'app/page.tsx'), 'utf8');

/**
 * Next requires a segment's `revalidate` to be statically analysable, so the
 * homepage cannot import the constant it has to agree with. Read the literal
 * back out of the source instead.
 */
function homeRevalidateLiteral(): number | null {
  const match = home().match(/^export const revalidate = (\d+);$/m);
  return match ? Number(match[1]) : null;
}

describe('homepage revalidate', () => {
  it('agrees with the cadence fetch, which would otherwise clamp it', () => {
    // The strip is off the hero while the site offers no download, and the
    // page fetches nothing. When it fetches the cadence again, it needs the
    // timer back, at the fetch's own value.
    if (!/fetchReleaseCadence\(/.test(home())) {
      // Static: a timer on a page with nothing to refresh rewrites the same
      // HTML into every CDN region for nothing.
      expect(homeRevalidateLiteral()).toBeNull();
      return;
    }
    // A fetch revalidate BELOW the page's wins silently: the segment takes the
    // minimum of the two, so raising only the export looks applied and changes
    // nothing. Measured on 2026-09-18 at 21600 against 3600, where the build
    // kept writing 3600 into the prerender manifest.
    expect(homeRevalidateLiteral()).toBe(CADENCE_REVALIDATE_SECONDS);
  });
});
