import test from 'node:test';
import assert from 'node:assert/strict';
import {onRequest} from '../functions/api/ask.js';
const request=(body,origin='https://molar.it')=>new Request('https://molar.it/api/ask',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(body)});
const db={prepare:()=>({bind:()=>({first:async()=>({count:1}),run:async()=>({success:true})})})};
test('cross-origin and oversized input never invoke inference',async()=>{
 let calls=0;const env={AI:{run:async()=>calls++}};
 assert.equal((await onRequest({request:request({question:'test payment'},'https://elsewhere.test'),env})).status,403);
 assert.equal((await onRequest({request:request({question:'x'.repeat(3000)}),env})).status,400);
 assert.equal(calls,0);
});
test('unrelated questions get no invented answer or model request',async()=>{
 const r=await onRequest({request:request({question:'What is the capital of France?'}),env:{}});
 assert.equal((await r.json()).mode,'no-match');assert.equal(r.headers.get('X-Robots-Tag'),'noindex');
});
test('answers contain only validated source references',async()=>{
 const env={WEBSITE_DB:db,WEBSITE_REQUEST_SECRET:'fixture-secret',AI:{run:async()=>({response:{answer:'Check payment state and customer access separately.',sourceIds:['checkout']}})}};
 const r=await onRequest({request:request({question:'How do I test delayed payment webhooks?'}),env});const d=await r.json();
 assert.equal(d.mode,'generated');assert.equal(d.sources[0].url,'/solutions/checkout-testing');assert.equal(r.headers.get('Cache-Control'),'no-store');
});
test('invalid model citations and unavailable infrastructure return labeled source guidance',async()=>{
 const env={WEBSITE_DB:db,WEBSITE_REQUEST_SECRET:'fixture-secret',AI:{run:async()=>({response:{answer:'Invented external result.',sourceIds:['fake']}})}};
 assert.equal((await(await onRequest({request:request({question:'payment webhooks testing'}),env})).json()).mode,'sources');
 assert.equal((await(await onRequest({request:request({question:'payment webhooks testing'}),env:{}})).json()).mode,'sources');
});
test('exhausted quota stops inference',async()=>{
 let calls=0;const env={WEBSITE_REQUEST_SECRET:'fixture',WEBSITE_DB:{prepare:()=>({bind:()=>({first:async()=>null})})},AI:{run:async()=>calls++}};
 assert.equal((await onRequest({request:request({question:'payment webhooks testing'}),env})).status,429);assert.equal(calls,0);
});
