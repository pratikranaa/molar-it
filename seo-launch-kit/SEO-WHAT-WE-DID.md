# SEO Launch — What We Did

In-depth record of SEO, structured data, and AI discoverability work on **molar.it** (June 2026). For post-launch operator steps see [`00-START-HERE.txt`](00-START-HERE.txt). For AEO/LLM tactics see [`AEO-LLM-GUIDE.md`](AEO-LLM-GUIDE.md).

---

## Executive summary

We rebuilt molar.it's organic and AI discoverability around **four product surfaces** (Clones, Cartographer, Guard, Trace), each on its own subdomain, plus a **hub** at molar.it with docs, blog, comparisons, and machine-readable agent maps. The sitemap lists **51 URLs** (20 hub/static + 4 surface roots + 28 per-clone doc pages + llms files). Every priority page has canonicals, Open Graph, JSON-LD, and answer-first copy for AEO.

---

## 1. What was implemented

### 1.1 Automated sitemap generation

**File:** [`scripts/gen-sitemap.mjs`](../scripts/gen-sitemap.mjs)

- Reads `CLONE_DOC_HOSTS` from [`clone-docs-data.js`](../clone-docs-data.js) to emit one URL per clone (`/docs/clones/:slug`).
- Static list covers hub, docs, blog, comparisons, integrations, legal, changelog, thesis, waitlist, llms files, and four surface subdomain roots.
- Regenerate after catalog or route changes:

```bash
node scripts/gen-sitemap.mjs
```

**Output:** [`sitemap.xml`](../sitemap.xml) — referenced in [`robots.txt`](../robots.txt).

### 1.2 URL inventory (51 URLs)

| Category | Count | Examples |
|----------|-------|----------|
| Hub & core | 12 | `/`, `/docs`, `/blog`, `/qa-agent`, `/thesis`, `/changelog`, `/waitlist` |
| Comparisons | 5 | `/vs/cypress`, `/vs/playwright`, `/vs/wiremock`, `/vs/checkly`, `/vs/playwright-trace` |
| Integrations | 1 | `/integrations/github-actions` |
| Legal | 2 | `/privacy`, `/terms` |
| LLM maps | 2 | `/llms.txt`, `/llms-full.txt` |
| Surface subdomains | 4 | `cartographer.molar.it`, `clones.molar.it`, `guard.molar.it`, `trace.molar.it` |
| Clone docs | 28 | `/docs/clones/stripe`, `/docs/clones/twilio`, … |
| App | 1 | `app.molar.it` (product dashboard) |

Clone slugs mirror the Molar Clones catalog: Stripe, Twilio, GitHub, Slack, Clerk (`auth`), S3, SendGrid, and ~21 fixture clones (Linear, Jira, HubSpot, Ramp, Sentry, Supabase, etc.).

### 1.3 Clone documentation pages

**Routes:** `/docs/clones/:slug` → [`docs/clone.html`](../docs/clone.html) + [`docs-clone.jsx`](../docs-clone.jsx)

- Generated tool tables from `molar-clones` fixtures via [`scripts/gen-clone-routes.mjs`](../scripts/gen-clone-routes.mjs).
- Per-clone pages: connect instructions, seeds, coverage, MCP tools.
- Canonical URLs in sitemap; internal links from hub catalog, docs quickstart, and Clones landing.

**Why:** Long-tail SEO ("stripe mock api", "twilio webhook testing") and agent context without a separate docs subdomain.

### 1.4 Surface landing SEO (subdomains)

Each surface has a dedicated [`index.html`](../clones/index.html) with:

- Keyword-aligned **title** and **meta description** (from [`SURFACE-SEO-RESEARCH.md`](SURFACE-SEO-RESEARCH.md))
- **Canonical** on subdomain root
- **Open Graph** + Twitter cards
- **JSON-LD `@graph`:** `WebPage`, `BreadcrumbList`, `SoftwareApplication` (with `featureList`, `alternateName`), `FAQPage`
- **`isPartOf`** → hub `WebSite` entity
- `<link rel="alternate" href="/llms.txt">` for agent discoverability
- **Waitlist modal** on `app.molar.it` CTAs (`data-waitlist-surface`)

Surfaces deployed via [`vercel.json`](../vercel.json) host-based routes.

### 1.5 Hub meta, schema, and static FAQ

**File:** [`index.html`](../index.html)

- Full **Organization**, **WebSite**, **SoftwareApplication**, **FAQPage** JSON-LD
- Static HTML `<noscript>` summary block for crawlers (pricing, FAQ, surface links)
- `alternateName` arrays disambiguate "Molar" from dental/chemistry
- FAQ covers: autonomous QA agent, Stripe/email testing, production guard, MCP, BYOK

### 1.6 llms.txt and llms-full.txt

