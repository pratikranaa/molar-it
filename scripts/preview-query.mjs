import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {draftToArticle} from '../content/draft-article.mjs';
import {articleDocument} from '../marketing/article-page.mjs';

const path=process.argv[2];
if(!path)throw new Error('Usage: node scripts/preview-query.mjs .content-drafts/article.json');
const source=resolve(path),draft=JSON.parse(readFileSync(source,'utf8'));
const article=draftToArticle(draft,{draft:true});
const html=articleDocument(article,[],{draft:true});
const directory=new URL('../.content-drafts/',import.meta.url);mkdirSync(directory,{recursive:true});
const target=new URL(draft.slug+'.preview.html',directory);
writeFileSync(target,html);
console.log('Preview: http://localhost:8080/.content-drafts/'+draft.slug+'.preview.html\nStart python3 scripts/serve-marketing.py --port 8080 if needed. The local draft is noindex and excluded from the deployment.');
