---
name: Molar Marketing Site
description: A living application identity for browser execution, QA, and observable outcomes.
colors:
  paper: "#f7f8f2"
  ink: "#202b23"
  ink-soft: "#56614f"
  muted: "#e8eddf"
  line: "#cdd5c5"
  dark: "#1c2521"
  dark-2: "#2b382d"
  dark-line: "#4f5c4b"
  light: "#f5f7ef"
  light-muted: "#cad2c0"
  accent: "#f26342"
  accent-hover: "#ff8868"
  green: "#22664c"
  green-light: "#d4e8c5"
  danger: "#a33827"
  scene-signal: "#df593a"
  ask-field: "#ffffff"
  ask-field-border: "#a2afa1"
  ask-focus: "#b84328"
  ask-placeholder: "#5c6b60"
  ask-advisory: "#536054"
  ask-link-hover: "#a23c24"
  ask-rail: "#72806f"
  ask-error: "#9e321b"
  ask-error-wash: "#f8e8e1"
typography:
  display:
    fontFamily: "Hanken, ui-sans-serif, sans-serif"
    fontSize: "clamp(48px, 4.7vw, 69px)"
    fontWeight: 560
    lineHeight: 1.06
    letterSpacing: "-0.042em"
  headline:
    fontFamily: "Hanken, ui-sans-serif, sans-serif"
    fontSize: "clamp(36px, 3.65vw, 54px)"
    fontWeight: 550
    lineHeight: 1.1
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Hanken, ui-sans-serif, sans-serif"
    fontSize: "24px"
    fontWeight: 550
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Hanken, ui-sans-serif, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Hanken, ui-sans-serif, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.3
  technical:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
  ask-display:
    fontFamily: "Hanken, ui-sans-serif, sans-serif"
    fontSize: "clamp(42px, 4.6vw, 64px)"
    fontWeight: 550
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  ask-lead:
    fontFamily: "Hanken, ui-sans-serif, sans-serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.55
  ask-label:
    fontFamily: "Hanken, ui-sans-serif, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.3
  ask-title:
    fontFamily: "Hanken, ui-sans-serif, sans-serif"
    fontSize: "29px"
    fontWeight: 550
    lineHeight: 1.13
    letterSpacing: "-0.02em"
  ask-answer:
    fontFamily: "Hanken, ui-sans-serif, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.7
  ask-advisory:
    fontFamily: "Hanken, ui-sans-serif, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.65
  ask-mobile-display:
    fontFamily: "Hanken, ui-sans-serif, sans-serif"
    fontSize: "43px"
    fontWeight: 550
    lineHeight: 1.05
    letterSpacing: "-0.035em"
  ask-mobile-title:
    fontFamily: "Hanken, ui-sans-serif, sans-serif"
    fontSize: "27px"
    fontWeight: 550
    lineHeight: 1.13
    letterSpacing: "-0.02em"
rounded:
  control: "6px"
  field: "7px"
  browser: "10px"
  panel: "12px"
  workbench: "16px"
  circle: "50%"
  ask-error: "8px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "100px"
  desktop-wrap: "1320px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#1f291d"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "11px 21px"
    height: "50px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "11px 21px"
    height: "50px"
  application-scene:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.ink}"
    rounded: "0"
    padding: "0"
  service-lab-workbench:
    backgroundColor: "{colors.dark}"
    textColor: "{colors.light}"
    rounded: "{rounded.workbench}"
    padding: "0"
  input-field:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "11px 12px"
  ask-question-field:
    backgroundColor: "{colors.ask-field}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "21px 23px"
  analytics-consent-panel:
    backgroundColor: "{colors.dark}"
    textColor: "{colors.light}"
    rounded: "{rounded.panel}"
    padding: "22px"
    width: "min(440px, calc(100vw - 32px))"
---

# Design System: Molar Marketing Site

## Overview

**Creative North Star: "The Living Application"**

Molar presents a customer journey as a working application map. Light green paper carries the explanation, while the homepage opens with a full-width pale sage workbench containing the browser, independent service observations, a result, and the controls that change or inspect the example. The causal path is the visual proof: a browser action moves through service state and the customer-facing outcome changes.

