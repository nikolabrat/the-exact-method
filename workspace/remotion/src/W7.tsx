// W-7 "2 prompts built this pricing calculator" — 10 Zero-Ambiguity Prompts #01 + #02 (keyword PROMPT).
// Real runs 22 Nov 2026: R1 ChatGPT (build plan, orders), R2 Claude (built the calculator, fixed rounding).
// P6 system (paper, cards, camera, captions, Sage bust) with real open-mouth Sage images. Frame 0 = last frame.
// remocn: ScribbleCircle, InkArrow, TrimBurst, SmashCount, CrumpleToss, Caret, whipPan, paperTear, HalftoneCut,
// ImpactShake, CheckList.
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {ScribbleCircle} from '@/components/remocn/scribble-circle';
import {TrimBurst} from '@/components/remocn/trim-burst';
import {Caret} from '@/components/remocn/caret';
import {whipPan} from '@/components/remocn/whip-pan';
import {paperTear} from '@/components/remocn/paper-tear';
import {SmashCount} from '@/components/remocn/smash-count';
import {CrumpleToss} from '@/components/remocn/crumple-toss';
import {InkArrow} from '@/components/remocn/ink-arrow';
import {HalftoneCut} from '@/components/remocn/halftone-cut';
import {ImpactShake} from '@/components/remocn/impact-shake';
import {CheckList, checkListEnterEnd} from '@/components/remocn/check-list';
import TIG from './w7timing_ig.json';
import TTT from './w7timing_tt.json';
import MIG from './w7mouth_ig.json';
import MTT from './w7mouth_tt.json';

const C = {paper: '#E9E5DA', rule: '#D7D1C3', card: '#FCFBF7', ink: '#181714', mint: '#6BE0A0', gold: '#F2B632', red: '#D9534A', muted: '#7A7468', green: '#2F7A52', line: '#DCD7CB', soft: '#F1EEE4', note: '#F6E7A8'};
const OUT = Easing.bezier(0.42, 0, 0.18, 1);
const IO = Easing.bezier(0.65, 0, 0.35, 1);
const BACK = Easing.out(Easing.back(1.8));
const IN = Easing.in(Easing.cubic);
const r = (f: number, a: number, b: number, e = OUT) => interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Wd = {w: string; s: number; e: number};
type Line = {start: number; end: number; text: string; words: Wd[]};
type Chunk = {words: Wd[]; from: number};
// captions: break at punctuation, max 3 words per chunk, balanced
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
const mk = (T: any) => ({L: T.lines.map((l: Line) => l.words[0].s) as number[], w: (li: number, wi: number) => T.lines[li].words[wi].s as number, TOTAL: T.total as number});
type MT = ReturnType<typeof mk>;
const MM = {ig: mk(TIG), tt: mk(TTT)};
export const W7_TOTAL = {ig: Z.ig.TOTAL, tt: Z.tt.TOTAL};

const Fonts: React.FC = () => (
  <style>{`
@font-face{font-family:Archivo;src:url(${staticFile('archivo-variable.woff2')}) format('woff2');font-weight:100 900;font-stretch:62% 125%}
@font-face{font-family:Newsreader;src:url(${staticFile('newsreader-variable.woff2')}) format('woff2');font-weight:200 800;font-style:normal italic}
@font-face{font-family:Plex;src:url(${staticFile('plex-mono-500.woff2')}) format('woff2');font-weight:500}
`}</style>
);

// ---------- captions ----------
const ChunkView: React.FC<{f: number; ch: Chunk; o: number; loopIn: boolean}> = ({f, ch, o, loopIn}) => {
  const hlA = (i: number) => {
    if (loopIn) return i === 0 ? 1 : 0;
    const s0 = ch.words[i].s;
    const next = i < ch.words.length - 1 ? ch.words[i + 1].s : 1e9;
    const first = i === 0 ? 1 : r(f, s0 - 3, s0 - 1);
    return (i === 0 && f < s0 ? 1 : first) * (1 - r(f, next - 3, next - 1));
  };
  return (
    <div style={{position: 'absolute', left: 66, top: 1100, width: 720, display: 'flex', flexWrap: 'wrap', columnGap: 14, rowGap: 4, opacity: o}}>
      {ch.words.map((w, i) => (
        <span key={i} style={{position: 'relative', fontFamily: 'Archivo', fontWeight: 900, fontSize: 66, lineHeight: 1.12, letterSpacing: -1.5, color: C.ink, padding: '0 8px', margin: '0 -8px'}}>
          <span style={{position: 'absolute', inset: 0, borderRadius: 10, background: C.mint, opacity: hlA(i)}} />
          <span style={{position: 'relative'}}>{w.w}</span>
        </span>
      ))}
    </div>
  );
};
const Caption: React.FC<{f: number; z: ZT}> = ({f, z}) => {
  const seamOut = r(f, z.TOTAL - 10, z.TOTAL - 6, IO), seamIn = r(f, z.TOTAL - 6, z.TOTAL - 2, IO);
  if (f >= z.TOTAL - 10) {
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
      {ci > 0 && xo < 1 && <ChunkView f={f} ch={z.CHUNKS[ci - 1]} o={1 - xo} loopIn={false} />}
      <div style={{transform: `translateY(${(1 - xi) * 10}px)`}}><ChunkView f={f} ch={z.CHUNKS[ci]} o={xi} loopIn={false} /></div>
    </>
  );
};

// ---------- Sage: real mouth images (closed / mid / open), same framing per pose ----------
type Pose = 'sage' | 's-check' | 's-finger' | 's-point' | 's-present' | 's-shrug' | 's-sigh' | 's-think';
const MOUTHX: Record<Pose, number> = {sage: 162.5, 's-check': 169.0, 's-finger': 205.5, 's-point': 329.5, 's-present': 347.5, 's-shrug': 278.0, 's-sigh': 195.0, 's-think': 156.5};
const Sage: React.FC<{f: number; m: MT; mouth: number[]; end: number}> = ({f, m, mouth, end}) => {
  const L = m.L, w = m.w, T = m.TOTAL;
  const POSES: [number, Pose][] = [
    [0, 's-present'], [w(0, 8) - 3, 's-point'], [L[1] - 3, 's-finger'], [w(1, 2) - 3, 'sage'],
    [L[2] - 3, 's-think'], [L[3] - 3, 's-point'], [L[4] - 3, 's-check'], [w(4, 9) - 3, 's-present'],
    [L[5] - 3, 's-shrug'], [L[6] - 3, 's-finger'], [w(6, 9) - 3, 's-think'], [w(6, 16) - 3, 's-point'],
    [L[7] - 3, 's-sigh'], [L[8] - 3, 's-check'], [L[9] - 3, 's-finger'], [L[10] - 3, 's-present'],
    [w(10, 8) - 3, 's-check'], [L[11] - 3, 's-point'], [L[12] - 3, 'sage'], [end - 2, 's-present'],
  ];
  let idx = 0;
  POSES.forEach(([t], i) => { if (f >= t) idx = i; });
  const [t0, p] = POSES[idx];
  const d = f - t0;
  const pop = idx > 0 && d < 6 ? 0.035 * (1 - d / 6) : 0;
  const breathe = Math.sin((2 * Math.PI * f * 5) / T);
  const k = 1.06, H = 1121 * k;
  const left = 872 - MOUTHX[p] * k;
  const lv = mouth[f] ?? 0;
  const src = lv === 0 ? `sage/${p}.png` : lv === 1 ? `sage/${p}-mid.png` : `sage/${p}-open.png`;
  return (
    <div style={{position: 'absolute', left, top: 1388 + breathe * 2.5, width: 700, height: H, transformOrigin: `${MOUTHX[p] * k}px ${H * 0.45}px`, transform: `scale(${1 + pop + breathe * 0.004})`}}>
      <Img src={staticFile(src)} style={{position: 'absolute', left: 0, top: 0, height: H}} />
    </div>
  );
};

