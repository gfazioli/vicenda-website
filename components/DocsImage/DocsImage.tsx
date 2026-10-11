import type { ComponentProps } from 'react';
import { ImageZoom } from 'nextra/components';

export type DocsImageProps = ComponentProps<typeof ImageZoom>;

/**
 * The docs column, measured 2026-10-11 on the Nextra 4.6.1 docs layout, whose
 * width this site's CSS does not touch: the viewport less 32px on a phone;
 * less 352px once the sidebar shows, at 768; less 608px once the table of
 * contents shows too, at 1280, and never wider than 832px. Between 1185 and
 * 1279 it is wider than 832 (927 at 1279), which a flat `832px` under-asked
 * for, and at 768 it is 416, not the 768 a `(max-width: 768px) 100vw` asked
 * for.
 */
const PHONE_GUTTER = 32;
const SIDEBAR = 352;
const SIDEBAR_AND_TOC = 608;
const COLUMN_MAX = 832;
const SIDEBAR_FROM = 768;
const TOC_FROM = 1280;

/**
 * `sizes` for a picture drawn at the column's width, or at `points` when it is
 * narrower: one clause per stretch of viewport, the column's own formula
 * while the picture fills it and its fixed width once it does not.
 */
export function docsSizes(points = Infinity): string {
  const clauses: [string | null, string][] = [];
  const stretch = (until: number, from: number, gutter: number, top: number) => {
    // The picture fills the column until the column is wider than the picture.
    const full = points + gutter;
    if (points <= from - gutter) {
      clauses.push([`(max-width: ${until - 1}px)`, `${Math.min(points, top)}px`]);
    } else if (full < until && points < top) {
      clauses.push([`(max-width: ${full}px)`, `calc(100vw - ${gutter}px)`]);
      clauses.push([`(max-width: ${until - 1}px)`, `${points}px`]);
    } else {
      clauses.push([`(max-width: ${until - 1}px)`, `calc(100vw - ${gutter}px)`]);
    }
  };
  stretch(SIDEBAR_FROM, 0, PHONE_GUTTER, Infinity);
  stretch(TOC_FROM, SIDEBAR_FROM, SIDEBAR, Infinity);
  stretch(COLUMN_MAX + SIDEBAR_AND_TOC, TOC_FROM, SIDEBAR_AND_TOC, COLUMN_MAX);
  clauses.push([null, `${Math.min(points, COLUMN_MAX)}px`]);

  // A clause that says what the next one says is only a longer way to say it.
  const kept = clauses.filter(
    ([, size], i) => i === clauses.length - 1 || clauses[i + 1][1] !== size
  );
  return kept.map(([media, size]) => (media ? `${media} ${size}` : size)).join(', ');
}

/**
 * The widest a capture is drawn: half its pixel width, the sibling sites' rule
 * for a Retina capture taken at two pixels per point, which a page would
 * otherwise draw at twice the size of the thing it shows.
 *
 * Here every `public/screenshot-*.png` is 2000 px wide: the app's `shoot.sh`
 * captures a 1280x800-point window, shadow included, and resamples it to that
 * width. Half is 1000px, wider than the column at every viewport (927 at
 * most), so no capture on this site is drawn at a different width for it
 * (checked 2026-10-11); it holds a narrower one, should one land, at half.
 *
 * Only a static import knows its size, and only the captures follow the rule:
 * anything else is drawn as it was.
 */
function pointWidth(src: DocsImageProps['src']): number | undefined {
  if (typeof src !== 'object') {
    return undefined;
  }
  const image = 'default' in src ? src.default : src;
  return image.src.includes('/screenshot-') ? Math.round(image.width / 2) : undefined;
}

/**
 * A docs image: Nextra's own zoomable image, told how wide it is drawn.
 *
 * Without `sizes`, next/image offers the srcset as 1x and 2x of the file's own
 * width, and the browser cannot know the column is narrower: the docs' 832px
 * column fetched the 2048px rendering on a laptop, and a phone fetched the
 * 3840px one for a picture drawn 358px wide (measured 2026-09-29, /docs/cards).
 * `docsSizes` follows the column as it was measured, and a capture narrower
 * than the column says its own width.
 */
export function DocsImage(props: DocsImageProps) {
  const points = pointWidth(props.src);

  return (
    <ImageZoom
      sizes={docsSizes(points)}
      {...props}
      style={points ? { maxWidth: `min(100%, ${points}px)`, ...props.style } : props.style}
    />
  );
}
