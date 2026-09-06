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
    description: "Map an authorized web app, follow a user task in a real browser, and inspect the steps and result.",
    headline: "Explore your app with a browser agent.",
    intro: "Give Cartographer an authorized app URL and a goal such as “sign up, enter the email code, and open the workspace.” It follows the route in a real browser, returns the reached pages and recorded actions, and gives you a check to review and rerun.",
    kind: "product", visual: "explore",
    highlights: [
      { title: "Start with a customer task", body: "Write “sign up, enter the email code, and open the workspace.” Cartographer follows the forms and redirects, then shows the page it reached." },
      { title: "Open the step that stopped", body: "Use the status, screenshot, and Trace link to see the last successful action and decide whether the app or its setup needs attention." },
      { title: "Choose where to run", body: "Start from the dashboard, CLI, or hosted MCP endpoint with the target and test account you control." },
    ],
    sections: [
  {
    "title": "Follow signup into the workspace",
    "body": "Give Cartographer the app URL, a test account, and a goal: “sign up, enter the email code, and open the workspace.” It follows the forms and redirects, then returns the final page and the actions it took.",
    "bullets": [
      "Describe the task in plain English",
      "Use a local or hosted browser",
      "Review each recorded step"
    ]
  },
  {
    "title": "Check a change from your terminal",
    "body": "After changing the login page, supply your local URL and say “the login form is visible.” Read the JSON status and captured screenshot, fix the app, then run the same check again.",
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
    "body": "Use the recorded actions and screenshots to find the last successful step. For supported runs, the live view shows progress while the browser works. Keep the run reference with the bug report or next rerun.",
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
      { q: "What does a run return?", a: "A run reports completed, failed, or cancelled and can include task and Trace identifiers, screenshots, a live view link for supported workflows, and other artifacts captured during that run." },
      { q: "Can Cartographer use a logged-in test account?", a: "Use an authorized saved profile or credential reference for the application. Saved sign-in state stays tied to the website it belongs to." },
      { q: "Can I stop a browser run?", a: "Yes. Hosted runs expose cancellation, and the final status records whether the run completed, failed, or was cancelled." },
      { q: "Is generated Playwright code ready for CI?", a: "Generated Playwright export and clean replay are being tested in beta. Contact us before planning to publish generated tests to your repository or connect that flow to Guard." },
    ],
    cta: "Try a browser check",
    startHref: "/verify",
    startLabel: "Run a browser check",
    ctaDescription: "Check a public page, name the visible result you expect, and review the returned status and screenshot."
  }),
  page({
    path: "/products/clones",
    title: "Clones | Molar",
    description: "Test Stripe, Twilio, email, authentication, and storage with stateful service clones, virtual time, and resettable test data.",
    headline: "Test the services behind your app.",
    intro: "Point your test environment at a documented service clone instead of the live vendor. Your app makes its usual payment, message, sign-in, or upload request; you inspect the resulting record and reset it for the next run.",
    kind: "product", visual: "clones",
    highlights: [
      { title: "Connect the service your test needs", body: "Use the documented Stripe, Twilio, Email, Auth, or S3 endpoint for the path you are checking, then keep the app pointed at that test service." },
      { title: "Create the state you need", body: "Choose a decline, expiry, renewal, or delayed delivery where the clone supports it, then run the browser task against that starting state." },
      { title: "Read what your app changed", body: "Inspect the payment, message, account, file, or webhook record after the browser step, then restore the starting state before rerunning." },
    ],
    sections: [
  {
    "title": "Test what happens after the payment",
    "body": "Create a customer and payment, let the app handle the callback, and check whether the account shows the paid plan. Advance the subscription clock to produce the next billing event, then inspect the updated record.",
    "bullets": [
      "Payment and subscription records",
      "Callbacks and supported signatures",
      "Virtual time for renewals and expiry"
    ]
  },
  {
    "title": "Choose the services your app uses",
    "body": "The core catalog covers Stripe, Twilio, Email, Auth, and S3. Each clone lists its supported operations and state changes. Open the catalog, choose the service behind your feature, and configure its endpoint.",
    "link": {
      "href": "/docs/clones",
      "label": "Browse the service catalog"
    }
  },
  {
    "title": "Connect your app to the test service",
    "body": "Start the required clone and point the development or CI environment at its endpoint. Keep production credentials out of that environment; the app sends its usual requests and the test reads the records it creates.",
    "bullets": [
      "Choose the APIs your app calls",
      "Configure the test endpoint and credentials",
      "Check the resulting payment, message, or file record"
    ]
  },
  {
    "title": "Reproduce a decline, delay, or expiry",
    "body": "Set up a supported failure state before the browser test. A declined payment should show a retry; an expired verification code should leave the account signed out. Use the virtual clock to reach time-based states immediately.",
    "bullets": [
      "Payment declines and retries",
      "Subscription renewals",
      "Message delivery and code expiry"
    ]
  },
  {
    "title": "Reset the data before the next test",
    "body": "Save a JSON snapshot before the test, change the service state during the run, and restore it before the next attempt. Restoring the starting state keeps a previous purchase from affecting the next test.",
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
    ctaDescription: "Browse the supported APIs, choose the service behind your journey, and configure its test endpoint."
  }),
  page({
    path: "/products/guard",
    title: "Guard | Molar",
    description: "Run selected browser checks before merge and after release, with the failed assertion ready for review.",
    headline: "Catch broken flows before release.",
    intro: "Choose the signup, checkout, or account-access check that should protect a release. Guard runs it against the configured preview or live URL, returns the assertion status and captured steps, and tells reviewers what to inspect next.",
    kind: "product", visual: "guard",
    highlights: [
  {
    "title": "Check a pull request",
    "body": "Run `molar run checkout --ci --json` in the release pipeline. The command returns a machine-readable status for the configured checkout scenario."
  },
  {
    "title": "Find the failed check",
    "body": "Open the failed assertion, target environment, and nearby browser step to see what changed and whether the app or setup needs a fix."
  },
  {
    "title": "Check after deployment",
    "body": "Schedule a configured login, checkout, or account task for an authorized environment, then review the next returned status."
  }
],
    sections: [
  {
    "title": "Check the browser and the service together",
    "body": "A checkout test should confirm more than a successful button click. Configure it to check the payment callback and order state, then use supported Clones to keep payment and messaging traffic in the test environment.",
    "bullets": [
      "Configured browser scenarios",
      "GitHub pull request checks",
      "Screenshots and failure details"
    ]
  },
  {
    "title": "Run a configured scenario in CI",
    "body": "After configuring the checkout scenario and target, run it in CI. The returned status distinguishes a completed check from a failure or a run blocked by missing access or setup.",
    "code": "molar run checkout --ci --json",
    "codeLabel": "Run an existing checkout scenario"
  },
  {
    "title": "Give reviewers the failed step",
    "body": "Keep the scenario and target with the result so reviewers know which version was tested. Open the screenshot or Trace record, fix the app, and rerun the check.",
    "link": {
      "href": "/products/trace",
      "label": "See how to investigate a failure"
    }
  },
  {
    "title": "Choose what blocks a merge",
    "body": "Connect the repository and choose which checks are required. Start with signup, payment, or account access, then decide how reviewers handle a failed or setup-blocked run.",
    "bullets": [
      "Choose the required scenarios",
      "Use the correct preview or staging URL",
      "Review failures before merging"
    ]
  },
  {
    "title": "Keep checking after release",
    "body": "A passing preview cannot tell you whether login will break tomorrow. Scheduled checks revisit an authorized live URL; during beta, confirm the schedule, accounts, and services your environment needs.",
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
    ctaDescription: "Bring the check you want before merge or after deployment. We’ll confirm repository setup and beta availability."
  }),
  page({
    path: "/products/trace",
    title: "Trace | Molar",
    description: "Inspect the browser step, request, and captured result around a failed test.",
    headline: "See where your browser test failed.",
    intro: "Trace puts the browser action, page, request, and available service details from one run in sequence. Find the last successful step, inspect the next response, and hand an engineer a focused starting point for the fix.",
    kind: "product", visual: "trace",
    highlights: [
  {
    "title": "See the steps in order",
    "body": "Follow the recorded actions in order and open the captured page at the step where the expected result changed."
  },
  {
    "title": "Keep run data private",
    "body": "Authenticated access and expiring references control who can open captured screenshots and run files."
  },
  {
    "title": "Let your coding agent investigate",
    "body": "Use MCP tools to retrieve the failed step and nearby details, then give your coding agent only the run context it needs."
  }
],
    sections: [
  {
    "title": "Start with the action that failed",
    "body": "Did the browser submit the form, load the next page, or show the receipt? Read the steps in order, then open the screenshot closest to the failed assertion.",
    "bullets": [
      "Browser actions and timestamps",
      "Captured screenshots",
      "The check and its result"
    ]
  },
  {
    "title": "Understand why the run stopped",
    "body": "A failed assertion and a missing login need different fixes. Check the status first: inspect the app when the expected state was missed, or fix access and inputs when setup blocked the task.",
    "bullets": [
      "Completed, failed, and blocked states",
      "The last recorded browser step",
      "Available network and console context"
    ]
  },
  {
    "title": "Follow the failed request",
    "body": "When network or console details were captured, compare them with the browser action. A payment followed by a failed callback needs a different fix from a card decline; use the response to narrow the next check.",
    "bullets": [
      "Inspect captured request and response details",
      "Read related console errors",
      "Check service records when available"
    ]
  },
  {
    "title": "Send an agent the relevant steps",
    "body": "An authorized MCP client can list traces and request a focused part of a run. Give your coding agent the failed assertion and nearby actions, then let it inspect the relevant request or screenshot.",
    "link": {
      "href": "/platform/developer-tools",
      "label": "Connect a coding agent"
    }
  },
  {
    "title": "Review a recording before rerunning",
    "body": "Open the captured screenshot or video to see what the browser did. Playback shows the original run; rerunning executes the task again. Available files and replay options depend on the workflow.",
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
    description: "Review a proposed repair beside the failed browser check that prompted it.",
    headline: "Turn a failure into a proposed fix.",
    intro: "Give Mender a reproducible Guard failure and its Trace. It gathers the relevant run and repository context, prepares a proposed change for review, and waits for a person to approve the next step. Mender remains a preview capability.",
    kind: "product", visual: "trace",
    highlights: [
      { title: "Bring the failed check", body: "Start with the Guard run, Trace, and scenario that show the failure you can reproduce." },
      { title: "Inspect the proposed edit", body: "Review the suggested change beside the failed assertion and repository context before deciding what to do." },
      { title: "Choose the next step", body: "Approve a reviewable change or keep investigating. Mender does not apply or merge an unapproved repair." },
    ],
    sections: [
      { title: "Use the failed test to prepare a fix", body: "Start with a failing Guard run and its Trace. Mender brings the assertion, browser step, and relevant repository context together so an engineer can review a candidate patch.", bullets: ["Guard and Trace links", "Failed assertion and proposed edit", "Repository context"] },
      { title: "Review the proposed change", body: "Compare the suggested edit with the failure it addresses and the checks available around it. Decide whether to open or continue a draft change.", bullets: ["Candidate patch", "Source and run links", "Human approval"] },
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
    ctaDescription: "Bring a reproducible failing run. We’ll confirm the Mender preview workflow and review process."
  }),
  page({
    path: "/solutions/integration-testing",
    title: "Integration testing for real product journeys | Molar",
    description: "Exercise payment, identity, messaging, and webhook behavior with resettable test services.",
    headline: "Test the services your app depends on.",
    intro: "A customer signs up, receives a code, pays, and opens an account. Connect the app to supported test services, run that browser journey, and check the payment, message, callback, and account records it produces.",
    kind: "solution", visual: "clones",
    highlights: [
      { title: "Connect a controlled payment path", body: "Exercise supported success, decline, 3DS, subscription, refund, dispute, and callback states with isolated test data." },
      { title: "Read the code your app receives", body: "Create a test identity, read the delivered OTP or magic link, and continue without using a personal inbox." },
      { title: "Inspect the callback result", body: "Advance the supported clock, trigger an event, and inspect the retry or resulting account state before the next run." },
    ],
    sections: [
      { title: "Run the services together", body: "Point the app at the Stripe, Twilio, Email, Auth, and S3 clones it needs. Save a snapshot, run the browser journey, and inspect the records returned by each service.", bullets: ["Five core service clones", "Documented service APIs", "Repeatable snapshots and callbacks"] },
      { title: "Make callbacks part of the check", body: "After checkout or signup, check the webhook, email, OTP, or storage change that moves the product forward. The final browser page alone cannot confirm that handoff.", bullets: ["Payment and receipt state", "OTP and magic-link delivery", "Webhook retries and signatures"] },
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
    description: "Give coding agents a browser check they can run, read, and rerun from CLI or MCP.",
    headline: "Let the agent verify the app it just changed.",
    intro: "After an agent changes a checkout or login flow, it needs to use the app. Molar gives it CLI and MCP tools to run a concrete browser task, read the status and captured output, fix the code, and try again.",
    kind: "solution", visual: "agent",
    highlights: [
      { title: "One command after code", body: "Run `molar verify \"the login form is visible\" --url http://localhost:3000 --json` and pass the status to the next agent turn." },
      { title: "Connect through MCP", body: "Use `https://api.molar.it/mcp` or the local stdio server through `molar mcp serve`, with the access your target requires." },
      { title: "You stay in control", body: "External targets require authorization, and financial or irreversible browser actions pause for confirmation." },
    ],
    sections: [
      { title: "Return the next useful output", body: "The status, run ID, Trace link, and captured screenshot give an agent enough context to diagnose and rerun. `--json` keeps the result machine-readable.", bullets: ["JSON status", "Run polling", "Screenshots and Trace links"] },
      { title: "Run the loop after a code change", body: "Change the login form, run the local check, read the pass or failure, inspect the captured screenshot, and rerun after the fix. Hosted runs use the target and credentials you choose.", code: "molar verify \"the login form is visible\" --url http://localhost:3000 --json", codeLabel: "Run after a code change" },
      { title: "Give the agent an observable result", body: "Ask for “show the invoice number,” “reach the signed-in dashboard,” or “confirm the order says paid.” Molar returns the run identity and available output for the next turn.", bullets: ["Visible business outcomes", "Trace links", "Structured failure hints"] },
    ],
    faqs: [
      { q: "Can an agent click a payment button automatically?", a: "It can act on an authorized target, but financial or irreversible steps require a confirmation flow." },
      { q: "Can an agent use a real user's login?", a: "Use a saved test account or credential reference for the site. Supported email and SMS connections provide verification codes without using a customer’s personal inbox." },
      { q: "What happens when verification fails?", a: "The CLI can emit a structured failure with a hint plus screenshot and Trace links so the coding agent can inspect the cause and rerun." },
    ],
    cta: "Give your agent a verifier",
    startHref: "/platform/developer-tools",
    startLabel: "Explore developer tools"
  }),
  page({
    path: "/solutions/startups",
    title: "QA for startups shipping quickly | Molar",
    description: "Keep signup, checkout, and account access checked while a small team ships.",
    headline: "Keep signup and checkout working as you ship.",
    intro: "Start with the tasks you cannot afford to break: a new user signs up, a customer pays, and the app grants access. Molar runs those checks in a real browser and keeps the result beside the scenario.",
    kind: "solution", visual: "guard",
    highlights: [
      { title: "Describe the expected result", body: "Write what the customer should see, run it in a browser, and keep the scenario and returned status near the code." },
      { title: "Use resettable service state", body: "Point integration paths at supported Clones when live side effects make repeated CI difficult, then restore state before the next run." },
      { title: "Move one check into release", body: "Promote the scenario to CI and, for supported environments, schedule it against an authorized live URL." },
    ],
    sections: [
      { title: "Start with signup and checkout", body: "Pick one activation path and one revenue path. Check that email verification reaches the workspace and payment confirmation grants the expected access.", bullets: ["Signup and OTP", "Checkout and receipt", "Webhook-driven state changes"] },
      { title: "Choose the smallest useful run", body: "Start with one authorized URL, one test identity, and one expected result. Run locally or against a configured target, then keep the returned status with the scenario.", bullets: ["Authorized URL", "Test identity", "Expected result"] },
      { title: "Add the failure branch next", body: "Once the first test passes, add the branch that matters most: a declined payment, expired OTP, delayed callback, or missing receipt.", bullets: ["One happy path", "One failure branch", "A result for each run"] },
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
    description: "Verify the browser journeys that connect your UI to application and service behavior.",
    headline: "Test the path your users actually take.",
    intro: "A web app can look healthy while a callback, redirect, verification code, or receipt path is broken. Give Molar a concrete expected result; it follows the browser steps and checks the service change behind it.",
    kind: "solution", visual: "explore",
    highlights: [
      { title: "Start with a URL and result", body: "Use a live or local URL you can access and say “the receipt number is visible” or “onboarding reaches the workspace.”" },
      { title: "Let the browser follow the task", body: "Molar reads each page before acting, then checks what changed after the click, form, redirect, or code entry." },
      { title: "Keep the run record", body: "A run can retain its status, screenshots, Trace identifier, and captured files for the next investigation." },
    ],
    sections: [
      { title: "Test signup, checkout, and the service handoff", body: "Focus on a journey where your UI, backend, and third party must agree: accept an OTP, complete payment, receive the callback, and show the receipt. One page screenshot cannot establish that chain.", bullets: ["Browser assertions", "Auth and verification loops", "Payment and webhook transitions"] },
      { title: "Choose local or hosted execution", body: "Use the CLI for local verification or a configured hosted run. Start with an authorized URL and explicit credentials so another engineer can repeat the check.", bullets: ["Localhost development", "Authorized hosted targets", "Explicit credentials"] },
      { title: "Keep a result someone can inspect", body: "A run can retain status, screenshots, a Trace identifier, and captured files. Use them to answer which step changed and what the app showed at that moment.", bullets: ["Run status", "Screenshots and Trace", "Captured files"] },
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
    description: "Understand how Molar scopes browser actions, credentials, run files, and agent access.",
    headline: "Control what Molar can access and change.",
    intro: "Choose the application and test account for each run. Molar keeps the target, browser actions, approvals, and access to captured files explicit so your team can decide what happens next.",
    kind: "resource", visual: "trace",
    highlights: [
      { title: "Choose the target", body: "Authorize the external target before exploration or automation that can change state." },
      { title: "Review sensitive actions", body: "Actions that change data or delete records identify the change and may pause for approval." },
      { title: "Protect run files", body: "Trace screenshots and recordings use authenticated access and signed or expiring references for reads." },
    ],
    sections: [
      { title: "Use the right test account", body: "Save an authorized test identity for the application. Login stays tied to that site, and supported email or SMS checks use identities provisioned for your workspace.", bullets: ["Saved test credentials", "Workspace profiles", "Action records and approvals"] },
      { title: "Decide who can open the run", body: "Molar checks the target and identity supplied for a run, applies approval gates to sensitive actions, and serves captured files through controlled reads. Contact us for current security details." },
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
    description: "Molar helps teams check the service handoffs that decide whether a web app works.",
    headline: "Test the handoffs customers depend on.",
    intro: "Molar is built for teams connecting web apps to payment, identity, and email services. Check that payment grants access, a code completes sign-in, or an invitation adds the right member.",
    kind: "resource", visual: "agent",
    highlights: [
      { title: "Start with the customer task", body: "We organize QA around what a user is trying to complete and the services that must cooperate along the way." },
      { title: "Leave a useful run record", body: "A run names the goal, records the path, and keeps the assertion with its status so another person or agent can choose the next inspection." },
      { title: "Give agents bounded access", body: "Coding agents use configured targets and credentials, approval gates for sensitive actions, and structured output that points to the next step." },
    ],
    sections: [
      { title: "Where we focus", body: "The platform brings Cartographer, Clones, Guard, Trace, and the developing Mender workflow together for software whose journeys cross several services.", bullets: ["Browser journey verification", "Stateful third party test doubles", "Release checks and diagnosis"] },
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
    description: "Practical guides for checking web apps, connected services, and agent-built software.",
    headline: "Set up, test, and debug with Molar.",
    intro: "Find the guide for your next task: run a browser check, connect a test service, or give a coding agent a result it can read.",
    kind: "resource", visual: "explore",
    highlights: [
      { title: "Run your first check", body: "Follow the setup, authorize a target, and run one concrete browser claim from the terminal." },
      { title: "Connect the service behind it", body: "Clone references show how to control payment, email, auth, SMS, and storage behavior in a test." },
      { title: "Give an agent readable output", body: "MCP and JSON references show how an agent can discover a tool, wait for the result, and open the cited run files." },
    ],
    sections: [
      { title: "Suggested reading path", body: "Install the CLI and check a page. Add the relevant clone for payment, email, or storage. Then read the Guard guide to put the scenario in CI.", bullets: ["Quickstart and CLI", "Clone catalog and examples", "MCP auth and tools"] },
      { title: "Match the guide to the job", body: "Open the payment guide for checkout, identity guide for sign-in, or MCP reference for a coding agent. Each link takes you to the next setup step." },
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
  {path:"/solutions/checkout-testing",title:"Checkout testing | Molar",description:"Check payment, callback, order, and receipt behavior in one browser journey.",headline:"Check every step of checkout.",intro:"Give Molar a checkout goal such as “buy the Pro plan and verify the receipt.” Follow the browser from cart to payment, then check the callback, order state, and receipt your customer sees.",kind:"solution",visual:"checkout",highlights:[{title:"Choose a payment state",body:"Exercise supported success, declines, refunds, and other payment states with isolated test data."},{title:"Check the callback",body:"Confirm that your app receives the payment event and updates the order after the browser step."},{title:"Read the receipt",body:"Check the order number, payment amount, and delivered receipt to see whether they agree."}],sections:[{title:"From checkout to confirmation",body:"Run the browser steps against the available test services, then inspect the returned payment, callback, order, and receipt results.",bullets:["Cart and plan selection","Payment and webhook handling","Receipt and order assertions"],visual:"checkout"},{title:"Cover unhappy paths",body:"Check declined payment, delayed callbacks, and stale receipt links with controlled service state instead of live charges.",bullets:["Declines and retries","Subscriptions and invoices","Test inbox verification"],visual:"trace"}],faqs:[{q:"Can this use live payment credentials?",a:"Use isolated clone paths for test traffic. Contact us to confirm supported payment behavior."},{q:"Does Molar test the provider dashboard?",a:"Molar focuses on your authorized application journey and supported clone behavior."},{q:"What does a run return?",a:"A run can include status, screenshots, Trace identifiers, and files captured during that run."}],cta:"Test a checkout journey",startHref:"/products/clones",startLabel:"Explore payment Clones"},
  {path:"/solutions/authentication-testing",title:"Authentication testing | Molar",description:"Check signup, OAuth, OTP, sessions, invites, and protected application routes.",headline:"Check sign-in from signup to workspace.",intro:"Give Molar a goal such as “create an account, enter the email code, and open the workspace.” It follows the forms and redirects, then reports where access was granted or the setup stopped.",kind:"solution",visual:"identity",highlights:[{title:"Follow real browser steps",body:"Run forms, redirects, codes, and protected pages in the order a customer uses them."},{title:"Create test identities",body:"Use separate identities for each role so permissions and invitations are checked against the right account."},{title:"Name the failure path",body:"Check expired codes, denied access, sign-out, and invitation cases with a result you can inspect."}],sections:[{title:"Signup, verify, continue",body:"Run “create an account, enter the email code, and open the workspace.” The returned status identifies the page or access step where the journey stopped.",bullets:["Signup and email verification","OAuth redirects","Invites and workspace roles"],visual:"identity"},{title:"Sessions need checks too",body:"Check refresh, reload, sign-out, and access to a route that should remain protected after the first login.",bullets:["Session persistence","Expired credentials","Protected routes"],visual:"guard"}],faqs:[{q:"Can I test OAuth providers?",a:"OAuth is available in some workflows. Contact us to confirm provider and beta coverage."},{q:"How are OTP messages handled?",a:"Supported email and SMS clones provide controlled messages and codes."},{q:"Can I keep existing auth tests?",a:"Molar can complement Playwright workflows; export support depends on your setup."}],cta:"Verify an auth journey",startHref:"/products/cartographer",startLabel:"Explore Cartographer"},
  {path:"/solutions/team-workflows",title:"Team workflows | Molar",description:"Check invitations, membership state, and role permissions across two test accounts.",headline:"Test the work that takes two people.",intro:"An admin sends an invitation. A teammate accepts it. Test both browsers, including the email, membership state, and permissions the new member receives.",kind:"solution",visual:"collaboration",highlights:[
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
],sections:[{title:"Follow the invitation into the app",body:"Use independent test identities for the sender and recipient. Check that the right link reaches the intended inbox, the invitation can be accepted, and the app records the new membership.",bullets:["Correct recipient","Invitation link received","Membership recorded"],visual:"collaboration"},{title:"Check what each role can do",body:"Joining the workspace is only the start. Check the pages and actions available to owners, members, and invited users, including access they should not have.",bullets:["Owner billing controls","Member project access","Pending invitation restrictions"],visual:"guard"}],faqs:[{q:"Is Molar only for QA specialists?",a:"Developers, QA, platform teams, and coding agents can use the same workflow."},{q:"Can we control who sees a run?",a:"Access follows your workspace permissions and authenticated project access."},{q:"Can a teammate rerun my flow?",a:"Supported workflows can be rerun with the target, credentials, and scenario settings your team provides."}],cta:"Watch both sides of an invitation",startHref:"/examples/team-invitation",startLabel:"Watch the invitation test"},
  {path:"/solutions/preview-deployments",title:"Preview deployment testing | Molar",description:"Run critical browser journeys against a preview deployment before a change reaches production.",headline:"Know what a change did before it ships.",intro:"Give Guard the preview URL and select the signup or checkout scenario that protects the change. Inspect the returned assertion and browser step before merging.",kind:"solution",visual:"preview",highlights:[{title:"Check the changed app",body:"Run selected journeys against the environment created for a pull request."},{title:"Open the changed step",body:"Use the status, screenshot, and Trace link to see where the preview diverged."},{title:"Attach the result to review",body:"Give reviewers the scenario status and available run files alongside the code change."}],sections:[{title:"A preview test in practice",body:"A pull request changes checkout. The run opens the preview, selects the plan, verifies the callback, and reports the order state.",bullets:["Preview URL","Critical path scenario","Order and callback result"],visual:"preview"},{title:"Gate the paths that changed",body:"Choose the journeys where a regression matters most, then add signup, checkout, or invitation coverage as the team learns.",bullets:["Signup and login","Checkout and payment","Invites and webhooks"],visual:"guard"}],faqs:[{q:"Does Molar test every pull request automatically?",a:"Guard runs checks you set up when the repository connection and policy are ready."},{q:"Can previews use Clones?",a:"Supported workflows can pair a preview with available service clones."},{q:"What happens when a check fails?",a:"The run records a failed or blocked outcome with the available status, screenshots, and Trace references."}],cta:"Test a preview deployment",startHref:"/products/guard",startLabel:"Explore Guard"},
  {path:"/solutions/workflow-automation",title:"Workflow automation | Molar",description:"Run repeat browser tasks such as forms, downloads, extraction, and page checks with clear access.",headline:"Automate the browser work you repeat.",intro:"Describe a task such as finding an invoice, downloading a report, or filling an approved form. Set the target and credentials, then use the returned file, fields, or status in the next tool.",kind:"solution",visual:"automation",highlights:[
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
],sections:[{title:"Download reports and fill forms",body:"Run a task against an app you can access: download a report, update a project field, or verify a page state. Use the returned file or status in the next step.",bullets:["Fill an approved form","Download a report","Verify a page result"],visual:"automation"},{title:"Control what Molar can access and change",body:"Choose the target, credentials, and expected result before execution. Molar records whether the run completed, failed, or was blocked so you can inspect the action and its consequence.",bullets:["CLI and MCP entry points","Site-specific test accounts","Returned files and screenshots"],visual:"trace"}],faqs:[{q:"Is this only for testing?",a:"No. Molar supports authorized browser tasks as well as QA journeys."},{q:"Can an agent start a task?",a:"The CLI and MCP provide agent-accessible entry points with structured results."},{q:"Can automation make irreversible changes?",a:"Sensitive actions depend on the workflow and authorization controls you set."}],cta:"Automate a browser task",startHref:"/platform/browser-agents",startLabel:"Explore browser agents"},
  {path:"/solutions/web-data-extraction",title:"Web data extraction | Molar",description:"Read selected fields from an authorized web application through a real browser.",headline:"Turn a page into useful data.",intro:"Describe the fields you need from a web app you can access, such as plan names, prices, or invoice numbers. Molar navigates to the relevant page and returns the values in a structured result.",kind:"solution",visual:"data",highlights:[
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
],sections:[{title:"From page to JSON",body:"Ask “read the current plan names and prices.” The browser reaches the page, extracts the fields, and returns observed values for the next tool.",bullets:["Visible page data","Schema-oriented requests","Structured output"],visual:"data"},{title:"Keep each value tied to its source",body:"Use extraction on applications and pages you are authorized to access. Request only the fields your next tool needs, then inspect the page details returned with them.",bullets:["Credentials you control","Relevant page state","Captured source details"],visual:"guard"}],faqs:[{q:"Can Molar extract from any website?",a:"Use Molar with targets you own or are authorized to access."},{q:"Does extraction use an API?",a:"The workflow uses a real browser and returns structured results through supported interfaces."},{q:"Can I schedule extraction?",a:"Scheduling depends on the current workflow and availability."}],cta:"Extract from an authorized app",startHref:"/platform/browser-agents",startLabel:"Explore browser extraction"},
  {path:"/platform/browser-agents",title:"Browser agents | Molar",description:"Give people and coding agents a browser that can navigate, act, and verify clear goals.",headline:"Give a browser a job to finish.",intro:"Give Molar a website and a task: find an invoice, fill a form, or check that login works. The agent reads the page, chooses an action, checks what changed, and returns the result.",kind:"product",visual:"automation",highlights:[{title:"Return a structured result",body:"Describe the task, choose the target, and receive status plus available run files."},{title:"Read state after each action",body:"The agent uses the page state it observes after each action to choose the next step."},{title:"Choose your interface",body:"Start from the dashboard, CLI, or MCP for the workflow you are building."}],sections:[{title:"Describe the task and supply the website",body:"Choose a URL, give a clear goal such as “find the latest invoice,” and provide credentials for the app. Molar navigates, acts, checks the result, and returns the status.",bullets:["Authorized execution","Task status","Recorded browser steps"],visual:"automation"},{title:"Use the same browser from your agent",body:"The same browser layer can verify a login, complete an approved task, extract fields, or return a file to a coding agent.",bullets:["Verification and extraction","CLI and MCP","Screenshots where captured"],visual:"trace"}],faqs:[{q:"What can a browser agent do?",a:"Supported workflows include navigation, forms, extraction, downloads, and page verification."},{q:"Can I watch a run?",a:"Live view information is available for supported runs; broader interactive access remains in beta."},{q:"Does the agent have unrestricted access?",a:"You choose the targets, credentials, and workflow policies that define access and actions."}],cta:"Give a browser a job",startHref:"/contact",startLabel:"Discuss browser automation"},
  {path:"/platform/live-view",title:"Live view | Molar",description:"Follow supported browser runs with live status and captured run files.",headline:"See the browser while it works.",intro:"Open the live view supplied by a supported run to follow the browser while it works. Afterward, inspect captured screenshots and steps to see where a task finished or stopped.",kind:"product",visual:"live",highlights:[{title:"Read the current state",body:"See whether a run is working, completed, failed, or waiting for attention."},{title:"Share the run",body:"Share the authorized run reference so a teammate or agent can inspect the same browser steps."},{title:"Investigate after completion",body:"Open screenshots, traces, and captured files after the live browser moment."}],sections:[{title:"Watch a browser run",body:"Start a browser task or verification, open the live view link supplied by a supported run, and follow the journey through the application.",bullets:["Run status","Live view for supported runs","Trace context"],visual:"live"},{title:"Observe without taking control",body:"Live access follows the run target and authorization. Interactive takeover, video, and broad streaming depend on the workflow and beta coverage.",bullets:["Authorized access","Read-only observation","Completed, failed, or blocked result"],visual:"guard"}],faqs:[{q:"Is live view available for every run?",a:"Live view is available for supported workflows and environments."},{q:"Can I take control?",a:"Interactive takeover remains limited beta functionality."},{q:"Does live view replace Trace?",a:"Live view shows progress; Trace and captured run files provide the later investigation record."}],cta:"See a browser run from start to finish",startHref:"/examples/autonomous-browser-check",startLabel:"Watch a recorded run"},
  {path:"/platform/swarm",title:"Swarm | Molar",description:"Preview coordinated browser testing across roles and scenarios with planned coverage and returned results.",headline:"Test an app from more than one account.",intro:"Plan tests for guests, members, and administrators, each with a separate browser and identity. Swarm is a preview for checking the interactions and permissions that a single-user test can miss.",kind:"product",visual:"swarm",preview:true,highlights:[{title:"Plan by persona",body:"Describe roles and tasks from guest signup to administrator workflow."},{title:"Compare requested and returned runs",body:"See which scenarios have a result and which still need an execution."},{title:"Preview access",body:"Swarm is under active development. Contact us to confirm availability and supported workflows."}],sections:[{title:"A role-based test plan",body:"Give Swarm personas and goals such as member checkout, invited teammate access, and admin billing review. The planner organizes the requested coverage.",bullets:["Persona paths","Scenario planning","Returned run links"],visual:"swarm"},{title:"Turn gaps into next runs",body:"Use the plan to identify missing role coverage and choose the next runs. A planned scenario becomes a check only after a supported run returns a result.",bullets:["Planned versus observed","Run groups","Trace context"],visual:"trace"}],faqs:[
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
  {path:"/platform/developer-tools",title:"Developer tools | Molar",description:"Connect browser verification and automation to CLI, MCP, JSON output, and Playwright workflows.",headline:"Let your coding agent test its changes.",intro:"Run a browser check from the CLI, or connect an agent through MCP. Read the status and captured screenshots, fix the app, and check again alongside your existing Playwright tests.",kind:"product",visual:"collaboration",highlights:[{title:"CLI commands",body:"Run a clear goal with a URL and request JSON output for scripts and agents."},{title:"MCP tools",body:"Connect an MCP-compatible client to browser, run, and Trace workflows for targets you can access."},{title:"Keep Playwright in the loop",body:"Continue using editable browser tests alongside Molar checks; generated export support varies by setup."}],sections:[{title:"Check the app after a code change",body:"After changing a login form, run `molar verify \"the login form is visible\" --url http://localhost:3000 --json`. Read the result, inspect the captured screenshot, and rerun after fixing the app.",bullets:["Local and hosted targets","JSON results","Trace references"],visual:"collaboration"},{title:"Connect the command to CI or an agent",body:"Use CLI and MCP where a coding agent or CI job needs to start work and inspect the outcome. Availability varies by workflow and beta status.",bullets:["MCP clients","Credentials you control","Quickstart documentation"],link:{href:"https://mcp.molar.it",label:"Choose your MCP client"},visual:"automation"}],faqs:[{q:"Which command should I start with?",a:"Use `molar verify` for a browser claim and `molar run` for a scenario or task. Add `--json` for agent output."},{q:"Where is the hosted MCP endpoint?",a:"Use https://api.molar.it/mcp as the server URL. Choose your client at mcp.molar.it, then finish its sign-in flow."},{q:"Can I keep Playwright?",a:"Yes. Molar can complement Playwright workflows; generated export and clean replay are being tested in beta."}],cta:"Connect your developer workflow",startHref:"https://docs.molar.it",startLabel:"Open developer documentation"}
];
pages.push(...extraPages.map(page));
