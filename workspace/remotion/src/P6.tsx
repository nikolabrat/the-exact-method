// P-6 "Never send ChatGPT's first draft" — Plain Voice (PLAIN). Real ChatGPT runs 20 Nov 2026 (A default, B Plain Voice, C after the fix line).
// V-2 system (paper, cards, camera, captions, Sage). Frame 0 = last frame.
// remocn: ScribbleCircle, Squiggle, TrimBurst, RollingNumber, Caret, WhipPan.
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {ScribbleCircle} from '@/components/remocn/scribble-circle';
import {TrimBurst} from '@/components/remocn/trim-burst';
import {RollingNumber} from '@/components/remocn/rolling-number';
import {Caret} from '@/components/remocn/caret';
import {whipPan} from '@/components/remocn/whip-pan';
import TIG from './p6timing_ig.json';
import TTT from './p6timing_tt.json';
import MIG from './p6mouth_ig.json';
import MTT from './p6mouth_tt.json';
import {SmashCount} from '@/components/remocn/smash-count';
import {CrumpleToss} from '@/components/remocn/crumple-toss';
import {ScanBand} from '@/lib/remocn/audit-core';
import {Squiggle} from '@/components/remocn/squiggle';
import {InkArrow} from '@/components/remocn/ink-arrow';

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
  ig: [[3, 2, 3, 2], [2, 2, 2, 2], [2, 3, 3], [3, 2, 2], [3, 2, 2], [2, 2, 2, 2, 3, 1], [3, 3, 1]],
  tt: [[3, 2, 3, 2], [2, 2, 2, 2], [2, 3, 3], [3, 2, 2], [3, 2, 2], [3, 2, 2, 2, 3, 1], [3, 3, 1]],
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
// named moments straight from the word timings: L = line starts, w(line, word) = word start frame
const mk = (T: any) => ({L: T.lines.map((l: Line) => l.words[0].s) as number[], w: (li: number, wi: number) => T.lines[li].words[wi].s as number, TOTAL: T.total as number});
type MT = ReturnType<typeof mk>;
const MM = {ig: mk(TIG), tt: mk(TTT)};
export const P6_TOTAL = {ig: Z.ig.TOTAL, tt: Z.tt.TOTAL};

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
// measured mouth of each pose in the source png (centre x, line y, width): the drawn mouth sits exactly there.
// sage/<pose>-nm.png is the same pose with the drawn mouth painted out (inpainted), used while he talks.
const MOUTH: Record<Pose, [number, number, number]> = {sage: [162.5, 207.0, 49], 's-check': [169.0, 214.7, 52], 's-finger': [205.5, 211.6, 39], 's-point': [329.5, 208.0, 61], 's-present': [347.5, 207.0, 49], 's-shrug': [278.0, 214.7, 52], 's-sigh': [195.0, 215.5, 38], 's-think': [156.5, 208.7, 37]};
// painted-out mouth patch per pose (x, y, w, h in the source png): only the mouth pixels, so nothing else moves
const PATCH: Record<Pose, number[]> = {sage: [132, 193, 62, 25], 's-check': [137, 198, 65, 27], 's-finger': [180, 195, 52, 35], 's-point': [293, 187, 74, 32], 's-present': [317, 193, 62, 24], 's-shrug': [246, 195, 65, 30], 's-sigh': [170, 207, 51, 19], 's-think': [132, 200, 50, 19]};
// lv 0 closed, 1 small, 2 medium, 3 open; drawn in Sage's line style, top lip on the original mouth line
const Mouth: React.FC<{pose: Pose; lv: number; k: number}> = ({pose, lv, k}) => {
  const [mx, my, mw] = MOUTH[pose];
  const w = mw * k * [0.8, 0.86, 0.92, 0.98][lv];
  const h = mw * k * [0, 0.38, 0.48, 0.6][lv];
  const cx = mx * k, cy = my * k, sw = 3.4 * k;
  return (
    <svg width={2} height={2} style={{position: 'absolute', left: cx, top: cy, overflow: 'visible'}}>
      {lv === 0 ? (
        <path d={`M ${-w / 2} ${-1 * k} Q 0 ${w * 0.12} ${w / 2} ${-1 * k}`} fill="none" stroke="#1E1612" strokeWidth={sw} strokeLinecap="round" />
      ) : (
        <g>
          <path d={`M ${-w / 2} 0 Q 0 ${h * 0.12} ${w / 2} 0 C ${w * 0.44} ${h * 0.95} ${-w * 0.44} ${h * 0.95} ${-w / 2} 0 Z`} fill="#5B1E1E" stroke="#1E1612" strokeWidth={sw} strokeLinejoin="round" />
          {lv >= 2 && <path d={`M ${-w * 0.26} ${h * 0.62} Q 0 ${h * 0.36} ${w * 0.26} ${h * 0.62} Q 0 ${h * 0.78} ${-w * 0.26} ${h * 0.62} Z`} fill="#E87C7C" />}
          <path d={`M ${-w * 0.34} ${h * 0.12} Q 0 ${h * 0.26} ${w * 0.34} ${h * 0.12}`} fill="none" stroke="#FFFFFF" strokeWidth={Math.max(2, h * 0.14)} strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
};
// Sage as a talking bust in the corner (reference: thomassmithai): instant pose swaps with a small pop, the mouth
// flaps with the voice, pose follows what is being talked about, slight breathing
const Sage: React.FC<{f: number; m: MT; words: number[]; mouth: number[]}> = ({f, m, mouth}) => {
  const L = m.L, w = m.w, T = m.TOTAL;
  const POSES: [number, Pose][] = [
    [0, 's-think'], [w(0, 5) - 3, 's-point'], [w(1, 0) - 3, 's-present'], [w(1, 4) - 3, 'sage'],
    [L[2] - 3, 's-point'], [w(2, 5) - 3, 's-check'], [L[3] - 3, 's-shrug'], [w(3, 4) - 3, 's-sigh'],
    [L[4] - 3, 's-finger'], [w(4, 5) - 3, 's-present'], [L[5] - 3, 's-point'], [w(5, 7) - 3, 's-check'],
    [L[6] - 3, 'sage'], [w(6, 5) - 3, 's-think'],
  ];
  let idx = 0;
  POSES.forEach(([t], i) => { if (f >= t) idx = i; });
  const [t0, p] = POSES[idx];
  const d = f - t0;
  const pop = idx > 0 && d < 6 ? 0.035 * (1 - d / 6) : 0;
  const breathe = Math.sin((2 * Math.PI * f * 5) / T);
  const k = 1.06, H = 1121 * k;
  const ax = 872, top = 1388;
  const left = ax - MOUTH[p][0] * k;
  return (
    <div style={{position: 'absolute', left, top: top + breathe * 2.5, width: 700, height: H, transformOrigin: `${MOUTH[p][0] * k}px ${H * 0.45}px`, transform: `scale(${1 + pop + breathe * 0.004})`}}>
      {(() => {
        const lv = mouth[f] ?? 0;
        const drawn = lv > 0 || p === 's-finger';
        return (
          <>
            <Img src={staticFile(`sage/${p}.png`)} style={{position: 'absolute', left: 0, top: 0, height: H}} />
            <Img src={staticFile(`sage/${p}-patch.png`)} style={{position: 'absolute', left: PATCH[p][0] * k, top: PATCH[p][1] * k, width: PATCH[p][2] * k, height: PATCH[p][3] * k, opacity: drawn ? 1 : 0}} />
            {drawn && <Mouth pose={p} lv={lv} k={k} />}
          </>
        );
      })()}
    </div>
  );
};

// ---------- building blocks ----------
const WhipP = whipPan({direction: 'left', blur: 18}).component as React.FC<any>;
type InFx = 'rise' | 'whip' | 'zoom' | 'push' | 'page' | 'pull';
type OutFx = 'fade' | 'whip' | 'crash' | 'fly' | 'page' | 'shrink';
// one card; every change of card uses its own move (crash zoom, fly-off, page turn, whip, pull back)
const Card: React.FC<{f: number; inAt: number; outAt: number; children: React.ReactNode; title: React.ReactNode; tag?: React.ReactNode; first?: boolean; inFx?: InFx; outFx?: OutFx; crashAt?: [number, number]; zoom?: number; top?: number; h?: number}> = ({f, inAt, outAt, children, title, tag, first, inFx = 'rise', outFx = 'fade', crashAt = [800, 700], zoom = 1, top = 290, h = 760}) => {
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
    if (outFx === 'crash') { const k = lerp(1, 2.8, pout); tf = `scale(${k})`; origin = `${crashAt[0] - 70}px ${crashAt[1] - top}px`; blur = pout * 16; op = 1 - r(f, outAt + 6, outAt + 10); }
    if (outFx === 'fly') { tf = `translateY(${-pout * 1400}px) rotate(${-pout * 9}deg)`; }
    if (outFx === 'page') { tf = `perspective(2200px) rotateY(${-pout * 88}deg)`; origin = 'left center'; op = 1 - r(f, outAt + 7, outAt + 10); }
    if (outFx === 'shrink') { op = 1 - pout; tf = `scale(${lerp(1, 0.86, pout)})`; }
  }
  const tape = (side: 'l' | 'r') => <div style={{position: 'absolute', [side === 'l' ? 'left' : 'right']: side === 'l' ? 30 : 190, top: top - 22, width: 150, height: 46, background: 'rgba(240,226,190,0.78)', border: '1px solid rgba(160,140,100,0.35)', transform: `rotate(${side === 'l' ? -8 : 7}deg)`, zIndex: 4} as React.CSSProperties} />;
  const body0 = (
    <div style={{position: 'absolute', left: 70, right: 70, top, height: h, background: C.card, border: `4px solid ${C.ink}`, borderRadius: 30, padding: '30px 38px', overflow: 'hidden',
      opacity: op, transform: tf || undefined, transformOrigin: origin, filter: blur > 0.2 ? `blur(${blur}px)` : undefined, boxShadow: '0 14px 0 rgba(24,23,20,0.08)'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 18, borderBottom: `3px solid ${C.line}`, minHeight: 72, position: 'relative', zIndex: 3}}>
        <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 50, letterSpacing: -1}}>{title}</span>
        {tag}
      </div>
      <div style={{position: 'relative', marginTop: 26, height: (h - 160) / zoom, width: `${100 / zoom}%`, transform: `scale(${zoom})`, transformOrigin: 'top left'}}>{children}</div>
    </div>
  );
  const body = <div style={{position: 'absolute', inset: 0, opacity: op, transform: tf || undefined, transformOrigin: origin, filter: blur > 0.2 ? `blur(${blur}px)` : undefined}}>{React.cloneElement(body0, {style: {...body0.props.style, opacity: 1, transform: undefined, filter: undefined}})}{tape('l')}{tape('r')}</div>;
  if (exiting && outFx === 'whip') return <WhipP presentationDirection="exiting" presentationProgress={pout} passedProps={{direction: 'left', blur: 18}}>{body}</WhipP>;
  if (!exiting && inFx === 'whip' && pin < 1) return <WhipP presentationDirection="entering" presentationProgress={pin} passedProps={{direction: 'left', blur: 18}}>{body}</WhipP>;
  return body;
};
// camera over the cards: slow loop-safe drift, punch-ins on a point, impact shakes
type Punch = [number, number, number, number, number]; // from, to, scale, x, y (screen px)
const camera = (f: number, total: number, punches: Punch[], shakes: [number, number][]) => {
  const ph = (2 * Math.PI * f) / total;
  let k = 1 + 0.018 * Math.sin(ph * 3), tx = 12 * Math.sin(ph * 2), ty = 6 * Math.sin(ph * 4);
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


// ---------- N-7 building blocks ----------
const IW = 856; // inner card width
const K = IW / 1040; // footage crop scale
const Dark: React.FC<{children: React.ReactNode; h?: number; style?: React.CSSProperties}> = ({children, h, style}) => (
  <div style={{position: 'relative', width: IW, height: h, background: '#0E0E0E', borderRadius: 20, overflow: 'hidden', ...style}}>{children}</div>
);
const Shot: React.FC<{src: string; w: number; h: number; style?: React.CSSProperties}> = ({src, w, h, style}) => (
  <Img src={staticFile(`n7/${src}`)} style={{position: 'absolute', left: 0, top: 0, width: w * K, height: h * K, ...style}} />
);
// marker sweep over a line of the footage (crop px coords)
const Mark: React.FC<{f: number; at: number; x: number; y: number; w: number; h: number; color?: string; dur?: number}> = ({f, at, x, y, w, h, color = C.mint, dur = 10}) => (
  <div style={{position: 'absolute', left: x * K - 4, top: y * K - 2, height: h * K + 4, width: (w * K + 8) * r(f, at, at + dur, IO), background: color, opacity: 0.42, borderRadius: 4, mixBlendMode: 'screen'}} />
);
const Label: React.FC<{text: string; p: number; bg?: string; fg?: string}> = ({text, p, bg = C.ink, fg = C.card}) => (
  <span style={{display: 'inline-block', fontFamily: 'Plex', fontSize: 24, letterSpacing: 2, padding: '6px 14px', borderRadius: 8, background: bg, color: fg, opacity: p, transform: `translateY(${(1 - p) * 10}px)`}}>{text}</span>
);
// re-typeset ChatGPT text (verbatim excerpts of the real run), large enough to read on a phone
const Hl: React.FC<{f: number; at: number; children: React.ReactNode; color?: string; under?: boolean; still?: boolean}> = ({f, at, children, color = C.mint, under, still}) => {
  const p = still ? 0 : r(f, at, at + 10, IO);
  return <span style={{fontWeight: 700, color: color === C.mint && p > 0.35 ? C.ink : '#FFFFFF', backgroundImage: `linear-gradient(${color}, ${color})`, backgroundRepeat: 'no-repeat', backgroundPosition: under ? '0 92%' : '0 50%', backgroundSize: `${p * 100}% ${under ? '7px' : '100%'}`, padding: under ? 0 : '0 4px', margin: under ? 0 : '0 -4px', borderRadius: 4}}>{children}</span>;
};
const UserB: React.FC<{text: string; size?: number; chars?: number}> = ({text, size = 30, chars}) => (
  <div style={{display: 'flex', justifyContent: 'flex-end'}}>
    <span style={{background: '#1F3D73', color: '#F2F2F2', borderRadius: 26, padding: '12px 24px', fontFamily: 'Archivo', fontSize: size, lineHeight: 1.3, maxWidth: 700}}>
      {chars === undefined ? text : <>{text.slice(0, chars)}<span style={{opacity: 0}}>{text.slice(chars)}</span></>}
    </span>
  </div>
);
const Answer: React.FC<{children: React.ReactNode; size?: number}> = ({children, size = 38}) => (
  <div style={{fontFamily: 'Archivo', fontSize: size, lineHeight: 1.32, color: '#D9D9D9', marginTop: 18}}>{children}</div>
);
const Real: React.FC<{p?: number}> = ({p = 1}) => <div style={{marginTop: 10, opacity: p}}><Mono size={22}>excerpt · real run · ChatGPT · 20 Nov 2026</Mono></div>;

// ---------- P-6 building blocks ----------
const RED = C.red, GREEN = C.green;
const EMO = "'Noto Color Emoji'";
const Plus: React.FC<{f: number; at: number}> = ({f, at}) => {
  const q = r(f, at, at + 18, OUT);
  if (q <= 0 || q >= 1) return null;
  return <span style={{position: 'absolute', left: 0, top: -30 - q * 46, fontFamily: 'Archivo', fontWeight: 900, fontSize: 30, color: '#FF6B61', opacity: Math.min(1, q * 5) * (1 - r(f, at + 10, at + 18)), transform: `scale(${lerp(1.5, 1, Math.min(1, q * 3))})`, zIndex: 9, whiteSpace: 'nowrap'}}>+1</span>;
};
// a mark the counter counts: box around bold text (wraps across lines) or a drawn ring around one character
const Bd: React.FC<{f: number; at: number; children: React.ReactNode; still?: boolean; mark?: boolean}> = ({f, at, children, still, mark = true}) => {
  const p = !mark ? 0 : still ? 1 : r(f, at, at + 7, IO);
  return (
    <span style={{position: 'relative', fontWeight: 800, color: '#FFFFFF', border: `3px solid rgba(217,83,74,${p})`, background: `rgba(217,83,74,${0.22 * p})`, borderRadius: 7, padding: '0 4px', margin: '0 -7px',
      WebkitBoxDecorationBreak: 'clone', boxDecorationBreak: 'clone'} as React.CSSProperties}>{children}{mark && !still && <Plus f={f} at={at} />}</span>
  );
};
const Rg: React.FC<{f: number; at: number; children: React.ReactNode; still?: boolean; mark?: boolean; d?: number}> = ({f, at, children, still, mark = true, d = 52}) => {
  const p = !mark ? 0 : still ? 1 : r(f, at, at + 8, IO);
  const pop = still ? 0 : Math.sin(r(f, at, at + 10) * Math.PI);
  return (
    <span style={{position: 'relative', display: 'inline-block'}}>
      <span style={{position: 'relative', zIndex: 1, display: 'inline-block', transform: `scale(${1 + pop * 0.25})`}}>{children}</span>
      {mark && !still && <Plus f={f} at={at} />}
      {p > 0 && (
        <svg width={d} height={d} viewBox="0 0 52 52" style={{position: 'absolute', left: '50%', top: '52%', marginLeft: -d / 2, marginTop: -d / 2, overflow: 'visible'}}>
          <circle cx={26} cy={26} r={22} fill="none" stroke={RED} strokeWidth={4} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} transform="rotate(-100 26 26)" strokeLinecap="round" />
        </svg>
      )}
    </span>
  );
};
// number that flips to each new value
const Flip: React.FC<{f: number; ev: [number, number][]; size?: number; color?: string}> = ({f, ev, size = 54, color = C.card}) => {
  let i = 0;
  ev.forEach(([t], k) => { if (f >= t) i = k; });
  const [t, v] = ev[i];
  const p = i === 0 ? 1 : r(f, t, t + 6, IO);
  const prev = i > 0 ? ev[i - 1][1] : v;
  const box: React.CSSProperties = {position: 'absolute', left: 0, right: 0, textAlign: 'center', fontFamily: 'Archivo', fontWeight: 900, fontSize: size, lineHeight: `${size * 1.2}px`, color};
  return (
    <span style={{position: 'relative', display: 'inline-block', width: size * 0.95, height: size * 1.2, overflow: 'hidden', verticalAlign: 'middle'}}>
      {p < 1 && <span style={{...box, top: -p * size * 1.2}}>{prev}</span>}
      <span style={{...box, top: (1 - p) * size * 1.2}}>{v}</span>
    </span>
  );
};
const Counter: React.FC<{f: number; ev: [number, number][]; zero?: boolean; label?: string; T?: number}> = ({f, ev, zero, label = 'giveaways', T = 724}) => {
  let i = 0;
  ev.forEach(([t], k) => { if (f >= t) i = k; });
  const v = ev[i][1];
  let swing = 2.5 * Math.sin((2 * Math.PI * f * 3) / T);
  ev.forEach(([t], k) => { if (k > 0 && f >= t && f - t < 40) swing += 16 * Math.exp(-(f - t) / 9) * Math.sin((f - t) * 0.55); });
  const bg = v === 0 || zero ? GREEN : RED;
  return (
    <span style={{display: 'flex', alignItems: 'center', gap: 12}}>
      <Mono size={24}>{label}</Mono>
      <span style={{position: 'relative', width: 96, height: 74}}>
        <span style={{position: 'absolute', left: 0, top: 0, width: 96, height: 112, transformOrigin: '48px -34px', transform: `rotate(${swing}deg)`}}>
          <span style={{position: 'absolute', left: 46, top: -34, width: 4, height: 36, background: C.ink, borderRadius: 2}} />
          <span style={{position: 'absolute', left: 0, top: 0, width: 96, height: 92, borderRadius: '18px 18px 22px 22px', background: bg, border: `4px solid ${C.ink}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <span style={{position: 'absolute', top: 8, width: 12, height: 12, borderRadius: 9, background: C.paper, border: `3px solid ${C.ink}`}} />
            <span style={{marginTop: 14}}><Flip f={f} ev={ev} size={50} /></span>
          </span>
        </span>
      </span>
    </span>
  );
};
const Subj: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{fontFamily: 'Archivo', fontSize: 30, color: '#9A9A9A', paddingBottom: 14, borderBottom: '2px solid #3A3A3A', marginBottom: 12}}>
    <span style={{fontFamily: 'Plex', fontSize: 22, letterSpacing: 2, color: '#8A8A8A'}}>SUBJECT </span><span style={{color: '#EDEDED'}}>{children}</span>
  </div>
);
const P: React.FC<{children: React.ReactNode; dim?: boolean}> = ({children, dim}) => (
  <div style={{fontFamily: 'Archivo', fontSize: 31, lineHeight: 1.34, color: dim ? '#8A8A8A' : '#DADADA', marginTop: 10}}>{children}</div>
);
const Mail: React.FC<{children: React.ReactNode; h?: number}> = ({children, h}) => (
  <div style={{position: 'relative', width: '100%', boxSizing: 'border-box', height: h, background: '#2A2A2A', borderRadius: 22, padding: '20px 28px 22px', overflow: 'hidden'}}>{children}</div>
);
// run A, verbatim excerpt. m = mark frames: [emoji, !subject, !share, bold1, !friday, bold2, !week, !welcome, mia]
const MailA: React.FC<{f: number; m?: number[]; still?: boolean; h?: number}> = ({f, m, still, h}) => {
  const k = (i: number) => (m ? m[i] : 1e9);
  const on = !!m;
  return (
    <Mail h={h}>
      <Subj>Something new is burning… <Rg f={f} at={k(0)} still={still} mark={on}><span style={{fontFamily: EMO}}>🕯️</span></Rg> Ember &amp; Oak opens Friday<Rg f={f} at={k(1)} still={still} mark={on} d={44}>!</Rg></Subj>
      <P>Hi there,</P>
      <P>We have something exciting to share<Rg f={f} at={k(2)} still={still} mark={on} d={44}>!</Rg></P>
      <P><Bd f={f} at={k(3)} still={still} mark={on}>Ember &amp; Oak, our new online candle shop, officially opens this Friday<Rg f={f} at={k(4)} still={still} mark={on} d={44}>!</Rg></Bd></P>
      <P dim>…</P>
      <P>And to celebrate our launch, we're giving you <Bd f={f} at={k(5)} still={still} mark={on}>10% OFF everything during our first week<Rg f={f} at={k(6)} still={still} mark={on} d={44}>!</Rg></Bd></P>
      <P dim>…</P>
      <P>Thank you for being part of our journey. We can't wait to welcome you<Rg f={f} at={k(7)} still={still} mark={on} d={44}>!</Rg></P>
      <P>Warm wishes, <Bd f={f} at={k(8)} still={still} mark={on}>Mia</Bd></P>
    </Mail>
  );
};
// run B (Plain Voice instructions on), verbatim excerpt. m = [emoji, !share, bold1, !friday, bold2, !week, !oak]
const MailB: React.FC<{f: number; m?: number[]; h?: number}> = ({f, m, h}) => {
  const k = (i: number) => (m ? m[i] : 1e9);
  const on = !!m;
  return (
    <Mail h={h}>
      <Subj>Something warm is coming: Meet Ember &amp; Oak <Rg f={f} at={k(0)} mark={on}><span style={{fontFamily: EMO}}>🕯️</span></Rg></Subj>
      <P>Hi there,</P>
      <P>I'm excited to share something special with you<Rg f={f} at={k(1)} mark={on} d={44}>!</Rg></P>
      <P>My new online candle shop, <Bd f={f} at={k(2)} mark={on}>Ember &amp; Oak</Bd>, officially opens this Friday<Rg f={f} at={k(3)} mark={on} d={44}>!</Rg></P>
      <P dim>…</P>
      <P>To celebrate our launch, I'm offering <Bd f={f} at={k(4)} mark={on}>10% off all orders during our first week<Rg f={f} at={k(5)} mark={on} d={44}>!</Rg></Bd></P>
      <P dim>…</P>
      <P>Keep an eye out for Friday's launch. I can't wait to welcome you to Ember &amp; Oak<Rg f={f} at={k(6)} mark={on} d={44}>!</Rg></P>
      <P>Warmly,</P>
      <P>Mia</P>
    </Mail>
  );
};
// run C (after the fix line), verbatim excerpt
const MailC: React.FC<{h?: number}> = ({h}) => (
  <Mail h={h}>
    <Subj>Something warm is coming: Meet Ember &amp; Oak</Subj>
    <P>Hi there,</P>
    <P>I'm excited to share something special with you.</P>
    <P>My new online candle shop, Ember &amp; Oak, officially opens this Friday.</P>
    <P dim>…</P>
    <P>To celebrate our launch, I'm offering 10% off all orders during our first week.</P>
    <P dim>…</P>
    <P>Keep an eye out for Friday's launch. I can't wait to welcome you to Ember &amp; Oak.</P>
  </Mail>
);
const Tt: React.FC<{children: React.ReactNode; color?: string}> = ({children, color = C.ink}) => (
  <span style={{display: 'flex', flexDirection: 'column', lineHeight: 1.05}}><span style={{color}}>{children}</span><span style={{fontFamily: 'Plex', fontWeight: 500, fontSize: 20, letterSpacing: 1, color: C.muted, marginTop: 6}}>excerpt · real run · ChatGPT · 20 Nov 2026</span></span>
);
const FIX = 'Your last answer used bold and exclamation marks. My instructions say plain paragraphs only. Rewrite the same answer following them exactly.';

// headline over the frame-0 layout: the full hook
const Headline: React.FC<{f: number; m: MT; still?: boolean}> = ({f, m, still}) => {
  const nine = still ? 0 : Math.sin(r(f, m.w(0, 8) - 2, m.w(0, 8) + 8) * Math.PI);
  return (
    <div style={{position: 'absolute', left: 70, right: 70, top: 222}}>
      <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 76, lineHeight: 1.0, letterSpacing: -2, color: C.ink}}>
        Never send ChatGPT's<br />
        <span style={{position: 'relative', display: 'inline-block'}}>
          first draft.
          <span style={{position: 'absolute', left: -24, top: -22}}>
            <Sequence from={-60} layout="none"><ScribbleCircle width={420} height={124} color={RED} strokeWidth={7} durationSteps={7} seed="p6hook" /></Sequence>
          </span>
        </span>
      </div>
      <div style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 46, marginTop: 20, color: C.ink, display: 'flex', alignItems: 'center', gap: 14}}>
        This one has
        <span style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 74, height: 66, borderRadius: 36, background: RED, color: C.card, border: `4px solid ${C.ink}`, fontWeight: 900, fontSize: 46, transform: `scale(${1 + nine * 0.3}) rotate(${nine * -6}deg)`}}>9</span>
        giveaways.
      </div>
      <div style={{position: 'absolute', left: 0, top: 0, width: 940, height: 520}}>
        <Sequence from={-60} layout="none"><InkArrow from={{x: 672, y: 196}} to={{x: 800, y: 326}} curvature={-0.35} color={RED} strokeWidth={6} drawDur={10} headSize={20} seed="p6nine" /></Sequence>
      </div>
    </div>
  );
};
// the frame-0 layout: run A in front with its 9, run C peeking behind with its 0
const SLOT = {top: 520, h: 560, zoom: 0.72};

const WORDS = {ig: (TIG as any).lines.flatMap((l: Line) => l.words.map((x) => x.s)) as number[], tt: (TTT as any).lines.flatMap((l: Line) => l.words.map((x) => x.s)) as number[]};
export const P6: React.FC<{platform: 'ig' | 'tt'}> = ({platform}) => {
  const f = useCurrentFrame();
  const z = Z[platform];
  const m = MM[platform];
  const L = m.L, w = m.w;
  const ig = platform === 'ig';
  const END = L[6];
  // line 02: the scan turns run A into run C, then the card grows to full size
  const scan = r(f, w(1, 0) - 2, w(1, 3) + 2, IO);
  const grow = r(f, w(1, 4) - 6, w(1, 4) + 8, IO);
  const headO = f < END ? 1 - r(f, w(1, 4) - 8, w(1, 4)) : r(f, END + 4, END + 13);
  // line 03 mark times: emoji, bold x3, ! x5 (counter order); MailA order = [emoji, !subj, !share, bold1, !fri, bold2, !week, !welcome, mia]
  const eA = w(2, 1), b1 = w(2, 2), b2 = w(2, 3), b3 = w(2, 4);
  const x1 = w(2, 5), x2 = w(2, 6), x3 = w(2, 6) + 5, x4 = w(2, 7), x5 = w(2, 7) + 5;
  const mA = [eA, x1, x2, b1, x3, b2, x4, x5, b3];
  const evA: [number, number][] = [[0, 0], ...[eA, b1, b2, b3, x1, x2, x3, x4, x5].map((t, i) => [t, i + 1] as [number, number])];
  // line 04: seven marks left with the rules on
  const s0 = w(3, 4) - 2;
  const mB = [s0, s0 + 2, s0 + 4, s0 + 6, s0 + 8, s0 + 10, s0 + 12];
  const evB: [number, number][] = [[0, 0], ...mB.map((t, i) => [t, i + 1] as [number, number])];
  // line 05: type the fix line, send, run B crumples, smash count 7 -> 0, run C lands
  const typeA = L[4] + 1, sent = typeA + 26, toss = sent + 2, smash = sent + 3, cIn = w(4, 6) + 4;
  const typed = Math.round(r(f, typeA, sent - 2, (t: number) => t) * FIX.length);
  const smashO = f < smash ? 0 : f < smash + 24 ? r(f, smash, smash + 3) : 1 - r(f, smash + 24, smash + 30);

  const frame0 = (still: boolean, cardF: number) => (
    <>
      {/* run C peeking behind */}
      <div style={{position: 'absolute', inset: 0, transform: 'translate(46px, -14px) rotate(3deg)', opacity: still ? 1 : 1 - r(f, w(1, 3), w(1, 3) + 6)}}>
        <Card f={cardF} inAt={0} outAt={99999} first top={SLOT.top} h={SLOT.h} zoom={SLOT.zoom} title={<span style={{color: GREEN}}>After</span>} tag={<Counter f={0} ev={[[0, 0]]} />}>
          <MailC />
        </Card>
      </div>
    </>
  );

  return (
    <AbsoluteFill style={{background: C.paper, backgroundImage: `repeating-linear-gradient(0deg, transparent 0 63px, ${C.rule} 63px 65px)`, overflow: 'hidden'}}>
      <Fonts />
      <Audio src={staticFile(`p6v/final_${platform}.wav`)} />

      <div style={{position: 'absolute', inset: 0, transform: camera(f, m.TOTAL, [
        [w(0, 2) - 4, w(0, 8), 1.04, 540, 1060],
        [eA - 4, b1 - 2, 1.1, 640, 470],
        [x1 - 4, L[3] - 8, 1.05, 540, 700],
        [w(3, 3), L[4] - 8, 1.1, 540, 620],
        [L[5] + 6, END - 4, 1.05, 540, 640],
      ], [[w(0, 8), 7], [w(1, 3) + 1, 14], [x5 + 4, 10], [w(3, 6) + 2, 12], [smash + 13, 18], [w(5, ig ? 4 : 5) + 6, 7]])}}>

      {/* S0-S1: the frame-0 layout; the scan turns A into C, then the card grows */}
      {f < L[2] + 6 && (
        <>
          {frame0(false, f)}
          {(() => {
            const top = lerp(SLOT.top, 290, grow), h = lerp(SLOT.h, 770, grow), zm = lerp(SLOT.zoom, 1, grow);
            return (
              <div style={{position: 'absolute', inset: 0, transform: `translate(${lerp(-20, 0, grow)}px, 0) rotate(${lerp(-1.5, 0, grow)}deg)`}}>
                <Card f={f} inAt={0} outAt={L[2] - 6} first outFx="whip" top={top} h={h} zoom={zm}
                  title={<Tt><span style={{position: 'relative', display: 'inline-block'}}><span style={{opacity: 1 - r(f, w(1, 3) - 4, w(1, 3) + 2)}}>First draft</span><span style={{position: 'absolute', left: 0, top: 0, whiteSpace: 'nowrap', color: GREEN, opacity: r(f, w(1, 3) - 2, w(1, 3) + 4)}}>Same request</span></span></Tt>}
                  tag={<Counter T={m.TOTAL} f={f} ev={[[0, 9], [w(1, 3), 0]]} />}>
                  <div style={{position: 'relative'}}>
                    <MailA f={f} m={[0, 0, 0, 0, 0, 0, 0, 0, 0]} still />
                    {scan > 0 && (
                      <div style={{position: 'absolute', left: 0, top: 0, right: 0, zIndex: 5, clipPath: `inset(0 0 ${(1 - scan) * 100}% 0)`}}><MailC h={1400} /></div>
                    )}
                    {scan > 0 && scan < 1 && <div style={{position: 'absolute', left: 0, top: 0, right: 0, zIndex: 6, height: 900}}><ScanBand y={scan * 900} color={GREEN} w={IW} trail={120} /></div>}
                  </div>
                  {f >= w(1, 3) && <div style={{position: 'absolute', right: 20, top: 420, zIndex: 8}}><Stamp text="0 GIVEAWAYS" p={r(f, w(1, 3), w(1, 3) + 7, BACK)} color={GREEN} rot={-7} size={50} /></div>}
                  {f >= w(1, 5) - 4 && <div style={{position: 'absolute', left: 0, bottom: 0, right: 0, zIndex: 8}}><Label text={`same prompt · same ChatGPT · ${'20 Nov 2026'}`} p={r(f, w(1, 5) - 4, w(1, 5) + 4)} bg={GREEN} /></div>}
                </Card>
              </div>
            );
          })()}
        </>
      )}

      {/* S2: back to run A, nine marks counted */}
      <Card f={f} inAt={L[2] - 4} outAt={L[3] - 6} inFx="whip" outFx="page" title={<Tt color={RED}>Default ChatGPT</Tt>} tag={<Counter T={m.TOTAL} f={f} ev={evA} />}>
        <MailA f={f} m={mA} />
      </Card>

      {/* S3: run B, with the rules on: seven left */}
      <Card f={f} inAt={L[3]} outAt={L[4] - 4} inFx="page" outFx="shrink" title={<Tt>With my rules</Tt>} tag={<Counter T={m.TOTAL} f={f} ev={evB} />}>
        <div style={{display: 'flex', gap: 10, marginBottom: 14, opacity: r(f, w(3, 1) - 2, w(3, 1) + 6), transform: `translateY(${(1 - r(f, w(3, 1) - 2, w(3, 1) + 8)) * -16}px)`}}>
          <Label text="PLAIN VOICE INSTRUCTIONS ✓" p={1} bg={GREEN} />
          <Label text="LISTS · EMOJI: LESS" p={1} />
        </div>
        <div style={{transform: `scale(0.94)`, transformOrigin: 'top left', width: `${100 / 0.94}%`}}><MailB f={f} m={mB} /></div>
      </Card>

      {/* S4: the fix line */}
      <Card f={f} inAt={L[4] - 4} outAt={L[5] - 6} inFx="push" outFx="whip" title={<Tt>One line</Tt>} tag={<Counter T={m.TOTAL} f={f} ev={[[0, 7], [smash + 13, 0]]} />}>
        <div style={{opacity: f < typeA ? 0 : 1}}><UserB text={FIX} size={30} chars={typed} /></div>
        {f >= sent && f < sent + 14 && <span style={{position: 'absolute', right: 0, top: -40, width: 160, height: 160}}><Sequence from={sent} layout="none"><TrimBurst x={0.5} y={0.5} count={8} innerRadius={50} reach={20} strokeLength={16} weight={5} color={GREEN} seed={6} /></Sequence></span>}
        <div style={{position: 'relative', marginTop: 22, height: 520}}>
          {f < toss ? (
            <div style={{transform: 'scale(0.7)', transformOrigin: 'top left', width: `${100 / 0.7}%`}}><MailB f={f} m={mB.map(() => 0)} h={720} /></div>
          ) : f < toss + 30 ? (
            <Sequence from={toss} layout="none"><CrumpleToss at={0} width={IW} height={504} direction={-1} distance={900} seed="p6b"><div style={{transform: 'scale(0.7)', transformOrigin: 'top left', width: `${100 / 0.7}%`}}><MailB f={f} m={mB.map(() => 0)} h={720} /></div></CrumpleToss></Sequence>
          ) : null}
          {f >= cIn && (
            <div style={{position: 'absolute', left: 0, top: 0, opacity: r(f, cIn, cIn + 6), transform: `translateY(${(1 - r(f, cIn, cIn + 10)) * 40}px)`}}>
              <MailC h={500} />
              <div style={{position: 'absolute', right: 24, top: 300}}><Stamp text="0 LEFT" p={r(f, cIn + 2, cIn + 9, BACK)} color={GREEN} rot={-7} size={54} /></div>
            </div>
          )}
        </div>
      </Card>

      {/* S5: comment -> DM arrives */}
      <Card f={f} inAt={L[5]} outAt={END} inFx="whip" outFx="shrink" title={ig ? 'Comment PLAIN' : 'DM me PLAIN'} tag={<Mono>{ig ? 'on this Reel' : 'on TikTok'}</Mono>}>
        {(() => {
          const KW = 'PLAIN';
          const kw = ig ? w(5, 1) : w(5, 2);
          const post = ig ? w(5, 3) : w(5, 4);
          const dmAt = ig ? w(5, 4) : w(5, 5);
          const ty = Math.max(0, Math.min(KW.length, Math.floor((f - kw + 4) / 2)));
          const posted = r(f, post, post + 6);
          const dm = r(f, dmAt, dmAt + 10);
          const rules = ig ? w(5, 7) : w(5, 8), line = ig ? w(5, 10) : w(5, 11), free = r(f, ig ? w(5, 11) : w(5, 12), (ig ? w(5, 11) : w(5, 12)) + 7);
          return (
            <>
              <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 10, opacity: r(f, L[5] + 4, L[5] + 12)}}>
                <span style={{width: 60, height: 60, borderRadius: 99, background: C.soft, border: `3px solid ${C.ink}`, flex: 'none'}} />
                <div style={{flex: 1, display: 'flex', alignItems: 'center', border: `4px solid ${C.ink}`, borderRadius: 999, padding: '12px 24px', height: 80, background: C.card}}>
                  {ty === 0 ? <Mono size={30}>{ig ? 'Add a comment…' : 'Message…'}</Mono> : <span style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 44, letterSpacing: 2}}>{KW.slice(0, ty)}</span>}
                  {f >= kw - 10 && posted < 1 && <Caret color={C.ink} width={4} height={42} blink={ty === 0} marginLeft={4} />}
                </div>
                <span style={{position: 'relative', fontFamily: 'Archivo', fontWeight: 900, fontSize: 36, padding: '14px 24px', borderRadius: 999, border: `4px solid ${C.ink}`, background: mix(C.card, C.mint, posted)}}>
                  {ig ? 'Post' : 'Send'}
                  {f >= post && <span style={{position: 'absolute', left: -60, top: -60, right: -60, bottom: -60}}><Sequence from={post} layout="none"><TrimBurst x={0.5} y={0.5} count={8} innerRadius={64} reach={18} strokeLength={16} weight={5} color={GREEN} seed={9} /></Sequence></span>}
                </span>
              </div>
              <div style={{marginTop: 40, display: 'flex', alignItems: 'flex-start', gap: 16, opacity: Math.min(1, dm * 2.5), transform: `translateY(${(1 - dm) * 50}px)`}}>
                <span style={{width: 60, height: 60, borderRadius: 99, background: C.ink, color: C.mint, fontFamily: 'Archivo', fontWeight: 900, fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none'}}>EM</span>
                <div style={{background: C.soft, border: `3px solid ${C.ink}`, borderRadius: 26, padding: '18px 22px', display: 'flex', gap: 20, alignItems: 'center'}}>
                  <Img src={staticFile('cover-plainvoice.jpg')} style={{width: 150, borderRadius: 8, border: `3px solid ${C.ink}`}} />
                  <div>
                    <Mono size={24}>@theexactmethod · DM</Mono>
                    <div style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 38, marginTop: 6}}>Here's Plain Voice.</div>
                    <div style={{display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14}}>
                      {[['the rules for ChatGPT, Claude, Gemini', rules], ['+ the fix line', line]].map(([t, a], i) => (
                        <span key={i} style={{display: 'flex', alignItems: 'center', gap: 8, opacity: r(f, (a as number) - 2, (a as number) + 6)}}><Tick d={r(f, a as number, (a as number) + 8)} s={34} color={GREEN} /><span style={{fontFamily: 'Archivo', fontWeight: 700, fontSize: 30}}>{t as string}</span></span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{marginTop: 34, opacity: r(f, line - 2, line + 8), transform: `translateY(${(1 - r(f, line - 2, line + 10)) * 30}px)`}}>
                <Mono size={22}>MY FIX LINE · FROM PLAIN VOICE, SECTION 04</Mono>
                <div style={{marginTop: 10}}><UserB text={FIX} size={28} /></div>
              </div>
              <div style={{position: 'absolute', left: 60, top: 200}}><Stamp text="FREE" p={free} color={GREEN} rot={-10} size={60} /></div>
            </>
          );
        })()}
      </Card>

      {/* S6: pull back into frame 0 */}
      {f >= END && (
        <div style={{position: 'absolute', inset: 0, opacity: r(f, END + 4, END + 11), transform: `scale(${lerp(1.15, 1, r(f, END + 4, END + 16, OUT))})`}}>
          {frame0(true, 0)}
          <div style={{position: 'absolute', inset: 0, transform: 'translate(-20px, 0) rotate(-1.5deg)'}}>
            <Card f={0} inAt={0} outAt={99999} first top={SLOT.top} h={SLOT.h} zoom={SLOT.zoom} title={<Tt>First draft</Tt>} tag={<Counter f={0} ev={[[0, 9]]} />}>
              <MailA f={0} m={[0, 0, 0, 0, 0, 0, 0, 0, 0]} still />
            </Card>
          </div>
        </div>
      )}
      </div>

      {headO > 0 && <div style={{opacity: headO}}><Headline f={f} m={m} still={f >= END} /></div>}
      <Sage f={f} m={m} words={WORDS[platform]} mouth={(platform === 'ig' ? MIG : MTT) as number[]} />
      {/* smash count 7 -> 0, over everything */}
      {smashO > 0 && (
        <div style={{position: 'absolute', inset: 0, opacity: smashO}}>
          <div style={{position: 'absolute', inset: 0, background: 'rgba(233,229,218,0.93)'}} />
          <div style={{position: 'absolute', inset: 0, transform: 'translate(220px, -330px) scale(0.7)'}}><Sequence from={smash} layout="none"><SmashCount from={7} value={0} cuts={4} firstGap={5} lastGap={3} label="" accent={GREEN} ink={C.ink} background="transparent" fontFamily="Archivo" scale={1} /></Sequence></div>
          <div style={{position: 'absolute', left: 760, top: 1215, opacity: r(f, smash + 13, smash + 18)}}><Mono size={34} color={C.ink}>giveaways left</Mono></div>
        </div>
      )}
      <Caption f={f} z={z} />
    </AbsoluteFill>
  );
};

export const P6Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.paper, backgroundImage: `repeating-linear-gradient(0deg, transparent 0 63px, ${C.rule} 63px 65px)`}}>
    <Fonts />
    <div style={{position: 'absolute', left: 70, right: 70, top: 300}}>
      <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 110, lineHeight: 1.0, letterSpacing: -3}}>Never send<br />ChatGPT's<br /><span style={{background: C.mint, padding: '0 12px', borderRadius: 12}}>first draft.</span></div>
      <div style={{marginTop: 44, display: 'flex', gap: 16}}><Label text="9 GIVEAWAYS" p={1} bg={RED} /><Label text="1 LINE · 0 LEFT" p={1} bg={GREEN} /></div>
    </div>
    <div style={{position: 'absolute', left: 70, right: 70, top: 820, transform: 'scale(1)', transformOrigin: 'top left'}}>
      <MailA f={0} m={[0, 0, 0, 0, 0, 0, 0, 0, 0]} still h={560} />
    </div>
  </AbsoluteFill>
);
