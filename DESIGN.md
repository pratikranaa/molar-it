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
  scene-signal: "#ff997a"
  scene-browser: "#fbfaf5"
  scene-service: "#344136"
  scene-success: "#b9e5a7"
typography:
  display:
    fontFamily: "Hanken Grotesk, ui-sans-serif, sans-serif"
    fontSize: "clamp(56px, 5.3vw, 79px)"
    fontWeight: 570
    lineHeight: 1.035
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Hanken Grotesk, ui-sans-serif, sans-serif"
    fontSize: "clamp(36px, 3.65vw, 54px)"
    fontWeight: 550
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Hanken Grotesk, ui-sans-serif, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Hanken Grotesk, ui-sans-serif, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Hanken Grotesk, ui-sans-serif, sans-serif"
    fontSize: "15px"
    fontWeight: 600
    lineHeight: 1.3
  technical:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  control: "6px"
  panel: "12px"
  scene: "14px"
  large: "16px"
  circle: "50%"
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
    textColor: "{colors.ink}"
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
  surface-panel:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "24px"
  execution-scene:
    backgroundColor: "{colors.dark}"
    textColor: "{colors.light}"
    rounded: "{rounded.large}"
    padding: "0"
  input-field:
    backgroundColor: "{colors.scene-browser}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "11px 12px"
---

# Design System: Molar Marketing Site

## Overview

**Creative North Star: "The Living Application"**

Molar's identity makes a browser journey feel alive. A light green paper canvas carries the explanation; a green-black execution stage carries the browser, independent services, agent cursor, event paths, and changed outcome. The visual proof is causal: a customer action moves through payment and callback state, then the account outcome visibly changes.

The wordmark is typography-only: `Molar.` in Hanken Grotesk, with a coral period. The attached navigation groups Platform, Products, Solutions, and Resources and gives each group enough explanatory context to orient a buyer. Product scenes, role maps, service controls, and result panels reuse the same human-readable evidence language. Illustrations are authored application scenes and are labeled as examples when they are not live runs.

**Key Characteristics:**
- Light green paper for reading; green-black execution canvases for working state.
- Coral identifies the active path, action, or next choice; green and red communicate labeled outcomes.
- Hanken Grotesk is the human voice; Geist Mono is reserved for commands, URLs, event rows, and structured evidence.
- One large browser and its service consequences form the signature visual device.
- Typography-only Molar. identity; no separate M icon or invented mark.

## Colors

The palette is an application state system: paper explains, dark green executes, coral moves the story, and status colors report what happened.

### Primary
- **Signal Coral** (`{colors.accent}`): Active event paths, primary actions, selected states, and the coral emphasis in hero and closing surfaces.
- **Signal Coral Hover** (`{colors.accent-hover}`): Hover response for coral actions.

### Secondary
- **Observed Green** (`{colors.green}`): Verified or completed outcomes and success indicators.
- **Execution Green** (`{colors.dark}`): Browser and developer stages where work is happening.

### Tertiary
- **Failure Red** (`{colors.danger}`): Failed outcomes and explicitly negative states.

### Neutral
- **Living Paper** (`{colors.paper}`): Default reading canvas.
- **Working Ink** (`{colors.ink}`): Main text and dark-on-light control text.
- **Soft Ink** (`{colors.ink-soft}`): Explanatory paragraphs and supporting copy.
- **Quiet Wash** (`{colors.muted}`): Pale green sections, navigation feature panels, and supporting containers.
- **Hairline Green** (`{colors.line}`): Light borders and dividers.
- **Execution Surface** (`{colors.dark-2}`): Secondary dark panels and service cards.
- **Execution Hairline** (`{colors.dark-line}`): Borders inside dark scenes.
- **Scene Browser** (`{colors.scene-browser}`): Browser surfaces inside the application scene.

**The State Signal Rule.** Coral means the path is active or available; green means the result is observed; red means the result failed. Never use status colors as decoration.

## Typography

**Display Font:** Hanken Grotesk (`Hanken Grotesk`) with `ui-sans-serif, sans-serif` fallback
**Body Font:** Hanken Grotesk with `ui-sans-serif, sans-serif` fallback
**Label/Mono Font:** Geist Mono (`Geist Mono`) with `ui-monospace, monospace` fallback

**Character:** Hanken Grotesk is compact, direct, and warm enough for a confident product explanation. Geist Mono marks machine-observable material so a command, URL, event, or structured value reads as evidence rather than marketing copy.

### Hierarchy
- **Display** (570, `clamp(56px, 5.3vw, 79px)`, 1.035): Home hero statements and page-level outcomes with tight `-0.038em` tracking.
- **Headline** (550, `clamp(36px, 3.65vw, 54px)`, 1.1): Section claims and chapter statements.
- **Title** (600, `24px`, 1.25): Product names, cards, and compact explanatory blocks.
- **Body** (400, `17px`, 1.6): Readable customer explanation, normally constrained to a comfortable measure.
- **Label** (600, `15px`, 1.3): Buttons and interface controls.
- **Technical** (400, `13px`, 1.5): Commands, URLs, event rows, and structured data.

**The Two Voices Rule.** Use Hanken for human explanation and interaction; use Geist Mono for code, data, URLs, and event evidence.

## Layout

