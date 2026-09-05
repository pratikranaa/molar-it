import {writeFileSync} from 'node:fs';
import {document,revision} from '../marketing/document.mjs';
import {askBody} from '../marketing/ask.mjs';
writeFileSync(new URL('../ask.html',import.meta.url),document({title:'Ask Molar — Practical Answers About Browser Testing',description:'Ask a question about browser QA, payments, sign-in, or Molar. Get a source-grounded answer and relevant guides.',path:'/ask',body:askBody}).replace('</head>',`<link rel="stylesheet" href="/marketing/ask.css?v=${revision('./ask.css')}"><script type="module" src="/marketing/ask.js?v=${revision('./ask.js')}"></script></head>`));
console.log('Built /ask.');
