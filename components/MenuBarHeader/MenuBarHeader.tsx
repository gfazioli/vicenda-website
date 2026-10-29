'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { setMenu } from 'nextra-theme-docs';
import { Search } from 'nextra/components';
import { Tooltip } from '@mantine/core';
import {
  IconBrandDiscordFilled,
  IconCoffee,
  IconHeartFilled,
  IconMenu2,
} from '@tabler/icons-react';
import { discordLinkProps } from '../Discord/discord';
import { Logo } from '../Logo/Logo';
import { isSamePageHashInMobileNav } from './mobile-nav-hash';
import { currentPageMenu, menus, productSections } from './sections';
import classes from './MenuBarHeader.module.css';

/**
 * The site's one bar: a product bar in the shape of a macOS menu bar,
 * cross-ported from lancetta.app.
 *
 * The mark and the name on the left with the menus beside them, the status
 * items on the right. It is attached to the top edge, narrower than the page
 * and rounded at the two bottom corners, so it reads as an object the page
 * hangs from rather than as a strip of chrome.
 *
 * Lancetta's centre item (its live reading and the panel it opens) is that
 * app's own and stays there; so does its Download pill. No download is offered
 * anywhere on this site until the next version (owner, 2026-10-29), so the
 * right side holds the search and the three status items the old navbar had:
 * Discord, Sponsor and the coffee.
 *
 * It REPLACES Nextra's navbar on every page (`app/layout.tsx` passes it into
 * the `navbar` slot, as lancetta.app does), which means two things Nextra's own
 * bar used to carry have to be carried here or they are simply gone: the
 * search, and the hamburger that opens the sidebar on a phone. `setMenu` is the
 * same store Nextra's own button writes, so the sidebar it opens is Nextra's.
 */
export function MenuBarHeader() {
  const pathname = usePathname();
  const onHome = pathname === '/';
  const barRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string | null>(null);
  const pageMenu = currentPageMenu(pathname);

  /*
   * Close Nextra's mobile navigation when one of ITS entries points at an
   * anchor on the page already open: Nextra closes that panel on a route
   * change, and a hash is not one (see `mobile-nav-hash.ts`). On `document`,
   * because the panel is Nextra's, rendered outside this component.
   */
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (isSamePageHashInMobileNav(event.target, window.location.href)) {
        setMenu(false);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  /*
   * Which section the reader is in, measured against the bar's own bottom
   * edge, so the bar's height never enters the arithmetic. Measured ON the
   * scroll event rather than a frame later: a frame deferred to
   * requestAnimationFrame is a frame a headless capture never delivers.
   */
  useEffect(() => {
    if (!onHome) {
      setActive(null);
      return undefined;
    }
    const spy = () => {
      const bar = barRef.current;
      if (!bar) {
        return;
      }
      const edge = bar.getBoundingClientRect().bottom + 8;
      let current: string = productSections[0].id;
      for (const section of productSections) {
        const el = document.getElementById(section.id);
        if (el && el.getBoundingClientRect().top <= edge) {
          current = section.id;
        }
      }
      setActive(current);
    };
    spy();
    window.addEventListener('scroll', spy, { passive: true });
    window.addEventListener('resize', spy);
    return () => {
      window.removeEventListener('scroll', spy);
      window.removeEventListener('resize', spy);
    };
  }, [onHome]);

  return (
    <div className={classes.dock}>
      <header ref={barRef} className={`vic-menubar ${classes.bar}`} aria-label="Vicenda">
        <div className={classes.left}>
          <Link href="/" className={classes.brand} aria-label="Vicenda, home">
            <Logo size={22} />
          </Link>

          <nav className={classes.menus} aria-label="Sections">
            {menus.map((menu) => {
              const here = menu.section
                ? onHome && active === menu.section
                : pageMenu === menu.href;
              return (
                <Link
                  key={menu.href}
                  href={menu.href}
                  className={classes.menu}
                  aria-current={here ? (menu.section ? 'location' : 'page') : undefined}
                >
                  {menu.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className={classes.status}>
          <div className={classes.search}>
            <Search />
          </div>
          {/*
            The three status items the old navbar carried, in its order and
            its colours: Discord's own blurple first (the community's home
            since 2026-10-08), then GitHub Sponsors and the coffee. External,
            each in a new tab.
          */}
          <Tooltip label="Join us on Discord" withArrow>
            <a
              {...discordLinkProps}
              className={`${classes.item} ${classes.discord}`}
              aria-label="Join us on Discord"
            >
              <IconBrandDiscordFilled size={16} />
            </a>
          </Tooltip>
          <Tooltip label="Sponsor" withArrow>
            <a
              href="https://github.com/sponsors/gfazioli"
              target="_blank"
              rel="noopener noreferrer"
              className={`${classes.item} ${classes.sponsor}`}
              aria-label="Sponsor"
            >
              <IconHeartFilled size={14} />
            </a>
          </Tooltip>
          <Tooltip label="Buy me a coffee" withArrow>
            <a
              href="https://donate.stripe.com/fZu4gy4Tn3b1dgudGx0co00"
              target="_blank"
              rel="noopener noreferrer"
              className={`${classes.item} ${classes.coffee}`}
              aria-label="Buy me a coffee"
            >
              <IconCoffee size={15} />
            </a>
          </Tooltip>
          {/*
            Nextra's own hamburger lived in the navbar this component replaced.
            `setMenu` is the store it wrote, so the sidebar that opens is
            Nextra's own — nothing here duplicates it.
          */}
          <button
            type="button"
            className={classes.burger}
            aria-label="Menu"
            onClick={() => setMenu((previous) => !previous)}
          >
            <IconMenu2 size={18} />
          </button>
        </div>
      </header>
    </div>
  );
}
