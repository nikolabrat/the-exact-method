import worker from "./src/index.js";
import crypto from "node:crypto";
async function run(kw, followsSeq){
const store=new Map(); const KV={get:async k=>store.has(k)?store.get(k):null,put:async(k,v)=>{store.set(k,v)}};
const env={BOT:KV,META_APP_SECRET:"s",VERIFY_TOKEN:"vt",EXPECTED_USERNAME:"theexactmethod"};
store.set("auth",JSON.stringify({token:"T",host:"https://graph.facebook.com/v23.0",user_id:"1784",username:"theexactmethod",expires_at:Date.now()+1e12}));
let i=0; const out=[];
globalThis.fetch=async(u,o={})=>{u=String(u); const b=o.body?JSON.parse(o.body):null;
 if(u.includes("fields=caption")) return new Response(JSON.stringify({caption:"x"}));
 if(u.includes("is_user_follow_business")) return new Response(JSON.stringify({is_user_follow_business:followsSeq[Math.min(i++,followsSeq.length-1)]}));
 if(b&&typeof b.message==="object"){const m=b.message;out.push((m.text||m.attachment.payload.text).split("\n")[0]);}
 return new Response(JSON.stringify({recipient_id:"U1",message_id:"m"}));};
async function hook(obj){const body=JSON.stringify(obj);const sig="sha256="+crypto.createHmac("sha256","s").update(body).digest("hex");const p=[];
 await worker.fetch(new Request("https://x/webhook",{method:"POST",body,headers:{"x-hub-signature-256":sig}}),env,{waitUntil:x=>p.push(x)});await Promise.all(p);}
await hook({object:"instagram",entry:[{changes:[{field:"comments",value:{id:"c1",text:kw,from:{id:"U1",username:"t"},media:{id:"m1"}}}]}]});
const pb=(pl)=>hook({object:"instagram",entry:[{messaging:[{sender:{id:"U1"},recipient:{id:"1784"},postback:{payload:pl,title:"x"}}]}]});
const msg=(t)=>hook({object:"instagram",entry:[{messaging:[{sender:{id:"U1"},recipient:{id:"1784"},message:{mid:"x",text:t}}]}]});
await pb("SEND"); if(followsSeq[0]===false){await pb("FOLLOWING");} await msg("a@b.co");
console.log(`${kw} follows=${followsSeq}:`, out.map(x=>x.slice(0,40)).join("  |  "), " emails:", JSON.parse(store.get("emails")||"[]").length);
}
await run("NARROW",[true]); await run("NARROW",[false,true]); await run("PLAIN",[false,false,false]); await run("PROMPT",[true]); await run("PROMPT",[false,true]);
