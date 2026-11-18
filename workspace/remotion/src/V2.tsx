// V-2 "Stop hunting for mistakes in your Claude video" — short-Reel test (28 s), The Video Brief (VIDEO).
// W-5 system: ruled paper, one card per beat, 2-3 word mint captions, Sage bottom-right. Frame 0 = last frame.
// remocn: ScribbleCircle, RollingNumber, TrimBurst, WhipPan, Caret.
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {ScribbleCircle} from '@/components/remocn/scribble-circle';
import {TrimBurst} from '@/components/remocn/trim-burst';
import {RollingNumber} from '@/components/remocn/rolling-number';
import {Caret} from '@/components/remocn/caret';
import {whipPan} from '@/components/remocn/whip-pan';
import TIG from './v2timing_ig.json';
import TTT from './v2timing_tt.json';
import MIG from './v2moments_ig.json';
import MTT from './v2moments_tt.json';

const C = {paper: '#E9E5DA', rule: '#D7D1C3', card: '#FCFBF7', ink: '#181714', mint: '#6BE0A0', gold: '#F2B632', red: '#D9534A', muted: '#7A7468', green: '#2F7A52', line: '#DCD7CB', soft: '#F1EEE4'};
const OUT = Easing.bezier(0.42, 0, 0.18, 1);
const IO = Easing.bezier(0.65, 0, 0.35, 1);
const BACK = Easing.out(Easing.back(1.8));
const IN = Easing.in(Easing.cubic);
const r = (f: number, a: number, b: number, e = OUT) => interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const hx = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) => { const x = hx(a), y = hx(b), k = Math.max(0, Math.min(1, t)); return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * k)).join(',')})`; };

type Wd = {w: string; s: number; e: number};
type Line = {start: number; end: number; text: string; words: Wd[]};
type Chunk = {words: Wd[]; from: number};
// caption breaks by meaning, max 3 words: words per chunk for each line
const CC = {
  ig: [[2, 2, 2, 2, 2, 2], [3, 2, 2, 3], [2, 2, 2, 2, 2, 2, 3], [1, 2, 2, 3, 2, 3, 3, 2], [3, 3, 3], [2, 3, 3], [3]],
  tt: [[2, 2, 2, 2, 2, 2], [3, 2, 2, 3], [2, 2, 2, 2, 2, 2, 3], [1, 2, 2, 3, 2, 3, 3, 2], [3, 3, 3], [3, 3, 3], [3]],
};
const prep = (T: {lines: Line[]; end: number; total: number}, cc?: number[][]) => {
  const CHUNKS: Chunk[] = [];
  if (cc) {
    T.lines.forEach((l, li) => {
      let at = 0;
      cc[li].forEach((n) => { const words = l.words.slice(at, at + n); at += n; CHUNKS.push({words, from: words[0].s - 3}); });
      if (at !== l.words.length) throw new Error('caption counts do not match line ' + li);
    });
    CHUNKS[0].from = 0;
    return {CHUNKS, TOTAL: T.total};
  }
  T.lines.forEach((l) => {
    const segs: Wd[][] = [];
    let cur: Wd[] = [];
    l.words.forEach((w, i) => {
      cur.push(w);
      if (/[.:?,]["”]?$/.test(w.w) || i === l.words.length - 1) { segs.push(cur); cur = []; }
    });
    // merge a lone word into the next segment when that stays within 3 words ("One." + "Narrow the question." stays split)
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
const Z = {ig: prep(TIG as any, CC.ig), tt: prep(TTT as any, CC.tt)};
type ZT = ReturnType<typeof prep>;
type MT = typeof MIG;
const MM = {ig: MIG as MT, tt: MTT as MT};
export const V2_TOTAL = {ig: Z.ig.TOTAL, tt: Z.tt.TOTAL};

const Fonts: React.FC = () => (
  <style>{`
