import {spawnSync} from 'node:child_process';
import {mkdirSync,readFileSync,writeFileSync,readdirSync,copyFileSync,rmSync} from 'node:fs';
import {dirname,join,relative,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
for(const name of ['marketing','company','resources','editorial','legacy','verify']){
  const result=spawnSync(process.execPath,[join(root,`scripts/build-${name}.mjs`)],{cwd:root,stdio:'inherit'});
  if(result.status!==0) process.exit(result.status||1);
}
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
const runtime=['marketing/illustrations.css','marketing/application-scene.css','marketing/application-scene.js','marketing/identity.css','marketing/site.css','marketing/site.js','marketing/verify-theme.css','verify.css','verify.js','og.png','robots.txt','sitemap.xml','llms.txt','llms-full.txt','_headers','_redirects','_routes.json','fonts/hanken-grotesk-latin.woff2','fonts/geist-mono-latin.woff2','fonts/OFL-Hanken-Grotesk.txt','assets/invitation-run.json','assets/molar-mark-apple.png','assets/molar-mark-favicon.png'];
const copy=path=>{const out=join(stage,path);mkdirSync(dirname(out),{recursive:true});copyFileSync(join(root,path),out)};
[...htmlFiles,...runtime].forEach(copy);
// Wrangler compiles ./functions from the project root separately; never publish its source as static assets.
writeFileSync(join(root,'marketing/build-manifest.json'),JSON.stringify({html:htmlFiles.sort(),routes:[...canonicals].sort(),stage:relative(root,stage)},null,2)+'\n');
console.log(`Staged ${htmlFiles.length} HTML files and ${canonicals.size} canonical routes in .site-dist.`);
