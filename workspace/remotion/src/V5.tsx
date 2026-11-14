// V-5 "13 habits" — built from the pile-up → one reference (PileUp2 / PileUp-reference.mp4).
// Same sections, motions and pace as the reference; timing comes from the voice (forced alignment).
// remocn detail: RolodexFlip ("Another X." swap). RollingNumber was tried and dropped: its digit columns showed neighbours mid-roll.
// Loop: the last ~1.5 s closes an ink iris back onto the hook pill, so the final frame equals frame 0.
import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {RolodexFlip} from '@/components/remocn/rolodex-flip';

const C = {ink: '#10261C', ink2: '#173528', line: '#2C4A3B', paper: '#F4F1E8', mint: '#6BE0A0', green: '#2F7A52', red: '#E0533F', amber: '#F2B632', muted: '#8FA79A'};
const OUT = Easing.bezier(0.22, 1, 0.36, 1);
const IN = Easing.bezier(0.55, 0, 0.9, 0.3);
const IO = Easing.bezier(0.65, 0, 0.35, 1);
const r = (f: number, a: number, b: number, e = OUT) =>
  interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rand = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const s = (sec: number) => Math.round(sec * 30);

export type V5Props = {platform: 'ig' | 'tt'};

// Word times (s) from forced alignment of the voice mix.
export const V5T = {
  hook13: s(1.56),
  pillUp: s(1.4),
  s3: 2,
  shadows: s(4.58), box: s(5.68), glows: s(6.52), glowDemo: s(6.95), text: s(7.46), pops: s(8.02),
  smashEnd: s(8.95),
  bans: s(9.96), col: s(10.15), colEnd: s(10.95),
  s5: s(10.95), fill: s(11.2), answer: s(11.3), pill: s(11.7), s5End: s(13.2),
  iris: s(13.2), irisEnd: s(13.8),
  s7: s(13.6), render: s(15.16), every0: s(16.4), c30: s(17.62), flashes: s(19.32), s7End: s(20.2),
  s8: s(20.2), headline: s(22.22), every: s(24.42), s8End: s(26.85),
  s9: s(26.6), s10: s(27.1), video: s(27.44), guide: s(28.42), click: s(28.7),
  back: s(30.1), backEnd: s(30.9),
  total: s(32.3),
};

// Fixed, non-overlapping slots (x, y of the chip centre): 6 above the counter, 7 below it, all inside the frame.
const SLOTS: [number, number][] = [[300, 330], [1080 - 310, 1210], [785, 380], [290, 1290], [540, 460], [790, 1370], [285, 545],
  [520, 1460], [800, 580], [300, 1550], [520, 650], [780, 1630], [330, 1710]];
const TAGS = ['box-shadow: 0 8px 24px', 'glow · 40px', 'vignette · 0.6', 'card grid · 3×2', 'static slide · 4 s', 'text at the top',
  'pop-in · 1 frame', 'glitch · 6 frames', 'ease: linear', 'overshoot: 1.3', 'filter: sepia(0.3)', 'tweet card', 'CTA × 2'];

const Fonts: React.FC = () => (
  <style>{`
@font-face{font-family:Archivo;src:url(${staticFile('archivo-variable.woff2')}) format('woff2');font-weight:100 900;font-stretch:62% 125%}
@font-face{font-family:Plex;src:url(${staticFile('plex-mono-500.woff2')}) format('woff2');font-weight:500}
`}</style>
);

const Rise: React.FC<{p: number; children: React.ReactNode; style?: React.CSSProperties}> = ({p, children, style}) => (
  <div style={{overflow: 'hidden', paddingBottom: '0.1em', ...style}}>
    <div style={{transform: `translateY(${(1 - p) * 110}%)`}}>{children}</div>
  </div>
);

const Mark: React.FC<{size: number; color: string; ring?: number; line?: number; spin?: number; lineIn?: number}> = ({size, color, ring = 1, line = 1, spin = 0, lineIn = 0}) => (
  <svg viewBox="0 0 1024 1024" width={size} height={size} fill="none" stroke={color} strokeWidth={size < 200 ? 26 : 10} style={{transform: `rotate(${spin}deg)`}}>
    {[123, 194, 265].map((rr, i) => (
      <circle key={rr} cx={512} cy={512} r={rr} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.min(1, Math.max(0, ring * 1.4 - i * 0.2))} transform="rotate(-90 512 512)" />
    ))}
    {[[0, -1], [0, 1], [-1, 0], [1, 0]].map(([dx, dy], i) => {
      const off = lineIn * 260;
      return <path key={i} d={`M${512 + dx * 52} ${512 + dy * 52}L${512 + dx * 313} ${512 + dy * 313}`} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - line} transform={`translate(${dx * off} ${dy * off})`} />;
    })}
    <circle cx={512} cy={512} r={22} fill={color} stroke="none" />
  </svg>
);

