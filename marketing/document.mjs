import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {header,footer,esc} from './components.mjs';
export const revision = file => createHash('sha256').update(readFileSync(new URL(file,import.meta.url))).digest('hex').slice(0,10);
const cssVersion=revision('./site.css');
const jsVersion=revision('./site.js');
export function document({title,description,path='/',body,faqs=[],type='WebPage',noindex=false}){
 const url='https://molar.it'+path.replace(/\.html$/,'');
 const schema={'@context':'https://schema.org','@graph':[{'@type':'Organization','@id':'https://molar.it/#org',name:'Molar',url:'https://molar.it/',logo:'https://molar.it/assets/molar-mark-apple.png'},{'@type':type,name:title,description,url,publisher:{'@id':'https://molar.it/#org'}}]};
 if(faqs.length)schema['@graph'].push({'@type':'FAQPage',mainEntity:faqs.map(({q,a})=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))});
 return `<!DOCTYPE html>\n<html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#171717"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="${noindex?'noindex, follow':'index, follow, max-image-preview:large'}"><link rel="canonical" href="${url}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:type" content="${type==='Article'?'article':'website'}"><meta property="og:url" content="${url}"><meta property="og:site_name" content="Molar"><meta property="og:image" content="https://molar.it/og.png"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/assets/molar-mark-favicon.png" type="image/png"><link rel="apple-touch-icon" href="/assets/molar-mark-apple.png"><link rel="preload" href="/fonts/hanken-grotesk-latin.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/marketing/site.css?v=${cssVersion}"><script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script><script defer src="/marketing/site.js?v=${jsVersion}"></script></head><body>${header(path)}${body}${footer()}</body></html>\n`.replace(/[ \t]+$/gm,'');
}
