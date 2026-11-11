# AEO & LLM Discoverability Guide — molar.it

Actionable recommendations for Answer Engine Optimization (AEO) and AI-agent discoverability, based on 2025–2026 industry research and Molar's current stack. See [`SEO-WHAT-WE-DID.md`](SEO-WHAT-WE-DID.md) for what is already implemented.

---

## AEO vs traditional SEO (2025–2026)

| Dimension | Traditional SEO | AEO / GEO |
|-----------|-----------------|-----------|
| **Goal** | Rank pages in Google/Bing SERPs; earn clicks | Be **cited** in AI-generated answers (ChatGPT, Perplexity, Gemini, Claude, Google AI Overviews) |
| **Success metric** | Impressions, CTR, organic sessions | Citation rate, AI share of voice, assisted conversions |
| **Content shape** | Keyword-rich pages, backlinks, technical health | **Extractable** answer blocks, FAQ schema, passage-level clarity |
| **Relationship** | Foundation | **Builds on SEO** — unindexed or low-authority pages rarely appear in AI answers |

**Key insight:** AEO is not a replacement for SEO. AI retrieval systems pull from content that is already crawlable, authoritative, and well-structured. Strong Bing/Google rankings correlate with ChatGPT/Perplexity citations because many AI search bots use web indexes (Bing for ChatGPT, live crawl for Perplexity).

---

## Crawler permissions (critical)

Search crawling and **training** crawling are separate decisions:

| Bot | Purpose | Molar robots.txt |
|-----|---------|------------------|
| `OAI-SearchBot`, `ChatGPT-User` | ChatGPT Search citations | Allow (source robots.txt) |
| `GPTBot` | OpenAI training | **Blocked** by Cloudflare's managed block (owner decision to change) |
| `PerplexityBot` / `Perplexity-User` | Perplexity answers | Allow (source robots.txt) |
| `Claude-SearchBot` / `Claude-User` | Claude search and user-requested fetches | Allow (source robots.txt) |
| `ClaudeBot`, `anthropic-ai`, `Claude-Web` | Anthropic training crawlers | **Blocked** by Cloudflare's managed block |
| `Google-Extended` | Gemini training and grounding opt-out only; AI Overviews follow `Googlebot` | **Blocked** by Cloudflare's managed block |
| `Googlebot`, `Bingbot` | Google and Bing search, which AI answers retrieve from | Allow (`User-agent: *`) |

Verified against the live https://molar.it/robots.txt on 2026-11-11: Cloudflare prepends a managed block (`Content-Signal: search=yes,ai-train=no`) that disallows the training crawlers above. The rules in this repo's `robots.txt` follow it and cover search and retrieval bots only.

**Action:** Keep [`robots.txt`](../robots.txt) explicit allows. Blocking `OAI-SearchBot` or `PerplexityBot` removes you from that engine's answers entirely — a common accidental mistake when teams block "AI bots" wholesale.

---

## llms.txt — what it does and doesn't do

**Evidence (2026):** Large-scale studies show **negligible direct impact on AI search citations** from `llms.txt` alone. GPTBot/PerplexityBot rarely fetch `/llms.txt` compared to normal pages.

**Where it *does* help:**
- **AI coding agents** and MCP tooling — token-cheap site map (Stripe, Vercel, Anthropic publish theirs)
- **Human + agent onboarding** — curated links with one-line descriptions
- **Brand disambiguation** — "Molar = QA platform, not dental/chemistry"

**Molar implementation:**
- [`llms.txt`](../llms.txt) — concise overview + surface links
- [`llms-full.txt`](../llms-full.txt) — Q&A format for deep agent context
- `<link rel="alternate" type="text/plain" href="/llms.txt">` on homepage and surface landings

**Maintenance:** Update quarterly when new comparison pages, clone docs, or surfaces ship. Stale llms.txt is worse than none.

---

## Schema.org for AI crawlers

Schema does not guarantee AI citations, but it **feeds search indexes** that AI systems retrieve from:

| Type | Where used | AEO value |
|------|------------|-----------|
| `WebSite` + `Organization` | Homepage | Entity disambiguation, `sameAs`, `alternateName` |
| `SoftwareApplication` | Hub + each surface | Feature lists AI can quote |
| `FAQPage` | Hub + Clones/Cartographer/Guard/Trace | Direct Q→A extraction for comparison queries |
| `BreadcrumbList` | All static/SEO pages | Hierarchy for crawlers |
| `Blog` / `BlogPosting` / `Article` | Blog, thesis | Author, date, topic signals |
| `HowTo` | GitHub Actions integration | Process queries |

