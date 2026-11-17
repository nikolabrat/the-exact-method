// A-1 "Stop asking 'are you sure?'" — Offer Reel for The Exact Method, Sage walkthrough (W-5 system).
// Ruled paper, one card per beat, 2-3 word mint-highlight captions, Sage bottom-right. Frame 0 = last frame.
// remocn: ScribbleCircle, RolodexFlip, Squiggle, RollingNumber, CrumpleToss, TrimBurst, InkArrow,
// WhipPan (habit-to-habit cuts), Caret (question and keyword typed).
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {RolodexFlip} from '@/components/remocn/rolodex-flip';
import {ScribbleCircle} from '@/components/remocn/scribble-circle';
import {Squiggle} from '@/components/remocn/squiggle';
import {TrimBurst} from '@/components/remocn/trim-burst';
import {CrumpleToss} from '@/components/remocn/crumple-toss';
import {InkArrow} from '@/components/remocn/ink-arrow';
import {RollingNumber} from '@/components/remocn/rolling-number';
import {Caret} from '@/components/remocn/caret';
import {whipPan} from '@/components/remocn/whip-pan';
import TIG from './a1timing_ig.json';
import TTT from './a1timing_tt.json';
import MIG from './a1moments_ig.json';
import MTT from './a1moments_tt.json';

