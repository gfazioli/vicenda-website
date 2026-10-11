import bundleAnalyzer from '@next/bundle-analyzer';
import nextra from 'nextra';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withNextra = nextra({
  // No `latex`: nothing on the site is math, and with it on, two dollar signs
  // in the same paragraph of prose would be typeset as an equation.
  search: {
    codeblocks: false
  },
  contentDirBasePath: '/docs',
})

export default withNextra(
  withBundleAnalyzer({
    reactStrictMode: false,
    cleanDistDir: true,
    // AVIF first, WebP for a browser that cannot take it. A browser asks for
    // one format, so the image transformations Vercel bills move to AVIF
    // rather than double; the first request for each one takes longer to
    // encode.
    images: {
      formats: ['image/avif', 'image/webp'],
    },
    experimental: {
      optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
    },
    turbopack: {
      rules: {
        '*.svg': {
          loaders: ['turbopack-inline-svg-loader'],
          condition: {
            content: /^[\s\S]{0,4000}$/, // <-- Inline SVGs smaller than ~4Kb (since Next.js v16)
          },
          as: '*.js',
        },
      },
    },
  }));
