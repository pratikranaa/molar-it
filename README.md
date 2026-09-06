# molar-it

Public home for **[Molar](https://molar.it)** — continuous QA testing platform & autonomous AI agent.

This repo contains the marketing site source (`molar.it`). Product code lives in the private Molar monorepo under `../` (sibling checkout: `Molar/molar.it/`).

## Live site

| | |
|---|---|
| **Website** | https://molar.it |
| **Cartographer** | https://molar.it/products/cartographer |
| **Clones** | https://molar.it/products/clones |
| **Guard** | https://molar.it/products/guard |
| **Trace** | https://molar.it/products/trace |
| **QA Agent** | https://molar.it/qa-agent |
| **Docs** | https://molar.it/docs |
| **App** | https://app.molar.it |

## Quickstart

```bash
molar verify "login works" --url http://localhost:3000 --json
```

## Build and develop locally

```bash
node scripts/build-site.mjs
python3 scripts/serve-marketing.py --port 8080
# http://localhost:8080 — supports the same clean URLs as Cloudflare Pages
```

The main site is pre-rendered HTML. `marketing/components.mjs`, `site.css`, and `site.js` provide the shared navigation, design, and interactions. `scripts/build-*.mjs` render the QA homepage, general platform, product/solution pages, company, pricing, resources, articles, policies, and clone documentation. Original editorial and legacy text is stored separately from generated HTML. `/verify` retains its React runtime; other rebuilt pages require no React/Babel boot.

`marketing/product-graphics.mjs` and `.css` provide original geometric product illustrations. `marketing/refinement.css` composes the four distinct navigation panels, open guide shelves, product walkthrough and browser-output section. `marketing/guide-previews.mjs` maps illustrated previews to existing guides; the same artwork appears on blog covers. Motion uses existing visibility and reduced-motion handling, with no added runtime dependency.

The QA opening is a full-width browser and observation workbench. Its delayed-webhook example exposes a successful payment with missing account access by default; changing the condition changes the result. At 833px the observed outcome is visible in the first viewport; phones show observations before browser details. The platform hero follows an invoice download. `marketing/application-scene.mjs`, `.js`, and `.css` own these labeled examples, with autoplay, persistent manual pause, replay, evidence inspection, reduced-motion and visibility handling. `marketing/illustrations.mjs` authors the supporting service, role, release, and task scenes. `marketing/identity.css` carries the living-application identity. `marketing/service-lab.mjs`, `.js`, and `.css` provide five interactive service scenarios with keyboard tabs and condition controls. `/examples/team-invitation` contains actual controlled admin/member browser recordings, executed through Molar runtime and Playwright with Auth/Email Clones. It explicitly distinguishes scripted runtime evidence from autonomous AI decisions. Media provenance and file hashes are in `assets/invitation-run.json`. Swarm remains a preview.

`/examples/team-invitation` presents a recorded controlled test with a public, redacted result at `/assets/invitation-run.json`. It reports the observed two-browser invitation flow; it is not a customer testimonial or a capacity claim. The result includes artifact hashes, not downloadable private recordings.

Run `node --test scripts/application-scene.test.mjs` to verify the hero’s causal state transitions.

Run `python3 scripts/check-marketing.py` after building. It checks the published package's internal links, assets, heading counts, IDs, anchors, and JSON-LD.

Run `python3 scripts/check-navigation.py --base http://localhost:8080` for hover latency, continuous menu switching, keyboard/touch dismissal, reduced motion, mobile styling, and product-tab regressions. It measures both primary routes at normal and 4× CPU slowdown. Use `--out` to retain the report/screenshots and `--baseline` to record a comparison without enforcing the responsiveness budget. Browser measurements are not field INP or a physical-device FPS guarantee.

Deploy to the **existing** Cloudflare Pages project:

```bash
node scripts/build-site.mjs
python3 scripts/check-marketing.py
npx wrangler pages deploy .site-dist --project-name molar-it --branch main
```

`.site-dist` contains an explicit allowlist of rendered HTML and public assets. Wrangler separately compiles the three API functions from the root `functions/` directory. Never deploy the repository root: it contains source, review files, configuration and large local film outputs. Verify the resulting deployment with `python3 scripts/check-live-marketing.py --deployment https://DEPLOYMENT.molar-it.pages.dev --output /tmp/molar-live-check.json`. This compares every canonical page and runtime asset, accounting only for Cloudflare’s observed email obfuscation, its exact managed robots prefix (reported separately), and same-path trailing-slash redirects.

The apex already points to the Pages project; this rebuild does not require DNS changes or another project.

Instant Proof / waitlist secrets (never commit):

```bash
npx wrangler pages secret put INSTANT_PROOF_PROXY_SECRET --project-name molar-it
npx wrangler pages secret put WAITLIST_WEBHOOK_URL --project-name molar-it      # optional
```

### Instant Proof (`/verify`)

Public URL+claim verification before signup. Requires Pages env on project `molar-it`:

| Variable | Required | Notes |
|----------|----------|-------|
| `INSTANT_PROOF_PROXY_SECRET` | yes (≥32 chars) | HMAC for browser/network identity cookie; must match control-plane proxy verification if shared |
| `MOLAR_CONTROL_PLANE_URL` | configured in `wrangler.jsonc` | `https://api.molar.it/plumbing-api`; preserves the public path prefix |

The browser reads captured step frames while polling, waits for the final frame before the verdict, and offers actual token-based read-only sharing at `/verify#…`. Tokens are removed from the address bar and kept in memory. Only server terminal results expose saving/sharing; expired and unavailable runs show a recovery message. Private proof views do not load Google Analytics.

Local: `python3 -m http.server` does **not** run `/api/instant-proof` — use `npx wrangler pages dev .site-dist` or deploy.

**Clone docs:** the canonical reference lives at `https://docs.molar.it/docs/clones`. Catalog entries open its `/vendors/:id` guides. Former marketing `/docs/clones/:id` URLs permanently redirect there; this build no longer creates a second copy of the documentation.

Product pages on the main site live at `/products/cartographer`, `/products/clones`, `/products/guard`, `/products/trace`, and `/products/mender`. Legacy short paths redirect to these pages. Separate historical subdomain deployments are outside this build.

The four core product pages use `marketing/product-pages.mjs` for their shared opening and section navigation, with separate `product-{name}.mjs`, `.css`, and `.js` stories. They contain a service-state inspector, route-map workbench, release-check console, and synchronized trace example. These are authored browser-only examples, not live app sessions. Their CSS and JavaScript load only on the matching product route and are explicitly staged by `build-site.mjs`. Actual recordings remain labeled and linked to their public results.

Run `node --test scripts/product-stories.test.mjs` for causal state checks and `python3 scripts/check-product-stories.py --base http://localhost:8878 --out /tmp/molar-product-stories` for browser interactions and the batched responsive/contrast captures. The first-visit script retains the shared-scene checks for the other 17 supporting pages.


**CTAs:** “Get started” in the desktop/mobile header and homepage/platform heroes opens dashboard signup. Public-page verification remains a secondary preview, with no-account wording attached only to that action. Main marketing signup links use `https://app.molar.it/signup`; sign-in uses `/login`. The rebuilt main site has a dedicated `/waitlist` form and no automatic waitlist popup.

### Waitlist — receive signups for $0

The deployed `/waitlist` form posts to `/api/waitlist` and stores a deduplicated record in `WEBSITE_DB`. The database is the production destination; the integrations below are optional fallbacks for environments without D1.

**Optional fallback: Google Sheets + email alert**

1. Create a Google Sheet with tab **Waitlist** and headers: `Timestamp | Email | Company | Role | Source`
2. **Extensions → Apps Script** → paste [`scripts/google-sheets-waitlist.gs`](scripts/google-sheets-waitlist.gs)
3. **Deploy → New deployment → Web app** (Execute as: Me, Who has access: **Anyone**)
4. Copy the deployment URL
5. In **Cloudflare** → Pages → `molar-it` → Settings → Environment variables (or `wrangler pages secret put WAITLIST_WEBHOOK_URL --project-name molar-it`):
   - `WAITLIST_WEBHOOK_URL` = your Google Apps Script web app URL
6. **Redeploy** (`npx wrangler pages deploy .site-dist --project-name molar-it --branch main`)

You get every signup as a spreadsheet row plus an email to `pratik@molar.it` (edit `NOTIFY_EMAIL` in the script). No Loops, Zapier, or paid form tools required.

| Env var | Cost | Behavior |
|---------|------|----------|
| `WAITLIST_WEBHOOK_URL` | **$0** | POST JSON to Google Apps Script (or any HTTPS endpoint) |
| `LOOPS_API_KEY` | paid tier eventually | Optional — Loops.so contact list |

The deployed site stores requests in `WEBSITE_DB`. An environment without that binding needs `WAITLIST_WEBHOOK_URL` or Loops; otherwise the API returns `503` and the form shows an error.

## SEO / launch

See [`seo-launch-kit/00-START-HERE.txt`](seo-launch-kit/00-START-HERE.txt) for Search Console, directory listings, and launch post templates.

**Keyword map:** [`seo-launch-kit/keyword-map.txt`](seo-launch-kit/keyword-map.txt) — competitors, target queries, and GSC checklist per surface (Clones, Cartographer, Guard, Trace).

**Sitemap:** regenerate after clone catalog changes:

```bash
node scripts/build-site.mjs   # sitemap generated from the rendered canonical pages
```

**Search and sharing:** rendered pages carry canonical URLs, linked entity/page/breadcrumb metadata and article publication facts. The build creates a route-specific 1200×630 sharing image in `assets/social/`, a full guide feed at `/feed.xml`, and source maps at `/llms.txt`, `/llms-full.txt` and `/agent-map.json`. These files improve discovery; search rankings and AI citations remain external outcomes. Cloudflare's managed training-crawler policy is separate from the source robots rules for search/retrieval bots.

## Blog reading experience

`marketing/article-page.mjs` is the shared article renderer. It adds a desktop table of contents, a native mobile contents disclosure, calculated reading time, truthful publication/update dates, copyable code, three related guides, a relevant product next step and a follow-up question form. Topic-specific figures in `article-graphics.mjs/css` explain payment callbacks, OTP cases, release checks, agent proposals, test data, debugging, visual baselines, service substitutes, downloads and framework choices. They remain readable without JavaScript and do not run background animation loops.

The listing retains category filters and local search. Typing does not send a request. An explicit empty-result action can submit the search as a question; quota responses retain source links. Answers can be copied or saved as a text file in the visitor's browser. The same `ask-workspace.mjs` and `ask.js` power all three entry points.

`python3 scripts/check-blog-browser.py` checks filters, explicit submission, copy/save, quotas, source fallback, no-match, cancellation, code copying, mobile contents and article overflow at 390/833/1440px. It mocks inference. Set `MOLAR_CHECK_OUT` to choose the local evidence folder.

## Ask Molar and query publishing

`/ask`, the blog listing, and article follow-up forms answer general browser-testing questions using a reviewed public corpus in `content/knowledge.mjs`. The same corpus feeds the editorial generator. The visitor tool has no access to private product plans, credentials or arbitrary URLs. It returns only validated citation identifiers; invalid or unavailable inference returns explicitly labeled source guidance. Requests and answers are not persisted. Quotas store a daily salted network hash and expire after two days; cleanup runs during subsequent requests.

Production bindings in `wrangler.jsonc`: `AI` and `WEBSITE_DB`. Apply `npx wrangler d1 migrations apply molar-website --remote` before deployment. Set `WEBSITE_REQUEST_SECRET` using `wrangler pages secret put` via stdin, never in source. The public answer endpoint has atomic caps of six requests per network per hour and 40 generated attempts per day across the site. No paid capacity was added. If limits are reached, visitors can still browse the guides.

Generate and publish from a target query:

```bash
node scripts/generate-query.mjs "How do I test delayed payment webhooks and account access?"
node scripts/preview-query.mjs .content-drafts/<slug>.json
# Open the printed localhost preview URL (serve-marketing.py --port 8080).
# Review the draft against every cited source; previewing does not approve it.
# Correct unsupported claims; set status: reviewed and reviewedBy to the editor.
node scripts/publish-query.mjs .content-drafts/<slug>.json
node scripts/build-site.mjs
node --test scripts/*.test.mjs
python3 scripts/check-marketing.py
```

Draft validation checks metadata, plain-text sections and known citations. Publication additionally requires an explicit reviewer and at least 450 words; these checks do not replace factual review. Editors may add an optional `code` string to a section after verifying the example; it is HTML-escaped and rendered with a copy control. An optional category can be `Integrations`, `Engineering` or `Agents`. Short drafts can be previewed but cannot be published. Existing filenames are never overwritten by generation or publication.

Generation uses the operator's existing Wrangler session (or `CLOUDFLARE_API_TOKEN`). Drafts are excluded from Git and the deployed package. Publishing adds reviewed structured content under `content/published/`; the regular build places it in the blog, feed, sitemap and social-card inventory. It never automatically indexes visitor questions. Examples from this workflow are `/blog/testing-delayed-payment-webhooks-and-account-access` and `/blog/verify-downloaded-invoice-browser-test`. The latter was revised after generation, with its illustrative Playwright transport check run against a synthetic download and an intentionally invalid attachment. It does not claim to implement PDF field parsing.

The waitlist now saves to `WEBSITE_DB` without requiring a paid email provider. It does not automatically send messages. Authorized operators can export signup records with Wrangler; avoid printing those records into shared logs. Duplicate email submissions are idempotent. Existing optional webhook/Loops behavior remains a fallback for environments without the database binding.

## Analytics

The supplied GA4 measurement ID is `G-2YL3J3PX8R`. `marketing/analytics.js` loads the Google tag only after analytics consent, keeps advertising consent denied, respects Global Privacy Control and exposes **Privacy choices** in the footer. Withdrawal clears Google cookies and disables future hits. The tag stays off the private `/verify` instrument and URLs containing query strings or fragments because Google’s automatic search events can inspect those independently of `page_location`. Clean public pages send sanitized page views and fixed-label interactions after consent. Form destinations are explicit clean paths; input values are never passed to analytics.

The browser contract tests exercise consent, withdrawal, GPC and sensitive query handling. `python3 scripts/check-live-analytics.py` also exercises the real Google tag and collection requests with synthetic canaries. GA4 reporting, Enhanced Measurement settings and Search Console submission require access to the owner's Google account. Confirm the data-stream settings before treating aggregate reporting as verified; the tag itself does not prove account-side configuration or indexing.

**Docs architecture:** The full product documentation is the Next.js site at **`https://docs.molar.it`** (source: `apps/docs-site` in the Molar monorepo). It has its own sitemap and JSON-LD, and its `Organization` node shares the same `@id` (`https://molar.it/#org`) so the two properties resolve to one entity. `docs.molar.it` is in this site's schema `sameAs` and is cross-linked from `llms.txt`. Do **not** list another domain's URLs in `molar.it/sitemap.xml` — each host serves its own sitemap.

`molar.it/docs` (`docs.html`) is a thin marketing quickstart landing plus the long-tail per-clone SEO pages at `/docs/clones/:slug`; it links into `docs.molar.it` for full reference. Keep the two surfaces distinct in intent to avoid duplicate content.

## Contact

- pratik@molar.it
- [LinkedIn](https://www.linkedin.com/in/ranapratik/)

© 2026 Molar Labs · Bengaluru


A real autonomous four-step browser recording is published at `/examples/autonomous-browser-check`. Its unedited video, final screenshot and minimal public result (with checksums) live in `assets/browser-check/`. Source run `bf51caf0-8c86-4271-b6e9-d4a2de761665` completed Add → presence → Delete → absence on the public Heroku fixture. Primary independently reviewed the recording and checksums. The page explicitly does not claim generated Playwright export/replay, customer results or a reliability benchmark. It is separate from the scripted multi-user invitation example.
