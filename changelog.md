# Molar changelog

> For AI agents: this is every customer-visible change to Molar, newest first, regenerated on every deploy. Site index: https://molar.it/llms.txt. RSS: https://molar.it/changelog.xml. Web page: https://molar.it/changelog.

## Current versions

- `@molar/cli` 0.3.12 (2026-10-15): `npm install -g @molar/cli`
- `@molar/reporter` 0.3.7 (2026-10-26): `npm install -D @molar/reporter`
- `molar-agent` 0.3.7 (2026-08-08): `npx molar-agent init`

## November 2026

### 2026-11-09 · Compare Molar with QA Wolf and mabl.

Improved · Website & docs, Beta terms · https://molar.it/changelog#2026-11-09-comparisons-and-clearer-limits

Two new comparison pages, written from each vendor’s own pricing page, and docs that describe what each feature does for you.

- **New:** [Molar vs QA Wolf](https://molar.it/vs/qa-wolf) and [Molar vs mabl](https://molar.it/vs/mabl), each ending with when to choose which.
- **Changed:** Guard runs, on pull requests or on a schedule, don’t count toward the 25 hosted runs a day.
- **Improved:** Developer tools lists the fields `molar verify --json` returns and the statuses a task moves through.
- **Improved:** The docs are rewritten around what you do and get. Old pages about Molar’s internals redirect to the nearest page.

### 2026-11-08 · The agent filters and sorts before it browses.

Improved · Agent runs · https://molar.it/changelog#2026-11-08-filters-before-browsing

When a site has filter or sort controls, the agent now applies them before reading results, so a goal like “the cheapest plan billed yearly” needs fewer steps.

- **Improved:** Searching a page for text scrolls to the match.
- **New:** A new step reads a whole list from the page at once.
- **Improved:** Before it finishes, the agent scrolls the evidence for its answer into view, so the final screenshot shows it.

### 2026-11-05 · Repeat runs replay cleanly.

Fixed · Agent runs · https://molar.it/changelog#2026-11-05-repeat-runs-replay-cleanly

A replay of an earlier run was sometimes rejected and the steps redone from scratch. Replays now go through, and each replayed step names the element it acted on.

### 2026-11-04 · One agent for every hosted run, and repeat runs without the model.

Changed · Agent runs · https://molar.it/changelog#2026-11-04-one-agent-and-replays

Every hosted run now uses the agent introduced on October 25; the earlier agent is retired. When you repeat a goal that already passed, Molar replays the verified earlier run without calling the model, and the agent takes over only where the page has changed.

```
curl -X POST https://api.molar.it/api/v1/agent/tasks \
  -H "Authorization: Bearer $MOLAR_TOKEN" -H "Content-Type: application/json" \
  -d '{"url": "https://staging.your-app.com", "goal": "log in and open billing",
       "runtime": {"cache": false}}'
```

- **Removed:** Requests for any other `agent_version` now return HTTP 422.
- **New:** Put `{{email}}` in a task to get a throwaway inbox for that run, for sign-ups that email a code. It is deleted when the run ends. (Preview)
- **Improved:** A run restarted after a crash never repeats a change it already sent. It ends as failed with `uncertain_after_restart` instead.
- **New:** When a page’s own controls don’t work, the agent can read the site’s API instead. Writes through the API need `runtime.api_writes` (or MCP `api_writes`). (Preview)

### 2026-11-04 · 28 MCP tools that failed now work, and task webhooks arrive.

Fixed · CLI & MCP · https://molar.it/changelog#2026-11-04-mcp-tools-and-webhooks

Tools for screenshots, reading the screen, locating and filling elements, capturing network traffic, mapping a site, scenarios, skills, and running, repairing and exporting automations returned errors. They now work against hosted runs.

- **Fixed:** A task’s `webhook_url` was never called. Molar now delivers it, signed, when the task ends.
- **New:** MCP tools for batches (one task per free browser), schedules and watches (at most every 5 minutes, 20 per organization). (Preview)
- **New:** MCP tools for a disposable email identity: create one, read its messages and one-time codes, and use it to sign up. One exists at a time and each lasts 24 hours. (Preview)

### 2026-11-04 · The API schema is no longer public.

Changed · Security & privacy · https://molar.it/changelog#2026-11-04-api-schema-private

api.molar.it no longer serves its schema or interactive API pages to anyone who asks. The HTTP API itself is unchanged; the docs describe the calls you can make.

### 2026-11-03 · Plan tests from one broad goal.

New · Preview · Agent runs, Dashboard · https://molar.it/changelog#2026-11-03-test-planning

Ask for “a test plan” or “the whole site” and Molar explores without submitting anything, plans scenarios from what it saw, then runs each one as its own test. On the planning run’s page you choose which scenarios to keep.

- **New:** Onboarding, Start exploration and Cartographer coverage use the planner, as do the MCP tools `molar_explore_target` and `molar_generate_scenarios_from_url`.
- **Changed:** Not in the npm CLI yet. In CLI 0.3.12, `molar explore` uses a retired flow; explore from the dashboard or MCP until the next CLI release.

### 2026-11-03 · Two hosted runs at a time.

Changed · Beta terms · https://molar.it/changelog#2026-11-03-two-hosted-runs

Hosted browsers now run two at a time across Molar, up from one. Further runs wait in a queue and start on their own.

### 2026-11-03 · Exported tests from signed-in runs sign in first.

Improved · Exports, Agent runs · https://molar.it/changelog#2026-11-03-exports-and-viewports

A run that started from a saved profile now exports a test that signs in before it does anything else, so it passes on a fresh browser.

- **Improved:** A run that typed two different passwords exports each as its own secret.
- **Changed:** Exported tests wait at most 30 seconds for each action and 60 seconds for each page load.
- **Improved:** Runs keep the viewport you ask for, such as a 390×844 phone, instead of switching to desktop.
- **Fixed:** A replay refused before it started no longer holds a hosted browser. It had kept other runs, including first runs, queued for up to 20 minutes.
- **Fixed:** The agent always reports what it found on its last step.

### 2026-11-02 · Exported tests wait for what each action changed.

Improved · Exports, Dashboard · https://molar.it/changelog#2026-11-02-exports-wait-on-effects

Instead of fixed pauses, each step in an exported test waits for the change the agent saw: a new URL, an element that appears, or a row that disappears.

- **Improved:** A click that opens a new tab exports as a popup the test follows.
- **Fixed:** A browser error page now counts as a failed load instead of a page.
- **Fixed:** A new account’s first dashboard visit no longer shows errors.

## October 2026

### 2026-10-26 · Exported tests repair themselves when replay fails.

New · Exports, Agent runs · https://molar.it/changelog#2026-10-26-exports-repair-themselves

Molar replays every exported test without the agent. If the replay fails, it repairs the test and replays it again. A repair never removes or weakens a check.

- **New:** The agent can upload files, capture downloads and drag elements.
- **Improved:** Exported tests use the run’s viewport, dismiss popups that block the page, and wait correctly for slow page loads.

### 2026-10-26 · Dashboard recordings never capture your run content.

Improved · Security & privacy · https://molar.it/changelog#2026-10-26-replays-mask-content

Our product analytics record how the dashboard is used. Those recordings now mask all text and every input, block images and video, drop query strings from URLs, and record no console output.

### 2026-10-26 · @molar/reporter 0.3.7 uploads to the right address.

Fixed · CLI & MCP, Trace · https://molar.it/changelog#2026-10-26-reporter-0-3-7

In 0.3.6 the default upload address returned 404, so results from your own Playwright or Cypress suite never reached Trace. Upgrade to 0.3.7.

```
npm install -D @molar/reporter@0.3.7
```

### 2026-10-26 · Pricing, security and setup, in plain words.

Improved · Website & docs · https://molar.it/changelog#2026-10-26-pricing-and-security-pages

A Pricing page with the beta limits and how long data is kept, a Security page that says what we do and haven’t done yet, and developer pages with commands you can copy.

- **New:** Hosted runs come from one static IP address, published on the Security page so you can allowlist it.
- **New:** `/.well-known/security.txt` and a real example run with the test it exported.
- **Fixed:** The docs’ login, live view, run output, extract and CLI examples now match the product.

### 2026-10-25 · A new browser agent for hosted runs.

New · Agent runs · https://molar.it/changelog#2026-10-25-new-agent

Hosted task runs use a new agent. It checks each step against your goal as it works and can export the run as a Playwright test.

- **New:** Where your task says “verify”, the agent checks it during the run, and the exported test contains the same check at the same point.
- **New:** Saved logins (`{{username}}`, `{{password}}`, `{{totp}}`) and protected values are typed only when needed, and only on your project’s hosts.
- **New:** Sites behind your own bot protection: a project setting makes hosted runs and exported tests send a secret header only to your hosts.
- **Improved:** Runs and their recordings are named after their goal.

### 2026-10-24 · The run debugger shows the real failure reason.

Fixed · Dashboard · https://molar.it/changelog#2026-10-24-debugger-failure-reason

The debugger now shows the reason saved with the failed run instead of a generic message.

### 2026-10-21 · A new dashboard.

New · Dashboard · https://molar.it/changelog#2026-10-21-new-dashboard

Home starts with one box, “What should Molar do?”, and the rest is organised around Tasks, Tests, Runs, Issues, mock services, Recordings and Releases.

- **Improved:** Chat has no message cap, can create saved tests, and conversations can be deleted.
- **Improved:** Clearer feedback while the agent acts.

### 2026-10-16 · Exports use your app’s own test IDs.

Improved · Exports, Beta terms · https://molar.it/changelog#2026-10-16-test-ids-and-spend-limit

If your app marks elements with a test-id attribute, such as `data-test`, exported tests use it.

- **Changed:** A run that reaches the daily AI spend limit ends with `spend_limit_reached`.

### 2026-10-15 · Molar is free during the beta.

Changed · Beta terms, Website & docs · https://molar.it/changelog#2026-10-15-free-beta

No card and no plan to pick. Each organization gets up to 25 hosted runs and $10 of AI model use a day, reset at 00:00 UTC. The 26th run is refused with HTTP 429 `daily_run_limit_reached`.

- **New:** Privacy policy, terms of service, a data processing addendum, a subprocessors list and a security page.
- **New:** A public status page at [status.molar.it](https://status.molar.it), checked every 5 minutes.
- **New:** Docs pages for limits, ad blocking and cross-app flows.

### 2026-10-15 · @molar/cli 0.3.12.

New · CLI & MCP · https://molar.it/changelog#2026-10-15-cli-0-3-12

The first CLI release since August. It brings hosted exports, saved browser profiles and the Guard commands to the terminal.

```
npm install -g @molar/cli
```

- **New:** `molar run --execution hosted --export <dir>` downloads the replay-checked test package.
- **New:** `--block-ads`, `--profile` and `molar profiles`, `molar explain`.
- **New:** `molar guard failures`, `preflight` and `promote`; `molar mender status`; `molar requests`; `molar branches`; `molar scenarios publish`.

### 2026-10-15 · The Guard GitHub Action.

New · Guard · https://molar.it/changelog#2026-10-15-guard-action

Add `pratikranaa/guard-action@v1` to a workflow to run a registered scenario on every pull request. Start in advisory mode, then make it a required check.

```
- uses: pratikranaa/guard-action@v1
  with:
    api-key: ${{ secrets.MOLAR_API_KEY }}
    scenario-id: checkout
    base-url: https://staging.your-app.com
    mode: advisory
```

### 2026-10-13 · Block ads, and follow your app to other sites.

New · Agent runs · https://molar.it/changelog#2026-10-13-ads-and-cross-app

Ad-heavy pages slow runs and break exported tests. `--block-ads` blocks well-known ad and consent hosts in the hosted browser and in the exported test.

- **New:** The agent can follow your app to other public sites, such as an OAuth sign-in or a hosted checkout. Private addresses stay blocked.

### 2026-10-09 · Run recordings are kept for 5 days.

Changed · Beta terms, Exports · https://molar.it/changelog#2026-10-09-retention

Screenshots, video, network captures and Playwright traces are deleted automatically after 5 days. Download anything you need to keep. Exported tests stay in your account.

- **Improved:** Exported tests put one statement on each line.

### 2026-10-07 · Exported tests read like hand-written Playwright.

Improved · Exports · https://molar.it/changelog#2026-10-07-readable-exports

Exports find elements by their role and label where the page provides them, so tests are easier to review and keep.

### 2026-10-05 · Dashboard fixes.

Fixed · Dashboard · https://molar.it/changelog#2026-10-05-dashboard-fixes

Clearer error messages with a way to recover, account navigation that works on phones, and Runs filters that stay in the URL so you can share them.

### 2026-10-01 · Scheduled-run failures go to Mender.

New · Preview · Guard · https://molar.it/changelog#2026-10-01-mender-schedules

When a scheduled Guard run fails and Mender is on, the failure is passed to Mender for a fix suggestion.

## September 2026

### 2026-09-29 · Pull request checks link to evidence you can open.

Fixed · Guard · https://molar.it/changelog#2026-09-29-pr-evidence-links

Check results on a pull request linked to screenshots nobody outside Molar could open. They now link to the run’s evidence in the dashboard.

### 2026-09-27 · The public page check explains incomplete results.

Improved · Website & docs · https://molar.it/changelog#2026-09-27-public-check-results

When [the public check](https://molar.it/verify) can’t finish, it now says why instead of showing an empty result.

### 2026-09-07 · Signed-in visitors go straight to the dashboard.

Improved · Dashboard, Website & docs · https://molar.it/changelog#2026-09-07-signed-in-navigation

If you are already signed in, the sign-in and sign-up pages take you to the dashboard, and molar.it’s navigation shows that you are signed in.

### 2026-09-05 · A new molar.it.

New · Website & docs · https://molar.it/changelog#2026-09-05-new-website

Product pages, a searchable catalog of Clones, an MCP setup page, practical QA guides, and a free check of any public page.

### 2026-09-04 · Hosted runs reopen as a private beta.

Changed · Beta terms, Dashboard · https://molar.it/changelog#2026-09-04-hosted-runs-reopen

Hosted runs were paused on August 13. They are back, with sign-in by email link, personal API tokens you can see and revoke, and a way to cancel a run.

## August 2026

### 2026-08-16 · One dashboard for every Molar product.

New · Dashboard · https://molar.it/changelog#2026-08-16-one-dashboard

Cartographer, Clones, Guard and Trace share one dashboard at app.molar.it, with one navigation and one set of organization settings.

### 2026-08-04 · Connect any MCP client.

New · CLI & MCP · https://molar.it/changelog#2026-08-04-mcp-setup

[mcp.molar.it](https://mcp.molar.it) has setup steps for 25 MCP clients, and the hosted server is at `https://api.molar.it/mcp`.

```
claude mcp add --transport http molar https://api.molar.it/mcp
```

### 2026-08-02 · @molar/cli 0.3.6 and @molar/reporter 0.3.6.

Improved · CLI & MCP · https://molar.it/changelog#2026-08-02-cli-0-3-6

Clearer run output in the CLI, and the first reporter for sending results from an existing Playwright or Cypress suite.
