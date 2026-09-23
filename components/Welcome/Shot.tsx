'use client';

import Image from 'next/image';

/**
 * One app screenshot, unframed.
 *
 * **It used to sit in a frame** — a hairline, a 12px radius and a soft
 * shadow — on the argument that a dark window on a near-black page dissolves
 * into it without one. The user removed it (2026-09-23: "elimina quel bordo
 * così lasciamo solo l'immagine"), and the captures do not need it: each one
 * is the window with its own edge and its own shadow baked into the PNG's
 * alpha, over a transparent margin (measured: alpha 0 at every edge, 0.03 to
 * 0.05 in the shadow). The frame drew a second, larger rectangle around that
 * margin, so the window read as a picture inside a box.
 *
 * `sizes` is not decoration: the sources are 2000 wide and the largest this
 * is ever drawn is the `lg` container, so without it Next serves the
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
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      sizes="(max-width: 62em) 100vw, 1200px"
      style={{ width: '100%', height: 'auto', display: 'block' }}
    />
  );
}