Desktop pages use a centered wrap capped at `1320px`, with `48px` side margins before the cap in the shared stylesheet. The header is attached to the page and remains the orientation anchor. Home hero layouts place concise copy and a large open application scene in two columns; supporting chapters use two-column compositions, linked rows, and full-width state bands. Section rhythm is generally `100px` in the identity layer, with the shared system's larger `112px` rhythm retained where the base page calls for it.

At `900px` and below, the wrap becomes `calc(100% - 48px)`, the two-column hero stacks, and the navigation becomes a scrollable menu. At `640px` and below, controls and scene nodes stack into one column, diagrams use a vertical causal track, and application scenes remain legible without hiding their controls. At `420px`, the layout tightens further for small phones. The same story and evidence remain present at every width.

## Elevation & Depth

Depth comes from tonal layering, borders, and the separation between the paper canvas and execution stage. The application scene uses a restrained ambient shadow (`0 24px 48px #273a2914`) and its browser uses a smaller separation shadow (`0 16px 30px #08120930`); these support the scene silhouette without turning every content block into a floating card. Open desktop navigation is the other meaningful floating surface.

**The Working Surface Rule.** Use dark green to establish an execution stage, then use a browser, service states, and causal paths to create hierarchy inside it. Avoid persistent shadow on ordinary reading panels.

## Shapes

Controls are gently squared at `6px`; browser and product panels use `12px`; authored feature scenes and the main application stage use `14px–16px`. Service cards and browser controls use small practical corners, while circular markers are reserved for avatars, status, and the agent cursor. One-pixel hairlines are the default boundary language. Focus is always a visible `3px` coral outline with `5px` offset.

## Components

Components are quiet at rest and explicit when state changes.

### Buttons
- **Shape:** Gently squared controls with `6px` radius and `50px` minimum height.
- **Primary:** Signal Coral with dark ink text and `11px 21px` padding; the arrow icon is part of the action.
- **Hover / Focus:** Coral shifts to its hover color; active presses move down `1px`; keyboard focus uses the shared coral outline.
- **Secondary / Ghost:** Outline controls keep the surface visible and pick up a pale tonal fill on light surfaces or a subtle light fill on dark surfaces.

### Cards / Containers
- **Corner Style:** `12px` for product panels, `14px` for feature scenes, and `6px–9px` for service and field controls.
- **Background:** Living Paper, Quiet Wash, white browser surfaces, and Execution Green are the recurring levels.
- **Shadow Strategy:** Follow the Working Surface Rule; use shadow for scene separation and genuinely floating navigation only.
- **Border:** One-pixel Hairline Green on light surfaces and Execution Hairline on dark surfaces.
- **Internal Padding:** Common panels use `16px–28px`; scene content uses its own browser and service insets.

### Inputs / Fields
- **Style:** Warm white or browser-white fields with one-pixel gray-green borders, `6px` corners, and Hanken text.
- **Focus:** Visible coral outline and deeper coral caret.
- **Error / Disabled:** Reduce disabled controls to `.55` opacity; use Failure Red only when the field represents a negative result.

### Navigation
- **Style:** Attached light header with typography-only `Molar.` wordmark and four expandable groups: Platform, Products, Solutions, Resources. Feature panels, grouped links, and a utility row explain the information architecture.
- **Default / Hover / Active:** Group summaries use ink-green text; hover/open states deepen the text and receive a coral underline. Desktop dropdowns use a quiet green wash and a restrained floating shadow.
- **Mobile Treatment:** Below `900px`, a `38px × 36px` menu trigger opens the mobile navigation with Escape handling and focus return. Below `640px`, links become one column.

### Application Scene

The signature component is an open application map: one browser, an agent cursor, payment and callback service cards, a result state, and animated causal paths. The scene can show a failed or passed callback condition and exposes condition, play, replay, and evidence controls. The browser and services stay readable on mobile, where the path becomes vertical. The scene's sample state is explicitly labeled as an example or illustrative walkthrough when appropriate.

### Feature Illustrations

Eight authored SVG compositions cover checkout, identity, collaboration, preview checks, automation, extraction, role coverage, and live evidence. They use the same browser surfaces, coral path signal, green success wash, and Geist Mono evidence labels. They explain a mechanism or workflow; they do not imply customer proof, scale, or a live run.

## Do's and Don'ts

### Do:
- **Do** let the paper canvas carry explanation and the dark green stage carry execution.
- **Do** use coral for an active path or next action and green/red for clearly labeled outcomes.
- **Do** keep the Molar. wordmark typography-only and preserve the four attached navigation groups.
- **Do** use Geist Mono for commands, URLs, event timelines, and structured evidence.
- **Do** keep application scenes causal: a user action should lead to service state and a changed result.
- **Do** preserve semantic HTML, keyboard focus, reduced-motion support, and readable mobile controls.
- **Do** label examples and illustrative demos so they are not mistaken for live product evidence.

### Don't:
- **Don't** introduce a separate M icon, decorative logo mark, or second display typeface.
- **Don't** use green as a generic accent or coral as a success signal.
- **Don't** flatten the identity into a text-only page or hide the application scene behind ornamental art.
- **Don't** turn every section into a floating, shadowed card.
- **Don't** imply that authored examples are customer proof or live run results.
- **Don't** remove pause, replay, evidence, focus, or reduced-motion behavior from interactive scenes.
