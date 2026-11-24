import worker from "./src/index.js";
import crypto from "node:crypto";
const store=new Map();
const KV={get:async k=>store.has(k)?store.get(k):null,put:async(k,v)=>{store.set(k,v)},list:async({prefix,limit})=>({keys:[...store.keys()].filter(k=>k.startsWith(prefix)).sort().slice(0,limit).map(name=>({name}))})};
const env={BOT:KV,META_APP_SECRET:"s",VERIFY_TOKEN:"vt",EXPECTED_USERNAME:"theexactmethod"};
store.set("auth",JSON.stringify({token:"T",host:"https://graph.facebook.com/v23.0",user_id:"1784",username:"theexactmethod",expires_at:Date.now()+1e12}));
const caps={mN:"which ai should i pay for",mP:"comment PROMPT"}; const out=[];
globalThis.fetch=async(u,o={})=>{u=String(u); const b=o.body?JSON.parse(o.body):null;
 const mc=u.match(/\/(m[NP])\?fields=caption/); if(mc) return new Response(JSON.stringify({caption:caps[mc[1]]}));
 if(u.includes("is_user_follow_business")) return new Response(JSON.stringify({is_user_follow_business:true}));
 if(b&&typeof b.message==="object"){const m=b.message;const t=(m.text||m.attachment.payload.text).split("\n")[0];const bt=m.attachment?m.attachment.payload.buttons.map(x=>x.payload||x.url).join(","):"";out.push(t.slice(0,45)+(bt?" ["+bt+"]":""));}
 return new Response(JSON.stringify({message_id:"m"}));}; // NOTE: no recipient_id, like the live bug
async function hook(obj){const body=JSON.stringify(obj);const sig="sha256="+crypto.createHmac("sha256","s").update(body).digest("hex");const p=[];
 await worker.fetch(new Request("https://x/webhook",{method:"POST",body,headers:{"x-hub-signature-256":sig}}),env,{waitUntil:x=>p.push(x)});await Promise.all(p);}
const com=(id,t,m)=>hook({object:"instagram",entry:[{changes:[{field:"comments",value:{id,text:t,from:{id:"U1",username:"tester"},media:{id:m}}}]}]});
const pb=(pl)=>hook({object:"instagram",entry:[{messaging:[{sender:{id:"U1"},recipient:{id:"1784"},postback:{payload:pl,title:"x"}}]}]});
const msg=(t)=>hook({object:"instagram",entry:[{messaging:[{sender:{id:"U1"},recipient:{id:"1784"},message:{mid:"x",text:t}}]}]});
await com("c1","Narrow","mN"); await pb("SEND|NARROW|mN");
await com("c2","Prompt","mP"); await pb("SEND|PROMPT|mP"); await msg("me@test.com");
out.forEach(x=>console.log(x));
const r=await worker.fetch(new Request("https://x/log"),env,{waitUntil(){}}); console.log((await r.json()).map(x=>x.kind).join(" < "));
