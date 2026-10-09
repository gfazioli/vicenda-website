# vicenda-website

The site at vicenda.app: the landing page, the docs and the download for Vicenda. What the four app sites share is in the workspace's `.claude/rules/websites.md`; this file holds what is specific to this one.

**No beta wording anywhere**: the closed beta was dropped; Vicenda is a free public download that updates itself.

## Code and config

- A server component may not pass a function (`component={Link}`) to a Mantine client component: it fails at prerender ("element type is invalid"), not at typecheck. Make the component `'use client'`.
- **`public/robots.txt` is the team-wide file**, generated for all ten Vercel projects and kept in step with the firewall (AI bots ruleset in deny, plus a bypass rule for AI answer engines and Applebot). Change it on every site or on none.

## Content Guidelines

- All website content is in **English**
- The app is described as: "A native macOS mail client shaped like a conversation"
- **The thesis is about SHAPE, not about sorting.** Every mail client claims it
  sorts better; Vicenda's difference sits upstream of that — it stops treating
  mail as a list. Machines become channels, people become threads, and a
  recognised machine message is drawn as a card instead of rendered as
  somebody's HTML. That is checkable in one screenshot, which is why it is the
  pitch.
- **Only describe what the app ships**, and check the app's code rather than this list. Built: the stream, the embed cards and their identity gate, Gmail read+write, the IMAP tier, the block-everything reader, one hue per account, and the first-run wizard (consent over the app with no browser; IMAP credentials proved before an account is written). NOT built, and not to appear anywhere: sending, archive and delete over IMAP, the notch, the menu bar.
- **Download links go to `/download`**, never to a versioned asset URL. The
  route resolves the newest `.dmg` at request time, so nothing on this site
  carries a version number that can go stale.

### No infrastructure leaks in user-facing copy

User-facing pages (`content/*.mdx` aimed at end users, the homepage, release notes hosted at `public/release-notes/<version>.html`, FAQ entries, marketing CTAs) **never name the underlying provider, model, or infrastructure**:

- ❌ "Groq", "Llama", "OpenAI", "Anthropic" — say "the AI" or "the AI provider"
- ❌ "Vercel proxy", "Next.js API route", "Cloudflare Worker" — say "Vicenda handles the request on your behalf"
- ❌ "Sparkle", "AppKit's NSEvent monitor", framework names — say "the auto-update framework" / "macOS keyboard handling"
- ✅ User-relevant facts ARE allowed: "free", "no server", "the local model runs on your Mac", "macOS 15+ required"

Reasoning: end users care about what the feature does for them, not which vendor or library powers it. Naming the stack also paints us into a corner if we ever swap it (e.g., a different AI provider) — would force rewriting every page.

**Exceptions**:
- Developer-facing files (commit messages, this `CLAUDE.md`, `CHANGELOG.md`) — name infra freely
- "Under the hood" sections at the bottom of release notes — okay to be specific for power users who want to know, but prefer generic phrasing where it doesn't lose information

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
