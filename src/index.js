// The Exact Method: comment-to-DM bot (own ManyChat).
// Comment with a keyword on @theexactmethod -> instant private-reply DM with the guide + public "check your DMs".
// Two paths feed the same handler: Meta webhooks (instant) and a 2-minute poll (backstop).

import { findKeyword, PUBLIC_REPLIES, introText, FOLLOW_TEXT, NOT_FOLLOWING_TEXT, EMAIL_TEXT, BAD_EMAIL_TEXT, finalMessage, isEmail, BTN } from "./rules.js";

// Unified login (every Meta app made since late Oct 2026): Facebook Login for Business with a
// configuration, a never-expiring system-user token, and graph.facebook.com.
const GRAPH = "https://graph.facebook.com/v23.0";
const IG_GRAPH = "https://graph.instagram.com/v23.0";
const WEEK = 7 * 24 * 3600 * 1000;

export default {
  async fetch(req, env, ctx) {
    const url = new URL(req.url);
    try {
      if (url.pathname === "/webhook" && req.method === "GET") return verifyWebhook(url, env);
      if (url.pathname === "/webhook" && req.method === "POST") return await receiveWebhook(req, env, ctx);
      if (url.pathname === "/connect") return connect(url, env);
      if (url.pathname === "/callback") return await callback(url, env, req);
      if (url.pathname === "/log") return await showLog(env);
      if (url.pathname === "/") return await health(env);
      return new Response("Not found", { status: 404 });
    } catch (e) {
      await log(env, { kind: "error", where: url.pathname, msg: String(e && e.message || e) });
      return new Response("Error", { status: 500 });
    }
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(Promise.all([poll(env), maybeRefresh(env)]));
  },
};

// ---------- webhooks ----------

