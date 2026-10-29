import { renderToString } from 'react-dom/server';
import { MascotNote } from './MascotNote';
import { PALETTE } from './sprite';

/**
 * Rendered to a string, as the server sends it: what a crawler and a page
 * without JavaScript get is the point of a note that carries real text.
 */
describe('MascotNote', () => {
  it('serves its words as page text, and the drawing as decoration', () => {
    const html = renderToString(
      <MascotNote label="Welcome">
        <p>
          New here? <a href="/#how-it-works">How it works</a>
        </p>
      </MascotNote>
    );
    expect(html).toContain('<aside');
    expect(html).toContain('aria-label="Welcome"');
    expect(html).toContain('New here? <a href="/#how-it-works">How it works</a>');
    expect(html).toMatch(/<svg[^>]*aria-hidden="true"/);
  });

  it('stands on the side it is given, and raises its hand only when asked', () => {
    const right = renderToString(
      <MascotNote side="right" pointing>
        <p>Tip</p>
      </MascotNote>
    );
    const left = renderToString(
      <MascotNote>
        <p>Tip</p>
      </MascotNote>
    );
    expect(right).toContain('data-side="right"');
    expect(left).toContain('data-side="left"');
    // The raised hand is the only pearl drawn at the sprite's left edge.
    const hand = `<rect x="0" y="5" width="2" height="1" fill="${PALETTE.P}"`;
    expect(right).toContain(hand);
    expect(left).not.toContain('<rect x="0" y="5"');
  });

  it('draws the eyes open: no blink without a stylesheet to end it', () => {
    // `SpriteSvg` draws the shut eyes only for a caller that passes the class
    // that hides them between blinks; the note has none, so they would stay shut.
    const html = renderToString(
      <MascotNote>
        <p>Tip</p>
      </MascotNote>
    );
    expect(html).not.toContain('<g');
  });
});
