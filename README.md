<h1 align="center">Vicenda</h1>

<p align="center">
  <strong>Stop noticing your email.</strong><br/>
  A Mac app that turns a morning of mail into a few decisions. It sorts every account
  by kind, with rules it learns as you go, and runs entirely on your Mac.
</p>

<p align="center">
  <a href="https://vicenda.app"><strong>vicenda.app</strong></a>
</p>

<p align="center">
  <a href="https://vicenda.app"><img src="https://img.shields.io/badge/site-vicenda.app-2B6CB0" alt="vicenda.app" /></a>
  <a href="https://www.apple.com/macos/"><img src="https://img.shields.io/badge/macOS-15%2B-1A181E" alt="macOS 15+" /></a>
  <img src="https://img.shields.io/badge/download-free-4CBD88" alt="Free download" />
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License" /></a>
</p>

---

## What this repository is

The **marketing and docs site** for Vicenda, live at
[vicenda.app](https://vicenda.app). The app itself lives elsewhere and is
private.

It also serves the **Sparkle appcast** at
[`/appcast.xml`](https://vicenda.app/appcast.xml), which every installed copy
polls for updates, and the release `.dmg` files and the local model
(`models-v1`) from this repository's GitHub Releases. The site links no
download until the next version (`AGENTS.md`).

`/download` resolves the newest `.dmg` from the Releases API at request time,
exactly as the two sibling sites do, so the public URL carries no version and
never goes stale. Any failure falls back to the Releases page — the button is
never a dead end.

**There was a closed beta here and there is not any more.** It was dropped on
2026-08-26: the invite list, the disk image sent by hand and the deliberate
absence of an updater added up to more work than filter. What it bought —
a hand-picked first audience — was not worth a release process that could not
ship a fix without emailing everybody a new link.

## What Vicenda is

A **morning report for mail**, not a mail client. It reads every account over
IMAP, sorts the mail by kind with rules it learns as you go, and lays the
morning out as four sections (To do, In brief, New, Already decided) with an
Overview beside them. Its model runs on the Mac. It exists because seven
mailboxes, where about 97% of the mail comes from machines, needed a few
decisions a morning rather than a client.

What the site may say about it, and what it may not, is in `AGENTS.md`
(Content Guidelines): only what the app's code does today.

## Design decisions worth not re-deriving

**The face is EB Garamond, and that is a substitution.** The reference is
Apple's *Think Different*, which was set in **Apple Garamond** — Apple's own cut
of ITC Garamond, condensed to about 80%, used from 1984 to 2002 and never
licensed to anybody else. The copies that circulate share its provenance. EB
Garamond is the same Garamond lineage under the SIL Open Font License. The
condensed proportion lives in `.display-hero`, which applies `scaleX(0.92)` to
the one line that carries the reference and drops the squeeze below `48em`,
where the line wraps and a scaled wrap would read as a rendering fault.

**The colours are the app's, computed rather than picked.** The eight account
hues in `theme.ts` come from `Palette.swift` — OKLCH `L=0.72, C=0.13`, 45° apart
— and so do the logo's night ground, its blues and the six section colours, as
`--vic-*` tokens in `theme/global.css`. That is deliberate: a palette invented
here would disagree with every picture of the app placed on top of it.

**A server component may not hand a function to a Mantine client component.**
`component={Link}` fails at *prerender*, not at typecheck, with an unhelpful
"element type is invalid". The template's precedent is a thin server page
exporting `metadata` and delegating to a `'use client'` component — see
`app/page.tsx` and `components/Welcome/Welcome.tsx`.

## Local development

```bash
yarn install
yarn dev            # http://localhost:3000
```

Package manager is **Yarn 4**. If `yarn <cmd>` reports `command not found`, run
the binary directly: `./node_modules/.bin/next`, `./node_modules/.bin/tsc`.

Built with [Next.js](https://nextjs.org/), [Mantine](https://mantine.dev/) and
[Nextra](https://nextra.site/).

## License

MIT
