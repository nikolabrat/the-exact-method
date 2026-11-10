// PILE-UP → ONE reference format (The Exact Method).
// Borrowed idea (from the Alsa promo on prompt-motion): a problem that piles up with a counter,
// collapses into one point, and bursts into the single answer. Our version: the point is the centre
// dot of our crosshair mark, the rings draw around it, then a mint wave turns it into the answer.
// Every timing lives in T, every word lives in props, so a reel can reuse it as one section.
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';

export const C = {ink: '#10261C', paper: '#F4F1E8', mint: '#6BE0A0', muted: '#9DB3A6', line: '#2C4A3B'};
const OUT = Easing.bezier(0.22, 1, 0.36, 1); // arrivals
const IN = Easing.bezier(0.5, 0, 0.7, 0.2); // collapse
const IO = Easing.bezier(0.65, 0, 0.35, 1); // wipes, camera

export type Item = {text: string; x: number; y: number; r: number; anchor?: 'l' | 'c' | 'r'; mint?: boolean};
export type PileUpProps = {
  kicker: string;
  hook: string[];
  caption: string; // under the counter
  items: Item[];
  answer: string;
  pill: string;
  proofKicker: string;
  proof: {big: string; text: string}[];
  endTitle: string;
  endSub: string;
};

// Timing table (30 fps). Shift these, not the components.
export const T = {
  hookOut: 44, counterIn: 58, firstItem: 66, itemGap: 11,
  collapse: 210, collapseEnd: 250, dotIn: 236,
  rings: 252, ringsEnd: 290,
  burst: 296, burstEnd: 336, answerIn: 326, pillIn: 344,
  proofIn: 392, proofEnd: 418, proofOut: 444,
  endIn: 454, loop: 474, total: 500,
};

const ramp = (f: number, a: number, b: number, e = OUT) =>
  interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});

const Fonts: React.FC = () => (
  <style>{`
@font-face{font-family:Archivo;src:url(${staticFile('archivo-variable.woff2')}) format('woff2');font-weight:100 900;font-stretch:62% 125%}
@font-face{font-family:Newsreader;src:url(${staticFile('newsreader-variable.woff2')}) format('woff2');font-weight:200 800}
@font-face{font-family:Plex;src:url(${staticFile('plex-mono-500.woff2')}) format('woff2');font-weight:500}
`}</style>
);

// Text that rises out of a mask (no letter-by-letter typing).
const Rise: React.FC<{p: number; children: React.ReactNode; style?: React.CSSProperties}> = ({p, children, style}) => (
  <div style={{overflow: 'hidden', paddingBottom: '0.08em', ...style}}>
    <div style={{transform: `translateY(${(1 - p) * 105}%)`}}>{children}</div>
  </div>
);

// The hook frame. Frame 0 and the loop's last frame both draw exactly this.
const HookFrame: React.FC<{props: PileUpProps; exit: number}> = ({props, exit}) => (
  <AbsoluteFill style={{background: C.ink, justifyContent: 'center', alignItems: 'center'}}>
    <div style={{width: 900, display: 'flex', flexDirection: 'column', gap: 34}}>
      <Rise p={1 - exit}>
        <div style={{fontFamily: 'Plex', fontSize: 32, letterSpacing: 4, color: C.mint, textTransform: 'uppercase'}}>{props.kicker}</div>
      </Rise>
      {props.hook.map((l, i) => (
        <Rise key={i} p={1 - ramp(exit * 10, i * 1.2, i * 1.2 + 6, IO)}>
          <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 112, lineHeight: 1.02, color: C.paper, letterSpacing: -2}}>{l}</div>
        </Rise>
      ))}
    </div>
  </AbsoluteFill>
);

// Rolling counter: the new digit rises in, the old one rises out.
const Counter: React.FC<{f: number; props: PileUpProps}> = ({f, props}) => {
  const arrivals = props.items.map((_, i) => T.firstItem + i * T.itemGap + 3);
  const n = arrivals.filter((a) => f >= a).length;
  const last = n ? arrivals[n - 1] : T.counterIn;
  const t = n ? ramp(f, last, last + 10, IO) : 1;
  return (
    <div style={{position: 'relative', height: 300, width: 600, textAlign: 'center'}}>
      {n > 0 && t < 1 && (
        <div style={{position: 'absolute', inset: 0, opacity: 1 - Math.min(1, t * 2.2), transform: `translateY(${-t * 10}%)`}}>{n - 1}</div>
      )}
      <div style={{position: 'absolute', inset: 0, opacity: n ? Math.max(0, (t - 0.3) / 0.7) : 1, transform: `translateY(${n ? (1 - t) * 10 : 0}%)`}}>{n}</div>
    </div>
  );
};

