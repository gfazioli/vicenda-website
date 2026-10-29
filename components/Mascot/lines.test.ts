import { overview } from '../Home/home-data';
import { linesFor, MORNING, SECTION_LINES } from './lines';

const figure = (key: (typeof overview)[number]['key']) =>
  overview.find((card) => card.key === key)!;

describe('what the envelope says', () => {
  it('tells the morning the Overview’s cards count', () => {
    // The page draws one invented morning; the envelope must not tell
    // another. Change a figure there and this fails until the line follows.
    const [hello, decided] = MORNING.lines;
    expect(hello).toBe(
      `Good morning. ${figure('todo').value} to do, ${figure('brief').value} ${figure('brief').caption}.`
    );
    expect(decided).toBe(
      `${figure('decided').value} already decided: ${figure('decided').caption}.`
    );
  });

  it('says the morning above the first section, and each section’s own below', () => {
    expect(linesFor(null)).toBe(MORNING);
    expect(linesFor('today')).toBe(SECTION_LINES.today);
  });

  it('keeps every line to one sentence or two a bubble can hold', () => {
    // The corner's bubble is 260px at most: about two rows of 13px type for
    // 64 characters; past that it starts to cover the page it rides over.
    for (const { label, lines } of [MORNING, ...Object.values(SECTION_LINES)]) {
      expect(label.length).toBeGreaterThan(0);
      expect(lines.length).toBeGreaterThan(0);
      for (const line of lines) {
        expect([label, line.length <= 66]).toEqual([label, true]);
      }
    }
  });

  it('names no cloud AI, no download and no version', () => {
    // AGENTS.md: no cloud AI, no download link until the next version, no
    // version number in copy.
    const all = [MORNING, ...Object.values(SECTION_LINES)]
      .flatMap(({ label, lines }) => [label, ...lines])
      .join('\n');
    expect(all).not.toMatch(/claude|anthropic|openai|cloud|download|\bv?\d+\.\d+/i);
  });
});
