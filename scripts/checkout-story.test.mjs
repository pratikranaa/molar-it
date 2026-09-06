import test from 'node:test';
import assert from 'node:assert/strict';
import {checkoutFrame} from '../marketing/checkout-story.js';

test('a successful payment with a failed callback never grants paid access',()=>{
 const payment=checkoutFrame(2,'callback'),callback=checkoutFrame(3,'callback'),result=checkoutFrame(5,'callback');
 assert.equal(payment.paid,true);assert.equal(payment.access,false);
 assert.equal(callback.status,'500');assert.equal(callback.payload.error,'account_update_failed');
 assert.equal(result.access,false);assert.equal(result.result,'failed');
 assert.equal(result.request,'POST /api/webhooks/payment');
 assert.equal(result.services[4].value,'Still on Free');
});
test('a declined card has no charge or success callback and passes the negative test',()=>{
 const payment=checkoutFrame(2,'decline'),callback=checkoutFrame(3,'decline'),result=checkoutFrame(5,'decline');
 assert.equal(payment.status,'402');assert.equal(payment.payload.charged,false);
 assert.equal(callback.status,'Not sent');assert.equal(callback.delivered,false);
 assert.equal(result.paid,false);assert.equal(result.access,false);assert.equal(result.result,'passed');
 assert.deepEqual(result.payload,{plan:'free',access:'basic'});
});
test('a working checkout verifies access after the app receives its update',()=>{
 assert.equal(checkoutFrame(2,'working').delivered,false);
 assert.equal(checkoutFrame(3,'working').delivered,true);
 assert.equal(checkoutFrame(3,'working').access,false);
 assert.equal(checkoutFrame(4,'working').access,true);
 assert.equal(checkoutFrame(4,'working').result,'in-progress');
 const result=checkoutFrame(5,'working');
 assert.equal(result.result,'passed');assert.deepEqual(result.payload,{plan:'pro',access:'team_features'});
});
test('email verification and payment are distinct observed states',()=>{
 const signup=checkoutFrame(0),verified=checkoutFrame(1);
 assert.equal(signup.payload.verified,false);assert.equal(verified.payload.verified,true);
 assert.equal(verified.paid,false);assert.equal(verified.services[2].value,'Not started');
});
