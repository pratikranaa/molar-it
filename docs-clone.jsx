// Renders /docs/clones/:id — Archal-style per-clone reference pages.

function CloneDocPage() {
  const slug = React.useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const fromQuery = params.get('slug');
    if (fromQuery) return fromQuery;
    const m = window.location.pathname.match(/\/docs\/clones\/([^/]+)/);
    return m ? decodeURIComponent(m[1]) : '';
  }, []);

  const doc = slug ? window.getCloneDoc(slug) : null;
  const allIds = window.listCloneDocIds();

  React.useEffect(() => {
    if (!doc) {
      document.title = 'Clone not found — Molar Docs';
      return;
    }
    document.title = `${doc.title} — Molar Docs`;
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.href = `https://molar.it/docs/clones/${doc.id}`;
  }, [doc]);

  if (!doc) {
    return (
      <main className="doc-page">
        <div className="frame">
          <h1 className="doc-title">Clone not found</h1>
          <p className="doc-lede">No documentation for <code className="mono">{slug || '(missing id)'}</code>.</p>
          <a className="doc-back" href="/docs"><span className="arrow">←</span> Back to docs</a>
        </div>
      </main>
    );
  }

  return (
    <main className="doc-page">
      <div className="frame">
        <div className="doc-meta">
          <span className="num">Clones</span>
          <span className="rule"></span>
          <span>{doc.id}</span>
        </div>

        <div className="doc-grid">
          <aside className="doc-sidebar">
            <div className="doc-side-block">
              <span className="doc-side-label">Clone ID</span>
              <span className="doc-side-meta mono">{doc.id}</span>
            </div>
            <div className="doc-side-block">
              <span className="doc-side-label">Tier</span>
              <span className="doc-side-meta">{doc.tier}</span>
            </div>
            {doc.previewStatus ? (
              <div className="doc-side-block">
                <span className="doc-side-label">Status</span>
                <span className="doc-side-meta">{doc.previewStatus}</span>
              </div>
            ) : null}
            <nav className="doc-toc" aria-label="On this page">
              <a href="#start"><span>·</span>Start here</a>
              <a href="#covers"><span>·</span>What it covers</a>
              {doc.toolGroups.length > 0 ? <a href="#tools"><span>·</span>Available tools</a> : null}
              <a href="#surface"><span>·</span>Surface</a>
              {doc.notes.length > 0 ? <a href="#notes"><span>·</span>Notes</a> : null}
            </nav>
            <nav className="doc-toc doc-toc-clones" aria-label="All clones">
              <span className="doc-side-label" style={{ marginBottom: 4 }}>Catalog</span>
              {allIds.map((id) => (
                <a key={id} href={`/docs/clones/${id}`} className={id === doc.id ? 'is-active' : ''}>
                  <span>·</span>{window.cloneDisplayName(id)}
                </a>
              ))}
            </nav>
          </aside>

          <article className="doc-article clone-doc">
            <header>
              <h1 className="doc-title">{doc.title}</h1>
              <p className="doc-lede">{doc.tagline}</p>
              {doc.summary ? <p className="doc-summary">{doc.summary}</p> : null}
              <p className="clone-doc-id mono">Clone ID: <code>{doc.id}</code></p>
            </header>

            <section className="doc-step" id="start">
              <span className="doc-step-eyebrow">Start here</span>
              <h2>Connect and test</h2>
              <table className="clone-doc-table">
                <tbody>
                  <tr><th>Best for</th><td>{doc.startHere.bestFor}</td></tr>
                  <tr><th>Connect with</th><td>{doc.startHere.connectWith}</td></tr>
                  <tr><th>Known limits</th><td>{doc.startHere.knownLimits}</td></tr>
                  <tr><th>Seeds</th><td>{doc.startHere.seeds}</td></tr>
                </tbody>
              </table>
            </section>

            <section className="doc-step" id="covers">
              <span className="doc-step-eyebrow">What it covers</span>
              <h2>Workflows</h2>
              <ul className="clone-doc-list">
                {doc.covers.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>

            {doc.toolGroups.length > 0 ? (
              <section className="doc-step" id="tools">
                <span className="doc-step-eyebrow">Available tools</span>
                <h2>{doc.toolsTitle || 'Available tools'}</h2>
                {doc.toolsSubtitle ? <p className="doc-tools-lede">{doc.toolsSubtitle}</p> : null}
                {doc.toolGroups.map((group) => (
                  <div className="clone-doc-tool-group" key={group.title}>
                    <h3>{group.title}</h3>
                    <table className="clone-doc-tools-table">
                      <thead>
                        <tr><th>Tool</th><th>Description</th></tr>
                      </thead>
                      <tbody>
                        {group.tools.map(([tool, desc]) => (
                          <tr key={tool}>
                            <td><code className="mono">{tool}</code></td>
                            <td>{desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </section>
            ) : null}

            <section className="doc-step" id="surface">
              <span className="doc-step-eyebrow">Surface</span>
              <h2>Routing</h2>
              <p>{doc.surface}</p>
            </section>

            {doc.notes.length > 0 ? (
              <section className="doc-step" id="notes">
                <span className="doc-step-eyebrow">Notes</span>
                <h2>Details</h2>
                <ul className="clone-doc-list">
                  {doc.notes.map((note) => <li key={note}>{note}</li>)}
                </ul>
              </section>
            ) : null}

            <a className="doc-back" href="/#clones"><span className="arrow">←</span> Back to clone catalog</a>
          </article>
        </div>
      </div>
    </main>
  );
}

const root = document.getElementById('clone-doc-root');
if (root) {
  ReactDOM.createRoot(root).render(<CloneDocPage />);
}
