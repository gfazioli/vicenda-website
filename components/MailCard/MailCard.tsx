import type { CSSProperties, ReactNode } from 'react';
import type { Icon } from '@tabler/icons-react';
import {
  IconArchive,
  IconBellOff,
  IconCheck,
  IconCircleCheck,
  IconMoon,
  IconTrash,
} from '@tabler/icons-react';
import { ACCOUNT_INK, ACCOUNT_RING } from '@/theme/ring';
import classes from './MailCard.module.css';

/**
 * A mail card as the app draws it, for the hero's sorting table and the
 * diagrams under it. Pictures of the app, not controls: every "button" here
 * is a span, and the diagrams that hold these cards are images to assistive
 * technology (`role="img"` with a description), since their words are a
 * picture of a screen rather than content to read.
 *
 * ALL MAIL DRAWN WITH THESE IS INVENTED (see `SortingTable/table-data.ts`).
 */

/** An account as a card draws it: its monogram, and its slot on the ring. */
export interface Account {
  monogram: string;
  /** Index into `ACCOUNT_RING` and `ACCOUNT_INK` in `theme.ts`. */
  slot: number;
}

export type ToolIcon = 'bin' | 'unsubscribe' | 'later' | 'archive' | 'todo';

export interface Tool {
  label: string;
  icon: ToolIcon;
  /** The first of a card's tools is its proposal, filled in the accent. */
  primary?: boolean;
}

export const TOOL_ICONS: Record<ToolIcon, Icon> = {
  bin: IconTrash,
  unsubscribe: IconBellOff,
  later: IconMoon,
  archive: IconArchive,
  todo: IconCircleCheck,
};

/** The account's hue and its monogram's ink, as custom properties. */
export function accountStyle(account: Account, second?: Account) {
  return {
    '--band': ACCOUNT_RING[account.slot],
    '--mono': ACCOUNT_INK[account.slot],
    ...(second ? { '--band-2': ACCOUNT_RING[second.slot] } : {}),
  } as CSSProperties;
}

/** `AccountTile`: the account's monogram on its hue. */
export function AccountTile({
  account,
  size = 'normal',
}: {
  account: Account;
  size?: 'small' | 'normal' | 'large';
}) {
  return (
    <span
      className={classes.tile}
      data-size={size === 'normal' ? undefined : size}
      style={accountStyle(account)}
    >
      {account.monogram}
    </span>
  );
}

/**
 * A card's chrome: the band of its one or two accounts (none draws an even
 * edge), the fill, and whatever goes inside.
 */
export function CardShell({ accounts, children }: { accounts: Account[]; children: ReactNode }) {
  const [first, second] = accounts;
  return (
    <div
      className={classes.card}
      style={first ? accountStyle(first, second) : undefined}
      data-split={second ? '' : undefined}
      data-plain={first ? undefined : ''}
    >
      {children}
    </div>
  );
}

/** The card's title zone, the app's `CardTitle`: tile, sender, note, time; the subject. */
export function CardTitle({
  account,
  sender,
  note,
  time,
  subject,
}: {
  account: Account;
  sender: string;
  note?: string;
  time?: string;
  subject: string;
}) {
  return (
    <>
      <div className={classes.titleRow}>
        <AccountTile account={account} />
        <span className={classes.sender}>{sender}</span>
        {note && <span className={classes.note}>{note}</span>}
        {time && <span className={classes.time}>{time}</span>}
      </div>
      <p className={classes.subject}>{subject}</p>
    </>
  );
}

/**
 * A card's tool, as `ToolButtonStyle` draws it: a symbol and a label, the
 * card's proposal filled in the accent. Every chip on the page is one of
 * these, so they share one size and one stroke.
 */
export function ToolChip({
  icon: ChipIcon,
  label,
  primary = false,
  className,
}: {
  icon: Icon;
  label: string;
  primary?: boolean;
  className?: string;
}) {
  return (
    <span
      className={[classes.tool, className].filter(Boolean).join(' ')}
      data-primary={primary ? '' : undefined}
    >
      <ChipIcon size={13} stroke={2} aria-hidden="true" />
      {label}
    </span>
  );
}

