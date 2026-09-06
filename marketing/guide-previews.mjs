import {productGraphic} from './product-graphics.mjs';

export const featuredGuides = [
  {path:'/blog/test-stripe-without-real-cards',title:'Test Stripe without charging a real card.',description:'Payment state, callbacks and the customer’s access—checked together.',kind:'clones',label:'Payments'},
  {path:'/blog/required-status-checks-merge-gate',title:'Make the right checks required before merge.',description:'Connect a failed test to the release decision it should change.',kind:'guard',label:'Release checks'},
  {path:'/blog/ai-agents-future-software-testing',title:'Give coding agents a verification loop.',description:'Run the app, inspect what happened, and check the next change.',kind:'platform',label:'Coding agents'},
];

export const guidePreview = (guide,{compact=false}={}) => `<a class="guide-preview${compact?' guide-preview-compact':''}" href="${guide.path}"><div class="guide-art">${productGraphic(guide.kind,{compact:true})}</div><div class="guide-preview-copy"><strong>${guide.title}</strong>${compact?'':`<p>${guide.description}</p>`}<span>Read guide <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6"/></svg></span></div></a>`;

export function guideShelf(){return `<section class="section guide-shelf"><div class="wrap"><div class="section-heading"><h2>Put the next test<br>into practice.</h2><div><p>Setup details and testing approaches for the problems your team is working on.</p><a class="text-link" href="/blog">Browse all guides <span aria-hidden="true">→</span></a></div></div><div class="guide-shelf-grid">${featuredGuides.map(guide=>guidePreview(guide)).join('')}</div></div></section>`;}
