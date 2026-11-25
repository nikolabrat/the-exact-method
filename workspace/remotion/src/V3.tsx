// V-3 "Stop editing your Reels" (VIDEO). Plan: workspace/reels/v3/plan.md. Spine: one brief card that fills
// block by block (accordion), a mint rail, Sage bottom-right (N-8 rig), captions from ElevenLabs alignment.
// remocn: strikethrough-replace (answer), slot roll + push-through / lens-zoom / dolly moves done on our layers.
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, OffthreadVideo, Sequence, staticFile, useCurrentFrame} from 'remotion';
import TIG0 from './v3timing_ig.json';
import TTT0 from './v3timing_tt.json';
import MIG from './v3mouth_ig.json';
import MTT from './v3mouth_tt.json';

const C = {paper: '#E9E5DA', rule: '#D7D1C3', card: '#FCFBF7', ink: '#181714', mint: '#6BE0A0', red: '#D9534A', muted: '#7A7468', green: '#2F7A52', line: '#DCD7CB', note: '#F6E7A8', soft: '#F1EEE6'};
const OUT = Easing.bezier(0.42, 0, 0.18, 1);
const IO = Easing.bezier(0.65, 0, 0.35, 1);
const r = (f: number, a: number, b: number, e = OUT) => interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// ---------- timing ----------
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
const mk = (T: any) => ({
  L: T.lines.map((l: Line) => l.words[0].s) as number[],
  w: (li: number, wi: number) => T.lines[li].words[Math.min(wi, T.lines[li].words.length - 1)].s as number,
  find: (li: number, re: RegExp) => (T.lines[li].words as Wd[]).find((x) => re.test(x.w))!.s,
  TOTAL: T.total as number, END: T.end as number,
});
type MT = ReturnType<typeof mk>;
const MM = {ig: mk(TIG), tt: mk(TTT)};
export const V3_TOTAL = {ig: Z.ig.TOTAL, tt: Z.tt.TOTAL};

const Fonts: React.FC = () => (
  <style>{`
@font-face{font-family:Archivo;src:url(${staticFile('archivo-variable.woff2')}) format('woff2');font-weight:100 900;font-stretch:62% 125%}
@font-face{font-family:Newsreader;src:url(${staticFile('newsreader-variable.woff2')}) format('woff2');font-weight:200 800;font-style:normal italic}
@font-face{font-family:Plex;src:url(${staticFile('plex-mono-500.woff2')}) format('woff2');font-weight:500}
`}</style>
);
const GRID: React.CSSProperties = {
  background: C.paper,
  backgroundImage: `repeating-linear-gradient(0deg, transparent 0 53px, ${C.rule} 53px 54px), repeating-linear-gradient(90deg, transparent 0 53px, ${C.rule} 53px 54px)`,
};

// ---------- captions (max 3 words, one line, left of Sage) ----------
const CAP_TOP = 1420;
const ChunkView: React.FC<{f: number; ch: Chunk; o: number; loopIn: boolean; maxW?: number}> = ({f, ch, o, loopIn, maxW = 630}) => {
  const hlA = (i: number) => {
    if (loopIn) return i === 0 ? 1 : 0;
    const s0 = ch.words[i].s;
    const next = i < ch.words.length - 1 ? ch.words[i + 1].s : 1e9;
    const first = i === 0 ? 1 : r(f, s0 - 3, s0 - 1);
    return (i === 0 && f < s0 ? 1 : first) * (1 - r(f, next - 3, next - 1));
  };
  const chars = ch.words.reduce((n, w) => n + w.w.length, 0) + ch.words.length - 1;
  const fs = Math.min(66, Math.floor(maxW / (chars * 0.6)));
  return (
    <div style={{position: 'absolute', left: 70, top: CAP_TOP, width: 660, display: 'flex', flexWrap: 'nowrap', whiteSpace: 'nowrap', columnGap: 14, opacity: o}}>
      {ch.words.map((w, i) => (
        <span key={i} style={{position: 'relative', fontFamily: 'Archivo', fontWeight: 900, fontSize: fs, lineHeight: 1.12, letterSpacing: -1.5, color: C.ink, padding: '0 8px', margin: '0 -8px'}}>
          <span style={{position: 'absolute', inset: 0, borderRadius: 10, background: C.mint, opacity: hlA(i)}} />
          <span style={{position: 'relative'}}>{w.w}</span>
        </span>
      ))}
    </div>
  );
};
const Caption: React.FC<{f: number; z: ZT; maxW: number}> = ({f, z, maxW}) => {
  if (f >= z.TOTAL - 10) {
    const seamOut = r(f, z.TOTAL - 10, z.TOTAL - 6, IO), seamIn = r(f, z.TOTAL - 6, z.TOTAL - 2, IO);
    let cj = 0;
    for (let i = 0; i < z.CHUNKS.length; i++) if (f >= z.CHUNKS[i].from) cj = i;
    return (
      <>
        {seamOut < 1 && <ChunkView maxW={maxW} f={f} ch={z.CHUNKS[cj]} o={1 - seamOut} loopIn={false} />}
        {seamIn > 0 && <ChunkView maxW={maxW} f={f} ch={z.CHUNKS[0]} o={seamIn} loopIn />}
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
      {ci > 0 && xo < 1 && <ChunkView maxW={maxW} f={f} ch={z.CHUNKS[ci - 1]} o={1 - xo} loopIn={false} />}
      <div style={{transform: `translateY(${(1 - xi) * 10}px)`}}><ChunkView maxW={maxW} f={f} ch={z.CHUNKS[ci]} o={xi} loopIn={false} /></div>
    </>
  );
};

// ---------- Sage (N-8 rig) ----------
type Pose = 's-check' | 's-finger' | 's-point' | 's-present' | 's-shrug' | 's-sigh' | 's-think';
const MOUTHX: Record<Pose, number> = {'s-check': 169.0, 's-finger': 205.5, 's-point': 329.5, 's-present': 347.5, 's-shrug': 278.0, 's-sigh': 195.0, 's-think': 156.5};
const poseAt = (f: number, m: MT) => {
  const {L, w} = m;
  // no s-point: its raised hand reaches into the caption band (x 525); every other pose stays right of x 730
  const POSES: [number, Pose][] = [
    [0, 's-present'], [L[1] - 3, 's-finger'], [L[2] - 3, 's-think'], [L[3] - 3, 's-present'], [L[4] - 3, 's-check'],
    [L[5] - 3, 's-finger'], [L[6] - 3, 's-think'], [L[7] - 3, 's-present'], [L[8] - 3, 's-finger'], [L[9] - 3, 's-shrug'],
    [L[10] - 3, 's-finger'], [L[11] - 3, 's-check'], [L[12] - 3, 's-sigh'], [L[13] - 3, 's-shrug'], [L[14] - 3, 's-check'],
    [L[15] - 3, 's-finger'], [L[16] - 3, 's-present'], [L[17] - 3, 's-finger'], [L[18] - 3, 's-think'], [w(18, 5) - 3, 's-finger'],
    [L[19] - 3, 's-present'], [L[20] - 3, 's-finger'], [w(20, 5) - 3, 's-present'],
  ];
  let idx = 0;
  POSES.forEach(([t], i) => { if (f >= t) idx = i; });
  return {idx, t0: POSES[idx][0], p: POSES[idx][1]};
};
const Sage: React.FC<{f: number; m: MT; mouth: number[]}> = ({f, m, mouth}) => {
  const {TOTAL: T, END: end} = m;
  const {idx, t0, p} = poseAt(f, m);
  const d = f - t0;
  const pop = idx > 0 && d < 6 ? 0.035 * (1 - d / 6) : 0;
  const breathe = Math.sin((2 * Math.PI * f * 5) / T);
  const k = 1.06, H = 1121 * k;
  const left = 872 - MOUTHX[p] * k;
  // frame 0 (and the loop's last frames) hold "Stop" open, as in the frame-0 test
  const lv = f >= end ? (f >= T - 3 ? 2 : 0) : f < 2 ? 2 : mouth[f] ?? 0;
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
  let k = 1 + 0.012 * Math.sin(ph * 3), tx = 8 * Math.sin(ph * 2), ty = 5 * Math.sin(ph * 4);
  punches.forEach(([a, b, s, x, y]) => {
    const wt = r(f, a, a + 8, IO) * (1 - r(f, b - 8, b, IO));
    if (wt <= 0) return;
    const kk = 1 + (s - 1) * wt;
    tx += (x - 540) * (1 - kk); ty += (y - 960) * (1 - kk); k *= kk;
  });
  shakes.forEach(([t, amp]) => {
    const d = f - t;
    if (d < 0 || d > 14) return;
    const e = amp * Math.exp(-d / 3.5);
    tx += e * Math.sin(d * 2.4); ty += e * 0.7 * Math.cos(d * 3.1);
  });
  return `translate(${tx}px, ${ty}px) scale(${k}) rotate(${0.3 * Math.sin(ph * 2 + 1)}deg)`;
};

// ---------- poses (x, y, scale, rotation, opacity) ----------
type P = {x: number; y: number; s: number; rot: number; o: number};
const mix = (a: P, b: P, t: number): P => ({x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), s: lerp(a.s, b.s, t), rot: lerp(a.rot, b.rot, t), o: lerp(a.o, b.o, t)});
const track = (f: number, start: P, keys: [number, number, P][]) => keys.reduce((cur, [a, b, p]) => mix(cur, p, r(f, a, b, IO)), start);
const num = (f: number, start: number, keys: [number, number, number][]) => keys.reduce((cur, [a, b, v]) => lerp(cur, v, r(f, a, b, IO)), start);
const place = (p: P, origin = '0 0'): React.CSSProperties => ({position: 'absolute', left: p.x, top: p.y, transformOrigin: origin, transform: `rotate(${p.rot}deg) scale(${p.s})`, opacity: p.o});

