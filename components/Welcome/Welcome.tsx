'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Reflection } from '@gfazioli/mantine-reflection';
import { Scene } from '@gfazioli/mantine-scene';
import { TextAnimate } from '@gfazioli/mantine-text-animate';
import {
  IconCards,
  IconDownload,
  IconEyeOff,
  IconMessages,
  IconPalette,
} from '@tabler/icons-react';
import {
  Badge,
  Box,
  Button,
  Container,
  Grid,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { Shot } from './Shot';
import config from '@/config';
import { ACCOUNT_RING } from '@/theme';

/**
 * The home page.
 *
 * ## The thesis, and why it is this one
 *
 * Every mail client's pitch is that it sorts better. Vicenda's difference sits
 * upstream of sorting: **it stops treating mail as a list**. Machines become
 * channels, people become threads, and a recognised machine message is drawn as
 * a card instead of rendered as somebody's HTML. That is a claim about SHAPE,
 * which is the only kind a reader can check in one screenshot — and it is true
 * of the app today rather than aspirational.
 *
 * ## Why nothing here loops
 *
 * Every `Scene` layer is mounted with `animate={false}` and both `TextAnimate`
 * calls are single-pass.
 *
 * **`trigger="mount"` does not fire** — measured, not assumed: the headline
 * rendered its words at opacity zero and stayed there, so the most important
 * line on the page was invisible while `curl` happily showed it in the markup.
 * `inView` fires immediately for anything above the fold and works. (The
 * second bug hiding behind the first: `TextAnimate` is a Mantine `Text`
 * underneath, so without `inherit` it applies Text's own default size and
 * silently overrides the `Title` around it — a 76px headline drawn at 14px.) The app's brief forbids perpetual
 * animation because it pins a core keeping the compositor committing every
 * frame; a marketing page is not an app, but it is somebody's battery, and the
 * brand is restraint. `Scene` also honours `reducedMotion`.
 *
 * The one layer with a technical rather than aesthetic reason is `SceneNoise`:
 * a wide dark radial gradient **bands** on an 8-bit display, and grain is the
 * standard fix. It is at 3% and doing real work.
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

export function Welcome() {
  return (
    <Box style={{ position: 'relative' }}>
      {/*
        THE GROUND, scoped to the hero rather than fullscreen.

        `fullscreen` would put the scene at `z-index: -1` under a body that
        `theme/global.css` paints opaque in dark mode, and under whatever
        backgrounds Nextra's layout wrappers carry — a stack this file does not
        own and cannot check from here. Mounted inside a `position: relative`
        section it fills that section and nothing else, which is the same
        picture with none of the argument.

        Three static layers: a radial wash in the icon's own blue, a soft glow
        behind the mark, and grain over both. The gradient is anchored where
        the icon sits so the light appears to come off it.
      */}
      <Box style={{ position: 'relative', overflow: 'hidden' }}>
        <Scene reducedMotion="auto">
          <Scene.Gradient
            type="radial"
            position="72% 12%"
            from="vicenda.6"
            to="dark.9"
            fromOpacity={0.38}
            toOpacity={0}
            animate={false}
          />
          <Scene.Glow
            color="vicenda"
            shade={5}
            top="4%"
            left="64%"
            size={640}
            blur={180}
            opacity={0.22}
            animate={false}
          />
          {/*
            NOT decoration. A wide dark radial gradient BANDS on an 8-bit
            display; grain is the standard fix, and 3% is enough to break the
            steps without reading as texture.
          */}
          <Scene.Noise opacity={0.03} grain={0.8} octaves={2} />
        </Scene>

        {/* ---- Hero ---------------------------------------------------- */}
        <Container size="lg" py={{ base: 56, sm: 104 }} style={{ position: 'relative' }}>
          <Grid gap={{ base: 40, md: 64 }} align="center">
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Stack gap="xl">
                <Group gap="xs">
                  <Badge variant="light" radius="sm" size="sm">
                    Free
                  </Badge>
                  <Text size="sm" c="dimmed">
                    macOS {config.app.minMacOS} or later · signed and notarised
                  </Text>
                </Group>

                <Title order={1} fz={{ base: 44, sm: 76 }} fw={400} lh={1.02}>
                  <span className="display-hero">
                    {/*
                    One pass on mount, by word. `loop` exists and is not used:
                    a headline that keeps re-animating is a headline you cannot
                    finish reading.
                  */}
                    {/*
                    `inherit` is load-bearing. TextAnimate is a Mantine `Text`
                    underneath, so without it the component applies Text's own
                    default size and SILENTLY overrides the Title around it —
                    a 76px headline rendered at 14px, which on a dark ground
                    read as no headline at all.
                  */}
                    <TextAnimate
                      inherit
                      animation="blurUp"
                      by="word"
                      trigger="inView"
                      duration={0.7}
                    >
                      Your mail is not a list.
                    </TextAnimate>
                  </span>
                </Title>

                <Text fz={{ base: 18, sm: 21 }} c="dimmed" maw={560} lh={1.55}>
                  Vicenda is a Mac mail client shaped like a conversation. The machines that write
                  to you get channels. The people get threads. Nothing ever leaves your Mac.
                </Text>

                <Group gap="sm" mt="xs">
                  <Button
                    component="a"
                    href="/download"
                    size="md"
                    radius="xl"
                    leftSection={<IconDownload size={16} />}
                  >
                    Download for macOS
                  </Button>
                  <Button component={Link} href="/docs" size="md" radius="xl" variant="default">
                    See how it works
                  </Button>
                </Group>

                {/*
                THE ACCOUNT RING, the app's own and nobody else's: eight hues at
                one lightness, 45° apart on an OKLCH circle. The site opens with
                it rather than with a logo, because it is the single graphic
                device the product already has.
              */}
                <Stack gap={6} mt="md">
                  <Group gap={6} aria-hidden>
                    {ACCOUNT_RING.map((hue) => (
                      <Box key={hue} w={26} h={4} style={{ background: hue, borderRadius: 2 }} />
                    ))}
                  </Group>
                  <Text size="xs" c="dimmed">
                    One hue per mailbox. Seven accounts, one glance.
                  </Text>
                </Stack>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 5 }}>
              {/*
              The mark at its full 512, with a reflection under it. An app icon
              standing on a dark plane is the most honest hero image a Mac app
              has: it is the thing you will actually see in the Dock.
            */}
              {/*
              `isolation: isolate` is load-bearing, not tidiness. The reflected
              copy is painted at `z-index: -2`, so without a stacking context
              of its own here it goes BEHIND the Scene layers underneath and
              disappears — the icon simply floats. Isolating clamps that -2 to
              this box, which puts it above the ground and below the icon.
            */}
              <Box
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  // The root only ever needs to be as tall as the icon.
                  // (This was tried as the fix for the detached reflection and
                  // was NOT it — measurement showed the root already hugging the
                  // image at 235px. Kept because it is correct, not because it
                  // solved anything.)
                  alignItems: 'flex-start',
                  position: 'relative',
                  isolation: 'isolate',
                }}
              >
                {/*
                MEASURED, after three wrong answers — the baseline gap, the
                flex stretch, and the transform origin.
                
                The copy sits at `top: 100%` and is transformed
                `scaleY(-1) scaleY(stretch)`. Flipping about the DEFAULT centre
                origin maps the box onto itself, so any stretch below 1 shrinks
                it toward its middle and the mirror detaches by half the height
                it lost — 48 points on a 235px icon at 0.55. Moving the origin
                to the top does not fix it: the flip then goes UPWARD over the
                icon (measured: 146 points of overlap). No origin gives
                "flush below and squashed", because the squash is the gap.
                
                So it does not squash. A full-height mirror, faded by the mask
                and held down by opacity, which is what a reflection on a dark
                plane looks like anyway.
              */}
                <Reflection
                  reflectionDistance={0}
                  reflectionStretch={1}
                  reflectionOpacity={0.1}
                  reflectionBlur={9}
                  reflectionStart={0}
                  reflectionEnd={45}
                  shadow={false}
                  disableChildren
                >
                  <Image
                    src="/icon-512x512.png"
                    alt="The Vicenda app icon"
                    width={512}
                    height={512}
                    priority
                    sizes="(max-width: 62em) 60vw, 380px"
                    // `block`, so the inline baseline adds no descender gap
                    // of its own under the image.
                    style={{ display: 'block', width: '100%', maxWidth: 380, height: 'auto' }}
                  />
                </Reflection>
              </Box>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>

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
      <Container size="lg" py={{ base: 24, sm: 40 }}>
        <Stack gap={10}>
          <Shot
            src="/screenshot-today.png"
            width={2880}
            height={1400}
            alt="Today: who is waiting on a reply, then what is unread, each row carrying the hue of the mailbox it landed in"
            priority
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
          <Stack gap={10}>
            <Shot
              src="/screenshot-channels.png"
              width={800}
              height={1420}
              alt="The column: machine senders listed as channels, each with the address that tells two of one brand apart"
            />
            <Text size="xs" c="dimmed">
              Machines become channels. People become conversations. The column says which is which
              before you read a word.
            </Text>
          </Stack>
          <Stack gap={10}>
            <Shot
              src="/screenshot-cards.png"
              width={1060}
              height={280}
              alt="A security advisory rendered as a card: the package, the severity and the advisory number as named fields"
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
            If that sounds like your inbox too, it is a free download and it needs nothing from you
            — no account, no sign-up. It updates itself when there is a build worth your time, and
            you can turn that off.
          </Text>
          <Group mt="sm">
            <Button
              component="a"
              href="/download"
              size="md"
              radius="xl"
              leftSection={<IconDownload size={16} />}
            >
              Download for macOS
            </Button>
          </Group>
        </Stack>
      </Container>

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
