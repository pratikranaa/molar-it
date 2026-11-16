import { captionAt } from "./story.mjs";

export const C = {
  paper: "#f5f5ef",
  white: "#fffefa",
  ink: "#26342e",
  muted: "#738078",
  line: "#e0e5de",
  blue: "#527087",
  mist: "#e8eef0",
  green: "#4b8065",
  pale: "#e8f1e9",
  amber: "#a7714b",
  sand: "#f4eade",
};
export const clamp = (x) => Math.max(0, Math.min(1, x));
export const smooth = (x) => {
  x = clamp(x);
  return x * x * x * (x * (x * 6 - 15) + 10);
};
const at = (t, start = 0, duration = 0.9) => smooth((t - start) / duration);
const mix = (a, b, p) => a + (b - a) * p;

function box(c, x, y, w, h, r = 16, fill = C.white, stroke = null) {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
  if (fill) {
    c.fillStyle = fill;
    c.fill();
  }
  if (stroke) {
    c.strokeStyle = stroke;
    c.lineWidth = 1;
    c.stroke();
  }
}
function text(
  c,
  s,
  x,
  y,
  size = 26,
  color = C.ink,
  weight = 400,
  align = "left",
  font = "Instrument",
) {
  c.fillStyle = color;
  c.font = `${weight} ${size}px ${font}, Arial, sans-serif`;
  c.textAlign = align;
  c.textBaseline = "alphabetic";
  c.fillText(s, x, y);
}
function line(c, x1, y1, x2, y2, color = C.line, width = 1) {
  c.beginPath();
  c.moveTo(x1, y1);
  c.lineTo(x2, y2);
  c.strokeStyle = color;
  c.lineWidth = width;
  c.lineCap = "round";
  c.stroke();
}
function dot(c, x, y, r, color) {
  c.fillStyle = color;
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  c.fill();
}
function check(c, x, y, p = 1, color = C.green) {
  c.save();
  c.strokeStyle = color;
  c.lineWidth = 2.8;
  c.lineCap = "round";
  c.lineJoin = "round";
  c.beginPath();
  c.moveTo(x - 7, y);
  if (p < 0.36) c.lineTo(x - 7 + (6 * p) / 0.36, y + (6 * p) / 0.36);
  else {
    c.lineTo(x - 1, y + 6);
    c.lineTo(
      x - 1 + (12 * (p - 0.36)) / 0.64,
      y + 6 - (14 * (p - 0.36)) / 0.64,
    );
  }
  c.stroke();
  c.restore();
}
function tick(c, x, y, p = 1) {
  dot(c, x, y, 16, C.pale);
  check(c, x, y, p);
}
function icon(c, type, x, y, color = C.blue) {
  c.save();
  c.strokeStyle = color;
  c.lineWidth = 2;
  c.lineCap = "round";
  c.lineJoin = "round";
  c.beginPath();
  if (type === "mail") {
    c.roundRect(x - 12, y - 9, 24, 18, 3);
    c.moveTo(x - 11, y - 7);
    c.lineTo(x, y + 1);
    c.lineTo(x + 11, y - 7);
  } else if (type === "card") {
    c.roundRect(x - 13, y - 9, 26, 18, 3);
    c.moveTo(x - 12, y - 3);
    c.lineTo(x + 12, y - 3);
    c.moveTo(x - 7, y + 4);
    c.lineTo(x - 2, y + 4);
  } else if (type === "lock") {
    c.roundRect(x - 10, y, 20, 15, 3);
    c.moveTo(x - 6, y);
    c.lineTo(x - 6, y - 5);
    c.arc(x, y - 5, 6, Math.PI, 0);
    c.lineTo(x + 6, y);
  } else if (type === "code") {
    c.moveTo(x - 7, y - 9);
    c.lineTo(x - 15, y);
    c.lineTo(x - 7, y + 9);
    c.moveTo(x + 7, y - 9);
    c.lineTo(x + 15, y);
    c.lineTo(x + 7, y + 9);
    c.moveTo(x + 3, y - 12);
    c.lineTo(x - 3, y + 12);
  } else if (type === "arrow") {
    c.moveTo(x - 12, y);
    c.lineTo(x + 12, y);
    c.lineTo(x + 5, y - 7);
    c.moveTo(x + 12, y);
    c.lineTo(x + 5, y + 7);
  } else {
    c.arc(x, y, 11, 0.3, 5.7);
    c.moveTo(x + 10, y - 7);
    c.lineTo(x + 10, y - 15);
    c.lineTo(x + 2, y - 13);
  }
  c.stroke();
  c.restore();
}
function group(c, t, delay, dx, dy, fn) {
  const p = at(t, delay);
  c.save();
  c.globalAlpha *= p;
  c.translate((1 - p) * dx, (1 - p) * dy);
  fn(p);
  c.restore();
}
function card(
  c,
  x = 460,
  y = 252,
  w = 680,
  h = 332,
  label = "Molar",
  tag = "",
) {
  c.save();
  c.shadowColor = "#26342e10";
  c.shadowBlur = 36;
  c.shadowOffsetY = 16;
  box(c, x, y, w, h, 18);
  c.restore();
  box(c, x, y, w, h, 18, null, "#e8ebe4");
  text(c, label, x + 30, y + 41, 19, C.muted, 500);
  if (tag) text(c, tag, x + w - 30, y + 41, 17, C.muted, 400, "right");
  line(c, x + 28, y + 62, x + w - 28, y + 62);
  return { x, y, w, h };
}
function pill(c, label, x, y, color = C.green, fill = C.pale) {
  c.font = "500 18px Instrument, Arial";
  const w = c.measureText(label).width + 28;
  box(c, x, y - 23, w, 33, 16, fill);
  text(c, label, x + 14, y, 18, color, 500);
  return w;
}
function button(c, label, x, y, w = 220, p = 1) {
  box(c, x, y, w, 48, 8, C.blue);
  text(c, label, x + w / 2, y + 31, 21, C.white, 500, "center");
  if (p < 1) {
    c.save();
    c.globalAlpha = 0.25;
    box(c, x, y, w * (1 - p), 48, 8, C.white);
    c.restore();
  }
}
function field(c, label, value, x, y, w, t, delay = 0) {
  text(c, label, x, y - 11, 17, C.muted);
  box(c, x, y, w, 48, 7, C.white, C.line);
  const typed = value.slice(
    0,
    Math.floor(clamp((t - delay) / 1.35) * value.length),
  );
  text(c, typed, x + 16, y + 31, 23);
  if (t > delay && t < delay + 1.5)
    line(
      c,
      x + 18 + c.measureText(typed).width,
      y + 13,
      x + 18 + c.measureText(typed).width,
      y + 35,
      C.blue,
      1.5,
    );
}
function progress(c, x, y, w, p, color = C.green) {
  box(c, x, y, w, 5, 2, C.line);
  if (p > 0) box(c, x, y, w * clamp(p), 5, 2, color);
}
function rows(
  c,
  items,
  t,
  { x = 500, y = 370, gap = 62, delay = 0.5, status = true } = {},
) {
  items.forEach((s, i) =>
    group(c, t, delay + i * 0.34, 0, 12, () => {
      text(c, s, x, y + i * gap, 26);
      if (status && at(t, delay + 0.55 + i * 0.42) > 0)
        tick(c, x + 544, y + i * gap - 8, at(t, delay + 0.55 + i * 0.42));
      if (i < items.length - 1)
        line(c, x, y + i * gap + 23, x + 560, y + i * gap + 23);
    }),
  );
}
function wrap(c, value, maxWidth, size, weight = 400) {
  c.font = `${weight} ${size}px Instrument, Arial`;
  const result = [];
  let row = "";
  for (const word of value.split(" ")) {
    const next = row ? row + " " + word : word;
    if (c.measureText(next).width > maxWidth && row) {
      result.push(row);
      row = word;
    } else row = next;
  }
  if (row) result.push(row);
  return result;
}
function copy(
  c,
  value,
  x,
  y,
  maxWidth,
  size = 28,
  color = C.ink,
  weight = 400,
  align = "left",
  leading = 1.35,
) {
  wrap(c, value, maxWidth, size, weight).forEach((s, i) =>
    text(c, s, x, y + i * size * leading, size, color, weight, align),
  );
}

