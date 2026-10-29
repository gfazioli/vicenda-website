/**
 * Set on <html> while the newsletter prompt is open (`NewsletterModal`). The
 * envelope in the corner of the window steps aside while it is
 * (`Mascot/ScrollGuide`): the prompt opens once the page has scrolled 1200px,
 * about when the envelope walks into the corner past the hero, and a walk
 * played behind the prompt's overlay is an entrance nobody sees. Ported from
 * findergit.app, whose mascots do the same.
 */
export const PROMPT_OPEN_ATTRIBUTE = 'data-newsletter-prompt';

/**
 * Stored as the JSON `true` once the visitor closes the prompt
 * (`NewsletterModal`). A new key on purpose: the download prompt this
 * replaced had its own, and a visitor who dismissed THAT should still see the
 * newsletter once.
 */
export const DISMISSED_KEY = 'vicenda-newsletter-prompt-dismissed';