The typography-only `Molar.` wordmark uses the loaded `Hanken` CSS family, whose font asset is Hanken Grotesk. The attached navigation keeps Platform, Products, Solutions, and Resources as expandable groups. Authored scenes and controlled recordings use human-readable evidence language and are labeled as examples or controlled tests where appropriate.

Ask Molar extends the same identity into a focused Operate/Read surface: the question form is the working left side, while a public-source rail gives the visitor a clear place to continue reading. Its answer states stay explicit about whether guidance was generated, sourced directly, or unavailable.

**Key Characteristics:**

- Pale sage workbenches hold the hero browser and observed result; green-black workspaces carry the service lab and developer tooling.
- Coral identifies the active path or next action; green and red communicate labeled outcomes.
- Hanken is the human voice; Geist Mono is reserved for commands, URLs, event rows, and structured evidence.
- One browser and its service consequences form the signature visual device.
- Ask Molar pairs a question workspace with a public source rail, keeping answers and their next reading paths visible together.
- Molar. remains typography-only; no separate M icon or invented mark.

## Colors

The palette is an application state system: paper explains, sage holds the living map, dark green frames deeper workspaces, coral moves the story, and green or red report what happened.

### Primary

- **Signal Coral** (`{colors.accent}`): Primary actions, active paths, selected states, and the hero emphasis.
- **Signal Coral Hover** (`{colors.accent-hover}`): Hover response for coral actions.

### Secondary

- **Observed Green** (`{colors.green}`): Verified or completed outcomes and success indicators.
- **Execution Green** (`{colors.dark}`): Service-lab and developer workspaces.

### Tertiary

- **Failure Red** (`{colors.danger}`): Failed outcomes and explicitly negative states.

### Neutral

- **Living Paper** (`{colors.paper}`): Default page canvas and reading surfaces.
- **Working Ink** (`{colors.ink}`): Main text and dark-on-light controls.
- **Soft Ink** (`{colors.ink-soft}`): Explanatory paragraphs and supporting copy.
- **Pale Sage** (`{colors.muted}`): Hero workbench, navigation feature surfaces, and supporting containers.
- **Hairline Green** (`{colors.line}`): Light borders and dividers.
- **Execution Surface** (`{colors.dark-2}`): Secondary dark panels and service-lab hover surfaces.
- **Execution Hairline** (`{colors.dark-line}`): Borders inside dark workspaces.
- **Light Workspace Ink** (`{colors.light}`): Text and controls on dark workspaces.
- **Light Workspace Muted** (`{colors.light-muted}`): Supporting text on dark workspaces.
- **Causal Route Signal** (`{colors.scene-signal}`): Active application-scene route stroke.
- **Ask Field White** (`{colors.ask-field}`): Question textarea surface.
- **Ask Field Border** (`{colors.ask-field-border}`): Textarea boundary on the paper canvas.
- **Ask Focus Coral** (`{colors.ask-focus}`): Question-field and Ask surface focus outline.
- **Ask Placeholder** (`{colors.ask-placeholder}`): Placeholder and quiet advisory copy inside the form.
- **Ask Advisory** (`{colors.ask-advisory}`): Form note, source disclaimer, and supporting rail copy.
- **Ask Link Hover** (`{colors.ask-link-hover}`): Hover response for example-question links.
- **Ask Rail Line** (`{colors.ask-rail}`): Public-source connector stroke.
- **Ask Error** (`{colors.ask-error}`): Error copy for failed or timed-out answers.
- **Ask Error Wash** (`{colors.ask-error-wash}`): Error message background.

**The State Signal Rule.** Coral means the path is active or available; green means the result is observed; red means the result failed. Never use status colors as decoration.

## Typography

**Display Font:** Hanken (`Hanken Grotesk` font asset) with `ui-sans-serif, sans-serif` fallback

**Body Font:** Hanken (`Hanken Grotesk` font asset) with `ui-sans-serif, sans-serif` fallback

**Label/Mono Font:** Geist Mono with `ui-monospace, monospace` fallback