// ---------- building blocks ----------
const WhipP = whipPan({direction: 'left', blur: 18}).component as React.FC<any>;
const TEAR = paperTear({seed: 11, roughness: 0.6, edgeColor: '#FCFBF7', impact: 1});
const TearP = TEAR.component as React.FC<any>;
type InFx = 'rise' | 'whip' | 'zoom' | 'push' | 'page' | 'pull';
type OutFx = 'fade' | 'whip' | 'crash' | 'fly' | 'page' | 'shrink' | 'none';
const Card: React.FC<{f: number; inAt: number; outAt: number; children: React.ReactNode; title: React.ReactNode; tag?: React.ReactNode; first?: boolean; inFx?: InFx; outFx?: OutFx; top?: number; h?: number}> = ({f, inAt, outAt, children, title, tag, first, inFx = 'rise', outFx = 'fade', top = 270, h = 790}) => {
  if ((f < inAt && !first) || f >= outAt + 11) return null;
  const pin = first ? 1 : r(f, inAt, inAt + 11, inFx === 'push' ? BACK : inFx === 'whip' ? (t: number) => t : OUT);
  const pout = outFx === 'none' ? 0 : r(f, outAt, outAt + 10, outFx === 'whip' ? (t: number) => t : outFx === 'fade' || outFx === 'shrink' ? IO : IN);
  const exiting = f >= outAt && outFx !== 'none';
  let op = 1, tf = '', blur = 0, origin = 'center center';
  if (!exiting && pin < 1) {
    if (inFx === 'rise') { op = Math.min(1, pin * 1.6); tf = `translateY(${(1 - pin) * 70}px)`; }
    if (inFx === 'zoom') { op = Math.min(1, pin * 2); tf = `scale(${lerp(0.82, 1, pin)})`; blur = (1 - pin) * 14; }
    if (inFx === 'push') { tf = `translateY(${(1 - pin) * 1250}px) rotate(${(1 - pin) * 4}deg)`; }
    if (inFx === 'page') { tf = `perspective(2200px) rotateY(${(1 - pin) * 85}deg)`; origin = 'right center'; op = Math.min(1, pin * 3); }
    if (inFx === 'pull') { op = Math.min(1, pin * 1.5); tf = `scale(${lerp(1.22, 1, pin)})`; blur = (1 - pin) * 8; }
  }
  if (exiting) {
    if (outFx === 'fade') { op = 1 - pout; tf = `translateY(${-pout * 50}px) scale(${1 - pout * 0.02})`; }
    if (outFx === 'crash') { tf = `scale(${lerp(1, 2.6, pout)})`; blur = pout * 16; op = 1 - r(f, outAt + 6, outAt + 10); }
    if (outFx === 'fly') { tf = `translateY(${-pout * 1400}px) rotate(${-pout * 9}deg)`; }
    if (outFx === 'page') { tf = `perspective(2200px) rotateY(${-pout * 88}deg)`; origin = 'left center'; op = 1 - r(f, outAt + 7, outAt + 10); }
    if (outFx === 'shrink') { op = 1 - pout; tf = `scale(${lerp(1, 0.86, pout)})`; }
  }
  const tape = (side: 'l' | 'r') => <div key={side} style={{position: 'absolute', [side === 'l' ? 'left' : 'right']: side === 'l' ? 30 : 190, top: top - 22, width: 150, height: 46, background: 'rgba(240,226,190,0.78)', border: '1px solid rgba(160,140,100,0.35)', transform: `rotate(${side === 'l' ? -8 : 7}deg)`, zIndex: 4} as React.CSSProperties} />;
  const body = (
    <div style={{position: 'absolute', inset: 0, opacity: op, transform: tf || undefined, transformOrigin: origin, filter: blur > 0.2 ? `blur(${blur}px)` : undefined}}>
      <div style={{position: 'absolute', left: 70, right: 70, top, height: h, background: C.card, border: `4px solid ${C.ink}`, borderRadius: 30, padding: '26px 38px', overflow: 'hidden', boxShadow: '0 14px 0 rgba(24,23,20,0.08)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16, borderBottom: `3px solid ${C.line}`, minHeight: 66, position: 'relative', zIndex: 3}}>
          <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 46, letterSpacing: -1}}>{title}</span>
          {tag}
        </div>
        <div style={{position: 'relative', marginTop: 22, height: h - 150}}>{children}</div>
      </div>
      {tape('l')}{tape('r')}
    </div>
  );
  if (exiting && outFx === 'whip') return <WhipP presentationDirection="exiting" presentationProgress={pout} passedProps={{direction: 'left', blur: 18}}>{body}</WhipP>;
  if (!exiting && inFx === 'whip' && pin < 1) return <WhipP presentationDirection="entering" presentationProgress={pin} passedProps={{direction: 'left', blur: 18}}>{body}</WhipP>;
  return body;
};
type Punch = [number, number, number, number, number];
const camera = (f: number, total: number, punches: Punch[], shakes: [number, number][]) => {
  const ph = (2 * Math.PI * f) / total;
  let k = 1 + 0.018 * Math.sin(ph * 3), tx = 12 * Math.sin(ph * 2), ty = 6 * Math.sin(ph * 4);
  punches.forEach(([a, b, s, x, y]) => {
    const wt = r(f, a, a + 9, IO) * (1 - r(f, b - 9, b, IO));
    if (wt <= 0) return;
    const kk = 1 + (s - 1) * wt;
    tx += (x - 540) * (1 - kk); ty += (y - 670) * (1 - kk); k *= kk;
  });
  shakes.forEach(([t, amp]) => {
    const d = f - t;
    if (d < 0 || d > 14) return;
    const e = amp * Math.exp(-d / 3.5);
    tx += e * Math.sin(d * 2.4); ty += e * 0.7 * Math.cos(d * 3.1);
  });
  return `translate(${tx}px, ${ty}px) scale(${k}) rotate(${0.45 * Math.sin(ph * 2 + 1)}deg)`;
};
const Mono: React.FC<{children: React.ReactNode; color?: string; size?: number}> = ({children, color = C.muted, size = 28}) => (
  <span style={{fontFamily: 'Plex', fontSize: size, color}}>{children}</span>
);
const Stamp: React.FC<{text: string; p: number; color?: string; rot?: number; size?: number}> = ({text, p, color = C.red, rot = -6, size = 40}) => (
  <span style={{display: 'inline-block', fontFamily: 'Archivo', fontWeight: 900, fontSize: size, letterSpacing: 1, color, border: `4px solid ${color}`, borderRadius: 12, background: C.card,
    padding: '4px 18px', whiteSpace: 'nowrap', transform: `rotate(${rot}deg) scale(${lerp(1.5, 1, p)})`, opacity: Math.min(1, p * 3)}}>{text}</span>
);
const Tick: React.FC<{d: number; s?: number; color?: string}> = ({d, s = 40, color = C.ink}) => (
  <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke={color} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - d} />
  </svg>
);
const Label: React.FC<{text: string; p: number; bg?: string; fg?: string}> = ({text, p, bg = C.ink, fg = C.card}) => (
  <span style={{display: 'inline-block', fontFamily: 'Plex', fontSize: 24, letterSpacing: 1, padding: '6px 14px', borderRadius: 8, background: bg, color: fg, opacity: p, transform: `translateY(${(1 - p) * 10}px)`}}>{text}</span>
);
const IW = 856;
const Dark: React.FC<{children: React.ReactNode; h: number; style?: React.CSSProperties}> = ({children, h, style}) => (
  <div style={{position: 'relative', width: IW, height: h, background: '#151515', borderRadius: 20, overflow: 'hidden', ...style}}>{children}</div>
);
// marker swipe behind words of re-typeset real-run text
const Hl: React.FC<{f: number; at: number; children: React.ReactNode; color?: string; still?: boolean}> = ({f, at, children, color = C.mint, still}) => {
  const p = still ? 1 : r(f, at, at + 10, IO);
  return <span style={{color: p > 0.35 ? C.ink : '#E6E6E6', backgroundImage: `linear-gradient(${color}, ${color})`, backgroundRepeat: 'no-repeat', backgroundPosition: '0 50%', backgroundSize: `${p * 100}% 100%`, padding: '0 4px', margin: '0 -4px', borderRadius: 4, boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone'}}>{children}</span>;
};
// paper sticker with tape: short labels living on the desk
const Sticker: React.FC<{p: number; children: React.ReactNode; rot?: number; bg?: string; size?: number; style?: React.CSSProperties}> = ({p, children, rot = -2, bg = C.note, size = 38, style}) => {
  if (p <= 0) return null;
  // stop-motion feel: the drop is quantized to 3-frame poses
  const q = Math.round(p * 4) / 4;
  return (
    <div style={{position: 'relative', display: 'inline-block', padding: '14px 24px', background: bg, border: `3px solid ${C.ink}`, borderRadius: 6, fontFamily: 'Archivo', fontWeight: 800, fontSize: size, color: C.ink, whiteSpace: 'nowrap',
      transform: `rotate(${rot + (1 - q) * 6}deg) scale(${lerp(1.25, 1, q)})`, opacity: Math.min(1, q * 2), ...style}}>
      <span style={{position: 'absolute', left: '50%', top: -16, width: 90, height: 28, marginLeft: -45, background: 'rgba(240,226,190,0.85)', border: '1px solid rgba(160,140,100,0.35)', transform: 'rotate(4deg)'}} />
      {children}
    </div>
  );
};
const Typed: React.FC<{f: number; at: number; text: string; cps?: number; size?: number; caretOff?: number}> = ({f, at, text, cps = 1.2, size = 58, caretOff = 1e9}) => {
  const n = Math.max(0, Math.min(text.length, Math.floor((f - at) * cps)));
  return (
    <span style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: size, letterSpacing: -1.5, color: C.ink, display: 'inline-flex', alignItems: 'center'}}>
      {text.slice(0, n)}
      {f >= at - 8 && f < caretOff && <Caret color={C.ink} width={5} height={size * 0.9} blink={n === 0 || n === text.length} marginLeft={4} />}
      <span style={{opacity: 0}}>{text.slice(n)}</span>
    </span>
  );
};
const Real: React.FC<{text: string}> = ({text}) => <Mono size={21} color="#9A9A9A">{text}</Mono>;