export function drawProduct(c, id, t) {
  // New artwork, not a screenshot or simulation of a live run.
  if (id === "discrepancy") {
    group(c, t, 0, -34, 0, () => {
      card(c, 420, 295, 360, 225, "Payment");
      tick(c, 461, 397, at(t, 0.9));
      text(c, "Payment accepted", 493, 405, 26);
      text(c, "$24.00 · test card", 461, 455, 21, C.muted);
    });
    group(c, t, 0.38, 34, 0, () => {
      card(c, 820, 295, 360, 225, "Customer account");
      icon(c, "lock", 862, 394, C.amber);
      text(c, "Still on Free", 894, 405, 28);
      text(c, "Pro is locked", 862, 455, 21, C.muted);
    });
    group(c, t, 1.3, 0, 8, () => {
      line(c, 780, 408, 820, 408, C.amber, 2);
      text(
        c,
        "One customer. Two different answers.",
        800,
        590,
        25,
        C.muted,
        400,
        "center",
      );
    });
  } else if (id === "environment") {
    card(c, 460, 275, 680, 286, "01 / Connect your test app", "Setup");
    field(
      c,
      "Staging URL",
      "https://staging.northstar.test",
      493,
      376,
      614,
      t,
      0.3,
    );
    group(c, t, 2, 0, 9, () => {
      tick(c, 510, 476, at(t, 2));
      text(c, "Test account connected", 540, 484, 24);
      pill(c, "Staging only", 950, 483, C.blue, C.mist);
    });
  } else if (id === "task") {
    card(c, 420, 246, 760, 360, "02 / Describe a customer journey");
    const parts = [
      "Sign up and verify the email.",
      "Buy Pro with a test card.",
      "Check that the account gets Pro access.",
    ];
    parts.forEach((s, i) => {
      const letters = Math.floor(clamp((t - 0.3 - i * 0.65) / 1.25) * s.length);
      text(c, s.slice(0, letters), 457, 365 + i * 45, 27);
    });
    group(c, t, 2.8, 0, 9, () => {
      button(c, "Check this journey", 457, 523, 249);
      text(c, "Northstar · signup to Pro", 738, 554, 20, C.muted);
    });
  } else if (id === "services") {
    card(c, 460, 235, 680, 372, "Prepare test services", "Supported services");
    const r = [
      ["card", "Payment"],
      ["mail", "Email"],
      ["lock", "Sign-in"],
    ];
    r.forEach(([kind, label], i) =>
      group(c, t, 0.25 + i * 0.42, 0, 18, () => {
        icon(c, kind, 509, 348 + i * 79);
        text(c, label, 544, 356 + i * 79, 26);
        progress(c, 803, 342 + i * 79, 206, at(t, 0.8 + i * 0.48));
        if (t > 1.4 + i * 0.48)
          check(c, 1060, 347 + i * 79, at(t, 1.4 + i * 0.48));
      }),
    );
  } else if (id === "snapshot") {
    const p = at(t, 1.2, 1.3);
    for (let i = 2; i >= 0; i--) {
      box(
        c,
        490 + i * mix(12, 0, p),
        285 + i * mix(17, 0, p),
        620,
        268,
        16,
        i ? C.mist : C.white,
        C.line,
      );
    }
    text(c, "Starting state", 526, 334, 20, C.muted);
    text(c, "Northstar / test services", 526, 398, 30, C.ink, 500);
    text(c, "Payment · email · sign-in records", 526, 439, 23, C.muted);
    group(c, t, 2.2, 0, 6, () => {
      tick(c, 542, 502);
      text(c, "Snapshot saved", 573, 510, 23);
    });
  } else if (id === "signup") {
    card(c, 510, 192, 580, 440, "northstar.test / signup");
    text(c, "Create your account", 544, 298, 30, C.ink, 500);
    field(c, "Name", "Sam Taylor", 544, 340, 512, t, 0.2);
    field(c, "Email", "sam@example.test", 544, 429, 512, t, 1.1);
    group(c, t, 1.8, 0, 4, () =>
      button(
        c,
        t > 3 ? "Account created" : "Create account",
        544,
        537,
        512,
        at(t, 2.5),
      ),
    );
  } else if (id === "email") {
    const p = at(t, 1.35, 1.15);
    card(c, 470, 245, 660, 345, "Test inbox", "1 message");
    group(c, t, 0.3, 34, 0, () => {
      box(c, 498, 333, 604, mix(65, 222, p), 10, C.mist);
      icon(c, "mail", 532, 365);
      text(c, "Verify your Northstar account", 565, 373, 24, C.ink, 500);
    });
    group(c, t, 1.65, 0, 12, () => {
      text(c, "Your verification code", 531, 444, 22, C.muted);
      text(c, "4  8  2  6  1  9", 531, 500, 39, C.ink, 500);
      text(c, "To sam@example.test", 531, 535, 18, C.muted);
    });
  } else if (id === "code") {
    card(c, 490, 265, 620, 305, "Northstar / verify email");
    text(c, "Enter your code", 526, 375, 29, C.ink, 500);
    "482619".split("").forEach((n, i) => {
      box(c, 527 + i * 88, 403, 74, 62, 8, C.white, C.line);
      group(c, t, 0.5 + i * 0.18, 0, 9, () =>
        text(c, n, 564 + i * 88, 445, 32, C.ink, 500, "center"),
      );
    });
    group(c, t, 2.1, 0, 8, () => {
      tick(c, 543, 522);
      text(c, "Email verified", 574, 530, 24);
    });
  } else if (id === "checkout") {
    card(c, 490, 220, 620, 402, "Northstar / billing", "Sample account");
    text(c, "Upgrade to Pro", 525, 333, 30, C.ink, 500);
    text(c, "$24", 1045, 337, 35, C.ink, 500, "right");
    text(c, "per month", 1045, 363, 18, C.muted, 400, "right");
    box(c, 525, 379, 550, 56, 8, C.mist);
    icon(c, "card", 552, 407);
    text(c, "Test card ending in 4242", 582, 416, 24);
    const p = at(t, 1.4);
    button(c, p > 0.97 ? "Payment submitted" : "Pay $24", 525, 489, 550, p);
    group(c, t, 0.7, 0, 5, () =>
      text(
        c,
        "Test environment · no real charge",
        800,
        581,
        19,
        C.muted,
        400,
        "center",
      ),
    );
  } else if (id === "payment") {
    card(c, 540, 235, 520, 378, "Payment receipt", "Test data");
    tick(c, 800, 357, at(t, 0.5));
    text(c, "Payment accepted", 800, 429, 34, C.ink, 500, "center");
    text(c, "$24.00", 800, 481, 38, C.ink, 400, "center");
    group(c, t, 1.25, 0, 9, () =>
      text(
        c,
        "payment_intent.succeeded",
        800,
        554,
        19,
        C.muted,
        400,
        "center",
        "Geist Mono",
      ),
    );
  } else if (id === "webhook") {
    card(
      c,
      445,
      210,
      710,
      425,
      "Payment → account update",
      "Illustrative request",
    );
    tick(c, 491, 325, at(t, 0.2));
    text(c, "Payment accepted", 524, 334, 26);
    const p = at(t, 0.65, 1.4);
    line(c, 491, 350, 491, 457, C.line, 2);
    line(c, 491, 350, 491, 350 + 107 * p, C.blue, 2);
    dot(c, 491, 350 + 107 * p, 5, C.blue);
    group(c, t, 1.9, 0, 12, () => {
      box(c, 520, 391, 590, 143, 10, C.sand);
      text(
        c,
        "POST /api/webhooks/payment",
        544,
        431,
        21,
        C.ink,
        500,
        "left",
        "Geist Mono",
      );
      pill(c, "HTTP 500", 544, 483, C.amber, C.white);
      text(c, "Account update failed", 695, 483, 22, C.amber);
    });
    group(c, t, 2.8, 0, 8, () =>
      text(c, "The charge did not become access.", 523, 582, 24, C.muted),
    );
  } else if (id === "access" || id === "unlocked") {
    const good = id === "unlocked",
      p = good ? at(t, 1, 1) : 0;
    card(c, 480, 225, 640, 390, "Northstar / Sam’s workspace");
    text(c, "Your plan", 515, 337, 20, C.muted);
    text(c, p > 0.6 ? "Pro" : "Free", 515, 392, 46, C.ink, 500);
    pill(
      c,
      p > 0.6 ? "Active" : "Payment received",
      good ? 929 : 882,
      378,
      p > 0.6 ? C.green : C.amber,
      p > 0.6 ? C.pale : C.sand,
    );
    box(c, 515, 427, 570, 100, 12, p > 0.6 ? C.pale : C.mist);
    if (p > 0.6) tick(c, 548, 477, at(t, 1.6));
    else icon(c, "lock", 548, 471, C.muted);
    text(c, "Brand launch project", 581, 474, 26, C.ink, 500);
    text(
      c,
      p > 0.6 ? "Open project →" : "Upgrade to Pro to open",
      581,
      508,
      21,
      p > 0.6 ? C.green : C.muted,
    );
    group(c, t, 1.9, 0, 9, () =>
      text(
        c,
        good
          ? "Payment and account access agree."
          : "Paid, but still locked out.",
        515,
        571,
        24,
        good ? C.green : C.amber,
      ),
    );
  } else if (id === "compare") {
    card(c, 395, 250, 810, 332, "One customer / inspect the outcome");
    const p = at(t, 0.4, 1.2);
    line(c, 800, 345, 800, 529, C.line);
    group(c, t, 0.2, -18, 0, () => {
      text(c, "Payment service", 432, 362, 19, C.muted);
      tick(c, 447, 418, p);
      text(c, "Accepted", 480, 427, 33, C.ink, 500);
      text(c, "$24.00 charged in test", 432, 490, 22, C.muted);
    });
    group(c, t, 0.85, 18, 0, () => {
      text(c, "Customer account", 838, 362, 19, C.muted);
      icon(c, "lock", 852, 414, C.amber);
      text(c, "Still Free", 886, 427, 33, C.ink, 500);
      text(c, "Expected Pro access", 838, 490, 22, C.muted);
    });
  } else if (id === "trace") {
    card(c, 390, 200, 820, 440, "Trace / signup to Pro", "Failed check");
    const items = [
      "Open checkout",
      "Submit payment",
      "Receive update",
      "Check access",
    ];
    items.forEach((s, i) => {
      group(c, t, 0.2 + i * 0.28, 0, 10, () => {
        dot(c, 436, 321 + i * 69, 5, i >= 2 ? C.amber : C.green);
        if (i < 3) line(c, 436, 338 + i * 69, 436, 371 + i * 69);
        text(c, s, 459, 329 + i * 69, 23, i >= 2 ? C.amber : C.ink);
      });
    });
    group(c, t, 1.4, 30, 0, () => {
      box(c, 739, 302, 433, 266, 10, C.mist);
      text(c, "Response", 764, 340, 18, C.muted);
      text(c, "HTTP 500", 764, 389, 30, C.amber, 500);
      text(
        c,
        "account_update_failed",
        764,
        437,
        19,
        C.ink,
        400,
        "left",
        "Geist Mono",
      );
      line(c, 764, 465, 1147, 465);
      text(c, "Expected Pro · found Free", 764, 503, 23);
      text(c, "First failed handoff", 764, 542, 19, C.muted);
    });
  } else if (id === "evidence") {
    card(c, 460, 235, 680, 370, "Result / signup to Pro", "Sample run");
    pill(c, "Failed", 493, 341, C.amber, C.sand);
    text(c, "Account stayed on Free", 602, 341, 27, C.ink, 500);
    [
      ["Recorded steps", "12 browser actions"],
      ["Request", "Payment update · HTTP 500"],
      ["Screenshot", "Account remained Free"],
    ].forEach(([a, b], i) =>
      group(c, t, 0.5 + i * 0.5, 26, 0, () => {
        box(c, 494, 371 + i * 64, 612, 53, 8, i === 2 ? C.mist : C.paper);
        text(c, a, 511, 405 + i * 64, 22);
        text(c, b, 1089, 405 + i * 64, 18, C.muted, 400, "right");
      }),
    );
  } else if (id === "unknown") {
    card(c, 480, 260, 640, 310, "Check result", "Evidence missing");
    group(c, t, 0.3, 0, 12, () =>
      pill(c, "Could not verify", 515, 374, C.blue, C.mist),
    );
    copy(c, "The service response was unavailable.", 515, 428, 540, 27);
    group(c, t, 1.6, 0, 8, () =>
      text(
        c,
        "Review the missing evidence before continuing.",
        515,
        519,
        22,
        C.muted,
      ),
    );
  } else if (id === "reset") {
    card(c, 470, 240, 660, 370, "Restore starting state", "Test services only");
    const p = at(t, 0.7, 1.8);
    [
      ["Payment records", 3],
      ["Inbox messages", 2],
      ["Sign-in sessions", 1],
    ].forEach(([s, n], i) => {
      text(c, s, 507, 363 + i * 69, 26);
      const val = String(Math.round(n * (1 - p)));
      text(
        c,
        val,
        1088,
        363 + i * 69,
        27,
        p > 0.9 ? C.green : C.muted,
        500,
        "right",
      );
      if (i < 2) line(c, 508, 386 + i * 69, 1090, 386 + i * 69);
    });
    group(c, t, 2.4, 0, 7, () => {
      tick(c, 523, 550);
      text(c, "Service state restored", 554, 558, 23, C.green);
      text(c, "Reset your app’s database separately.", 507, 592, 18, C.muted);
    });
  } else if (id === "retry") {
    card(c, 500, 270, 600, 297, "Saved workflow");
    text(c, "Signup → paid access", 537, 378, 32, C.ink, 500);
    text(c, "Updated revision · sample-02", 537, 425, 21, C.muted);
    button(c, t > 2 ? "Running again" : "Run again", 537, 469, 220);
    c.save();
    c.translate(1035, 486);
    c.rotate(at(t, 0.8, 1.6) * Math.PI * 2);
    icon(c, "reset", 0, 0);
    c.restore();
  } else if (id === "saved") {
    const p = at(t, 0.4, 1.5);
    box(c, 493, 285 + mix(19, 0, p), 620, 245, 16, C.mist);
    card(c, 480, 268, 640, 280, "Saved workflow", "Ready to rerun");
    text(c, "Signup → paid access", 514, 384, 31, C.ink, 500);
    text(c, "Browser steps + service checks", 514, 428, 23, C.muted);
    group(c, t, 1.8, 0, 8, () => {
      tick(c, 530, 488);
      text(c, "Keep with this project", 561, 496, 22);
    });
  } else if (id === "guard") {
    card(c, 460, 225, 680, 388, "Guard / preview deployment", "PR #48");
    text(c, "Checkout update", 497, 339, 30, C.ink, 500);
    rows(c, ["Sign in", "Invite a teammate", "Pay and get access"], t, {
      x: 497,
      y: 402,
      gap: 65,
      delay: 0.5,
    });
  } else if (id === "monitor") {
    card(c, 460, 265, 680, 310, "Guard / scheduled checks");
    text(c, "Check signup to Pro", 495, 372, 30, C.ink, 500);
    pill(c, "Approved test account", 495, 419, C.blue, C.mist);
    line(c, 519, 479, 1080, 479, C.line, 2);
    const p = at(t, 0.6, 2);
    line(c, 519, 479, 519 + 560 * p, 479, C.green, 2);
    [0, 1, 2, 3].forEach((i) => {
      dot(c, 519 + i * 186, 479, 7, i / 3 <= p ? C.green : C.line);
      text(
        c,
        ["09:00", "10:00", "11:00", "12:00"][i],
        519 + i * 186,
        523,
        19,
        C.muted,
        400,
        "center",
      );
    });
  } else if (id === "edgecases") {
    card(c, 440, 250, 720, 342, "Clones / test conditions");
    const p = at(t, 1.3, 1.1);
    box(c, 475, 341, 650, 55, 8, C.paper);
    box(c, 479 + mix(0, 326, p), 345, 317, 47, 7, C.white, C.line);
    text(
      c,
      "Card declined",
      636,
      377,
      22,
      p < 0.5 ? C.ink : C.muted,
      500,
      "center",
    );
    text(
      c,
      "Callback delayed",
      962,
      377,
      22,
      p > 0.5 ? C.ink : C.muted,
      500,
      "center",
    );
    group(c, t, 0.5, 0, 10, () => {
      text(
        c,
        p > 0.5 ? "Delay the payment update" : "Return a card decline",
        477,
        456,
        28,
        C.ink,
        500,
      );
      text(
        c,
        p > 0.5
          ? "Check access while the callback is pending."
          : "Check that the app explains the next step.",
        477,
        499,
        23,
        C.muted,
      );
      progress(c, 477, 542, 642, p, C.blue);
    });
  } else if (id === "inbox") {
    card(c, 490, 235, 620, 373, "Check the message", "Test inbox");
    icon(c, "mail", 537, 342);
    text(c, "Send welcome email", 573, 350, 26);
    const p = at(t, 0.6, 1.2);
    line(c, 537, 373, 537, 373 + 72 * p, C.blue, 2);
    group(c, t, 1.55, 0, -12, () => {
      box(c, 520, 449, 560, 107, 10, C.mist);
      tick(c, 550, 484);
      text(c, "Message received", 580, 491, 25, C.ink, 500);
      text(c, "To sam@example.test", 550, 533, 21, C.muted);
    });
  } else if (id === "map") {
    card(c, 470, 202, 660, 435, "Cartographer / observed routes");
    ["/signup", "/verify-email", "/billing", "/workspace"].forEach((s, i) =>
      group(c, t, 0.2 + i * 0.5, 0, -12, () => {
        if (i < 3) line(c, 515, 335 + i * 73, 515, 367 + i * 73);
        dot(c, 515, 317 + i * 73, 6, C.blue);
        text(c, s, 545, 327 + i * 73, 25, C.ink, 400, "left", "Geist Mono");
        check(c, 1077, 319 + i * 73, at(t, 0.6 + i * 0.5));
      }),
    );
  } else if (id === "export") {
    card(c, 415, 215, 770, 410, "Playwright export", "signup-to-pro.spec.ts");
    const lines = [
      "test('signup to Pro', async ({ page }) => {",
      "  await page.goto('/signup');",
      "  // Complete the supported journey",
      "  await expect(page.getByText('Pro'))",
      "    .toBeVisible();",
      "});",
    ];
    lines.forEach((s, i) =>
      group(c, t, 0.25 + i * 0.23, 20, 0, () =>
        text(
          c,
          s,
          449,
          330 + i * 43,
          20,
          i === 2 ? C.muted : C.blue,
          400,
          "left",
          "Geist Mono",
        ),
      ),
    );
    group(c, t, 2, 0, 6, () =>
      pill(c, "Illustrative excerpt", 907, 590, C.muted, C.paper),
    );
  } else if (id === "agent") {
    card(c, 385, 260, 830, 310, "Your coding agent", "CLI / MCP");
    text(c, "After installation and authentication", 420, 367, 19, C.muted);
    const s = 'molar verify "login works"';
    text(c, "$", 420, 428, 27, C.green, 500, "left", "Geist Mono");
    text(
      c,
      s.slice(0, Math.floor(at(t, 0.2, 2) * s.length)),
      452,
      428,
      27,
      C.ink,
      400,
      "left",
      "Geist Mono",
    );
    group(c, t, 1.55, 0, 9, () =>
      text(
        c,
        "--url http://localhost:3000 --json",
        453,
        472,
        23,
        C.blue,
        400,
        "left",
        "Geist Mono",
      ),
    );
    group(c, t, 2.6, 0, 5, () => {
      dot(c, 429, 525, 5, C.green);
      text(c, "Browser check requested", 451, 532, 20, C.muted);
    });
  } else if (id === "agent-result") {
    card(
      c,
      475,
      225,
      650,
      385,
      "Agent-readable result",
      "Simplified illustration",
    );
    const r = [
      "{",
      '  "status": "failed",',
      '  "check": "Pro access",',
      '  "expected": "Pro",',
      '  "observed": "Free"',
      "}",
    ];
    r.forEach((s, i) =>
      group(c, t, 0.3 + i * 0.19, 0, 8, () =>
        text(
          c,
          s,
          512,
          336 + i * 35,
          23,
          i === 1 ? C.amber : C.blue,
          400,
          "left",
          "Geist Mono",
        ),
      ),
    );
    group(c, t, 1.9, 0, 7, () =>
      text(c, "Inspect → change → test again", 513, 581, 23, C.muted),
    );
  }
}