The CSS face is named `Hanken`; “Hanken Grotesk” describes the font file and its typeface, not a separate loaded family. Geist Mono marks machine-observable material so commands, URLs, events, and structured values read as evidence.

### Hierarchy

- **Display** (560, `clamp(54px, 5.2vw, 78px)`, 1.04, `-0.035em`): Homepage and platform hero outcomes. The final responsive rules use `57px` at `max-width: 900px` and `46px` at `max-width: 640px`.
- **Headline** (550, `clamp(36px, 3.65vw, 54px)`, 1.1, `-0.035em`): Section claims and mechanism statements.
- **Title** (550, `24px`, 1.25, `-0.02em`): Product names, cards, and compact explanatory blocks.
- **Body** (400, `17px`, 1.6): Customer explanation and readable supporting copy.
- **Label** (600, `15px`, 1.3): Buttons and interface controls.
- **Technical** (400, `13px`, 1.5): Commands, URLs, event rows, and structured values.

**The Two Voices Rule.** Use Hanken for human explanation and interaction; use Geist Mono for code, data, URLs, event evidence, and service-lab labels.

Ask Molar uses a `clamp(42px, 4.6vw, 64px)` route display, `19px` lead and question copy, `16px` field label, `29px` rail/result title, `18px` answer copy, and `12px` advisory copy. At the phone breakpoint these resolve to a `43px` intro title, `27px` rail title, and `17px` answer copy.

Conversion surfaces keep count labels in Hanken with tabular numerals; Geist Mono remains reserved for commands, URLs, event timelines, and other technical values. The compact hero setup command is set in the existing technical voice: `npx molar-agent init`. Conversion metadata and control labels use `12px`–`15px`; catalog descriptions use `15px`, service names `20px` (`19px` on phones), and the homepage inventory preview heading uses `32px` (`30px` on phones).

## Layout

The shared content wrap is capped at `1320px` and uses `calc(100% - 96px)` before the cap, `calc(100% - 48px)` at `max-width: 900px`, and `calc(100% - 36px)` at `max-width: 640px`. The attached header is sticky at `76px` on desktop and `70px` on phones. General sections use `100px` vertical rhythm in the identity layer.

The homepage hero is a compact headline and action row followed by a full-width application workbench inside the wrap. The desktop headline row aligns at the top in a `1.45fr 1fr` grid with a `60px` gap; the project setup command sits below the actions and public-check note in the right-hand desktop column and follows the same reading order on mobile; the application scene follows at full available width. At `max-width: 900px`, the headline row becomes one column. At `max-width: 640px`, the application scene’s observations are ordered first, followed by the browser detail, and the service observations use a two-column grid. At the approved `833px` view, the opening viewport keeps the browser, service states, and customer result visible together.

The service lab is a five-tab dark workspace with a controls column and an example surface. Its tabs remain horizontally scrollable when needed. Product, proof, developer, and reading sections inherit the same wrap and use scene-specific compositions rather than a single repeated card grid.

Ask Molar keeps the form and public-source rail in a `1.65fr 1fr` desktop grid with a `72px` gap. The route intro uses a `1.4fr 1fr` split with a `64px` gap; the question workspace begins at a hairline and the rail begins at a vertical hairline. Below `900px`, the form grid tightens and the submit row can wrap. At `640px` and below, the route becomes a single column with a `48px` gap: the complete question workspace, including any answer, comes first, then the source rail with a top rule. The shared wrap remains `calc(100% - 36px)` on phones and `calc(100% - 48px)` at tablet widths.

The conversion extension follows the same responsive rhythm. The startup-program strip is a two-column relationship on wide screens and stacks below `1000px`; its four marks become a two-column grid on phones. The catalog is a two-column open row list on desktop, with filter controls stacked below `1000px` and rows stacked into one column below `640px`; brand slots tighten from `50px` to `42px` on phones. The hero setup command stays compact and horizontally scrollable where needed.

## Elevation & Depth

Depth comes from tonal layering, one-pixel boundaries, and the separation between light workbenches and dark workspaces. The application-scene browser uses `0 14px 28px #263b2217`; the service-lab workbench uses `0 24px 48px #273a2914` and its inner surface uses `0 16px 30px #08120930`; the open desktop navigation dropdown uses `0 24px 36px #21321a16`. Ordinary reading panels stay flat.

