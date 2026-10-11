import type { CSSProperties } from 'react';
import { render } from '@/test-utils';
import { DocsImage, docsSizes } from './DocsImage';

// Nextra ships ESM that Jest does not transform. What is under test is what
// DocsImage hands to ImageZoom, so a stand-in records exactly that.
jest.mock(
  'nextra/components',
  () => ({
    ImageZoom: (props: { alt?: string; sizes?: string; style?: CSSProperties }) => (
      <img alt={props.alt} data-sizes={props.sizes} style={props.style} />
    ),
  }),
  { virtual: true }
);

// A static import, the shape Nextra makes of a Markdown image in `public/`:
// every capture on the site is 2000 px wide.
const capture = {
  src: '/_next/static/media/screenshot-cards.0a1b2c3.png',
  width: 2000,
  height: 1310,
};

/** The whole column, at every width: what a picture as wide as it asks for. */
/** What a picture of unknown width asks for: the whole column. */
const COLUMN = docsSizes();

function drawn(props: Parameters<typeof DocsImage>[0]) {
  const { container } = render(<DocsImage {...props} />);
  return container.querySelector('img')!;
}

describe('DocsImage', () => {
  it('draws a capture as it always was, and asks for the smaller of the column and its width', () => {
    const img = drawn({ src: capture, alt: 'The stream' });
    expect(img.style.maxWidth).toBe('');
    expect(img.dataset.sizes).toBe(docsSizes(2000));
  });

  // Not halved: these captures are about 1.56 px per point, not two.
  it('asks for a narrower picture at its own width, and draws it as it was', () => {
    const img = drawn({ src: { ...capture, width: 760, height: 1200 }, alt: 'A crop' });
    expect(img.style.maxWidth).toBe('');
    expect(img.dataset.sizes).toBe(docsSizes(760));
  });

  it('reads a picture imported as a module the same way', () => {
    const img = drawn({ src: { default: { ...capture, width: 760 } }, alt: 'A crop' });
    expect(img.dataset.sizes).toBe(docsSizes(760));
  });

  it('asks for the column when it cannot know the size', () => {
    const remote = drawn({ src: 'https://example.com/screenshot-x.png', alt: '' });
    expect(remote.dataset.sizes).toBe(COLUMN);
  });
});

// The column, measured: in rem and em, as Nextra lays it out, so that it
// moves with the visitor's default font.
describe('docsSizes', () => {
  it('follows the column for a picture of unknown width', () => {
    expect(docsSizes()).toBe(
      '(max-width: 47.99875em) calc(100vw - 2rem), (max-width: 79.99875em) calc(100vw - 22rem), (max-width: 89.99875em) calc(100vw - 38rem), 52rem'
    );
  });

  it('asks for the smaller of the column and the picture, in each stretch', () => {
    expect(docsSizes(380)).toBe(
      '(max-width: 47.99875em) min(calc(100vw - 2rem), 380px), (max-width: 79.99875em) min(calc(100vw - 22rem), 380px), (max-width: 89.99875em) min(calc(100vw - 38rem), 380px), min(52rem, 380px)'
    );
  });
});
