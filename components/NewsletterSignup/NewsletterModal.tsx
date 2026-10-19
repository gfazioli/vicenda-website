'use client';

import { useEffect } from 'react';
import { Modal } from '@mantine/core';
import { readLocalStorageValue, useDisclosure } from '@mantine/hooks';
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

/**
 * Stored as the JSON `true` once the visitor closes the prompt. A new key on
 * purpose: the download prompt this replaced had its own, and a visitor who
 * dismissed THAT should still see the newsletter once.
 */
export const DISMISSED_KEY = 'vicenda-newsletter-prompt-dismissed';

const isDismissed = () => readLocalStorageValue({ key: DISMISSED_KEY, defaultValue: false });

export function NewsletterModal() {
  const [opened, { open, close }] = useDisclosure(false);

  // Watches the scroll only until the prompt opens, at most once a frame, and
  // not at all for a visitor who has closed it. Mantine's `useWindowScroll`,
  // which it replaces, rendered on every scroll event for as long as any page
  // was open: 574 renders in a 13 s scroll down findergit.app's home page,
  // three quarters of the script the scroll ran (production, CPU 4x,
  // 2026-10-13), where this same watcher came from.
  useEffect(() => {
    if (isDismissed()) {
      return undefined;
    }
    let frame = 0;
    function stop() {
      window.removeEventListener('scroll', scrolled);
      window.cancelAnimationFrame(frame);
    }
    function check() {
      frame = 0;
      if (window.scrollY > SCROLL_TRIGGER_PX) {
        // At most once per page load. Closed in another tab since this one
        // loaded counts as closed here too.
        stop();
        if (!isDismissed()) {
          open();
        }
      }
    }
    function scrolled() {
      if (!frame) {
        frame = window.requestAnimationFrame(check);
      }
    }
    window.addEventListener('scroll', scrolled, { passive: true });
    // A page that opens already past the trigger (a reload, a link to an
    // anchor) gets the prompt as a scroll there would have given it.
    scrolled();
    return stop;
  }, [open]);

  const handleClose = () => {
    try {
      window.localStorage.setItem(DISMISSED_KEY, JSON.stringify(true));
    } catch {
      // Storage refused (site data blocked, a full quota): it closes for this
      // page load, and the watcher has already stopped.
    }
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
      transitionProps={{ transition: 'pop' }}
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