// ---------- small parts ----------
const Mono: React.FC<{children: React.ReactNode; color?: string; size?: number; style?: React.CSSProperties}> = ({children, color = C.muted, size = 24, style}) => (
  <span style={{fontFamily: 'Plex', fontSize: size, color, letterSpacing: 0.5, ...style}}>{children}</span>
);
const Stamp: React.FC<{text: string; p: number; color?: string; rot?: number; size?: number; bg?: string}> = ({text, p, color = C.red, rot = -6, size = 40, bg = C.card}) => (
  <span style={{display: 'inline-block', fontFamily: 'Archivo', fontWeight: 900, fontSize: size, letterSpacing: 1, color, border: `4px solid ${color}`, borderRadius: 12, background: bg,
    padding: '4px 18px', whiteSpace: 'nowrap', transform: `rotate(${rot}deg) scale(${lerp(1.45, 1, p)})`, opacity: Math.min(1, p * 3)}}>{text}</span>
);
const Accent: React.FC<{f: number; at: number; children: React.ReactNode}> = ({f, at, children}) => {
  const p = r(f, at, at + 10, IO);
  return (
    <span style={{position: 'relative', fontFamily: 'Newsreader', fontStyle: 'italic', fontWeight: 600, color: C.green, letterSpacing: -1}}>
      {children}
      <svg viewBox="0 0 100 12" preserveAspectRatio="none" style={{position: 'absolute', left: -4, bottom: -8, width: 'calc(100% + 8px)', height: 16}}>
        <path d="M2 8 C 30 2, 60 12, 98 5" stroke={C.mint} strokeWidth={6} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} opacity={p > 0.02 ? 1 : 0} />
      </svg>
    </span>
  );
};
const Sticker: React.FC<{p: number; children: React.ReactNode; rot?: number; bg?: string; size?: number; style?: React.CSSProperties}> = ({p, children, rot = -3, bg = C.note, size = 32, style}) => {
  if (p <= 0) return null;
  const q = Math.round(p * 4) / 4;
  return (
    <div style={{position: 'absolute', padding: '10px 20px', background: bg, border: `3px solid ${C.ink}`, borderRadius: 6, fontFamily: 'Archivo', fontWeight: 800, fontSize: size, color: C.ink, whiteSpace: 'nowrap',
      transform: `rotate(${rot + (1 - q) * 6}deg) scale(${lerp(1.25, 1, q)})`, opacity: Math.min(1, q * 2), ...style}}>
      <span style={{position: 'absolute', left: '50%', top: -14, width: 80, height: 24, marginLeft: -40, background: 'rgba(240,226,190,0.85)', border: '1px solid rgba(160,140,100,0.35)', transform: 'rotate(4deg)'}} />
      {children}
    </div>
  );
};
// digit columns spin a full turn and land on the same digit (frame 0 already shows the final value)
const Spin: React.FC<{f: number; at: number; text: string; size: number; color?: string; font?: string; weight?: number; turns?: boolean}> = ({f, at, text, size, color = C.ink, font = 'Archivo', weight = 900, turns = true}) => (
  <span style={{display: 'inline-flex', fontFamily: font, fontWeight: weight, fontSize: size, color, lineHeight: 1.1}}>
    {Array.from(text).map((ch, i) => {
      const digit = /[0-9]/.test(ch);
      const p = r(f, at + i * 2, at + i * 2 + 14, Easing.bezier(0.3, 0, 0.2, 1));
      if (!digit) return <span key={i} style={{opacity: turns ? 1 : Math.min(1, p * 3)}}>{ch}</span>;
      const d = Number(ch);
      return (
        <span key={i} style={{display: 'inline-block', height: '1.1em', overflow: 'hidden', verticalAlign: 'top'}}>
          <span style={{display: 'flex', flexDirection: 'column', transform: `translateY(${-p * 10 * 1.1}em)`}}>{Array.from({length: 11}).map((_, k) => <span key={k}>{(d + k) % 10}</span>)}</span>
        </span>
      );
    })}
  </span>
);
const Word: React.FC<{f: number; at: number; children: React.ReactNode; style?: React.CSSProperties}> = ({f, at, children, style}) => {
  const p = r(f, at - 2, at + 6);
  return <span style={{display: 'inline-block', opacity: p, transform: `translateY(${(1 - p) * 14}px)`, ...style}}>{children}</span>;
};
const Strike: React.FC<{p: number; color?: string; top?: string; width?: number}> = ({p, color = C.red, top = '52%', width = 7}) => (
  <svg viewBox="0 0 100 10" preserveAspectRatio="none" style={{position: 'absolute', left: -6, top, width: 'calc(100% + 12px)', height: width, marginTop: -width / 2, overflow: 'visible'}}>
    <path d="M1 6 C 30 3, 70 8, 99 4" stroke={color} strokeWidth={width} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} opacity={p > 0.02 ? 1 : 0} />
  </svg>
);
const Check: React.FC<{p: number; size?: number}> = ({p, size = 34}) => (
  <span style={{display: 'inline-flex', width: size, height: size, borderRadius: size / 2, background: p > 0 ? C.mint : 'transparent', border: `3px solid ${C.ink}`, alignItems: 'center', justifyContent: 'center', flex: 'none', transform: `scale(${lerp(0.7, 1, Math.min(1, p * 2))})`}}>
    <svg viewBox="0 0 24 24" style={{width: size * 0.62, height: size * 0.62}}><path d="M5 12.5 L10 17 L19 7" stroke={C.ink} strokeWidth={3.4} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} /></svg>
  </span>
);

