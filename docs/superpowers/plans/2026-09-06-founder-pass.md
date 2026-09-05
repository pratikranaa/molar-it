# Founder-led Marketing Improvement Plan

**Goal:** Make Molar's value tangible and distinctive enough that a first-time buyer can understand the product, inspect credible evidence, and choose a useful next step.

**Architecture:** Keep the static site, existing green/coral identity, typography-only wordmark, route library, and QA/platform positioning. Recompose the main pages around a wide browser-and-observation workbench. Introduce one interactive service section and actual recorded evidence where provenance supports it. Apply shared responsive improvements to related pages without another palette reset.

**Tech stack:** Semantic HTML, authored SVG geometry, CSS, small vanilla JavaScript modules, existing Python/Node checks and Playwright.

## Decision and authorization

The user asked for continued improvement using founder judgment after the prior release was judged too familiar, too simulated, and too repetitive. A proof-led composition is selected over more decorative effects (no stronger trust) or another wholesale palette/type redesign (discards useful recognition). Implementation and deployment remain authorized. No new commercial/product claims are authorized by this design work.

Perception requirements: reduce the opening to one value statement and one main action; expose the product at the user's 833px viewport; use recognizable browser, event and outcome states; distinguish recordings from examples; explain what happens after the primary action. Do not substitute a passing route check for a persuasive page.

## Tasks

- [x] Rebuild `marketing/application-scene.mjs` and `.css`, adapt `.js`: a wide visible browser, connected service observations, failure/result and accessible playback. Start the QA example with the delayed webhook so the problem becomes apparent without interaction. Keep reduced motion, pause, replay and inspection.
- [x] Add `marketing/service-lab.mjs`, `.css`, `.js`: five core service scenarios, keyboard switching, conditions that change observed results, authored service-specific content, one example label.
- [x] Inspect real run artifacts and publish only reviewed, safe recordings/screenshots with traceable provenance. No fabricated product screenshots, customer stories, generated-test exports or capacity claims.
- [x] Recompose QA and platform in `scripts/build-marketing.mjs`; shorten the opening, eliminate repeated sample-story sections, add useful onboarding/next-action context. Update shared assets via `marketing/document.mjs` and `scripts/build-site.mjs`.
- [x] Build and verify all rendered routes; browser-check hero, service controls, recordings, navigation, signup handoff and responsive page families at 1440, 833 and 390px. Check text/controls, not just overflow.
- [x] Inspect in one batched round, fix material issues together, run one design detector for this new pass, and seek fresh independent review against the founder-level brief and prior rejected composition. Reviewer must assess persuasion and identity as well as technical defects.
- [ ] Update DESIGN.md/sidecar from the final built truth, publish the verified revision to existing Pages, compare live files and interactions, and record release evidence with a scoped parent submodule/status commit.

Completion requires actual visual and interaction evidence for each improvement. A missing authentic recording remains an explicit gap to resolve, not a reason to relabel an illustration as proof.

Fresh finish review: initial `fix` for mobile caption spacing, recording poster loading and stale design documentation; all three resolved. Final verdict `ship` covers those scored fixes. Root independently verified all route widths, interactions and controlled runtime evidence.
