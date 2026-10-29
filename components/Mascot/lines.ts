/**
 * What the envelope says. Netfox's fox translates the language of machines
 * (`translations.ts` there); Vicenda's envelope tells the morning in one line,
 * the morning the home page draws (`Home/home-data.ts`).
 *
 * They are public claims, so each line says what the app does today (the
 * "Built" list in AGENTS.md, checked against the section it stands for), in
 * the page's own words where it can; the figures are the page's invented
 * morning, never a statistic. The owner's own mail is said as his
 * ("the mailboxes I began with"), as the section under the hero says it.
 *
 * If a release changes what one of these says, change it here in the same
 * motion; `lines.test.ts` holds the morning's figures to the Overview's.
 */

/** A part of the page the envelope can speak for, and its words. */
export interface Lines {
  /** What the part is called on the page: the section's eyebrow. */
  label: string;
  lines: readonly string[];
}

/**
 * The morning, in the hero and wherever no section is in view: the owner's
 * lines from the mascot's preview (2026-10-29), its figures the Overview's
 * cards (`overview` in `Home/home-data.ts`).
 */
export const MORNING: Lines = {
  label: 'This morning',
  lines: [
    'Good morning. 2 to do, 4 lines to read.',
    '23 already decided: one confirmation.',
    'Then quiet until tomorrow.',
  ],
};

/**
 * The home page's sections the envelope in the corner speaks for, marked
 * `data-guide-section` on each (`HomeSections.tsx`, the FAQ's band in
 * `Welcome.tsx`), in page order.
 */
export const SECTION_LINES = {
  problem: {
    label: 'The problem',
    lines: [
      'In the mailboxes I began with, 97 in 100 come from machines.',
      'So I sort by kind: a sender, and what it sends.',
    ],
  },
  today: {
    label: 'Today',
    lines: [
      'Two cards face up. Drag one to a tray, and the next one rises.',
      'Not now? Later brings it back at eight tomorrow morning.',
    ],
  },
  brief: {
    label: 'In brief',
    lines: [
      'A rate, the news, an alert: one line each, and the mail can go.',
      'The day’s news waits until tomorrow; the rest goes to the Bin.',
    ],
  },
  new: {
    label: 'New',
    lines: [
      'A new kind? Answer once, check “from now on”, and I’ll remember.',
      'A shop’s newsletters and its receipts are two kinds.',
    ],
  },
  decided: {
    label: 'Already decided',
    lines: [
      'Your rules already cover these. Check the list, then confirm once.',
      'A starred message never goes into a batch.',
    ],
  },
  overview: {
    label: 'Overview',
    lines: [
      'What needs you, what is new, what is decided: one glance.',
      'Your accounts and the rules you taught, right beside them.',
    ],
  },
  accounts: {
    label: 'Every account',
    lines: [
      'Every account in one report, each in its own hue.',
      'Gmail too, with an app password.',
    ],
  },
  mac: {
    label: 'On your Mac',
    lines: [
      'Your mail, your rules, your decisions: all on this Mac.',
      'The model runs here too, and no server ever holds a message.',
    ],
  },
  faq: {
    label: 'FAQ',
    lines: [
      'Free, with no account to create.',
      'I write no mail: reply in the mail app you already use.',
    ],
  },
} as const satisfies Record<string, Lines>;

export type GuideSection = keyof typeof SECTION_LINES;

/** The attribute that marks a section the envelope speaks for. */
export const SECTION_ATTRIBUTE = 'data-guide-section';

/** What the envelope says for a section, or for the morning when there is none. */
export function linesFor(section: GuideSection | null): Lines {
  return section ? SECTION_LINES[section] : MORNING;
}
