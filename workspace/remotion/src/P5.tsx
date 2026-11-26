// P-5 "2 AIs, 2 signatures" (PLAIN). Plan: workspace/reels/p5/visual_plan.md. Batch-2 test: frame 0 = real AI chat.
// Top: dark stage with exact rebuilds of the 26 Nov runs. Bottom: paper panel, headline/evidence slot left, Sage right,
// captions (max 3 words) from ElevenLabs forced alignment. All cue frames come from src/p5cues_<p>.json (make_cues.py).
// remocn ideas on our own layers: marker-highlight, scribble ring, squiggle, strikethrough-replace, impact-shake,
// rim-draw-card, press-warp-dive, slim-count, card-fan, whip-pan / zoom-blur camera moves.
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import TIG0 from './p5timing_ig.json';
import TTT0 from './p5timing_tt.json';
import MIG from './p5mouth_ig.json';
import MTT from './p5mouth_tt.json';
import CIG from './p5cues_ig.json';
import CTT from './p5cues_tt.json';
import {C, ClaudeAfter, ClaudeEmail, Fonts, GptChrome, GptEmail, RunTag, UI_FONT} from './p5ui';

const OUT = Easing.bezier(0.42, 0, 0.18, 1);
const IO = Easing.bezier(0.65, 0, 0.35, 1);
const r = (f: number, a: number, b: number, e = OUT) => interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const cl = (x: number) => Math.max(0, Math.min(1, x));

