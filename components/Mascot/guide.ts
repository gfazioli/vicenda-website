/**
 * What the envelope remembers, for the life of the page. It is one character
 * in three places -- under the hero's sorting table (`HeroGuide`), in the
 * corner of the window as the page scrolls, and on the footer's Support card
 * (both `ScrollGuide`) -- so sending it away from one sends it away from all
 * three. Ported from netfox.app's `guide.ts`, whose fox works the same way.
 *
 * Module state survives a client navigation and is gone on a reload: once
 * dismissed it does not come back when the reader returns to the home page
 * through a link, and a reload brings it back, as lancetta.app's,
 * findergit.app's and netfox.app's do (user, 2026-09-24, on lancetta.app:
 * "facciamolo apparire sempre ad ogni reload della pagina").
 */
export const guideMemory = {
  dismissed: false,
  /** The last line of the hero's morning it said, in any of its places; -1 before the first. */
  said: -1,
};

/**
 * The next line of the morning to say, wherever the envelope is: one
 * character, so the one in the corner goes on from where the one under the
 * table stopped rather than starting over.
 */
export function sayNext(count: number) {
  guideMemory.said = (guideMemory.said + 1) % count;
  return guideMemory.said;
}

const dismissedListeners = new Set<() => void>();

/** Sends the envelope away from every place it is, for the rest of the page's life. */
export function dismissGuide() {
  guideMemory.dismissed = true;
  dismissedListeners.forEach((listener) => listener());
}

/** Called when the envelope is dismissed anywhere. Returns the unsubscribe. */
export function onGuideDismissed(listener: () => void) {
  dismissedListeners.add(listener);
  return () => {
    dismissedListeners.delete(listener);
  };
}
