// N-2 "Don't spend $1" — built from the phone launch-film reference (PhoneFilm2.tsx).
// Same modules: headline rise + caret + marker swipe, phone scroll → blur → tilted result card + badge + toast,
// helper cards + push notification, thread header + bubble + joins + counter + list card with chips,
// fan of cards + result card, checklist with ticks/strike-through + "You" cursor click, mark draw + benefits,
// app tile + chip, loop back into frame 0.
import React from 'react';
import {AbsoluteFill, Audio, Easing, interpolate, staticFile, useCurrentFrame} from 'remotion';

const C = {paper: '#ECE8DD', card: '#FFFDF7', ink: '#181714', green: '#2F7A52', mint: '#6BE0A0', gold: '#F2B632', muted: '#6F695D', rule: '#DCD5C4', dark: '#10261C', sage: '#9CC9B0'};
const OUT = Easing.bezier(0.42, 0, 0.18, 1); // soft start: big slides no longer jump on their first frames
const IO = Easing.bezier(0.65, 0, 0.35, 1);
const r = (f: number, a: number, b: number, e = OUT) =>
  interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// line starts (frames) from the real voice files; end of last word; total (loop lands on frame 0)
const L = [2, 128, 238, 325, 420, 622, 727, 857, 949, 1040, 1132];
export const N2_TOTAL = 1192;
const END = 1187;

type W = {t: string; a?: 1 | 2};
const w = (t: string, a?: 1 | 2): W => ({t, a});

const Fonts: React.FC = () => (
  <style>{`
@font-face{font-family:Archivo;src:url(${staticFile('archivo-variable.woff2')}) format('woff2');font-weight:100 900;font-stretch:62% 125%}
@font-face{font-family:Newsreader;src:url(${staticFile('newsreader-variable.woff2')}) format('woff2');font-weight:200 800;font-style:normal italic}
@font-face{font-family:Plex;src:url(${staticFile('plex-mono-500.woff2')}) format('woff2');font-weight:500}
`}</style>
);

