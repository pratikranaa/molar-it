import {readdirSync,readFileSync} from 'node:fs';
import {knowledge} from './knowledge.mjs';
import {validateDraft} from './answers.mjs';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dir=new URL('./published/',import.meta.url);
export const published=readdirSync(dir).filter(file=>file.endsWith('.json')).map(file=>{
 const d=validateDraft(JSON.parse(readFileSync(new URL(file,dir),'utf8')));
 const refs=d.sourceIds.map(id=>knowledge.find(s=>s.id===id));
 return {path:'/blog/'+d.slug,title:d.title,description:d.description,date:d.publishedAt,author:d.author,readTime:Math.max(3,Math.ceil(d.sections.flatMap(s=>s.paragraphs).join(' ').split(/\s+/).length/220))+' min read',category:'Integrations',body:d.sections.map(s=>'<section><h2>'+esc(s.heading)+'</h2>'+s.paragraphs.map(p=>'<p>'+esc(p)+'</p>').join('')+'<p class="article-source">Sources: '+s.sourceIds.map(id=>{const ref=refs.find(r=>r.id===id);return '<a href="'+esc(ref.url)+'">'+esc(ref.title)+'</a>'}).join(' · ')+'</p></section>').join('')+'<section><h2>About this guide</h2><p>Prepared with AI assistance from the cited material and reviewed by Molar editorial before publication. Product availability can change during beta.</p><p><a href="/ask">Ask a related testing question</a> or <a href="/blog">browse all guides</a>.</p></section>'};
});
