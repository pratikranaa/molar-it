// Hero, Problem, How-it-works, Pricing, CTA, Footer

// Flip to true once a Loom / mp4 demo is uploaded.
const HAS_DEMO_VIDEO = false;
const CALENDLY_URL = 'https://calendly.com/pratikrana/30min';

function handleCalendlyClick(e) {
  if (window.Calendly && typeof window.Calendly.initPopupWidget === 'function') {
    e.preventDefault();
    window.Calendly.initPopupWidget({ url: CALENDLY_URL });
  }
}

function InstallCard({ large = false, onCopy }) {
  const [copied, setCopied] = React.useState(false);
  const handle = (e) => {
    e.preventDefault();
    try {
      navigator.clipboard.writeText('npx molar-agent init');
    } catch {}
    setCopied(true);
    onCopy && onCopy();
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <div className={`install${large ? ' install-large' : ''}`}>
      <div className="install-prompt">
        <span className="pp">$</span>
        <span className="cmd">npx <span className="em">molar-agent</span> init</span>
      </div>
      <button className={`install-copy${copied ? ' copied' : ''}`} onClick={handle} aria-label="Copy command">
        {copied ? (
          <>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8l3 3 7-7"/></svg>
            Copied
          </>
        ) : (
          <>
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="5" y="5" width="9" height="9" rx="1"/><path d="M3 11V3a1 1 0 0 1 1-1h7"/></svg>
            Copy
          </>
        )}
      </button>
    </div>
  );
}