**Action for molar.it:**
1. Add `FAQPage` to new comparison pages (3–5 honest Q&As per competitor).
2. Keep **answer-first** `<p class="doc-lede">` with `<strong>Short answer:</strong>` on every comparison and blog post — 40–60 word extractable blocks.
3. Use question-shaped H2s where natural ("Why Stripe test mode isn't enough").

---

## Google AI Overviews & Perplexity

**Google AI Overviews:** Pulled from indexed, E-E-A-T-weighted content. FAQ + HowTo schema, clear headings, and Bing parity matter. Google publicly dismissed `llms.txt` for ranking but uses structured data and passage relevance.

**Perplexity:** Live crawl + citation links. Reddit and YouTube appear heavily in citations (~47% Reddit for some verticals) — community presence compounds on-page work.

**ChatGPT (Search):** Uses Bing index via `OAI-SearchBot`. Strong traditional SEO on Bing helps.

---

## What works for B2B dev tools in ChatGPT / Perplexity

1. **Own comparison queries** — "WireMock alternative", "Checkly alternative", "Playwright trace viewer alternative" with honest tables (implemented: `/vs/wiremock`, `/vs/checkly`, `/vs/playwright-trace`).
2. **Category + product naming** — Repeat "stateful API clones", "PR gating", "forensic test traces" consistently across hub, surfaces, llms.txt, and schema `alternateName`.
3. **Technical credibility** — CLI snippets, GitHub Actions steps, MCP mentions, per-clone docs (28 `/docs/clones/*` pages).
4. **Topical clusters** — Clones ↔ Stripe blog ↔ WireMock comparison; Guard ↔ GitHub Actions ↔ Checkly comparison; Trace ↔ Playwright trace comparison.
5. **External corroboration** — G2, Product Hunt, GitHub, LinkedIn, Dev.to/HN (see launch kit). AI systems infer trust from the open web, not just your site.
6. **Passage-level answers** — Every section should stand alone if extracted; avoid burying the answer in paragraph three.
7. **Freshness** — Changelog, `lastmod` in sitemap, dateModified in Article schema.

---

## Recommended next actions (priority order)

### P0 — Done or in this launch
- [x] Explicit AI crawler allows in robots.txt
- [x] llms.txt + llms-full.txt
- [x] FAQPage on hub + four surfaces
- [x] P0 comparison pages (WireMock, Checkly, Playwright Trace)
- [x] Sitemap with 51+ URLs including clone docs
- [x] Waitlist CTAs on blog/docs (surface-specific `data-waitlist-surface`)

### P1 — Next 30 days
- [ ] Submit sitemap in GSC + Bing Webmaster (see `google-search-console.txt`)
- [ ] Create surface OG images (`og-clones.png`, etc.)
- [ ] QA Wolf vs Cartographer comparison page
- [ ] Currents vs Trace comparison page
- [ ] 2–3 more blog posts from keyword map ("Why Stripe test mode isn't enough" expanded, ngrok vs clones)
- [ ] Track branded AI prompts monthly: "best WireMock alternative", "autonomous QA agent", "Playwright trace alternative"

### P2 — Ongoing
- [ ] YouTube demo (60s Cartographer crawl → spec export) — video citations rising in AI answers
- [ ] Reddit r/devops, r/QualityAssurance, r/webdev participation with genuine technical answers linking to clone docs
- [ ] Monitor server logs for `OAI-SearchBot`, `PerplexityBot`, `GPTBot` hit rates on key URLs
- [ ] Consider `HowTo` schema on docs quickstart sections

### P3 — Measure
- GSC impressions by surface subdomain (after DNS verification)
- Manual AI prompt audits (10–20 category queries × ChatGPT, Perplexity, Gemini)
- Waitlist `source` field in Google Sheet — which pages convert

---

## What not to do

- Don't block AI search bots while allowing Googlebot — you become invisible in ChatGPT/Perplexity.
- Don't treat llms.txt as a substitute for content, schema, or backlinks.
- Don't keyword-stuff FAQ schema — keep answers honest and specific.
- Don't use `docs.molar.it` (not live) — confuses entity graph; docs stay at `molar.it/docs`.

---

*Last updated: 2026-06-28. Revisit after major AI search product changes or quarterly GSC review.*
