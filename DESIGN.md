---
name: Molar Marketing Site
description: An editorial, evidence-led marketing system for browser QA and browser execution.
colors:
  ink: "#22211f"
  ink-soft: "#615e59"
  paper: "#fcfbf8"
  muted: "#f0eeea"
  line: "#dedbd5"
  dark: "#171717"
  dark-2: "#222221"
  dark-line: "#3a3936"
  light: "#f7f5ef"
  light-muted: "#b9b5ae"
  accent: "#ff8966"
  accent-hover: "#ff9e80"
  green: "#286444"
  green-light: "#cde8d7"
  danger: "#a73531"
  verify-signal: "#b45231"
  verify-line: "#cdcccb"
typography:
  display:
    fontFamily: "Hanken, ui-sans-serif, sans-serif"
    fontSize: "clamp(50px, 4.65vw, 69px)"
    fontWeight: 600
    lineHeight: 1.035
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Hanken, ui-sans-serif, sans-serif"
    fontSize: "clamp(34px, 3.3vw, 50px)"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Hanken, ui-sans-serif, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Hanken, ui-sans-serif, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Hanken, ui-sans-serif, sans-serif"
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.5
  technical:
    fontFamily: "Geist Mono, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "5px"
  md: "7px"
  lg: "12px"
  xl: "14px"
  circle: "50%"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  section: "112px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#212121"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "11px 21px"
    height: "50px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: "11px 21px"
    height: "50px"
  surface-card:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "0"
  code-window:
    backgroundColor: "#141413"
    textColor: "#d8d7d5"
    rounded: "9px"
    padding: "0"
---

# Design System: Molar Marketing Site

## Overview

**Creative North Star: "The Working Proof"**

Molar's marketing surfaces treat software as a set of journeys that should be observed and explained. The visual language pairs a near-black working environment with a warm paper canvas, then uses coral to mark an action or next choice and restrained green to mark an observed success. The result is editorial and technical at once: calm enough to read, concrete enough to trust.

Typography, navigation, and illustrative product surfaces share one voice across the home page, platform story, product pages, solutions, resources, blog, legal pages, and browser-check flow. Dark hero and developer sections create focus; pale gray reading surfaces and bordered diagrams keep evidence legible. Interactive demos are explicitly labeled illustrative and use controlled three-step Play, Pause, and Replay behavior.

**Key Characteristics:**
- Warm paper and charcoal surfaces with a single coral action signal.
- Hanken Grotesk for all readable interface and display type; Geist Mono for commands, URLs, event rows, and structured data.
- Editorial spacing, thin borders, tonal panels, and restrained rounded corners.
- Evidence-oriented diagrams and browser-like product visuals instead of decorative imagery.

## Colors

The palette is neutral first: warm paper and charcoal carry most of every surface, coral identifies choice and movement, and green is reserved for observed success.

### Primary
- **Signal Coral** (`{colors.accent}`): Primary buttons, selected demo steps, active navigation underlines, and action links.
- **Signal Coral Hover** (`{colors.accent-hover}`): Hover state for coral actions.

### Neutral
- **Ink Charcoal** (`{colors.ink}`): Main text on paper surfaces.
- **Soft Ink** (`{colors.ink-soft}`): Paragraphs and supporting copy.
- **Warm Paper** (`{colors.paper}`): Default page canvas and reading background.
- **Quiet Muted** (`{colors.muted}`): Tonal sections, inline code, and supporting containers.
- **Hairline** (`{colors.line}`): Dividers and neutral borders.
- **Work Black** (`{colors.dark}`): Header, hero, developer sections, and dark product demonstrations.
- **Work Surface** (`{colors.dark-2}`): Secondary charcoal surfaces.
- **Work Hairline** (`{colors.dark-line}`): Borders and dividers on dark surfaces.
- **Light Type** (`{colors.light}`): High-contrast type on charcoal.
- **Muted Light Type** (`{colors.light-muted}`): Supporting text on charcoal.
- **Observed Green** (`{colors.green}`): Pass, success, and observed status only.
- **Observed Green Wash** (`{colors.green-light}`): Success backgrounds and completed-step markers.
- **Failure Red** (`{colors.danger}`): Failed states and negative outcomes.
- **Verify Signal Brown** (`{colors.verify-signal}`): Signal color in the browser-check theme.
- **Verify Hairline** (`{colors.verify-line}`): Browser-check borders.