The optional analytics choice panel is the one additional floating surface on `/ask` and the shared site: it uses the dark workspace, a one-pixel dark hairline, a `12px` corner, and `0 24px 48px #273a2940` to separate it from the page while it is open. It is an `aside`, not a modal dialog, and does not dim or block the page.

**The Working Surface Rule.** Establish hierarchy through the browser, service observations, causal route, and result state. Reserve shadows for scene separation, controlled proof captures, and genuinely floating navigation.

## Shapes

Controls are gently squared at `6px`; general buttons resolve to the identity layer’s `6px` radius and fields commonly use `7px`. Application-scene browsers use `10px`; service-lab surfaces and proof cards use `12px`; the service-lab workbench uses `16px` on desktop and `12px` on phones. Toggle tracks and status markers are rounded or circular only when their control or status semantics require it. One-pixel hairlines define boundaries.

Global keyboard focus is a visible `3px` coral outline with `5px` offset. Service-lab tabs and the condition toggle use the same coral outline with a `4px` offset. Reduced-motion rules remove scene, tab, toggle, and proof transitions.

Navigation uses a 100ms first-hover dwell, immediate switching between open groups, and a 180ms leave grace period. Menu labels stay at their final pixel position with a 140ms opacity transition; product panels use 180ms without translating their text. Click, touch, Escape, focus-out and breakpoint changes cancel pending hover work. Mobile navigation stays flat: the desktop shadow and extra dropdown top padding do not carry into the accordion.

## Components

Components are quiet at rest and explicit when a state changes.

### Buttons

- **Shape:** `6px` radius, `50px` minimum height for shared buttons; hero founder-pass buttons use `46px` minimum height.
- **Primary:** Signal Coral with dark ink text, `11px 21px` padding, and a trailing arrow icon.
- **Hover / Focus:** Coral shifts to `#ff8868`; focus uses the shared coral outline; active presses move down `1px`.
- **Secondary / Ghost:** Outline controls use the surrounding surface, with the light-surface hover fill `#e4e9d9` and the shared coral focus treatment.

### Cards / Containers

- **Application scene:** Pale sage workbench with a browser, agent observation, two service states, a result, causal tracks, progress timeline, and evidence disclosure.
- **Service lab:** Dark `16px` workbench with five tabs, an “Interactive example” label, a condition toggle, a service-specific surface, and an observed-result band.
- **Proof:** Real captured images and native video players from a controlled fixture, with an explicit controlled-test label.
- **Borders and padding:** One-pixel hairlines; common panels use `16px–30px` insets according to their scene.

### Inputs / Fields

Fields use paper or browser surfaces, one-pixel gray-green borders, `6px–7px` corners, and Hanken text. Focus uses the visible coral outline and the identity caret color. Disabled controls use the shared `.55` opacity; Failure Red is reserved for a negative state.

Ask Molar’s textarea is white with a `1px #a2afa1` border, `12px` corners, `21px 23px` desktop padding, `19px` text, and a `2px #b84328` focus outline with `3px` offset. Its error wash uses `#f8e8e1`, error copy uses `#9e321b`, and form advisory copy uses `#536054`.

### Navigation

The attached light header contains the typography-only `Molar.` wordmark and four expandable groups: Platform, Products, Solutions, and Resources. Desktop dropdowns use a pale sage feature panel and restrained shadow. Below `900px`, the menu becomes a keyboard-operable mobile panel; below `640px`, links use one column. Escape handling and focus return are preserved.

### Application Scene

The QA scene starts with `data-frame="0"`, `data-outcome="working"`, and a delayed webhook condition. Its initial evidence reads “Not checked yet”; the browser starts at `Free` with `Basic access`, payment is “Ready to charge,” and the webhook is “Waiting for payment.” The platform scene starts with the invoice task, “Looking for September,” “Waiting for invoice,” and the same working outcome. Play/Pause, Replay, the QA condition toggle, Advance, and Inspect result controls are keyboard accessible. Autoplay is gated by intersection visibility, document visibility, manual pause, and reduced motion.