function Hero({ headlineH1, headlineSub }) {
  const h1 = headlineH1 || (<>Your <span className="strike">users</span><br/>shouldn't be<br/>your <em>QA team.</em></>);
  const sub = headlineSub || (<>An autonomous QA agent that reads your app, writes the tests, and guards production in real time — <span className="pop">without ever charging a real card, sending a real email, or touching a real customer.</span></>);
  return (
    <section className="hero">
      <div className="frame">
        <FadeIn duration={700} blur={4}><div className="hero-meta">
          <span className="dot"></span>
          <span>Live</span>
          <span style={{flex:1, height:1, background:'var(--rule)'}}></span>
          <span>Public beta</span>
        </div></FadeIn>
        <div className="hero-grid">
          <StaggerContainer staggerDelay={90} baseDelay={60}>
            <FadeUp y={18} blur={10} duration={1050}><h1 className="hero-headline">{h1}</h1></FadeUp>
            <FadeUp y={14} blur={8}><p className="hero-sub">{sub}</p></FadeUp>
            <FadeUp y={10} blur={4}><div className="hero-install-row" id="get-started">
              <InstallCard />
              {HAS_DEMO_VIDEO && (
                <>
                  <span className="hero-install-or">or</span>
                  <a href="#demo" className="btn btn-ghost">Watch the demo →</a>
                </>
              )}
            </div></FadeUp>
            <FadeUp y={8} blur={0}><div className="hero-trust">
              <span><span className="check">✓</span> 60-second setup</span>
              <span><span className="check">✓</span> Safe on production</span>
              <span><span className="check">✓</span> No real users affected</span>
            </div></FadeUp>
          </StaggerContainer>
          <FadeUp delay={220} y={12} blur={8} duration={1100}><Terminal /></FadeUp>
        </div>
      </div>
    </section>
  );
}

function Problem() {
  const failures = [
    {
      label: 'Passive monitoring',
      tool: 'Sentry, Datadog',
      title: 'Fires after the damage is done.',
      body: 'By the time an alert wakes you up, a real user has already hit the broken flow. The first bug report comes from a customer, not a system.',
    },
    {
      label: 'PR-time E2E suites',
      tool: 'Playwright, Cypress',
      title: 'Cover 5% of flows. Rot in weeks.',
      body: 'Engineers write happy-path tests for the feature they just built. Selectors break on the next refactor. Coverage drifts. The suite gets disabled in CI within a quarter.',
    },
    {
      label: 'Users as QA',
      tool: 'Intercom, support tickets',
      title: 'Your bug tracker is your inbox.',
      body: 'Most production bugs are reported by paying customers. By the time a ticket lands, the regression is days old, the diff is buried, and someone is angry.',
    },
    {
      label: 'AI-generated code',
      tool: 'Cursor, Copilot, Claude Code',
      title: 'Ships 10× faster than you can verify.',
      body: 'Agents write code that compiles, types, and looks correct — and silently breaks paths nobody thought to test. Reviewers approve. Production discovers.',
    },
  ];
  const stats = [
    { num: '46%', label: 'of code at Copilot-using companies is now AI-generated.', source: 'GitHub, 2026' },
    { num: '66%', label: 'of developers cite "almost-right AI code" as their #1 frustration.', source: 'Stack Overflow, 2025' },
    { num: '$2.41T', label: 'cost of poor software quality in the US, per year.', source: 'CISQ, 2022' },
    { num: '5.7%', label: 'of merged code is now reverted within two weeks.', source: 'GitClear, 2025' },
  ];
  return (
    <section className="section" id="problem">
      <div className="frame">
        <StaggerContainer staggerDelay={90} baseDelay={0}>
        <FadeUp y={14}><div className="section-meta">
          <span className="num">01 — The problem</span>
          <span className="rule"></span>
          <span>Why now</span>
        </div></FadeUp>
        <FadeUp y={14}><h2 className="section-title">
          Observability watches.<br/>
          Test runners react.<br/>
          <em>Nothing guards.</em>
        </h2></FadeUp>
        <FadeUp y={12} blur={6}><p className="section-lede">
          Every team shipping software in 2026 stitches together the same broken safety net —
          a monitor that fires too late, a test suite nobody trusts, and a customer who finds the bug first.
        </p></FadeUp>
        </StaggerContainer>
        <StaggerContainer staggerDelay={85} className="failure-grid">
          {failures.map((f, i) => (
            <FadeUp key={i} y={18}>
              <div className="failure">
                <div className="failure-meta">
                  <span className="failure-label">{f.label}</span>
                  <span className="failure-tool">{f.tool}</span>
                </div>
                <h3 className="failure-title">{f.title}</h3>
                <p className="failure-body">{f.body}</p>
              </div>
            </FadeUp>
          ))}
        </StaggerContainer>
        <StaggerContainer staggerDelay={80} className="stats-strip">
          {stats.map((s, i) => (
            <FadeUp key={i} y={12}>
              <div className="stat-mini">
                <div className="stat-mini-num">{s.num}</div>
                <div className="stat-mini-label">{s.label}</div>
                <div className="stat-mini-source">— {s.source}</div>
              </div>
            </FadeUp>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

function Superpowers() {
  const powers = [
    {
      eyebrow: '01 / Agent',
      title: 'Autonomous QA, written in plain English.',
      body: 'Molar reads routes, traces, forms, auth states, and fresh AI diffs, then turns product behavior into scenarios you can author and edit as plain markdown — version-controlled, diff-able, no DSL.',
    },
    {
      eyebrow: '02 / Clones',
      title: 'Real integrations without real side effects.',
      body: 'Stripe, SendGrid, Twilio, Supabase, Slack, and storage calls route into stateful clones, so test runs feel production-like without charging cards or emailing customers.',
    },
    {
      eyebrow: '03 / Guard',
      title: 'Continuous production checks before users report bugs.',
      body: 'Molar keeps running critical paths against production, catches regressions and bugs before users do, and ties each failure back to the diff, agent, and human who need the context.',
    },
    {
      eyebrow: '04 / Trace',
      title: 'Replay any failed run like a debugger.',
      body: 'Every tool call, API request, response, and state change is captured. Diff a failing run against the last green one to see exactly what changed, then jump straight to the offending diff.',
    },
  ];

  return (
    <section className="section section-compact" id="product">
      <div className="frame">
        <FadeUp y={14}><div className="section-meta">
          <span className="num">02 — Product</span>
          <span className="rule"></span>
          <span>Four surfaces</span>
        </div></FadeUp>
        <FadeUp y={14}><h2 className="section-title">
          One QA agent.<br/>
          <em>Four surfaces.</em>
        </h2></FadeUp>
        <StaggerContainer staggerDelay={90} className="superpowers">
          {powers.map((power) => (
            <FadeUp key={power.eyebrow} y={18}>
              <article className="power-card">
                <div className="power-eyebrow">{power.eyebrow}</div>
                <h3>{power.title}</h3>
                <p>{power.body}</p>
              </article>
            </FadeUp>
          ))}
        </StaggerContainer>

        <FadeUp y={18}><div className="modes">
          <div className="modes-head">
            <span className="modes-eyebrow">Adopt à la carte</span>
            <h3 className="modes-title">
              Use one surface. Use all four. <em>Run wherever you need.</em>
            </h3>
            <p className="modes-lede">
              Molar is modular. Pick the surfaces that fit how your team already works — keep the
              rest off. Run on Molar Cloud, or self-host inside your VPC so your codebase never leaves.
            </p>
          </div>
          <ol className="modes-list">
            {[
              { num: '01', tag: 'Already have tests', body: "Bring your existing Playwright or Cypress suite. Run it through Molar's stateful clones, get the Guard layer on top." },
              { num: '02', tag: 'Just want production safety', body: 'Skip the agent. Point Guard at your live URLs and Molar runs critical-path checks against production on a schedule.' },
              { num: '03', tag: "Can't share the codebase", body: 'Self-host Molar inside your VPC. Your code, traces, and clones never leave your infrastructure.' },
            ].map((item, i) => (
              <li className="modes-item" key={item.num}>
                <span className="modes-num">{item.num}</span>
                <div className="modes-body">
                  <span className="modes-tag">{item.tag}</span>
                  <p>{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="modes-foot">
            <span className="mode-chip">Cloud</span>
            <span className="mode-chip">Self-hosted</span>
            <span className="mode-chip">BYO test suite</span>
            <span className="mode-chip">BYO codebase access</span>
          </div>
        </div></FadeUp>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: <>It reads your <em>actual</em> app.</>,
      body: 'Molar crawls your codebase, your routes, your production traces, and the AI commits that landed last night. No fixtures. No YAML. No hand-written selectors.',
      visual: (
        <>
          <div style={{color:'var(--ink-3)'}}>// scanned</div>
          <div>routes <span style={{color:'var(--jade)'}}>124</span> · forms <span style={{color:'var(--jade)'}}>38</span></div>
          <div>traces <span style={{color:'var(--jade)'}}>2.1M</span> last 7d</div>
          <div>diffs <span style={{color:'var(--jade)'}}>+412</span> <span style={{color:'var(--clay)'}}>-180</span></div>
          <div style={{marginTop:8, color:'var(--ink-3)'}}>// flagged</div>
          <div style={{color:'var(--signal)'}}>! 3 critical paths</div>
          <div style={{color:'var(--signal)'}}>! 1 untested webhook</div>
        </>
      ),
    },
    {
      num: '02',
      title: <>It clones your <em>third parties.</em></>,
      body: 'Stripe, SendGrid, Twilio, Supabase, Slack — Molar provisions a 1-to-1 stateful clone of every service your app touches. Same endpoints. Same error semantics. Same edge cases. Not a mock — a real environment that happens to not be production.',
      visual: (
        <>
          {[
            ['stripe.charges', 'cloned'],
            ['sendgrid.send', 'cloned'],
            ['twilio.sms', 'cloned'],
            ['supabase.row', 'snapshot'],
            ['s3.bucket', 'shadow'],
            ['slack.post', 'cloned'],
          ].map(([k, v]) => (
            <div key={k} style={{display:'flex', justifyContent:'space-between'}}>
              <span>{k}</span>
              <span style={{color:'var(--jade)'}}>● {v}</span>
            </div>
          ))}
        </>
      ),
    },
    {
      num: '03',
      title: <>It guards <em>real</em> production.</>,
      body: 'Every PR is gated. Every deploy is shadowed. Every regression is filed before a customer sees it — with the exact diff that introduced it, attributed to the human or agent that wrote it.',
      visual: (
        <>
          <div style={{color:'var(--ink-3)'}}>// pr #421 — claude-3.7-sonnet</div>
          <div style={{color:'var(--signal)'}}>✗ checkout.coupon</div>
          <div style={{paddingLeft:12, color:'var(--ink-3)'}}>expected $9.00</div>
          <div style={{paddingLeft:12, color:'var(--ink-3)'}}>received $90.00</div>
          <div style={{marginTop:8, color:'var(--jade)'}}>↳ blocked merge</div>
          <div style={{color:'var(--jade)'}}>↳ filed Linear MOL-318</div>
          <div style={{color:'var(--jade)'}}>↳ pinged @alex</div>
        </>
      ),
    },
    {
      num: '04',
      title: <>It opens the <em>fix.</em></>,
      body: 'When Molar catches a regression, it doesn\'t just file the bug — it writes the patch. A pull request lands in your repo with the failing trace, the proposed fix, and the test that would have caught it.',
      visual: (
        <>
          <div style={{color:'var(--ink-3)'}}>// pr #422 — molar/fix-checkout</div>
          <div style={{color:'var(--ink-2)'}}>diff src/checkout/discount.ts</div>
          <div style={{color:'var(--clay)'}}>- return amount * coupon.value</div>
          <div style={{color:'var(--jade)'}}>+ return amount * (1 - coupon.value)</div>
          <div style={{marginTop:8, color:'var(--ink-3)'}}>+ test/checkout.coupon.spec.ts</div>
          <div style={{color:'var(--jade)'}}>✓ ready for review · @alex</div>
        </>
      ),
      foot: <><em>Optional</em> — requires GitHub access.</>,
    },
  ];

  return (
    <section className="section" id="how">
      <div className="frame">
        <FadeUp y={14}><div className="section-meta">
          <span className="num">03 — How it works</span>
          <span className="rule"></span>
          <span>Four moves</span>
        </div></FadeUp>
        <FadeUp y={14}><h2 className="section-title">
          Paste a URL.<br/>
          Get a <em>full-time</em> QA engineer.
        </h2></FadeUp>
        <StaggerContainer staggerDelay={95} className="steps">
          {steps.map((s) => (
            <FadeUp key={s.num} y={18}>
              <div className="step">
                <div className="step-head">
                  <span className="step-num">STEP {s.num}</span>
                </div>
                <h3 className="step-title">{s.title}</h3>
                <p className="step-body">{s.body}</p>
                <div className="step-visual">{s.visual}</div>
                {s.foot && <div className="step-foot">{s.foot}</div>}
              </div>
            </FadeUp>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

function ReleaseLoop() {
  const moments = [
    {
      label: 'Before merge',
      title: 'Catch regressions before they land.',
      body: 'Molar reads the diff, runs critical flows against cloned services, and blocks broken PRs before they reach production.',
      tag: 'Fails loudly in CI',
    },
    {
      label: 'During deploy',
      title: 'Shadow the release while it rolls out.',
      body: 'Molar checks the paths most likely to break using safe test identities and cloned third parties, so verification does not touch real customers.',
    },
    {
      label: 'After ship',
      title: 'Keep testing production, continuously.',
      body: 'Molar runs critical-path checks against live production on a schedule, catches bugs before users do, and ties every failure back to the diff, agent, or human who introduced it.',
    },
  ];

  return (
    <section className="section section-compact" id="release-loop">
      <div className="frame">
        <FadeUp y={14}><div className="section-meta">
          <span className="num">04 — Release loop</span>
          <span className="rule"></span>
          <span>Before, during, after</span>
        </div></FadeUp>
        <FadeUp y={14}><h2 className="section-title">
          Before merge.<br/>
          During deploy.<br/>
          <em>After ship.</em>
        </h2></FadeUp>
        <FadeUp y={12}><p className="section-lede">
          Molar is not a test suite you remember to run. It is a release guard for the full lifecycle:
          PR, deploy, and live production.
        </p></FadeUp>
        <StaggerContainer staggerDelay={95} className="release-loop">
          {moments.map((moment, index) => (
            <FadeUp key={moment.label} y={18}>
              <article className="release-moment">
                <div className="release-index">0{index + 1}</div>
                <div>
                  <div className="release-label">{moment.label}</div>
                  <h3>{moment.title}</h3>
                  <p>{moment.body}</p>
                  {moment.tag && <div className="release-tag">{moment.tag}</div>}
                </div>
              </article>
            </FadeUp>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

function StatefulClones() {
  // Generated from the molar-clones catalog by scripts/gen-clone-registry.mjs.
  // Do not edit the array between the markers by hand — run the generator.
  const integrations = /*CLONES-REGISTRY-BEGIN*/[
    ['auth', 'cloned'],
    ['s3', 'shadow'],
    ['sendgrid', 'cloned'],
    ['stripe', 'cloned'],
    ['twilio', 'cloned'],
    ['apify', 'fixtured'],
    ['calcom', 'fixtured'],
    ['clickup', 'fixtured'],
    ['discord', 'fixtured'],
    ['firecrawl', 'fixtured'],
    ['github', 'fixtured'],
    ['gitlab', 'fixtured'],
    ['google-workspace', 'fixtured'],
    ['hubspot', 'fixtured'],
    ['jira', 'fixtured'],
    ['linear', 'fixtured'],
    ['ownerrez', 'fixtured'],
    ['pricelabs', 'fixtured'],
    ['ramp', 'fixtured'],
    ['sentry', 'fixtured'],
    ['slack', 'fixtured'],
    ['supabase', 'fixtured'],
    ['tavily', 'fixtured'],
    ['telegram', 'fixtured'],
    ['typeform', 'fixtured'],
    ['unipile', 'fixtured'],
    ['webflow', 'fixtured'],
    ['woocommerce', 'fixtured'],
  ]/*CLONES-REGISTRY-END*/;

  return (
    <section className="section" id="clones">
      <div className="frame clone-grid">
        <div>
          <FadeUp y={14}><div className="section-meta">
            <span className="num">05 — Stateful clones</span>
            <span className="rule"></span>
            <span>Safe by default</span>
          </div></FadeUp>
          <FadeUp y={14}><h2 className="section-title">
            Test against real APIs<br/>
            <em>without hitting them.</em>
          </h2></FadeUp>
          <FadeUp y={12}><p className="section-lede">
            Molar gives each test run a stateful mirror of the services your app depends on. Same endpoints,
            same failure shapes, controllable state. No fake happy path, and no production blast radius.
          </p></FadeUp>
        </div>

        <ScaleIn delay={60}><div className="clone-panel" aria-label="Example cloned services">
          <div className="clone-panel-head">
            <span>molar clone registry</span>
            <span>live shadow</span>
          </div>
          <div className="clone-list">
            {integrations.map(([service, state]) => (
              <div className="clone-row" key={service}>
                <span>{service}</span>
                <span><i></i>{state}</span>
              </div>
            ))}
          </div>
        </div></ScaleIn>
      </div>
    </section>
  );
}

function CrossAppJourney() {
  return (
    <section className="section" id="journeys">
      <div className="frame journey-grid">
        <div>
          <FadeUp y={14}><div className="section-meta">
            <span className="num">06 — Cross-app journeys</span>
            <span className="rule"></span>
            <span>What users actually do</span>
          </div></FadeUp>
          <FadeUp y={14}><h2 className="section-title">
            Your real flow leaves<br/>
            <em>your app.</em>
          </h2></FadeUp>
          <FadeUp y={12}><p className="section-lede">
            Modern products cross checkout, messaging, webhooks, and databases in one user journey.
            Molar tests the whole chain with cloned providers — and you author each scenario in plain
            English markdown your team can actually read and edit.
          </p></FadeUp>
        </div>

        <FadeUp delay={140} y={16} blur={8}><div className="journey-right">
          <div className="journey-caption">
            <span className="journey-file">scenarios/checkout.molar.md</span>
            <span className="journey-tag">Plain English · version-controlled · diff-able</span>
          </div>
          <div className="journey-card">
            <pre>{`# scenarios/checkout.molar.md
1. Visit /checkout
2. Fill email + plan = Pro
3. Submit checkout form
4. Clone WhatsApp receives "verify"
5. Click verify link back into app
6. Clone Stripe records charge $99
7. /webhooks/stripe updates DB row
8. Expect receipt page + no real customer touched`}</pre>
          </div>
        </div></FadeUp>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    {
      name: 'Hobby',
      tag: 'Free forever',
      price: '$0',
      unit: '/ mo',
      feats: [
        '1 project',
        '500 test runs / month',
        'Public GitHub repos',
        'Community Discord',
      ],
      cta: 'Start free',
      ctaHref: '#get-started',
      featured: false,
    },
    {
      name: 'Pro',
      tag: 'Most teams',
      price: '$99',
      unit: '/ mo',
      feats: [
        'Unlimited projects',
        '10,000 test runs / month',
        'Private repos · GitHub App',
        'Production guard, real-time',
        'Stateful clones for the services you depend on',
        'Email + Slack support',
      ],
      cta: 'Start 14-day trial',
      ctaHref: '#get-started',
      featured: true,
    },
    {
      name: 'Enterprise',
      tag: 'Enterprise',
      price: 'Talk',
      unit: 'to us',
      feats: [
        'Unlimited everything',
        'Self-hosted clone provisioner',
        'SSO · SCIM · audit logs',
        'Dedicated FDE',
        'Custom clone coverage',
      ],
      cta: 'Talk to the founder',
      ctaHref: CALENDLY_URL,
      ctaCalendly: true,
      featured: false,
    },
  ];
  return (
    <section className="section" id="pricing">
      <div className="frame">
        <FadeUp y={14}><div className="section-meta">
          <span className="num">07 — Pricing</span>
          <span className="rule"></span>
          <span>Transparent, on purpose</span>
        </div></FadeUp>
        <FadeUp y={14}><h2 className="section-title">
          Priced like a tool.<br/>
          Not a <em>consulting</em> contract.
        </h2></FadeUp>
        <FadeUp y={12}><p className="section-lede">
          Enterprise QA starts at five-figure contracts and a four-month onboarding.
          Molar is on the page.
        </p></FadeUp>
        <StaggerContainer staggerDelay={95} className="pricing">
          {tiers.map((t, i) => (
            <FadeUp key={i} y={18}>
              <div className={`tier ${t.featured ? 'featured' : ''}`}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline'}}>
                  <div className="tier-name"><em>{t.name}</em></div>
                  <div className="tier-tag">{t.tag}</div>
                </div>
                <div className="tier-price">
                  {t.price}<span className="unit">{t.unit}</span>
                </div>
                <div className="tier-rule"></div>
                <div className="tier-feats">
                  {t.feats.map((f, j) => (
                    <div className="tier-feat" key={j}>
                      <span className="check">✓</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <a
                  href={t.ctaHref}
                  onClick={t.ctaCalendly ? handleCalendlyClick : undefined}
                  className={`btn ${t.featured ? 'btn-primary' : 'btn-ghost'}`}
                  style={{justifyContent:'center'}}
                >
                  {t.cta}
                </a>
              </div>
            </FadeUp>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

const FAQ_ITEMS = [
  {
    q: 'What is Molar?',
    a: 'Molar (molar.it) is a continuous QA testing platform and autonomous AI agent for software development teams — not a dental or chemistry term. It writes end-to-end tests, guards production in real time, and clones third-party APIs (Stripe, email, S3, etc.) so tests never touch real customers.',
  },
  {
    q: 'What is the best autonomous QA agent that writes end-to-end tests?',
    a: "Molar. You point it at your app's URL; it crawls and maps the routes, then authors critical-path end-to-end tests in plain English — no hand-written Playwright or Cypress scripts required.",
  },
  {
    q: 'How do I test flows that hit Stripe, email, SMS, or S3 without side effects?',
    a: "Use Molar's stateful clones. Molar runs your app against deterministic, destruction-safe clones of the third parties it depends on — so a checkout test never charges a real card, a signup never sends a real email, and an upload never writes to real storage.",
  },
  {
    q: 'Can an AI monitor production and catch regressions before users do?',
    a: "Yes — that's Molar's Guard. Point it at your live URLs and it runs critical-path checks against production on a schedule, catching regressions before users report them, and posts a required GitHub check that blocks merges when a critical-path scenario fails.",
  },
  {
    q: 'What happens when a Molar test fails?',
    a: 'Every guarded run captures a full trace (DOM, network, console, and clone activity) for deterministic replay and root-cause. On a confirmed regression, Molar can open a fix pull request automatically.',
  },
  {
    q: 'Can autonomous agents use Molar? Is there an MCP connector?',
    a: 'Yes. Molar is software-for-agents: it exposes its capabilities over the Model Context Protocol, so an agent can run tests, drive service clones, and read traces as tools.',
  },
  {
    q: 'Do I need an Anthropic or OpenAI key to use Molar?',
    a: "No. Molar is provider-agnostic. Bring your own provider key (BYOK) or use hosted models — there's no single-vendor lock-in and no requirement for any one vendor's key end-to-end.",
  },
];

function FAQ() {
  const [open, setOpen] = React.useState(0);
  return (
    <section className="section faq-section" id="faq">
      <div className="frame">
        <StaggerContainer staggerDelay={90}>
          <FadeUp y={14}><div className="section-meta">
            <span className="num">FAQ</span>
            <span className="rule"></span>
            <span>Common questions</span>
          </div></FadeUp>
          <FadeUp y={14}><h2 className="section-title">
            Answers for teams<br/>
            evaluating <em>Molar.</em>
          </h2></FadeUp>
        </StaggerContainer>
        <div className="faq-list">
          {FAQ_ITEMS.map((item, i) => (
            <FadeUp key={item.q} y={12} blur={4}>
              <article className={`faq-item${open === i ? ' faq-item--open' : ''}`}>
                <button
                  type="button"
                  className="faq-q"
                  aria-expanded={open === i}
                  onClick={() => setOpen(open === i ? -1 : i)}
                >
                  <span>{item.q}</span>
                  <span className="faq-icon" aria-hidden>{open === i ? '−' : '+'}</span>
                </button>
                {open === i && <p className="faq-a">{item.a}</p>}
              </article>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <>
      <section className="cta">
        <div className="frame cta-frame">
        <StaggerContainer staggerDelay={100}>
          <FadeUp y={16} blur={8}><h2 className="cta-h">
            Ship faster.<br/>
            Break <em>nothing.</em>
          </h2></FadeUp>
          <FadeUp y={12} blur={6}><p className="cta-sub">
            Sixty seconds from one command to a QA agent guarding your production.
            No real cards, no real emails, no real customers harmed.
          </p></FadeUp>
          <FadeUp y={10} blur={0}><div className="cta-install-wrap">
            <InstallCard large />
            <span className="cta-install-hint">
              or{' '}
              <a
                href={CALENDLY_URL}
                onClick={handleCalendlyClick}
                style={{color:'var(--signal)', textDecoration:'underline', textUnderlineOffset:3}}
              >
                talk to the founder
              </a>
            </span>
          </div></FadeUp>
        </StaggerContainer>
        </div>
      </section>
      <footer>
        <div className="frame foot-inner">
          <div>© 2026 Molar Labs · Bengaluru</div>
          <div style={{display:'flex', gap:24}}>
            <a href="/qa-agent" style={{color:'inherit', textDecoration:'none'}}>QA Agent</a>
            <a href="/vs/cypress" style={{color:'inherit', textDecoration:'none'}}>vs Cypress</a>
            <a href="/vs/playwright" style={{color:'inherit', textDecoration:'none'}}>vs Playwright</a>
            <a href="/integrations/github-actions" style={{color:'inherit', textDecoration:'none'}}>GitHub Actions</a>
            <a href="/docs" style={{color:'inherit', textDecoration:'none'}}>Docs</a>
            <a href="/thesis" style={{color:'inherit', textDecoration:'none'}}>Thesis</a>
            <a href="mailto:founders@molar.it" style={{color:'inherit', textDecoration:'none'}}>Email</a>
            <a href="https://github.com/pratikranaa/molar-agent" style={{color:'inherit', textDecoration:'none'}}>GitHub</a>
          </div>
        </div>
      </footer>
    </>
  );
}

window.Hero = Hero;
window.Problem = Problem;
window.Superpowers = Superpowers;
window.HowItWorks = HowItWorks;
window.ReleaseLoop = ReleaseLoop;
window.StatefulClones = StatefulClones;
window.CrossAppJourney = CrossAppJourney;
window.Pricing = Pricing;
window.FAQ = FAQ;
window.CTA = CTA;
