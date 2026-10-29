'use client';

import { Scene } from '@gfazioli/mantine-scene';
import { TextAnimate } from '@gfazioli/mantine-text-animate';
import { IconArrowDown } from '@tabler/icons-react';
import { Button, Container, Text, Title } from '@mantine/core';
import { SortingTable } from '../SortingTable/SortingTable';
import config from '@/config';
import classes from './Hero.module.css';

/**
 * The OS floor as people say it: `15.0` in the config, "macOS 15" on the page.
 * Read from the config, which the app's `release.sh` writes, so the line can
 * never disagree with the JSON-LD or the docs.
 */
const floor = config.app.minMacOS.replace(/\.0$/, '');

/**
 * The hero: the claim on the left, the product on the right.
 *
 * ## The claim
 *
 * From the app's brief: Vicenda turns a morning of mail into a few decisions,
 * and its success condition is that its owner stops noticing his email. The
 * headline is that condition, offered to the reader; the lede says how in the
 * three facts that make it true (it sorts by kind, it learns the rules as you
 * go, it runs on your Mac). The picture beside it shows the decisions being
 * made, so the claim is checkable on the first screen.
 *
 * ## The meta line
 *
 * "Apple silicon", not "Universal": the bundle is Universal, but the model is
 * mandatory now and both of its engines need Apple silicon (Apple's on macOS
 * 26 and later, or a downloaded one through Metal). On an Intel Mac the
 * model's pane says local models need Apple silicon, so the honest
 * requirement is the chip (#43, "Facts to verify").
 *
 * No download, and no release strip under the button (owner, 2026-10-29): the
 * strip told how recently and how often the OLD app shipped, and its "What's
 * new" led to that app's notes. `ReleaseCadence` stays in the codebase for the
 * day the download comes back.
 *
 * ## The headline's animation
 *
 * One pass, by word. **`trigger="mount"` does not fire**, measured, not
 * assumed: the headline rendered its words at opacity zero and stayed there,
 * so the most important line on the page was invisible while `curl` happily
 * showed it in the markup. `inView` fires immediately for anything above the
 * fold and works. And `inherit` is load-bearing: TextAnimate is a Mantine
 * `Text` underneath, so without it the component applies Text's own default
 * size and SILENTLY overrides the Title around it -- a 76px headline drawn at
 * 14px, which on a dark ground read as no headline at all.
 *
 * ## The ground
 *
 * The app's night (`Palette.Logo.ground(dark: true)` and `nightLights`): the
 * three navy stops along the diagonal, and two cobalt lights fading linearly to
 * their radius, one behind the table and one under the copy. It runs from the
 * very top of the page, behind the product bar (the negative margin in the
 * stylesheet), and dissolves into the page's own navy at its foot. The grain
 * is not decoration: a wide dark gradient BANDS on an 8-bit display, and 3% of
 * noise breaks the steps without reading as texture. `Scene` honours Reduce
 * Motion, and its one layer here does not move.
 */
export function Hero() {
  return (
    <section id="overview" className={classes.hero} aria-labelledby="hero-title">
      <Scene reducedMotion="auto">
        <Scene.Noise opacity={0.03} grain={0.8} octaves={2} />
      </Scene>

      <Container size="xl" className={classes.inner}>
        <div className={classes.grid}>
          <div className={classes.copy}>
            {/*
              ONE TEMPLATE LITERAL, not JSX text with interpolations: the
              sibling sites shipped a missing space for months where an
              interpolation met a following separator across a wrapped JSX
              chunk, and the idiomatic {' '} fix does not survive oxfmt.
            */}
            <Text className={classes.meta}>{`Free · macOS ${floor} or later · Apple silicon`}</Text>

            <Title order={1} id="hero-title" fz={{ base: 44, sm: 64, xl: 76 }} lh={1.02}>
              <span className="display-hero">
                <TextAnimate inherit animation="blurUp" by="word" trigger="inView" duration={0.7}>
                  Stop noticing your email.
                </TextAnimate>
              </span>
            </Title>

            <Text className={classes.lede}>
              Vicenda turns a morning of mail into a few decisions. It sorts every account by kind,
              with rules it learns as you go, and it runs entirely on your Mac.
            </Text>

            {/*
              The one action, and it is not a download (none until the next
              version). A plain anchor to the section under the hero: the page
              scrolls smoothly, and the section keeps clear of the bar.
            */}
            <div>
              <Button
                component="a"
                href="#how-it-works"
                size="md"
                radius="xl"
                rightSection={<IconArrowDown size={16} stroke={2} />}
              >
                See how it works
              </Button>
            </div>
          </div>

          <div className={classes.stage}>
            <SortingTable />
          </div>
        </div>
      </Container>
    </section>
  );
}