// ---------- phone (plays a real finished Reel of ours, N-8) ----------
const PH_W = 430, PH_H = 764;
const Phone: React.FC<{f: number; vids: [number, number][]; children?: React.ReactNode; chip?: number}> = ({f, vids, children, chip = 0}) => {
  const live = vids.find(([a, b]) => f >= a && f < b);
  return (
    <div style={{position: 'relative', width: PH_W, height: PH_H, background: C.ink, borderRadius: 58, padding: 14, boxSizing: 'border-box'}}>
      <div style={{width: '100%', height: '100%', borderRadius: 46, overflow: 'hidden', position: 'relative', background: C.paper}}>
        {live ? (
          <Sequence from={live[0]} durationInFrames={live[1] - live[0]} layout="none">
            <OffthreadVideo src={staticFile('v3v/n8.mp4')} startFrom={660} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          </Sequence>
        ) : (
          <Img src={staticFile('v3v/n8_22.png')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        )}
        {children}
      </div>
      {chip > 0 && (
        <div style={{position: 'absolute', left: -110, top: 48, background: C.mint, border: `4px solid ${C.ink}`, borderRadius: 40, padding: '12px 24px', fontFamily: 'Archivo', fontWeight: 900, fontSize: 32, color: C.ink, whiteSpace: 'nowrap', transform: `rotate(-6deg) scale(${lerp(0.9, 1, chip)})`, opacity: chip}}>
          Made by Claude · no editing app
        </div>
      )}
    </div>
  );
};

// ---------- the brief card ----------
const CW = 720, HEAD = 92, GAP = 8, EXP = 330, HH = 52;
const ROWS = [
  {label: 'Who it’s for', sum: 'people who build with AI'},
  {label: 'Script', sum: '1 line = 1 voice file'},
  {label: 'Look', sum: '#6BE0A0 · Archivo'},
  {label: 'Timing', sum: 'cues on the real voice'},
  {label: 'Never', sum: 'no glows · no bounce'},
  {label: 'Export', sum: '1080×1920 · −14 LUFS'},
];

const HINTS = ['audience', 'lines → voice files', 'colours · fonts', 'cues', 'rules', 'size · loudness'];
// ---------- block contents ----------
const B1: React.FC<{f: number; m: MT}> = ({f, m}) => {
  const {w} = m;
  const words: [string, number][] = [['people', 5], ['who', 6], ['build', 7], ['things', 8], ['with', 9], ['AI.', 10]];
  const hl = r(f, w(4, 7), w(4, 7) + 8, IO);
  return (
    <div style={{position: 'relative', height: '100%'}}>
      <Mono size={24}>FOR:</Mono>
      <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 64, lineHeight: 1.05, letterSpacing: -2, color: C.ink, marginTop: 10, width: 470, display: 'flex', flexWrap: 'wrap', columnGap: 16}}>
        {words.map(([t, i]) => (
          <Word key={t} f={f} at={w(4, i)}>
            {t === 'build' ? <span style={{backgroundImage: `linear-gradient(${C.mint}, ${C.mint})`, backgroundRepeat: 'no-repeat', backgroundSize: `${hl * 100}% 100%`, padding: '0 6px', margin: '0 -6px', borderRadius: 6}}>{t}</span> : t}
          </Word>
        ))}
      </div>
      <div style={{position: 'absolute', left: 0, top: 64, opacity: 1 - r(f, w(4, 5) - 6, w(4, 5)), fontFamily: 'Archivo', fontWeight: 900, fontSize: 64, color: C.line, letterSpacing: -2}}>who is watching?</div>
      <Sticker p={r(f, w(4, 4) - 1, w(4, 4) + 7)} rot={5} size={36} style={{right: 0, top: 6}}>mine</Sticker>
    </div>
  );
};
const B2: React.FC<{f: number; m: MT}> = ({f, m}) => {
  const {w} = m;
  const rows: [string, string, number][] = [['01.mp3', 'Stop editing your Reels.', w(5, 2)], ['02.mp3', 'You can hand Claude…', w(5, 4)], ['03.mp3', 'This Reel is the proof.', w(5, 6)]];
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 6}}>
      {rows.map(([file, line, at], i) => {
        const p = r(f, at - 2, at + 8);
        return (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 16, height: 66, padding: '0 16px', background: C.soft, border: `3px solid ${C.ink}`, borderRadius: 12, opacity: p, transform: `translateX(${(1 - p) * 40}px)`}}>
            <Mono size={22} color={C.ink} style={{background: C.mint, border: `2px solid ${C.ink}`, borderRadius: 6, padding: '2px 8px'}}>{file}</Mono>
            <Mono size={20}>Sage</Mono>
            <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 28, color: C.ink, whiteSpace: 'nowrap'}}>“{line}”</span>
          </div>
        );
      })}
    </div>
  );
};
const SW: [string, string][] = [['#E9E5DA', 'E9E5DA'], ['#181714', '181714'], ['#6BE0A0', '6BE0A0'], ['#D9534A', 'D9534A']];
const B3: React.FC<{f: number; m: MT}> = ({f, m}) => {
  const {w, L} = m;
  const sw0 = w(6, 3) - 2, fn0 = w(6, 7) - 2;
  const spec = r(f, L[7] - 2, L[7] + 8);
  const fam = f < w(7, 4) + 3 ? 'Newsreader' : f < w(7, 4) + 7 ? 'Plex' : 'Archivo';
  const mintWipe = r(f, w(7, 6) - 2, w(7, 6) + 12, IO);
  const dim = 1 - 0.75 * r(f, L[7] - 4, L[7] + 6);
  return (
    <div style={{position: 'relative', height: '100%'}}>
      <div style={{opacity: dim}}>
        <div style={{display: 'flex', gap: 18}}>
          {SW.map(([hex, label], i) => {
            const p = r(f, sw0 + i * 5, sw0 + i * 5 + 8);
            return (
              <div key={i} style={{width: 138, border: `3px solid ${C.ink}`, borderRadius: 12, overflow: 'hidden', background: C.card, opacity: p, transform: `translateY(${(1 - p) * -30}px)`}}>
                <div style={{height: 78, background: hex, borderBottom: `3px solid ${C.ink}`}} />
                <div style={{height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <Mono size={21} color={C.ink}>#{label}</Mono>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{display: 'flex', gap: 14, marginTop: 22}}>
          {[['Archivo', {fontFamily: 'Archivo', fontWeight: 900}], ['Newsreader', {fontFamily: 'Newsreader', fontStyle: 'italic', fontWeight: 600}], ['Plex Mono', {fontFamily: 'Plex'}]].map(([n, st]: any, i) => {
            const p = r(f, fn0 + i * 6, fn0 + i * 6 + 8);
            return <span key={n} style={{...st, fontSize: 30, whiteSpace: 'nowrap', color: C.ink, border: `3px solid ${C.ink}`, borderRadius: 30, padding: '6px 20px', opacity: p, transform: `translateY(${(1 - p) * 16}px)`}}>{n}</span>;
          })}
        </div>
      </div>
      {spec > 0 && (
        <div style={{position: 'absolute', left: 0, right: 10, top: 14, height: 220, border: `4px solid ${C.ink}`, borderRadius: 16, overflow: 'hidden', background: C.card, opacity: spec, transform: `scale(${lerp(0.94, 1, spec)})`}}>
          <div style={{position: 'absolute', inset: 0, background: C.mint, transformOrigin: 'left', transform: `scaleX(${mintWipe})`}} />
          <div style={{position: 'absolute', left: 30, top: 20}}><Mono color={C.ink} size={22}>font · Archivo 900{mintWipe > 0.5 ? '   colour · #6BE0A0' : ''}</Mono></div>
          <div style={{position: 'absolute', left: 26, top: 58, fontFamily: fam, fontWeight: fam === 'Archivo' ? 900 : 600, fontStyle: fam === 'Newsreader' ? 'italic' : 'normal', fontSize: 120, letterSpacing: fam === 'Archivo' ? -4 : 0, color: C.ink, lineHeight: 1.1}}>Archivo</div>
        </div>
      )}
    </div>
  );
};
const B4: React.FC<{f: number; m: MT; mouth: number[]}> = ({f, m, mouth}) => {
  const {w, L} = m;
  const a = L[9], b = w(9, 23) + 8; // line 10 span
  const N = 46, WW = 600, X0 = 4;
  const fx = (t: number) => X0 + ((t - a) / (b - a)) * WW;
  const bars = Array.from({length: N}).map((_, i) => {
    const t0 = a + Math.floor(((b - a) * i) / N);
    let s = 0;
    for (let k = 0; k < 4; k++) s += mouth[t0 + k] ?? 0;
    return 8 + (s / 8) * 70 + ((i * 37) % 7);
  });
  const strip = r(f, L[8] - 2, L[8] + 10);
  const head = Math.max(0, Math.min(1, (f - a) / (b - a)));
  const chips: [string, number, boolean][] = [['cue', w(9, 1), false], ['voice', w(9, 6), false], ['word', w(9, 16), false]];
  const ghostAt = w(9, 16) + 15, lateAt = w(9, 22);
  const gx = fx(w(9, 16)) + 15 * (WW / (b - a));
  return (
    <div style={{position: 'relative', height: '100%', opacity: strip, transform: `translateY(${(1 - strip) * 30}px)`}}>
      {/* chips row */}
      <div style={{position: 'absolute', left: 0, top: 6, width: WW + 20, height: 60}}>
        {chips.map(([t, at], i) => {
          const p = r(f, at - 4, at + 4, IO);
          return (
            <div key={i} style={{position: 'absolute', left: fx(at) - 4, top: 0, transform: `translateY(${(1 - p) * -40}px)`, opacity: p}}>
              <span style={{display: 'inline-block', background: C.mint, border: `3px solid ${C.ink}`, borderRadius: 8, padding: '2px 10px', fontFamily: 'Archivo', fontWeight: 900, fontSize: 26, color: C.ink, whiteSpace: 'nowrap'}}>{t}</span>
            </div>
          );
        })}
      </div>
      {/* waveform of the real line */}
      <div style={{position: 'absolute', left: 0, top: 78, width: WW + 10, height: 110, background: C.soft, border: `3px solid ${C.ink}`, borderRadius: 12}}>
        {bars.map((h, i) => (
          <div key={i} style={{position: 'absolute', left: X0 + (i * WW) / N + 2, top: 55 - h / 2, width: WW / N - 5, height: h, borderRadius: 4, background: i / N < head ? C.ink : '#B9B2A2'}} />
        ))}
        {chips.map(([, at], i) => <div key={i} style={{position: 'absolute', left: fx(at) + 2, top: -12, width: 4, height: 134, background: C.green, opacity: r(f, at - 4, at + 2)}} />)}
        <div style={{position: 'absolute', left: fx(Math.min(b, Math.max(a, f))) + 2, top: -6, width: 3, height: 122, background: C.red, opacity: head > 0 && head < 1 ? 1 : 0}} />
      </div>
      {/* the guess: the same word, half a second late, then struck */}
      <div style={{position: 'absolute', left: gx - 4, top: 206, transform: `translateY(${(1 - r(f, ghostAt - 4, ghostAt + 4, IO)) * 30}px)`, opacity: r(f, ghostAt - 4, ghostAt + 4)}}>
        <div style={{position: 'absolute', left: 4, top: -20, width: 4, height: 22, background: C.red}} />
        <span style={{position: 'relative', display: 'inline-block', background: C.card, border: `3px dashed ${C.red}`, borderRadius: 8, padding: '2px 10px', fontFamily: 'Archivo', fontWeight: 900, fontSize: 26, color: C.red, whiteSpace: 'nowrap'}}>
          word
          <Strike p={r(f, lateAt, lateAt + 10, IO)} />
        </span>
      </div>
      <div style={{position: 'absolute', left: 0, top: 214, opacity: r(f, ghostAt - 4, ghostAt + 4)}}><Mono size={22} color={C.red}>a guess</Mono><span style={{opacity: r(f, lateAt, lateAt + 8)}}><Mono size={22} color={C.red}>, +0.5 s late</Mono></span><Mono size={22} color={C.red}> →</Mono></div>
    </div>
  );
};
const B5: React.FC<{f: number; m: MT}> = ({f, m}) => {
  const {w, L} = m;
  const stamp = r(f, w(11, 1) - 2, w(11, 1) + 6, Easing.out(Easing.back(1.6)));
  const items: [string, number][] = [['No glows.', w(12, 0)], ['No bouncing text.', w(12, 2)], ['Nothing on a hand.', w(12, 5)]];
  const slots = r(f, L[10] + 4, L[10] + 14) * (1 - r(f, L[13] - 4, L[13] + 6));
  const strikeG = r(f, w(12, 1), w(12, 1) + 10, IO), strikeB = r(f, w(12, 3), w(12, 3) + 10, IO), strikeH = r(f, w(12, 10) - 2, w(12, 10) + 8, IO);
  const bounce = (1 - strikeB) * Math.abs(Math.sin(f / 4)) * 16;
  const pileAt = w(13, 2), defAt = w(13, 6) - 2;
  const Def: React.FC<{glow: number; b: number; i?: number}> = ({glow, b}) => (
    <div style={{position: 'relative', width: 230, height: 160, borderRadius: 18, background: 'linear-gradient(135deg, #7B5CFF, #FF5CA8)', boxShadow: `0 0 ${50 * glow}px ${16 * glow}px rgba(160,110,255,${0.75 * glow})`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <span style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 40, color: '#fff', transform: `translateY(${-b}px)`}}>WOW</span>
      <div style={{position: 'absolute', right: -14, bottom: -18, width: 64, height: 64, borderRadius: 32, background: '#F3C9A1', border: `3px solid ${C.ink}`}} />
      <span style={{position: 'absolute', right: -6, bottom: 2, fontFamily: 'Archivo', fontWeight: 900, fontSize: 22, color: '#fff', background: '#FF5CA8', padding: '0 6px', borderRadius: 4}}>sub</span>
    </div>
  );
  return (
    <div style={{position: 'relative', height: '100%'}}>
      <div style={{position: 'absolute', left: 0, top: 8, display: 'flex', flexDirection: 'column', gap: 30, opacity: slots}}>
        {items.map((_, i) => <div key={i} style={{height: 40, display: 'flex', alignItems: 'center', gap: 14}}><span style={{width: 36, height: 36, borderRadius: 8, border: `3px dashed ${C.line}`}} /><span style={{width: [170, 300, 320][i], height: 18, borderRadius: 9, background: C.soft}} /></div>)}
      </div>
      <div style={{position: 'absolute', left: 0, top: 8, display: 'flex', flexDirection: 'column', gap: 30, opacity: 1 - r(f, L[13] - 4, L[13] + 6)}}>
        {items.map(([t, at], i) => {
          const p = r(f, at - 2, at + 7);
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, height: 40, opacity: p, transform: `translateX(${(1 - p) * -24}px)`}}>
              <span style={{width: 36, height: 36, borderRadius: 8, border: `3px solid ${C.red}`, color: C.red, fontFamily: 'Archivo', fontWeight: 900, fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>✕</span>
              <span style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 36, color: C.ink, whiteSpace: 'nowrap', letterSpacing: -1, background: C.card}}>{t}</span>
            </div>
          );
        })}
      </div>
      {/* the default, shown on purpose, crossed off as each rule is said */}
      <div style={{position: 'absolute', left: 390, top: 30, opacity: r(f, L[12] - 4, L[12] + 6), transformOrigin: '0 0', transform: `scale(${lerp(0.9, 0.72, r(f, L[13] - 4, L[13] + 8, IO))})`}}>
        <div style={{position: 'absolute', left: -6, top: -34, whiteSpace: 'nowrap'}}><Mono size={18}>the default · on purpose</Mono></div>
        {[4, 3, 2, 1, 0].map((k) => {
          const p = r(f, pileAt + k * 7, pileAt + k * 7 + 10, IO);
          if (p <= 0) return null;
          const ang = [-14, 11, -7, 16, -3][k], dx = [-560, -280, -420, -140, -640][k], dy = [20, 150, 190, 120, 160][k];
          return <div key={k} style={{position: 'absolute', left: 0, top: 0, transform: `translate(${dx * p}px, ${dy * p}px) rotate(${ang * p}deg) scale(0.9)`, transformOrigin: '50% 50%', opacity: p}}><Def glow={1} b={0} /></div>;
        })}
        <div style={{position: 'relative'}}><Def glow={1 - strikeG} b={bounce} /></div>
        <div style={{position: 'absolute', left: 0, top: 0, width: 230, height: 160}}>
          {[strikeG, strikeB, strikeH].map((p, i) => (
            <svg key={i} viewBox="0 0 230 160" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
              <path d={['M-10 30 L 240 120', 'M-10 120 L 240 40', 'M150 160 L 240 110'][i]} stroke={C.red} strokeWidth={8} strokeLinecap="round" fill="none" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />
            </svg>
          ))}
        </div>
        <Sticker p={r(f, defAt, defAt + 8)} rot={-5} bg={C.card} size={56} style={{left: -420, top: 90}}>everyone’s default</Sticker>
      </div>
      <div style={{position: 'absolute', right: 0, top: -64}}><Stamp text="NEVER" p={stamp} size={46} rot={-8} /></div>
    </div>
  );
};
const B6: React.FC<{f: number; m: MT}> = ({f, m}) => {
  const {w} = m;
  const d1 = w(14, 2), d2 = w(14, 4), vo = w(14, 5), lu = w(14, 7);
  const needle = num(f, -40, [[vo - 4, lu + 2, -10], [lu + 2, lu + 14, -14]]);
  const pos = (v: number) => ((v + 40) / 40) * 560;
  return (
    <div style={{position: 'relative', height: '100%'}}>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 18}}>
        <span style={{opacity: r(f, d1 - 4, d1 + 2), fontFamily: 'Archivo', fontWeight: 900, fontSize: 96, color: C.ink, fontVariantNumeric: 'tabular-nums'}}>{Math.round(lerp(0, 1080, r(f, d1 - 4, d1 + 10)))}</span>
        <span style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 70, color: C.muted, opacity: r(f, w(14, 3) - 3, w(14, 3) + 4)}}>×</span>
        <span style={{opacity: r(f, d2 - 4, d2 + 2), fontFamily: 'Archivo', fontWeight: 900, fontSize: 96, color: C.ink, fontVariantNumeric: 'tabular-nums'}}>{Math.round(lerp(0, 1920, r(f, d2 - 4, d2 + 10)))}</span>
      </div>
      <div style={{position: 'absolute', left: 0, top: 140, width: 600, opacity: r(f, vo - 4, vo + 6)}}>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 8}}><Mono size={22} color={C.ink}>voice loudness</Mono><Mono size={22} color={C.ink}>{needle.toFixed(0).replace('-', '−')} LUFS</Mono></div>
        <div style={{position: 'relative', height: 44, border: `3px solid ${C.ink}`, borderRadius: 10, background: C.soft, overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: pos(needle), background: C.mint}} />
          <div style={{position: 'absolute', left: pos(-14) - 2, top: 0, bottom: 0, width: 4, background: C.ink}} />
        </div>
        <div style={{position: 'relative', height: 30}}>
          <div style={{position: 'absolute', left: pos(-14) - 30, top: 6}}><Mono size={20} color={C.ink}>−14</Mono></div>
          <div style={{position: 'absolute', left: 0, top: 6}}><Mono size={20}>−40</Mono></div>
          <div style={{position: 'absolute', right: 0, top: 6}}><Mono size={20}>0</Mono></div>
        </div>
      </div>
    </div>
  );
};

