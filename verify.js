/* Instant Proof instrument for molar.it/verify — React 18 UMD */
(function () {
  const { useCallback, useEffect, useRef, useState } = React;
  const APP_URL = "https://app.molar.it";
  const PHASES = ["Target", "Browser", "Evidence", "Verdict"];
  const RUN_LIMIT_MS = 2 * 60 * 1000;
  const DELIVERY_GRACE_MS = 10 * 1000;
  const POLL_WINDOW_MS = RUN_LIMIT_MS + DELIVERY_GRACE_MS;
  const TRANSIENT_STATUSES = new Set([408, 425, 429, 500, 502, 503, 504]);
  const TERMINAL_STATUSES = new Set(["completed", "failed", "claimed", "cancelled", "error"]);
  const SHARE_TOKEN = /^molar_share_[A-Za-z0-9_-]{32,}$/;

  async function readJson(response) {
    return response.json();
  }

  async function fetchBounded(input, init, parentSignal, timeoutMs, consume) {
    if (parentSignal.aborted) {
      throw new DOMException("The request was aborted.", "AbortError");
    }
    const requestController = new AbortController();
    const timeout = setTimeout(() => requestController.abort(), timeoutMs);
    const abortRequest = () => requestController.abort();
    parentSignal.addEventListener("abort", abortRequest, { once: true });
    try {
      const response = await fetch(input, { ...init, signal: requestController.signal });
      return consume ? await consume(response) : response;
    } finally {
      clearTimeout(timeout);
      parentSignal.removeEventListener("abort", abortRequest);
    }
  }

  function customerStartError(body, status) {
    const code = body && typeof body.error === "string" ? body.error : "";
    if (code === "instant_proof_in_progress") {
      return "A proof is already running for this browser. Wait for it to finish, then try again.";
    }
    if (code === "target_authorization_failed" || code === "target_not_allowed") {
      return "That target could not be authorized. Use a public URL you are allowed to test.";
    }
    if (code === "invalid_json" || code === "invalid_proof_input") {
      return "Check the URL and outcome, then try again.";
    }
    if (status === 429 || code === "rate_limited") {
      return "Too many proof attempts right now. Wait a moment, then try again.";
    }
    if (status >= 500 || code === "instant_proof_unavailable") {
      return "Instant Proof is temporarily unavailable. Try again in a moment.";
    }
    return "Instant Proof could not start this run. Check the public URL and try again.";
  }

  function consumeSharedToken() {
    const raw = window.location.hash.slice(1);
    if (!raw) return null;
    let token = raw;
    try {
      token = decodeURIComponent(raw);
    } catch {
      token = "";
    }
    window.history.replaceState(null, document.title, `${window.location.pathname}${window.location.search}`);
    return SHARE_TOKEN.test(token) ? token : null;
  }

  function sharedFramePath(value) {
    if (typeof value !== "string" || !value) return null;
    try {
      const target = new URL(value, window.location.origin);
      if (target.origin !== window.location.origin) return null;
      if (target.pathname === "/api/v1/instant-proof/shared/frame") {
        target.pathname = "/api/instant-proof/shared/frame";
      }
      return target.pathname === "/api/instant-proof/shared/frame" ? `${target.pathname}${target.search}` : null;
    } catch {
      return null;
    }
  }

  function shareHref(token, suppliedUrl) {
    if (typeof suppliedUrl === "string" && suppliedUrl) {
      try {
        const target = new URL(suppliedUrl, window.location.origin);
        const fragment = decodeURIComponent(target.hash.slice(1));
        if (target.origin === window.location.origin && target.pathname === "/verify" && SHARE_TOKEN.test(fragment)) {
          return target.toString();
        }
      } catch {
        return null;
      }
      return null;
    }
    return token ? `${window.location.origin}/verify#${encodeURIComponent(token)}` : null;
  }

  function frameStepFrom(body) {
    const nested = body?.result && typeof body.result === "object" ? body.result : null;
    for (const value of [
      body?.latest_frame_step,
      body?.frame_step,
      nested?.latest_frame_step,
      nested?.frame_step,
    ]) {
      if (Number.isInteger(value) && value >= 0 && value <= 1000) return value;
    }
    // Cartographer reports `steps_used` as a count while screenshot paths use
    // the zero-based step index, so the last available frame is count - 1.
    for (const value of [body?.steps_used, nested?.steps_used]) {
      if (Number.isInteger(value) && value > 0 && value <= 1001) return value - 1;
    }
    return null;
  }

  function InstantProofInstrument({ onSharedChange }) {
    const [sharedToken, setSharedToken] = useState(consumeSharedToken);
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
    const [sharedState, setSharedState] = useState(sharedToken ? "loading" : "idle");
    const [sharedProof, setSharedProof] = useState(null);
    const [sharedFrameUrl, setSharedFrameUrl] = useState(null);
    const [sharedError, setSharedError] = useState("");
    const frameObjectUrl = useRef(null);
    const pollAbortRef = useRef(null);
    const startAbortRef = useRef(null);
    const latestFrameStepRef = useRef(-1);
    const nextFrameStepRef = useRef(0);
    const [terminal, setTerminal] = useState(false);

    useEffect(() => onSharedChange(Boolean(sharedToken)), [sharedToken, onSharedChange]);

    useEffect(() => {
      const openSharedLink = () => setSharedToken(consumeSharedToken());
      window.addEventListener("hashchange", openSharedLink);
      return () => window.removeEventListener("hashchange", openSharedLink);
    }, []);

    useEffect(() => () => {
      if (pollAbortRef.current) pollAbortRef.current.abort();
      if (startAbortRef.current) startAbortRef.current.abort();
      if (frameObjectUrl.current) URL.revokeObjectURL(frameObjectUrl.current);
    }, []);

    useEffect(() => {
      if (!sharedToken) return;
      setSharedState("loading");
      setSharedProof(null);
      setSharedFrameUrl(null);
      setSharedError("");
      const controller = new AbortController();
      const authorization = { Authorization: `Bearer ${sharedToken}` };
      let objectUrl = null;
      const loadShared = async () => {
        try {
          const { response, body } = await fetchBounded("/api/instant-proof/shared", {
            headers: authorization,
            credentials: "include",
            cache: "no-store",
          }, controller.signal, 10000, async (candidate) => ({
            response: candidate,
            body: candidate.ok ? await readJson(candidate) : null,
          }));
          if (!response.ok) {
            setSharedError(response.status === 401 || response.status === 404
              ? "This shared proof has expired or is no longer available."
              : "The shared proof could not be loaded. Try again later.");
            setSharedState("failed");
            return;
          }
          if (controller.signal.aborted) return;
          setSharedProof(body);
          const framePath = sharedFramePath(body.links?.frame);
          if (framePath) {
            const { response: frame, blob } = await fetchBounded(framePath, {
              headers: authorization,
              credentials: "include",
              cache: "no-store",
            }, controller.signal, 5000, async (candidate) => ({
              response: candidate,
              blob: candidate.ok ? await candidate.blob() : null,
            }));
            if (frame.ok) {
              if (controller.signal.aborted) return;
              objectUrl = URL.createObjectURL(blob);
              frameObjectUrl.current = objectUrl;
              setSharedFrameUrl(objectUrl);
            } else if (frame.status === 401 || frame.status === 404) {
              setSharedError("The shared proof is available, but its frame has expired.");
            }
          }
          if (!controller.signal.aborted) setSharedState("ready");
        } catch {
          if (!controller.signal.aborted) {
            setSharedError("The shared proof could not be loaded. Try again later.");
            setSharedState("failed");
          }
        }
      };
      void loadShared();
      return () => {
        controller.abort();
        if (objectUrl) URL.revokeObjectURL(objectUrl);
      };
    }, [sharedToken]);

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
      const controller = new AbortController();
      pollAbortRef.current = controller;
      let timer;
      let transientFailures = 0;
      const deadline = Date.now() + POLL_WINDOW_MS;
      const authorization = { Authorization: `Bearer ${proof.proof_token}` };

      const stopWithError = (message) => {
        if (controller.signal.aborted) return;
        setError(message);
        setResult(null);
        setTerminal(false);
        setState("failed");
      };

      const schedule = (delay) => {
        const remaining = deadline - Date.now();
        if (remaining <= 0) {
          stopWithError("This proof did not finish within the two-minute window. Start a new proof.");
          return;
        }
        timer = setTimeout(loadLatest, Math.min(delay, remaining));
      };

      const loadFrame = async (step) => {
        if (!Number.isInteger(step) || step < 0 || step > 1000 || controller.signal.aborted) return;
        try {
          const { response: frame, blob } = await fetchBounded(`/api/instant-proof/${proof.proof_id}/frame?step=${step}`, {
            headers: authorization,
            credentials: "include",
            cache: "no-store",
          }, controller.signal, Math.min(5000, Math.max(1000, deadline - Date.now())), async (candidate) => ({
            response: candidate,
            blob: candidate.ok ? await candidate.blob() : null,
          }));
          if (!frame.ok) return;
          if (controller.signal.aborted) return;
          const objectUrl = URL.createObjectURL(blob);
          if (frameObjectUrl.current) URL.revokeObjectURL(frameObjectUrl.current);
          frameObjectUrl.current = objectUrl;
          latestFrameStepRef.current = step;
          nextFrameStepRef.current = step + 1;
          setFrameUrl(objectUrl);
        } catch {
          /* The terminal verdict remains useful if the last frame is unavailable. */
        }
      };

      const loadLatest = async () => {
        if (controller.signal.aborted) return;
        if (Date.now() >= deadline) {
          stopWithError("This proof did not finish within the two-minute window. Start a new proof.");
          return;
        }
        try {
          const { response, body, parseError } = await fetchBounded(`/api/instant-proof/${proof.proof_id}`, {
            headers: authorization,
            credentials: "include",
            cache: "no-store",
          }, controller.signal, Math.min(10000, Math.max(1000, deadline - Date.now())), async (candidate) => {
            if (!candidate.ok) return { response: candidate };
            try {
              return { response: candidate, body: await readJson(candidate) };
            } catch {
              return { response: candidate, parseError: true };
            }
          });
          if (controller.signal.aborted) return;
          if (!response.ok) {
            if (response.status === 401 || response.status === 403) {
              stopWithError("This proof is no longer authorized. Start a new proof.");
              return;
            }
            if (response.status === 404 || response.status === 410) {
              stopWithError("This proof has expired or is no longer available. Start a new proof.");
              return;
            }
            if (TRANSIENT_STATUSES.has(response.status)) {
              transientFailures += 1;
              schedule(Math.min(5000, 1200 * 2 ** Math.min(transientFailures - 1, 2)));
              return;
            }
            stopWithError("The proof status could not be read. Start a new proof.");
            return;
          }
          if (parseError) {
            transientFailures += 1;
            schedule(Math.min(5000, 1200 * 2 ** Math.min(transientFailures - 1, 2)));
            return;
          }
          if (controller.signal.aborted) return;
          transientFailures = 0;
          if (body.status === "expired" || body.status === "missing") {
            stopWithError("This proof has expired or is no longer available. Start a new proof.");
            return;
          }
          if (body.status === "unauthorized") {
            stopWithError("This proof is no longer authorized. Start a new proof.");
            return;
          }
          const step = frameStepFrom(body);
          // The status contract exposes a count only after completion. While
          // running, read each captured step through the existing frame API.
          await loadFrame(step === null ? nextFrameStepRef.current : step);
          if (controller.signal.aborted) return;
          if (TERMINAL_STATUSES.has(body.status)) {
            setResult(body);
            setTerminal(true);
            setState(body.status === "completed" ? "completed" : "failed");
            return;
          }
        } catch {
          if (controller.signal.aborted) return;
          transientFailures += 1;
          schedule(Math.min(5000, 1200 * 2 ** Math.min(transientFailures - 1, 2)));
          return;
        }
        schedule(1400);
      };

      void loadLatest();
      return () => {
        controller.abort();
        if (timer) clearTimeout(timer);
        if (pollAbortRef.current === controller) pollAbortRef.current = null;
      };
    }, [proof, state]);

    async function start(event) {
      event.preventDefault();
      if (pollAbortRef.current) pollAbortRef.current.abort();
      if (startAbortRef.current) startAbortRef.current.abort();
      const controller = new AbortController();
      startAbortRef.current = controller;
      setError("");
      setProof(null);
      setResult(null);
      setTerminal(false);
      latestFrameStepRef.current = -1;
      nextFrameStepRef.current = 0;
      if (frameObjectUrl.current) {
        URL.revokeObjectURL(frameObjectUrl.current);
        frameObjectUrl.current = null;
      }
      setFrameUrl(null);
      setRetention("idle");
      setRetainedOrgId(null);
      setShareState("idle");
      setState("starting");
      try {
        const { response, body } = await fetchBounded("/api/instant-proof", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          credentials: "include",
          body: JSON.stringify({ url: url.trim(), claim: claim.trim() }),
          cache: "no-store",
        }, controller.signal, 10000, async (candidate) => ({
          response: candidate,
          body: await readJson(candidate),
        }));
        if (controller.signal.aborted) return;
        if (controller.signal.aborted) return;
        if (!response.ok) {
          setState("failed");
          setError(customerStartError(body, response.status));
          return;
        }
        setProof(body);
        setState("running");
      } catch {
        if (controller.signal.aborted) return;
        setState("failed");
        setError("Instant Proof is temporarily unavailable. Try again in a moment.");
      } finally {
        if (startAbortRef.current === controller) startAbortRef.current = null;
      }
    }

    async function shareProof() {
      if (!proof) return;
      setShareState("sharing");
      try {
        const frameStep = Number.isInteger(latestFrameStepRef.current) && latestFrameStepRef.current > 0
          ? latestFrameStepRef.current
          : 0;
        const response = await fetch(`/api/instant-proof/${proof.proof_id}/share`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${proof.proof_token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ frame_step: frameStep }),
          cache: "no-store",
        });
        if (!response.ok) {
          setShareState("failed");
          return;
        }
        const body = await readJson(response);
        const token = typeof body.share_token === "string" && SHARE_TOKEN.test(body.share_token)
          ? body.share_token
          : null;
        const suppliedUrl = typeof body.share_url === "string" ? body.share_url : null;
        const href = shareHref(token, suppliedUrl);
        if (!href) {
          setShareState("failed");
          return;
        }
        if (navigator.share) {
          try {
            await navigator.share({ title: "Molar Instant Proof", url: href });
          } catch (cause) {
            if (cause?.name === "AbortError") {
              setShareState("idle");
              return;
            }
            throw cause;
          }
        } else if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(href);
        } else {
          setShareState("failed");
          return;
        }
        setShareState("shared");
      } catch {
        setShareState("failed");
      }
    }

    if (sharedToken) {
      const sharedVerdict =
        sharedState === "loading"
          ? "Loading shared proof"
          : sharedProof?.result?.pass === true
            ? "Verified"
            : sharedProof?.result?.pass === false
              ? "Not verified"
              : sharedProof?.status === "completed"
                ? "Incomplete"
                : "No result";
      return React.createElement(
        "section",
        { className: "instrument shared-proof", id: "instant-proof", "data-state": sharedState, "aria-labelledby": "instant-proof-title" },
        React.createElement(
          "div",
          { className: "instrument-head" },
          React.createElement(
            "h2",
            {
              id: "instant-proof-title",
              style: { margin: 0, font: "inherit", fontWeight: "inherit", fontSize: "inherit", letterSpacing: "inherit" },
            },
            "Instant proof · ",
            React.createElement("b", null, "Shared proof"),
          ),
          React.createElement("code", null, "READ-ONLY EVIDENCE"),
        ),
        React.createElement(
          "div",
          { className: "stage", "aria-live": "polite" },
          React.createElement(
            "div",
            { className: "browser" },
            React.createElement(
              "div",
              { className: "browser-bar" },
              React.createElement("code", null, sharedProof?.target_url || "Shared evidence"),
              React.createElement("b", null, sharedState === "loading" ? "LOADING" : sharedState.toUpperCase()),
            ),
            React.createElement(
              "div",
              { className: "frame" },
              sharedFrameUrl
                ? React.createElement("img", { alt: "Frame captured during the shared proof", src: sharedFrameUrl })
                : React.createElement(
                    "div",
                    null,
                    React.createElement("span", null, sharedState === "loading" ? "Loading shared evidence" : "No frame available"),
                    React.createElement("strong", null, sharedState === "failed" ? "Shared proof unavailable" : sharedVerdict),
                    React.createElement("small", null, sharedError || "This view contains evidence from one bounded browser run."),
                  ),
            ),
          ),
        ),
        React.createElement(
          "aside",
          { className: "evidence", "aria-label": "Shared proof evidence" },
          React.createElement(
            "header",
            null,
            React.createElement("span", null, "Shared proof"),
            React.createElement("code", null, sharedProof?.proof_id ? sharedProof.proof_id.slice(0, 8) : "—"),
          ),
          sharedState === "failed"
            ? React.createElement("p", { className: "error", role: "alert" }, sharedError)
            : React.createElement(
                "div",
                { className: "verdict", "data-pass": sharedProof?.result?.pass === true || undefined },
                React.createElement("span", null, sharedState === "loading" ? "Loading" : "Result"),
                React.createElement("strong", null, sharedVerdict),
                React.createElement("p", null, sharedProof?.claim || "The original claim is unavailable."),
                sharedProof?.result?.rationale
                  ? React.createElement("small", null, sharedProof.result.rationale)
                  : null,
                sharedProof?.expires_at
                  ? React.createElement("code", null, `Available until ${new Date(sharedProof.expires_at).toLocaleString()}`)
                  : null,
                sharedError ? React.createElement("p", { className: "error", role: "alert" }, sharedError) : null,
              ),
        ),
      );
    }

    const activePhase = state === "idle" ? 0 : state === "starting" ? 1 : state === "running" ? 2 : 3;
    const verdict =
      terminal && result?.result?.pass === true
        ? "Verified"
        : terminal && result?.result?.pass === false
          ? "Not verified"
          : "Incomplete";

    return React.createElement(
      "section",
      { className: "instrument", id: "instant-proof", "data-state": state, "aria-labelledby": "instant-proof-title" },
      React.createElement(
        "div",
        { className: "instrument-head" },
        React.createElement("div", null, "Instant proof · ", React.createElement("b", null, state === "idle" ? "Ready" : state)),
        React.createElement("code", null, "PUBLIC PAGES · UP TO 2 MIN"),
      ),
      React.createElement(
        "form",
        { className: "panel", action: "/verify", method: "post", onSubmit: start },
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
        React.createElement("p", { className: "policy" }, "Checks public pages without signing in or changing data. Save a result to keep it after this link expires."),
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
        state === "completed" || (state === "failed" && terminal)
          ? React.createElement(
              "div",
              { className: "verdict", "data-pass": result?.result?.pass === true || undefined },
              React.createElement("span", null, "Result"),
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
                { "data-active": (state !== "idle" && proof) || undefined },
                React.createElement("span", null, "01"),
                React.createElement(
                  "div",
                  null,
                  React.createElement("b", null, "Public URL"),
                  React.createElement("small", null, proof ? "Public origin accepted" : "Not started"),
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
                  React.createElement("b", null, "Result"),
                  React.createElement("small", null, "Awaiting evidence"),
                ),
              ),
            ),
        React.createElement(
          "footer",
          null,
          React.createElement("span", null, "Link expires"),
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
    const [shared, setShared] = useState(() => window.location.hash.startsWith("#molar_share_"));
    return React.createElement(
      "div",
      { className: "verify-shell" },
      React.createElement(
        "main",
        { id: "main", className: "verify-main" },
        React.createElement(
          "div",
          { className: "verify-hero" },
          React.createElement("h1", null, shared ? "A browser check, shared with you." : "Verify any public URL before you sign up."),
          React.createElement(
            "p",
            null,
            shared
              ? "See the captured page and result from one browser run. This is a read-only view of the original check."
              : "Molar launches a real browser, checks one observable claim, and returns replayable evidence. No account required to start.",
          ),
        ),
        React.createElement(InstantProofInstrument, { onSharedChange: setShared }),
      ),
    );
  }

  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(React.createElement(App));
})();