**The Signal Discipline Rule.** Coral marks the next choice or active motion; green marks evidence that has already passed. Keep both accents sparse enough that their meaning remains immediate.

## Typography

**Display Font:** Hanken Grotesk (`Hanken`) with `ui-sans-serif, sans-serif` fallback  
**Body Font:** Hanken Grotesk (`Hanken`) with `ui-sans-serif, sans-serif` fallback  
**Label/Mono Font:** Geist Mono with `monospace` fallback

**Character:** Hanken is compact, warm, and highly legible across large editorial headlines and dense UI labels. Geist Mono is a technical voice reserved for code and machine-observable details, creating a clear boundary between explanation and evidence.

### Hierarchy
- **Display** (600, `clamp(50px, 4.65vw, 69px)`, 1.035): Hero and major page headlines with tight `-0.035em` tracking.
- **Headline** (600, `clamp(34px, 3.3vw, 50px)`, 1.1): Section statements and major reading headings with `-0.025em` tracking.
- **Title** (600, `24px`, 1.25): Cards, process steps, and compact section titles with `-0.02em` tracking.
- **Body** (400, `17px`, 1.6): Default explanatory text; long-form article copy increases line-height to about 1.8 and stays near 65–70ch.
- **Label** (600, `13px`, 1.5): Compact UI labels and button text in Hanken; short UI labels also use Hanken at 12–15px.
- **Technical** (400–600, `13px`, 1.5): Commands, URLs, event times, and structured data in Geist Mono.

**The Two Voices Rule.** Use Hanken for human explanation and interaction; use Geist Mono for code, data, URLs, and event evidence only.

## Layout

Content uses a centered wrap capped at `1280px`; the default gutter is `48px` and contracts to `32px` below `1150px`, then `20px` below `640px`. Desktop sections use generous `112px` vertical padding (reduced to `85px` and `65px` at smaller widths), with grids commonly split into equal or intentionally weighted columns. Hero layouts pair copy with a product visual; reading layouts pair a sticky `220px` sidebar with a `750px` article column before collapsing.

The shared header is `76px` on desktop and `70px` on small screens. The full navigation and explanatory dropdowns remain available above `900px`; at `900px` and below, a keyboard-accessible mobile menu replaces them, with one-column link groups below `640px`. Hero and split grids collapse to one column at `900px`; product selectors become a two-column control at `640px`, and blog cards move from three to two columns below `760px` and one below `420px`.

## Elevation & Depth

The system is primarily flat and layered. Paper, muted gray, charcoal, and inset borders create most depth; product diagrams use borders and tonal blocks rather than persistent card shadows. The broad journey demo shadow is intentionally removed in the current dark treatment. Shadows appear only where a floating surface needs separation, such as an open navigation dropdown (`0 18px 40px #00000026`), and interactive state is communicated through color, border, position, or a thin progress line.

**The Flat Evidence Rule.** Let tonal layering and hairlines establish structure; reserve elevation for a surface that genuinely floats above the page.

## Shapes

The form language is restrained and practical: controls use `5px–7px` corners, product and reading containers use `7px–14px`, and diagram nodes stay closer to `5px`. Borders are usually one pixel and low contrast. The shared product visual uses a `12px` silhouette, the journey demo uses `12px`, and the global radius token is `14px` for larger surfaces. Circular markers appear only for avatars, completion marks, or status icons. Focus is a visible `3px` coral outline with `5px` offset.

## Components

Components feel quiet at rest and explicit in state. Repeated primitives are shared across the marketing pages and the separate browser-check theme.

