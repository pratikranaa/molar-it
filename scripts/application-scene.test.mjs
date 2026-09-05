import test from 'node:test';
import assert from 'node:assert/strict';
import {sceneFrame} from '../marketing/application-scene.js';

test('a successful charge does not prematurely grant access',()=>{
 const charged=sceneFrame('qa',1,false);
 assert.equal(charged.first,'Payment succeeded');
 assert.equal(charged.plan,'Free');
 assert.equal(charged.outcome,'working');
});
test('a delayed callback leaves access unchanged and exposes the mismatch',()=>{
 const failed=sceneFrame('qa',3,true);
 assert.equal(failed.outcome,'failed');
 assert.equal(failed.plan,'Free');
 assert.match(failed.evidence[1],/Delayed/);
 assert.match(failed.evidence[2],/Still on Free/);
 const delivered=sceneFrame('qa',3,false);
 assert.equal(delivered.outcome,'passed');
 assert.equal(delivered.plan,'Pro');
});
test('restarting clears the result even when the fault remains selected',()=>{
 const reset=sceneFrame('qa',0,true);
 assert.equal(reset.outcome,'working');
 assert.deepEqual(reset.evidence,['Not checked yet','Not checked yet','Not checked yet']);
});
test('invoice completion requires a file result',()=>{
 assert.equal(sceneFrame('platform',1).outcome,'working');
 const completed=sceneFrame('platform',3);
 assert.equal(completed.outcome,'passed');
 assert.equal(completed.evidence[2],'File verified');
});