function founderFrame(c, beat, t, width, height) {
  // Explicit camera guide. No generated likeness or pretend live footage.
  const sky = c.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, "#dfebed");
  sky.addColorStop(0.6, "#e7eee8");
  sky.addColorStop(1, "#c8d5c4");
  c.fillStyle = sky;
  c.fillRect(0, 0, width, height);
  const cx = width / 2,
    cy = height / 2 - 30;
  c.save();
  c.globalAlpha = 0.43;
  dot(c, cx + width * 0.38, 130, 190, "#f9faf3");
  c.fillStyle = "#baccc0";
  c.beginPath();
  c.ellipse(cx, cy + 270, width * 0.7, 140, 0, 0, Math.PI * 2);
  c.fill();
  c.restore();
  c.save();
  c.strokeStyle = "#62796b55";
  c.lineWidth = 2;
  c.setLineDash([8, 10]);
  c.beginPath();
  c.ellipse(cx, cy - 110, 82, 105, 0, 0, Math.PI * 2);
  c.stroke();
  c.beginPath();
  c.moveTo(cx - 190, cy + 225);
  c.bezierCurveTo(cx - 170, cy + 30, cx - 110, cy + 16, cx - 64, cy + 3);
  c.moveTo(cx + 190, cy + 225);
  c.bezierCurveTo(cx + 170, cy + 30, cx + 110, cy + 16, cx + 64, cy + 3);
  c.stroke();
  c.restore();
  text(c, "YOUR FOUNDER FOOTAGE", cx, cy + 282, 18, C.blue, 500, "center");
  text(
    c,
    `${beat.id.toUpperCase()} · ${beat.duration.toFixed(1)} second take`,
    cx,
    cy + 314,
    20,
    C.muted,
    400,
    "center",
  );
  text(c, "Pratik Rana", 58, height - 199, 25, C.ink, 500);
  text(c, "Founder, Molar", 58, height - 164, 20, C.muted);
  text(c, "PLACEHOLDER / replace with your recording", 58, 56, 18, C.blue, 500);
}

