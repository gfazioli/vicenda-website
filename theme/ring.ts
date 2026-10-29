/*
 * The account ring and its monogram inks, as values. Here and not in
 * `theme.ts`, which is a client module: a server component importing from it
 * gets a client reference, not the array (the diagrams under the hero are
 * drawn on the server).
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
