import {esc,icon,faq,cta} from './components.mjs';
import {clonesStory} from './product-clones.mjs';
import {cartographerStory} from './product-cartographer.mjs';
import {guardStory} from './product-guard.mjs';
import {traceStory} from './product-trace.mjs';

const stories={clones:clonesStory,cartographer:cartographerStory,guard:guardStory,trace:traceStory};
const openings={
 clones:{title:'Test the services behind your app.',intro:'Give your tests payment records, messages, accounts, and files they can change and inspect. Control supported failures and timing, then restore the starting state for the next run.',action:'Set up Clones',href:'/docs/clones',demo:'Explore the service inspector',note:'Start with the documented API coverage for the services your app calls.'},
 cartographer:{title:'Map your app. Test the paths that matter.',intro:'Give Cartographer a task and an authorized app. Follow the routes it explores, inspect the browser actions, and see which checks passed, failed, or could not run.',action:'Discuss your app setup',href:'/contact',demo:'Explore the route map',note:'Browser exploration is available in beta. Generated tests and clean replay need separate validation.'},
 guard:{title:'Know which check failed before you ship.',intro:'Run configured signup, checkout, and account-access scenarios against a preview, a release, or a scheduled environment. Give reviewers the failed assertion and the captured steps behind it.',action:'Plan your release checks',href:'/contact',demo:'Explore a release check',note:'Beta setup connects your scenarios, test environment, and repository policy.'},
 trace:{title:'Find the step where your app stopped working.',intro:'Inspect browser actions, requests, console messages, and captured service state in one run. Follow a failed assertion back to the details an engineer or coding agent needs to investigate.',action:'Discuss Trace setup',href:'/contact',demo:'Explore the debugger',note:'Explore a sample failure below, then watch an actual recorded run.'},
};
export function productPage(page){
 const id=page.path.split('/').pop(),story=stories[id];
 if(!story)return null;
 const content=story(),opening=openings[id],name=id[0].toUpperCase()+id.slice(1);
 return {
  body:`<main id="main" class="product-story product-story-${id}"><section class="product-story-hero"><div class="wrap"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/">Molar</a>${icon('chevron')}<span>${name}</span></nav><div class="product-story-head"><h1>${esc(opening.title)}</h1><div><p>${esc(opening.intro)}</p><div class="actions"><a class="button button-primary" href="${opening.href}">${opening.action} ${icon('arrow')}</a><a class="text-link" href="#product-demo">${opening.demo} ${icon('arrow')}</a></div><p class="product-setup-note">${opening.note}</p></div></div></div></section><nav class="product-section-nav" aria-label="On this product page"><div class="wrap"><strong>Molar ${name}</strong><a href="#product-demo">Interactive example</a>${id==='cartographer'?'<a href="#cartographer-run">Run inspection</a>':''}${id==='clones'?'<a href="#clone-controls">Failure controls</a>':''}${id==='trace'?'<a href="#trace-agent-tools">Agent tools</a>':''}<a href="#product-setup">Setup</a>${id==='clones'?'<a href="#clone-snapshots">Snapshots</a>':''}<a href="${id==='clones'?'#clone-catalog':'#product-capabilities'}">${id==='clones'?'Service catalog':id==='cartographer'?'Test export':'Capabilities'}</a><a href="#product-questions">Questions</a></div></nav>${content.body}<div id="product-questions">${faq(content.faqs)}</div>${cta(id==='clones'?'Give your next test the right services.':id==='trace'?'Bring a failure you want to understand.':id==='guard'?'Choose the check your next release needs.':'Start with one task in your app.',id==='clones'?'Check the supported API paths, connect a test endpoint, and run the flow from known state.':'Tell us about your app, test accounts, and the task you want to verify. We’ll confirm the beta setup.',{href:opening.href,label:opening.action})}</main>`,
  faqs:content.faqs,
  description:opening.intro,
  styles:['product-pages.css',`product-${id}.css`,...(id==='clones'?['conversion.css']:[])],
  scripts:[`product-${id}.js`,...(id==='clones'?['conversion.js']:[])],
 };
}
