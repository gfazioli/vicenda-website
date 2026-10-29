'use client';

import { TextAnimate } from '@gfazioli/mantine-text-animate';
import { IconCards, IconEyeOff, IconMessages, IconPalette } from '@tabler/icons-react';
import { Box, Container, SimpleGrid, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { DiscordCallToAction } from '../Discord/DiscordCallToAction';
import { FAQ } from '../FAQ/FAQ';
import { Hero } from './Hero';
import { Shot } from './Shot';
import { ACCOUNT_RING } from '@/theme';

/**
 * The home page.
 *
 * The hero is `Hero.tsx`, written for the morning report. Everything under
 * it still describes the mail client, and is rewritten section by section in
 * the next steps of #43.
 *
 * ## Why nothing here loops
 *
 * The closing line's `TextAnimate` is single-pass, as the hero's headline is
 * (`Hero.tsx` has the two lessons that animation taught: `trigger="inView"`,
 * and `inherit`). A marketing page is not an app, but it is somebody's
 * battery, and the brand is restraint.
 */

const PILLARS = [
  {
    icon: IconMessages,
    title: 'Machines get channels. People get threads.',
    body: 'They are not the same kind of mail and never were. A sender that writes to you every day about deployments is a place you visit; a person waiting on an answer is a debt you owe. One belongs in a stream you scan, the other in a list that empties.',
  },
  {
    icon: IconCards,
    title: 'A machine message is not a web page.',
    body: 'An invoice has an amount, a card, an item and an order number. Vicenda binds those and draws them. If it cannot bind a field it draws no card at all — a half-filled card looks authoritative, which is worse than none.',
  },
  {
    icon: IconPalette,
    title: 'Colour means one thing: which mailbox.',
    body: 'Eight hues at a single lightness and chroma, so none shouts louder than another. Nothing else in the app is allowed to spend colour — not priority, not category. That is what turns “which account is this?” into a glance.',
  },
  {
    icon: IconEyeOff,
    title: 'Nothing leaves your Mac.',
    body: 'No server, ever — not for sync, not for search, not for the clever parts. And a message cannot phone home while you read it: every remote resource is blocked before the first pixel, so opening your mail does not tell the sender you opened it.',
  },
];

/**
 * The two screenshots side by side are each half the `lg` container from `md`
 * up (538px at 1440), and the full column below it. Shot's default `sizes`
 * describes a full-width image, so these fetched more than twice the width
 * they draw.
 */
const HALF = '(max-width: 62em) 100vw, 540px';

export function Welcome() {
  return (
    <Box style={{ position: 'relative' }}>
      {/* ---- Hero: the claim, and the sorting table -------------------- */}
      <Hero />

      {/* ---- What it looks like -------------------------------------- */}
      {/*
        THE SCREENSHOT COMES BEFORE THE ARGUMENT, and that is the point of the
        product: the difference is checkable in one image. Every mail client
        claims it sorts better and none of them can show you the claim.

        Every one of these is shot with the app's Demo Mode on — the names,
        addresses, labels and card fields are invented and stable, and the
        shapes are real. See `scripts/uiverify` in the workspace and the
        Demo Mode notes in the app.
      */}
      {/*
        `how-it-works` is the hero's button and the bar's second menu. It sits
        here, on the first section under the hero, until the rewrite (#43)
        brings the section of its own.
      */}
      <Container
        id="how-it-works"
        size="lg"
        py={{ base: 24, sm: 40 }}
        style={{ scrollMarginTop: 64 }}
      >
        <Stack gap={10}>
          <Shot
            src="/screenshot-today.png"
            width={2000}
            height={1310}
            alt="Today: who is waiting on a reply, then what is unread, each row carrying the hue of the mailbox it landed in"
          />
          <Text size="xs" c="dimmed" ta="center">
            Today — what is waiting on you, before anything else asks for your attention.
          </Text>
        </Stack>
      </Container>

      {/* ---- The problem --------------------------------------------- */}
      <Container size="lg" py={{ base: 40, sm: 70 }}>
        <Stack gap="md" maw={720}>
          <Title order={2} fz={{ base: 28, sm: 38 }} fw={500}>
            <span className="display">
              Seven mailboxes. One column. Every message the same size.
            </span>
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
          {PILLARS.map(({ icon: Icon, title, body }, i) => (
            <Stack key={title} gap="sm">
              {/*
                The icon takes the account hue at its own index — the ring
                doing a second job rather than a new palette appearing. It is
                decoration here and says so: the tiles carry no meaning the
                text does not already carry.
              */}
              <ThemeIcon
                size={40}
                radius="md"
                variant="light"
                style={{ background: `${ACCOUNT_RING[i * 2]}1F`, color: ACCOUNT_RING[i * 2] }}
              >
                <Icon size={22} stroke={1.6} />
              </ThemeIcon>
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

      {/* ---- The two halves, side by side ---------------------------- */}
      <Container size="lg" py={{ base: 24, sm: 48 }}>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={{ base: 24, md: 32 }}>
          {/*
            Two WHOLE windows at one size. These were two hand-cropped
            fragments — a column 800x1420 tall beside a card 1060x280 short —
            and in a two-column grid they could not line up. Every image on
            this site now comes out of `scripts/screenshots/shoot.sh` in the
            app repo at the same 2000px, so the grid needs no framing.
          */}
          <Stack gap={10}>
            <Shot
              src="/screenshot-channels.png"
              width={2000}
              height={1310}
              sizes={HALF}
              alt="The column with machine senders listed as channels under a hash, and one of them open as a stream beside it"
            />
            <Text size="xs" c="dimmed">
              Machines become channels. People become conversations. The column says which is which
              before you read a word.
            </Text>
          </Stack>
          <Stack gap={10}>
            <Shot
              src="/screenshot-cards.png"
              width={2000}
              height={1310}
              sizes={HALF}
              alt="The inbox as a stream: machine mail collapsed to its first lines, and one message drawn as a card with named fields"
            />
            <Text size="xs" c="dimmed">
              A recognised machine message is drawn as a card — named fields you can read at a
              glance — instead of rendered as somebody&apos;s HTML.
            </Text>
          </Stack>
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
            telemetry, and no roadmap it owes anybody.
          </Text>
          <Text c="dimmed" fz={{ base: 16, sm: 18 }} lh={1.6}>
            The next version is being rebuilt from the ground up, and it will be a free download
            again when it is ready.
          </Text>
        </Stack>
      </Container>

      {/* ---- FAQ ----------------------------------------------------- */}
      {/*
        The questions a visitor would otherwise leave to go and ask, on the
        page they are deciding on (user, 2026-09-23: the siblings end on their
        FAQ and this one did not). The same component and list as /docs/faq,
        so the two cannot disagree; the FAQPage JSON-LD stays on that page
        alone, where Google expects one. Before the closing line, so the page
        still ends on it.
      */}
      <Container id="faq" size="lg" py={{ base: 40, sm: 70 }} style={{ scrollMarginTop: 64 }}>
        <Stack gap="lg" maw={760}>
          <Title order={2} fz={{ base: 28, sm: 38 }} fw={500}>
            <span className="display">Frequently asked questions</span>
          </Title>
          <FAQ />
        </Stack>
      </Container>

      {/* ---- Community: the Discord server, for what the FAQ did not answer */}
      <DiscordCallToAction />

      {/* ---- The closing line ---------------------------------------- */}
      <Container size="lg" py={{ base: 70, sm: 120 }}>
        <Title order={2} fz={{ base: 34, sm: 56 }} fw={400} ta="center" lh={1.1}>
          <span className="display" style={{ fontStyle: 'italic' }}>
            <TextAnimate inherit animation="fade" by="word" trigger="inView" duration={0.8}>
              See your mail different.
            </TextAnimate>
          </span>
        </Title>
      </Container>
    </Box>
  );
}