export function draw(
  c,
  beat,
  time,
  {
    width = 1600,
    height = 900,
    mode = "animated",
    captions = true,
    branding = true,
    footage = null,
  } = {},
) {
  const portrait = height > width;
  const designWidth = portrait ? 900 : 1600,
    designHeight = portrait ? 1600 : 900;
  c.save();
  c.scale(width / designWidth, height / designHeight);
  c.fillStyle = C.paper;
  c.fillRect(0, 0, designWidth, designHeight);
  const t = Math.max(0, time),
    fade = 1 - at(t, beat.duration - 0.55, 0.55);
  c.save();
  c.globalAlpha *= fade;
  if (beat.kind === "founder" && mode === "founder") {
    if (footage) {
      const scale = Math.max(
        designWidth / footage.videoWidth,
        designHeight / footage.videoHeight,
      );
      c.drawImage(
        footage,
        (designWidth - footage.videoWidth * scale) / 2,
        (designHeight - footage.videoHeight * scale) / 2,
        footage.videoWidth * scale,
        footage.videoHeight * scale,
      );
    } else founderFrame(c, beat, t, designWidth, designHeight);
  } else {
    if (branding) {
      text(c, "Molar.", 52, 58, 27, C.ink, 600);
      text(
        c,
        beat.kind === "product"
          ? "ILLUSTRATIVE PRODUCT SCENE"
          : "LAUNCH FILM / NARRATION PENDING",
        designWidth - 52,
        54,
        14,
        C.muted,
        500,
        "right",
      );
    }
    c.save();
    c.translate((designWidth - 1600) / 2, (designHeight - 900) / 2);
    if (beat.kind === "product") {
      text(c, beat.chapter.toUpperCase(), 800, 158, 15, C.muted, 500, "center");
      c.save();
      const p = at(t + 0.14, 0, 0.8);
      c.globalAlpha *= 0.15 + 0.85 * p;
      c.translate(800, 420);
      c.scale(0.987 + 0.013 * p, 0.987 + 0.013 * p);
      c.translate(-800, -420);
      drawProduct(c, beat.id, t);
      c.restore();
      text(
        c,
        String(beat.index).padStart(2, "0"),
        800,
        702,
        15,
        C.muted,
        400,
        "center",
        "Geist Mono",
      );
    } else {
      const isClose = beat.id.includes("close");
      group(c, t, -0.65, 0, 14, () => {
        text(
          c,
          isClose ? "Molar." : "MOLAR / THE STORY",
          800,
          315,
          isClose ? 36 : 17,
          isClose ? C.ink : C.muted,
          500,
          "center",
        );
        const lines = wrap(c, beat.title, portrait ? 750 : 1020, 62, 500);
        lines.forEach((s, i) =>
          text(c, s, 800, 410 + i * 76, 62, C.ink, 500, "center"),
        );
        if (isClose) {
          text(c, "molar.it", 800, 584, 29, C.blue, 500, "center");
          text(
            c,
            "Start with one customer journey.",
            800,
            627,
            22,
            C.muted,
            400,
            "center",
          );
        }
      });
    }
    c.restore();
  }
  c.restore();
  if (captions) {
    const s = captionAt(beat, t);
    const maxWidth = portrait ? 790 : 1180;
    const lines = wrap(c, s, maxWidth, 29);
    const ww =
      Math.max(
        ...lines.map((l) => {
          c.font = "400 29px Instrument, Arial";
          return c.measureText(l).width;
        }),
      ) + 38;
    const hh = lines.length * 40 + 16;
    const yy = designHeight - (portrait ? 100 : 52) - hh;
    c.save();
    c.globalAlpha = 0.91;
    box(c, (designWidth - ww) / 2, yy, ww, hh, 6, "#28312d");
    c.restore();
    lines.forEach((l, i) =>
      text(
        c,
        l,
        designWidth / 2,
        yy + 37 + i * 40,
        29,
        "#fffefa",
        400,
        "center",
      ),
    );
  }
  c.restore();
}
