// PHONE LAUNCH-FILM reference format (The Exact Method), rebuilt 10 Nov 2026 from the approved
// render phone-scene-test-v2 (Narrowing Method demo). Borrowed from francoxavier33's Momwise film on
// prompt-motion: three chapters, each a big headline that moves up to make room for the proof.
//   Ch1  headline → phone rises with a real AI answer → phone blurs, one answer card lifts out
//   Ch2  headline → numbered step cards drop into a stack → the last one turns mint
//   Ch3  the PDF: cover, title, "Free PDF" → loops back to frame 0
// Frame 0 = chapter 1 headline fully set (hook on the first frame, loop lands on it).
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';

const C = {paper: '#ECE8DD', card: '#FFFDF7', ink: '#181714', green: '#2F7A52', mint: '#6BE0A0', muted: '#6F695D', rule: '#DCD5C4'};
const OUT = Easing.bezier(0.22, 1, 0.36, 1);
const IO = Easing.bezier(0.65, 0, 0.35, 1);
const r = (f: number, a: number, b: number, e = OUT) =>
  interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});

export type PhoneFilmProps = {
  h1: [string, string, string]; // plain, accent (green italic), plain
  ask: string; // the user's message in the phone
  answerIntro: string;
  list: string[];
  card: {kicker: string; count: string; before: string; accent: string; chips: string[]; button: string};
  h2: [string, string, string]; // line 1, accent word, rest of line 2
  steps: {title: string; sub: string}[];
  caption: [string, string, string]; // before, accent, after
  end: [string, string]; // title line, accent line
  endChip: string;
  cover: string; // file in public/
};

export const PT = {
  h1Up: 20, phoneIn: 24, scroll: 66, scrollEnd: 140,
  blur: 140, cardIn: 146, chips: 176, pick: 204, ch1Out: 240,
  h2In: 262, h2Up: 290, steps: 300, stepGap: 14, checks: 330, captionIn: 372, ch2Out: 400,
  endIn: 414, loop: 460, total: 486,
};

const Fonts: React.FC = () => (
  <style>{`
@font-face{font-family:Archivo;src:url(${staticFile('archivo-variable.woff2')}) format('woff2');font-weight:100 900;font-stretch:62% 125%}
@font-face{font-family:Newsreader;src:url(${staticFile('newsreader-variable.woff2')}) format('woff2');font-weight:200 800;font-style:normal italic}
@font-face{font-family:Plex;src:url(${staticFile('plex-mono-500.woff2')}) format('woff2');font-weight:500}
`}</style>
);

const Rise: React.FC<{p: number; children: React.ReactNode; style?: React.CSSProperties}> = ({p, children, style}) => (
  <div style={{overflow: 'hidden', paddingBottom: '0.12em', ...style}}>
    <div style={{transform: `translateY(${(1 - p) * 110}%)`}}>{children}</div>
  </div>
);

// Green italic accent with a hand-drawn underline that draws in.
const Accent: React.FC<{text: string; draw: number; size: number}> = ({text, draw, size}) => (
  <span style={{position: 'relative', fontFamily: 'Newsreader', fontStyle: 'italic', fontWeight: 500, color: C.green, fontSize: size * 1.02}}>
    {text}
    <svg viewBox="0 0 100 10" preserveAspectRatio="none" style={{position: 'absolute', left: '-2%', bottom: '-0.04em', width: '104%', height: size * 0.12}}>
      <path d="M1 6 C 25 3, 55 8, 99 4" fill="none" stroke={C.green} strokeWidth={1.6} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} />
    </svg>
  </span>
);

const Head: React.FC<{lines: React.ReactNode[]; ps: number[]; size: number}> = ({lines, ps, size}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
    {lines.map((l, i) => (
      <Rise key={i} p={ps[i]}>
        <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: size, lineHeight: 1.04, color: C.ink, letterSpacing: -1.5, whiteSpace: 'nowrap'}}>{l}</div>
      </Rise>
    ))}
  </div>
);

const Phone: React.FC<{p: PhoneFilmProps; scroll: number}> = ({p, scroll}) => (
  <div style={{width: 600, height: 1220, borderRadius: 78, border: `9px solid ${C.ink}`, background: C.card, overflow: 'hidden', position: 'relative'}}>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '26px 44px 0', fontFamily: 'Archivo', fontWeight: 700, fontSize: 24}}>
      <span>9:41</span><span style={{width: 150, height: 40, borderRadius: 20, background: C.ink}} /><span>•••</span>
    </div>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '22px 40px 10px'}}>
      <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 36}}>Chat</span>
      <span style={{fontFamily: 'Plex', fontSize: 20, color: C.muted}}>your A.I. tool</span>
    </div>
    <div style={{position: 'absolute', top: 170, left: 0, right: 0, bottom: 110, overflow: 'hidden'}}>
      <div style={{transform: `translateY(${-scroll}px)`, padding: '0 40px'}}>
        <div style={{marginLeft: 'auto', width: 'fit-content', maxWidth: 420, background: C.ink, color: C.card, borderRadius: 18, padding: '14px 20px', fontFamily: 'Archivo', fontWeight: 600, fontSize: 24, lineHeight: 1.25}}>{p.ask}</div>
        <div style={{fontFamily: 'Newsreader', fontSize: 26, margin: '22px 0 8px'}}>{p.answerIntro}</div>
        {p.list.map((it, i) => (
          <div key={i} style={{display: 'flex', gap: 12, fontFamily: 'Newsreader', fontSize: 25, padding: '7px 0', borderBottom: `1.5px solid ${C.rule}`}}>
            <span style={{color: C.muted, width: 34, textAlign: 'right'}}>{i + 1}.</span><span>{it}</span>
          </div>
        ))}
      </div>
    </div>
    <div style={{position: 'absolute', left: 30, right: 30, bottom: 34, height: 64, borderRadius: 32, border: `2px solid ${C.rule}`, fontFamily: 'Archivo', fontSize: 22, color: C.muted, display: 'flex', alignItems: 'center', paddingLeft: 26}}>Ask anything…</div>
  </div>
);

