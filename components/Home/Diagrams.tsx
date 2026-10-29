'use client';

import type { CSSProperties } from 'react';
import {
  IconAlignLeft,
  IconArrowRight,
  IconCheck,
  IconChevronDown,
  IconCircleCheckFilled,
  IconHandGrab,
  IconInbox,
  IconListDetails,
  IconSparkles,
  IconUsers,
} from '@tabler/icons-react';
import {
  AccountTile,
  CardShell,
  CardTitle,
  FromNowOn,
  TOOL_ICONS,
  ToolChip,
  mailCardClasses as card,
} from '../MailCard/MailCard';
import { revealItem, revealScope } from '../Motion/Reveal';
import { useReveal } from '../Motion/useReveal';
import {
  type OverviewKey,
  accounts,
  brief,
  coverage,
  decided,
  doneReading,
  ghost,
  newKind,
  overview,
  trayLegend,
} from './home-data';
import classes from './Diagrams.module.css';

/*
 * The diagrams under the hero: pieces of the app drawn in HTML, from the same
 * card the hero's table uses (`MailCard`). Each is ONE image to assistive
 * technology (`role="img"` with a description): its words are a picture of a
 * screen. Everything in them is invented (`home-data.ts`).
 */

/** "About 97 in 100 from machines": a hundred squares, the last three lit. */
export function MailShare() {
  return (
    <div
      className={classes.share}
      role="img"
      aria-label="A hundred squares, one per message: ninety-seven sent by machines, three the rest."
    >
      <div className={classes.shareGrid}>
        {Array.from({ length: 100 }, (_, i) => (
          <span key={i} className={classes.shareCell} data-person={i >= 97 ? '' : undefined} />
        ))}
      </div>
      <div className={classes.shareLegend}>
        <span>
          <span className={classes.shareSwatch} />
          97 sent by machines
        </span>
        <span>
          <span className={classes.shareSwatch} data-person="" />3 the rest
        </span>
      </div>
    </div>
  );
}

/** Today's trays with what each does, and a card being dragged toward one. */
export function TrayLegend() {
  return (
    <div
      className={classes.legend}
      role="img"
      aria-label="Today's trays. On the left, to let mail go: Bin; Bin and unsubscribe; Later, back in the hand tomorrow. On the right, to keep it: a label, or To do. A card is being dragged into Later."
    >
      <LegendSide title="Let go" trays={trayLegend.letGo} />
      <div className={classes.ghostStage}>
        <div className={classes.ghost}>
          <CardShell accounts={[ghost.account]}>
            <div className={card.body}>
              <div className={card.titleRow}>
                <AccountTile account={ghost.account} />
                <span className={card.sender}>{ghost.sender}</span>
              </div>
              <p className={classes.ghostSubject}>{ghost.subject}</p>
              <span className={classes.landing}>
                <IconArrowRight size={12} stroke={2.4} aria-hidden="true" />
                {ghost.landing}
              </span>
            </div>
          </CardShell>
        </div>
        <p className={classes.ghostNote}>
          <IconHandGrab size={14} stroke={2} aria-hidden="true" />
          Drag a card, or answer with its buttons.
        </p>
      </div>
      <LegendSide title="Keep" trays={trayLegend.keep} />
    </div>
  );
}

function LegendSide({
  title,
  trays,
}: {
  title: string;
  trays: readonly { title: string; sub?: string; icon: keyof typeof TOOL_ICONS }[];
}) {
  return (
    <div className={classes.legendSide}>
      <p className={classes.caption}>{title}</p>
      {trays.map((tray) => {
        const Icon = TOOL_ICONS[tray.icon];
        return (
          <div
            key={tray.title}
            className={classes.tray}
            data-target={tray.title === ghost.landing ? '' : undefined}
          >
            <span className={classes.trayHead}>
              <Icon size={14} stroke={2} aria-hidden="true" />
              {tray.title}
            </span>
            {tray.sub && <span className={classes.traySub}>{tray.sub}</span>}
          </div>
        );
      })}
    </div>
  );
}

/** In brief: one line per informational mail, and where the mail goes. */
export function BriefList() {
  return (
    <div
      role="img"
      aria-label="In brief: four lines, one from each informational mail, each with where its mail goes: three to the Bin, the day's news kept until tomorrow."
    >
      <CardShell accounts={[]}>
        {brief.map((row) => (
          <div key={row.source} className={classes.briefRow}>
            <span className={classes.briefSource}>
              <AccountTile account={row.account} size="small" />
              {row.source}
            </span>
            <span className={classes.briefLine}>{row.line}</span>
            <span className={classes.briefFate}>{row.fate}</span>
          </div>
        ))}
        <div className={card.foot}>
          <span className={`${card.tool} ${classes.wrapTool}`} data-primary="">
            <IconCheck size={13} stroke={2.4} aria-hidden="true" />
            {doneReading}
          </span>
        </div>
      </CardShell>
    </div>
  );
}

