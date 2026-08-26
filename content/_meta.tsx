import type { ReactNode } from 'react';
import {
  IconArchive,
  IconBook2,
  IconCards,
  IconEyeOff,
  IconHelpCircle,
  IconMessages,
  IconPalette,
  IconRocket,
  IconSettings,
} from '@tabler/icons-react';
import { Group } from '@mantine/core';

// Sidebar entry with a leading icon. The icon inherits `currentColor` when no
// colour is given, so it tracks the link's active/hover state automatically —
// which is why the label stays a bare string: a Mantine `Text` would impose
// its own colour token and break that inheritance.
function nav(Icon: typeof IconBook2, label: string, color?: string): { title: ReactNode } {
  return {
    title: (
      <Group component="span" gap={8} wrap="nowrap" align="center">
        <Icon
          size={16}
          stroke={1.8}
          color={color ? `var(--mantine-color-${color}-6)` : undefined}
        />
        {label}
      </Group>
    ),
  };
}

export default {
  index: nav(IconBook2, 'Introduction', 'vicenda'),
  '---get-started': { type: 'separator', title: 'Get Started' },
  'getting-started': nav(IconRocket, 'Getting Started', 'orange'),
  // THE SHAPE is its own section on purpose: it is the part of Vicenda that is
  // not like other mail clients, and burying it under "Guides" would file the
  // difference as a feature.
  '---the-shape': { type: 'separator', title: 'The Shape' },
  'the-stream': nav(IconMessages, 'Channels and Threads', 'vicenda'),
  cards: nav(IconCards, 'Machine Mail as Cards', 'grape'),
  accounts: nav(IconPalette, 'Accounts and Colour', 'cyan'),
  '---guides': { type: 'separator', title: 'Guides' },
  triage: nav(IconArchive, 'Reading and Triage', 'green'),
  privacy: nav(IconEyeOff, 'Privacy', 'teal'),
  '---reference': { type: 'separator', title: 'Reference' },
  settings: nav(IconSettings, 'Settings'),
  '---resources': { type: 'separator', title: 'Resources' },
  faq: nav(IconHelpCircle, 'FAQ', 'vicenda'),
  'release-notes': '',
};
