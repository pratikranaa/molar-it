const product = (id, renderer, durationMs, caption, motion) => ({
  id,
  kind: "product",
  renderer,
  durationMs,
  caption,
  reducedMotionLabel: caption,
  motion,
});

const founder = (number, durationMs, copy) => ({
  id: `launch-founder-${String(number).padStart(2, "0")}`,
  kind: "founder",
  durationMs,
  copy,
  caption: copy,
  motion: "settle",
});

export const LAUNCH_NARRATION = `
At Wayground, used by 15 million people, I learned a browser can say success while the system underneath still failed.

That is the problem Molar solves.

Molar verifies user journeys across the browser and the services behind them.

You give it two things: your app URL and the outcome that must work.

Say: sign up, verify the email, and upgrade to Pro.

Molar creates the account, receives the email, completes checkout, and follows every handoff.

The page says “Welcome to Pro.”

Ordinary browser tests stop there. Molar keeps going.

It checks the payment, webhook, and subscription record.

Here, the browser says Pro, but the customer is still on Free.

Molar does not call that a pass.

It returns one verdict, with the recording and trace showing where the journey broke.

Fix it, run the same journey again, and now every system agrees.

Over time, Molar remembers what each release proved and what still needs evidence.

Coding agents can move fast. Molar keeps the proof independent.

Ship the change. Know the outcome.
`.trim();

export const LAUNCH_FOUNDER_BEATS = [
  founder(1, 4_000, "At Wayground, I learned a browser can say success while the system underneath still failed."),
  founder(2, 3_500, "That is the problem Molar solves."),
  founder(3, 3_000, "You give it two things."),
  founder(4, 2_500, "Sign up, verify the email, and upgrade to Pro."),
  founder(5, 3_500, "Ordinary browser tests stop there. Molar keeps going."),
  founder(6, 3_000, "Molar does not call that a pass."),
  founder(7, 4_000, "Coding agents can move fast. Molar keeps the proof independent."),
];

export const LAUNCH_PRODUCT_BEATS = [
  product("launch-scale", "renderScene01", 2_500, "Wayground · 15M people · 500K+ daily operations", "rise"),
  product("launch-disagreement", "renderScene02", 2_500, "The browser can say success while the system underneath fails.", "opposed"),
  product("launch-category", "renderScene03", 2_500, "Molar verifies user journeys.", "rise"),
  product("launch-definition", "renderScene10", 3_000, "Across the browser and the services behind them.", "unfold"),
  product("launch-url", "renderScene04", 2_250, "Your app URL.", "rise"),
  product("launch-outcome", "renderScene05", 2_250, "The outcome that must work.", "expand"),
  product("launch-signup", "renderScene06", 2_500, "Molar creates the account.", "rise"),
  product("launch-email", "renderScene07", 2_500, "The verification email arrives.", "drop"),
  product("launch-checkout", "renderScene08", 2_500, "Checkout completes.", "lateral"),
  product("launch-visible-success", "renderScene09", 2_500, "The page says Welcome to Pro.", "settle"),
  product("launch-payment", "renderScene11", 2_000, "The payment is recorded.", "rise"),
  product("launch-webhook", "renderScene12", 2_000, "But the webhook fails.", "drop"),
  product("launch-contradiction", "renderScene13", 2_500, "Browser: Pro. Subscription: Free.", "opposed"),
  product("launch-verdict", "renderScene14", 2_500, "One evidence-backed verdict.", "converge"),
  product("launch-evidence", "renderScene15", 2_500, "Recording and trace show where the journey broke.", "file"),
  product("launch-release", "renderScene16", 2_000, "The broken release is blocked.", "drop"),
  product("launch-rerun", "renderScene17", 2_000, "Fix it. Run the same journey again.", "rerun"),
  product("launch-agreement", "renderScene18", 2_000, "Now every system agrees.", "handoff"),
  product("launch-memory-agent", "renderLaunchMemoryAgent", 6_000, "Molar remembers what each release proved and returns that proof to coding agents.", "memory-agent"),
];

export const LAUNCH_CLOSE_BEAT = {
  id: "launch-close",
  kind: "close",
  renderer: "renderLaunchClose",
  durationMs: 3_000,
  caption: "Ship the change. Know the outcome.",
  reducedMotionLabel: "Molar. Ship the change. Know the outcome.",
  motion: "settle",
};

const [f1, f2, f3, f4, f5, f6, f7] = LAUNCH_FOUNDER_BEATS;
const [
  scale, disagreement, category, definition, url, outcome, signup, email,
  checkout, visibleSuccess, payment, webhook, contradiction, verdict, evidence,
  release, rerun, agreement, memoryAgent,
] = LAUNCH_PRODUCT_BEATS;

export const LAUNCH_CUT = [
  f1.id, scale.id, disagreement.id,
  f2.id, category.id, definition.id,
  f3.id, url.id, outcome.id,
  f4.id, signup.id, email.id, checkout.id, visibleSuccess.id,
  f5.id, payment.id, webhook.id, contradiction.id,
  f6.id, verdict.id, evidence.id, release.id, rerun.id, agreement.id,
  memoryAgent.id, f7.id, LAUNCH_CLOSE_BEAT.id,
];

export const LAUNCH_CAPTION_CUES = [
  [0, 4_500, "At Wayground, used by 15 million people,"],
  [4_500, 9_000, "I learned a browser can say success while the system underneath still failed."],
  [9_000, 12_500, "That is the problem Molar solves."],
  [12_500, 18_000, "Molar verifies user journeys across the browser and the services behind them."],
  [18_000, 21_000, "You give it two things:"],
  [21_000, 23_500, "your app URL"],
  [23_500, 28_000, "and the outcome that must work. Say: sign up, verify the email, and upgrade to Pro."],
  [28_000, 33_000, "Molar creates the account and receives the email,"],
  [33_000, 38_000, "completes checkout, and follows every handoff. The page says Welcome to Pro."],
  [38_000, 41_500, "Ordinary browser tests stop there. Molar keeps going."],
  [41_500, 45_500, "It checks the payment, webhook, and subscription record."],
  [45_500, 51_000, "Here, the browser says Pro, but the customer is still on Free. Molar does not call that a pass."],
  [51_000, 56_000, "It returns one verdict, with the recording and trace showing where the journey broke."],
  [56_000, 62_000, "Fix it, run the same journey again, and now every system agrees."],
  [62_000, 68_000, "Over time, Molar remembers what each release proved and what still needs evidence."],
  [68_000, 72_000, "Coding agents can move fast. Molar keeps the proof independent."],
  [72_000, 75_000, "Ship the change. Know the outcome."],
].map(([startMs, endMs, text]) => ({ startMs, endMs, text }));
