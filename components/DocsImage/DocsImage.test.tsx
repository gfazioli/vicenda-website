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
const COLUMN =
  '(max-width: 767px) calc(100vw - 32px), (max-width: 1279px) calc(100vw - 352px), (max-width: 1439px) calc(100vw - 608px), 832px';

function drawn(props: Parameters<typeof DocsImage>[0]) {
  const { container } = render(<DocsImage {...props} />);
  return container.querySelector('img')!;
}

describe('DocsImage', () => {
  it('draws a capture at no more than half its pixel width, and asks for the column', () => {
    const img = drawn({ src: capture, alt: 'The stream' });
    expect(img.style.maxWidth).toBe('min(100%, 1000px)');
    expect(img.dataset.sizes).toBe(COLUMN);
  });

  it('draws a capture narrower than the column at half its width, and asks for that', () => {
    const img = drawn({ src: { ...capture, width: 760, height: 1200 }, alt: 'A crop' });
    expect(img.style.maxWidth).toBe('min(100%, 380px)');
    expect(img.dataset.sizes).toBe('(max-width: 412px) calc(100vw - 32px), 380px');
  });

  it('reads a capture imported as a module the same way', () => {
    const img = drawn({ src: { default: capture }, alt: 'The stream' });
    expect(img.style.maxWidth).toBe('min(100%, 1000px)');
  });

  it('leaves anything that is not a capture as it was', () => {
    const icon = drawn({
      src: { ...capture, src: '/_next/static/media/icon-512x512.png' },
      alt: '',
    });
    expect(icon.style.maxWidth).toBe('');
    expect(icon.dataset.sizes).toBe(COLUMN);

    const remote = drawn({ src: 'https://example.com/screenshot-x.png', alt: '' });
    expect(remote.style.maxWidth).toBe('');
  });

  it('keeps a style passed in, over its own', () => {
    const img = drawn({ src: capture, alt: '', style: { maxWidth: '100%' } });
    expect(img.style.maxWidth).toBe('100%');
  });
});

// The column, measured: the viewport less 32px under 768, less 352px under
// 1280, less 608px above, and never wider than 832px.
describe('docsSizes', () => {
  it('follows the column for a picture as wide as it, or wider', () => {
    expect(docsSizes()).toBe(COLUMN);
    expect(docsSizes(1000)).toBe(COLUMN);
  });

  it('gives a picture narrower than the column its own width', () => {
    expect(docsSizes(380)).toBe('(max-width: 412px) calc(100vw - 32px), 380px');
    expect(docsSizes(600)).toBe(
      '(max-width: 632px) calc(100vw - 32px), (max-width: 767px) 600px, (max-width: 952px) calc(100vw - 352px), 600px'
    );
  });

  it('switches between the column and the picture wherever they cross', () => {
    expect(docsSizes(700)).toBe(
      '(max-width: 732px) calc(100vw - 32px), (max-width: 767px) 700px, (max-width: 1052px) calc(100vw - 352px), (max-width: 1279px) 700px, (max-width: 1308px) calc(100vw - 608px), 700px'
    );
  });
});
