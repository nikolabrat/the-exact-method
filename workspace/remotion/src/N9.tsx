// N-9 "6 places vs 1" (NARROW). Script workspace/reels/n9/script_spoken.txt, runs in workspace/reels/n9/runs.
// Same rig as P-5: dark ChatGPT stage on top (exact rebuilds of the 27 Nov runs), paper panel with slot + Sage below,
// captions from ElevenLabs forced alignment, all cues from src/n9cues_<p>.json (make_cues.py).
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import TIG0 from './n9timing_ig.json';
import TTT0 from './n9timing_tt.json';
import MIG from './n9mouth_ig.json';
import MTT from './n9mouth_tt.json';
import CIG from './n9cues_ig.json';
import CTT from './n9cues_tt.json';
import {C, Fonts, GptChrome, Mark, Ring, RunTag, UI_FONT} from './p5ui';

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
export const N9_TOTAL = {ig: Z.ig.TOTAL, tt: Z.tt.TOTAL};

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
    [0, 's-present'], [L[1] - 3, 's-finger'], [L[2] - 3, 's-present'], [L[3] - 3, 's-check'], [L[4] - 3, 's-finger'],
    [L[5] - 3, 's-present'], [L[6] - 3, 's-check'], [L[7] - 3, 's-think'], [L[8] - 3, 's-shrug'], [L[9] - 3, 's-sigh'],
    [L[10] - 3, 's-finger'], [L[11] - 3, 's-present'], [L[12] - 3, 's-check'], [L[13] - 3, 's-think'], [L[14] - 3, 's-present'],
    [L[15] - 3, 's-finger'], [L[16] - 3, 's-check'], [L[17] - 3, 's-shrug'], [L[18] - 3, 's-present'], [L[19] - 3, 's-check'],
    [L[20] - 3, 's-finger'], [L[21] - 3, 's-present'], [L[22] - 3, 's-finger'],
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
  <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: Math.round(size * 1.5), lineHeight: 1.1, color, ...style}}>{children}</span>
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


// ---------- N-9 pieces (text verbatim from workspace/reels/n9/runs) ----------
const PROMPT0 = 'How do I get the first 100 visitors to a cake pricing calculator I built for home bakers?';
const P1 = 'Research realistic ways to get the first 100 visitors to a cake pricing calculator I built for home bakers. Give me a shortlist, with a short explanation of each.';
const P2a = 'Research each of these in more depth, and tell me which two or three are the most realistic for someone with ';
const P2k = ['about an hour a day', 'no budget for ads', 'zero followers anywhere'];
const P3 = 'Of these, which one specifically should I start with, and why, based on everything you just found?';
const ROWS: [string, number][] = [['Facebook baking groups', 35], ['Pinterest', 20], ['Reddit communities', 15], ['Instagram / TikTok', 15], ['Direct outreach', 10], ['Other / referrals', 5]];

