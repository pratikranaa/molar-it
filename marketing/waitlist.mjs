import { icon } from './components.mjs';

export const waitlistBody = `<main id="main"><section class="section waitlist-section"><div class="wrap contact-layout waitlist-layout"><div><h1>Join the <span>waitlist.</span></h1><p class="waitlist-lede" id="wl-lede">Molar is in beta. Bring one important browser journey and we’ll help you make its outcome repeatable.</p><div class="waitlist-aside"><span>${icon('trace')}</span><p>Start with the journey your team most needs to understand.</p></div></div><div class="contact-form-wrap waitlist-card"><h2 id="wl-headline">Get early access</h2><p>Tell us where you want to start. We’ll reach out when your workspace is ready.</p><form class="waitlist-form" id="waitlist-form" action="/waitlist" method="post" novalidate><label for="wl-email">Work email</label><input type="email" name="email" id="wl-email" autocomplete="email" placeholder="you@company.com" required maxlength="160"><label for="wl-company">Company <span>(optional)</span></label><input type="text" name="company" id="wl-company" autocomplete="organization" placeholder="Acme Inc." maxlength="120"><label for="wl-role">Role <span>(optional)</span></label><select name="role" id="wl-role"><option value="">Select…</option><option value="engineer">Engineering</option><option value="founder">Founder / CTO</option><option value="qa">QA / Test</option><option value="product">Product</option><option value="other">Other</option></select><label class="waitlist-hp" aria-hidden="true">Website<input type="text" name="website" tabindex="-1" autocomplete="off"></label><input type="hidden" name="source" id="wl-source" value="waitlist"><button type="submit" class="button button-primary waitlist-submit" id="wl-submit">Join waitlist ${icon('arrow')}</button></form><p class="waitlist-status" id="wl-status" role="status" aria-live="polite"></p><p class="waitlist-note">No spam. We only email about Molar access and product updates. <a href="/privacy">Privacy policy</a>.</p></div></div></section></main>`;

export const waitlistScript = `(function () {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get('ref') || 'waitlist';
  const source = document.getElementById('wl-source');
  const headline = document.getElementById('wl-headline');
  const lede = document.getElementById('wl-lede');
  const copy = {
    clones: ['Clones early access', 'Stateful service clones are in beta. Tell us which payment, email, SMS, identity, or storage path you want to test.'],
    cartographer: ['Cartographer early access', 'Browser journey mapping is in beta. Tell us which part of your application you want to explore first.'],
    guard: ['Guard early access', 'Release and production checks are in beta. Tell us which journey your team wants to keep working.'],
    trace: ['Trace early access', 'Trace dashboards and MCP are in beta. Tell us which run evidence your team needs to inspect.']
  }[ref.split(':')[0]];
  source.value = ref;
  if (copy) { headline.textContent = copy[0]; lede.textContent = copy[1]; }
  const form = document.getElementById('waitlist-form');
  const status = document.getElementById('wl-status');
  const submit = document.getElementById('wl-submit');
  form.addEventListener('submit', async function (event) {
    event.preventDefault(); status.className = 'waitlist-status'; status.textContent = '';
    const email = document.getElementById('wl-email').value.trim();
    if (!email || !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) { status.className = 'waitlist-status is-err'; status.textContent = 'Enter a valid work email.'; return; }
    submit.disabled = true; submit.textContent = 'Saving…';
    try {
      const response = await fetch('/api/waitlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, company: document.getElementById('wl-company').value.trim(), role: document.getElementById('wl-role').value, source: source.value, website: form.website ? form.website.value : '' }) });
      const data = await response.json().catch(function () { return {}; });
      if (!response.ok) throw new Error(data.error || 'Could not save signup.');
      status.className = 'waitlist-status is-ok'; status.textContent = "You're on the list — we'll reach out when your spot opens."; form.reset(); source.value = ref;
    } catch (error) { status.className = 'waitlist-status is-err'; status.textContent = error.message || 'Could not save. Email pratik@molar.it instead.'; }
    finally { submit.disabled = false; submit.textContent = 'Join waitlist'; }
  });
})();`;

export function waitlistStyles() { return `<style>.waitlist-section{padding:95px 0 125px}.waitlist-layout{align-items:start}.waitlist-layout h1{font-size:clamp(50px,6vw,78px);line-height:.98;letter-spacing:-.035em}.waitlist-layout h1 span{color:#c85a3d}.waitlist-lede{font-size:18px;line-height:1.6;max-width:480px;margin-top:25px}.waitlist-aside{display:flex;gap:14px;align-items:start;border-top:1px solid var(--line);max-width:430px;margin-top:48px;padding-top:20px;color:#615f5c}.waitlist-aside svg{width:20px}.waitlist-aside p{margin:0;font-size:14px;line-height:1.5}.waitlist-card{padding:32px 36px;background:#ececec}.waitlist-card h2{font-size:29px}.waitlist-card>p:first-of-type{font-size:14px;color:#676562}.waitlist-form{display:flex;flex-direction:column;align-items:stretch;margin-top:26px}.waitlist-form label{font-size:13px;font-weight:500;margin-top:18px;margin-bottom:7px}.waitlist-form label:first-child{margin-top:0}.waitlist-form label span{font-weight:400;color:#716f6b}.waitlist-form input,.waitlist-form select{border:1px solid #bcbbb9;background:#fbfbfb;border-radius:3px;padding:12px;font-size:16px;color:#383736;width:100%;min-height:46px}.waitlist-form input:focus,.waitlist-form select:focus{outline:2px solid #c85a3d;outline-offset:2px}.waitlist-submit{margin-top:25px;justify-content:center;width:100%}.waitlist-hp{position:absolute!important;left:-9999px!important;width:1px!important;height:1px!important;overflow:hidden}.waitlist-status{font-size:13px;line-height:1.5;margin-top:13px}.waitlist-status.is-ok{color:#464543}.waitlist-status.is-err{color:#a43d2c}.waitlist-note{font-size:12px!important;line-height:1.5;margin-top:16px!important}.waitlist-note a{color:#a54d30}@media(max-width:900px){.waitlist-section{padding:65px 0 85px}.waitlist-layout{gap:45px}}@media(max-width:640px){.waitlist-section{padding:50px 0 70px}.waitlist-layout h1{font-size:52px}.waitlist-lede{font-size:16px}.waitlist-aside{margin-top:32px}.waitlist-card{padding:25px}.waitlist-form input,.waitlist-form select{font-size:16px}}</style>`; }
