import type { Metadata } from 'next';
import { SkipNavContent } from 'nextra/components';
import { SoftwareApplicationJsonLd } from '@/components/StructuredData/StructuredData';
import { Welcome } from '@/components/Welcome/Welcome';
import config from '@/config';

/*
 * No `revalidate`: the page is static. It was regenerated every six hours for
 * the hero's release strip, whose freshness phrase ("Updated today") would
 * otherwise freeze at whatever it said on release day. The strip is off the
 * hero while the site offers no download (owner, 2026-10-29: it told how
 * recently the OLD app shipped), and nothing else on the page changes between
 * deploys, so a regeneration would rewrite the same HTML into every CDN region
 * for nothing. When the strip comes back, so does the timer, and
 * `home-revalidate.test.ts` holds the two together.
 */

/**
 * The home page names its own URL. The root layout's canonical is `./`, which
 * Next resolves against the page's pathname — right for every docs page, and
 * wrong here on Vercel, where this page is rendered as `/index`: production
 * served `canonical` and `og:url` as https://vicenda.app/index (2026-09-25), a
 * URL that also answers 200 with this same page, while the sitemap says `/` —
 * and `og:url` is the address Open Graph readers attribute a share to.
 * `next start` renders the page as `/`, after a regeneration too, so the defect
 * cannot be seen locally.
 *
 * A leading `/` is resolved against `metadataBase` alone, whatever pathname the
 * platform passes. `openGraph` set on a page REPLACES the layout's rather than
 * merging with it, hence the spread.
 */
export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: { ...config.metadata.openGraph, url: '/' },
};

export default function HomePage() {
  // In a <main>: the docs pages get one from Nextra, the home page had none,
  // so its hero, claims and FAQ sat in no landmark at all (2026-09-29 audit).
  // Nextra's skip link is on every page, its target only in the MDX wrapper.
  return (
    <>
      <SoftwareApplicationJsonLd />
      <SkipNavContent />
      <main>
        <Welcome />
      </main>
    </>
  );
}
