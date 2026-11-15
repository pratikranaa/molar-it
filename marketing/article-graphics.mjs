const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));

const slugOf = path => String(path ?? '').split('/').filter(Boolean).pop() ?? '';
const card = ({ eyebrow, title, body = '', state = '', className = '' }) => `<div class="article-graphic__card ${className}"><div class="article-graphic__eyebrow">${escapeHtml(eyebrow)}</div><h3>${escapeHtml(title)}</h3>${body ? `<p>${body}</p>` : ''}${state ? `<span class="article-graphic__state">${state}</span>` : ''}</div>`;
const tag = (value, className = '') => `<span class="article-graphic__tag ${className}">${escapeHtml(value)}</span>`;
const route = (paths, nodes, className = '') => `<div class="article-graphic__canvas ${className}"><div class="article-graphic__nodes">${nodes.join('')}</div></div>`;

const families = {
  payment: {
    title: 'A payment callback changes access',
    caption: 'The browser can show success before the application has processed the provider callback.',
    render: article => route([
      { d: 'M154 126H301' }, { d: 'M459 126H606' },
      { d: 'M154 126H301', flow: true }, { d: 'M459 126H606', flow: true }
    ], [
      card({ eyebrow: 'BROWSER', title: 'Payment confirmed', body: 'The customer sees the checkout result.', state: tag('screen state', 'is-quiet'), className: 'is-browser' }),
      card({ eyebrow: 'CALLBACK', title: 'Payment succeeded', body: 'The app receives and verifies the provider event.', state: tag('delivery can lag', 'is-coral'), className: 'is-event' }),
      card({ eyebrow: 'APPLICATION', title: 'Access granted', body: 'Account permissions change only after the callback is applied.', state: tag('assert here', 'is-green'), className: 'is-state' })
    ], 'is-payment'),
  },
  otp: {
    title: 'An OTP is a lifecycle, not one input',
    caption: 'After one issuance, exercise valid, expired, and resend cases independently from a clean start.',
    render: article => route([
      { d: 'M95 126H245' }, { d: 'M265 126H415' }, { d: 'M435 126H585' },
      { d: 'M95 126H245', flow: true }, { d: 'M265 126H415', flow: true }, { d: 'M435 126H585', flow: true }
    ], [
      card({ eyebrow: '01 · ISSUE', title: article.path.includes('twilio') ? 'SMS code created' : 'Verification email sent', body: 'Record the message and its issued-at time.', state: tag('captured', 'is-green') }),
      card({ eyebrow: '02 · VALID CASE', title: 'Code accepted', body: 'Independent attempt: submit the fresh code before its validity window closes.', state: tag('account verified', 'is-quiet') }),
      card({ eyebrow: '03 · EXPIRED CASE', title: 'Old code rejected', body: 'Independent attempt: submit the original code after its validity window.', state: tag('expiry asserted', 'is-coral') }),
      card({ eyebrow: '04 · RESEND CASE', title: 'Fresh code only', body: 'Independent attempt: request again and keep the original code invalid.', state: tag('retry asserted', 'is-green') })
    ], 'is-otp'),
  },
  release: {
    title: 'A release gate narrows the decision',
    caption: 'Run the checks that match the change, attach the failed route, and leave the merge decision reviewable.',
    render: article => route([
      { d: 'M154 126H301' }, { d: 'M459 126H606' }, { d: 'M380 126V67H606' },
      { d: 'M154 126H301', flow: true }, { d: 'M459 126H606', flow: true }, { d: 'M380 126V67H606', flow: true }
    ], [
      card({ eyebrow: 'CHANGE', title: article.path.includes('github') ? 'GitHub Actions run' : 'Pull request', body: 'Start with the paths affected by the change.', state: tag('scope the run', 'is-quiet') }),
      card({ eyebrow: 'CHECKS', title: 'Signup · checkout · access', body: 'Each scenario reports its own assertion and captured route.', state: tag('one blocked', 'is-coral'), className: 'is-event' }),
      card({ eyebrow: 'DECISION', title: 'Ready or blocked', body: 'A reviewer sees why the release can proceed or what needs attention.', state: tag(article.path.includes('required-status') ? 'required check' : 'reviewable result', 'is-green'), className: 'is-state' })
    ], 'is-release'),
  },
  agent: {
    title: 'Review the generated test before CI',
    caption: 'Let an agent propose the task or repair, then keep the executed check repeatable and reviewable.',
    render: article => {
      const healing = article.path.includes('self-healing');
      return route([
        { d: 'M154 126H301' }, { d: 'M459 126H606' },
        { d: 'M154 126H301', flow: true }, { d: 'M459 126H606', flow: true }
      ], [
        card({ eyebrow: healing ? 'FAILURE' : 'TASK', title: healing ? 'Locator no longer matches' : 'Plain-English browser task', body: healing ? 'The runtime check stops with its original assertion intact.' : 'Describe the behavior and the success condition.', state: tag(healing ? 'runtime stays red' : 'intent first', 'is-coral') }),
        card({ eyebrow: 'PROPOSAL', title: healing ? 'Candidate locator patch' : 'Playwright spec draft', body: healing ? 'The agent suggests a narrow change against the current page.' : 'The export includes locators, assertions, and a clean starting state.', state: tag('diff to inspect', 'is-quiet'), className: 'is-event' }),
        card({ eyebrow: 'REVIEW', title: healing ? 'Approve, edit, or reject' : 'Run the reviewed spec', body: healing ? 'A person or policy decides whether the assertion still means the same thing.' : 'The committed test decides pass or fail without an inference call.', state: tag('human decision', 'is-green'), className: 'is-state' })
      ], 'is-agent');
    }
  },
  data: {
    title: 'Fresh state keeps parallel runs honest',
    caption: 'Create or restore the state each worker needs; cleanup instructions alone do not make tests independent.',
    render: article => route([
      { d: 'M154 126H301' }, { d: 'M459 126H606' },
      { d: 'M154 126H301', flow: true }, { d: 'M459 126H606', flow: true }
    ], [
      card({ eyebrow: 'SEED', title: article.path.includes('staging') ? 'Known environment state' : 'Unique test data', body: 'Use repeatable records, clocks, and test identities with clear prefixes.', state: tag('created for this run', 'is-quiet') }),
      card({ eyebrow: 'WORKER', title: 'Isolated browser + services', body: 'One run can change its records without racing another run.', state: tag('isolated worker', 'is-green'), className: 'is-event' }),
      card({ eyebrow: 'RESET', title: 'Restore or discard', body: 'Start the next run from a known baseline instead of deleting shared rows.', state: tag('repeat from clean state', 'is-coral'), className: 'is-state' })
    ], 'is-data'),
  },
  failure: {
    title: 'Move from a red check to a cause',
    caption: 'A useful failed run preserves the failing assertion, the relevant request, and the next experiment.',
    render: article => {
      const monitoring = article.path.includes('synthetic-monitoring');
      return route([
        { d: 'M96 126H205' }, { d: 'M225 126H334' }, { d: 'M354 126H463' }, { d: 'M483 126H592' },
        { d: 'M96 126H205', flow: true }, { d: 'M225 126H334', flow: true }, { d: 'M354 126H463', flow: true }, { d: 'M483 126H592', flow: true }
      ], [
        card({ eyebrow: monitoring ? 'SCHEDULED RUN' : 'FAILED ASSERTION', title: monitoring ? 'Important task regressed' : 'Expected state missing', body: monitoring ? 'The check records the task and environment where it changed.' : 'Keep the original assertion visible; do not replace it with “page loaded.”', state: tag('start here', 'is-coral') }),
        card({ eyebrow: 'REPRODUCE', title: 'Same account, same input', body: 'Repeat from a clean state and separate product failure from setup failure.', state: tag('control variables', 'is-quiet') }),
        card({ eyebrow: 'INSPECT', title: 'Browser · request · console', body: 'Align the browser, request, and console records around the first divergence.', state: tag('find the first break', 'is-green'), className: 'is-event' }),
        card({ eyebrow: 'NEXT STEP', title: monitoring ? 'Route to the owner' : 'Run one new experiment', body: monitoring ? 'Give the team a trace and an actionable notification.' : 'Change one variable, then decide whether the fix belongs in code or the test.', state: tag('reviewed diagnosis', 'is-green'), className: 'is-state' })
      ], 'is-failure');
    }
  },
  baseline: {
    title: 'A visual diff still needs a reviewer',
    caption: 'Keep expected, actual, and difference images together, then explain the baseline change beside the code.',
    render: article => route([
      { d: 'M154 126H301' }, { d: 'M459 126H606' },
      { d: 'M154 126H301', flow: true }, { d: 'M459 126H606', flow: true }
    ], [
      card({ eyebrow: 'EXPECTED', title: 'Approved baseline', body: 'The image belongs to a named surface and state.', state: tag('checkout/error-state', 'is-quiet') }),
      card({ eyebrow: 'ACTUAL', title: 'New render', body: 'Freeze fonts, timing, viewport, and dynamic regions before comparing.', state: tag('same inputs', 'is-green'), className: 'is-event' }),
      card({ eyebrow: 'DIFF → REVIEW', title: 'Explain the pixels', body: 'Accept a baseline only when a reviewer can connect the change to the code.', state: tag('never auto-update', 'is-coral'), className: 'is-state' })
    ], 'is-baseline'),
  },
  service: {
    title: 'Test the boundary your app actually crosses',
    caption: 'Keep the vendor API request, isolate its state, and inspect the callback or response your application consumes.',
    render: article => route([
      { d: 'M154 126H301' }, { d: 'M459 126H606' },
      { d: 'M154 126H301', flow: true }, { d: 'M459 126H606', flow: true }
    ], [
      card({ eyebrow: 'APPLICATION', title: 'Vendor-shaped request', body: 'Your app calls the same API contract used in the integration.', state: tag('base URL changes', 'is-quiet') }),
      card({ eyebrow: 'ISOLATED SERVICE', title: 'State you can inspect', body: 'A clone or mock returns the behavior your scenario needs without shared live side effects.', state: tag('known response', 'is-green'), className: 'is-event' }),
      card({ eyebrow: 'ASSERTION', title: 'Customer-visible result', body: 'Check the browser state and the callback or record that caused it.', state: tag('contract + screen state', 'is-coral'), className: 'is-state' })
    ], 'is-service'),
  },
  download: {
    title: 'A download needs a file assertion',
    caption: 'Wait for the download, trigger the export, then validate the saved file you expected.',
    render: article => route([
      { d: 'M154 126H301' }, { d: 'M459 126H606' },
      { d: 'M154 126H301', flow: true }, { d: 'M459 126H606', flow: true }
    ], [
      card({ eyebrow: 'WAIT', title: 'Listen for download', body: 'Start waiting before the click so a fast export cannot be missed.', state: tag('event pending', 'is-quiet') }),
      card({ eyebrow: 'ACTION', title: 'Click Export', body: 'Trigger the control and capture the download event from the browser.', state: tag('event received', 'is-green'), className: 'is-event' }),
      card({ eyebrow: 'FILE', title: 'Save and validate', body: 'Check the filename, type, and expected contents before the test passes.', state: tag('file asserted', 'is-coral'), className: 'is-state' })
    ], 'is-download'),
  },
  decision: {
    title: 'Compare setup against one browser task',
    caption: 'Comparison guides become useful when one test task exposes setup, maintenance, and review tradeoffs.',
    render: article => route([
      { d: 'M154 126H301' }, { d: 'M459 126H606' },
      { d: 'M154 126H301', flow: true }, { d: 'M459 126H606', flow: true }
    ], [
      card({ eyebrow: 'TASK', title: article.path.includes('startup') ? 'Protect the flow that pays' : 'Run one concrete task', body: 'Use the same account, input, and success condition for each option.', state: tag('shared test question', 'is-quiet') }),
      card({ eyebrow: 'SETUP', title: 'Compare the boundary', body: 'Look at authoring, service state, environments, and maintenance—not just the first green run.', state: tag('tradeoffs visible', 'is-coral'), className: 'is-event' }),
      card({ eyebrow: 'DECISION', title: 'Keep the result you can repeat', body: 'Choose the tool that leaves your team with a result it can inspect and run again.', state: tag('review with context', 'is-green'), className: 'is-state' })
    ], 'is-decision'),
  }
};

