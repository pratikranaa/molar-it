// Run the displayed SDK examples against real local clone processes, never live vendors.
// Requires a configured Clones checkout (MOLAR_CLONES_CHECKOUT) and local service binaries.
import {spawnSync} from 'node:child_process';
import {clonesExamples} from '../marketing/product-clones.mjs';

const cwd = process.env.MOLAR_CLONES_CHECKOUT;
if (!cwd) throw new Error('Set MOLAR_CLONES_CHECKOUT to the configured Clones source checkout.');
const checks = [
  ['Displayed single-service snapshot example', clonesExamples.reset],
  ['Displayed failure rule and five-minute clock advance', `
    import assert from 'node:assert/strict';
    import { stripe } from '@molar/clones';
    const clone = await stripe.start({seed: 'marketing-failure'});
    try {
      ${clonesExamples.failure}
      await clone.listCustomers();
      await clone.listCustomers();
      const failed = await clone.rawRequest('/v1/customers', {}, true);
      assert.equal(failed.status, 503);
      assert.equal((await failed.json()).error.message, 'Service unavailable');
      const before = await clone.adminGet('/_clone/clock');
      ${clonesExamples.clock}
      const after = await clone.adminGet('/_clone/clock');
      assert.equal(after.clock - before.clock, 300);
      assert.ok(new URL(clone.apiPath('/v1/customers')).pathname.startsWith('/t/' + clone.runId + '/'));
      assert.ok(clone.tlsCAPEM.includes('BEGIN CERTIFICATE'));
    } finally { await clone.stop(); }
  `],
  ['Displayed world snapshot restores both Stripe and Email records', `
    import assert from 'node:assert/strict';
    import { stripe, email } from '@molar/clones';
    import { randomUUID } from 'node:crypto';
    const runId = randomUUID();
    const payment = await stripe.start({runId, seed: 'marketing-world'});
    let inbox;
    try {
      inbox = await email.start({runId, seed: 'marketing-world'});
      const initialCustomers = await payment.listCustomers();
      const initialMail = await inbox.inbox('buyer@example.test');
      ${clonesExamples.world.replace("import { world } from '@molar/clones';", "const { world } = await import('@molar/clones');").replace('// Run your checkout test against both services here.', `
        await payment.seedData({customers: [{email: 'buyer@example.test'}]});
        await inbox.send({from: 'shop@example.test', to: ['buyer@example.test'], subject: 'Receipt', text: 'Thanks for your test order.'});
        assert.ok((await payment.listCustomers()).some(c => c.email === 'buyer@example.test'));
        assert.equal((await inbox.inbox('buyer@example.test')).length, initialMail.length + 1);
      `)}
      assert.deepEqual(await payment.listCustomers(), initialCustomers);
      assert.deepEqual(await inbox.inbox('buyer@example.test'), initialMail);
    } finally { await Promise.all([payment.stop(), inbox?.stop()]); }
  `]
];
for (const [label, code] of checks) {
  const result = spawnSync(process.execPath, ['--input-type=module', '--eval', code], {cwd, encoding: 'utf8', timeout: 60000});
  if (result.status !== 0) throw new Error(`${label}: ${result.error || result.stderr || result.stdout}`);
  console.log(`PASS ${label}`);
}
