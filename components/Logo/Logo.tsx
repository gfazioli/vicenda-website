import Image from 'next/image';
import { Group, Text } from '@mantine/core';

/**
 * The wordmark.
 *
 * The app's own icon, at the size the navbar asks for, beside the name set in
 * the display face — which is the whole of the identity and deliberately so.
 * There is no separate logotype to draw and maintain: the site's one borrowed
 * gesture is typographic, so the wordmark is the typography.
 *
 * `.display` rather than a Mantine font prop, because the family arrives as a
 * CSS variable from `next/font` on `<html>` and a theme override would fight it.
 *
 * No `priority`: it preloaded this mark twice on every page, the navbar's and
 * the footer's, ahead of the stylesheets and fonts the first paint waits on, and
 * neither is ever the largest paint (2026-09-29 audit). next/image loads it
 * lazily, which for a picture already in view means as soon as layout places it.
 */
export function Logo({ size = 28 }: { size?: number }) {
  return (
    <Group gap={10} wrap="nowrap" align="center">
      <Image
        src="/icon-512x512.png"
        alt=""
        width={size}
        height={size}
        style={{ borderRadius: size * 0.22 }}
      />
      <Text
        className="display"
        fz={size * 0.82}
        fw={500}
        lh={1}
        style={{ letterSpacing: '-0.015em' }}
      >
        Vicenda
      </Text>
    </Group>
  );
}
