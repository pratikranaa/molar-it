import {icon} from './components.mjs';
import {SERVICE_LAB_SCENARIOS, SERVICE_LAB_TABS, scenarioState, appScreen, cloneLines, checkItems, serviceIcon} from './service-lab.js';

// Rendered with the same functions the browser uses, so the first paint is the payments example.
export function serviceLab() {
  const state = scenarioState('payments', false);
  return `<section class="service-lab section" data-service-lab data-edge="false" data-tone="fault" aria-labelledby="service-lab-title">
  <div class="wrap">
    <div class="service-lab-heading">
      <h2 id="service-lab-title">Make the hard cases easy to test.</h2>
      <p>A declined card. A wrong code. An interrupted upload. See what your app should do when a service behaves differently.</p>
    </div>
    <div class="sl-bench">
      <div class="sl-top">
        <div class="service-lab-tabs" role="tablist" aria-label="Choose a service">
          ${SERVICE_LAB_TABS.map((key, index) => `<button class="service-lab-tab" type="button" role="tab" id="service-lab-tab-${key}" aria-selected="${index === 0}" aria-controls="service-lab-surface" tabindex="${index === 0 ? 0 : -1}" data-service-tab="${key}">${serviceIcon(key)}<span>${SERVICE_LAB_SCENARIOS[key].label}</span></button>`).join('')}
        </div>
      </div>
      <div class="sl-brief">
        <p class="sl-narrative" data-service-narrative>${state.narrative}</p>
        <button class="sl-switch" type="button" aria-pressed="false" data-service-condition aria-label="Condition: ${state.options[0]}. Switch to ${state.options[1]}">
          <span class="sl-switch-thumb" aria-hidden="true"></span>
          <span class="sl-option" data-option>${state.options[0]}</span><span class="sl-option" data-option>${state.options[1]}</span>
        </button>
      </div>
      <div class="sl-flow">
        <section class="sl-clone" aria-label="What the clone did">
          <header><span class="sl-clone-icon" data-clone-icon>${serviceIcon(state.service)}</span><span><strong data-clone-name>${state.clone}</strong><small>Set by Molar</small></span></header>
          <div class="sl-clone-lines" data-clone-lines>${cloneLines(state)}</div>
        </section>
        <span class="sl-wire" aria-hidden="true"><i></i></span>
        <div class="sl-app" id="service-lab-surface" role="tabpanel" aria-labelledby="service-lab-tab-payments" data-service-surface>${appScreen(state)}</div>
        <span class="sl-wire" aria-hidden="true"><i></i></span>
        <section class="sl-verdict" aria-label="What Molar checked">
          <header>${icon('check')}<strong>Molar checks</strong></header>
          <ul class="sl-checks" data-service-checks>${checkItems(state)}</ul>
          <p class="sl-result" data-service-result-title>${state.resultTitle}</p>
        </section>
      </div>
    </div>
    <p class="service-lab-disclaimer">Illustrative examples. Explore them, then <a href="/products/clones">set up Clones for your own app</a>.</p>
    <span class="service-lab-announcement" role="status" aria-live="polite" data-service-announcement></span>
  </div>
</section>`;
}
