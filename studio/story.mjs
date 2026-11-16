// Original Molar copy. Waybill supplies editorial reference, not words or assets.
export const scenes = [
  [
    "discrepancy",
    "After the click",
    "Problem",
    6.5,
    "A payment can succeed while the customer is still locked out. The bug is between the systems.",
    "Two states enter from opposite sides; the mismatch settles in the middle.",
  ],
  [
    "environment",
    "Connect your test app",
    "Two inputs",
    6,
    "First, connect your test environment, with the accounts and service access the workflow needs.",
    "A staging URL types in, then a connected state gently resolves.",
  ],
  [
    "task",
    "Say what should happen",
    "Two inputs",
    6.5,
    "Then describe the customer journey. Sign up, verify the email, pay for Pro, and check that Pro unlocks.",
    "A plain-language instruction types line by line, then becomes a saved task.",
  ],
  [
    "services",
    "Prepare the services",
    "Setup",
    6.5,
    "Molar prepares test versions of supported services, so the payment and email have somewhere safe to go.",
    "Service rows rise into a single preparation card; readiness fills in sequence.",
  ],
  [
    "snapshot",
    "Start from known state",
    "Setup",
    5.5,
    "Save the service state. You can come back to the same payment, email, and sign-in records.",
    "A state stack compresses into one dated snapshot, with a small completion tick.",
  ],
  [
    "signup",
    "Create the account",
    "One workflow",
    5.5,
    "The browser starts where your customer does: creating an account in your app.",
    "Fields populate from top to bottom; the submit button depresses once.",
  ],
  [
    "email",
    "Find the verification email",
    "One workflow",
    5.5,
    "It reads the verification email in the test inbox and follows the next step.",
    "A message slides in from the right and opens into its contents.",
  ],
  [
    "code",
    "Verify the account",
    "One workflow",
    5,
    "The code goes back into the app. Now the account is verified.",
    "Six digits appear in order; the form resolves upward into confirmation.",
  ],
  [
    "checkout",
    "Buy a plan",
    "One workflow",
    5.5,
    "Next, it chooses Pro and pays with the test card.",
    "The plan selector moves sideways and the payment button fills calmly.",
  ],
  [
    "payment",
    "Payment accepted",
    "One workflow",
    5,
    "The payment succeeds. That tells us the charge worked.",
    "A receipt rises slightly as a check draws; the result holds.",
  ],
  [
    "webhook",
    "Follow the update",
    "Hidden failure",
    6,
    "But the payment still has to reach your app. Here, that update fails.",
    "One event travels downward into the callback row, which reveals HTTP 500.",
  ],
  [
    "access",
    "Check the customer outcome",
    "Hidden failure",
    6,
    "The customer is still on Free. They paid, but they cannot use what they bought.",
    "The account panel opens from the side; the locked feature stays locked.",
  ],
  [
    "compare",
    "See the disagreement",
    "Hidden failure",
    5.5,
    "Molar checks both sides: the payment was accepted, but Pro was never unlocked.",
    "A single inspection card separates into a quiet side-by-side comparison.",
  ],
  [
    "trace",
    "Find the broken handoff",
    "Evidence",
    6,
    "Open the failed check. The payment update returned an error before access changed.",
    "A timeline descends; the failing request expands horizontally in place.",
  ],
  [
    "evidence",
    "Keep the evidence",
    "Evidence",
    6,
    "The recorded steps, available requests, and screenshot stay with the result, so you can inspect what happened.",
    "Three evidence tabs arrive one at a time inside the same result card.",
  ],
  [
    "unknown",
    "Say when it is unclear",
    "Trust",
    6,
    "And when Molar cannot verify an outcome, it says so. An incomplete check is not a pass.",
    "An unresolved result replaces the progress indicator; no green success appears.",
  ],
  [
    "reset",
    "Reset the test",
    "Repeat",
    7,
    "After you fix the problem, restore the test services. Reset your app’s test data separately.",
    "Service counters return to the saved state; app database reset is explicitly separate.",
  ],
  [
    "retry",
    "Run the same journey",
    "Repeat",
    5,
    "Run the same journey again, against the updated code.",
    "A rerun control turns once; the new revision replaces the old label.",
  ],
  [
    "unlocked",
    "Confirm that Pro opens",
    "Repeat",
    5.5,
    "This time, the payment arrives and Pro opens. Now the customer can actually get to work.",
    "The lock opens, the plan changes, and the project rises into view.",
  ],
  [
    "saved",
    "Keep the workflow",
    "Expansion",
    5,
    "Keep that workflow. You should not have to rebuild the investigation for every release.",
    "The finished run folds into one reusable workflow card.",
  ],
  [
    "guard",
    "Check the next change",
    "Expansion",
    6,
    "Use your configured checks on a preview deployment, before the change reaches customers.",
    "A pull-request card drops in; three checks finish in a stagger.",
  ],
  [
    "monitor",
    "Check after release",
    "Expansion",
    5.5,
    "Schedule the appropriate checks after release, using accounts and actions you have approved.",
    "A schedule advances horizontally to its next run without a frantic loop.",
  ],
  [
    "edgecases",
    "Try the awkward cases",
    "Expansion",
    6,
    "Then try the cases that are hard to reproduce: a declined card or a delayed callback.",
    "A case selector moves left to right, updating one visible service response.",
  ],
  [
    "inbox",
    "Follow the message",
    "Expansion",
    5.5,
    "The same approach can check whether a message arrived, not just whether the send button worked.",
    "A sent event descends into a received message inside one connected card.",
  ],
  [
    "map",
    "Explore the journey",
    "Product demo",
    6,
    "Cartographer explores reachable pages and gives you a map of the routes it found.",
    "A small route list grows from top to bottom, with observed pages checked.",
  ],
  [
    "export",
    "Keep a Playwright test",
    "Product demo",
    5.5,
    "Export a supported journey as a Playwright test, and keep it with your code.",
    "A route result slides aside to reveal a concise code file.",
  ],
  [
    "agent",
    "Let your coding agent ask",
    "Agent-native",
    6.5,
    "Your coding agent can request a browser check through the CLI or MCP, after setup and authentication.",
    "One command types into a light terminal; the prompt yields to the run.",
  ],
  [
    "agent-result",
    "Give the agent the result",
    "Agent-native",
    6,
    "It gets a structured result to inspect, change the code, and test again. You keep the review decisions.",
    "A JSON result rises under the command; the next action moves to review.",
  ],
].map(([id, title, chapter, duration, line, direction], i) => ({
  id,
  title,
  chapter,
  duration,
  line,
  direction,
  index: i + 1,
  kind: "product",
}));

