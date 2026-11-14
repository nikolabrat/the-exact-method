// PILE-UP → ONE, v2 reference (The Exact Method). Rebuilt 10 Nov 2026 from the Alsa API key promo
// (prompt-motion, @0xfemyn). Same ideas, motions and pace; our colours, shapes and words.
// Sections (every one is reusable on its own):
//  S1 prompt pill (frame 0 = hook)      S2 smash-cut word cards with 01/05 footer
//  S3 accelerating counter + "Another X." swaps + depth-blurred tags piling up (+ optional RGB split)
//  S4 collapse: tags rush in with streaks and a 3D tilt into one dot
//  S5 shockwave → mint field with ripples, "One skill." and a revealing command pill
//  S6 focus-pull blur + ink iris            S7 hub: app tile, blur-in headline, 4 count-up cards,
//     connectors with travelling pulses, scramble text, marquee
//  S8 light stats: big count-ups, live scan card, "works with" chips
//  S9 slat wipe                             S10 end card: mark assembles, wordmark, CTA, cursor click
import React from 'react';
import {AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame} from 'remotion';

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

export type PileUp2Props = {
  prompt: string;
  smash: {word: string; foot: string}[];
  counterLabel: string; counterTo: number; anotherWords: string[];
  tags: string[];
  rgbSplit: boolean; // the source's chromatic split on the counter; off by default (no-slop bans glitch effects)
  answer: string; pill: string; pillTag: string; answerLabel: string;
  hubTitle: [string, string];
  hub: {value: number | string; label: string; icon: string}[];
  marquee: string[];
  stats: {value: number; suffix: string; label: string}[];
  scanTitle: string; scanRows: {text: string; ok: boolean}[]; scanFoot: string;
  worksWith: string[];
  endWord: string; endLine: [string, string]; endPills: [string, string];
};

// Timing table, 30 fps.
export const T2 = {
  s1: 0, pillUp: 18, s2: 26, card: 10,
  s3: 76, s3End: 178,
  s4: 178, s4End: 204,
  s5: 204, fill: 212, answer: 216, pill: 234, s5End: 284,
  s6: 284, iris: 288, irisEnd: 306,
  s7: 300, s7End: 394,
  s8: 394, s8End: 452,
  s9: 450, s9End: 468,
  s10: 466, cursor: 496, click: 512, total: 532,
};

const Fonts: React.FC = () => (
  <style>{`
@font-face{font-family:Archivo;src:url(${staticFile('archivo-variable.woff2')}) format('woff2');font-weight:100 900;font-stretch:62% 125%}
@font-face{font-family:Newsreader;src:url(${staticFile('newsreader-variable.woff2')}) format('woff2');font-weight:200 800;font-style:normal italic}
@font-face{font-family:Plex;src:url(${staticFile('plex-mono-500.woff2')}) format('woff2');font-weight:500}
`}</style>
);

const Rise: React.FC<{p: number; children: React.ReactNode; style?: React.CSSProperties}> = ({p, children, style}) => (
  <div style={{overflow: 'hidden', paddingBottom: '0.1em', ...style}}>
    <div style={{transform: `translateY(${(1 - p) * 110}%)`}}>{children}</div>
  </div>
);

const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

