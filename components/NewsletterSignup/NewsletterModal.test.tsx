import { act, render, screen, waitFor } from '@/test-utils';
import { NewsletterModal } from './NewsletterModal';

describe('NewsletterModal', () => {
  beforeEach(() => {
    localStorage.clear();
    (window as { scrollY: number }).scrollY = 0;
  });

  it('is a dialog with a name of its own, and so is the button the focus lands on', async () => {
    render(<NewsletterModal />);
    (window as { scrollY: number }).scrollY = 1300;
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    expect(await screen.findByRole('dialog')).toHaveAccessibleName(
      'Subscribe to the Vicenda newsletter'
    );
    // Mantine moves the focus in on a timer of its own.
    await waitFor(() => expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus());
  });
});
