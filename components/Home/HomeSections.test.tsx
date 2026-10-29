import { render, screen } from '@/test-utils';
import { Welcome } from '../Welcome/Welcome';
import { accounts, coverage } from './home-data';

describe('the home page under the hero', () => {
  it('draws every diagram as one described picture', () => {
    render(<Welcome />);
    // The hero's table, then the problem, Today, In brief, New, Already
    // decided, the Overview and the accounts.
    const pictures = screen.getAllByRole('img').filter((el) => el.tagName === 'DIV');
    expect(pictures.length).toBe(8);
    for (const picture of pictures) {
      expect(picture.getAttribute('aria-label')?.length).toBeGreaterThan(40);
    }
  });

  it('says nothing the app does not do yet', () => {
    // No decision reaches a server and no unsubscribe is sent (Vicenda's
    // `reportDecisionsTravel`, `UnsubscribeSender`), the app writes no mail,
    // and it is not a mail client: none of it may read as working.
    const { container } = render(<Welcome />);
    const text = container.textContent ?? '';
    expect(text).not.toMatch(/recoverable for 30 days|unsubscribed|mail client/i);
    expect(text).not.toMatch(/claude|anthropic|openai|chatgpt|gemini/i);
    expect(text).toMatch(/Nothing is moved or deleted on your provider’s server/);
    expect(text).toMatch(/the unsubscribe itself is not sent yet/);
  });

  it('shows invented addresses only, on the domain reserved for examples', () => {
    const addresses = [...accounts.map((row) => row.address), ...coverage.options].join(' ');
    const found = addresses.match(/[\w.-]+@[\w.-]+/g) ?? [];
    expect(found.length).toBeGreaterThan(3);
    for (const address of found) {
      expect(address).toMatch(/\.example$/);
    }
  });
});
