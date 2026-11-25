import { findKeyword, finalMessage, introText, needsEmail } from "../src/rules.js";
for (const [c, cap] of [["plain", "same request: an email announcing a new online candle shop"], ["Plain please", "other reel"], ["VIDEO", "made with no-slop-motion"], ["video", "any other caption"]]) {
  const kw = findKeyword(c); const f = finalMessage(kw, cap);
  console.log(`"${c}" → ${kw} | email step: ${needsEmail(kw)}\n  intro: ${introText(kw).split("\n")[2]}\n  final: ${f.text.split("\n")[0]}\n  pointer: ${f.text.split("\n\n")[1].slice(0, 90)}…\n  button → ${f.url}\n`);
}