/** A New card, its rule switched on, and the coverage menu open under it. */
export function NewRule() {
  return (
    <div
      className={classes.newRule}
      role="img"
      aria-label={`A New card for three mails from Northwind Updates, proposing Bin and unsubscribe, with "from now on" checked: the rule will cover ${coverage.chosen}, ${coverage.scope}. Its menu offers to widen it to every mail from the sender.`}
    >
      <CardShell accounts={[newKind.account]}>
        <div className={card.body}>
          <CardTitle {...newKind} />
          <div className={classes.preview}>
            {newKind.preview.map((line) => (
              <span key={line}>{line}</span>
            ))}
            <span className={classes.faint}>{newKind.more}</span>
          </div>
        </div>
        <div className={`${card.foot} ${classes.footStack}`}>
          <span className={card.tools}>
            <ToolChip tool={{ label: 'Bin and unsubscribe', icon: 'unsubscribe', primary: true }} />
            <ToolChip tool={{ label: 'Bin', icon: 'bin' }} />
            <ToolChip tool={{ label: 'Later', icon: 'later' }} />
          </span>
          <span className={classes.ruleRow}>
            <FromNowOn />
            <span className={classes.menuButton} data-open="">
              {coverage.chosen}
              <IconChevronDown size={11} stroke={2.4} aria-hidden="true" />
            </span>
            <span className={classes.menuButton}>
              {coverage.scope}
              <IconChevronDown size={11} stroke={2.4} aria-hidden="true" />
            </span>
          </span>
        </div>
      </CardShell>
      <div className={classes.menu}>
        {coverage.options.map((option, i) => (
          <span key={option} className={classes.menuItem}>
            <span className={classes.menuTick}>
              {i === 0 && <IconCheck size={12} stroke={2.4} aria-hidden="true" />}
            </span>
            {option}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Already decided: one confirmation over the batches, a sender left out. */
export function DecidedBatches() {
  return (
    <div
      className={classes.decided}
      role="img"
      aria-label="Already decided: two batches of mail the rules already know, twenty-three mails in all, with one sender left out and a single Confirm all."
    >
      <div className={classes.decidedHead}>
        <span className={card.tool} data-primary="">
          <IconCircleCheckFilled size={13} aria-hidden="true" />
          {decided.confirmAll}
        </span>
        <span className={classes.groundNote}>{decided.note}</span>
      </div>
      {decided.batches.map((batch) => (
        <CardShell key={batch.title} accounts={batch.accounts}>
          <div className={card.body}>
            <div className={classes.batchTitle}>
              {batch.accounts.map((account) => (
                <AccountTile key={account.monogram} account={account} />
              ))}
              <span className={classes.batchName}>{batch.title}</span>
              <span className={classes.batchSub}>{batch.sub}</span>
            </div>
            <div className={classes.senders}>
              {batch.senders.map((sender) => (
                <span
                  key={sender.name}
                  className={classes.senderChip}
                  data-out={'out' in sender && sender.out ? '' : undefined}
                >
                  {sender.name}
                  {'count' in sender && sender.count && (
                    <span className={classes.faint}>{sender.count}</span>
                  )}
                  {'note' in sender && sender.note && (
                    <span className={classes.faint}>{sender.note}</span>
                  )}
                </span>
              ))}
            </div>
            <div className={classes.batchHint}>
              <span>Click a sender to leave it out: it stays in the inbox.</span>
              <span className={card.tool}>
                <IconChevronDown size={12} stroke={2.4} aria-hidden="true" />
                {batch.showMail}
              </span>
            </div>
          </div>
          <div className={card.foot}>
            <span className={card.tool}>
              <IconCheck size={13} stroke={2.4} aria-hidden="true" />
              {batch.confirm}
            </span>
          </div>
        </CardShell>
      ))}
    </div>
  );
}

const OVERVIEW_ICONS: Record<OverviewKey, typeof IconSparkles> = {
  toDo: IconCircleCheckFilled,
  brief: IconAlignLeft,
  new: IconSparkles,
  decided: IconInbox,
  accounts: IconUsers,
  rules: IconListDetails,
};

/**
 * The Overview's six cards, each in its section's vivid colour
 * (`Palette.Section`, `VividGlass`). They land as cards do on the sibling
 * sites (`Reveal`'s morph, one after another), once, on the way into view.
 */
export function OverviewCards() {
  const reveal = useReveal<HTMLDivElement>();
  const scope = revealScope(reveal);
  return (
    <div
      ref={reveal.ref}
      {...scope}
      className={`${scope.className} ${classes.overview}`}
      role="img"
      aria-label="The Overview's six cards: To do, 2 need you; In brief, 4 lines to read; New, 3 kinds in 8 mails; Already decided, 23 in one confirmation; Accounts, 3, all local only; Rules, 41, 4 learned today."
    >
      {overview.map((figure, i) => {
        const Icon = OVERVIEW_ICONS[figure.key];
        const item = revealItem('morph', i * 70);
        return (
          <div
            key={figure.key}
            {...item}
            className={`${item.className} ${classes.vivid}`}
            style={
              { ...item.style, '--tint': `var(--vic-${sectionToken(figure.key)})` } as CSSProperties
            }
          >
            <Icon size={18} aria-hidden="true" />
            <span className={classes.vividValue}>{figure.value}</span>
            <span className={classes.vividTitle}>{figure.title}</span>
            <span className={classes.vividCaption}>{figure.caption}</span>
          </div>
        );
      })}
    </div>
  );
}

function sectionToken(key: OverviewKey) {
  return key === 'toDo' ? 'todo' : key;
}

/** Every account in one report: its hue, its monogram, how it is read. */
export function AccountList() {
  return (
    <div
      className={classes.accounts}
      role="img"
      aria-label="Three accounts in one report, each with its own hue and monogram: a Gmail account and two other accounts, all read over IMAP and all local only for now. Above them, the report set to By account."
    >
      {/* `Segmented` in the report's head: Together, or By account. */}
      <div className={classes.segmented}>
        <span>Together</span>
        <span data-on="">By account</span>
      </div>
      {accounts.map((row) => (
        <div key={row.address} className={classes.accountRow}>
          <AccountTile account={row.account} size="large" />
          <span className={classes.accountText}>
            <span className={classes.accountAddress}>{row.address}</span>
            <span className={classes.accountStatus}>
              {row.transport}
              {row.badge && <span className={classes.badge}>{row.badge}</span>}
            </span>
          </span>
          <span className={classes.accountMail}>{row.status}</span>
        </div>
      ))}
    </div>
  );
}