const Mark: React.FC<{size: number; color: string; ring?: number; line?: number; spin?: number; lineIn?: number}> = ({size, color, ring = 1, line = 1, spin = 0, lineIn = 0}) => (
  <svg viewBox="0 0 1024 1024" width={size} height={size} fill="none" stroke={color} strokeWidth={size < 200 ? 26 : 10} style={{transform: `rotate(${spin}deg)`}}>
    {[123, 194, 265].map((rr, i) => (
      <circle key={rr} cx={512} cy={512} r={rr} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.min(1, Math.max(0, ring * 1.4 - i * 0.2))} transform="rotate(-90 512 512)" />
    ))}
    {[[0, -1], [0, 1], [-1, 0], [1, 0]].map(([dx, dy], i) => {
      const off = lineIn * 260;
      return (
        <path key={i} d={`M${512 + dx * 52} ${512 + dy * 52}L${512 + dx * 313} ${512 + dy * 313}`} pathLength={1} strokeDasharray="1 1"
          strokeDashoffset={1 - line} transform={`translate(${dx * off} ${dy * off})`} />
      );
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

// ---------------------------------------------------------------------------------------------
export const PileUp2: React.FC<PileUp2Props> = (p) => {
  const f = useCurrentFrame();
  const T = T2;
  const W = 1080, H = 1920, cx = W / 2, cy = H / 2;

  // ---------- S1 + S2: prompt pill that rides to the top over smash cuts ----------
  const pillUp = r(f, T.pillUp, T.pillUp + 12, IO);
  const cardIdx = Math.floor((f - T.s2) / T.card);
  const inS2 = f >= T.s2 && f < T.s3;
  const cardBg = ['mint', 'paper', 'ink'];
  const blink = Math.floor(f / 8) % 2 === 0;

  const promptPill = (
    <div style={{position: 'absolute', left: cx, top: lerp(cy, 150, pillUp), transform: `translate(-50%,-50%) scale(${lerp(1, 0.46, pillUp)})`,
      background: C.ink2, border: `2px solid ${C.line}`, borderRadius: 18, padding: '22px 30px', display: 'flex', alignItems: 'center', gap: 16,
      fontFamily: 'Plex', fontWeight: 500, fontSize: 78, lineHeight: 1.2, color: C.paper, whiteSpace: 'nowrap', alignItems: 'flex-start'}}>
      <span style={{color: C.mint}}>&gt;</span>
      <span>{p.prompt.split('|').map((l, i, a) => <div key={i}>{l}{i === a.length - 1 && <span style={{display: 'inline-block', width: 40, height: 80, marginLeft: 14, verticalAlign: '-10px', background: C.mint, opacity: blink ? 1 : 0.15}} />}</div>)}</span>
    </div>
  );

  // ---------- S3: counter ----------
  const s3t = r(f, T.s3 + 4, T.s3End - 8, Easing.linear);
  const count = Math.max(1, p.counterTo * Math.pow(s3t, 2.3));
  const stress = r(f, T.s3 + 50, T.s3End - 6, IO);
  const numColor = `color-mix(in srgb, ${C.red} ${stress * 100}%, ${C.paper})`;
  const another = Math.min(p.anotherWords.length - 1, Math.floor(r(f, T.s3 + 20, T.s3End - 10, Easing.linear) * p.anotherWords.length));
  const anotherStart = T.s3 + 20 + another * ((T.s3End - 10 - (T.s3 + 20)) / p.anotherWords.length);
  const swap = r(f, anotherStart, anotherStart + 8);
  const col = r(f, T.s4, T.s4End, IN); // collapse progress
  const tilt = r(f, T.s4 - 4, T.s4End - 6, IO);
  const s3In = r(f, T.s3, T.s3 + 10);
  const camPush = 1 + 0.08 * r(f, T.s3, T.s4, IO);
  const split = p.rgbSplit ? Math.max(0, 1 - Math.abs(f - (T.s3End - 18)) / 5) * 10 : 0;

  // ---------- S5 ----------
  const shock = r(f, T.s5, T.fill + 6, Easing.bezier(0.3, 0.6, 0.4, 1));
  const fill = r(f, T.fill, T.fill + 12, IO);
  const blurOut = r(f, T.s6, T.s6 + 12, IO);
  const iris = r(f, T.iris, T.irisEnd, IO);

  // ---------- S7 ----------
  const tile = r(f, T.s7 + 4, T.s7 + 24, OUT);
  const hubOut = r(f, T.s7End - 6, T.s7End, IO);

  // ---------- S8 ----------
  const lightIn = r(f, T.s8 - 8, T.s8 + 6, IO);

  // ---------- S9 + S10 ----------
  const slats = 6;

  return (
    <AbsoluteFill style={{background: C.ink, overflow: 'hidden'}}>
      <Fonts />

      {/* S1: frame 0 is the prompt with the full text already set */}
      {f < T.s2 && promptPill}

      {/* S2: smash cuts */}
      {inS2 && (() => {
        const i = Math.min(p.smash.length - 1, cardIdx);
        const c = p.smash[i];
        const bg = cardBg[i % 3];
        const back = bg === 'mint' ? C.mint : bg === 'paper' ? C.paper : C.ink;
        const fg = bg === 'mint' ? C.ink : bg === 'paper' ? C.green : C.paper;
        const local = (f - T.s2) - i * T.card;
        const push = 1.1 - 0.1 * r(local, 0, T.card, OUT);
        return (
          <AbsoluteFill style={{background: back}}>
            <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
              <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: Math.min(270, 980 / (c.word.length * 0.74)), lineHeight: 1, color: fg, letterSpacing: -6, transform: `scale(${push})`}}>{c.word}</div>
            </AbsoluteFill>
            <div style={{position: 'absolute', left: 60, right: 60, bottom: 90, display: 'flex', justifyContent: 'space-between', fontFamily: 'Plex', fontSize: 26, letterSpacing: 3,
              color: bg === 'ink' ? C.muted : bg === 'mint' ? C.ink : C.green, textTransform: 'uppercase'}}>
              <span>{c.foot}</span><span>{String(i + 1).padStart(2, '0')}/{String(p.smash.length).padStart(2, '0')}</span>
            </div>
            {promptPill}
          </AbsoluteFill>
        );
      })()}

      {/* S3 + S4: counter, pile of tags, collapse */}
      {f >= T.s3 && f < T.s4End + 2 && (
        <AbsoluteFill style={{perspective: 1400}}>
          <AbsoluteFill style={{transform: `scale(${camPush}) rotateX(${tilt * 28}deg)`, transformStyle: 'preserve-3d'}}>
            {/* speed lines during the collapse */}
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
            {p.tags.map((t, i) => {
              const depth = i % 3; // 0 far, 1 mid, 2 near
              const ang = rand(i + 1) * Math.PI * 2;
              const band = i % 2 === 0 ? -1 : 1; // above or below the counter
              const x0 = 110 + rand(i + 2) * 860;
              const y0 = band < 0 ? 150 + rand(i + 4) * 520 : 1240 + rand(i + 4) * 560;
              const a = T.s3 + 8 + i * ((T.s3End - T.s3 - 30) / p.tags.length);
              const v = r(f, a, a + 12);
              if (v <= 0) return null;
              const drift = (f - a) * (0.35 + depth * 0.35);
              const dx = Math.cos(ang + 1.2) * drift, dy = Math.sin(ang + 1.2) * drift * 0.6;
              const x = lerp(x0 + dx, cx, col), y = lerp(y0 + dy, cy, col);
              const sc = [0.8, 1.05, 1.3][depth] * (1 - 0.85 * col);
              const blur = [3.5, 0, 1.6][depth] + col * 6;
              const dot = i % 5 === 0 ? C.amber : i % 7 === 0 ? C.mint : C.red;
              return (
                <div key={i} style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${(rand(i + 5) - 0.5) * 8 * (1 - col)}deg) translateY(${(1 - v) * 24}px)`,
                  opacity: v * [0.5, 0.9, 1][depth] * (1 - r(col, 0.6, 1, IO)), filter: blur > 0.2 ? `blur(${blur}px)` : undefined}}>
                  <Tag text={t} dot={dot} scale={sc} />
                </div>
              );
            })}
            {/* counter */}
            <div style={{position: 'absolute', left: 0, right: 0, top: cy - 230, display: 'flex', flexDirection: 'column', alignItems: 'center',
              opacity: s3In * (1 - r(col, 0.3, 0.8, IO)), transform: `scale(${1 - 0.8 * col})`}}>
              <div style={{fontFamily: 'Plex', fontSize: 28, letterSpacing: 7, color: C.muted, textTransform: 'uppercase'}}>{p.counterLabel}</div>
              <div style={{position: 'relative', fontFamily: 'Archivo', fontWeight: 900, fontSize: 250, lineHeight: 1.05, color: numColor, fontVariantNumeric: 'tabular-nums', letterSpacing: -4}}>
                {split > 0 && <span style={{position: 'absolute', left: -split, top: 0, color: C.mint, mixBlendMode: 'screen', opacity: 0.8}}>{fmt(count)}</span>}
                {split > 0 && <span style={{position: 'absolute', left: split, top: 0, color: C.red, mixBlendMode: 'screen', opacity: 0.8}}>{fmt(count)}</span>}
                <span style={{position: 'relative'}}>{fmt(count)}</span>
              </div>
              <div style={{fontFamily: 'Archivo', fontWeight: 700, fontSize: 52, color: C.paper, display: 'flex', gap: 14, height: 70, opacity: r(f, T.s3 + 20, T.s3 + 30)}}>
                Another
                <span style={{overflow: 'hidden', display: 'inline-block', height: 70}}>
                  <span style={{display: 'inline-block', color: C.mint, transform: `translateY(${(1 - swap) * 100}%)`, filter: `blur(${(1 - swap) * 6}px)`}}>{p.anotherWords[another]}.</span>
                </span>
              </div>
            </div>
          </AbsoluteFill>
          {/* the dot everything lands in */}
          {col > 0.55 && (
            <div style={{position: 'absolute', left: cx, top: cy, width: 64, height: 64, marginLeft: -32, marginTop: -32, borderRadius: 99,
              background: C.mint, transform: `scale(${r(col, 0.55, 0.85) * (1 - 0.6 * r(f, T.s4End - 6, T.s4End, IN))})`}} />
          )}
        </AbsoluteFill>
      )}

      {/* S5: shockwave → mint field */}
      {f >= T.s5 && f < T.irisEnd + 1 && (
        <AbsoluteFill>
          <AbsoluteFill style={{background: C.paper, clipPath: `circle(${shock * 760}px at ${cx}px ${cy}px)`, opacity: 1 - fill}} />
          <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
            <circle cx={cx} cy={cy} r={20 + shock * 820} fill="none" stroke={C.mint} strokeWidth={4} opacity={1 - fill} />
          </svg>
          <AbsoluteFill style={{background: C.mint, clipPath: `circle(${fill * 1200}px at ${cx}px ${cy}px)`}}>
            <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
              {[0, 1, 2, 3].map((k) => {
                const t = ((f - T.fill + k * 14) % 56) / 56;
                return <circle key={k} cx={cx} cy={cy} r={120 + t * 1000} fill="none" stroke={C.paper} strokeWidth={3} opacity={0.55 * (1 - t)} />;
              })}
            </svg>
            <div style={{position: 'absolute', left: 60, top: 120, fontFamily: 'Plex', fontSize: 28, letterSpacing: 5, color: C.ink, opacity: r(f, T.pill + 6, T.pill + 18)}}>
              {p.answerLabel}
            </div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 760, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 50,
              filter: blurOut > 0 ? `blur(${blurOut * 14}px)` : undefined, opacity: 1 - blurOut * 0.4}}>
              <Rise p={r(f, T.answer, T.answer + 18)}>
                <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 176, lineHeight: 1, color: C.ink, letterSpacing: -5,
                  transform: `scale(${1.08 - 0.08 * r(f, T.answer, T.answer + 30, OUT)})`}}>{p.answer}</div>
              </Rise>
              {(() => {
                const w = r(f, T.pill, T.pill + 14, IO);
                const txt = r(f, T.pill + 8, T.pill + 30, IO);
                return (
                  <div style={{background: C.paper, border: `3px solid ${C.ink}`, borderRadius: 999, padding: '16px 18px 16px 18px', display: 'flex', alignItems: 'center', gap: 18,
                    width: lerp(140, 1000, w), overflow: 'hidden', opacity: r(f, T.pill, T.pill + 6)}}>
                    <div style={{width: 56, height: 56, borderRadius: 14, background: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none'}}>
                      <Mark size={44} color={C.mint} />
                    </div>
                    <div style={{flex: 1, fontFamily: 'Plex', fontWeight: 500, fontSize: 27, color: C.ink, whiteSpace: 'nowrap', clipPath: `inset(0 ${(1 - txt) * 100}% 0 0)`}}>{p.pill}</div>
                    <div style={{flex: 'none', background: C.ink, color: C.mint, fontFamily: 'Plex', fontSize: 20, letterSpacing: 2, borderRadius: 8, padding: '6px 10px', opacity: txt}}>{p.pillTag}</div>
                  </div>
                );
              })()}
            </div>
          </AbsoluteFill>
          {/* S6 iris */}
          {f >= T.iris && <AbsoluteFill style={{background: C.ink, clipPath: `circle(${iris * 1150}px at ${cx}px ${cy}px)`}} />}
        </AbsoluteFill>
      )}

      {/* S7: hub */}
      {f >= T.irisEnd && f < T.s7End && (
        <AbsoluteFill style={{opacity: 1 - hubOut}}>
          {/* headline: words blur in */}
          <div style={{position: 'absolute', top: 250, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 22, flexWrap: 'wrap', padding: '0 70px'}}>
            {(p.hubTitle[0] + ' ' + p.hubTitle[1]).split(' ').map((w, i, arr) => {
              const v = r(f, T.s7 + 12 + i * 4, T.s7 + 30 + i * 4);
              const last = i >= arr.length - p.hubTitle[1].split(' ').length;
              return <span key={i} style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 76, color: last ? C.mint : C.paper, opacity: v,
                filter: `blur(${(1 - v) * 12}px)`, transform: `translateY(${(1 - v) * 20}px)`, display: 'inline-block'}}>{w}</span>;
            })}
          </div>
          {/* connectors with travelling pulses */}
          <svg width={W} height={H} style={{position: 'absolute', inset: 0}}>
            {p.hub.map((_, i) => {
              const left = i % 2 === 0, top = i < 2;
              const x1 = cx + (left ? -110 : 110), y1 = cy + (top ? -60 : 60);
              const x2 = left ? 310 : 770, y2 = top ? 650 : 1270;
              const d = `M${x1} ${y1} C ${x1 + (left ? -120 : 120)} ${y1}, ${x2} ${lerp(y1, y2, 0.5)}, ${x2} ${y2 + (top ? 70 : -70)}`;
              const draw = r(f, T.s7 + 22 + i * 4, T.s7 + 44 + i * 4, IO);
              const pulse = ((f - T.s7 - 40 - i * 9) % 40) / 40;
              return (
                <g key={i}>
                  <path d={d} fill="none" stroke="#3E6B55" strokeWidth={5} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} />
                  {f > T.s7 + 40 && <path d={d} fill="none" stroke={C.mint} strokeWidth={5} strokeLinecap="round" pathLength={1} strokeDasharray="0.08 2" strokeDashoffset={-pulse * 1.1 + 0.08} />}
                </g>
              );
            })}
          </svg>
          {/* tile */}
          <div style={{position: 'absolute', left: cx, top: cy, transform: `translate(-50%,-50%) scale(${lerp(2.2, 1, tile)})`, opacity: tile}}>
            <div style={{width: 300, height: 300, borderRadius: 72, border: `3px solid ${C.mint}55`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{width: 210, height: 210, borderRadius: 52, background: C.mint, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Mark size={150} color={C.ink} spin={(1 - tile) * -90} />
              </div>
            </div>
          </div>
          {/* cards */}
          {p.hub.map((h, i) => {
            const left = i % 2 === 0, top = i < 2;
            const v = r(f, T.s7 + 30 + i * 6, T.s7 + 46 + i * 6);
            const cnt = r(f, T.s7 + 30 + i * 5, T.s7 + 58 + i * 5, IO);
            let val: string;
            if (typeof h.value === 'number') val = fmt(h.value * cnt);
            else {
              const glyphs = '%&$#@*?';
              const settled = Math.floor(cnt * h.value.length * 1.0001);
              val = h.value.split('').map((ch, k) => (k < settled ? ch : glyphs[(f + k * 3) % glyphs.length])).join('');
            }
            return (
              <div key={i} style={{position: 'absolute', left: left ? 50 : 550, top: top ? 500 : 1220, width: 480, opacity: v, transform: `translateY(${(1 - v) * 30}px)`,
                background: C.ink2, border: `2px solid ${C.line}`, borderRadius: 24, padding: '24px 26px', display: 'flex', gap: 20, alignItems: 'center'}}>
                <div style={{width: 76, height: 76, borderRadius: 18, background: `${C.mint}22`, border: `2px solid ${C.mint}66`, color: C.mint, fontFamily: 'Plex', fontSize: 28,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none'}}>{h.icon}</div>
                <div>
                  <div style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 84, lineHeight: 1, color: C.paper, fontVariantNumeric: 'tabular-nums'}}>{val}</div>
                  <div style={{fontFamily: 'Plex', fontSize: 24, letterSpacing: 3, color: C.muted, textTransform: 'uppercase', marginTop: 8}}>{h.label}</div>
                </div>
              </div>
            );
          })}
          {/* marquee */}
          <div style={{position: 'absolute', bottom: 120, left: 0, whiteSpace: 'nowrap', fontFamily: 'Plex', fontSize: 28, letterSpacing: 3, color: C.line,
            transform: `translateX(${-(f - T.s7) * 4}px)`, opacity: r(f, T.s7 + 20, T.s7 + 34)}}>
            {[...p.marquee, ...p.marquee, ...p.marquee].join('   ·   ')}
          </div>
        </AbsoluteFill>
      )}

      {/* S8: light stats */}
      {f >= T.s8 - 8 && f < T.s9End && (
        <AbsoluteFill style={{background: C.paper, clipPath: `inset(${(1 - lightIn) * 100}% 0 0 0)`}}>
          <div style={{position: 'absolute', left: 70, top: 200, display: 'flex', flexDirection: 'column', gap: 26}}>
            {p.stats.map((s, i) => {
              const v = r(f, T.s8 + i * 8, T.s8 + 14 + i * 8);
              const cnt = r(f, T.s8 + i * 8, T.s8 + 40 + i * 8, Easing.bezier(0.1, 0.6, 0.3, 1));
              return (
                <div key={i} style={{opacity: v, transform: `translateY(${(1 - v) * 24}px)`}}>
                  <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 190, lineHeight: 0.95, color: C.ink, letterSpacing: -6, fontVariantNumeric: 'tabular-nums'}}>
                    {fmt(s.value * cnt)}<span style={{color: C.green}}>{s.suffix}</span>
                  </div>
                  <div style={{fontFamily: 'Plex', fontSize: 26, letterSpacing: 5, color: C.green, textTransform: 'uppercase'}}>{s.label}</div>
                </div>
              );
            })}
          </div>
          {/* live scan card */}
          {(() => {
            const v = r(f, T.s8 + 10, T.s8 + 26);
            const scroll = (f - T.s8) * 2.2;
            return (
              <div style={{position: 'absolute', left: 70, right: 70, top: 920, height: 560, opacity: v, transform: `translateY(${(1 - v) * 60}px) rotate(${(1 - v) * 2}deg)`,
                background: C.ink, borderRadius: 30, padding: '28px 34px', overflow: 'hidden'}}>
                <div style={{fontFamily: 'Plex', fontSize: 24, letterSpacing: 4, color: C.mint, display: 'flex', alignItems: 'center', gap: 12}}>
                  <span style={{width: 12, height: 12, borderRadius: 9, background: C.mint, opacity: Math.floor(f / 10) % 2 ? 1 : 0.3}} />{p.scanTitle}
                </div>
                <div style={{position: 'absolute', top: 90, left: 34, right: 34, bottom: 90, overflow: 'hidden'}}>
                  <div style={{transform: `translateY(${-scroll}px)`}}>
                    {[...p.scanRows, ...p.scanRows].map((row, i) => (
                      <div key={i} style={{display: 'flex', justifyContent: 'space-between', fontFamily: 'Plex', fontSize: 28, padding: '10px 0', borderBottom: `1px solid ${C.line}`,
                        color: row.ok ? C.paper : C.red}}>
                        <span><span style={{color: row.ok ? C.mint : C.red}}>{row.ok ? '✓' : '●'}</span>  {row.text}</span>
                        <span style={{color: row.ok ? C.muted : C.red}}>{row.ok ? 'clean' : 'pop'}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{position: 'absolute', left: 34, bottom: 28, fontFamily: 'Archivo', fontWeight: 700, fontSize: 30, color: C.paper}}>
                  <span style={{color: C.mint}}>{p.scanFoot.split('·')[0]}</span>·{p.scanFoot.split('·').slice(1).join('·')}
                </div>
              </div>
            );
          })()}
          {/* works with */}
          <div style={{position: 'absolute', left: 70, right: 70, top: 1540}}>
            <div style={{fontFamily: 'Plex', fontSize: 24, letterSpacing: 5, color: C.green, opacity: r(f, T.s8 + 20, T.s8 + 30)}}>WORKS WITH</div>
            <div style={{display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 16}}>
              {p.worksWith.map((w, i) => {
                const v = r(f, T.s8 + 24 + i * 5, T.s8 + 36 + i * 5);
                return <span key={w} style={{opacity: v, transform: `translateY(${(1 - v) * 16}px)`, border: `2.5px solid ${C.ink}`, borderRadius: 999, padding: '10px 22px',
                  fontFamily: 'Archivo', fontWeight: 700, fontSize: 30, color: C.ink, display: 'inline-flex', alignItems: 'center', gap: 10}}>
                  <span style={{width: 12, height: 12, borderRadius: 9, background: C.green}} />{w}</span>;
              })}
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* S10: end card (under the slats) */}
      {f >= T.s10 && (
        <AbsoluteFill style={{background: C.paper}}>
          {(() => {
            const rip = r(f, T.s10 + 4, T.s10 + 44, OUT);
            return <svg width={W} height={H} style={{position: 'absolute', inset: 0}}><circle cx={cx} cy={720} r={100 + rip * 760} fill="none" stroke={C.mint} strokeWidth={4} opacity={0.6 * (1 - rip)} /></svg>;
          })()}
          <div style={{position: 'absolute', left: cx, top: 720, transform: 'translate(-50%,-50%)'}}>
            <Mark size={400} color={C.ink} ring={r(f, T.s10 + 6, T.s10 + 30, IO)} line={1} lineIn={1 - r(f, T.s10 + 2, T.s10 + 22, OUT)} spin={(1 - r(f, T.s10 + 2, T.s10 + 30, OUT)) * -120} />
          </div>
          <div style={{position: 'absolute', left: 0, right: 0, top: 990, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34}}>
            <div style={{display: 'flex', gap: 24}}>
              {p.endWord.split(' ').map((w, i) => (
                <Rise key={i} p={r(f, T.s10 + 14 + i * 4, T.s10 + 32 + i * 4)}>
                  <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 104, lineHeight: 1, color: C.ink, letterSpacing: -3}}>{w}</div>
                </Rise>
              ))}
            </div>
            <div style={{fontFamily: 'Archivo', fontWeight: 700, fontSize: 50, color: C.ink, display: 'flex', gap: 14, opacity: r(f, T.s10 + 24, T.s10 + 36),
              filter: `blur(${(1 - r(f, T.s10 + 24, T.s10 + 36)) * 8}px)`}}>
              {p.endLine[0]}
              <span style={{position: 'relative', color: C.green}}>{p.endLine[1]}
                <svg viewBox="0 0 100 10" preserveAspectRatio="none" style={{position: 'absolute', left: 0, bottom: -10, width: '100%', height: 12}}>
                  <path d="M1 6 C 30 2, 60 9, 99 4" fill="none" stroke={C.mint} strokeWidth={4} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - r(f, T.s10 + 32, T.s10 + 46, IO)} />
                </svg>
              </span>
            </div>
            {(() => {
              const v = r(f, T.s10 + 34, T.s10 + 46);
              const hover = r(f, T.click - 6, T.click, IO);
              const press = Math.max(0, 1 - Math.abs(f - T.click - 2) / 4);
              const ripple = r(f, T.click, T.click + 16, OUT);
              return (
                <div style={{display: 'flex', gap: 18, marginTop: 20, opacity: v, transform: `translateY(${(1 - v) * 20}px)`}}>
                  <span style={{border: `3px solid ${C.ink}`, borderRadius: 999, padding: '16px 30px', fontFamily: 'Plex', fontSize: 32, color: C.ink}}>{p.endPills[0]}</span>
                  <span style={{position: 'relative', background: hover > 0.5 ? C.green : C.ink, color: C.mint, borderRadius: 999, padding: '16px 34px', fontFamily: 'Archivo', fontWeight: 800, fontSize: 34,
                    transform: `scale(${1 + 0.04 * hover - 0.05 * press})`}}>
                    {p.endPills[1]}
                    {ripple > 0 && ripple < 1 && <span style={{position: 'absolute', left: '50%', top: '50%', width: 40, height: 40, marginLeft: -20, marginTop: -20, borderRadius: 99,
                      border: `3px solid ${C.mint}`, transform: `scale(${1 + ripple * 7})`, opacity: 1 - ripple}} />}
                  </span>
                </div>
              );
            })()}
          </div>
          {/* cursor */}
          {f >= T.cursor - 14 && (() => {
            const m = r(f, T.cursor - 14, T.click - 4, IO);
            const x = lerp(1060, 770, m), y = lerp(1800, 1296, m);
            return (
              <svg viewBox="0 0 24 24" width={56} height={56} style={{position: 'absolute', left: x, top: y}}>
                <path d="M4 2l15 10-6.5 1.5L9.5 20z" fill={C.ink} stroke={C.paper} strokeWidth={1.4} strokeLinejoin="round" />
              </svg>
            );
          })()}
        </AbsoluteFill>
      )}

      {/* S9: slat wipe, mint and ink bars sweep across */}
      {f >= T.s9 && f < T.s10 + 16 && (
        <AbsoluteFill>
          {Array.from({length: slats}).map((_, i) => {
            const a = T.s9 + i * 1.5;
            const inP = r(f, a, a + 7, IO), outP = r(f, T.s10 + i * 1.5, T.s10 + i * 1.5 + 7, IO);
            const sw = W / slats;
            return <div key={i} style={{position: 'absolute', top: 0, bottom: 0, left: i * sw, width: sw + 1, background: i % 2 ? C.ink : C.mint,
              transform: `scaleX(${inP - outP})`, transformOrigin: outP > 0 ? 'right' : 'left'}} />;
          })}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
