export default {
  metadata: {
    title: {
      // The hero's headline. Vicenda is not a mail client any more (it is a
      // morning report that sorts the mail), so the category the old title
      // named is gone with it; the promise is what decides the click.
      default: 'Vicenda — Stop noticing your email',
      template: '%s | Vicenda',
    },
    // The hero's lede, one "it" shorter: 148 characters, under the 160 a
    // result shows. No "mail client", and no AI vendor: it all runs on the Mac.
    description:
      'Vicenda turns a morning of mail into a few decisions. It sorts every account by kind, with rules it learns as you go, and runs entirely on your Mac.',
    metadataBase: new URL('https://vicenda.app/'),
    keywords: [
      'Vicenda',
      'macOS',
      'morning report',
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
    url: 'https://github.com/gfazioli/vicenda-website/releases',
    maxReleases: 10,
    // Releases live on the website repo, which ALSO carries the website's
    // own releases (the Mantine/Nextra template tags a `v6.x` release when
    // its packages are bumped). `release.sh` titles every app release
    // `"$APP_NAME $VERSION"` and `APP_NAME="Vicenda"`, so the feed keeps
    // only releases starting with that word and a website-internal entry
    // never appears in the app's release notes.
    //
    // THIS SAID 'FinderGit' UNTIL 2026-08-31, carried over with the rest of
    // the template. The filter would have discarded every release this site
    // exists to show, leaving the page permanently empty on the day Vicenda
    // first shipped -- and nothing would have reported it, because an empty
    // feed and a filtered-out feed render identically.
    appReleaseNamePrefix: 'Vicenda',
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
    version: '0.3.0',
    /**
     * Publication date of `version`, UTC. Written by `release.sh` in the app
     * repo alongside the version and the floor, and EMPTY until the first
     * release, because there has not been one.
     *
     * Nothing renders it yet. It exists so the first release captures its own
     * date rather than leaving it to be reconstructed later: the sibling sites
     * read this as the offline fallback for the homepage release strip, and as
     * the JSON-LD `dateModified`. Vicenda gets neither until there are enough
     * releases for a cadence to be worth showing - one release dated today
     * says less than nothing.
     */
    releaseDate: '2026-09-25',
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
  // The community's home since 2026-10-08: the Undolog Discord server, shared
  // by Vicenda and its sibling apps. The invite never expires. The Undolog
  // Slack it replaces is being retired: link nothing there.
  community: {
    discord: 'https://discord.gg/rdWu5yFCR6',
    // The app version current when the server opened. The home page's "Just
    // opened" badge decays from it (`isRecent`): gone two minor releases on,
    // with no one having to remember it.
    discordSince: '0.3.0',
  },
  // Who publishes the site, as Italian law asks every VAT-registered owner to
  // say: the VAT number on the home page (art. 35 DPR 633/72), and name,
  // contact and VAT number reachable from every page (art. 7 D.Lgs. 70/2003).
  // The footer's last line reads these, and so do /docs/legal and
  // /docs/privacy. The contact addresses are written in those two pages as
  // plain markdown links, which is what gets the docs' link style (a JSX <a>
  // in MDX gets none), so they are not kept here. The same
  // values on every Undolog site.
  legal: {
    brand: 'Undolog',
    owner: 'Giovambattista Fazioli',
    vatNumber: '12343751009',
  },
} as const;
