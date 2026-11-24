// Keyword rules for comment-to-DM. Edit here, push to branch `bot`, Cloudflare redeploys.
// A comment qualifies when its text contains one of KEYWORDS as a whole word (case-insensitive).
// If several appear, the first one in the text wins.

export const KEYWORDS = ["NARROW", "PLAIN", "VIDEO", "METHOD", "PROMPT"];

export const GUIDES = {
  NARROW: { name: "The Narrowing Method", link: "https://theexactmethod.gumroad.com/l/bwydhs" },
  METHOD: { name: "The Narrowing Method", link: "https://theexactmethod.gumroad.com/l/bwydhs" },
  PLAIN: { name: "Plain Voice", link: "https://theexactmethod.gumroad.com/l/vxwyul" },
  VIDEO: { name: "The Video Brief", link: "https://theexactmethod.gumroad.com/l/atnqas" },
};

// Pointer line: where in the PDF the thing the Reel promised is. First match wins.
// `contains` is matched case-insensitively against the Reel caption; omit it for the keyword's default.
export const POINTERS = [
  { kw: "METHOD", text: "Habit one from the video, narrowing the question, is this whole guide: the three prompts are written out word for word, ready to copy." },
  { kw: "VIDEO", contains: "no-slop-motion", text: "The skill from the video, no-slop-motion, is in section 13, The Anti-Slop Toolkit (page 15), with its GitHub link and the full banned list in plain words." },
  { kw: "VIDEO", contains: "never-list", text: "The never-list is part of the brief in section 07, The Brief (page 9), and the 8 checks for every render are in section 10 (page 12)." },
  { kw: "VIDEO", contains: "video editor", text: "The full workflow starts in section 02 (page 3), and the prompts are written out in sections 08 and 09 (pages 10 and 11)." },
  { kw: "VIDEO", contains: "like you're on your phone", text: "The eight checks from the video, with the phone test and the fix message, are in section 10, The Eight Checks, and the Fix Message (page 12)." },
  { kw: "VIDEO", text: "The brief template is in section 07 (page 9) and the skills, each with its GitHub link, are in sections 11 to 14 (pages 13 to 17)." },
  { kw: "PLAIN", contains: "candle shop", text: "The ChatGPT rules from the video are in section 05 (page 6), and the two settings to switch to Less are in section 04 (page 5). The follow-up line is in section 04 too: if a reply still uses bold or lists, send it and name what went wrong." },
  { kw: "PLAIN", text: "The ready-to-paste prompts for ChatGPT, Claude and Gemini are in sections 05 to 07 (pages 6 to 8), and where to paste each one is in section 04 (page 5)." },
  { kw: "NARROW", contains: "what should i sell online first", text: "The three prompts from the video are in section 03, The Three-Prompt Template (page 4), ready to copy. Fill in your own limits in prompt two." },
  { kw: "NARROW", contains: "which ai should i pay for", text: "The three prompts from the video are in section 03, The Three-Prompt Template (page 4), ready to copy. Put your own jobs and budget into prompt two, and turn web search on first so it prices from today, not from memory." },
  { kw: "NARROW", text: "The three prompts from the video are written out word for word, ready to copy." },
];

export const PROMPT_TEXT = `Here are both prompts, word for word. Run them in order, in the same chat:

1. "I want to build [what you want to build, in plain language]. Give me a numbered build plan where each number is a single, indivisible task. Anywhere a number would secretly cover two different jobs, break it into two separate numbers instead."

2. "Rewrite the plan above as direct instructions for an AI coding assistant to carry out, one number at a time, in order. Keep the one-task-per-number structure exactly as it is: nothing merged, nothing skipped, nothing reordered."

Then paste what prompt 2 gives you into a new chat or your coding tool.

If you want more prompts like that, there are 10 in the pack: https://theexactmethod.gumroad.com/l/aoyxea

Follow so you don't miss the next one.`;

export const PUBLIC_REPLIES = ["Sent it to your DMs 📩", "Check your DMs 📩", "Just sent it to you 📩"];

