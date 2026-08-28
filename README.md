<h1 align="center">Vicenda</h1>

<p align="center">
  <strong>Your mail is not a list.</strong><br/>
  A native macOS mail client shaped like a conversation. The machines that write to you
  get channels, the people get threads, and nothing ever leaves your Mac.
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
polls for updates, and the release `.dmg` files from this repository's GitHub
Releases.

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

A reading and triage tool first; composing is secondary and sending is not
built yet. It exists because seven mailboxes across Gmail, a PEC and a work
account had no client that could answer four questions at a glance:

1. which of the accounts did this land in
2. what needs a reply, as against what is bulk
3. how to stay fast across all of them
4. how to keep one taxonomy across providers

**What is built today** — the site may describe these, and nothing else:

- **A stream, not an inbox.** Machine senders become channels; people become
  conversations. An account rail filters rather than navigates.
- **Recognised machine mail becomes a card.** Twelve rules across five provider
  packs bind named fields — an amount, a card, an item, an order — and draw
  them. If a mandatory field cannot be bound the rule declines and the message
  stays mail: a half-filled card looks authoritative, which is worse than none.
- **The identity gate.** A card is allowed to look authoritative only when the
  receiving server vouched for the sender. Otherwise it renders dashed, prints
  the raw `From` in full and carries **no buttons at all**.
- **Gmail, read and write.** History sync, arrival ingestion, read-state
  alignment, archive and trash through a queue that survives a silent revert.
- **IMAP**, per-folder cursors and arrival ingestion, with writes limited to
  `UID STORE ±FLAGS.SILENT (\Seen)` and an intention log so a local read is not
  reverted by a server that was never told.
- **The reader blocks everything remote** before the first pixel, so opening a
  message does not tell the sender you opened it. If the blocker cannot arm,
  the HTML is withheld rather than shown — it fails closed.
- **Colour means one thing.** Eight account hues at a single lightness and
  chroma; nothing else in the app may spend hue.

**Not built** — do not put these on the site: in-app OAuth consent, sending,
archive and delete over IMAP, the notch, the menu bar.

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
— and the chrome ramp from `Tokens.swift`. That is deliberate: a palette
invented here would disagree with every screenshot placed on top of it.

**A server component may not hand a function to a Mantine client component.**
`component={Link}` fails at *prerender*, not at typecheck, with an unhelpful
"element type is invalid". The template's precedent is a thin server page
exporting `metadata` and delegating to a `'use client'` component — see
`app/page.tsx` and `components/Welcome/Welcome.tsx`.

## Still inherited from FinderGit

This site was bootstrapped verbatim from `findergit-website` so the re-skin
would read as a diff. These have not been dealt with yet:

- every page under `app/docs/` still documents FinderGit
- `app/api/ai-commit/` is FinderGit's proxy and has no business here
- `public/` still carries FinderGit's icons, screenshots and OG images

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
