import {cpus} from 'node:os';
import {spawnSync} from 'node:child_process';
import {mkdirSync,readFileSync,writeFileSync,readdirSync,copyFileSync,rmSync} from 'node:fs';
import {dirname,join,relative,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
for(const name of ['marketing','company','resources','editorial','legacy','verify','ask']){
  const result=spawnSync(process.execPath,[join(root,`scripts/build-${name}.mjs`)],{cwd:root,stdio:'inherit'});
  if(result.status!==0) process.exit(result.status||1);
}
const discovery=spawnSync(process.execPath,[join(root,'scripts/build-discovery.mjs')],{cwd:root,stdio:'inherit'});
if(discovery.status!==0)process.exit(discovery.status||1);
const socialArgs=['python3',join(root,'scripts/build-social.py')];
if(process.platform==='darwin' && cpus()[0]?.model.includes('Apple'))socialArgs.unshift('/usr/bin/arch','-arm64');
const social=spawnSync(socialArgs[0],socialArgs.slice(1),{cwd:root,stdio:'inherit'});
if(social.status!==0)process.exit(social.status||1);
const htmlFiles=[];
for(const dir of ['','products','solutions','platform','blog','vs','integrations','docs','docs/clones','examples']){
  for(const item of readdirSync(join(root,dir),{withFileTypes:true})){
    if(item.isFile() && item.name.endsWith('.html')){
      const path=join(dir,item.name),html=readFileSync(join(root,path),'utf8');
      if(html.includes('/marketing/site.css')) htmlFiles.push(path);
    }
  }
}
const canonicals=new Set(htmlFiles.flatMap(path=>{
  const html=readFileSync(join(root,path),'utf8');
  return html.includes('noindex, follow')?[]:[...html.matchAll(/rel="canonical" href="([^"]+)"/g)].map(m=>m[1]);
}));
writeFileSync(join(root,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+[...canonicals].sort().map(url=>`  <url><loc>${url}</loc></url>`).join('\n')+'\n</urlset>\n');
// Publish only the rendered website and the runtime it uses. Source and review files stay local.
const stage=join(root,'.site-dist');
rmSync(stage,{recursive:true,force:true});mkdirSync(stage,{recursive:true});
const runtime=['marketing/checkout-story.css','marketing/checkout-story.js','marketing/product-pages.css',...['clones','cartographer','guard','trace'].flatMap(product=>['css','js'].map(extension=>`marketing/product-${product}.${extension}`)),'marketing/illustrations.css','marketing/application-scene.css','marketing/application-scene.js','marketing/service-lab.css','marketing/service-lab.js','marketing/identity.css','marketing/entry-experience.css','marketing/company.css','marketing/scenario-detail.css','marketing/site.css','marketing/site.js','marketing/verify-theme.css','verify.css','verify.js','og.png','robots.txt','sitemap.xml','llms.txt','llms-full.txt','_headers','_redirects','_routes.json','fonts/hanken-grotesk-latin.woff2','fonts/geist-mono-latin.woff2','fonts/OFL-Hanken-Grotesk.txt','assets/invitation-run.json','assets/invitation/admin-final.png','assets/invitation/member-final.png','assets/invitation/admin.webm','assets/invitation/member.webm','assets/browser-check/video.webm','assets/browser-check/final.jpg','assets/browser-check/result.json','assets/molar-mark-apple.png','assets/molar-mark-favicon.png'];
const copy=path=>{const out=join(stage,path);mkdirSync(dirname(out),{recursive:true});copyFileSync(join(root,path),out)};
[...htmlFiles,...runtime,'marketing/ask.css','marketing/ask.js','marketing/analytics.css','marketing/analytics.js','feed.xml','agent-map.json'].forEach(copy);
for(const item of readdirSync(join(root,'assets/social')))if(item.endsWith('.png'))copy('assets/social/'+item);
// Wrangler compiles ./functions from the project root separately; never publish its source as static assets.
writeFileSync(join(root,'marketing/build-manifest.json'),JSON.stringify({html:htmlFiles.sort(),routes:[...canonicals].sort(),stage:relative(root,stage)},null,2)+'\n');
console.log(`Staged ${htmlFiles.length} HTML files and ${canonicals.size} canonical routes in .site-dist.`);
