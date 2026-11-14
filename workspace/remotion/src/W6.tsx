// W-6 "The resume that says spearheaded" — Sage walkthrough in the W-2 style:
// ruled paper, one main card at the top, word-highlight caption under it, Sage bottom-right.
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import T from './w6timing.json';

const C = {paper: '#E9E5DA', rule: '#D7D1C3', card: '#FCFBF7', ink: '#181714', mint: '#6BE0A0', gold: '#F2B632', red: '#D9534A', muted: '#7A7468', green: '#2F7A52', dark: '#10261C', line: '#DCD7CB'};
const OUT = Easing.bezier(0.42, 0, 0.18, 1);
const IO = Easing.bezier(0.65, 0, 0.35, 1);
const r = (f: number, a: number, b: number, e = OUT) => interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Wd = {w: string; s: number; e: number};
const LINES = T.lines.map((l) => {
  const sw = l.text.split(' ');
  return {...l, words: l.words.map((w: Wd, i: number) => ({...w, w: sw[i]}))};
});
export const W6_TOTAL: number = T.total;
const END: number = T.end;
const L = LINES.map((l) => l.start);
const ws = (li: number, wi: number) => LINES[li].words[wi].s; // word start frame (line index 0-based)

const Fonts: React.FC = () => (
  <style>{`
@font-face{font-family:Archivo;src:url(${staticFile('archivo-variable.woff2')}) format('woff2');font-weight:100 900;font-stretch:62% 125%}
@font-face{font-family:Newsreader;src:url(${staticFile('newsreader-variable.woff2')}) format('woff2');font-weight:200 800;font-style:normal italic}
@font-face{font-family:Plex;src:url(${staticFile('plex-mono-500.woff2')}) format('woff2');font-weight:500}
`}</style>
);

// ---------- caption chunks: split at . : ? , (when long) and max 6 words ----------
type Chunk = {words: Wd[]; from: number};
const CHUNKS: Chunk[] = [];
LINES.forEach((l) => {
  let cur: Wd[] = [];
  l.words.forEach((w, i) => {
    cur.push(w);
    const last = i === l.words.length - 1;
    const brk = /[.:?]["”]?$/.test(w.w) || (/,["”]?$/.test(w.w) && cur.length >= 3) || cur.length >= 6;
    if (brk || last) {
      CHUNKS.push({words: cur, from: cur[0].s - 2});
      cur = [];
    }
  });
});
CHUNKS[0].from = 0;

const ChunkView: React.FC<{f: number; ci: number; o: number; loopIn: boolean}> = ({f, ci, o, loopIn}) => {
  const ch = CHUNKS[ci];
  // highlight: each word's box fades in on its start and out as the next word starts (3 frames)
  const hlA = (i: number) => {
    if (loopIn) return i === 0 ? 1 : 0;
    const s0 = ch.words[i].s;
    const next = i < ch.words.length - 1 ? ch.words[i + 1].s : 1e9;
    const first = i === 0 ? 1 : r(f, s0 - 1, s0 + 2);
    return (i === 0 && f < s0 ? 1 : first) * (1 - r(f, next - 1, next + 2));
  };
  return (
    <div style={{position: 'absolute', left: 66, top: 1092, width: 640, display: 'flex', flexWrap: 'wrap', columnGap: 14, rowGap: 4, opacity: o}}>
      {ch.words.map((w, i) => (
        <span key={i} style={{position: 'relative', fontFamily: 'Archivo', fontWeight: 900, fontSize: 64, lineHeight: 1.12, letterSpacing: -1.5, color: C.ink, padding: '0 8px', margin: '0 -8px'}}>
          <span style={{position: 'absolute', inset: 0, borderRadius: 10, background: C.mint, opacity: hlA(i)}} />
          <span style={{position: 'relative'}}>{w.w}</span>
        </span>
      ))}
    </div>
  );
};
const Caption: React.FC<{f: number}> = ({f}) => {
  const loopIn = f >= W6_TOTAL - 3;
  let ci = 0;
  for (let i = 0; i < CHUNKS.length; i++) if (f >= CHUNKS[i].from) ci = i;
  if (loopIn) return <ChunkView f={f} ci={0} o={1} loopIn />;
  const from = CHUNKS[ci].from;
  const xo = ci === 0 ? 1 : r(f, from, from + 2, IO);
  const xi = ci === 0 ? 1 : r(f, from + 1, from + 5, IO);
  return (
    <>
      {ci > 0 && xo < 1 && <ChunkView f={f} ci={ci - 1} o={1 - xo} loopIn={false} />}
      <div style={{transform: `translateY(${(1 - xi) * 10}px)`}}><ChunkView f={f} ci={ci} o={xi} loopIn={false} /></div>
    </>
  );
};

