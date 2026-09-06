import test from 'node:test';
import assert from 'node:assert/strict';
import {retrieve, validateAnswer, validateDraft, validateDraftContent} from '../content/answers.mjs';

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

test('draft previews validate the full article without pretending a review happened',async()=>{
 const {readFileSync}=await import('node:fs');
 const source=JSON.parse(readFileSync(new URL('../content/published/testing-delayed-payment-webhooks-and-account-access.json',import.meta.url)));
 const draft={...source,status:'draft',reviewedBy:null};
 assert.equal(validateDraftContent(draft).status,'draft');
 assert.throws(()=>validateDraft(draft),/review/);
 assert.throws(()=>validateDraftContent({...draft,category:'Invented'}),/category/);
 assert.throws(()=>validateDraftContent({...draft,sections:draft.sections.map(s=>({...s,sourceIds:['made-up']}))}),/citations/);
 const short={...source,sections:source.sections.map(s=>({...s,paragraphs:['An incomplete draft can be previewed.']}))};
 assert.ok(validateDraftContent(short));
 assert.throws(()=>validateDraft(short),/450 words/);
});

test('query article previews preserve code as text and remain unindexed until review',async()=>{
 const {readFileSync}=await import('node:fs');
 const {draftToArticle}=await import('../content/draft-article.mjs');
 const {articleDocument}=await import('../marketing/article-page.mjs');
 const source=JSON.parse(readFileSync(new URL('../content/published/testing-delayed-payment-webhooks-and-account-access.json',import.meta.url)));
 const draft={...source,status:'draft',reviewedBy:null,category:'Engineering',sections:source.sections.map((s,i)=>i?s:{...s,code:'const html = "<script>unsafe()</script>";\nassert(html);'})};
 const article=draftToArticle(draft,{draft:true});
 const html=articleDocument(article,[],{draft:true});
 assert.match(html,/noindex, follow/);
 assert.match(html,/Unpublished draft/);
 assert.match(html,/&lt;script&gt;unsafe\(\)&lt;\/script&gt;/);
 assert.doesNotMatch(html,/<script>unsafe\(\)<\/script>/);
 assert.equal(article.category,'Engineering');
 assert.throws(()=>validateDraft(draft),/review/);
 assert.throws(()=>validateDraftContent({...draft,sections:draft.sections.map(s=>({...s,code:{bad:'object'}}))}),/code example/);
});
