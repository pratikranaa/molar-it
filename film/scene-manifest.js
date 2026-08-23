import { LAUNCH_CUT } from "./launch-manifest.js";

export const PRODUCT_SCENES = [
  ["01", "Scale becomes reliability", "But knowing it works is harder.", 5200, "15 million users; 500,000 daily operations; reliability improves from 92% to 99.8%."],
  ["02", "Two systems disagree", "The screen could look right.", 4300, "Browser passes while the LMS record disagrees."],
  ["03", "Molar", "QA for integration-heavy web apps.", 3200, "Molar wordmark and category."],
  ["04", "The URL", "Give Molar a URL.", 3600, "A URL is entered into Molar."],
  ["05", "The outcome", "Describe what should happen.", 5000, "Sign up, verify the email, and upgrade to Pro."],
  ["06", "Browser begins", "A real browser creates the account.", 4800, "The signup form completes and the account is created."],
  ["07", "Email observed", "The email actually arrives.", 4600, "A verification email arrives and its link opens."],
  ["08", "Payment", "Checkout completes safely.", 5000, "Checkout completes against a safe stateful service."],
  ["09", "Visible success", "The page says success.", 3900, "The browser displays Welcome to Pro."],
  ["10", "Reveal the chain", "Molar watches every handoff.", 5200, "Visible success unfolds into payment, webhook, and application state."],
  ["11", "Payment proof", "The payment was recorded.", 3900, "The payment amount, event, and customer agree."],
  ["12", "Broken webhook", "But the webhook failed.", 4400, "The webhook returns HTTP 500."],
  ["13", "Outcome mismatch", "The customer is still on Free.", 5200, "Browser says Pro while the subscription record says Free."],
  ["14", "Verdict", "One verdict, backed by evidence.", 4400, "Molar returns a failed verdict."],
  ["15", "Evidence bundle", "Everything needed to see why.", 5000, "Recording, trace, HAR, and screenshots file into the run."],
  ["16", "Release protected", "Before a customer finds it.", 4200, "The pull request is blocked."],
  ["17", "Rerun", "Fix it. Run the same journey again.", 4800, "A fix lands and the same journey restarts."],
  ["18", "Complete proof", "Now everything agrees.", 5200, "Browser, payment, webhook, and application state agree."],
  ["19", "Verification Memory", "Every release remembers what was proved.", 5600, "Passed, failed, stale, and untested states are bound to commits."],
  ["20", "Agent-native future", "Proof keeps up with the code.", 5000, "A coding agent invokes Molar and receives structured proof."],
].map(([number, title, caption, durationMs, reducedMotionLabel]) => ({
  id: `scene-${number}`,
  renderer: `renderScene${number}`,
  title,
  caption,
  durationMs,
  reducedMotionLabel,
}));

export const FOUNDER_BEATS = [
  ["founder-open", "Software is getting easier to build. But knowing whether it actually works is getting harder.", 6200],
  ["founder-origin", "At Wayground, I learned that a screen can look right while two systems still disagree.", 6800],
  ["founder-intro", "Hi, I'm Pratik, founder of Molar.", 4200],
  ["founder-promise", "You do two things. Molar follows everything else. Let me show you.", 6500],
  ["founder-turn", "That is where ordinary browser tests stop. Molar keeps going.", 5400],
  ["founder-verdict", "Molar does not call that a pass.", 4200],
  ["founder-close", "Ship the change. Know the outcome. That's Molar.", 6200],
].map(([id, copy, durationMs]) => ({ id, copy, caption: copy, durationMs }));

const products = PRODUCT_SCENES.map((scene) => scene.id);

export const CUTS = {
  founder: [
    "founder-open",
    "founder-origin",
    ...products.slice(0, 2),
    "founder-intro",
    ...products.slice(2, 5),
    "founder-promise",
    ...products.slice(5, 9),
    "founder-turn",
    ...products.slice(9, 13),
    "founder-verdict",
    ...products.slice(13),
    "founder-close",
  ],
  animated: [
    "founder-open",
    "founder-origin",
    ...products.slice(0, 2),
    "founder-intro",
    ...products.slice(2, 5),
    "founder-promise",
    ...products.slice(5, 9),
    "founder-turn",
    ...products.slice(9, 13),
    "founder-verdict",
    ...products.slice(13),
    "founder-close",
  ],
  customer: [
    "scene-02", "scene-04", "scene-05", "scene-06", "scene-07", "scene-08",
    "scene-09", "scene-10", "scene-12", "scene-13", "scene-14", "scene-15",
    "scene-16", "scene-17", "scene-18", "founder-close",
  ],
  investor: [
    "founder-open", "scene-01", "scene-02", "scene-03", "scene-04", "scene-05",
    "scene-10", "scene-13", "scene-14", "scene-19", "scene-20", "founder-close",
  ],
  launch: LAUNCH_CUT,
};

export const MASTER_NARRATION = `
Software is getting easier to build. But knowing whether it actually works is getting harder.

At Wayground, a learning platform used by 15 million people, I took ownership of LMS integrations handling more than 500,000 operations every day. I raised their reliability from 92% to 99.8%—and learned that a screen can look right while two systems still disagree.

Hi, I'm Pratik, founder of Molar. Molar is QA for integration-heavy web apps.

You do two things. Give Molar a URL and describe what should happen. Molar follows everything else.

Say you want to test: sign up, verify the email, and upgrade to Pro. Molar opens your app in a real browser. It creates the account, receives the email, follows the verification link, completes checkout, and watches what happens after the page says success.

That is where ordinary browser tests stop. Molar keeps going. It checks whether the payment was recorded, whether the webhook arrived, whether the subscription changed, and whether the customer can use what they paid for.

Here, the browser says Pro. But the subscription record still says Free. Molar does not call that a pass. It returns one verdict, with the recording, screenshots, network activity, and trace showing exactly where the outcome broke.

Fix the problem, and Molar runs the same journey again. This time, the browser, payment, webhook, and subscription all agree.

The longer Molar works with your product, the more it remembers: what each release proved, what changed, what is now stale, and which critical journeys still need evidence.

Coding agents can write more software than teams can manually verify. Molar is the independent proof layer that keeps up with them. Ship the change. Know the outcome. That's Molar.
`.trim();