### Service Lab

The lab has exactly five tabs: Payments, Email, SMS, Sign-in, and Storage. Each tab changes the surface and resets the edge condition. The condition control is a real button with `aria-pressed`, and the result is announced through a polite live region. The label remains “Interactive example,” while the resulting state explains the browser and service behavior together.

### Recorded Proof

The invitation proof uses captured admin and member images plus native video players from the controlled fixture page. The player markup uses `controls`, `playsinline`, and `preload="none"`; a wrapper preserves the poster and displays a loading label until the native `playing` event, with a retry label on error and direct downloads always available. It identifies the run as a controlled test and early-access capability, and keeps the recording scope explicit rather than implying customer proof or autonomous model decisions.

### Ask Molar

The `/ask` surface is a question form paired with a public-source rail. The form accepts a required `8–400` character question, shows three line-item starter questions, and uses a coral primary submit button. While the request is active, the progress line reads “Reading the relevant guides…” and a Cancel control is revealed; Cancel aborts the request and returns focus to the question field. The answer heading receives focus when a response is rendered.

Answer copy is split into paragraphs and keeps its sources in a linked list. The mode label distinguishes `Generated from the linked sources`, `From the published guides` (the labeled source fallback), and `No matching guidance`. Request errors and timeouts use the red advisory block; the same submit action remains the retry path. Copy answer reports either “Copied with sources” or the selection fallback before restoring its label.

The rail uses a coral origin dot and a thin branching connector in Ask Rail Line, followed by five text links: Payments & webhooks, Sign-in & access, Team invitations, Coding agent workflows, and All guides. Its privacy note says questions are used to produce the answer, are not published or added to analytics, and links to About your data.

### Optional Analytics Choice

The shared analytics layer starts with `analytics_storage` denied and keeps ad storage, ad user data, ad personalization, Google signals, and ad personalization signals denied. If no choice exists and GPC is off, the lower-right panel presents “Optional analytics” with Decline analytics and Accept analytics actions. On clean public URLs, a granted choice loads GA4 and sends sanitized page views and allowlisted CTA, navigation, and demo events; private proof views and URLs containing a query string or fragment keep the tag off because automatic measurement can inspect those values. Explicit clean form destinations prevent automatic form events from inheriting the document query; a denied choice clears Google cookies and sends nothing. The footer’s Privacy choices control reopens the same nonmodal panel and restores focus to the control after closing. When `navigator.globalPrivacyControl === true`, analytics remain off, cookies are cleared, and the panel explains that browser GPC keeps optional analytics off.

The conversion layer uses fixed, consent-gated action names: `trial_navigation`, `trial_hero`, `trial_footer`, `contact_hero`, `contact_footer`, `signup_navigation`, `signup_hero`, `signup_footer`, `setup_command_copied`, `agent_prompt_copied`, `setup_docs`, `agent_docs`, `clone_catalog`, and `clone_request`. Search text, prompt content, project paths, URLs, credentials, and other free-form values are excluded.

### Conversion Extension (September 6)

The hero initializes project setup with the compact, copyable `npx molar-agent init` command and labels it as project initialization. The coding-agent handoff is progressively disclosed in a native `details` block: the prompt preview remains readable without JavaScript, and clipboard failure opens the preview with a manual-copy recovery message.

The Clones catalog is an open two-column searchable list of 28 entries: 5 stateful services and 23 fixture packs. Each row exposes the provider name, coverage tier, operation summary, and a link to its existing documentation. Provider marks come from the local brand source manifest and attribution files; Auth uses the generic lock treatment and niche providers use their official site favicons. The catalog filter has All services (28), Stateful (5), and Fixture packs (23), plus an operation-aware search and an explicit empty state.

The startup strip says “Building Molar with startup credits and resources from” and shows Google for Startups Cloud Program, Microsoft for Startups, AWS Activate, and Razorpay Rize. These marks and links are part of the relationship copy; they do not change the established paper, sage, coral, and green-black identity.

### Product Motion

**The Causal Motion Rule.** Animate the connection between a browser action, a service, and its result. Keep customer copy at stable coordinates while a product illustration changes. Menus use a brief opacity entrance with no translated text. Ordinary reading pages and forms stay still.

