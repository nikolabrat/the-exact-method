// N-7 "Never sell ChatGPT's first idea" — short-Reel test, The Narrowing Method (NARROW). Real ChatGPT run 19 Nov 2026.
// V-2 system (paper, cards, camera, captions, Sage). Frame 0 = last frame.
// remocn: ScribbleCircle, Squiggle, TrimBurst, RollingNumber, Caret, WhipPan.
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {ScribbleCircle} from '@/components/remocn/scribble-circle';
import {TrimBurst} from '@/components/remocn/trim-burst';
import {RollingNumber} from '@/components/remocn/rolling-number';
import {Caret} from '@/components/remocn/caret';
import {whipPan} from '@/components/remocn/whip-pan';
import TIG from './n7timing_ig.json';
import TTT from './n7timing_tt.json';
import {Squiggle} from '@/components/remocn/squiggle';

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
  ig: [[2, 3], [3, 2, 2], [2, 3, 2, 3], [2, 2, 2, 3], [1, 3, 2, 2], [1, 3, 2, 2, 2], [1, 3, 3], [3, 2, 3], [2, 2, 3], [3, 3]],
  tt: [[2, 3], [3, 2, 2], [2, 3, 2, 3], [2, 2, 2, 3], [1, 3, 2, 2], [1, 3, 2, 2, 2], [1, 3, 3], [3, 2, 3], [3, 2, 3], [3, 3]],
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
export const N7_TOTAL = {ig: Z.ig.TOTAL, tt: Z.tt.TOTAL};

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
    [0, 's-think'], [L[1] - 2, 's-point'], [L[2] - 2, 's-shrug'], [L[3] - 2, 's-present'], [L[4] - 2, 's-finger'],
    [L[5] - 2, 's-check'], [L[6] - 2, 's-think'], [L[7] - 2, 's-present'], [L[8] - 2, 's-point'], [L[9] - 2, 's-think'],
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
  const body = (
    <div style={{position: 'absolute', left: 70, right: 70, top, height: h, background: C.card, border: `4px solid ${C.ink}`, borderRadius: 30, padding: '30px 38px', overflow: 'hidden',
      opacity: op, transform: tf || undefined, transformOrigin: origin, filter: blur > 0.2 ? `blur(${blur}px)` : undefined, boxShadow: '0 14px 0 rgba(24,23,20,0.08)'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 18, borderBottom: `3px solid ${C.line}`, minHeight: 72}}>
        <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 50, letterSpacing: -1}}>{title}</span>
        {tag}
      </div>
      <div style={{position: 'relative', marginTop: 26, height: (h - 160) / zoom, width: `${100 / zoom}%`, transform: `scale(${zoom})`, transformOrigin: 'top left'}}>{children}</div>
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
const Real: React.FC<{p?: number}> = ({p = 1}) => <div style={{marginTop: 10, opacity: p}}><Mono size={22}>excerpt · real run · ChatGPT · 19 Nov 2026</Mono></div>;
// headline over scene A: the full hook, readable at frame 0
const Headline: React.FC<{f: number; m: MT; still?: boolean}> = ({f, m, still}) => {
  const zp = still ? 0 : r(f, m.w(1, 5) - 2, m.w(1, 5) + 6, BACK);
  return (
    <div style={{position: 'absolute', left: 70, right: 70, top: 236}}>
      <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 70, lineHeight: 1.0, letterSpacing: -2, color: C.ink}}>
        Never sell ChatGPT's<br />
        <span style={{position: 'relative', display: 'inline-block'}}>
          first idea.
          <span style={{position: 'absolute', left: -26, top: -24}}>
            <Sequence from={-60} layout="none"><ScribbleCircle width={380} height={118} color={C.red} strokeWidth={7} durationSteps={7} seed="n7hook" /></Sequence>
          </span>
        </span>
      </div>
      <div style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 44, marginTop: 18, color: C.ink}}>
        Its third one costs you{' '}
        <span style={{display: 'inline-block', padding: '0 10px', borderRadius: 10, background: mix(C.card, C.mint, still ? 0 : r(f, m.w(1, 5), m.w(1, 5) + 6)), transform: `scale(${lerp(1, 1.12, zp) - (zp > 0.98 ? 0.12 * r(f, m.w(1, 5) + 6, m.w(1, 5) + 14) : 0)})`}}>€0.</span>
      </div>
    </div>
  );
};
// scene A body: the real first-try answer, fanned copies, the blurred third try with the €0 stamp
const FirstPanel: React.FC<{f: number; m: MT; g: (x: number) => number; still?: boolean}> = ({f, m, g, still}) => (
  <Dark style={{padding: '24px 30px 26px'}}>
    <UserB text="What should I sell online first?" />
    <Answer>
      My first choice would be a <Hl f={f} at={g(m.w(0, 2))} color={C.red} still={still}>specialized activity book</Hl> for adults or children, sold through <Hl f={f} at={g(m.w(2, 6))} color={C.red} under still={still}>Amazon KDP</Hl>.
    </Answer>
  </Dark>
);
// scene A body: the real first-try answer, fanned copies, the blurred third try with the €0 stamp.
// still = the frame-0 state, used again for the loop end
const FirstTry: React.FC<{f: number; m: MT; still?: boolean}> = ({f, m, still}) => {
  const g = (x: number) => (still ? 1e9 : x);
  const zero = r(f, g(m.w(1, 5)), g(m.w(1, 5)) + 7, BACK);
  const same = r(f, g(m.w(2, 8)), g(m.w(2, 8)) + 6, BACK);
  return (
    <div style={{position: 'relative', height: 410}}>
      {[...Array(5)].map((_, i) => {
        const k = (i - 2) / 2;
        const d = r(f, g(m.w(2, 7)) + i * 2, g(m.w(2, 7)) + i * 2 + 10, IO);
        if (d <= 0) return null;
        return (
          <div key={i} style={{position: 'absolute', left: 0, top: 0, transform: `translate(${k * 60 * d}px, ${(-16 - Math.abs(k) * 10) * d}px) rotate(${k * 7 * d}deg)`, opacity: 0.92}}>
            <FirstPanel f={f} m={m} g={g} still={still} />
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 0, top: 0}}>
        <FirstPanel f={f} m={m} g={g} still={still} />
        <div style={{position: 'absolute', left: 16, top: -20}}><Label text="FIRST TRY" p={1} bg={C.red} /></div>
        {same > 0 && <div style={{position: 'absolute', right: 16, top: 250, transform: `rotate(-4deg) scale(${lerp(1.4, 1, same)})`, opacity: Math.min(1, same * 3)}}><Stamp text="SAME AS EVERYONE" p={1} color={C.red} rot={0} size={30} /></div>}
      </div>
      <div style={{position: 'absolute', left: 0, top: 300, width: IW}}>
        <Dark h={110}>
          <div style={{filter: 'blur(8px)', opacity: 0.8, padding: '18px 30px'}}><Answer size={34}>Start with a <b style={{color: '#fff'}}>Google Sheets pricing and profit calculator</b> for small businesses…</Answer></div>
        </Dark>
        <div style={{position: 'absolute', left: 16, top: -18}}><Label text="THIRD TRY" p={1} bg={C.green} /></div>
        {zero > 0 && <div style={{position: 'absolute', right: 30, top: 18}}><Stamp text="€0" p={zero} color={C.green} rot={-8} size={64} /></div>}
      </div>
    </div>
  );
};

export const N7: React.FC<{platform: 'ig' | 'tt'}> = ({platform}) => {
  const f = useCurrentFrame();
  const z = Z[platform];
  const m = MM[platform];
  const L = m.L, w = m.w;
  const ig = platform === 'ig';
  const A2 = L[9];
  const headO = f < L[3] ? 1 - r(f, L[3] - 6, L[3] + 2) : f >= A2 ? r(f, A2, A2 + 10) : 0;

  return (
    <AbsoluteFill style={{background: C.paper, backgroundImage: `repeating-linear-gradient(0deg, transparent 0 63px, ${C.rule} 63px 65px)`, overflow: 'hidden'}}>
      <Fonts />
      <Audio src={staticFile(`n7v/final_${platform}.wav`)} />

      <div style={{position: 'absolute', inset: 0, transform: camera(f, m.TOTAL, [
        [w(0, 2) - 4, L[2] - 4, 1.1, 690, 502],
        [w(2, 3) - 4, w(2, 7) - 2, 1.06, 300, 502],
        [L[3] + 12, L[4] - 8, 1.08, 520, 560],
        [w(5, 4) - 6, L[6] - 8, 1.06, 540, 720],
        [w(6, 5) - 6, L[7] - 8, 1.07, 540, 780],
        [L[8] + 6, A2 - 2, 1.06, 540, 560],
      ], [[w(1, 5) + 2, 16], [w(2, 8), 8], [L[3] + 8, 10], [w(5, 4) + 8, 7], [w(5, 6) + 8, 9], [w(5, 8) + 8, 7], [w(7, 6), 12], [L[8] + 12, 6], [L[9] - 14, 12]])}}>


      {/* A: first try vs third try */}
      <Card f={f} inAt={0} outAt={L[3] - 6} first outFx="fly" top={502} h={570} title="What should I sell first?" tag={<Mono>ChatGPT</Mono>}>
        <FirstTry f={f} m={m} />
      </Card>

      {/* B: the third try, in focus */}
      <Card f={f} inAt={L[3]} outAt={L[4] - 6} inFx="zoom" outFx="fly" title="After 3 prompts" tag={<Label text="THIRD TRY" p={1} bg={C.green} />}>
        {(() => {
          const z0 = r(f, w(3, 3) + 4, w(3, 3) + 16);
          return (
            <>
              <Dark style={{padding: '22px 30px 24px'}}>
                <UserB text="Of these, which one specifically should I start with, and why…" size={28} />
                <Answer>
                  Start with a <Hl f={f} at={w(3, 3) - 2}>Google Sheets pricing and profit calculator</Hl> for small independent businesses, specifically targeting <Hl f={f} at={w(3, 7) - 2}>home-based bakers</Hl>.
                </Answer>
              </Dark>
              <div style={{marginTop: 20, opacity: z0, transform: `translateY(${(1 - z0) * 24}px)`}}>
                <Dark style={{padding: '18px 30px 20px'}}>
                  <Answer size={36}>Fourth, you can create a complete product <Hl f={f} at={w(3, 7) + 4}>without spending money</Hl>.</Answer>
                </Dark>
              </div>
              <Real p={r(f, L[3] + 6, L[3] + 14)} />
              <div style={{position: 'absolute', right: 10, bottom: 6}}><Stamp text="€0 TO MAKE" p={r(f, w(3, 8), w(3, 8) + 7, BACK)} color={C.green} rot={-6} size={46} /></div>
            </>
          );
        })()}
      </Card>

      {/* C1: prompt one */}
      <Card f={f} inAt={L[4]} outAt={L[5] - 6} inFx="push" outFx="page" title="Get a shortlist" tag={<Steps n={1} />}>
        <PromptBubble f={f} at={L[4] + 4} text="Research realistic first products a beginner can sell online, using AI to help make them. Give me a shortlist, with a short explanation of each." />
        <div style={{marginTop: 22, opacity: r(f, L[4] + 14, L[4] + 22)}}>
          <Dark h={300}>
            <Sequence from={L[4] + 14} layout="none"><OffthreadVideo src={staticFile('n7/shortlist.mp4')} muted style={{position: 'absolute', left: 0, top: 0, width: IW}} /></Sequence>
          </Dark>
          <Real />
        </div>
      </Card>

      {/* C2: prompt two, the limits */}
      <Card f={f} inAt={L[5]} outAt={L[6] - 6} inFx="page" outFx="page" title="Add your limits" tag={<Steps n={2} />}>
        <PromptBubble f={f} at={L[5] + 4} text="Research each of these in more depth, and tell me which two or three are the most realistic for someone with about 5 hours a week, €0 to spend, no audience yet, and who is good at math and explaining things simply." size={30} />
        <div style={{display: 'flex', gap: 18, marginTop: 40, justifyContent: 'center'}}>
          {[['5 h / week', w(5, 4)], ['€0', w(5, 6)], ['no audience', w(5, 8)]].map(([t, at], i) => {
            const a = at as number;
            const p = r(f, a - 2, a + 8, Easing.bezier(0.5, 0, 0.75, 0));
            const land = r(f, a + 8, a + 13, BACK);
            return <span key={i} style={{whiteSpace: 'nowrap', fontFamily: 'Archivo', fontWeight: 900, fontSize: 52, padding: '16px 28px', borderRadius: 20, border: `5px solid ${C.ink}`, background: i === 1 ? C.mint : C.card, opacity: f < a - 2 ? 0 : 1, transform: `translateY(${lerp(-700, 0, p) - Math.sin(land * Math.PI) * 12}px) rotate(${(i - 1) * 4}deg)`}}>{t as string}</span>;
          })}
        </div>
        <div style={{marginTop: 46, textAlign: 'center', opacity: r(f, w(5, 9) + 6, w(5, 9) + 14)}}><Mono size={28}>details a stranger wouldn't know</Mono></div>
      </Card>

      {/* C3: prompt three */}
      <Card f={f} inAt={L[6]} outAt={L[7] - 6} inFx="page" outFx="whip" title="Ask which one" tag={<Steps n={3} />}>
        <PromptBubble f={f} at={L[6] + 4} text="Of these, which one specifically should I start with, and why, based on everything you just found?" />
        <div style={{marginTop: 24, position: 'relative', height: 280}}>
          {f < w(6, 5) + 4 && <div style={{opacity: r(f, L[6] + 14, L[6] + 20)}}><Dark h={110} style={{padding: '30px 30px'}}><span style={{fontFamily: 'Archivo', fontSize: 38, backgroundImage: `linear-gradient(90deg, #6b6b6b 0%, #6b6b6b ${((f * 4) % 140) - 30}%, #f2f2f2 ${((f * 4) % 140) - 10}%, #6b6b6b ${((f * 4) % 140) + 10}%, #6b6b6b 100%)`, WebkitBackgroundClip: 'text', color: 'transparent'}}>Thinking</span></Dark></div>}
          {f >= w(6, 5) - 2 && (
            <div style={{position: 'absolute', left: 0, top: 0, opacity: r(f, w(6, 5) - 2, w(6, 5) + 6), transform: `translateY(${(1 - r(f, w(6, 5) - 2, w(6, 5) + 8)) * 30}px)`}}>
              <Dark style={{padding: '20px 30px 22px'}}><Answer size={36}>Start with a <Hl f={f} at={w(6, 5) + 6}>Google Sheets pricing and profit calculator</Hl> for small independent businesses…</Answer></Dark>
              <Real />
            </div>
          )}
        </div>
      </Card>

      {/* D: the guide, three prompt cards stack onto the cover */}
      <Card f={f} inAt={L[7]} outAt={L[8] - 4} inFx="whip" outFx="whip" title="The Narrowing Method" tag={<Mono>free PDF</Mono>}>
        {(() => {
          const cov = r(f, L[7] + 4, L[7] + 14, BACK);
          const items = ['Get a shortlist', 'Add your limits', 'Ask which one'];
          return (
            <div style={{position: 'relative', height: 560}}>
              <Img src={staticFile('cover-narrowing.jpg')} style={{position: 'absolute', left: 0, top: 0, width: 330, borderRadius: 12, border: `4px solid ${C.ink}`, opacity: Math.min(1, cov * 2), transform: `translateY(${(1 - cov) * 50}px) rotate(${(1 - cov) * -6}deg)`}} />
              {items.map((t, i) => {
                const at = L[7] + 10 + i * 6;
                const p = r(f, at, at + 10, IO);
                return (
                  <div key={t} style={{position: 'absolute', left: lerp(900, 370, p), top: 40 + i * 120, width: 470, display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderRadius: 18, border: `4px solid ${C.ink}`, background: C.card, transform: `rotate(${(1 - p) * 12 + (i - 1) * 1.5}deg)`, opacity: f < at ? 0 : 1}}>
                    <span style={{width: 56, height: 56, borderRadius: 99, background: C.mint, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Archivo', fontWeight: 900, fontSize: 32, flex: 'none'}}>{i + 1}</span>
                    <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 36}}>{t}</span>
                  </div>
                );
              })}
              <div style={{position: 'absolute', left: 370, top: 420, opacity: r(f, w(7, 6), w(7, 6) + 8)}}><Mono size={28}>written out word for word</Mono></div>
              {f >= w(7, 6) && <span style={{position: 'absolute', left: -40, top: -40, width: 410, height: 520}}><Sequence from={w(7, 6)} layout="none"><TrimBurst x={0.5} y={0.5} count={10} innerRadius={190} reach={30} strokeLength={22} weight={6} color={C.green} seed={17} /></Sequence></span>}
            </div>
          );
        })()}
      </Card>

      {/* E: comment -> DM arrives */}
      <Card f={f} inAt={L[8]} outAt={A2} inFx="whip" outFx="shrink" title={ig ? 'Comment NARROW' : 'DM me NARROW'} tag={<Mono>{ig ? 'on this Reel' : 'on TikTok'}</Mono>}>
        {(() => {
          const KW = 'NARROW';
          const kw = ig ? w(8, 1) : w(8, 2);
          const post = ig ? w(8, 4) : w(8, 5);
          const dmAt = ig ? w(8, 6) : w(8, 7);
          const typed = Math.max(0, Math.min(KW.length, Math.floor((f - kw + 4) / 2)));
          const posted = r(f, post, post + 6);
          const dm = r(f, dmAt, dmAt + 10);
          const free = r(f, dmAt + 8, dmAt + 14);
          return (
            <>
              <div style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 10, opacity: r(f, L[8] + 4, L[8] + 12)}}>
                <span style={{width: 60, height: 60, borderRadius: 99, background: C.soft, border: `3px solid ${C.ink}`, flex: 'none'}} />
                <div style={{flex: 1, display: 'flex', alignItems: 'center', border: `4px solid ${C.ink}`, borderRadius: 999, padding: '12px 24px', height: 80, background: C.card}}>
                  {typed === 0 ? <Mono size={30}>{ig ? 'Add a comment…' : 'Message…'}</Mono> : <span style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 44, letterSpacing: 2}}>{KW.slice(0, typed)}</span>}
                  {f >= kw - 10 && posted < 1 && <Caret color={C.ink} width={4} height={42} blink={typed === 0} marginLeft={4} />}
                </div>
                <span style={{position: 'relative', fontFamily: 'Archivo', fontWeight: 900, fontSize: 36, padding: '14px 24px', borderRadius: 999, border: `4px solid ${C.ink}`, background: mix(C.card, C.mint, posted)}}>
                  {ig ? 'Post' : 'Send'}
                  {f >= post && <span style={{position: 'absolute', left: -60, top: -60, right: -60, bottom: -60}}><Sequence from={post} layout="none"><TrimBurst x={0.5} y={0.5} count={8} innerRadius={64} reach={18} strokeLength={16} weight={5} color={C.green} seed={9} /></Sequence></span>}
                </span>
              </div>
              <div style={{marginTop: 40, display: 'flex', alignItems: 'flex-start', gap: 16, opacity: Math.min(1, dm * 2.5), transform: `translateY(${(1 - dm) * 50}px)`}}>
                <span style={{width: 60, height: 60, borderRadius: 99, background: C.ink, color: C.mint, fontFamily: 'Archivo', fontWeight: 900, fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none'}}>EM</span>
                <div style={{background: C.soft, border: `3px solid ${C.ink}`, borderRadius: 26, padding: '18px 22px', display: 'flex', gap: 18, alignItems: 'center'}}>
                  <Img src={staticFile('cover-narrowing.jpg')} style={{width: 110, borderRadius: 8, border: `3px solid ${C.ink}`}} />
                  <div>
                    <Mono size={24}>@theexactmethod · DM</Mono>
                    <div style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 36, marginTop: 6}}>Here's The Narrowing Method.</div>
                  </div>
                </div>
              </div>
              <div style={{position: 'absolute', right: 20, bottom: 40}}><Stamp text="FREE" p={free} color={C.green} rot={-8} size={56} /></div>
            </>
          );
        })()}
      </Card>

      {/* A again: pull back into frame 0 */}
      {f >= A2 && (
        <Card f={f} inAt={A2} outAt={99999} inFx="pull" top={502} h={570} title="What should I sell first?" tag={<Mono>ChatGPT</Mono>}>
          <FirstTry f={f} m={m} still />
        </Card>
      )}
      </div>
      {/* frame 0 headline (and back for the loop), outside the camera so it never leaves the safe zone */}
      {headO > 0 && <div style={{opacity: headO}}><Headline f={f} m={m} still={f >= A2} /></div>}
      <Caption f={f} z={z} />
      <Sage f={f} m={m} />
    </AbsoluteFill>
  );
};