// ---------- the frame-0 layout: headline + the real calculator ----------
const CALC = {w: 700, h: 563, left: 190, top: 452};
const Hook: React.FC<{f: number; m: MT; still: boolean}> = ({f, m, still}) => {
  const w = m.w;
  const two = still ? 0 : Math.sin(r(f, w(0, 0) - 2, w(0, 0) + 10) * Math.PI);
  const circleAt = w(0, 4);
  return (
    <>
      <div style={{position: 'absolute', left: 70, right: 70, top: 200}}>
        <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 88, lineHeight: 1.0, letterSpacing: -2.5, color: C.ink}}>
          <span style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 82, height: 86, borderRadius: 44, background: C.ink, color: C.mint, marginRight: 18, transform: `scale(${1 + two * 0.25}) rotate(${two * -6}deg)`, verticalAlign: 'top'}}>2</span>
          prompts built this.
        </div>
        <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 88, lineHeight: 1.0, letterSpacing: -2.5, marginTop: 14, color: C.ink}}>
          <span style={{background: C.mint, padding: '0 14px', borderRadius: 12}}>No code.</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: CALC.left, top: CALC.top, width: CALC.w, height: CALC.h, transform: 'rotate(-1.5deg)'}}>
        <Img src={staticFile('w7/calc_hero.png')} style={{width: CALC.w, height: CALC.h, borderRadius: 18, border: `4px solid ${C.ink}`, display: 'block'}} />
        <div style={{position: 'absolute', left: 40, top: -20, width: 150, height: 44, background: 'rgba(240,226,190,0.82)', border: '1px solid rgba(160,140,100,0.35)', transform: 'rotate(-7deg)'}} />
        <div style={{position: 'absolute', right: 40, top: -20, width: 150, height: 44, background: 'rgba(240,226,190,0.82)', border: '1px solid rgba(160,140,100,0.35)', transform: 'rotate(6deg)'}} />
        {!still && f >= circleAt && (
          <div style={{position: 'absolute', left: 4, top: 158, width: 250, height: 110}}>
            <Sequence from={circleAt} layout="none"><ScribbleCircle width={250} height={110} color={C.gold} strokeWidth={7} durationSteps={7} seed="w7hook" /></Sequence>
          </div>
        )}
        {!still && f >= w(0, 8) && (
          <div style={{position: 'absolute', right: -40, bottom: 70}}><Stamp text="0 lines of code" p={r(f, w(0, 8), w(0, 8) + 7, BACK)} color={C.green} rot={-7} size={44} /></div>
        )}
      </div>
    </>
  );
};

