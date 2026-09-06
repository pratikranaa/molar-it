import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { document, revision } from '../marketing/document.mjs';
import { waitlistBody, waitlistScript, waitlistStyles } from '../marketing/waitlist.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
function save(path, html) {
  const target = resolve(root, path.replace(/^\//, ''));
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, html);
}

const verifyBody = `<div id="root"></div><script crossorigin src="https://unpkg.com/react@18.3.1/umd/react.production.min.js"></script><script crossorigin src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.production.min.js"></script><script src="/verify.js?v=${revision('../verify.js')}"></script>`;
const verifyDocument = document({ title: 'Try a Public Browser Check | Molar', description: 'Give Molar a public URL and describe what should appear. See the check result and captured screenshot without an account.', path: '/verify', body: verifyBody });
save('/verify.html', verifyDocument.replace(/<link rel="stylesheet" href="\/marketing\/site\.css[^"]*">/, match => `<link rel="stylesheet" href="/verify.css?v=${revision('../verify.css')}">${match}`).replace('</head>', `<link rel="stylesheet" href="/marketing/verify-theme.css?v=${revision('./verify-theme.css')}"></head>`));
save('/waitlist.html', document({ title: 'Join the waitlist · Molar', description: 'Join the Molar early access waitlist for autonomous browser QA, stateful clones, and production guard.', path: '/waitlist', body: `${waitlistStyles()}${waitlistBody}<script>${waitlistScript}</script>` }));
console.log('Built /verify and /waitlist with the shared marketing document.');