// ---------- Sage: crossfade between poses ----------
type Pose = 'sage' | 's-check' | 's-finger' | 's-point' | 's-present' | 's-shrug' | 's-sigh' | 's-think';
const POSES: [number, Pose][] = [
  [0, 's-finger'],
  [L[1] - 2, 's-shrug'],
  [ws(2, 0) - 2, 's-sigh'],
  [L[3] - 2, 's-present'],
  [L[4] - 2, 's-check'],
  [ws(7, 0) - 2, 's-point'],
  [L[8] - 2, 'sage'],
  [L[9] - 2, 's-think'],
  [ws(9, 13) - 2, 's-finger'],
  [L[10] - 2, 's-point'],
  [L[11] - 2, 's-finger'],
];
const SAGE_W: Record<Pose, number> = {sage: 388, 's-check': 387, 's-finger': 458, 's-point': 595, 's-present': 573, 's-shrug': 600, 's-sigh': 424, 's-think': 349};
const Sage: React.FC<{f: number}> = ({f}) => {
  const H = 640;
  let idx = 0;
  POSES.forEach(([t], i) => {
    if (f >= t) idx = i;
  });
  const [t0, p] = POSES[idx];
  const prev = idx > 0 ? POSES[idx - 1][1] : null;
  const x = r(f, t0, t0 + 6, IO);
  const img = (pose: Pose, o: number) => {
    const wpx = (SAGE_W[pose] / 1121) * H;
    return <Img key={pose + o} src={staticFile(`sage/${pose}.png`)} style={{position: 'absolute', left: 1035 - wpx, top: 1318, height: H, opacity: o}} />;
  };
  return (
    <>
      {prev && x < 1 && img(prev, 1 - x)}
      {img(p, prev ? x : 1)}
    </>
  );
};

// ---------- shared card ----------
const Card: React.FC<{f: number; inAt: number; outAt: number; children: React.ReactNode; title: string; tag?: React.ReactNode; first?: boolean; zoom?: number}> = ({f, inAt, outAt, children, title, tag, first, zoom = 1.2}) => {
  const i = first ? 1 : r(f, inAt, inAt + 12);
  const o = r(f, outAt, outAt + 10, IO);
  if (f < inAt && !first) return null;
  if (o >= 1) return null;
  return (
    <div style={{position: 'absolute', left: 70, right: 70, top: 290, height: 760, background: C.card, border: `4px solid ${C.ink}`, borderRadius: 30, padding: '30px 38px', overflow: 'hidden',
      opacity: Math.min(1, i * 1.6) * (1 - o), transform: `translateY(${(1 - i) * 70 - o * 50}px) scale(${1 - o * 0.02})`}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 18, borderBottom: `3px solid ${C.line}`}}>
        <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 50, letterSpacing: -1}}>{title}</span>
        {tag}
      </div>
      <div style={{position: 'relative', marginTop: 26, transform: `scale(${zoom})`, transformOrigin: 'top left', width: `${100 / zoom}%`}}>{children}</div>
    </div>
  );
};