/** "from now on", checked: a New card's yes makes a rule (`FromNowOnControls`). */
export function FromNowOn() {
  return (
    <span className={classes.fromNow}>
      <span className={classes.check} aria-hidden="true">
        <IconCheck size={9} stroke={3.5} />
      </span>
      from now on
    </span>
  );
}

/** A tray, as the app's `TrayFace` draws it. */
export interface Tray {
  title: string;
  /** The title on a phone, where the hero's trays are small tiles. */
  short?: string;
  /** What the tray does, under its name, where there is room for it. */
  sub?: string;
  icon: ToolIcon;
}

/**
 * A tray's face: on the ground, dashed; its symbol, its name, its tally if it
 * has one, and what it does under them. `target` draws it lit and solid, as a
 * card held over it does; `tile` folds it into a phone's small tile, the
 * symbol and the tally on top and the short name under them. The proposal
 * ring and the lit layer are its `::before` and `::after`, off at rest, for a
 * table that animates them.
 */
export function TrayFace({
  tray,
  count,
  target = false,
  tile = false,
  withSub = true,
  className,
}: {
  tray: Tray;
  count?: ReactNode;
  target?: boolean;
  tile?: boolean;
  /** False where the tray is too small for its sub-line (the hero's table). */
  withSub?: boolean;
  className?: string;
}) {
  const TrayIcon = TOOL_ICONS[tray.icon];
  return (
    <div
      className={[classes.tray, tile && classes.trayTile, className].filter(Boolean).join(' ')}
      data-icon={tray.icon}
      data-target={target ? '' : undefined}
    >
      <span className={classes.trayHead}>
        <span className={classes.trayIcon}>
          <TrayIcon size={14} stroke={2} aria-hidden="true" />
        </span>
        <span className={classes.trayTitle}>
          {tray.short ? (
            <>
              <span className={classes.full}>{tray.title}</span>
              <span className={classes.short}>{tray.short}</span>
            </>
          ) : (
            tray.title
          )}
        </span>
        {count !== undefined && <span className={classes.count}>{count}</span>}
      </span>
      {withSub && tray.sub && <span className={classes.traySub}>{tray.sub}</span>}
    </div>
  );
}

/** A face-up card of the hand: a New kind, one mail standing for it. */
export interface FaceCard {
  account: Account;
  sender: string;
  /** What the kind is, beside the sender. */
  note: string;
  time: string;
  subject: string;
  tools: Tool[];
}

/**
 * A face-up card: its title zone, then its tools in a strip of their own with
 * "from now on" at the end. `pressClassName` goes on the first tool, for the
 * hero's pass to press it.
 */
export function MailCard({ card, pressClassName }: { card: FaceCard; pressClassName?: string }) {
  return (
    <CardShell accounts={[card.account]}>
      <div className={classes.body}>
        <CardTitle {...card} />
      </div>
      <div className={classes.foot}>
        <span className={classes.tools}>
          {card.tools.map((tool, i) => (
            <ToolChip
              key={tool.label}
              icon={TOOL_ICONS[tool.icon]}
              label={tool.label}
              primary={tool.primary}
              className={i === 0 ? pressClassName : undefined}
            />
          ))}
        </span>
        <FromNowOn />
      </div>
    </CardShell>
  );
}

/** A card in the deck: only its bottom strip shows. */
export type DeckCard = Pick<FaceCard, 'account' | 'sender' | 'subject'>;

/** A card in the deck as drawn: a little narrower the deeper. */
export function Peek({ account, sender, subject, depth }: DeckCard & { depth: number }) {
  return (
    <div
      className={classes.peek}
      style={{ ...accountStyle(account), '--depth': depth } as CSSProperties}
    >
      <AccountTile account={account} size="small" />
      <span className={classes.peekSender}>{sender}</span>
      <span className={classes.peekSubject}>{subject}</span>
    </div>
  );
}

/** The classes, for a diagram that lays out a card of its own. */
export const mailCardClasses = classes;
