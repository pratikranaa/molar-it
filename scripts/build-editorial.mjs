import {mkdirSync,writeFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {articles as originalArticles,legal,comparisons} from '../marketing/editorial.mjs';
import {published} from '../content/published.mjs';
const articles=[...published,...originalArticles];
import {document} from '../marketing/document.mjs';
import {esc,icon,cta,visual} from '../marketing/components.mjs';
import {productGraphic} from '../marketing/product-graphics.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const save=(path,html)=>{const file=resolve(root,path==='/'?'index.html':path.endsWith('.html')?path.slice(1):path.slice(1)+'.html');mkdirSync(dirname(file),{recursive:true});writeFileSync(file,html)};
const slug=s=>String(s).replace(/<[^>]+>/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const inline=s=>esc(s).replace(/`([^`]+)`/g,'<code>$1</code>');

const prepared=body=>{
  const used={};
  let html=String(body).replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi,(_,text)=>{
    const base=slug(text)||'section';
    used[base]=(used[base]||0)+1;
    return '<h2 id="'+base+(used[base]>1?'-'+used[base]:'')+'">'+text+'</h2>';
  });
  return html.replace(/<table(?![^>]*class="table-scroll")[^>]*>[\s\S]*?<\/table>/gi,t=>'<div class="table-scroll">'+t+'</div>');
};
const toc=body=>{const hs=[...String(body).matchAll(/<h2[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/h2>/gi)];return hs.length?'<aside class="reading-sidebar"><strong>On this page</strong><nav aria-label="On this page">'+hs.map(x=>'<a href="#'+x[1]+'">'+x[2].replace(/<[^>]+>/g,'')+'</a>').join('')+'</nav><a class="text-link" href="/blog">All guides '+icon('arrow')+'</a></aside>':''};
const description=item=>item.path==='/blog/ai-agents-future-software-testing'?'A practical guide to verification loops for coding agents, with deterministic checks where judgment matters.':item.description;
const page=(item,type,legalPage=false)=>{
  let body=prepared(item.body);
  const article=type==='Article';
  if(!article)body=body.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i,'');
  body=body.replace(/\bundefined\b/g,'unset value');
  const crumb=legalPage?'Legal':article?'Guides':'Comparisons';
  const next=article?cta('Try a check on a public page.','Enter a public URL, ask Molar to confirm a visible heading or text, and inspect the captured browser result.'):'';
  return document({title:item.title+' | Molar',description:description(item),path:item.path,type:type,datePublished:article?item.date:undefined,author:article?(item.author?{type:'Organization',name:item.author}:undefined):undefined,section:item.category,breadcrumbs:article?[{name:'Molar',item:'/'},{name:'Guides',item:'/blog'},{name:item.title,item:item.path}]:undefined,body:'<main id="main"><section class="article-hero reading-hero"><div class="wrap"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="/blog">'+crumb+'</a>'+icon('chevron')+'<span>'+esc(item.title)+'</span></nav><h1>'+esc(item.title)+'</h1><p class="article-description">'+inline(description(item))+'</p>'+(article?'<div class="article-meta"><time datetime="'+item.date+'">'+item.date+'</time><span>'+esc(item.readTime)+'</span>'+(item.author?'<span>'+esc(item.author)+'</span>':'')+'</div>':'')+'</div></section><section class="article-layout wrap">'+toc(body)+'<article class="article-body">'+body+'</article></section>'+next+'</main>'});
};
const card=x=>'<a class="blog-entry" data-blog-entry data-category="'+esc(x.category)+'" href="'+x.path+'"><div class="article-cover cover-'+x.category.toLowerCase()+'">'+productGraphic(x.category==='Integrations'?'clones':x.category==='Agents'?'platform':/release|merge|github|ci-cd/.test(x.path)?'guard':'trace',{compact:true})+'</div><div class="entry-meta"><span>'+esc(x.category)+'</span><time datetime="'+x.date+'">'+x.date+'</time></div><h2>'+esc(x.title)+'</h2><p>'+inline(description(x))+'</p><span class="read-link">Read guide '+icon('arrow')+'</span></a>';
const featured=articles.find(x=>x.path==='/blog/test-stripe-without-real-cards')||articles[0];
const index='<main id="main"><section class="reading-hero blog-hero"><div class="wrap"><div class="blog-heading"><div><h1>Guides for testing<br><span>real user flows.</span></h1></div><p>Engineering guidance for browser QA, payment and email integrations, release checks, and coding-agent workflows.</p></div><div class="blog-feature"><div><h2>'+esc(featured.title)+'</h2><p>'+inline(description(featured))+'</p><a class="text-link" href="'+featured.path+'">Read the guide '+icon('arrow')+'</a></div>'+visual('clones')+'</div></div></section><section class="section"><div class="wrap"><p class="blog-discovery-links"><a class="text-link" href="/ask">Ask a testing question</a> · <a class="text-link" href="/feed.xml">Subscribe via RSS</a></p><div class="blog-controls"><div class="blog-filters" role="group" aria-label="Filter guides"><button type="button" data-blog-filter="all" aria-pressed="true">All</button><button type="button" data-blog-filter="Integrations" aria-pressed="false">Integrations</button><button type="button" data-blog-filter="Engineering" aria-pressed="false">Engineering</button><button type="button" data-blog-filter="Agents" aria-pressed="false">Agents</button></div><label class="blog-search">'+icon('search')+'<input type="search" data-blog-search placeholder="Search guides" aria-label="Search guides"></label></div><div class="blog-grid">'+articles.map(card).join('')+'</div><p class="blog-count" data-blog-count>'+articles.length+' guides</p><div class="blog-empty" data-blog-empty hidden><h2>No guides found</h2><p>Try another search or browse every guide.</p></div></div></section>'+cta('Try a check on a public page.','Enter a public URL and ask Molar to confirm a heading or text. Inspect the result and captured screenshot.')+'</main>';
save('/blog',document({title:'Molar Guides — Browser QA, Integrations & Agents',description:'Practical engineering guides on browser QA, third-party integrations, release confidence, and agent workflows.',path:'/blog',body:index}));
save('/blog/index.html',document({title:'Molar Guides — Browser QA, Integrations & Agents',description:'Practical engineering guides on browser QA, third-party integrations, release confidence, and agent workflows.',path:'/blog',body:index}));
for(const item of articles)save(item.path,page(item,'Article'));
for(const item of legal)save(item.path,page(item,'WebPage',true));
for(const item of comparisons)save(item.path,page(item,'WebPage'));
console.log('Built /blog, '+articles.length+' articles, '+legal.length+' legal pages, and '+comparisons.length+' comparisons.');
