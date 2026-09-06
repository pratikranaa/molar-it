import {readdirSync,readFileSync} from 'node:fs';
import {validateDraft} from './answers.mjs';
import {draftToArticle} from './draft-article.mjs';
const dir=new URL('./published/',import.meta.url);
export const published=readdirSync(dir).filter(file=>file.endsWith('.json')).map(file=>{
 const d=validateDraft(JSON.parse(readFileSync(new URL(file,dir),'utf8')));
 return draftToArticle(d);
});
