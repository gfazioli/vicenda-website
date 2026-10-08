import type { ReactNode } from 'react';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { MantineProvider } from '@mantine/core';
import { FAQ_ENTRIES } from '@/components/StructuredData/StructuredData';
import { theme } from '@/theme';
import { FAQ, faqItems } from './FAQ';

/** An answer as the page shows it: plain text, the provider's style tag dropped. */
function visibleText(answer: ReactNode) {
  if (typeof answer === 'string') return answer;
  return renderToStaticMarkup(<MantineProvider theme={theme}>{answer}</MantineProvider>)
    .replace(/<style[^>]*>[\s\S]*?<\/style>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * The FAQ JSON-LD in StructuredData.tsx is a plain-text mirror of the visible
 * accordion, and Google requires the two to match. These pin them together
 * (findergit.app's FAQ test, ported with the community question).
 */
describe('FAQ and its JSON-LD mirror', () => {
  it('ask the same questions in the same order', () => {
    expect(FAQ_ENTRIES.map((e) => e.question)).toEqual(faqItems.map((i) => i.question));
  });

  it('give every answer the page gives, word for word', () => {
    // The mirror leaves out an answer's trailing link ("Download it.", "How
    // that works."), so it is a PREFIX of the visible text, not equal to it:
    // measured 2026-10-08, three answers end that way and the rest match whole.
    faqItems.forEach((item, i) => {
      expect(visibleText(item.answer).startsWith(FAQ_ENTRIES[i].answer)).toBe(true);
    });
  });
});

/**
 * The defect lived on the SERVER, so this renders there. Mantine 9 keeps a
 * closed panel in a React <Activity>, which the server renders as nothing: the
 * page Google fetched carried every question and no answer. A jsdom `render`
 * cannot see it -- on the client a hidden Activity still mounts its children.
 * No `env="test"` either, because that switches Mantine's Collapse to a
 * different branch than the one the site runs.
 */
describe('FAQ server render', () => {
  it('carries every answer in the HTML, not only the questions', () => {
    const html = renderToString(
      <MantineProvider theme={theme}>
        <FAQ />
      </MantineProvider>
    );
    const plain = faqItems.filter((i) => typeof i.answer === 'string');
    expect(plain.length).toBeGreaterThan(5);
    for (const { answer } of plain) {
      // The opening words: no quote or ampersand, which renderToString escapes.
      const opening = (answer as string).split(/['"&]/)[0].slice(0, 40);
      expect(html).toContain(opening);
    }
  });
});