const Steps: React.FC<{n: number}> = ({n}) => (
  <span style={{display: 'flex', gap: 8}}>
    {[1, 2, 3].map((i) => <span key={i} style={{width: 44, height: 44, borderRadius: 99, border: `3px solid ${C.ink}`, background: i === n ? C.mint : i < n ? C.ink : C.card, color: i < n ? C.card : C.ink, fontFamily: 'Archivo', fontWeight: 900, fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i}</span>)}
  </span>
);
// the prompt, word for word, typed into a ChatGPT bubble
const PromptBubble: React.FC<{f: number; at: number; text: string; size?: number}> = ({f, at, text, size = 32}) => {
  const n = Math.round(r(f, at, at + 18, (t: number) => t) * text.length);
  return <div style={{opacity: f < at ? 0 : 1}}><UserB text={text} size={size} chars={n} /></div>;
};

export const N7Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.paper, backgroundImage: `repeating-linear-gradient(0deg, transparent 0 63px, ${C.rule} 63px 65px)`}}>
    <Fonts />
    <div style={{position: 'absolute', left: 70, right: 70, top: 330}}>
      <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 104, lineHeight: 1.0, letterSpacing: -3}}>Never sell<br />ChatGPT's<br /><span style={{background: C.mint, padding: '0 12px', borderRadius: 12}}>first idea.</span></div>
      <div style={{marginTop: 40, display: 'flex', gap: 16}}><Label text="FIRST TRY" p={1} bg={C.red} /><Label text="THIRD TRY · €0" p={1} bg={C.green} /></div>
    </div>
    <div style={{position: 'absolute', left: 70, top: 900}}>
      <div style={{width: IW + 84}}><Dark style={{padding: '24px 30px 26px', width: IW + 84}}><UserB text="What should I sell online first?" /><Answer>My first choice would be a <b style={{color: '#fff'}}>specialized activity book</b>, sold through Amazon KDP.</Answer></Dark></div>
    </div>
  </AbsoluteFill>
);
