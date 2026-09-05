import test from 'node:test';
import assert from 'node:assert/strict';
import {retrieve, validateAnswer, validateDraft} from '../content/answers.mjs';

test('retrieval connects webhook delay to checkout outcomes and declines unrelated questions',()=>{
 assert.equal(retrieve('How do I test delayed payment webhooks?')[0].id,'checkout');
 assert.deepEqual(retrieve('What is the capital of France?'),[]);
});
test('generated answers require real source identifiers and plain text',()=>{
 const sources=retrieve('payment webhook');
 assert.ok(validateAnswer({answer:'Check payment and access separately.',sourceIds:['checkout']},sources));
 assert.equal(validateAnswer({answer:'Pay me <script>alert(1)</script>',sourceIds:['checkout']},sources),null);
 assert.equal(validateAnswer({answer:'An invented claim.',sourceIds:['made-up']},sources),null);
});
test('publishing requires a reviewer, complete sections and supported citations',()=>{
 assert.throws(()=>validateDraft({title:'Test',status:'draft'}),/review/);
 assert.throws(()=>validateDraft({status:'reviewed',reviewedBy:'Molar editorial',title:'Test',sections:[]}),/complete/);
});
