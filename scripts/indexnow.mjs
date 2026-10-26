// Tell IndexNow search engines (Bing, Yandex, Seznam, Naver) about changed pages. Bing's index also feeds Copilot and ChatGPT search.
// Run after a deploy: `node scripts/indexnow.mjs` submits every sitemap URL; `node scripts/indexnow.mjs URL...` submits just those.
import {readFileSync} from 'node:fs';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const key=readFileSync(join(root,'indexnow-key.txt'),'utf8').trim();
const urls=process.argv.length>2?process.argv.slice(2):[...readFileSync(join(root,'sitemap.xml'),'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
const response=await fetch('https://api.indexnow.org/indexnow',{method:'POST',headers:{'Content-Type':'application/json; charset=utf-8'},
  body:JSON.stringify({host:'molar.it',key,keyLocation:'https://molar.it/indexnow-key.txt',urlList:urls})});
console.log(`IndexNow answered ${response.status} for ${urls.length} URLs.`);
if(!response.ok){console.error((await response.text()).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').slice(-300));process.exit(1)}
