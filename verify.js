/* Instant Proof instrument for molar.it/verify — React 18 UMD */
(function () {
  const { useCallback, useEffect, useRef, useState } = React;
  const APP_URL = "https://app.molar.it";
  const PHASES = ["Target", "Browser", "Evidence", "Verdict"];

  async function readJson(response) {
    return response.json();
  }

  function InstantProofInstrument() {
    const [url, setUrl] = useState("https://example.com");
    const [claim, setClaim] = useState("The page explains what this product does");
    const [state, setState] = useState("idle");
    const [error, setError] = useState("");
    const [proof, setProof] = useState(null);
    const [result, setResult] = useState(null);
    const [frameUrl, setFrameUrl] = useState(null);
    const [retention, setRetention] = useState("idle");
    const [retainedOrgId, setRetainedOrgId] = useState(null);
    const [shareState, setShareState] = useState("idle");
    const frameObjectUrl = useRef(null);

    useEffect(() => () => {
      if (frameObjectUrl.current) URL.revokeObjectURL(frameObjectUrl.current);
    }, []);

    const retainProof = useCallback(async (target) => {
      setRetention("saving");
      try {
        const response = await fetch(`/api/instant-proof/${target.proof_id}/claim`, {
          method: "POST",
          headers: { Authorization: `Bearer ${target.proof_token}` },
          credentials: "include",
          cache: "no-store",
        });
        if (response.status === 401) {
          window.location.assign(`${APP_URL}/proof-claim#${target.proof_id}.${target.proof_token}`);
          return;
        }
        if (!response.ok) {
          setRetention("failed");
          return;
        }
        const body = await readJson(response);
        setRetainedOrgId(body.org_id || null);
        setRetention("saved");
      } catch {
        setRetention("failed");
      }
    }, []);

    useEffect(() => {
      if (!proof || state !== "running") return;
      let cancelled = false;
      let timer;
      const authorization = { Authorization: `Bearer ${proof.proof_token}` };

      const loadLatest = async () => {
        try {
          const response = await fetch(`/api/instant-proof/${proof.proof_id}`, {
            headers: authorization,
            credentials: "include",
            cache: "no-store",
          });
          if (cancelled) return;
          if (!response.ok) {
            timer = setTimeout(loadLatest, 1600);
            return;
          }
          const body = await readJson(response);
          setResult(body);
          if (body.status === "completed" || body.status === "failed") {
            setState(body.status === "completed" ? "completed" : "failed");
            return;
          }
          const step = Number(body.latest_frame_step || body.frame_step || 0);
          if (step > 0) {
            const frame = await fetch(`/api/instant-proof/${proof.proof_id}/frame?step=${step}`, {
              headers: authorization,
              credentials: "include",
              cache: "no-store",
            });
            if (frame.ok) {
              const blob = await frame.blob();
              if (frameObjectUrl.current) URL.revokeObjectURL(frameObjectUrl.current);
              const objectUrl = URL.createObjectURL(blob);
              frameObjectUrl.current = objectUrl;
              setFrameUrl(objectUrl);
            }
          }
        } catch {
          /* keep polling */
        }
        if (!cancelled) timer = setTimeout(loadLatest, 1400);
      };

      loadLatest();
      return () => {
        cancelled = true;
        if (timer) clearTimeout(timer);
      };
    }, [proof, state]);

    async function start(event) {
      event.preventDefault();
      setError("");
      setResult(null);
      setFrameUrl(null);
      setRetention("idle");
      setShareState("idle");
      setState("starting");
      try {
        const response = await fetch("/api/instant-proof", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          credentials: "include",
          body: JSON.stringify({ url: url.trim(), claim: claim.trim() }),
          cache: "no-store",
        });
        const body = await readJson(response);
        if (!response.ok) {
          setState("failed");
          setError(body.message || body.error || "Could not start Instant Proof.");
          if (body.hint) setError((prev) => `${prev} ${body.hint}`);
          return;
        }
        setProof(body);
        setState("running");
      } catch (cause) {
        setState("failed");
        setError(cause instanceof Error ? cause.message : "Could not start Instant Proof.");
      }
    }

    async function shareProof() {
      if (!proof) return;
      setShareState("sharing");
      try {
        const response = await fetch(`/api/instant-proof/${proof.proof_id}/share`, {
          method: "POST",
          headers: { Authorization: `Bearer ${proof.proof_token}` },
          credentials: "include",
          cache: "no-store",
        });
        if (!response.ok) {
          setShareState("failed");
          return;
        }
        const body = await readJson(response);
        const href = body.share_url || `${location.origin}/verify#shared`;
        if (navigator.share) await navigator.share({ title: "Molar Instant Proof", url: href });
        else if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(href);
        setShareState("shared");
      } catch {
        setShareState("failed");
      }
    }

    const activePhase = state === "idle" ? 0 : state === "starting" ? 1 : state === "running" ? 2 : 3;
    const verdict =
      result?.result?.pass === true
        ? "Verified"
        : result?.result?.pass === false
          ? "Not verified"
          : "Incomplete";

    return React.createElement(
      "section",
      { className: "instrument", id: "instant-proof", "data-state": state, "aria-labelledby": "instant-proof-title" },
      React.createElement(
        "div",
        { className: "instrument-head" },
        React.createElement("div", null, "Instant proof · ", React.createElement("b", null, state === "idle" ? "Ready" : state)),
        React.createElement("code", null, "READ-ONLY · 1440×900 · 02:00 MAX"),
      ),
      React.createElement(
        "form",
        { className: "panel", onSubmit: start },
        React.createElement("p", { className: "eyebrow", style: { margin: "0 0 8px", color: "var(--ink-3)", font: "600 11px/1 var(--mono)", letterSpacing: ".1em", textTransform: "uppercase" } }, "A public URL. One observable outcome."),
        React.createElement("h2", { id: "instant-proof-title" }, "Watch Molar check it."),
        React.createElement(
          "label",
          { className: "field" },
          React.createElement("span", null, "Public URL"),
          React.createElement("input", {
            required: true,
            type: "url",
            value: url,
            onChange: (e) => setUrl(e.target.value),
          }),
        ),
        React.createElement(
          "label",
          { className: "field" },
          React.createElement("span", null, "Outcome to verify"),
          React.createElement("textarea", {
            required: true,
            rows: 3,
            maxLength: 1000,
            value: claim,
            onChange: (e) => setClaim(e.target.value),
          }),
        ),
        React.createElement(
          "button",
          {
            className: "primary",
            type: "submit",
            disabled: state === "starting" || state === "running",
          },
          state === "failed"
            ? "Try again"
            : state === "starting"
              ? "Starting browser…"
              : state === "running"
                ? "Browser running"
                : state === "completed"
                  ? "Run another proof"
                  : "Run proof",
        ),
        React.createElement("p", { className: "policy" }, "Public targets only. No credentials, mutations, or retained history before signup."),
        error ? React.createElement("p", { className: "error", role: "alert" }, error) : null,
      ),
      React.createElement(
        "div",
        { className: "stage", "aria-live": "polite" },
        React.createElement(
          "div",
          { className: "phases", "aria-label": "Proof progress" },
          PHASES.map((phase, index) =>
            React.createElement("span", { key: phase, "data-active": index <= activePhase || undefined }, phase),
          ),
        ),
        React.createElement(
          "div",
          { className: "browser" },
          React.createElement(
            "div",
            { className: "browser-bar" },
            React.createElement("code", null, state === "idle" ? "Waiting for an authorized target" : url),
            React.createElement("b", null, state === "running" ? "LIVE" : state.toUpperCase()),
          ),
          React.createElement(
            "div",
            { className: "frame" },
            frameUrl
              ? React.createElement("img", { alt: "Latest frame from the proof browser", src: frameUrl })
              : React.createElement(
                  "div",
                  null,
                  React.createElement("span", null, state === "running" ? "Browser session active" : "No browser session"),
                  React.createElement(
                    "strong",
                    null,
                    state === "idle"
                      ? "Your target appears here."
                      : state === "running"
                        ? "Following the page, frame by frame."
                        : verdict,
                  ),
                  React.createElement(
                    "small",
                    null,
                    state === "running"
                      ? "Evidence is captured as the browser settles."
                      : "Nothing is simulated in this viewport.",
                  ),
                ),
          ),
        ),
      ),
      React.createElement(
        "aside",
        { className: "evidence", "aria-label": "Proof evidence" },
        React.createElement(
          "header",
          null,
          React.createElement("span", null, "Evidence"),
          React.createElement("code", null, proof ? proof.proof_id.slice(0, 8) : "—"),
        ),
        state === "completed"
          ? React.createElement(
              "div",
              { className: "verdict", "data-pass": result?.result?.pass === true || undefined },
              React.createElement("span", null, "Terminal verdict"),
              React.createElement("strong", null, verdict),
              React.createElement(
                "p",
                null,
                result?.result?.rationale || "The run completed without a semantic rationale.",
              ),
              result?.result?.trace_id
                ? React.createElement("code", null, `trace / ${result.result.trace_id}`)
                : null,
              React.createElement(
                "div",
                { className: "actions" },
                React.createElement(
                  "button",
                  { type: "button", onClick: () => void shareProof(), disabled: shareState === "sharing" },
                  shareState === "sharing"
                    ? "Creating link…"
                    : shareState === "shared"
                      ? "Link ready"
                      : shareState === "failed"
                        ? "Retry share"
                        : "Share proof",
                ),
                retention === "saved"
                  ? React.createElement(
                      "a",
                      { href: `${APP_URL}/?org=${encodeURIComponent(retainedOrgId || "")}` },
                      "Open workspace",
                    )
                  : React.createElement(
                      "button",
                      {
                        className: "retain",
                        type: "button",
                        disabled: retention === "saving",
                        onClick: () => proof && void retainProof(proof),
                      },
                      retention === "saving"
                        ? "Saving proof…"
                        : retention === "failed"
                          ? "Retry saving"
                          : "Keep this proof",
                    ),
              ),
            )
          : React.createElement(
              "ol",
              null,
              React.createElement(
                "li",
                { "data-active": state !== "idle" || undefined },
                React.createElement("span", null, "01"),
                React.createElement(
                  "div",
                  null,
                  React.createElement("b", null, "Target policy"),
                  React.createElement("small", null, state === "idle" ? "Pending" : "Public origin accepted"),
                ),
              ),
              React.createElement(
                "li",
                { "data-active": state === "running" || undefined },
                React.createElement("span", null, "02"),
                React.createElement(
                  "div",
                  null,
                  React.createElement("b", null, "Real browser"),
                  React.createElement("small", null, state === "running" ? "Session in progress" : "Not started"),
                ),
              ),
              React.createElement(
                "li",
                null,
                React.createElement("span", null, "03"),
                React.createElement(
                  "div",
                  null,
                  React.createElement("b", null, "Semantic check"),
                  React.createElement("small", null, "Awaiting evidence"),
                ),
              ),
            ),
        React.createElement(
          "footer",
          null,
          React.createElement("span", null, "Capability expires"),
          React.createElement(
            "code",
            null,
            proof
              ? new Date(proof.expires_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : "15 min after start",
          ),
        ),
      ),
    );
  }

  function App() {
    return React.createElement(
      "div",
      { className: "verify-shell" },
      React.createElement(
        "header",
        { className: "verify-nav" },
        React.createElement(
          "a",
          { className: "verify-brand", href: "/" },
          React.createElement("span", null, "M"),
          "Molar",
        ),
        React.createElement(
          "nav",
          null,
          React.createElement("a", { href: "/docs" }, "Docs"),
          React.createElement("a", { href: APP_URL }, "Console"),
          React.createElement("a", { className: "btn", href: "#instant-proof" }, "Run proof"),
        ),
      ),
      React.createElement(
        "main",
        { className: "verify-main" },
        React.createElement(
          "div",
          { className: "verify-hero" },
          React.createElement("p", { className: "eyebrow" }, "Instant Proof"),
          React.createElement("h1", null, "Verify any public URL before you sign up."),
          React.createElement(
            "p",
            null,
            "Molar launches a real browser, checks one observable claim, and returns replayable evidence. No account required to start.",
          ),
        ),
        React.createElement(InstantProofInstrument),
      ),
    );
  }

  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(React.createElement(App));
})();
