'use client';

import { createTheme } from '@mantine/core';

/**
 * Vicenda's colours are the APP's colours, not new ones: every value below is
 * read from `VicendaCore/Model/Palette.swift` in the app, and says which name
 * it has there.
 *
 * Three families, kept apart the way the app keeps them:
 *
 * - THE LOGO (`Palette.Logo`): the night ground, its cobalt light, and the
 *   pearl and blues of the icon. The page is drawn from these.
 * - THE ACCOUNT RING (`Palette.hues`): eight hues at one lightness and chroma,
 *   which mean "which mailbox" and nothing else. Only a mail card's band and
 *   monogram wear them.
 * - THE SECTIONS (`Palette.Section`): one vivid colour per part of the report
 *   and the Overview, saturated enough never to be read as an account.
 *
 * The site is dark only (`app/layout.tsx`), so these are the app's NIGHT
 * values. Each hex lives once. The logo's blues and the night ground's ramp
 * are here, as Mantine's `vicenda` and `dark` palettes, and the page reads
 * them through `--vic-*` aliases of Mantine's variables (`theme/global.css`);
 * what no palette holds (the ground's other two stops, the card, the
 * sections' colours) is written there, once; and what a component needs as a
 * value (the ring and its inks) is here.
 */

/**
 * The account ring, in slot order: OKLCH L=0.72, C=0.13, 45° apart, converted
 * to sRGB. Hue means "which mailbox" and nothing else.
 */
export const ACCOUNT_RING = [
  '#EB827B',
  '#D8953D',
  '#A2AE44',
  '#4CBD88',
  '#00BBCB',
  '#60AAF3',
  '#AB93ED',
  '#DA83BE',
] as const;

/**
 * The monogram's ink on each ring hue (`Palette.monogramInk`: the same hue at
 * L=0.18, C=0.03), so a tile and its letters are always one family.
 */
export const ACCOUNT_INK = [
  '#1D0C0B',
  '#1A0F03',
  '#111304',
  '#05160D',
  '#001518',
  '#07121E',
  '#130F1D',
  '#1A0C16',
] as const;

export const theme = createTheme({
  primaryColor: 'vicenda',
  colors: {
    /**
     * THE LOGO'S BLUES, laddered: `sky` at 5 and `royal` at 6 are the app's
     * own values (`Palette.Logo`), `cobalt` at 8, and the steps between and
     * above them interpolated in the same hue. Six is the filled shade by
     * night as well as by day, so a filled button is the app's royal, as its
     * primary tool is; white on it is 5.2:1.
     *
     * A BRAND accent, not an account hue: inside the app, colour means which
     * mailbox and nothing else, and the ring above carries that idea where the
     * page needs it.
     */
    vicenda: [
      '#EAF3FF',
      '#CDE3FF',
      '#9DCBFF',
      '#6AB2FF',
      '#3B9BFD',
      '#0086FB',
      '#0067E1',
      '#0057C9',
      '#0047B0',
      '#00388C',
    ],
    /**
     * Mantine's dark ramp, redrawn on the logo's navy: the page's ground at 9
     * (`GROUND[0]`), surfaces climbing toward the card fill, borders at 4, the
     * dimmed text at 2 and body text at 0. Every dark surface Mantine paints
     * (an accordion, an input, a default button) then sits on the app's night
     * instead of on a neutral grey that would read as a different product.
     * Measured on the ground: text 15.6:1, ice 13:1, dimmed 7.7:1 (5.7:1 at
     * the brightest of the cobalt light).
     */
    dark: [
      '#E6ECF6',
      '#CCD9EC',
      '#9AA8C4',
      '#6F7EA0',
      '#34446E',
      '#26365F',
      '#1A2A55',
      '#0E1B45',
      '#0B163A',
      '#09112F',
    ],
  },
  primaryShade: { light: 6, dark: 6 },
  /*
   * Mantine's own transitions (modals, tooltips, menus, accordions) take 0 ms
   * for a visitor whose system asks for less motion. Mantine's default
   * ignores that setting.
   */
  respectReducedMotion: true,
  /*
   * Every <Title> in the display face, light, as lancetta.app's theme does:
   * the hierarchy is carried by size and by the face, not by weight. A title
   * that wants the text face says `ff="text"`. Nextra's docs headings are its
   * own markup, not <Title>s, and keep their face.
   */
  headings: {
    fontFamily: "var(--font-display), Georgia, 'Times New Roman', serif",
    fontWeight: '400',
  },
  defaultRadius: 'md',
});
