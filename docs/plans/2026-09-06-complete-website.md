# Complete website implementation plan

**Goal:** Finish the original public website package, including the previously deferred measurement and query-driven content work.

**Architecture:** Preserve the pre-rendered site and established Molar visual system. Add a small sourced-answer tool at `/ask`, a local authenticated query-to-article workflow, generated discovery files, and consent-gated analytics. Existing Pages Functions handle private requests; D1 stores signup records and short-lived quotas, never visitor questions. The AI binding uses bounded inference within the existing free allocation; no paid capacity is provisioned.

## Completion checks

- [x] QA homepage, general platform, products, solutions, editorial, policies, examples, sticky navigation and responsive interactions: retain verified founder release.
- [x] Source-grounded `/ask`: answer, supporting links, no-match, loading, cancellation, retry and accessible keyboard/mobile flow. No secrets or prompts sent to analytics, no query pages indexed.
- [x] Query publishing: generate a structured draft with citations from approved public sources; review and publish it into the existing article template, blog index, sitemap and feed. Reject invalid or unreviewed drafts.
- [x] Search: coherent entity/page/article/breadcrumb metadata, per-page sharing images, feed, crawlable source maps, accurate bot policy; live checks on all generated routes.
- [x] Measurement: supplied GA4 ID, no requests before consent, aggregate events, preference changes, sanitized URLs and matching privacy copy.
- [x] Customer entry: waitlist persistence, real anonymous check, separate visitor share, secure signup handoff and saving with an existing authenticated account verified. Fresh signup email and owner reporting access remain separate checks.
- [x] Product proof: publish a genuinely autonomous multistep run with inspected recording and provenance; clearly distinguish examples from actual recordings.
- [ ] Independent validation: unit/API security checks, real browser states, desktop/mobile renders, live release comparison; update README, STATUS and evidence.

## File boundaries

- Search agent: `marketing/document.mjs`, `marketing/seo.mjs`, `scripts/build-discovery.mjs`, discovery outputs and SEO tests.
- Analytics agent: `marketing/analytics.js`, `.css`, `_headers`, analytics tests.
- Product proof agent: read-only product evidence into `/tmp/molar-fullsite-product-proof`; primary integrates approved public media.
- Primary: `content/`, query/publishing library and CLI, `/ask` page/runtime, Pages Functions, database migration/config, build integration, privacy and customer flow fixes.

## Acceptance commands

`node --test scripts/*.test.mjs`; `node scripts/build-site.mjs`; `python3 scripts/check-marketing.py`; browser test `/ask`, consent and signup with actual deployed APIs; existing 94-route responsive checks plus new routes; `scripts/check-live-marketing.py` against deployment and apex. A generated draft must survive source-link and schema validation and an editorial review before `publish-query.mjs` accepts it.

Rank position, search indexing and AI citations are external outcomes, not a completion claim. Search Console access and live backend availability must be reported from evidence, not inferred from source code.
