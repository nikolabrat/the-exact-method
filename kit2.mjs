import worker from "./src/index.js";
import crypto from "node:crypto";
async function run(known){
const store=new Map(); const KV={get:async k=>store.has(k)?store.get(k):null,put:async(k,v)=>{store.set(k,v)},list:async({prefix,limit})=>({keys:[...store.keys()].filter(k=>k.startsWith(prefix)).sort().slice(0,limit).map(name=>({name}))})};
const env={BOT:KV,META_APP_SECRET:"s",VERIFY_TOKEN:"vt",EXPECTED_USERNAME:"theexactmethod",KIT_API_KEY:"k"};
store.set("auth",JSON.stringify({token:"T",host:"https://graph.facebook.com/v23.0",user_id:"1784",username:"theexactmethod",expires_at:Date.now()+1e12}));
const out=[];
globalThis.fetch=async(u,o={})=>{u=String(u); const b=o.body&&o.body.startsWith&&o.body.startsWith("{")?JSON.parse(o.body):null;
 if(u.includes("kit.com")) { out.push("  kit: "+(o.method||"GET")+" "+u.replace(/\?.*/,"")); 
   if(u.includes("subscribers?status")) return new Response(JSON.stringify({subscribers:known?[{id:1}]:[]}));
   if(u.includes("/v4/tags?")) return new Response(JSON.stringify({tags:[{id:5,name:"ig-PROMPT"}]}));
   return new Response("{}",{status:200});}
 if(u.includes("fields=caption")) return new Response(JSON.stringify({caption:"x"}));
 if(u.includes("is_user_follow_business")) return new Response(JSON.stringify({is_user_follow_business:true}));
 if(b&&typeof b.message==="object"){const m=b.message;out.push("DM: "+(m.text||m.attachment.payload.text).split("\n")[0].slice(0,60));}
 return new Response(JSON.stringify({message_id:"m"}));};
async function hook(obj){const body=JSON.stringify(obj);const sig="sha256="+crypto.createHmac("sha256","s").update(body).digest("hex");const p=[];
 await worker.fetch(new Request("https://x/webhook",{method:"POST",body,headers:{"x-hub-signature-256":sig}}),env,{waitUntil:x=>p.push(x)});await Promise.all(p);}
await hook({object:"instagram",entry:[{changes:[{field:"comments",value:{id:"c2",text:"prompt",from:{id:"U1",username:"t"},media:{id:"mP"}}}]}]});
await hook({object:"instagram",entry:[{messaging:[{sender:{id:"U1"},recipient:{id:"1784"},postback:{payload:"SEND|PROMPT|mP"}}]}]});
await hook({object:"instagram",entry:[{messaging:[{sender:{id:"U1"},recipient:{id:"1784"},message:{mid:"x",text:"me@x.com"}}]}]});
console.log(known?"KNOWN email:":"NEW email:"); out.forEach(x=>console.log(" ",x));}
await run(false); await run(true);
