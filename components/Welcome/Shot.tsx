'use client';

import Image from 'next/image';
import { Box } from '@mantine/core';

/**
 * One app screenshot, framed.
 *
 * **The frame is doing real work on a dark page.** These captures are of a
 * dark window on a near-black ground, so without a border the window's own
 * edge dissolves into the page and the picture reads as a region of the site
 * rather than as an application. A hairline plus a soft shadow is what says
 * "this is a window".
 *
 * `sizes` is not decoration either: the sources are 2880 wide and the largest
 * this is ever drawn is the `lg` container, so without it Next serves the
 * full-width candidate to a phone.
 */
export function Shot({
  src,
  alt,
  width,
  height,
  priority = false,
}: {
  src: string;
  alt: string;
  /** The file's REAL pixel size. Next reserves the box from this ratio, so a
   *  guessed pair makes the page jump when the image lands — the crops here
   *  are not all the same height. */
  width: number;
  height: number;
  priority?: boolean;
}) {
  return (
    <Box
      style={{
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,.10)',
        boxShadow: '0 24px 60px rgba(0,0,0,.45)',
        // The box is only as tall as the picture: a percentage height here
        // would leave a band of page colour inside the border, which reads as
        // a rendering fault rather than as padding.
        lineHeight: 0,
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes="(max-width: 62em) 100vw, 1200px"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
    </Box>
  );
}