const Check: React.FC<{d: number; color?: string}> = ({d, color = C.green}) => (
  <svg viewBox="0 0 24 24" width={40} height={40} fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - d} />
  </svg>
);

export const PhoneFilm: React.FC<PhoneFilmProps> = (p) => {
  const f = useCurrentFrame();
  const T = PT;

  // Chapter 1 ----------------------------------------------------------------
  const loopIn = r(f, T.loop, T.total - 1, IO); // headline coming back for the loop
  const h1In = f < T.loop ? 1 : loopIn;
  const up = f < T.loop ? r(f, T.h1Up, T.h1Up + 24, IO) : 0;
  const h1Out = f < T.loop ? r(f, T.ch1Out + 4, T.ch1Out + 22, IO) : 0;
  const h1Size = 120;
  const h1Scale = 1 - 0.42 * up;
  const h1Y = 860 - 640 * up;
  const phoneP = r(f, T.phoneIn, T.phoneIn + 46, Easing.bezier(0.33, 0, 0.2, 1));
  const scroll = interpolate(f, [T.scroll, T.scrollEnd], [0, 470], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: IO});
  const blur = r(f, T.blur, T.blur + 16, IO);
  const cardP = r(f, T.cardIn, T.cardIn + 20);
  const picked = r(f, T.pick, T.pick + 10, IO);
  const ch1Exit = r(f, T.ch1Out, T.ch1Out + 32, Easing.bezier(0.5, 0, 0.75, 0.3));
  const draw1 = f < T.loop ? 1 : r(f, T.loop + 12, T.total - 1, IO);

  // Chapter 2 ----------------------------------------------------------------
  const h2P = r(f, T.h2In, T.h2In + 20);
  const h2Up = r(f, T.h2Up, T.h2Up + 22, IO);
  const ch2Out = r(f, T.ch2Out, T.ch2Out + 18, IO);

  // Chapter 3 ----------------------------------------------------------------
  const endOut = r(f, T.loop, T.loop + 10, IO);

  return (
    <AbsoluteFill style={{background: C.paper, backgroundImage: `repeating-linear-gradient(0deg, transparent 0 63px, ${C.rule}88 63px 65px)`}}>
      <Fonts />

      {/* CH1 */}
      {(f < T.ch1Out + 34 || f >= T.loop) && (
        <>
          <div style={{position: 'absolute', left: 0, right: 0, top: h1Y, transform: `translateY(-50%) scale(${h1Scale})`, transformOrigin: '50% 50%', opacity: 1 - h1Out}}>
            <Head size={h1Size}
              ps={[0, 1, 2].map((i) => (f < T.loop ? 1 - r(f, T.ch1Out + i * 3, T.ch1Out + i * 3 + 16, IO) : r(f, T.loop + 8 + i * 2, T.loop + 8 + i * 2 + 12)))}
              lines={[p.h1[0], <Accent key="a" text={p.h1[1]} draw={draw1 * h1In} size={h1Size} />, p.h1[2]]} />
          </div>
          {f >= T.phoneIn && f < T.loop && (
            <div style={{position: 'absolute', left: 240, top: 560 + (1 - phoneP) * 1300 + ch1Exit * 1300,
              filter: `blur(${blur * 7}px)`, opacity: 1 - 0.35 * blur}}>
              <Phone p={p} scroll={scroll} />
            </div>
          )}
          {f >= T.cardIn && f < T.loop && (
            <div style={{position: 'absolute', left: 100, right: 100, top: 760,
              transform: `translateY(${(1 - cardP) * 70 + ch1Exit * 900}px) rotate(${(1 - cardP) * -2.5}deg)`, opacity: cardP,
              background: C.card, border: `4px solid ${C.ink}`, borderRadius: 26, padding: '30px 36px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: 'Plex', fontSize: 22, color: C.muted}}>
                <span>{p.card.kicker}</span>
                <span style={{color: picked > 0.5 ? C.green : C.muted}}>{picked > 0.5 ? 'picked' : p.card.count}</span>
              </div>
              <div style={{fontFamily: 'Newsreader', fontSize: 50, lineHeight: 1.15, margin: '16px 0 22px'}}>
                {p.card.before} <i>{p.card.accent}</i>
              </div>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12}}>
                <div style={{display: 'flex', gap: 10}}>
                  {p.card.chips.map((c, i) => {
                    const v = r(f, T.chips + i * 6, T.chips + i * 6 + 12);
                    return <span key={c} style={{opacity: v, transform: `translateY(${(1 - v) * 14}px)`, border: `2.5px solid ${C.ink}`, borderRadius: 10, padding: '4px 12px', fontFamily: 'Archivo', fontWeight: 700, fontSize: 22}}>{c}</span>;
                  })}
                </div>
                <span style={{position: 'relative', borderRadius: 999, border: `3px solid ${C.ink}`, padding: '10px 26px', fontFamily: 'Archivo', fontWeight: 800, fontSize: 26,
                  background: `linear-gradient(90deg, ${C.mint} ${picked * 100}%, ${C.card} ${picked * 100}%)`, display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap'}}>
                  <span style={{width: 26 * picked, overflow: 'hidden', display: 'inline-flex'}}><Check d={picked} color={C.ink} /></span>
                  {p.card.button}
                </span>
              </div>
            </div>
          )}
        </>
      )}

      {/* CH2 */}
      {f >= T.h2In && f < T.ch2Out + 20 && (
        <>
          <div style={{position: 'absolute', left: 0, right: 0, top: 860 - 600 * h2Up, transform: `translateY(-50%) scale(${1 - 0.3 * h2Up})`}}>
            <Head size={124} ps={[h2P * (1 - ch2Out), r(f, T.h2In + 4, T.h2In + 24) * (1 - r(f, T.ch2Out + 3, T.ch2Out + 21, IO))]}
              lines={[p.h2[0], <span key="b"><Accent text={p.h2[1]} draw={r(f, T.h2In + 14, T.h2In + 34, IO)} size={124} /> {p.h2[2]}</span>]} />
          </div>
          <div style={{position: 'absolute', left: 90, right: 90, top: 560, display: 'flex', flexDirection: 'column', gap: 26}}>
            {p.steps.map((s, i) => {
              const a = T.steps + i * T.stepGap;
              const v = r(f, a, a + 18);
              const last = i === p.steps.length - 1;
              const mint = last ? r(f, T.checks + 24, T.checks + 44, IO) : 0;
              const chk = r(f, T.checks + i * 14, T.checks + i * 14 + 12, IO);
              const out = r(f, T.ch2Out + i * 3, T.ch2Out + i * 3 + 16, IO);
              return (
                <div key={i} style={{opacity: v * (1 - out), transform: `translateY(${(1 - v) * -90 - out * 40}px) rotate(${(1 - v) * (i % 2 ? 3 : -3)}deg)`,
                  background: `color-mix(in srgb, ${C.mint} ${mint * 100}%, ${C.card})`, border: `4px solid ${C.ink}`, borderRadius: 20,
                  padding: '22px 30px', display: 'flex', alignItems: 'center', gap: 24}}>
                  <span style={{width: 58, height: 58, borderRadius: 29, border: `3.5px solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Archivo', fontWeight: 800, fontSize: 30}}>{i + 1}</span>
                  <div style={{flex: 1}}>
                    <div style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 44}}>{s.title}</div>
                    <div style={{fontFamily: 'Plex', fontSize: 24, color: C.muted}}>{s.sub}</div>
                  </div>
                  <Check d={chk} color={last ? C.ink : C.green} />
                </div>
              );
            })}
            <div style={{textAlign: 'center', marginTop: 24, fontFamily: 'Newsreader', fontSize: 40, color: C.muted,
              opacity: r(f, T.captionIn, T.captionIn + 14) * (1 - ch2Out)}}>
              {p.caption[0]} <i style={{color: C.green}}>{p.caption[1]}</i>{p.caption[2]}
            </div>
          </div>
        </>
      )}

      {/* CH3 */}
      {f >= T.endIn && f < T.loop + 11 && (
        <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 40, opacity: 1 - endOut}}>
          {(() => {
            const v = r(f, T.endIn, T.endIn + 20);
            return (
              <div style={{opacity: v, transform: `translateY(${(1 - v) * 50 - endOut * 30}px) rotate(-2deg)`, width: 300, border: `4px solid ${C.ink}`, borderRadius: 14, overflow: 'hidden', background: C.card}}>
                <Img src={staticFile(p.cover)} style={{width: '100%', display: 'block'}} />
              </div>
            );
          })()}
          <Head size={116} ps={[r(f, T.endIn + 6, T.endIn + 24), r(f, T.endIn + 10, T.endIn + 28)]}
            lines={[p.end[0], <Accent key="e" text={p.end[1]} draw={r(f, T.endIn + 20, T.endIn + 40, IO)} size={116} />]} />
          <Rise p={r(f, T.endIn + 22, T.endIn + 36)}>
            <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 32, background: C.mint, border: `3px solid ${C.ink}`, borderRadius: 10, padding: '6px 18px'}}>{p.endChip}</span>
          </Rise>
        </div>
      )}
    </AbsoluteFill>
  );
};
