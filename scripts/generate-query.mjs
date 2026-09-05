import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {homedir} from 'node:os';
import {resolve} from 'node:path';
import {retrieve,MODEL,parseGenerated,draftFormat} from '../content/answers.mjs';
const args=process.argv.slice(2),query=args.join(' ').trim();
if(query.length<8||query.length>400)throw new Error('Usage: node scripts/generate-query.mjs "A specific testing question" (8–400 characters).');
const sources=retrieve(query);if(sources.length<2)throw new Error('Not enough reviewed material for this question. Add researched public sources to content/knowledge.mjs first.');
// Uses the operator's existing Wrangler session. Credentials never enter an artifact.
const token=process.env.CLOUDFLARE_API_TOKEN||readFileSync(resolve(homedir(),'.wrangler/config/default.toml'),'utf8').match(/oauth_token\s*=\s*"([^"]+)"/)?.[1];
if(!token)throw new Error('Sign in with wrangler login or supply CLOUDFLARE_API_TOKEN.');
const response=await fetch('https://api.cloudflare.com/client/v4/accounts/b5821cc715dd5f6a5022923d540cce7f/ai/run/'+MODEL,{method:'POST',signal:AbortSignal.timeout(60000),headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify({response_format:draftFormat,temperature:0.2,max_tokens:2600,messages:[{role:'system',content:'Write a useful engineering guide that answers the supplied search question. Use ONLY the reviewed sources below, no invented features, results or prices. Explain observable outcomes, a practical test sequence, failure cases and limits. Write 550–750 words over 4 sections. Plain text paragraphs only, no HTML. Return JSON with title (under 85 chars), description (under 165 chars), slug (lowercase words separated by hyphens), sections:[{heading,paragraphs:[strings],sourceIds:[supporting source IDs]}]. Each section needs at least one source ID. Source facts: '+JSON.stringify(sources)},{role:'user',content:query}]})});
if(!response.ok)throw new Error('Generation service returned HTTP '+response.status+'. No draft was published.');
const payload=await response.json(),generated=parseGenerated(payload.result?.response);
if(!generated||!Array.isArray(generated.sections)||!/^[-a-z0-9]{6,90}$/.test(generated.slug))throw new Error('The model returned an incomplete draft. No file was published.');
const draft={...generated,query,sourceIds:sources.map(s=>s.id),status:'draft',generatedAt:new Date().toISOString(),model:MODEL,reviewedBy:null};
const dir=resolve('.content-drafts');mkdirSync(dir,{recursive:true});const file=resolve(dir,generated.slug+'.json');
writeFileSync(file,JSON.stringify(draft,null,2)+'\n',{flag:'wx'});console.log('Draft created: '+file+'\nReview every paragraph and citation. Set status to reviewed and reviewedBy to the editor before publishing.');