@font-face{font-family:Archivo;src:url(${staticFile('archivo-variable.woff2')}) format('woff2');font-weight:100 900;font-stretch:62% 125%}
@font-face{font-family:Newsreader;src:url(${staticFile('newsreader-variable.woff2')}) format('woff2');font-weight:200 800;font-style:normal italic}
@font-face{font-family:Plex;src:url(${staticFile('plex-mono-500.woff2')}) format('woff2');font-weight:500}
`}</style>
);

// ---------- captions: 2-3 words, spoken word in mint ----------
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

// ---------- Sage ----------
type Pose = 'sage' | 's-check' | 's-finger' | 's-point' | 's-present' | 's-shrug' | 's-sigh' | 's-think';
const SAGE_W: Record<Pose, number> = {sage: 388, 's-check': 387, 's-finger': 458, 's-point': 595, 's-present': 573, 's-shrug': 600, 's-sigh': 424, 's-think': 349};
const Sage: React.FC<{f: number; m: MT}> = ({f, m}) => {
  const L = m.L;
  const POSES: [number, Pose][] = [
    [0, 's-think'], [m.paste - 2, 's-point'], [L[1] - 2, 's-present'], [L[2] - 2, 's-finger'], [m.send - 4, 's-check'],
    [L[3] - 2, 's-shrug'], [m.wipe1 - 2, 's-check'], [L[4] - 2, 's-present'], [L[5] - 2, 's-point'], [L[6] - 2, 's-think'],
  ];
  const H = 640;
  let idx = 0;
  POSES.forEach(([t], i) => { if (f >= t) idx = i; });
  const [t0, p] = POSES[idx];
  const prev = idx > 0 ? POSES[idx - 1][1] : null;
  const x = r(f, t0, t0 + 6, IO);
  const hop = idx > 0 ? Math.sin(Math.min(1, (f - t0) / 9) * Math.PI) * -16 : 0;
  const img = (pose: Pose, o: number) => {
    const wpx = (SAGE_W[pose] / 1121) * H;
    return <Img key={pose + o} src={staticFile(`sage/${pose}.png`)} style={{position: 'absolute', left: 1035 - wpx, top: 1318 + hop, height: H, opacity: o}} />;
  };
  return (<>{prev && x < 1 && img(prev, 1 - x)}{img(p, prev ? x : 1)}</>);
};

// ---------- building blocks ----------
const WhipP = whipPan({direction: 'left', blur: 18}).component as React.FC<any>;
type InFx = 'rise' | 'whip' | 'zoom' | 'push' | 'page' | 'pull';
type OutFx = 'fade' | 'whip' | 'crash' | 'fly' | 'page' | 'shrink';
// one card; every change of card uses its own move (crash zoom, fly-off, page turn, whip, pull back)
const Card: React.FC<{f: number; inAt: number; outAt: number; children: React.ReactNode; title: React.ReactNode; tag?: React.ReactNode; first?: boolean; inFx?: InFx; outFx?: OutFx; crashAt?: [number, number]; zoom?: number}> = ({f, inAt, outAt, children, title, tag, first, inFx = 'rise', outFx = 'fade', crashAt = [800, 700], zoom = 1}) => {
  if ((f < inAt && !first) || f >= outAt + 11) return null;
  const pin = first ? 1 : r(f, inAt, inAt + 11, inFx === 'push' ? BACK : inFx === 'whip' ? (t: number) => t : OUT);
  const pout = r(f, outAt, outAt + 10, outFx === 'whip' ? (t: number) => t : outFx === 'fade' || outFx === 'shrink' ? IO : IN);
  const exiting = f >= outAt;
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
    if (outFx === 'crash') { const k = lerp(1, 2.8, pout); tf = `scale(${k})`; origin = `${crashAt[0] - 70}px ${crashAt[1] - 290}px`; blur = pout * 16; op = 1 - r(f, outAt + 6, outAt + 10); }
    if (outFx === 'fly') { tf = `translateY(${-pout * 1400}px) rotate(${-pout * 9}deg)`; }
    if (outFx === 'page') { tf = `perspective(2200px) rotateY(${-pout * 88}deg)`; origin = 'left center'; op = 1 - r(f, outAt + 7, outAt + 10); }
    if (outFx === 'shrink') { op = 1 - pout; tf = `scale(${lerp(1, 0.86, pout)})`; }
  }
  const body = (
    <div style={{position: 'absolute', left: 70, right: 70, top: 290, height: 760, background: C.card, border: `4px solid ${C.ink}`, borderRadius: 30, padding: '30px 38px', overflow: 'hidden',
      opacity: op, transform: tf || undefined, transformOrigin: origin, filter: blur > 0.2 ? `blur(${blur}px)` : undefined, boxShadow: '0 14px 0 rgba(24,23,20,0.08)'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 18, borderBottom: `3px solid ${C.line}`, minHeight: 72}}>
        <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 50, letterSpacing: -1}}>{title}</span>
        {tag}
      </div>
      <div style={{position: 'relative', marginTop: 26, height: 600 / zoom, width: `${100 / zoom}%`, transform: `scale(${zoom})`, transformOrigin: 'top left'}}>{children}</div>
    </div>
  );
  if (exiting && outFx === 'whip') return <WhipP presentationDirection="exiting" presentationProgress={pout} passedProps={{direction: 'left', blur: 18}}>{body}</WhipP>;
  if (!exiting && inFx === 'whip' && pin < 1) return <WhipP presentationDirection="entering" presentationProgress={pin} passedProps={{direction: 'left', blur: 18}}>{body}</WhipP>;
  return body;
};
// camera over the cards: slow loop-safe drift, punch-ins on a point, impact shakes
type Punch = [number, number, number, number, number]; // from, to, scale, x, y (screen px)
const camera = (f: number, total: number, punches: Punch[], shakes: [number, number][]) => {
  const ph = (2 * Math.PI * f) / total;
  let k = 1 + 0.012 * Math.sin(ph * 3), tx = 7 * Math.sin(ph * 2), ty = 0;
  punches.forEach(([a, b, s, x, y]) => {
    const w = r(f, a, a + 9, IO) * (1 - r(f, b - 9, b, IO));
    if (w <= 0) return;
    const kk = 1 + (s - 1) * w;
    tx += (x - 540) * (1 - kk); ty += (y - 670) * (1 - kk); k *= kk;
  });
  shakes.forEach(([t, amp]) => {
    const d = f - t;
    if (d < 0 || d > 14) return;
    const e = amp * Math.exp(-d / 3.5);
    tx += e * Math.sin(d * 2.4); ty += e * 0.7 * Math.cos(d * 3.1);
  });
  return `translate(${tx}px, ${ty}px) scale(${k})`;
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
// habit badge: "Habit" + a rolling number from the previous habit
const Badge: React.FC<{f: number; n: number; at: number; gold?: boolean}> = ({f, n, at, gold}) => {
  const p = r(f, at - 6, at + 4);
  return (
    <span style={{display: 'flex', alignItems: 'center', gap: 12, opacity: p}}>
      <Mono size={26}>habit</Mono>
      <span style={{width: 66, height: 66, borderRadius: 99, border: `4px solid ${C.ink}`, background: gold ? C.gold : C.mint, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
        {f < at ? <span style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 40}}>{n - 1}</span> : (
          <Sequence from={at} layout="none"><RollingNumber from={n - 1} to={n} duration={0.4} fontSize={40} fontFamily="Archivo" fontWeight={900} color={C.ink} inline /></Sequence>
        )}
      </span>
    </span>
  );
};
const Bubble: React.FC<{text: string; p?: number; me?: boolean; size?: number}> = ({text, p = 1, me, size = 40}) => (
  <div style={{display: 'flex', justifyContent: me ? 'flex-end' : 'flex-start', marginTop: 16, opacity: p, transform: `translateY(${(1 - p) * 18}px)`}}>
    <span style={me ? {background: C.ink, color: C.card, borderRadius: 24, padding: '12px 24px', fontFamily: 'Newsreader', fontSize: size} : {fontFamily: 'Newsreader', fontSize: size, color: C.ink, maxWidth: 760}}>{text}</span>
  </div>
);

// ---------- card A: "your Claude video" with a magnifier hunting over it (also the loop end = frame 0) ----------
const PhoneHunt: React.FC<{f: number; m: MT; t: number; loop?: boolean}> = ({f, m, t, loop}) => {
  // magnifier path is periodic in t, so frame 0 and the last frame match
  const ang = (t / 90) * Math.PI * 2;
  let mx = 300 + Math.sin(ang) * 120, my = 250 + Math.sin(ang * 2) * 90;
  const qs = [{x: 210, y: 150}, {x: 380, y: 330}, {x: 250, y: 470}];
  if (!loop) qs.forEach((q, i) => {
    const at = m.q1 + i * 8;
    const w = r(f, at - 4, at, BACK) * (1 - r(f, at + 4, at + 9, IO));
    mx = lerp(mx, q.x - 14, w); my = lerp(my, q.y - 14, w);
  });
  const pasteP = loop ? 0 : r(f, m.paste, m.paste + 10);
  return (
    <>
      <div style={{position: 'absolute', left: 120, top: 0, width: 360, height: 590, borderRadius: 46, border: `5px solid ${C.ink}`, background: '#22201c', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 24, top: 70, right: 24, height: 190, borderRadius: 18, background: C.mint, opacity: 0.85}} />
        <div style={{position: 'absolute', left: 24, top: 290, width: 200, height: 26, borderRadius: 8, background: C.card, opacity: 0.8}} />
        <div style={{position: 'absolute', left: 24, top: 330, width: 140, height: 26, borderRadius: 8, background: C.card, opacity: 0.55}} />
        <div style={{position: 'absolute', left: 24, bottom: 40, right: 24, height: 60, borderRadius: 14, background: C.gold, opacity: 0.9}} />
        <div style={{position: 'absolute', left: 120, top: 16, width: 90, height: 10, borderRadius: 5, background: '#3a3732'}} />
      </div>
      {!loop && qs.map((q, i) => {
        const at = m.q1 + i * 8;
        const p = r(f, at, at + 6, BACK);
        return (
          <span key={i} style={{position: 'absolute', left: q.x, top: q.y, width: 72, height: 72, borderRadius: 99, background: C.red, color: C.card, border: `4px solid ${C.card}`,
            fontFamily: 'Archivo', fontWeight: 900, fontSize: 46, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: Math.min(1, p * 3), transform: `scale(${lerp(2.4, 1, p)}) rotate(${(i - 1) * 8}deg)`}}>?</span>
        );
      })}
      {!loop && f >= m.q1 + 20 && (
        <span style={{position: 'absolute', left: 205, top: 440}}>
          <Sequence from={m.q1 + 20} layout="none"><ScribbleCircle width={150} height={140} color={C.red} strokeWidth={7} durationSteps={7} seed="v2q" /></Sequence>
        </span>
      )}
      <svg width={170} height={170} viewBox="0 0 100 100" style={{position: 'absolute', left: mx, top: my, opacity: 1 - pasteP * 0.85, transform: `translateY(${pasteP * 60}px)`, filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.35))'}}>
        <line x1={61} y1={61} x2={90} y2={90} stroke={C.ink} strokeWidth={17} strokeLinecap="round" />
        <line x1={62} y1={62} x2={89} y2={89} stroke={C.gold} strokeWidth={9} strokeLinecap="round" />
        <circle cx={40} cy={40} r={28} fill="rgba(252,251,247,0.45)" stroke={C.ink} strokeWidth={13} />
        <circle cx={40} cy={40} r={28} fill="none" stroke={C.card} strokeWidth={6} />
        <path d="M27 31 A16 16 0 0 1 38 22" fill="none" stroke={C.card} strokeWidth={4} strokeLinecap="round" />
      </svg>
      <div style={{position: 'absolute', right: 0, bottom: 30, opacity: pasteP, transform: `translateY(${(1 - pasteP) * 40}px)`}}>
        <span style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 44, background: C.mint, border: `4px solid ${C.ink}`, borderRadius: 18, padding: '12px 22px'}}>PASTE THIS ↓</span>
      </div>
    </>
  );
};

type Crop = {x: number; y: number; w: number; h: number};
const Wipe: React.FC<{before: string; after: string; f: number; at: number; W: number; H: number; crop: Crop; circleAt: number; cx: number; cy: number; seed: string}> = ({before, after, f, at, W, H, crop, circleAt, cx, cy, seed}) => {
  const p = r(f, at, at + 14, IO);
  const k = W / crop.w;
  const img = (src: string) => <Img src={staticFile(src)} style={{position: 'absolute', left: -crop.x * k, top: -crop.y * k, width: 940 * k, height: 760 * k}} />;
  const X = (cx - crop.x) * k, Y = (cy - crop.y) * k;
  return (
    <div style={{position: 'relative', width: W, height: H, borderRadius: 22, overflow: 'hidden', border: `4px solid ${C.ink}`, background: C.card}}>
      {img(before)}
      <div style={{position: 'absolute', inset: 0, clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`}}>{img(after)}</div>
      {p > 0 && p < 1 && <div style={{position: 'absolute', top: 0, bottom: 0, left: `${p * 100}%`, width: 10, background: C.mint, transform: 'translateX(-50%)', boxShadow: `0 0 26px 10px ${C.mint}`}} />}
      {f >= circleAt && p < 1 && (
        <span style={{position: 'absolute', left: X - 130, top: Y - 95, opacity: 1 - p}}>
          <Sequence from={circleAt} layout="none"><ScribbleCircle width={260} height={190} color={C.red} strokeWidth={8} durationSteps={7} seed={seed} /></Sequence>
        </span>
      )}
      <span style={{position: 'absolute', left: 14, top: 14, fontFamily: 'Plex', fontSize: 28, background: p > 0.5 ? C.mint : C.red, color: p > 0.5 ? C.ink : C.card, borderRadius: 10, padding: '4px 14px'}}>{p > 0.5 ? 'after' : 'before'}</span>
    </div>
  );
};

