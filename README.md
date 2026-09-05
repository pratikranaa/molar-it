# molar-it

Public home for **[Molar](https://molar.it)** — continuous QA testing platform & autonomous AI agent.

This repo contains the marketing site source (`molar.it`). Product code lives in the private Molar monorepo under `../` (sibling checkout: `Molar/molar.it/`).

## Live site

| | |
|---|---|
| **Website** | https://molar.it |
| **Cartographer** | https://cartographer.molar.it |
| **Clones** | https://clones.molar.it |
| **Guard** | https://guard.molar.it |
| **Trace** | https://trace.molar.it |
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

Run `python3 scripts/check-marketing.py` after building. It checks the published package's internal links, assets, heading counts, IDs, anchors, and JSON-LD.

Deploy to the **existing** Cloudflare Pages project:

```bash
node scripts/build-site.mjs
python3 scripts/check-marketing.py
npx wrangler pages deploy .site-dist --project-name molar-it --branch main
```

`.site-dist` contains an explicit allowlist of rendered HTML and public assets. Wrangler separately compiles the two existing API functions from the root `functions/` directory. Never deploy the repository root: it contains source, review files, configuration and large local film outputs. The apex already points to the Pages project; this rebuild does not require DNS changes or another project.

Instant Proof / waitlist secrets (never commit):

```bash
npx wrangler pages secret put INSTANT_PROOF_PROXY_SECRET --project-name molar-it
npx wrangler pages secret put MOLAR_CONTROL_PLANE_URL --project-name molar-it   # optional; default https://api.molar.it
npx wrangler pages secret put WAITLIST_WEBHOOK_URL --project-name molar-it      # optional
```

### Instant Proof (`/verify`)

Public URL+claim verification before signup. Requires Pages env on project `molar-it`:

| Variable | Required | Notes |
|----------|----------|-------|
| `INSTANT_PROOF_PROXY_SECRET` | yes (≥32 chars) | HMAC for browser/network identity cookie; must match control-plane proxy verification if shared |
| `MOLAR_CONTROL_PLANE_URL` | optional | Defaults to `https://api.molar.it` |

Local: `python3 -m http.server` does **not** run `/api/instant-proof` — use `npx wrangler pages dev .site-dist` or deploy.

**Clone docs:** per-clone tool tables are generated from `molar-clones` fixtures. After changing fixtures, run:

```bash
node scripts/build-site.mjs
```

Product pages on the main site live at `/products/cartographer`, `/products/clones`, `/products/guard`, `/products/trace`, and `/products/mender`. Legacy short paths redirect to these pages. Separate historical subdomain deployments are outside this build.

**CTAs:** main marketing signup links use `https://app.molar.it/dashboard/signup`; sign-in uses `/dashboard/login`. The rebuilt main site has a dedicated `/waitlist` form and no automatic waitlist popup.

### Waitlist — receive signups for $0

Flow: visitor clicks CTA on e.g. `clones.molar.it` → popup form → `POST https://molar.it/api/waitlist` → your webhook stores the row.

**Recommended (free): Google Sheets + email alert**

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

Until `WAITLIST_WEBHOOK_URL` (or Loops) is set, the API returns `503` and the form shows an error.

## SEO / launch

See [`seo-launch-kit/00-START-HERE.txt`](seo-launch-kit/00-START-HERE.txt) for Search Console, directory listings, and launch post templates.

**Keyword map:** [`seo-launch-kit/keyword-map.txt`](seo-launch-kit/keyword-map.txt) — competitors, target queries, and GSC checklist per surface (Clones, Cartographer, Guard, Trace).

**Sitemap:** regenerate after clone catalog changes:

```bash
node scripts/build-site.mjs   # sitemap generated from the rendered canonical pages
node scripts/gen-clone-routes.mjs
```

**OG images (TODO):** surface pages reference per-product social images at `/og-clones.png`, `/og-cartographer.png`, `/og-guard.png`, `/og-trace.png` (1200×630). Create and deploy to `molar.it/` root for rich social previews.

**Docs architecture:** The full product documentation is the Next.js site at **`https://docs.molar.it`** (source: `apps/docs-site` in the Molar monorepo). It has its own sitemap and JSON-LD, and its `Organization` node shares the same `@id` (`https://molar.it/#org`) so the two properties resolve to one entity. `docs.molar.it` is in this site's schema `sameAs` and is cross-linked from `llms.txt`. Do **not** list another domain's URLs in `molar.it/sitemap.xml` — each host serves its own sitemap.

`molar.it/docs` (`docs.html`) is a thin marketing quickstart landing plus the long-tail per-clone SEO pages at `/docs/clones/:slug`; it links into `docs.molar.it` for full reference. Keep the two surfaces distinct in intent to avoid duplicate content.

## Contact

- pratik@molar.it
- [LinkedIn](https://www.linkedin.com/in/ranapratik/)

© 2026 Molar Labs · Bengaluru