const Mark: React.FC<{f: number; color: string; size: number}> = ({f, color, size}) => {
  const ring = (i: number) => ramp(f, T.rings + i * 6, T.rings + i * 6 + 22, IO);
  const line = ramp(f, T.rings + 10, T.ringsEnd, OUT);
  return (
    <svg viewBox="0 0 1024 1024" width={size} height={size} fill="none" stroke={color} strokeWidth={6}>
      {[123, 194, 265].map((r, i) => (
        <circle key={r} cx={512} cy={512} r={r} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - ring(i)}
          transform="rotate(-90 512 512)" />
      ))}
      {['M512 460V199', 'M512 564V825', 'M460 512H199', 'M564 512H825'].map((d) => (
        <path key={d} d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - line} />
      ))}
      <circle cx={512} cy={512} r={20} fill={color} stroke="none" />
    </svg>
  );
};

export const PileUp: React.FC<PileUpProps> = (props) => {
  const f = useCurrentFrame();
  const cx = 540, cy = 960;
  const exit = ramp(f, T.hookOut, T.hookOut + 20, IO);
  const col = ramp(f, T.collapse, T.collapseEnd, IN);
  const cam = 1 + 0.05 * ramp(f, T.counterIn, T.collapse, IO);
  const burst = ramp(f, T.burst, T.burstEnd, IO);
  const markMove = ramp(f, T.burst + 6, T.burstEnd + 10, IO);
  const markScale = 1 - 0.5 * markMove;
  const markY = -330 * markMove;
  const proof = ramp(f, T.proofIn, T.proofEnd, IO);
  const loop = ramp(f, T.loop, T.total - 1, IO);
  const counterIn = ramp(f, T.counterIn, T.counterIn + 12);

  // Mark: dot first (as the pile lands on it), then rings. Dot size in px at mark size 560: 20/1024*560 ≈ 11.
  const dot = ramp(f, T.dotIn, T.collapseEnd);
  const markSize = 600;
  const markLayer = (color: string) => (
    <div style={{position: 'absolute', left: cx - markSize / 2, top: cy - markSize / 2, width: markSize, height: markSize,
      transform: `translateY(${markY}px) scale(${markScale})`}}>
      {f >= T.rings ? <Mark f={f} color={color} size={markSize} /> : (
        <svg viewBox="0 0 1024 1024" width={markSize} height={markSize}><circle cx={512} cy={512} r={20 * dot} fill={color} /></svg>
      )}
    </div>
  );

  return (
    <AbsoluteFill style={{background: C.ink, overflow: 'hidden'}}>
      <Fonts />

      {/* 1. Hook */}
      {f < T.hookOut + 22 && <HookFrame props={props} exit={exit} />}

      {/* 2. Pile-up with counter, then 3. collapse into the dot */}
      {f >= T.counterIn && f < T.collapseEnd + 1 && (
        <AbsoluteFill style={{transform: `scale(${cam})`}}>
          <div style={{position: 'absolute', left: cx, top: cy, transform: `translate(-50%,-50%) scale(${1 - 0.95 * col})`,
            opacity: counterIn * (1 - ramp(col, 0.6, 1, IO)), display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 290, lineHeight: 1, color: C.mint, fontVariantNumeric: 'tabular-nums',
              transform: `translateY(${(1 - counterIn) * 40}px)`}}>
              <Counter f={f} props={props} />
            </div>
            <div style={{fontFamily: 'Archivo', fontWeight: 700, fontSize: 46, color: C.paper, marginTop: 6}}>{props.caption}</div>
          </div>
          {props.items.map((it, i) => {
            const a = T.firstItem + i * T.itemGap;
            const p = ramp(f, a, a + 10);
            if (p <= 0) return null;
            const dx = it.x - cx, dy = it.y - cy;
            const dist = Math.hypot(dx, dy) || 1;
            const push = (1 - p) * 46;
            const x = it.x + (dx / dist) * push + (cx - it.x) * col;
            const y = it.y + (dy / dist) * push + (cy - it.y) * col;
            const shift = it.anchor === 'l' ? '0%' : it.anchor === 'r' ? '-100%' : '-50%';
            const anchorFix = col * (it.anchor === 'l' ? -50 : it.anchor === 'r' ? 50 : 0);
            return (
              <div key={i} style={{position: 'absolute', left: x, top: y,
                transform: `translate(calc(${shift} + ${anchorFix}%), -50%) rotate(${it.r * (1 - col)}deg) scale(${(0.94 + 0.06 * p) * (1 - 0.92 * col)})`,
                opacity: p * (1 - ramp(col, 0.55, 0.95, IO)),
                background: it.mint ? C.mint : C.paper, color: C.ink, border: `3px solid ${C.ink}`, borderRadius: 14,
                padding: '12px 22px', fontFamily: 'Plex', fontWeight: 500, fontSize: 40, whiteSpace: 'nowrap'}}>
                {it.text}
              </div>
            );
          })}
        </AbsoluteFill>
      )}

      {/* 4. Dot → rings (paper on ink) */}
      {f >= T.dotIn && f < T.proofEnd + 1 && markLayer(C.paper)}

      {/* 5. Mint burst from the dot; the mark turns ink as the wave passes it */}
      {f >= T.burst && f < T.proofEnd + 1 && (
        <AbsoluteFill style={{background: C.mint, clipPath: `circle(${burst * 1150}px at ${cx}px ${cy}px)`}}>
          {markLayer(C.ink)}
          <div style={{position: 'absolute', top: 1010, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 44}}>
            <Rise p={ramp(f, T.answerIn, T.answerIn + 18)}>
              <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 200, lineHeight: 1, color: C.ink, letterSpacing: -5}}>{props.answer}</div>
            </Rise>
            <div style={{opacity: ramp(f, T.pillIn, T.pillIn + 12), transform: `translateY(${(1 - ramp(f, T.pillIn, T.pillIn + 14)) * 26}px)`,
              background: C.ink, color: C.mint, borderRadius: 999, padding: '18px 34px', fontFamily: 'Plex', fontWeight: 500, fontSize: 34}}>
              {props.pill}
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* 6. Proof, then 7. end card, on paper wiping up from the bottom */}
      {f >= T.proofIn && (
        <AbsoluteFill style={{background: C.paper, clipPath: `inset(${(1 - proof) * 100}% 0 0 0)`}}>
          {f < T.endIn + 4 && (
            <div style={{position: 'absolute', left: 90, right: 90, top: 640, display: 'flex', flexDirection: 'column', gap: 56}}>
              <Rise p={ramp(f, T.proofEnd - 6, T.proofEnd + 8) * (1 - ramp(f, T.proofOut, T.proofOut + 10, IO))}>
                <div style={{fontFamily: 'Plex', fontSize: 32, letterSpacing: 4, color: '#3E6B55', textTransform: 'uppercase'}}>{props.proofKicker}</div>
              </Rise>
              {props.proof.map((p, i) => {
                const a = T.proofEnd + i * 10;
                const v = ramp(f, a, a + 16) * (1 - ramp(f, T.proofOut + i * 3, T.proofOut + i * 3 + 10, IO));
                return (
                  <Rise key={i} p={v}>
                    <div style={{display: 'flex', alignItems: 'baseline', gap: 30, borderTop: `4px solid ${C.ink}`, paddingTop: 22}}>
                      <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 190, lineHeight: 1, color: C.ink, letterSpacing: -4}}>{p.big}</div>
                      <div style={{fontFamily: 'Archivo', fontWeight: 700, fontSize: 54, lineHeight: 1.15, color: C.ink}}>{p.text}</div>
                    </div>
                  </Rise>
                );
              })}
            </div>
          )}
          {f >= T.endIn && (
            <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 40}}>
              {(() => {
                const v = ramp(f, T.endIn, T.endIn + 18);
                return (
                  <>
                    <div style={{opacity: v, transform: `translateY(${(1 - v) * 40}px) rotate(-2deg)`, width: 600, border: `4px solid ${C.ink}`, borderRadius: 20, overflow: 'hidden'}}>
                      <Img src={staticFile('cover-videobrief.jpg')} style={{width: '100%', display: 'block'}} />
                    </div>
                    <Rise p={ramp(f, T.endIn + 6, T.endIn + 22)}>
                      <div style={{fontFamily: 'Newsreader', fontWeight: 600, fontSize: 92, color: C.ink}}>{props.endTitle}</div>
                    </Rise>
                    <Rise p={ramp(f, T.endIn + 10, T.endIn + 26)}>
                      <div style={{fontFamily: 'Plex', fontWeight: 500, fontSize: 36, color: C.ink, background: C.mint, padding: '10px 22px', borderRadius: 12}}>{props.endSub}</div>
                    </Rise>
                  </>
                );
              })()}
            </div>
          )}
        </AbsoluteFill>
      )}

      {/* 8. Loop: ink wipes down from the top and lands exactly on frame 0 */}
      {f >= T.loop && (
        <AbsoluteFill style={{clipPath: `inset(0 0 ${(1 - loop) * 100}% 0)`}}>
          <HookFrame props={props} exit={0} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