const Mono: React.FC<{children: React.ReactNode; color?: string; size?: number}> = ({children, color = C.muted, size = 28}) => (
  <span style={{fontFamily: 'Plex', fontSize: size, color}}>{children}</span>
);
const Stamp: React.FC<{text: string; p: number; color?: string; rot?: number}> = ({text, p, color = C.red, rot = -6}) => (
  <span style={{display: 'inline-block', fontFamily: 'Archivo', fontWeight: 900, fontSize: 34, letterSpacing: 1, color, border: `4px solid ${color}`, borderRadius: 12,
    padding: '4px 16px', transform: `rotate(${rot}deg) scale(${lerp(1.6, 1, p)})`, opacity: Math.min(1, p * 3), background: `${C.card}`}}>{text}</span>
);
const Bullet: React.FC<{children: React.ReactNode; strike?: number; dim?: boolean; o?: number; y?: number}> = ({children, strike = 0, dim, o = 1, y = 0}) => (
  <div style={{display: 'flex', gap: 18, alignItems: 'baseline', padding: '12px 0', opacity: o, transform: `translateY(${y}px)`}}>
    <span style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 40, color: C.muted}}>•</span>
    <span style={{position: 'relative', fontFamily: 'Newsreader', fontSize: 46, lineHeight: 1.18, color: dim || strike > 0.5 ? C.muted : C.ink}}>
      {children}
      <span style={{position: 'absolute', left: -4, top: '54%', height: 4, width: strike > 0 ? `calc(${strike * 100}% + 8px)` : 0, background: C.red, borderRadius: 2}} />
    </span>
  </div>
);
const Check: React.FC<{d: number; color?: string; s?: number; kind?: 'tick' | 'cross' | 'plus'}> = ({d, color = C.green, s = 40, kind = 'tick'}) => (
  <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke={color} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
    {kind === 'tick' && <path d="M5 12.5l4.5 4.5L19 7" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - d} />}
    {kind === 'cross' && <><path d="M6 6l12 12" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.min(1, d * 2)} /><path d="M18 6L6 18" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.max(0, d * 2 - 1)} /></>}
    {kind === 'plus' && <><path d="M12 5v14" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.min(1, d * 2)} /><path d="M5 12h14" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.max(0, d * 2 - 1)} /></>}
  </svg>
);