const byId = Object.fromEntries(scenes.map((s) => [s.id, s]));
const product = (id, line, duration) => ({
  ...byId[id],
  line: line || byId[id].line,
  duration: duration || byId[id].duration,
});
const founder = (
  id,
  title,
  line,
  duration,
  framing = "Medium shot · bright outdoor shade · eye-level lens",
) => ({
  id,
  title,
  line,
  duration,
  framing,
  kind: "founder",
  chapter: "Founder",
  direction:
    "Hold a natural speaking frame. Leave the bottom caption-safe. No stock or synthetic founder.",
});
const title = (id, heading, line, duration) => ({
  id,
  title: heading,
  line,
  duration,
  kind: "title",
  chapter: "Story",
  direction: "One quiet copy frame; gentle rise and a generous hold.",
});

const launch = [
  founder(
    "f01",
    "The page looked fine.",
    "A customer pays for Pro. The payment succeeds. But their account stays on Free. The page looked fine.",
    9,
  ),
  product(
    "discrepancy",
    "Some of your worst bugs happen after the click.",
    4.5,
  ),
  founder(
    "f02",
    "I have been on call for this.",
    "I’m Pratik, founder of Molar. At Wayground, I worked on integrations where two systems could disagree about the same customer action.",
    10,
  ),
  title(
    "what",
    "QA for connected apps.",
    "Molar is QA for apps built on third-party services. You start with two things.",
    6.5,
  ),
  product(
    "environment",
    "Connect your test environment, with the accounts and service access it needs.",
    5.5,
  ),
  product("task", "And describe the journey you want to check.", 4),
  founder(
    "f03",
    "Let’s follow one customer.",
    "Let me show you. A new customer signs up, verifies their email, and buys Pro.",
    7,
  ),
  product(
    "services",
    "Molar prepares test versions of supported services.",
    4.5,
  ),
  product("signup", "Then it runs the journey in a real browser.", 4.5),
  product("email", "It reads the verification email.", 3.5),
  product("checkout", "And pays with the test card.", 4),
  product("payment", "That is a successful charge.", 3.5),
  founder(
    "f04",
    "Paid does not mean finished.",
    "Now, the payment went through. But did the customer get what they paid for?",
    6,
  ),
  product(
    "webhook",
    "Here, the payment update fails before it reaches the account.",
    5,
  ),
  product("access", "The customer is still on Free.", 3.5),
  product(
    "compare",
    "Molar checks the service event against what actually changed in the app.",
    5.5,
  ),
  founder(
    "f05",
    "Here is where it broke.",
    "You get a failed check, with the evidence to follow it back to the broken handoff.",
    7,
  ),
  product("trace", "The request returned an error.", 3.5),
  product(
    "evidence",
    "The recorded steps and screenshot stay with the result.",
    4.5,
  ),
  product(
    "unknown",
    "If an outcome could not be verified, Molar says so.",
    4.5,
  ),
  founder(
    "f06",
    "Fix it. Run it again.",
    "Once you fix the problem, reset the test services and run that same journey again.",
    6.5,
  ),
  product("reset", "Same starting state. Updated code.", 3.5),
  product(
    "unlocked",
    "This time, Pro opens. The customer can get to work.",
    4.5,
  ),
  founder(
    "f07",
    "One workflow. Every change.",
    "That is one workflow. Keep it, and use it to check the changes that come next.",
    6.5,
  ),
  product("guard", "Run configured checks on preview deployments.", 4),
  product("monitor", "And schedule the appropriate checks after release.", 4),
  product(
    "agent",
    "Your coding agent can ask Molar to test its changes, too.",
    5,
  ),
  product(
    "agent-result",
    "The result gives it something concrete to inspect and test again.",
    5,
  ),
  founder(
    "f08",
    "Know the customer got through.",
    "You should not have to open five tools to find out whether one customer finished one task.",
    7.5,
  ),
  title(
    "close",
    "Make sure the whole thing works.",
    "Start with one customer journey. Molar. Make sure the whole thing works.",
    7,
  ),
];

