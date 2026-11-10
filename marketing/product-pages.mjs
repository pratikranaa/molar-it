import {APP,esc,icon,faq,cta} from './components.mjs';
import {clonesStory} from './product-clones.mjs';
import {cartographerStory} from './product-cartographer.mjs';
import {guardStory} from './product-guard.mjs';
import {traceStory} from './product-trace.mjs';

const stories={clones:clonesStory,cartographer:cartographerStory,guard:guardStory,trace:traceStory};
const openings={
 clones:{title:'Test the services behind your app.',intro:'Point your test environment at a documented clone, run the payment, message, sign-in, or upload task, and inspect the record your app creates. Control supported failures and timing, then restore the starting state for the next run.',demo:'See the Stripe clone example',note:'Start with the <a href="https://docs.molar.it/docs/clones">documented API coverage</a> for the services your app calls.'},
 cartographer:{title:'Map your app. Test the paths that matter.',intro:'Give Cartographer an authorized app and a goal such as “sign up, enter the email code, and open the workspace.” It follows the route, returns the pages and browser actions it reached, and gives you a check to review or rerun.',demo:'Explore the route map',note:'Exploration and test export are in beta. Exported tests are plain Playwright that run without Molar.'},
 guard:{title:'Know which check failed before you ship.',intro:'Guard runs your sign-up, checkout and account checks on every pull request and on a schedule, and shows the step that failed. Each check is a Playwright test, so no AI agent decides pass or fail.',demo:'See an example check',note:'Guard is in beta. Install the GitHub App or add the GitHub Action to start.'},
 trace:{title:'Find the step where your app stopped working.',intro:'Open one run and follow its browser action, page, request, console message, and available service detail in sequence. See the failed request beside the browser step that triggered it, then share the run with the engineer fixing it.',demo:'Explore the debugger',note:'Explore a sample failure below, then watch an actual recorded run.'},
};
export function productPage(page){
 const id=page.path.split('/').pop(),story=stories[id];
 if(!story)return null;
 const content=story(),opening=openings[id],name=id[0].toUpperCase()+id.slice(1);
 const heroIdentity=`<h1>${esc(opening.title)}</h1>`;
 return {
  body:`<main id="main" class="product-story product-story-${id}"><section class="product-story-hero"><div class="wrap"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Molar</a>${icon('chevron')}<span>${name}</span></nav><div class="product-story-head">${heroIdentity}<div><p>${esc(opening.intro)}</p><div class="actions"><a class="button button-primary" href="${APP}" data-track="signup-hero">Get started free ${icon('arrow')}</a><a class="text-link" href="#product-demo">${opening.demo} ${icon('arrow')}</a></div><p class="product-setup-note">${opening.note}</p></div></div></div></section><nav class="product-section-nav" aria-label="On this product page"><div class="wrap"><strong>Molar ${name}</strong><a href="#product-demo">Interactive example</a>${id==='cartographer'?'<a href="#cartographer-run">Run inspection</a>':''}${id==='clones'?'<a href="#clone-controls">Failure controls</a>':''}${id==='trace'?'<a href="#trace-agent-tools">Agent tools</a>':''}${id==='guard'?'<a href="#guard-selection">Test selection</a>':''}<a href="#product-setup">Setup</a>${id==='clones'?'<a href="#clone-snapshots">Snapshots</a>':''}<a href="${id==='clones'?'#clone-catalog':'#product-capabilities'}">${id==='clones'?'Service catalog':id==='cartographer'?'Test export':id==='guard'?'Monitoring':'Capabilities'}</a>${id==='guard'?'<a href="#guard-repair">Mender</a>':''}<a href="#product-questions">Questions</a></div></nav>${content.body}<div id="product-questions">${faq(content.faqs)}</div>${cta(id==='clones'?'Give your next test the right services.':id==='trace'?'Bring a failure you want to understand.':id==='guard'?'Choose the check your next release needs.':'Start with one task in your app.',id==='clones'?'Check the supported API paths, connect a test endpoint, and run the flow from known state.':'Create a free workspace, add your app’s URL and a test account, and describe the first task to check.')}</main>`,
  faqs:content.faqs,
  description:opening.intro,
  styles:['product-pages.css',`product-${id}.css`,...(id==='clones'?['conversion.css']:[])],
  scripts:[`product-${id}.js`,...(id==='clones'?['conversion.js']:[])],
 };
}