// section tag under the caption (fills the left-hand space beside Sage)
const SectionTag: React.FC<{f: number; m: MT; end: number}> = ({f, m, end}) => {
  const L = m.L;
  const T: [number, string, number][] = [[0, 'the result', 0], [L[1], 'the method', 0], [L[2], 'prompt 1 · the plan', 1], [L[6], 'it caught this', 1], [L[7], 'prompt 1 · the plan', 1], [L[8], 'prompt 2 · the orders', 2], [L[10], 'Claude builds it', 3], [L[11], 'the result', 3], [L[12], 'both prompts · free', 3], [end, 'the result', 0]];
  let i = 0;
  T.forEach(([t], j) => { if (f >= t) i = j; });
  const [t0, text, step] = T[i];
  const p = i === 0 ? 1 : r(f, t0, t0 + 8, BACK);
  return (
    <div style={{position: 'absolute', left: 66, top: 1290, display: 'flex', alignItems: 'center', gap: 16}}>
      <div style={{display: 'flex', gap: 8}}>
        {[1, 2, 3].map((k) => <span key={k} style={{width: 18, height: 18, borderRadius: 9, border: `3px solid ${C.ink}`, background: k <= step ? C.ink : 'transparent'}} />)}
      </div>
      <span style={{fontFamily: 'Plex', fontSize: 30, color: C.ink, background: C.card, border: `3px solid ${C.ink}`, borderRadius: 8, padding: '6px 14px', transform: `rotate(-1.5deg) scale(${lerp(0.85, 1, p)})`, opacity: Math.min(1, p * 2), display: 'inline-block'}}>{text}</span>
    </div>
  );
};

// the 4 rows of the real plan (rows 10-13), display coords of each row inside the 856px image
const ROWS_Y = [49, 118, 187, 256];
const STEPS = ['price paid', 'pack size', 'amount used', 'the cost'];

