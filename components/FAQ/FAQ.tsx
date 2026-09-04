'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Accordion, Anchor, Text } from '@mantine/core';

/**
 * The visible FAQ.
 *
 * **Keep this in step with `FAQ_ENTRIES` in `StructuredData.tsx`.** Google
 * requires the FAQ schema to mirror the answers on the page word for word, so
 * the two are a pair: change one and the other is wrong, and the wrong one is
 * the invisible one.
 *
 * Every answer here describes what the app does TODAY. "Sending is not built"
 * belongs on this page precisely because it is the thing a reader would
 * otherwise assume.
 */
const faqItems: { value: string; question: string; answer: ReactNode }[] = [
  {
    value: 'what',
    question: 'What is Vicenda?',
    answer:
      'A native macOS mail client shaped like a conversation. The machines that write to you become channels you visit, the people you correspond with become threads that empty, and a recognised machine message — an invoice, a security advisory — is drawn as a card with named fields instead of being rendered as the sender’s HTML.',
  },
  {
    value: 'download',
    question: 'How do I get it?',
    answer: (
      <Text size="sm">
        Vicenda is a free download for macOS, signed and notarised by Apple. There is no App Store
        listing and no account to create.{' '}
        <Anchor component={Link} href="/download" size="sm">
          Download it
        </Anchor>
        .
      </Text>
    ),
  },
  {
    value: 'macos',
    question: 'What macOS version do I need?',
    answer: 'macOS 15 or later.',
  },
  {
    value: 'providers',
    question: 'Which mailboxes does it support?',
    answer:
      'Gmail, through Google’s API, and any account reachable over IMAP. Reading works on both. Marking read and unread works on both. Archive and delete work on Gmail accounts where you have turned writing on, and are not built for IMAP yet.',
  },
  {
    value: 'send',
    question: 'Can I send mail with it?',
    answer:
      'Not yet. Vicenda is a reading and triage tool first — composing is secondary and sending is not built. The composer writes a local draft and says so rather than offering a button that quietly does nothing.',
  },
  {
    value: 'privacy',
    question: 'Where does my mail go?',
    answer: (
      <Text size="sm">
        Nowhere. Vicenda runs no server — not for sync, not for search — and your mail is read from
        the provider straight to your Mac. It also blocks every remote resource before a message is
        rendered, so opening an email does not tell the sender you opened it.{' '}
        <Anchor component={Link} href="/docs/privacy" size="sm">
          How that works
        </Anchor>
        .
      </Text>
    ),
  },
  {
    value: 'price',
    question: 'What does it cost?',
    answer:
      'Nothing, and there is no pricing page to visit later. Vicenda is one person’s mail client, opened to a few people. If it turns out to be useful to you, sponsoring the work is welcome and buys you nothing extra.',
  },
  {
    value: 'model',
    question: 'Does it use AI?',
    answer: (
      <Text size="sm">
        Only if you ask it to, and only on your Mac. An optional local model can build a card for a
        machine message no template covers — a download you choose in Settings, run entirely on your
        Mac, never sent anywhere. It needs an Apple silicon Mac, and Vicenda is complete without it.{' '}
        <Anchor component={Link} href="/docs/cards#senders-no-rule-knows" size="sm">
          How it is kept honest
        </Anchor>
        .
      </Text>
    ),
  },
  {
    value: 'updates',
    question: 'Does it update itself?',
    answer:
      'Yes. Vicenda checks for updates on its own and installs them when you say so, the same way FinderGit and Netfox do. You can turn the check off in Settings.',
  },
];

export function FAQ() {
  return (
    <Accordion variant="separated" radius="md">
      {faqItems.map((item) => (
        <Accordion.Item key={item.value} value={item.value}>
          <Accordion.Control>{item.question}</Accordion.Control>
          <Accordion.Panel>
            {typeof item.answer === 'string' ? <Text size="sm">{item.answer}</Text> : item.answer}
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
