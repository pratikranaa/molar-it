// Tweaks app for Molar landing page

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "signal-red",
  "headline": "users-qa",
  "density": "default"
}/*EDITMODE-END*/;

const ACCENTS = {
  'signal-red': 'oklch(0.56 0.18 28)',
  'electric-blue': 'oklch(0.55 0.18 245)',
  'jade': 'oklch(0.55 0.14 165)',
  'amber': 'oklch(0.7 0.16 70)',
  'ink': 'oklch(0.25 0.02 60)',
};

const HEADLINES = {
  'users-qa': {
    h1: <>Your <span className="strike">users</span><br/>shouldn't be<br/>your <em>QA team.</em></>,
    sub: <>An autonomous QA agent that reads your app, writes the tests, and guards production in real time — <span className="pop">without ever charging a real card, emailing a real user, or touching a real account.</span></>,
  },
  'destruction-free': {
    h1: <>Test <em>everything.</em><br/>Break <span className="strike">nothing.</span></>,
    sub: <><span className="pop">Molar</span> clones your entire stack — Stripe, SendGrid, Postgres, Slack — and runs your tests against the clone. Same APIs, same errors. <span className="pop">No real cards, no real emails, no real users.</span></>,
  },
  'ai-wrote-it': {
    h1: <>AI wrote the code.<br/><em>We</em> guard the prod.</>,
    sub: <>46% of code is now AI-generated. Cursor crossed $2B ARR. Your test suite hasn't moved. <span className="pop">Molar</span> closes the gap.</>,
  },
  'paste-url': {
    h1: <>Paste a URL.<br/>Get a <em>full-time</em><br/>QA engineer.</>,
    sub: <>Sixty seconds from <span className="pop">npx molar-agent init</span> to your first regression caught. No fixtures, no YAML, no four-month onboarding.</>,
  },
};

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply accent
  React.useEffect(() => {
    document.documentElement.style.setProperty('--signal', ACCENTS[tweaks.accent] || ACCENTS['signal-red']);
    // softer variant
    const c = ACCENTS[tweaks.accent];
    if (c) {
      // create soft variant by reducing chroma & boosting lightness
      document.documentElement.style.setProperty('--signal-soft',
        c.replace(/oklch\(([^)]+)\)/, (_, vals) => {
          const [l, ch, h] = vals.split(/\s+/);
          return `oklch(0.94 ${(parseFloat(ch) * 0.3).toFixed(3)} ${h})`;
        })
      );
    }
  }, [tweaks.accent]);

  React.useEffect(() => {
    document.body.classList.toggle('density-tight', tweaks.density === 'tight');
    document.body.classList.toggle('density-airy', tweaks.density === 'airy');
  }, [tweaks.density]);

  React.useEffect(() => {
    document.documentElement.classList.remove('no-js');
    document.documentElement.classList.add('js');

    const scrollFromHash = () => {
      const hash = window.location.hash;
      if (!hash || hash.length < 2) return;
      if (window.scrollToSection) {
        window.scrollToSection(hash, 'auto');
        return;
      }
      const id = hash.slice(1);
      let tries = 0;
      const attempt = () => {
        const root = document.getElementById('root');
        const el = root
          ? root.querySelector('#' + CSS.escape(id)) || document.getElementById(id)
          : document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: tries === 0 ? 'auto' : 'smooth', block: 'start' });
          return;
        }
        if (tries++ < 40) requestAnimationFrame(attempt);
      };
      requestAnimationFrame(attempt);
    };

    scrollFromHash();
    window.addEventListener('hashchange', scrollFromHash);
    return () => window.removeEventListener('hashchange', scrollFromHash);
  }, []);

  const headline = HEADLINES[tweaks.headline] || HEADLINES['users-qa'];

  return (
    <>
      <div className="paper-grain"></div>
      <Nav />
      <Hero headlineH1={headline.h1} headlineSub={headline.sub} />
      <Problem />
      <Superpowers />
      <HowItWorks />
      <ReleaseLoop />
      <StatefulClones />
      <CrossAppJourney />
      <Pricing />
      <FAQ />
      <CTA />

      <TweaksPanel title="Tweaks">
        <TweakSection title="Accent">
          <TweakRadio
            label="Color"
            value={tweaks.accent}
            onChange={(v) => setTweak('accent', v)}
            options={[
              { value: 'signal-red', label: 'Signal' },
              { value: 'electric-blue', label: 'Electric' },
              { value: 'jade', label: 'Jade' },
              { value: 'amber', label: 'Amber' },
              { value: 'ink', label: 'Ink' },
            ]}
          />
        </TweakSection>
        <TweakSection title="Headline">
          <TweakSelect
            label="Variant"
            value={tweaks.headline}
            onChange={(v) => setTweak('headline', v)}
            options={[
              { value: 'users-qa', label: 'Autonomous continuous QA (default)' },
              { value: 'destruction-free', label: 'Test everything. Break nothing.' },
              { value: 'ai-wrote-it', label: 'AI wrote the code. We guard the prod.' },
              { value: 'paste-url', label: 'Paste a URL. Get a QA engineer.' },
            ]}
          />
        </TweakSection>
        <TweakSection title="Density">
          <TweakRadio
            label="Spacing"
            value={tweaks.density}
            onChange={(v) => setTweak('density', v)}
            options={[
              { value: 'tight', label: 'Tight' },
              { value: 'default', label: 'Default' },
              { value: 'airy', label: 'Airy' },
            ]}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
