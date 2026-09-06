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
    description: "Explore your app with a browser agent. Describe a task, follow the steps, and inspect the captured page and test result.",
    headline: "Explore your app with a browser agent.",
    intro: "Give Cartographer an authorized app URL and a user goal. It follows the relevant routes in a real browser, records the actions and result, and helps you turn signup, checkout, callbacks, or onboarding into a check your team can rerun.",
    kind: "product", visual: "explore",
    highlights: [
      { title: "Start with a goal", body: "Describe what a user should accomplish, such as reaching a dashboard after email verification, then review the browser steps and result." },
      { title: "See the failing step", body: "Keep the completed, failed, or cancelled result with screenshots and Trace references so an engineer can inspect the action that broke." },
      { title: "Run it where you work", body: "Start from the dashboard, CLI, or hosted MCP endpoint with the authorized target and credentials you choose." },
    ],
    sections: [
  {
    "title": "Follow signup into the workspace",
    "body": "Give Cartographer the app URL and a goal: “sign up, enter the email code, and open the workspace.” With the test account and email connection set up, the agent follows the forms and redirects, then checks the page it reaches.",
    "bullets": [
      "Describe the task in plain English",
      "Use a local or hosted browser",
      "Review each recorded step"
    ]
  },
  {
    "title": "Check a change from your terminal",
    "body": "After changing the login page, describe what should appear and supply your local URL. Read the JSON result, inspect a failed check, and run it again after fixing the app.",
    "code": "molar verify \"the login form is visible\" --url http://localhost:3000 --json",
    "codeLabel": "After installing and configuring Molar"
  },
  {
    "title": "Name what success looks like",
    "body": "“Test checkout” leaves room for interpretation. “Buy the Pro plan and check that the account shows Pro access” names the result. Include the receipt, role, or account state that a customer actually needs.",
    "bullets": [
      "Receipt number is visible",
      "Verification code opens the correct account",
      "Purchased features become available"
    ]
  },
  {
    "title": "Investigate the step that stopped",
    "body": "Use the recorded browser actions and screenshots to find the last successful step. When a run includes a live view, you can also watch progress while the browser works. Keep the run reference with your bug report.",
    "link": {
      "href": "/examples/autonomous-browser-check",
      "label": "Watch a recorded browser check"
    }
  },
  {
    "title": "Use the right account for the test",
    "body": "Supply a saved test profile or credential reference for the application. A member’s account can reveal permission problems that an administrator would miss. Saved sign-in state remains tied to the site it belongs to.",
    "bullets": [
      "Separate test accounts from customer accounts",
      "Choose the role your test needs",
      "Stop a run when you need to change the setup"
    ]
  }
],
    faqs: [
      { q: "What should I give Cartographer first?", a: "Give it an authorized URL and one concrete goal, such as reaching a dashboard after email verification or showing an order receipt after checkout." },
      { q: "Can I run against localhost?", a: "Yes. Local browser verification is a supported path; hosted runs use the target and credentials you configure." },
      { q: "What does a run return?", a: "A run reports whether it completed, failed, or was cancelled and can include task and Trace identifiers, screenshots, a live view link for supported workflows, and other captured artifacts." },
      { q: "Can Cartographer use a logged-in test account?", a: "Use an authorized saved profile or credential reference for the application. Saved sign-in state stays tied to the website it belongs to." },
      { q: "Can I stop a browser run?", a: "Yes. Hosted runs expose cancellation, and the final status records whether the run completed, failed, or was cancelled." },
      { q: "Is generated Playwright code ready for CI?", a: "Generated Playwright export and clean replay are being tested in beta. Contact us before planning to publish generated tests to your repository or connect that flow to Guard." },
    ],
    cta: "Try a browser check",
    startHref: "/verify",
    startLabel: "Run a browser check",
    ctaDescription: "Try a read-only check on a public page. Describe what should appear, then review the result and screenshot."
  }),
  page({
    path: "/products/clones",
    title: "Clones | Molar",
    description: "Test Stripe, Twilio, email, authentication, and storage with stateful service clones, virtual time, and resettable test data.",
    headline: "Test the services behind your app.",
    intro: "Test payments, messages, sign-in, and file uploads without calling the real service. Clones give your app a predictable partner for each step, so checkout and onboarding can run safely in local development and CI.",
    kind: "product", visual: "clones",
    highlights: [
      { title: "Five core services", body: "Run Stripe, Twilio, Email, Auth, and S3 clones alongside your app to exercise payment, messaging, identity, and storage paths." },
      { title: "Advance the clock", body: "Test expiry, retries, renewals, and delayed delivery with a virtual clock instead of waiting for real time." },
      { title: "Assert the callback", body: "Exercise webhook delivery, retries, and supported signature behavior, then check the application state that follows." },
    ],
    sections: [
  {
    "title": "Test what happens after the payment",
    "body": "Create a customer and payment, inspect the callback, and check whether your app unlocks the paid plan. Advance the subscription clock to test the next billing event using the same controlled service.",
    "bullets": [
      "Payment and subscription records",
      "Callbacks and supported signatures",
      "Virtual time for renewals and expiry"
    ]
  },
  {
    "title": "Choose the services your app uses",
    "body": "The core catalog covers Stripe, Twilio, Email, Auth, and S3. Each clone implements a documented set of API operations and state changes. Start with the service behind the feature you are testing.",
    "link": {
      "href": "/docs/clones",
      "label": "Browse the service catalog"
    }
  },
  {
    "title": "Connect your app to the test service",
    "body": "Start the required clone and configure your development or CI environment to use its endpoint. Keep production credentials out of that environment. Your app sends its usual requests to the clone; your test can inspect the records it creates.",
    "bullets": [
      "Choose the APIs your app calls",
      "Configure the test endpoint and credentials",
      "Check the resulting payment, message, or file record"
    ]
  },
  {
    "title": "Reproduce a decline, delay, or expiry",
    "body": "Set up the supported failure state before the browser test. A declined payment should show a retry; an expired verification code should leave the account signed out. A virtual clock lets you exercise time-based behavior without waiting.",
    "bullets": [
      "Payment declines and retries",
      "Subscription renewals",
      "Message delivery and code expiry"
    ]
  },
  {
    "title": "Reset the data before the next test",
    "body": "Save a JSON snapshot of the services before a test, then restore it for the next attempt. Deterministic IDs help you recognize the same records across runs. A previous successful purchase should not make a broken checkout pass.",
    "bullets": [
      "Snapshot and restore",
      "Separate state for each run",
      "Repeatable local and CI tests"
    ]
  }
],
    faqs: [
      { q: "What are the five core Clones?", a: "The catalog includes Stripe, Twilio, Email, Auth, and S3 service clones for payment, messaging, email, identity, and object-storage paths." },
      { q: "Can Clones charge a real card or send a real message?", a: "No. Clone traffic stays in isolated test services, and the TypeScript SDK blocks known destructive calls to live vendors." },
      { q: "Which Stripe behavior is covered?", a: "The current Stripe clone covers payment methods, declines, 3DS-required states, PaymentIntents, subscriptions, invoices, checkout sessions, disputes, refunds, and related webhooks." },
      { q: "Can I test time-based behavior?", a: "Yes. The virtual clock supports flows such as trial expiry, delayed delivery, renewals, and expired verification codes where the relevant clone implements that behavior." },
      { q: "How do snapshots help a test?", a: "Take a JSON snapshot before the journey, mutate the service state during the run, then restore it before another attempt so IDs and starting conditions are deterministic." },
      { q: "How much vendor coverage do I get?", a: "Each clone covers specific APIs and state transitions. Check the catalog or contact us before relying on a provider behavior outside the documented paths." },
    ],
    cta: "Choose your test services",
    startHref: "/docs/clones",
    startLabel: "Open Clones docs",
    ctaDescription: "Browse the supported APIs, then configure the clones your checkout, sign-in, or upload tests need."
  }),
  page({
    path: "/products/guard",
    title: "Guard | Molar",
    description: "Run browser checks in CI and after release. Review failed steps and configure the checks required before merging.",
    headline: "Catch broken flows before release.",
    intro: "Run your configured signup, checkout, and account-access tests before a release or on a schedule. When a check fails, inspect the assertion and captured browser steps to decide what needs fixing.",
    kind: "product", visual: "guard",
    highlights: [
  {
    "title": "Check a pull request",
    "body": "Run a configured scenario with `molar run checkout --ci --json` and include its result in your release pipeline."
  },
  {
    "title": "Find the failed check",
    "body": "Open the scenario, test environment, and captured browser steps to see what stopped working."
  },
  {
    "title": "Check after deployment",
    "body": "Schedule a configured test for login, checkout, or another task your users rely on."
  }
],
    sections: [
  {
    "title": "Check the browser and the service together",
    "body": "A checkout test should confirm more than a successful button click. Configure a scenario that checks the payment callback and resulting order. Use service Clones in the test environment to keep payment and messaging traffic isolated.",
    "bullets": [
      "Configured browser scenarios",
      "GitHub pull request checks",
      "Screenshots and failure details"
    ]
  },
  {
    "title": "Run a configured scenario in CI",
    "body": "After configuring a checkout scenario and its test environment, run it in CI. The result identifies whether the test completed, failed, or was blocked by missing access or setup.",
    "code": "molar run checkout --ci --json",
    "codeLabel": "Run an existing checkout scenario"
  },
  {
    "title": "Give reviewers the failed step",
    "body": "Keep the scenario and environment with the result so the reviewer knows which version was tested. Open the captured screenshot or Trace record to inspect the failed assertion before rerunning.",
    "link": {
      "href": "/products/trace",
      "label": "See how to investigate a failure"
    }
  },
  {
    "title": "Choose what blocks a merge",
    "body": "Configure the repository connection and required-check policy with your team. Start with tests that protect signup, payment, or account access, and agree how a failed or blocked check should be handled.",
    "bullets": [
      "Choose the required scenarios",
      "Use the correct preview or staging URL",
      "Review failures before merging"
    ]
  },
  {
    "title": "Keep checking after release",
    "body": "A working preview cannot tell you whether login will break tomorrow. Scheduled checks revisit an authorized live URL. During beta, confirm scheduling support and the accounts and services needed for your environment.",
    "bullets": [
      "Login and protected pages",
      "Payment callbacks and receipts",
      "Invitations and verification email"
    ]
  }
],
    faqs: [
      { q: "What does Guard run?", a: "Guard runs configured scenarios in CI or on a schedule, including browser journeys that use supported Clones for payment, identity, email, SMS, or storage behavior." },
      { q: "Does Guard block every merge automatically?", a: "It can be wired as a required check once your repository connection and scenario policy are set up; it does not create a policy for every repository by default." },
      { q: "Can Guard monitor production?", a: "Guard supports scheduled checks for authorized live URLs. Availability depends on the environment and current beta workflow." },
      { q: "What does a failed check show?", a: "The result keeps the scenario and run identity with the failing assertion and available Trace, screenshot, and artifact references for investigation." },
      { q: "Does Guard replace my Playwright tests?", a: "No. Guard can run supported Playwright-based checks alongside your existing suite. Cartographer-generated export and clean replay are being tested in beta." },
      { q: "Can Guard repair a failure?", a: "Mender is a separate preview workflow that prepares a proposed repair for review. It does not apply an unapproved change automatically." },
    ],
    cta: "Set up a Guard check",
    startHref: "/contact",
    startLabel: "Discuss a Guard rollout",
    ctaDescription: "Bring the test you want to run before merge or after deployment. We’ll confirm repository setup and beta availability."
  }),
  page({
    path: "/products/trace",
    title: "Trace | Molar",
    description: "Inspect browser test steps, screenshots, recordings, and captured requests to understand where a test failed.",
    headline: "See where your browser test failed.",
    intro: "Trace brings the browser steps, screenshots, and captured requests from a run into one record. Find the last successful action, inspect what happened next, and give your team a useful starting point for the fix.",
    kind: "product", visual: "trace",
    highlights: [
  {
    "title": "See the steps in order",
    "body": "Follow the recorded browser actions and open the captured page at the step you need."
  },
  {
    "title": "Keep run data private",
    "body": "Authenticated access and expiring references control who can open captured screenshots and other files."
  },
  {
    "title": "Let your coding agent investigate",
    "body": "Use MCP tools to retrieve the relevant part of a trace and compare the information captured in supported runs."
  }
],
    sections: [
  {
    "title": "Start with the action that failed",
    "body": "Did the browser submit the form? Did the next page load? Was the receipt visible? Read the recorded steps in order, then inspect the screenshot closest to the failed check.",
    "bullets": [
      "Browser actions and timestamps",
      "Captured screenshots",
      "The check and its result"
    ]
  },
  {
    "title": "Understand why the run stopped",
    "body": "A failed assertion and a missing login need different responses. Check the run status first: investigate the app when the expected state was not reached, or fix the setup when access or a required input blocked the task.",
    "bullets": [
      "Completed, failed, and blocked states",
      "The last recorded browser step",
      "Available network and console context"
    ]
  },
  {
    "title": "Follow the failed request",
    "body": "For runs that capture network or console details, compare them with the browser action. A successful payment followed by a failed callback points to a different problem than a card decline. Use the captured response to narrow the investigation.",
    "bullets": [
      "Inspect captured request and response details",
      "Read related console errors",
      "Check service records when available"
    ]
  },
  {
    "title": "Send an agent the relevant steps",
    "body": "An authorized MCP client can list traces and request the part of a run it needs. Give your coding agent the failed check and nearby browser actions so it can investigate without reading the entire recording.",
    "link": {
      "href": "/platform/developer-tools",
      "label": "Connect a coding agent"
    }
  },
  {
    "title": "Review a recording before rerunning",
    "body": "Open the screenshots or video captured by the workflow to see what the browser did. A recording shows the original run; rerunning executes the task again. The files and replay options available depend on the workflow.",
    "link": {
      "href": "/examples/autonomous-browser-check",
      "label": "Inspect a recorded test and its result"
    }
  }
],
    faqs: [
  {
    "q": "What does Trace capture?",
    "a": "Depending on the workflow, a run can include browser actions, screenshots, video, trace events, and network or console details. Only data captured by that run is available for inspection."
  },
  {
    "q": "Can I watch a real example?",
    "a": "Yes. The recorded browser-check example shows an agent adding an element, checking that it appeared, removing it, and checking that it is gone. The page includes the recording and result file."
  },
  {
    "q": "Can my coding agent read a trace?",
    "a": "Yes. Authorized MCP clients can list traces and retrieve the relevant steps and captured details."
  },
  {
    "q": "Who can see captured data?",
    "a": "Trace uses authenticated access and signed or expiring references. Browser pages, requests, and logs can contain sensitive data, so use test accounts and review what you share."
  },
  {
    "q": "Can I compare two runs?",
    "a": "Supported Trace tools and views can compare the information captured in two runs. A comparison needs the relevant files or events from both runs."
  },
  {
    "q": "Does a recording rerun the test?",
    "a": "No. Playback shows the original browser actions. Rerunning starts another execution; replay options depend on the workflow. Generated Playwright export and clean replay are still being tested in beta."
  }
],
    cta: "Inspect a recorded browser test",
    startHref: "/examples/autonomous-browser-check",
    startLabel: "Watch a recorded test",
    ctaDescription: "Watch the four browser steps and open the result file to see what Molar checked."
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
      { title: "Use the failed test to prepare a fix", body: "Mender starts from a failing Guard run and the associated Trace, then helps an engineer assemble a candidate patch with the relevant repository context visible for review.", bullets: ["Trace and Guard context", "Failure evidence and proposed changes", "Approval before repository changes"] },
      { title: "Review the proposed change", body: "Inspect the suggested edit, the failure it addresses, and the checks available around it before deciding whether to open or continue a draft change.", bullets: ["Candidate patch", "Source and run references", "Human review"] },
      { title: "Preview access", body: "Mender is a preview capability under active development. Repair coverage, repository support, and availability vary by workflow.", bullets: ["Preview workflow", "No automatic merge", "Team approval required"] },
    ],
    faqs: [
      { q: "How does Mender handle a failing test?", a: "Mender proposes and records a repair workflow; changes and publication wait for your approval." },
      { q: "What does Mender need?", a: "It needs an authorized run and the relevant repository or source context from a connected integration." },
      { q: "Is Mender generally available?", a: "It is a preview capability under active development, so availability and repair coverage vary." },
    ],
    cta: "Discuss the repair preview",
    startHref: "/contact",
    startLabel: "Discuss preview access",
    ctaDescription: "Bring a reproducible failing run to discuss the Mender repair preview and its review process."
  }),
  page({
    path: "/solutions/integration-testing",
    title: "Integration testing for real product journeys | Molar",
    description: "Exercise payment, identity, messaging, and webhook behavior without coupling CI to live vendor side effects.",
    headline: "Test the services your app depends on.",
    intro: "A customer signs up, receives a code, pays, and opens their account. Molar connects browser checks with controlled payment, email, authentication, and storage services to test those steps together.",
    kind: "solution", visual: "clones",
    highlights: [
      { title: "Test successful and declined payments", body: "Exercise payment states, 3DS branches, subscription timing, refunds, disputes, and signed callbacks with isolated test data." },
      { title: "Read the verification email", body: "Create a test identity, read the delivered OTP or magic link, and continue the user journey without a personal inbox." },
      { title: "Test delayed and repeated callbacks", body: "Advance clocks, trigger events, and inspect retries instead of waiting on vendor timing or burning sandbox quota." },
    ],
    sections: [
      { title: "Run the services together", body: "Run your app against the Stripe, Twilio, Email, Auth, and S3 clones together. Snapshots and virtual time make the setup repeatable across local and CI workflows.", bullets: ["Five core service clones", "Supported service APIs", "Deterministic snapshots and callbacks"] },
      { title: "Make callbacks part of the assertion", body: "After checkout or signup, assert the webhook, email, OTP, or storage change that moves the product forward. The browser result alone cannot tell you whether the integration completed.", bullets: ["Payment and receipt state", "OTP and magic-link delivery", "Webhook retries and signatures"] },
      { title: "Keep a small vendor-sandbox check", body: "Use Clones for supported integration paths. If a vendor-specific behavior is outside the catalog, run a separate authorized contract check and label that dependency clearly.", bullets: ["Clone-backed CI", "Explicit live contract checks", "No hidden vendor side effects"] },
    ],
    faqs: [
      { q: "Is this just HTTP mocking?", a: "The core value is stateful service behavior: records, clocks, retries, signed webhooks, and cross step consequences. Contact us to confirm the paths your application needs." },
      { q: "Which services are included in the core catalog?", a: "Stripe, Twilio, Email, Auth, and S3 are the five core clone services." },
      { q: "How are live side effects protected?", a: "Clone workflows use isolated test services, keeping test payments, messages, and callbacks away from live vendor traffic." },
    ],
    cta: "Test your app’s integrations",
    startHref: "/products/clones",
    startLabel: "Explore Clones"
  }),
  page({
    path: "/solutions/ai-agents",
    title: "QA for AI agents | Molar",
    description: "Give coding agents a browser verification loop with MCP tools and structured evidence.",
    headline: "Let the agent verify the app it just changed.",
    intro: "AI coding agents can write a checkout flow quickly. They also need to use the app and confirm that customers can sign in, pay, and get access. Molar gives agents CLI and MCP tools to run browser tasks, inspect what happened, and try again.",
    kind: "solution", visual: "agent",
    highlights: [
      { title: "One command after code", body: "Run `molar verify \"login works\" --url http://localhost:3000 --json` and return a structured pass or failure for the next agent turn." },
      { title: "MCP access", body: "Connect an agent to `https://api.molar.it/mcp` or run the local stdio server through `molar mcp serve`." },
      { title: "You stay in control", body: "External targets require authorization, and financial or irreversible browser actions pause for confirmation." },
    ],
    sections: [
      { title: "Useful output for the next turn", body: "Task status, trace references, a live view link for supported runs, and captured evidence give an agent concrete context to diagnose and rerun. `--json` keeps the result machine-readable.", bullets: ["JSON output", "Task polling", "Browser and identity tools"] },
      { title: "A verification loop with control", body: "After changing a login form, run the local check, read the pass or failure, inspect the cited evidence, and rerun after the fix. Hosted runs use the target and credentials you choose.", code: "molar verify \"login works\" --url http://localhost:3000 --json", codeLabel: "Run after a code change" },
      { title: "Give the agent a concrete assertion", body: "Ask for a result it can observe: \"show the invoice number\", \"reach the signed-in dashboard\", or \"confirm the order says paid.\" Molar returns the run identity and available evidence for the next turn.", bullets: ["Visible business outcomes", "Trace references", "Structured failure hints"] },
    ],
    faqs: [
      { q: "Can an agent click a payment button automatically?", a: "It can act on an authorized target, but financial or irreversible steps require a confirmation flow." },
      { q: "Can an agent use a real user's login?", a: "Use a saved test account or credential reference for the site. Supported email and SMS connections provide verification codes without using a customer’s personal inbox." },
      { q: "What happens when verification fails?", a: "The CLI can emit a structured failure with a hint and evidence references so the coding agent can inspect the cause and rerun." },
    ],
    cta: "Give your agent a verifier",
    startHref: "/platform/developer-tools",
    startLabel: "Explore developer tools"
  }),
  page({
    path: "/solutions/startups",
    title: "QA for startups shipping quickly | Molar",
    description: "Keep connected user journeys testable while a small team ships at speed.",
    headline: "Keep signup and checkout working as you ship.",
    intro: "A small team builds the product and checks each release. Start with the tasks you cannot afford to break: a new user signs up, a customer pays, and the app gives them access.",
    kind: "solution", visual: "guard",
    highlights: [
      { title: "Describe the test", body: "Describe the flow in plain language, run it in a browser, and keep the scenario and evidence near the code." },
      { title: "Skip fragile sandboxes", body: "Use stateful clones for integration paths where vendor limits and live side effects make repeated CI uncomfortable." },
      { title: "Grow into release checks", body: "The same scenario can become a CI check and, for supported environments, a scheduled check for an authorized live URL." },
    ],
    sections: [
      { title: "Start with signup and checkout", body: "Pick one revenue path and one activation path. A payment confirmation and an email-verified signup check whether a user can join and become a paying customer.", bullets: ["Signup and OTP", "Checkout and receipt", "Webhook-driven state changes"] },
      { title: "Choose the smallest useful run", body: "Start with one authorized URL, one test identity, and one expected result. Run locally or against a configured hosted target, then keep the evidence with the scenario.", bullets: ["Authorized URL", "Test identity", "Expected result"] },
      { title: "Add declines, expired codes, and missing receipts", body: "Once the first test passes, add the failure branch that matters next: a declined payment, expired OTP, delayed callback, or missing receipt.", bullets: ["One happy path", "One failure branch", "Evidence for each run"] },
    ],
    faqs: [
      { q: "Who uses Molar?", a: "Engineering, product, and platform teams can start a scenario together, agree on the expected outcome, and review the result." },
      { q: "Can a startup run Molar locally?", a: "Yes. The CLI and clone repositories include local paths; hosted execution requires credentials." },
      { q: "How does startup access work?", a: "Molar is rolling out in private beta. Contact us to discuss access and a plan for the signup, payment, or other tasks your team needs to test." },
    ],
    cta: "Start with one browser check",
    startHref: "/verify",
    startLabel: "Run your first check"
  }),
  page({
    path: "/solutions/web-app-testing",
    title: "Web app testing | Molar",
    description: "Explore and verify the browser journeys that connect your UI to real application behavior.",
    headline: "Test the path your users actually take.",
    intro: "A web app can look healthy while a callback, redirect, verification code, or receipt path is broken. Molar follows the browser steps and checks what happens between the page and its connected services.",
    kind: "solution", visual: "explore",
    highlights: [
      { title: "Start with a URL", body: "Use a live or local URL you can access and a concrete claim such as a visible receipt or completed onboarding step." },
      { title: "See before acting", body: "Read the page state before asking the agent to change it." },
      { title: "Keep the result", body: "A run can retain screenshots, trace identifiers, and captured evidence for review and diagnosis." },
    ],
    sections: [
      { title: "Test signup, checkout, and the services behind them.", body: "Focus on a browser journey where your UI, backend, and third party must agree: accept an OTP, complete payment, receive the callback, and show the resulting receipt. A screenshot of one page cannot establish that chain.", bullets: ["Browser assertions", "Auth and verification loops", "Payment and webhook transitions"] },
      { title: "Choose local or hosted execution", body: "Use the unified CLI for local browser verification or a configured hosted run. Start with an authorized URL and keep the environment explicit so another engineer can reproduce the check.", bullets: ["Localhost development", "Authorized hosted targets", "Explicit credentials"] },
      { title: "Keep a result someone can inspect", body: "A run can retain status, screenshots, trace identifiers, and captured artifacts. Use those records to answer which step changed and what the app showed at that moment.", bullets: ["Run status", "Screenshots and Trace", "Captured artifacts"] },
    ],
    faqs: [
      { q: "Can I assert a business outcome?", a: "Yes. The verify command accepts a natural language assertion, such as an order confirmation number being shown, against a URL or prior task." },
      { q: "Does Molar replace Playwright?", a: "Keep using your Playwright tests. Molar can run browser checks alongside them; generated test export and clean replay are still being validated in beta." },
      { q: "Can I test a logged in path?", a: "Use a saved profile or login credential reference for the app. Login state stays tied to its origin." },
    ],
    cta: "Check your web app",
    startHref: "/verify",
    startLabel: "Try a public page check"
  }),
  page({
    path: "/security",
    title: "Security and control | Molar",
    description: "Understand how Molar scopes browser actions, credentials, artifacts, and agent access.",
    headline: "Control what Molar can access and change.",
    intro: "Choose the application and test account for each run. Workspace permissions, site-specific sign-in, and approval steps help you control browser actions and access to captured data.",
    kind: "resource", visual: "trace",
    highlights: [
      { title: "Choose the target", body: "External targets require authorization before exploration or state changing automation." },
      { title: "Review sensitive actions", body: "Tools identify actions that change data, delete records, or require approval before continuing." },
      { title: "Protect screenshots and recordings", body: "Trace artifacts use authenticated access and signed or expiring references for reads." },
    ],
    sections: [
      { title: "Use the right test account", body: "Save an authorized test identity for the application. Login stays tied to that site, and supported email or SMS checks use identities provisioned for your workspace.", bullets: ["Saved test credentials", "Workspace profiles", "Action records and approvals"] },
      { title: "Choose the website, account, and who can see the run", body: "Molar checks the target and identity supplied for a run, applies approval gates to sensitive actions, and serves captured artifacts through controlled reads. Contact us for current security details." },
    ],
    faqs: [
      { q: "What security documentation is available?", a: "Contact us for current details on access controls, data handling, retention, and deployment options." },
      { q: "Can Molar access a customer's personal inbox?", a: "No. Identity tools use connector provisioned identities for the workspace." },
      { q: "What happens before a destructive action?", a: "High risk actions identify what they will change and may pause for confirmation, depending on the action and runtime policy." },
    ],
    cta: "Discuss security for your setup",
    startHref: "/contact",
    startLabel: "Ask about security"
  }),
  page({
    path: "/company",
    title: "Company | Molar",
    description: "Molar helps teams verify software whose most important behavior crosses several services.",
    headline: "Test the handoffs customers depend on.",
    intro: "Molar is built for teams connecting web apps to payment, identity, and email services. Test that a payment grants access, a code completes sign-in, or an invitation adds the right member.",
    kind: "resource", visual: "agent",
    highlights: [
      { title: "Journey first", body: "We organize QA around what a user is trying to complete and the systems that must cooperate along the way." },
      { title: "Evidence another engineer can use", body: "A run names the goal, records the path, and keeps the assertion with the available result so another person or agent can decide what to inspect next." },
      { title: "Agents with bounded access", body: "Coding agents use configured targets and credentials, approval gates for sensitive actions, and structured results that expose the next step." },
    ],
    sections: [
      { title: "Where we focus", body: "The platform brings Cartographer, Clones, Guard, Trace, and the developing Mender workflow together around software whose journeys cross several services.", bullets: ["Browser journey verification", "Stateful third party test doubles", "Release evidence and diagnosis"] },
      { title: "A connected product needs connected checks", body: "Molar brings browser verification, stateful service clones, release checks, Trace investigation, and agent workflows together for teams shipping web software. Product access is rolling out in beta." },
    ],
    faqs: [
      { q: "Who is Molar for?", a: "Engineering and platform teams building web applications with consequential payment, identity, messaging, storage, or webhook flows." },
      { q: "Where is Molar based?", a: "Molar Labs is based in Bengaluru, India." },
      { q: "How do I get access?", a: "Create an account at the Molar dashboard or contact us to discuss private beta access for your team." },
    ],
    cta: "Meet the platform",
    startHref: "/products/cartographer",
    startLabel: "Explore the platform"
  }),
  page({
    path: "/resources",
    title: "Resources | Molar",
    description: "Practical guides for testing web applications with several connected services and agent built software.",
    headline: "Set up, test, and debug with Molar.",
    intro: "Find instructions for your first browser check, references for test services, and guides to connecting a coding agent. Choose the task you need help with below.",
    kind: "resource", visual: "explore",
    highlights: [
      { title: "Start with the docs", body: "Find installation instructions, configure access, and run your first check from the terminal." },
      { title: "Understand integrations", body: "Clone references explain how payment, email, auth, SMS, and storage behavior can be controlled in tests." },
      { title: "Bring an agent", body: "MCP and JSON output references help coding agents discover tools, wait for results, and inspect evidence." },
    ],
    sections: [
      { title: "Suggested reading path", body: "Install the CLI for a page check. Add the relevant clone when a test needs payment, email, or storage. Then read the Guard guide for CI setup.", bullets: ["Quickstart and CLI", "Clone catalog and examples", "MCP auth and tools"] },
      { title: "Match the guide to the job", body: "Find a payment guide for checkout, an identity guide for sign-in, or the MCP reference for a coding agent. The links below take you to the relevant starting points." },
    ],
    faqs: [
      { q: "Where is the public documentation?", a: "Open Documentation from the Resources menu for setup instructions and the current CLI, API, and MCP reference." },
      { q: "What is the smallest useful example?", a: "Verify one concrete browser claim against localhost, or run one scenario backed by the relevant service clone." },
      { q: "How can I discuss pricing?", a: "Molar is in private beta. Contact us for current commercial details and a plan matched to your workflow." },
    ],
    cta: "Open the documentation",
    startHref: "https://docs.molar.it",
    startLabel: "Read the documentation"
  }),
];

