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
npx molar-agent init
```

## Develop locally

```bash
cd molar.it   # from monorepo root, or clone this repo standalone
python3 -m http.server 8080
# open http://localhost:8080
```

Deploy: `vercel --prod` (Vercel project `molar` → molar.it).

**Clone docs:** per-clone tool tables are generated from `molar-clones` fixtures. After changing fixtures, run:

```bash
node scripts/gen-clone-routes.mjs
node scripts/gen-sitemap.mjs
```

Surface landings use subdomains (`cartographer.molar.it`, etc.). Add each as a domain on the Vercel project and point DNS (CNAME to `cname.vercel-dns.com`). Old paths (`/cartographer`, …) 301 to the subdomain.

**CTAs:** `https://app.molar.it` is live for the main Molar product. Surface landings (Cartographer, Clones, Guard, Trace) only have marketing pages today — any `app.molar.it` button opens an in-page waitlist popup (`waitlist-modal.js`, Calendly-style) with `data-waitlist-surface` on `<body>`.

### Waitlist — receive signups for $0

Flow: visitor clicks CTA on e.g. `clones.molar.it` → popup form → `POST https://molar.it/api/waitlist` → your webhook stores the row.

**Recommended (free): Google Sheets + email alert**

1. Create a Google Sheet with tab **Waitlist** and headers: `Timestamp | Email | Company | Role | Source`
2. **Extensions → Apps Script** → paste [`scripts/google-sheets-waitlist.gs`](scripts/google-sheets-waitlist.gs)
3. **Deploy → New deployment → Web app** (Execute as: Me, Who has access: **Anyone**)
4. Copy the deployment URL
5. In **Vercel** → Project `molar` → Settings → Environment Variables:
   - `WAITLIST_WEBHOOK_URL` = your Google Apps Script web app URL
6. **Redeploy** (`vercel --prod`)

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
node scripts/gen-sitemap.mjs   # 51 URLs: main site + surfaces + 28 clone docs + comparisons
node scripts/gen-clone-routes.mjs
```

**OG images (TODO):** surface pages reference per-product social images at `/og-clones.png`, `/og-cartographer.png`, `/og-guard.png`, `/og-trace.png` (1200×630). Create and deploy to `molar.it/` root for rich social previews.

**Docs architecture:** The full product documentation is the Next.js site at **`https://docs.molar.it`** (source: `apps/docs-site` in the Molar monorepo). It has its own sitemap and JSON-LD, and its `Organization` node shares the same `@id` (`https://molar.it/#org`) so the two properties resolve to one entity. `docs.molar.it` is in this site's schema `sameAs` and is cross-linked from `llms.txt`. Do **not** list another domain's URLs in `molar.it/sitemap.xml` — each host serves its own sitemap.

`molar.it/docs` (`docs.html`) is a thin marketing quickstart landing plus the long-tail per-clone SEO pages at `/docs/clones/:slug`; it links into `docs.molar.it` for full reference. Keep the two surfaces distinct in intent to avoid duplicate content.

## Contact

- pratik@molar.it
- [LinkedIn](https://www.linkedin.com/in/ranapratik/)

© 2026 Molar Labs · Bengaluru
