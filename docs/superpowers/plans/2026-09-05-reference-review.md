# Reference lessons applied to the Molar marketing rebuild

The user confirmed direct implementation, QA at `/`, general browser execution at `/platform`, the navigation groups Platform / Products / Solutions / Resources, and a complete set of supporting page types. The user rejected “Test the journey. All the way through.” as unclear to a new customer. The approved replacement is “Your users shouldn’t be your QA team.”

## Observed references

- [TesterArmy](https://tester.army/): a clear audience/problem statement, a staged create/run/result walkthrough, direct agent setup entry, detailed product evidence and a full navigation hierarchy. Molar adopts the clear problem statement and controllable sample workflow. Customer logos, metrics and expansive capability promises were not borrowed.
- [Spur](https://www.spurtest.com/): task-based demo choices, specific failed-user-flow examples in the Bug Book, readable navigation, and substantive customer evidence. Molar's checkout now includes a failed webhook condition, with payment success separated from order/receipt failure. Spur's old spurautotest hostname had a certificate error; the current site was reviewed instead.
- [Waybill](https://www.waybill.to/): a sparse interface around a clear process progression. The lesson is narrative pacing: introduce the customer's problem, show what happens, then explain the underlying products.
- [Orca](https://www.onorca.dev/): product-led storytelling and task tabs make an abstract platform concrete. Molar's QA and generalist examples use distinct browser tasks and observable outcomes.
- [Cloudflare](https://www.cloudflare.com/): a large portfolio stays navigable through clear groups, descriptive links and visible conversion paths. Molar has a shared, attached header and a wide product menu, with a mobile accordion.

## Interaction sources

- [NNGroup menu timing](https://www.nngroup.com/articles/timing-exposing-content/): pointer intent delay, immediate click/tap, and a grace period when crossing into a menu. Implementation is original, with 350 ms hover intent, click and keyboard support, Escape and outside dismissal.
- [NNGroup mega menus](https://www.nngroup.com/articles/mega-menus-work-well/): organize choices and explain destinations. A feature introduction and descriptive product links replace the earlier small, uniform dropdown.
- [web.dev reduced motion](https://web.dev/articles/prefers-reduced-motion): motion preferences are respected. The first release used user-initiated playback. The user-directed expansion autoplays visible examples, pauses for manual inspection, offscreen or in a hidden tab, and offers pause/replay. All static content is visible without animation.

## Design and truth boundaries

The visual system uses Hanken Grotesk, charcoal, warm white and coral. Green means an observed success. The homepage demo is explicitly an illustrative walkthrough, with no live execution represented. The real `/verify` flow retains its existing runtime and API contract. Public customer logos, testimonials, revenue, commercial terms and claimed scale have not been inferred from private YC drafts.

## Deferred work requested by the user

GA4 property G-2YL3J3PX8R; a deeper SEO/AEO pass; query-to-draft publishing; visitor-facing generated answers. The user explicitly asked to finish design first. Basic static page metadata and a current sitemap accompany the design; no ranking guarantee is made.

## User-directed expansion after first release

User requested autoplay, deeper hands-on hero views, custom SVG scenes, clearer first-visit copy, Swarm, expanded Platform/Solutions, and typography-only header/footer. The first release remains rollback source `4f965b1` / Pages `10bb2d98`.

Reviewed current primary sources: https://www.browserbase.com/use-cases (specific jobs grouped under automation/data/agents); https://tester.army/docs/get-started/core-concepts and https://docs.tester.army/run/pull-request-testing (tests/environment/preview task context); https://docs.spurtest.com/getting-started/web-prompting (state expected customer result); own https://cartographer.molar.it and https://clones.molar.it plus original home.css (settling motion, product panels and connected evidence). These are design/positioning references, not proof of Molar's capabilities. No competitor source code copied.

Direct browser verification on 2026-09-05 confirms Guard and Trace still serve separate marketing homepages; Guard’s Dashboard link leads to app.molar.it. The earlier observation of an app login reflected following that action, not a subdomain redirect. Recommend consolidating all four product marketing homepages under /products/* while preserving incoming addresses as permanent redirects and retaining functional app routes. No subdomain/DNS change performed in this pass.

Implementation direction: varied SVG/browser scenes explain payment callbacks, verification email, invites, preview tests, file work, extraction, role-based testing and live evidence. Swarm remains Preview; no agent-count or exhaustive-coverage claims. Hero automatically cycles visible examples, offers pause/step/view controls and sample inputs, pauses for manual inspection and offscreen/background/reduced-motion conditions. Every sample remains explicitly illustrative.
