---
version: 1
slug: "ask"
primary_target: "ask.html"
related_targets: ["marketing/ask.mjs", "marketing/ask.css", "marketing/ask.js", "marketing/analytics.css", "marketing/analytics.js", "functions/api/ask.js", "scripts/build-ask.mjs", "scripts/build-social.py", "assets/social/ask.png"]
---

# Ask Molar

Scope: the `/ask` source-grounded question surface and its shared optional analytics choice panel. Extend the existing Molar marketing identity. Preserve the typography-only `Molar.` wordmark, attached four-category navigation, light paper canvas, and green-black footer. This surface documents the current implementation and approved captures; it does not establish a new visual direction.

## Direction contract

MODE: Operate + Read. The visitor completes a small task (ask a testing question), then reads an answer with its source links.

THESIS: A useful answer should leave a clear path to deeper reading. Keep the question workspace and public source rail visible as two parts of one working surface.

OWN-WORLD: Use the existing paper (`#f7f8f2`), working ink (`#202b23`), hairline green (`#cdd5c5`), signal coral (`#f26342`), and Hanken voice. The rail’s origin dot and branching connector extend the application-map language already established elsewhere on the site.

## Layout and responsive behavior

DESKTOP: The intro uses a `1.4fr 1fr` grid with a `64px` gap. The primary layout uses `minmax(0,1.65fr) minmax(260px,1fr)` with a `72px` gap. The question workspace begins with a `1px` top rule and the public source rail begins with a `1px` left rule and `32px` left padding. The rail contains a `260px` maximum-width, `90px` high branching SVG connector.

TABLET: At `max-width: 900px`, the intro gap is `32px`, the layout gap is `36px`, the rail has `24px` left padding, and the submit row may wrap. The shared content wrap is `calc(100% - 48px)`.

MOBILE: At `max-width: 640px`, the intro is one column with `40px` top padding and `30px` bottom padding. The whole layout becomes one column with a `48px` gap: the complete question workspace, including any answer, comes first; the public source rail follows with a top rule and no left rule. The shared content wrap is `calc(100% - 36px)`. The question textarea is `17px` with `18px` padding and `170px` minimum height; rail title is `27px`; answer copy is `17px`; the route intro title resolves to `43px`.

## Form and answer states

FORM: “Your question” labels a required textarea accepting `8–400` characters. Desktop field styling is white (`#ffffff`) with a `1px #a2afa1` border, `12px` corners, `21px 23px` padding, `19px` Hanken text, and placeholder `#5c6b60`. The focus outline is `2px #b84328` with `3px` offset. The note uses `13px` copy and `#536054`: “Use a general question. Leave out passwords, private URLs and customer details.”

STARTERS: Three full-width, bottom-ruled buttons provide starter questions. Their `15px` text is quiet at rest and shifts to `#a23c24` on hover. Each retains a trailing arrow icon.

LOADING: Submission prevents the default navigation, shows the `48px` by `3px` coral progress line and the polite status “Reading the relevant guides…”, disables starter buttons and submit, and reveals Cancel. Cancel aborts the active request and returns focus to the textarea.

ANSWER: The answer section begins after a rule. Its title is `29px`, the mode label is `13px`, and answer paragraphs are `18px` with `1.7` line height and a `68ch` maximum. The sources remain a linked list under “Read the sources.” On render, focus moves to “Your answer”; the copy control reports “Copied with sources” or “Select the answer to copy” before returning to “Copy answer.”

MODES: `generated` is labeled “Generated from the linked sources”; `sources` is the explicit fallback “From the published guides”; `no-match` is “No matching guidance.” No-match copy says reliable guidance was not found and points the visitor back toward a question about browser testing, integrations, or a Molar product. A request error or timeout uses the red advisory block (`#f8e8e1` wash and `#9e321b` copy); the existing submit action is the retry path.

PUBLIC SOURCE RAIL: The title is “A useful answer. A place to go deeper.” Supporting copy explains that answers draw from a reviewed set of Molar pages and technical references. Links are Payments & webhooks, Sign-in & access, Team invitations, Coding agent workflows, and All guides. The connector uses `1.25px #72806f` with a `#df593a` origin dot. The privacy note says questions are used to produce the answer, are not published or added to analytics, and links to About your data.

## Optional analytics choice panel

PANEL: The shared `analytics.css` and `analytics.js` layer adds a fixed, lower-right `aside` with `12px` corners, a `1px #4f5c4b` border, `#1c2521` background, `#f5f7ef` text, `22px` desktop padding, and `0 24px 48px #273a2940` shadow. Desktop offsets are `24px` right and bottom; width is `min(440px, calc(100vw - 32px))`. On phones offsets become `16px`, width is `calc(100vw - 32px)`, and padding is `18px`. It is nonmodal: the page remains usable and there is no scrim or dialog role.

CHOICE: With no saved choice and GPC off, the panel says “Optional analytics” and offers Decline analytics and Accept analytics. Choices persist under `molar.analytics.consent.v1`. The footer’s “Privacy choices” button reopens the panel and focus returns to that button after close.

PRIVACY BEHAVIOR: The default Consent Mode state denies `analytics_storage`, `ad_storage`, `ad_user_data`, and `ad_personalization`; Google signals and ad personalization signals remain disabled. Accept loads GA4 (`G-2YL3J3PX8R`) on clean public URLs and sends sanitized page views plus allowlisted CTA, navigation, and demo events. The tag stays off URLs containing a query string or fragment. The form has an explicit `/ask` destination, preventing automatic form events from inheriting URL parameters. Decline clears queued events and Google cookies. When `navigator.globalPrivacyControl === true`, analytics stay denied, Google cookies are cleared, and panel copy explains that browser GPC keeps optional analytics off. `/ask` questions are not added to analytics.

## Accessibility and motion

Use semantic form controls, `aria-describedby` for the form advisory note, `role="status"` for progress, `role="alert"` for errors, focus on the rendered answer heading, and keyboard reachable starter, cancel, copy, rail, footer, and panel controls. At `prefers-reduced-motion: reduce`, remove the progress animation and analytics panel transitions. Preserve visible coral focus outlines and the source links.

## Evidence and provenance

Approved reviewer disposition: SHIP for the `/ask` and analytics additions, based on source and screen review. Captures:

- `.impeccable/review/fullsite/ask-1440.png`
- `.impeccable/review/fullsite/ask-833.png`
- `.impeccable/review/fullsite/ask-390.png`
- `.impeccable/review/fullsite/ask-answer-1440.png`
- `.impeccable/review/fullsite/ask-answer-833.png`
- `.impeccable/review/fullsite/ask-answer-390.png`

The route-specific social image is generated by `scripts/build-social.py` from canonical HTML and stored at `assets/social/ask.png`. Do not describe pending backend dependencies as completed demo, InstantProof, search-ranking, or account-reporting capabilities.
