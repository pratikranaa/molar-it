const page = (entry) => ({
  ...entry,
  kind: entry.kind,
  visual: entry.visual,
  startHref: entry.startHref || (entry.preview ? "/contact" : "/verify"),
  startLabel: entry.startLabel || (entry.preview ? "Discuss preview access" : "Try a browser check"),
  docHref: entry.docHref || "https://docs.molar.it",
});

export const pages = [
  page({
    path: "/products/cartographer",
    title: "Cartographer | Molar",
    description: "Turn a product URL and a user goal into browser evidence your team can inspect.",
    headline: "See how your app actually works.",
    intro: "Point Cartographer at an app you own or are allowed to test. It explores key routes in a real browser, records what happened, and helps you turn checkout, signup, callback, or onboarding into a check your team can rerun.",
    kind: "product", visual: "explore",
    highlights: [
      { title: "Start with a goal", body: "Describe what a user should accomplish, then review the browser steps and result." },
      { title: "Know what happened", body: "Keep status, screenshots, and trace evidence with the run so a failure has a clear starting point." },
      { title: "Fits your workflow", body: "Run it from the dashboard, CLI, or hosted MCP endpoint with the credentials and target you choose." },
    ],
    sections: [
      { title: "From URL to a testable path", body: "Cartographer follows the routes and controls that matter, then runs a goal against the app so you can see the path a user takes.", bullets: ["Plain language goals", "Hosted or local browser execution", "Run status and cancellation"] },
      { title: "A practical CLI loop", body: "Run `molar verify \"login works\" --url http://localhost:3000 --json` or `molar run \"add an item to the cart\" --url https://staging.example.com --json`. Inspect the result, fix the app, and run it again." },
    ],
    faqs: [
      { q: "Does Cartographer test any public website?", a: "Test apps you own or have permission to access. Localhost targets are available for development." },
      { q: "What does a run return?", a: "A run can include status, task and trace identifiers, a live view link for supported workflows, screenshots, and other captured evidence." },
      { q: "Is test code export available?", a: "Generated test export and clean replay are still being validated in beta. Talk with us about your workflow before relying on repository publication." },
    ],
    cta: "Map a journey"
  }),
  page({
    path: "/products/clones",
    title: "Clones | Molar",
    description: "Stateful local service doubles for the third parties your application depends on.",
    headline: "Test the services behind your app.",
    intro: "Test payments, messages, sign-in, and file uploads without calling the real service. Clones give your app a predictable partner for each step, so checkout and onboarding can run safely in local development and CI.",
    kind: "product", visual: "clones",
    highlights: [
      { title: "Five core services", body: "Run Stripe, Twilio, Email, Auth, and S3 clones with documented behavior alongside your app." },
      { title: "Move time on demand", body: "Test expiry, retries, renewals, and delayed delivery with a virtual clock instead of waiting for real time." },
      { title: "Callbacks you can inspect", body: "Exercise webhook delivery, retries, and supported signature behavior as part of the same test." },
    ],
    sections: [
      { title: "Built for complete journeys", body: "A checkout test can create a customer, confirm a payment, advance a subscription clock, and inspect the callback. An onboarding test can create an identity, deliver a verification message, and continue through the app.", bullets: ["Deterministic IDs per seed and run", "JSON snapshots and restore", "Go binaries, TypeScript SDK, and Playwright fixtures"] },
      { title: "Start with the core catalog", body: "The five core clones cover payments, SMS and voice, transactional email, identity, and object storage. Contact us to confirm the behavior your application needs." },
    ],
    faqs: [
      { q: "Can Clones charge a real card or send a real message?", a: "No. Clone traffic stays in isolated test services, and the TypeScript SDK blocks known destructive calls to live vendors." },
      { q: "Which Stripe behavior is covered?", a: "The current Stripe clone covers payment methods, declines, 3DS required states, PaymentIntents, subscriptions, invoices, checkout sessions, disputes, refunds, and related webhooks." },
      { q: "How much vendor coverage do I get?", a: "Each clone covers specific integration paths and state transitions. Contact us to confirm the API behavior your application depends on." },
    ],
    cta: "Explore the clone catalog"
  }),
  page({
    path: "/products/guard",
    title: "Guard | Molar",
    description: "Run release and production checks around the journeys your users depend on.",
    headline: "Catch broken flows before release.",
    intro: "Guard runs the journeys that matter in CI and after release, then leaves evidence your team can review when something fails. For payment, identity, and communication flows, you get a verdict on the user journey instead of a green process badge.",
    kind: "product", visual: "guard",
    highlights: [
      { title: "Runs in CI", body: "Use `molar run` and `--ci` to run scenarios in a pull request or release pipeline with structured output." },
      { title: "A failure you can investigate", body: "Keep the scenario, environment, run, and evidence together so triage starts with the behavior that changed." },
      { title: "Checks after release", body: "Check an authorized live URL on a schedule, so you know when a critical journey stops working." },
    ],
    sections: [
      { title: "A check that understands integrations", body: "Exercise a signup email, payment callback, or webhook consumer in CI with a clone backed scenario. Check a live environment when you need to know whether the journey still works after release.", bullets: ["Scenario execution through the Guard runner", "GitHub pull request checks", "Run and failure evidence"] },
      { title: "Release confidence", body: "Guard is in beta. Contact us to confirm repository and monitoring support for your workflow." },
    ],
    faqs: [
      { q: "Does Guard block every merge automatically?", a: "It can be wired as a required check once your repository connection and scenario policy are set up." },
      { q: "Can Guard monitor production?", a: "Guard supports scheduled checks for authorized live URLs. Contact us to confirm availability for your environment." },
      { q: "Can Guard repair a failure?", a: "Mender is a separate preview workflow that helps prepare a proposed repair for review." },
    ],
    cta: "Put a journey under Guard"
  }),
  page({
    path: "/products/trace",
    title: "Trace | Molar",
    description: "Inspect browser runs through structured evidence, screenshots, and artifacts built for investigation.",
    headline: "Know why a journey failed.",
    intro: "Trace keeps the record of a run: what the browser saw, what the agent did, and what evidence it captured. Your engineering, QA, and agent workflows can use the same record to find the break and decide what to try next.",
    kind: "product", visual: "trace",
    highlights: [
      { title: "See each step", body: "Follow task status, trace identifiers, screenshots, and captured evidence from the same run." },
      { title: "Evidence stays protected", body: "Trace protects run evidence with authenticated access and expiring references." },
      { title: "Ready for agents", body: "MCP tools let authorized clients list traces, retrieve focused slices, compare runs, and start a replay." },
    ],
    sections: [
      { title: "Evidence for integration failures", body: "See where checkout stopped, where a verification email failed to arrive, or which callback assertion failed. The record gives the next rerun a clear starting point.", bullets: ["Screenshots and trace events", "Network and console context where captured", "Authenticated evidence access"] },
      { title: "Replay when you need it", body: "Use the run record to investigate and reproduce supported failures. Replay availability depends on the workflow." },
    ],
    faqs: [
      { q: "Does Trace include video?", a: "Supported runs include captured screenshots and browser recordings. The available evidence depends on the workflow; broader video streaming and embedding remain in beta." },
      { q: "Can agents read a Trace?", a: "Yes, the hosted MCP endpoint exposes Trace tools for clients with the required credentials." },
      { q: "Can Trace expose customer secrets?", a: "Trace treats DOM, network, and console content as sensitive. Authenticated access protects the evidence." },
    ],
    cta: "Inspect a run"
  }),
  page({
    path: "/products/mender",
    title: "Mender | Molar",
    description: "A guarded repair workflow for investigating failures and preparing a proposed change.",
    headline: "Turn a failure into a proposed fix.",
    intro: "Mender starts with a verified failure, gathers the relevant context, and prepares a proposed change for review. It is a preview capability under active development, with human approval before changes are applied.",
    kind: "product", visual: "trace",
    highlights: [
      { title: "Start with the evidence", body: "Use the run, trace, and scenario before asking an agent to suggest a repair." },
      { title: "Proposals you can inspect", body: "Review the repository context and model decisions before a change is prepared." },
      { title: "You approve the change", body: "A proposed pull request or replay action waits for your team’s approval." },
    ],
    sections: [
      { title: "Evidence led proposals", body: "Mender helps an engineer move from a reproducible failure toward a candidate patch, with the evidence and repository checks available for review.", bullets: ["Trace and Guard context", "Failure evidence and proposed changes", "Approval before repository changes"] },
      { title: "Preview access", body: "Mender is in preview. Talk to us about trying it with your team's repair workflow." },
    ],
    faqs: [
      { q: "How does Mender handle a failing test?", a: "Mender proposes and records a repair workflow; changes and publication wait for your approval." },
      { q: "What does Mender need?", a: "It needs an authorized run and the relevant repository or source context from a connected integration." },
      { q: "Is Mender generally available?", a: "It is a preview capability under active development, so availability and repair coverage vary." },
    ],
    cta: "See the repair workflow"
  }),
  page({
    path: "/solutions/integration-testing",
    title: "Integration testing for real product journeys | Molar",
    description: "Exercise payment, identity, messaging, and webhook behavior without coupling CI to live vendor side effects.",
    headline: "Test the services your app depends on.",
    intro: "Your most important journeys cross payment, messaging, email, identity, and storage services. Molar gives those integrations state, time, and callbacks so your tests can check what happens next.",
    kind: "solution", visual: "clones",
    highlights: [
      { title: "Checkout that reaches a verdict", body: "Exercise payment states, 3DS branches, subscription timing, refunds, disputes, and signed callbacks with isolated test data." },
      { title: "Signup that receives the code", body: "Create a test identity, read the delivered OTP or magic link, and continue the user journey without a personal inbox." },
      { title: "Webhook behavior under time", body: "Advance clocks, trigger events, and inspect retries instead of waiting on vendor timing or burning sandbox quota." },
    ],
    sections: [
      { title: "One test environment for one journey", body: "Run your app against the Stripe, Twilio, Email, Auth, and S3 clones together. Snapshots and virtual time make the setup repeatable across local and CI workflows.", bullets: ["Five core service clones", "Supported service APIs", "Deterministic snapshots and callbacks"] },
      { title: "Use live systems deliberately", body: "Use clones for supported integration paths. When you need a vendor specific behavior outside them, keep a separate authorized contract check and label it clearly." },
    ],
    faqs: [
      { q: "Is this just HTTP mocking?", a: "The core value is stateful service behavior: records, clocks, retries, signed webhooks, and cross step consequences. Contact us to confirm the paths your application needs." },
      { q: "Which services are first class?", a: "Stripe, Twilio, Email, Auth, and S3 are the five core clone services." },
      { q: "How are live side effects protected?", a: "Clone workflows use isolated test services, keeping test payments, messages, and callbacks away from live vendor traffic." },
    ],
    cta: "Test an integration journey"
  }),
  page({
    path: "/solutions/ai-agents",
    title: "QA for AI agents | Molar",
    description: "Give coding agents a browser verification loop with MCP tools and structured evidence.",
    headline: "Let the agent verify the app it just changed.",
    intro: "AI coding agents can write a checkout flow quickly. The missing step is using the application and checking the outcome. Molar gives agents CLI and MCP tools to run browser tasks, inspect what happened, and try again.",
    kind: "solution", visual: "agent",
    highlights: [
      { title: "One command after code", body: "Run `molar verify \"login works\" --url http://localhost:3000 --json` and return a structured pass or failure for the next agent turn." },
      { title: "MCP access", body: "Connect an agent to `https://api.molar.it/mcp` or run the local stdio server through `molar mcp serve`." },
      { title: "You stay in control", body: "External targets require authorization, and financial or irreversible browser actions pause for confirmation." },
    ],
    sections: [
      { title: "Useful output for the next turn", body: "Task status, rationale, trace references, a live view link for supported runs, and captured evidence give an agent enough context to diagnose and rerun.", bullets: ["JSON output", "Task polling", "Browser and identity tools"] },
      { title: "A verification loop with control", body: "Local browser verification is the shortest path. Hosted runs use the credentials and target you choose, with beta availability varying by workflow." },
    ],
    faqs: [
      { q: "Can an agent click a payment button automatically?", a: "It can act on an authorized target, but financial or irreversible steps require a confirmation flow." },
      { q: "Can an agent use a real user's login?", a: "Login uses an exact origin saved identity or a referenced credential, with connector controlled OTP support; inline secrets and personal inbox access are not the workflow." },
      { q: "What happens when verification fails?", a: "The CLI can emit a structured failure with a hint and evidence references so the coding agent can inspect the cause and rerun." },
    ],
    cta: "Give your agent a verifier"
  }),
  page({
    path: "/solutions/startups",
    title: "QA for startups shipping quickly | Molar",
    description: "Keep connected user journeys testable while a small team ships at speed.",
    headline: "Ship quickly with confidence in the journeys that matter.",
    intro: "A small team often owns the product, the release, and the on call. Molar turns revenue and activation journeys into repeatable checks: signup with email, checkout with payment, and the webhook that changes state later.",
    kind: "solution", visual: "guard",
    highlights: [
      { title: "Start from the journey", body: "Describe the flow in plain language, run it in a browser, and keep the scenario and evidence near the code." },
      { title: "Skip fragile sandboxes", body: "Use stateful clones for integration paths where vendor limits and live side effects make repeated CI uncomfortable." },
      { title: "Grow into release checks", body: "The same scenario can become a CI check and, for supported environments, a scheduled check for an authorized live URL." },
    ],
    sections: [
      { title: "Good first journeys", body: "Pick one revenue path and one activation path. A payment confirmation and an email verified signup usually reveal more than a long list of shallow page checks.", bullets: ["Signup and OTP", "Checkout and receipt", "Webhook driven state changes"] },
      { title: "A focused start", body: "Molar is in private beta. Start with one important journey, then expand coverage with our team." },
    ],
    faqs: [
      { q: "Who uses Molar?", a: "Engineering, product, and platform teams can start a scenario together, agree on the expected outcome, and review the result." },
      { q: "Can a startup run Molar locally?", a: "Yes. The CLI and clone repositories include local paths; hosted execution requires credentials." },
      { q: "How does startup access work?", a: "Molar is rolling out in private beta. Contact us to discuss access and a plan for your highest value journeys." },
    ],
    cta: "Choose a first journey"
  }),
  page({
    path: "/solutions/web-app-testing",
    title: "Web app testing | Molar",
    description: "Explore and verify the browser journeys that connect your UI to real application behavior.",
    headline: "Test the path your users actually take.",
    intro: "A web app can look healthy while a callback, redirect, verification code, or receipt path is broken. Molar explores the browser journey and checks the transitions behind it.",
    kind: "solution", visual: "explore",
    highlights: [
      { title: "Start with a URL", body: "Use a live or local URL you can access and a concrete claim such as a visible receipt or completed onboarding step." },
      { title: "See before acting", body: "Read the page state before asking the agent to change it." },
      { title: "Keep the result", body: "A run can retain screenshots, trace identifiers, and captured evidence for review and diagnosis." },
    ],
    sections: [
      { title: "Coverage with a reason", body: "Focus on journeys where the browser, backend, and third party must agree. That is where a screenshot alone cannot establish correctness.", bullets: ["Browser assertions", "Auth and verification loops", "Payment and webhook transitions"] },
      { title: "Choose local or hosted execution", body: "The unified CLI supports local browser verification and hosted runs. Hosted availability varies during private beta." },
    ],
    faqs: [
      { q: "Can I assert a business outcome?", a: "Yes. The verify command accepts a natural language assertion, such as an order confirmation number being shown, against a URL or prior task." },
      { q: "Does Molar replace Playwright?", a: "Keep using your Playwright tests. Molar can run browser checks alongside them; generated test export and clean replay are still being validated in beta." },
      { q: "Can I test a logged in path?", a: "Use a saved profile or login credential reference for the app. Login state stays tied to its origin." },
    ],
    cta: "Verify a web journey"
  }),
  page({
    path: "/security",
    title: "Security and control | Molar",
    description: "Understand how Molar scopes browser actions, credentials, artifacts, and agent access.",
    headline: "Automate with confidence and control.",
    intro: "Molar can work with sensitive application behavior, so every run has a clear target, identity, and approval path. Workspace permissions and site-specific identities help you control what Molar can access and change.",
    kind: "resource", visual: "trace",
    highlights: [
      { title: "Choose the target", body: "External targets require authorization before exploration or state changing automation." },
      { title: "Clear agent access", body: "MCP tools identify high risk actions as state changing, destructive, or approval requiring." },
      { title: "Protect run evidence", body: "Trace artifacts use authenticated access and signed or expiring references for reads." },
    ],
    sections: [
      { title: "Use the right test account", body: "Save an authorized test identity for the application. Login stays tied to that site, and supported email or SMS checks use identities provisioned for your workspace.", bullets: ["No inline secrets for login tools", "Workspace profiles", "Audit and confirmation paths"] },
      { title: "Security you can discuss clearly", body: "Molar uses target authorization, approval gates, and controlled artifact reads. Contact us for current security details." },
    ],
    faqs: [
      { q: "What security documentation is available?", a: "Contact us for current details on access controls, data handling, retention, and deployment options." },
      { q: "Can Molar access a customer's personal inbox?", a: "No. Identity tools use connector provisioned identities for the workspace." },
      { q: "What happens before a destructive action?", a: "High risk actions identify what they will change and may pause for confirmation, depending on the action and runtime policy." },
    ],
    cta: "Read the control model"
  }),
  page({
    path: "/company",
    title: "Company | Molar",
    description: "Molar helps teams verify software whose most important behavior crosses several services.",
    headline: "Make the whole customer journey work.",
    intro: "Molar is built for teams whose customer journeys cross payment, identity, email, and webhook services. We help you test the complete story, from the first click to the result a customer needs.",
    kind: "resource", visual: "agent",
    highlights: [
      { title: "Journey first", body: "We organize QA around what a user is trying to complete and the systems that must cooperate along the way." },
      { title: "Evidence over theater", body: "A useful result shows the path, the assertion, and enough context for another person or agent to understand it." },
      { title: "Agents with accountability", body: "Molar gives coding agents permissions, approvals, and structured results as part of the workflow." },
    ],
    sections: [
      { title: "Where we focus", body: "The platform brings Cartographer, Clones, Guard, Trace, and the developing Mender workflow together around software whose journeys cross several services.", bullets: ["Browser journey verification", "Stateful third party test doubles", "Release evidence and diagnosis"] },
      { title: "Built for the whole web product", body: "Molar brings browser verification, stateful service clones, release checks, trace investigation, and agent workflows together for teams shipping real software. Product access is rolling out in beta." },
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
    description: "Practical guides for testing web applications with several connected services and agent built software.",
    headline: "Learn how to test the whole journey.",
    intro: "Use these resources to choose a journey, understand the services behind it, and decide what evidence belongs in CI. The docs focus on the moments where a happy path crosses a vendor API and becomes a real product responsibility.",
    kind: "resource", visual: "explore",
    highlights: [
      { title: "Start with the docs", body: "The quickstart shows the CLI path: initialize, point at an app, run a scenario, and connect CI." },
      { title: "Understand integrations", body: "Clone references explain how payment, email, auth, SMS, and storage behavior can be controlled in tests." },
      { title: "Bring an agent", body: "MCP and JSON output references help coding agents discover tools, wait for results, and inspect evidence." },
    ],
    sections: [
      { title: "Suggested reading path", body: "Begin with one journey, read the relevant clone behavior, then wire the smallest useful run into CI. Expand after the result is clear.", bullets: ["Quickstart and CLI", "Clone catalog and examples", "MCP auth and tools"] },
      { title: "Resources for your workflow", body: "Use the docs to choose a journey, understand the relevant clone, and decide which evidence belongs in CI. Contact us when you need help mapping a larger workflow." },
    ],
    faqs: [
      { q: "Where is the public documentation?", a: "Open Documentation from the Resources menu for setup instructions and the current CLI, API, and MCP reference." },
      { q: "What is the smallest useful example?", a: "Verify one concrete browser claim against localhost, or run one scenario backed by the relevant service clone." },
      { q: "How can I discuss pricing?", a: "Molar is in private beta. Contact us for current commercial details and a plan matched to your workflow." },
    ],
    cta: "Open the documentation"
  }),
];

const extraPages = [
  {path:"/solutions/checkout-testing",title:"Checkout testing | Molar",description:"Test checkout, payment callbacks, receipts, and failed payment paths in one browser journey.",headline:"Check every step of checkout.",intro:"Give Molar a checkout goal and the test services it needs. Follow the browser from cart to payment, then check the callback, order state, and receipt your customer sees.",kind:"solution",visual:"checkout",highlights:[{title:"Payment paths",body:"Exercise success, declines, refunds, and other supported payment states with isolated test data."},{title:"Callbacks included",body:"Check that your app receives the payment event and updates the order your customer sees."},{title:"Receipt evidence",body:"Keep browser, payment, and email evidence together so a failure is faster to diagnose."}],sections:[{title:"From checkout to confirmation",body:"Start with “buy the Pro plan and verify the receipt.” Molar runs the browser steps, connects the available clones, and returns the result.",bullets:["Cart and plan selection","Payment and webhook handling","Receipt and order assertions"],visual:"checkout"},{title:"Cover unhappy paths",body:"Check declined payment, delayed callbacks, and stale receipt links with controlled service state instead of live charges.",bullets:["Declines and retries","Subscriptions and invoices","Test inbox verification"],visual:"trace"}],faqs:[{q:"Can this use live payment credentials?",a:"Use isolated clone paths for test traffic. Contact us to confirm supported payment behavior."},{q:"Does Molar test the provider dashboard?",a:"Molar focuses on your authorized application journey and supported clone behavior."},{q:"What does a run return?",a:"A run can include status, screenshots, trace identifiers, and captured evidence."}],cta:"Test a checkout journey"},
  {path:"/solutions/authentication-testing",title:"Authentication testing | Molar",description:"Verify signup, OAuth, OTP, sessions, invites, and protected application routes.",headline:"Check sign-in from signup to workspace.",intro:"Test the route from a new account to an authenticated workspace across password, OAuth, email verification, OTP, invites, and sessions.",kind:"solution",visual:"identity",highlights:[{title:"Real browser steps",body:"Follow forms, redirects, codes, and protected pages as a user would."},{title:"Test identities",body:"Create separate identities for each run and role."},{title:"Failure paths",body:"Check expired codes, denied access, sign-out, and invitation edge cases."}],sections:[{title:"Signup, verify, continue",body:"Give Molar “create an account, enter the email code, and open the workspace.” The result shows where the journey stopped.",bullets:["Signup and email verification","OAuth redirects","Invites and workspace roles"],visual:"identity"},{title:"Sessions need checks too",body:"Check refresh, reload, sign-out, and access to a route that should remain protected after the first login.",bullets:["Session persistence","Expired credentials","Protected routes"],visual:"guard"}],faqs:[{q:"Can I test OAuth providers?",a:"OAuth is available in some workflows. Contact us to confirm provider and beta coverage."},{q:"How are OTP messages handled?",a:"Supported email and SMS clones provide controlled messages and codes."},{q:"Can I keep existing auth tests?",a:"Molar can complement Playwright workflows; export support depends on your setup."}],cta:"Verify an auth journey"},
  {path:"/solutions/team-workflows",title:"Team workflows | Molar",description:"Give engineers, QA, and coding agents one place to run journeys and inspect what happened.",headline:"Test the work that takes two people.",intro:"An admin sends an invitation. A teammate accepts it. Test both sides, including the email, membership state, and permissions the new member receives.",kind:"solution",visual:"collaboration",highlights:[{title:"Shared run context",body:"Keep the goal, environment, result, and evidence together."},{title:"Useful handoffs",body:"Share a trace with a teammate or coding agent instead of screenshots without context."},{title:"Repeatable checks",body:"Turn a useful investigation into a scenario your team can run again."}],sections:[{title:"Follow the invitation into the app",body:"Use independent test identities for the sender and recipient. Check that the right link arrives, the invitation can be accepted, and the app records the new membership.",bullets:["Workspace permissions","Structured results","Trace links"],visual:"collaboration"},{title:"Check what each role can do",body:"Joining the workspace is only the start. Check the pages and actions available to owners, members, and invited users, including access they should not have.",bullets:["PR and CI workflows","Agent output","Completed, failed, and blocked states"],visual:"guard"}],faqs:[{q:"Is Molar only for QA specialists?",a:"Developers, QA, platform teams, and coding agents can use the same workflow."},{q:"Can we control who sees a run?",a:"Access follows your workspace permissions and authenticated project access."},{q:"Can a teammate rerun my flow?",a:"Supported workflows can be rerun with the target, credentials, and scenario settings your team provides."}],cta:"Bring your team into the loop"},
  {path:"/solutions/preview-deployments",title:"Preview deployment testing | Molar",description:"Run critical browser journeys against preview deployments before changes reach production.",headline:"Know what a change did before it ships.",intro:"Connect a preview URL to important journeys. Molar checks the changed application in a browser and leaves evidence your team can review before merge.",kind:"solution",visual:"preview",highlights:[{title:"Check the change",body:"Run selected journeys against the environment created for a pull request."},{title:"See the failure",body:"Open trace, screenshots, and status that explain where the preview diverged."},{title:"Review with context",body:"Use the checks you set up as part of review when repository support is ready."}],sections:[{title:"A preview test in practice",body:"A pull request changes checkout. The run opens the preview, buys a test plan, verifies the callback, and reports the order state.",bullets:["Preview URL","Critical path scenarios","Result attached to review"],visual:"preview"},{title:"Start with a small suite",body:"Choose the journeys where a regression matters most, then expand coverage as the team learns.",bullets:["Signup and login","Checkout and payment","Invites and webhooks"],visual:"guard"}],faqs:[{q:"Does Molar test every pull request automatically?",a:"Guard runs checks you set up when the repository connection and policy are ready."},{q:"Can previews use Clones?",a:"Supported workflows can pair a preview with available service clones."},{q:"What happens when a check fails?",a:"The run records a failed or blocked outcome with the evidence that is available."}],cta:"Test a preview deployment"},
  {path:"/solutions/workflow-automation",title:"Workflow automation | Molar",description:"Automate browser tasks such as forms, downloads, extraction, and verification with clear access.",headline:"Give the browser a clear job.",intro:"Describe a task, set the target and credentials, and let Molar carry out the browser steps. Use the result in a script, dashboard, or agent workflow.",kind:"solution",visual:"automation",highlights:[{title:"Task to result",body:"Start with a goal such as finding an invoice or completing an approved form."},{title:"Browser aware",body:"Work through the interface and state your users see."},{title:"Built for handoff",body:"Return status and evidence to the next tool."}],sections:[{title:"Useful jobs",body:"Run a task against an app you can access: download a report, update a project field, or verify a page state.",bullets:["Forms","File downloads","Page checks"],visual:"automation"},{title:"Keep automation accountable",body:"Define the target, credentials, and expected result before execution. Completed, failed, and blocked outcomes stay distinct.",bullets:["CLI and MCP","Clear access","Inspectable evidence"],visual:"trace"}],faqs:[{q:"Is this only for testing?",a:"No. Molar supports authorized browser tasks as well as QA journeys."},{q:"Can an agent start a task?",a:"The CLI and MCP provide agent accessible entry points with structured results."},{q:"Can automation make irreversible changes?",a:"Sensitive actions depend on the workflow and authorization controls you set."}],cta:"Automate a browser task"},
  {path:"/solutions/web-data-extraction",title:"Web data extraction | Molar",description:"Read structured information from authorized web applications through a real browser.",headline:"Turn a page into useful data.",intro:"Point Molar at an app you can access and describe the fields you need. It reaches the right page state, reads visible information, and returns structured data with evidence.",kind:"solution",visual:"data",highlights:[{title:"Describe the fields",body:"Ask for plan names, invoice details, table rows, or another clear schema."},{title:"Navigate first",body:"Reach the page state containing the data instead of scraping a guessed URL."},{title:"Keep a record",body:"Use the result and captured evidence for review."}],sections:[{title:"From page to JSON",body:"Ask “read the current plan names and prices.” The browser reaches the page, extracts the fields, and returns observed values.",bullets:["Visible page data","Schema oriented requests","Structured output"],visual:"data"},{title:"Respect the source",body:"Use extraction on applications and pages you are authorized to access. Request only the fields you need.",bullets:["Credentials you control","Relevant pages","Evidence for review"],visual:"guard"}],faqs:[{q:"Can Molar extract from any website?",a:"Use Molar with targets you own or are authorized to access."},{q:"Does extraction use an API?",a:"The workflow uses a real browser and returns structured results through supported interfaces."},{q:"Can I schedule extraction?",a:"Scheduling depends on the current workflow and availability."}],cta:"Extract from an authorized app"},
  {path:"/platform/browser-agents",title:"Browser agents | Molar",description:"Give people and coding agents a browser that can navigate, act, and verify clear goals.",headline:"Give a browser a job to finish.",intro:"Molar turns a clear goal into browser actions and an inspectable result for QA, workflow automation, extraction, or verification.",kind:"product",visual:"automation",highlights:[{title:"Goal in, result out",body:"Describe the task, choose the target, and receive status plus available evidence."},{title:"State matters",body:"The agent uses what the page shows after each action to choose the next step."},{title:"Choose your interface",body:"Start from the dashboard, CLI, or MCP for the workflow you are building."}],sections:[{title:"A practical browser loop",body:"Choose a URL, give a clear goal such as “find the latest invoice,” and provide credentials for the app. Molar navigates, acts, and returns the result.",bullets:["Authorized execution","Task status","Structured evidence"],visual:"automation"},{title:"QA and automation share foundations",body:"The same browser layer can verify a login, complete an approved task, extract fields, or provide evidence to a coding agent.",bullets:["Verification and extraction","CLI and MCP","Screenshots where captured"],visual:"trace"}],faqs:[{q:"What can a browser agent do?",a:"Supported workflows include navigation, forms, extraction, downloads, and page verification."},{q:"Can I watch a run?",a:"Live view information is available for supported runs; broader interactive access remains in beta."},{q:"Does the agent have unrestricted access?",a:"You choose the targets, credentials, and workflow policies that define access and actions."}],cta:"Give a browser a job"},
  {path:"/platform/live-view",title:"Live view | Molar",description:"Follow supported browser runs with live status and inspectable evidence.",headline:"See the browser while it works.",intro:"When a run includes live view, follow its current browser state and use the evidence to understand progress, failure, or completion.",kind:"product",visual:"live",highlights:[{title:"Current state",body:"See where a run is working and whether it completed, failed, or needs attention."},{title:"Useful handoff",body:"Give a teammate or agent shared run context when the workflow allows it."},{title:"Evidence after",body:"Use screenshots, traces, and captured evidence to investigate after the live moment."}],sections:[{title:"Watch a browser run",body:"Start a browser task or verification, open the live view link supplied by a supported run, and follow the journey through the application.",bullets:["Run status","Live view for supported runs","Trace context"],visual:"live"},{title:"Designed for safe observation",body:"Live access follows the run target and authorization. Interactive takeover, video, and broad streaming depend on the workflow and beta coverage.",bullets:["Authorized access","Read only observation","Clear outcomes"],visual:"guard"}],faqs:[{q:"Is live view available for every run?",a:"Live view is available for supported workflows and environments."},{q:"Can I take control?",a:"Interactive takeover remains limited beta functionality."},{q:"Does live view replace Trace?",a:"Live view shows progress; Trace and evidence provide the later investigation record."}],cta:"Explore live browser runs"},
  {path:"/platform/swarm",title:"Swarm | Molar",description:"Preview coordinated browser testing across roles and scenarios with planned coverage and observed results.",headline:"See coverage across every role.",intro:"Swarm is a preview workflow for planning browser checks across personas, permissions, and scenarios. Compare the journeys you intended to check with the results runs actually returned.",kind:"product",visual:"swarm",preview:true,highlights:[{title:"Plan by persona",body:"Describe roles and journeys from guest signup to administrator workflow."},{title:"Compare coverage",body:"See planned scenarios beside results returned by runs."},{title:"Preview access",body:"Swarm is under active development. Contact us to confirm availability and supported workflows."}],sections:[{title:"A role based test plan",body:"Give Swarm personas and goals such as member checkout, invited teammate access, and admin billing review. The planner organizes the requested coverage.",bullets:["Persona paths","Scenario planning","Observed links"],visual:"swarm"},{title:"Start with known journeys",body:"Use the plan to find missing role coverage and choose the next runs. Availability and depth depend on the preview.",bullets:["Planned versus observed","Run groups","Trace context"],visual:"trace"}],faqs:[{q:"Is Swarm generally available?",a:"Swarm is in preview. Talk to us to confirm access and supported workflows."},{q:"Does Swarm promise a fixed agent capacity?",a:"Molar makes no blanket capacity claim. Current beta operation and broader scale are still under development."},{q:"Does a plan prove every scenario passed?",a:"No. A plan represents intended coverage; observed results come from runs that execute and return evidence."}],cta:"Discuss Swarm preview"},
  {path:"/platform/developer-tools",title:"Developer tools | Molar",description:"Connect browser verification and automation to CLI, MCP, JSON output, and Playwright workflows.",headline:"Put verification where code gets written.",intro:"Use the interface that fits: a CLI command in a terminal, MCP from a coding agent, or Playwright oriented work with structured evidence beside it.",kind:"product",visual:"collaboration",highlights:[{title:"CLI commands",body:"Run a clear goal with a URL and request JSON output for scripts and agents."},{title:"MCP tools",body:"Connect an MCP compatible client to browser, run, and trace workflows for targets you can access."},{title:"Playwright friendly",body:"Keep editable browser tests and bring supported generated flows into engineering work."}],sections:[{title:"A small verification loop",body:"After changing a login form, run `molar verify \"login works\" --url http://localhost:3000 --json`. Read the result, inspect evidence, and rerun after a fix.",bullets:["Local and hosted targets","JSON results","Trace references"],visual:"collaboration"},{title:"Build interfaces into tools",body:"Use CLI and MCP where a coding agent or CI job needs to start work and inspect the outcome. Availability varies by workflow and beta status.",bullets:["MCP clients","Credentials you control","Quickstart documentation"],visual:"automation"}],faqs:[{q:"Which command should I start with?",a:"Use `molar verify` for a browser claim and `molar run` for a scenario or task. Add `--json` for agent output."},{q:"Where is the hosted MCP endpoint?",a:"The hosted endpoint is documented at https://docs.molar.it and requires configured credentials."},{q:"Can I keep Playwright?",a:"Yes. Molar can complement Playwright workflows; export support varies by setup."}],cta:"Connect your developer workflow"}
];
pages.push(...extraPages.map(page));
