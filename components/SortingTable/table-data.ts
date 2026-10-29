/**
 * What the hero's sorting table shows. ALL OF IT IS INVENTED: the senders,
 * the subjects, the two accounts and their monograms. Nothing here is, or may
 * become, anybody's real mail (the workspace's screenshot rule: never the
 * owner's mailboxes), and the senders are made-up names on purpose.
 *
 * The words that are NOT invented are the app's: the tray titles, the tool
 * labels and "from now on" are what `Tray` and `FromNowOnControls` draw in
 * Vicenda (`SortingModel.swift`, `MorningReportView.swift`), so the diagram
 * says what the app says.
 */

/** An account as a card draws it: its monogram, and its slot on the ring. */
export interface Account {
  monogram: string;
  /** Index into `ACCOUNT_RING` and `ACCOUNT_INK` in `theme.ts`. */
  slot: number;
}

export const GF: Account = { monogram: 'GF', slot: 0 };
export const JF: Account = { monogram: 'JF', slot: 3 };

export type ToolIcon = 'bin' | 'later' | 'archive';

export interface Tool {
  label: string;
  icon: ToolIcon;
  /** The first of a card's tools is its proposal, filled in the accent. */
  primary?: boolean;
}

/** A face-up card: a New kind, one mail standing for it. */
export interface FaceCard {
  account: Account;
  sender: string;
  /** What the kind is, beside the sender. */
  note: string;
  time: string;
  subject: string;
  tools: Tool[];
}

/** A card in the deck: only its bottom strip shows. */
export interface DeckCard {
  account: Account;
  sender: string;
  subject: string;
}

/** The top card: proposed for the Bin, and the one that goes there. */
export const leaving: FaceCard = {
  account: GF,
  sender: 'Northwind Updates',
  note: 'newsletter',
  time: '07:12',
  subject: '12 new posts from people you follow',
  tools: [
    { label: 'Bin', icon: 'bin', primary: true },
    { label: 'Later', icon: 'later' },
  ],
};

/** The second card, which rises into the top place. */
export const rising: FaceCard = {
  account: JF,
  sender: 'Ridgeline Billing',
  note: 'receipt',
  time: '06:58',
  subject: 'Your October invoice: €38.00',
  tools: [
    { label: 'Invoices 2026', icon: 'archive', primary: true },
    { label: 'Bin', icon: 'bin' },
  ],
};

/** The deck's first card, dealt face up into the second place. */
export const dealt: FaceCard = {
  account: GF,
  sender: 'Pinecrest Travel',
  note: 'booking',
  time: '06:41',
  subject: 'Booking confirmed: Lisbon, 14–17 Nov',
  tools: [
    { label: 'Travel', icon: 'archive', primary: true },
    { label: 'Later', icon: 'later' },
  ],
};

export const deck: DeckCard[] = [
  { account: JF, sender: 'Maple Lane School', subject: 'Parent evening moved to Thursday' },
  { account: GF, sender: 'Copperfield Bank', subject: 'Your statement is available' },
  { account: JF, sender: 'Brightline Deals', subject: '48 hours only: 30% off everything' },
];

/**
 * Under the deck, as the app writes it under its own (`MorningReportModel`):
 * the cards past the two face up. Nine in the hand, after the first is sorted.
 */
export const more = '+7 in the hand';

export type TrayIcon = 'bin' | 'unsubscribe' | 'later' | 'archive' | 'todo';

export interface Tray {
  title: string;
  /** The title on a phone, where a tray is a small tile. */
  short?: string;
  icon: TrayIcon;
}

/** On the left, what lets mail go (`Tray.letGo`). The Bin is first. */
export const letGo: Tray[] = [
  { title: 'Bin', icon: 'bin' },
  { title: 'Bin and unsubscribe', short: 'Unsubscribe', icon: 'unsubscribe' },
  { title: 'Later', icon: 'later' },
];

/** On the right, what keeps it: two labels the rules name, and To do. */
export const keep: Tray[] = [
  { title: 'Invoices 2026', icon: 'archive' },
  { title: 'Travel', icon: 'archive' },
  { title: 'To do', icon: 'todo' },
];

/** What the table says to a screen reader: it is a picture, and says of what. */
export const description =
  'A sketch of Vicenda’s sorting table: two mail cards face up and a deck under them, ' +
  'trays on the left that let mail go (Bin, Bin and unsubscribe, Later) and trays on ' +
  'the right that keep it under a label or in To do. The top card, a newsletter, goes ' +
  'into the Bin, and the next card rises into its place.';
