// Animated terminal showing `npx molar-agent init` flow
// Plays a scripted sequence with realistic timing

const TERMINAL_SCRIPT = [
  { t: 0, type: 'prompt', text: '~/acme-app' },
  { t: 200, type: 'cmd', text: 'npx molar-agent init' },
  { t: 700, type: 'newline' },
  { t: 900, type: 'dim', text: '✱ molar v1.0.4' },
  { t: 1100, type: 'newline' },
  { t: 1200, type: 'info', text: '→ reading codebase…' },
  { t: 1900, type: 'replace-last', type2: 'ok', text: '✓ codebase scanned   124 routes, 38 forms, 12 auth states' },
  { t: 2100, type: 'newline' },
  { t: 2200, type: 'info', text: '→ cloning external services…' },
  { t: 3100, type: 'replace-last', type2: 'ok', text: '✓ stripe · sendgrid · postgres · s3   destruction-safe' },
  { t: 3300, type: 'newline' },
  { t: 3400, type: 'info', text: '→ generating tests from production traces…' },
  { t: 4400, type: 'replace-last', type2: 'ok', text: '✓ 47 tests written   3 critical paths flagged' },
  { t: 4600, type: 'newline' },
  { t: 4700, type: 'dim', text: '─────────────────────────────────────────────' },
  { t: 4800, type: 'newline' },
  { t: 4900, type: 'hl', text: 'running suite…' },
  { t: 5100, type: 'newline' },
  { t: 5200, type: 'ok', text: '  ✓  checkout.flow              1.2s' },
  { t: 5350, type: 'ok', text: '  ✓  auth.signup                 0.8s' },
  { t: 5500, type: 'ok', text: '  ✓  auth.login                  0.4s' },
  { t: 5650, type: 'ok', text: '  ✓  dashboard.load              0.6s' },
  { t: 5800, type: 'err', text: '  ✗  checkout.coupon             expected $9.00, got $90.00' },
  { t: 6000, type: 'dim', text: '       └ regression introduced in PR #421 (claude-3.7-sonnet)' },
  { t: 6300, type: 'ok', text: '  ✓  account.settings            0.5s' },
  { t: 6450, type: 'warn', text: '  !  email.transactional        slow (2.4s, p95)' },
  { t: 6700, type: 'newline' },
  { t: 6800, type: 'dim', text: '─────────────────────────────────────────────' },
  { t: 6900, type: 'newline' },
  { t: 7000, type: 'hl', text: '47 tests · 45 passed · 1 failed · 1 warning' },
  { t: 7100, type: 'newline' },
  { t: 7200, type: 'ok', text: '✓ guarding production    open in dashboard ↗' },
  { t: 7400, type: 'newline' },
  { t: 7500, type: 'prompt', text: '~/acme-app' },
  { t: 7700, type: 'cursor' },
];

const TOTAL_DURATION = 9500; // before loop

function Terminal({ speed = 1 }) {
  const [tick, setTick] = React.useState(0);
  const [restartKey, setRestartKey] = React.useState(0);

  React.useEffect(() => {
    const start = performance.now();
    let raf;
    const step = (now) => {
      const elapsed = (now - start) * speed;
      setTick(elapsed);
      if (elapsed < TOTAL_DURATION) {
        raf = requestAnimationFrame(step);
      } else {
        // restart
        setTimeout(() => setRestartKey(k => k + 1), 1500);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [restartKey, speed]);

  // Build visible lines from script
  const lines = [];
  let currentLine = [];
  for (let i = 0; i < TERMINAL_SCRIPT.length; i++) {
    const ev = TERMINAL_SCRIPT[i];
    if (ev.t > tick) break;
    if (ev.type === 'newline') {
      lines.push(currentLine);
      currentLine = [];
    } else if (ev.type === 'replace-last') {
      // overwrite the previous line content
      if (lines.length > 0) {
        lines[lines.length - 1] = [{ type: ev.type2, text: ev.text }];
      } else if (currentLine.length > 0) {
        currentLine = [{ type: ev.type2, text: ev.text }];
      }
    } else if (ev.type === 'cursor') {
      currentLine.push({ type: 'cursor' });
    } else {
      currentLine.push({ type: ev.type, text: ev.text });
    }
  }
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  return (
    <div className="terminal">
      <div className="term-bar">
        <span className="light r"></span>
        <span className="light y"></span>
        <span className="light g"></span>
        <span className="label">molar — zsh — 92×24</span>
      </div>
      <div className="term-body">
        {lines.map((line, i) => (
          <div key={i}>
            {line.length === 0 ? '\u00A0' : line.map((seg, j) => {
              if (seg.type === 'cursor') return <span key={j} className="cursor"></span>;
              if (seg.type === 'prompt') return <span key={j}><span className="term-prompt">{seg.text}</span><span className="term-dim"> ❯ </span></span>;
              if (seg.type === 'cmd') return <span key={j} className="term-cmd">{seg.text}</span>;
              if (seg.type === 'dim') return <span key={j} className="term-dim">{seg.text}</span>;
              if (seg.type === 'ok') return <span key={j} className="term-ok">{seg.text}</span>;
              if (seg.type === 'err') return <span key={j} className="term-err">{seg.text}</span>;
              if (seg.type === 'warn') return <span key={j} className="term-warn">{seg.text}</span>;
              if (seg.type === 'info') return <span key={j} className="term-info">{seg.text}</span>;
              if (seg.type === 'hl') return <span key={j} className="term-hl">{seg.text}</span>;
              return <span key={j}>{seg.text}</span>;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

window.Terminal = Terminal;
