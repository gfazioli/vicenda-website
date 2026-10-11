import type { ComponentProps } from 'react';
import { ImageZoom } from 'nextra/components';

export type DocsImageProps = ComponentProps<typeof ImageZoom>;

/**
 * The docs column of the Nextra 4.6.1 layout, measured from 700 to 2000 px
 * wide on the four app sites, with the browser's default font at 16 and at
 * 20px (2026-10-11). Nextra lays it out in rem, so it moves with the visitor's
 * font: the viewport less 2rem on a phone; less 22rem once the sidebar shows,
 * at 48em; less 38rem once the table of contents shows too, at 80em; and never
 * wider than 52rem. At 16px that is 32, 352 and 608 px, and 832 at most; at
 * 20px, 40, 440, 760 and 1040.
 *
 * In px, the first version under-asked for a visitor with a larger font: at
 * 20px and 900 px wide the column is 860, still the phone's, and a px `sizes`
 * said 548 (found in review). Each stretch ends where the layout switches,
 * with range syntax (`width < 48em`), which excludes the breakpoint itself, so
 * no viewport, however fractional, falls between two. Chrome and Safari read
 * it in `sizes` (measured); a browser that does not skips those clauses and
 * takes `52rem`: more bytes, never a rendering too small.
 */
const STRETCHES: { below?: string; column: string }[] = [
  { below: '48em', column: 'calc(100vw - 2rem)' },
  { below: '80em', column: 'calc(100vw - 22rem)' },
  { below: '90em', column: 'calc(100vw - 38rem)' },
  { column: '52rem' },
];

/**
 * `sizes` for a picture drawn at the column's width, or at `width` CSS px when
 * the column is wider: `min()` of the two in each stretch. Chrome and Safari
 * take `min()` in `sizes` (measured); a browser that does not falls back to
 * `100vw`, which fetches more, never a rendering too small.
 */
export function docsSizes(width?: number): string {
  return STRETCHES.map(({ below, column }) => {
    const size = width === undefined ? column : `min(${column}, ${width}px)`;
    return below ? `(width < ${below}) ${size}` : size;
  }).join(', ');
}

/**
 * How wide a picture is drawn when the column leaves it room: its file's own
 * width, as it always was here.
 *
 * Not halved, as the sibling sites halve their Retina captures: these are not
 * two pixels per point. The app's `shoot.sh` captures a 1280x800-point window,
 * shadow included, and resamples it to 2000 px, about 1.56 px per point, so a
 * half would draw a narrower crop smaller than the thing it shows. Every
 * capture here is 2000 px, wider than the column at every viewport (927 at
 * most), so this only tells `sizes` the most it can ever be drawn at.
 */
function drawnWidth(src: DocsImageProps['src']): number | undefined {
  if (typeof src !== 'object') {
    return undefined;
  }
  return 'default' in src ? src.default.width : src.width;
}

/**
 * A docs image: Nextra's own zoomable image, told how wide it is drawn.
 *
 * Without `sizes`, next/image offers the srcset as 1x and 2x of the file's own
 * width, and the browser cannot know the column is narrower: the docs' 832px
 * column fetched the 2048px rendering on a laptop, and a phone fetched the
 * 3840px one for a picture drawn 358px wide (measured 2026-09-29, /docs/cards).
 * `docsSizes` follows the column as it was measured, and a picture narrower
 * than the column says its own width.
 */
export function DocsImage(props: DocsImageProps) {
  return <ImageZoom sizes={docsSizes(drawnWidth(props.src))} {...props} />;
}
