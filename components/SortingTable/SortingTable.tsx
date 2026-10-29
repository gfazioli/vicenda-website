'use client';

import { MailCard, Peek, TOOL_ICONS } from '../MailCard/MailCard';
import { useReveal } from '../Motion/useReveal';
import {
  type Tray,
  dealt,
  deck,
  description,
  keep,
  leaving,
  letGo,
  more,
  rising,
} from './table-data';
import classes from './SortingTable.module.css';

/**
 * The hero's picture: Vicenda's Today screen as a living diagram, drawn in
 * HTML so it is sharp at every size and costs no image.
 *
 * The sorting table as the app lays it out (`SortingTable.swift`): the hand in
 * the middle, two cards face up and the rest stacked as a deck under them;
 * trays on the left that let mail go, and trays on the right that keep it.
 * The cards are drawn as the app draws them (`MailChrome`): one navy fill for
 * every account, the account's hue as a 12px band down the left that is the
 * card's border, square at its 3px corners and round on the right, and a
 * monogram tile at the start of the first line.
 *
 * ## The one pass
 *
 * The SERVED markup is the end of the story: the newsletter already in the
 * Bin, the Bin's count at 1, the invoice in the top place and the booking
 * dealt under it. That is what a visitor with Reduce Motion sees, what paper
 * gets, and what stays if no script ever runs, so a failure costs the motion
 * and never the picture. The motion is CSS keyframes that name only where each
 * piece STARTS and end on that layout (`SortingTable.module.css`), the pattern
 * of `Motion.module.css`, played once:
 *
 * - on screen at the first paint, by CSS alone, after a hold long enough to
 *   read the table before it moves;
 * - off screen when the page mounts (a reload halfway down), `useReveal` arms
 *   the table into its first pose where nobody sees it, and plays it the first
 *   time it scrolls into view.
 *
 * The top card's "Bin" is pressed, the card lifts and travels into the Bin,
 * the tray takes it and its count ticks from 0 to 1, the next card rises into
 * its place on the app's own sort spring, and the deck deals the next. Then it
 * rests. Only transform and opacity move, and nothing loops.
 *
 * The whole table is one image to assistive technology (`role="img"`, with a
 * description): its words are a picture of a screen, not content to read.
 */
export function SortingTable() {
  const reveal = useReveal<HTMLDivElement>();
  return (
    <div
      ref={reveal.ref}
      className={classes.table}
      data-armed={reveal.armed ? '' : undefined}
      data-revealed={reveal.revealed ? '' : undefined}
      role="img"
      aria-label={description}
    >
      <div className={classes.side} data-side="go">
        <p className={classes.caption}>Let go</p>
        <div className={classes.trays}>
          {letGo.map((tray, i) => (
            <TrayView key={tray.title} tray={tray} lands={i === 0} />
          ))}
        </div>
      </div>

      <div className={classes.hand}>
        <p className={classes.caption}>
          <span className={classes.sectionDot} aria-hidden="true" />
          New, one kind at a time
        </p>
        <div className={classes.pile}>
          <div className={`${classes.slot} ${classes.leaving}`}>
            <MailCard card={leaving} pressClassName={classes.press} />
          </div>
          <div className={`${classes.slot} ${classes.rising}`}>
            <MailCard card={rising} />
          </div>
          <div className={`${classes.slot} ${classes.dealt}`}>
            <MailCard card={dealt} />
          </div>
          <div className={classes.deck}>
            {deck.map((card, depth) => (
              <Peek key={card.sender} {...card} depth={depth} />
            ))}
            <p className={classes.more}>{more}</p>
          </div>
        </div>
      </div>

      <div className={classes.side} data-side="keep">
        <p className={classes.caption}>Keep under a label</p>
        <div className={classes.trays}>
          {keep.map((tray, i) => (
            <TrayView key={tray.title} tray={tray} proposedAtEnd={i === 0} />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * A tray: its symbol, its name and its tally. `lands` is the Bin, which the
 * top card goes into: its count is a window over a 0 that leaves and a 1 that
 * arrives. The proposal ring (the top card's first tool names a tray, and the
 * app rings it in the accent) moves from the Bin to the tray the next card
 * proposes.
 */
function TrayView({
  tray,
  lands = false,
  proposedAtEnd = false,
}: {
  tray: Tray;
  lands?: boolean;
  proposedAtEnd?: boolean;
}) {
  const Icon = TOOL_ICONS[tray.icon];
  const ring = lands ? classes.ringLeaves : proposedAtEnd ? classes.ringArrives : '';
  return (
    <div className={`${classes.tray} ${ring} ${lands ? classes.lands : ''}`} data-icon={tray.icon}>
      <span className={classes.trayIcon}>
        <Icon size={14} stroke={2} aria-hidden="true" />
      </span>
      <span className={classes.trayTitle}>
        <span className={classes.full}>{tray.title}</span>
        <span className={classes.short}>{tray.short ?? tray.title}</span>
      </span>
      <span className={classes.count}>
        {lands ? (
          <>
            <span className={classes.countWas}>0</span>
            <span className={classes.countNow}>1</span>
          </>
        ) : (
          <span>0</span>
        )}
      </span>
    </div>
  );
}