const Headline: React.FC<{lines: W[][]; f: number; start: number; size: number; full?: boolean; step?: number; dur?: number; caret?: boolean; times?: number[]}> = ({lines, f, start, size, full, step = 4, dur = 12, caret = true, times}) => {
  const at = (i: number) => (times ? times[i] - 3 : start + i * step);
  let k = 0;
  const total = lines.flat().length;
  // caret rides on the newest word: fades in on that word, fades out as the next one rises (no 1-frame jumps, no blink)
  const caretA = (idx: number) => {
    if (!caret || full) return 0;
    const s0 = at(idx);
    const inA = r(f, s0 + 3, s0 + 7, IO);
    const outA = idx < total - 1 ? r(f, at(idx + 1) + 3, at(idx + 1) + 7, IO) : r(f, at(total - 1) + 24, at(total - 1) + 34, IO);
    return inA * (1 - outA);
  };
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      {lines.map((line, li) => (
        <div key={li} style={{display: 'flex', gap: size * 0.24, alignItems: 'baseline'}}>
          {line.map((wd, wi) => {
            const idx = k++;
            const p = full ? 1 : r(f, at(idx), at(idx) + dur);
            const sw = full ? 1 : r(f, at(idx) + dur * 0.6, at(idx) + dur * 1.6, IO);
            const accent = wd.a;
            return (
              <span key={wi} style={{position: 'relative', display: 'inline-block', overflow: 'hidden', paddingBottom: size * 0.12, marginBottom: -size * 0.12,
                paddingRight: accent ? size * 0.14 : 0, marginRight: accent ? -size * 0.14 : 0, paddingLeft: accent ? size * 0.04 : 0, marginLeft: accent ? -size * 0.04 : 0}}>
                {accent && <span style={{position: 'absolute', left: -6, right: -6, bottom: size * 0.16, height: size * 0.32, background: accent === 1 ? C.mint : C.gold,
                  transform: `scaleX(${sw}) rotate(-1.2deg)`, transformOrigin: 'left center', borderRadius: 6, opacity: 0.85}} />}
                <span style={{position: 'relative', display: 'inline-block', transform: `translateY(${(1 - p) * 105}%)`,
                  fontFamily: accent ? 'Newsreader' : 'Archivo', fontStyle: accent ? 'italic' : 'normal', fontWeight: accent ? 500 : 900,
                  fontSize: accent ? size * 1.08 : size, lineHeight: 1.08, letterSpacing: accent ? -1 : -2, color: accent ? C.green : C.ink}}>
                  {wd.t}
                </span>
                {caretA(idx) > 0 && (
                  <span style={{position: 'absolute', right: -size * 0.12, top: size * 0.14, width: size * 0.06, height: size * 0.92, background: C.green, opacity: caretA(idx)}} />
                )}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// headline big in the centre → shrinks to the top; the whole chapter blurs out at `out`
const Chapter: React.FC<{f: number; a: number; up: number; out: number; lines: W[][]; size?: number; topY?: number; scaleTo?: number; times?: number[]; children?: React.ReactNode}> =
  ({f, a, up, out, lines, size = 124, topY = 300, scaleTo = 0.75, times, children}) => {
    const u = r(f, up, up + 26, Easing.bezier(0.45, 0, 0.25, 1));
    const o = r(f, out, out + 10, IO);
    if (o >= 1) return null;
    return (
      <AbsoluteFill style={{opacity: 1 - o, filter: o > 0 ? `blur(${o * 16}px)` : undefined, transform: `scale(${1 + o * 0.04})`}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: lerp(860, topY, u), transform: `translateY(-50%) scale(${lerp(1, scaleTo, u)})`}}>
          <Headline lines={lines} f={f} start={a} size={size} times={times} />
        </div>
        {children}
      </AbsoluteFill>
    );
  };

const Avatar: React.FC<{t: string; tone: string; s?: number; ring?: boolean}> = ({t, tone, s = 44, ring}) => (
  <span style={{width: s, height: s, borderRadius: s, background: tone, border: ring ? `3px solid ${C.card}` : `2px solid ${C.ink}`, display: 'inline-flex', alignItems: 'center',
    justifyContent: 'center', fontFamily: 'Archivo', fontWeight: 800, fontSize: s * 0.42, color: C.ink, flex: 'none'}}>{t}</span>
);

const Mark: React.FC<{size: number; color: string; draw?: number}> = ({size, color, draw = 1}) => (
  <svg viewBox="0 0 1024 1024" width={size} height={size} fill="none" stroke={color} strokeWidth={size < 160 ? 30 : 14}>
    {[123, 194, 265].map((rr, i) => (
      <circle key={rr} cx={512} cy={512} r={rr} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.min(1, Math.max(0, draw * 1.5 - i * 0.25))} transform="rotate(-90 512 512)" />
    ))}
    {['M512 460V199', 'M512 564V825', 'M460 512H199', 'M564 512H825'].map((d) => (
      <path key={d} d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.min(1, Math.max(0, draw * 1.6 - 0.6))} />
    ))}
    <circle cx={512} cy={512} r={24 * Math.min(1, draw * 2)} fill={color} stroke="none" />
  </svg>
);

const Check: React.FC<{d: number; color?: string; s?: number}> = ({d, color = C.green, s = 34}) => (
  <svg viewBox="0 0 24 24" width={s} height={s} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.5l4.5 4.5L19 7" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - d} />
  </svg>
);

type IK = 'cup' | 'cam' | 'ring';
const Icon: React.FC<{k: IK}> = ({k}) => (
  <svg viewBox="0 0 64 64" width={120} height={120} fill="none" stroke={C.ink} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
    {k === 'cup' && <><path d="M12 24h32v14a12 12 0 0 1-12 12h-8a12 12 0 0 1-12-12z" /><path d="M44 28h4a6 6 0 0 1 0 12h-5" /><path d="M22 10c-2 3 2 5 0 8M32 10c-2 3 2 5 0 8" /></>}
    {k === 'cam' && <><rect x={8} y={20} width={34} height={26} rx={5} /><path d="M42 29l14-8v22l-14-8z" /><circle cx={19} cy={14} r={4} /><circle cx={31} cy={14} r={4} /></>}
    {k === 'ring' && <><circle cx={32} cy={38} r={16} /><path d="M24 16l8-8 8 8-8 8z" /></>}
  </svg>
);

const card: React.CSSProperties = {background: C.card, border: `4px solid ${C.ink}`, borderRadius: 28};

// ---------- the phone (frame 0 hero) ----------
const PHONE = {ask: 'Give me a business idea I could start', title: 'Start a dropshipping store.',
  body: 'Pick a trending product, build a store and run ads to it.',
  steps: ['Find a supplier', 'Build the store', 'Run ads', 'Scale what sells'], need: "You'll need: money for stock and ads."};

const Phone: React.FC<{scroll: number; hl: number; blur?: number; y: number; stamp: number}> = ({scroll, hl, blur = 0, y, stamp}) => (
  <div style={{position: 'absolute', left: 170, top: y, width: 740, height: 1300, ...card, borderWidth: 11, borderRadius: 92, overflow: 'hidden',
    filter: blur > 0 ? `blur(${blur * 9}px)` : undefined, opacity: 1 - blur * 0.35}}>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '28px 54px 0', fontFamily: 'Archivo', fontWeight: 700, fontSize: 28}}>
      <span>9:41</span><span style={{width: 170, height: 44, borderRadius: 22, background: C.ink}} /><span>●●●</span>
    </div>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '22px 46px 10px', borderBottom: `2px solid ${C.rule}`}}>
      <span style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 52}}>Chat</span>
      <span style={{fontFamily: 'Plex', fontSize: 26, color: C.green, display: 'flex', alignItems: 'center', gap: 10}}>
        <span style={{width: 12, height: 12, borderRadius: 9, background: C.mint}} />your AI tool</span>
    </div>
    <div style={{position: 'absolute', top: 196, left: 0, right: 0, bottom: 0, overflow: 'hidden'}}>
      <div style={{transform: `translateY(${-scroll}px)`, padding: '34px 46px 0'}}>
        <div style={{marginLeft: 'auto', width: 'fit-content', maxWidth: 520, background: C.ink, color: C.card, borderRadius: 24, padding: '20px 26px', fontFamily: 'Archivo', fontWeight: 600, fontSize: 34, lineHeight: 1.2}}>{PHONE.ask}</div>
        <div style={{position: 'relative', marginTop: 40, display: 'inline-block'}}>
          <span style={{position: 'absolute', left: -8, right: -8, top: 8, bottom: 2, background: C.gold, opacity: 0.85, borderRadius: 6, transform: `scaleX(${hl}) rotate(-0.8deg)`, transformOrigin: 'left center'}} />
          <span style={{position: 'relative', fontFamily: 'Newsreader', fontWeight: 600, fontSize: 50, lineHeight: 1.15}}>{PHONE.title}</span>
        </div>
        <div style={{fontFamily: 'Newsreader', fontSize: 38, lineHeight: 1.3, color: C.muted, marginTop: 14}}>{PHONE.body}</div>
        {PHONE.steps.map((s, i) => (
          <div key={i} style={{display: 'flex', gap: 16, fontFamily: 'Newsreader', fontSize: 38, padding: '12px 0', borderBottom: `2px solid ${C.rule}`}}>
            <span style={{color: C.muted, width: 40}}>{i + 1}.</span><span>{s}</span>
          </div>
        ))}
        <div style={{marginTop: 26, background: '#F7E7B4', border: `3px solid ${C.ink}`, borderRadius: 20, padding: '18px 24px', fontFamily: 'Archivo', fontWeight: 700, fontSize: 36, lineHeight: 1.2}}>{PHONE.need}</div>
      </div>
    </div>
    {stamp > 0 && (
      <div style={{position: 'absolute', right: 34, top: 112, transform: `rotate(${lerp(-24, -9, stamp)}deg) scale(${lerp(1.5, 1, stamp)})`, opacity: Math.min(1, stamp * 2),
        border: `5px solid ${C.green}`, color: C.green, borderRadius: 14, padding: '6px 18px', fontFamily: 'Archivo', fontWeight: 900, fontSize: 34, letterSpacing: 1, background: `${C.card}cc`}}>
        AI'S FIRST IDEA</div>
    )}
  </div>
);