const Tag: React.FC<{text: string; dot: string; scale?: number}> = ({text, dot, scale = 1}) => (
  <div style={{display: 'inline-flex', alignItems: 'center', gap: 12 * scale, background: C.ink2, border: `2px solid ${C.line}`, borderRadius: 12 * scale,
    padding: `${10 * scale}px ${18 * scale}px`, fontFamily: 'Plex', fontWeight: 500, fontSize: 28 * scale, color: C.paper, whiteSpace: 'nowrap'}}>
    <span style={{width: 10 * scale, height: 10 * scale, borderRadius: 99, background: dot}} />{text}
  </div>
);

// The hook pill. Identical on frame 0 and on the last frame (loop).
const HookPill: React.FC<{up: number}> = ({up}) => (
  <div style={{position: 'absolute', left: 540, top: lerp(960, 170, up), transform: `translate(-50%,-50%) scale(${lerp(1, 0.46, up)})`,
    background: C.ink2, border: `2px solid ${C.line}`, borderRadius: 18, padding: '22px 34px', display: 'flex', gap: 18, alignItems: 'flex-start',
    fontFamily: 'Plex', fontWeight: 500, fontSize: 84, lineHeight: 1.2, color: C.paper, whiteSpace: 'nowrap'}}>
    <span style={{color: C.mint}}>&gt;</span>
    <span>
      <div>13 habits give</div>
      <div>it away<span style={{display: 'inline-block', width: 42, height: 84, marginLeft: 16, verticalAlign: '-12px', background: C.mint}} /></div>
    </span>
  </div>
);