const BriefCard: React.FC<{f: number; m: MT; mouth: number[]; colH: number; openAt: number[]; closeAt: number[]; railA: number; railIn: number; full: number; loopA: number}> = ({f, m, mouth, colH, openAt, closeAt, railA, railIn, full, loopA}) => {
  const {w} = m;
  const opens = openAt.map((a, i) => r(f, a, a + 12, IO) * (1 - r(f, closeAt[i], closeAt[i] + 12, IO)));
  const reset = 1 - r(f, loopA, loopA + 10);
  const done = openAt.map((_, i) => Math.max(full, r(f, closeAt[i] + 4, closeAt[i] + 14)) * reset);
  const hs = opens.map((o) => lerp(colH, EXP, o));
  const ys: number[] = [];
  let y = HEAD;
  hs.forEach((h) => { ys.push(y); y += h + GAP; });
  const H = y + 8;
  const hh = opens.map((o) => lerp(colH, HH + 8, o));
  const dotY = ys.map((yy, i) => yy + hh[i] / 2);
  // rail fill: grows to each block's dot as it opens
  let fillY = dotY[0] * r(f, railA, railA + 12, IO) * reset;
  for (let i = 1; i < 6; i++) fillY += (dotY[i] - dotY[i - 1]) * Math.max(full, r(f, openAt[i] - 4, openAt[i] + 8, IO)) * reset;
  const flash = r(f, w(7, 6) - 2, w(7, 6) + 8, IO) * (1 - r(f, w(7, 6) + 16, w(7, 6) + 30, IO));
  const blocks = [<B1 f={f} m={m} />, <B2 f={f} m={m} />, <B3 f={f} m={m} />, <B4 f={f} m={m} mouth={mouth} />, <B5 f={f} m={m} />, <B6 f={f} m={m} />];
  return (
    <div style={{position: 'relative', width: CW, height: H}}>
      {/* rail (inside the card's space, left of it) */}
      <div style={{position: 'absolute', left: -62, top: 0, opacity: railIn}}>
        <div style={{position: 'absolute', left: 12, top: dotY[0], width: 6, height: dotY[5] - dotY[0], background: C.ink, borderRadius: 3}} />
        <div style={{position: 'absolute', left: 12, top: dotY[0], width: 6, height: Math.max(0, fillY - dotY[0]), background: C.mint, borderRadius: 3, boxSizing: 'border-box'}} />
        {dotY.map((dy, i) => {
          const on = i === 0 ? Math.max(full, r(f, railA, railA + 8)) : Math.max(full, r(f, openAt[i] + 2, openAt[i] + 8));
          return <div key={i} style={{position: 'absolute', left: 0, top: dy - 15, width: 30, height: 30, borderRadius: 15, border: `5px solid ${C.ink}`, boxSizing: 'border-box', background: on > 0.5 ? C.mint : C.card, transform: `scale(${1 + 0.25 * Math.sin(Math.PI * on) + 0.1 * flash})`}} />;
        })}
      </div>
      <div style={{position: 'absolute', inset: 0, background: C.card, border: `4px solid ${C.ink}`, borderRadius: 16}} />
      <div style={{position: 'absolute', left: 30, top: 16, display: 'flex', alignItems: 'baseline', gap: 18}}>
        <Mono size={24} style={{letterSpacing: 2}}>THE BRIEF</Mono>
        <span style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 52, color: C.ink, lineHeight: 1}}>
          <Spin f={f} at={w(1, 5) - 4} text="6" size={52} />{' '}
          <span style={{fontFamily: 'Newsreader', fontStyle: 'italic', fontWeight: 600, color: C.green}}>blocks</span>
        </span>
      </div>
      <div style={{position: 'absolute', right: 20, top: -30}}><Stamp text="copy-paste ready" p={r(f, w(3, 12) - 2, w(3, 12) + 6) * (1 - r(f, openAt[0] - 8, openAt[0]))} color={C.green} rot={4} size={26} /></div>
      {ROWS.map((row, i) => {
        const o = opens[i];
        const flick = r(f, railA + 8 + i * 6, railA + 14 + i * 6) * (1 - r(f, railA + 18 + i * 6, railA + 26 + i * 6));
        const big = colH > 70 ? 1 : 0;
        return (
          <div key={i} style={{position: 'absolute', left: 18, right: 18, top: ys[i], height: hs[i], borderTop: i ? `2px solid ${C.line}` : 'none', overflow: 'hidden'}}>
            <div style={{position: 'absolute', left: 12, top: 0, height: hh[i], display: 'flex', alignItems: 'center', gap: 16, width: CW - 66}}>
              <div style={{width: 42, height: 42, flex: 'none', borderRadius: 9, border: `3px solid ${C.ink}`, background: o > 0.3 || flick > 0.5 ? C.mint : done[i] > 0.5 ? C.ink : C.card, color: done[i] > 0.5 && o <= 0.3 && flick <= 0.5 ? C.card : C.ink,
                fontFamily: 'Archivo', fontWeight: 900, fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</div>
              <div style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: lerp(30 + big * 4, 36, o), color: C.ink, whiteSpace: 'nowrap'}}>{row.label}</div>
              <div style={{marginLeft: 'auto', position: 'relative', whiteSpace: 'nowrap'}}>
                <div style={{opacity: done[i] * (1 - o)}}><Mono size={big ? 24 : 21} color={C.green}>{row.sum}</Mono></div>
                <div style={{position: 'absolute', right: 0, top: 0, opacity: r(f, railA + 8 + i * 6, railA + 14 + i * 6) * (1 - r(f, openAt[0] - 8, openAt[0]))}}><Mono size={26} color={C.muted}>{HINTS[i]}</Mono></div>
              </div>
            </div>
            {o > 0.02 && <div style={{position: 'absolute', left: 70, top: HH + 14, width: CW - 120, height: EXP - HH - 20, opacity: r(o, 0.4, 1)}}>{blocks[i]}</div>}
          </div>
        );
      })}
    </div>
  );
};

