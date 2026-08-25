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
    // A neutral ramp with the app's own aubergine cast. Deliberately not one of
    // the account hues: the site must not imply that a colour means a feature.
    vicenda: [
      '#F7F6F9',
      '#EFEEF2',
      '#D8D5DE',
      '#BFBAC8',
      '#A6A0B2',
      '#8E869C',
      '#756D84',
      '#5C5569',
      '#3E3947',
      '#211F25',
    ],
  },
  headings: {
    fontWeight: '600',
  },
  defaultRadius: 'md',
});
