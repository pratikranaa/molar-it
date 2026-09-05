# Molar Identity Implementation Plan

Goal: replace the generic marketing presentation with an expressive living application identity and clear customer language throughout the site.

Architecture: preserve the static HTML build and route library. Replace the main page composition and hero demonstration; rebuild the reusable scene system and update the shared shell. Keep commercial and capability claims grounded in PRODUCT.md and the monorepo status evidence.

Tech stack: semantic HTML, authored SVG/CSS, small JavaScript modules, Python build validation.

- [x] Audit and rewrite product, solution, company, changelog, resource and editorial copy in marketing/pages.mjs and scripts/build-{company,resources,legacy,editorial}.mjs. Remove infrastructure news and internal implementation caveats; retain meaningful availability notes and technical documentation.
- [x] Replace marketing/illustrations.mjs and illustrations.css with large legible scenes for checkout, identity, collaboration, preview, automation, extraction, swarm and trace. Keep the featureVisual(kind) API; no new runtime dependencies.
- [x] Create marketing/application-scene.mjs, application-scene.css and application-scene.js for the causal browser/service/account demonstration. Controls: delay/deliver callback, pause/replay, inspect evidence. Add matching generic automation mode. Test observable state transitions and pause semantics in scripts/application-scene.test.mjs with node --test.
- [x] Rewrite scripts/build-marketing.mjs composition around the scene and fewer stronger visual chapters. Update marketing/components.mjs navigation, product views and CTA copy. Update marketing/site.css and document.mjs for the identity and module loading; update scripts/build-site.mjs runtime allowlist.
- [x] Inspect trustworthy controlled-run evidence in parent docs/evidence before adding any actual-run artifact. If a source does not support a claim, keep the example labeled and disclose the missing proof in completion notes.
- [x] Build with node scripts/build-site.mjs and validate using python3 scripts/check-marketing.py. Run syntax and scene tests. Browser-inspect QA, platform, product, solution, resources/article, pricing/contact and mobile navigation with desktop/mobile captures.
- [x] Run Impeccable detector once on the built target. Fix mechanical issues from the combined inspection. Fresh finish reviewer evaluates the contract and screenshots; resolve its material findings in a bounded batch.
- [x] Document the resulting system in DESIGN.md and .impeccable/design.json, update README and parent STATUS.md, commit and push only scoped marketing changes, deploy .site-dist to existing molar-it Pages project, verify with scripts/check-live-marketing.py, then commit the parent pointer and scoped status.

Authorization: user approved the full critique on 2026-09-06 and asked to fix every issue deeply. Earlier user instructions authorize direct-main commits, deployment and bounded disjoint Luna implementation agents. Proceed without another execution-choice question.

Release: runtime source bdb9959, Pages f003bd59. All 114 deployed pages/assets matched; live browser checks passed. Parent STATUS.md and docs/evidence/molar-marketing-2026-09-06 contain the release record.
