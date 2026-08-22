# BLOG WRITER SPEC — read fully before writing anything

You are writing static HTML blog posts for Molar's marketing site.

## Product context (use naturally, don't stuff)
Molar (molar.it) is an autonomous QA platform: an AI agent (Cartographer) crawls your app and authors Playwright-grade tests from plain-English scenarios; stateful destruction-safe clones of Stripe/Twilio/email/S3/auth/GitHub etc. let tests run without real cards, emails, SMS, or storage; Guard gates pull requests with required GitHub checks, monitors production on schedules, and can open fix PRs; Trace replays every run deterministically with DOM/network/console/clone evidence. Free tier at https://app.molar.it.

## TEMPLATE — mandatory
Read `/Users/personal/coding/Molar/molar.it/blog/ai-playwright-test-generation.html` first. Copy its EXACT skeleton:
- Same `<head>` order: charset/viewport → title → meta description → canonical → robots → OG (type article) → Twitter → JSON-LD script (BreadcrumbList 3 items + BlogPosting) → favicon link → fonts link → CSS links in this order: `/home.css`, `/seo-pages.css`, `/waitlist-modal.css`, `/blog.css`.
- Body: `<body style="background:#faf9f6">` → `<div id="chrome-nav"></div>` → `<main class="post-wrap">` → crumbs nav → `.post-kicker` (the tag) → `h1.post-title` → `p.post-lede` → `.post-meta` (Pratik Rana · date · N min read) → `div.post-body` with 5–7 `<section>` blocks, each starting `<h2><span class="h-num">0X</span>…</h2>` → one `.post-cta` band near the end → close body divs → `<aside class="post-related"><h2>Keep reading</h2><div class="related-grid">` with exactly 3 `<a class="related-card">` (each has `.rc-tag` + `.rc-title`) → `</aside></main>` → `<div id="chrome-footer"></div>` → the SAME scripts block as the exemplar (site-config.js, react, react-dom, babel, marketing-chrome.jsx, blog-boot.jsx, waitlist-modal.js).

## Content rules
- ≥900 words of genuinely useful engineering content. No fluff, no repetition, no lorem.
- Every post: ≥1 code block (`pre/code`), ≥1 callout (`div.post-callout`, optionally `warn` or `signal` variant), ≥3 internal links woven into prose from the LINK POOL below (use real URLs), 1 CTA band (headline + 2 lines + buttons: primary `https://app.molar.it` "Get started free" with `<span class="arr"> →</span>`, ghost `/docs` "Read the docs").
- H2 count 5–7 numbered 01..07. Write for staff/principal engineers. Concrete numbers, real failure modes, honest tradeoffs. Mention Molar only where it genuinely helps; never claim prices or fake stats.
- Title tag ≤60 chars + " | Molar". Meta description ≤155 chars. dateModified = 2026-08-22. Author Pratik Rana.
- JSON-LD keywords field: 3–4 comma-separated SEO phrases for that post.
- Do NOT invent customer names or metrics attributed to third parties. The GitHub 46% AI-code stat may be cited as "GitHub, 2026".

## LINK POOL (only these internal URLs)
- Posts: /blog/test-stripe-without-real-cards, /blog/ai-playwright-test-generation, /blog/flaky-tests-causes-and-fixes, /blog/self-healing-test-automation, /blog/e2e-testing-best-practices, /blog/github-actions-playwright-ci, /blog/required-status-checks-merge-gate, /blog/synthetic-monitoring-production, /blog/test-twilio-sms-otp-flows, /blog/email-workflow-testing-otp, /blog/api-mocking-vs-service-clones, /blog/regression-testing-strategies, /blog/testing-third-party-apis-safely, /blog/continuous-testing-ci-cd-pipeline, /blog/staging-environment-alternatives, /blog/ai-agents-future-software-testing, /blog/shift-left-testing-explained, /blog/playwright-vs-cypress-comparison, /blog/startup-qa-without-qa-team, /blog/test-data-management-best-practices, /blog/visual-regression-testing-guide
- Site: /docs, /qa-agent, /thesis, /vs/cypress, /vs/playwright, /vs/wiremock, /vs/checkly, /vs/playwright-trace, /integrations/github-actions, /changelog
Related-card slugs must come from this pool too (prefer posts over site pages).

## YOUR ASSIGNMENT
Write ONLY the posts assigned to you (see dispatch message). Create each file with the Write tool at `/Users/personal/coding/Molar/molar.it/blog/<slug>.html`. Do not modify any other file. When done, reply with just the list of files created and their word counts.