| File | Purpose |
|------|---------|
| [`llms.txt`](../llms.txt) | Token-cheap curated map: surfaces, capabilities, pricing, key links |
| [`llms-full.txt`](../llms-full.txt) | Expanded Q&A for agents answering category queries |

Both linked from robots.txt comment and homepage `rel="alternate"`. Updated with comparison page links and surface cross-links.

### 1.7 docs.molar.it — unified, not excluded (updated 2026-07-13)

**Superseded.** `docs.molar.it` is now live as the full product documentation (Next.js, `apps/docs-site`). Rather than exclude it, we **unify the entity graph**: its `Organization` JSON-LD reuses the same `@id` (`https://molar.it/#org`) as this hub, and `docs.molar.it` is listed in the hub's schema `sameAs` plus the four product subdomains. `llms.txt` already cross-links to `docs.molar.it/docs/*`.

Each host keeps its **own** sitemap (we do not list `docs.molar.it` URLs inside `molar.it/sitemap.xml`). `molar.it/docs` remains a thin marketing quickstart landing + long-tail per-clone SEO pages that link into `docs.molar.it` for full reference — kept distinct in intent to avoid duplicate content. See [`README.md`](../README.md).

### 1.8 Keyword research files

| File | Contents |
|------|----------|
| [`SURFACE-SEO-RESEARCH.md`](SURFACE-SEO-RESEARCH.md) | Per-surface keywords, personas, competitors, on-page tags, content gaps, comparison priorities |
| [`keyword-map.txt`](keyword-map.txt) | Operator cheat sheet: primary/long-tail queries, competitor list, key pages per surface |
| [`google-search-console.txt`](google-search-console.txt) | GSC verification + sitemap submit |
| [`bing-webmaster.txt`](bing-webmaster.txt) | Bing/Copilot setup |
| [`launch-posts.txt`](launch-posts.txt) | HN, Dev.to, Reddit templates |
| [`directory-listings.txt`](directory-listings.txt) | Product Hunt, G2, etc. |

---

## 2. Per-surface strategy summary

*Condensed from [`SURFACE-SEO-RESEARCH.md`](SURFACE-SEO-RESEARCH.md).*

### Clones — `clones.molar.it`

| | |
|---|---|
| **Category** | API mocking, service virtualization, vendor test sandboxes |
| **Top 3 keywords** | stateful API clones · WireMock alternative · Stripe test sandbox / mock |
| **Primary personas** | Integration engineers, QA leads, platform engineers, fintech compliance, AI-native builders |
| **Main competitors** | WireMock, MockServer, stripe-mock, Stripe test mode, MSW, ngrok+Twilio CLI |
| **Differentiation** | Vendor-faithful + stateful (not hand-written stubs), MCP-native, no rate limits, world snapshots |
| **Key pages** | Surface landing, `/docs/clones/stripe`, `/blog/test-stripe-without-real-cards`, **`/vs/wiremock`** |
| **Schema** | `SoftwareApplication` + `FAQPage` (WireMock, Stripe test mode, MCP) |

### Cartographer — `cartographer.molar.it`

| | |
|---|---|
| **Category** | Autonomous QA, app mapping, Playwright test generation |
| **Top 3 keywords** | AI test generation · Playwright codegen / URL to E2E · autonomous QA |
| **Primary personas** | Staff engineers, startup CTOs, SDETs, AI-native devs, release managers |
| **Main competitors** | Playwright codegen/agents, QA Wolf, AegisRunner, Bugzy, Mabl, Meticulous |
| **Differentiation** | Site graph + owned Playwright export, crawl budget, Clones integration for billing flows |
| **Key pages** | Surface landing, **`/vs/playwright`**, `/integrations/github-actions` |
| **Schema** | `SoftwareApplication` + `FAQPage` (codegen vs crawl, QA Wolf angle) |

### Guard — `guard.molar.it`

| | |
|---|---|
| **Category** | PR gating, production synthetics, deployment gates, auto-fix |
| **Top 3 keywords** | PR gating QA · production synthetic monitoring · merge gate testing |
| **Primary personas** | DevOps/platform leads, eng managers, on-call engineers, AI-shipping teams |
| **Main competitors** | Checkly, Datadog Synthetics, GitHub Merge Queue alone, Devin CI fixer, FixSense |
| **Differentiation** | Affected-scenario selection, Clones-backed safe synthetics, Mender fix PRs, unified gate+monitor |
| **Key pages** | Surface landing, `/integrations/github-actions`, **`/vs/checkly`** |
| **Schema** | `SoftwareApplication` + `FAQPage` (Checkly vs Guard, safe synthetics) |

### Trace — `trace.molar.it`

