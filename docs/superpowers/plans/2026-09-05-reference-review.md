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
- [web.dev reduced motion](https://web.dev/articles/prefers-reduced-motion): motion preferences are respected. Playback is user-initiated, pauses offscreen or in a hidden tab, and offers pause/replay. All static content is visible without animation.

## Design and truth boundaries

The visual system uses Hanken Grotesk, charcoal, warm white and coral. Green means an observed success. The homepage demo is explicitly an illustrative walkthrough, with no live execution represented. The real `/verify` flow retains its existing runtime and API contract. Public customer logos, testimonials, revenue, commercial terms and claimed scale have not been inferred from private YC drafts.

## Deferred work requested by the user

GA4 property G-2YL3J3PX8R; a deeper SEO/AEO pass; query-to-draft publishing; visitor-facing generated answers. The user explicitly asked to finish design first. Basic static page metadata and a current sitemap accompany the design; no ranking guarantee is made.