// the one-line answer's chart card ("100 visitors · A target distribution, not a guaranteed forecast")
const ChartCard: React.FC<{grow: number; hi: number[]; ring: number; dim?: number}> = ({grow, hi, ring}) => (
  <div style={{width: 1000, height: 1040, boxSizing: 'border-box', fontFamily: UI_FONT, color: C.gptText, position: 'relative'}}>
    <div style={{fontSize: 40, fontWeight: 700, color: '#fff', marginBottom: 26}}>The first 100 visitors: a practical plan</div>
    <div style={{border: '2px solid #3a3a3a', borderRadius: 30, padding: '34px 40px', background: '#0d0d0d'}}>
      <div style={{fontSize: 64, fontWeight: 700, color: '#3fbf6e'}}>100 visitors</div>
      <div style={{position: 'relative', display: 'inline-block', fontSize: 28, color: '#9b9b9b', margin: '6px 0 30px'}}>
        A target distribution, not a guaranteed forecast
        {ring > 0.01 && (
          <svg viewBox="0 0 100 20" preserveAspectRatio="none" style={{position: 'absolute', left: -24, top: -18, width: 'calc(100% + 48px)', height: 'calc(100% + 36px)', overflow: 'visible'}}>
            <ellipse cx={50} cy={10} rx={49} ry={9.4} fill="none" stroke={C.red} strokeWidth={0.9} vectorEffect="non-scaling-stroke" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ring} style={{strokeWidth: 6}} />
          </svg>
        )}
      </div>
      {ROWS.map(([name, n], i) => (
        <div key={name} style={{marginBottom: 40}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 38, fontWeight: 600, color: hi[i] > 0.5 ? '#fff' : C.gptText}}>
            <span>{name}</span><span style={{fontVariantNumeric: 'tabular-nums'}}>{n}</span>
          </div>
          <div style={{height: 20, borderRadius: 10, background: '#262626', marginTop: 12, overflow: 'hidden'}}>
            <div style={{height: '100%', width: `${(n / 35) * 100 * grow}%`, borderRadius: 7, background: hi[i] > 0.01 ? C.red : '#3fbf6e', opacity: 0.55 + 0.45 * Math.max(hi[i], 0)}} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// the 3-step final answer (verbatim top of the reply)
const AnswerCard: React.FC<{blur: number; nots: number[]; bullet1: number}> = ({blur, nots, bullet1}) => (
  <div style={{width: 1000, height: 1040, boxSizing: 'border-box', fontFamily: UI_FONT, color: C.gptText}}>
    <div style={{fontSize: 46, fontWeight: 700, color: '#fff', lineHeight: 1.3}}>
      Start with <span style={{filter: blur > 0.02 ? `blur(${blur * 16}px)` : undefined, background: blur > 0.02 ? `rgba(255,255,255,${0.12 * blur})` : undefined, borderRadius: 10}}>Facebook groups</span>. Specifically, home bakery business groups.
    </div>
    <div style={{fontSize: 40, marginTop: 28, display: 'flex', gap: 22, flexWrap: 'wrap'}}>
      {['Not Instagram.', 'Not Reddit.', 'Not TikTok.'].map((t, i) => (
        <span key={t} style={{color: nots[i] > 0.5 ? C.red : C.gptText, fontWeight: nots[i] > 0.5 ? 800 : 400, transform: `scale(${1 + 0.12 * Math.sin(Math.PI * cl(nots[i]))})`, display: 'inline-block'}}>{t}</span>
      ))}
    </div>
    <div style={{fontSize: 36, marginTop: 34}}>Here's why I would make this your first move:</div>
    <ol style={{fontSize: 36, lineHeight: 1.45, paddingLeft: 48, marginTop: 18}}>
      <li style={{marginBottom: 14}}>{bullet1 > 0 ? <Mark p={bullet1} col={C.mint}><b style={{color: '#fff'}}>You don't need an audience.</b></Mark> : <b style={{color: '#fff'}}>You don't need an audience.</b>} You're entering communities where potential users already gather.</li>
      <li style={{marginBottom: 14}}><b style={{color: '#fff'}}>Your product solves a recurring problem.</b> Home bakers need to calculate prices whenever they create or sell cakes.</li>
      <li><b style={{color: '#fff'}}>You can reach people without spending money.</b> You contribute to existing discussions instead of paying to get attention.</li>
    </ol>
  </div>
);

const METHODS: {t: string; tag: string; keep: boolean}[] = [
  {t: 'Facebook groups', tag: '', keep: true}, {t: 'Reddit', tag: '', keep: true}, {t: 'Instagram Reels', tag: 'Later', keep: false},
  {t: 'TikTok', tag: 'Later', keep: false}, {t: 'Pinterest', tag: 'Secondary', keep: false}, {t: 'Direct outreach', tag: '', keep: true},
  {t: 'Small influencers', tag: 'Later', keep: false}, {t: 'SEO article', tag: 'Long-term', keep: false},
];
// where the 3 kept cards end up (step 2) and their step-2 names
const KEEP_POS: Record<number, {x: number; name: string; cue: 'fb' | 'ig' | 'rd'}> = {0: {x: 40, name: 'Facebook groups', cue: 'fb'}, 5: {x: 380, name: 'Instagram outreach', cue: 'ig'}, 1: {x: 720, name: 'Reddit', cue: 'rd'}};

const Bubble: React.FC<{text: React.ReactNode; o: number; y?: number; dy?: number}> = ({text, o, y = 70, dy = 0}) => (
  <div style={{position: 'absolute', left: 40, right: 40, top: y, display: 'flex', justifyContent: 'flex-end', opacity: o, transform: `translateY(${dy}px)`}}>
    <div style={{maxWidth: 900, background: C.gptBubble, borderRadius: 30, padding: '22px 30px', fontFamily: UI_FONT, fontSize: 31, lineHeight: 1.4, color: C.gptText}}>
      <span style={{display: 'inline-flex', alignItems: 'center', gap: 8, color: '#6fa8ff', fontSize: 26, marginRight: 10}}>◍ Web search</span>{text}
    </div>
  </div>
);
const Tile: React.FC<{name: string; tag?: string; style: React.CSSProperties; hi?: number; strike?: number}> = ({name, tag, style, hi = 0, strike = 0}) => (
  <div style={{position: 'absolute', width: 320, height: 150, borderRadius: 24, background: '#171717', border: `4px solid ${hi > 0.5 ? C.mint : '#3a3a3a'}`, boxSizing: 'border-box', padding: '22px 24px', ...style}}>
    <div style={{position: 'relative', display: 'inline-block', fontFamily: 'Archivo', fontWeight: 800, fontSize: 36, color: '#fff', lineHeight: 1.1}}>{name}<Strike p={strike} width={8} /></div>
    {tag ? <div style={{marginTop: 12}}><Mono size={20} color={C.amber}>{tag}</Mono></div> : null}
  </div>
);

export const N9: React.FC<{platform: 'ig' | 'tt'}> = ({platform}) => {
  const f = useCurrentFrame();
  const c = CUES[platform];
  const z = Z[platform];
  const mouth = (platform === 'ig' ? MIG : MTT) as number[];
  const ig = platform === 'ig';

  // ----- stage poses -----
  const F0L: P = {x: 20, y: 330, s: 0.5, o: 1}, F0R: P = {x: 560, y: 330, s: 0.5, o: 1};
  const left = track(f, F0L, [
    [c.calc - 2, c.calc + 10, {o: 0.22, y: 300}],
    [c.twice, c.twice + 10, {o: 1, y: 330}],
    [c.ans1, c.ans1 + 14, {x: 40, y: 80, s: 1}],
    [c.hour - 2, c.hour + 8, {o: 0}],
    [c.steps3, c.steps3 + 10, {x: -1100, o: 0}],
    [c.loop, c.loop + 22, F0L],
  ]);
  const leftBlur = whipBlur(f, c.steps3, c.steps3 + 10);
  const right = track(f, F0R, [
    [c.calc - 2, c.calc + 10, {o: 0.22, y: 300}],
    [c.twice, c.twice + 10, {o: 1, y: 330}],
    [c.ans1, c.ans1 + 10, {x: 1130}],
    [c.p3end - 6, c.start - 4, {x: 40, y: 290, s: 1, o: 1}],
    [c.d1 - 6, c.d1 + 8, {y: -1200}],
    [c.loop, c.loop + 1, {x: 1130, y: 330, s: 0.5}],
    [c.loop + 2, c.loop + 22, F0R],
  ]);
  const rightBlur = whipBlur(f, c.ans1, c.ans1 + 10) + whipBlur(f, c.p3end - 6, c.start - 4, 8);
  const chrome = cl(1 - r(f, c.calc - 4, c.calc + 6)) + r(f, c.loop + 8, c.loop + 24);
  const bigNums = (cl(1 - r(f, c.calc - 4, c.calc + 4)) + r(f, c.twice + 4, c.twice + 12) * (1 - r(f, c.ans1 - 4, c.ans1 + 4))) + r(f, c.loop + 12, c.loop + 26);

  // chart state
  const grow = f < c.calc ? 1 : f < c.ans1 + 10 ? 1 : f >= c.loop ? 1 : r(f, c.ans1 + 8, c.fb35 + 6);
  const hi = [r(f, c.fb35, c.fb35 + 6), r(f, c.pin20, c.pin20 + 6), r(f, c.red15, c.red15 + 6), 0, 0, 0].map((v) => (f >= c.loop ? 0 : v));
  const ringP = f >= c.loop ? 0 : r(f, c.small, c.notG + 8);
  // answer card state
  const blur = f < c.start - 2 || f >= c.loop + 2 ? 1 : 1 - r(f, c.start - 2, c.start + 8);
  const nots = [r(f, c.notIG, c.notIG + 6), r(f, c.notRD, c.notRD + 6), r(f, c.notTT, c.notTT + 6)].map((v) => (f >= c.loop ? 0 : v));
  const bullet1 = f >= c.loop ? 0 : r(f, c.followers, c.followers + 12);

  // calculator card
  const calcO = r(f, c.calc - 2, c.calc + 8) * (1 - r(f, c.twice - 4, c.twice + 4));
  const askedP = r(f, c.asked - 2, c.asked + 6);
  // tags over the two-up
  const tagO = r(f, c.oneLine - 2, c.oneLine + 6) * (1 - r(f, c.ans1 - 4, c.ans1 + 2));
  const tagO2 = r(f, c.threeSteps - 2, c.threeSteps + 6) * (1 - r(f, c.ans1 - 4, c.ans1 + 2));
  // guess stamp + hour vs 6
  const guessP = r(f, c.guess - 2, c.guess + 4, Easing.out(Easing.cubic)) * (1 - r(f, c.hour - 4, c.hour + 2));
  const hourO = r(f, c.hour - 2, c.hour + 8) * (1 - r(f, c.steps3 - 2, c.steps3 + 6));
  const sixX = r(f, c.cant6, c.cant6 + 10);
  // steps tracker on stage
  const stepsO = r(f, c.steps3, c.steps3 + 10) * (1 - r(f, c.p1 - 2, c.p1 + 6));
  // step bubbles
  const b1 = r(f, c.p1, c.p1 + 8) * (1 - r(f, c.p2 - 4, c.p2 + 2));
  const t1 = Math.round(lerp(0, P1.length, r(f, c.p1 + 2, c.p1end, Easing.linear)));
  const b2 = r(f, c.p2, c.p2 + 8) * (1 - r(f, c.p3 - 4, c.p3 + 2));
  const b3 = r(f, c.p3, c.p3 + 8) * (1 - r(f, c.start - 6, c.start + 2));
  const t3 = Math.round(lerp(0, P3.length, r(f, c.p3 + 2, c.p3end, Easing.linear)));
  // method tiles
  const tilesO = r(f, c.found8 - 4, c.found8 + 4) * (1 - r(f, c.p3end - 6, c.start - 2));
  const keepMove = r(f, c.left3 - 2, c.left3 + 14, IO);
  const sh = shake(f, [[c.guess, 10], [c.notIG, 5], [c.notRD, 5], [c.notTT, 5]]);
  // days + goal
  const daysO = r(f, c.d1 - 2, c.d1 + 8) * (1 - r(f, c.cta - 4, c.cta + 4));
  const goalP = r(f, c.ten - 6, c.ten + 14, IO);
  // CTA
  const ctaIn = r(f, c.cta, c.cta + 12) * (1 - r(f, c.loop, c.loop + 10));
  const fanP = (k: number) => r(f, c.fan + k * 4, c.fan + k * 4 + 12, IO);

  const ph = (2 * Math.PI * f) / c.TOTAL;
  const punch = 1 + 0.05 * r(f, c.six - 3, c.six + 8, IO) * (1 - r(f, c.calc - 6, c.calc + 4, IO)) + 0.04 * r(f, c.fb35 - 4, c.fb35 + 10, IO) * (1 - r(f, c.small + 10, c.small + 24, IO));
  const stageT = `translate(${sh.tx + 6 * Math.sin(ph * 2)}px, ${sh.ty + 4 * Math.sin(ph * 4)}px) scale(${(1 + 0.01 * Math.sin(ph * 3)) * punch})`;

  // ----- bottom slot -----
  const headO = cl(1 - r(f, c.calc - 4, c.calc + 6)) + r(f, c.loop + 8, c.loop + 20);
  const s1 = r(f, c.calc + 2, c.calc + 12) * (1 - r(f, c.ans1 - 6, c.ans1 + 2));
  const s2 = r(f, c.ans1, c.ans1 + 8) * (1 - r(f, c.hour - 6, c.hour + 2));
  const s3 = r(f, c.hour, c.hour + 8) * (1 - r(f, c.steps3 - 4, c.steps3 + 4));
  const s4 = r(f, c.steps3, c.steps3 + 8) * (1 - r(f, c.start - 6, c.start + 2));
  const s5 = r(f, c.start, c.start + 8) * (1 - r(f, c.d1 - 6, c.d1 + 2));
  const s6 = r(f, c.d1, c.d1 + 8) * (1 - r(f, c.cta - 6, c.cta + 2));
  const s7 = r(f, c.cta, c.cta + 10) * (1 - r(f, c.loop, c.loop + 8));
  const H1: React.CSSProperties = {position: 'absolute', left: 62, width: 610, fontFamily: 'Archivo', fontWeight: 900, letterSpacing: -2.5, color: C.ink, lineHeight: 0.98};
  const stepN = f < c.p2 - 4 ? 1 : f < c.p3 - 4 ? 2 : 3;
  const countTxt = f < c.found8 ? '' : f < c.left3 ? '8' : f < c.start ? '3' : '1';

  return (
    <AbsoluteFill style={{background: C.black}}>
      <Fonts />
      <Audio src={staticFile(`n9v/mix_${platform}.wav`)} />

      {/* ================= STAGE ================= */}
      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: SPLIT, overflow: 'hidden'}}>
        <div style={{position: 'absolute', inset: 0, transformOrigin: '540px 560px', transform: stageT}}>
          {chrome > 0.01 && (
            <div style={{opacity: Math.min(1, chrome)}}>
              <div style={{position: 'absolute', left: 40, top: 54, right: 40, display: 'flex', alignItems: 'center', fontFamily: UI_FONT, color: C.gptText}}>
                <div style={{fontSize: 34, fontWeight: 600}}>ChatGPT</div>
                <div style={{marginLeft: 22, fontSize: 24, color: C.gptMuted, border: `2px solid ${C.gptRule}`, borderRadius: 24, padding: '6px 16px'}}>Temporary chat</div>
              </div>
              <div style={{position: 'absolute', left: 40, right: 40, top: 128}}><GptChrome prompt={PROMPT0} /></div>
              <div style={{position: 'absolute', left: 24, top: 290}}><Mono size={20} color="#8a8a8a">1-line ask · real run</Mono></div>
              <div style={{position: 'absolute', left: 564, top: 290}}><Mono size={20} color="#8a8a8a">3 steps · real run</Mono></div>
            </div>
          )}
          {/* the two answers */}
          {left.o > 0.01 && left.x > -1100 && <div style={place(left, leftBlur)}><ChartCard grow={grow} hi={hi} ring={ringP} /></div>}
          {right.o > 0.01 && right.x < 1100 && right.y > -1150 && <div style={place(right, rightBlur)}><AnswerCard blur={blur} nots={nots} bullet1={bullet1} /></div>}
          {/* big numbers under each answer */}
          {bigNums > 0.01 && (
            <>
              <div style={{position: 'absolute', left: 20, width: 500, top: 860, textAlign: 'center', opacity: Math.min(1, bigNums), fontFamily: 'Archivo', fontWeight: 900, fontSize: 200, lineHeight: 1, color: C.red,
                transform: `scale(${1 + 0.12 * Math.sin(Math.PI * r(f, c.six - 2, c.six + 8))})`}}>6<span style={{fontSize: 44, marginLeft: 14, verticalAlign: 'middle'}}>places</span></div>
              <div style={{position: 'absolute', left: 560, width: 500, top: 860, textAlign: 'center', opacity: Math.min(1, bigNums), fontFamily: 'Archivo', fontWeight: 900, fontSize: 200, lineHeight: 1, color: C.mint,
                transform: `scale(${1 + 0.12 * Math.sin(Math.PI * r(f, c.need1 - 2, c.need1 + 8))})`}}>1<span style={{fontSize: 44, marginLeft: 14, verticalAlign: 'middle'}}>place</span></div>
            </>
          )}
          {tagO > 0.01 && <div style={{position: 'absolute', left: 120, top: 240, opacity: tagO, background: C.red, color: '#fff', fontFamily: 'Archivo', fontWeight: 900, fontSize: 44, borderRadius: 18, padding: '4px 24px', transform: `scale(${lerp(1.3, 1, tagO)})`}}>1 line</div>}
          {tagO2 > 0.01 && <div style={{position: 'absolute', left: 650, top: 240, opacity: tagO2, background: C.mint, color: C.ink, fontFamily: 'Archivo', fontWeight: 900, fontSize: 44, borderRadius: 18, padding: '4px 24px', transform: `scale(${lerp(1.3, 1, tagO2)})`}}>3 steps</div>}

          {/* calculator card */}
          {calcO > 0.01 && (
            <div style={{position: 'absolute', left: 190, top: 250, width: 700, opacity: calcO, transform: `translateY(${(1 - calcO) * 40}px)`}}>
              <div style={{background: C.paper, borderRadius: 30, padding: '34px 40px', fontFamily: 'Archivo', color: C.ink}}>
                <div style={{fontWeight: 900, fontSize: 52, lineHeight: 1}}>Cake pricing calculator</div>
                <div style={{marginTop: 8}}><Mono size={22}>For home bakers</Mono></div>
                {[['Ingredients', '$18.40'], ['Hours', '4'], ['Packaging', '$3.50'], ['Price', '$96']].map(([k, v], i) => {
                  const p = r(f, c.calc + 6 + i * 5, c.calc + 14 + i * 5);
                  return (
                    <div key={k} style={{display: 'flex', justifyContent: 'space-between', fontSize: 38, fontWeight: i === 3 ? 900 : 600, marginTop: 18, paddingTop: 14, borderTop: '2px solid #d6d1c4', opacity: p, transform: `translateY(${(1 - p) * 12}px)`}}>
                      <span>{k}</span><span style={{background: i === 3 ? C.mint : undefined, borderRadius: 8, padding: '0 10px'}}>{v}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{marginTop: 24, display: 'flex', justifyContent: 'center', opacity: askedP, transform: `scale(${lerp(1.3, 1, askedP)})`}}>
                <div style={{background: '#fff', color: '#000', borderRadius: 30, padding: '10px 28px', fontFamily: UI_FONT, fontWeight: 700, fontSize: 36}}>Asked ChatGPT · twice</div>
              </div>
            </div>
          )}

          {/* "A guess." stamp over the chart */}
          {guessP > 0.01 && (
            <div style={{position: 'absolute', left: 300, top: 560, opacity: Math.min(1, guessP * 3), transform: `rotate(-6deg) scale(${lerp(1.6, 1, guessP)})`, fontFamily: 'Archivo', fontWeight: 900, fontSize: 130, color: C.red,
              border: `8px solid ${C.red}`, borderRadius: 22, padding: '0 34px', background: 'rgba(0,0,0,0.75)'}}>A guess.</div>
          )}
          {/* 1 hour vs 6 channels */}
          {hourO > 0.01 && (
            <div style={{position: 'absolute', inset: 0, opacity: hourO}}>
              <div style={{position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center', fontFamily: 'Archivo', fontWeight: 900, fontSize: 120, color: '#fff'}}>1 hour a day</div>
              {ROWS.map(([name], i) => {
                const p = r(f, c.hour + 6 + i * 3, c.hour + 14 + i * 3);
                const col = i % 2, row = Math.floor(i / 2);
                return (
                  <div key={name} style={{position: 'absolute', left: 90 + col * 470, top: 380 + row * 190, width: 430, height: 150, borderRadius: 24, background: '#171717', border: '4px solid #3a3a3a', boxSizing: 'border-box', padding: '0 26px',
                    display: 'flex', alignItems: 'center', opacity: p, transform: `translateY(${(1 - p) * 20}px) rotate(${sixX * (col ? 3 : -3)}deg)`}}>
                    <span style={{position: 'relative', fontFamily: 'Archivo', fontWeight: 800, fontSize: 34, color: '#fff'}}>{name}<Strike p={r(f, c.cant6 + i * 2, c.cant6 + 8 + i * 2)} width={8} /></span>
                  </div>
                );
              })}
            </div>
          )}
          {/* 3-step tracker */}
          {stepsO > 0.01 && (
            <div style={{position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center', gap: 36, opacity: stepsO}}>
              {[1, 2, 3].map((n, i) => {
                const p = r(f, c.steps3 + i * 5, c.steps3 + 10 + i * 5);
                return (
                  <div key={n} style={{width: 300, height: 480, borderRadius: 34, background: i === 0 ? C.mint : '#171717', border: `4px solid ${C.mint}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    opacity: p, transform: `translateY(${(1 - p) * 40}px)`}}>
                    <Mono size={24} color={i === 0 ? C.ink : C.mint}>Step</Mono>
                    <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 240, lineHeight: 1, color: i === 0 ? C.ink : '#fff'}}>{n}</div>
                  </div>
                );
              })}
            </div>
          )}
          {/* the 3 prompts */}
          {b1 > 0.01 && <Bubble o={b1} text={P1.slice(0, t1)} />}
          {(() => {
            const o = r(f, c.p1 + 4, c.p1 + 14) * (1 - r(f, c.found8 - 8, c.found8));
            return o > 0.01 ? (
              <div style={{position: 'absolute', left: 0, right: 0, top: 470, textAlign: 'center', opacity: o, transform: `translateY(${(1 - o) * 30}px)`}}>
                <Mono size={30} color={C.mint}>Step 1: go broad on purpose</Mono>
                <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 300, lineHeight: 1, color: '#fff', marginTop: 10}}>?</div>
                <div style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 50, color: '#9b9b9b'}}>what are all the ways</div>
              </div>
            ) : null;
          })()}
          {b2 > 0.01 && (
            <Bubble o={b2} text={<>{P2a}{P2k.map((k, i) => {
              const at = [c.k1, c.k2, c.k3][i];
              const p = r(f, at - 2, at + 8);
              return <span key={k}><Mark p={p} col={C.mint}>{k}</Mark>{i < 2 ? ', ' : '.'}</span>;
            })}</>} />
          )}
          {b3 > 0.01 && <Bubble o={b3} text={P3.slice(0, t3)} />}
          {/* 8 methods → 3 kept */}
          {tilesO > 0.01 && (
            <div style={{position: 'absolute', inset: 0, opacity: tilesO}}>
              {METHODS.map((m, i) => {
                const p = r(f, c.found8 - 2 + i * 3, c.found8 + 8 + i * 3);
                const col = i % 3, row = Math.floor(i / 3);
                const gx = 40 + col * 340, gy = 360 + row * 180;
                const kp = KEEP_POS[i];
                let x = gx, y = gy, o = p, rot = 0;
                if (kp) { x = lerp(gx, kp.x, keepMove); y = lerp(gy, 520, keepMove); }
                else { const di = [2,3,4,6,7].indexOf(i); x = lerp(gx, 40 + di * 200, keepMove); y = lerp(gy, 800, keepMove); o = p * (1 - 0.45 * keepMove); rot = 0; }
                const name = kp && keepMove > 0.5 ? kp.name : m.t;
                const hiP = kp ? r(f, c[kp.cue] - 2, c[kp.cue] + 6) : 0;
                const strike = kp && i !== 0 ? r(f, i === 5 ? c.notIG : c.notRD, (i === 5 ? c.notIG : c.notRD) + 8) : 0;
                const tagShow = !kp && keepMove > 0.05 ? m.tag : '';
                const sc = kp ? lerp(0.9, 1, p) : lerp(0.9, 1, p) * lerp(1, 0.58, keepMove);
                return <Tile key={m.t} name={name} tag={tagShow} hi={hiP} strike={strike} style={{left: x, top: y, opacity: o, transformOrigin: '0 0', transform: `rotate(${rot}deg) scale(${sc})`}} />;
              })}
              {/* competitors found */}
              {['PriceMyBakes', 'Confita', 'The Cake Price'].map((t, k) => {
                const p = r(f, c.calcs3 + k * 6, c.calcs3 + 8 + k * 6) * (1 - r(f, c.p2 - 4, c.p2 + 4));
                return p > 0.01 ? (
                  <div key={t} style={{position: 'absolute', left: 40 + k * 340, top: 900, width: 320, height: 90, borderRadius: 45, border: `4px solid ${C.amber}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Archivo', fontWeight: 800, fontSize: 32, color: '#fff', opacity: p, transform: `scale(${lerp(1.25, 1, p)})`}}>{t}</div>
                ) : null;
              })}
              {(() => {
                const p = r(f, c.exist - 2, c.exist + 8) * (1 - r(f, c.p2 - 4, c.p2 + 4));
                return p > 0.01 ? <div style={{position: 'absolute', left: 0, right: 0, top: 1010, textAlign: 'center', opacity: p}}><Mono size={26} color={C.amber}>Already exist</Mono></div> : null;
              })()}
            </div>
          )}

          {/* 3-day start + goal */}
          {daysO > 0.01 && (
            <div style={{position: 'absolute', inset: 0, opacity: daysO}}>
              {[['Day 1', 'Join 5 groups', c.d1], ['Day 2', 'Answer pricing questions', c.d2], ['Day 3', 'Post where allowed', c.d3]].map(([d, t, at], i) => {
                const p = r(f, (at as number) - 2, (at as number) + 8);
                return (
                  <div key={d as string} style={{position: 'absolute', left: 60, top: 90 + i * 190, width: 960, height: 160, borderRadius: 28, background: '#171717', border: `4px solid ${C.mint}`, boxSizing: 'border-box', padding: '0 36px', display: 'flex', alignItems: 'center', gap: 36,
                    opacity: p, transform: `translateX(${(1 - p) * 60}px)`}}>
                    <Mono size={30} color={C.mint}>{d}</Mono>
                    <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 52, color: '#fff'}}>{t}</span>
                  </div>
                );
              })}
              {goalP > 0.01 && (
                <div style={{position: 'absolute', left: 0, right: 0, top: 690, textAlign: 'center', opacity: Math.min(1, goalP * 2)}}>
                  <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 220, lineHeight: 1, color: C.mint}}>{Math.round(lerp(0, 10, goalP))}</div>
                  <div style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 50, color: '#fff'}}>real users first</div>
                </div>
              )}
            </div>
          )}

          {/* CTA */}
          {ctaIn > 0.01 && (
            <div style={{position: 'absolute', inset: 0, opacity: ctaIn}}>
              <div style={{position: 'absolute', left: 90, top: 250, width: 900, height: 120, background: C.paper, borderRadius: 60, display: 'flex', alignItems: 'center', gap: 22, padding: '0 18px 0 26px', boxSizing: 'border-box', transform: `translateY(${(1 - ctaIn) * 40}px)`}}>
                <div style={{width: 72, height: 72, borderRadius: 36, background: C.mint, flex: 'none'}} />
                <div style={{position: 'relative', flex: 1, height: 64}}>
                  <span style={{position: 'absolute', left: 0, top: 8, fontFamily: 'Archivo', fontWeight: 600, fontSize: 38, color: C.muted, opacity: 1 - r(f, c.kw - 4, c.kw)}}>{ig ? 'Add a comment…' : 'Message…'}</span>
                  <span style={{position: 'absolute', left: 0, top: 0, fontFamily: 'Archivo', fontWeight: 900, fontSize: 54, color: C.ink, opacity: r(f, c.kw - 3, c.kw + 3), transform: `scale(${lerp(1.2, 1, r(f, c.kw - 3, c.kw + 5))})`, transformOrigin: 'left center'}}>NARROW</span>
                </div>
                <div style={{width: 86, height: 86, borderRadius: 43, flex: 'none', background: f >= c.sendC - 1 ? C.mint : '#d6d1c4', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 - 0.12 * Math.sin(Math.PI * r(f, c.sendC - 2, c.sendC + 6))})`}}>
                  <svg viewBox="0 0 40 40" style={{width: 40, height: 40}}><path d="M6 20 H32 M22 10 L32 20 L22 30" stroke={C.ink} strokeWidth={4.5} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </div>
              </div>
              {[['Prompt 1', 'Go broad, on purpose'], ['Prompt 2', 'Narrow with your real constraints'], ['Prompt 3', 'Narrow to one choice']].map(([t, d], k) => {
                const p = fanP(k);
                const rot = [-9, 0, 9][k] * p, dx = [-300, 0, 300][k] * p;
                return (
                  <div key={t} style={{position: 'absolute', left: 540 - 170 + dx, top: 470 + Math.abs(k - 1) * 40 * p, width: 340, height: 460, background: '#171717', border: `4px solid ${C.mint}`, borderRadius: 26, padding: 26, boxSizing: 'border-box',
                    transform: `rotate(${rot}deg) translateY(${(1 - p) * 60}px)`, opacity: Math.min(1, p * 2.5)}}>
                    <Mono size={20} color={C.mint}>{t}</Mono>
                    <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 44, color: '#fff', marginTop: 10, lineHeight: 1.05}}>{d}</div>
                    {[0, 1, 2, 3].map((i) => <div key={i} style={{height: 12, marginTop: i ? 16 : 30, width: `${[92, 80, 88, 60][i]}%`, borderRadius: 6, background: '#3a3a3a'}} />)}
                  </div>
                );
              })}
              <div style={{position: 'absolute', left: 0, right: 0, top: 1000, textAlign: 'center'}}><Mono size={24} color="#9b9b9b">The Narrowing Method · section 03, page 4</Mono></div>
            </div>
          )}
        </div>
      </div>

      {/* ================= PAPER PANEL ================= */}
      <div style={{position: 'absolute', left: 0, right: 0, top: SPLIT, bottom: 0, background: C.paper}} />
      {headO > 0.01 && (
        <div style={{opacity: Math.min(1, headO), transform: `translateY(${(1 - Math.min(1, headO)) * -20}px)`}}>
          <div style={{...H1, top: SPLIT + 44, fontSize: 104, width: 640}}>First 100 visitors?</div>
          <div style={{position: 'absolute', left: 62, top: SPLIT + 280, display: 'flex', alignItems: 'center', gap: 14}}>
            <div style={{background: C.red, color: '#fff', fontFamily: 'Archivo', fontWeight: 800, fontSize: 44, borderRadius: 40, padding: '10px 26px', transform: `scale(${1 + 0.12 * Math.sin(Math.PI * r(f, c.six - 2, c.six + 8))})`}}>6 places.</div>
            <div style={{background: C.ink, color: C.paper, fontFamily: 'Archivo', fontWeight: 800, fontSize: 44, borderRadius: 40, padding: '10px 26px', transform: `scale(${1 + 0.12 * Math.sin(Math.PI * r(f, c.need1 - 2, c.need1 + 8))})`}}>You need 1.</div>
          </div>
        </div>
      )}
      {s1 > 0.01 && (
        <div style={{opacity: s1, transform: `translateY(${(1 - s1) * 24}px)`}}>
          <div style={{...H1, top: SPLIT + 60, fontSize: 96}}>1 question.</div>
          <div style={{...H1, top: SPLIT + 165, fontSize: 96, color: C.red}}>2 ways.</div>
        </div>
      )}
      {s2 > 0.01 && (
        <div style={{position: 'absolute', inset: 0, opacity: s2}}>
          <div style={{position: 'absolute', left: 62, top: SPLIT + 40}}><Mono size={26} color={C.ink}>The 1-line answer</Mono></div>
          <Chip f={f} at={c.chips[0]} col={C.red} style={{left: 62, top: SPLIT + 92}}>6 channels</Chip>
          <Chip f={f} at={c.chips[1]} col={C.red} style={{left: 330, top: SPLIT + 92}}>7-day plan</Chip>
          <Chip f={f} at={c.chips[2]} col={C.red} style={{left: 62, top: SPLIT + 168}}>20 creators</Chip>
          <Chip f={f} at={c.chips[3]} col={C.red} style={{left: 330, top: SPLIT + 168}}>1 chart</Chip>
          <Chip f={f} at={c.guess} col={C.red} fill style={{left: 62, top: SPLIT + 260}}>Its own words: “not a guaranteed forecast”</Chip>
        </div>
      )}
      {s3 > 0.01 && (
        <div style={{opacity: s3, transform: `translateY(${(1 - s3) * 24}px)`}}>
          <div style={{...H1, top: SPLIT + 60, fontSize: 96}}>1 hour.</div>
          <div style={{...H1, top: SPLIT + 165, fontSize: 96, color: C.red}}>6 channels?</div>
        </div>
      )}
      {s4 > 0.01 && (
        <div style={{position: 'absolute', inset: 0, opacity: s4}}>
          <div style={{position: 'absolute', left: 62, top: SPLIT + 40}}><Mono size={26} color={C.ink}>Step {stepN} of 3</Mono></div>
          <div style={{position: 'absolute', left: 62, top: SPLIT + 90, display: 'flex', gap: 14}}>
            {[1, 2, 3].map((n) => (
              <div key={n} style={{width: 90, height: 90, borderRadius: 45, background: n <= stepN ? C.ink : 'transparent', border: `5px solid ${C.ink}`, color: n <= stepN ? C.paper : C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Archivo', fontWeight: 900, fontSize: 50}}>{n}</div>
            ))}
          </div>
          {countTxt && (
            <div style={{position: 'absolute', left: 62, top: SPLIT + 210, fontFamily: 'Archivo', fontWeight: 900, fontSize: 150, lineHeight: 1, color: countTxt === '8' ? C.ink : C.red}}>
              {countTxt}<span style={{fontSize: 52, marginLeft: 16}}>{countTxt === '8' ? 'options' : 'left'}</span>
            </div>
          )}
        </div>
      )}
      {s5 > 0.01 && (
        <div style={{opacity: s5, transform: `translateY(${(1 - s5) * 24}px)`}}>
          <div style={{...H1, top: SPLIT + 50, fontSize: 92}}>Start:</div>
          <div style={{...H1, top: SPLIT + 150, fontSize: 92}}><span style={{background: C.mint, borderRadius: 12, padding: '0 14px', margin: '0 -14px'}}>Facebook</span></div>
          <div style={{...H1, top: SPLIT + 250, fontSize: 92}}>groups.</div>
        </div>
      )}
      {s6 > 0.01 && (
        <div style={{opacity: s6, transform: `translateY(${(1 - s6) * 24}px)`}}>
          <div style={{...H1, top: SPLIT + 60, fontSize: 96}}>First 10</div>
          <div style={{...H1, top: SPLIT + 165, fontSize: 96}}>users.</div>
          <div style={{position: 'absolute', left: 62, top: SPLIT + 300}}><Mono size={24} color={C.ink}>Before any other channel</Mono></div>
        </div>
      )}
      {s7 > 0.01 && (
        <div style={{opacity: s7, transform: `translateY(${(1 - s7) * 24}px)`}}>
          <div style={{...H1, top: SPLIT + 60, fontSize: ig ? 104 : 96}}>{ig ? 'Comment' : 'DM me'}</div>
          <div style={{...H1, top: SPLIT + 170, fontSize: 110}}><span style={{background: C.mint, borderRadius: 14, padding: '0 16px', margin: '0 -16px'}}>NARROW</span></div>
          <div style={{position: 'absolute', left: 62, top: SPLIT + 320}}><Mono size={26} color={C.ink}>The 3 prompts, free</Mono></div>
        </div>
      )}

      <Sage f={f} c={c} mouth={mouth} />
      <Caption f={f} z={z} />
    </AbsoluteFill>
  );
};