// ---------- timing / captions (V-3 system) ----------
type Wd = {w: string; s: number; e: number};
type Line = {start: number; end: number; text: string; words: Wd[]};
const clean = (T: any) => ({...T, lines: T.lines.map((l: Line) => ({...l, words: l.words.filter((w) => w.w.trim())}))});
const TIG = clean(TIG0), TTT = clean(TTT0);
type Chunk = {words: Wd[]; from: number};
const prep = (T: {lines: Line[]; total: number}) => {
  const CHUNKS: Chunk[] = [];
  T.lines.forEach((l) => {
    const segs: Wd[][] = [];
    let cur: Wd[] = [];
    l.words.forEach((w, i) => {
      cur.push(w);
      if (/[.:?,]["”]?$/.test(w.w) || i === l.words.length - 1) { segs.push(cur); cur = []; }
    });
    segs.forEach((seg) => {
      const k = Math.ceil(seg.length / 3);
      const base = Math.floor(seg.length / k), extra = seg.length % k;
      let at = 0;
      for (let c = 0; c < k; c++) {
        const n = base + (c < extra ? 1 : 0);
        const words = seg.slice(at, at + n);
        at += n;
        CHUNKS.push({words, from: words[0].s - 2});
      }
    });
  });
  CHUNKS[0].from = 0;
  return {CHUNKS, TOTAL: T.total};
};
const Z = {ig: prep(TIG), tt: prep(TTT)};
type ZT = ReturnType<typeof prep>;
type CU = typeof CIG;
const CUES = {ig: CIG as CU, tt: CTT as CU};
export const P5_TOTAL = {ig: Z.ig.TOTAL, tt: Z.tt.TOTAL};

const CAP_TOP = 1620;
const ChunkView: React.FC<{f: number; ch: Chunk; o: number; loopIn: boolean}> = ({f, ch, o, loopIn}) => {
  const hlA = (i: number) => {
    if (loopIn) return i === 0 ? 1 : 0;
    const s0 = ch.words[i].s;
    const next = i < ch.words.length - 1 ? ch.words[i + 1].s : 1e9;
    const first = i === 0 ? 1 : r(f, s0 - 3, s0 - 1);
    return (i === 0 && f < s0 ? 1 : first) * (1 - r(f, next - 3, next - 1));
  };
  const chars = ch.words.reduce((n, w) => n + w.w.length, 0) + ch.words.length - 1;
  const fs = Math.min(64, Math.floor(590 / (chars * 0.6)));
  return (
    <div style={{position: 'absolute', left: 62, top: CAP_TOP, width: 600, display: 'flex', flexWrap: 'nowrap', whiteSpace: 'nowrap', columnGap: 14, opacity: o}}>
      {ch.words.map((w, i) => (
        <span key={i} style={{position: 'relative', fontFamily: 'Archivo', fontWeight: 900, fontSize: fs, lineHeight: 1.12, letterSpacing: -1.5, color: C.ink, padding: '0 10px', margin: '0 -10px'}}>
          <span style={{position: 'absolute', inset: 0, borderRadius: 8, background: C.mint, opacity: hlA(i)}} />
          <span style={{position: 'relative'}}>{w.w}</span>
        </span>
      ))}
    </div>
  );
};
const Caption: React.FC<{f: number; z: ZT}> = ({f, z}) => {
  if (f >= z.TOTAL - 10) {
    const seamOut = r(f, z.TOTAL - 10, z.TOTAL - 6, IO), seamIn = r(f, z.TOTAL - 6, z.TOTAL - 2, IO);
    let cj = 0;
    for (let i = 0; i < z.CHUNKS.length; i++) if (f >= z.CHUNKS[i].from) cj = i;
    return (
      <>
        {seamOut < 1 && <ChunkView f={f} ch={z.CHUNKS[cj]} o={1 - seamOut} loopIn={false} />}
        {seamIn > 0 && <ChunkView f={f} ch={z.CHUNKS[0]} o={seamIn} loopIn />}
      </>
    );
  }
  let ci = 0;
  for (let i = 0; i < z.CHUNKS.length; i++) if (f >= z.CHUNKS[i].from) ci = i;
  const from = z.CHUNKS[ci].from;
  const xo = ci === 0 ? 1 : r(f, from - 2, from, IO);
  const xi = ci === 0 ? 1 : r(f, from, from + 3);
  return (
    <>
      {ci > 0 && xo < 1 && <ChunkView f={f} ch={z.CHUNKS[ci - 1]} o={1 - xo} loopIn={false} />}
      <div style={{transform: `translateY(${(1 - xi) * 10}px)`}}><ChunkView f={f} ch={z.CHUNKS[ci]} o={xi} loopIn={false} /></div>
    </>
  );
};

// ---------- Sage (N-8 rig, smaller, bottom-right of the paper panel) ----------
type Pose = 's-check' | 's-finger' | 's-present' | 's-shrug' | 's-sigh' | 's-think';
const MOUTHX: Record<Pose, number> = {'s-check': 169.0, 's-finger': 205.5, 's-present': 347.5, 's-shrug': 278.0, 's-sigh': 195.0, 's-think': 156.5};
const SPLIT = 1150;
const poseAt = (f: number, c: CU) => {
  const L = c.L;
  const POSES: [number, Pose][] = [
    [0, 's-present'], [L[1] - 3, 's-finger'], [L[2] - 3, 's-present'], [L[3] - 3, 's-shrug'], [L[4] - 3, 's-finger'],
    [L[5] - 3, 's-check'], [L[6] - 3, 's-finger'], [L[7] - 3, 's-sigh'], [L[8] - 3, 's-present'], [L[9] - 3, 's-shrug'],
    [L[10] - 3, 's-finger'], [L[11] - 3, 's-check'], [L[12] - 3, 's-present'], [L[13] - 3, 's-think'], [L[14] - 3, 's-check'],
    [L[15] - 3, 's-present'], [L[16] - 3, 's-sigh'], [L[17] - 3, 's-finger'], [L[18] - 3, 's-present'], [L[19] - 3, 's-finger'],
    [c.END - 2, 's-present'],
  ];
  let idx = 0;
  POSES.forEach(([t], i) => { if (f >= t) idx = i; });
  return {idx, t0: POSES[idx][0], p: POSES[idx][1]};
};
const Sage: React.FC<{f: number; c: CU; mouth: number[]}> = ({f, c, mouth}) => {
  const T = c.TOTAL, end = c.END;
  const {idx, t0, p} = poseAt(f, c);
  const d = f - t0;
  const pop = idx > 0 && d < 6 ? 0.035 * (1 - d / 6) : 0;
  const breathe = Math.sin((2 * Math.PI * f * 5) / T);
  const k = 0.66, H = 1121 * k;
  const left = 900 - MOUTHX[p] * k;
  const lv = f >= end ? (f >= T - 3 ? 2 : 0) : f < 2 ? 2 : mouth[f] ?? 0;
  const src = lv === 0 ? `sage/${p}.png` : lv === 1 ? `sage/${p}-mid.png` : `sage/${p}-open.png`;
  return (
    <div style={{position: 'absolute', left, top: SPLIT + 60 + breathe * 2, width: 600, height: H, transformOrigin: `${MOUTHX[p] * k}px ${H * 0.45}px`, transform: `scale(${1 + pop + breathe * 0.004})`}}>
      <Img src={staticFile(src)} style={{position: 'absolute', left: 0, top: 0, height: H}} />
    </div>
  );
};

// ---------- motion helpers ----------
type P = {x: number; y: number; s: number; o: number};
const mixP = (a: P, b: Partial<P>, t: number): P => ({x: lerp(a.x, b.x ?? a.x, t), y: lerp(a.y, b.y ?? a.y, t), s: lerp(a.s, b.s ?? a.s, t), o: lerp(a.o, b.o ?? a.o, t)});
const track = (f: number, start: P, keys: [number, number, Partial<P>][]) => {
  let cur = start;
  keys.forEach(([a, b, p]) => { cur = mixP(cur, {...cur, ...p}, r(f, a, b, IO)); });
  return cur;
};
const place = (p: P, blur = 0): React.CSSProperties => ({position: 'absolute', left: p.x, top: p.y, transformOrigin: '0 0', transform: `scale(${p.s})`, opacity: p.o, filter: blur > 0.3 ? `blur(${blur}px)` : undefined});
// motion blur only while a whip is running (peaks mid-move)
const whipBlur = (f: number, a: number, b: number, amt = 14) => (f > a && f < b ? amt * Math.sin(Math.PI * (f - a) / (b - a)) : 0);
const shake = (f: number, hits: [number, number][]) => {
  let tx = 0, ty = 0;
  hits.forEach(([t, amp]) => {
    const d = f - t;
    if (d < 0 || d > 16) return;
    const e = amp * Math.exp(-d / 3.5);
    tx += e * Math.sin(d * 2.4); ty += e * 0.7 * Math.cos(d * 3.1);
  });
  return {tx, ty};
};

const Mono: React.FC<{children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties}> = ({children, color = C.muted, size = 24, style}) => (
  <span style={{fontFamily: 'Plex', fontSize: size, color, letterSpacing: 1, ...style}}>{children}</span>
);
// evidence chip: lands with a short scale settle (no overshoot), outline colour = verdict
const Chip: React.FC<{f: number; at: number; col: string; fill?: boolean; children: React.ReactNode; style?: React.CSSProperties}> = ({f, at, col, fill, children, style}) => {
  const p = r(f, at - 2, at + 7);
  if (p <= 0) return null;
  return (
    <div style={{position: 'absolute', display: 'inline-flex', alignItems: 'center', gap: 10, padding: '6px 18px', borderRadius: 30, border: `4px solid ${col}`, background: fill ? col : C.paper,
      fontFamily: 'Archivo', fontWeight: 800, fontSize: 32, color: fill ? '#fff' : C.ink, whiteSpace: 'nowrap', opacity: Math.min(1, p * 2.5), transform: `translateY(${(1 - p) * 16}px) scale(${lerp(1.18, 1, p)})`, transformOrigin: 'left center', ...style}}>
      {children}
    </div>
  );
};
const Strike: React.FC<{p: number; color?: string; width?: number}> = ({p, color = C.red, width = 9}) => (
  <svg viewBox="0 0 100 10" preserveAspectRatio="none" style={{position: 'absolute', left: -8, top: '54%', width: 'calc(100% + 16px)', height: width, marginTop: -width / 2, overflow: 'visible'}}>
    <path d="M1 6 C 30 3, 70 8, 99 4" stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} opacity={p > 0.02 ? 1 : 0} />
  </svg>
);
// digit roll between two values (slim-count idea): the old number slides up, the new one rises in
const Roll: React.FC<{f: number; at: number; from: number; to: number; col?: string}> = ({f, at, from, to, col = C.ink}) => {
  const p = r(f, at, at + 12, IO);
  return (
    <span style={{display: 'inline-block', position: 'relative', height: '1.1em', width: '0.68em', overflow: 'hidden', verticalAlign: 'bottom'}}>
      <span style={{position: 'absolute', left: 0, top: `${-p * 1.1}em`}}>{from}</span>
      <span style={{position: 'absolute', left: 0, top: `${(1 - p) * 1.1}em`, color: col}}>{to}</span>
    </span>
  );
};
// instruction card that draws its own rim (rim-draw-card idea)
const RimCard: React.FC<{p: number; tool: string; text: string; saved: number}> = ({p, tool, text, saved}) => (
  <div style={{position: 'relative', width: 470, height: 520, background: '#171717', borderRadius: 26, padding: '26px 28px', boxSizing: 'border-box', opacity: Math.min(1, p * 2)}}>
    <svg width={470} height={520} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <rect x={2} y={2} width={466} height={516} rx={25} fill="none" stroke={C.mint} strokeWidth={4} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
    </svg>
    <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 40, color: '#fff'}}>{tool}</div>
    <Mono size={20} color={C.mint}>PLAIN VOICE LIST</Mono>
    <div style={{marginTop: 16, fontFamily: UI_FONT, fontSize: 21, lineHeight: 1.45, color: '#cfcfcf', height: 330, overflow: 'hidden'}}>{text}</div>
    <div style={{position: 'absolute', right: 22, bottom: 20, background: C.mint, color: C.ink, borderRadius: 20, padding: '6px 16px', fontFamily: 'Archivo', fontWeight: 900, fontSize: 26,
      opacity: saved, transform: `scale(${lerp(1.3, 1, saved)})`}}>Saved ✓</div>
  </div>
);

