import type { ReactNode } from 'react';
import { Stack, Text, Title } from '@mantine/core';
import { Reveal } from '../Motion/Reveal';
import classes from './SectionHeading.module.css';

/*
 * One heading for every band of the home page, in two alignments, cross-ported
 * from lancetta.app.
 *
 * `left` is the default and the one the grid sections use: the eyebrow and
 * the title on the left, the lead on the right, both sitting on the same
 * baseline. `center` is for the statement bands, where the copy is the whole
 * section and a split would leave the title talking to an empty column.
 *
 * The title is set in the display face (`.display`), as every heading on this
 * page is. Either way, a heading below the fold when the page loads lifts into
 * place the first time it scrolls into view (`Reveal`, `rise`); one already on
 * screen lifts the same way from the first paint.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = 'left',
  mb = 48,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: 'left' | 'center';
  mb?: number;
}) {
  const eyebrowNode = (
    <Text size="sm" fw={700} tt="uppercase" className={classes.eyebrow}>
      {eyebrow}
    </Text>
  );

  if (align === 'center') {
    return (
      <Reveal variant="rise" style={{ marginBottom: mb }}>
        <Stack align="center" gap="md">
          {eyebrowNode}
          <Title order={2} ta="center" fz={{ base: 32, sm: 42 }} fw={400}>
            <span className="display">{title}</span>
          </Title>
          {lead && (
            <Text c="dimmed" ta="center" size="lg" maw={620} lh={1.6}>
              {lead}
            </Text>
          )}
        </Stack>
      </Reveal>
    );
  }

  return (
    <Reveal variant="rise" className={classes.split} style={{ marginBottom: mb }}>
      <div>
        {eyebrowNode}
        <Title
          order={2}
          fz={{ base: 32, sm: 42 }}
          fw={400}
          lh={1.08}
          mt={10}
          className={classes.title}
        >
          <span className="display">{title}</span>
        </Title>
      </div>
      {lead && (
        <Text c="dimmed" size="lg" lh={1.6} className={classes.lead}>
          {lead}
        </Text>
      )}
    </Reveal>
  );
}
