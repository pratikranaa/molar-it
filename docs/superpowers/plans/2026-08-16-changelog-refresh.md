# Customer Changelog Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refresh `/changelog` with the live Molar homepage design and a current, customer-readable release feed.

**Architecture:** Preserve the existing static React timeline and URL-backed product filters. Extend the data model with availability and summaries, render those fields semantically, share the current homepage chrome with the changelog, and replace only the changelog CSS block with homepage-aligned styling.

**Tech Stack:** Static HTML, React 18 via Babel, CSS, Node.js source-contract tests, Playwright browser verification.

---

### Task 1: Customer-facing release contract

**Files:**
- Modify: `scripts/check-published-links.mjs`
- Test: `scripts/check-published-links.mjs`

- [ ] Add assertions that changelog entries use only `Available now` or `Preview`, include summaries, retain every product filter, sort by real dates, and exclude internal deployment/test terminology.
- [ ] Run `node scripts/check-published-links.mjs` and verify it fails against the current stale feed.

### Task 2: Current release content

**Files:**
- Modify: `changelog-data.js`

- [ ] Replace stale June-only entries with recent customer-visible releases for unified workspace, URL-to-test creation, live sessions and replay, safer service replicas, release protection, agent access, and team notifications.
- [ ] Phrase each entry as a customer outcome with a short summary and two to four benefits; label limited experiences `Preview`.
- [ ] Run `node scripts/check-published-links.mjs` and verify the content contract passes.

### Task 3: Homepage-native presentation

**Files:**
- Modify: `changelog.html`
- Modify: `changelog.jsx`
- Modify: `seo-pages.css`
- Create: `marketing-chrome.jsx`
- Modify: `home.jsx`
- Modify: `home.css`
- Modify: `index.html`

- [ ] Align fonts and metadata with the live homepage.
- [ ] Render availability, summary, and customer-benefit lists without versions or engineering tags.
- [ ] Restyle the existing header, tabs, timeline, and entries using the homepage cream canvas, grain, ink, vermilion accent, spacing rhythm, buttons, and restrained motion.
- [ ] Use one current navigation and footer on the homepage and changelog, with a custom Products menu linking the four product landing subdomains.
- [ ] Keep visible focus states and a no-overflow single-column mobile layout.
- [ ] Run `node --check changelog-data.js`, `node scripts/check-published-links.mjs`, and `git diff --check`.

### Task 4: Browser verification and publication

**Files:**
- Modify: `STATUS.md` in the parent repository after verified behavior changes.

- [ ] Serve the marketing site locally and verify `/changelog` plus one filtered view at 1440×900 and 390×844 with Playwright; assert no page errors or horizontal overflow.
- [ ] Commit and push the marketing submodule, integrate its pointer into current remote `main` through an isolated worktree, and push without touching concurrent dashboard edits.
- [ ] Deploy the `molar` Vercel project to production.
- [ ] Probe `/changelog`, all four product landing subdomains, dashboard destinations, and live CTA non-interception.
