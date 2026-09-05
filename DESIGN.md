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

- **Display** (560, `clamp(48px, 4.7vw, 69px)`, 1.06, `-0.042em`): Homepage and platform hero outcomes. The final responsive rules use `51px` at `max-width: 1150px`, `52px` at `max-width: 900px`, and `46px` at `max-width: 640px`; platform hero display is `43px` on phones.
- **Headline** (550, `clamp(36px, 3.65vw, 54px)`, 1.1, `-0.035em`): Section claims and mechanism statements.
- **Title** (550, `24px`, 1.25, `-0.02em`): Product names, cards, and compact explanatory blocks.
- **Body** (400, `17px`, 1.6): Customer explanation and readable supporting copy.
- **Label** (600, `15px`, 1.3): Buttons and interface controls.
- **Technical** (400, `13px`, 1.5): Commands, URLs, event rows, and structured values.

**The Two Voices Rule.** Use Hanken for human explanation and interaction; use Geist Mono for code, data, URLs, event evidence, and service-lab labels.

Ask Molar uses a `clamp(42px, 4.6vw, 64px)` route display, `19px` lead and question copy, `16px` field label, `29px` rail/result title, `18px` answer copy, and `12px` advisory copy. At the phone breakpoint these resolve to a `43px` intro title, `27px` rail title, and `17px` answer copy.

## Layout

The shared content wrap is capped at `1320px` and uses `calc(100% - 96px)` before the cap, `calc(100% - 48px)` at `max-width: 900px`, and `calc(100% - 36px)` at `max-width: 640px`. The attached header is sticky at `76px` on desktop and `70px` on phones. General sections use `100px` vertical rhythm in the identity layer.

The homepage hero is a compact headline and action row followed by a full-width application workbench inside the wrap. The desktop headline row uses a `1.5fr 1fr` grid with a `70px` gap; the application scene follows at full available width. At `max-width: 900px`, the headline row becomes one column. At `max-width: 640px`, the application scene’s observations are ordered first, followed by the browser detail, and the service observations use a two-column grid. At the approved `833px` view, the opening viewport keeps the browser, service states, and customer result visible together.

The service lab is a five-tab dark workspace with a controls column and an example surface. Its tabs remain horizontally scrollable when needed. Product, proof, developer, and reading sections inherit the same wrap and use scene-specific compositions rather than a single repeated card grid.

Ask Molar keeps the form and public-source rail in a `1.65fr 1fr` desktop grid with a `72px` gap. The route intro uses a `1.4fr 1fr` split with a `64px` gap; the question workspace begins at a hairline and the rail begins at a vertical hairline. Below `900px`, the form grid tightens and the submit row can wrap. At `640px` and below, the route becomes a single column with a `48px` gap: the complete question workspace, including any answer, comes first, then the source rail with a top rule. The shared wrap remains `calc(100% - 36px)` on phones and `calc(100% - 48px)` at tablet widths.

## Elevation & Depth

Depth comes from tonal layering, one-pixel boundaries, and the separation between light workbenches and dark workspaces. The application-scene browser uses `0 14px 28px #263b2217`; the service-lab workbench uses `0 24px 48px #273a2914` and its inner surface uses `0 16px 30px #08120930`; the open desktop navigation dropdown uses `0 24px 36px #21321a16`. Ordinary reading panels stay flat.

The optional analytics choice panel is the one additional floating surface on `/ask` and the shared site: it uses the dark workspace, a one-pixel dark hairline, a `12px` corner, and `0 24px 48px #273a2940` to separate it from the page while it is open. It is an `aside`, not a modal dialog, and does not dim or block the page.

**The Working Surface Rule.** Establish hierarchy through the browser, service observations, causal route, and result state. Reserve shadows for scene separation, controlled proof captures, and genuinely floating navigation.

## Shapes

Controls are gently squared at `6px`; general buttons resolve to the identity layer’s `6px` radius and fields commonly use `7px`. Application-scene browsers use `10px`; service-lab surfaces and proof cards use `12px`; the service-lab workbench uses `16px` on desktop and `12px` on phones. Toggle tracks and status markers are rounded or circular only when their control or status semantics require it. One-pixel hairlines define boundaries.

Global keyboard focus is a visible `3px` coral outline with `5px` offset. Service-lab tabs and the condition toggle use the same coral outline with a `4px` offset. Reduced-motion rules remove scene, tab, toggle, and proof transitions.

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