// ---------- card A: the resume (frame 0 = inflated state) ----------
const INFL = ['Spearheaded', 'a', 'cross-channel', 'brand', 'strategy'];
const ResumeCard: React.FC<{f: number; loop?: number}> = ({f, loop}) => {
  // frame 0 shows the result. Line 2 rewinds it and replays the rewrite on the voice. The loop rebuilds it.
  const rew = r(f, L[1] - 2, L[1] + 10, IO); // inflated → plain
  const hl = r(f, ws(1, 3) - 2, ws(1, 3) + 8); // highlight on "ran the café's Instagram"
  const strike = r(f, ws(1, 7), ws(1, 7) + 10, IO); // "turns into"
  const wordT = [ws(1, 9), ws(1, 10), ws(1, 11), ws(1, 12), ws(1, 13)];
  const stampP = f < L[1] ? 1 : r(f, ws(1, 9), ws(1, 9) + 6);
  const isLoop = loop !== undefined;
  const lp = loop ?? 0;
  const loopP = r(f, lp + 6, lp + 22, IO); // rebuild for the loop
  const plainState = f >= L[1] && !isLoop;
  const struck = isLoop ? 1 : f < ws(1, 7) ? 1 - rew : strike;
  const showInfl = (i: number) => (isLoop ? r(f, lp + 10 + i * 3, lp + 22 + i * 3) : f < wordT[0] - 1 ? 1 - rew : r(f, wordT[i] - 1, wordT[i] + 7));
  const lists = f < L[1] ? 1 : r(f, ws(0, 7) - 4, ws(0, 7) + 8);
  const tabsLoop = isLoop ? loopP : 1;
  const notYou = r(f, ws(2, 3) - 2, ws(2, 3) + 8);
  return (
    <>
      <Bullet strike={struck} dim={false}>
        <span style={{position: 'relative'}}>
          {plainState && <span style={{position: 'absolute', inset: '0 -6px', top: 8, background: C.mint, opacity: hl * (1 - strike) * 0.8, borderRadius: 6}} />}
          <span style={{position: 'relative'}}>Ran the café's Instagram</span>
        </span>
      </Bullet>
      <div style={{position: 'relative', margin: '6px 0 0 50px', minHeight: 130}}>
        <div style={{display: 'flex', flexWrap: 'wrap', columnGap: 14, fontFamily: 'Newsreader', fontWeight: 600, fontSize: 52, lineHeight: 1.2}}>
          {INFL.map((w, i) => {
            const p = showInfl(i);
            return (
              <span key={i} style={{position: 'relative', display: 'inline-block', overflow: 'hidden', paddingRight: 6}}>
                <span style={{position: 'absolute', left: 0, right: 0, top: 10, bottom: 4, background: C.gold, opacity: 0.85 * p, borderRadius: 6}} />
                <span style={{position: 'relative', display: 'inline-block', transform: `translateY(${(1 - p) * 100}%)`}}>{w}</span>
              </span>
            );
          })}
        </div>
        <div style={{position: 'absolute', right: 0, top: -168}}>
          {(isLoop ? f >= lp + 30 : f < L[1] + 8 || f >= ws(1, 9)) && <span style={{opacity: !isLoop && f < ws(1, 9) ? 1 - rew : 1, display: 'inline-block'}}><Stamp text="AI REWRITE" p={isLoop ? r(f, lp + 30, lp + 37) : f < ws(1, 9) ? 1 : stampP} /></span>}
        </div>
      </div>
      <Bullet dim o={0.9}>Barista, 2022</Bullet>
      <Bullet dim o={0.9}>Wrote the weekly newsletter</Bullet>
      {!isLoop && f >= ws(2, 3) - 2 && f < L[3] && (
        <div style={{position: 'absolute', left: 50, top: 300, opacity: notYou * (1 - r(f, ws(2, 6) - 4, ws(2, 6) + 4)), transform: `translateY(${(1 - notYou) * 20}px)`}}>
          <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 34, background: C.ink, color: C.card, borderRadius: 999, padding: '10px 22px'}}>Sounds nothing like you</span>
        </div>
      )}
      <div style={{display: 'flex', gap: 16, marginTop: 34, opacity: lists * tabsLoop, transform: `translateY(${(1 - lists * tabsLoop) * 24}px)`}}>
        {['1', '2', '3'].map((n, i) => (
          <span key={n} style={{flex: 1, border: `3px dashed ${C.ink}`, borderRadius: 16, padding: '14px 0', textAlign: 'center', fontFamily: 'Archivo', fontWeight: 800, fontSize: 36,
            opacity: f < L[1] || isLoop ? 1 : r(f, ws(0, 7) - 4 + i * 3, ws(0, 7) + 6 + i * 3)}}>List {n}</span>
        ))}
      </div>
    </>
  );
};

