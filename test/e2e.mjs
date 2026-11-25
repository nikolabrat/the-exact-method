// End-to-end: PROMPT flow with a stale-prone store, new and known emails, Gumroad flow.
import worker, { Store } from "../src/index.js";
import crypto from "node:crypto";
function mkEnv(){const kv=new Map();const BOT={get:async k=>kv.has(k)?kv.get(k):null,put:async(k,v)=>{kv.set(k,v)},list:async()=>({keys:[]})};
 const m=new Map();const st=new Store({storage:{get:async k=>m.get(k),put:async(k,v)=>{m.set(k,v)}}},{});
 const STORE={idFromName:()=>"x",get:()=>st};
 kv.set("auth",JSON.stringify({token:"T",host:"https://graph.facebook.com/v23.0",user_id:"1784",username:"theexactmethod",expires_at:Date.now()+1e12}));
 return {BOT,STORE,META_APP_SECRET:"s",VERIFY_TOKEN:"vt",EXPECTED_USERNAME:"theexactmethod",KIT_API_KEY:"k"};}
async function run(label,kw,email,known){const env=mkEnv();const out=[];
 globalThis.fetch=async(u,o={})=>{u=String(u);const b=o.body&&String(o.body).startsWith("{")?JSON.parse(o.body):null;
  if(u.includes("kit.com")){out.push("   kit "+(o.method||"GET")+" "+u.replace(/\?.*/,""));
   if(u.includes("subscribers?status"))return new Response(JSON.stringify({subscribers:known?[{email_address:email}]:[{email_address:"other@x.com"}]}));
   if(u.includes("/v4/tags?"))return new Response(JSON.stringify({tags:[{id:5,name:"ig-"+kw}]}));return new Response("{}");}
  if(u.includes("fields=caption"))return new Response(JSON.stringify({caption:"which ai should i pay for"}));
  if(u.includes("is_user_follow_business"))return new Response(JSON.stringify({is_user_follow_business:true}));
  if(b&&typeof b.message==="object"){const m=b.message;out.push("DM: "+(m.text||m.attachment.payload.text).split("\n")[0].slice(0,62));}
  return new Response(JSON.stringify({message_id:"m"}));};
 const hook=async(obj)=>{const body=JSON.stringify(obj);const sig="sha256="+crypto.createHmac("sha256","s").update(body).digest("hex");const p=[];
  await worker.fetch(new Request("https://x/webhook",{method:"POST",body,headers:{"x-hub-signature-256":sig}}),env,{waitUntil:x=>p.push(x)});await Promise.all(p);};
 await hook({object:"instagram",entry:[{changes:[{field:"comments",value:{id:"c9",text:kw.toLowerCase(),from:{id:"U1",username:"t"},media:{id:"m1"}}}]}]});
 await hook({object:"instagram",entry:[{changes:[{field:"comments",value:{id:"c9",text:kw.toLowerCase(),from:{id:"U1",username:"t"},media:{id:"m1"}}}]}]}); // duplicate delivery
 await hook({object:"instagram",entry:[{messaging:[{sender:{id:"U1"},recipient:{id:"1784"},postback:{payload:`SEND|${kw}|m1`}}]}]});
 if(email) await hook({object:"instagram",entry:[{messaging:[{sender:{id:"U1"},recipient:{id:"1784"},message:{mid:"x",text:email}}]}]});
 const lg=await (await worker.fetch(new Request("https://x/log"),env,{waitUntil(){}})).json();
 console.log(label);out.forEach(x=>console.log("  "+x));console.log("  log: "+lg.map(x=>x.kind).reverse().join(" > "));}
await run("PROMPT, new email","PROMPT","nikolatabg@abv.bg",false);
await run("PROMPT, known email","PROMPT","a@b.co",true);
await run("NARROW (Gumroad)","NARROW",null,false);
