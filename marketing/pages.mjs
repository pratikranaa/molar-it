const page = (entry) => ({ ...entry, kind: entry.kind, visual: entry.visual });

export const pages = [
  page({
    path: "/products/cartographer",
    title: "Cartographer | Molar",
    description: "Turn a product URL and a user goal into browser evidence your team can inspect.",
    headline: "Map the journey before you maintain it.",
    intro: "Cartographer explores an authorized application in a real browser, records the path it takes, and gives your team a concrete run to review. It is the browser layer for integration heavy QA: the place where checkout, signup, callback, and onboarding behavior becomes observable.",
    kind: "product", visual: "explore",
    highlights: [
      { title: "Goal directed runs", body: "Describe a journey in plain language, then let the agent navigate, act, and report each step with a task ID." },
      { title: "Evidence with the run", body: "Keep structured status, screenshots, traces, and artifact references beside the result so a failure has a place to start." },
      { title: "Agent ready", body: "Use the hosted MCP surface or the unified CLI from a coding agent, with scoped credentials and target authorization." },
    ],
    sections: [
      { title: "From URL to a testable path", body: "Cartographer can crawl a seed URL, identify the meaningful routes and controls, and run a selected goal against an authorized target.", bullets: ["Plain language goals", "Hosted or local browser execution", "Run status and cancellation"] },
      { title: "A practical CLI loop", body: "The current CLI exposes `molar verify \"login works\" --url http://localhost:3000 --json` and `molar run \"add an item to the cart\" --url https://staging.example.com --json`. Results are designed for an agent to inspect and rerun." },
    ],
    faqs: [
      { q: "Does Cartographer test any public website?", a: "External targets require an authorization assertion for your organization. Localhost targets are available for development." },
      { q: "What does a run return?", a: "A structured task result can include status, task and trace identifiers, live view information when available, and artifact manifest references." },
      { q: "Is test code export available?", a: "Export is available for supported workflows. Contact us to confirm support for your application and repository setup." },
    ],
    cta: "Map a journey"
  }),
  page({
    path: "/products/clones",
    title: "Clones | Molar",
    description: "Stateful local service doubles for the third parties your application depends on.",
    headline: "Real service behavior. Repeatable test conditions.",
    intro: "Molar Clones gives integration tests a deterministic world for payment, messaging, identity, and storage behavior. The aim is a believable service boundary: state changes, time moves, callbacks arrive, and your application sees the same kinds of decisions it must handle in production.",
    kind: "product", visual: "clones",
    highlights: [
      { title: "Five core services", body: "Run Stripe, Twilio, Email, Auth, and S3 shaped clones in local or controlled environments." },
      { title: "Time you can control", body: "Use a virtual clock and snapshots to exercise expiry, retries, renewals, and delayed delivery without waiting on the wall clock." },
      { title: "Callbacks with context", body: "Webhook delivery uses deterministic event identity, retry behavior, and vendor shaped signatures for the supported paths." },
    ],
    sections: [
      { title: "Built for complete journeys", body: "A checkout test can create a customer, confirm a payment, advance a subscription clock, and inspect the resulting callback. An onboarding test can create an identity, deliver a verification message, and continue through the application.", bullets: ["Deterministic IDs per seed and run", "JSON snapshots and restore", "Go binaries, TypeScript SDK, and Playwright fixtures"] },
      { title: "Start with the core catalog", body: "The five core clones cover the integration paths teams most often need to exercise: payments, SMS and voice, transactional email, identity, and object storage. Contact us about additional fixture coverage." },
    ],
    faqs: [
      { q: "Can Clones charge a real card or send a real message?", a: "The clone paths are designed for isolated test traffic. The TypeScript SDK refuses identified live vendor destructive calls before network I/O." },
      { q: "Which Stripe behavior is covered?", a: "The supported vertical slice includes payment methods, declines, 3DS required states, PaymentIntents, subscriptions, invoices, checkout sessions, disputes, refunds, and related webhooks." },
      { q: "How much vendor coverage do I get?", a: "Each clone focuses on supported integration paths and state transitions. Contact us to confirm the API behavior your application depends on." },
    ],
    cta: "Explore the clone catalog"
  }),
  page({
    path: "/products/guard",
    title: "Guard | Molar",
    description: "Run release and production checks around the journeys your users depend on.",
    headline: "Put integration paths on the release path.",
    intro: "Guard connects application checks to the places software changes. It can run scenarios in CI, retain the resulting evidence, and expose a review surface for failures. For teams shipping payment, identity, and communication flows, the useful unit is a journey with a verdict rather than a green process badge.",
    kind: "product", visual: "guard",
    highlights: [
      { title: "CI entry point", body: "The unified CLI supports `molar run` for scenarios and `--ci` for non interactive execution with structured output." },
      { title: "Release context", body: "Keep failures attached to a scenario, environment, run, and retained evidence so triage starts with the behavior that changed." },
      { title: "Scheduled checks", body: "Guard has a production monitoring surface for authorized live URLs, with explicit target and safety controls." },
    ],
    sections: [
      { title: "A check that understands integrations", body: "Use a clone backed scenario to exercise a signup email, a payment callback, or a webhook consumer in CI. Use an authorized environment check when the question is whether the deployed journey still works.", bullets: ["Scenario execution through the Guard runner", "GitHub oriented repository and check surfaces", "Run and failure evidence in the platform"] },
      { title: "Release confidence", body: "Guard is available in beta for configured projects and authorized environments. Contact us to confirm repository and monitoring support for your workflow." },
    ],
    faqs: [
      { q: "Does Guard block every merge automatically?", a: "It can be wired as a required check, but the repository connection and scenario policy must be configured for the project." },
      { q: "Can Guard monitor production?", a: "Guard supports scheduled checks for authorized live URLs. Contact us to confirm rollout and target support for your environment." },
      { q: "Can Guard repair a failure?", a: "Mender is a separate preview workflow that helps prepare a proposed repair for review." },
    ],
    cta: "Put a journey under Guard"
  }),
  page({
    path: "/products/trace",
    title: "Trace | Molar",
    description: "Inspect browser runs through structured evidence, screenshots, and replay oriented artifacts.",
    headline: "A failed journey should explain itself.",
    intro: "Trace keeps the record around a run: what the browser saw, what the agent did, and which artifacts were produced. It gives integration failures a shared surface for engineering, QA, and agents to inspect.",
    kind: "product", visual: "trace",
    highlights: [
      { title: "Step level context", body: "Follow task status, trace identifiers, screenshots, and artifact manifests from the same run." },
      { title: "Sensitive by design", body: "Trace access is organization scoped, and artifact reads use authenticated or expiring references rather than an open bucket." },
      { title: "Agent readable", body: "MCP tools expose trace listing, retrieval, bounded slices, diffs, and replay triggers for authorized clients." },
    ],
    sections: [
      { title: "Evidence for integration failures", body: "See where a checkout changed from payment method to confirmation, where a verification email stopped arriving, or which callback assertion failed. The record makes a rerun more deliberate.", bullets: ["Screenshots and trace events", "Network and console context where captured", "Organization scoped artifact access"] },
      { title: "Replay oriented investigation", body: "Trace provides the structured record needed to investigate and reproduce supported failures. Replay availability depends on the workflow and deployment." },
    ],
    faqs: [
      { q: "Does Trace include video?", a: "Screenshots and trace artifacts are available in supported runs. Video and HLS replay embedding are still in beta; contact us about your workflow." },
      { q: "Can agents read a Trace?", a: "Yes, the hosted composite MCP endpoint exposes organization scoped Trace tools, subject to credentials and scopes." },
      { q: "Can Trace expose customer secrets?", a: "Trace treats DOM, network, and console content as sensitive. Access is scoped and artifacts are served through authorization checks." },
    ],
    cta: "Inspect a run"
  }),
  page({
    path: "/products/mender",
    title: "Mender | Molar",
    description: "A guarded repair workflow for investigating failures and preparing a proposed change.",
    headline: "Turn evidence into the next engineering decision.",
    intro: "Mender is the repair layer around a verified failure. It gathers bounded context, classifies the issue, and can prepare a proposed change for review when the configured workflow permits it. It is a preview capability under active development, with human approval at side effect boundaries.",
    kind: "product", visual: "trace",
    highlights: [
      { title: "Failure context first", body: "Start from the run, trace, and scenario evidence before asking an agent to suggest a repair." },
      { title: "Bounded proposals", body: "The workflow constrains repository and tool access, records model decisions, and separates diagnosis from publication." },
      { title: "Review stays in the loop", body: "A proposed pull request or replay action requires the configured authorization and approval path." },
    ],
    sections: [
      { title: "Evidence led proposals", body: "Mender helps an engineer move from a reproducible failure toward a candidate patch, with the evidence and repository checks available for review.", bullets: ["Trace and Guard context", "Audited model inputs and outcomes", "Approval gated repository actions"] },
      { title: "Preview access", body: "Mender is in preview. Talk to us about trying it with your team's repair workflow." },
    ],
    faqs: [
      { q: "How does Mender handle a failing test?", a: "Mender proposes and records a repair workflow; side effects and publication remain approval gated." },
      { q: "What does Mender need?", a: "It needs an authorized run and the relevant repository or source context available through the configured integration." },
      { q: "Is Mender generally available?", a: "It is a preview capability under active development, so availability and repair coverage vary by deployment." },
    ],
    cta: "See the repair workflow"
  }),
  page({
    path: "/solutions/integration-testing",
    title: "Integration testing for real product journeys | Molar",
    description: "Exercise payment, identity, messaging, and webhook behavior without coupling CI to live vendor side effects.",
    headline: "The hard part of QA is usually somewhere else.",
    intro: "Your application may be yours, but its most important journeys cross Stripe, Twilio, email, identity, and S3. Molar gives those boundaries state, time, and callbacks so your tests can ask what happens next.",
    kind: "solution", visual: "clones",
    highlights: [
      { title: "Checkout that reaches a verdict", body: "Exercise payment intent states, 3DS branches, subscription timing, refunds, disputes, and signed callbacks in a controlled clone world." },
      { title: "Signup that receives the code", body: "Provision a connector controlled identity, read the delivered OTP or magic link, and continue the user journey without a personal inbox." },
      { title: "Webhook behavior under time", body: "Advance clocks, trigger events, and inspect deterministic retries instead of waiting on vendor timing or burning sandbox quota." },
    ],
    sections: [
      { title: "A shared world for one journey", body: "Run the app against the Stripe, Twilio, Email, Auth, and S3 clones under one run identity. Snapshots and virtual time make the setup repeatable across local and CI workflows.", bullets: ["Five core service clones", "Vendor shaped APIs", "Deterministic snapshots and callbacks"] },
      { title: "Use live systems deliberately", body: "Clones cover supported integration paths. When you need a vendor specific behavior outside that surface, keep a separate authorized contract check and label the boundary clearly." },
    ],
    faqs: [
      { q: "Is this just HTTP mocking?", a: "The core value is stateful service behavior: records, clocks, retries, signed webhooks, and cross step consequences. Coverage is still bounded to implemented paths." },
      { q: "Which services are first class?", a: "Stripe, Twilio, Email, Auth, and S3 are the five core clone services." },
      { q: "How are live side effects protected?", a: "Clone workflows use isolated test services, and Molar's SDK refuses identified live vendor destructive calls before network I/O." },
    ],
    cta: "Test an integration journey"
  }),
  page({
    path: "/solutions/ai-agents",
    title: "QA for AI agents | Molar",
    description: "Give coding agents a browser verification loop with scoped MCP tools and structured evidence.",
    headline: "Let the agent verify the app it just changed.",
    intro: "AI coding agents can write a checkout flow quickly. The missing step is using the application and checking the outcome. Molar gives agents a CLI and MCP surface for authorized browser tasks, observations, traces, and integration fixtures.",
    kind: "solution", visual: "agent",
    highlights: [
      { title: "One command after code", body: "Run `molar verify \"login works\" --url http://localhost:3000 --json` and return a structured pass or failure for the next agent turn." },
      { title: "MCP native", body: "Connect an agent to `https://api.molar.it/mcp` or run the local stdio server through `molar mcp serve`, subject to the deployed client surface." },
      { title: "Controlled autonomy", body: "External targets require authorization, and financial or irreversible browser actions pause for confirmation." },
    ],
    sections: [
      { title: "Useful output for the next turn", body: "Task IDs, status, rationale, trace references, live view fields when available, and artifact manifests give an agent enough context to diagnose and rerun.", bullets: ["JSON output", "Task polling", "Scoped browser and identity tools"] },
      { title: "A verification loop with control", body: "Local browser verification is the shortest path. Hosted runs use scoped credentials and target authorization, with beta availability varying by workflow." },
    ],
    faqs: [
      { q: "Can an agent click a payment button automatically?", a: "It can act on an authorized target, but financial or irreversible steps require the configured confirmation flow." },
      { q: "Can an agent use a real user's login?", a: "Login uses an exact origin saved identity or a referenced credential, with connector controlled OTP support; inline secrets and personal inbox access are not the workflow." },
      { q: "What happens when verification fails?", a: "The CLI can emit a structured failure with a hint and evidence references so the coding agent can inspect the cause and rerun." },
    ],
    cta: "Give your agent a verifier"
  }),
  page({
    path: "/solutions/startups",
    title: "QA for startups shipping quickly | Molar",
    description: "Keep integration heavy user journeys testable while a small team ships at speed.",
    headline: "Move quickly without making QA a memory test.",
    intro: "A small team often owns the product, the deploy, and the on call. Molar helps turn the highest consequence journeys into repeatable scenarios: the signup that needs an email, the checkout that needs a payment decision, and the webhook that changes state later.",
    kind: "solution", visual: "guard",
    highlights: [
      { title: "Start from the journey", body: "Describe the flow in plain language, run it in a browser, and keep the resulting scenario and evidence near the code." },
      { title: "Avoid fragile sandboxes", body: "Use stateful clones for the integration paths where vendor limits and real side effects make repeated CI uncomfortable." },
      { title: "Grow into release checks", body: "The same scenario can become a CI check and, where configured, a scheduled check for an authorized environment." },
    ],
    sections: [
      { title: "Good first journeys", body: "Pick one revenue path and one activation path. A payment confirmation and an email verified signup usually reveal more than a long list of shallow page checks.", bullets: ["Signup and OTP", "Checkout and receipt", "Webhook driven state changes"] },
      { title: "A focused start", body: "Molar is in private beta. Start with a high value journey, then expand coverage with our team as your deployment and repository connections grow." },
    ],
    faqs: [
      { q: "Who uses Molar?", a: "Engineering, product, and platform teams can start a scenario together, with clear ownership of targets, expected behavior, and failure review." },
      { q: "Can a startup run Molar locally?", a: "Yes. The CLI and clone repositories include local paths; hosted execution requires the configured control plane and credentials." },
      { q: "How does startup access work?", a: "Molar is rolling out in private beta. Contact us to discuss access and a plan for your highest value journeys." },
    ],
    cta: "Choose a first journey"
  }),
  page({
    path: "/solutions/web-app-testing",
    title: "Web app testing | Molar",
    description: "Explore and verify the browser journeys that connect your UI to real application behavior.",
    headline: "Test the path your users actually take.",
    intro: "A web app can look healthy while a callback, redirect, verification code, or receipt path is broken. Molar combines browser exploration, goal based execution, and integration fixtures to put those transitions inside the test conversation.",
    kind: "solution", visual: "explore",
    highlights: [
      { title: "Start with a URL", body: "Use a live or local authorized URL and a concrete claim such as a visible receipt or completed onboarding step." },
      { title: "Observe before acting", body: "Read bounded accessibility observations and structured page context before asking the agent to change state." },
      { title: "Keep the result", body: "A run can retain screenshots, trace identifiers, and artifact references for review and later diagnosis." },
    ],
    sections: [
      { title: "Coverage with a reason", body: "Focus on journeys where the browser, backend, and third party must agree. That is where a screenshot alone cannot establish correctness.", bullets: ["Browser assertions", "Auth and verification loops", "Payment and webhook transitions"] },
      { title: "Choose local or hosted execution", body: "The unified CLI supports local browser verification and hosted fallback. Hosted runs use scoped credentials and target authorization, with private beta limits applying." },
    ],
    faqs: [
      { q: "Can I assert a business outcome?", a: "Yes. The verify command accepts a natural language assertion, such as an order confirmation number being shown, against a URL or prior task." },
      { q: "Does Molar replace Playwright?", a: "Molar can export or produce Playwright oriented artifacts in supported workflows, while Playwright remains a useful direct test tool." },
      { q: "Can I test a logged in path?", a: "Use an authorized saved profile or login credential reference. The system keeps login state origin bound and scopes access." },
    ],
    cta: "Verify a web journey"
  }),
  page({
    path: "/security",
    title: "Security and control | Molar",
    description: "Understand how Molar scopes browser actions, credentials, artifacts, and agent access.",
    headline: "Automation with a defined boundary.",
    intro: "Molar runs close to sensitive application behavior, so control is part of the product. The platform uses organization scoped access, exact origin rules, scoped tokens, approval gates, and explicit side effect handling across browser, clone, trace, and MCP workflows.",
    kind: "resource", visual: "trace",
    highlights: [
      { title: "Target authorization", body: "Non localhost external targets require an organization assertion before exploration or state changing automation." },
      { title: "Scoped agent access", body: "MCP tools carry scopes, and high risk actions identify themselves as state changing, destructive, or approval requiring." },
      { title: "Artifact controls", body: "Trace artifacts use authenticated organization checks and signed or expiring references for reads." },
    ],
    sections: [
      { title: "Credentials stay referenced", body: "Login tools use saved, exact origin credentials or opaque identity references. Connector controlled OTP and message reads are limited to identities provisioned for the organization.", bullets: ["No inline secrets for login tools", "Organization scoped profiles", "Audit and confirmation paths"] },
      { title: "Security you can discuss clearly", body: "Molar uses organization scoped access, target authorization, approval gates, and controlled artifact reads. Contact us for the current security and deployment details." },
    ],
    faqs: [
      { q: "What security documentation is available?", a: "Contact us for current security documentation and deployment details. Compliance status depends on the specific service and customer arrangement." },
      { q: "Can Molar access a customer's personal inbox?", a: "The identity tools are restricted to connector provisioned identities for the organization." },
      { q: "What happens before a destructive action?", a: "High risk actions identify their scope and may pause for Attention or confirmation, depending on the action and runtime policy." },
    ],
    cta: "Read the control model"
  }),
  page({
    path: "/company",
    title: "Company | Molar",
    description: "Molar builds the verification layer for software whose most important behavior crosses system boundaries.",
    headline: "Software is only as reliable as its boundaries.",
    intro: "Molar is built for teams whose customer journeys cross several services: a payment processor decides, an identity provider redirects, an email arrives, a webhook changes state, and the product must still tell one coherent story. Our work is to make that story testable.",
    kind: "resource", visual: "agent",
    highlights: [
      { title: "Journey first", body: "We organize QA around what a user is trying to complete and the systems that must cooperate along the way." },
      { title: "Evidence over theater", body: "A useful result includes the path, the assertion, and enough retained context for another person or agent to inspect it." },
      { title: "Agents with accountability", body: "Molar is designed for coding agents, with permissions, approvals, and structured results built into the workflow." },
    ],
    sections: [
      { title: "Where we focus", body: "The platform brings Cartographer, Clones, Guard, Trace, and the developing Mender workflow together around integration heavy software.", bullets: ["Browser journey verification", "Stateful third party test doubles", "Release evidence and diagnosis"] },
      { title: "Built for the whole web product", body: "Molar brings browser verification, stateful service clones, release checks, trace investigation, and agent workflows together for teams shipping real software. Product access is rolling out in private beta." },
    ],
    faqs: [
      { q: "Who is Molar for?", a: "Engineering and platform teams building web applications with consequential payment, identity, messaging, storage, or webhook flows." },
      { q: "Where is Molar based?", a: "Molar Labs is based in Bengaluru, India." },
      { q: "How do I get access?", a: "Create an account at the Molar dashboard or contact us to discuss private beta access for your team." },
    ],
    cta: "Meet the platform"
  }),
  page({
    path: "/resources",
    title: "Resources | Molar",
    description: "Practical guides for testing integration heavy web applications and agent built software.",
    headline: "Better QA starts with better questions.",
    intro: "Use these resources to choose a journey, model its service boundaries, and decide which evidence belongs in CI. Molar's docs and examples are aimed at the moments where a happy path crosses a vendor API and becomes a real product responsibility.",
    kind: "resource", visual: "explore",
    highlights: [
      { title: "Start with the docs", body: "The public quickstart shows the current CLI path: initialize, point at an app, run a scenario, and connect CI." },
      { title: "Study the boundary", body: "Clone references explain how payment, email, auth, SMS, and storage behavior can be made deterministic for tests." },
      { title: "Bring an agent", body: "MCP and JSON output references help coding agents discover tools, poll tasks, and inspect evidence." },
    ],
    sections: [
      { title: "Suggested reading path", body: "Begin with one journey, read the relevant clone behavior, then wire the smallest useful run into CI. Expand only after the evidence is clear.", bullets: ["Quickstart and CLI", "Clone catalog and examples", "MCP auth and tool surface"] },
      { title: "Resources for your workflow", body: "Use the docs to choose a journey, understand the relevant clone, and decide which evidence belongs in CI. Contact us when you need help mapping a larger workflow." },
    ],
    faqs: [
      { q: "Where is the public documentation?", a: "The current docs entry point is https://molar.it/docs, with the hosted product at https://app.molar.it." },
      { q: "What is the smallest useful example?", a: "Verify one concrete browser claim against localhost, or run one scenario backed by the relevant service clone." },
      { q: "How can I discuss pricing?", a: "Molar is in private beta. Contact us for current commercial details and a plan matched to your workflow." },
    ],
    cta: "Open the documentation"
  }),
];
