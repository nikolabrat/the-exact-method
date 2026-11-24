import { findKeyword, buildMessage } from "./src/rules.js";
const t=[["narrow","NARROW"],["Narrow please!","NARROW"],["narrowing","null"],["video and plain","VIDEO"],["PLAIN pls VIDEO","PLAIN"],["prompt","PROMPT"],["🔥NARROW🔥","NARROW"]];
for (const [s,e] of t) console.log(String(findKeyword(s))===e?"ok":"FAIL", s, findKeyword(s));
console.log(buildMessage("NARROW","Which AI should I pay for? ...").slice(0,200));
console.log(buildMessage("VIDEO","made with no-slop-motion").split("\n\n")[1].slice(0,60));
console.log(new TextEncoder().encode(buildMessage("PROMPT","")).length, "bytes PROMPT");
