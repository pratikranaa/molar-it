const article=document.querySelector('.editorial-article');
if(article){
 const sections=[...article.querySelectorAll('.article-body h2[id]')],links=[...article.querySelectorAll('.reading-sidebar nav a')];
 if(sections.length&&'IntersectionObserver' in window){
  const visible=new Set();
  const observer=new IntersectionObserver(entries=>{
   entries.forEach(entry=>entry.isIntersecting?visible.add(entry.target):visible.delete(entry.target));
   const current=sections.find(section=>visible.has(section));if(!current)return;
   links.forEach(link=>link.hash==='#'+current.id?link.setAttribute('aria-current','location'):link.removeAttribute('aria-current'));
  },{rootMargin:'-110px 0px -55% 0px'});
  sections.forEach(section=>observer.observe(section));
 }
 article.querySelector('.article-mobile-toc nav')?.addEventListener('click',event=>{if(event.target.closest('a'))article.querySelector('.article-mobile-toc').open=false});
}
