'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@mantine/core';
import { useDisclosure, useLocalStorage, useReducedMotion, useWindowScroll } from '@mantine/hooks';
import { NewsletterCallToAction } from './NewsletterCallToAction';

/**
 * Scroll-triggered newsletter prompt.
 *
 * Once the visitor has scrolled past the hero, a dismissible modal with the
 * shared newsletter CTA appears — but only once: closing it persists a flag in
 * localStorage so it never nags again on future visits. Mounted once globally
 * in the root layout.
 */
const SCROLL_TRIGGER_PX = 1200;

export function NewsletterModal() {
  const [scroll] = useWindowScroll();
  const [opened, { open, close }] = useDisclosure(false);
  // Mantine ignores Reduce Motion unless the theme opts in, and this one does
  // not: the pop and the overlay's fade are skipped by hand.
  const reduced = useReducedMotion();
  const [dismissed, setDismissed] = useLocalStorage({
    // A new key on purpose: the download prompt this replaced had its own,
    // and a visitor who dismissed THAT should still see the newsletter once.
    key: 'vicenda-newsletter-prompt-dismissed',
    defaultValue: false,
    // Read localStorage only after mount, so SSR and first client render agree.
    getInitialValueInEffect: true,
  });
  // Auto-open at most once per page load (independent of the persisted flag).
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!armed && !dismissed && scroll.y > SCROLL_TRIGGER_PX) {
      setArmed(true);
      open();
    }
  }, [scroll.y, dismissed, armed, open]);

  const handleClose = () => {
    setDismissed(true);
    close();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      centered
      size="md"
      radius="lg"
      overlayProps={{ blur: 2 }}
      transitionProps={{ transition: 'pop', duration: reduced ? 0 : 250 }}
      // On the element with role="dialog", which has no title to be named by.
      // A plain `aria-label` lands on the modal's root <div>, where it names
      // nothing (read in Chrome on lancetta.app, 2026-10-19).
      attributes={{ content: { 'aria-label': 'Subscribe to the Vicenda newsletter' } }}
      // The button the focus lands on as it opens: an icon alone names nothing.
      closeButtonProps={{ 'aria-label': 'Close' }}
    >
      <NewsletterCallToAction />
    </Modal>
  );
}