// ---------- headline band ----------
const Head: React.FC<{f: number; items: [number, React.ReactNode][]}> = ({f, items}) => {
  let idx = 0;
  items.forEach(([t], i) => { if (f >= t) idx = i; });
  const [t0, node] = items[idx];
  const pin = idx === 0 && t0 === 0 ? 1 : r(f, t0 + 1, t0 + 10);
  const prev = idx > 0 ? items[idx - 1][1] : null;
  const pout = r(f, t0 - 5, t0 + 1, IO);
  const box: React.CSSProperties = {position: 'absolute', left: 70, top: 250, width: 900, fontFamily: 'Archivo', fontWeight: 900, fontSize: 104, lineHeight: 1.02, letterSpacing: -3, color: C.ink};
  return (
    <>
      {prev && pout < 1 && <div style={{...box, opacity: 1 - pout, transform: `translateY(${-pout * 26}px)`}}>{prev}</div>}
      <div style={{...box, opacity: pin, transform: `translateY(${(1 - pin) * 30}px)`}}>{node}</div>
    </>
  );
};
const HookHead: React.FC<{under?: number}> = ({under = 1}) => (
  <div style={{fontSize: 118}}>
    Stop{' '}
    <span style={{position: 'relative', display: 'inline-block'}}>
      editing
      <span style={{position: 'absolute', left: -6, right: -6, bottom: -10, height: 16, background: C.red, borderRadius: 8, transform: `rotate(-1.5deg) scaleX(${under})`, transformOrigin: 'left'}} />
    </span>
    <br />
    your Reels.
  </div>
);