function verifyWebhook(url, env) {
  if (url.searchParams.get("hub.mode") === "subscribe" && url.searchParams.get("hub.verify_token") === env.VERIFY_TOKEN) {
    return new Response(url.searchParams.get("hub.challenge") || "", { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

async function receiveWebhook(req, env, ctx) {
  const raw = await req.text();
  const sig = req.headers.get("x-hub-signature-256") || "";
  const secrets = [env.META_APP_SECRET, env.IG_APP_SECRET].filter(Boolean);
  let okSig = false;
  for (const sec of secrets) if (await validSignature(raw, sig, sec)) okSig = true;
  if (!okSig) {
    await log(env, { kind: "webhook-rejected", reason: "bad signature" });
    return new Response("Bad signature", { status: 401 });
  }
  const body = JSON.parse(raw);
  const jobs = [];
  for (const entry of body.entry || []) {
    for (const ch of entry.changes || []) {
      if (ch.field !== "comments" || !ch.value) continue;
      const v = ch.value;
      if (v.parent_id) continue; // replies inside a thread are not keyword requests
      jobs.push(handleComment(env, {
        id: v.id,
        text: v.text,
        username: v.from && v.from.username,
        fromId: v.from && v.from.id,
        mediaId: v.media && v.media.id,
        timestamp: Date.now(),
        source: "webhook",
      }));
    }
  }
  for (const entry of body.entry || []) {
    for (const ev of entry.messaging || []) {
      if (ev.message && ev.message.is_echo) continue; // our own sends
      jobs.push(handleMessaging(env, ev));
    }
  }
  ctx.waitUntil(Promise.all(jobs));
  return new Response("EVENT_RECEIVED", { status: 200 });
}

async function validSignature(raw, header, secret) {
  if (!header.startsWith("sha256=")) return false;
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(raw)));
  const hex = [...mac].map((b) => b.toString(16).padStart(2, "0")).join("");
  const given = header.slice(7);
  if (given.length !== hex.length) return false;
  let diff = 0;
  for (let i = 0; i < hex.length; i++) diff |= hex.charCodeAt(i) ^ given.charCodeAt(i);
  return diff === 0;
}

// ---------- the one handler ----------

async function handleComment(env, c) {
  const auth = await getAuth(env);
  if (!auth) return; // not connected yet: leave it for later, nothing marked
  if (!c.id || !c.text) return;
  if (c.username === auth.username || c.fromId === auth.user_id) return; // our own comments
  if (Date.now() - c.timestamp > WEEK) return; // private replies only work within 7 days
  const kw = findKeyword(c.text);
  if (!kw) return;

  const key = `c:${c.id}`;
  if (await env.BOT.get(key)) return; // already handled
  await env.BOT.put(key, "pending", { expirationTtl: 60 * 60 * 24 * 30 });

  const caption = c.mediaId ? await getCaption(env, auth, c.mediaId) : "";
  const dm = await ig(auth, `/${auth.user_id}/messages`, "POST", {
    recipient: { comment_id: c.id },
    message: buttons(introText(kw), [{ type: "postback", title: BTN.send, payload: "SEND" }]),
  });
  if (!dm.ok) {
    await env.BOT.put(key, "dm-failed", { expirationTtl: 60 * 60 * 24 * 30 });
    await log(env, { kind: "dm-failed", user: mask(c.username), kw, src: c.source, err: dm.error });
    return;
  }
  if (dm.data && dm.data.recipient_id) {
    await saveState(env, dm.data.recipient_id, { kw, caption, stage: "intro", tries: 0, user: c.username || "" });
  }
  const n = (parseInt((await env.BOT.get("replyIndex")) || "0", 10) + 1) % PUBLIC_REPLIES.length;
  await env.BOT.put("replyIndex", String(n));
  const pub = await ig(auth, `/${c.id}/replies`, "POST", { message: PUBLIC_REPLIES[n] });
  await env.BOT.put(key, pub.ok ? "done" : "dm-ok-reply-failed", { expirationTtl: 60 * 60 * 24 * 30 });
  await log(env, { kind: "sent", user: mask(c.username), kw, src: c.source, reply: pub.ok ? "ok" : pub.error });
}

// ---------- DM sequence: button taps and typed email ----------

function buttons(text, btns) {
  return { attachment: { type: "template", payload: { template_type: "button", text, buttons: btns } } };
}

async function saveState(env, igsid, st) {
  await env.BOT.put(`s:${igsid}`, JSON.stringify({ ...st, ts: Date.now() }), { expirationTtl: 60 * 60 * 24 * 14 });
}

async function getState(env, igsid) {
  const raw = await env.BOT.get(`s:${igsid}`);
  return raw ? JSON.parse(raw) : null;
}

async function send(auth, igsid, message) {
  return ig(auth, `/${auth.user_id}/messages`, "POST", { recipient: { id: igsid }, message });
}

async function isFollowing(auth, igsid) {
  const r = await ig(auth, `/${igsid}?fields=is_user_follow_business`, "GET");
  if (!r.ok || typeof r.data.is_user_follow_business !== "boolean") return null; // unknown
  return r.data.is_user_follow_business;
}

async function handleMessaging(env, ev) {
  const auth = await getAuth(env);
  if (!auth) return;
  const igsid = ev.sender && ev.sender.id;
  if (!igsid || igsid === auth.user_id) return;
  const st = await getState(env, igsid);
  if (!st) return; // not in a keyword flow: leave the chat to a human

  const payload = (ev.postback && ev.postback.payload) || (ev.message && ev.message.quick_reply && ev.message.quick_reply.payload) || "";
  const text = (ev.message && ev.message.text) || "";
  let r;

  if (payload === "SEND") {
    if (st.stage === "done") return sendFinal(env, auth, igsid, st);
    r = await send(auth, igsid, buttons(FOLLOW_TEXT, [{ type: "postback", title: BTN.following, payload: "FOLLOWING" }]));
    await saveState(env, igsid, { ...st, stage: "follow" });
    return log(env, { kind: "step2-follow", user: mask(st.user), kw: st.kw, ok: r.ok, err: r.error });
  }

  if (payload === "FOLLOWING") {
    if (st.stage === "email" || st.stage === "done") return;
    const f = await isFollowing(auth, igsid);
    if (f === false && st.tries < 2) {
      r = await send(auth, igsid, buttons(NOT_FOLLOWING_TEXT, [{ type: "postback", title: BTN.followingAgain, payload: "FOLLOWING" }]));
      await saveState(env, igsid, { ...st, tries: st.tries + 1 });
      return log(env, { kind: "not-following", user: mask(st.user), try: st.tries + 1, ok: r.ok, err: r.error });
    }
    r = await send(auth, igsid, { text: EMAIL_TEXT });
    await saveState(env, igsid, { ...st, stage: "email", tries: 0 });
    return log(env, { kind: "step3-email", user: mask(st.user), following: f, ok: r.ok, err: r.error });
  }

  if (st.stage === "email" && text) {
    const m = text.match(/[^\s@<>()]+@[^\s@<>()]+\.[a-z]{2,24}/i);
    if (!m || !isEmail(m[0])) {
      if (st.tries >= 3) return;
      r = await send(auth, igsid, { text: BAD_EMAIL_TEXT });
      await saveState(env, igsid, { ...st, tries: st.tries + 1 });
      return log(env, { kind: "bad-email", user: mask(st.user), ok: r.ok });
    }
    const email = m[0].toLowerCase();
    await saveEmail(env, { email, kw: st.kw, user: st.user, igsid });
    await saveState(env, igsid, { ...st, stage: "done", email });
    return sendFinal(env, auth, igsid, st);
  }
}

async function sendFinal(env, auth, igsid, st) {
  const f = finalMessage(st.kw, st.caption);
  const r = await send(auth, igsid, f.url ? buttons(f.text, [{ type: "web_url", title: BTN.guide, url: f.url }]) : { text: f.text });
  await log(env, { kind: "step4-delivered", user: mask(st.user), kw: st.kw, ok: r.ok, err: r.error });
}

// Emails: kept in KV (list "emails") and, once KIT_API_KEY is set, added to Kit.
async function saveEmail(env, e) {
  const raw = await env.BOT.get("emails");
  const list = raw ? JSON.parse(raw) : [];
  if (!list.some((x) => x.email === e.email && x.kw === e.kw)) list.push({ ...e, t: new Date().toISOString() });
  await env.BOT.put("emails", JSON.stringify(list));
  if (env.KIT_API_KEY) {
    const k = await fetch("https://api.kit.com/v4/subscribers", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Kit-Api-Key": env.KIT_API_KEY },
      body: JSON.stringify({ email_address: e.email, state: "active", fields: { source: `ig-${e.kw}` } }),
    });
    await log(env, { kind: "kit", ok: k.ok });
  }
}

// ---------- poll backstop ----------

async function poll(env) {
  const auth = await getAuth(env);
  if (!auth) return;
  const fields = "id,caption,timestamp,comments.limit(50){id,text,timestamp,username,from,replies{username}}";
  const r = await ig(auth, `/${auth.user_id}/media?fields=${encodeURIComponent(fields)}&limit=8`, "GET");
  if (!r.ok) {
    await log(env, { kind: "poll-failed", err: r.error });
    return;
  }
  for (const m of r.data.data || []) {
    if (m.caption !== undefined) await env.BOT.put(`cap:${m.id}`, m.caption || "", { expirationTtl: 3600 });
    for (const cm of (m.comments && m.comments.data) || []) {
      const ts = Date.parse(cm.timestamp);
      if (Date.now() - ts > WEEK) continue;
      const replied = ((cm.replies && cm.replies.data) || []).some((x) => x.username === auth.username);
      if (replied) continue; // handled earlier (old scheduled task or a previous run)
      if (!findKeyword(cm.text)) continue;
      await handleComment(env, {
        id: cm.id, text: cm.text, username: cm.username || (cm.from && cm.from.username),
        fromId: cm.from && cm.from.id, mediaId: m.id, timestamp: ts, source: "poll",
      });
    }
  }
}

// ---------- Unified login (Facebook Login for Business) ----------

function connect(url, env) {
  const state = crypto.randomUUID();
  const fb = new URL("https://www.facebook.com/dialog/oauth");
  fb.searchParams.set("client_id", env.META_APP_ID);
  fb.searchParams.set("redirect_uri", `${url.origin}/callback`);
  fb.searchParams.set("config_id", env.LOGIN_CONFIG_ID);
  fb.searchParams.set("response_type", "code");
  fb.searchParams.set("override_default_response_type", "true");
  fb.searchParams.set("state", state);
  fb.searchParams.set("prompt", "login"); // lets you log in with Instagram
  return new Response(null, {
    status: 302,
    headers: { Location: fb.toString(), "Set-Cookie": `st=${state}; Path=/callback; HttpOnly; Secure; SameSite=Lax; Max-Age=600` },
  });
}

async function callback(url, env, req) {
  const cookie = (req.headers.get("cookie") || "").match(/(?:^|;\s*)st=([^;]+)/);
  if (!cookie || cookie[1] !== url.searchParams.get("state")) return page("Link expired. Open /connect again.");
  const code = url.searchParams.get("code");
  if (!code) return page("No code from Meta: " + (url.searchParams.get("error_description") || "cancelled"));

  const ex = new URL(`${GRAPH}/oauth/access_token`);
  ex.searchParams.set("client_id", env.META_APP_ID);
  ex.searchParams.set("client_secret", env.META_APP_SECRET);
  ex.searchParams.set("redirect_uri", `${url.origin}/callback`);
  ex.searchParams.set("code", code);
  const tj = await (await fetch(ex.toString())).json();
  if (!tj.access_token) return page("Token exchange failed: " + safeErr(tj));
  const token = tj.access_token;

  const aj = await (await fetch(`${GRAPH}/me/assigned_instagram_accounts?fields=id,username`, { headers: { Authorization: `Bearer ${token}` } })).json();
  const acct = ((aj && aj.data) || []).find((a) => !env.EXPECTED_USERNAME || a.username === env.EXPECTED_USERNAME);
  if (!acct) {
    const names = ((aj && aj.data) || []).map((a) => "@" + a.username).join(", ") || "none";
    return page(`@${env.EXPECTED_USERNAME} was not shared in the login (got: ${names}${aj.error ? "; " + safeErr(aj) : ""}). Open /connect again and tick the Instagram account. Nothing saved.`);
  }
  const auth = { token, host: GRAPH, user_id: String(acct.id), username: acct.username, expires_at: Date.now() + 100 * 365 * 86400000 };
  await env.BOT.put("auth", JSON.stringify(auth));

  const sub = await ig(auth, `/${auth.user_id}/subscribed_apps`, "POST", { subscribed_fields: ["comments", "messages", "messaging_postbacks"] });
  await log(env, { kind: "connected", user: acct.username, webhooks: sub.ok ? "subscribed" : sub.error });
  return page(`Connected @${acct.username}. Comment webhooks: ${sub.ok ? "subscribed" : "not subscribed (" + sub.error + "); the 2-minute check still runs"}. You can close this tab.`);
}

// ---------- helpers ----------

// Two ways in: (a) /connect login stores {token, host, ...} in KV; (b) a token generated in the
// Meta dashboard ("Generate token") and pasted as the Cloudflare secret IG_TOKEN.
// For (b) the host is detected once: Instagram-login token -> graph.instagram.com,
// system-user token -> graph.facebook.com.
async function getAuth(env) {
  const raw = await env.BOT.get("auth");
  const a = raw ? JSON.parse(raw) : null;
  if (!env.IG_TOKEN) return a && a.token ? a : null;
  const fp = env.IG_TOKEN.slice(-12) + ":v2"; // v2 = subscribe comments+messages+postbacks
  if (a && a.fp === fp) return { ...a, token: a.refreshed || env.IG_TOKEN };
  const det = await detectToken(env.IG_TOKEN, env.EXPECTED_USERNAME);
  if (!det) { await log(env, { kind: "token-unusable" }); return a && a.token ? a : null; }
  const auth = { ...det, fp, expires_at: det.host === IG_GRAPH ? Date.now() + 50 * 86400000 : Date.now() + 100 * 365 * 86400000 };
  await env.BOT.put("auth", JSON.stringify(auth));
  await log(env, { kind: "token-detected", user: auth.username, host: auth.host.includes("instagram") ? "instagram" : "facebook" });
  if (auth.host === IG_GRAPH) {
    const sub = await fetch(`${IG_GRAPH}/me/subscribed_apps?subscribed_fields=comments,messages,messaging_postbacks`, { method: "POST", headers: { Authorization: `Bearer ${env.IG_TOKEN}` } });
    await log(env, { kind: "subscribe", ok: sub.ok });
  } else {
    const sub = await ig({ ...auth, token: env.IG_TOKEN }, `/${auth.user_id}/subscribed_apps`, "POST", { subscribed_fields: ["comments", "messages", "messaging_postbacks"] });
    await log(env, { kind: "subscribe", ok: sub.ok, err: sub.error });
  }
  return { ...auth, token: env.IG_TOKEN };
}

async function detectToken(token, expected) {
  const h = { Authorization: `Bearer ${token}` };
  try {
    const me = await (await fetch(`${IG_GRAPH}/me?fields=user_id,username`, { headers: h })).json();
    if (me.username && (!expected || me.username === expected)) return { host: IG_GRAPH, user_id: String(me.user_id || me.id), username: me.username };
  } catch {}
  try {
    const aj = await (await fetch(`${GRAPH}/me/assigned_instagram_accounts?fields=id,username`, { headers: h })).json();
    const acct = ((aj && aj.data) || []).find((x) => !expected || x.username === expected);
    if (acct) return { host: GRAPH, user_id: String(acct.id), username: acct.username };
  } catch {}
  return null;
}

async function maybeRefresh(env) {
  const raw = await env.BOT.get("auth");
  const a = raw ? JSON.parse(raw) : null;
  if (!a || a.host !== IG_GRAPH) return; // system-user tokens never expire
  if (Date.now() - (a.refreshed_at || 0) < WEEK) return;
  const cur = a.refreshed || env.IG_TOKEN || a.token;
  const r = await fetch(`${IG_GRAPH}/refresh_access_token?grant_type=ig_refresh_token&access_token=${encodeURIComponent(cur)}`);
  const j = await r.json();
  if (j.access_token) {
    if (env.IG_TOKEN) a.refreshed = j.access_token; else a.token = j.access_token;
    a.refreshed_at = Date.now();
    await env.BOT.put("auth", JSON.stringify(a));
    await log(env, { kind: "token-refreshed" });
  } else await log(env, { kind: "token-refresh-failed", err: safeErr(j) });
}

async function getCaption(env, auth, mediaId) {
  const cached = await env.BOT.get(`cap:${mediaId}`);
  if (cached !== null) return cached;
  const r = await ig(auth, `/${mediaId}?fields=caption`, "GET");
  const cap = r.ok ? r.data.caption || "" : "";
  await env.BOT.put(`cap:${mediaId}`, cap, { expirationTtl: 3600 });
  return cap;
}

async function ig(auth, path, method, body) {
  const res = await fetch((auth.host || GRAPH) + path, {
    method,
    headers: { Authorization: `Bearer ${auth.token}`, ...(body ? { "Content-Type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try { data = await res.json(); } catch { data = null; }
  if (!res.ok || (data && data.error)) return { ok: false, error: safeErr(data) || `HTTP ${res.status}` };
  return { ok: true, data };
}

function safeErr(j) {
  if (!j) return "";
  const e = j.error || j;
  return [e.code, e.error_subcode, e.message || e.error_message || e.error_type].filter(Boolean).join(" ").slice(0, 300);
}

function mask(u) {
  return u ? u.slice(0, 2) + "***" : "?";
}

async function log(env, item) {
  const raw = await env.BOT.get("log");
  const arr = raw ? JSON.parse(raw) : [];
  arr.unshift({ t: new Date().toISOString(), ...item });
  await env.BOT.put("log", JSON.stringify(arr.slice(0, 200)));
}

async function showLog(env) {
  const raw = (await env.BOT.get("log")) || "[]";
  return new Response(JSON.stringify(JSON.parse(raw).slice(0, 40), null, 1), { headers: { "Content-Type": "application/json" } });
}

async function health(env) {
  const auth = await getAuth(env);
  const status = auth ? { connected: auth.username } : { connected: false };
  status.emails = JSON.parse((await env.BOT.get("emails")) || "[]").length;
  return new Response(JSON.stringify({ bot: "the-exact-method comment-to-DM", ...status }), { headers: { "Content-Type": "application/json" } });
}

function page(msg) {
  const esc = msg.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  return new Response(`<!doctype html><meta name=viewport content="width=device-width"><body style="font:18px system-ui;max-width:560px;margin:60px auto;padding:0 20px">${esc}</body>`, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
