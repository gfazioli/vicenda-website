# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the **marketing and documentation website** for **Vicenda**, a native
macOS mail client. Bootstrapped verbatim from `findergit-website`, which is why
anything not yet re-skinned still says FinderGit — see the README for the list.

**This is NOT a macOS application.** This is a Next.js web project deployed on Vercel.

- **Domain**: `vicenda.app`
- **Website repository** (this): https://github.com/gfazioli/vicenda-website — PRIVATE
- The app repository is private; do not link it from anything user-facing.

The website serves as:
1. **Landing page** — the thesis, the four claims, the invite CTA
2. **Documentation** — user guides, getting started
3. **Release notes**
4. **The beta gate** — and NOT a download hub, which is the difference from the
   two sibling sites

**THERE IS NO PUBLIC DOWNLOAD.** Vicenda is in a closed beta: the disk image is
sent by hand. `/download` redirects to `/beta` while `config.beta.closed` is
true, so no affordance anywhere becomes a 404 or an empty releases list. That
flag is the only switch; do not add a second path to a binary.

**Sparkle would make the beta leaky.** An appcast is public XML pointing at a
public URL, so a beta build updating from the usual feed puts the closed
download one `curl` away. Either no updater during the beta, or an unguessable
appcast path with the DMGs off the public releases repo. Decide before the
first DMG goes out — a URL cannot be recalled.

## Tech Stack

- **Framework**: Next.js 16 + Nextra 4 (docs/MDX)
- **UI Library**: Mantine 9
- **Animations**: @gfazioli/mantine-scene, @gfazioli/mantine-text-animate, @gfazioli/mantine-marquee
- **Icons**: @tabler/icons-react
- **Analytics**: @vercel/analytics
- **Hosting**: Vercel
- **Package Manager**: Yarn 4 (Berry) — do not use npm or pnpm

## Commands

| Command | Purpose |
|---------|---------|
| `yarn dev` | Start Next.js dev server |
| `yarn build` | Production build (Next.js + pagefind search index) |
| `yarn test` | Full suite: typegen, oxfmt, lint, typecheck, jest |
| `yarn jest` | Run Jest tests only |
| `yarn typecheck` | TypeScript type checking (`tsc --noEmit`) |
| `yarn lint` | oxlint + Stylelint |
| `yarn format:write` | Auto-format all TS/TSX/CSS files (oxfmt) |
| `yarn storybook` | Storybook dev server on port 6006 |
| `yarn analyze` | Bundle analysis with `@next/bundle-analyzer` |

> **If `yarn <cmd>` fails with `command not found: oxfmt` / `next`** the Yarn PATH shim isn't wired on this machine — run the binary directly instead: `./node_modules/.bin/oxfmt`, `./node_modules/.bin/next dev`, `./node_modules/.bin/next build`. `yarn test` / `yarn jest` route through the npm-run shim and work regardless.

## Architecture

### Routing & Content

- **App Router** (`app/`): Next.js 16 app router with Nextra integration
- **Docs content** (`content/`): MDX files rendered via Nextra at `/docs/[[...mdxPath]]`
- Nextra is configured with `contentDirBasePath: '/docs'` — all MDX content is served under `/docs`
- `content/_meta.ts` controls sidebar navigation order and labels

### Layout & Theme Integration

- `app/layout.tsx` wraps the entire app in both `MantineProvider` and Nextra's `Layout`
- Dark mode sync between Mantine and Nextra is handled by `MantineNextraThemeObserver`
- Mantine theme overrides go in `theme.ts` (client-side `createTheme`)
- Global site configuration (metadata, GitHub API, search, Nextra layout) lives in `config/index.ts`
- Primary colour: `vicenda`, a neutral ramp with the app's own aubergine cast
- **The colours are the APP's, computed rather than picked.** `ACCOUNT_RING` in
  `theme.ts` is the real eight-hue ring from `Palette.swift` — OKLCH `L=0.72,
  C=0.13`, 45° apart — and `CHROME` comes from `Tokens.swift`. A palette
  invented here would disagree with every screenshot placed on top of it.
