'use client';

import { createTheme } from '@mantine/core';

/**
 * Vicenda's colours are the APP's colours, not new ones.
 *
 * The chrome is a neutral aubergine — C=0.012 at h=300, a whisper rather than a
 * tint — because the app spends hue on exactly one thing and the ground has to
 * give way for it. The eight account hues below are the real ring: OKLCH
 * L=0.72, C=0.13, 45° apart, converted to sRGB. They are the one graphic device
 * this product already owns, so the site uses them rather than inventing a
 * palette that would then disagree with every screenshot on it.
 */

/** The account ring, in slot order. Hue means "which mailbox" and nothing else. */
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

/** The blues in the app icon's fold, sampled off the 1024px master. */
export const ICON_BLUE = {
  bright: '#0056C7',
  mid: '#003A99',
  deep: '#00348A',
} as const;

/** The app's own chrome ramp, dark side — see `Tokens.swift`. */
export const CHROME = {
  rail: '#0D0B11',
  sidebar: '#131217',
  stream: '#1A181E',
  raised: '#211F25',
  raised2: '#28262D',
  t1: '#EFEEF2',
  t2: '#ABAAAE',
  t3: '#757477',
  t4: '#535255',
} as const;

export const theme = createTheme({
  primaryColor: 'vicenda',
  colors: {
    /**
     * THE ICON'S OWN BLUE, sampled and then laddered — not picked.
     *
     * `#0056C7` is the brightest of the three blues in the app icon's fold
     * (the others are `#00348A` and `#003A99`); measured off the 1024px
     * master rather than eyeballed, for the same reason the account ring was
     * computed from `Palette.swift`: an accent chosen by eye disagrees with
     * the artwork sitting next to it. Converted to OKLCH — `oklch(0.484,
     * 0.190, 259.3)` — and stepped down a lightness ladder with the chroma
     * tapering at the pale end, so the tints stay blue instead of turning to
     * pastel mud.
     *
     * This is a BRAND accent and it is not an account hue. Inside the app,
     * colour means which mailbox and nothing else; on the site there is no
     * mailbox to confuse it with, and the ring below is what carries that
     * idea when it needs carrying.
     */
    vicenda: [
      '#EAF2FF',
      '#D1E6FF',
      '#ABCFFF',
      '#81B5FF',
      '#5C9AFD',
      '#367CE9',
      '#1361D3',
      '#004DB6',
      '#003C90',
      '#012C6B',
    ],
  },
  headings: {
    fontWeight: '600',
  },
  defaultRadius: 'md',
});
