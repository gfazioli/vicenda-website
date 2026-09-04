import { IconMail } from '@tabler/icons-react';
import { Anchor, Button, Stack, Text, Title } from '@mantine/core';

/**
 * The shared newsletter call-to-action (heading + blurb + Subscribe button),
 * used both in the footer band (`NewsletterSignup`) and the scroll-triggered
 * popup (`NewsletterModal`), so the copy and the link stay in one place.
 *
 * Links to the Vicenda Substack publication, which hosts the subscribe form —
 * the same shape as the FinderGit and Netfox sites, and for the same reason:
 * nothing here collects an address, so there is nothing here to run.
 *
 * This used to be a download prompt, from the days when the site said "no
 * newsletter and no list". There is a list now, for release news only, and
 * the download keeps its own button in the hero and the honest paragraph.
 */
export function NewsletterCallToAction() {
  return (
    <Stack gap="xs" align="center">
      <Title order={3} ta="center" className="display" fw={500}>
        Get release updates
      </Title>
      <Text c="dimmed" ta="center" size="sm" maw={420}>
        New version of Vicenda? Be the first to know — straight to your inbox. Release news only,
        and you can leave whenever you like.
      </Text>
      <Button
        component="a"
        href="https://vicenda.substack.com"
        target="_blank"
        rel="noopener noreferrer"
        leftSection={<IconMail size={16} />}
        radius="xl"
        mt="xs"
      >
        Subscribe for updates
      </Button>
      <Text c="dimmed" ta="center" size="xs">
        Just want the app?{' '}
        <Anchor href="/download" size="xs">
          Download for macOS
        </Anchor>
        .
      </Text>
    </Stack>
  );
}