The entry workbench assembles browser, service rows, and result in a single 600ms entrance with bounded delays up to 240ms. Supporting product workbenches and explanatory illustrations enter once; related output rows use a 55ms stagger. Already-visible HTML is the default, and finite Web Animations cancel when the document is hidden or reduced motion is requested. No animation library, pointer loop, artificial preloader, or scroll interception is used.

The homepage product walkthrough has four complete chapters with independent illustrations. On screens at least 1050px wide and 720px high, ordinary scrolling selects a pinned illustration below the attached navigation. The illustration pins at 166px below both navigation bars and changes with a 180ms opacity transition, keeping text stationary; its path and progress line follow scroll position. Chapter links remain keyboard-accessible and shareable. Mobile, short viewports, reduced motion, and missing JavaScript expose every chapter and illustration in document flow. Diagram labels are at least 12px; scene headings and outputs use the existing compact 14–18px range.

The generalist platform uses a progressively enhanced native scroll timeline for the output connector. Unsupported browsers retain the ordinary static arrow. Existing demo pause, replay, inspection, and condition controls keep their own state and visibility rules.

### Route-specific Social Cards

The full site’s canonical routes receive 1200×630 social cards generated by `scripts/build-social.py`. Cards reuse Hanken, the paper canvas, green-black framing, coral route signal, typography-only `Molar.` wordmark, and route path label; `/ask` uses `assets/social/ask.png`.

## Do's and Don'ts

### Do:

- **Do** let the pale sage hero workbench show the browser, service states, controls, and result in the first view.
- **Do** use the green-black workspace for the five-tab service lab and developer tooling.
- **Do** use coral for an active path or next action and green/red for clearly labeled outcomes.
- **Do** keep the `Molar.` wordmark typography-only and preserve the four attached navigation groups.
- **Do** use Geist Mono for commands, URLs, event timelines, and structured evidence.
- **Do** keep application scenes causal: a browser action should lead to service state and a changed result.
- **Do** preserve semantic roles, keyboard focus, live announcements, reduced-motion behavior, and readable mobile controls.
- **Do** label interactive examples, controlled recordings, and illustrative scenes accurately.
- **Do** keep Ask Molar’s generated, published-guide fallback, and no-match labels visible with the answer.
- **Do** keep the public-source rail beside the form on desktop and after the answer on mobile.
- **Do** make analytics optional, nonmodal, keyboard reachable, and governed by GPC and Privacy choices.
- **Do** use the compact `npx molar-agent init` command for project initialization and reveal the longer agent prompt progressively.
- **Do** keep the full 28-entry catalog searchable by provider and operation, with the 5-stateful / 23-fixture split visible.
- **Do** use the actual local provider marks and keep startup-program copy framed as credits and resources.
- **Do** preserve the fixed consent-gated analytics action names and the exclusion of free-form search and prompt content.

### Don't:

- **Don't** place the homepage browser in a separate side column; the final hero puts the compact headline/action row above the full-width workbench.
- **Don't** substitute another CSS family for `Hanken`; Hanken Grotesk names the font asset behind the loaded family.
- **Don't** introduce a separate M icon, decorative logo mark, or second display typeface.
- **Don't** use green as a generic accent or coral as a success signal.
- **Don't** turn every section into a floating, shadowed card.
- **Don't** imply that authored examples or controlled recordings are customer proof, a reliability benchmark, or an autonomous AI run.
- **Don't** remove pause, replay, condition, evidence, focus, live-region, or reduced-motion behavior from interactive scenes.
- **Don't** imply that Ask Molar’s source-grounded answer surface provides search ranking, account reporting, or an instant-proof backend capability.
- **Don't** turn the analytics choice into a blocking consent wall or treat `/ask` questions as analytics events.

### Shared browser checks

`/verify` retains the shared header, footer, Hanken typography and coral primary action. A shared link uses a dedicated heading and two columns: captured browser frame and read-only result. At 960px it becomes one column. Images fit fully inside the viewport without cropping, including portrait captures. Expired links show a clear unavailable state; loading never presents a completed verdict. Verified, failed, missing and sharing states are driven by the API response, with no simulated result in the live instrument. Nine primary browser renders at 390, 833 and 1440px cover result, shared result and expired link; these use explicitly mocked API fixtures for layout review.


