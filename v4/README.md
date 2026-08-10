# Molar marketing v4

Isolated **future** marketing homepage for [molar.it](https://molar.it). It does **not** replace the live root homepage.

## Why `molar.it/v4/`

| Option | Verdict |
|--------|---------|
| `molar.it/v4/` | **Chosen** — lives in the existing marketing submodule, previewable as `https://molar.it/v4/` once deployed, mirrors how `concepts/` keeps experiments isolated. |
| `molar.it-v4/` sibling | Extra repo/submodule noise for one page. |
| `apps/marketing-v4/` | Wrong home — marketing ships from the `molar.it` Vercel project, not the monorepo apps tree. |

Production root (`index.html` / `home.jsx`) stays untouched. This folder is linkable and versioned for a future cutover.

## Design reference

Structure and conversion rhythm inspired by [GraspNote](https://www.graspnote.com/):

1. Brand-forward sticky nav + dual CTAs  
2. Hero (brand → headline → lede → CTAs → desk snapshot + interactive product moment)  
3. Feature section with live product mock panels  
4. Accordion deep-dive + agent terminal panel (“Meet the agent…”)  
5. Three-beat loop (say → run → prove)  
6. Trust / scale pair  
7. Conversion band (no invented pricing tiers)  
8. FAQ accordion  
9. Closing CTA  

Visual system stays **Molar**: porcelain canvas, vermilion signal, Bricolage Grotesque + Instrument Sans + Geist Mono (self-hosted from `../fonts/`). Card rhythm (12–16px radius, 1px borders, soft shadows, list-item anatomy) aligned to GraspNote app cleanliness — **not** purple SaaS defaults.

Claims map to real products: universal browser automation + verification, Cartographer, Guard, Clones, Trace, MCP/CLI, Instant Proof (`/verify`).

## Preview locally

From the monorepo root (or a standalone `molar-it` clone):

```bash
cd molar.it
python3 -m http.server 8080
# open http://localhost:8080/v4/
```

No build step. Static HTML/CSS/JS only.

## Deploy notes

- Files ship with the `molar` Vercel project when this submodule is deployed.
- `robots`: `noindex` until a deliberate cutover — this is future marketing, not the public homepage yet.
- Soft link: live homepage footer Resources → **Preview** (`/v4/`) — discreet, does not hijack primary CTAs.
- Still `noindex` until an explicit cutover.
