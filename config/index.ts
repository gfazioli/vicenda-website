export default {
  metadata: {
    title: {
      // 58 characters — within the 50-60 OG sweet spot.
      // "Native macOS" + "Git Intelligence" both pull weight in
      // the click decision: the first frames the platform, the
      // second the differentiator over a plain file browser.
      // 56 characters. "Mail client" says the category in two words and
      // "not a list" is the whole differentiator — the two things that decide
      // a click, in the order they decide it.
      default: 'Vicenda — A Mac mail client that is not a list',
      template: '%s | Vicenda',
    },
    description:
      'A native macOS mail client shaped like a conversation. The machines that write to you get channels, the people get threads, and nothing ever leaves your Mac.',
    metadataBase: new URL('https://vicenda.app/'),
    keywords: [
      'Vicenda',
      'macOS',
      'mail client',
      'email',
      'Gmail',
      'IMAP',
      'SwiftUI',
      'privacy',
      'native Mac app',
      'inbox triage',
    ],
    generator: 'Next.js',
    applicationName: 'Vicenda',
    appleWebApp: {
      title: 'Vicenda',
    },
    openGraph: {
      url: './',
      siteName: 'Vicenda',
      locale: 'en_US',
      type: 'website',
    },
    other: {
      // The app's own chrome, not a brand blue it does not have.
      'msapplication-TileColor': '#1A181E',
    },
    twitter: {
      card: 'summary_large_image',
      site: '@gfazioli',
      creator: '@gfazioli',
    },
    alternates: {
      canonical: './',
    },
  },
  nextraLayout: {
    docsRepositoryBase: 'https://github.com/gfazioli/vicenda-website/tree/main/app/docs/',
    sidebar: {
      defaultMenuCollapseLevel: 1,
    },
  },
  head: {
    mantine: {
      defaultColorScheme: 'dark',
      nonce: '8IBTHwOdqNKAWeKl7plt8g==',
    },
  },
  gitHub: {
    // Note: the app repo is PRIVATE. Releases API will be configured
    // when a public releases repo is created.
    repo: 'gfazioli/vicenda-website',
    apiUrl: 'https://api.github.com',
    releasesUrl: 'https://api.github.com/repos/gfazioli/vicenda-website/releases',
  },
  releaseNotes: {
    // External link to the GitHub Releases page — used by the
    // "View full changelog on GitHub" button at the bottom of /docs/release-notes.
    url: 'https://github.com/gfazioli/findergit-website/releases',
    maxReleases: 10,
    // Releases live on the website repo, which ALSO carries the website's
    // own releases (the Mantine/Nextra template tags a `v6.x` release when
    // its packages are bumped). release.sh names every FinderGit app
    // release "FinderGit X.Y.Z"; the feed keeps only releases with this
    // name prefix so a website-internal entry never appears in the app's
    // release notes. (Cross-port: netfox-website would use 'Netfox'.)
    appReleaseNamePrefix: 'FinderGit',
    // How many recent releases to render on the page + in the TOC. The
    // rest stay one click away via "View full changelog on GitHub" at the
    // bottom — the page was growing unbounded. Sliced AFTER the app-name
    // filter so a website template release can't eat a visible slot.
    displayCount: 3,
  },
  search: {
    queryKeyword: 'q',
    minQueryLength: 3,
    limitKeyword: 'limit',
    defaultMaxResults: 5,
    excerptLengthKeyword: 'excerptLength',
    defaultExcerptLength: 30,
    defaultLanguage: 'en',
  },
  app: {
    version: '0.1.0',
    minMacOS: '15.0',
    /**
     * The FALLBACK for `/download`, not the link people click.
     *
     * `/download` resolves the newest `.dmg` from the Releases API at request
     * time so the public URL carries no version; this is where it lands when
     * that resolution fails, so the button is never a dead end. Same shape as
     * the two sibling sites — and it points at the WEBSITE repo, because the
     * app repo is private and its releases are not readable.
     */
    downloadUrl: 'https://github.com/gfazioli/vicenda-website/releases/latest',
  },

} as const;