The autonomous browser example uses the existing paper/sage editorial surface and recording controls, with the footage beside four observed steps. Keep actual footage unedited and result provenance downloadable; screenshots at 390, 833 and 1440px and actual playback passed. A public fixture is evidence of that run, not a claim about general reliability.

Final proof-section polish: the two recording links are stacked with a 14px gap so each is a clear target. Both QA and platform versions were checked with loaded screenshots at 390, 833 and 1440px. This preserves the distinction between the recorded multi-user scenario and autonomous browser example.

Accessibility follow-through: the actual autonomous homepage run found faint small labels. Corrected the service URL, product-tab subtitle, map labels, closing action, changelog labels, optional form labels and large footer wordmark without changing the palette. Axe color-contrast checks passed all 99 rendered pages at 390 and 1440px (198 renders); active product tabs are checked separately. This is automated contrast evidence, not a claim of complete accessibility conformance. Proof-limit errors now display the service-provided retry window.


### First-visit path and evidence (September 6)

The shared header leads to `/verify` with “Try Molar.” Homepage and platform use “Try a browser check” plus “Watch a real run.” The note beneath distinguishes the public check from private-app beta setup. The start section explains URL → visible outcome → captured evidence, with separate links for discussing setup and creating a workspace. The sample pairs `https://example.com` with its actual Example Domain heading.

A native, unedited 43.36-second browser recording sits directly after the QA hero. Its four observations are tied to the captured run, with scope and provenance visible. The platform pairs a workflow output and field mapping, then explains completed/failed/blocked results. Supporting sections use distinct service state, catalog, role, output, source, review and evidence views; explanatory scenes are labeled, actual captured images identify their controlled runs, and preview plans do not pretend to be passed tests.

Company names the founder and professional origin of Molar, using an explicitly illustrative LMS handoff diagram and public professional links. Pricing separates the public read-only check from private app beta setup without invented rates or traction. Hanken remains the primary face; mono is confined to commands and technical values. No new animation runtime is added; existing autoplay, reduced-motion handling, native video controls and responsive navigation remain shared.

The public check loads its instrument base before the shared site and identity styles, then applies its scoped theme. This preserves the same paper header, Hanken typography and sage/coral palette from entry through result and shared evidence. The first-visit browser check asserts that the header surface stays consistent across the handoff.

### Clones technical story extension — September 6, 2026

The Clones page now moves from the existing interactive inspector into open editorial rows for request failures, virtual time, and signed webhook retries. A three-request sequence, a precise clock dial, and a retry timeline explain service behavior. The setup pairs a copyable, locally verified SDK fixture with endpoint, credentials/certificate, and cleanup instructions. A branching service diagram connects one saved starting point to Stripe and Email; the adjacent example restores both. All diagrams are native SVG/HTML geometry with text equivalents. No new raster or animation runtime is introduced.

The existing 28-service catalog remains intact. A use-case comparison accurately acknowledges WireMock stateful scenarios and Stripe test clocks, with primary documentation links. Self-hosted setup and SDK refusal checks are described with their scope. The page does not promise unlimited workers, universal provider parity, zero outbound traffic, or unverified one-command installation. New section navigation, all four code-copy actions, 320–1440px layouts, no-JavaScript content, contrast and existing product interactions passed independent browser checks. The snapshot notes use 14px Soft Ink on sage; 12–18px is the established compact technical type range. The pale failure fill is a semantic wash, and the thin clock/path colors are geometry, not text.

### Cartographer technical story extension — September 6, 2026

The existing route map now leads into a separate five-step checkout inspector. Its selected element, action, expected result, receipt view and observed result move together; reviewing an earlier successful action never changes the run's failed verdict. The last account-access step remains explicitly unrun. Vertical keyboard tabs use roving focus, Home/End and wraparound; mobile pointer selection brings the detail panel below attached navigation. The workbench uses the existing green-black execution canvas, sage receipt and coral failure signal, with stationary text and a 160ms control transition. The example sends no backend request.

