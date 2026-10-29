'use client';

import type { CSSProperties } from 'react';
import {
  IconAlignLeft,
  IconCircleCheckFilled,
  IconInbox,
  IconListDetails,
  IconSparkles,
  IconUsers,
} from '@tabler/icons-react';
import { revealItem, revealScope } from '../Motion/Reveal';
import { useReveal } from '../Motion/useReveal';
import { type OverviewKey, overview } from './home-data';
import classes from './Diagrams.module.css';

/*
 * The one diagram with a hook of its own (`useReveal`, for its cards'
 * staggered landing), so the one in a client file: the others are drawn on
 * the server and ship no script.
 */

const OVERVIEW_ICONS: Record<OverviewKey, typeof IconSparkles> = {
  todo: IconCircleCheckFilled,
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
            style={{ ...item.style, '--tint': `var(--vic-${figure.key})` } as CSSProperties}
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