### Buttons
- **Shape:** Gently squared, tactile controls (`7px` radius) with a minimum height of `50px`.
- **Primary:** Signal Coral background, charcoal text, `11px 21px` padding, 15px Hanken semibold; hover shifts to Signal Coral Hover.
- **Hover / Focus:** Hover changes color; active presses translate down `1px`; keyboard focus gets the shared 3px coral outline and 5px offset.
- **Secondary / Ghost:** Outline buttons use a transparent background and dark-surface border; on dark heroes they inherit light text and gain a subtle light hover fill.

### Chips
- **Style:** Small filter and status controls use muted tonal fills, one-pixel neutral borders, and `5px–6px` corners. The blog's selected filter is gray-filled; status chips use green or failure red by meaning.
- **State:** Selected controls are expressed by fill and border, not by a new typeface or decorative icon.

### Cards / Containers
- **Corner Style:** Product visuals and journey demos use `12px`; compact fields and diagram nodes use `4px–7px`; larger pricing and panel containers may use `14px`.
- **Background:** Paper, `#f1f1f0`/muted gray, white, and charcoal are the recurring surface levels.
- **Shadow Strategy:** Follow the flat evidence rule; floating navigation is the main shared shadow case.
- **Border:** One-pixel `line` or `dark-line` dividers define panels and rows.
- **Internal Padding:** Common panel padding is `16px–28px`; section padding is `112px` on desktop.

### Inputs / Fields
- **Style:** White or warm-white fields use a one-pixel gray border, `5px` radius, and Hanken text. Search fields use a left inline SVG icon and `11px 12px 11px 36px` padding.
- **Focus:** Inputs receive the shared visible coral focus outline; caret color is a deeper coral (`#bd492b`).
- **Error / Disabled:** Disabled controls reduce opacity to `.55`; browser-check failure surfaces use the dedicated failure red and pale red wash.

### Navigation
- **Style:** Sticky charcoal header, Molar wordmark, four shared groups (Platform, Products, Solutions, Resources), and Hanken 14px summaries. Desktop dropdowns span the header width with a feature panel, two-column links, and a quiet bottom utility row.
- **Default / Hover / Active:** Summary text brightens on hover/open; the open group receives a coral underline and a dark scrim. Links use tonal charcoal hover fills and coral icon/border emphasis.
- **Mobile Treatment:** At `900px` and below, the header keeps the wordmark and exposes a 38×36px menu button. The menu scrolls within the viewport, locks body scroll while open, supports Escape and focus return, and changes to one-column links below `640px`.

### Journey Demo

The signature illustrative demo is a dark browser-like panel with tabbed goals, a three-step flow, inspector evidence, a failure scenario, and a Play/Pause/Replay player. It always carries an “Illustrative demo” or equivalent “Sample walkthrough · No live run” label. Motion advances every `2600ms`, pauses when hidden or offscreen, and disables animation and transitions for `prefers-reduced-motion: reduce`.

## Do's and Don'ts

### Do:
- **Do** keep Warm Paper, Work Black, and Quiet Muted as the dominant surfaces.
- **Do** use Signal Coral for an available action or active selection and Observed Green for verified success.
- **Do** keep commands, URLs, event timelines, and JSON-like output in Geist Mono.
- **Do** preserve the centered `1280px` wrap, editorial section rhythm, and responsive collapse behavior.
- **Do** label product visuals and walkthroughs as illustrative when they do not represent a live run.
- **Do** retain visible keyboard focus and reduced-motion behavior on every interactive surface.

### Don't:
- **Don't** use green as a general brand accent or decorate neutral content with success color.
- **Don't** introduce a second display face, all-caps kicker system, or ornamental icon language.
- **Don't** turn every panel into a floating shadowed card; the system's depth comes from tone and hairlines.
- **Don't** imply that illustrative demos are live product results.
- **Don't** copy page-specific hero compositions into unrelated surfaces; reuse the tokens, grid, and component behavior instead.
