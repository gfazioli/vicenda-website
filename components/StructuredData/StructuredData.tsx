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
        // The site's own `/download`, which resolves the newest `.dmg` at
        // request time. Never point this at an asset that does not exist.
        downloadUrl: `${SITE}${config.app.downloadUrl}`,
        softwareVersion: config.app.version,
        image: `${SITE}/opengraph-image.jpeg`,
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
const FAQ_ENTRIES: { question: string; answer: string }[] = [
  {
    question: 'What is Vicenda?',
    answer:
      'A native macOS mail client shaped like a conversation. The machines that write to you become channels you visit, the people you correspond with become threads that empty, and a recognised machine message — an invoice, a security advisory — is drawn as a card with named fields instead of being rendered as the sender\u2019s HTML.',
  },
  {
    question: 'How do I get it?',
    answer:
      'Vicenda is a free download for macOS, signed and notarised by Apple. There is no App Store listing and no account to create.',
  },
  {
    question: 'What macOS version do I need?',
    answer: 'macOS 15 or later.',
  },
  {
    question: 'Which mailboxes does it support?',
    answer:
      'Gmail, through Google\u2019s API, and any account reachable over IMAP. Reading works on both. Marking read and unread works on both. Archive and delete work on Gmail accounts where you have turned writing on, and are not built for IMAP yet.',
  },
  {
    question: 'Can I send mail with it?',
    answer:
      'Not yet. Vicenda is a reading and triage tool first — composing is secondary and sending is not built. The composer writes a local draft and says so rather than offering a button that quietly does nothing.',
  },
  {
    question: 'Where does my mail go?',
    answer:
      'Nowhere. Vicenda runs no server — not for sync, not for search — and your mail is read from the provider straight to your Mac. It also blocks every remote resource before a message is rendered, so opening an email does not tell the sender you opened it.',
  },
  {
    question: 'What does it cost?',
    answer:
      'Nothing, and there is no pricing page to visit later. Vicenda is one person\u2019s mail client, opened to a few people. If it turns out to be useful to you, sponsoring the work is welcome and buys you nothing extra.',
  },
  {
    question: 'Does it use AI?',
    answer:
      'Only if you ask it to, and only on your Mac. An optional local model can build a card for a machine message no template covers — a download you choose in Settings, run entirely on your Mac, never sent anywhere. It needs an Apple silicon Mac, and Vicenda is complete without it.',
  },
  {
    question: 'Does it update itself?',
    answer:
      'Yes. Vicenda checks for updates on its own and installs them when you say so, the same way FinderGit and Netfox do. You can turn the check off in Settings.',
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