// Articles that share a family keep their own steps, so two guides never show the same diagram.
// Each step: [kicker, title, body, tag, tagStyle, cardClass]
const variants = {
  'continuous-testing-ci-cd-pipeline': ['release', [
    ['CHANGE · COMMIT', 'Fast checks on every commit', 'Run the few scenarios that protect signup and checkout before anyone reviews the change.', 'fast and focused', 'is-quiet'],
    ['PREVIEW', 'The flows that matter, on the preview', 'Each scenario reports its own assertion and the route it captured.', 'one needs a look', 'is-coral', 'is-event'],
    ['AFTER DEPLOY', 'One scheduled check on the live site', 'Keep a small authorized check running so a regression is found by you first.', 'monitoring', 'is-green', 'is-state']]],
  'github-actions-playwright-ci': ['release', [
    ['WORKFLOW', 'A GitHub Actions run', 'Install the browsers, then run the Playwright tests for the changed paths.', 'on pull_request', 'is-quiet'],
    ['TEST JOB', 'Playwright test + trace', 'Failed runs upload the trace and screenshots as workflow artifacts.', 'artifact kept', 'is-coral', 'is-event'],
    ['REQUIRED CHECK', 'Mark the job as required', 'Branch protection then blocks the merge until the job passes.', 'merge gate', 'is-green', 'is-state']]],
  'regression-testing-strategies': ['release', [
    ['FILES CHANGED', 'Map the change to customer paths', 'Choose scenarios by what the change touches, not by how long the suite is.', 'select by risk', 'is-quiet'],
    ['RUN', 'Run the affected scenarios', 'Keep a short always-run set for signup, checkout and access.', 'say what was skipped', 'is-coral', 'is-event'],
    ['REPORT', 'Show what ran and what did not', 'A reviewer can see the coverage a pass actually represents.', 'coverage visible', 'is-green', 'is-state']]],
  'required-status-checks-merge-gate': ['release', [
    ['PULL REQUEST', 'A change asks to merge', 'The repository lists the checks this branch requires.', 'required checks', 'is-quiet'],
    ['CHECKS', 'Signup · checkout · access', 'Each check reports its own assertion; one is blocked.', 'one blocked', 'is-coral', 'is-event'],
    ['DECISION', 'Ready or blocked', 'Branch protection holds the merge until the failing check is fixed or reviewed.', 'merge gate', 'is-green', 'is-state']]],
  'shift-left-testing-explained': ['release', [
    ['PLAN', 'Name the flow before the code', 'Write the acceptance criteria and the check that will prove them.', 'before code', 'is-quiet'],
    ['BUILD', 'Keep the check beside the change', 'The scenario lives in the same pull request as the code it covers.', 'same pull request', 'is-coral', 'is-event'],
    ['SHIP', 'Merge after the check ran', 'Release confidence comes from a check that already exists.', 'reviewable result', 'is-green', 'is-state']]],
  'e2e-testing-best-practices': ['data', [
    ['ARRANGE', 'Seed the account the test needs', 'Create unique records, clocks and test identities for this run.', 'created for this run', 'is-quiet'],
    ['ACT', 'Drive the real flow', 'Use roles and visible text, the way a customer finds things.', 'user-facing locators', 'is-coral', 'is-event'],
    ['ASSERT', 'Check what the customer sees', 'Confirm the screen and the record behind it, then discard or restore.', 'clean for the next run', 'is-green', 'is-state']]],
  'staging-environment-alternatives': ['data', [
    ['SEED', 'Known environment state', 'Use repeatable records, clocks and test identities with clear prefixes.', 'created for this run', 'is-quiet'],
    ['PREVIEW', 'One environment per change', 'Each pull request gets its own copy, so changes do not race each other.', 'isolated preview', 'is-coral', 'is-event'],
    ['RESET', 'Restore or discard', 'Start the next run from a known baseline instead of cleaning shared rows.', 'repeat from clean state', 'is-green', 'is-state']]],
  'test-stripe-without-real-cards': ['payment', [
    ['BROWSER', 'A test card is submitted', 'Use the provider’s test card against a clone or sandbox, never a real card.', 'test mode', 'is-quiet'],
    ['PROVIDER EVENT', 'A signed test event arrives', 'Your app receives and verifies the same event shape it gets in production.', 'signature verified', 'is-coral', 'is-event'],
    ['APPLICATION', 'Order and access agree', 'Assert the order record and the customer’s access, not only the confirmation page.', 'assert here', 'is-green', 'is-state']]],
  'testing-third-party-apis-safely': ['service', [
    ['APPLICATION', 'Point the app at a test service', 'Change only the base URL; keep the vendor request shape.', 'base URL changes', 'is-quiet'],
    ['TEST SERVICE', 'Authorized test data', 'Use test accounts and supported clones so no live side effect can happen.', 'no live side effects', 'is-green', 'is-event'],
    ['ASSERTION', 'Check the customer-visible result', 'Compare the browser state with the record or callback that caused it.', 'contract + screen state', 'is-coral', 'is-state']]],
  'ai-agents-future-software-testing': ['agent', [
    ['CODING AGENT', 'Writes the change', 'The agent edits the app and knows what it expects to be true.', 'intent first', 'is-quiet'],
    ['BROWSER', 'Checks it as a user would', 'A real browser runs the flow and returns the result, steps and screenshots.', 'evidence returned', 'is-coral', 'is-event'],
    ['NEXT CHANGE', 'Reads the result, then decides', 'A failed check names the step to fix; a human still reviews the diff.', 'human decision', 'is-green', 'is-state']]]
};