export const V2: React.FC<{platform: 'ig' | 'tt'}> = ({platform}) => {
  const f = useCurrentFrame();
  const z = Z[platform];
  const m = MM[platform];
  const T = (platform === 'ig' ? TIG : TTT) as any;
  const words = (li: number) => T.lines[li].words as Wd[];
  const ig = platform === 'ig';

  return (
    <AbsoluteFill style={{background: C.paper, backgroundImage: `repeating-linear-gradient(0deg, transparent 0 63px, ${C.rule} 63px 65px)`, overflow: 'hidden'}}>
      <Fonts />
      <Audio src={staticFile(`v2v/final_${platform}.wav`)} />

      <div style={{position: 'absolute', inset: 0, transform: camera(f, m.TOTAL, [
        [m.B_in + 12, m.tog_on - 2, 1.09, 540, 470],
        [m.tog_on - 2, m.r1 + 4, 1.07, 380, 600],
        [m.circ1 - 6, m.wipe1 + 18, 1.12, 780, 796],
        [m.circ2 - 4, m.wipe2 + 16, 1.07, 681, 594],
        [m.count - 2, m.wave1 + 12, 1.05, 700, 500],
        [m.E_in + 8, m.A2_in - 2, 1.06, 540, 560],
      ], [[m.q1, 14], [m.q1 + 8, 10], [m.q1 + 16, 10], [m.send, 8], [m.count, 16], [m.post, 8], [m.dm + 9, 14]])}}>
      {/* A: the hunt */}
      <Card f={f} inAt={0} outAt={m.B_in - 6} first outFx="crash" crashAt={[800, 968]} title="your Claude video" tag={<Mono>made by AI</Mono>}>
        <PhoneHunt f={f} m={m} t={f} />
      </Card>

      {/* B: the line to paste, typed with the voice */}
      <Card f={f} inAt={m.B_in} outAt={m.C_in - 6} inFx="zoom" outFx="fly" title="Paste this" tag={
        <span style={{fontFamily: 'Plex', fontSize: 28, border: `3px solid ${C.ink}`, borderRadius: 999, padding: '4px 18px', background: mix(C.card, C.mint, r(f, m.send + 8, m.send + 16)), opacity: r(f, m.send + 6, m.send + 12)}}>copy</span>}>
        {(() => {
          const w1 = words(1);
          // letter by letter: each word's letters spread over the time it is spoken, so typing stays locked to the voice
          const shown = w1.map((w, i) => {
            const txt = w.w.replace(/^"/, '') + (i < w1.length - 1 ? ' ' : '');
            const a = w.s - 2, b = Math.max(a + 2, w.e - 1);
            const n = Math.round(Math.max(0, Math.min(1, (f - a) / (b - a))) * txt.length);
            return txt.slice(0, n);
          }).join('');
          const ton = r(f, m.tog_on, m.tog_on + 6), toff = r(f, m.tog_off, m.tog_off + 6);
          const knob = ton * (1 - toff);
          const rows = [['Late captions?', m.r1], ['Dead pauses?', m.r2], ['Tiny text?', m.r3]] as const;
          const sent = r(f, m.send, m.send + 6);
          return (
            <>
              <div style={{border: `4px solid ${C.ink}`, borderRadius: 22, padding: '20px 24px', background: C.soft, minHeight: 130, opacity: r(f, m.B_in + 4, m.B_in + 12)}}>
                <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 42, lineHeight: 1.2}}>{shown}</span>
                {f < m.send && <Caret color={C.ink} width={5} height={42} blink={shown.length === 0} marginLeft={4} />}
                <span style={{display: 'inline-block', marginLeft: 12, verticalAlign: 'middle', opacity: Math.min(1, r(f, m.phone, m.phone + 6) * 3), transform: `scale(${lerp(0.2, 1, r(f, m.phone, m.phone + 9, BACK))})`}}>
                  <svg width={34} height={52} viewBox="0 0 17 26"><rect x={1.5} y={1.5} width={14} height={23} rx={3} fill={C.mint} stroke={C.ink} strokeWidth={2.2} /></svg>
                </span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 26, opacity: ton}}>
                <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 40}}>Sound</span>
                <span style={{position: 'relative', width: 110, height: 58, borderRadius: 99, border: `4px solid ${C.ink}`, background: mix(C.line, C.mint, knob)}}>
                  <span style={{position: 'absolute', top: 5, left: lerp(6, 56, knob), width: 40, height: 40, borderRadius: 99, background: C.ink}} />
                </span>
                <Mono size={30} color={C.ink}>{f < m.tog_off ? 'on' : 'off'}</Mono>
                <svg width={86} height={60} viewBox="0 0 43 30" style={{marginLeft: 6}}>
                  <path d="M3 11h6l8-7v22l-8-7H3z" fill={C.ink} />
                  {[0, 1].map((k) => { const w = r(f, m.tog_on + 2 + k * 3, m.tog_on + 7 + k * 3) * (1 - r(f, m.tog_off, m.tog_off + 4)); return <path key={k} d={k ? 'M27 5a14 14 0 0 1 0 20' : 'M22 9a8 8 0 0 1 0 12'} fill="none" stroke={C.green} strokeWidth={3} strokeLinecap="round" opacity={w} transform={`translate(${(1 - w) * -4} 0)`} />; })}
                  {f >= m.tog_off && <g stroke={C.red} strokeWidth={3.2} strokeLinecap="round" opacity={r(f, m.tog_off + 2, m.tog_off + 6)}><path d="M24 10l10 10" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - r(f, m.tog_off + 2, m.tog_off + 7)} /><path d="M34 10l-10 10" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - r(f, m.tog_off + 4, m.tog_off + 9)} /></g>}
                </svg>
              </div>
              <div style={{marginTop: 18, display: 'flex', flexDirection: 'column', gap: 12}}>
                {rows.map(([t, at], i) => {
                  const p = r(f, at, at + 7);
                  const tiny = i === 2 ? lerp(1, 0.72, r(f, at + 6, at + 16)) : 1;
                  return (
                    <div key={t} style={{display: 'flex', alignItems: 'center', gap: 14, opacity: p, transform: `translateX(${(1 - p) * 24}px)`}}>
                      <span style={{width: 50, height: 50, borderRadius: 10, border: `4px solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: mix(C.card, '#E3F6EA', r(f, at + 3, at + 9)), transform: `scale(${lerp(1.25, 1, r(f, at + 3, at + 10, BACK))})`}}><Tick d={r(f, at + 3, at + 9)} s={38} color={C.green} /></span>
                      <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 42 * tiny}}>{t}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{position: 'absolute', right: 0, bottom: 10, display: 'flex', alignItems: 'center', gap: 14, opacity: r(f, m.send - 10, m.send - 2)}}>
                <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 38}}>Fix it, then show me.</span>
                <span style={{position: 'relative', width: 78, height: 78, borderRadius: 20, background: mix(C.line, C.ink, sent), border: `4px solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.card, fontFamily: 'Archivo', fontWeight: 900, fontSize: 44, transform: `scale(${1 - 0.1 * Math.sin(Math.PI * sent)})`}}>
                  ↑
                  {f >= m.send && <span style={{position: 'absolute', left: -60, top: -60, right: -60, bottom: -60}}><Sequence from={m.send} layout="none"><TrimBurst x={0.5} y={0.5} count={8} innerRadius={56} reach={18} strokeLength={16} weight={5} color={C.green} seed={4} /></Sequence></span>}
                </span>
              </div>
            </>
          );
        })()}
      </Card>

      {/* C: the real catches from A-1 */}
      <Card f={f} inAt={m.C_in} outAt={m.D_in - 6} inFx="push" outFx="page" title="Caught yesterday" tag={<Mono>A-1 · 17 Nov</Mono>}>
        {(() => {
          const sw = r(f, m.swap, m.swap + 12, IO); // page turn: badge folds away, box folds in
          const box = {opacity: r(f, m.C_in + 6, m.C_in + 14)};
          return (
            <div style={{position: 'relative', height: 540, ...box}}>
              <div style={{position: 'absolute', left: 0, top: 0, opacity: sw < 0.5 ? 1 : 0, transform: `perspective(1800px) rotateY(${-Math.min(1, sw * 2) * 90}deg)`, transformOrigin: 'left center'}}>
                <Wipe before="v2v/proof/badge_before-crop.png" after="v2v/proof/badge_after-crop.png" f={f} at={m.wipe1} W={864} H={460} crop={{x: 420, y: 520, w: 520, h: 240}} circleAt={m.circ1} cx={822} cy={735} seed="v2b" />
                <div style={{marginTop: 14, fontFamily: 'Archivo', fontWeight: 800, fontSize: 44}}>1 · cut-off badge</div>
              </div>
              {sw >= 0.5 && (
                <div style={{position: 'absolute', left: 0, top: 0, transform: `perspective(1800px) rotateY(${(1 - (sw - 0.5) * 2) * 90}deg)`, transformOrigin: 'right center'}}>
                  <Wipe before="v2v/proof/box_before-crop.png" after="v2v/proof/box_after-crop.png" f={f} at={m.wipe2} W={864} H={460} crop={{x: 40, y: 120, w: 860, h: 458}} circleAt={m.circ2} cx={606} cy={274} seed="v2x" />
                  <div style={{marginTop: 14, fontFamily: 'Archivo', fontWeight: 800, fontSize: 44}}>2 · crooked box</div>
                </div>
              )}
            </div>
          );
        })()}
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 14, display: 'flex', gap: 18, alignItems: 'center', justifyContent: 'space-between', opacity: r(f, m.wipe2 + 8, m.wipe2 + 13)}}>
          <Mono size={30} color={C.ink}>both fixed before posting</Mono>
          <Stamp text="FIXED" p={r(f, m.wipe2 + 10, m.wipe2 + 16, BACK)} color={C.green} rot={-6} size={52} />
        </div>
      </Card>

      {/* D: the guide. The 8 checks drop in and pile up (pile-up reference), "8" lands with the crosshair + mint burst, then the pile snaps into the grid */}
      <Card f={f} inAt={m.D_in} outAt={m.E_in} inFx="page" outFx="whip" title="The Video Brief" tag={<Mono>free PDF</Mono>}>
        {(() => {
          const cov = r(f, m.D_in + 4, m.D_in + 14, BACK);
          const checks = ['Timing', 'Dead time', 'Overlaps', 'Empty space', 'First 3 s', 'Readability', 'Loudness', 'Resolution'];
          const rnd = (i: number, k: number) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
          const n8 = r(f, m.count - 2, m.count + 6, BACK);
          const ring = r(f, m.count, m.count + 14);
          return (
            <div style={{position: 'relative', height: 600}}>
              <Img src={staticFile('cover-videobrief.jpg')} style={{position: 'absolute', left: 0, top: 0, width: 290, borderRadius: 12, border: `4px solid ${C.ink}`, opacity: Math.min(1, cov * 2), transform: `translateY(${(1 - cov) * 40}px) rotate(${(1 - cov) * -6}deg)`}} />
              <div style={{position: 'absolute', left: 330, top: 0, display: 'flex', alignItems: 'baseline', gap: 12, opacity: Math.min(1, n8 * 2), transform: `scale(${lerp(1.8, 1, n8)})`, transformOrigin: '40px 60px'}}>
                <span style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 110, lineHeight: 1}}>
                  {f < m.count ? 0 : <Sequence from={m.count} layout="none"><RollingNumber from={0} to={8} duration={0.5} fontSize={110} fontFamily="Archivo" fontWeight={900} color={C.ink} inline /></Sequence>}
                </span>
                <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 48}}>checks</span>
              </div>
              {f >= m.count - 4 && ring < 1 && (
                <svg width={300} height={300} viewBox="-150 -150 300 300" style={{position: 'absolute', left: 220, top: -95, overflow: 'visible'}}>
                  <circle r={lerp(10, 140, ring)} fill="none" stroke={C.mint} strokeWidth={lerp(14, 2, ring)} opacity={1 - ring} />
                  <g stroke={C.ink} strokeWidth={3} opacity={1 - r(f, m.count + 2, m.count + 8)}>
                    <line x1={-34} y1={0} x2={-12} y2={0} /><line x1={12} y1={0} x2={34} y2={0} /><line x1={0} y1={-34} x2={0} y2={-12} /><line x1={0} y1={12} x2={0} y2={34} />
                  </g>
                  <circle r={6} fill={C.ink} opacity={1 - r(f, m.count + 2, m.count + 8)} />
                </svg>
              )}
              {f >= m.count && <span style={{position: 'absolute', left: 260, top: -40, width: 240, height: 240}}><Sequence from={m.count} layout="none"><TrimBurst x={0.5} y={0.5} count={10} innerRadius={70} reach={30} strokeLength={20} weight={6} color={C.green} seed={21} /></Sequence></span>}
              {checks.map((c, i) => {
                const drop = m.D_in + 8 + Math.round(i * 2.6);
                const pd = r(f, drop, drop + 9, Easing.bezier(0.5, 0, 0.75, 0)); // gravity
                const land = r(f, drop + 9, drop + 14, BACK);
                const px = 380 + rnd(i, 1) * 220, py = 300 + rnd(i, 2) * 90 - i * 10, prot = (rnd(i, 3) - 0.5) * 34;
                const gx = 330 + (i % 2) * 272, gy = 160 + Math.floor(i / 2) * 84;
                const snapAt = (i < 4 ? m.wave1 : m.wave2) + (i % 4) * 2;
                const sn = r(f, snapAt, snapAt + 10, BACK);
                const x = lerp(px, gx, sn), y = lerp(lerp(-700, py, pd) - Math.sin(land * Math.PI) * 14, gy, sn), rot = lerp(prot, 0, sn);
                if (f < drop) return null;
                return (
                  <div key={c} style={{position: 'absolute', left: x, top: y, display: 'flex', alignItems: 'center', gap: 8, transform: `rotate(${rot}deg)`, background: C.card, border: `3px solid ${C.ink}`, borderRadius: 14, padding: '6px 14px 6px 8px', boxShadow: `0 ${lerp(8, 2, sn)}px 0 rgba(24,23,20,0.12)`, zIndex: sn > 0 ? 20 + i : i}}>
                    <Tick d={r(f, snapAt + 4, snapAt + 10)} s={36} color={C.green} />
                    <span style={{fontFamily: 'Archivo', fontWeight: 700, fontSize: 32, whiteSpace: 'nowrap'}}>{c}</span>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </Card>

      {/* E: comment -> DM arrives */}
      <Card f={f} inAt={m.E_in} outAt={m.A2_in} inFx="whip" outFx="shrink" title={ig ? 'Comment VIDEO' : 'DM me VIDEO'} tag={<Mono>{ig ? 'on this Reel' : 'on TikTok'}</Mono>}>
        {(() => {
          const KW = 'VIDEO';
          const typed = Math.max(0, Math.min(KW.length, Math.floor((f - m.kw) / 2)));
          const posted = r(f, m.post, m.post + 6);
          const dm = r(f, m.dm, m.dm + 10);
          const free = r(f, m.dm + 8, m.dm + 14);
          return (
            <>
              <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 10, opacity: r(f, m.E_in + 4, m.E_in + 12)}}>
                <span style={{width: 60, height: 60, borderRadius: 99, background: C.soft, border: `3px solid ${C.ink}`, flex: 'none'}} />
                <div style={{flex: 1, display: 'flex', alignItems: 'center', border: `4px solid ${C.ink}`, borderRadius: 999, padding: '12px 24px', height: 80, background: C.card}}>
                  {typed === 0 ? <Mono size={30}>{ig ? 'Add a comment…' : 'Message…'}</Mono> : <span style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 44, letterSpacing: 2}}>{KW.slice(0, typed).split('').map((ch, j) => <span key={j} style={{display: 'inline-block', transform: `translateY(${(1 - r(f, m.kw + j * 2, m.kw + j * 2 + 4, BACK)) * -16}px)`}}>{ch}</span>)}</span>}
                  {f >= m.kw - 6 && posted < 1 && <Caret color={C.ink} width={4} height={42} blink={typed === 0} marginLeft={4} />}
                </div>
                <span style={{position: 'relative', fontFamily: 'Archivo', fontWeight: 900, fontSize: 36, padding: '14px 24px', borderRadius: 999, border: `4px solid ${C.ink}`, background: mix(C.card, C.mint, posted)}}>
                  {ig ? 'Post' : 'Send'}
                  {f >= m.post && <span style={{position: 'absolute', left: -60, top: -60, right: -60, bottom: -60}}><Sequence from={m.post} layout="none"><TrimBurst x={0.5} y={0.5} count={8} innerRadius={64} reach={18} strokeLength={16} weight={5} color={C.green} seed={9} /></Sequence></span>}
                </span>
              </div>
              <div style={{marginTop: 40, display: 'flex', alignItems: 'flex-start', gap: 16, opacity: Math.min(1, dm * 2.5), transform: `translateY(${(1 - r(f, m.dm, m.dm + 10, BACK)) * 70}px) scale(${lerp(0.85, 1, r(f, m.dm, m.dm + 10, BACK))})`, transformOrigin: 'left top'}}>
                <span style={{width: 60, height: 60, borderRadius: 99, background: C.ink, color: C.mint, fontFamily: 'Archivo', fontWeight: 900, fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none'}}>EM</span>
                <div style={{background: C.soft, border: `3px solid ${C.ink}`, borderRadius: 26, padding: '18px 22px', display: 'flex', gap: 18, alignItems: 'center'}}>
                  <Img src={staticFile('cover-videobrief.jpg')} style={{width: 110, borderRadius: 8, border: `3px solid ${C.ink}`}} />
                  <div>
                    <Mono size={24}>@theexactmethod · DM</Mono>
                    <div style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 38, marginTop: 6}}>Here's The Video Brief.</div>
                  </div>
                </div>
              </div>
              <div style={{position: 'absolute', right: 20, bottom: 40}}><Stamp text="FREE" p={free} color={C.green} rot={-8} size={56} /></div>
            </>
          );
        })()}
      </Card>

      {/* A again: loop back to frame 0 */}
      {f >= m.A2_in && (
        <Card f={f} inAt={m.A2_in} outAt={99999} inFx="pull" title="your Claude video" tag={<Mono>made by AI</Mono>}>
          <PhoneHunt f={f} m={m} t={f - m.TOTAL} loop />
        </Card>
      )}

      </div>
      <Caption f={f} z={z} />
      <Sage f={f} m={m} />
    </AbsoluteFill>
  );
};

export const V2Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.paper, backgroundImage: `repeating-linear-gradient(0deg, transparent 0 63px, ${C.rule} 63px 65px)`}}>
    <Fonts />
    <div style={{position: 'absolute', left: 70, right: 70, top: 360, background: C.card, border: `4px solid ${C.ink}`, borderRadius: 30, padding: '46px 46px'}}>
      <Mono size={30}>paste this before you watch</Mono>
      <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 92, lineHeight: 1.02, letterSpacing: -2, marginTop: 30}}>Stop hunting<br />for mistakes.</div>
      <div style={{marginTop: 34, display: 'flex', gap: 14}}>
        {['?', '?', '?'].map((q, i) => <span key={i} style={{width: 80, height: 80, borderRadius: 99, background: C.red, color: C.card, fontFamily: 'Archivo', fontWeight: 900, fontSize: 50, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{q}</span>)}
      </div>
    </div>
  </AbsoluteFill>
);
