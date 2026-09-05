import {retrieve,answerMessages,MODEL,parseGenerated,validateAnswer,answerFormat} from '../../content/answers.mjs';
import {json,bodyJSON,takeQuota} from '../../server/request.mjs';
export async function onRequest({request,env}){
 if(request.method!=='POST')return json(405,{error:'Use the question form.'},{Allow:'POST'});
 if(request.headers.get('Origin')!==new URL(request.url).origin)return json(403,{error:'Open the question form on this website.'});
 let data;try{data=await bodyJSON(request)}catch{return json(400,{error:'Enter a question of up to 400 characters.'})}
 if(typeof data?.question!=='string'||data.question.trim().length<8||data.question.length>400)return json(400,{error:'Enter a question between 8 and 400 characters.'});
 const question=data.question.trim();
 const sources=retrieve(question);
 if(!sources.length)return json(200,{mode:'no-match',answer:'I could not find a reliable answer in the Molar guides. Try a question about browser testing, integrations, or a Molar product.',sources:[]});
 try{
  if(!await takeQuota(env,request,'ask'))return json(429,{error:'The answer limit has been reached. You can still read the guides below. Please try again later.',sources:sources.map(({title,url})=>({title,url}))},{'Retry-After':'3600'});
  const result=await env.AI.run(MODEL,{messages:answerMessages(question,sources),response_format:answerFormat,max_tokens:420,temperature:0.15});
  const answer=validateAnswer(parseGenerated(result.response),sources);
  if(answer)return json(200,{mode:'generated',...answer});
 }catch{/* Return an explicit source excerpt, never present a fallback as generated. */}
 return json(200,{mode:'sources',answer:'A generated answer is unavailable right now. Here is the most relevant guidance from our published material:\n\n'+sources[0].text,sources:sources.map(({title,url})=>({title,url}))});
}
