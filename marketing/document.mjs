import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {header,footer,esc} from './components.mjs';
import {absoluteUrl,metaTags,structuredData} from './seo.mjs';
export const revision = file => createHash('sha256').update(readFileSync(new URL(file,import.meta.url))).digest('hex').slice(0,10);
const cssVersion=revision('./site.css');
const jsVersion=revision('./site.js');
const extraStyles=['illustrations.css','application-scene.css','service-lab.css','identity.css','entry-experience.css','company.css','scenario-detail.css','analytics.css','motion.css','motion-feedback.css','product-graphics.css','refinement.css'].map(file=>`<link rel="stylesheet" href="/marketing/${file}?v=${revision('./'+file)}">`).join('');
const sceneVersion=revision('./application-scene.js');
export function document({title,description,path='/',body,faqs=[],type='WebPage',noindex=false,image,date,datePublished,dateModified,author,breadcrumbs,section,keywords,styles=[],scripts=[]}={}){
 // Legacy links in existing articles resolve directly to the canonical documentation.
 body=body.replace(/href="(?:https:\/\/molar\.it)?\/docs\/clones?(?:\/([a-z0-9-]+))?\/?"/g,(_,vendor)=>`href="https://docs.molar.it/docs/clones${vendor?'/vendors/'+vendor:''}"`);
 const url=absoluteUrl(path);
 const schema=structuredData({title,description,path,type,image,date,datePublished,dateModified,author,breadcrumbs,section,keywords});
 if(faqs.length)schema['@graph'].push({'@type':'FAQPage',mainEntity:faqs.map(({q,a})=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))});
 const tags=metaTags({title,description,path,type,image,noindex}).replaceAll('__TITLE__',esc(title)).replaceAll('__DESCRIPTION__',esc(description));
 const productAssets=styles.map(file=>`<link rel="stylesheet" href="/marketing/${file}?v=${revision('./'+file)}">`).join('')+scripts.map(file=>`<script type="module" src="/marketing/${file}?v=${revision('./'+file)}"></script>`).join('');
 return `<!DOCTYPE html>\n<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#f7f8f2"><title>${esc(title)}</title><meta name="description" content="${esc(description)}">${tags}<link rel="alternate" type="text/plain" href="/llms.txt"><link rel="alternate" type="application/rss+xml" title="Molar guides" href="/feed.xml"><link rel="icon" href="/assets/molar-mark-favicon.png" type="image/png"><link rel="apple-touch-icon" href="/assets/molar-mark-apple.png"><link rel="preload" href="/fonts/hanken-grotesk-latin.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/marketing/site.css?v=${cssVersion}"><script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script>${extraStyles}${productAssets}<script type="module" src="/marketing/application-scene.js?v=${sceneVersion}"></script><script type="module" src="/marketing/service-lab.js?v=${revision('./service-lab.js')}"></script><script type="module" src="/marketing/site.js?v=${jsVersion}"></script><script type="module" src="/marketing/motion.js?v=${revision('./motion.js')}"></script><script type="module" src="/marketing/analytics.js?v=${revision('./analytics.js')}"></script></head><body>${header(path)}${body}${footer()}</body></html>\n`.replace(/[ \t]+$/gm,'');
}
