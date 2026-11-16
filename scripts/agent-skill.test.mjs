import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { strict as assert } from 'node:assert';

test('public agent setup is included in the deployment allowlist', () => {
  const skill = readFileSync(new URL('../SKILL.md', import.meta.url), 'utf8');
  const headers = readFileSync(new URL('../_headers', import.meta.url), 'utf8');
  const build = readFileSync(new URL('./build-site.mjs', import.meta.url), 'utf8');
  assert.match(skill, /^---\nname: molar\n/);
  assert.match(skill, /https:\/\/github\.com\/pratikranaa\/molar-cli/);
  assert.match(skill, /publicly reachable/);
  assert.match(build, /['"]SKILL\.md['"]/);
  assert.match(headers, /\/SKILL\.md\n\s+Content-Type: text\/markdown/);
});
