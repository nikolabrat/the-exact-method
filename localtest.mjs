// Run worker in-process with fake KV + fake fetch to Instagram.
import worker from "./src/index.js";
import crypto from "node:crypto";
const store=new Map(); const KV={get:async k=>store.has(k)?store.get(k):null,put:async(k,v)=>{store.set(k,v)}};
const env={BOT:KV,META_APP_ID:"1",META_APP_SECRET:"s3cret",VERIFY_TOKEN:"vt",EXPECTED_USERNAME:"theexactmethod"};
store.set("auth",JSON.stringify({token:"T",user_id:"1784",username:"theexactmethod",expires_at:Date.now()+50*864e5}));
const calls=[]; globalThis.fetch=async(u,o={})=>{calls.push([o.method||"GET",String(u).replace(/^https:\/\/graph.facebook.com\/v23.0/,""),o.body]);
  const path=String(u);
  if(path.includes("fields=caption")) return new Response(JSON.stringify({caption:"Which AI should I pay for?"}));
  if(path.includes("/media?")) return new Response(JSON.stringify({data:[{id:"m1",caption:"x",comments:{data:[
    {id:"c9",text:"NARROW",timestamp:new Date().toISOString(),username:"old",replies:{data:[{username:"theexactmethod"}]}},
    {id:"c8",text:"plain",timestamp:new Date().toISOString(),username:"newbie"}]}}]}));
  return new Response(JSON.stringify({id:"ok",message_id:"mid"}));};
const ctx={waitUntil:p=>pending.push(p)}; let pending=[];
let r=await worker.fetch(new Request("https://x/webhook?hub.mode=subscribe&hub.verify_token=vt&hub.challenge=42"),env,ctx); console.log("verify",r.status,await r.text());
r=await worker.fetch(new Request("https://x/webhook?hub.mode=subscribe&hub.verify_token=no&hub.challenge=42"),env,ctx); console.log("verify-bad",r.status);
const body=JSON.stringify({object:"instagram",entry:[{id:"1784",time:1,changes:[{field:"comments",value:{id:"c1",text:"Narrow!",from:{id:"u1",username:"alice"},media:{id:"m1"}}}]}]});
const sig="sha256="+crypto.createHmac("sha256","s3cret").update(body).digest("hex");
r=await worker.fetch(new Request("https://x/webhook",{method:"POST",body,headers:{"x-hub-signature-256":"sha256=dead"}}),env,ctx); console.log("badsig",r.status);
r=await worker.fetch(new Request("https://x/webhook",{method:"POST",body,headers:{"x-hub-signature-256":sig}}),env,ctx); console.log("goodsig",r.status); await Promise.all(pending); pending=[];
// duplicate delivery
r=await worker.fetch(new Request("https://x/webhook",{method:"POST",body,headers:{"x-hub-signature-256":sig}}),env,ctx); await Promise.all(pending); pending=[];
await worker.scheduled({},env,ctx); await Promise.all(pending);
for(const c of calls) console.log(c[0],c[1].slice(0,60),c[2]?String(c[2]).slice(0,90):"");
console.log("log:",store.get("log"));
r=await worker.fetch(new Request("https://x/"),env,ctx); console.log(await r.text());