// ---------- the composition ----------
export const W6: React.FC = () => {
  const f = useCurrentFrame();
  const sfx: [string, number, number][] = [
    ['stamp', ws(1, 9), 0.55],
    ['pop', ws(2, 8) + 2, 0.45],
    ['slide', ws(3, 5), 0.5],
    ['slide', ws(3, 11) - 2, 0.5],
    ['tick', ws(5, 9), 0.5],
    ['scratch', ws(6, 9), 0.45],
    ['pop', ws(7, 11), 0.4],
    ['stack', ws(8, 5), 0.5],
    ['click', ws(10, 12), 0.6],
  ];
  // scene windows
  const A_OUT = ws(2, 8) - 10; // resume card leaves into the interview on "explain"
  const B_IN = ws(2, 8) - 8, B_OUT = ws(3, 1) - 6;
  const C_IN = ws(3, 1) - 4, C_OUT = L[4] - 8;
  const D_IN = L[4] - 4, D_OUT = L[8] - 8;
  const E_IN = L[8] - 4, E_OUT = L[9] - 8;
  const F_IN = L[9] - 4, F_OUT = L[10] - 8;
  const G_IN = L[10] - 10, G_OUT = L[11] - 4;
  const A2_IN = L[11] - 2;

  return (
    <AbsoluteFill style={{background: C.paper, backgroundImage: `repeating-linear-gradient(0deg, transparent 0 63px, ${C.rule} 63px 65px)`, overflow: 'hidden'}}>
      <Fonts />
      <Audio src={staticFile('w6-voice.wav')} />
      {sfx.map(([n, at, v], i) => (
        <Sequence key={i} from={at} durationInFrames={30}>
          <Audio src={staticFile(`w6sfx/${n}.wav`)} volume={v} />
        </Sequence>
      ))}

      {/* A: resume (frame 0 → interview) and again for the loop */}
      {f < A_OUT + 12 && (
        <Card f={f} inAt={0} outAt={A_OUT} first title="Your resume" zoom={1.1}>
          <ResumeCard f={f} />
        </Card>
      )}

      {/* B: interview */}
      <Card f={f} inAt={B_IN} outAt={B_OUT} title="Interview" tag={<Mono color={C.red}>● live</Mono>}>
        {(() => {
          const q = r(f, ws(2, 8) + 2, ws(2, 8) + 12);
          const you = r(f, ws(2, 12) - 2, ws(2, 12) + 8);
          return (
            <>
              <div style={{display: 'flex', gap: 18, alignItems: 'flex-start', opacity: q, transform: `translateY(${(1 - q) * 30}px) scale(${0.96 + 0.04 * q})`, transformOrigin: 'left top'}}>
                <span style={{width: 76, height: 76, borderRadius: 99, background: C.gold, border: `3px solid ${C.ink}`, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Archivo', fontWeight: 900, fontSize: 34}}>HR</span>
                <div style={{background: C.ink, color: C.card, borderRadius: 26, padding: '22px 28px', fontFamily: 'Newsreader', fontSize: 48, lineHeight: 1.2}}>
                  “Tell me about the brand strategy you <span style={{background: C.gold, color: C.ink, borderRadius: 6, padding: '0 6px'}}>spearheaded</span>.”
                </div>
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 40, opacity: you, transform: `translateY(${(1 - you) * 24}px)`}}>
                <div style={{border: `3px solid ${C.ink}`, borderRadius: 26, padding: '20px 28px', fontFamily: 'Newsreader', fontSize: 48, color: C.muted, fontStyle: 'italic'}}>“Well… I posted on Instagram.”</div>
              </div>
            </>
          );
        })()}
      </Card>

      {/* C: paste two things */}
      <Card f={f} inAt={C_IN} outAt={C_OUT} title="Chat" tag={<Mono>paste first</Mono>} zoom={1}>
        {(() => {
          const a = r(f, ws(3, 5) - 2, ws(3, 5) + 14);
          const b = r(f, ws(3, 11) - 4, ws(3, 11) + 12);
          const full = r(f, ws(3, 8), ws(3, 8) + 8);
          const att = (p: number, title: string, rows: string[], label: string, extra?: React.ReactNode) => (
            <div style={{border: `3px solid ${C.ink}`, borderRadius: 22, padding: '20px 24px', background: '#F4F1E8', opacity: Math.min(1, p * 1.5),
              transform: `translateX(${(1 - p) * 560}px) rotate(${(1 - p) * 4}deg)`, height: '100%', boxSizing: 'border-box'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 46}}>{title}</span>
                <Mono size={26}>{label}</Mono>
              </div>
              {rows.map((t) => (
                <div key={t} style={{fontFamily: 'Newsreader', fontSize: 42, color: C.muted, marginTop: 6}}>– {t}</div>
              ))}
              {extra}
            </div>
          );
          const slots = r(f, ws(3, 2) - 2, ws(3, 2) + 10);
          const box = (n: string, p: number, node: React.ReactNode) => (
            <div style={{position: 'relative', height: 300, marginBottom: 20}}>
              <div style={{position: 'absolute', inset: 0, border: `3px dashed ${C.muted}`, borderRadius: 22, padding: '24px', fontFamily: 'Plex', fontSize: 32, color: C.muted,
                opacity: slots * (1 - Math.min(1, p * 2)), transform: `translateY(${(1 - slots) * 20}px)`}}>{n} · paste here</div>
              {p > 0 && <div style={{position: 'absolute', inset: 0}}>{node}</div>}
            </div>
          );
          return (
            <>
              {box('1', a, att(a, 'Job posting', ['Marketing assistant', 'Social media content', 'Designs in Canva'], 'pasted',
                <span style={{display: 'inline-block', marginTop: 12, fontFamily: 'Archivo', fontWeight: 800, fontSize: 28, background: C.mint, border: `3px solid ${C.ink}`, borderRadius: 999,
                  padding: '4px 16px', opacity: full, transform: `scale(${0.85 + 0.15 * full})`}}>in full</span>))}
              {box('2', b, att(b, 'Your resume', ['Ran the café’s Instagram', 'Barista, 2022', 'Wrote the weekly newsletter'], 'pasted'))}
            </>
          );
        })()}
      </Card>

      {/* D: three lists */}
      <Card f={f} inAt={D_IN} outAt={D_OUT} title="3 lists" tag={<Mono>from your resume</Mono>}>
        {(() => {
          const head = (i: number) => r(f, ws(4, 1) - 2 + i * 6, ws(4, 1) + 10 + i * 6);
          const rel1 = r(f, ws(5, 4) - 2, ws(5, 4) + 12);
          const rel2 = r(f, ws(5, 6), ws(5, 6) + 12);
          const tick = r(f, ws(5, 9), ws(5, 9) + 8, IO);
          const dw = r(f, ws(6, 3) - 2, ws(6, 3) + 12);
          const scr = r(f, ws(6, 9), ws(6, 9) + 10, IO);
          const slot = r(f, ws(7, 8) - 2, ws(7, 8) + 10);
          const canva = r(f, ws(7, 11) - 2, ws(7, 11) + 8);
          const focus = (i: number) => {
            const on = [ws(5, 0), ws(6, 0), ws(7, 0)][i];
            const off = [ws(6, 0), ws(7, 0), 99999][i];
            return f >= on - 4 && f < off - 4;
          };
          const sec = (i: number, label: string, kind: 'tick' | 'cross' | 'plus', color: string, body: React.ReactNode, d: number) => (
            <div style={{opacity: head(i), transform: `translateY(${(1 - head(i)) * 24}px)`, padding: '14px 18px', margin: '0 -18px 12px', borderRadius: 18,
              background: focus(i) ? '#F1EEE4' : 'transparent', border: `3px solid ${focus(i) ? C.ink : 'transparent'}`}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
                <span style={{width: 50, height: 50, borderRadius: 12, border: `3px solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: d > 0.3 ? color : C.card}}>
                  <Check d={d} kind={kind} color={C.ink} s={36} /></span>
                <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 42}}>{label}</span>
              </div>
              <div style={{paddingLeft: 64}}>{body}</div>
            </div>
          );
          return (
            <>
              {sec(0, 'Relevant', 'tick', C.mint, <>
                <div style={{fontFamily: 'Newsreader', fontSize: 40, opacity: rel1, transform: `translateX(${(1 - rel1) * -40}px)`}}>Ran the café’s Instagram</div>
                <div style={{fontFamily: 'Newsreader', fontSize: 40, opacity: rel2, transform: `translateX(${(1 - rel2) * -40}px)`}}>Wrote the weekly newsletter</div>
              </>, tick)}
              {sec(1, 'Dead weight', 'cross', '#F3B7B2', <>
                <div style={{position: 'relative', display: 'inline-block', fontFamily: 'Newsreader', fontSize: 40, color: scr > 0.5 ? C.muted : C.ink, opacity: dw, transform: `translateX(${(1 - dw) * -40}px)`}}>
                  Barista, 2022
                  <span style={{position: 'absolute', left: -4, top: '55%', height: 4, width: scr > 0 ? `calc(${scr * 100}% + 8px)` : 0, background: C.red, borderRadius: 2}} />
                </div>
              </>, scr)}
              {sec(2, 'Missing', 'plus', C.gold, <>
                <div style={{display: 'inline-block', marginTop: 4, border: `3px dashed ${C.muted}`, borderRadius: 14, padding: '4px 20px', minWidth: 200, opacity: slot,
                  fontFamily: 'Newsreader', fontSize: 40, color: canva > 0.5 ? C.ink : C.muted, background: canva > 0.5 ? '#F7E7B4' : 'transparent', borderColor: canva > 0.5 ? C.ink : C.muted}}>
                  <span style={{display: 'inline-block', transform: `translateY(${(1 - canva) * 16}px)`, opacity: canva > 0 ? canva : 1}}>{canva > 0 ? 'Canva' : '?'}</span>
                </div>
              </>, canva)}
            </>
          );
        })()}
      </Card>

      {/* E: the real resume */}
      <Card f={f} inAt={E_IN} outAt={E_OUT} title="Your resume" tag={<Mono color={C.green}>tailored</Mono>}>
        {(() => {
          const settle = r(f, ws(8, 5) - 2, ws(8, 5) + 10, IO);
          const chip = r(f, ws(8, 6), ws(8, 6) + 8);
          const ghost = r(f, ws(8, 7) - 2, ws(8, 7) + 10);
          const ghostX = r(f, ws(8, 9), ws(8, 9) + 10, IO);
          return (
            <>
              <div style={{transform: `translateY(${(1 - settle) * -30}px)`, opacity: 0.4 + 0.6 * settle}}>
                <Bullet>Ran the café’s Instagram</Bullet>
                <Bullet>Wrote the weekly newsletter</Bullet>
              </div>
              <div style={{marginTop: 16, opacity: chip, transform: `scale(${0.85 + 0.15 * chip})`, transformOrigin: 'left center'}}>
                <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 34, background: C.mint, border: `3px solid ${C.ink}`, borderRadius: 999, padding: '8px 22px'}}>What you really did</span>
              </div>
              <div style={{marginTop: 70, opacity: ghost * 0.9, transform: `translateY(${(1 - ghost) * 20}px)`}}>
                <Mono>not this:</Mono>
                <div style={{position: 'relative', display: 'inline-block', marginTop: 8, fontFamily: 'Newsreader', fontSize: 42, color: C.muted}}>
                  Spearheaded a cross-channel brand strategy
                  <span style={{position: 'absolute', left: -4, top: '55%', height: 4, width: ghostX > 0 ? `calc(${ghostX * 100}% + 8px)` : 0, background: C.red, borderRadius: 2}} />
                </div>
              </div>
            </>
          );
        })()}
      </Card>

      {/* F: the third list is where the work is */}
      <Card f={f} inAt={F_IN} outAt={F_OUT} title="List 3 · Missing" tag={<Mono>the work</Mono>}>
        {(() => {
          const c = r(f, ws(9, 2) - 2, ws(9, 2) + 10);
          const y = r(f, ws(9, 8) - 2, ws(9, 8) + 10);
          const yT = r(f, ws(9, 15) - 4, ws(9, 15) + 6, IO);
          const n = r(f, ws(9, 16) - 2, ws(9, 16) + 10);
          const nT = r(f, ws(9, 18) - 2, ws(9, 18) + 8, IO);
          const row = (p: number, q: string, a: string, d: number, kind: 'tick' | 'cross', tone: string) => (
            <div style={{display: 'flex', alignItems: 'center', gap: 20, border: `3px solid ${C.ink}`, borderRadius: 22, padding: '20px 24px', marginTop: 22, background: d > 0.5 ? tone : C.card,
              opacity: p, transform: `translateX(${(1 - p) * 60}px)`}}>
              <Check d={d} kind={kind} color={C.ink} s={48} />
              <div>
                <div style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 42}}>{q}</div>
                <div style={{fontFamily: 'Newsreader', fontSize: 40}}>{a}</div>
              </div>
            </div>
          );
          return (
            <>
              <div style={{display: 'inline-block', fontFamily: 'Newsreader', fontWeight: 600, fontSize: 64, background: '#F7E7B4', border: `3px solid ${C.ink}`, borderRadius: 18,
                padding: '6px 28px', opacity: c, transform: `scale(${0.9 + 0.1 * c})`, transformOrigin: 'left center'}}>Canva</div>
              {row(y, 'Done it?', 'Add it in your own words.', yT, 'tick', '#DCEFE3')}
              {row(n, 'Haven’t?', 'Leave it out.', nT, 'cross', '#F6DAD7')}
            </>
          );
        })()}
      </Card>

      {/* G: end card for the $17 pack */}
      {f >= G_IN && f < G_OUT + 12 && (() => {
        const i = r(f, G_IN, G_IN + 20, IO);
        const o = r(f, G_OUT, G_OUT + 10, IO);
        const row10 = r(f, ws(10, 1) - 2, ws(10, 1) + 10);
        const copy = r(f, ws(10, 9) - 2, ws(10, 9) + 8);
        const bio = r(f, ws(10, 12) - 4, ws(10, 12) + 8);
        const press = Math.max(0, 1 - Math.abs(f - ws(10, 12) - 2) / 4);
        return (
          <div style={{position: 'absolute', left: 70, right: 70, top: 290, height: 760, background: C.dark, borderRadius: 30, padding: '40px 42px', color: C.card,
            opacity: Math.min(1, i * 1.6) * (1 - o), transform: `translateY(${(1 - i) * 70 - o * 50}px)`}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <Mono color={C.mint}>The Exact Method</Mono>
              <span style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 40, background: C.gold, color: C.ink, borderRadius: 999, padding: '4px 22px'}}>$17</span>
            </div>
            <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 76, lineHeight: 1.02, letterSpacing: -2, marginTop: 24}}>10 Zero-Ambiguity Prompts</div>
            <div style={{marginTop: 34, border: `3px solid ${C.mint}`, borderRadius: 22, padding: '20px 24px', background: '#173527', opacity: row10, transform: `translateY(${(1 - row10) * 26}px)`}}>
              <Mono color={C.mint}>Prompt 10</Mono>
              <div style={{fontFamily: 'Newsreader', fontSize: 46, lineHeight: 1.15, marginTop: 6}}>Tailoring a resume to one specific job</div>
            </div>
            <div style={{display: 'flex', gap: 16, marginTop: 30, alignItems: 'center'}}>
              <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 32, border: `3px solid ${C.card}`, borderRadius: 999, padding: '8px 22px', opacity: copy}}>Ready to copy</span>
              <span style={{display: 'flex', alignItems: 'center', gap: 14, background: C.mint, color: C.ink, borderRadius: 999, padding: '8px 26px 8px 10px', fontFamily: 'Newsreader', fontStyle: 'italic',
                fontSize: 42, opacity: bio, transform: `scale(${(0.9 + 0.1 * bio) * (1 - 0.05 * press)})`}}>
                <span style={{width: 52, height: 52, borderRadius: 99, background: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <svg viewBox="0 0 24 24" width={28} height={28} fill="none" stroke={C.mint} strokeWidth={3} strokeLinecap="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg></span>
                link in bio</span>
            </div>
          </div>
        );
      })()}

      {/* A again: the loop rebuild, landing on frame 0 */}
      {f >= A2_IN && (
        <Card f={f} inAt={A2_IN} outAt={99999} title="Your resume" zoom={1.1}>
          <ResumeCard f={f} loop={A2_IN} />
        </Card>
      )}

      <Caption f={f} />
      <Sage f={f} />
    </AbsoluteFill>
  );
};

// Reel cover: the frame-0 card + the hook as a headline, all inside the 3:4 grid crop (y 240-1680)
export const W6Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.paper, backgroundImage: `repeating-linear-gradient(0deg, transparent 0 63px, ${C.rule} 63px 65px)`, overflow: 'hidden'}}>
    <Fonts />
    <Card f={0} inAt={0} outAt={99999} first title="Your resume" zoom={1.1}>
      <ResumeCard f={0} />
    </Card>
    <div style={{position: 'absolute', left: 66, top: 1100, width: 660, fontFamily: 'Archivo', fontWeight: 900, fontSize: 76, lineHeight: 1.08, letterSpacing: -2, color: C.ink}}>
      Before AI touches your resume, ask for{' '}
      <span style={{background: C.mint, borderRadius: 12, padding: '0 10px', whiteSpace: 'nowrap'}}>3 lists.</span>
    </div>
    <Img src={staticFile('sage/s-finger.png')} style={{position: 'absolute', left: 1035 - (458 / 1121) * 640, top: 1318, height: 640}} />
  </AbsoluteFill>
);
