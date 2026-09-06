import test from 'node:test';
import assert from 'node:assert/strict';
import {traceFrame,tracePanel} from '../marketing/product-trace.js';

test('Trace distinguishes a successful payment and HTTP lookup from failed account access',()=>{
 assert.equal(traceFrame(1).body.status,'succeeded');
 assert.equal(traceFrame(1).plan,'Free');
 assert.equal(traceFrame(2).status,500);
 assert.equal(traceFrame(3).status,200);
 assert.equal(traceFrame(3).body.access,false);
 assert.equal(traceFrame(3).verdict,'Failed');
});
test('Trace comparison changes the account only after the callback',()=>{
 assert.deepEqual(traceFrame(1,true),traceFrame(1));
 assert.equal(traceFrame(2,true).plan,'Pro');
 assert.equal(traceFrame(2,true).status,200);
 assert.equal(traceFrame(3,true).body.access,true);
 assert.equal(traceFrame(3,true).verdict,'Passed');
 assert.match(tracePanel(2,'console'),/Account update failed/);
 assert.match(tracePanel(2,'state',true),/Delivered/);
 assert.doesNotMatch(tracePanel(2,'network',true),/account_update_failed/);
});

import {initialClonesState,reduceClonesState,clonesRecordFrame} from '../marketing/product-clones.js';
import {CARTOGRAPHER_ROUTES,CARTOGRAPHER_SCENARIOS} from '../marketing/product-cartographer.js';
import {guardFrame} from '../marketing/product-guard.js';

test('Declined payment never creates an order or grants access, including after a clock advance',()=>{
 let state=reduceClonesState(initialClonesState,'decline');
 state=reduceClonesState(state,'callback');
 state=reduceClonesState(state,'advance');
 assert.equal(state.callback,'blocked');assert.equal(state.attempts,0);
 assert.equal(state.order,'not_created');assert.equal(state.access,'held');
 const frame=clonesRecordFrame({...state,selected:'webhook'});
 assert.equal(frame.title,'Blocked');assert.match(frame.subtitle,/No attempt/);
 assert.equal(clonesRecordFrame({...state,selected:'order'}).title,'Not created');
});
test('A queued callback changes account access only when delivered; snapshots restore clock and all related records',()=>{
 let state=reduceClonesState(initialClonesState,'callback');
 assert.equal(state.payment,'succeeded');assert.equal(state.access,'held');
 state=reduceClonesState(state,'save');
 const saved={...state};
 state=reduceClonesState(state,'advance');
 assert.equal(state.day,1);assert.equal(state.callback,'delivered');assert.equal(state.attempts,3);
 assert.equal(state.order,'confirmed');assert.equal(state.access,'granted');
 assert.match(clonesRecordFrame({...state,selected:'webhook'}).subtitle,/attempt 3/);
 state=reduceClonesState(state,'restore');
 for(const key of ['day','payment','callback','attempts','order','access'])assert.equal(state[key],saved[key]);
 state=reduceClonesState(state,'reset');assert.equal(state.snapshot,null);assert.equal(state.day,0);
});
test('An inaccessible admin branch has no fabricated assertion or export',()=>{
 const blocked=CARTOGRAPHER_ROUTES.find(route=>route.id==='blocked');
 assert.equal(blocked.noExport,true);assert.equal(blocked.code,'');assert.match(blocked.setupNotice,/admin profile/);
 assert.notEqual(CARTOGRAPHER_SCENARIOS[0].startRoute,CARTOGRAPHER_SCENARIOS[1].startRoute);
 assert.match(CARTOGRAPHER_ROUTES.find(route=>route.id==='login').code,/process.env.TEST_PASSWORD/);
});
test('Inspecting another Guard scenario does not turn the failing checkout green',()=>{
 const frame=guardFrame('before','signin');
 assert.equal(frame.failed,false);assert.equal(frame.tests.checkout.state,'fail');
 assert.equal(frame.tests.signin.state,'pass');
 assert.ok(frame.evidence.every(item=>!item.label.includes('payment')));
 assert.match(frame.runId,/3 assertions/);
});
test('Guard release modes and fixed comparison keep verdict, evidence, and note consistent',()=>{
 const failed=guardFrame('before','checkout');assert.equal(failed.status,'FAILED');
 assert.equal(failed.evidence.at(-1).state,'fail');
 for(const frame of [guardFrame('before','checkout',true),guardFrame('after','checkout'),guardFrame('scheduled','checkout')]){
  assert.equal(frame.failed,false);assert.ok(frame.evidence.every(item=>item.state==='pass'));
  assert.doesNotMatch(frame.note,/absent/);assert.equal(frame.tests.checkout.state,'pass');
 }
 assert.equal(guardFrame('after').tabId,'pgd-tab-after');
});
