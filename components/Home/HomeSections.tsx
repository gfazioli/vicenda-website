import { type ComponentType, Fragment, type ReactNode } from 'react';
import {
  IconArchiveOff,
  IconCpu,
  IconHandClick,
  IconServerOff,
  type Icon,
} from '@tabler/icons-react';
import { Container, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { Reveal } from '../Motion/Reveal';
import { SectionHeading } from '../SectionHeading/SectionHeading';
import { SectionRule } from '../SectionRule/SectionRule';
import { AccountList, BriefList, DecidedBatches, MailShare, NewRule, TrayLegend } from './Diagrams';
import { OverviewCards } from './OverviewCards';
import classes from './HomeSections.module.css';

/**
 * The home page under the hero, one idea per section, in the order of #43:
 * the problem, then the report the way a morning goes through it (Today, In
 * brief, New, Already decided), then the Overview, the accounts, and where it
 * all runs. Each section says one thing and shows it in a small diagram drawn
 * from the app's own card (`Diagrams.tsx`); no screenshot, because the app
 * these sections describe has none yet.
 *
 * EVERY CLAIM IS THE APP'S CODE, not its plan: the file each one rests on is
 * named beside it in `SECTIONS`. Where the code has not landed something yet (a
 * decision reaching the server of a Gmail account), the copy says so or says
 * nothing.
 */
/** One section: its heading, and the diagram that shows it. */
interface Section {
  /** The anchor the bar links to, where it has one. */
  id?: string;
  eyebrow: string;
  title: string;
  lead: string;
  /** The diagram's column, no wider than it reads at; none for a full grid. */
  width?: number;
  Diagram: ComponentType;
  /** The diagram reveals its own parts, so it is not wrapped in a `Reveal`. */
  ownReveal?: boolean;
}

const SECTIONS: Section[] = [
  {
    // The figures are the owner's own mail (the brief's Gate 0, measured on
    // the local store: about 97% bulk, about one a day needing a reply), said
    // as his, not as a statistic about everyone's.
    id: 'how-it-works',
    eyebrow: 'The problem',
    title: 'Mail is messages, not conversations.',
    lead: 'Vicenda began with one person’s seven mailboxes, where about 97 messages in 100 come from machines and fewer than one a day needs a reply. Reading each as a conversation is the work it takes away.',
    width: 760,
    Diagram: MailShare,
  },
  {
    // `SortingTable.swift`: drag, buttons or a tray click record one
    // decision; Later until 08:00 the next day (`ReportDecision.swift`).
    eyebrow: 'Today',
    title: 'Sort it the way you sort the post.',
    lead: 'To do and New arrive as a hand of cards: two face up, the rest stacked beneath. Drag a card into a tray or answer with its buttons, and the next one rises. Later puts a mail back in the hand at eight the next morning.',
    width: 980,
    Diagram: TrayLegend,
  },
  {
    // `BriefRow`, `MorningReportModel`: the line, and the mail's fate.
    eyebrow: 'In brief',
    title: 'One line, and the mail can go.',
    lead: 'The news, a rate, a post’s numbers, an alert: each informational mail becomes one line in the report, and the mail itself goes to the Bin, or waits until tomorrow when it is the day’s news.',
    width: 820,
    Diagram: BriefList,
  },
  {
    // `NewCard`, `FromNowOnControls`, `RuleCoverage.line` in `KindRule.swift`.
    eyebrow: 'New',
    title: 'One kind at a time. Then, from now on.',
    lead: 'A kind is a sender plus what it sends: a shop’s newsletters and its receipts are two kinds. Vicenda proposes an answer, and with “from now on” checked your yes becomes a rule. The card says what that rule will cover: widen it to everything from the sender, and keep it to this account or give it to every account.',
    width: 720,
    Diagram: NewRule,
  },
  {
    // `DecidedSection`, `BatchCard`; the starred guard is the report's.
    eyebrow: 'Already decided',
    title: 'One confirmation for what you already know.',
    lead: 'Mail your rules already cover is gathered into batches, each handled the way its rule says. Leave a sender out with a click, open the list to check, then confirm them all at once. A starred message never goes into a batch.',
    width: 760,
    Diagram: DecidedBatches,
  },
  {
    // `OverviewModel.swift`: the six figures and their captions.
    eyebrow: 'Overview',
    title: 'The whole morning, in six cards.',
    lead: 'What needs you, what is left to read, what is new, what is already decided, and beside them your accounts and the rules you have taught. Each in its own colour, as in the app.',
    width: 900,
    Diagram: OverviewCards,
    ownReveal: true,
  },
  {
    // The account wizard, `AccountFacts.transport`, the Together / By
    // account switch.
    eyebrow: 'Every account',
    title: 'Every account, one report.',
    lead: 'Any mailbox that speaks IMAP, Gmail included: Gmail through an app password, which Google lets you make once 2-Step Verification is on. Each account wears its own hue and monogram, and By account splits the report when you want them apart.',
    width: 680,
    Diagram: AccountList,
  },
  {
    eyebrow: 'On your Mac',
    title: 'It all happens here.',
    lead: 'Vicenda keeps your mail, your rules and your decisions on your Mac, and runs no server of its own.',
    Diagram: OnYourMac,
    ownReveal: true,
  },
];

export function HomeSections() {
  return SECTIONS.map(({ id, eyebrow, title, lead, width, Diagram, ownReveal }) => {
    const diagram = ownReveal ? (
      <Diagram />
    ) : (
      <Reveal variant="rise">
        <Diagram />
      </Reveal>
    );
    return (
      <Fragment key={eyebrow}>
        <SectionRule />
        <Band id={id}>
          <SectionHeading eyebrow={eyebrow} title={title} lead={lead} />
          {width ? <Stage width={width}>{diagram}</Stage> : diagram}
        </Band>
      </Fragment>
    );
  });
}

/** A section of the page: its anchor, its air, and the column it reads in. */
export function Band({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <Container id={id} size="lg" className={classes.band}>
      {children}
    </Container>
  );
}

/** The diagram's column, centred, no wider than it reads at. */
function Stage({ width, children }: { width: number; children: ReactNode }) {
  return (
    <div className={classes.stage} style={{ maxWidth: width }}>
      {children}
    </div>
  );
}

/*
 * Each promise, and the code that keeps it (Vicenda, feat/report-core):
 * - the model: one is required (Vicenda#155: Apple Intelligence when the Mac
 *   has it, else a banner to choose one in Settings); `ModelCatalog.swift`
 *   (built into macOS 26, or a download checked against a hash in the app);
 * - no server: `ImapConnection.swift` (TLS to the provider, port 993), and
 *   no analytics, crash reporting or cloud AI anywhere in the code;
 * - the mailbox left as it is: `reportDecisionsTravel` is false for every
 *   account (`Overview.swift`), and IMAP can only change read/unread, with
 *   both switches off by default (`ImapCommand.swift`, `AppSettings.swift`);
 * - nothing sent: no composer, no sending, and `UnsubscribeSender` has no
 *   caller.
 */
const PROMISES: { icon: Icon; title: string; body: string }[] = [
  {
    icon: IconCpu,
    title: 'The model runs on the Mac.',
    body: 'Vicenda needs one model, and it runs here: Apple Intelligence, built into macOS 26, or a model you download once from Settings. It reads your mail where it already is, and nowhere else.',
  },
  {
    icon: IconServerOff,
    title: 'No server ever holds a message.',
    body: 'Mail comes from your provider straight to your Mac, over an encrypted connection. No account to create, no telemetry.',
  },
  {
    icon: IconArchiveOff,
    title: 'Your mailbox stays as it is.',
    body: 'Every decision is recorded in Vicenda, on your Mac. Nothing is moved or deleted on your provider’s server; carrying decisions there is still to come.',
  },
  {
    icon: IconHandClick,
    title: 'Nothing goes out on its own.',
    body: 'Vicenda writes no mail. Bin and unsubscribe records your wish; the unsubscribe itself is not sent yet, and when it is, it will go only on your click or a rule you taught.',
  },
];

/** On your Mac: four promises the code keeps. */
function OnYourMac() {
  return (
    <SimpleGrid
      cols={{ base: 1, sm: 2 }}
      spacing={{ base: 28, sm: 40 }}
      className={classes.promises}
    >
      {PROMISES.map(({ icon: PromiseIcon, title, body }, i) => (
        <Reveal key={title} variant="rise" delay={i * 60}>
          <Stack gap={8}>
            <span className={classes.promiseIcon} aria-hidden="true">
              <PromiseIcon size={20} stroke={1.7} />
            </span>
            <Title order={3} ff="text" fz={19} fw={600} lh={1.3}>
              {title}
            </Title>
            <Text c="dimmed" fz={16} lh={1.6}>
              {body}
            </Text>
          </Stack>
        </Reveal>
      ))}
    </SimpleGrid>
  );
}
