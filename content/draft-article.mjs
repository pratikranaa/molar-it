import {knowledge} from './knowledge.mjs';
import {validateDraftContent} from './answers.mjs';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// Preview and publication render the same validated, escaped source.
export function draftToArticle(source,{draft=false}={}){
 const d=validateDraftContent(source);
 const sources=ids=>ids.map(id=>{const ref=knowledge.find(s=>s.id===id);return '<a href="'+esc(ref.url)+'">'+esc(ref.title)+'</a>'}).join(' · ');
 return {path:'/blog/'+d.slug,title:d.title,description:d.description,date:d.publishedAt,author:d.author||'Molar editorial',category:d.category||'Integrations',body:d.sections.map(s=>'<section><h2>'+esc(s.heading)+'</h2>'+s.paragraphs.map(p=>'<p>'+esc(p)+'</p>').join('')+(s.code?'<pre><code>'+esc(s.code)+'</code></pre>':'')+'<p class="article-source">Sources: '+sources(s.sourceIds)+'</p></section>').join('')+'<section><h2>About this guide</h2><p>'+(draft?'This is an unpublished AI-assisted draft. Its statements and sources still need editorial verification.':'Prepared with AI assistance from the cited material and checked against those sources before publication. Product availability can change during beta.')+'</p><p><a href="/ask">Ask a related testing question</a> or <a href="/blog">browse all guides</a>.</p></section>'};
}
