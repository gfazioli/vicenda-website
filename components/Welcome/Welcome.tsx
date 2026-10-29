import { TextAnimate } from '@gfazioli/mantine-text-animate';
import { Box, Container, Stack, Title } from '@mantine/core';
import { DiscordCallToAction } from '../Discord/DiscordCallToAction';
import { FAQ } from '../FAQ/FAQ';
import { ScrollGuide } from '../Mascot/ScrollGuide';
import { Band, HomeSections } from '../Home/HomeSections';
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
      <Band id="faq" guide="faq">
        <Stack gap="lg" maw={760}>
          <Title order={2} fz={{ base: 32, sm: 42 }}>
            Frequently asked questions
          </Title>
          <FAQ />
        </Stack>
      </Band>

      {/* ---- Community: the Discord server, for what the FAQ did not answer */}
      <DiscordCallToAction />

      {/*
        The closing line. The brief's own measure of success: if it works, it
        goes quiet, and quiet is the win.
      */}
      <Container size="lg" py={{ base: 80, sm: 136 }}>
        <Title order={2} fz={{ base: 34, sm: 56 }} ta="center" lh={1.1} fs="italic">
          <TextAnimate inherit animation="fade" by="word" trigger="inView" duration={0.8}>
            A few decisions. Then quiet.
          </TextAnimate>
        </Title>
      </Container>

      {/* The envelope past the hero: in the window's corner, then on the
          footer's Support card. After the page's content, so a keyboard
          meets it last. */}
      <ScrollGuide />
    </Box>
  );
}