export const W7: React.FC<{platform: 'ig' | 'tt'}> = ({platform}) => {
  const f = useCurrentFrame();
  const z = Z[platform];
  const m = MM[platform];
  const L = m.L, w = m.w;
  const ig = platform === 'ig';
  const TOTAL = m.TOTAL;
  const END = TOTAL - 21;

  // S1: 1st try stamp, two prompt cards
  const stampAt = w(1, 0);
  const dealAt = w(1, 3) - 4;
  const strikeAt = w(1, 8);
  // S4: sticker split
  const splitAt = w(4, 4);
  const stepAt = [w(4, 5), w(4, 7), w(4, 9), w(4, 13)];
  // S5: 44 strips
  const pileA = L[5] - 2, pileB = w(5, 2) - 4, dotAt = w(5, 4);
  // S6: margin
  const vsAt = w(6, 9) - 2, tossAt = w(6, 16) + 2;
  // S9: checklist ticks on "merged", "skipped", "reordered"
  const CL = ['merge steps', 'skip steps', 'reorder steps'];
  const clStep = 3, clGap = 9;
  const clClose = w(9, 3) - w(9, 1);
  const clEnter = checkListEnterEnd(CL, {step: clStep, itemGap: clGap});
  const clFrom = w(9, 1) - clEnter - 4;
  // S10/11 tear
  const tearA = w(10, 18) + 4, tearLen = 30;
  const tearP = r(f, tearA, tearA + tearLen, (t: number) => t);
  // S12 CTA
  const kwI = ig ? 1 : 2;

  const S10 = (
    <Card f={f} inAt={L[10] - 4} outAt={99999} outFx="none" inFx="whip" title="Claude" tag={<Label text="the orders, pasted in" p={r(f, L[10] + 2, L[10] + 10)} />}>
      <Dark h={579}>
        {f >= L[10] - 4 && <Sequence from={L[10] - 4} layout="none"><OffthreadVideo src={staticFile('w7/claude_build.mp4')} muted playbackRate={1.35} style={{width: IW, height: 579, objectFit: 'cover'}} /></Sequence>}
        <div style={{position: 'absolute', left: 18, top: 18}}><Label text="4 min of building · sped up" p={r(f, L[10] + 6, L[10] + 14)} bg={C.gold} fg={C.ink} /></div>
      </Dark>
      {(() => {
        const a = w(10, 8) - 2;
        const p = r(f, a, a + 10, BACK);
        if (p <= 0) return null;
        return (
          <div style={{position: 'absolute', left: -6, right: -6, top: 270, transform: `translateY(${(1 - p) * 300}px) rotate(${(1 - p) * 3 - 1}deg)`, opacity: Math.min(1, p * 2)}}>
            <div style={{background: '#222', border: `4px solid ${C.ink}`, borderRadius: 20, padding: '22px 28px', fontFamily: 'Archivo', fontSize: 37, lineHeight: 1.32, color: '#E6E6E6'}}>
              Math all passes. One display issue found: <Hl f={f} at={w(10, 15) - 4}>rounding each figure separately</Hl> can make cost + profit show 1 cent off the price (58.52 + 25.08 ≠ 83.59). <Hl f={f} at={w(10, 16) + 4} color={C.gold}>Fixing so the shown numbers always add up.</Hl>
              <div style={{marginTop: 10}}><Real text="excerpt · real run · Claude · 22 Nov 2026" /></div>
            </div>
            {f >= w(10, 18) - 2 && <div style={{position: 'absolute', right: 20, top: -30}}><Stamp text="fixed it itself" p={r(f, w(10, 18) - 2, w(10, 18) + 5, BACK)} color={C.green} rot={5} size={42} /></div>}
          </div>
        );
      })()}
    </Card>
  );
  const S11 = (
    <Card f={f} inAt={0} first outAt={L[12] - 4} outFx="whip" title="The example cake" tag={<Label text="real run · Claude" p={1} />}>
      <div style={{position: 'relative', width: IW, height: 489}}>
        <Img src={staticFile('w7/calc_card.png')} style={{width: IW, height: 489, borderRadius: 18, display: 'block'}} />
        {/* marker on "Total production cost" row, then on the price */}
        <div style={{position: 'absolute', left: 14, top: 375, height: 46, width: 828 * r(f, w(11, 3) - 2, w(11, 3) + 10, IO), border: `5px solid ${C.mint}`, borderRadius: 10}} />
        <div style={{position: 'absolute', left: 6, top: 30, height: 88, width: 300 * r(f, w(11, 7) - 2, w(11, 7) + 10, IO), border: `5px solid ${C.gold}`, borderRadius: 12}} />
      </div>
      <div style={{display: 'flex', gap: 24, marginTop: 26}}>
        {[[w(11, 3), 58.52, 'to make', C.mint], [w(11, 7), 83.59, 'to sell', C.gold]].map(([at, v, lab, col], i) => {
          const a = at as number;
          const p = r(f, a - 4, a + 4, BACK);
          const n = (v as number) * lerp(0.4, 1, r(f, a - 2, a + 16, OUT));
          return (
            <div key={i} style={{flex: 1, background: col as string, border: `4px solid ${C.ink}`, borderRadius: 20, padding: '14px 24px', opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * 40}px) rotate(${i ? 1.5 : -1.5}deg)`}}>
              <Mono size={26} color={C.ink}>{lab as string}</Mono>
              <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 84, letterSpacing: -2, lineHeight: 1}}>€{n.toFixed(2)}</div>
            </div>
          );
        })}
      </div>
    </Card>
  );

  return (
    <AbsoluteFill style={{background: C.paper, backgroundImage: `repeating-linear-gradient(0deg, transparent 0 63px, ${C.rule} 63px 65px)`, overflow: 'hidden'}}>
      <Fonts />
      <Audio src={staticFile(`w7v/final_${platform}.wav`)} />

      <div style={{position: 'absolute', inset: 0, transform: camera(f, TOTAL, [
        [w(0, 4) - 4, w(0, 8) - 2, 1.08, 330, 700],
        [L[4] + 4, w(4, 4) - 2, 1.06, 540, 420],
        [w(6, 2) - 2, w(6, 9) - 4, 1.06, 540, 520],
        [w(10, 15) - 6, w(10, 18) + 2, 1.07, 540, 760],
        [w(11, 7) - 4, L[12] - 8, 1.05, 700, 900],
      ], [[stampAt + 7, 10], [w(3, 9) + 2, 8], [pileB, 14], [tossAt, 8], [tearA + 9, 14], [w(12, kwI + 2), 6]])}}>

        {/* S0: hook */}
        {f < dealAt + 12 && (
          <div style={{position: 'absolute', inset: 0, opacity: 1 - r(f, dealAt - 2, dealAt + 8), transform: `translateY(${-r(f, dealAt - 2, dealAt + 10, IN) * 160}px)`}}>
            <Hook f={f} m={m} still={false} />
          </div>
        )}
        {/* S1: 1st try */}
        {f >= stampAt - 8 && f < dealAt + 10 && (
          <div style={{position: 'absolute', inset: 0, transform: 'translateY(-300px)', opacity: 1 - r(f, dealAt - 2, dealAt + 8)}}>
            <Sequence from={stampAt - 7} layout="none">
              <ImpactShake backgroundColor="transparent" intensity={0.9} impact={7} seed={3} colors={{dust: '#B9B2A2', splitA: '#D9534A', splitB: '#2F7A52'}} foregroundColor={C.ink}>
                <span style={{display: 'inline-block', fontFamily: 'Archivo', fontWeight: 900, fontSize: 120, color: C.red, border: `9px solid ${C.red}`, borderRadius: 22, padding: '6px 34px', background: 'rgba(252,251,247,0.94)', transform: 'rotate(-8deg)'}}>1st try</span>
              </ImpactShake>
            </Sequence>
          </div>
        )}
        {/* two prompt cards */}
        {f >= dealAt && f < L[2] + 6 && [0, 1].map((i) => {
          const a = dealAt + i * 6;
          const p = r(f, a, a + 10, OUT);
          const out = r(f, L[2] - 6, L[2] + 4, IN);
          const sp = r(f, strikeAt + i * 4, strikeAt + i * 4 + 7, IO);
          const nw = r(f, w(1, 9) + i * 5, w(1, 9) + i * 5 + 8, BACK);
          const x = i === 0 ? 70 : 560;
          return (
            <div key={i} style={{position: 'absolute', left: x, top: 330, width: 450, height: 600, transform: `translateX(${(1 - p) * (i ? 900 : -900)}px) rotate(${(i ? 3 : -3) * (1 - p * 0.4)}deg) ${i === 0 ? `scale(${lerp(1, 1.08, out)})` : `translateX(${out * 700}px)`}`, opacity: i === 0 ? 1 - r(f, L[2] - 2, L[2] + 6) : 1}}>
              <div style={{position: 'absolute', inset: 0, background: C.card, border: `4px solid ${C.ink}`, borderRadius: 26, padding: '30px 32px', backgroundImage: `repeating-linear-gradient(0deg, transparent 0 51px, #E4DFD2 51px 53px)`, backgroundPositionY: 90}}>
                <Mono size={28} color={C.ink}>{i === 0 ? 'prompt 1 · ChatGPT' : 'prompt 2 · ChatGPT'}</Mono>
                <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 140, lineHeight: 1, marginTop: 20, color: C.ink}}>#{i + 1}</div>
                <div style={{position: 'relative', marginTop: 50, fontFamily: 'Newsreader', fontStyle: 'italic', fontSize: 70, color: C.ink, display: 'inline-block'}}>
                  Build it.
                  <div style={{position: 'absolute', left: -10, top: '52%', height: 9, width: `${sp * 112}%`, background: C.red, borderRadius: 5, transform: 'rotate(-4deg)'}} />
                </div>
                <div style={{marginTop: 26, opacity: Math.min(1, nw * 2), transform: `scale(${lerp(1.3, 1, nw)})`, transformOrigin: 'left center'}}>
                  <span style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 64, background: C.mint, padding: '0 12px', borderRadius: 10}}>{i === 0 ? 'Plan it.' : 'Brief it.'}</span>
                </div>
              </div>
              <div style={{position: 'absolute', left: 150, top: -22, width: 150, height: 44, background: 'rgba(240,226,190,0.82)', border: '1px solid rgba(160,140,100,0.35)', transform: `rotate(${i ? 5 : -5}deg)`}} />
            </div>
          );
        })}

        {/* S2-S3: prompt 1, the rule, the split */}
        <Card f={f} inAt={L[2] - 4} outAt={L[4] - 6} inFx="zoom" outFx="page" title="Prompt 1 · ChatGPT" tag={<Label text="a build plan" p={r(f, w(2, 4) - 2, w(2, 4) + 6)} />}>
          <Dark h={330}>
            {f >= L[2] - 4 && <Sequence from={L[2] - 4} layout="none"><OffthreadVideo src={staticFile('w7/plan_scroll.mp4')} muted playbackRate={1.2} style={{width: IW, height: IW, objectFit: 'cover', marginTop: -90}} /></Sequence>}
            <div style={{position: 'absolute', left: 16, bottom: 14}}><Label text="real run · 22 Nov 2026" p={1} bg="rgba(0,0,0,0.6)" /></div>
          </Dark>
          <div style={{marginTop: 30}}>
            <Mono size={26} color={C.ink}>the rule in prompt 1:</Mono>
            <div style={{marginTop: 6}}><Typed f={f} at={w(2, 6) - 2} text="One task per number." cps={1.1} size={62} caretOff={L[3] + 10} /></div>
          </div>
          {f >= L[3] - 2 && (() => {
            const ap = r(f, L[3] - 2, L[3] + 8, BACK);
            const sp = r(f, w(3, 9) - 2, w(3, 9) + 10, OUT);
            const half = (side: 0 | 1) => (
              <div style={{position: 'absolute', left: 0, top: 0, clipPath: side === 0 ? 'polygon(0 0, 52% 0, 47% 30%, 53% 55%, 46% 80%, 51% 100%, 0 100%)' : 'polygon(52% 0, 100% 0, 100% 100%, 51% 100%, 46% 80%, 53% 55%, 47% 30%)',
                transform: `translateX(${(side ? 1 : -1) * sp * 70}px) translateY(${sp * 18}px) rotate(${(side ? 1 : -1) * sp * 9}deg)`}}>
                <div style={{width: 560, height: 110, background: C.note, border: `4px solid ${C.ink}`, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Archivo', fontWeight: 900, fontSize: 48}}>1 number = 2 jobs</div>
              </div>
            );
            return (
              <div style={{position: 'absolute', left: 148, top: 520, width: 560, height: 110, opacity: Math.min(1, ap * 2), transform: `scale(${lerp(1.3, 1, ap)}) rotate(-2deg)`}}>
                {half(0)}{half(1)}
                {f >= w(3, 9) && f < w(3, 9) + 14 && <div style={{position: 'absolute', left: 180, top: -100, width: 200, height: 300}}><Sequence from={w(3, 9)} layout="none"><TrimBurst x={0.5} y={0.5} count={9} innerRadius={50} reach={26} strokeLength={18} weight={5} color={C.red} seed={4} /></Sequence></div>}
                
              </div>
            );
          })()}
        </Card>

        {/* S4: "add ingredients" became four */}
        <Card f={f} inAt={L[4] - 4} outAt={L[5] - 4} inFx="page" outFx="shrink" title="The real plan" tag={<Label text="rows 10-13 · real run" p={r(f, L[4] + 2, L[4] + 10)} />}>
          {(() => {
            const sp = r(f, splitAt - 2, splitAt + 8, IO);
            const ap = r(f, w(4, 1) - 3, w(4, 1) + 6, BACK);
            return (
              <div style={{position: 'absolute', left: 0, top: 0, width: IW, height: 110, display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: 1 - sp, transform: `scale(${1 - sp * 0.3})`}}>
                <Sticker p={ap} rot={-3} size={50}>"add ingredients"</Sticker>
                {f >= splitAt - 1 && f < splitAt + 12 && <div style={{position: 'absolute', left: 328, top: -95, width: 200, height: 300}}><Sequence from={splitAt - 1} layout="none"><TrimBurst x={0.5} y={0.5} count={8} innerRadius={70} reach={24} strokeLength={18} weight={5} color={C.ink} seed={8} /></Sequence></div>}
              </div>
            );
          })()}
          <div style={{position: 'absolute', left: 0, top: 120, width: IW, height: 301, borderRadius: 16, overflow: 'hidden', border: `3px solid ${C.ink}`, opacity: r(f, L[4] + 2, L[4] + 10)}}>
            <Img src={staticFile('w7/rows10_13.png')} style={{width: IW, height: 301, display: 'block'}} />
            {stepAt.map((a, i) => <div key={i} style={{position: 'absolute', left: 8, top: ROWS_Y[i] - 22, height: 44, width: (IW - 16) * r(f, a - 3, a + 7, IO), background: C.mint, opacity: 0.32, borderRadius: 6}} />)}
                      </div>
          <div style={{position: 'absolute', left: 0, top: 448, width: IW, display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 26, columnGap: 22}}>
            {STEPS.map((s, i) => {
              const slot = r(f, splitAt, splitAt + 6 + i * 2);
              return (
                <div key={i} style={{position: 'relative', height: 84, border: `3px dashed ${C.muted}`, borderRadius: 10, opacity: slot}}>
                  <div style={{position: 'absolute', left: -3, top: -3}}><Sticker p={r(f, stepAt[i] - 3, stepAt[i] + 6)} rot={i % 2 ? 2.5 : -2.5} bg={C.note} size={40} style={{width: 409, boxSizing: 'border-box'}}><span style={{fontFamily: 'Plex', fontSize: 28, color: C.muted, marginRight: 14}}>{10 + i}</span>{s}</Sticker></div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* S5: 44 steps pile up */}
        <Card f={f} inAt={L[5] - 4} outAt={L[6] - 4} inFx="rise" outFx="whip" title="44 steps" tag={<Label text="each does one job" p={r(f, w(5, 2), w(5, 2) + 8)} bg={C.green} />}>
          {Array.from({length: 44}).map((_, i) => {
            const col = i % 4, row = Math.floor(i / 4);
            const a = pileA + Math.round((i / 43) * (pileB - pileA));
            const p = r(f, a, a + 6, IN);
            if (p <= 0) return null;
            const land = f >= a + 6 && f < a + 9 ? 3 : 0;
            const target = dotAt;
            const isT = i === 21;
            return (
              <div key={i} style={{position: 'absolute', left: col * 214, top: 540 - row * 52, width: 200, height: 44, background: isT && f >= target ? C.mint : C.card, border: `3px solid ${C.ink}`, borderRadius: 6, display: 'flex', alignItems: 'center', gap: 10, padding: '0 10px', boxSizing: 'border-box',
                transform: `translateY(${(1 - p) * -700 + land}px) rotate(${((i * 37) % 7 - 3) * 0.6 * (1 - p * 0.7)}deg)`}}>
                <span style={{fontFamily: 'Plex', fontSize: 20, color: C.muted, width: 30}}>{i + 1}</span>
                <span style={{flex: 1, height: 8, borderRadius: 4, background: C.line}} />
              </div>
            );
          })}
          {f >= dotAt - 2 && (() => {
            const p = r(f, dotAt - 2, dotAt + 6, BACK);
            const x = 1 * 214 + 100, y = 540 - 5 * 52 + 22;
            return (
              <>
                <div style={{position: 'absolute', left: x - 60, top: y - 60, width: 120, height: 120, border: `4px solid ${C.red}`, borderRadius: 60, transform: `scale(${lerp(2.2, 1, p)})`, opacity: Math.min(1, p * 2)}} />
                <div style={{position: 'absolute', left: x - 90, top: y - 2, width: 180, height: 4, background: C.red, opacity: p}} />
                <div style={{position: 'absolute', left: x - 2, top: y - 90, width: 4, height: 180, background: C.red, opacity: p}} />
                <div style={{position: 'absolute', left: x + 80, top: y - 140}}><Sticker p={r(f, w(5, 4), w(5, 4) + 8)} rot={3} bg={C.mint} size={42}>1 step = 1 job</Sticker></div>
              </>
            );
          })()}
        </Card>

        {/* S6: the margin catch */}
        <Card f={f} inAt={L[6] - 4} outAt={L[7] - 4} inFx="whip" outFx="shrink" title="It caught this" tag={<Label text="without being asked" p={r(f, w(6, 2), w(6, 2) + 8)} bg={C.red} />}>
          <Dark h={286} style={{padding: '20px 26px', boxSizing: 'border-box', transform: `scale(${lerp(1, 0.94, r(f, vsAt, vsAt + 10, IO))})`, transformOrigin: 'top center'}}>
            <div style={{fontFamily: 'Archivo', fontSize: 35, lineHeight: 1.3, color: '#E6E6E6'}}>
              One calculation detail to get right: <Hl f={f} at={w(6, 5) - 2} color={C.gold}>a 30% profit margin is different from a 30% markup.</Hl> For a 30% profit margin, the selling price must be <Hl f={f} at={w(6, 13) - 2}>production cost divided by 0.70.</Hl>
            </div>
            <div style={{marginTop: 8}}><Real text="excerpt · real run · ChatGPT · 22 Nov 2026" /></div>
          </Dark>
          <div style={{position: 'absolute', left: 0, top: 316, width: IW, height: 310}}>
            <div style={{position: 'absolute', left: 0, top: 0, width: 410, height: 300}}>
              {(() => {
                const p = r(f, vsAt, vsAt + 9, BACK);
                const tile = (
                  <div style={{width: 410, height: 300, background: C.card, border: `4px solid ${C.ink}`, borderRadius: 22, padding: '20px 24px', boxSizing: 'border-box', opacity: Math.min(1, p * 2), transform: `translateX(${(1 - p) * -300}px) rotate(-2deg)`}}>
                    <Mono size={26} color={C.ink}>most people: add 30%</Mono>
                    <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 96, color: C.red, letterSpacing: -2}}>× 1.30</div>
                    <Mono size={28} color={C.ink}>€10 cost → €13.00</Mono>
                    <div style={{marginTop: 4}}><Mono size={24} color={C.red}>= only a 23% margin</Mono></div>
                  </div>
                );
                if (f < tossAt) return tile;
                return f < tossAt + 30 ? <Sequence from={tossAt} layout="none"><CrumpleToss at={0} width={410} height={300} direction={-1} distance={900} seed="w7m">{tile}</CrumpleToss></Sequence> : null;
              })()}
            </div>
            {(() => {
              const p = r(f, vsAt + 6, vsAt + 15, BACK);
              const slide = r(f, tossAt + 6, tossAt + 18, IO);
              return (
                <div style={{position: 'absolute', left: lerp(446, 223, slide), top: 0, width: 410, height: 300, background: C.mint, border: `4px solid ${C.ink}`, borderRadius: 22, padding: '20px 24px', boxSizing: 'border-box', opacity: Math.min(1, p * 2), transform: `translateX(${(1 - p) * 300}px) rotate(2deg)`}}>
                  <Mono size={26} color={C.ink}>a real 30% margin</Mono>
                  <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 96, color: C.ink, letterSpacing: -2}}>÷ 0.70</div>
                  <Mono size={28} color={C.ink}>€10 cost → €14.29</Mono>
                  {f >= w(6, 15) && <div style={{position: 'absolute', right: -34, bottom: -26}}><Stamp text="right" p={r(f, w(6, 15), w(6, 15) + 7, BACK)} color={C.green} rot={8} size={40} /></div>}
                </div>
              );
            })()}
          </div>
          {f >= w(6, 13) && f < tossAt && (
            <div style={{position: 'absolute', left: 0, top: 0, width: IW, height: 640, pointerEvents: 'none'}}>
              <Sequence from={w(6, 13)} layout="none"><InkArrow from={{x: 700, y: 250}} to={{x: 640, y: 306}} curvature={-0.4} color={C.ink} strokeWidth={6} drawDur={10} headSize={20} seed="w7arr" /></Sequence>
            </div>
          )}
        </Card>

        {/* S7: rehook, halftone cut */}
        {f >= L[7] - 2 && f < L[8] + 2 && (
          <div style={{position: 'absolute', inset: 0, opacity: r(f, L[7] - 2, L[7] + 6) * (1 - r(f, L[8] - 6, L[8] + 2))}}>
            <div style={{position: 'absolute', left: 70, right: 70, top: 270, height: 790, background: C.card, border: `4px solid ${C.ink}`, borderRadius: 30, overflow: 'hidden'}}>
              <div style={{position: 'absolute', left: 38, top: 30}}><Mono size={30} color={C.ink}>the 44-step plan from prompt 1 is…</Mono></div>
              <div style={{position: 'absolute', left: -70, top: -270, width: 1080, height: 1920, transform: 'translateY(-300px)'}}>
                <Sequence from={L[7] - 2} layout="none">
                  <HalftoneCut from="Written for you." to="Not for the AI." theme="light" accent={C.mint} ink={C.ink} background="transparent" fontFamily="Newsreader" grain={false} scale={0.78} speed={76 / (w(7, 7) + 6 - L[7] + 2)} dotSize={16} />
                </Sequence>
              </div>
              <div style={{position: 'absolute', left: 38, bottom: 34}}><Sticker p={r(f, w(7, 7) + 8, w(7, 7) + 16)} rot={-3} bg={C.gold} size={40}>so prompt 2 rewrites it</Sticker></div>
            </div>
          </div>
        )}

        {/* S8-S9: prompt 2, orders, check list */}
        <Card f={f} inAt={L[8] - 4} outAt={L[10] - 6} inFx="page" outFx="whip" title="Prompt 2 · ChatGPT" tag={<Label text="for a coding AI" p={r(f, w(8, 5) - 2, w(8, 5) + 6)} bg={C.gold} fg={C.ink} />}>
          <Dark h={270}>
            {f >= L[8] - 4 && <Sequence from={L[8] - 4} layout="none"><OffthreadVideo src={staticFile('w7/writing.mp4')} muted style={{width: IW, height: IW * 886 / 1080, objectFit: 'cover'}} /></Sequence>}
            <div style={{position: 'absolute', left: 16, bottom: 14}}><Label text="real run · 22 Nov 2026" p={1} bg="rgba(0,0,0,0.6)" /></div>
          </Dark>
          <div style={{marginTop: 18}}><Mono size={28} color={C.ink}>the orders forbid:</Mono></div>
          <div style={{position: 'absolute', left: 10, top: 340, width: 760, height: 300}}>
            {f >= clFrom && <Sequence from={clFrom} layout="none"><CheckList items={CL} width={720} fontSize={60} color={C.ink} boxColor={C.ink} tickColor={C.red} step={clStep} itemGap={clGap} closeGap={clClose} strokeWidth={4} seed="w7cl" /></Sequence>}
          </div>
        </Card>

        {/* S10 -> S11 with the paper tear */}
        {f < tearA && S10}
        {f >= tearA && f < tearA + tearLen && (
          <>
            {tearP >= 0.28 && <TearP presentationDirection="entering" presentationProgress={tearP} passedProps={TEAR.props}><AbsoluteFill style={{background: C.paper}}>{S11}</AbsoluteFill></TearP>}
            <TearP presentationDirection="exiting" presentationProgress={tearP} passedProps={TEAR.props}><AbsoluteFill style={{background: C.paper, backgroundImage: `repeating-linear-gradient(0deg, transparent 0 63px, ${C.rule} 63px 65px)`}}>{S10}</AbsoluteFill></TearP>
          </>
        )}
        {f >= tearA + tearLen && S11}

        {/* S12: CTA, comment -> DM */}
        <Card f={f} inAt={L[12] - 4} outAt={END} inFx="whip" outFx="shrink" title={ig ? 'Comment PROMPT' : 'DM me PROMPT'} tag={<Mono>{ig ? 'on this Reel' : 'on TikTok'}</Mono>}>
          {(() => {
            const KW = 'PROMPT';
            const kw = w(12, kwI);
            const post = w(12, kwI + 1);
            const dmAt = w(12, kwI + 3);
            const ty = Math.max(0, Math.min(KW.length, Math.floor((f - kw + 4) / 2)));
            const posted = r(f, post, post + 6);
            const dm = r(f, dmAt, dmAt + 10);
            const both = w(12, kwI + 5), wfw = w(12, kwI + 7);
            return (
              <>
                <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 10, opacity: r(f, L[12] + 2, L[12] + 10)}}>
                  <span style={{width: 60, height: 60, borderRadius: 99, background: C.soft, border: `3px solid ${C.ink}`, flex: 'none'}} />
                  <div style={{flex: 1, display: 'flex', alignItems: 'center', border: `4px solid ${C.ink}`, borderRadius: 999, padding: '12px 24px', height: 80, background: C.card}}>
                    {ty === 0 ? <Mono size={30}>{ig ? 'Add a comment…' : 'Message…'}</Mono> : <span style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 44, letterSpacing: 2}}>{KW.slice(0, ty)}</span>}
                    {f >= kw - 10 && posted < 1 && <Caret color={C.ink} width={4} height={42} blink={ty === 0} marginLeft={4} />}
                  </div>
                  <span style={{position: 'relative', fontFamily: 'Archivo', fontWeight: 900, fontSize: 36, padding: '14px 24px', borderRadius: 999, border: `4px solid ${C.ink}`, background: posted > 0.5 ? C.mint : C.card}}>
                    {ig ? 'Post' : 'Send'}
                    {f >= post && f < post + 14 && <span style={{position: 'absolute', left: -60, top: -60, right: -60, bottom: -60}}><Sequence from={post} layout="none"><TrimBurst x={0.5} y={0.5} count={8} innerRadius={64} reach={18} strokeLength={16} weight={5} color={C.green} seed={9} /></Sequence></span>}
                  </span>
                </div>
                <div style={{marginTop: 40, display: 'flex', alignItems: 'flex-start', gap: 16, opacity: Math.min(1, dm * 2.5), transform: `translateY(${(1 - dm) * 50}px)`}}>
                  <span style={{width: 60, height: 60, borderRadius: 99, background: C.ink, color: C.mint, fontFamily: 'Archivo', fontWeight: 900, fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none'}}>EM</span>
                  <div style={{background: C.soft, border: `3px solid ${C.ink}`, borderRadius: 26, padding: '20px 26px', flex: 1}}>
                    <Mono size={24}>@theexactmethod · DM</Mono>
                    <div style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 40, marginTop: 6}}>Here are both prompts.</div>
                    <div style={{display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16}}>
                      {[['prompt 1 · the build plan', both], ['prompt 2 · the orders', both + 6]].map(([t, a], i) => (
                        <span key={i} style={{display: 'flex', alignItems: 'center', gap: 10, opacity: r(f, (a as number) - 2, (a as number) + 6)}}><Tick d={r(f, a as number, (a as number) + 8)} s={36} color={C.green} /><span style={{fontFamily: 'Archivo', fontWeight: 700, fontSize: 34}}>{t as string}</span></span>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{position: 'absolute', left: 0, top: 392, width: IW, display: 'flex', gap: 26}}>
                  {[0, 1].map((i) => {
                    const p = r(f, both + i * 6 - 2, both + i * 6 + 8, BACK);
                    return (
                      <div key={i} style={{flex: 1, height: 230, background: C.card, border: `4px solid ${C.ink}`, borderRadius: 20, padding: '18px 24px', boxSizing: 'border-box', opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * 60}px) rotate(${i ? 2 : -2}deg)`, backgroundImage: 'repeating-linear-gradient(0deg, transparent 0 41px, #E4DFD2 41px 43px)', backgroundPositionY: 60}}>
                        <Mono size={24} color={C.ink}>{i ? 'prompt 2 · orders' : 'prompt 1 · plan'}</Mono>
                        <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 96, lineHeight: 1.05, marginTop: 8}}>#{i + 1}</div>
                        <div style={{position: 'absolute', left: 70, top: -18, width: 110, height: 34, background: 'rgba(240,226,190,0.82)', border: '1px solid rgba(160,140,100,0.35)', transform: `rotate(${i ? 4 : -4}deg)`}} />
                      </div>
                    );
                  })}
                </div>
                <div style={{position: 'absolute', right: -6, top: 560}}><Sticker p={r(f, wfw - 2, wfw + 8)} rot={-5} bg={C.gold} size={46}>word for word</Sticker></div>
              </>
            );
          })()}
        </Card>

        {/* back to frame 0 */}
        {f >= END && (
          <div style={{position: 'absolute', inset: 0, opacity: r(f, END + 3, END + 10), transform: `scale(${lerp(1.12, 1, r(f, END + 3, END + 16, OUT))})`}}>
            <Hook f={f} m={m} still />
          </div>
        )}
      </div>

      <SectionTag f={f} m={m} end={END} />
      <Sage f={f} m={m} mouth={(platform === 'ig' ? MIG : MTT) as number[]} end={END} />
      {/* 44: smash count over the pile */}
      {f >= pileA && f < dotAt - 3 && (
        <div style={{position: 'absolute', inset: 0, opacity: 1 - r(f, dotAt - 11, dotAt - 4), pointerEvents: 'none'}}>
          <div style={{position: 'absolute', inset: 0, transform: 'translate(0px, -470px) scale(0.62)'}}>
            <Sequence from={pileA} layout="none"><SmashCount from={1} value={44} cuts={6} firstGap={6} lastGap={3} label="" accent={C.red} ink={C.ink} background="transparent" fontFamily="Archivo" scale={1} /></Sequence>
          </div>
        </div>
      )}
      <Caption f={f} z={z} />
    </AbsoluteFill>
  );
};

export const W7Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.paper, backgroundImage: `repeating-linear-gradient(0deg, transparent 0 63px, ${C.rule} 63px 65px)`}}>
    <Fonts />
    <div style={{position: 'absolute', left: 70, right: 70, top: 290}}>
      <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 116, lineHeight: 1.0, letterSpacing: -3}}>2 prompts<br />built this.<br /><span style={{background: C.mint, padding: '0 12px', borderRadius: 12}}>No code.</span></div>
    </div>
    <div style={{position: 'absolute', left: 140, top: 760, width: 800, transform: 'rotate(-1.5deg)'}}>
      <Img src={staticFile('w7/calc_hero.png')} style={{width: 800, borderRadius: 18, border: `4px solid ${C.ink}`, display: 'block'}} />
    </div>
  </AbsoluteFill>
);
