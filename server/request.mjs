export const json=(status,body,extra={})=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex',...extra}});
export async function bodyJSON(request,max=2048){
 if(!request.headers.get('content-type')?.includes('application/json'))throw new Error('Use JSON.');
 const reader=request.body?.getReader();if(!reader)throw new Error('Add a request body.');
 const chunks=[];let size=0;
 while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>max){await reader.cancel();throw new Error('Request is too long.')}chunks.push(value)}
 const bytes=new Uint8Array(size);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length}
 return JSON.parse(new TextDecoder().decode(bytes));
}
// Atomic UPSERT enforces the cap across instances. Only a daily salted network hash is stored.
export async function takeQuota(env,request,kind,limit=40){
 if(!env.WEBSITE_DB||!env.WEBSITE_REQUEST_SECRET)throw new Error('Quota unavailable');
 const day=new Date().toISOString().slice(0,10);
 const ip=request.headers.get('CF-Connecting-IP')||'local';
 const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(env.WEBSITE_REQUEST_SECRET+day+ip)))).map(x=>x.toString(16).padStart(2,'0')).join('');
 const hour=new Date().toISOString().slice(0,13);
 const sql='INSERT INTO request_quotas (key,count,expires) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 WHERE count < ? RETURNING count';
 const expires=Date.now()+172800000;
 const network=await env.WEBSITE_DB.prepare(sql).bind(kind+':'+hour+':'+hash,expires,6).first();
 if(!network)return false;
 const global=await env.WEBSITE_DB.prepare(sql).bind(kind+':'+day,expires,limit).first();
 await env.WEBSITE_DB.prepare('DELETE FROM request_quotas WHERE expires < ?').bind(Date.now()).run();
 return Boolean(global);
}
