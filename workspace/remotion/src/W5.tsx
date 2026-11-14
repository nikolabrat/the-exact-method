// W-5 "Stop typing the same rules" — Sage walkthrough (W-6 system): ruled paper, one card per beat,
// word-highlight caption, Sage bottom-right. Frame 0 = last frame (the chat with the bullets back).
// remocn: RolodexFlip (Default -> Less), ScribbleCircle (the missed setting), InkArrow (rules -> chats),
// Squiggle (under ONCE), TrimBurst (New chat / Post), CrumpleToss (the slipped list).
import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {RolodexFlip} from '@/components/remocn/rolodex-flip';
import {ScribbleCircle} from '@/components/remocn/scribble-circle';
import {Squiggle} from '@/components/remocn/squiggle';
import {TrimBurst} from '@/components/remocn/trim-burst';
import {CrumpleToss} from '@/components/remocn/crumple-toss';
import {InkArrow} from '@/components/remocn/ink-arrow';
import TIG from './w5timing_ig.json';
import TTT from './w5timing_tt.json';

const C = {paper: '#E9E5DA', rule: '#D7D1C3', card: '#FCFBF7', ink: '#181714', mint: '#6BE0A0', gold: '#F2B632', red: '#D9534A', muted: '#7A7468', green: '#2F7A52', dark: '#10261C', line: '#DCD7CB', soft: '#F1EEE4'};
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
  const LINES = T.lines;
  const CHUNKS: Chunk[] = [];
  LINES.forEach((l) => {
    // split at punctuation, then into balanced chunks of at most 3 words (no orphans)
    const segs: Wd[][] = [];
    let cur: Wd[] = [];
    l.words.forEach((w, i) => {
      cur.push(w);
      if (/[.:?,]["”]?$/.test(w.w) || i === l.words.length - 1) {
        segs.push(cur);
        cur = [];
      }
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
  return {LINES, CHUNKS, L: LINES.map((l) => l.start), ws: (li: number, wi: number) => LINES[li].words[wi].s, TOTAL: T.total};
};
const Z = {ig: prep(TIG as any), tt: prep(TTT as any)};
type ZT = ReturnType<typeof prep>;
export const W5_TOTAL = {ig: Z.ig.TOTAL, tt: Z.tt.TOTAL};

const Fonts: React.FC = () => (
  <style>{`
@font-face{font-family:Archivo;src:url(${staticFile('archivo-variable.woff2')}) format('woff2');font-weight:100 900;font-stretch:62% 125%}
@font-face{font-family:Newsreader;src:url(${staticFile('newsreader-variable.woff2')}) format('woff2');font-weight:200 800;font-style:normal italic}
@font-face{font-family:Plex;src:url(${staticFile('plex-mono-500.woff2')}) format('woff2');font-weight:500}
`}</style>
);

// ---------- caption ----------
const ChunkView: React.FC<{f: number; ch: Chunk; o: number; loopIn: boolean}> = ({f, ch, o, loopIn}) => {
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
const Caption: React.FC<{f: number; z: ZT}> = ({f, z}) => {
  const seam = r(f, z.TOTAL - 10, z.TOTAL - 2, IO);
  const seamOut = r(f, z.TOTAL - 10, z.TOTAL - 6, IO), seamIn = r(f, z.TOTAL - 6, z.TOTAL - 2, IO);
  if (seam > 0) {
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
  const xo = ci === 0 ? 1 : r(f, from, from + 3, IO);
  const xi = ci === 0 ? 1 : r(f, from + 3, from + 8);
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
const Sage: React.FC<{f: number; z: ZT}> = ({f, z}) => {
  const {L, ws} = z;
  const POSES: [number, Pose][] = [
    [0, 's-sigh'], [L[1] - 2, 's-shrug'], [L[2] - 2, 's-finger'], [L[3] - 2, 's-present'], [L[4] - 2, 's-point'],
    [ws(4, 9) - 2, 's-check'], [L[6] - 2, 's-present'], [L[7] - 2, 's-finger'], [ws(7, 10) - 2, 's-think'],
    [L[8] - 2, 's-present'], [ws(8, 16) - 2, 's-point'], [L[9] - 2, 's-sigh'],
  ];
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

// ---------- building blocks ----------
const Card: React.FC<{f: number; inAt: number; outAt: number; children: React.ReactNode; title: string; tag?: React.ReactNode; first?: boolean; zoom?: number}> = ({f, inAt, outAt, children, title, tag, first, zoom = 1.25}) => {
  const i = first ? 1 : r(f, inAt, inAt + 12);
  const o = r(f, outAt, outAt + 10, IO);
  if ((f < inAt && !first) || o >= 1) return null;
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
const Stamp: React.FC<{text: string; p: number; color?: string; rot?: number; from?: number; size?: number}> = ({text, p, color = C.red, rot = -6, from = 1.6, size = 38}) => (
  <span style={{display: 'inline-block', fontFamily: 'Archivo', fontWeight: 900, fontSize: size, letterSpacing: 1, color, border: `4px solid ${color}`, borderRadius: 12, background: C.card,
    padding: '4px 18px', whiteSpace: 'nowrap', transform: `rotate(${rot}deg) scale(${lerp(from, 1, p)})`, opacity: Math.min(1, p * 3)}}>{text}</span>
);
const Tick: React.FC<{d: number; s?: number; kind?: 'tick' | 'cross'}> = ({d, s = 36, kind = 'tick'}) => (
  <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke={C.ink} strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
    {kind === 'tick' ? <path d="M5 12.5l4.5 4.5L19 7" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - d} /> : (
      <><path d="M6 6l12 12" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.min(1, d * 2)} /><path d="M18 6L6 18" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.max(0, d * 2 - 1)} /></>
    )}
  </svg>
);
const RuleChip: React.FC<{p?: number; small?: boolean}> = ({p = 1, small}) => (
  <span style={{display: 'inline-block', fontFamily: 'Plex', fontSize: small ? 26 : 30, background: C.mint, border: `3px solid ${C.ink}`, borderRadius: 999, padding: small ? '2px 14px' : '6px 18px',
    opacity: Math.min(1, p * 2), transform: `scale(${0.8 + 0.2 * p})`, whiteSpace: 'nowrap'}}>no bullet points</span>
);
// a path of menu steps that light up one by one
const PathSteps: React.FC<{f: number; steps: string[]; at: number[]; inAt: number}> = ({f, steps, at, inAt}) => (
  <div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
    {steps.map((s, i) => {
      const show = r(f, inAt + i * 4, inAt + 12 + i * 4);
      const on = r(f, at[i] - 2, at[i] + 8);
      return (
        <div key={s} style={{display: 'flex', alignItems: 'center', gap: 18, opacity: show, transform: `translateX(${(1 - show) * 30}px)`}}>
          <span style={{width: 56, height: 56, flex: 'none', borderRadius: 99, border: `3px solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Archivo', fontWeight: 900, fontSize: 30, background: mix(C.card, C.mint, on)}}>{i + 1}</span>
          <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 46, padding: '8px 20px', borderRadius: 16, border: `3px solid ${mix(C.line, C.ink, on)}`,
            background: `rgba(227,246,234,${on})`, color: mix(C.muted, C.ink, on * 1.5), transform: `scale(${1 + 0.03 * Math.sin(Math.min(1, on) * Math.PI)})`}}>{s}</span>
        </div>
      );
    })}
  </div>
);

// ---------- card A: the chat (frame 0 = bullets back) ----------
const BULLETS = ['Subject line ideas', 'Key benefits', 'Call to action'];
const ChatCard: React.FC<{f: number; z: ZT; loop?: number}> = ({f, z, loop}) => {
  const {ws} = z;
  const isLoop = loop !== undefined;
  const lp = loop ?? 0;
  const p1 = isLoop ? 0 : r(f, ws(0, 1) - 2, ws(0, 1) + 8) * (1 - r(f, ws(0, 6) - 2, ws(0, 6) + 6)); // focus on chat 1
  const wipe = isLoop ? 0 : r(f, ws(0, 6) - 3, ws(0, 6) + 3) * (1 - r(f, ws(0, 8) - 2, ws(0, 8)));
  const bullet = (i: number) => (isLoop ? r(f, lp + 8 + i * 4, lp + 18 + i * 4) : f < ws(0, 6) ? 1 : r(f, ws(0, 8) + i * 3, ws(0, 8) + 9 + i * 3));
  const stampP = isLoop ? r(f, lp + 26, lp + 33) : f < ws(0, 6) - 3 ? 1 : r(f, ws(0, 10), ws(0, 10) + 6);
  const newGlow = isLoop ? 0 : r(f, ws(0, 6) - 2, ws(0, 6) + 6) * (1 - r(f, ws(1, 0) - 10, ws(1, 0) - 4));
  const pane = (glow: number) => ({border: `3px solid ${mix(C.line, C.ink, glow)}`, borderRadius: 22, padding: '18px 22px', background: mix(C.card, C.soft, glow)});
  return (
    <>
      <div style={pane(p1)}>
        <Mono size={24}>Chat 1 · last week</Mono>
        <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 10}}>
          <span style={{background: C.ink, color: C.card, borderRadius: 22, padding: '12px 22px', fontFamily: 'Newsreader', fontSize: 40}}>No bullet points, please.</span>
        </div>
        <div style={{fontFamily: 'Newsreader', fontSize: 38, color: C.muted, marginTop: 8}}>Got it. Plain paragraphs from now on.</div>
      </div>
      <div style={{...pane(newGlow), marginTop: 22, position: 'relative', minHeight: 330}}>
        <div style={{display: 'flex', justifyContent: 'space-between'}}><Mono size={24}>New chat · today</Mono><Mono size={22}>example</Mono></div>
        <div style={{opacity: 1 - wipe}}>
          <div style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 40, marginTop: 8, opacity: Math.max(bullet(0), 0)}}>## Launch email</div>
          {BULLETS.map((b, i) => (
            <div key={b} style={{display: 'flex', gap: 14, fontFamily: 'Newsreader', fontSize: 40, marginTop: 6, opacity: bullet(i), transform: `translateX(${(1 - bullet(i)) * 40}px)`}}>
              <span style={{fontWeight: 800}}>•</span><span><b>{b.split(' ')[0]}</b> {b.split(' ').slice(1).join(' ')}</span>
            </div>
          ))}
        </div>
        <div style={{position: 'absolute', right: 26, bottom: 22}}><Stamp text="BACK AGAIN" p={stampP} /></div>
      </div>
    </>
  );
};

// ---------- the composition ----------
export const W5: React.FC<{platform: 'ig' | 'tt'}> = ({platform}) => {
  const f = useCurrentFrame();
  const z = Z[platform];
  const {L, ws} = z;
  const A_OUT = L[1] - 6;
  const B_IN = L[1] - 4, B_OUT = L[2] - 6;
  const C_IN = L[2] - 2, C_OUT = L[3] + 10;
  const D_IN = L[3] + 14, D_OUT = L[4] - 6;
  const E_IN = L[4] - 2, E_OUT = L[6] - 6;
  const F_IN = L[6] - 2, F_OUT = L[7] - 6;
  const G_IN = L[7] - 2, G_OUT = L[8] - 8;
  const I_IN = G_OUT + 8, I_OUT = L[9] - 6;
  const A2_IN = L[9] - 4;
  const KW = platform === 'ig' ? 17 : 18; // PLAIN in line 9
  const CTA0 = 16; // Comment / DM
  // remocn moments (absolute frames)
  const CIRCLE_AT = ws(4, 9) - 4;
  const ONCE_AT = ws(2, 9);
  const NEWCHAT_AT = ws(7, 2) + 2;
  const CRUMPLE_AT = ws(7, 16);
  const POST_AT = ws(8, KW) + 6;

  return (
    <AbsoluteFill style={{background: C.paper, backgroundImage: `repeating-linear-gradient(0deg, transparent 0 63px, ${C.rule} 63px 65px)`, overflow: 'hidden'}}>
      <Fonts />
      <Audio src={staticFile(`w5v/mix_${platform}.wav`)} />

      {f < A_OUT + 12 && (
        <Card f={f} inAt={0} outAt={A_OUT} first title="ChatGPT" tag={<Mono>new chat</Mono>} zoom={1.12}>
          <ChatCard f={f} z={z} />
        </Card>
      )}

      {/* B: a rule typed into one chat doesn't reliably carry over */}
      <Card f={f} inAt={B_IN} outAt={B_OUT} title="Where your rule lives" zoom={1.3}>
        {(() => {
          const chip = r(f, ws(1, 1) - 2, ws(1, 1) + 8);
          const carry = r(f, ws(1, 7) - 2, ws(1, 7) + 10);
          return ['Chat 1', 'Chat 2', 'Chat 3'].map((c, i) => {
            const show = r(f, B_IN + 4 + i * 3, B_IN + 14 + i * 3);
            const dim = i > 0 ? carry : 0;
            return (
              <div key={c} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: `3px solid ${i === 0 ? mix(C.line, C.ink, carry) : C.line}`, borderRadius: 22,
                padding: '22px 26px', marginBottom: 22, opacity: show * (1 - 0.5 * dim), transform: `translateY(${(1 - show) * 20}px)`, background: i === 0 ? mix(C.card, C.soft, carry) : C.card}}>
                <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 44}}>{c}</span>
                {i === 0 ? <RuleChip p={chip} /> : <span style={{fontFamily: 'Plex', fontSize: 30, color: C.muted, opacity: dim}}>may be missing</span>}
              </div>
            );
          });
        })()}
        {(() => {
          const t = r(f, ws(1, 8) - 2, ws(1, 8) + 8);
          return <div style={{marginTop: 10, opacity: t}}><Stamp text="NOT RELIABLE" p={t} color={C.ink} rot={-3} /></div>;
        })()}
      </Card>

      {/* C: once, in settings, with an ink arrow to every chat */}
      <Card f={f} inAt={C_IN} outAt={C_OUT} title="Settings" tag={<Mono>read by every chat</Mono>} zoom={1.32}>
        {(() => {
          const box = r(f, ws(2, 1) - 2, ws(2, 1) + 10);
          const chip = r(f, ws(2, 3) - 2, ws(2, 3) + 8);
          const once = r(f, ONCE_AT - 1, ONCE_AT + 6);
          return (
            <>
              <div style={{border: `3px solid ${C.ink}`, borderRadius: 22, padding: '20px 24px', background: C.soft, opacity: box, transform: `scale(${0.94 + 0.06 * box})`, transformOrigin: 'top left', width: 380}}>
                <Mono size={26}>Your rules</Mono>
                <div style={{marginTop: 10}}><RuleChip p={chip} /></div>
              </div>
              {f >= ws(2, 5) - 6 && (
                <div style={{position: 'absolute', left: 0, top: 0, width: 740, height: 520, pointerEvents: 'none'}}>
                  <Sequence from={ws(2, 5) - 6} layout="none">
                    <InkArrow from={{x: 120, y: 140}} to={{x: 236, y: 186}} curvature={-0.4} color={C.ink} strokeWidth={6} drawDur={10} headSize={18} seed="w5" />
                  </Sequence>
                </div>
              )}
              {['Chat 1', 'Chat 2', 'Chat 3'].map((c, i) => {
                const d = r(f, ws(2, 6) - 2 + i * 4, ws(2, 6) + 8 + i * 4);
                return (
                  <div key={c} style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 20, marginLeft: 260, opacity: 0.35 + 0.65 * d}}>
                    <span style={{width: 50, height: 50, borderRadius: 12, border: `3px solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', background: mix(C.card, C.mint, d)}}><Tick d={d} /></span>
                    <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 42}}>{c}</span>
                  </div>
                );
              })}
              <div style={{position: 'absolute', right: 0, top: 6}}><Stamp text="ONCE" p={once} color={C.green} rot={5} /></div>
            </>
          );
        })()}
      </Card>

      {/* D: ChatGPT path + paste */}
      <Card f={f} inAt={D_IN} outAt={D_OUT} title="In ChatGPT" tag={<Mono>checked Nov 2026</Mono>} zoom={1.22}>
        <PathSteps f={f} steps={['Your profile', 'Personalization', 'Custom instructions']} at={[ws(3, 3), ws(3, 4), ws(3, 5)]} inAt={D_IN + 2} />
        {(() => {
          const box = r(f, ws(3, 7) - 6, ws(3, 7) + 6);
          const pasted = r(f, ws(3, 7), ws(3, 7) + 10, IO);
          return (
            <div style={{marginTop: 30, border: `3px dashed ${mix(C.muted, C.ink, pasted)}`, borderRadius: 22, padding: '18px 22px', opacity: box, transform: `translateY(${(1 - box) * 20}px)`, minHeight: 170}}>
              <Mono size={26} color={mix(C.muted, C.ink, pasted)}>how it should respond</Mono>
              <div style={{marginTop: 10, fontFamily: 'Newsreader', fontSize: 38, lineHeight: 1.2, opacity: pasted, transform: `translateX(${(1 - pasted) * 120}px)`}}>
                Plain paragraphs only. No headings, bold, tables or lists.
              </div>
            </div>
          );
        })()}
      </Card>

      {/* E: the setting most people miss */}
      <Card f={f} inAt={E_IN} outAt={E_OUT} title="Characteristics" zoom={1.13}
        tag={<span style={{opacity: r(f, z.ws(4, 3) - 2, z.ws(4, 3) + 8)}}><Stamp text="MOST PEOPLE MISS THIS" p={r(f, z.ws(4, 3) - 2, z.ws(4, 3) + 8)} color={C.red} rot={2} from={1.2} size={28} /></span>}>
        {(() => {
          const focus = r(f, ws(4, 9) - 2, ws(4, 9) + 8);
          const warn = r(f, ws(5, 0) - 2, ws(5, 0) + 8);
          const fight = r(f, ws(5, 3) - 1, ws(5, 3) + 6);
          const flipAt = ws(4, 13) - 3;
          const rows = ['Warm', 'Enthusiastic', 'Headers & Lists', 'Emojis'];
          return (
            <>
              {rows.map((name, i) => {
                const hl = i === 2;
                const show = r(f, E_IN + 4 + i * 3, E_IN + 14 + i * 3);
                return (
                  <div key={name} style={{position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', marginBottom: 14, borderRadius: 20,
                    border: `3px solid ${hl ? mix(C.line, C.ink, focus) : C.line}`, background: hl ? mix(C.card, C.soft, focus) : C.card, opacity: show * (hl ? 1 : 1 - 0.5 * focus),
                    transform: `translateY(${(1 - show) * 16}px)`}}>
                    <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 42}}>{name}</span>
                    <span style={{fontFamily: 'Plex', fontSize: 32, border: `3px solid ${C.ink}`, borderRadius: 999, padding: '4px 20px', background: hl ? mix(C.card, C.mint, r(f, flipAt + 4, flipAt + 12)) : C.card, minWidth: 150, textAlign: 'center'}}>
                      {hl ? <Sequence from={flipAt} layout="none"><RolodexFlip items={['Default', 'Less']} interval={10000} flipDuration={9} /></Sequence> : 'Default'}
                      {hl && f < flipAt ? 'Default' : null}
                    </span>
                    {hl && f >= CIRCLE_AT && (
                      <div style={{position: 'absolute', left: 6, top: -16, pointerEvents: 'none'}}>
                        <Sequence from={CIRCLE_AT} layout="none">
                          <ScribbleCircle width={700} height={108} color={C.red} strokeWidth={7} durationSteps={8} seed="w5circle" />
                        </Sequence>
                      </div>
                    )}
                  </div>
                );
              })}
              <div style={{marginTop: 10, display: 'flex', alignItems: 'center', gap: 16, opacity: warn, transform: `translateY(${(1 - warn) * 16}px)`}}>
                <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 36, color: C.red, whiteSpace: 'nowrap'}}>On Default:</span>
                <Stamp text="FIGHTS YOUR RULES" p={fight} rot={-2} from={1.2} size={32} />
              </div>
            </>
          );
        })()}
      </Card>

      {/* F: Claude path */}
      <Card f={f} inAt={F_IN} outAt={F_OUT} title="In Claude" tag={<Mono>checked Nov 2026</Mono>} zoom={1.45}>
        <PathSteps f={f} steps={['Settings', 'Your Claude', 'Instructions']} at={[ws(6, 2), ws(6, 3), ws(6, 5)]} inAt={F_IN + 2} />
        {(() => {
          const c = r(f, ws(6, 5) + 4, ws(6, 5) + 14);
          return <div style={{marginTop: 40, display: 'flex', alignItems: 'center', gap: 14, opacity: c}}><Mono size={28}>paste the same rules</Mono><RuleChip p={c} small /></div>;
        })()}
      </Card>

      {/* G: new chat, and if it slips */}
      <Card f={f} inAt={G_IN} outAt={G_OUT} title="New chat" tag={<Mono>so they load</Mono>} zoom={1.25}>
        {(() => {
          const press = Math.max(0, 1 - Math.abs(f - NEWCHAT_AT) / 4);
          const btn = r(f, G_IN + 2, G_IN + 12);
          const lit = r(f, NEWCHAT_AT - 2, NEWCHAT_AT + 6);
          const list = r(f, ws(7, 10) - 4, ws(7, 10) + 6);
          const flag = r(f, ws(7, 13) - 2, ws(7, 13) + 6);
          const fix = r(f, CRUMPLE_AT + 8, CRUMPLE_AT + 18);
          const listBox = (
            <div style={{border: `3px solid ${C.line}`, boxShadow: `0 0 0 3px rgba(217,83,74,${flag})`, borderRadius: 22, padding: '16px 22px', background: C.card, width: 620}}>
              <Mono size={24}>reply</Mono>
              {['1. Plan your launch email', '2. Write the subject line'].map((t) => <div key={t} style={{fontFamily: 'Newsreader', fontSize: 40}}>{t}</div>)}
            </div>
          );
          return (
            <>
              <div style={{position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: `3px solid ${C.ink}`, borderRadius: 22, padding: '20px 26px',
                background: C.card, opacity: btn, transform: `scale(${1 - 0.04 * press})`}}>
                <span style={{position: 'absolute', inset: 0, background: C.mint, opacity: lit}} />
                <span style={{position: 'relative', fontFamily: 'Archivo', fontWeight: 900, fontSize: 46}}>+ New chat</span>
                <span style={{position: 'relative', opacity: lit}}><RuleChip small /></span>
              </div>
              <div style={{position: 'relative', marginTop: 40, height: 210, opacity: list, transform: `translateY(${(1 - list) * 20}px)`}}>
                {f < CRUMPLE_AT ? listBox : (
                  <Sequence from={CRUMPLE_AT} layout="none">
                    <CrumpleToss at={0} width={620} height={170} direction={1} distance={500} seed="w5list">{listBox}</CrumpleToss>
                  </Sequence>
                )}
                <div style={{position: 'absolute', right: 0, top: -24, opacity: flag * (1 - fix)}}><Stamp text="A LIST" p={flag} /></div>
              </div>
              <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: -150, opacity: fix, transform: `translateY(${(1 - fix) * 24}px)`}}>
                <div style={{background: C.ink, color: C.card, borderRadius: 26, padding: '18px 26px', maxWidth: 640}}>
                  <div style={{fontFamily: 'Newsreader', fontSize: 40}}>One reply fixes it.</div>
                  <Mono color={C.mint} size={24}>the exact reply · Plain Voice, section 04</Mono>
                </div>
              </div>
            </>
          );
        })()}
      </Card>

      {/* I: end card — Plain Voice + comment / DM */}
      {f >= I_IN && f < I_OUT + 12 && (() => {
        const i = r(f, I_IN, I_IN + 18, IO);
        const o = r(f, I_OUT, I_OUT + 10, IO);
        const tAt = [ws(8, 4), ws(8, 5), ws(8, 7)];
        const tool = (k: number) => r(f, tAt[k] - 2, tAt[k] + 8);
        const tested = r(f, ws(8, 1) - 2, ws(8, 1) + 8);
        const field = r(f, ws(8, CTA0) - 6, ws(8, CTA0) + 4);
        const word = r(f, ws(8, KW) - 2, ws(8, KW) + 4);
        const press = Math.max(0, 1 - Math.abs(f - POST_AT) / 4);
        const sent = r(f, POST_AT + 4, POST_AT + 12);
        return (
          <div style={{position: 'absolute', left: 70, right: 70, top: 290, height: 760, background: C.dark, borderRadius: 30, padding: '40px 42px', color: C.card,
            opacity: Math.min(1, i * 1.6) * (1 - o), transform: `translateY(${(1 - i) * 70 - o * 50}px)`}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <Mono color={C.mint}>The Exact Method</Mono>
              <span style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 34, background: C.mint, color: C.ink, borderRadius: 999, padding: '4px 22px'}}>Free PDF</span>
            </div>
            <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 92, lineHeight: 1, letterSpacing: -2, marginTop: 22}}>Plain Voice</div>
            <div style={{marginTop: 12, opacity: tested}}><Mono color={C.mint} size={28}>tested on real writing tasks</Mono></div>
            <div style={{display: 'flex', gap: 14, marginTop: 22}}>
              {['ChatGPT', 'Claude', 'Gemini'].map((t, k) => (
                <span key={t} style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 34, border: `3px solid ${C.mint}`, borderRadius: 16, padding: '8px 18px', opacity: 0.3 + 0.7 * tool(k),
                  background: `rgba(23,53,39,${tool(k)})`, transform: `translateY(${(1 - tool(k)) * 10}px)`}}>{t}</span>
              ))}
            </div>
            {(() => {
              const pv = r(f, ws(8, 13) - 4, ws(8, 13) + 8);
              return (
                <div style={{marginTop: 26, background: '#173527', border: `2px solid #2E5A43`, borderRadius: 18, padding: '16px 20px', opacity: pv, transform: `translateY(${(1 - pv) * 16}px)`}}>
                  <Mono color={C.mint} size={22}>ChatGPT prompt · first line · ready to paste</Mono>
                  <div style={{fontFamily: 'Plex', fontSize: 27, lineHeight: 1.35, marginTop: 8, color: C.card}}>FORMAT, the most important rule: write only plain paragraphs, like a message from a person.</div>
                </div>
              );
            })()}
            <div style={{position: 'absolute', left: 42, right: 42, bottom: 40, opacity: field, transform: `translateY(${(1 - field) * 20}px)`}}>
              <div style={{position: 'relative', display: 'flex', alignItems: 'center', gap: 16, background: C.card, color: C.ink, borderRadius: 999, padding: '14px 16px 14px 28px'}}>
                <span style={{position: 'relative', flex: 1, fontFamily: 'Archivo', fontWeight: 900, fontSize: 44, height: 56}}>
                  <span style={{position: 'absolute', left: 0, top: 6, fontWeight: 600, fontSize: 36, color: C.muted, opacity: 1 - word}}>{platform === 'ig' ? 'Add a comment…' : 'Message…'}</span>
                  <span style={{position: 'absolute', left: 0, top: 0, opacity: word, transform: `translateY(${(1 - word) * 12}px)`}}>PLAIN</span>
                </span>
                <span style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 32, background: C.mint, borderRadius: 999, padding: '10px 26px', transform: `scale(${1 - 0.06 * press})`}}>{platform === 'ig' ? 'Post' : 'Send'}</span>
              </div>
              <div style={{marginTop: 14, opacity: sent, transform: `translateY(${(1 - sent) * 10}px)`}}>
                <Mono color={C.mint} size={28}>{platform === 'ig' ? 'comment the word · I’ll DM you the PDF' : 'DM me the word · I’ll send you the PDF'}</Mono>
              </div>
            </div>
          </div>
        );
      })()}

      {/* full-frame remocn accents */}
      <Sequence from={ONCE_AT + 4} durationInFrames={Math.max(1, C_OUT - ONCE_AT - 4)} layout="none">
        <Squiggle shape="wave" x={0.66} y={0.276} length={100} amplitude={9} wavelength={34} weight={6} color={C.green} hold={40} erase={false} />
      </Sequence>
      {f >= I_IN && f < I_OUT && (
        <Sequence from={POST_AT} durationInFrames={30} layout="none">
          <TrimBurst x={0.824} y={0.477} count={8} innerRadius={50} reach={14} strokeLength={16} weight={4} color={C.mint} seed={9} />
        </Sequence>
      )}

      {/* A again: the loop rebuild, landing on frame 0 */}
      {f >= A2_IN && (
        <Card f={f} inAt={A2_IN} outAt={99999} title="ChatGPT" tag={<Mono>new chat</Mono>} zoom={1.12}>
          <ChatCard f={f} z={z} loop={A2_IN} />
        </Card>
      )}

      <Caption f={f} z={z} />
      <Sage f={f} z={z} />
    </AbsoluteFill>
  );
};

export const W5Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.paper, backgroundImage: `repeating-linear-gradient(0deg, transparent 0 63px, ${C.rule} 63px 65px)`, overflow: 'hidden'}}>
    <Fonts />
    <Card f={0} inAt={0} outAt={99999} first title="ChatGPT" tag={<Mono>new chat</Mono>} zoom={1.12}>
      <ChatCard f={0} z={Z.ig} />
    </Card>
    <div style={{position: 'absolute', left: 66, top: 1100, width: 660, fontFamily: 'Archivo', fontWeight: 900, fontSize: 76, lineHeight: 1.08, letterSpacing: -2, color: C.ink}}>
      Stop typing{' '}<span style={{background: C.mint, borderRadius: 12, padding: '0 10px', whiteSpace: 'nowrap'}}>the same rules.</span>
    </div>
    <Img src={staticFile('sage/s-sigh.png')} style={{position: 'absolute', left: 1035 - (424 / 1121) * 640, top: 1318, height: 640}} />
  </AbsoluteFill>
);
