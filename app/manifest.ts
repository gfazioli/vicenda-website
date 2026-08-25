import type { MetadataRoute } from 'next';
import config from '@/config';

/**
 * Web app manifest. Adds the mobile/PWA install signal that was missing and
 * puts the previously-orphaned `android-chrome-*` icons to use. Both colours
 * are taken from the app rather than picked for the web: the theme colour is
 * the blue sampled out of the app icon, the background is the message stream's
 * own ground.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Vicenda — A Mac mail client that is not a list',
    short_name: 'Vicenda',
    description: config.metadata.description,
    start_url: '/',
    display: 'standalone',
    // The app's own: `#0056C7` is the icon's blue, `#1A181E` is the stream
    // ground from `Tokens.swift`. Neither is a value chosen for the web.
    theme_color: '#0056C7',
    background_color: '#1A181E',
    // `any` only: the android-chrome icons have no maskable safe-zone
    // padding, so declaring them `maskable` would crop the corners on
    // shaped Android launchers. A dedicated padded asset can add maskable
    // later if Android PWA install ever matters (this is a macOS app site).
    icons: [
      { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  };
}
