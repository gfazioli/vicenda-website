import type { CSSProperties, ReactNode } from 'react';
import {
  IconArchive,
  IconBellOff,
  IconCheck,
  IconCircleCheck,
  IconMoon,
  IconTrash,
} from '@tabler/icons-react';
import { ACCOUNT_INK, ACCOUNT_RING } from '@/theme';
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

export const TOOL_ICONS: Record<ToolIcon, typeof IconTrash> = {
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
export function CardShell({
  accounts,
  className,
  children,
}: {
  accounts: Account[];
  className?: string;
  children: ReactNode;
}) {
  const [first, second] = accounts;
  return (
    <div
      className={[classes.card, className].filter(Boolean).join(' ')}
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

/** A card's tool, as `ToolButtonStyle` draws it. */
export function ToolChip({ tool, className }: { tool: Tool; className?: string }) {
  const Icon = TOOL_ICONS[tool.icon];
  return (
    <span
      className={[classes.tool, className].filter(Boolean).join(' ')}
      data-primary={tool.primary ? '' : undefined}
    >
      <Icon size={13} stroke={2} aria-hidden="true" />
      {tool.label}
    </span>
  );
}

/** "from now on", checked: a New card's yes makes a rule (`FromNowOnControls`). */
export function FromNowOn({ children }: { children?: ReactNode }) {
  return (
    <span className={classes.fromNow}>
      <span className={classes.check} aria-hidden="true">
        <IconCheck size={9} stroke={3.5} />
      </span>
      from now on
      {children}
    </span>
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
              tool={tool}
              className={i === 0 ? pressClassName : undefined}
            />
          ))}
        </span>
        <FromNowOn />
      </div>
    </CardShell>
  );
}

/** A card in the deck: only its bottom strip shows, a little narrower the deeper. */
export function Peek({
  account,
  sender,
  subject,
  depth,
}: {
  account: Account;
  sender: string;
  subject: string;
  depth: number;
}) {
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