// ---------- main ----------
export const V3: React.FC<{platform: 'ig' | 'tt'}> = ({platform}) => {
  const f = useCurrentFrame();
  const z = Z[platform];
  const m = MM[platform];
  const mouth = (platform === 'ig' ? MIG : MTT) as number[];
  const {L, w, TOTAL, END} = m;
  const ig = platform === 'ig';
  const kw = m.find(19, /VIDEO/);

  // key moments
  const pushA = L[2] - 6, neverAt = w(2, 6), outA = L[3] - 4;
  const openAt = [L[4] - 6, L[5] - 6, L[6] - 6, L[8] - 6, L[10] - 6, L[14] - 6];
  const codeA = L[15] - 6;
  const closeAt = [openAt[1], openAt[2], openAt[3], openAt[4], openAt[5], codeA];
  const phoneA = L[16] - 6, ansA = L[18] - 6, ctaA = L[19] - 6, loopA = L[20] - 4;
  const strikeA = w(18, 4) - 3;

  const PEEK: P = {x: 150, y: 858, s: 0.62, rot: -5, o: 1};
  const FULL: P = {x: 160, y: 590, s: 1, rot: 0, o: 1};
  const card = track(f, PEEK, [
    [w(1, 6) - 6, w(1, 6) + 10, {...PEEK, y: 800, rot: -3}],
    [pushA, pushA + 12, {...PEEK, x: 60, y: 820, rot: -8, o: 0}],
    [outA, outA + 22, FULL],
    [codeA, codeA + 18, {x: 70, y: 620, s: 0.52, rot: -3, o: 1}],
    [phoneA, phoneA + 14, {x: -380, y: 700, s: 0.46, rot: -8, o: 0}],
    [ansA + 8, ansA + 9, {x: 160, y: 760, s: 1, rot: 0, o: 0}],
    [ansA + 9, ansA + 24, {...FULL, y: 600}],
    [ctaA, ctaA + 8, {x: 300, y: 700, s: 0.6, rot: 0, o: 0}],
    [loopA + 6, loopA + 7, {...PEEK, x: -200, o: 0}],
    [loopA + 7, loopA + 28, PEEK],
  ]);
  const colH = num(f, 72, [[outA, outA + 22, 96], [openAt[0], openAt[0] + 12, 52], [ansA, ansA + 18, 84], [loopA, loopA + 26, 72]]);
  const full = r(f, ansA, ansA + 14) * (1 - r(f, loopA, loopA + 2));
  const railIn = r(f, outA + 6, outA + 20) * (1 - r(f, loopA, loopA + 10));

  const PH0: P = {x: 470, y: 600, s: 1, rot: 3, o: 1};
  const phone = track(f, PH0, [
    [pushA, pushA + 16, {x: 299, y: 548, s: 1.12, rot: 0, o: 1}],
    [outA, outA + 16, {x: -560, y: 600, s: 1, rot: -8, o: 1}],
    [phoneA - 1, phoneA, {x: 1200, y: 620, s: 0.9, rot: 8, o: 1}],
    [phoneA, phoneA + 16, {x: 470, y: 610, s: 0.9, rot: 2, o: 1}],
    [ansA, ansA + 14, {x: 1200, y: 610, s: 0.9, rot: 8, o: 1}],
    [loopA, loopA + 1, {x: 1200, y: 600, s: 1, rot: 8, o: 1}],
    [loopA + 4, loopA + 28, PH0],
  ]);
  const chip = (1 - r(f, pushA, pushA + 8)) + r(f, loopA + 22, loopA + 32);

  // frame-0 rail (separate, as in the frame-0 test); hands over to the card's own rail
  const oldRail = 1 - r(f, outA, outA + 12) + r(f, loopA + 10, loopA + 26);

  const HEADS: [number, React.ReactNode][] = [
    [0, <HookHead />],
    [L[1] - 2, <>Hand Claude a<br />6-block <Accent f={f} at={w(1, 6)}>brief.</Accent></>],
    [L[2] - 2, <>This Reel is<br />the proof.</>],
    [L[3] - 2, <>Here’s the brief,<br />block by block.</>],
    [L[4] - 2, <>One:<br />who it’s for.</>],
    [L[5] - 2, <>Two:<br />the script.</>],
    [L[6] - 2, <>Three:<br />the look.</>],
    [L[7] - 2, <span style={{fontSize: 96}}>Archivo,<br />and <Accent f={f} at={w(7, 6)}>mint green.</Accent></span>],
    [L[8] - 2, <>Four:<br />timing.</>],
    [L[9] - 2, <span style={{fontSize: 92}}>On the real voice,<br />never a guess.</span>],
    [L[10] - 2, <>Five matters<br /><Accent f={f} at={w(10, 2)}>most.</Accent></>],
    [L[11] - 2, <>The<br />never-list.</>],
    [L[13] - 2, <span style={{fontSize: 92}}>Leave it out,<br />get the default.</span>],
    [L[14] - 2, <>Six:<br />export.</>],
    [L[15] - 2, <span style={{fontSize: 96}}>Claude writes<br />it as <Accent f={f} at={w(15, 7)}>code.</Accent></span>],
    [L[16] - 2, <>Watch it<br />twice.</>],
    [L[18] - 2, <span style={{fontSize: 96}}>The skill{' '}
      <span style={{position: 'relative', display: 'inline-block'}}>
        <span style={{opacity: 1 - r(f, w(18, 5) - 4, w(18, 5) + 2, IO)}}>isn’t</span>
        <span style={{position: 'absolute', left: 0, top: 0, opacity: r(f, w(18, 5) - 2, w(18, 6) + 2)}}>is</span>
      </span><br />
      <span style={{position: 'relative', display: 'inline-block'}}>
        <span style={{opacity: 1 - r(f, w(18, 5) - 4, w(18, 5) + 2, IO), position: 'relative'}}>editing.<Strike p={r(f, strikeA, strikeA + 10, IO)} width={9} /></span>
        <span style={{position: 'absolute', left: 0, top: 0, whiteSpace: 'nowrap', opacity: r(f, w(18, 5) - 2, w(18, 6) + 2), transform: `translateY(${(1 - r(f, w(18, 5) - 2, w(18, 6) + 4)) * 20}px)`}}>
          <Accent f={f} at={w(18, 6)}>writing</Accent> the brief.
        </span>
      </span>
    </span>],
    [L[19] - 2, ig ? <>Comment<br /><span style={{background: C.mint, padding: '0 14px', borderRadius: 12}}>VIDEO</span></> : <>DM me<br /><span style={{background: C.mint, padding: '0 14px', borderRadius: 12}}>VIDEO</span></>],
    [L[20] - 2, <>Hand it<br />to Claude.</>],
    [w(20, 5) - 2, <HookHead under={r(f, w(20, 6) - 2, w(20, 6) + 8, IO)} />],
  ];

  // code panel
  const codeLines = ['<Composition id="V3"', '  width={1080} height={1920}', '  fps={30} />', 'font: Archivo 900', "mint: '#6BE0A0'", "cue('never', w(2, 6))", "cue('VIDEO', w(19, 1))", 'captions ← real voice', 'never: glow, bounce', 'export: −14 LUFS'];
  const codeIn = r(f, codeA + 6, codeA + 18) * (1 - r(f, phoneA, phoneA + 10));
  const stills = ['v3v/still_30.png', 'v3v/still_38.png', 'v3v/still_46.png'];
  const stillAt = [w(15, 10) - 2, w(15, 10) + 4, w(15, 10) + 10];
  const checkAt = [w(15, 13), w(15, 14), w(15, 15)];

  // phone-twice scene
  const twiceAt = w(16, 3), sndAt = w(17, 0), muteAt = w(17, 3), chipsAt = w(17, 6) - 6;
  const CHECKS = ['Hook in 1 s', 'Reads on mute', 'Captions on word', 'No overlaps', 'Hand clear', 'Safe zone', 'Loop seam', '−14 LUFS'];

  // CTA
  const ctaIn = r(f, ctaA + 6, ctaA + 18) * (1 - r(f, loopA - 4, loopA + 4));
  const sendAt = m.w(19, ig ? 2 : 3), dmAt = m.w(19, ig ? 4 : 5);

  return (
    <AbsoluteFill style={GRID}>
      <Fonts />
      <Audio src={staticFile(`v3v/final_${platform}.wav`)} />

      <div style={{position: 'absolute', inset: 0, transform: camera(f, TOTAL, [
        [pushA - 4, outA, 1.04, 540, 950],
        [L[10] - 6, L[11] + 24, 1.07, 520, 1060],
        [ansA + 10, ctaA, 1.03, 540, 900],
      ], [[neverAt + 3, 8], [w(11, 1) + 4, 9], [w(12, 10), 5]])}}>

        <Head f={f} items={HEADS} />

        {/* frame-0 rail */}
        {oldRail > 0.01 && (
          <div style={{opacity: Math.min(1, oldRail)}}>
            <div style={{position: 'absolute', left: 84, top: 600, width: 6, height: 700, background: C.ink, borderRadius: 3}} />
            {ROWS.map((_, i) => <div key={i} style={{position: 'absolute', left: 72, top: 600 + i * 136, width: 30, height: 30, borderRadius: 15, border: `5px solid ${C.ink}`, boxSizing: 'border-box', background: C.card}} />)}
          </div>
        )}

        {/* the brief card */}
        {card.o > 0.01 && (
          <div style={place(card)}>
            <BriefCard f={f} m={m} mouth={mouth} colH={colH} openAt={openAt} closeAt={closeAt} railA={w(3, 6) - 4} railIn={railIn} full={full} loopA={loopA} />
          </div>
        )}

        {/* code + stills (Claude writes it as code, checks stills first) */}
        {codeIn > 0.01 && (
          <>
            <svg style={{position: 'absolute', left: 436, top: 700, width: 70, height: 60, opacity: codeIn}} viewBox="0 0 70 60">
              <path d="M4 30 C 25 10, 45 50, 62 30 M50 20 L 64 30 L 50 40" stroke={C.ink} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - r(f, codeA + 10, codeA + 22)} />
            </svg>
            <div style={{position: 'absolute', left: 506, top: 600, width: 356, height: 470, background: C.ink, borderRadius: 16, padding: '22px 22px', boxSizing: 'border-box', opacity: codeIn, transform: `translateX(${(1 - codeIn) * 60}px)`}}>
              <Mono size={18} color="#8C877C">V3.tsx</Mono>
              {codeLines.map((ln, i) => {
                const at = w(15, 2) + i * 4;
                const p = r(f, at - 2, at + 5);
                return <div key={i} style={{fontFamily: 'Plex', fontSize: 19, lineHeight: 1.62, color: i === 5 || i === 6 ? C.mint : '#EDE9DF', whiteSpace: 'nowrap', opacity: p, transform: `translateX(${(1 - p) * 14}px)`}}>{ln}</div>;
              })}
            </div>
            <div style={{position: 'absolute', left: 160, top: 1088, display: 'flex', gap: 22, opacity: codeIn}}>
              {stills.map((s, i) => {
                const p = r(f, stillAt[i] - 2, stillAt[i] + 8);
                return (
                  <div key={i} style={{position: 'relative', width: 140, height: 249, border: `4px solid ${C.ink}`, borderRadius: 12, overflow: 'hidden', background: C.card, opacity: p, transform: `translateY(${(1 - p) * 30}px) rotate(${[-3, 1, 4][i] * p}deg)`}}>
                    <Img src={staticFile(s)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                    <div style={{position: 'absolute', right: 8, top: 8}}><Check p={r(f, checkAt[i], checkAt[i] + 8)} size={40} /></div>
                  </div>
                );
              })}
              <div style={{alignSelf: 'center', opacity: r(f, w(15, 17) - 2, w(15, 17) + 6)}}><Stamp text="then render" p={r(f, w(15, 17) - 2, w(15, 17) + 6)} color={C.green} rot={-4} size={30} /></div>
            </div>
          </>
        )}

        {/* phone (frame 0 proof, push-in, back for the twice-check, loop) */}
        {phone.x < 1150 && phone.x > -560 * phone.s - 10 && (
          <div style={place(phone)}>
            <Phone f={f} vids={[[2, outA + 18], [phoneA - 2, ansA + 16]]} chip={Math.min(1, chip)}>
              {/* never opened an editing app */}
              {f >= neverAt - 4 && f < outA + 18 && (
                <div style={{position: 'absolute', inset: 0, background: `rgba(233,229,218,${0.9 * r(f, neverAt - 4, neverAt + 4)})`}}>
                  <div style={{position: 'absolute', left: 38, top: 240, width: 324, height: 180, border: `4px solid ${C.ink}`, borderRadius: 14, background: C.card, opacity: r(f, neverAt - 4, neverAt + 4)}}>
                    <Mono size={18} style={{position: 'absolute', left: 14, top: 10}}>editing app</Mono>
                    {[0, 1, 2].map((k) => <div key={k} style={{position: 'absolute', left: 16 + [0, 40, 10][k], top: 52 + k * 38, width: [180, 220, 140][k], height: 26, borderRadius: 6, background: [C.mint, C.note, '#C9C2B3'][k], border: `2px solid ${C.ink}`}} />)}
                    <div style={{position: 'absolute', left: 120, top: 40, width: 3, height: 130, background: C.red}} />
                    <svg viewBox="0 0 324 180" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
                      <path d="M10 10 L 314 170" stroke={C.red} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - r(f, w(2, 9) - 2, w(2, 9) + 6, IO)} />
                      <path d="M314 10 L 10 170" stroke={C.red} strokeWidth={10} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - r(f, w(2, 9) + 3, w(2, 9) + 11, IO)} />
                    </svg>
                  </div>
                  <div style={{position: 'absolute', left: 50, top: 470}}><Stamp text="never opened" p={r(f, neverAt - 2, neverAt + 6, Easing.out(Easing.back(1.6)))} size={40} /></div>
                </div>
              )}
              {/* muted badge for the second watch */}
              {f >= sndAt - 4 && f < ansA + 16 && (
                <div style={{position: 'absolute', right: 18, top: 18, width: 74, height: 74, borderRadius: 37, background: C.card, border: `4px solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: r(f, sndAt - 4, sndAt + 4)}}>
                  <svg viewBox="0 0 40 40" style={{width: 44, height: 44}}>
                    <path d="M6 15 H13 L22 8 V32 L13 25 H6 Z" fill={C.ink} />
                    <path d="M27 13 C 31 17, 31 23, 27 27" stroke={C.ink} strokeWidth={3} fill="none" strokeLinecap="round" opacity={1 - r(f, muteAt - 2, muteAt + 4)} />
                    <path d="M26 12 L 37 30" stroke={C.red} strokeWidth={4} strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - r(f, muteAt - 2, muteAt + 6, IO)} />
                  </svg>
                </div>
              )}
            </Phone>
            {f >= twiceAt - 4 && f < ansA + 16 && <div style={{position: 'absolute', right: -40, bottom: 60}}><Stamp text="×2" p={r(f, twiceAt - 2, twiceAt + 6, Easing.out(Easing.back(1.6)))} color={C.ink} bg={C.mint} size={64} rot={8} /></div>}
          </div>
        )}

        {/* 8 checks, against the phone */}
        {f >= chipsAt - 2 && f < ansA + 16 && (
          <div style={{position: 'absolute', left: 70, top: 612, display: 'flex', flexDirection: 'column', gap: 12, opacity: 1 - r(f, ansA, ansA + 10)}}>
            {CHECKS.map((t, i) => {
              const at = chipsAt + i * 2.5;
              const p = r(f, at, at + 7);
              return (
                <div key={i} style={{display: 'flex', alignItems: 'center', gap: 12, height: 72, padding: '0 18px 0 12px', background: C.card, border: `3px solid ${C.ink}`, borderRadius: 36, opacity: p, transform: `translateX(${(1 - p) * -40}px)`, width: 'fit-content'}}>
                  <Check p={r(f, at + 6, at + 13)} size={40} />
                  <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 30, color: C.ink, whiteSpace: 'nowrap'}}>{t}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA: comment (IG) / DM (TikTok) → our DM with the brief */}
        {ctaIn > 0.01 && (
          <div style={{position: 'absolute', inset: 0, opacity: ctaIn, transformOrigin: '480px 640px', transform: 'scale(1.12)'}}>
            <div style={{position: 'absolute', left: 120, top: 640, width: 720, height: 118, background: C.card, border: `4px solid ${C.ink}`, borderRadius: 60, display: 'flex', alignItems: 'center', gap: 20, padding: '0 16px 0 22px', boxSizing: 'border-box', transform: `translateY(${(1 - ctaIn) * 40}px)`}}>
              <div style={{width: 70, height: 70, borderRadius: 35, background: C.note, border: `3px solid ${C.ink}`, flex: 'none'}} />
              <div style={{position: 'relative', flex: 1, height: 60}}>
                <span style={{position: 'absolute', left: 0, top: 6, fontFamily: 'Archivo', fontWeight: 600, fontSize: 38, color: C.muted, opacity: 1 - r(f, kw - 4, kw)}}>{ig ? 'Add a comment…' : 'Message…'}</span>
                <span style={{position: 'absolute', left: 0, top: 0, fontFamily: 'Archivo', fontWeight: 900, fontSize: 50, color: C.ink, opacity: r(f, kw - 3, kw + 3), transform: `scale(${lerp(1.2, 1, r(f, kw - 3, kw + 5))})`, transformOrigin: 'left center'}}>VIDEO</span>
              </div>
              <div style={{width: 84, height: 84, borderRadius: 42, flex: 'none', background: r(f, sendAt - 2, sendAt + 2) > 0.5 ? C.mint : C.soft, border: `4px solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 - 0.12 * Math.sin(Math.PI * r(f, sendAt - 2, sendAt + 6))})`}}>
                <svg viewBox="0 0 40 40" style={{width: 40, height: 40}}><path d="M6 20 H32 M22 10 L32 20 L22 30" stroke={C.ink} strokeWidth={4.5} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
            </div>
            {/* our reply */}
            {(() => {
              const p = r(f, dmAt - 4, dmAt + 10);
              return (
                <div style={{position: 'absolute', left: 160, top: 820, width: 660, opacity: p, transform: `translateX(${(1 - p) * 120}px)`}}>
                  <Mono size={22}>@theexactmethod · DM</Mono>
                  <div style={{marginTop: 10, background: C.ink, color: C.card, borderRadius: '30px 30px 30px 8px', padding: '22px 28px', fontFamily: 'Archivo', fontWeight: 700, fontSize: 36, lineHeight: 1.2}}>
                    Here’s The Video Brief. It’s free.
                  </div>
                  <div style={{marginTop: 12, background: C.card, border: `4px solid ${C.ink}`, borderRadius: 20, padding: '20px 26px', display: 'flex', gap: 20, alignItems: 'center', opacity: r(f, dmAt + 6, dmAt + 14)}}>
                    <div style={{width: 92, height: 120, flex: 'none', border: `3px solid ${C.ink}`, borderRadius: 8, background: C.paper, padding: 8, boxSizing: 'border-box'}}>
                      {[0, 1, 2, 3, 4, 5].map((k) => <div key={k} style={{height: 10, marginTop: k ? 7 : 0, borderRadius: 3, background: k === 0 ? C.mint : C.line}} />)}
                    </div>
                    <div>
                      <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 36, color: C.ink}}>The 6-block brief</div>
                      <Mono size={22} color={C.green}>template + the prompts · free</Mono>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      <Sage f={f} m={m} mouth={mouth} />
      <Caption f={f} z={z} maxW={630} />
    </AbsoluteFill>
  );
};