const familyFor = slug => {
  if (slug.includes('delayed-payment') || slug.includes('stripe')) return 'payment';
  if (slug.includes('download') || slug.includes('file-export') || slug.includes('export')) return 'download';
  if (slug.includes('email-workflow') || slug.includes('twilio-sms')) return 'otp';
  if (slug.includes('continuous-testing') || slug.includes('github-actions') || slug.includes('regression-testing') || slug.includes('required-status') || slug.includes('shift-left')) return 'release';
  if (slug.includes('ai-agents') || slug.includes('ai-playwright') || slug.includes('self-healing')) return 'agent';
  if (slug.includes('test-data') || slug.includes('e2e-testing') || slug.includes('staging-environment')) return 'data';
  if (slug.includes('flaky-tests') || slug.includes('synthetic-monitoring')) return 'failure';
  if (slug.includes('visual-regression')) return 'baseline';
  if (slug.includes('api-mocking') || slug.includes('third-party-apis')) return 'service';
  if (slug.includes('playwright-vs-cypress') || slug.includes('startup-qa')) return 'decision';
  return 'failure';
};

export function articleGraphic(article = {}) {
  const path = String(article.path ?? '');
  const slug = slugOf(path);
  const variant = variants[slug];
  const family = variant ? variant[0] : familyFor(slug);
  const scene = families[family];
  const title = scene.title;
  const body = variant
    ? route([], variant[1].map(([eyebrow, stepTitle, copy, state, style, className = '']) => card({ eyebrow, title: stepTitle, body: escapeHtml(copy), state: tag(state, style), className })), `is-${family}`)
    : scene.render({ ...article, path });
  return `<figure class="article-graphic article-graphic--${family}" data-article-graphic data-article-family="${family}" aria-label="${escapeHtml(title)}">${body}<figcaption><strong>${escapeHtml(title)}</strong><span>${escapeHtml(scene.caption)}</span></figcaption></figure>`;
}