const extraPages = [
  {path:"/solutions/checkout-testing",title:"Checkout testing | Molar",description:"Test checkout, payment callbacks, receipts, and failed payment paths in one browser journey.",headline:"Check every step of checkout.",intro:"Give Molar a checkout goal and the test services it needs. Follow the browser from cart to payment, then check the callback, order state, and receipt your customer sees.",kind:"solution",visual:"checkout",highlights:[{title:"Payment paths",body:"Exercise success, declines, refunds, and other supported payment states with isolated test data."},{title:"Callbacks included",body:"Check that your app receives the payment event and updates the order your customer sees."},{title:"Check the receipt",body:"Check the order number, payment amount, and delivered receipt to see whether they agree."}],sections:[{title:"From checkout to confirmation",body:"Start with “buy the Pro plan and verify the receipt.” Molar runs the browser steps, connects the available clones, and returns the result.",bullets:["Cart and plan selection","Payment and webhook handling","Receipt and order assertions"],visual:"checkout"},{title:"Cover unhappy paths",body:"Check declined payment, delayed callbacks, and stale receipt links with controlled service state instead of live charges.",bullets:["Declines and retries","Subscriptions and invoices","Test inbox verification"],visual:"trace"}],faqs:[{q:"Can this use live payment credentials?",a:"Use isolated clone paths for test traffic. Contact us to confirm supported payment behavior."},{q:"Does Molar test the provider dashboard?",a:"Molar focuses on your authorized application journey and supported clone behavior."},{q:"What does a run return?",a:"A run can include status, screenshots, trace identifiers, and captured evidence."}],cta:"Test a checkout journey",startHref:"/products/clones",startLabel:"Explore payment Clones"},
  {path:"/solutions/authentication-testing",title:"Authentication testing | Molar",description:"Verify signup, OAuth, OTP, sessions, invites, and protected application routes.",headline:"Check sign-in from signup to workspace.",intro:"Test the route from a new account to an authenticated workspace across password, OAuth, email verification, OTP, invites, and sessions.",kind:"solution",visual:"identity",highlights:[{title:"Real browser steps",body:"Follow forms, redirects, codes, and protected pages as a user would."},{title:"Test identities",body:"Create separate identities for each run and role."},{title:"Failure paths",body:"Check expired codes, denied access, sign-out, and invitation edge cases."}],sections:[{title:"Signup, verify, continue",body:"Give Molar “create an account, enter the email code, and open the workspace.” The result shows where the journey stopped.",bullets:["Signup and email verification","OAuth redirects","Invites and workspace roles"],visual:"identity"},{title:"Sessions need checks too",body:"Check refresh, reload, sign-out, and access to a route that should remain protected after the first login.",bullets:["Session persistence","Expired credentials","Protected routes"],visual:"guard"}],faqs:[{q:"Can I test OAuth providers?",a:"OAuth is available in some workflows. Contact us to confirm provider and beta coverage."},{q:"How are OTP messages handled?",a:"Supported email and SMS clones provide controlled messages and codes."},{q:"Can I keep existing auth tests?",a:"Molar can complement Playwright workflows; export support depends on your setup."}],cta:"Verify an auth journey",startHref:"/products/cartographer",startLabel:"Explore Cartographer"},
  {path:"/solutions/team-workflows",title:"Team workflows | Molar",description:"Give engineers, QA, and coding agents one place to run journeys and inspect what happened.",headline:"Test the work that takes two people.",intro:"An admin sends an invitation. A teammate accepts it. Test both sides, including the email, membership state, and permissions the new member receives.",kind:"solution",visual:"collaboration",highlights:[
  {
    "title": "Use two test accounts",
    "body": "Keep the admin and invited member in separate browser sessions, each with its own permissions."
  },
  {
    "title": "Follow the invitation email",
    "body": "Check that the right link reaches the intended test inbox and opens the member’s account."
  },
  {
    "title": "Check the access granted",
    "body": "Confirm the new member can open the project and cannot change settings reserved for an owner."
  }
],sections:[{title:"Follow the invitation into the app",body:"Use independent test identities for the sender and recipient. Check that the right link arrives, the invitation can be accepted, and the app records the new membership.",bullets:["Correct recipient","Invitation link received","Membership recorded"],visual:"collaboration"},{title:"Check what each role can do",body:"Joining the workspace is only the start. Check the pages and actions available to owners, members, and invited users, including access they should not have.",bullets:["Owner billing controls","Member project access","Pending invitation restrictions"],visual:"guard"}],faqs:[{q:"Is Molar only for QA specialists?",a:"Developers, QA, platform teams, and coding agents can use the same workflow."},{q:"Can we control who sees a run?",a:"Access follows your workspace permissions and authenticated project access."},{q:"Can a teammate rerun my flow?",a:"Supported workflows can be rerun with the target, credentials, and scenario settings your team provides."}],cta:"Watch both sides of an invitation",startHref:"/examples/team-invitation",startLabel:"Watch the invitation test"},
  {path:"/solutions/preview-deployments",title:"Preview deployment testing | Molar",description:"Run critical browser journeys against preview deployments before changes reach production.",headline:"Know what a change did before it ships.",intro:"Run configured signup or checkout tests against the preview URL. Inspect the browser steps and failed assertions before merging the change.",kind:"solution",visual:"preview",highlights:[{title:"Check the change",body:"Run selected journeys against the environment created for a pull request."},{title:"Open the changed step",body:"Use the run status, screenshots, and Trace references to see where the preview diverged."},{title:"Attach the run to review",body:"Give reviewers the scenario result and available evidence alongside the code change."}],sections:[{title:"A preview test in practice",body:"A pull request changes checkout. The run opens the preview, selects the plan, verifies the callback, and reports the order state.",bullets:["Preview URL","Critical path scenario","Order and callback result"],visual:"preview"},{title:"Gate the paths that changed",body:"Choose the journeys where a regression matters most, then add signup, checkout, or invitation coverage as the team learns.",bullets:["Signup and login","Checkout and payment","Invites and webhooks"],visual:"guard"}],faqs:[{q:"Does Molar test every pull request automatically?",a:"Guard runs checks you set up when the repository connection and policy are ready."},{q:"Can previews use Clones?",a:"Supported workflows can pair a preview with available service clones."},{q:"What happens when a check fails?",a:"The run records a failed or blocked outcome with the available status, screenshots, and Trace references."}],cta:"Test a preview deployment",startHref:"/products/guard",startLabel:"Explore Guard"},
  {path:"/solutions/workflow-automation",title:"Workflow automation | Molar",description:"Automate browser tasks such as forms, downloads, extraction, and verification with clear access.",headline:"Automate the browser work you repeat.",intro:"Describe a task, set the target and credentials, and let Molar carry out the browser steps. Use the result in a script, dashboard, or agent workflow.",kind:"solution",visual:"automation",highlights:[
  {
    "title": "Describe the job",
    "body": "Ask Molar to find an invoice, download a report, or fill an approved form."
  },
  {
    "title": "Work through the web app",
    "body": "The agent reads the page and follows the controls your team uses."
  },
  {
    "title": "Return the file or data",
    "body": "Use the captured output in your next tool, and check the run status before continuing."
  }
],sections:[{title:"Download reports and fill forms",body:"Run a task against an app you can access: download a report, update a project field, or verify a page state.",bullets:["Fill an approved form","Download a report","Verify a page result"],visual:"automation"},{title:"Control what Molar can access and change.",body:"Choose the target, credentials, and expected result before execution. Molar records whether the run completed, failed, or was blocked so you can inspect the action and its consequence.",bullets:["CLI and MCP entry points","Site-specific test accounts","Recorded steps and screenshots"],visual:"trace"}],faqs:[{q:"Is this only for testing?",a:"No. Molar supports authorized browser tasks as well as QA journeys."},{q:"Can an agent start a task?",a:"The CLI and MCP provide agent-accessible entry points with structured results."},{q:"Can automation make irreversible changes?",a:"Sensitive actions depend on the workflow and authorization controls you set."}],cta:"Automate a browser task",startHref:"/platform/browser-agents",startLabel:"Explore browser agents"},
  {path:"/solutions/web-data-extraction",title:"Web data extraction | Molar",description:"Read structured information from authorized web applications through a real browser.",headline:"Turn a page into useful data.",intro:"Describe the fields you need from a web app you can access. Molar navigates to the relevant page and returns the values in a structured result.",kind:"solution",visual:"data",highlights:[
  {
    "title": "Choose the fields",
    "body": "Request plan names and prices, invoice numbers, or the rows in a table."
  },
  {
    "title": "Reach the right page",
    "body": "The browser navigates to the page containing the records before reading them."
  },
  {
    "title": "Check the source",
    "body": "Review the returned fields alongside the captured page information."
  }
],sections:[{title:"From page to JSON",body:"Ask “read the current plan names and prices.” The browser reaches the page, extracts the fields, and returns observed values.",bullets:["Visible page data","Schema-oriented requests","Structured output"],visual:"data"},{title:"Keep each value tied to its source",body:"Use extraction on applications and pages you are authorized to access. Request only the fields your next tool needs.",bullets:["Credentials you control","Relevant page state","Captured source details"],visual:"guard"}],faqs:[{q:"Can Molar extract from any website?",a:"Use Molar with targets you own or are authorized to access."},{q:"Does extraction use an API?",a:"The workflow uses a real browser and returns structured results through supported interfaces."},{q:"Can I schedule extraction?",a:"Scheduling depends on the current workflow and availability."}],cta:"Extract from an authorized app",startHref:"/platform/browser-agents",startLabel:"Explore browser extraction"},
  {path:"/platform/browser-agents",title:"Browser agents | Molar",description:"Give people and coding agents a browser that can navigate, act, and verify clear goals.",headline:"Give a browser a job to finish.",intro:"Give Molar a website and a task: find an invoice, fill a form, or check that login works. The agent reads the page, chooses an action, and checks what changed before continuing.",kind:"product",visual:"automation",highlights:[{title:"Return a structured result",body:"Describe the task, choose the target, and receive status plus available evidence."},{title:"Read state after each action",body:"The agent uses the page state it observes after each action to choose the next step."},{title:"Choose your interface",body:"Start from the dashboard, CLI, or MCP for the workflow you are building."}],sections:[{title:"Describe the task and supply the website",body:"Choose a URL, give a clear goal such as “find the latest invoice,” and provide credentials for the app. Molar navigates, acts, and returns the result.",bullets:["Authorized execution","Task status","Recorded browser steps"],visual:"automation"},{title:"Use the same browser from your agent",body:"The same browser layer can verify a login, complete an approved task, extract fields, or provide evidence to a coding agent.",bullets:["Verification and extraction","CLI and MCP","Screenshots where captured"],visual:"trace"}],faqs:[{q:"What can a browser agent do?",a:"Supported workflows include navigation, forms, extraction, downloads, and page verification."},{q:"Can I watch a run?",a:"Live view information is available for supported runs; broader interactive access remains in beta."},{q:"Does the agent have unrestricted access?",a:"You choose the targets, credentials, and workflow policies that define access and actions."}],cta:"Give a browser a job",startHref:"/contact",startLabel:"Discuss browser automation"},
  {path:"/platform/live-view",title:"Live view | Molar",description:"Follow supported browser runs with live status and inspectable evidence.",headline:"See the browser while it works.",intro:"Open the live view supplied by a supported run to follow the browser while it works. Afterward, inspect captured screenshots and steps to see where a task finished or stopped.",kind:"product",visual:"live",highlights:[{title:"Read the current state",body:"See whether a run is working, completed, failed, or waiting for attention."},{title:"Share the run",body:"Share the authorized run reference so a teammate or agent can inspect the same browser steps."},{title:"Investigate after completion",body:"Open screenshots, traces, and captured artifacts after the live browser moment."}],sections:[{title:"Watch a browser run",body:"Start a browser task or verification, open the live view link supplied by a supported run, and follow the journey through the application.",bullets:["Run status","Live view for supported runs","Trace context"],visual:"live"},{title:"Observe without taking control",body:"Live access follows the run target and authorization. Interactive takeover, video, and broad streaming depend on the workflow and beta coverage.",bullets:["Authorized access","Read-only observation","Completed, failed, or blocked result"],visual:"guard"}],faqs:[{q:"Is live view available for every run?",a:"Live view is available for supported workflows and environments."},{q:"Can I take control?",a:"Interactive takeover remains limited beta functionality."},{q:"Does live view replace Trace?",a:"Live view shows progress; Trace and captured evidence provide the later investigation record."}],cta:"See a browser run from start to finish",startHref:"/examples/autonomous-browser-check",startLabel:"Watch a recorded run"},
  {path:"/platform/swarm",title:"Swarm | Molar",description:"Preview coordinated browser testing across roles and scenarios with planned coverage and observed results.",headline:"Test an app from more than one account.",intro:"Plan tests for guests, members, and administrators, each with a separate browser and identity. Swarm is a preview for checking the interactions and permissions that a single-user test can miss.",kind:"product",visual:"swarm",preview:true,highlights:[{title:"Plan by persona",body:"Describe roles and journeys from guest signup to administrator workflow."},{title:"Compare planned and returned runs",body:"See which requested scenarios have results and which still need an execution."},{title:"Preview access",body:"Swarm is under active development. Contact us to confirm availability and supported workflows."}],sections:[{title:"A role-based test plan",body:"Give Swarm personas and goals such as member checkout, invited teammate access, and admin billing review. The planner organizes the requested coverage.",bullets:["Persona paths","Scenario planning","Observed run links"],visual:"swarm"},{title:"Turn gaps into next runs",body:"Use the plan to identify missing role coverage and choose the next runs. A planned scenario becomes evidence only after a supported run returns a result.",bullets:["Planned versus observed","Run groups","Trace context"],visual:"trace"}],faqs:[
  {
    "q": "What should we bring to a Swarm preview?",
    "a": "Bring the application, the roles you need to test, and a task for each role. We’ll confirm the supported browser and account setup."
  },
  {
    "q": "How many browsers can we run together?",
    "a": "Concurrency depends on the beta environment and workload. Contact us to agree on a supported setup before planning a larger test."
  },
  {
    "q": "Can we see a multi-user example?",
    "a": "The team-invitation example shows separate admin and member browsers with Auth and Email Clones. It is a controlled scripted test; Swarm’s coordinated agent workflow remains in preview."
  }
],cta:"Discuss Swarm preview"},
  {path:"/platform/developer-tools",title:"Developer tools | Molar",description:"Connect browser verification and automation to CLI, MCP, JSON output, and Playwright workflows.",headline:"Let your coding agent test its changes.",intro:"Run a browser check from the CLI, or connect an agent through MCP. Read the status and captured screenshots, fix the issue, and check again alongside your existing Playwright tests.",kind:"product",visual:"collaboration",highlights:[{title:"CLI commands",body:"Run a clear goal with a URL and request JSON output for scripts and agents."},{title:"MCP tools",body:"Connect an MCP-compatible client to browser, run, and Trace workflows for targets you can access."},{title:"Keep Playwright in the loop",body:"Continue using editable browser tests alongside Molar checks; generated export support varies by setup."}],sections:[{title:"Check the app after a code change",body:"After changing a login form, run `molar verify \"login works\" --url http://localhost:3000 --json`. Read the result, inspect the cited evidence, and rerun after a fix.",bullets:["Local and hosted targets","JSON results","Trace references"],visual:"collaboration"},{title:"Connect the command to CI or an agent",body:"Use CLI and MCP where a coding agent or CI job needs to start work and inspect the outcome. Availability varies by workflow and beta status.",bullets:["MCP clients","Credentials you control","Quickstart documentation"],link:{href:"https://mcp.molar.it",label:"Choose your MCP client"},visual:"automation"}],faqs:[{q:"Which command should I start with?",a:"Use `molar verify` for a browser claim and `molar run` for a scenario or task. Add `--json` for agent output."},{q:"Where is the hosted MCP endpoint?",a:"Use https://api.molar.it/mcp as the server URL. Choose your client at mcp.molar.it, then finish its sign-in flow."},{q:"Can I keep Playwright?",a:"Yes. Molar can complement Playwright workflows; generated export and clean replay are being tested in beta."}],cta:"Connect your developer workflow",startHref:"https://docs.molar.it",startLabel:"Open developer documentation"}
];
pages.push(...extraPages.map(page));