- **The display face is EB Garamond**, wired in `app/layout.tsx` via
  `next/font`. It is a SUBSTITUTION: the *Think Different* campaign was set in
  Apple Garamond, Apple's own cut of ITC Garamond condensed to ~80%, never
  licensed to anyone else, and the copies circulating share its provenance. The
  condensed proportion lives in `.display-hero` (`scaleX(0.92)`), applied to the
  one line that carries the reference and dropped below `48em`.

### Key Components (`components/`)

- `MantineNavBar` — top navigation
- `MantineFooter` — 4-column footer with highlights, resources, ecosystem links
- `Welcome` — the home page: hero, the problem, four claims, the honest
  paragraph, the closing line
- `Beta` — the invite page. A `'use client'` component because the route above
  it exports `metadata`, and **a server component may not hand a function —
  `component={Link}` — to a Mantine client component**: it fails at *prerender*
  with "element type is invalid", not at typecheck.
- `ColorSchemeControl` / `ColorSchemeToggle` — dark mode toggle
- `ReleaseNotes` — fetches GitHub releases via `/api/github-releases`

### API Routes (`app/api/`)

- `version/` — returns current package version
- `github-releases/` — proxies the GitHub Releases API (configured in `config/index.ts`). Points at this repo, which has no releases while the beta is closed. Uses `GITHUB_TOKEN` env var when set to raise the rate limit from 60/hr to 5000/hr.
- `search/` — pagefind-based full-text search endpoint

### Environment variables

- `GITHUB_TOKEN` (optional, recommended on Vercel) — fine-grained or classic token with `public_repo` read scope. Used by:
  - The `/api/github-releases` proxy (runtime).
  - The `content/release-notes.mdx` TOC metadata, which fetches at build time so Vercel needs the var available during deploys.
  Without the token the app still works but may hit 60 req/hr GitHub rate limit on shared IPs.

### CSS Import Order

In `app/layout.tsx`, CSS imports must follow this order:
1. `@mantine/core/styles.css`
2. Mantine extension styles (marquee, text-animate, scene)
3. Global styles

## Content Guidelines

- All website content is in **English**
- The app is described as: "A native macOS mail client shaped like a conversation"
- **The thesis is about SHAPE, not about sorting.** Every mail client claims it
  sorts better; Vicenda's difference sits upstream of that — it stops treating
  mail as a list. Machines become channels, people become threads, and a
  recognised machine message is drawn as a card instead of rendered as
  somebody's HTML. That is checkable in one screenshot, which is why it is the
  pitch.
- **Only describe what the app ships.** Built: the stream, the embed cards and
  their identity gate, Gmail read+write, the IMAP tier, the block-everything
  reader, one-hue-per-account. NOT built, and not to appear anywhere: in-app
  OAuth consent, sending, archive and delete over IMAP, the notch, the menu bar.
- **No download links.** Every download affordance goes to `/beta`.

### No infrastructure leaks in user-facing copy

User-facing pages (`content/*.mdx` aimed at end users, the homepage, release notes hosted at `public/release-notes/<version>.html`, FAQ entries, marketing CTAs) **never name the underlying provider, model, or infrastructure**:

- ❌ "Groq", "Llama", "OpenAI", "Anthropic" — say "the AI" or "the AI provider"
- ❌ "Vercel proxy", "Next.js API route", "Cloudflare Worker" — say "Vicenda handles the request on your behalf"
- ❌ "Sparkle", "AppKit's NSEvent monitor", framework names — say "the auto-update framework" / "macOS keyboard handling"
- ✅ User-relevant facts ARE allowed: "free", "no API key required", "diffs are not stored", "macOS 15+ required", "100 KB diff cap"

Reasoning: end users care about what the feature does for them, not which vendor or library powers it. Naming the stack also paints us into a corner if we ever swap it (e.g., a different AI provider) — would force rewriting every page.

**Exceptions**:
- Developer-facing files (commit messages, this `CLAUDE.md`, `CHANGELOG.md`) — name infra freely
- "Under the hood" sections at the bottom of release notes — okay to be specific for power users who want to know, but prefer generic phrasing where it doesn't lose information

## Tooling

- **Formatter**: oxfmt (`.oxfmtrc.json`)
- **Linter**: oxlint + stylelint
- **TypeScript**: 6.x
- **Package Manager**: Yarn 4 (Berry). Do not use npm or pnpm.
