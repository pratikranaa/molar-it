import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {cloneCatalog} from '../marketing/clone-catalog.mjs';
import {document} from '../marketing/document.mjs';

const redirects=readFileSync(new URL('../_redirects',import.meta.url),'utf8')
  .split('\n').filter(line=>line.trim()&&!line.startsWith('#')).map(line=>line.trim().split(/\s+/));

test('every old clone guide has a permanent redirect to its canonical vendor guide',()=>{
  for(const {id} of cloneCatalog){
    for(const suffix of ['', '/', '.html']){
      const matches=redirects.filter(([source])=>source===`/docs/clones/${id}${suffix}`);
      assert.deepEqual(matches,[[`/docs/clones/${id}${suffix}`,`https://docs.molar.it/docs/clones/vendors/${id}`,'301']]);
    }
    assert.equal(existsSync(new URL(`../docs/clones/${id}.html`,import.meta.url)),false,'No competing generated reference');
  }
});

test('existing article links go directly to canonical docs while product links stay local',()=>{
  const html=document({title:'Guide',description:'A guide',body:'<main><h1>Guide</h1><a href="/docs/clones/stripe">Stripe</a><a href="https://molar.it/docs/clones/twilio">Twilio</a><a href="/docs/clones">Clones docs</a><a href="/products/clones">Product</a></main>'});
  assert.ok(html.includes('href="https://docs.molar.it/docs/clones/vendors/stripe"'));
  assert.ok(html.includes('href="https://docs.molar.it/docs/clones/vendors/twilio"'));
  assert.ok(html.includes('href="https://docs.molar.it/docs/clones"'));
  assert.ok(html.includes('href="/products/clones"'));
  assert.equal(html.includes('href="/docs/clones'),false);
});
