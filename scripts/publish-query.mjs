import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {validateDraft} from '../content/answers.mjs';
const path=process.argv[2];if(!path)throw new Error('Usage: node scripts/publish-query.mjs path/to/reviewed-draft.json');
const draft=validateDraft(JSON.parse(readFileSync(resolve(path),'utf8')));
const target=new URL('../content/published/',import.meta.url);mkdirSync(target,{recursive:true});
const article={...draft,publishedAt:new Date().toISOString().slice(0,10),author:'Molar editorial'};
writeFileSync(new URL(draft.slug+'.json',target),JSON.stringify(article,null,2)+'\n',{flag:'wx'});
console.log('Published source added: content/published/'+draft.slug+'.json\nRun node scripts/build-site.mjs and the website checks before deploying.');