const GPT_LIST = 'FORMAT, the most important rule: write only plain paragraphs, like a message from a person. Never use lists of any kind (bullets, numbers, "1. Title"), headings, bold, tables, images or emoji, even when there are many tips or steps…';
const CL_LIST = 'FORMAT, the most important rule: write only plain paragraphs, like a message from a person. Never use lists of any kind (bullets, numbers, "1. Title"), headings, bold, tables, images or emoji, even when there are many tips or steps…';
const PROMPT = 'Write a short email to my customers announcing 20% off everything in my handmade soap shop this weekend.';

export const P5: React.FC<{platform: 'ig' | 'tt'}> = ({platform}) => {
  const f = useCurrentFrame();
  const c = CUES[platform];
  const z = Z[platform];
  const mouth = (platform === 'ig' ? MIG : MTT) as number[];
  const ig = platform === 'ig';
  const L = c.L;

  // ---------- stage poses ----------
  const F0: P = {x: 40, y: 316, s: 1, o: 1};
  const TWO_L: Partial<P> = {x: 4, y: 300, s: 0.56, o: 1}, TWO_R: Partial<P> = {x: 516, y: 330, s: 0.56, o: 1};
  const gpt = track(f, F0, [
    [c.side, c.side + 14, TWO_L],
    [c.gptZoom, c.gptZoom + 14, {x: 40, y: 180, s: 1}],
    [c.claudeZoom, c.claudeZoom + 10, {x: -1120}],
    [c.both, c.both + 14, TWO_L],
    [c.rule, c.rule + 10, {o: 0.28}],
    [c.slamOut, c.fix + 6, {o: 0, s: 0.42, x: 60, y: 330}],
    [c.loop, c.loop + 24, F0],
  ]);
  const gptBlur = whipBlur(f, c.claudeZoom, c.claudeZoom + 10) + whipBlur(f, c.both, c.both + 14, 8);
  const claude = track(f, {x: 1130, y: 330, s: 0.56, o: 1}, [
    [c.side + 4, c.side + 18, TWO_R],
    [c.gptZoom, c.gptZoom + 12, {x: 1130}],
    [c.claudeZoom, c.claudeZoom + 10, {x: 40, y: 150, s: 1}],
    [c.both, c.both + 14, TWO_R],
    [c.rule, c.rule + 10, {o: 0.28}],
    [c.slamOut, c.fix + 6, {o: 0, s: 0.42, x: 560, y: 330}],
  ]);
  const claudeBlur = whipBlur(f, c.side + 4, c.side + 18, 10) + whipBlur(f, c.claudeZoom, c.claudeZoom + 10);
  const chrome = cl(1 - r(f, c.side - 2, c.side + 8)) + r(f, c.loop + 8, c.loop + 24);

  // marks: frame 0 shows the ChatGPT tells already ringed; they un-draw at the two-up and redraw on their words
  const redo = (cue: number) => (f < c.side + 12 ? 1 - r(f, c.side, c.side + 10) : f >= c.loop ? r(f, c.loop + 10, c.loop + 24) : r(f, cue, cue + 8));
  const keep = (cue: number) => (f >= c.loop ? 1 - r(f, c.loop, c.loop + 10) : r(f, cue, cue + 9));
  const gm = {x1: redo(c.x[0]), x2: redo(c.x[1]), x3: redo(c.x[2]), x4: redo(c.x[3]), bold: redo(c.bold), dash: redo(c.dash), miss: keep(c.miss), perfect: keep(c.perfect)};
  const cm = {e1: r(f, c.emo[0], c.emo[0] + 8), e2: r(f, c.emo[1], c.emo[1] + 8), e3: r(f, c.emo[2], c.emo[2] + 8), list: r(f, c.list, c.list + 14), world: r(f, c.world, c.world + 10), perfect: r(f, c.perfect, c.perfect + 10)};

  // after cards
  const clA = track(f, {x: 40, y: 150, s: 0.86, o: 0}, [[c.claudeAfter, c.claudeAfter + 12, {s: 1, o: 1}], [c.gptAfter, c.gptAfter + 10, {x: -1120}]]);
  const clABlur = whipBlur(f, c.gptAfter, c.gptAfter + 10);
  const gA = track(f, {x: 1130, y: 160, s: 1, o: 1}, [[c.gptAfter, c.gptAfter + 12, {x: 40}], [c.cta, c.cta + 12, {o: 0.22, s: 0.9, x: 94, y: 200}], [c.loop, c.loop + 12, {o: 0}]]);
  const gABlur = whipBlur(f, c.gptAfter, c.gptAfter + 12);
  const amber = (cue: number) => r(f, cue, cue + 8);
  const gAm = {x1: amber(c.keptX[0]), x2: amber(c.keptX[1]), x3: amber(c.keptX[2]), x4: amber(c.keptX[3]), miss: amber(c.keptX[3] + 10), perfect: amber(c.keptX[3] + 16)};

  // rehook box + slam
  const boxIn = r(f, c.rule - 4, c.rule + 8) * (1 - r(f, c.listWord + 4, c.listWord + 12));
  const typed = Math.round(lerp(0, 19, r(f, c.rule + 4, c.typeEnd, Easing.linear)));
  const strikeP = r(f, c.strike, c.strike + 10);
  const swap = r(f, c.fix + 2, c.fix + 12, IO);
  const slamA = r(f, c.slam1 - 2, c.slam1 + 4) * (1 - r(f, c.slamOut, c.slamOut + 6));
  const slamB = r(f, c.slam2 - 2, c.slam2 + 4) * (1 - r(f, c.slamOut, c.slamOut + 6));
  const sh = shake(f, [[c.slam1, 18], [c.slam2, 22], [c.shouts, 6], [c.decor, 6]]);

  // instruction cards + settings
  const cardsP = r(f, c.listWord - 4, c.listWord + 16, Easing.linear);
  const cardsO = r(f, c.listWord - 4, c.listWord + 4) * (1 - r(f, c.req - 4, c.req + 4));
  const into = r(f, c.paste, c.settings + 4, IO);
  const saved = r(f, c.once - 2, c.once + 6);
  // same request, then dive through the send button (press-warp-dive idea)
  const reqO = r(f, c.req - 2, c.req + 6) * (1 - r(f, c.send + 2, c.send + 10));
  const reqTyped = Math.round(lerp(0, PROMPT.length, r(f, c.req - 2, c.send - 8, Easing.linear)));
  const dive = r(f, c.send, c.send + 12, Easing.in(Easing.cubic));
  // scan over the ChatGPT reply ("read it once")
  const scan = r(f, c.read + 6, c.scanEnd, IO);
  const scanO = r(f, c.read + 4, c.read + 10) * (1 - r(f, c.scanEnd, c.scanEnd + 8));
  // CTA
  const ctaIn = r(f, c.cta, c.cta + 12) * (1 - r(f, c.loop, c.loop + 10));
  const fanP = (k: number) => r(f, c.fan + k * 4, c.fan + k * 4 + 12, IO);

  // stage camera: slow drift + punches + hits
  const ph = (2 * Math.PI * f) / c.TOTAL;
  const punch = 1 + 0.06 * r(f, c.two - 4, c.sig + 20, IO) * (1 - r(f, c.side - 4, c.side + 8, IO)) + 0.05 * r(f, c.x[0] - 6, c.x[0] + 10, IO) * (1 - r(f, c.miss + 20, c.miss + 34, IO)) + 0.05 * r(f, c.emo[0] - 6, c.emo[0] + 10, IO) * (1 - r(f, c.world + 20, c.world + 34, IO));
  const camS = (1 + 0.01 * Math.sin(ph * 3)) * punch;
  const stageT = `translate(${sh.tx + 6 * Math.sin(ph * 2)}px, ${sh.ty + 4 * Math.sin(ph * 4)}px) scale(${camS})`;

  // ---------- bottom slot ----------
  const headO = cl(1 - r(f, c.side - 2, c.side + 8)) + r(f, c.loop + 8, c.loop + 20);
  const sameO = r(f, c.side + 4, c.side + 14) * (1 - r(f, c.gptZoom - 6, c.gptZoom + 2));
  const evO = r(f, c.gptZoom - 2, c.gptZoom + 8) * (1 - r(f, c.fix - 4, c.fix + 4));
  const fixO = r(f, c.fix + 2, c.fix + 12) * (1 - r(f, c.req - 6, c.req + 2));
  const reqSlot = r(f, c.req, c.req + 8) * (1 - r(f, c.claudeAfter - 4, c.claudeAfter + 4));
  const aftO = r(f, c.claudeAfter, c.claudeAfter + 8) * (1 - r(f, c.read - 6, c.read + 2));
  const readO = r(f, c.read, c.read + 10) * (1 - r(f, c.cta - 6, c.cta + 2));
  const ctaSlot = r(f, c.cta, c.cta + 10) * (1 - r(f, c.loop, c.loop + 8));
  const H1: React.CSSProperties = {position: 'absolute', left: 62, width: 600, fontFamily: 'Archivo', fontWeight: 900, letterSpacing: -2.5, color: C.ink, lineHeight: 0.98};

  return (
    <AbsoluteFill style={{background: C.black}}>
      <Fonts />
      <Audio src={staticFile(`p5v/mix_${platform}.wav`)} />

      {/* ================= STAGE ================= */}
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: SPLIT, overflow: 'hidden'}}>
        <div style={{position: 'absolute', inset: 0, transformOrigin: '540px 560px', transform: stageT}}>
          {/* ChatGPT chrome (frame 0 and the loop) */}
          {chrome > 0.01 && (
            <div style={{opacity: Math.min(1, chrome)}}>
              <div style={{position: 'absolute', left: 40, top: 54, right: 40, display: 'flex', alignItems: 'center', fontFamily: UI_FONT, color: C.gptText}}>
                <div style={{fontSize: 34, fontWeight: 600}}>ChatGPT</div>
                <div style={{marginLeft: 22, fontSize: 24, color: C.gptMuted, border: `2px solid ${C.gptRule}`, borderRadius: 24, padding: '6px 16px'}}>Temporary chat</div>
              </div>
              <div style={{position: 'absolute', left: 40, right: 40, top: 130, transform: `translateY(${(1 - Math.min(1, chrome)) * -30}px)`}}><GptChrome /></div>
              <div style={{position: 'absolute', left: 44, top: SPLIT - 52}}><RunTag text="REAL RUN · CHATGPT FREE · 26 NOV" /></div>
            </div>
          )}

          {/* tool labels for the two-up */}
          {(() => {
            const o = r(f, c.side + 6, c.side + 16) * (1 - r(f, c.gptZoom - 4, c.gptZoom + 4)) + r(f, c.both + 6, c.both + 16) * (1 - r(f, c.rule, c.rule + 8));
            if (o <= 0.01) return null;
            return (
              <>
                <div style={{position: 'absolute', left: 26, top: 214, opacity: o, fontFamily: UI_FONT, fontWeight: 700, fontSize: 40, color: '#fff'}}>ChatGPT</div>
                <div style={{position: 'absolute', left: 520, top: 214, opacity: o, fontFamily: UI_FONT, fontWeight: 700, fontSize: 40, color: '#fff'}}>Claude</div>
                <div style={{position: 'absolute', left: 26, top: 266, opacity: o}}><Mono size={18} color="#8a8a8a">REAL RUN · 26 NOV · DEFAULT</Mono></div>
                <div style={{position: 'absolute', left: 520, top: 266, opacity: o}}><Mono size={18} color="#8a8a8a">REAL RUN · 26 NOV · DEFAULT</Mono></div>
              </>
            );
          })()}

          {(() => {
            const og = r(f, c.gptZoom + 4, c.gptZoom + 14) * (1 - r(f, c.claudeZoom, c.claudeZoom + 6));
            const oc = r(f, c.claudeZoom + 4, c.claudeZoom + 14) * (1 - r(f, c.both, c.both + 6));
            return (
              <>
                {og > 0.01 && <div style={{position: 'absolute', left: 44, top: 74, opacity: og, display: 'flex', alignItems: 'baseline', gap: 20}}><span style={{fontFamily: UI_FONT, fontWeight: 700, fontSize: 52, color: '#fff'}}>ChatGPT</span><Mono size={22} color="#8a8a8a">DEFAULT · REAL RUN</Mono></div>}
                {oc > 0.01 && <div style={{position: 'absolute', left: 44, top: 50, opacity: oc, display: 'flex', alignItems: 'baseline', gap: 20}}><span style={{fontFamily: UI_FONT, fontWeight: 700, fontSize: 52, color: '#fff'}}>Claude</span><Mono size={22} color="#8a8a8a">DEFAULT · REAL RUN</Mono></div>}
              </>
            );
          })()}
          {gpt.o > 0.01 && gpt.x > -1100 && <div style={place(gpt, gptBlur)}><GptEmail m={gm} /></div>}
          {claude.o > 0.01 && claude.x < 1100 && <div style={place(claude, claudeBlur)}><ClaudeEmail m={cm} /></div>}

          {/* stamps under the two-up: one shouts, one decorates (impact-shake idea, light) */}
          {(() => {
            const out = 1 - r(f, c.gptZoom - 6, c.gptZoom + 2);
            const st = (at: number, x: number, text: string, rot: number) => {
              const p = r(f, at - 3, at + 3, Easing.out(Easing.cubic));
              if (p <= 0 || out <= 0) return null;
              return (
                <div style={{position: 'absolute', left: x, top: 930, opacity: Math.min(1, p * 3) * out, transform: `rotate(${rot}deg) scale(${lerp(1.6, 1, p)})`, transformOrigin: 'center',
                  fontFamily: 'Archivo', fontWeight: 900, fontSize: 76, color: C.red, border: `6px solid ${C.red}`, borderRadius: 16, padding: '2px 26px', background: '#0b0b0b'}}>{text}</div>
              );
            };
            return (<>{st(c.shouts, 70, 'Shouts.', -5)}{st(c.decor, 560, 'Decorates.', 4)}</>);
          })()}
          {/* both wrote the same phrase */}
          {(() => {
            const p = r(f, c.perfect + 6, c.perfect + 14) * (1 - r(f, c.rule, c.rule + 8));
            if (p <= 0) return null;
            return (
              <div style={{position: 'absolute', left: 0, right: 0, top: 960, display: 'flex', justifyContent: 'center', opacity: p, transform: `translateY(${(1 - p) * 20}px)`}}>
                <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 60, color: '#fff', background: C.red, borderRadius: 18, padding: '6px 30px'}}>Same phrase in both.</div>
              </div>
            );
          })()}

          {/* rehook: one generic rule, struck, replaced by one list per tool */}
          {boxIn > 0.01 && (
            <div style={{position: 'absolute', left: 60, top: 330, width: 960, height: 300, background: '#181818', border: '3px solid #444', borderRadius: 28, padding: '28px 36px', boxSizing: 'border-box',
              opacity: boxIn, transform: `translateY(${(1 - boxIn) * 30}px)`}}>
              <Mono size={22} color="#9b9b9b">CUSTOM INSTRUCTIONS</Mono>
              <div style={{position: 'relative', marginTop: 40, height: 110}}>
                <span style={{position: 'absolute', left: 0, top: 0, fontFamily: UI_FONT, fontSize: 74, fontWeight: 600, color: '#fff', opacity: 1 - swap, transform: `translateY(${-swap * 30}px)`}}>
                  <span style={{position: 'relative'}}>{'Write like a human.'.slice(0, typed)}<Strike p={strikeP} /></span>
                  {f < c.typeEnd && Math.floor(f / 8) % 2 === 0 && <span style={{color: C.mint}}>|</span>}
                </span>
                <span style={{position: 'absolute', left: 0, top: 0, fontFamily: UI_FONT, fontSize: 70, fontWeight: 700, color: C.mint, opacity: swap, transform: `translateY(${(1 - swap) * 30}px)`}}>1 short list per tool.</span>
              </div>
            </div>
          )}
          {slamA > 0.01 && (
            <div style={{position: 'absolute', left: 0, right: 0, top: 690, textAlign: 'center', fontFamily: 'Archivo', fontWeight: 900, fontSize: 150, letterSpacing: -5, lineHeight: 1}}>
              <div style={{color: '#fff', opacity: slamA, transform: `scale(${lerp(1.5, 1, r(f, c.slam1 - 2, c.slam1 + 4))})`}}>2 tools.</div>
              <div style={{color: C.red, opacity: slamB, transform: `scale(${lerp(1.5, 1, r(f, c.slam2 - 2, c.slam2 + 4))})`}}>2 mistakes.</div>
            </div>
          )}

          {/* one list per tool, pasted into its settings once */}
          {cardsO > 0.01 && (
            <div style={{opacity: cardsO}}>
              {[{x: 40, tool: 'ChatGPT', text: GPT_LIST, where: 'Personalization › Custom instructions'}, {x: 570, tool: 'Claude', text: CL_LIST, where: 'Project › Instructions'}].map((k, i) => {
                const pin = r(f, c.listWord - 4 + i * 5, c.listWord + 10 + i * 5);
                return (
                  <div key={k.tool}>
                    <div style={{position: 'absolute', left: k.x, top: 320, width: 470, height: 530, borderRadius: 26, border: '3px dashed #555', boxSizing: 'border-box', padding: '18px 20px', opacity: r(f, c.paste - 8, c.paste + 2)}}>
                      <Mono size={20} color="#9b9b9b">{k.tool.toUpperCase()} › {k.where.toUpperCase()}</Mono>
                    </div>
                    <div style={{position: 'absolute', left: k.x + lerp(0, 33, into), top: lerp(60, 388, into), transformOrigin: 'top left', transform: `scale(${lerp(1, 0.86, into) * lerp(0.92, 1, pin)})`, opacity: pin}}>
                      <RimCard p={cardsP} tool={k.tool} text={k.text} saved={saved} />
                    </div>
                  </div>
                );
              })}
              <div style={{position: 'absolute', left: 0, right: 0, top: 900, textAlign: 'center', opacity: r(f, c.paste, c.paste + 8)}}><Mono size={30} color={C.mint}>PASTED INTO SETTINGS · ONCE</Mono></div>
            </div>
          )}

          {/* same request again → send → dive */}
          {reqO > 0.01 && (
            <div style={{position: 'absolute', left: 40, top: 380, width: 1000, opacity: reqO, transformOrigin: '930px 200px', transform: `scale(${1 + dive * 2.4})`, filter: dive > 0.05 ? `blur(${dive * 18}px)` : undefined}}>
              <div style={{background: C.gptCard, borderRadius: 36, padding: '36px 130px 36px 40px', minHeight: 280, boxSizing: 'border-box', fontFamily: UI_FONT, fontSize: 46, lineHeight: 1.4, color: C.gptText, position: 'relative'}}>
                {PROMPT.slice(0, reqTyped)}
                <div style={{position: 'absolute', right: 22, bottom: 22, width: 76, height: 76, borderRadius: 38, background: f >= c.send - 2 ? C.mint : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transform: `scale(${1 - 0.15 * Math.sin(Math.PI * r(f, c.send - 3, c.send + 3))})`}}>
                  <svg viewBox="0 0 40 40" style={{width: 36, height: 36}}><path d="M20 32 V8 M10 18 L20 8 L30 18" stroke="#000" strokeWidth={4.5} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              </div>
              <div style={{marginTop: 18}}><Mono size={22} color="#9b9b9b">SAME PROMPT · LIST PASTED</Mono></div>
            </div>
          )}

          {/* after: Claude */}
          {clA.o > 0.01 && clA.x > -1100 && (
            <div style={place(clA, clABlur)}>
              <div style={{marginBottom: 26}}><RunTag text="REAL RUN · CLAUDE OPUS 5.5 · WITH THE LIST" /></div>
              <ClaudeAfter dates={r(f, c.dates, c.dates + 12)} />
            </div>
          )}
          {/* after: ChatGPT */}
          {gA.o > 0.01 && gA.x < 1100 && f >= c.gptAfter - 1 && (
            <div style={place(gA, gABlur)}>
              <div style={{marginBottom: 20}}><RunTag text="REAL RUN · CHATGPT FREE · WITH THE LIST" /></div>
              <div style={{position: 'relative'}}>
                <GptEmail after m={gAm} col={{x1: C.amber, x2: C.amber, x3: C.amber, x4: C.amber, miss: C.amber, perfect: C.amber}} />
                {scanO > 0.01 && (
                  <div style={{position: 'absolute', left: 0, right: 0, top: lerp(10, 760, scan), height: 6, background: C.mint, borderRadius: 3, opacity: scanO}} />
                )}
              </div>
            </div>
          )}

          {/* CTA: comment / DM → three lists fan out */}
          {ctaIn > 0.01 && (
            <div style={{position: 'absolute', inset: 0, opacity: ctaIn}}>
              <div style={{position: 'absolute', left: 90, top: 250, width: 900, height: 120, background: C.paper, borderRadius: 60, display: 'flex', alignItems: 'center', gap: 22, padding: '0 18px 0 26px', boxSizing: 'border-box', transform: `translateY(${(1 - ctaIn) * 40}px)`}}>
                <div style={{width: 72, height: 72, borderRadius: 36, background: C.mint, flex: 'none'}} />
                <div style={{position: 'relative', flex: 1, height: 64}}>
                  <span style={{position: 'absolute', left: 0, top: 8, fontFamily: 'Archivo', fontWeight: 600, fontSize: 38, color: C.muted, opacity: 1 - r(f, c.kw - 4, c.kw)}}>{ig ? 'Add a comment…' : 'Message…'}</span>
                  <span style={{position: 'absolute', left: 0, top: 0, fontFamily: 'Archivo', fontWeight: 900, fontSize: 54, color: C.ink, opacity: r(f, c.kw - 3, c.kw + 3), transform: `scale(${lerp(1.2, 1, r(f, c.kw - 3, c.kw + 5))})`, transformOrigin: 'left center'}}>PLAIN</span>
                </div>
                <div style={{width: 86, height: 86, borderRadius: 43, flex: 'none', background: f >= c.sendC - 1 ? C.mint : '#d6d1c4', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 - 0.12 * Math.sin(Math.PI * r(f, c.sendC - 2, c.sendC + 6))})`}}>
                  <svg viewBox="0 0 40 40" style={{width: 40, height: 40}}><path d="M6 20 H32 M22 10 L32 20 L22 30" stroke={C.ink} strokeWidth={4.5} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              </div>
              {['ChatGPT', 'Claude', 'Gemini'].map((t, k) => {
                const p = fanP(k);
                const rot = [-9, 0, 9][k] * p, dx = [-300, 0, 300][k] * p;
                return (
                  <div key={t} style={{position: 'absolute', left: 540 - 170 + dx, top: 470 + Math.abs(k - 1) * 40 * p, width: 340, height: 460, background: '#171717', border: `4px solid ${C.mint}`, borderRadius: 26, padding: 26, boxSizing: 'border-box',
                    transform: `rotate(${rot}deg) translateY(${(1 - p) * 60}px)`, opacity: Math.min(1, p * 2.5)}}>
                    <Mono size={18} color={C.mint}>PLAIN VOICE LIST</Mono>
                    <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 48, color: '#fff', marginTop: 8}}>{t}</div>
                    {[0, 1, 2, 3, 4, 5, 6].map((i) => <div key={i} style={{height: 12, marginTop: i ? 16 : 30, width: `${[92, 80, 88, 70, 95, 60, 84][i]}%`, borderRadius: 6, background: '#3a3a3a'}} />)}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ================= PAPER PANEL ================= */}
      <div style={{position: 'absolute', left: 0, right: 0, top: SPLIT, bottom: 0, background: C.paper}} />

      {/* hook headline (frame 0 and loop) */}
      {headO > 0.01 && (
        <div style={{opacity: Math.min(1, headO), transform: `translateY(${(1 - Math.min(1, headO)) * -20}px)`}}>
          <div style={{...H1, top: SPLIT + 44, width: 660, fontSize: 92}}>Lose sales with your AI email?</div>
          <div style={{position: 'absolute', left: 62, top: SPLIT + 345, display: 'flex', alignItems: 'center', gap: 14}}>
            <div style={{background: C.ink, color: C.paper, fontFamily: 'Archivo', fontWeight: 800, fontSize: 40, borderRadius: 40, padding: '10px 26px', transform: `scale(${1 + 0.12 * Math.sin(Math.PI * r(f, c.two - 2, c.two + 8))})`}}>2 AIs.</div>
            <div style={{background: C.red, color: '#fff', fontFamily: 'Archivo', fontWeight: 800, fontSize: 40, borderRadius: 40, padding: '10px 26px', transform: `scale(${1 + 0.14 * Math.sin(Math.PI * r(f, c.sig - 2, c.sig + 8))})`}}>2 signatures.</div>
          </div>
        </div>
      )}
      {sameO > 0.01 && (
        <div style={{opacity: sameO, transform: `translateY(${(1 - sameO) * 24}px)`}}>
          <div style={{...H1, top: SPLIT + 60, fontSize: 86, whiteSpace: 'nowrap'}}>Same email.</div>
          <div style={{...H1, top: SPLIT + 160, fontSize: 86, whiteSpace: 'nowrap', color: C.red}}>2 signatures.</div>
          <div style={{position: 'absolute', left: 62, top: SPLIT + 280}}><Mono size={22}>SAME PROMPT · 26 NOV · DEFAULT</Mono></div>
        </div>
      )}
      {/* evidence columns: every tell lands as a chip on its word */}
      {evO > 0.01 && (
        <div style={{position: 'absolute', inset: 0, opacity: evO}}>
          <div style={{position: 'absolute', left: 62, top: SPLIT + 40}}><Mono size={26} color={C.ink}>CHATGPT</Mono></div>
          <div style={{position: 'absolute', left: 350, top: SPLIT + 40}}><Mono size={26} color={C.ink} style={{opacity: r(f, c.claudeZoom, c.claudeZoom + 8)}}>CLAUDE</Mono></div>
          <Chip f={f} at={c.x[0]} col={C.red} style={{left: 62, top: SPLIT + 92}}>! ! ! !</Chip>
          <Chip f={f} at={c.bold} col={C.red} style={{left: 62, top: SPLIT + 168}}><b>Bold</b></Chip>
          <Chip f={f} at={c.dash} col={C.red} style={{left: 62, top: SPLIT + 244}}>— dash</Chip>
          <Chip f={f} at={c.miss} col={C.red} style={{left: 62, top: SPLIT + 320}}>“Don’t miss out”</Chip>
          <Chip f={f} at={c.emo[0]} col={C.red} style={{left: 350, top: SPLIT + 92, fontFamily: "Archivo, 'Noto Color Emoji'"}}>🧼 🗓 💸</Chip>
          <Chip f={f} at={c.list} col={C.red} style={{left: 350, top: SPLIT + 168}}>List of 3</Chip>
          <Chip f={f} at={c.world} col={C.red} style={{left: 350, top: SPLIT + 244}}>“Means the world”</Chip>
          <Chip f={f} at={c.perfect + 4} col={C.red} fill style={{left: 62, top: SPLIT + 400}}>Both: “the perfect time”</Chip>
        </div>
      )}
      {fixO > 0.01 && (
        <div style={{opacity: fixO, transform: `translateY(${(1 - fixO) * 24}px)`}}>
          <div style={{...H1, top: SPLIT + 60, fontSize: 104}}>1 list</div>
          <div style={{...H1, top: SPLIT + 170, fontSize: 104}}>per tool.</div>
          <Chip f={f} at={c.once} col={C.mint} fill style={{left: 62, top: SPLIT + 320, background: C.mint, borderColor: C.mint, color: C.ink}}>Pasted once ✓</Chip>
        </div>
      )}
      {reqSlot > 0.01 && (
        <div style={{opacity: reqSlot, transform: `translateY(${(1 - reqSlot) * 24}px)`}}>
          <div style={{...H1, top: SPLIT + 60, fontSize: 104}}>Same</div>
          <div style={{...H1, top: SPLIT + 170, fontSize: 104}}>request.</div>
        </div>
      )}
      {aftO > 0.01 && (
        <div style={{position: 'absolute', inset: 0, opacity: aftO}}>
          <div style={{position: 'absolute', left: 62, top: SPLIT + 40}}><Mono size={26} color={C.ink}>CLAUDE · WITH LIST</Mono></div>
          <Chip f={f} at={c.cnt[0]} col={C.mint} style={{left: 62, top: SPLIT + 92}}>Emoji <Roll f={f} at={c.cnt[0]} from={3} to={0} /></Chip>
          <Chip f={f} at={c.cnt[1]} col={C.mint} style={{left: 62, top: SPLIT + 168}}>“Perfect time” <Roll f={f} at={c.cnt[1]} from={1} to={0} /></Chip>
          <Chip f={f} at={c.dates} col={C.mint} fill style={{left: 62, top: SPLIT + 244, color: C.ink}}>Real dates ✓</Chip>
          <div style={{position: 'absolute', left: 62, top: SPLIT + 312, opacity: r(f, c.gptAfter, c.gptAfter + 8)}}><Mono size={26} color={C.ink}>CHATGPT · WITH LIST</Mono></div>
          <Chip f={f} at={c.goneBold} col={C.mint} style={{left: 62, top: SPLIT + 360}}><span style={{position: 'relative'}}><b>Bold</b><Strike p={r(f, c.gone - 4, c.gone + 6)} color={C.mint} width={7} /></span></Chip>
          <Chip f={f} at={c.goneDash} col={C.mint} style={{left: 212, top: SPLIT + 360}}><span style={{position: 'relative'}}>Dash<Strike p={r(f, c.gone, c.gone + 10)} color={C.mint} width={7} /></span></Chip>
          <Chip f={f} at={c.keptX[0]} col={C.amber} fill style={{left: 366, top: SPLIT + 360, color: C.ink}}>! ! ! ! kept</Chip>
        </div>
      )}
      {readO > 0.01 && (
        <div style={{opacity: readO, transform: `translateY(${(1 - readO) * 24}px)`}}>
          <div style={{...H1, top: SPLIT + 60, fontSize: 96}}>Read it once</div>
          <div style={{...H1, top: SPLIT + 165, fontSize: 96}}>before you</div>
          <div style={{...H1, top: SPLIT + 270, fontSize: 96}}><span style={{background: C.mint, borderRadius: 12, padding: '0 14px', margin: '0 -14px'}}>send.</span></div>
        </div>
      )}
      {ctaSlot > 0.01 && (
        <div style={{opacity: ctaSlot, transform: `translateY(${(1 - ctaSlot) * 24}px)`}}>
          <div style={{...H1, top: SPLIT + 60, fontSize: ig ? 104 : 96}}>{ig ? 'Comment' : 'DM me'}</div>
          <div style={{...H1, top: SPLIT + 170, fontSize: 116}}><span style={{background: C.mint, borderRadius: 14, padding: '0 16px', margin: '0 -16px'}}>PLAIN</span></div>
          <div style={{position: 'absolute', left: 62, top: SPLIT + 320}}><Mono size={26} color={C.ink}>ALL 3 LISTS · FREE</Mono></div>
        </div>
      )}

      <Sage f={f} c={c} mouth={mouth} />
      <Caption f={f} z={z} />
    </AbsoluteFill>
  );
};


