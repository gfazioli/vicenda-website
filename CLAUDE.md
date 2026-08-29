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
1. **Landing page** — the thesis, the four claims, the screenshots, the download
2. **Documentation** — user guides, getting started
3. **Release notes**
4. **The download** — `/download` resolves the newest `.dmg` from the Releases
   API at request time, the same as the two sibling sites

**THE CLOSED BETA IS GONE, dropped 2026-08-26.** It was here: an invite page, a
`config.beta.closed` gate, and a deliberate decision not to ship Sparkle
because a public appcast would have made a "closed" download one `curl` away.
The owner dropped the whole idea — the list, the hand-sent disk image and the
missing updater added up to more work than filter, and a release process that
cannot ship a fix without emailing everybody a new link is not a release
process. **Do not reintroduce beta wording anywhere**: the app is a free
public download and it updates itself.

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
- `content/_meta.tsx` controls sidebar navigation order and labels

### Layout & Theme Integration

- `app/layout.tsx` wraps the entire app in both `MantineProvider` and Nextra's `Layout`
- Dark mode sync between Mantine and Nextra is handled by `MantineNextraThemeObserver`
- Mantine theme overrides go in `theme.ts` (client-side `createTheme`)
- Global site configuration (metadata, GitHub API, search, Nextra layout) lives in `config/index.ts`
- Primary colour: `vicenda`, laddered from the APP ICON's own blue (`#0056C7`,
  sampled off the 1024px master, then stepped in OKLCH) — see `theme.ts`
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
- `github-releases/` — proxies the GitHub Releases API (configured in `config/index.ts`). Points at this repo, which is where the app's releases live because the app repo is private. Uses `GITHUB_TOKEN` env var when set to raise the rate limit from 60/hr to 5000/hr.
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
- **Only describe what the app ships**, and check the list rather than trusting
  it — this one said in-app OAuth consent was NOT built and must not appear
  anywhere, on the day the site's own Getting Started described it. Built: the
  stream, the embed cards and their identity gate, Gmail read+write, the IMAP
  tier, the block-everything reader, one-hue-per-account, and since 2026-08-28
  the **first-run wizard** — consent presented over the app with no browser, and
  from 2026-08-29 IMAP too, credentials proved against the server before an
  account is written. NOT built, and not to appear anywhere: sending, archive
  and delete over IMAP, the notch, the menu bar.
- **Download links go to `/download`**, never to a versioned asset URL. The
  route resolves the newest `.dmg` at request time, so nothing on this site
  carries a version number that can go stale.

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

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
