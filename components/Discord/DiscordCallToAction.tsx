import { IconBrandDiscordFilled } from '@tabler/icons-react';
import { Badge, Button, Container, Text, Title } from '@mantine/core';
import config from '@/config';
import { DISCORD_BLURPLE, discordLinkProps } from './discord';
import { isRecent } from './recent';
import classes from './DiscordCallToAction.module.css';

/**
 * The home page's invitation to the Discord server (Undolog's: Vicenda shares
 * it with its sibling apps), right under the FAQ: the question the FAQ did not
 * answer is the reason to come. A card in the footer's glass, lit from one
 * corner in Discord's blurple; nothing in it moves at rest.
 */
export function DiscordCallToAction() {
  const justOpened = isRecent(config.community.discordSince, config.app.version);
  return (
    <Container size="lg" pb={{ base: 20, sm: 30 }}>
      <section className={classes.card} aria-labelledby="discord-cta-title">
        <div className={classes.mark} aria-hidden>
          <IconBrandDiscordFilled size={34} />
        </div>
        <div className={classes.copy}>
          <div className={classes.heading}>
            <Title order={2} id="discord-cta-title" fz={{ base: 26, sm: 32 }} fw={500}>
              <span className="display">Join the community on Discord</span>
            </Title>
            {justOpened && (
              <Badge size="sm" radius="sm" variant="filled" color={DISCORD_BLURPLE}>
                Just opened
              </Badge>
            )}
          </div>
          <Text c="dimmed" lh={1.6} mt={6}>
            A question the FAQ doesn&apos;t answer, a bug to talk through, an idea for the next
            release: bring it to the Discord where Vicenda and its sibling apps live, vote on what
            comes next, and talk directly with the maker.
          </Text>
        </div>
        <Button
          component="a"
          {...discordLinkProps}
          size="lg"
          radius="xl"
          color={DISCORD_BLURPLE}
          leftSection={<IconBrandDiscordFilled size={20} />}
          className={classes.button}
        >
          Join the Discord
        </Button>
      </section>
    </Container>
  );
}
