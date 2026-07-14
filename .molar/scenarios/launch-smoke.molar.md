---
spec_version: "1.0"
id: "019fa5f4-cb4f-7000-9cb7-01d391d38f8f"
slug: molar-launch-smoke
description: Public launch surface stays reachable while a destruction-safe Stripe world is attached.
tags: [dogfood, launch, marketing, stripe]
owner: platform
priority: critical
clones:
  - kind: stripe
    seed: "molar-launch-smoke-v1"
    persistence: memory
environment: [production]
timeout_ms: 30000
retries: 0
assertions:
  no_console_errors: true
  no_unhandled_rejections: true
viewport: desktop
locale: en-US
---

# Molar launch smoke

The public homepage is replayed from an immutable commit and a captured HAR,
with a fresh deterministic Stripe Clone attached to the run.

## Steps

1. Navigate to /
2. Assert page status is 200
3. Assert text "Molar reads your app, writes end-to-end tests, and guards production — without real cards, emails, or user accounts." is visible
4. Advance_clock 1s
5. Screenshot {name: launch-home, full_page: true}
