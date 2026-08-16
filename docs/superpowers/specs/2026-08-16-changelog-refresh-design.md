# Customer changelog refresh

## Goal

Refresh the existing Molar changelog without changing its proven timeline or product-filter structure. The page must look native to the current live `molar.it` homepage and explain recent releases entirely through customer outcomes.

## Visual direction

- Reuse the live homepage’s cream canvas, paper grain, dark ink, vermilion accent, typography, spacing rhythm, buttons, navigation, and footer through one shared marketing-chrome component.
- Add a polished Products menu to that shared navigation with direct links to the Cartographer, Clones, Guard, and Trace landing subdomains.
- Keep the current chronological timeline and product filters.
- Improve hierarchy with a stronger opening statement, compact filter controls, quieter metadata, refined dividers, and more deliberate whitespace.
- Use restrained reveal and hover motion already compatible with the marketing site; respect reduced-motion preferences.
- Preserve responsive behavior and avoid a separate visual language for the changelog.

## Content model

Each entry contains a date, product, availability, customer-facing title, short summary, and two to four concrete benefits. Availability is limited to `Available now` and `Preview`.

Do not publish commit hashes, deployment identifiers, internal service names, architecture terminology, test counts, infrastructure details, or engineering shorthand.

## Release content

The refreshed feed will cover recent customer-visible additions across:

- Turning a URL and plain-English goal into explored flows and Playwright tests.
- Watching browser work live and replaying completed runs with screenshots, video, network activity, and clear failure explanations.
- Running safer tests against stateful replicas of services such as payments, email, authentication, messaging, and storage.
- Protecting pull requests and monitoring important production journeys.
- Receiving results and working with Molar from Slack and supported coding agents.
- Signing in with familiar identity providers and working from one unified dashboard.
- Clearer organization settings, notifications, usage visibility, and system status.

Only capabilities supported by current product evidence will be labeled `Available now`; incomplete or limited experiences will be labeled `Preview`.

## Interaction and accessibility

- Filters remain keyboard-operable tabs and update the URL.
- Focus states remain visible on every control and link.
- Color is never the only availability indicator.
- Mobile retains a single-column timeline with wrapped product filters and no horizontal scrolling.
- The homepage and changelog share the same navigation and footer behavior.

## Verification

- Source contract verifies customer-language rules, current product filters, valid dates, allowed availability labels, and absence of internal jargon.
- Browser checks cover the full feed and a filtered product view at desktop and mobile sizes.
- Production probes confirm the changelog route, product landing links, and primary dashboard destinations.
