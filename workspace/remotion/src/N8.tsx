// N-8 "Stop paying for 3 AI tools" (NARROW). Real runs 24 Nov 2026 12:27 (one line) / 12:28 (3 prompts), ChatGPT.
// Plan: workspace/reels/n8/plan.md (v2 motion grammar). System from W-7 (paper, captions, Sage bust, camera).
// Reference moves: PileUp (pile → implode → flood, giant number cards, hub, stripe wipe), PhoneFilm (phone with the
// real chat, overlay card over blurred phone, limit chips with dots, cursor click, serif accent words).
// remocn: gravity-pile, slot-machine-roll, strikethrough-replace, push-through, lens-zoom, whip-pan, impact-shake,
// crumple-toss, ink-arrow, caret.
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Caret} from '@/components/remocn/caret';
import {whipPan} from '@/components/remocn/whip-pan';
import {pushThrough} from '@/components/remocn/push-through';
import {lensZoom} from '@/components/remocn/lens-zoom';
import {StrikethroughReplace} from '@/components/remocn/strikethrough-replace';
import {ImpactShake} from '@/components/remocn/impact-shake';
import {InkArrow} from '@/components/remocn/ink-arrow';
import TIG from './n8timing_ig.json';
import TTT from './n8timing_tt.json';
import MIG from './n8mouth_ig.json';
import MTT from './n8mouth_tt.json';

