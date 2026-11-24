import worker from "./src/index.js";
import crypto from "node:crypto";
const store=new Map(); const KV={get:async k=>store.has(k)?store.get(k):null,put:async(k,v)=>{store.set(k,v)}};
const env={BOT:KV,META_APP_SECRET:"s",VERIFY_TOKEN:"vt",EXPECTED_USERNAME:"theexactmethod"};
store.set("auth",JSON.stringify({token:"T",host:"https://graph.facebook.com/v23.0",user_id:"1784",username:"theexactmethod",expires_at:Date.now()+1e12}));
let follows=false;
globalThis.fetch=async(u,o={})=>{u=String(u); const b=o.body?JSON.parse(o.body):null;
 if(u.includes("fields=caption")) return new Response(JSON.stringify({caption:"Which AI should I pay for?"}));
 if(u.includes("is_user_follow_business")) return new Response(JSON.stringify({is_user_follow_business:follows}));
 if(b&&typeof b.message==="object"){const m=b.message; const t=m.text||m.attachment.payload.text; const bt=m.attachment?m.attachment.payload.buttons.map(x=>`[${x.title}${x.url?" -> "+x.url:""}]`).join(" "):"";
   console.log(`\n--> DM to ${b.recipient.comment_id?"comment "+b.recipient.comment_id:"user "+b.recipient.id} (${new TextEncoder().encode(t).length}B)\n${t}\n${bt}`);}
 else if(b) console.log("--> public reply:",b.message);
 return new Response(JSON.stringify({recipient_id:"U1",message_id:"m"}));};
async function hook(obj){const body=JSON.stringify(obj);const sig="sha256="+crypto.createHmac("sha256","s").update(body).digest("hex");const p=[];
 await worker.fetch(new Request("https://x/webhook",{method:"POST",body,headers:{"x-hub-signature-256":sig}}),env,{waitUntil:x=>p.push(x)});await Promise.all(p);}
await hook({object:"instagram",entry:[{changes:[{field:"comments",value:{id:"c1",text:"NARROW",from:{id:"U1",username:"tester"},media:{id:"m1"}}}]}]});
const pb=(pl)=>hook({object:"instagram",entry:[{messaging:[{sender:{id:"U1"},recipient:{id:"1784"},postback:{payload:pl,title:"x"}}]}]});
const msg=(t)=>hook({object:"instagram",entry:[{messaging:[{sender:{id:"U1"},recipient:{id:"1784"},message:{mid:"x",text:t}}]}]});
await pb("SEND"); await pb("FOLLOWING"); follows=true; await pb("FOLLOWING"); await msg("hi"); await msg("My email is Nik@Gmail.com");
await msg("random later text");
console.log("\nemails:",store.get("emails"));
console.log(JSON.parse(store.get("log")).map(x=>x.kind+(x.ok===false?"!":"")).reverse().join(" > "));