| | |
|---|---|
| **Category** | Test replay, forensic debugging, Playwright trace alternative |
| **Top 3 keywords** | Playwright trace viewer alternative · test failure replay · CI failure triage |
| **Primary personas** | SDETs, full-stack devs on red CI, platform engineers, AI-agent operators |
| **Main competitors** | Playwright Trace Viewer, Currents, TestDino, Replay.io, FixSense |
| **Differentiation** | Five-ribbon forensic model, Layer 2 replay, agent thought traces, MCP-native |
| **Key pages** | Surface landing, **`/vs/playwright-trace`** |
| **Schema** | `SoftwareApplication` + `FAQPage` (trace viewer gaps, Layer 2) |

### Cross-surface internal linking mesh

```
molar.it (hub)
  ├── clones.molar.it ←→ /blog/test-stripe-without-real-cards ←→ /vs/wiremock
  ├── cartographer.molar.it ←→ /vs/playwright
  ├── guard.molar.it ←→ /integrations/github-actions ←→ /vs/checkly
  └── trace.molar.it ←→ /vs/playwright-trace ←→ guard (failure → trace → mender)
```

---

## 3. Technical SEO stack

### 3.1 Canonicals

Every indexable HTML page sets `<link rel="canonical" href="https://molar.it/...">` (or subdomain root for surfaces). Vercel rewrites serve clean URLs without `.html` suffix:

| Public URL | Source file |
|------------|-------------|
| `/docs` | `docs.html` |
| `/vs/wiremock` | `vs/wiremock.html` |
| `/blog/test-stripe-without-real-cards` | `blog/test-stripe-without-real-cards.html` |

Configured in [`vercel.json`](../vercel.json).

### 3.2 JSON-LD types in use

| `@type` | Pages |
|---------|-------|
| `WebSite` | Homepage |
| `Organization` | Homepage |
| `SoftwareApplication` | Homepage + all four surfaces |
| `FAQPage` | Homepage + surfaces (+ comparison pages) |
| `WebPage` | Docs, comparisons, integrations |
| `BreadcrumbList` | Docs, blog, thesis, comparisons, integrations |
| `Blog` / `BlogPosting` | Blog index + posts |
| `Article` | Thesis, blog posts |
| `HowTo` | GitHub Actions integration |

Pattern: `@graph` arrays with stable `@id` anchors and `isPartOf` linking surfaces to hub `#website`.

### 3.3 robots.txt

[`robots.txt`](../robots.txt):

- Default `Allow: /` for all crawlers
- **Explicit allows** for GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Bingbot, and others
- `Sitemap: https://molar.it/sitemap.xml`
- Comment pointing agents to `/llms.txt`

Philosophy: maximize citation surface in AI answer engines while keeping content public.

### 3.4 Internal linking

- **Nav/footer** ([`nav.jsx`](../nav.jsx), [`footer.jsx`](../footer.jsx)): Docs, surfaces, comparisons, GitHub
- **Hub static footer** (index.html noscript): vs Cypress/Playwright, GitHub Actions, thesis
- **Blog → clones:** Stripe post links to Clones docs and GitHub Actions
- **Comparison pages:** Links to relevant surface subdomain + hub waitlist CTA
- **Clone docs:** Sidebar TOC + cross-links to Stripe/GitHub from docs quickstart
- **Surface landings:** Footer links to docs, blog, sibling surfaces

### 3.5 Other technical details

- **Middleware** ([`middleware.js`](../middleware.js)): security headers
- **Waitlist API** ([`api/waitlist.js`](../api/waitlist.js)): Google Sheets webhook; `source` tracks page ref for attribution
- **seo-pages.css** + **seo-static.css**: Shared typography for doc/comparison/blog templates
- **Open Graph:** `og.png` hub image; per-surface OG images planned (`og-clones.png`, etc.)

---

## 4. AEO / LLM layer (summary)

Full guide: [`AEO-LLM-GUIDE.md`](AEO-LLM-GUIDE.md).

**Bullets:**
- AEO complements SEO — optimize for **citation**, not just clicks
- Answer-first lede paragraphs (40–60 words) on comparisons and blog posts
- FAQPage schema on hub, surfaces, and comparison pages
- llms.txt for agent onboarding; not a proven ranking factor for AI search
- Explicit AI bot allows in robots.txt — blocking OAI-SearchBot/PerplexityBot removes citations
- B2B dev tools win with honest comparison pages, topical clusters, and external corroboration (G2, GitHub, community)

---

## 5. Content still open (from research)

P0 comparison pages shipped in this launch. Remaining gaps from surface research:

- QA Wolf vs Cartographer page
- Currents vs Trace page
- Per-vendor sections on Clones landing (`#stripe`, `#twilio`)
- Demo GIF on Cartographer landing
- Surface-specific OG images (1200×630)

Track in GSC per subdomain after DNS verification.

---

*Last updated: 2026-06-28*
