// Changelog entries — add new releases here (one file, tab-filtered by product).

window.CHANGELOG_PRODUCTS = [
  { id: 'all', label: 'All' },
  { id: 'molar', label: 'Molar' },
  { id: 'cartographer', label: 'Cartographer' },
  { id: 'clones', label: 'Clones' },
  { id: 'guard', label: 'Guard' },
  { id: 'trace', label: 'Trace' },
];

window.CHANGELOG_ENTRIES = [
  {
    id: 'molar-2026-08-16',
    product: 'molar',
    date: '2026-08-16',
    availability: 'Available now',
    title: 'One workspace for every testing journey',
    summary: 'Move from discovery to a clear result without switching between separate tools or losing the story of a run.',
    items: [
      'Open Cartographer, Clones, Guard, and Trace from one consistent workspace.',
      'Move directly from a failed result to the evidence needed to understand it.',
      'See service health and organization settings without leaving your workspace.',
    ],
  },
  {
    id: 'cartographer-2026-08-14',
    product: 'cartographer',
    date: '2026-08-14',
    availability: 'Available now',
    title: 'Turn a URL into a reusable browser test',
    summary: 'Describe the journey that matters and let Molar explore the site, verify the outcome, and create a test your team keeps.',
    items: [
      'Start from any public or signed-in page with a plain-English goal.',
      'Follow modern single-page and multi-page journeys across tabs and redirects.',
      'Export a readable Playwright test after the journey is verified.',
    ],
  },
  {
    id: 'trace-2026-08-13',
    product: 'trace',
    date: '2026-08-13',
    availability: 'Available now',
    title: 'See every run as it happened',
    summary: 'Watch a browser session while it runs, then return to the same evidence when you need to understand a failure.',
    items: [
      'Replay video, screenshots, page changes, requests, and console messages on one timeline.',
      'Open the exact moment a journey failed instead of searching through separate logs.',
      'Share a retained run with the people helping investigate it.',
    ],
  },
  {
    id: 'guard-2026-08-12',
    product: 'guard',
    date: '2026-08-12',
    availability: 'Available now',
    title: 'Protect changes before and after release',
    summary: 'Run the journeys that matter when a pull request changes and keep watching them after the release reaches customers.',
    items: [
      'Show a clear pass or fail result alongside each pull request.',
      'Run important customer journeys on a schedule in production.',
      'Group repeated failures into one incident so teams can respond once.',
    ],
  },
  {
    id: 'clones-2026-08-11',
    product: 'clones',
    date: '2026-08-11',
    availability: 'Available now',
    title: 'Test real workflows without real side effects',
    summary: 'Use stateful replicas for the services your app depends on, so tests can act realistically without contacting real customers.',
    items: [
      'Exercise payments, messaging, email, sign-in, and file storage in an isolated world.',
      'Save and restore the whole test world between runs.',
      'Advance time and reproduce the same starting state whenever a test is repeated.',
    ],
  },
  {
    id: 'molar-2026-08-09',
    product: 'molar',
    date: '2026-08-09',
    availability: 'Available now',
    title: 'Ask Molar from your coding tools',
    summary: 'Start a browser check from a supported coding assistant or the command line and receive a structured result you can act on.',
    items: [
      'Describe what to do or verify without first writing a test script.',
      'Receive the result together with screenshots, replay, and debugging evidence.',
      'Continue an interrupted task without starting the browser journey again.',
    ],
  },
  {
    id: 'guard-2026-08-08',
    product: 'guard',
    date: '2026-08-08',
    availability: 'Preview',
    title: 'Test the journeys most affected by a change',
    summary: 'Molar can review a proposed change, choose the customer journeys most likely to be affected, and focus testing there first.',
    items: [
      'Use the temporary preview of a pull request as the test destination.',
      'Add newly discovered coverage alongside your existing regression journeys.',
      'Keep the result attached to the same change for faster review.',
    ],
  },
  {
    id: 'cartographer-2026-08-06',
    product: 'cartographer',
    date: '2026-08-06',
    availability: 'Preview',
    title: 'Explore complex sign-up and sign-in paths',
    summary: 'Give Molar a starting account or let it create a fresh identity while it follows a longer customer journey across services.',
    items: [
      'Reuse known accounts without placing passwords in the test itself.',
      'Handle verification emails and one-time codes during supported journeys.',
      'Keep learned product details available for the next exploration.',
    ],
  },
  {
    id: 'molar-2026-08-04',
    product: 'molar',
    date: '2026-08-04',
    availability: 'Preview',
    title: 'Bring run results into team conversations',
    summary: 'Connect a team channel to receive useful run summaries and ask follow-up questions where the work is already happening.',
    items: [
      'Receive a concise result when a monitored journey fails.',
      'Open the matching replay directly from the conversation.',
      'Ask for more detail or start another run without switching context.',
    ],
  },
];

window.getChangelogEntries = function getChangelogEntries(product) {
  const entries = window.CHANGELOG_ENTRIES.slice().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  if (!product || product === 'all') return entries;
  return entries.filter((e) => e.product === product);
};
