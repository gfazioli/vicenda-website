'use client';

import Link from 'next/link';
import {
  IconArrowRight,
  IconCards,
  IconEyeOff,
  IconMessages,
  IconPalette,
} from '@tabler/icons-react';
import { Badge, Box, Button, Container, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import config from '@/config';
import { ACCOUNT_RING } from '@/theme';

/**
 * The home page.
 *
 * ## The thesis, and why it is this one
 *
 * Every mail client's pitch is that it sorts better. Vicenda's difference is
 * upstream of sorting: **it stops treating mail as a list**. The machines that
 * write to you become channels, the people become threads, and a recognised
 * machine message is drawn as a card rather than rendered as somebody's HTML.
 * That is a claim about SHAPE, which is the only kind a reader can check in one
 * screenshot — and it is true of the app rather than aspirational, which is the
 * rule this workspace has for marketing copy.
 *
 * ## The one borrowing
 *
 * The closing line echoes *Think Different*. The homage stops at the words: the
 * campaign's face is Apple Garamond, which is Apple's own and not licensable,
 * so this is EB Garamond — the same lineage, legitimately. See `app/layout.tsx`.
 *
 * ## What is deliberately not here
 *
 * No feature grid, no counters, no "trusted by". The app has one user and the
 * beta is closed; a page dressed as a launch would be the first thing on it
 * that is not true.
 */

const PILLARS = [
  {
    icon: IconMessages,
    title: 'Machines get channels. People get threads.',
    body: 'They are not the same kind of mail and they never were. A sender that writes to you every day about deployments is a place you visit; a person waiting on an answer is a debt you owe. One belongs in a stream you scan, the other in a list that empties.',
  },
  {
    icon: IconCards,
    title: 'A machine message is not a web page.',
    body: 'An invoice has an amount, a card, an item and an order number. Vicenda binds those and draws them. If it cannot bind a field it draws no card at all — a half-filled card looks authoritative, which is worse than none.',
  },
  {
    icon: IconPalette,
    title: 'Colour means one thing: which mailbox.',
    body: 'Eight hues at a single lightness and chroma, so none of them shouts louder than another. Nothing else in the app is allowed to spend colour — not priority, not category. That is what turns “which account is this?” into a glance.',
  },
  {
    icon: IconEyeOff,
    title: 'Nothing leaves your Mac.',
    body: 'No server, ever — not for sync, not for search, not for the clever parts. And a message cannot phone home while you read it: every remote resource is blocked before the first pixel, so opening your mail does not tell the sender you opened it.',
  },
];

export function Welcome() {
  return (
    <Box>
      {/* ---- Hero ---------------------------------------------------- */}
      <Container size="lg" py={{ base: 60, sm: 110 }}>
        <Stack gap="xl" maw={860}>
          <Group gap="xs">
            <Badge variant="light" radius="sm" size="sm">
              Closed beta
            </Badge>
            <Text size="sm" c="dimmed">
              macOS {config.app.minMacOS} or later
            </Text>
          </Group>

          <Title order={1} fz={{ base: 46, sm: 82 }} fw={400} lh={1.02}>
            <span className="display-hero">Your mail is not a list.</span>
          </Title>

          <Text fz={{ base: 18, sm: 21 }} c="dimmed" maw={640} lh={1.55}>
            Vicenda is a Mac mail client shaped like a conversation. The machines that write to you
            get channels. The people get threads. Nothing ever leaves your Mac.
          </Text>

          <Group gap="sm" mt="xs">
            <Button component={Link} href="/beta" size="md" radius="xl" rightSection={<IconArrowRight size={16} />}>
              Ask for an invite
            </Button>
            <Button component={Link} href="/docs" size="md" radius="xl" variant="default">
              See how it works
            </Button>
          </Group>

          {/*
            THE ACCOUNT RING, which is the app's own and nobody else's: eight
            hues at one lightness, 45° apart on an OKLCH circle. It is the
            product's single graphic device, so the site opens with it rather
            than with a logo.
          */}
          <Group gap={6} mt="lg" aria-hidden>
            {ACCOUNT_RING.map((hue) => (
              <Box key={hue} w={26} h={4} style={{ background: hue, borderRadius: 2 }} />
            ))}
          </Group>
          <Text size="xs" c="dimmed" mt={-8}>
            One hue per mailbox. Seven accounts, one glance.
          </Text>
        </Stack>
      </Container>

      {/* ---- The problem --------------------------------------------- */}
      <Container size="lg" py={{ base: 40, sm: 70 }}>
        <Stack gap="md" maw={720}>
          <Title order={2} fz={{ base: 28, sm: 38 }} fw={500}>
            <span className="display">Seven mailboxes. One column. Every message the same size.</span>
          </Title>
          <Text c="dimmed" fz={{ base: 16, sm: 18 }} lh={1.6}>
            A receipt, a security advisory and a colleague waiting on an answer arrive in the same
            column, in the same font, at the same weight. Sorting them is the job every client has
            been doing since 1995, and it stopped being enough somewhere around the fortieth
            newsletter.
          </Text>
          <Text c="dimmed" fz={{ base: 16, sm: 18 }} lh={1.6}>
            Vicenda does something upstream of sorting: it stops pretending those are the same kind
            of thing.
          </Text>
        </Stack>
      </Container>

      {/* ---- The four claims ----------------------------------------- */}
      <Container size="lg" py={{ base: 40, sm: 60 }}>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={{ base: 32, sm: 48 }}>
          {PILLARS.map(({ icon: Icon, title, body }) => (
            <Stack key={title} gap="sm">
              <Icon size={22} stroke={1.6} />
              <Title order={3} fz={{ base: 19, sm: 22 }} fw={600} lh={1.3}>
                {title}
              </Title>
              <Text c="dimmed" fz={16} lh={1.6}>
                {body}
              </Text>
            </Stack>
          ))}
        </SimpleGrid>
      </Container>

      {/* ---- The honest paragraph ------------------------------------ */}
      <Container size="lg" py={{ base: 40, sm: 70 }}>
        <Stack gap="md" maw={720}>
          <Title order={2} fz={{ base: 26, sm: 34 }} fw={500}>
            <span className="display">It is one person&apos;s mail client.</span>
          </Title>
          <Text c="dimmed" fz={{ base: 16, sm: 18 }} lh={1.6}>
            Vicenda exists because seven mailboxes across Gmail, a PEC and a work account had no
            client that could show me which one a message had landed in. It has no pricing, no
            telemetry, and no roadmap it owes anybody. The beta is closed because the honest size of
            this is small.
          </Text>
          <Text c="dimmed" fz={{ base: 16, sm: 18 }} lh={1.6}>
            If that sounds like your inbox too, leave an address and I will send you the disk image.
            No list, no drip, no launch — an email when there is a build worth your time.
          </Text>
          <Group mt="sm">
            <Button component={Link} href="/beta" size="md" radius="xl" rightSection={<IconArrowRight size={16} />}>
              Ask for an invite
            </Button>
          </Group>
        </Stack>
      </Container>

      {/* ---- The closing line ---------------------------------------- */}
      <Container size="lg" py={{ base: 70, sm: 120 }}>
        <Title order={2} fz={{ base: 34, sm: 56 }} fw={400} ta="center" lh={1.1}>
          <span className="display" style={{ fontStyle: 'italic' }}>
            See your mail different.
          </span>
        </Title>
      </Container>
    </Box>
  );
}