// ---------------------------------------------------------------------------------------------
export const V5: React.FC<V5Props> = ({platform}) => {
  const f = useCurrentFrame();
  const T = V5T;
  const W = 1080, H = 1920, cx = W / 2, cy = H / 2;

  // pill rides up as the counter section opens (reference S1 → S3)
  const pillUp = r(f, T.pillUp, T.pillUp + 12, IO);

  // S3: pile + counter (plays twice: before the smash cuts and again into the collapse)
  const inPile1 = f >= T.s3 && f < T.shadows;
  const inPile2 = f >= T.smashEnd && f < T.colEnd + 2;
  const col = r(f, T.col, T.colEnd, IN);
  const tilt = r(f, T.col - 6, T.colEnd - 6, IO);
  const camPush = 1 + 0.08 * r(f, T.s3, T.shadows, IO) + 0.06 * r(f, T.smashEnd, T.col, IO);
  const stress = inPile2 ? 1 : r(f, T.s3 + 40, T.shadows - 6, IO);

  // S5/S6
  const shock = r(f, T.s5, T.fill + 6, Easing.bezier(0.3, 0.6, 0.4, 1));
  const fill = r(f, T.fill, T.fill + 12, IO);
  const blurOut = r(f, T.iris, T.iris + 12, IO);
  const iris = r(f, T.iris + 4, T.irisEnd, IO);

  // S7
  const tile = r(f, T.s7 + 6, T.s7 + 26, OUT);
  const hubOut = r(f, T.s7End - 6, T.s7End, IO);

  // S8
  const lightIn = r(f, T.s8 - 8, T.s8 + 6, IO);

  // loop return
  const back = r(f, T.back, T.backEnd, OUT);

  const pileTags = (vis: number, startAt: number, settled: boolean) => TAGS.map((t, i) => {
    const depth = i % 3;
    const ang = rand(i + 1) * Math.PI * 2;
    const [x0, y0] = SLOTS[i];
    const top = y0 < 960;
    // top-band chips wait until the hook pill has passed through their area
    const a = settled ? startAt - 40 : top ? T.pillUp + 14 + i * 4 : startAt + 4 + i * 5;
    const v = r(f, a, a + 12);
    if (v <= 0) return null;
    const drift = (f - a) * (0.35 + depth * 0.35);
    const dx = Math.cos(ang + 1.2) * drift * 0.22, dy = Math.sin(ang + 1.2) * drift * 0.12;
    const x = lerp(x0 + dx, cx, col), y = lerp(y0 + dy, cy, col);
    const sc = [0.8, 1.0, 1.15][depth] * (1 - 0.85 * col);
    const blur = [3.5, 0, 1.6][depth] + col * 6;
    const dot = i % 5 === 0 ? C.amber : i % 7 === 0 ? C.mint : C.red;
    return (
      <div key={i} style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${(rand(i + 5) - 0.5) * 8 * (1 - col)}deg) translateY(${(1 - v) * 24}px)`,
        opacity: vis * v * [0.5, 0.9, 1][depth] * (1 - r(col, 0.6, 1, IO)), filter: blur > 0.2 ? `blur(${blur}px)` : undefined}}>
        <Tag text={t} dot={dot} scale={sc} />
      </div>
    );
  });

  // smash cards: word card on the spoken word, then a demo of the habit
  type Card = {at: number; kind: 'word' | 'shadow' | 'glow' | 'pop'; word?: string; bg: 'mint' | 'paper' | 'ink'; foot: string; idx: string};
  const cards: Card[] = [
    {at: T.shadows, kind: 'word', word: 'SHADOWS', bg: 'mint', foot: 'on every box', idx: '01/13'},
    {at: T.box - 4, kind: 'shadow', bg: 'paper', foot: 'box-shadow: 0 30px 60px', idx: '01/13'},
    {at: T.glows, kind: 'word', word: 'GLOWS', bg: 'paper', foot: 'gradients · flares', idx: '02/13'},
    {at: T.glowDemo, kind: 'glow', bg: 'ink', foot: 'glow · 40px', idx: '02/13'},
    {at: T.text, kind: 'word', word: 'POP-INS', bg: 'mint', foot: 'scale 0 → 1', idx: '03/13'},
    {at: T.pops, kind: 'pop', bg: 'ink', foot: '1 frame · no build', idx: '03/13'},
  ];
  const inSmash = f >= T.shadows && f < T.smashEnd;
  let ci = 0;
  cards.forEach((c, i) => { if (f >= c.at) ci = i; });

  return (
    <AbsoluteFill style={{background: C.ink, overflow: 'hidden'}}>
      <Fonts />
      <Audio src={staticFile(`v5v/mix_${platform}.wav`)} />

      {/* S1: frame 0 = the hook pill, already set. Tags start piling behind it at once. */}
      {f < T.shadows && (
        <AbsoluteFill style={{perspective: 1400}}>
          {inPile1 && (
            <AbsoluteFill style={{transform: `scale(${camPush})`}}>
              {pileTags(1, T.s3, false)}
              {/* counter: 13 habits */}
              <div style={{position: 'absolute', left: 0, right: 0, top: cy - 250, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: r(f, T.pillUp + 8, T.pillUp + 16)}}>
                <div style={{fontFamily: 'Plex', fontSize: 28, letterSpacing: 7, color: C.muted, textTransform: 'uppercase'}}>Habits that give it away</div>
                {(() => {
                  // count 1 → 13; each new value slides up from below (no one-frame swaps)
                  const t = r(f, T.pillUp + 8, T.pillUp + 40, Easing.bezier(0.2, 0.6, 0.35, 1));
                  const val = 1 + t * 12;
                  const n = Math.floor(val), frac = val - n;
                  const col = `color-mix(in srgb, ${C.red} ${stress * 100}%, ${C.paper})`;
                  const st = (o: number): React.CSSProperties => ({position: 'absolute', left: 0, right: 0, textAlign: 'center', transform: `translateY(${o * 100}%)`});
                  return (
                    <div style={{position: 'relative', width: 500, height: 280, overflow: 'hidden', fontFamily: 'Archivo', fontWeight: 900, fontSize: 250, lineHeight: 1.12, color: col, letterSpacing: -4, fontVariantNumeric: 'tabular-nums'}}>
                      {n >= 13 ? <div style={st(0)}>13</div> : (<>
                        <div style={{...st(-frac), opacity: 1 - frac}}>{n}</div>
                        <div style={{...st(1 - frac), opacity: frac}}>{n + 1}</div>
                      </>)}
                    </div>
                  );
                })()}
                <div style={{fontFamily: 'Archivo', fontWeight: 700, fontSize: 56, color: C.paper, display: 'flex', gap: 16, height: 74, marginTop: 14, opacity: r(f, T.hook13 + 26, T.hook13 + 36)}}>
                  Another
                  <Sequence from={T.hook13 + 32} layout="none">
                    <span style={{color: C.mint}}><RolodexFlip items={['shadow.', 'glow.', 'pop-in.', 'vignette.', 'card grid.']} interval={14} flipDuration={9} /></span>
                  </Sequence>
                </div>
              </div>
            </AbsoluteFill>
          )}
          <HookPill up={pillUp} />
        </AbsoluteFill>
      )}

      {/* S2: smash cuts on the spoken words, each followed by a demo of the habit */}
      {inSmash && (() => {
        const c = cards[ci];
        const back = c.bg === 'mint' ? C.mint : c.bg === 'paper' ? C.paper : C.ink;
        const fg = c.bg === 'mint' ? C.ink : c.bg === 'paper' ? C.green : C.paper;
        const local = f - c.at;
        const push = 1.1 - 0.1 * r(local, 0, 14, OUT);
        return (
          <AbsoluteFill style={{background: back}}>
            <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', transform: `scale(${push})`}}>
              {c.kind === 'word' && (
                <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: Math.min(270, 980 / (c.word!.length * 0.74)), lineHeight: 1, color: fg, letterSpacing: -6}}>{c.word}</div>
              )}
              {c.kind === 'shadow' && (
                <div style={{width: 640, height: 400, background: '#FFFFFF', borderRadius: 28, boxShadow: '0 40px 80px rgba(16,38,28,0.45), 0 12px 24px rgba(16,38,28,0.3)',
                  display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 56, gap: 22}}>
                  <div style={{width: 300, height: 34, borderRadius: 8, background: '#D9D5CA'}} />
                  <div style={{width: 480, height: 22, borderRadius: 8, background: '#E7E3D9'}} />
                  <div style={{width: 400, height: 22, borderRadius: 8, background: '#E7E3D9'}} />
                </div>
              )}
              {c.kind === 'glow' && (
                <div style={{position: 'relative', width: 700, height: 700, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <div style={{position: 'absolute', inset: 0, borderRadius: 999, background: 'radial-gradient(circle, rgba(140,110,255,0.75) 0%, rgba(80,140,255,0.35) 40%, rgba(16,38,28,0) 70%)',
                    transform: `scale(${0.9 + 0.1 * Math.sin(local / 6)})`}} />
                  <div style={{position: 'relative', fontFamily: 'Archivo', fontWeight: 900, fontSize: 150, color: '#FFFFFF', textShadow: '0 0 40px rgba(170,150,255,0.9)'}}>New</div>
                </div>
              )}
              {c.kind === 'pop' && (() => {
                // Slowed-down pop-in: the text overshoots into place. The red frame tick marks where a real render shows it in 1 frame.
                const p = r(local, 0, 9, Easing.bezier(0.34, 1.8, 0.64, 1));
                return (
                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 50}}>
                    <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 140, color: C.paper, transform: `scale(${p})`}}>Big news</div>
                    <div style={{display: 'flex', gap: 10}}>
                      {Array.from({length: 9}).map((_, k) => (
                        <div key={k} style={{width: 56, height: 74, borderRadius: 8, border: `2px solid ${k === 4 ? C.red : C.line}`, background: k === 4 ? `${C.red}33` : C.ink2,
                          opacity: r(local, k * 1.2, k * 1.2 + 6)}} />
                      ))}
                    </div>
                  </div>
                );
              })()}
            </AbsoluteFill>
            {c.kind !== 'word' && (
              <div style={{position: 'absolute', left: 0, right: 0, top: 330, display: 'flex', justifyContent: 'center'}}>
                <div style={{background: C.red, color: C.paper, fontFamily: 'Plex', fontSize: 30, letterSpacing: 4, padding: '10px 20px', borderRadius: 10,
                  transform: `rotate(-3deg) scale(${lerp(1.25, 1, r(local, 2, 12, OUT))})`, opacity: r(local, 2, 8)}}>BANNED</div>
              </div>
            )}
            <div style={{position: 'absolute', left: 60, right: 60, bottom: 90, display: 'flex', justifyContent: 'space-between', fontFamily: 'Plex', fontSize: 26, letterSpacing: 3,
              color: c.bg === 'ink' ? C.muted : c.bg === 'mint' ? C.ink : C.green, textTransform: 'uppercase'}}>
              <span>{c.foot}</span><span>{c.idx}</span>
            </div>
            <HookPill up={1} />
          </AbsoluteFill>
        );
      })()}

      {/* S3 again → S4 collapse: all 13 tags back, counter red, everything rushes into one dot */}
      {inPile2 && (
        <AbsoluteFill style={{perspective: 1400}}>
          <AbsoluteFill style={{transform: `scale(${camPush}) rotateX(${tilt * 28}deg)`, transformStyle: 'preserve-3d'}}>
            {col > 0 && (
              <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
                {Array.from({length: 26}).map((_, i) => {
                  const a = (i / 26) * Math.PI * 2 + rand(i) * 0.2;
                  const r0 = lerp(1400, 120, col) + rand(i + 9) * 200;
                  const len = 160 + rand(i + 3) * 260;
                  return <line key={i} x1={cx + Math.cos(a) * r0} y1={cy + Math.sin(a) * r0} x2={cx + Math.cos(a) * (r0 + len)} y2={cy + Math.sin(a) * (r0 + len)}
                    stroke={i % 4 === 0 ? C.mint : C.paper} strokeOpacity={0.35 * (1 - r(col, 0.75, 1, IO))} strokeWidth={2} />;
                })}
              </svg>
            )}
            {pileTags(r(f, T.smashEnd, T.smashEnd + 8), T.smashEnd, true)}
            <div style={{position: 'absolute', left: 0, right: 0, top: cy - 250, display: 'flex', flexDirection: 'column', alignItems: 'center',
              opacity: r(f, T.smashEnd, T.smashEnd + 6) * (1 - r(col, 0.3, 0.8, IO)), transform: `scale(${1 - 0.8 * col})`}}>
              <div style={{fontFamily: 'Plex', fontSize: 28, letterSpacing: 7, color: C.muted, textTransform: 'uppercase'}}>Banned by one skill</div>
              <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 250, lineHeight: 1.12, color: C.red, letterSpacing: -4}}>13</div>
            </div>
          </AbsoluteFill>
          {col > 0.55 && (
            <div style={{position: 'absolute', left: cx, top: cy, width: 64, height: 64, marginLeft: -32, marginTop: -32, borderRadius: 99,
              background: C.mint, transform: `scale(${r(col, 0.55, 0.85)})`}} />
          )}
          {f < T.colEnd && <HookPill up={1} />}
        </AbsoluteFill>
      )}

      {/* S5: shockwave → mint field, "One skill." + the install pill revealing no-slop-motion */}
      {f >= T.s5 && f < T.irisEnd + 1 && (
        <AbsoluteFill>
          <AbsoluteFill style={{background: C.paper, clipPath: `circle(${shock * 760}px at ${cx}px ${cy}px)`, opacity: 1 - fill}} />
          <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
            <circle cx={cx} cy={cy} r={20 + shock * 820} fill="none" stroke={C.mint} strokeWidth={4} opacity={1 - fill} />
          </svg>
          <AbsoluteFill style={{background: C.mint, clipPath: `circle(${fill * 1200}px at ${cx}px ${cy}px)`}}>
            <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
              {[0, 1, 2, 3].map((k) => {
                const t = (((f - T.fill + k * 14) % 56) + 56) % 56 / 56;
                return <circle key={k} cx={cx} cy={cy} r={120 + t * 1000} fill="none" stroke={C.paper} strokeWidth={3} opacity={0.55 * (1 - t)} />;
              })}
            </svg>
            <div style={{position: 'absolute', left: 70, top: 300, fontFamily: 'Plex', fontSize: 28, letterSpacing: 5, color: C.ink, opacity: r(f, T.pill + 6, T.pill + 18)}}>
              SKILLS TO INSTALL: 1
            </div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 760, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 50,
              filter: blurOut > 0 ? `blur(${blurOut * 14}px)` : undefined, opacity: 1 - blurOut * 0.4}}>
              <Rise p={r(f, T.answer, T.answer + 18)}>
                <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 176, lineHeight: 1, color: C.ink, letterSpacing: -5,
                  transform: `scale(${1.08 - 0.08 * r(f, T.answer, T.answer + 30, OUT)})`}}>One skill.</div>
              </Rise>
              {(() => {
                const w = r(f, T.pill, T.pill + 14, IO);
                const txt = r(f, T.pill + 8, T.pill + 34, IO);
                return (
                  <div style={{background: C.paper, border: `3px solid ${C.ink}`, borderRadius: 999, padding: 16, display: 'flex', alignItems: 'center', gap: 18,
                    width: lerp(140, 960, w), overflow: 'hidden', opacity: r(f, T.pill, T.pill + 6)}}>
                    <div style={{width: 56, height: 56, borderRadius: 14, background: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none'}}>
                      <Mark size={44} color={C.mint} />
                    </div>
                    <div style={{flex: 1, fontFamily: 'Plex', fontWeight: 500, fontSize: 27, color: C.ink, whiteSpace: 'nowrap', clipPath: `inset(0 ${(1 - txt) * 100}% 0 0)`}}>npx skills add ferndesk/no-slop-motion</div>
                  </div>
                );
              })()}
            </div>
          </AbsoluteFill>
          {f >= T.iris + 4 && <AbsoluteFill style={{background: C.ink, clipPath: `circle(${iris * 1150}px at ${cx}px ${cy}px)`}} />}
        </AbsoluteFill>
      )}

      {/* S7: hub — what it checks after the render */}
      {f >= T.irisEnd && f < T.s7End && (
        <AbsoluteFill style={{opacity: 1 - hubOut}}>
          <div style={{position: 'absolute', top: 280, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 22, flexWrap: 'wrap', padding: '0 80px'}}>
            {'It checks after every render.'.split(' ').map((w, i, arr) => {
              const v = r(f, T.s7 + 10 + i * 5, T.s7 + 28 + i * 5);
              const last = i >= arr.length - 2;
              return <span key={i} style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 76, color: last ? C.mint : C.paper, opacity: v,
                filter: `blur(${(1 - v) * 12}px)`, transform: `translateY(${(1 - v) * 20}px)`, display: 'inline-block'}}>{w}</span>;
            })}
          </div>
          {(() => {
            const hub = [
              {at: T.s7 + 30, value: 13, label: 'banned habits', icon: '⊘'},
              {at: T.c30 - 4, value: 30, label: 'frames a second', icon: '▤'},
              {at: T.every0, value: 10, label: 'quality gates', icon: '❐'},
              {at: T.flashes - 6, value: 'pops', label: 'flash detector', icon: '◎'},
            ];
            return (
              <>
                <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
                  {hub.map((h, i) => {
                    const left = i % 2 === 0, top = i < 2;
                    const x1 = cx + (left ? -110 : 110), y1 = cy + (top ? -60 : 60);
                    const x2 = left ? 310 : 770, y2 = top ? 650 : 1270;
                    const d = `M${x1} ${y1} C ${x1 + (left ? -120 : 120)} ${y1}, ${x2} ${lerp(y1, y2, 0.5)}, ${x2} ${y2 + (top ? 70 : -70)}`;
                    const draw = r(f, h.at - 10, h.at + 10, IO);
                    const pulse = ((((f - h.at - 10) % 40) + 40) % 40) / 40;
                    return (
                      <g key={i}>
                        <path d={d} fill="none" stroke="#3E6B55" strokeWidth={5} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} />
                        {f > h.at + 10 && <path d={d} fill="none" stroke={C.mint} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray="0.08 2" strokeDashoffset={-pulse * 1.1 + 0.08} />}
                      </g>
                    );
                  })}
                </svg>
                <div style={{position: 'absolute', left: cx, top: cy, transform: `translate(-50%,-50%) scale(${lerp(2.2, 1, tile)})`, opacity: tile}}>
                  <div style={{width: 300, height: 300, borderRadius: 72, border: `3px solid ${C.mint}55`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <div style={{width: 210, height: 210, borderRadius: 52, background: C.mint, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <Mark size={150} color={C.ink} spin={(1 - tile) * -90 + (f - T.s7) * 0.4} />
                    </div>
                  </div>
                </div>
                {hub.map((h, i) => {
                  const left = i % 2 === 0, top = i < 2;
                  const v = r(f, h.at, h.at + 14);
                  let val: React.ReactNode;
                  if (typeof h.value === 'number') {
                    val = Math.round(h.value * r(f, h.at, h.at + 24, IO)).toString();
                  } else {
                    const glyphs = '%&$#@*?';
                    const settled = Math.floor(r(f, h.at, h.at + 22, IO) * h.value.length * 1.0001);
                    val = h.value.split('').map((ch, k) => (k < settled ? ch : glyphs[(f + k * 3) % glyphs.length])).join('');
                  }
                  return (
                    <div key={i} style={{position: 'absolute', left: left ? 50 : 550, top: top ? 500 : 1220, width: 480, opacity: v, transform: `translateY(${(1 - v) * 30}px)`,
                      background: C.ink2, border: `2px solid ${C.line}`, borderRadius: 24, padding: '24px 26px', display: 'flex', gap: 20, alignItems: 'center'}}>
                      <div style={{width: 76, height: 76, borderRadius: 18, background: `${C.mint}22`, border: `2px solid ${C.mint}66`, color: C.mint, fontFamily: 'Plex', fontSize: 28,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none'}}>{h.icon}</div>
                      <div>
                        <div style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 84, lineHeight: 1, height: 92, color: C.paper, fontVariantNumeric: 'tabular-nums'}}>{val}</div>
                        <div style={{fontFamily: 'Plex', fontSize: 24, letterSpacing: 3, color: C.muted, textTransform: 'uppercase', marginTop: 8}}>{h.label}</div>
                      </div>
                    </div>
                  );
                })}
              </>
            );
          })()}
          <div style={{position: 'absolute', bottom: 120, left: 0, whiteSpace: 'nowrap', fontFamily: 'Plex', fontSize: 28, letterSpacing: 3, color: C.line,
            transform: `translateX(${-(f - T.s7) * 4}px)`, opacity: r(f, T.s7 + 20, T.s7 + 34)}}>
            {Array(4).fill(['shadows', 'glows', 'vignettes', 'card grids', 'static slides', 'pop-ins', 'glitches', 'linear moves', 'filters', 'tweet cards']).flat().join('   ·   ')}
          </div>
        </AbsoluteFill>
      )}

      {/* S8: light stats + live scan + the letter-by-letter strip */}
      {f >= T.s8 - 8 && f < T.s10 + 16 && (
        <AbsoluteFill style={{background: C.paper, clipPath: `inset(${(1 - lightIn) * 100}% 0 0 0)`}}>
          <div style={{position: 'absolute', left: 70, top: 260, display: 'flex', gap: 60, alignItems: 'flex-end'}}>
            <div style={{opacity: r(f, T.s8, T.s8 + 12)}}>
              <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 170, lineHeight: 1.1, color: C.ink, letterSpacing: -5, fontVariantNumeric: 'tabular-nums'}}>
                {Math.round(1908 * r(f, T.s8, T.s8 + 36, Easing.bezier(0.1, 0.6, 0.3, 1))).toLocaleString('en-US')}
              </div>
              <div style={{fontFamily: 'Plex', fontSize: 24, letterSpacing: 4, color: C.green, textTransform: 'uppercase', marginTop: 6}}>frames scanned in one reel</div>
            </div>
            <div style={{opacity: r(f, T.headline, T.headline + 10), transform: `translateY(${(1 - r(f, T.headline, T.headline + 12)) * 24}px)`}}>
              <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 170, lineHeight: 1.1, color: C.red}}>1</div>
              <div style={{fontFamily: 'Plex', fontSize: 24, letterSpacing: 4, color: C.red, textTransform: 'uppercase', marginTop: 6}}>pop I'd missed</div>
            </div>
          </div>
          {/* live scan card */}
          {(() => {
            const v = r(f, T.s8 + 8, T.s8 + 24);
            const rows = ['scene 1', 'scene 2', 'scene 3', 'scene 4', 'headline · letter by letter', 'scene 6', 'scene 7', 'scene 8'];
            const popRow = 4;
            const reveal = (k: number) => k < popRow ? T.s8 + 14 + k * 9 : k === popRow ? T.headline : T.headline + 8 + (k - popRow) * 6;
            const zoom = r(f, T.every - 22, T.every - 10, IO);
            return (
              <div style={{position: 'absolute', left: 70, right: 70, top: 560, height: 720, opacity: v * (1 - zoom), transform: `translateY(${(1 - v) * 60}px) rotate(${(1 - v) * 2}deg) scale(${1 - 0.06 * zoom})`,
                background: C.ink, borderRadius: 30, padding: '28px 34px', overflow: 'hidden'}}>
                <div style={{fontFamily: 'Plex', fontSize: 24, letterSpacing: 4, color: C.mint, display: 'flex', alignItems: 'center', gap: 12}}>
                  <span style={{width: 12, height: 12, borderRadius: 9, background: C.mint}} />LIVE · POP SCAN
                </div>
                <div style={{marginTop: 24}}>
                  {rows.map((row, k) => {
                    const rv = r(f, reveal(k), reveal(k) + 8);
                    const bad = k === popRow;
                    return (
                      <div key={k} style={{display: 'flex', justifyContent: 'space-between', fontFamily: 'Plex', fontSize: 30, padding: '12px 0', borderBottom: `1px solid ${C.line}`,
                        color: bad ? C.red : C.paper, opacity: rv, transform: `translateX(${(1 - rv) * -20}px)`, background: bad ? `${C.red}${Math.round(26 * rv).toString(16).padStart(2, '0')}` : undefined}}>
                        <span><span style={{color: bad ? C.red : C.mint}}>{bad ? '●' : '✓'}</span>  {row}</span>
                        <span style={{color: bad ? C.red : C.muted}}>{bad ? 'pop' : 'clean'}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{position: 'absolute', left: 34, bottom: 28, fontFamily: 'Archivo', fontWeight: 700, fontSize: 30, color: C.paper}}>
                  <span style={{color: C.mint}}>1 scan</span> · after every render
                </div>
              </div>
            );
          })()}
          {/* "Every new letter was a one-frame pop": a filmstrip, one frame per letter */}
          {f >= T.every - 6 && (() => {
            const word = 'Headline';
            const v = r(f, T.every - 8, T.every + 4);
            const slide = r(f, T.every, T.s8End, Easing.bezier(0.3, 0.1, 0.4, 1));
            return (
              <div style={{position: 'absolute', left: 0, right: 0, top: 640, opacity: v}}>
                <div style={{fontFamily: 'Plex', fontSize: 26, letterSpacing: 4, color: C.green, textAlign: 'center', marginBottom: 26}}>1 NEW LETTER = 1 FLASH FRAME</div>
                <div style={{display: 'flex', gap: 18, transform: `translateX(${lerp(70, -560, slide)}px)`}}>
                  {word.split('').map((_, k) => {
                    const lit = f >= T.every + 6 + k * 5;
                    return (
                      <div key={k} style={{flex: 'none', width: 250, height: 330, borderRadius: 18, background: C.ink, padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                        border: `4px solid ${lit ? C.red : C.ink}`}}>
                        <div style={{fontFamily: 'Plex', fontSize: 22, color: lit ? C.red : C.muted}}>+{k + 1} frame</div>
                        <div style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 52, color: C.paper, whiteSpace: 'nowrap'}}>
                          {word.slice(0, k)}<span style={{color: C.red}}>{word[k]}</span>
                        </div>
                        <div style={{fontFamily: 'Plex', fontSize: 22, color: C.red, opacity: lit ? 1 : 0.25}}>pop</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* S10: end card */}
      {f >= T.s10 && (
        <AbsoluteFill style={{background: C.paper}}>
          {(() => {
            const rip = r(f, T.s10 + 4, T.s10 + 44, OUT);
            return <svg width={W} height={H} style={{position: 'absolute', inset: 0}}><circle cx={cx} cy={640} r={100 + rip * 760} fill="none" stroke={C.mint} strokeWidth={4} opacity={0.6 * (1 - rip)} /></svg>;
          })()}
          <div style={{position: 'absolute', left: cx, top: 640, transform: 'translate(-50%,-50%)'}}>
            <Mark size={360} color={C.ink} ring={r(f, T.s10 + 6, T.s10 + 30, IO)} line={1} lineIn={1 - r(f, T.s10 + 2, T.s10 + 22, OUT)} spin={(1 - r(f, T.s10 + 2, T.s10 + 30, OUT)) * -120} />
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 880, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30}}>
            <div style={{display: 'flex', gap: 24}}>
              {'The Exact Method'.split(' ').map((w, i) => (
                <Rise key={i} p={r(f, T.s10 + 12 + i * 4, T.s10 + 30 + i * 4)}>
                  <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 100, lineHeight: 1, color: C.ink, letterSpacing: -3}}>{w}</div>
                </Rise>
              ))}
            </div>
            <div style={{fontFamily: 'Archivo', fontWeight: 700, fontSize: 48, color: C.ink, display: 'flex', gap: 14, opacity: r(f, T.s10 + 22, T.s10 + 34),
              filter: `blur(${(1 - r(f, T.s10 + 22, T.s10 + 34)) * 8}px)`}}>
              The Video Brief.
              <span style={{position: 'relative', color: C.green}}>Free PDF.
                <svg viewBox="0 0 100 10" preserveAspectRatio="none" style={{position: 'absolute', left: 0, bottom: -10, width: '100%', height: 12}}>
                  <path d="M1 6 C 30 2, 60 9, 99 4" fill="none" stroke={C.mint} strokeWidth={4} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - r(f, T.s10 + 30, T.s10 + 44, IO)} />
                </svg>
              </span>
            </div>
            {/* the keyword: a comment field (Instagram) or a DM bubble (TikTok) */}
            {(() => {
              const v = r(f, T.s10 + 4, T.s10 + 16);
              const typed = r(f, T.video - 2, T.video + 10, IO);
              const hover = r(f, T.click - 6, T.click, IO);
              const press = Math.max(0, 1 - Math.abs(f - T.click - 2) / 4);
              const ripple = r(f, T.click, T.click + 16, OUT);
              const ig = platform === 'ig';
              return (
                <div style={{marginTop: 34, opacity: v, transform: `translateY(${(1 - v) * 20}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
                  <div style={{fontFamily: 'Plex', fontSize: 26, letterSpacing: 4, color: C.green}}>{ig ? 'COMMENT THE WORD' : 'DM ME THE WORD'}</div>
                  <div style={{display: 'flex', alignItems: 'center', gap: 16, background: '#FFFFFF', border: `3px solid ${C.ink}`, borderRadius: ig ? 999 : '36px 36px 36px 8px',
                    padding: '14px 14px 14px 28px', width: 640}}>
                    <div style={{width: 44, height: 44, borderRadius: 99, background: C.ink, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <Mark size={34} color={C.mint} />
                    </div>
                    <div style={{flex: 1, fontFamily: 'Archivo', fontWeight: 800, fontSize: 52, color: C.ink, letterSpacing: 2, clipPath: `inset(0 ${(1 - typed) * 100}% 0 0)`}}>VIDEO</div>
                    <div style={{position: 'relative', background: hover > 0.5 ? C.green : C.ink, color: C.mint, borderRadius: 999, padding: '14px 28px', fontFamily: 'Archivo', fontWeight: 800, fontSize: 30,
                      transform: `scale(${1 + 0.04 * hover - 0.05 * press})`}}>
                      {ig ? 'Post' : 'Send'}
                      {ripple > 0 && ripple < 1 && <span style={{position: 'absolute', left: '50%', top: '50%', width: 40, height: 40, marginLeft: -20, marginTop: -20, borderRadius: 99,
                        border: `3px solid ${C.mint}`, transform: `scale(${1 + ripple * 7})`, opacity: 1 - ripple}} />}
                    </div>
                  </div>
                  <div style={{fontFamily: 'Archivo', fontWeight: 700, fontSize: 32, color: C.green, opacity: r(f, T.guide - 4, T.guide + 8)}}>I'll send you the guide.</div>
                </div>
              );
            })()}
          </div>
          {f >= T.click - 24 && (() => {
            const m = r(f, T.click - 24, T.click - 4, IO);
            const x = lerp(1060, 800, m), y = lerp(1800, 1240, m);
            return (
              <svg viewBox="0 0 24 24" width={56} height={56} style={{position: 'absolute', left: x, top: y, opacity: 1 - back}}>
                <path d="M4 2l15 10-6.5 1.5L9.5 20z" fill={C.ink} stroke={C.paper} strokeWidth={1.4} strokeLinejoin="round" />
              </svg>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* S9: slat wipe */}
      {f >= T.s9 && f < T.s10 + 16 && (
        <AbsoluteFill>
          {Array.from({length: 6}).map((_, i) => {
            const a = T.s9 + i * 1.5;
            const inP = r(f, a, a + 7, IO), outP = r(f, T.s10 + i * 1.5, T.s10 + i * 1.5 + 7, IO);
            const sw = W / 6;
            return <div key={i} style={{position: 'absolute', top: 0, bottom: 0, left: i * sw, width: sw + 1, background: i % 2 ? C.ink : C.mint,
              transform: `scaleX(${inP - outP})`, transformOrigin: outP > 0 ? 'right' : 'left'}} />;
          })}
        </AbsoluteFill>
      )}

      {/* Loop return: ink closes in from the edges and the hook pill settles exactly as on frame 0 */}
      {f >= T.back && (
        <AbsoluteFill>
          <AbsoluteFill style={{background: C.ink, clipPath: `circle(${lerp(0, 1150, back)}px at ${cx}px ${cy}px)`}} />
          <div style={{opacity: r(f, T.back + 16, T.backEnd + 4), filter: `blur(${(1 - r(f, T.back + 16, T.backEnd + 4)) * 10}px)`}}>
            <HookPill up={0} />
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