export const cuts = {
  launch: {
    name: "Launch film",
    description: "Fully animated · the complete founder script",
    mode: "animated",
    beats: launch,
  },
  founder: {
    name: "Founder intercut",
    description: "Same story · 8 replaceable founder shots",
    mode: "founder",
    beats: launch,
  },
  demo: {
    name: "Product demo",
    description: "A slower walkthrough · all 28 product illustrations",
    mode: "animated",
    beats: [
      title(
        "demo-open",
        "One customer. One complete journey.",
        "Let’s test a signup that ends with paid access. Every screen here is an illustration, using sample data.",
        8,
      ),
      ...scenes,
      title(
        "demo-close",
        "Start with the workflow that matters.",
        "Connect your test environment and start with one critical customer journey. Get started at molar.it.",
        7.5,
      ),
    ],
  },
  short: {
    name: "30-second introduction",
    description: "A concise cut for social posts and pitch openings",
    mode: "animated",
    beats: [
      product(
        "discrepancy",
        "Your customer paid. But they are still locked out.",
        5,
      ),
      product(
        "task",
        "Molar tests the journey across your app and its services.",
        5,
      ),
      product(
        "webhook",
        "It follows the payment to the failed account update.",
        5,
      ),
      product(
        "trace",
        "And brings back the evidence, so you know where to look.",
        5,
      ),
      product(
        "unlocked",
        "Fix it. Run it again. Check that the customer gets through.",
        5,
      ),
      title(
        "short-close",
        "Make sure the whole thing works.",
        "Molar. QA for apps built on third-party services.",
        5,
      ),
    ],
  },
};

export function timeline(cut) {
  let time = 0;
  const beats = Array.isArray(cut) ? cut : cuts[cut].beats;
  return beats.map((beat) => {
    const result = { ...beat, start: time, end: time + beat.duration };
    time = result.end;
    return result;
  });
}
export function locate(beats, time) {
  return (
    beats.find((b) => time >= b.start && time < b.end) ||
    beats.at(time <= 0 ? 0 : -1)
  );
}
// Hold one complete thought for the shot. The renderer wraps it to two lines.
// Word-count splitting left orphan cues as short as 0.3 seconds.
export function captions(beats) {
  return beats.map((b) => ({ start: b.start, end: b.end, text: b.line }));
}
export function captionAt(beat) {
  return beat.line;
}
export function timecode(seconds, ms = false) {
  const value = Math.max(0, Math.round(seconds * 1000));
  return `${String(Math.floor(value / 3600000)).padStart(2, "0")}:${String(Math.floor(value / 60000) % 60).padStart(2, "0")}:${String(Math.floor(value / 1000) % 60).padStart(2, "0")}${ms ? "," : "."}${String(value % 1000).padStart(3, "0")}`;
}
export function subtitleFile(beats, format = "srt") {
  return (
    (format === "vtt" ? "WEBVTT\n\n" : "") +
    captions(beats)
      .map(
        (c, i) =>
          `${format === "srt" ? i + 1 + "\n" : ""}${timecode(c.start, format === "srt")} --> ${timecode(c.end, format === "srt")}\n${c.text}\n`,
      )
      .join("\n")
  );
}