The page pairs numbered exploration setup with an API-schema-validated request body and an explicit profile/origin prerequisite. A four-stage export path separates recorded actions, code review, clean replay and repository adoption, with prominent beta availability. Copyable explore/run/verify examples replace unverified install slogans. Open reading sections explain configured accessibility and visual checks, then link Clones, Guard and Trace by their actual roles. All five copy actions, step states, keyboard behavior, 320–1440px layouts, no-JavaScript content, contrast, and the existing four-product interactions passed. No new raster or motion runtime is introduced.

### Trace technical story extension — September 7, 2026

Preserve the paper/sage/ink identity, existing checkout example and actual controlled recording. Add a four-position native scrubber and aligned network, console, page and service tracks to the same sample state. Selecting a marker, step, inspector tab or investigation citation updates one state; playback does not imply a new execution. Mobile markers bring the inspector below the attached header. Keyboard input, reduced motion and static fallback remain supported.

The explanatory story follows the payment through a callback failure and missing account access. An authored investigation summary links to those exact example steps; no live chat, invented diagnosis or private model thoughts. Passing/failing examples keep their distinct verdicts. Capture setup preserves Playwright’s own tracing and source-backed Molar CLI/MCP inspection, with explicit placeholders and workspace prerequisites. Artifact availability, retention and execution replay are explained without new availability, pricing, compliance or reporter-distribution claims.

Trace verification: eight focused browser groups and nine existing product-story groups pass, with no page errors, contrast failures or sub-12px text. Five clipboard actions, sixteen event markers, keyboard scrubber/tab behavior, investigation references, 320–1440px layouts and no-JavaScript reading paths are verified. The final correction aligns the native scrubber thumb with the step columns, separates mobile heading words and gives the failed callback the correct icon. Fresh finish-review disposition: ship.


## Guard: selection, scheduled results and repair review — 2026-09-07

The existing release-check workbench now leads into a dependency-to-scenario diagram with four selectable pull-request changes. Its cases distinguish mapped source changes, directly edited scenarios, large unmapped fallback and an empty selection needing review. The illustrated selections match the existing Guard selector. Cached results have a separate explanation and never become a fresh execution claim.

A three-scenario schedule history replaces the shallow status strip. All nine cells are inspectable: passed and failed runs show expected/observed state; queued, paused and unrun slots explicitly have no assertion result. One target and authored example labels avoid implying a live global network. The Mender section follows the same paid-but-no-access failure through source review and fresh validation, with an illustrative regression assertion and review checklist. Three code blocks copy exact CLI/CI/Playwright excerpts with prerequisites.

Paper/sage/ink panels, coral failure states and a curved dependency connector preserve the existing identity. Native buttons work by keyboard; brief opacity/position feedback honors reduced motion. The page keeps eleven technical FAQs and useful static content without JavaScript. The finish pass corrected the CI result contrast, removed excess kickers, shortened reading measures and removed CSS orphaned by the replaced sections.


## Illustrated navigation and editorial graphics · September 7

Each navigation group has its own layout: five product previews, a browser-task illustration for Platform, three task groups for Solutions, and two guide previews for Resources. Hover keeps the existing 100ms dwell and 180ms leave grace. Panels use a 180ms opacity entrance; feedback uses 120ms without moving menu text. Mobile uses the native accordion with compact art and full-size labels.

`product-graphics.mjs` and `.css` define original route, service-state, release, trace, repair, browser-task and swarm illustrations. They reuse paper, sage, ink and coral. Compact versions omit technical labels and outer frames; larger diagrams include short readable labels. Finite route and cursor animations use the existing intersection observer and stop under reduced motion. No animation library or pointer tracking was added.

`guide-previews.mjs` supplies three existing guides with matching artwork. Homepage and platform guide shelves, blog covers and Resources previews share the same graphics. `refinement.css` holds the shared compositions. Four core product headers retain their distinct long-form stories and workbenches; the small header graphic is omitted on phones so the headline has the full reading width. Public-check CTAs name the public-page check, and beta setup links describe contacting the team.