const HOOK: W[][] = [[w("Don't"), w('spend')], [w('$1', 1), w('on'), w('this.', 2)]];
const HOOK_SIZE = 138;
const HOOK_Y = 300;
const PHONE_Y = 560;

// ---------------------------------------------------------------------------------------------
export const N2: React.FC = () => {
  const f = useCurrentFrame();

  return (
    <AbsoluteFill style={{background: C.paper, backgroundImage: `repeating-linear-gradient(0deg, transparent 0 63px, ${C.rule}88 63px 65px)`, overflow: 'hidden'}}>
      <Fonts />
      <Audio src={staticFile('n2-mix.wav')} />

      {/* S1 hook: frame 0 = headline + phone with the first idea highlighted */}
      {f < L[2] + 6 && (() => {
        const o = r(f, L[2] - 6, L[2] + 4, IO);
        const scroll = interpolate(f, [4, L[1] - 6], [0, 70], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: IO});
        const blur = r(f, L[1] - 2, L[1] + 10, IO);
        const res = r(f, L[1] + 2, L[1] + 24);
        const rowAt = [155, 183, 212]; // exact word times
        const badge = r(f, 222, 230, IO);
        const toast = r(f, 212, 226);
        const headUp = r(f, L[1] - 4, L[1] + 12, IO);
        return (
          <AbsoluteFill style={{opacity: 1 - o, filter: o > 0 ? `blur(${o * 16}px)` : undefined}}>
            <div style={{position: 'absolute', left: 0, right: 0, top: lerp(HOOK_Y, 250, headUp), transform: `translateY(-50%) scale(${lerp(1, 0.8, headUp)})`}}>
              <Headline lines={HOOK} f={f} start={0} size={HOOK_SIZE} full caret={false} />
            </div>
            <Phone scroll={scroll} hl={1} blur={blur} y={PHONE_Y} stamp={r(f, 55, 66, IO)} />
            {f >= L[1] + 4 && (
              <div style={{position: 'absolute', left: 70, right: 70, top: 640, ...card, padding: '34px 40px',
                transform: `translateX(${(1 - res) * 520}px) rotate(${(1 - res) * 8 - 1.5}deg)`, opacity: Math.min(1, res * 1.5)}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
                  <span style={{width: 78, height: 78, borderRadius: 20, background: C.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none'}}><Mark size={58} color={C.mint} /></span>
                  <div style={{flex: 1}}>
                    <div style={{fontFamily: 'Plex', fontSize: 28, color: C.muted}}>AI's first idea</div>
                    <div style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 48}}>Dropshipping</div>
                  </div>
                  <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 30, background: C.gold, border: `3px solid ${C.ink}`, borderRadius: 999, padding: '8px 20px',
                    transform: `scale(${0.85 + 0.15 * badge})`, opacity: badge}}>untested</span>
                </div>
                <div style={{marginTop: 22, display: 'grid', gridTemplateColumns: '300px 1fr', rowGap: 0, alignItems: 'center'}}>
                  {[['Your time', '?'], ['Your money', '?'], ['Your skills', '?']].map(([k, v], i) => {
                    const p = r(f, rowAt[i] - 4, rowAt[i] + 8);
                    return (
                      <React.Fragment key={k}>
                        <span style={{fontFamily: 'Plex', fontSize: 34, color: p > 0.5 ? C.ink : C.muted, padding: '14px 0', borderTop: `2px solid ${C.rule}`}}>{k}</span>
                        <span style={{borderTop: `2px solid ${C.rule}`, padding: '10px 0', display: 'flex', alignItems: 'baseline', gap: 14}}>
                          <span style={{fontFamily: 'Newsreader', fontSize: 54, fontStyle: 'italic', color: C.green, lineHeight: 1, opacity: p, transform: `translateY(${(1 - p) * 30}px)`}}>{v}</span>
                          <span style={{fontFamily: 'Archivo', fontWeight: 700, fontSize: 32, color: C.muted, opacity: p}}>unknown</span></span>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            )}
            {f >= 212 && (
              <div style={{position: 'absolute', left: '50%', top: 1290, transform: `translate(-50%, ${(1 - toast) * 90}px)`, opacity: toast, background: C.dark, color: C.card,
                borderRadius: 999, padding: '16px 36px 16px 18px', display: 'flex', alignItems: 'center', gap: 20, whiteSpace: 'nowrap'}}>
                <span style={{display: 'flex'}}>{['?', '?', '?'].map((a, i) => <span key={i} style={{marginLeft: i ? -16 : 0}}><Avatar t={a} tone={[C.mint, C.gold, C.sage][i]} s={60} ring /></span>)}</span>
                <span style={{fontFamily: 'Archivo', fontWeight: 700, fontSize: 38}}>Knows nothing about you</span>
              </div>
            )}
          </AbsoluteFill>
        );
      })()}

      {/* S2: three prompts → helper cards; prompt 1 → notification with 25 ideas */}
      {f >= L[2] && f < 444 && (
        <Chapter f={f} a={L[2]} up={308} out={432} times={[254, 263, 269, 292, 301]} lines={[[w('Narrow'), w('it'), w('down.')], [w('3', 1), w('prompts.')]]}>
          <div style={{position: 'absolute', left: 70, right: 70, top: 470, display: 'flex', flexDirection: 'column', gap: 28}}>
            {[['1', 'Go broad', 'Ask for 25 ideas', C.mint], ['2', 'Add your limits', 'Time, money, skills', C.gold], ['3', 'Pick one', 'And ask why', C.sage]].map(([n, t, s, tone], i) => {
              const v = r(f, 314 + i * 6, 334 + i * 6);
              const focus = r(f, L[3] - 2, L[3] + 12, IO);
              const dim = i === 0 ? 0 : focus;
              return (
                <div key={i} style={{...card, padding: '30px 34px', display: 'flex', alignItems: 'center', gap: 28, borderColor: i === 0 && focus > 0 ? C.green : C.ink,
                  transform: `translateX(${(1 - v) * 700}px) rotate(${(1 - v) * 6}deg) scale(${i === 0 ? 1 + 0.03 * focus : 1 - 0.03 * focus})`, opacity: Math.min(1, v * 2) * (1 - 0.6 * dim)}}>
                  <Avatar t={n} tone={tone} s={96} />
                  <div style={{flex: 1}}>
                    <div style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 54}}>{t}</div>
                    <div style={{fontFamily: 'Newsreader', fontSize: 42, color: C.muted}}>{s}</div>
                  </div>
                  <span style={{fontFamily: 'Archivo', fontSize: 48, color: C.muted}}>›</span>
                </div>
              );
            })}
          </div>
          {(() => {
            const v = r(f, 370, 390);
            return f >= 370 && (
              <div style={{position: 'absolute', left: 70, right: 70, top: 1090, ...card, borderRadius: 36, padding: '28px 32px', display: 'flex', gap: 24,
                transform: `translateY(${(1 - v) * 420}px) rotate(${(1 - v) * -6}deg)`, opacity: Math.min(1, v * 2)}}>
                <span style={{width: 92, height: 92, borderRadius: 24, background: C.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none'}}><Mark size={66} color={C.mint} /></span>
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: 'Plex', fontSize: 28, color: C.muted}}><span>your AI tool</span><span>now</span></div>
                  <div style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 44}}>Here are 25 ideas</div>
                  <div style={{fontFamily: 'Newsreader', fontSize: 38, lineHeight: 1.25, color: C.muted}}>Dropshipping, tutoring, video edits, pet sitting, meal prep…</div>
                </div>
              </div>
            );
          })()}
        </Chapter>
      )}

      {/* S3: your limits → thread with joins + counter → shortlist card with chips */}
      {f >= L[4] && f < 650 && (
        <Chapter f={f} a={L[4]} up={466} out={638} times={[448, 454, 459]} lines={[[w('Add'), w('your')], [w('limits.', 1)]]}>
          {(() => {
            const joinAt = [488, 535, 586];
            const joins = [{i: 'T', t: '15 h a week', tone: C.mint}, {i: '$', t: 'Almost no money', tone: C.gold}, {i: 'S', t: 'Can edit video', tone: C.sage}];
            const head = r(f, 470, 484, IO);
            const n = joinAt.filter((a) => f >= a).length;
            const bub = r(f, 474, 490);
            const lc = r(f, 598, 618);
            return (
              <>
                <div style={{position: 'absolute', left: 70, right: 70, top: 430, ...card, padding: '26px 34px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  transform: `scaleX(${lerp(0.3, 1, head)})`, transformOrigin: 'left center', opacity: head}}>
                  <div style={{opacity: r(head, 0.6, 1)}}>
                    <div style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 46}}>Prompt 2</div>
                    <div style={{fontFamily: 'Plex', fontSize: 30, color: C.muted}}>{n} of 3 limits added</div>
                  </div>
                  <span style={{display: 'flex'}}>
                    {joins.map((j, i) => {
                      const v = r(f, joinAt[i], joinAt[i] + 8);
                      return <span key={i} style={{marginLeft: i ? -14 : 0, opacity: v, transform: `scale(${0.6 + 0.4 * v})`}}><Avatar t={j.i} tone={j.tone} s={64} ring /></span>;
                    })}
                  </span>
                </div>
                <div style={{position: 'absolute', left: 150, right: 70, top: 610, background: '#E3EFE7', border: `3px solid ${C.green}`, borderRadius: 28, padding: '24px 30px',
                  fontFamily: 'Newsreader', fontSize: 42, lineHeight: 1.25, transform: `translateX(${(1 - bub) * 220}px)`, opacity: bub}}>Here are my limits. Cut every idea that doesn't fit.</div>
                <div style={{position: 'absolute', left: 70, right: 70, top: 840, display: 'flex', flexDirection: 'column', gap: 18}}>
                  {joins.map((j, i) => {
                    const v = r(f, joinAt[i], joinAt[i] + 12);
                    return (
                      <div key={i} style={{display: 'flex', alignItems: 'center', gap: 18, opacity: v, transform: `translateX(${(1 - v) * -70}px)`, fontFamily: 'Plex', fontSize: 40}}>
                        <Avatar t={j.i} tone={j.tone} s={58} /><span style={{color: C.green}}>{j.t}</span>
                      </div>
                    );
                  })}
                </div>
                {f >= 598 && (
                  <div style={{position: 'absolute', left: 70, right: 70, top: 1100, ...card, padding: '26px 32px', transform: `translateY(${(1 - lc) * 320}px) rotate(${(1 - lc) * 4}deg)`, opacity: Math.min(1, lc * 2)}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6}}>
                      <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 42}}>What's left</span><span style={{fontFamily: 'Plex', fontSize: 26, color: C.muted}}>example</span></div>
                    {[['01', 'Video edits for cafés'], ['02', 'Reels for local gyms'], ['03', 'Wedding teasers']].map(([a, b], i) => {
                      const chip = r(f, 612 + i * 5, 620 + i * 5, IO);
                      return (
                        <div key={i} style={{display: 'flex', alignItems: 'center', gap: 20, padding: '12px 0', borderTop: `2px solid ${C.rule}`}}>
                          <span style={{fontFamily: 'Plex', fontSize: 30, color: C.muted, width: 56}}>{a}</span>
                          <span style={{flex: 1, fontFamily: 'Newsreader', fontSize: 42}}>{b}</span>
                          <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 28, background: C.mint, border: `3px solid ${C.ink}`, borderRadius: 999, padding: '4px 16px',
                            opacity: chip, transform: `scale(${0.8 + 0.2 * chip})`}}>fits</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            );
          })()}
        </Chapter>
      )}

      {/* S4: which one and why → fan of 3 → one comes forward → "Start here" card */}
      {f >= 640 && f < 908 && (
        <Chapter f={f} a={L[5]} up={676} out={896} times={[660, 667, 702, 708]} lines={[[w('Which', 2), w('one,')], [w('and'), w('why?')]]}>
          {(() => {
            const fan: {label: string; k: IK}[] = [{label: 'Gym reels', k: 'cam'}, {label: 'Café edits', k: 'cup'}, {label: 'Wedding teasers', k: 'ring'}];
            const pick = r(f, 746, 768, IO);
            const res = r(f, 780, 802);
            const badge = r(f, 828, 836, IO);
            return (
              <>
                {fan.map((c, i) => {
                  const v = r(f, 686 + i * 6, 706 + i * 6);
                  const rot = [-9, 2, 10][i], x = [70, 380, 690][i], y = [500, 450, 520][i];
                  const mid = i === 1;
                  const away = mid ? 0 : pick;
                  return (
                    <div key={i} style={{position: 'absolute', left: mid ? lerp(x, 330, pick) : x, top: mid ? lerp(y, 470, pick) : y + away * 700, width: mid ? lerp(320, 420, pick) : 320, ...card, borderRadius: 22, padding: 18,
                      transform: `translateY(${(1 - v) * 520}px) rotate(${(rot + (1 - v) * 20) * (mid ? 1 - pick : 1) + away * (i ? 18 : -18)}deg)`,
                      opacity: Math.min(1, v * 2) * (1 - away), zIndex: mid ? 2 : 1, borderColor: mid && pick > 0.5 ? C.green : C.ink}}>
                      <div style={{height: mid ? lerp(220, 260, pick) : 220, borderRadius: 14, background: ['#E7E1D2', '#DCEFE3', '#F7E7B4'][i], display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Icon k={c.k} /></div>
                      <div style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 36, marginTop: 14, textAlign: 'center'}}>{c.label}</div>
                    </div>
                  );
                })}
                {f >= 780 && (
                  <div style={{position: 'absolute', left: 70, right: 70, top: 900, ...card, padding: '32px 38px',
                    transform: `translateX(${(1 - res) * 760}px) rotate(${(1 - res) * 7 - 1}deg)`, opacity: Math.min(1, res * 2)}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
                      <span style={{width: 78, height: 78, borderRadius: 20, background: C.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none'}}><Mark size={58} color={C.mint} /></span>
                      <div style={{flex: 1}}>
                        <div style={{fontFamily: 'Plex', fontSize: 28, color: C.muted}}>prompt 3 · start with one</div>
                        <div style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 48}}>Start here</div>
                      </div>
                      <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 28, background: C.mint, border: `3px solid ${C.ink}`, borderRadius: 999, padding: '8px 18px',
                        transform: `scale(${0.85 + 0.15 * badge})`, opacity: badge}}>example</span>
                    </div>
                    <div style={{marginTop: 20, display: 'grid', gridTemplateColumns: '130px 1fr', rowGap: 12}}>
                      {[['Idea', 'Short video edits for local cafés'], ['Why', 'Uses your editing skill, needs only a laptop']].map(([k, v]) => (
                        <React.Fragment key={k}><span style={{fontFamily: 'Plex', fontSize: 30, color: C.muted, paddingTop: 8}}>{k}</span><span style={{fontFamily: 'Newsreader', fontSize: 44, lineHeight: 1.2}}>{v}</span></React.Fragment>
                      ))}
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </Chapter>
      )}

      {/* S5: will anyone pay? → checklist with ticks + "You" cursor click */}
      {f >= 896 && f < L[9] + 2 && (
        <Chapter f={f} a={896} up={938} out={L[9] - 8} times={[910, 915, 930]} lines={[[w('Will'), w('anyone')], [w('pay?', 2)]]}>
          {(() => {
            const pill = r(f, 944, 960);
            const v = r(f, 948, 970);
            const items = ['Café owner 1', 'Café owner 2', 'Café owner 3'];
            const ticks = items.map((_, i) => r(f, 976 + i * 7, 984 + i * 7, IO)); // '3 café owners' 975-992
            const done = ticks.filter((t) => t > 0.5).length;
            const click = 1020; // 'now' 1022
            const press = Math.max(0, 1 - Math.abs(f - click - 2) / 4);
            const sent = f >= click + 2;
            const rip = r(f, click, click + 16);
            const cur = r(f, 994, click - 2, IO);
            return (
              <>
                <div style={{position: 'absolute', left: 0, right: 0, top: 470, display: 'flex', justifyContent: 'center', opacity: pill, transform: `translateY(${(1 - pill) * 40}px)`}}>
                  <span style={{display: 'flex', alignItems: 'center', gap: 18, ...card, borderRadius: 999, padding: '16px 20px 16px 34px', fontFamily: 'Newsreader', fontSize: 42}}>
                    Short video edits for local cafés
                    <span style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 36, background: C.gold, border: `3px solid ${C.ink}`, borderRadius: 999, padding: '4px 18px'}}>$ ?</span>
                  </span>
                </div>
                {f >= 948 && (
                  <div style={{position: 'absolute', left: 70, right: 70, top: 640, ...card, padding: '32px 36px', transform: `translateY(${(1 - v) * 300}px)`, opacity: Math.min(1, v * 1.4), zIndex: 3}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontFamily: 'Archivo', fontWeight: 800, fontSize: 46}}>
                      <span>Ask 3 café owners</span><span style={{fontFamily: 'Plex', fontSize: 32, color: C.muted}}>{done}/3</span>
                    </div>
                    <div style={{height: 12, borderRadius: 9, background: C.rule, margin: '18px 0 12px', overflow: 'hidden'}}>
                      <div style={{height: '100%', width: `${(ticks.reduce((a, b) => a + b, 0) / 3) * 100}%`, background: C.green}} />
                    </div>
                    {items.map((it, i) => (
                      <div key={i} style={{display: 'flex', alignItems: 'center', gap: 20, padding: '12px 0'}}>
                        <span style={{width: 50, height: 50, borderRadius: 12, border: `3.5px solid ${C.ink}`, background: ticks[i] > 0.3 ? C.mint : C.card, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                          <Check d={ticks[i]} color={C.ink} s={38} /></span>
                        <span style={{position: 'relative', fontFamily: 'Newsreader', fontSize: 44, color: ticks[i] > 0.5 ? C.muted : C.ink}}>
                          {it}<span style={{position: 'absolute', left: 0, top: '55%', height: 3, width: `${ticks[i] * 100}%`, background: C.muted}} /></span>
                      </div>
                    ))}
                    <div style={{position: 'relative', marginTop: 22, height: 100, borderRadius: 999, background: sent ? C.green : C.dark, color: C.card, display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontFamily: 'Archivo', fontWeight: 800, fontSize: 38, transform: `scale(${1 - 0.04 * press})`, overflow: 'hidden'}}>
                      {sent ? <><Check d={r(f, click + 2, click + 12, IO)} color={C.mint} s={44} />&nbsp;Asked</> : <>“What do you use now?”</>}
                      {rip > 0 && rip < 1 && <span style={{position: 'absolute', left: '62%', top: '50%', width: 40, height: 40, marginLeft: -20, marginTop: -20, borderRadius: 99,
                        background: C.mint, opacity: 0.5 * (1 - rip), transform: `scale(${1 + rip * 22})`}} />}
                    </div>
                  </div>
                )}
                {f >= 994 && (
                  <div style={{position: 'absolute', left: lerp(1010, 640, cur), top: lerp(1800, 1218, cur), zIndex: 4, transform: `scale(${1 - 0.1 * press})`}}>
                    <svg viewBox="0 0 24 24" width={70} height={70}><path d="M4 2l15 10-6.5 1.5L9.5 20z" fill={C.ink} stroke={C.card} strokeWidth={1.4} strokeLinejoin="round" /></svg>
                    <span style={{position: 'absolute', left: 48, top: 62, background: C.ink, color: C.mint, fontFamily: 'Archivo', fontWeight: 800, fontSize: 28, borderRadius: 999, padding: '4px 16px'}}>You</span>
                  </div>
                )}
              </>
            );
          })()}
        </Chapter>
      )}

      {/* S6: mark draws → The Narrowing Method → benefits → "link in bio" footnote */}
      {f >= L[9] - 2 && f < L[10] + 4 && (
        <AbsoluteFill>
          <div style={{position: 'absolute', left: '50%', top: 230, transform: 'translateX(-50%)', opacity: 1 - r(f, L[10] - 6, L[10] + 4, IO)}}>
            <Mark size={140} color={C.ink} draw={r(f, L[9] - 2, L[9] + 24, IO)} />
          </div>
          <Chapter f={f} a={L[9] + 2} up={L[9] + 14} out={L[10] - 6} lines={[[w('The'), w('Narrowing')], [w('Method.', 1)]]} topY={500} scaleTo={0.7}>
            <div style={{position: 'absolute', left: 90, right: 90, top: 700, display: 'flex', flexDirection: 'column', gap: 26}}>
              {['3 prompts', 'Ready to copy', 'Free PDF'].map((b, i) => {
                const v = r(f, L[9] + 22 + i * 6, L[9] + 36 + i * 6);
                return (
                  <div key={i} style={{...card, padding: '30px 34px', display: 'flex', alignItems: 'center', gap: 22, opacity: v, transform: `translateY(${(1 - v) * 40}px) rotate(${(1 - v) * (i % 2 ? 2 : -2)}deg)`}}>
                    <Check d={r(f, L[9] + 30 + i * 6, L[9] + 40 + i * 6, IO)} s={46} /><span style={{fontFamily: 'Archivo', fontWeight: 700, fontSize: 52}}>{b}</span>
                  </div>
                );
              })}
              <div style={{marginTop: 50, display: 'flex', justifyContent: 'center', opacity: r(f, L[9] + 58, L[9] + 70), transform: `translateY(${(1 - r(f, L[9] + 58, L[9] + 70)) * 20}px)`}}>
                <span style={{display: 'flex', alignItems: 'center', gap: 16, background: C.dark, color: C.card, borderRadius: 999, padding: '14px 34px 14px 16px', fontFamily: 'Newsreader', fontSize: 52, fontStyle: 'italic'}}>
                  <span style={{width: 62, height: 62, borderRadius: 99, background: C.mint, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <svg viewBox="0 0 24 24" width={34} height={34} fill="none" stroke={C.ink} strokeWidth={3} strokeLinecap="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg></span>
                  link in bio</span>
              </div>
            </div>
          </Chapter>
        </AbsoluteFill>
      )}

      {/* S7: app tile + chip during "And until one says yes," */}
      {f >= L[10] && f < N2_TOTAL && (() => {
        const t = r(f, L[10], L[10] + 16);
        const o = r(f, END - 9, END - 2, IO);
        if (o >= 1) return null;
        return (
          <AbsoluteFill style={{opacity: 1 - o, filter: o > 0 ? `blur(${o * 14}px)` : undefined, transform: `translateY(${-o * 60}px) scale(${1 - o * 0.04})`}}>
            <div style={{position: 'absolute', left: '50%', top: 520, width: 280, height: 280, marginLeft: -140, borderRadius: 70, background: C.dark, display: 'flex', alignItems: 'center',
              justifyContent: 'center', transform: `scale(${0.7 + 0.3 * t}) rotate(${(1 - t) * -12}deg)`, opacity: t}}>
              <Mark size={190} color={C.mint} draw={r(f, L[10] + 4, L[10] + 28, IO)} />
            </div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 960}}>
              <Headline lines={[[w('Until'), w('one')], [w('says'), w('yes,', 1)]]} f={f} start={L[10]} size={130} times={[1138, 1151, 1158, 1168]} />
            </div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 1300, display: 'flex', justifyContent: 'center', opacity: r(f, L[10] + 26, L[10] + 38)}}>
              <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 40, background: C.mint, border: `3.5px solid ${C.ink}`, borderRadius: 999, padding: '12px 30px'}}>Free PDF · link in bio</span>
            </div>
          </AbsoluteFill>
        );
      })()}

      {/* loop: headline words rise and the phone slides up, landing exactly on frame 0 */}
      {f >= END - 10 && (() => {
        const ph = r(f, END - 10, N2_TOTAL - 1, Easing.bezier(0.33, 0, 0.2, 1));
        return (
          <>
            <div style={{position: 'absolute', left: 0, right: 0, top: HOOK_Y, transform: 'translateY(-50%)'}}>
              <Headline lines={HOOK} f={f} start={END - 10} size={HOOK_SIZE} step={1.1} dur={7} caret={false} />
            </div>
            <div style={{position: 'absolute', inset: 0, opacity: r(f, END - 10, END - 3, IO)}}><Phone scroll={0} hl={r(f, END - 4, N2_TOTAL - 1, IO)} y={lerp(1150, PHONE_Y, ph)} stamp={0} /></div>
          </>
        );
      })()}
    </AbsoluteFill>
  );
};

// Reel cover: hook + phone with the stamp, kept inside the 3:4 grid crop (y 240-1680)
export const N2Cover: React.FC = () => (
  <AbsoluteFill style={{background: C.paper, backgroundImage: `repeating-linear-gradient(0deg, transparent 0 63px, ${C.rule}88 63px 65px)`, overflow: 'hidden'}}>
    <Fonts />
    <div style={{position: 'absolute', left: 0, right: 0, top: 470, transform: 'translateY(-50%)'}}>
      <Headline lines={HOOK} f={0} start={0} size={150} full caret={false} />
    </div>
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: 'translateY(170px) scale(0.84)', transformOrigin: '540px 640px'}}>
      <Phone scroll={0} hl={1} y={PHONE_Y} stamp={1} />
    </div>
  </AbsoluteFill>
);
