import '@mantine/core/styles.css';
// !! The order of these imports is important !!
import '@gfazioli/mantine-marquee/styles.css';
import '@gfazioli/mantine-text-animate/styles.css';
import '@gfazioli/mantine-scene/styles.css';
// Mantine theme overrides (body background, marquee fade edges, etc.)
import '@/theme/global.css';

import { EB_Garamond } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { Layout } from 'nextra-theme-docs';
import { Banner, Head } from 'nextra/components';
import { getPageMap } from 'nextra/page-map';
import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core';
// !! End of important imports !!

import { MantineFooter, MantineNavBar } from '@/components';
import { NewsletterModal } from '@/components/NewsletterSignup/NewsletterModal';
import { WebsiteJsonLd } from '@/components/StructuredData/StructuredData';
import config from '@/config';
import { theme } from '../theme';

import './global.css';

export const metadata = config.metadata;

/**
 * The display face, and the one deliberate borrowing on this site.
 *
 * The reference is Apple's *Think Different* campaign, which was set in **Apple
 * Garamond** — Apple's own cut of ITC Garamond, condensed to about 80%, used
 * from 1984 to 2002 and never licensed to anybody else. It is not available to
 * us and the copies that circulate share its provenance, so this is EB Garamond
 * (SIL Open Font License): the same Garamond lineage, legitimately.
 *
 * The hero line takes a slight horizontal scale in CSS, which is where Apple
 * Garamond's condensed proportion actually lives — see `.display-hero`.
 */
const display = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const pageMap = await getPageMap();
  const { nextraLayout, head } = config;

  return (
    <html lang="en" dir="ltr" className={display.variable} {...mantineHtmlProps}>
      <Head>
        <ColorSchemeScript
          nonce={head.mantine.nonce}
          defaultColorScheme={head.mantine.defaultColorScheme}
        />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        {/*
          No manual viewport meta: Next emits `width=device-width,
          initial-scale=1` by default. The previous override added
          `user-scalable=no`, which blocks pinch-zoom — an accessibility
          regression (and a Lighthouse flag). Let the default stand so
          users can zoom.
        */}
      </Head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme={head.mantine.defaultColorScheme}>
          <Layout
            banner={
              <Banner storageKey={`vicenda-beta-${config.app.version}`}>
                {/*
                  Wrap the banner body in a single span. Nextra's Banner
                  internally maps over its children; passing two siblings
                  (the text node + the <a>) triggers React 19's "Each
                  child should have a unique key" warning surfaced through
                  the ConfigProvider.
                */}
                <span>
                  Vicenda is in closed beta. <a href="/beta">Ask for an invite</a>
                </span>
              </Banner>
            }
            navbar={<MantineNavBar />}
            pageMap={pageMap}
            docsRepositoryBase={nextraLayout.docsRepositoryBase}
            footer={<MantineFooter />}
            sidebar={nextraLayout.sidebar}
          >
            {children}
          </Layout>
          <NewsletterModal />
        </MantineProvider>
        <WebsiteJsonLd />
        <Analytics />
      </body>
    </html>
  );
}
