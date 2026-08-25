import { IconMail } from '@tabler/icons-react';
import { Button, Stack, Text, Title } from '@mantine/core';

/**
 * The shared newsletter call-to-action (heading + blurb + Subscribe button),
 * used both in the footer band (NewsletterSignup) and the scroll-triggered
 * popup (NewsletterModal) so the copy and link stay in one place.
 *
 * Vicenda has no newsletter: the only list is the closed beta, so this asks
 * for that instead of for a subscription. It links to `/beta` rather than
 * carrying a form, which keeps the promise honest — see `components/Beta`.
 */
export function NewsletterCallToAction() {
  return (
    <Stack gap="xs" align="center">
      <Title order={3} ta="center" className="display" fw={500}>
        Want to try it?
      </Title>
      <Text c="dimmed" ta="center" size="sm" maw={420}>
        Vicenda is in closed beta. Leave an address and the disk image comes by email.
      </Text>
      <Button
        component="a"
        href="/beta"
        leftSection={<IconMail size={16} />}
        radius="xl"
        mt="xs"
      >
        Ask for an invite
      </Button>
    </Stack>
  );
}
