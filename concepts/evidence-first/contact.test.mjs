import assert from "node:assert/strict";
import test from "node:test";
import { buildContactMailto, validateContact } from "./contact.js";

const valid = {
  email: "dev@example.com",
  company: "Atlas & Co",
  appUrl: "https://staging.example.com/checkout?a=1&b=2",
  teamSize: "11–50",
  flow: "Verify checkout + OTP / recovery",
};

test("valid contact data produces a fully encoded Molar email", () => {
  const href = buildContactMailto(valid);
  assert.ok(href.startsWith("mailto:pratik@molar.it?"));
  assert.match(href, /Atlas%20%26%20Co/);
  assert.match(href, /Verify%20checkout%20%2B%20OTP%20%2F%20recovery/);
  assert.match(href, /a%3D1%26b%3D2/);
});

test("contact validation reports both required fields together", () => {
  assert.deepEqual(validateContact({ ...valid, email: "", flow: "" }), {
    email: "Enter your work email.",
    flow: "Describe the flow you need verified.",
  });
});

test("contact validation rejects a malformed email", () => {
  assert.deepEqual(validateContact({ ...valid, email: "not-an-email" }), {
    email: "Enter a valid work email.",
  });
});
