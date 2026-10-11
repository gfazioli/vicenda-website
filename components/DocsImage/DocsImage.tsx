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
  // 767.98, not 767: the layout switches at min-width 768, and a viewport of
  // 767.5 (a zoom, a fractional DPR) is still the phone's.
  const stretch = (until: number, from: number, gutter: number, top: number) => {
    // The picture fills the column until the column is wider than the picture.
    const full = points + gutter;
    if (points <= from - gutter) {
      clauses.push([`(max-width: ${until - 0.02}px)`, `${Math.min(points, top)}px`]);
    } else if (full < until && points < top) {
      clauses.push([`(max-width: ${full}px)`, `calc(100vw - ${gutter}px)`]);
      clauses.push([`(max-width: ${until - 0.02}px)`, `${points}px`]);
    } else {
      clauses.push([`(max-width: ${until - 0.02}px)`, `calc(100vw - ${gutter}px)`]);
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