const C = {paper: '#E9E5DA', rule: '#D7D1C3', card: '#FCFBF7', ink: '#181714', mint: '#6BE0A0', gold: '#F2B632', red: '#D9534A', muted: '#7A7468', green: '#2F7A52', line: '#DCD7CB', note: '#F6E7A8', dark: '#151515', gpt: '#212121', gptText: '#ECECEC', bubble: '#303030'};
const OUT = Easing.bezier(0.42, 0, 0.18, 1);
const IO = Easing.bezier(0.65, 0, 0.35, 1);
const BACK = Easing.out(Easing.back(1.8));
const IN = Easing.in(Easing.cubic);
const LIN = (t: number) => t;
const r = (f: number, a: number, b: number, e = OUT) => interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ---------- timing ----------
type Wd = {w: string; s: number; e: number};
type Line = {start: number; end: number; text: string; words: Wd[]};
type Chunk = {words: Wd[]; from: number};
const prep = (T: {lines: Line[]; end: number; total: number}) => {
  const CHUNKS: Chunk[] = [];
  T.lines.forEach((l) => {
    const segs: Wd[][] = [];
    let cur: Wd[] = [];
    l.words.forEach((w, i) => {
      cur.push(w);
      if (/[.:?,]["”]?$/.test(w.w) || /^[A-Z]{4,}$/.test(w.w) || i === l.words.length - 1) { segs.push(cur); cur = []; }
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
const Z = {ig: prep(TIG as any), tt: prep(TTT as any)};
type ZT = ReturnType<typeof prep>;
const mk = (T: any) => ({L: T.lines.map((l: Line) => l.words[0].s) as number[], w: (li: number, wi: number) => T.lines[li].words[Math.min(wi, T.lines[li].words.length - 1)].s as number, e: (li: number) => T.lines[li].end as number, TOTAL: T.total as number});
type MT = ReturnType<typeof mk>;
const MM = {ig: mk(TIG), tt: mk(TTT)};
export const N8_TOTAL = {ig: Z.ig.TOTAL, tt: Z.tt.TOTAL};

const Fonts: React.FC = () => (
  <style>{`
@font-face{font-family:Archivo;src:url(${staticFile('archivo-variable.woff2')}) format('woff2');font-weight:100 900;font-stretch:62% 125%}
@font-face{font-family:Newsreader;src:url(${staticFile('newsreader-variable.woff2')}) format('woff2');font-weight:200 800;font-style:normal italic}
@font-face{font-family:Plex;src:url(${staticFile('plex-mono-500.woff2')}) format('woff2');font-weight:500}
`}</style>
);
const PAPER: React.CSSProperties = {background: C.paper, backgroundImage: `repeating-linear-gradient(0deg, transparent 0 63px, ${C.rule} 63px 65px)`};

// ---------- captions (max 3 words, mint word highlight; ElevenLabs alignment) ----------
const CAP_TOP = 1280;
const ChunkView: React.FC<{f: number; ch: Chunk; o: number; loopIn: boolean; dark?: boolean}> = ({f, ch, o, loopIn, dark}) => {
  const hlA = (i: number) => {
    if (loopIn) return i === 0 ? 1 : 0;
    const s0 = ch.words[i].s;
    const next = i < ch.words.length - 1 ? ch.words[i + 1].s : 1e9;
    const first = i === 0 ? 1 : r(f, s0 - 3, s0 - 1);
    return (i === 0 && f < s0 ? 1 : first) * (1 - r(f, next - 3, next - 1));
  };
  // one line only: long chunks shrink to fit 760 px instead of wrapping into the section tag
  const chars = ch.words.reduce((n, w) => n + w.w.length, 0) + ch.words.length - 1;
  const fs = Math.min(66, Math.floor(760 / (chars * 0.6)));
  return (
    <div style={{position: 'absolute', left: 66, top: CAP_TOP, width: 780, display: 'flex', flexWrap: 'nowrap', whiteSpace: 'nowrap', columnGap: 14, opacity: o}}>
      {ch.words.map((w, i) => (
        <span key={i} style={{position: 'relative', fontFamily: 'Archivo', fontWeight: 900, fontSize: fs, lineHeight: 1.12, letterSpacing: -1.5, color: dark && hlA(i) < 0.5 ? C.paper : C.ink, padding: '0 8px', margin: '0 -8px'}}>
          <span style={{position: 'absolute', inset: 0, borderRadius: 10, background: C.mint, opacity: hlA(i)}} />
          <span style={{position: 'relative'}}>{w.w}</span>
        </span>
      ))}
    </div>
  );
};
const Caption: React.FC<{f: number; z: ZT; dark?: boolean}> = ({f, z, dark}) => {
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
  const xo = ci === 0 ? 1 : r(f, from - 1, from + 3, IO);
  const xi = ci === 0 ? 1 : r(f, from, from + 4);
  return (
    <>
      {ci > 0 && xo < 1 && <ChunkView f={f} ch={z.CHUNKS[ci - 1]} o={1 - xo} loopIn={false} dark={dark} />}
      <div style={{transform: `translateY(${(1 - xi) * 10}px)`}}><ChunkView f={f} ch={z.CHUNKS[ci]} o={xi} loopIn={false} dark={dark} /></div>
    </>
  );
};

// ---------- Sage ----------
type Pose = 'sage' | 's-check' | 's-finger' | 's-point' | 's-present' | 's-shrug' | 's-sigh' | 's-think';
const MOUTHX: Record<Pose, number> = {sage: 162.5, 's-check': 169.0, 's-finger': 205.5, 's-point': 329.5, 's-present': 347.5, 's-shrug': 278.0, 's-sigh': 195.0, 's-think': 156.5};
const Sage: React.FC<{f: number; m: MT; mouth: number[]; end: number}> = ({f, m, mouth, end}) => {
  const L = m.L, w = m.w, T = m.TOTAL;
  const POSES: [number, Pose][] = [
    [0, 's-present'], [w(1, 2) - 3, 's-point'], [L[2] - 3, 's-finger'], [L[3] - 3, 's-think'], [L[4] - 3, 's-check'],
    [L[5] - 3, 's-shrug'], [w(5, 14) - 3, 's-sigh'], [L[6] - 3, 's-present'], [L[7] - 3, 's-point'], [L[8] - 3, 's-finger'],
    [L[9] - 3, 's-shrug'], [L[10] - 3, 's-think'], [w(10, 9) - 3, 's-point'], [L[11] - 3, 's-check'], [L[12] - 3, 's-finger'],
    [L[13] - 3, 's-present'], [L[14] - 3, 's-shrug'], [L[15] - 3, 's-point'], [L[16] - 3, 's-check'], [L[17] - 3, 's-present'], [end - 2, 's-present'],
  ];
  let idx = 0;
  POSES.forEach(([t], i) => { if (f >= t) idx = i; });
  const [t0, p] = POSES[idx];
  const d = f - t0;
  const pop = idx > 0 && d < 6 ? 0.035 * (1 - d / 6) : 0;
  const breathe = Math.sin((2 * Math.PI * f * 5) / T);
  const k = 1.06, H = 1121 * k;
  const left = 872 - MOUTHX[p] * k;
  const lv = f >= end ? 0 : mouth[f] ?? 0;
  const src = lv === 0 ? `sage/${p}.png` : lv === 1 ? `sage/${p}-mid.png` : `sage/${p}-open.png`;
  return (
    <div style={{position: 'absolute', left, top: 1388 + breathe * 2.5, width: 700, height: H, transformOrigin: `${MOUTHX[p] * k}px ${H * 0.45}px`, transform: `scale(${1 + pop + breathe * 0.004})`}}>
      <Img src={staticFile(src)} style={{position: 'absolute', left: 0, top: 0, height: H}} />
    </div>
  );
};

// ---------- camera ----------
type Punch = [number, number, number, number, number];
const camera = (f: number, total: number, punches: Punch[], shakes: [number, number][]) => {
  const ph = (2 * Math.PI * f) / total;
  let k = 1 + 0.018 * Math.sin(ph * 3), tx = 12 * Math.sin(ph * 2), ty = 6 * Math.sin(ph * 4);
  punches.forEach(([a, b, s, x, y]) => {
    const wt = r(f, a, a + 6, IO) * (1 - r(f, b - 8, b, IO));
    if (wt <= 0) return;
    const kk = 1 + (s - 1) * wt;
    tx += (x - 540) * (1 - kk); ty += (y - 700) * (1 - kk); k *= kk;
  });
  shakes.forEach(([t, amp]) => {
    const d = f - t;
    if (d < 0 || d > 14) return;
    const e = amp * Math.exp(-d / 3.5);
    tx += e * Math.sin(d * 2.4); ty += e * 0.7 * Math.cos(d * 3.1);
  });
  return `translate(${tx}px, ${ty}px) scale(${k}) rotate(${0.45 * Math.sin(ph * 2 + 1)}deg)`;
};

// ---------- small parts ----------
const Mono: React.FC<{children: React.ReactNode; color?: string; size?: number}> = ({children, color = C.muted, size = 26}) => (
  <span style={{fontFamily: 'Plex', fontSize: size, color, letterSpacing: 0.5}}>{children}</span>
);
const Stamp: React.FC<{text: string; p: number; color?: string; rot?: number; size?: number}> = ({text, p, color = C.red, rot = -6, size = 40}) => (
  <span style={{display: 'inline-block', fontFamily: 'Archivo', fontWeight: 900, fontSize: size, letterSpacing: 1, color, border: `4px solid ${color}`, borderRadius: 12, background: C.card,
    padding: '4px 18px', whiteSpace: 'nowrap', transform: `rotate(${rot}deg) scale(${lerp(1.5, 1, p)})`, opacity: Math.min(1, p * 3)}}>{text}</span>
);
const Hl: React.FC<{f: number; at: number; children: React.ReactNode; color?: string; dark?: boolean}> = ({f, at, children, color = C.mint, dark = true}) => {
  const p = r(f, at, at + 9, IO);
  return <span style={{color: dark ? (p > 0.35 ? C.ink : C.gptText) : C.ink, backgroundImage: `linear-gradient(${color}, ${color})`, backgroundRepeat: 'no-repeat', backgroundPosition: '0 50%', backgroundSize: `${p * 100}% 100%`, padding: '0 5px', margin: '0 -5px', borderRadius: 5, boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone'}}>{children}</span>;
};
// serif italic accent word with a mint swash under it (PhoneFilm reference)
const Accent: React.FC<{f: number; at: number; children: React.ReactNode}> = ({f, at, children}) => {
  const p = r(f, at, at + 10, IO);
  return (
    <span style={{position: 'relative', fontFamily: 'Newsreader', fontStyle: 'italic', fontWeight: 600, color: C.green}}>
      {children}
      <svg viewBox="0 0 100 12" preserveAspectRatio="none" style={{position: 'absolute', left: -4, right: -4, bottom: -6, width: 'calc(100% + 8px)', height: 16}}>
        <path d="M2 8 C 30 2, 60 12, 98 5" stroke={C.mint} strokeWidth={6} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
      </svg>
    </span>
  );
};
const Sticker: React.FC<{p: number; children: React.ReactNode; rot?: number; bg?: string; size?: number; style?: React.CSSProperties}> = ({p, children, rot = -2, bg = C.note, size = 38, style}) => {
  if (p <= 0) return null;
  const q = Math.round(p * 4) / 4;
  return (
    <div style={{position: 'relative', display: 'inline-block', padding: '14px 24px', background: bg, border: `3px solid ${C.ink}`, borderRadius: 6, fontFamily: 'Archivo', fontWeight: 800, fontSize: size, color: C.ink, whiteSpace: 'nowrap',
      transform: `rotate(${rot + (1 - q) * 6}deg) scale(${lerp(1.25, 1, q)})`, opacity: Math.min(1, q * 2), ...style}}>
      <span style={{position: 'absolute', left: '50%', top: -16, width: 90, height: 28, marginLeft: -45, background: 'rgba(240,226,190,0.85)', border: '1px solid rgba(160,140,100,0.35)', transform: 'rotate(4deg)'}} />
      {children}
    </div>
  );
};
const Typed: React.FC<{f: number; at: number; text: string; cps?: number; size?: number; color?: string; caretOff?: number; weight?: number}> = ({f, at, text, cps = 1.6, size = 40, color = C.gptText, caretOff = 1e9, weight = 500}) => {
  const n = Math.max(0, Math.min(text.length, Math.floor((f - at) * cps)));
  return (
    <span style={{fontFamily: 'Archivo', fontWeight: weight, fontSize: size, lineHeight: 1.25, color}}>
      {text.slice(0, n)}
      {f >= at - 6 && f < caretOff && <Caret color={color} width={4} height={size * 0.9} blink={n === 0 || n === text.length} marginLeft={3} />}
      <span style={{opacity: 0}}>{text.slice(n)}</span>
    </span>
  );
};
const SlotRoll: React.FC<{f: number; at: number; to: string; size: number; color: string}> = ({f, at, to, size, color}) => (
  <span style={{display: 'inline-flex', fontFamily: 'Archivo', fontWeight: 900, fontSize: size, color, lineHeight: 1.1}}>
    {Array.from(to).map((ch, i) => {
      const digit = /[0-9]/.test(ch);
      const p = r(f, at + i * 3, at + i * 3 + 14, Easing.out(Easing.back(1.4)));
      const spins = digit ? 10 + Number(ch) : 0;
      const pos = p * spins;
      return (
        <span key={i} style={{display: 'inline-block', height: '1.1em', overflow: 'hidden', verticalAlign: 'top'}}>
          {digit ? <span style={{display: 'flex', flexDirection: 'column', transform: `translateY(${-pos * 1.1}em)`}}>{Array.from({length: spins + 1}).map((_, k) => <span key={k}>{k % 10}</span>)}</span> : <span style={{opacity: Math.min(1, p * 3)}}>{ch}</span>}
        </span>
      );
    })}
  </span>
);
const REAL = 'excerpt · real run · ChatGPT · 24 Nov 2026';
// shimmer like ChatGPT's "Searching…" line
const Searching: React.FC<{f: number; at: number; text: string}> = ({f, at, text}) => {
  const x = ((f - at) * 6) % 400;
  return <span style={{fontFamily: 'Archivo', fontSize: 34, color: '#8E8E8E', backgroundImage: `linear-gradient(90deg, #8E8E8E 0%, #8E8E8E ${x - 60}%, #F2F2F2 ${x}%, #8E8E8E ${x + 60}%)`, WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundSize: '400% 100%'}}>{text}</span>;
};

// phone with ChatGPT's dark chat (PhoneFilm reference). width 470, height 880 by default.
const Phone: React.FC<{time: string; children?: React.ReactNode; w?: number; h?: number; title?: string}> = ({time, children, w = 470, h = 880, title = 'ChatGPT'}) => (
  <div style={{position: 'relative', width: w, height: h, borderRadius: 66, background: '#0E0E0E', border: `5px solid ${C.ink}`, padding: 14, boxSizing: 'border-box', boxShadow: '0 22px 0 rgba(24,23,20,0.10)'}}>
    <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 52, background: C.gpt, overflow: 'hidden'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 36px 0', fontFamily: 'Archivo', fontWeight: 700, fontSize: 28, color: '#F2F2F2'}}>
        <span>{time}</span>
        <span style={{width: 120, height: 34, borderRadius: 17, background: '#000'}} />
        <span style={{fontSize: 22}}>●●●</span>
      </div>
      <div style={{padding: '18px 30px 0', fontFamily: 'Archivo', fontWeight: 700, fontSize: 30, color: '#F2F2F2', borderBottom: '1px solid #333', paddingBottom: 14}}>{title}</div>
      <div style={{position: 'absolute', left: 26, right: 26, top: 150, bottom: 30}}>{children}</div>
    </div>
  </div>
);
const Bubble: React.FC<{children: React.ReactNode; size?: number; show?: boolean}> = ({children, size = 32, show = true}) => (
  <div style={{display: 'flex', justifyContent: 'flex-end', opacity: show ? 1 : 0}}>
    <div style={{maxWidth: '86%', background: C.bubble, borderRadius: 30, padding: '16px 24px', fontFamily: 'Archivo', fontWeight: 500, fontSize: size, lineHeight: 1.25, color: C.gptText}}>{children}</div>
  </div>
);
const Cursor: React.FC<{x: number; y: number; press: number}> = ({x, y, press}) => (
  <svg width={56} height={56} viewBox="0 0 24 24" style={{position: 'absolute', left: x, top: y, transform: `scale(${1 - press * 0.15})`, transformOrigin: '4px 4px', filter: 'drop-shadow(0 3px 0 rgba(0,0,0,0.25))'}}>
    <path d="M4 3l14 8-6.2 1.6L9 19z" fill={C.card} stroke={C.ink} strokeWidth={1.8} strokeLinejoin="round" />
  </svg>
);

// ---------- frame 0 (tested at 360 px) ----------
const PRICES: [string, string][] = [['ChatGPT Plus', '$20'], ['Claude Pro', '$20'], ['Google AI Pro', '$19.99']];
const Hook: React.FC<{f: number; m: MT; still: boolean}> = ({f, m, still}) => {
  const w = m.w;
  const cutAt = w(1, 2);
  const strike = still ? 0 : r(f, cutAt - 2, cutAt + 8, IO);
  const fold = still ? 0 : r(f, w(1, 5) - 4, w(1, 5) + 8, IO);
  const pulse = (i: number) => (still ? 0 : Math.sin(r(f, 2 + i * 5, 12 + i * 5) * Math.PI));
  const win = still ? 0 : Math.sin(r(f, w(1, 5) - 2, w(1, 5) + 12) * Math.PI);
  return (
    <>
      <div style={{position: 'absolute', left: 66, top: 250, fontFamily: 'Archivo', fontWeight: 900, fontSize: 148, lineHeight: 1.0, letterSpacing: -5, color: C.ink}}>
        <div>Stop paying</div>
        <div>for <span style={{background: C.mint, borderRadius: 14, padding: '0 14px'}}>3 AI tools.</span></div>
      </div>
      <div style={{position: 'absolute', left: 50, top: 640, width: 480, transform: 'rotate(-2deg)'}}>
        <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 52, color: C.ink, marginBottom: 10}}>3 tools</div>
        <div style={{background: C.dark, border: `4px solid ${C.ink}`, borderRadius: 20, padding: '22px 24px'}}>
          {PRICES.map(([a, b], i) => (
            <div key={a} style={{display: 'flex', justifyContent: 'space-between', fontFamily: 'Archivo', fontWeight: 600, fontSize: 43, color: '#E6E6E6', lineHeight: 1.5,
              transform: `scale(${1 + pulse(i) * 0.06})`, transformOrigin: 'left center', opacity: i === 0 ? 1 : 1 - fold * 0.65,
              background: i === 0 && fold > 0 ? `linear-gradient(${C.mint}, ${C.mint}) no-repeat 0 50% / ${fold * 100}% 100%` : undefined, borderRadius: 8, margin: '0 -8px', padding: '0 8px', ...(i === 0 && fold > 0.4 ? {color: C.ink} : {})}}>
              <span>{a}</span><span>{b}</span>
            </div>
          ))}
        </div>
        <div style={{position: 'relative', display: 'inline-block', marginTop: 14, fontFamily: 'Archivo', fontWeight: 900, fontSize: 124, letterSpacing: -3, color: C.red, lineHeight: 1}}>
          $59.99
          <div style={{position: 'absolute', left: -6, top: '50%', height: 12, width: `${strike * 104}%`, background: C.ink, transform: 'rotate(-5deg)', borderRadius: 6}} />
          <div style={{fontFamily: 'Plex', fontSize: 26, letterSpacing: 0, color: C.muted, marginTop: 6}}>a month, all 3</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 556, top: 640, width: 480, transform: `rotate(2deg) scale(${1 + win * 0.05})`, transformOrigin: 'center 70%'}}>
        <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 52, color: C.ink, marginBottom: 10}}>1 tool</div>
        <div style={{background: C.card, border: `4px solid ${C.ink}`, borderRadius: 20, padding: '20px 24px', fontFamily: 'Archivo', fontWeight: 600, fontSize: 45, lineHeight: 1.2, color: C.ink}}>
          “spend your €20 on <span style={{background: C.mint, borderRadius: 8, padding: '0 6px'}}>ChatGPT Plus</span>, keep the other two free”
        </div>
        <div style={{marginTop: 14, fontFamily: 'Archivo', fontWeight: 900, fontSize: 124, letterSpacing: -3, color: C.green, lineHeight: 1}}>
          $20
          <div style={{fontFamily: 'Plex', fontSize: 26, letterSpacing: 0, color: C.muted, marginTop: 6}}>a month, 1 tool</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 66, top: 1222}}><Mono>{REAL}</Mono></div>
    </>
  );
};

// ---------- presentations ----------
const WhipP = whipPan({direction: 'left', blur: 18}).component as React.FC<any>;
const PUSH = pushThrough({zoom: 2.6, blur: 14});
const PushP = PUSH.component as React.FC<any>;
const LENS = lensZoom({blurSamples: 4, lensSteps: 6});
const LensP = LENS.component as React.FC<any>;
type Fx = 'whip' | 'push' | 'lens' | 'fade' | 'none' | 'rise' | 'zoom';
// one scene window with an entering and an exiting transition
const Scene: React.FC<{f: number; a: number; b: number; inFx?: Fx; outFx?: Fx; dIn?: number; dOut?: number; children: React.ReactNode}> = ({f, a, b, inFx = 'fade', outFx = 'fade', dIn = 10, dOut = 10, children}) => {
  if (f < a || f >= b + (outFx === 'none' ? 0 : dOut)) return null;
  const pin = r(f, a, a + dIn, LIN), pout = r(f, b, b + dOut, LIN);
  const body = <AbsoluteFill>{children}</AbsoluteFill>;
  if (f >= b && outFx !== 'none') {
    if (outFx === 'whip') return <WhipP presentationDirection="exiting" presentationProgress={pout} passedProps={{direction: 'left', blur: 18}}>{body}</WhipP>;
    if (outFx === 'push') return <PushP presentationDirection="exiting" presentationProgress={pout} passedProps={PUSH.props}>{body}</PushP>;
    if (outFx === 'lens') return <LensP presentationDirection="exiting" presentationProgress={pout} passedProps={LENS.props}>{body}</LensP>;
    return <AbsoluteFill style={{opacity: 1 - IO(pout), transform: `translateY(${-pout * 40}px)`}}>{children}</AbsoluteFill>;
  }
  if (pin < 1 && inFx !== 'none') {
    if (inFx === 'whip') return <WhipP presentationDirection="entering" presentationProgress={pin} passedProps={{direction: 'left', blur: 18}}>{body}</WhipP>;
    if (inFx === 'push') return <PushP presentationDirection="entering" presentationProgress={pin} passedProps={PUSH.props}>{body}</PushP>;
    if (inFx === 'lens') return <LensP presentationDirection="entering" presentationProgress={pin} passedProps={LENS.props}>{body}</LensP>;
    if (inFx === 'zoom') return <AbsoluteFill style={{opacity: Math.min(1, pin * 2.5), transform: `scale(${lerp(1.5, 1, OUT(pin))})`, filter: `blur(${(1 - pin) * 16}px)`}}>{children}</AbsoluteFill>;
    if (inFx === 'rise') return <AbsoluteFill style={{opacity: Math.min(1, pin * 2), transform: `translateY(${(1 - OUT(pin)) * 120}px)`}}>{children}</AbsoluteFill>;
    return <AbsoluteFill style={{opacity: IO(pin)}}>{children}</AbsoluteFill>;
  }
  return body;
};

// section tag beside Sage (above IG's bottom UI)
const SectionTag: React.FC<{f: number; m: MT; end: number}> = ({f, m, end}) => {
  const L = m.L;
  const T: [number, string, number][] = [[0, 'real run · ChatGPT', 0], [L[3], '1 line', 0], [L[6], '3 prompts', 0], [L[7], 'prompt 1', 1], [L[10], 'prompt 2', 2], [L[12], 'prompt 3', 3], [L[13], 'its pick', 3], [L[17], 'free · the 3 prompts', 3], [end, 'real run · ChatGPT', 0]];
  let i = 0;
  T.forEach(([t], j) => { if (f >= t) i = j; });
  const [t0, text, step] = T[i];
  const p = i === 0 ? 1 : r(f, t0, t0 + 8, BACK);
  return (
    <div style={{position: 'absolute', left: 66, top: 1378, display: 'flex', alignItems: 'center', gap: 14}}>
      <div style={{display: 'flex', gap: 8}}>
        {[1, 2, 3].map((k) => <span key={k} style={{width: 18, height: 18, borderRadius: 9, border: `3px solid ${C.ink}`, background: k <= step ? C.ink : 'transparent'}} />)}
      </div>
      <span style={{fontFamily: 'Plex', fontSize: 28, color: C.ink, background: C.card, border: `3px solid ${C.ink}`, borderRadius: 8, padding: '4px 12px', transform: `rotate(-1.5deg) scale(${lerp(0.85, 1, p)})`, opacity: Math.min(1, p * 2), display: 'inline-block'}}>{text}</span>
    </div>
  );
};

// a giant full-bleed number card (PileUp "GLOWS / POP-INS")
const BigNum: React.FC<{f: number; at: number; n: string; bg: string; fg: string; dur?: number}> = ({f, at, n, bg, fg, dur = 9}) => {
  if (f < at || f >= at + dur) return null;
  const p = r(f, at, at + dur, LIN);
  return (
    <AbsoluteFill style={{background: bg, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 900, lineHeight: 0.8, color: fg, letterSpacing: -40, transform: `scale(${lerp(1.18, 0.96, p)})`}}>{n}</div>
    </AbsoluteFill>
  );
};

const PILE = ['coding projects', 'online products', 'business ideas', 'marketing strategies', 'Brick & Sage videos', 'Claude desktop app'];
const PILE_BG = [C.note, C.mint, C.card, C.gold, C.note, C.card];
// final resting spots (x, y, tilt): a stacked heap over the lower half of the phone
const SLOTS: [number, number, number][] = [[90, 1060, -3], [500, 1070, 2], [130, 975, 3], [500, 980, -3], [70, 885, -2], [520, 890, 3]];

export const N8: React.FC<{platform: 'ig' | 'tt'}> = ({platform}) => {
  const f = useCurrentFrame();
  const z = Z[platform];
  const m = MM[platform];
  const L = m.L, w = m.w;
  const ig = platform === 'ig';
  const TOTAL = m.TOTAL;
  const END = TOTAL - 21;

  // key moments
  const twoA = L[2] - 4;                   // whip to two phones
  const r1A = L[3] - 6;                    // push into the 12:27 phone
  const pileA = w(5, 0) - 2, implodeA = w(5, 14) - 4, cardA = implodeA + 12;
  const numsA = w(6, 3) - 18;              // 1 · 2 · 3 flashes: the 3 lands on the word "three"
  const p1A = L[7] - 6;
  const toggleAt = w(8, 1), strikeA = w(8, 5) - 2;
  const tabA = L[9] - 6;
  const limA = L[10] - 6, chipAt = [w(10, 5), w(10, 9), w(10, 13)], tearAt = w(11, 2) - 2;
  const p3A = L[12] - 8;
  const verdictA = L[13] - 8, hubA = w(13, 2) - 2;
  const noteAt = w(14, 1) - 2, dollyA = w(14, 4) - 2, backAt = w(14, 8) - 4;
  const arrowAt = w(15, 5) - 2;
  const stampAt = w(16, 1) - 2, clickAt = w(16, 6) - 2;
  const ctaA = L[17] - 8;
  const kwI = ig ? 1 : 2;

  // dolly-zoom (remocn dolly-zoom move, done on our layers): subject grows, background pulls away
  const dol = r(f, dollyA, dollyA + 30, IO) * (1 - r(f, L[15] - 4, L[15] + 6, IO));

  return (
    <AbsoluteFill style={PAPER}>
      <Fonts />
      <Audio src={staticFile(`n8v/final_${platform}.wav`)} />

      <div style={{position: 'absolute', inset: 0, transform: camera(f, TOTAL, [
        [w(1, 2) - 4, L[2] - 4, 1.06, 300, 900],
        [L[4] - 2, w(4, 3) + 8, 1.06, 540, 700],
        [toggleAt - 4, w(8, 4), 1.05, 540, 560],
        [w(13, 0) - 2, w(13, 2), 1.06, 540, 640],
        [clickAt - 6, L[17] - 8, 1.06, 640, 900],
      ], [[w(2, 11) + 3, 10], [tearAt + 4, 14], [noteAt + 4, 8], [stampAt + 5, 8]])}}>

        {/* S0 · hook (frame 0) */}
        <Scene f={f} a={0} b={twoA} inFx="none" outFx="whip" dOut={9}>
          <Hook f={f} m={m} still={false} />
        </Scene>

        {/* S1 · two phones, 12:27 vs 12:28 */}
        <Scene f={f} a={twoA} b={r1A} inFx="whip" outFx="none" dIn={9}>
          {[0, 1].map((i) => {
            const p = r(f, twoA + 4 + i * 6, twoA + 18 + i * 6, BACK);
            const ans = r(f, i === 0 ? w(2, 9) - 2 : w(2, 11) - 2, (i === 0 ? w(2, 9) : w(2, 11)) + 8, BACK);
            const grow = i === 0 ? r(f, r1A - 2, r1A + 10, IO) : 0;
            const leave = i === 1 ? r(f, r1A - 2, r1A + 8, IN) : 0;
            return (
              <div key={i} style={{position: 'absolute', left: i === 0 ? lerp(50, 305, grow) : 560 + leave * 700, top: lerp(1300, 240, p) - grow * 10,
                transform: `rotate(${i === 0 ? lerp(-3, 0, grow) : 3}deg) scale(${lerp(1, 1.02, grow)})`, transformOrigin: 'top left'}}>
                <Phone time={i === 0 ? '12:27' : '12:28'}>
                  <Mono color="#8E8E8E" size={24}>{i === 0 ? 'one line' : 'after 3 prompts'}</Mono>
                  <div style={{marginTop: 18}}><Bubble size={27}>{i === 0 ? 'Which AI should I pay for?' : '…which one should I start with, and why?'}</Bubble></div>
                  {ans > 0 && (
                    <div style={{marginTop: 70, textAlign: 'center', transform: `scale(${lerp(0.6, 1, ans)})`, opacity: Math.min(1, ans * 2)}}>
                      <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 66, lineHeight: 1.05, color: C.ink, background: i === 0 ? C.gold : C.mint, borderRadius: 16, padding: '14px 10px'}}>{i === 0 ? 'Claude Pro' : 'ChatGPT Plus'}</div>
                    </div>
                  )}
                </Phone>
              </div>
            );
          })}
          {f >= w(2, 11) && f < r1A && (
            <div style={{position: 'absolute', left: 470, top: 560, width: 140, textAlign: 'center'}}>
              <ImpactShake backgroundColor="transparent" intensity={0.9} impact={6} seed={8} colors={{dust: '#B9B2A2', splitA: C.red, splitB: C.green}} foregroundColor={C.red}>
                <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 170, color: C.red, transform: `scale(${lerp(1.8, 1, r(f, w(2, 11), w(2, 11) + 6, BACK))})`}}>≠</div>
              </ImpactShake>
            </div>
          )}
          <div style={{position: 'absolute', left: 66, top: 1170, opacity: r(f, twoA + 14, twoA + 24)}}><Mono>same ChatGPT · 24 Nov · one minute apart</Mono></div>
        </Scene>

        {/* S2 · the one-line chat (R1), then the pile of what it remembered */}
        <Scene f={f} a={r1A} b={L[6] - 6} inFx="none" outFx="push" dOut={14}>
          {(() => {
            const zoomIn = r(f, r1A, r1A + 14, IO);
            const ans = r(f, L[4] - 4, L[4] + 8, OUT);
            const card = r(f, L[4] - 2, L[4] + 9, BACK);
            const blur = card * 10;
            const imp = r(f, implodeA, implodeA + 10, IN);
            const phoneScale = lerp(1.02, 1.0, zoomIn) * (1 - imp * 0.98);
            return (
              <>
                <div style={{position: 'absolute', left: lerp(305, 70, zoomIn), top: 230, transformOrigin: '235px 440px', transform: `scale(${phoneScale})`, filter: blur > 0.3 ? `blur(${blur}px)` : undefined, opacity: 1 - imp}}>
                  <Phone time="12:27">
                    <Bubble show={f >= w(3, 2) - 4}><Typed f={f} at={w(3, 2) - 4} text="Which AI should I pay for?" size={32} cps={1.4} caretOff={w(3, 7) + 6} /></Bubble>
                    <div style={{marginTop: 30}}>{f >= w(3, 7) && f < L[4] - 2 && <Searching f={f} at={w(3, 7)} text="Searching 10 websites" />}</div>
                    {ans > 0 && (
                      <div style={{fontFamily: 'Archivo', fontSize: 31, lineHeight: 1.34, color: C.gptText, opacity: ans, transform: `translateY(${(1 - ans) * 30}px)`}}>
                        Based on the projects you've worked on and how you use AI, I'd choose <b>Claude Pro over ChatGPT Plus or Gemini AI Pro</b> if you're paying for just one AI subscription.
                      </div>
                    )}
                  </Phone>
                </div>
                {f < L[4] + 2 && (
                  <div style={{position: 'absolute', left: 590, top: 300, width: 430, opacity: r(f, r1A + 6, r1A + 14) * (1 - r(f, L[4] - 4, L[4] + 2))}}>
                    <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 92, lineHeight: 0.98, color: C.ink, letterSpacing: -2}}>1 line.</div>
                    <div style={{fontFamily: 'Newsreader', fontStyle: 'italic', fontWeight: 600, fontSize: 56, color: C.green, marginTop: 8}}>no limits given</div>
                    <div style={{marginTop: 40, display: 'flex', flexDirection: 'column', gap: 14}}>
                      {['no jobs', 'no budget', 'no plan'].map((t, i) => {
                        const p = r(f, w(3, 2) + i * 5, w(3, 2) + 8 + i * 5, BACK);
                        return <span key={t} style={{alignSelf: 'flex-start', fontFamily: 'Plex', fontSize: 34, color: C.ink, background: C.card, border: `3px solid ${C.ink}`, borderRadius: 10, padding: '6px 16px', transform: `scale(${lerp(0.5, 1, p)}) rotate(${(i - 1) * 2}deg)`, opacity: Math.min(1, p * 2)}}>{t}</span>;
                      })}
                    </div>
                    <div style={{marginTop: 30}}><Mono>web search on · 10 sites</Mono></div>
                  </div>
                )}
                {/* overlay card over the blurred phone */}
                {card > 0 && f < implodeA + 10 && (
                  <div style={{position: 'absolute', left: 70, right: 70, top: lerp(500, 300, r(f, pileA - 4, pileA + 8, IO)), opacity: Math.min(1, card * 2) * (1 - imp), transform: `scale(${lerp(0.9, 1, card) * (1 - imp * 0.9) * lerp(1, 0.86, r(f, pileA - 4, pileA + 8, IO))}) rotate(-1.5deg)`, transformOrigin: '470px 160px'}}>
                    <div style={{background: C.gpt, border: `4px solid ${C.ink}`, borderRadius: 22, padding: '26px 30px', fontFamily: 'Archivo', fontWeight: 500, fontSize: 50, lineHeight: 1.25, color: C.gptText}}>
                      “Based on the projects you've worked on … I'd choose <Hl f={f} at={L[4]}>Claude Pro</Hl>”
                      <div style={{marginTop: 12}}><Mono color="#9A9A9A" size={22}>{REAL} · 12:27</Mono></div>
                    </div>
                  </div>
                )}
                {/* chips drop and stack upright (PileUp), then implode into one dot */}
                {f >= pileA && f < implodeA + 12 && (
                  <div style={{position: 'absolute', inset: 0, transform: `scale(${1 - imp})`, transformOrigin: '540px 860px', opacity: 1 - r(f, implodeA + 6, implodeA + 11)}}>
                    {PILE.map((t, i) => {
                      const at = pileA + 4 + i * 6;
                      const p = r(f, at, at + 10, Easing.out(Easing.bounce));
                      const [x, y, rot] = SLOTS[i];
                      return f >= at ? (
                        <div key={t} style={{position: 'absolute', left: x, top: lerp(-160, y, p), transform: `rotate(${rot}deg)`, fontFamily: 'Archivo', fontWeight: 800, fontSize: 40, color: C.ink, background: PILE_BG[i], border: `4px solid ${C.ink}`, borderRadius: 40, padding: '12px 26px', whiteSpace: 'nowrap', boxShadow: '0 6px 0 rgba(24,23,20,0.12)'}}>{t}</div>
                      ) : null;
                    })}
                  </div>
                )}
                {f >= w(5, 3) - 2 && f < implodeA + 4 && (
                  <div style={{position: 'absolute', left: 66, top: 760, opacity: r(f, w(5, 3) - 2, w(5, 3) + 6) * (1 - r(f, implodeA - 2, implodeA + 4))}}><Sticker p={1} bg={C.card} size={40} rot={-3}>what it remembered</Sticker></div>
                )}
                {/* dot → card: old chats vs my plan */}
                {f >= implodeA + 8 && (
                  <>
                    {f < cardA + 2 && <div style={{position: 'absolute', left: 540 - 22, top: 680 - 22, width: 44, height: 44, borderRadius: 22, background: C.ink, transform: `scale(${1 + r(f, cardA - 4, cardA + 2, IN) * 6})`, opacity: 1 - r(f, cardA - 1, cardA + 2)}} />}
                    {f >= cardA + 1 && (
                      <div style={{position: 'absolute', left: 70, right: 70, top: 300, height: 760, display: 'flex', gap: 24, transform: `scale(${lerp(0.4, 1, r(f, cardA, cardA + 10, BACK))})`, opacity: r(f, cardA, cardA + 5), transformOrigin: '470px 400px'}}>
                        <div style={{flex: 1, background: C.card, border: `4px solid ${C.ink}`, borderRadius: 24, padding: 30, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 20}}>
                          <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 64, color: C.ink, textAlign: 'center', lineHeight: 1.05}}>old chats</div>
                          <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 120, color: C.green}}>✓</div>
                          <Mono>what it used</Mono>
                        </div>
                        <div style={{flex: 1, background: 'transparent', border: `5px dashed ${C.ink}`, borderRadius: 24, padding: 30, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 20, opacity: r(f, w(5, 17) - 2, w(5, 17) + 6)}}>
                          <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 64, color: C.ink, textAlign: 'center', lineHeight: 1.05}}>my plan</div>
                          <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 150, color: C.red, transform: `scale(${lerp(1.6, 1, r(f, w(5, 19), w(5, 19) + 8, BACK))})`}}>?</div>
                          <Mono>never asked</Mono>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            );
          })()}
        </Scene>

        {/* S3 · rehook: push through the "?", 1 · 2 · 3 flash, three cards */}
        <Scene f={f} a={L[6] - 6} b={p1A} inFx="push" outFx="none" dIn={14}>
          <div style={{position: 'absolute', left: 66, right: 66, top: 300, fontFamily: 'Archivo', fontWeight: 900, fontSize: 96, lineHeight: 1.02, letterSpacing: -3, color: C.ink, opacity: r(f, L[6] + 1, L[6] + 6)}}>
            So I asked 3 <Accent f={f} at={w(6, 4) - 2}>smaller</Accent> questions.
          </div>
          <div style={{position: 'absolute', left: 66, right: 66, top: 640, display: 'flex', gap: 26}}>
            {[0, 1, 2].map((i) => {
              const at = numsA + 27 + i * 3;
              const p = r(f, at, at + 9, BACK);
              const lift = i === 0 ? r(f, p1A - 6, p1A + 2, IO) : 0;
              return (
                <div key={i} style={{flex: 1, height: 420, background: C.card, border: `4px solid ${C.ink}`, borderRadius: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transform: `translateY(${(1 - p) * 500 - lift * 30}px) rotate(${(i - 1) * 3}deg) scale(${1 + lift * 0.06})`, opacity: Math.min(1, p * 2), backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 51px, #E4DFD2 51px 53px)'}}>
                  <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 200, color: C.ink}}>{i + 1}</div>
                </div>
              );
            })}
          </div>
        </Scene>
        <BigNum f={f} at={numsA} n="1" bg={C.mint} fg={C.ink} />
        <BigNum f={f} at={numsA + 9} n="2" bg={C.gold} fg={C.ink} />
        <BigNum f={f} at={numsA + 18} n="3" bg={C.ink} fg={C.paper} />

        {/* S4 · prompt 1 in the phone, web search on */}
        <Scene f={f} a={p1A} b={tabA} inFx="whip" outFx="whip" dIn={9} dOut={9}>
          {(() => {
            const flip = r(f, p1A, p1A + 12, IO);
            return (
              <>
                <div style={{position: 'absolute', left: 70, top: 250, transform: `perspective(1800px) rotateY(${(1 - flip) * 70}deg)`, transformOrigin: 'left center'}}>
                  <Phone time="12:28" h={760}>
                    <Bubble size={29} show={f >= p1A + 6}><Typed f={f} at={p1A + 6} text="Research what ChatGPT, Claude and Gemini are each best at right now, and what each paid plan costs per month today." size={29} cps={3.2} caretOff={L[8]} /></Bubble>
                    <div style={{marginTop: 26}}>{f >= w(7, 11) && <Searching f={f} at={w(7, 11)} text="Searching the web" />}</div>
                  </Phone>
                </div>
                <div style={{position: 'absolute', left: 580, top: 300, width: 440}}>
                  <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 64, lineHeight: 1.02, color: C.ink, opacity: r(f, p1A + 4, p1A + 12)}}>
                    Prompt 1<br /><span style={{fontFamily: 'Newsreader', fontStyle: 'italic', fontWeight: 600, color: C.green}}>go broad</span>
                  </div>
                  {/* toggle */}
                  {f >= toggleAt - 6 && (() => {
                    const on = r(f, toggleAt, toggleAt + 6, IO);
                    const p = r(f, toggleAt - 6, toggleAt + 2, BACK);
                    return (
                      <div style={{marginTop: 70, display: 'flex', alignItems: 'center', gap: 20, background: C.card, border: `4px solid ${C.ink}`, borderRadius: 20, padding: '20px 22px', transform: `scale(${lerp(0.7, 1, p)})`, opacity: Math.min(1, p * 2)}}>
                        <div style={{width: 120, height: 66, borderRadius: 33, background: on > 0.5 ? C.mint : '#CFC9BC', border: `4px solid ${C.ink}`, position: 'relative'}}>
                          <div style={{position: 'absolute', top: 5, left: lerp(6, 60, on), width: 48, height: 48, borderRadius: 24, background: C.card, border: `3px solid ${C.ink}`}} />
                        </div>
                        <div style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 44, color: C.ink, lineHeight: 1}}>Web search<br /><span style={{fontFamily: 'Plex', fontWeight: 500, fontSize: 28, color: on > 0.5 ? C.green : C.muted}}>{on > 0.5 ? 'on' : 'off'}</span></div>
                      </div>
                    );
                  })()}
                  {f >= strikeA && (
                    <div style={{marginTop: 46, background: C.note, border: `3px solid ${C.ink}`, borderRadius: 8, padding: '14px 18px', transform: 'rotate(-2deg)', width: 400, height: 92, position: 'relative', overflow: 'hidden'}}>
                      <Sequence from={strikeA} durationInFrames={40} layout="none">
                        <StrikethroughReplace from="prices from memory" to="today's prices" fontSize={38} color={C.ink} fontWeight={800} lineColor={C.red} />
                      </Sequence>
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </Scene>

        {/* S5 · the receipt (real prices), then our note: a tie */}
        <Scene f={f} a={tabA} b={limA} inFx="whip" outFx="whip" dIn={9} dOut={9}>
          <div style={{position: 'absolute', left: 70, right: 70, top: 280, background: C.card, border: `4px solid ${C.ink}`, borderRadius: 18, padding: '44px 48px 34px', transform: `rotate(${lerp(-4, -1.5, r(f, tabA, tabA + 30))}deg)`, boxShadow: '0 18px 0 rgba(24,23,20,0.08)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
              <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 64, color: C.ink}}>Entry plans</div>
              <Mono size={28}>per month · US</Mono>
            </div>
            <div style={{borderTop: `3px dashed ${C.ink}`, margin: '22px 0 14px'}} />
            {PRICES.map(([a, b], i) => {
              const at = w(9, 1) - 2 + i * 6;
              const p = r(f, at, at + 6);
              return (
                <div key={a} style={{display: 'flex', alignItems: 'center', gap: 16, height: 150, opacity: p, transform: `translateX(${(1 - p) * -40}px)`}}>
                  <div style={{fontFamily: 'Archivo', fontWeight: 700, fontSize: 58, color: C.ink, whiteSpace: 'nowrap'}}>{a}</div>
                  <div style={{flex: 1, borderBottom: `4px dotted ${C.muted}`, transform: 'translateY(16px)'}} />
                  <div style={{minWidth: 250, textAlign: 'right'}}>{f >= at && <SlotRoll f={f} at={at} to={b} size={84} color={C.ink} />}</div>
                </div>
              );
            })}
            <div style={{borderTop: `4px solid ${C.ink}`, margin: '18px 0 16px'}} />
            <Mono size={24}>{REAL} · 12:28</Mono>
          </div>
          {f >= w(9, 5) - 4 && (
            <div style={{position: 'absolute', left: 120, top: 1000}}>
              <Sticker p={r(f, w(9, 5) - 4, w(9, 5) + 6)} bg={C.card} rot={-4} size={60} style={{color: C.red, fontFamily: 'Newsreader', fontStyle: 'italic', fontWeight: 700}}>all ≈ $20 → a tie</Sticker>
            </div>
          )}
        </Scene>

        {/* S6 · your limits (prompt 2) → Gemini torn out */}
        <Scene f={f} a={limA} b={p3A} inFx="whip" outFx="none" dIn={9}>
          <div style={{position: 'absolute', left: 66, right: 66, top: 250}}>
            <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 84, lineHeight: 1.0, letterSpacing: -2, color: C.ink}}>
              Prompt 2 · <span style={{fontFamily: 'Newsreader', fontStyle: 'italic', fontWeight: 600, color: C.green}}>my limits</span>
            </div>
            <div style={{marginTop: 34, background: C.card, border: `4px solid ${C.ink}`, borderRadius: 22, padding: '22px 26px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 40, color: C.ink}}>Your limits</span>
                <span style={{display: 'flex', gap: 10}}>{[C.mint, C.gold, C.green].map((c, i) => <span key={i} style={{width: 30, height: 30, borderRadius: 15, border: `3px solid ${C.ink}`, background: f >= chipAt[i] ? c : 'transparent'}} />)}</span>
              </div>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 18, minHeight: 74}}>
                {['product pages', 'small tools', '€20 a month'].map((t, i) => {
                  const p = r(f, chipAt[i] - 3, chipAt[i] + 6, BACK);
                  return p > 0 ? <span key={t} style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 42, color: C.ink, background: [C.mint, C.gold, '#BFE3CD'][i], border: `3px solid ${C.ink}`, borderRadius: 40, padding: '8px 24px', transform: `scale(${lerp(0.5, 1, p)})`, opacity: Math.min(1, p * 2), display: 'inline-block'}}>{t}</span> : null;
                })}
              </div>
            </div>
            <div style={{marginTop: 40, display: 'flex', flexDirection: 'column', gap: 18}}>
              {PRICES.map(([a], i) => {
                const gem = i === 2;
                const tear = gem ? r(f, tearAt, tearAt + 12, IN) : 0;
                const row = (half: 'l' | 'r' | 'all') => (
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: C.dark, border: `4px solid ${C.ink}`, borderRadius: 18, padding: '22px 28px', fontFamily: 'Archivo', fontWeight: 700, fontSize: 50, color: '#E6E6E6',
                    clipPath: half === 'l' ? 'polygon(0 0, 52% 0, 47% 30%, 53% 55%, 46% 80%, 50% 100%, 0 100%)' : half === 'r' ? 'polygon(52% 0, 100% 0, 100% 100%, 50% 100%, 46% 80%, 53% 55%, 47% 30%)' : undefined}}>
                    <span>{a}</span><span style={{fontFamily: 'Plex', fontSize: 28, color: '#9A9A9A'}}>{gem && f >= tearAt ? 'cut · prompt 2' : 'in'}</span>
                  </div>
                );
                if (!gem || f < tearAt) return <div key={a} style={{opacity: r(f, limA + 8 + i * 4, limA + 16 + i * 4)}}>{row('all')}</div>;
                return (
                  <div key={a} style={{position: 'relative', height: 108}}>
                    <div style={{position: 'absolute', inset: 0, transform: `translate(${-tear * 260}px, ${tear * 120}px) rotate(${-tear * 14}deg)`, opacity: 1 - r(f, tearAt + 8, tearAt + 14)}}>{row('l')}</div>
                    <div style={{position: 'absolute', inset: 0, transform: `translate(${tear * 260}px, ${tear * 160}px) rotate(${tear * 16}deg)`, opacity: 1 - r(f, tearAt + 8, tearAt + 14)}}>{row('r')}</div>
                  </div>
                );
              })}
            </div>
            {f >= tearAt + 2 && <div style={{position: 'absolute', right: 0, top: 800}}><Stamp text="Gemini: cut" p={r(f, tearAt + 2, tearAt + 9, BACK)} rot={-6} size={44} /></div>}
          </div>
        </Scene>

        {/* S7 · prompt 3 */}
        <BigNum f={f} at={p3A} n="3" bg={C.ink} fg={C.mint} dur={8} />
        <Scene f={f} a={p3A + 8} b={verdictA} inFx="rise" outFx="none" dIn={8}>
          <div style={{position: 'absolute', left: 360, top: 250}}>
            <Phone time="12:29" h={820}>
              <Bubble size={32} show={f >= p3A + 10}><Typed f={f} at={p3A + 10} text="Of these, which one specifically should I start with, and why?" size={32} cps={2.6} caretOff={verdictA} /></Bubble>
              <div style={{marginTop: 30}}>{f >= w(12, 5) && <Searching f={f} at={w(12, 5)} text="Thinking" />}</div>
            </Phone>
          </div>
          <div style={{position: 'absolute', left: 66, top: 260, fontFamily: 'Archivo', fontWeight: 900, fontSize: 52, lineHeight: 1.0, color: C.ink, width: 290}}>Prompt 3<br /><span style={{fontFamily: 'Newsreader', fontStyle: 'italic', fontWeight: 600, color: C.green}}>pick one</span></div>
        </Scene>

        {/* S8 · the verdict (lens-zoom), the hub, the objection, when to switch, my call */}
        <Scene f={f} a={verdictA} b={ctaA} inFx="zoom" outFx="none" dIn={12}>
          {(() => {
            const hub = r(f, hubA, hubA + 10, IO);
            const back = r(f, backAt, backAt + 10, BACK);
            const arrow = f >= arrowAt;
            return (
              <div style={{position: 'absolute', inset: 0, transform: `scale(${1 + dol * 0.12})`, transformOrigin: '540px 520px'}}>
                {/* dolly background pull: ruled paper compresses while the subject grows */}
                {dol > 0 && <AbsoluteFill style={{...PAPER, transform: `scale(${1 - dol * 0.3})`, zIndex: -1}} />}
                {/* verdict card */}
                <div style={{position: 'absolute', left: 70, right: 70, top: lerp(430, 240, hub), transform: `scale(${lerp(1.0, 0.86, hub)})`, transformOrigin: '470px 0px'}}>
                  <div style={{background: C.card, border: `4px solid ${C.ink}`, borderRadius: 24, padding: '28px 32px', fontFamily: 'Archivo', fontWeight: 600, fontSize: 54, lineHeight: 1.2, color: C.ink}}>
                    “My suggested setup is simple: spend your €20 on <Hl f={f} at={w(13, 0) - 2} dark={false}>ChatGPT Plus</Hl>, keep the other two free, and use them as independent reviewers.”
                    <div style={{marginTop: 12}}><Mono size={22}>{REAL} · 12:29</Mono></div>
                  </div>
                  {f >= stampAt && <div style={{position: 'absolute', right: -10, top: -34}}><Stamp text="its pick" p={r(f, stampAt, stampAt + 7, BACK)} color={C.ink} rot={6} size={46} /></div>}
                </div>
                {/* hub (PileUp): ChatGPT Plus centre, two free reviewers */}
                {hub > 0 && (
                  <div style={{position: 'absolute', left: 0, right: 0, top: 800, height: 420, opacity: hub * (1 - r(f, arrowAt - 6, arrowAt + 2) * 0.0)}}>
                    <svg width={1080} height={420} style={{position: 'absolute', left: 0, top: 0}}>
                      {f < arrowAt + 2 && [[240, 330], [840, 330]].map(([x, y], i) => {
                        const d = r(f, w(13, 5) - 2 + i * 6, w(13, 5) + 8 + i * 6, IO);
                        return <path key={i} d={`M540 110 C 540 220, ${x} 200, ${x} ${y - 60}`} stroke={C.ink} strokeWidth={5} fill="none" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - d} strokeLinecap="round" />;
                      })}
                    </svg>
                    <div style={{position: 'absolute', left: 290, top: 20, width: 500, height: 120, background: C.mint, border: `4px solid ${C.ink}`, borderRadius: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Archivo', fontWeight: 900, fontSize: 50, color: C.ink, whiteSpace: 'nowrap', transform: `scale(${lerp(0.6, 1, r(f, hubA, hubA + 8, BACK))})`}}>ChatGPT Plus · $20</div>
                    {['Claude', 'Gemini'].map((t, i) => {
                      const p = r(f, w(13, 8) - 2 + i * 6, w(13, 8) + 7 + i * 6, BACK);
                      return (
                        <div key={t} style={{position: 'absolute', left: i === 0 ? 80 : 670, top: 270, width: 320, height: 120, background: C.card, visibility: f >= arrowAt + 2 ? 'hidden' : 'visible', border: `4px solid ${C.ink}`, borderRadius: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `scale(${lerp(0.5, 1, p)})`, opacity: Math.min(1, p * 2)}}>
                          <span style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 46, color: C.ink}}>{t}</span>
                          <Mono size={24}>free · reviewer</Mono>
                        </div>
                      );
                    })}
                  </div>
                )}
                {/* objection note */}
                {f >= noteAt && f < arrowAt + 4 && (
                  <div style={{position: 'absolute', left: 60, top: 640, opacity: 1 - r(f, arrowAt - 4, arrowAt + 4)}}>
                    <Sticker p={r(f, noteAt, noteAt + 8)} bg={C.card} rot={-5} size={44} style={{color: C.red, fontFamily: 'Newsreader', fontStyle: 'italic', fontWeight: 700}}>ChatGPT picked itself?</Sticker>
                  </div>
                )}
                {/* the 12:27 answer comes back */}
                {f >= backAt && f < arrowAt + 4 && (
                  <div style={{position: 'absolute', left: 700, top: 1100 - back * 460, transform: `rotate(${lerp(10, 4, back)}deg) scale(0.7)`, transformOrigin: 'top left', opacity: Math.min(1, back * 2) * (1 - r(f, arrowAt - 4, arrowAt + 4))}}>
                    <div style={{background: C.gpt, border: `4px solid ${C.ink}`, borderRadius: 20, padding: '14px 22px', width: 410}}>
                      <Mono color="#9A9A9A" size={22}>12:27 · one line</Mono>
                      <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 60, color: C.ink, background: C.gold, borderRadius: 12, padding: '6px 14px', marginTop: 8, textAlign: 'center'}}>Claude Pro</div>
                    </div>
                  </div>
                )}
                {/* when to switch: excerpt + ink arrow */}
                {arrow && (
                  <>
                    <div style={{position: 'absolute', left: 70, right: 70, top: 1000, opacity: r(f, arrowAt - 4, arrowAt + 6) * (1 - r(f, w(16, 3) - 8, w(16, 3))), transform: `translateY(${(1 - r(f, arrowAt - 4, arrowAt + 8)) * 60}px)`}}>
                      <div style={{background: C.gpt, border: `4px solid ${C.ink}`, borderRadius: 20, padding: '16px 24px', fontFamily: 'Archivo', fontWeight: 500, fontSize: 36, lineHeight: 1.25, color: C.gptText}}>
                        “If you eventually find yourself spending most of your time building software, <Hl f={f} at={w(15, 11) - 2} color={C.gold}>Claude Pro</Hl> becomes a strong candidate.”
                      </div>
                    </div>
                    <div style={{position: 'absolute', inset: 0}}>
                      <Sequence from={arrowAt} layout="none"><InkArrow from={{x: 520, y: 945}} to={{x: 330, y: 1010}} curvature={0.5} color={C.ink} strokeWidth={7} drawDur={10} headSize={24} seed="n8arr" /></Sequence>
                    </div>
                    <div style={{position: 'absolute', left: 640, top: 935, opacity: r(f, arrowAt + 8, arrowAt + 14) * (1 - r(f, w(16, 3) - 8, w(16, 3))), fontFamily: 'Newsreader', fontStyle: 'italic', fontWeight: 600, fontSize: 48, color: C.green, transform: 'rotate(-3deg)'}}>when to switch</div>
                  </>
                )}
                {/* my call: cursor clicks the box (PhoneFilm) */}
                {f >= w(16, 3) - 6 && (() => {
                  const p = r(f, w(16, 3) - 6, w(16, 3) + 2, BACK);
                  const press = r(f, clickAt, clickAt + 3) * (1 - r(f, clickAt + 3, clickAt + 6));
                  const ticked = f >= clickAt + 2;
                  const cx = lerp(1000, 152, r(f, w(16, 3), clickAt, IO)), cy = lerp(1300, 1120, r(f, w(16, 3), clickAt, IO));
                  return (
                    <>
                      <div style={{position: 'absolute', left: 90, top: 1080, display: 'flex', alignItems: 'center', gap: 20, background: C.card, border: `4px solid ${C.ink}`, borderRadius: 18, padding: '14px 26px', transform: `scale(${lerp(0.6, 1, p)})`, opacity: Math.min(1, p * 2)}}>
                        <div style={{width: 64, height: 64, borderRadius: 12, border: `5px solid ${C.ink}`, background: ticked ? C.mint : C.card, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                          {ticked && <svg viewBox="0 0 24 24" width={50} height={50} fill="none" stroke={C.ink} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - r(f, clickAt + 2, clickAt + 8)} /></svg>}
                        </div>
                        <span style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 60, color: C.ink}}>the call is <span style={{fontFamily: 'Newsreader', fontStyle: 'italic', color: C.green}}>mine</span></span>
                      </div>
                      {f < ctaA && <Cursor x={cx} y={cy} press={press} />}
                    </>
                  );
                })()}
              </div>
            );
          })()}
        </Scene>

        {/* S9 · CTA after a vertical stripe wipe (PileUp) */}
        <Scene f={f} a={ctaA + 8} b={END} inFx="none" outFx="fade" dOut={8}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 250, textAlign: 'center', fontFamily: 'Archivo', fontWeight: 900, fontSize: 84, lineHeight: 1.0, letterSpacing: -2, color: C.ink, opacity: r(f, ctaA + 8, ctaA + 16)}}>
            The <span style={{fontFamily: 'Newsreader', fontStyle: 'italic', fontWeight: 600, color: C.green}}>3 prompts</span>, free
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 400, height: 420}}>
            {['Go broad', 'Add your limits', 'Pick one'].map((t, i) => {
              const p = r(f, ctaA + 10 + i * 4, ctaA + 22 + i * 4, BACK);
              const lit = Math.sin(r(f, w(18, 0) - 2 + i * 7, w(18, 0) + 10 + i * 7) * Math.PI);
              const sway = Math.sin((f - ctaA) / 14 + i * 1.7) * 1.6;
              const rot = (i - 1) * 9 * p + sway, x = 540 - 150 + (i - 1) * 230 * p, y = 40 + Math.abs(i - 1) * 30 * p - lit * 40;
              return (
                <div key={t} style={{position: 'absolute', left: x, top: y, width: 300, height: 360, background: lit > 0.3 ? '#E9FBF1' : C.card, border: `${4 + lit * 3}px solid ${lit > 0.3 ? C.green : C.ink}`, borderRadius: 22, transform: `rotate(${rot}deg) translateY(${(1 - p) * -260}px) scale(${1 + lit * 0.08})`, opacity: Math.min(1, p * 2), padding: 26, boxSizing: 'border-box', zIndex: lit > 0.3 ? 5 : 1,
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 41px, #E4DFD2 41px 43px)', backgroundPositionY: 110}}>
                  <div style={{width: 70, height: 70, borderRadius: 35, background: [C.mint, C.gold, C.ink][i], color: i === 2 ? C.paper : C.ink, fontFamily: 'Archivo', fontWeight: 900, fontSize: 44, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</div>
                  <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 44, color: C.ink, marginTop: 18, lineHeight: 1.05}}>{t}</div>
                </div>
              );
            })}
          </div>
          {(() => {
            const p = r(f, ctaA + 14, ctaA + 24, BACK);
            const kwAt = w(17, kwI) - 6;
            const posted = f >= w(17, kwI) + 10;
            return (
              <div style={{position: 'absolute', left: 70, right: 70, top: 900, transform: `scale(${lerp(0.7, 1, p)})`, opacity: Math.min(1, p * 2)}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 16, background: C.card, border: `4px solid ${C.ink}`, borderRadius: 60, padding: '18px 22px 18px 34px'}}>
                  <span style={{fontFamily: 'Archivo', fontWeight: 600, fontSize: 40, color: C.muted, whiteSpace: 'nowrap'}}>{ig ? 'Add a comment…' : 'Message…'}</span>
                  <span style={{flex: 1}}><Typed f={f} at={kwAt} text="NARROW" size={56} cps={0.9} color={C.ink} weight={900} caretOff={w(17, kwI) + 10} /></span>
                  <span style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 38, color: posted ? C.card : C.green, background: posted ? C.green : 'transparent', borderRadius: 30, padding: '10px 22px', transform: `scale(${posted ? lerp(1.25, 1, r(f, w(17, kwI) + 10, w(17, kwI) + 16, BACK)) : 1})`}}>{ig ? 'Post' : 'Send'}</span>
                </div>
                <div style={{marginTop: 22, textAlign: 'center', opacity: r(f, w(17, 3), w(17, 3) + 8)}}><Mono size={28} color={C.ink}>free guide · The Narrowing Method · section 03, p. 4</Mono></div>
              </div>
            );
          })()}
        </Scene>
        {/* stripe wipe into the CTA */}
        {f >= ctaA && f < ctaA + 16 && (
          <AbsoluteFill style={{pointerEvents: 'none'}}>
            {Array.from({length: 8}).map((_, i) => {
              const a = ctaA + i * 0.8;
              const pin = r(f, a, a + 6, IO), pout = r(f, a + 7, a + 13, IO);
              return <div key={i} style={{position: 'absolute', left: i * 135, width: 136, top: 0, bottom: 0, background: i % 2 ? C.ink : C.mint, transform: `scaleY(${pin - pout})`, transformOrigin: pout > 0 ? 'bottom' : 'top'}} />;
            })}
          </AbsoluteFill>
        )}

        {/* back to frame 0 (loop) */}
        {f >= END && (
          <div style={{position: 'absolute', inset: 0, opacity: r(f, END + 2, END + 9), transform: `scale(${lerp(1.1, 1, r(f, END + 2, END + 16, OUT))})`}}>
            <Hook f={f} m={m} still />
          </div>
        )}
      </div>

      <SectionTag f={f} m={m} end={END} />
      <Sage f={f} m={m} mouth={(platform === 'ig' ? MIG : MTT) as number[]} end={END} />
      <Caption f={f} z={z} dark={(f >= numsA + 18 && f < numsA + 27) || (f >= p3A && f < p3A + 8)} />
    </AbsoluteFill>
  );
};

export const N8Cover: React.FC = () => {
  const m = MM.ig;
  return (
    <AbsoluteFill style={PAPER}>
      <Fonts />
      <Hook f={0} m={m} still />
    </AbsoluteFill>
  );
};
