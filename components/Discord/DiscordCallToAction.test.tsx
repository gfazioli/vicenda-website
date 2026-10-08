import { render, screen } from '@/test-utils';
import config from '@/config';
import { DiscordCallToAction } from './DiscordCallToAction';
import { isRecent } from './recent';

describe('DiscordCallToAction', () => {
  it('names the community in a heading and links to the invite in a new tab', () => {
    render(<DiscordCallToAction />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Join the community on Discord'
    );
    const link = screen.getByRole('link', { name: /join the discord/i });
    expect(link).toHaveAttribute('href', config.community.discord);
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('says "Just opened" exactly while isRecent holds for the config', () => {
    render(<DiscordCallToAction />);
    const shown = screen.queryByText('Just opened') !== null;
    expect(shown).toBe(isRecent(config.community.discordSince, config.app.version));
    // And today it does: the server opened with the app at its current version.
    expect(shown).toBe(true);
  });
});

describe('isRecent', () => {
  it('holds for two minor releases, then lets go', () => {
    expect(isRecent('0.3.0', '0.3.0')).toBe(true);
    expect(isRecent('0.3.0', '0.5.2')).toBe(true);
    expect(isRecent('0.3.0', '0.6.0')).toBe(false);
  });

  it('is never recent across a major, nor ahead of the app', () => {
    expect(isRecent('0.3.0', '1.0.0')).toBe(false);
    expect(isRecent('0.4.0', '0.3.0')).toBe(false);
  });
});