const C = {paper: '#E9E5DA', rule: '#D7D1C3', card: '#FCFBF7', ink: '#181714', mint: '#6BE0A0', gold: '#F2B632', red: '#D9534A', muted: '#7A7468', green: '#2F7A52', line: '#DCD7CB', soft: '#F1EEE4'};
const OUT = Easing.bezier(0.42, 0, 0.18, 1);
const IO = Easing.bezier(0.65, 0, 0.35, 1);
const r = (f: number, a: number, b: number, e = OUT) => interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const hx = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) => { const x = hx(a), y = hx(b), k = Math.max(0, Math.min(1, t)); return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * k)).join(',')})`; };

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
const Z = {ig: prep(TIG as any), tt: prep(TTT as any)};
type ZT = ReturnType<typeof prep>;
type MT = typeof MIG;
const MM = {ig: MIG as MT, tt: MTT as MT};
export const A1_TOTAL = {ig: Z.ig.TOTAL, tt: Z.tt.TOTAL};

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
    const first = i === 0 ? 1 : r(f, s0 - 1, s0 + 2);
    return (i === 0 && f < s0 ? 1 : first) * (1 - r(f, next - 1, next + 2));
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
  const xo = ci === 0 ? 1 : r(f, from - 1, from + 4, IO);
  const xi = ci === 0 ? 1 : r(f, from + 2, from + 9);
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
    [0, 's-sigh'], [m.reply1 - 2, 's-shrug'], [L[1] - 2, 's-finger'], [L[2] - 2, 's-present'], [L[3] - 2, 's-shrug'], [L[4] - 2, 's-point'],
    [L[5] - 2, 's-check'], [L[6] - 2, 's-finger'], [L[7] - 2, 's-think'], [L[8] - 2, 's-check'], [L[9] - 2, 's-present'], [L[10] - 2, 's-point'],
    [L[11] - 2, 's-sigh'], [L[12] - 2, 's-present'], [L[13] - 2, 's-point'], [L[14] - 2, 's-shrug'], [L[15] - 2, 's-present'], [L[16] - 2, 's-point'], [L[17] - 2, 's-sigh'],
  ];
  const H = 640;
  let idx = 0;
  POSES.forEach(([t], i) => { if (f >= t) idx = i; });
  const [t0, p] = POSES[idx];
  const prev = idx > 0 ? POSES[idx - 1][1] : null;
  const x = r(f, t0, t0 + 6, IO);
  const img = (pose: Pose, o: number) => {
    const wpx = (SAGE_W[pose] / 1121) * H;
    return <Img key={pose + o} src={staticFile(`sage/${pose}.png`)} style={{position: 'absolute', left: 1035 - wpx, top: 1318, height: H, opacity: o}} />;
  };
  return (<>{prev && x < 1 && img(prev, 1 - x)}{img(p, prev ? x : 1)}</>);
};

// ---------- building blocks ----------
const WhipP = whipPan({direction: 'left', blur: 18}).component as React.FC<any>;
const Card: React.FC<{f: number; inAt: number; outAt: number; children: React.ReactNode; title: React.ReactNode; tag?: React.ReactNode; first?: boolean; whipIn?: boolean; whipOut?: boolean; zoom?: number}> = ({f, inAt, outAt, children, title, tag, first, whipIn, whipOut, zoom = 1}) => {
  if ((f < inAt && !first) || f >= outAt + 11) return null;
  const pin = first ? 1 : r(f, inAt, inAt + (whipIn ? 10 : 12), whipIn ? (t: number) => t : OUT);
  const pout = r(f, outAt, outAt + 10, whipOut ? (t: number) => t : IO);
  const exiting = f >= outAt;
  const plainIn = !whipIn && !exiting, plainOut = !whipOut && exiting;
  const body = (
    <div style={{position: 'absolute', left: 70, right: 70, top: 290, height: 760, background: C.card, border: `4px solid ${C.ink}`, borderRadius: 30, padding: '30px 38px', overflow: 'hidden',
      opacity: plainIn ? Math.min(1, pin * 1.6) : plainOut ? 1 - pout : 1,
      transform: plainIn ? `translateY(${(1 - pin) * 70}px)` : plainOut ? `translateY(${-pout * 50}px) scale(${1 - pout * 0.02})` : undefined}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 18, borderBottom: `3px solid ${C.line}`, minHeight: 72}}>
        <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 50, letterSpacing: -1}}>{title}</span>
        {tag}
      </div>
      <div style={{position: 'relative', marginTop: 26, height: 600 / zoom, width: `${100 / zoom}%`, transform: `scale(${zoom})`, transformOrigin: 'top left'}}>{children}</div>
    </div>
  );
  if (exiting && whipOut) return <WhipP presentationDirection="exiting" presentationProgress={pout} passedProps={{direction: 'left', blur: 18}}>{body}</WhipP>;
  if (!exiting && whipIn && pin < 1) return <WhipP presentationDirection="entering" presentationProgress={pin} passedProps={{direction: 'left', blur: 18}}>{body}</WhipP>;
  return body;
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

// ---------- card A: the hook chat (also the loop end, equal to frame 0) ----------
const HookChat: React.FC<{f: number; m: MT; loop?: number}> = ({f, m, loop}) => {
  const isLoop = loop !== undefined;
  const rep1 = isLoop ? 0 : r(f, m.reply1, m.reply1 + 8);
  const rep2 = isLoop ? 0 : r(f, m.reply2, m.reply2 + 8);
  return (
    <>
      <Bubble me text="Which side hustle should I start?" size={36} />
      <div style={{fontFamily: 'Newsreader', fontSize: 38, color: C.muted, marginTop: 14}}>Freelance video editing. It fits your skills.</div>
      <div style={{position: 'relative', display: 'flex', justifyContent: 'flex-end', marginTop: 22}}>
        <span style={{position: 'relative', background: C.ink, color: C.card, borderRadius: 24, padding: '14px 28px', fontFamily: 'Archivo', fontWeight: 800, fontSize: 52}}>
          Are you sure?
          {!isLoop && f >= m.circle && (
            <span style={{position: 'absolute', left: -40, top: -26}}>
              <Sequence from={m.circle} layout="none"><ScribbleCircle width={430} height={140} color={C.red} strokeWidth={7} durationSteps={8} seed="a1hook" /></Sequence>
            </span>
          )}
        </span>
      </div>
      <div style={{position: 'relative', marginTop: 26}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: rep1, transform: `translateY(${(1 - rep1) * 18}px)`}}>
          <span style={{fontFamily: 'Newsreader', fontSize: 40, color: C.ink}}>Yes, I'm sure. Video editing.</span>
          <span style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 46, background: C.gold, border: `4px solid ${C.ink}`, borderRadius: 14, padding: '0 12px', minWidth: 76, height: 60, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', opacity: rep2}}>
            {f >= m.reply2 ? <Sequence from={m.reply2} layout="none"><RolodexFlip items={['×1', '×2']} interval={4} flipDuration={8} /></Sequence> : '×1'}
          </span>
        </div>
        <div style={{fontFamily: 'Newsreader', fontSize: 40, color: C.ink, opacity: rep2 * 0.55, transform: `translate(${(1 - rep2) * -10 + 14}px, 8px)`}}>Yes, I'm sure. Video editing.</div>
      </div>
    </>
  );
};

// ---------- the composition ----------
export const A1: React.FC<{platform: 'ig' | 'tt'}> = ({platform}) => {
  const f = useCurrentFrame();
  const z = Z[platform];
  const m = MM[platform];
  const L = m.L;
  const A_OUT = m.B_in - 2;
  const NEXT = {B: m.C_in, C: m.D_in, D: m.E_in, E: m.F_in, F: m.G_in, G: m.G2_in, G2: m.H_in, H: m.I_in, I: m.A2_in};
  const KW = platform === 'ig' ? 'METHOD' : 'METHOD';

  return (
    <AbsoluteFill style={{background: C.paper, backgroundImage: `repeating-linear-gradient(0deg, transparent 0 63px, ${C.rule} 63px 65px)`, overflow: 'hidden'}}>
      <Fonts />
      <Audio src={staticFile(`a1v/final_${platform}.wav`)} />

      {/* A: the hook chat, on screen at frame 0 */}
      <Card f={f} inAt={0} outAt={A_OUT} first zoom={1.4} title="ChatGPT" tag={<Mono>example</Mono>}>
        <HookChat f={f} m={m} />
      </Card>

      {/* B: five habits, slot 5 is the real check */}
      <Card f={f} inAt={m.B_in} outAt={NEXT.B} whipOut title="5 habits" tag={<Mono>the real check is #5</Mono>}>
        <div style={{display: 'flex', gap: 22, marginTop: 60}}>
          {[1, 2, 3, 4, 5].map((n) => {
            const show = r(f, m.B_in + 4 + n * 2, m.B_in + 14 + n * 2);
            const on = n === 5 ? r(f, m.slot5, m.slot5 + 8) : r(f, (m as any)[`s${n}`], (m as any)[`s${n}`] + 6);
            return (
              <div key={n} style={{flex: 1, height: 320, borderRadius: 24, border: `4px solid ${mix(C.line, C.ink, on)}`, background: n === 5 ? mix(C.card, C.gold, on) : mix(C.card, C.mint, on),
                display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: show, transform: `translateY(${(1 - show) * 30}px)`}}>
                <span style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 120, color: mix(C.muted, C.ink, on)}}>{n}</span>
              </div>
            );
          })}
        </div>
        <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 40, opacity: r(f, m.slot5, m.slot5 + 8)}}>
          <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 56}}>the real check</span>
        </div>
        <div style={{position: 'absolute', left: 520, top: 470, width: 340, height: 60}}>
          {f >= m.slot5 + 4 && <Sequence from={m.slot5 + 4} layout="none"><Squiggle shape="wave" x={0.5} y={0.5} length={300} amplitude={9} wavelength={40} weight={7} color={C.green} hold={200} erase={false} /></Sequence>}
        </div>
      </Card>

      {/* C: habit 1, narrow the question */}
      <Card f={f} inAt={m.C_in} outAt={NEXT.C} whipIn whipOut title="Narrow the question" tag={<Badge f={f} n={1} at={m.C_in + 6} />}>
        {(() => {
          const chip = r(f, m.chipBiz, m.chipBiz + 8);
          const ans = r(f, m.answerAny, m.answerAny + 8);
          const box = (
            <div style={{width: 820}}>
              <div style={{display: 'inline-block', border: `4px solid ${C.ink}`, borderRadius: 18, padding: '18px 28px', background: C.soft, fontFamily: 'Plex', fontSize: 46, opacity: chip, transform: `translateY(${(1 - chip) * 16}px)`}}>Give me a business idea</div>
              <div style={{marginTop: 26, opacity: ans, transform: `translateY(${(1 - ans) * 16}px)`}}>
                <Mono size={26}>result</Mono>
                <div style={{fontFamily: 'Newsreader', fontSize: 60, color: C.muted}}>An idea that fits anyone.</div>
              </div>
            </div>
          );
          const dotsIn = (i: number) => r(f, m.dots + i * 0.6, m.dots + 8 + i * 0.6);
          const keep3 = [6, 12, 18];
          const fadeOut3 = r(f, m.limits + 4, m.fade3 + 4);
          const fadeOut1 = r(f, m.pick, m.pick + 10);
          const lim = r(f, m.limits, m.limits + 8);
          const ring = r(f, m.ring, m.ring + 10);
          return (
            <>
              <div style={{position: 'absolute', left: 0, top: 0}}>
                {f < m.crumple ? box : <Sequence from={m.crumple} layout="none"><CrumpleToss at={0} width={820} height={240} direction={1} distance={700} seed="a1biz">{box}</CrumpleToss></Sequence>}
              </div>
              {f >= m.dots - 2 && (
                <div style={{position: 'absolute', left: 0, top: 30, width: 864}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
                    <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 42, opacity: r(f, m.dots, m.dots + 8)}}>Shortlist</span>
                    <span style={{fontFamily: 'Plex', fontSize: 32, background: C.mint, border: `3px solid ${C.ink}`, borderRadius: 999, padding: '4px 18px', opacity: lim, transform: `translateY(${(1 - lim) * -40}px)`}}>10 h / week</span>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 22, marginTop: 34, width: 600}}>
                    {Array.from({length: 25}).map((_, i) => {
                      const gone = keep3.includes(i) ? (i === 12 ? 0 : fadeOut1) : fadeOut3;
                      return (
                        <div key={i} style={{position: 'relative', width: 70, height: 70}}>
                          <div style={{width: 70, height: 70, borderRadius: 99, border: `4px solid ${C.ink}`, background: i === 12 ? mix(C.card, C.mint, ring) : C.card,
                            opacity: dotsIn(i) * (1 - gone * 0.88), transform: `scale(${(0.6 + 0.4 * dotsIn(i)) * (i === 12 ? 1 + 0.15 * ring : 1)})`}} />
                          {i === 12 && f >= m.ring && (
                            <div style={{position: 'absolute', left: -95, top: -95, width: 260, height: 260}}>
                              <Sequence from={m.ring} layout="none"><TrimBurst x={0.5} y={0.5} count={8} innerRadius={58} reach={20} strokeLength={18} weight={5} color={C.green} seed={3} /></Sequence>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div style={{position: 'absolute', left: 640, top: 270, opacity: ring}}>
                    <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 44}}>← start here</span>
                  </div>
                </div>
              )}
            </>
          );
        })()}
      </Card>

      {/* D: habit 2, one action per step */}
      <Card f={f} inAt={m.D_in} outAt={NEXT.D} whipIn whipOut title="One action per step" tag={<Badge f={f} n={2} at={m.D_in + 6} />}>
        {(() => {
          const j1 = r(f, m.job1, m.job1 + 8), j2 = r(f, m.job2, m.job2 + 8);
          const g = r(f, m.guess, m.guess + 8);
          const sp = r(f, m.split, m.split + 12, IO);
          const chipS = (p: number, dim = 0): React.CSSProperties => ({display: 'inline-block', fontFamily: 'Archivo', fontWeight: 800, fontSize: 46, border: `4px solid ${C.ink}`, borderRadius: 18, padding: '18px 26px', background: C.soft,
            opacity: p * (1 - 0.6 * dim), transform: `translateY(${(1 - p) * 16}px)`, whiteSpace: 'nowrap'});
          const dim = g * (1 - sp);
          return (
            <div style={{position: 'relative', marginTop: 40}}>
              <div style={{display: 'flex', gap: lerp(0, 50, sp)}}>
                {[0, 1].map((i) => (
                  <div key={i} style={{position: 'relative', flex: 1, minWidth: 0, height: 340, borderRadius: 26, padding: '22px 26px',
                    border: `4px solid ${C.ink}`, borderLeftWidth: i === 1 ? lerp(0, 4, sp) : 4, borderRightWidth: i === 0 ? lerp(0, 4, sp) : 4,
                    borderTopRightRadius: i === 0 ? lerp(0, 26, sp) : 26, borderBottomRightRadius: i === 0 ? lerp(0, 26, sp) : 26,
                    borderTopLeftRadius: i === 1 ? lerp(0, 26, sp) : 26, borderBottomLeftRadius: i === 1 ? lerp(0, 26, sp) : 26, background: C.card, opacity: r(f, m.D_in + 6, m.D_in + 16)}}>
                    <span style={{opacity: i === 0 ? 1 : sp}}><Mono size={26}>{i === 0 ? 'Step 1' : 'Step 2'}</Mono></span>
                    <div style={{marginTop: 40, display: 'flex', alignItems: 'center', gap: 16}}>
                      <span style={{position: 'relative', display: 'inline-block'}}>
                        <span style={{position: 'absolute', inset: 0, border: `4px dashed ${C.line}`, borderRadius: 18, opacity: 1 - (i === 0 ? j1 : j2)}} />
                        <span style={chipS(i === 0 ? j1 : j2, i === 1 ? dim : 0)}>{i === 0 ? 'Research it' : 'Write it'}</span>
                      </span>
                      <Tick d={r(f, m.split + 8 + i * 5, m.split + 16 + i * 5)} s={48} color={C.green} />
                    </div>
                    {i === 1 && <span style={{position: 'absolute', right: 30, top: 18, fontFamily: 'Archivo', fontWeight: 900, fontSize: 64, color: C.red, opacity: dim}}>?</span>}
                    {i === 1 && f >= m.guess && f < m.split + 6 && (
                      <span style={{position: 'absolute', left: 4, top: 70, opacity: 1 - sp}}>
                        <Sequence from={m.guess} layout="none"><ScribbleCircle width={330} height={150} color={C.red} strokeWidth={6} durationSteps={8} seed="a1guess" /></Sequence>
                      </span>
                    )}
                  </div>
                ))}
              </div>
              {f >= m.split && (
                <div style={{position: 'absolute', left: 300, top: 40, width: 260, height: 220}}>
                  <Sequence from={m.split} layout="none"><TrimBurst x={0.5} y={0.5} count={8} innerRadius={40} reach={18} strokeLength={16} weight={5} color={C.ink} seed={5} /></Sequence>
                </div>
              )}
              <div style={{marginTop: 40, opacity: sp}}><Stamp text="ONE JOB EACH" p={sp} color={C.green} rot={-3} /></div>
            </div>
          );
        })()}
      </Card>

      {/* E: habit 3, pick the tool, not the open tab */}
      <Card f={f} inAt={m.E_in} outAt={NEXT.E} whipIn whipOut zoom={1.2} title="Pick the tool" tag={<Badge f={f} n={3} at={m.E_in + 6} />}>
        {(() => {
          const tab = r(f, m.tab, m.tab + 8);
          const cur = r(f, m.tab + 6, m.click - 2, IO);
          const hit = r(f, m.click, m.click + 6);
          const tools = ['ChatGPT', 'Claude', 'Gemini'];
          const sx = 120, sy = 70, ex = 560, ey = 352;
          return (
            <>
              <div style={{display: 'flex', alignItems: 'flex-end', gap: 6, borderBottom: `3px solid ${C.line}`, opacity: r(f, m.E_in + 6, m.E_in + 14)}}>
                <span style={{position: 'relative', fontFamily: 'Plex', fontSize: 30, padding: '12px 22px', border: `3px solid ${mix(C.ink, C.red, tab)}`, borderBottom: 'none', borderRadius: '16px 16px 0 0', background: C.soft}}>
                  ChatGPT · open tab
                  <span style={{position: 'absolute', left: 14, right: 14, top: '50%', height: 5, background: C.red, transform: `scaleX(${tab})`, transformOrigin: 'left'}} />
                </span>
              </div>
              <div style={{marginTop: 50, display: 'flex', flexDirection: 'column', gap: 24}}>
                {tools.map((t, i) => {
                  const p = r(f, m.chips + i * 4, m.chips + 10 + i * 4);
                  const sel = i === 1 ? hit : 0;
                  return (
                    <div key={t} style={{position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: 620, border: `4px solid ${C.ink}`, borderRadius: 22, padding: '18px 26px',
                      background: mix(C.card, C.mint, sel), opacity: p, transform: `translateX(${(1 - p) * 30}px)`}}>
                      <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 48}}>{t}</span>
                      {i === 1 && <span style={{opacity: sel}}><Mono size={26} color={C.ink}>for this job</Mono></span>}
                    </div>
                  );
                })}
              </div>
              {f >= m.click && (
                <div style={{position: 'absolute', left: ex - 130, top: ey - 130, width: 260, height: 260}}>
                  <Sequence from={m.click} layout="none"><TrimBurst x={0.5} y={0.5} count={8} innerRadius={44} reach={18} strokeLength={16} weight={5} color={C.green} seed={7} /></Sequence>
                </div>
              )}
              <svg width={44} height={56} viewBox="0 0 22 28" style={{position: 'absolute', left: lerp(sx, ex, cur), top: lerp(sy, ey, cur), opacity: r(f, m.tab + 2, m.tab + 8), transform: `scale(${1 - 0.12 * Math.sin(Math.PI * r(f, m.click - 2, m.click + 4))})`}}>
                <path d="M2 2l0 21 6-5 4 9 4-2-4-9 8 0z" fill={C.card} stroke={C.ink} strokeWidth={2.2} strokeLinejoin="round" />
              </svg>
            </>
          );
        })()}
      </Card>

      {/* F: habit 4, chain them */}
      <Card f={f} inAt={m.F_in} outAt={NEXT.F} whipIn whipOut zoom={1.15} title="Chain them" tag={<Badge f={f} n={4} at={m.F_in + 6} />}>
        {(() => {
          const a = r(f, m.toolA, m.toolA + 8), b = r(f, m.toolB, m.toolB + 8);
          const ghost = (p: number): React.CSSProperties => ({position: 'absolute', width: 440, height: 130, border: `4px dashed ${C.line}`, borderRadius: 24, opacity: (1 - p) * r(f, m.F_in + 6, m.F_in + 14)});
          const box = (p: number): React.CSSProperties => ({position: 'absolute', width: 440, border: `4px solid ${C.ink}`, borderRadius: 24, padding: '22px 28px', background: C.card, opacity: p, transform: `translateY(${(1 - p) * 18}px)`});
          return (
            <>
              <div style={{...ghost(a), left: 0, top: 10}} /><div style={{...ghost(b), left: 300, top: 360}} />
              <div style={{...box(a), left: 0, top: 10}}>
                <Mono size={26}>Tool A</Mono>
                <div style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 46, marginTop: 6}}>does the work</div>
              </div>
              <div style={{position: 'absolute', left: 0, top: 0, width: 864, height: 600}}>
                {f >= m.arrow && <Sequence from={m.arrow} layout="none"><InkArrow from={{x: 260, y: 190}} to={{x: 380, y: 340}} curvature={-0.35} color={C.ink} strokeWidth={7} drawDur={10} headSize={22} seed="a1chain" /></Sequence>}
              </div>
              <div style={{...box(b), left: 300, top: 360, background: mix(C.card, '#E3F6EA', r(f, m.tickB, m.tickB + 8))}}>
                <Mono size={26}>Tool B</Mono>
                <div style={{display: 'flex', alignItems: 'center', gap: 12, marginTop: 6}}>
                  <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 46}}>checks it</span>
                  <Tick d={r(f, m.tickB, m.tickB + 8)} s={52} color={C.green} />
                </div>
              </div>
            </>
          );
        })()}
      </Card>

      {/* G: habit 5, "are you sure?" is not a check */}
      <Card f={f} inAt={m.G_in} outAt={NEXT.G} whipIn zoom={1.35} title="Check it" tag={<Badge f={f} n={5} at={m.G_in + 6} gold />}>
        {(() => {
          const s = r(f, m.struck, m.struck + 8);
          const st = r(f, m.notcheck, m.notcheck + 6);
          return (
            <div style={{marginTop: 20}}>
              <Mono size={26}>ChatGPT</Mono>
              <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 10}}>
                <span style={{position: 'relative', background: C.ink, color: C.card, borderRadius: 24, padding: '14px 28px', fontFamily: 'Archivo', fontWeight: 800, fontSize: 56, opacity: r(f, m.G_in + 6, m.G_in + 14)}}>
                  Are you sure?
                  <span style={{position: 'absolute', left: 16, right: 16, top: '52%', height: 7, borderRadius: 4, background: C.red, transform: `scaleX(${s})`, transformOrigin: 'left'}} />
                </span>
              </div>
              <div style={{marginTop: 60, display: 'flex', justifyContent: 'center'}}><Stamp text="NOT A CHECK" p={st} size={56} /></div>
              <div style={{marginTop: 40, textAlign: 'center', opacity: st}}><Mono size={30} color={C.ink}>it agrees with itself</Mono></div>
            </div>
          );
        })()}
      </Card>

      {/* G2: same question, a different tool (remocn ClaudeChat) */}
      <Card f={f} inAt={m.G2_in} outAt={NEXT.G2} title="Ask another tool" tag={
        <span style={{display: 'flex', gap: 10}}>
          <span style={{fontFamily: 'Plex', fontSize: 28, border: `3px solid ${C.ink}`, borderRadius: 999, padding: '2px 16px', background: C.mint}}>Claude</span>
          <span style={{fontFamily: 'Plex', fontSize: 28, border: `3px solid ${C.ink}`, borderRadius: 999, padding: '2px 16px', background: C.soft, opacity: r(f, m.gemini, m.gemini + 8)}}>Gemini</span>
        </span>}>
        {(() => {
          const Q = 'Which side hustle should I start?';
          const t0 = m.G2_in + 8;
          const n = Math.max(0, Math.min(Q.length, Math.floor((f - t0) * 1.6)));
          const sent = r(f, t0 + Q.length / 1.6 + 4, t0 + Q.length / 1.6 + 12);
          const box = r(f, m.G2_in + 2, m.G2_in + 12);
          return (
            <div style={{marginTop: 30, opacity: box, transform: `translateY(${(1 - box) * 20}px)`}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
                <svg width={44} height={44} viewBox="0 0 24 24"><g stroke="#D97757" strokeWidth={2.6} strokeLinecap="round">{[0, 30, 60, 90, 120, 150].map((d) => <line key={d} x1={12} y1={3} x2={12} y2={21} transform={`rotate(${d} 12 12)`} />)}</g></svg>
                <span style={{fontFamily: 'Newsreader', fontSize: 44, color: C.ink}}>Claude</span>
              </div>
              <div style={{marginTop: 26, border: `4px solid ${C.ink}`, borderRadius: 26, padding: '26px 30px', background: mix(C.card, C.soft, sent), minHeight: 170}}>
                <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 52, lineHeight: 1.15}}>{Q.slice(0, n)}</span>
                {sent < 1 && f >= t0 - 4 && <Caret color={C.ink} width={5} height={52} blink={n === 0 || n === Q.length} marginLeft={4} />}
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 18}}>
                <span style={{width: 70, height: 70, borderRadius: 18, background: mix(C.line, '#D97757', sent), display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.card, fontFamily: 'Archivo', fontWeight: 900, fontSize: 40}}>↑</span>
              </div>
            </div>
          );
        })()}
        <div style={{position: 'absolute', left: 0, bottom: 20, opacity: r(f, m.G2_in + 30, m.G2_in + 40)}}><Mono size={28} color={C.ink}>the exact same question</Mono></div>
      </Card>

      {/* H: a named source; sounding sure doesn't count */}
      <Card f={f} inAt={m.H_in} outAt={NEXT.H} zoom={1.2} title="Check a named source">
        {(() => {
          const src = r(f, m.H_in + 6, m.H_in + 16);
          const hl = r(f, m.source, m.source + 10);
          const st = r(f, m.stampSure, m.stampSure + 6);
          return (
            <>
              <div style={{border: `4px solid ${C.ink}`, borderRadius: 24, overflow: 'hidden', opacity: src, transform: `translateY(${(1 - src) * 18}px)`, marginTop: 20}}>
                <div style={{background: C.soft, borderBottom: `3px solid ${C.line}`, padding: '12px 22px', display: 'flex', gap: 10, alignItems: 'center'}}>
                  {[0, 1, 2].map((i) => <span key={i} style={{width: 16, height: 16, borderRadius: 99, border: `2px solid ${C.ink}`}} />)}
                  <span style={{marginLeft: 14}}><Mono size={26}>official page · with a link</Mono></span>
                </div>
                <div style={{padding: '26px 28px'}}>
                  <span style={{position: 'relative', fontFamily: 'Archivo', fontWeight: 900, fontSize: 60}}>
                    <span style={{position: 'absolute', left: -8, right: -8, top: 8, bottom: 4, background: C.mint, borderRadius: 10, transform: `scaleX(${hl})`, transformOrigin: 'left'}} />
                    <span style={{position: 'relative'}}>Named source</span>
                  </span>
                  <div style={{marginTop: 18}}><Mono size={30} color={C.ink}>who said it, and where</Mono></div>
                </div>
              </div>
              <div style={{marginTop: 70, display: 'flex', justifyContent: 'center'}}><Stamp text="SOUNDS SURE ≠ CHECKED" p={st} size={44} rot={-4} /></div>
            </>
          );
        })()}
      </Card>

      {/* I + J: the product, then the keyword CTA */}
      <Card f={f} inAt={m.I_in} outAt={NEXT.I} zoom={1.15} title={<span style={{fontFamily: 'Newsreader', fontStyle: 'italic', fontWeight: 600, fontSize: 56}}>The Exact Method</span>} tag={<Mono>76 pages · 8 chapters</Mono>}>
        {(() => {
          const cov = r(f, m.I_in + 6, m.I_in + 18);
          const habits = ['Narrow the question', 'One action per step', 'Pick the right tool', 'Chain tools', 'Verify the answer'];
          const cta = r(f, m.J_in, m.J_in + 10);
          const typed = Math.max(0, Math.min(KW.length, Math.floor((f - m.kw) / 2)));
          const posted = r(f, m.post, m.post + 6);
          return (
            <>
              <div style={{display: 'flex', gap: 34}}>
                <div style={{opacity: cov, transform: `translateY(${(1 - cov) * 30}px)`}}>
                  <Img src={staticFile('cover-exact.webp')} style={{width: 260, borderRadius: 12, border: `4px solid ${C.ink}`}} />
                  <div style={{marginTop: 10, textAlign: 'center'}}><Mono size={26} color={C.ink}>$127 · link in bio</Mono></div>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 8}}>
                  {habits.map((h, i) => {
                    const p = r(f, m.habits + i * 3, m.habits + 9 + i * 3);
                    const one = i === 0 ? r(f, m.J_in + 4, m.J_in + 12) : 0;
                    const dimRest = i === 0 ? 0 : r(f, m.J_in + 4, m.J_in + 12) * 0.55;
                    return (
                      <div key={h} style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 12, opacity: p * (1 - dimRest), transform: `translateX(${(1 - p) * 24}px)`}}>
                        <span style={{position: 'absolute', left: -10, right: -14, top: -6, bottom: -6, borderRadius: 12, background: C.mint, opacity: one}} />
                        <span style={{position: 'relative', display: 'flex'}}><Tick d={p} s={40} color={C.green} /></span>
                        <span style={{position: 'relative', fontFamily: 'Archivo', fontWeight: 800, fontSize: 36}}>{h}</span>
                        {i === 0 && <span style={{position: 'absolute', left: 300, top: -46}}><Stamp text="FREE" p={r(f, m.kw, m.kw + 6)} size={34} color={C.green} rot={-8} /></span>}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{position: 'absolute', left: 0, right: 0, top: 410, display: 'flex', alignItems: 'center', gap: 16, opacity: cta, transform: `translateY(${(1 - cta) * 24}px)`}}>
                <span style={{width: 64, height: 64, borderRadius: 99, background: C.soft, border: `3px solid ${C.ink}`, flex: 'none'}} />
                <div style={{flex: 1, display: 'flex', alignItems: 'center', border: `4px solid ${C.ink}`, borderRadius: 999, padding: '14px 26px', background: C.card, height: 84}}>
                  {typed === 0 ? <Mono size={32}>{platform === 'ig' ? 'Add a comment…' : 'Message…'}</Mono> : (
                    <span style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 44, letterSpacing: 2}}>{KW.slice(0, typed)}</span>
                  )}
                  {f >= m.kw - 6 && posted < 1 && <Caret color={C.ink} width={4} height={44} blink={typed === 0} marginLeft={4} />}
                </div>
                <span style={{position: 'relative', fontFamily: 'Archivo', fontWeight: 900, fontSize: 38, padding: '16px 26px', borderRadius: 999, border: `4px solid ${C.ink}`, background: mix(C.card, C.mint, posted)}}>
                  {platform === 'ig' ? 'Post' : 'Send'}
                  {f >= m.post && (
                    <span style={{position: 'absolute', left: -70, top: -70, right: -70, bottom: -70}}>
                      <Sequence from={m.post} layout="none"><TrimBurst x={0.5} y={0.5} count={8} innerRadius={70} reach={18} strokeLength={16} weight={5} color={C.green} seed={11} /></Sequence>
                    </span>
                  )}
                </span>
              </div>
            </>
          );
        })()}
      </Card>

      {/* A again: the loop rebuild, landing on frame 0 */}
      {f >= m.A2_in && (
        <Card f={f} inAt={m.A2_in} outAt={99999} zoom={1.4} title="ChatGPT" tag={<Mono>example</Mono>}>
          <HookChat f={f} m={m} loop={m.A2_in} />
        </Card>
      )}

      <Caption f={f} z={z} />
      <Sage f={f} m={m} />
    </AbsoluteFill>
  );
};

export const A1Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.paper, backgroundImage: `repeating-linear-gradient(0deg, transparent 0 63px, ${C.rule} 63px 65px)`, alignItems: 'center', justifyContent: 'center'}}>
    <Fonts />
    <div style={{position: 'absolute', left: 70, right: 70, top: 380, background: C.card, border: `4px solid ${C.ink}`, borderRadius: 30, padding: '50px 46px'}}>
      <Mono size={30}>ChatGPT</Mono>
      <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 20}}>
        <span style={{position: 'relative', background: C.ink, color: C.card, borderRadius: 26, padding: '18px 34px', fontFamily: 'Archivo', fontWeight: 800, fontSize: 76}}>
          Are you sure?
          <span style={{position: 'absolute', left: 20, right: 20, top: '52%', height: 9, borderRadius: 5, background: C.red}} />
        </span>
      </div>
      <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 96, lineHeight: 1.02, letterSpacing: -2, marginTop: 60}}>Stop asking.<br />It's not a check.</div>
    </div>
  </AbsoluteFill>
);
