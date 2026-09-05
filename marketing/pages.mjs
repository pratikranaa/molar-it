const page = (entry) => ({ ...entry, kind: entry.kind, visual: entry.visual });

export const pages = [
  page({
    path: "/products/cartographer",
    title: "Cartographer | Molar",
    description: "Turn a product URL and a user goal into browser evidence your team can inspect.",
    headline: "Map the journey before you maintain it.",
    intro: "Cartographer explores an authorized application in a real browser, records the path it takes, and gives your team a concrete run to review. Use it to find and check checkout, signup, callback, and onboarding journeys.",
    kind: "product", visual: "explore",
    highlights: [
      { title: "Describe the journey", body: "Give Molar a plain language goal, then review the browser steps and task result it returns." },
      { title: "Evidence with the run", body: "Keep structured status, screenshots, traces, and artifact references beside the result so a failure has a place to start." },
      { title: "Works with your tools", body: "Use the hosted MCP endpoint or unified CLI from a coding agent with scoped credentials and target authorization." },
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
    intro: "Test payments, messages, sign-in, and file uploads without using the real service. Clones give your application a controlled partner for each step, so a checkout or onboarding journey can be repeated safely in local development and CI.",
    kind: "product", visual: "clones",
    highlights: [
      { title: "Five core services", body: "Run Stripe, Twilio, Email, Auth, and S3 shaped clones in local or controlled environments." },
      { title: "Move time on demand", body: "Exercise expiry, retries, renewals, and delayed delivery with a virtual clock and snapshots instead of waiting for real time." },
      { title: "Callbacks you can inspect", body: "Supported webhook paths include stable event identity, retry behavior, and vendor shaped signatures for realistic callback tests." },
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
      { title: "Understand integrations", body: "Clone references explain how payment, email, auth, SMS, and storage behavior can be controlled for tests." },
      { title: "Bring an agent", body: "MCP and JSON output references help coding agents discover tools, poll tasks, and inspect evidence." },
    ],
    sections: [
      { title: "Suggested reading path", body: "Begin with one journey, read the relevant clone behavior, then wire the smallest useful run into CI. Expand only after the result is clear.", bullets: ["Quickstart and CLI", "Clone catalog and examples", "MCP auth and tools"] },
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

const extraPages = [
  {path:"/solutions/checkout-testing",title:"Checkout testing | Molar",description:"Test checkout, payment callbacks, receipts, and failed payment paths in one browser journey.",headline:"Test checkout from cart to receipt.",intro:"Give Molar a checkout journey and the test services it needs. Follow the browser from cart to payment, then inspect the callback, order state, and receipt that came after it.",kind:"solution",visual:"checkout",highlights:[{title:"Payment paths",body:"Exercise success, declines, refunds, and other supported payment states with isolated test data."},{title:"Callbacks included",body:"Check that your app receives the payment event and updates the order users see."},{title:"Receipt evidence",body:"Keep browser, payment, and email evidence together for faster diagnosis."}],sections:[{title:"From checkout to confirmation",body:"Start with “buy the Pro plan and verify the receipt.” Molar runs the browser steps, connects supported clones, and returns the observed outcome.",bullets:["Cart and plan selection","Payment and webhook handling","Receipt and order assertions"],visual:"checkout"},{title:"Cover unhappy paths",body:"Check declined payment, delayed callbacks, and stale receipt links with controlled service state instead of live charges.",bullets:["Declines and retries","Subscriptions and invoices","Test inbox verification"],visual:"trace"}],faqs:[{q:"Can this use live payment credentials?",a:"Use isolated clone paths for test traffic. Contact us to confirm supported payment behavior."},{q:"Does Molar test the provider dashboard?",a:"Molar focuses on your authorized application journey and supported clone behavior."},{q:"What does a run return?",a:"A run can include status, screenshots, trace identifiers, and artifact references."}],cta:"Test a checkout journey"},
  {path:"/solutions/authentication-testing",title:"Authentication testing | Molar",description:"Verify signup, OAuth, OTP, sessions, invites, and protected application routes.",headline:"Make sign-in a journey you can verify.",intro:"Test the route from new account to authenticated workspace across password, OAuth, email verification, OTP, invites, and session handling.",kind:"solution",visual:"identity",highlights:[{title:"Real browser steps",body:"Follow forms, redirects, codes, and protected pages as a user would."},{title:"Controlled identities",body:"Create scoped test identities and keep them separate across runs."},{title:"Failure paths",body:"Check expired codes, denied access, sign-out, and invitation edge cases."}],sections:[{title:"Signup, verify, continue",body:"Give Molar “create an account, enter the email code, and open the workspace.” The result shows where the journey stopped.",bullets:["Signup and email verification","OAuth redirects","Invites and workspace roles"],visual:"identity"},{title:"Sessions need checks too",body:"Check refresh, reload, sign-out, and access to a route that should remain protected after the first login.",bullets:["Session persistence","Expired credentials","Protected routes"],visual:"guard"}],faqs:[{q:"Can I test OAuth providers?",a:"OAuth is supported in configured workflows. Contact us to confirm provider and beta coverage."},{q:"How are OTP messages handled?",a:"Supported email and SMS clones provide controlled messages and codes."},{q:"Can I keep existing auth tests?",a:"Molar can complement Playwright workflows. Export support depends on setup."}],cta:"Verify an auth journey"},
  {path:"/solutions/team-workflows",title:"Team workflows | Molar",description:"Give engineers, QA, and coding agents one place to run journeys and inspect what happened.",headline:"Let the whole team work from the same evidence.",intro:"A failed journey should be easy for the person who wrote it, reviewed it, or needs to fix it. Molar connects run status, browser evidence, service state, and the next action.",kind:"solution",visual:"collaboration",highlights:[{title:"Shared run context",body:"Keep the goal, environment, result, and artifacts together."},{title:"Useful handoffs",body:"Share a trace with a teammate or coding agent instead of screenshots without context."},{title:"Repeatable checks",body:"Turn a useful investigation into a scenario your team can run again."}],sections:[{title:"A workflow for review",body:"An engineer runs a preview journey, a reviewer inspects the result, and an agent reads structured status. Everyone works from one recorded run.",bullets:["Project access","Structured results","Trace links"],visual:"collaboration"},{title:"Keep the decision close",body:"Use Guard for release checks, Trace for investigation, and CLI or MCP when a coding tool needs to rerun verification.",bullets:["PR and CI workflows","Agent output","Completed, failed, and blocked states"],visual:"guard"}],faqs:[{q:"Is Molar only for QA specialists?",a:"Developers, QA, platform teams, and coding agents can use the same workflow."},{q:"Can we control who sees a run?",a:"Access is organization scoped through authenticated project interfaces."},{q:"Can a teammate rerun my flow?",a:"Supported workflows can be rerun with configured target, credentials, and scenario settings."}],cta:"Bring your team into the loop"},
  {path:"/solutions/preview-deployments",title:"Preview deployment testing | Molar",description:"Run critical browser journeys against preview deployments before changes reach production.",headline:"Know what a change did before it ships.",intro:"Connect a preview URL to important journeys. Molar checks the changed application in a browser and leaves evidence for review before merge.",kind:"solution",visual:"preview",highlights:[{title:"Check the change",body:"Run selected journeys against the environment created for a pull request."},{title:"See the failure",body:"Open trace, screenshots, and status that explain where the preview diverged."},{title:"Gate with context",body:"Use configured checks as part of review when repository support is set up."}],sections:[{title:"A preview test in practice",body:"A pull request changes checkout. The run opens the preview, buys a test plan, verifies the callback, and reports the order state.",bullets:["Preview URL","Critical path scenarios","Result attached to review"],visual:"preview"},{title:"Start with a small suite",body:"Choose the journeys where a regression matters most, then expand coverage as the team learns.",bullets:["Signup and login","Checkout and payment","Invites and webhooks"],visual:"guard"}],faqs:[{q:"Does Molar test every pull request automatically?",a:"Guard runs configured checks when repository connection and policy are set up."},{q:"Can previews use Clones?",a:"Supported workflows can pair a preview with configured service clones."},{q:"What happens when a check fails?",a:"The run records a failed or blocked outcome with available evidence."}],cta:"Test a preview deployment"},
  {path:"/solutions/workflow-automation",title:"Workflow automation | Molar",description:"Automate browser tasks such as forms, downloads, extraction, and verification with scoped access.",headline:"Give the browser a clear job.",intro:"Describe a task, set the authorized target and credentials, and let Molar carry out the browser steps. Use the result in a script, dashboard, or agent workflow.",kind:"solution",visual:"automation",highlights:[{title:"Task to result",body:"Start with a goal such as finding an invoice or completing an approved form."},{title:"Browser aware",body:"Work through the interface and state your users see."},{title:"Built for handoff",body:"Return structured status and artifact references to the next tool."}],sections:[{title:"Useful jobs",body:"Run a bounded task against an authorized app: download a report, update a project field, or verify a page state.",bullets:["Forms","File downloads","Page checks"],visual:"automation"},{title:"Keep automation accountable",body:"Define target, scope, credentials, and expected result before execution. Completed, failed, and blocked outcomes stay distinct.",bullets:["CLI and MCP","Scoped access","Inspectable evidence"],visual:"trace"}],faqs:[{q:"Is this only for testing?",a:"No. Molar supports authorized browser tasks as well as QA journeys."},{q:"Can an agent start a task?",a:"The CLI and MCP provide agent accessible entry points with structured results."},{q:"Can automation make irreversible changes?",a:"Sensitive actions depend on configured workflow and authorization controls."}],cta:"Automate a browser task"},
  {path:"/solutions/web-data-extraction",title:"Web data extraction | Molar",description:"Read structured information from authorized web applications through a real browser.",headline:"Turn a page into useful data.",intro:"Point Molar at an authorized page and describe the fields you need. It can reach the relevant state, read visible information, and return structured data with evidence.",kind:"solution",visual:"data",highlights:[{title:"Describe the fields",body:"Ask for plan names, invoice details, table rows, or another clear schema."},{title:"Navigate first",body:"Reach the page state containing the data instead of scraping a guessed URL."},{title:"Keep a record",body:"Use the result with run status and artifact references for review."}],sections:[{title:"From page to JSON",body:"Ask “read the current plan names and prices.” The browser reaches the page, extracts the fields, and returns observed values.",bullets:["Visible page data","Schema oriented requests","Structured output"],visual:"data"},{title:"Respect the source",body:"Use extraction on applications and pages you are authorized to access. Set a narrow target and request only needed fields.",bullets:["Scoped credentials","Bounded pages","Evidence for review"],visual:"guard"}],faqs:[{q:"Can Molar extract from any website?",a:"Use Molar with targets you own or are authorized to access."},{q:"Does extraction use an API?",a:"The workflow uses a real browser and returns structured results through supported interfaces."},{q:"Can I schedule extraction?",a:"Scheduling depends on the configured deployment and workflow."}],cta:"Extract from an authorized app"},
  {path:"/platform/browser-agents",title:"Browser agents | Molar",description:"Give people and coding agents a browser that can navigate, act, and verify bounded goals.",headline:"A browser agent with a job to finish.",intro:"Molar turns a clear goal into browser actions and an inspectable result for QA, workflow automation, extraction, or verification.",kind:"product",visual:"automation",highlights:[{title:"Goal in, result out",body:"Describe the task, define the target, and receive status plus available evidence."},{title:"State matters",body:"The agent uses what the page shows after each action to choose the next step."},{title:"Choose your interface",body:"Start from the dashboard, CLI, or MCP for the workflow you are building."}],sections:[{title:"A practical browser loop",body:"Choose a URL, give a bounded goal such as “find the latest invoice,” and set permitted credentials. Molar navigates, acts, and returns the result.",bullets:["Authorized execution","Task status","Structured references"],visual:"automation"},{title:"QA and automation share foundations",body:"The same browser layer can verify a login, complete an approved task, extract fields, or provide evidence to a coding agent.",bullets:["Verification and extraction","CLI and MCP","Screenshots where captured"],visual:"trace"}],faqs:[{q:"What can a browser agent do?",a:"Supported workflows include navigation, forms, extraction, downloads, and page verification."},{q:"Can I watch a run?",a:"Live view information is available for supported runs; broad interactive capacity remains in beta."},{q:"Does the agent have unrestricted access?",a:"Targets, credentials, scopes, and workflow policies define access and actions."}],cta:"Give a browser a job"},
  {path:"/platform/live-view",title:"Live view | Molar",description:"Follow supported browser runs with live status and inspectable evidence.",headline:"See the browser while the work happens.",intro:"When a supported run exposes live view, follow its current browser state and use the resulting evidence to understand progress, failure, or completion.",kind:"product",visual:"live",highlights:[{title:"Current state",body:"See where a supported run is working and whether it completed, failed, or needs attention."},{title:"Useful handoff",body:"Give a teammate or agent shared run context when the workflow allows it."},{title:"Evidence after",body:"Use screenshots, traces, and artifacts to investigate after the live moment."}],sections:[{title:"Watch a supported run",body:"Start a browser task or verification, open the available live view reference, and follow the journey through the application.",bullets:["Run status","Live view when available","Trace context"],visual:"live"},{title:"Designed for safe observation",body:"Live access follows the run target and authorization. Interactive takeover, video, and broad streaming depend on deployment and beta coverage.",bullets:["Scoped access","Read only observation","Clear outcomes"],visual:"guard"}],faqs:[{q:"Is live view available for every run?",a:"Live view is available for supported workflows and deployments."},{q:"Can I take control?",a:"Interactive takeover remains limited beta functionality."},{q:"Does live view replace Trace?",a:"Live view shows progress; Trace and artifacts provide the later investigation record."}],cta:"Explore live browser runs"},
  {path:"/platform/swarm",title:"Swarm | Molar",description:"Preview coordinated browser testing across roles and scenarios with planned coverage and observed results.",headline:"Test more roles in one plan.",intro:"Swarm is a preview workflow for planning browser checks across personas, permissions, and scenarios. Compare intended coverage with what runs actually observed.",kind:"product",visual:"swarm",preview:true,highlights:[{title:"Plan by persona",body:"Describe roles and journeys from guest signup to administrator workflow."},{title:"Compare coverage",body:"See planned scenarios beside results actually observed by runs."},{title:"Preview access",body:"Swarm is under active development. Contact us to confirm availability and supported scale."}],sections:[{title:"A role based test plan",body:"Give Swarm personas and goals such as member checkout, invited teammate access, and admin billing review. The planner organizes requested coverage.",bullets:["Persona paths","Scenario planning","Observed links"],visual:"swarm"},{title:"Start with known journeys",body:"Use the plan to identify missing role coverage and prioritize the next runs. Availability and depth depend on the preview deployment.",bullets:["Planned versus observed","Bounded run groups","Trace context"],visual:"trace"}],faqs:[{q:"Is Swarm generally available?",a:"Swarm is in preview. Talk to us to confirm access and supported workflows."},{q:"Does Swarm promise a fixed agent capacity?",a:"Molar makes no blanket capacity claim. Current beta operation is bounded, with broader scale under development."},{q:"Does a plan prove every scenario passed?",a:"No. A plan represents intended coverage; observed results come from runs that execute and return evidence."}],cta:"Discuss Swarm preview"},
  {path:"/platform/developer-tools",title:"Developer tools | Molar",description:"Connect browser verification and automation to CLI, MCP, JSON output, and Playwright workflows.",headline:"Put verification where code gets written.",intro:"Use the interface that fits: a CLI command in a terminal, MCP from a coding agent, or Playwright oriented work with structured evidence beside it.",kind:"product",visual:"collaboration",highlights:[{title:"CLI commands",body:"Run a bounded goal with a URL and request JSON output for scripts and agents."},{title:"MCP tools",body:"Connect an MCP compatible client to authorized browser, run, and trace workflows."},{title:"Playwright friendly",body:"Keep editable browser tests and bring supported generated flows into engineering work."}],sections:[{title:"A small verification loop",body:"After changing a login form, run `molar verify \"login works\" --url http://localhost:3000 --json`. Read the result, inspect evidence, and rerun after a fix.",bullets:["Local and hosted targets","JSON results","Trace references"],visual:"collaboration"},{title:"Build interfaces into tools",body:"Use CLI and MCP where a coding agent or CI job needs to start work and inspect the outcome. Availability depends on authentication and deployment.",bullets:["MCP clients","Scoped credentials","Quickstart documentation"],visual:"automation"}],faqs:[{q:"Which command should I start with?",a:"Use `molar verify` for a browser claim and `molar run` for a scenario or task. Add `--json` for agent output."},{q:"Where is the hosted MCP endpoint?",a:"The hosted endpoint is documented at https://docs.molar.it and requires configured credentials and scopes."},{q:"Can I keep Playwright?",a:"Yes. Molar can complement Playwright workflows; export support varies by setup."}],cta:"Connect your developer workflow"}
];
pages.push(...extraPages.map(page));
