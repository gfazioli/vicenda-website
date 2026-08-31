import { render, screen } from '@/test-utils';
import { Welcome } from './Welcome';

describe('Welcome component', () => {
  it('renders the hero headline', () => {
    render(<Welcome />);
    // Read the h1's textContent rather than querying for the string.
    //
    // This whole headline lives inside TextAnimate, which wraps it in nested
    // elements, so `getByText` - which only matches an element's OWN text -
    // cannot see it. The assertion this replaces was FinderGit's, copied over
    // when this site was bootstrapped from it: it looked for "Every Git repo.
    // One window.", which appears nowhere here, so `yarn test` had never
    // passed on this repo. FinderGit's version works there only because half
    // of its headline sits outside the animated span.
    const headline = screen.getByRole('heading', { level: 1 });
    expect(headline.textContent).toBe('Your mail is not a list.');
  });
});
