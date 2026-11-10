# What’s new in Molar

New things you can do with Molar, newest first. Web page: https://molar.it/changelog. RSS: https://molar.it/changelog.xml.

## Ask for the cheapest plan, and Molar uses the site’s own filters

2026-11-08 · Improvement

Finding “the cheapest plan billed yearly” used to mean reading every option on the page. Molar now sets the site’s filters and sorting first, then reads what is left, and its final screenshot shows the answer it found.

## Checks you run again finish faster

2026-11-04 · Performance & security

Running the same check every morning took as long as the first time. Now a check that already passed repeats much faster, and Molar only works through the parts of the page that changed.

https://molar.it/platform/browser-agents

## Test sign-ups that email a verification code

2026-11-04 · New · Preview

A sign-up that sends a code by email used to stop a test at the inbox. Put {{email}} in your task and Molar signs up with a fresh inbox for that run, reads the code and finishes the sign-up.

https://molar.it/solutions/authentication-testing

## Get a call to your server when a task finishes

2026-11-04 · New

Waiting on a long task meant checking back until it was done. Add a webhook URL to the task and Molar calls it, signed, the moment the task ends.

https://molar.it/platform/developer-tools

## Run a task on a schedule, or watch a page for changes

2026-11-04 · New · Preview

Checking the same page by hand every few hours is easy to forget. Ask your coding agent to schedule a task, or to watch a page, and Molar runs it for you as often as every 5 minutes.

https://molar.it/platform/developer-tools

## Get a test plan for your whole app from one sentence

2026-11-03 · New · Preview

Deciding what to test in an app you didn’t write takes hours of clicking around. Ask Molar for “a test plan for this site” and it explores without submitting anything, proposes the scenarios worth checking, and runs the ones you keep as tests.

https://molar.it/products/cartographer

## Two hosted runs at a time

2026-11-03 · Performance & security

During the beta, hosted runs went one at a time, so a second run had to wait. Two now run side by side, and any others start on their own as soon as a browser is free.

https://molar.it/pricing

## Test your app at phone size

2026-11-03 · Improvement

Checking a mobile layout meant a run at desktop size and a guess. Ask for a phone viewport, such as 390 × 844, and the run and the test it exports both stay at that size.

## Tests from signed-in runs sign in on their own

2026-11-03 · Improvement

A test exported from a signed-in run used to fail on a fresh browser. It now signs in first, with your secrets kept out of the test file, so it passes in CI.

## Exported tests wait for the page, not a timer

2026-11-02 · Improvement

Tests that pause for a fixed number of seconds pass on a fast day and fail on a slow one. Each step in an exported test now waits for the change it expects, such as a new page or a row that appears.

## Exported tests are checked and fixed before you get them

2026-10-26 · New

A generated test that fails the first time you run it is worse than none. Molar now runs every exported test on its own before handing it over, and if it fails, fixes it and runs it again. A fix never removes or weakens a check.

https://molar.it/products/cartographer

## Upload files, download files and drag items

2026-10-26 · New

Flows with a file picker, a download button or a drag-and-drop board couldn’t be tested end to end. Molar can now upload a file, capture a download and drag an item, and the exported test does the same.

## Your run content stays out of our product analytics

2026-10-26 · Performance & security

We record how the dashboard is used so we can improve it. Those recordings now hide all text, inputs, images and video, so your goals, the sites you test and your results never appear in them.

https://molar.it/security

## Add checks in the middle of a task

2026-10-25 · New

A run that only checks the last screen can miss a broken step along the way. Write “verify” anywhere in your task and Molar checks it at that point, and the exported test keeps the same check in the same place.

https://molar.it/platform/browser-agents

## Sign in with a saved test login

2026-10-25 · New

Pasting a test password into every task is tedious and easy to leak. Save a test login once, refer to it in a task, and Molar types it only on your own project’s sites.

https://molar.it/security

## Test sites behind your own bot protection

2026-10-25 · New

Bot protection on your own site can block your tests too. Turn on the test-traffic setting in your project and add one rule to your firewall, and Molar’s runs and exported tests get through.

https://docs.molar.it/docs/platform/bot-protection

## A new dashboard that starts with one question

2026-10-21 · New

Finding where to start meant knowing which product did what. The dashboard now opens with one box, “What should Molar do?”, and keeps your tasks, tests, runs, issues and recordings one click away.

https://app.molar.it

## Exported tests use your app’s test IDs

2026-10-16 · Improvement

If your team already marks elements with test IDs, such as data-test, exported tests now use them, so they match the tests you write by hand.

## Molar is free during the beta

2026-10-15 · Announcement

No card and no plan to choose. Every organization gets up to 25 hosted runs a day, and we’ll tell you before anything about pricing changes.

https://molar.it/pricing

## Check every pull request with the Guard GitHub Action

2026-10-15 · New

A broken checkout found after release costs more than one found in review. Add the Guard Action to your workflow and your key flows run on every pull request, first as advice, then as a required check.

https://molar.it/integrations/github-actions

## Download tested Playwright files from your terminal

2026-10-15 · New

Copying a test out of the dashboard breaks your flow. Add --export to a hosted run in the Molar CLI and the checked Playwright test lands in your project folder.

https://molar.it/platform/developer-tools

## Block ads while Molar runs

2026-10-13 · New

Ads and cookie pop-ups slow runs down and get in the way of tests. Turn on ad blocking for a run and the exported test blocks them too.

https://docs.molar.it/docs/platform/block-ads

## Follow your app to sign-in and checkout on other sites

2026-10-13 · Improvement

Sign in with Google or a hosted checkout page used to end the run at your app’s edge. Molar now follows your app to those public sites and back, so you can test the whole flow.

## Exported tests read like ones you wrote

2026-10-07 · Improvement

Generated tests full of brittle selectors are hard to review. Exported tests now find buttons and fields by their names and labels, the way your team writes Playwright.

## Get a suggested fix when a scheduled check fails

2026-10-01 · New · Preview

A check that fails at 3 a.m. waits for someone to dig in. With Mender on, a failed scheduled check comes with a suggested fix you can review.

https://molar.it/products/mender

## Check any public page for free, no account needed

2026-09-05 · New

Trying Molar used to mean signing up first. Enter a public URL and something that should be true on it, and see what Molar finds, with a screenshot.

https://molar.it/verify

## One dashboard for every part of Molar

2026-08-16 · Announcement

Browser runs, test services, release checks and recordings now live in one place at app.molar.it, with one sign-in and one set of settings for your team.

## Use Molar from Claude Code, Cursor or any MCP client

2026-08-04 · New

Your coding agent can change code but can’t see the result in a browser. Connect it to Molar and it can run a check after every change and read what happened.

https://mcp.molar.it

## See your existing Playwright and Cypress runs in Molar

2026-08-02 · New

Keep the tests you have. Add the Molar reporter to your Playwright or Cypress suite and every run shows up in Trace, with the steps and recordings in one place.

https://docs.molar.it/docs/trace/integrations
