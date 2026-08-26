import { IconDownload } from '@tabler/icons-react';
import { Button, Stack, Text, Title } from '@mantine/core';

import config from '@/config';

/**
 * The shared call-to-action, used both in the footer band
 * (`NewsletterSignup`) and the scroll-triggered popup (`NewsletterModal`), so
 * the copy and the link stay in one place.
 *
 * **There is no newsletter and no list.** The template this site came from
 * asks for an email address here; Vicenda asks for nothing and hands over the
 * file. A form that collects an address it has nowhere to put is the kind of
 * control this project treats as worse than an absent one.
 */
export function NewsletterCallToAction() {
  return (
    <Stack gap="xs" align="center">
      <Title order={3} ta="center" className="display" fw={500}>
        Want to try it?
      </Title>
      <Text c="dimmed" ta="center" size="sm" maw={420}>
        Free, and it needs macOS {config.app.minMacOS} or later. No account, no list, nothing to
        sign up to.
      </Text>
      <Button
        component="a"
        href="/download"
        leftSection={<IconDownload size={16} />}
        radius="xl"
        mt="xs"
      >
        Download for macOS
      </Button>
    </Stack>
  );
}
