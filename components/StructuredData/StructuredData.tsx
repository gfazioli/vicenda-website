import config from '@/config';

/**
 * JSON-LD structured data (schema.org). Rendered server-side so the markup
 * is in the initial HTML where crawlers read it. Three schemas:
 *
 * - `WebsiteJsonLd` (site-wide, in the root layout): the WebSite + publisher
 *   Organization entity, for the knowledge graph and brand recognition.
 * - `SoftwareApplicationJsonLd` (homepage): the app itself — free, macOS,
 *   developer tool — eligible for an application rich result.
 * - `FaqJsonLd` (FAQ page): the Q&A, eligible for FAQ rich snippets.
 *
 * No `aggregateRating` is emitted — there are no real ratings to cite, and
 * fabricating one violates Google's guidelines.
 */

const SITE = config.metadata.metadataBase.toString().replace(/\/$/, '');

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is static, author-controlled JSON — no user input is
      // interpolated, so serializing it directly is safe.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function WebsiteJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': `${SITE}/#website`,
            url: `${SITE}/`,
            name: 'Vicenda',
            description: config.metadata.description,
            publisher: { '@id': `${SITE}/#organization` },
            inLanguage: 'en',
          },
          {
            '@type': 'Organization',
            '@id': `${SITE}/#organization`,
            name: 'Vicenda',
            url: `${SITE}/`,
            logo: { '@type': 'ImageObject', url: `${SITE}/icon-512x512.png` },
          },
        ],
      }}
    />
  );
}

export function SoftwareApplicationJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'Vicenda',
        description: config.metadata.description,
        applicationCategory: 'CommunicationApplication',
        operatingSystem: `macOS ${config.app.minMacOS}+`,
        url: `${SITE}/`,
        // No downloadUrl while the site offers no download (owner,
        // 2026-10-29). When it comes back, it is `${SITE}/download`: the
        // config's downloadUrl is already absolute, and gluing SITE in front
        // of it published "https://vicenda.apphttps://github.com/…".
        softwareVersion: config.app.version,
        // The file is `app/opengraph-image.png`, which Next serves at this
        // path. This said `.jpeg`, a URL that answered 404.
        image: `${SITE}/opengraph-image.png`,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        publisher: { '@id': `${SITE}/#organization` },
      }}
    />
  );
}

// PLAIN-TEXT MIRROR of the visible answers in `components/FAQ/FAQ.tsx`.
// Google requires the schema text to match what is on the page, so the two are
// a pair: change one and the other is wrong — and the wrong one is the
// invisible one, which is why this file already went a whole day describing a
// different product.
export const FAQ_ENTRIES: { question: string; answer: string }[] = [
  {
    question: 'What is Vicenda?',
    answer:
      'A Mac app that turns a morning of mail into a few decisions. It reads every account you give it, sorts the mail by kind with rules it learns as you go, and lays the morning out as one report: what needs you, what can be read in a line, what is new, and what is already decided.',
  },
  {
    question: 'Does it replace my mail app?',
    answer:
      'No. It reads and sorts your mail, but it does not write or send any, and it is not trying to replace the app you reply in. Keep that app for the rare message that needs an answer: a mail address you click in a message opens there.',
  },
  {
    question: 'How do I get it?',
    answer:
      'Vicenda is free, for macOS, with no App Store listing and no account to create. The next version is being rebuilt from the ground up, and the download comes back when it is ready.',
  },
  {
    question: 'Which accounts can it read?',
    answer:
      'Any mailbox that speaks IMAP over an encrypted connection, Gmail included: Gmail needs an app password, which Google lets you make once 2-Step Verification is on. Every account lands in the same report, each with its own colour and monogram.',
  },
  {
    question: 'Does my mail leave my Mac?',
    answer:
      'No. It comes from your provider straight to your Mac and stays there: Vicenda runs no server, sends no telemetry, and its model works on the device. Opening a message loads nothing from the internet, because every remote image and tracker in it is blocked.',
  },
  {
    question: 'Which Mac do I need?',
    answer:
      'macOS 15 or later, on Apple silicon. Vicenda needs one model, and it runs on your Mac: on macOS 26 that is Apple Intelligence, with nothing to download; otherwise you download a model once, from Settings: 2.3 GB for a Mac with 16 GB of memory, or 0.9 GB for one with 8 GB.',
  },
  {
    question: 'What happens to mail I bin?',
    answer:
      'Today, binning is a decision recorded in Vicenda, on your Mac: the mail leaves the report, and your mailbox on the server stays as it is. Carrying decisions to the server comes next, and there a binned mail will go to your provider\u2019s Trash, not be deleted.',
  },
  {
    question: 'Can I reply, or write a new mail?',
    answer:
      'Not in Vicenda: it has no composer and sends nothing. Fewer than one message a day needs an answer, so reply in the mail app you already use.',
  },
  {
    question: 'What does it cost?',
    answer:
      'Nothing, and there is no pricing page to visit later: Vicenda is a personal project. If it is useful to you, sponsoring the work is welcome and buys you nothing extra.',
  },
  {
    question: 'Who makes it? Is it open source?',
    answer:
      'One person: Giovambattista Fazioli, who publishes as Undolog. The app is free but its source is not public; the source of this website is.',
  },
  {
    question: 'Does it update itself?',
    answer:
      'Yes. Vicenda checks for updates on its own and installs them when you say so. You can turn the check off in Settings.',
  },
  {
    question: 'Is there a Vicenda community?',
    answer:
      'Yes, on Discord, where Vicenda and its sibling apps live: get help, suggest features, vote on what comes next and talk directly with the maker.',
  },
];

export function FaqJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: FAQ_ENTRIES.map((entry) => ({
          '@type': 'Question',
          name: entry.question,
          acceptedAnswer: { '@type': 'Answer', text: entry.answer },
        })),
      }}
    />
  );
}
