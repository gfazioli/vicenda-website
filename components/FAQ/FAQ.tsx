'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import {
  IconDeviceDesktop,
  IconGift,
  IconInfoCircle,
  IconShieldLock,
  type Icon,
} from '@tabler/icons-react';
import { Accordion, Anchor, Text } from '@mantine/core';
import { discordLinkProps } from '@/components/Discord/discord';
import classes from './FAQ.module.css';

/**
 * The visible FAQ.
 *
 * **Keep this in step with `FAQ_ENTRIES` in `StructuredData.tsx`.** Google
 * requires the FAQ schema to mirror the answers on the page word for word, so
 * the two are a pair: change one and the other is wrong, and the wrong one is
 * the invisible one.
 *
 * Every answer describes what the app's code does TODAY (Vicenda,
 * feat/report-core), with the file it rests on noted beside it. What is not
 * built yet is said as not built: a reader would otherwise assume it.
 */
export const faqItems: { value: string; question: string; answer: ReactNode }[] = [
  {
    value: 'what',
    question: 'What is Vicenda?',
    // The brief's thesis; the four sections are `MorningReportView`'s.
    answer:
      'A Mac app that turns a morning of mail into a few decisions. It reads every account you give it, sorts the mail by kind with rules it learns as you go, and lays the morning out as one report: what needs you, what can be read in a line, what is new, and what is already decided.',
  },
  {
    value: 'client',
    question: 'Does it replace my mail app?',
    // No composer and no sending anywhere in the app; a clicked mail address
    // in a message opens in another app (`MessageWebView.swift`).
    answer:
      'No. It reads and sorts your mail, but it does not write or send any, and it is not trying to replace the app you reply in. Keep that app for the rare message that needs an answer: a mail address you click in a message opens there.',
  },
  {
    value: 'download',
    question: 'How do I get it?',
    // No link until the next version (owner, 2026-10-29).
    answer:
      'Vicenda is free, for macOS, with no App Store listing and no account to create. The next version is being rebuilt from the ground up, and the download comes back when it is ready.',
  },
  {
    value: 'accounts',
    question: 'Which accounts can it read?',
    // `ImapConnection.swift` (TLS, port 993; plain 143 refused), Gmail's app
    // password and 2-Step Verification in `OnboardingView.swift`.
    answer:
      'Any mailbox that speaks IMAP over an encrypted connection, Gmail included: Gmail needs an app password, which Google lets you make once 2-Step Verification is on. Every account lands in the same report, each with its own colour and monogram.',
  },
  {
    value: 'privacy',
    question: 'Does my mail leave my Mac?',
    // No server, telemetry or cloud AI in the code; `ResourceBlocker.swift`
    // blocks every remote resource in a message.
    answer: (
      <Text size="sm">
        No. It comes from your provider straight to your Mac and stays there: Vicenda runs no
        server, sends no telemetry, and its model works on the device. Opening a message loads
        nothing from the internet, because every remote image and tracker in it is blocked.{' '}
        <Anchor component={Link} href="/docs/privacy" size="sm">
          The privacy policy
        </Anchor>
        .
      </Text>
    ),
  },
  {
    value: 'mac',
    question: 'Which Mac do I need?',
    // `MACOSX_DEPLOYMENT_TARGET = 15.0`; `ModelCatalog.swift`: Apple
    // Intelligence on macOS 26, or a download of 2,263,022,529 bytes (16 GB
    // of memory) or 868,628,559 bytes (8 GB); MLX needs Apple silicon.
    answer:
      'macOS 15 or later, on Apple silicon, which the model needs. On macOS 26 Vicenda can use Apple Intelligence, with nothing to download. Otherwise you download a model once, from Settings: 2.3 GB for a Mac with 16 GB of memory, or 0.9 GB for one with 8 GB.',
  },
  {
    value: 'bin',
    question: 'What happens to mail I bin?',
    // `reportDecisionsTravel` is false for every account (`Overview.swift`):
    // a decision is a row in this Mac's store until delivery is built.
    answer:
      'Today, binning is a decision recorded in Vicenda, on your Mac: the mail leaves the report, and your mailbox on the server stays as it is. Carrying decisions to the server comes next, and there a binned mail will go to your provider’s Trash, not be deleted.',
  },
  {
    value: 'reply',
    question: 'Can I reply, or write a new mail?',
    answer:
      'Not in Vicenda: it has no composer and sends nothing. Fewer than one message a day needs an answer, so reply in the mail app you already use.',
  },
  {
    value: 'price',
    question: 'What does it cost?',
    answer:
      'Nothing, and there is no pricing page to visit later: Vicenda is a personal project. If it is useful to you, sponsoring the work is welcome and buys you nothing extra.',
  },
  {
    value: 'maker',
    question: 'Who makes it? Is it open source?',
    // `config.legal`; the app's repository is private, this site's is MIT.
    answer:
      'One person: Giovambattista Fazioli, who publishes as Undolog. The app is free but its source is not public; the source of this website is.',
  },
  {
    value: 'updates',
    question: 'Does it update itself?',
    // Automatic checks on by default, a switch in Settings (`SettingsView.swift`).
    answer:
      'Yes. Vicenda checks for updates on its own and installs them when you say so. You can turn the check off in Settings.',
  },
  {
    value: 'community',
    question: 'Is there a Vicenda community?',
    answer: (
      <Text size="sm">
        Yes, on{' '}
        <Anchor {...discordLinkProps} size="sm">
          Discord
        </Anchor>
        , where Vicenda and its sibling apps live: get help, suggest features, vote on what comes
        next and talk directly with the maker.
      </Text>
    ),
  },
];

/*
 * A small icon on the questions a visitor most likely came with (user,
 * 2026-09-23: on the most important ones, not on every one). Keyed by the
 * item's `value`, so the list the JSON-LD mirrors stays exactly as it is.
 */
const faqIcons: Partial<Record<string, Icon>> = {
  what: IconInfoCircle,
  privacy: IconShieldLock,
  mac: IconDeviceDesktop,
  price: IconGift,
};

export function FAQ() {
  return (
    <Accordion
      variant="separated"
      radius="md"
      classNames={{ root: classes.root, item: classes.item }}
      // Mantine 9 keeps a closed panel in a React <Activity>, which renders
      // nothing on the server: the served markup carried the 9 questions and
      // not one answer (only the JSON-LD mirror had them), and Google left
      // pages of the sibling sites "Crawled - currently not indexed"
      // (2026-09-24). `display-none` renders every answer and only hides it.
      keepMountedMode="display-none"
    >
      {faqItems.map((item) => {
        const ItemIcon = faqIcons[item.value];
        return (
          <Accordion.Item key={item.value} value={item.value}>
            <Accordion.Control
              icon={
                ItemIcon && (
                  <span className={classes.icon} aria-hidden>
                    <ItemIcon size={16} stroke={1.8} />
                  </span>
                )
              }
            >
              {item.question}
            </Accordion.Control>
            <Accordion.Panel>
              {typeof item.answer === 'string' ? <Text size="sm">{item.answer}</Text> : item.answer}
            </Accordion.Panel>
          </Accordion.Item>
        );
      })}
    </Accordion>
  );
}