export function findKeyword(text) {
  const up = (text || "").toUpperCase();
  let best = null;
  for (const kw of KEYWORDS) {
    const m = new RegExp(`(^|[^A-Z0-9])${kw}([^A-Z0-9]|$)`).exec(up);
    if (m && (best === null || m.index < best.index)) best = { kw, index: m.index };
  }
  return best ? best.kw : null;
}

export function buildMessage(kw, caption) {
  if (kw === "PROMPT") return PROMPT_TEXT;
  const g = GUIDES[kw];
  const cap = (caption || "").toLowerCase();
  const p = POINTERS.find((r) => r.kw === kw && (!r.contains || cap.includes(r.contains)));
  return `Here's ${g.name}, free (enter $0 at checkout): ${g.link}\n\n${p.text}\n\nI post AI workflows like this several times a week. Follow so you don't miss the next one.`;
}

// ---------- DM sequence (ManyChat-style) ----------
// 1 intro [Send it] -> 2 follow [I'm following] -> 3 email (typed) -> 4 on its way + guide.

// What each keyword's guide holds, in a few words (used in message 1).
export const WHAT = {
  NARROW: "the three prompts from the video, word for word",
  METHOD: "the three prompts from the video, word for word",
  PLAIN: "ready-to-paste instructions for ChatGPT, Claude and Gemini",
  VIDEO: "the brief, the prompts and the skills from the video",
  PROMPT: "both prompts from the video, word for word",
};

export const BTN = { send: "Send it 📩", following: "I'm following ✅", followingAgain: "Done, following ✅", guide: "Get the guide" };

export function introText(kw) {
  const name = kw === "PROMPT" ? "The two prompts" : GUIDES[kw].name;
  return `Hey 👋 thanks for commenting ${kw}!\n\n${name}: ${WHAT[kw]}. Free.\n\nTap below and I'll send it over.`;
}

export const FOLLOW_TEXT = "Before I send it: are you following @theexactmethod?\n\nI post AI workflows like this several times a week, so you won't miss the next one.";
export const NOT_FOLLOWING_TEXT = "I can't see the follow yet 👀\n\nTap Follow on @theexactmethod, then tap the button again.";
export const EMAIL_TEXT = "lmk which email to send it to 👇\n\n(you'll also get my new AI workflows there sometimes, unsubscribe anytime)";
export const BAD_EMAIL_TEXT = "hmm that doesn't look like an email, can you type it again?";

// Message 4. Returns {text, url} for guides (url goes on a button), or {text} for PROMPT.
export function finalMessage(kw, caption) {
  if (kw === "PROMPT") return { text: "On its way 🚀\n\n" + PROMPT_TEXT };
  const g = GUIDES[kw];
  const cap = (caption || "").toLowerCase();
  const p = POINTERS.find((r) => r.kw === kw && (!r.contains || cap.includes(r.contains)));
  return { text: `On its way 🚀 Here's ${g.name}, free (enter $0 at checkout).\n\n${p.text}`, url: g.link };
}

export function isEmail(s) {
  return /^[^\s@]{1,64}@[^\s@]{1,190}\.[a-z]{2,24}$/i.test((s || "").trim());
}

// Gumroad guides (NARROW, METHOD, PLAIN, VIDEO) skip the email step: Gumroad collects the email at checkout.
// Every other keyword (PROMPT and future non-Gumroad freebies) asks for the email before delivery.
export function needsEmail(kw) {
  return !GUIDES[kw];
}

// Email-group delivery: each email keyword has a Kit form whose confirmation email holds the freebie.
// The bot signs the person up to that form (like a real form signup), so Kit sends that email.
export const KIT_FORMS = { PROMPT: "10238346" };
export const EMAIL_SUBJECT = { PROMPT: "Your 2 prompts, word for word" };

export function emailSentText(kw) {
  return `Sent ✅ check your inbox for "${EMAIL_SUBJECT[kw]}" from The Exact Method.\n\nnot there in a minute? look in Promotions or spam`;
}
