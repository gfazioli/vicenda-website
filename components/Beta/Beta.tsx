'use client';

import Link from 'next/link';
import { Anchor, Button, Container, List, Stack, Text, Title } from '@mantine/core';
import config from '@/config';

/**
 * The beta gate.
 *
 * **The mechanism is not decided yet**, and this is written so it can be honest
 * before it is: a `mailto:` needs nothing to exist, works today, and puts the
 * address only where it would end up anyway — the owner's mailbox. When the
 * decision lands (Substack, Tally, or a route that keeps its own list), only
 * `config.beta` and this file change.
 *
 * What it must never become is a form that looks like it collects and does not.
 * This project shipped a reader whose links were dead once; the rule that came
 * out of it is that a control which looks live and quietly does nothing is
 * worse than an absent one.
 *
 * A CLIENT component, like `Welcome`, because the page above it needs to export
 * `metadata` and a server component may not hand a function — `component={Link}`
 * — across to Mantine.
 */
export function Beta() {
  const subject = encodeURIComponent('Vicenda beta');
  const body = encodeURIComponent(
    "Hi — I'd like to try Vicenda.\n\nWhat I use today:\nHow many mailboxes:\n"
  );

  return (
    <Container size="sm" py={{ base: 60, sm: 100 }}>
      <Stack gap="lg">
        <Title order={1} fz={{ base: 34, sm: 46 }} fw={400}>
          <span className="display">Ask for an invite.</span>
        </Title>

        <Text c="dimmed" fz={18} lh={1.6}>
          Vicenda is not on sale and not on the App Store. The disk image goes out by hand, to
          people who write and say they want it.
        </Text>

        <Text c="dimmed" fz={16} lh={1.6}>
          Worth knowing before you ask:
        </Text>
        <List spacing="xs" c="dimmed" fz={16}>
          <List.Item>It needs macOS {config.app.minMacOS} or later.</List.Item>
          <List.Item>
            It reads Gmail and IMAP. It is a reading and triage tool first — composing is secondary,
            and sending is not built yet.
          </List.Item>
          <List.Item>
            It is one person&apos;s app. There is no support desk, and there is no promise about how
            fast anything gets fixed.
          </List.Item>
          <List.Item>Your address is used to send you builds. It goes nowhere else.</List.Item>
        </List>

        <Button
          component="a"
          href={`mailto:${config.beta.inviteEmail}?subject=${subject}&body=${body}`}
          size="md"
          radius="xl"
          maw={260}
        >
          Write and ask
        </Button>

        <Text size="sm" c="dimmed">
          Or read{' '}
          <Anchor component={Link} href="/docs">
            what it actually does
          </Anchor>{' '}
          first.
        </Text>
      </Stack>
    </Container>
  );
}
