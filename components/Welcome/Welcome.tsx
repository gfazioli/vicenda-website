'use client';

import { TextAnimate } from '@gfazioli/mantine-text-animate';
import { Box, Container, Stack, Title } from '@mantine/core';
import { DiscordCallToAction } from '../Discord/DiscordCallToAction';
import { FAQ } from '../FAQ/FAQ';
import { HomeSections } from '../Home/HomeSections';
import { SectionRule } from '../SectionRule/SectionRule';
import { Hero } from './Hero';

/**
 * The home page: the hero (`Hero.tsx`), the report section by section
 * (`HomeSections.tsx`), the FAQ, the community, and a closing line.
 *
 * ## Why nothing here loops
 *
 * Every motion on the page plays once: the hero's table, the reveals as a
 * section scrolls in, and the two `TextAnimate` lines (`Hero.tsx` has the two
 * lessons that animation taught: `trigger="inView"`, and `inherit`). A
 * marketing page is not an app, but it is somebody's battery, and the brand is
 * restraint.
 */
export function Welcome() {
  return (
    <Box style={{ position: 'relative' }}>
      <Hero />

      <HomeSections />

      <SectionRule />

      {/*
        The questions a visitor would otherwise leave to go and ask, on the
        page they are deciding on (user, 2026-09-23: the siblings end on their
        FAQ and this one did not). The same component and list as /docs/faq,
        so the two cannot disagree; the FAQPage JSON-LD stays on that page
        alone, where Google expects one. Before the closing line, so the page
        still ends on it.
      */}
      <Container
        id="faq"
        size="lg"
        py={{ base: 72, sm: 112 }}
        style={{ scrollMarginTop: 'calc(var(--vic-bar-height, 48px) + 8px)' }}
      >
        <Stack gap="lg" maw={760}>
          <Title order={2} fz={{ base: 32, sm: 42 }} fw={400}>
            <span className="display">Frequently asked questions</span>
          </Title>
          <FAQ />
        </Stack>
      </Container>

      {/* ---- Community: the Discord server, for what the FAQ did not answer */}
      <DiscordCallToAction />

      {/*
        The closing line. The brief's own measure of success: if it works, it
        goes quiet, and quiet is the win.
      */}
      <Container size="lg" py={{ base: 80, sm: 136 }}>
        <Title order={2} fz={{ base: 34, sm: 56 }} fw={400} ta="center" lh={1.1}>
          <span className="display" style={{ fontStyle: 'italic' }}>
            <TextAnimate inherit animation="fade" by="word" trigger="inView" duration={0.8}>
              A few decisions. Then quiet.
            </TextAnimate>
          </span>
        </Title>
      </Container>
    </Box>
  );
}
