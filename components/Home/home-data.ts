/**
 * What the diagrams under the hero show. ALL OF IT IS INVENTED: senders,
 * subjects, addresses (on `.example`, the domain reserved for examples, so
 * none can be anybody's), counts and times. The words that are not invented
 * are the app's own: tray titles and their sub-lines, the coverage lines, the
 * batch titles, the Overview's captions, quoted from the app's code with the
 * file named beside each, so the diagram says what the app says.
 */
import type { Account, ToolIcon } from '../MailCard/MailCard';
import { GF, JF } from '../SortingTable/table-data';

/** A third account, for the diagrams that show more than two. */
export const WK: Account = { monogram: 'WK', slot: 5 };

/**
 * Today's trays (`Tray.title`, `Tray.sub` in `SortingModel.swift`). Only the
 * sub-lines that hold today are drawn: the app's Bin says "gone, recoverable
 * for 30 days" and its unsubscribe tray "and no more of this kind", but no
 * decision reaches a server yet (`reportDecisionsTravel` is false for every
 * account, `Overview.swift`) and no unsubscribe is sent (`UnsubscribeSender`
 * has no caller), so the site does not repeat either.
 */
export const trayLegend: {
  letGo: { title: string; sub?: string; icon: ToolIcon }[];
  keep: { title: string; sub?: string; icon: ToolIcon }[];
} = {
  letGo: [
    { title: 'Bin', icon: 'bin' },
    { title: 'Bin and unsubscribe', icon: 'unsubscribe' },
    { title: 'Later', sub: 'back in the hand tomorrow', icon: 'later' },
  ],
  keep: [
    { title: 'Invoices 2026', icon: 'archive' },
    { title: 'To do', sub: 'keep it in front of me', icon: 'todo' },
  ],
};

/** The card being dragged, as `TableGhost` draws it: where it will land, said on it. */
export const ghost = {
  account: JF,
  sender: 'Harbor Light Magazine',
  subject: 'The autumn issue is out: twelve walks along the coast',
  landing: 'Later',
};

/**
 * In brief (`BriefRow`): the source and its time, the one line, and where the
 * mail goes once read ("→ Bin", or kept for a term when it is the day's news).
 */
export const brief = [
  {
    account: GF,
    source: 'Morning Ledger · 06:18',
    line: 'Rates held; markets flat ahead of Friday’s jobs report.',
    fate: 'kept until tomorrow',
  },
  {
    account: JF,
    source: 'FX Daily · 06:40',
    line: 'EUR/USD 1.084, up 0.2% overnight.',
    fate: '→ Bin',
  },
  {
    account: GF,
    source: 'Pressroom Stats · 07:02',
    line: 'Your Tuesday post: 1,240 reads, 31 replies.',
    fate: '→ Bin',
  },
  {
    account: WK,
    source: 'Uptime Watch · 07:15',
    line: 'All 6 checks green overnight.',
    fate: '→ Bin',
  },
];

/** "Done reading: bin 7, keep Il Messaggero until tomorrow" (`MorningReportModel`). */
export const doneReading = 'Done reading: bin 3, keep Morning Ledger until tomorrow';

/** A New kind (`NewCard`): several mails of one kind, and its proposal. */
export const newKind = {
  account: GF,
  sender: 'Northwind Updates',
  note: '3 mails',
  time: '06:02 – 07:12',
  subject: '12 new posts from people you follow',
  preview: [
    '• Northwind Updates · 07:12: 12 new posts from people you follow',
    '• Northwind Updates · 06:30: Your weekly roundup',
  ],
  more: 'and 1 more',
};

/**
 * What a rule takes of the sender's mail (`RuleCoverage.line` in
 * `KindRule.swift`): the side the mail was on, or the whole sender.
 */
export const coverage = {
  chosen: 'newsletter-style mail from updates@northwind.example',
  options: [
    'newsletter-style mail from updates@northwind.example',
    'every mail from updates@northwind.example',
  ],
  scope: 'on this account',
};

/** Already decided (`batches` in `MorningReportModel`): two batches, one sender left out. */
export const decided = {
  confirmAll: 'Confirm all 22',
  note: '2 batches, 23 mails, each the way its rule says',
  batches: [
    {
      accounts: [GF, JF],
      title: 'To the Bin',
      sub: '14 · promotions and notices that lead nowhere',
      senders: [
        { name: 'Brightline Deals', count: '×4' },
        { name: 'Fernway Rewards', count: '×3' },
        { name: 'Harbor Outlet', count: '×3' },
        { name: 'Pixel Weekly', out: true },
        { name: 'Corner Pantry', count: '×3' },
      ],
      showMail: 'Show the 14 mails',
      confirm: 'Confirm these 13',
    },
    {
      accounts: [JF, WK],
      title: 'Archived with a label',
      sub: '9 · the history',
      senders: [
        { name: 'Ridgeline Billing', note: '→ Invoices 2026', count: '×2' },
        { name: 'Pinecrest Travel', note: '→ Travel', count: '×3' },
        { name: 'Cobalt Energy', note: '→ Invoices 2026', count: '×4' },
      ],
      showMail: 'Show the 9 mails',
      confirm: 'Confirm these 9',
    },
  ],
};

export type OverviewKey = 'toDo' | 'brief' | 'new' | 'decided' | 'accounts' | 'rules';

/** The Overview's six cards (`OverviewModel.swift`): a figure, its title and caption. */
export const overview: { key: OverviewKey; value: string; title: string; caption: string }[] = [
  { key: 'toDo', value: '2', title: 'To do', caption: 'need you' },
  { key: 'brief', value: '4', title: 'In brief', caption: 'lines to read' },
  { key: 'new', value: '3', title: 'New', caption: 'kinds, in 8 mails' },
  { key: 'decided', value: '23', title: 'Already decided', caption: 'one confirmation' },
  // Every account is local only until decisions reach a server (phase 3).
  { key: 'accounts', value: '3', title: 'Accounts', caption: '3 local only' },
  { key: 'rules', value: '41', title: 'Rules', caption: '4 learned today' },
];

/** The accounts as the Overview lists them (`OverviewVM.AccountRow`). */
export const accounts = [
  {
    account: GF,
    address: 'gf@fernway.example',
    transport: 'Gmail over IMAP',
    badge: 'local only for now',
    status: '14 mails since last night',
  },
  {
    account: JF,
    address: 'jf@lumen.example',
    transport: 'IMAP',
    badge: 'local only for now',
    status: '9 mails since last night',
  },
  {
    account: WK,
    address: 'desk@orbitworks.example',
    transport: 'IMAP',
    badge: 'local only for now',
    status: '6 mails since last night',
  },
];
