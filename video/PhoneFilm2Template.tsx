// PHONE LAUNCH FILM, v2 reference (The Exact Method). Rebuilt 10 Nov 2026 from the Momwise launch film
// (prompt-motion, francoxavier33). Same ideas, motions and pace; our colours, shapes and words.
// Six chapters, each one a reusable module:
//  C1 headline (frame 0 = hook) → moves up, phone rises, answer scrolls, phone blurs, result card
//     slides in tilted with a "picked" badge, dark toast pill with an avatar stack
//  C2 headline → helper cards slide in one by one → push notification rises tilted
//  C3 headline → thread header grows, message bubble, "joined" lines, live counter + avatar stack,
//     a list card rises, chips pop on
//  C4 headline (2nd accent) → three cards fan in like photos, checklist with progress bar, ticks and
//     strike-through, cursor with a "You" tag clicks the button → "Started"
//  C5 logo mark draws → headline → benefit checklist → footnote with italic accent
//  C6 app tile + wordmark + CTA chip → loops back to frame 0
// Typing is replaced by words rising in with a caret riding at the end (no letter-by-letter).
import React from 'react';
import {AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame} from 'remotion';

const C = {paper: '#ECE8DD', card: '#FFFDF7', ink: '#181714', green: '#2F7A52', mint: '#6BE0A0', gold: '#F2B632', muted: '#6F695D', rule: '#DCD5C4', dark: '#10261C'};
const OUT = Easing.bezier(0.22, 1, 0.36, 1);
const IO = Easing.bezier(0.65, 0, 0.35, 1);
const r = (f: number, a: number, b: number, e = OUT) =>
  interpolate(f, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type W = {t: string; a?: 1 | 2}; // a=1 green italic + mint swipe, a=2 italic + gold swipe
export type PhoneFilm2Props = {
  h: W[][][]; // per chapter: lines of words
  phone: {app: string; sub: string; ask: string; intro: string; list: string[]};
  result: {kicker: string; title: string; rows: [string, string][]; badge: string};
  toast: {avatars: string[]; text: string};
  helpers: {init: string; title: string; sub: string; tone: string}[];
  notif: {app: string; title: string; body: string};
  thread: {title: string; sub: string; message: string; joins: {init: string; text: string; tone: string}[]; counter: string};
  listCard: {title: string; rows: [string, string][]; chip: string};
  fan: {label: string; icon: 'paw' | 'book' | 'bike'}[];
  check: {title: string; items: string[]; button: string; done: string};
  benefits: string[];
  foot: [string, string];
  end: {chip: string};
};

export const PF = {
  c1Up: 14, phoneIn: 18, scroll: 50, blur: 80, result: 84, badge: 102, toast: 108, c1Out: 122,
  c2: 134, c3: 224, c4: 332, c5: 452, c6: 540, loop: 584, total: 606,
};

const Fonts: React.FC = () => (
  <style>{`
@font-face{font-family:Archivo;src:url(${staticFile('archivo-variable.woff2')}) format('woff2');font-weight:100 900;font-stretch:62% 125%}
@font-face{font-family:Newsreader;src:url(${staticFile('newsreader-variable.woff2')}) format('woff2');font-weight:200 800;font-style:normal italic}
@font-face{font-family:Plex;src:url(${staticFile('plex-mono-500.woff2')}) format('woff2');font-weight:500}
`}</style>
);

// Headline: words rise in one by one, a caret rides at the end, accent words get a marker swipe.
const Headline: React.FC<{lines: W[][]; f: number; start: number; size: number; full?: boolean; step?: number; dur?: number}> = ({lines, f, start, size, full, step = 4, dur = 12}) => {
  let k = 0;
  const total = lines.flat().length;
  const lastStart = start + (total - 1) * step;
  const blink = Math.floor(f / 9) % 2 === 0;
  const typing = !full && f < lastStart + 10;
  const caretOn = full || f < lastStart + 40 ? (typing ? true : blink) : false;
  let caretWord = full ? total - 1 : Math.max(0, Math.min(total - 1, Math.floor((f - start) / step)));
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      {lines.map((line, li) => (
        <div key={li} style={{display: 'flex', gap: size * 0.24, alignItems: 'baseline'}}>
          {line.map((w, wi) => {
            const idx = k++;
            const p = full ? 1 : r(f, start + idx * step, start + idx * step + dur);
            const sw = full ? 1 : r(f, start + idx * step + dur * 0.6, start + idx * step + dur * 1.6, IO);
            const accent = w.a;
            return (
              <span key={wi} style={{position: 'relative', display: 'inline-block', overflow: 'hidden', paddingBottom: size * 0.12, marginBottom: -size * 0.12}}>
                {accent && <span style={{position: 'absolute', left: -6, right: -6, bottom: size * 0.16, height: size * 0.32, background: accent === 1 ? C.mint : C.gold,
                  transform: `scaleX(${sw}) rotate(-1.2deg)`, transformOrigin: 'left center', borderRadius: 6, opacity: 0.85}} />}
                <span style={{position: 'relative', display: 'inline-block', transform: `translateY(${(1 - p) * 105}%)`,
                  fontFamily: accent ? 'Newsreader' : 'Archivo', fontStyle: accent ? 'italic' : 'normal', fontWeight: accent ? 500 : 900,
                  fontSize: accent ? size * 1.08 : size, lineHeight: 1.08, letterSpacing: accent ? -1 : -2, color: accent ? C.green : C.ink}}>
                  {w.t}
                </span>
                {idx === caretWord && caretOn && p > 0.6 && (
                  <span style={{position: 'absolute', right: -size * 0.12, top: size * 0.14, width: size * 0.06, height: size * 0.92, background: C.green}} />
                )}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// A chapter frame: headline sits big in the centre, then shrinks to the top; everything blurs out.
const Chapter: React.FC<{f: number; a: number; up: number; out: number; lines: W[][]; size?: number; topY?: number; children?: React.ReactNode; full?: boolean}> =
  ({f, a, up, out, lines, size = 128, topY = 200, children, full}) => {
    const u = r(f, up, up + 18, IO);
    const o = r(f, out, out + 12, IO);
    if (o >= 1) return null;
    return (
      <AbsoluteFill style={{opacity: 1 - o, filter: o > 0 ? `blur(${o * 16}px)` : undefined, transform: `scale(${1 + o * 0.04})`}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: lerp(860, topY, u), transform: `translateY(-50%) scale(${lerp(1, 0.56, u)})`}}>
          <Headline lines={lines} f={f} start={a} size={size} full={full} />
        </div>
        {children}
      </AbsoluteFill>
    );
  };

const Avatar: React.FC<{t: string; tone: string; s?: number; ring?: boolean}> = ({t, tone, s = 44, ring}) => (
  <span style={{width: s, height: s, borderRadius: s, background: tone, border: ring ? `3px solid ${C.card}` : `2px solid ${C.ink}`, display: 'inline-flex', alignItems: 'center',
    justifyContent: 'center', fontFamily: 'Archivo', fontWeight: 800, fontSize: s * 0.4, color: C.ink, flex: 'none'}}>{t}</span>
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

const Icon: React.FC<{k: 'paw' | 'book' | 'bike'}> = ({k}) => (
  <svg viewBox="0 0 64 64" width={120} height={120} fill="none" stroke={C.ink} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
    {k === 'paw' && <><ellipse cx={32} cy={42} rx={12} ry={10} /><circle cx={18} cy={26} r={5} /><circle cx={27} cy={18} r={5} /><circle cx={38} cy={18} r={5} /><circle cx={47} cy={26} r={5} /></>}
    {k === 'book' && <><path d="M8 14h20a6 6 0 0 1 4 2v34a6 6 0 0 0-4-2H8z" /><path d="M56 14H36a6 6 0 0 0-4 2v34a6 6 0 0 1 4-2h20z" /></>}
    {k === 'bike' && <><circle cx={16} cy={42} r={10} /><circle cx={48} cy={42} r={10} /><path d="M16 42l10-18h14l8 18M26 24l8 18h6M36 16h8" /></>}
  </svg>
);

const card: React.CSSProperties = {background: C.card, border: `3.5px solid ${C.ink}`, borderRadius: 26};

// ---------------------------------------------------------------------------------------------
export const PhoneFilm2: React.FC<PhoneFilm2Props> = (p) => {
  const f = useCurrentFrame();
  const T = PF;
  const loop = f >= T.loop;

  // ---------- C1 ----------
  const phoneP = r(f, T.phoneIn, T.phoneIn + 36, Easing.bezier(0.33, 0, 0.2, 1));
  const scroll = interpolate(f, [T.scroll, T.blur + 4], [0, 520], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: IO});
  const blur = r(f, T.blur, T.blur + 12, IO);
  const res = r(f, T.result, T.result + 18);
  const badge = r(f, T.badge, T.badge + 8, IO);
  const toast = r(f, T.toast, T.toast + 14);

  return (
    <AbsoluteFill style={{background: C.paper, backgroundImage: `repeating-linear-gradient(0deg, transparent 0 63px, ${C.rule}88 63px 65px)`, overflow: 'hidden'}}>
      <Fonts />

      {/* C1 */}
      {f < T.c2 && !loop && (
        <Chapter f={f} a={-999} up={T.c1Up} out={T.c1Out} lines={p.h[0]} full>
          {/* phone */}
          <div style={{position: 'absolute', left: 230, top: lerp(1950, 470, phoneP), width: 620, height: 1280, ...card, borderWidth: 10, borderRadius: 84, overflow: 'hidden',
            filter: blur > 0 ? `blur(${blur * 8}px)` : undefined, opacity: 1 - blur * 0.3}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '26px 46px 0', fontFamily: 'Archivo', fontWeight: 700, fontSize: 24}}>
              <span>9:41</span><span style={{width: 150, height: 40, borderRadius: 20, background: C.ink}} /><span>●●●</span>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 40px 8px'}}>
              <span style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 46}}>{p.phone.app}</span>
              <span style={{fontFamily: 'Plex', fontSize: 20, color: C.green, display: 'flex', alignItems: 'center', gap: 8}}>
                <span style={{width: 10, height: 10, borderRadius: 9, background: C.mint}} />{p.phone.sub}</span>
            </div>
            <div style={{position: 'absolute', top: 180, left: 0, right: 0, bottom: 120, overflow: 'hidden'}}>
              <div style={{transform: `translateY(${-scroll}px)`, padding: '0 40px'}}>
                <div style={{marginLeft: 'auto', width: 'fit-content', maxWidth: 440, background: C.ink, color: C.card, borderRadius: 20, padding: '16px 22px', fontFamily: 'Archivo', fontWeight: 600, fontSize: 26}}>{p.phone.ask}</div>
                <div style={{fontFamily: 'Newsreader', fontSize: 28, margin: '24px 0 10px'}}>{p.phone.intro}</div>
                {p.phone.list.map((it, i) => (
                  <div key={i} style={{display: 'flex', gap: 14, fontFamily: 'Newsreader', fontSize: 27, padding: '8px 0', borderBottom: `1.5px solid ${C.rule}`}}>
                    <span style={{color: C.muted, width: 36, textAlign: 'right'}}>{i + 1}.</span><span>{it}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{position: 'absolute', left: 30, right: 30, bottom: 36, height: 70, borderRadius: 35, border: `2.5px solid ${C.rule}`, display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', padding: '0 10px 0 28px', fontFamily: 'Archivo', fontSize: 24, color: C.muted}}>
              Ask anything…<span style={{width: 52, height: 52, borderRadius: 30, background: C.green}} />
            </div>
          </div>
          {/* result card slides in from the right, tilted */}
          {f >= T.result && (
            <div style={{position: 'absolute', left: 80, right: 80, top: 760, ...card, padding: '28px 34px',
              transform: `translateX(${(1 - res) * 700}px) rotate(${(1 - res) * 7}deg)`, opacity: Math.min(1, res * 2)}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
                <span style={{width: 64, height: 64, borderRadius: 16, background: C.dark, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Mark size={48} color={C.mint} /></span>
                <div style={{flex: 1}}>
                  <div style={{fontFamily: 'Plex', fontSize: 22, color: C.muted}}>{p.result.kicker}</div>
                  <div style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 36}}>{p.result.title}</div>
                </div>
                <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 24, background: C.mint, border: `2.5px solid ${C.ink}`, borderRadius: 999, padding: '6px 16px',
                  transform: `scale(${0.85 + 0.15 * badge})`, opacity: badge}}>{p.result.badge}</span>
              </div>
              <div style={{marginTop: 18, display: 'grid', gridTemplateColumns: '130px 1fr', rowGap: 10, fontSize: 30}}>
                {p.result.rows.map(([k, v]) => (
                  <React.Fragment key={k}><span style={{fontFamily: 'Plex', fontSize: 24, color: C.muted, paddingTop: 4}}>{k}</span><span style={{fontFamily: 'Newsreader', fontSize: 34}}>{v}</span></React.Fragment>
                ))}
              </div>
            </div>
          )}
          {/* dark toast pill with an avatar stack */}
          {f >= T.toast && (
            <div style={{position: 'absolute', left: '50%', top: 1250, transform: `translate(-50%, ${(1 - toast) * 80}px)`, opacity: toast, background: C.dark, color: C.card,
              borderRadius: 999, padding: '14px 30px 14px 16px', display: 'flex', alignItems: 'center', gap: 18, whiteSpace: 'nowrap'}}>
              <span style={{display: 'flex'}}>{p.toast.avatars.map((a, i) => <span key={a} style={{marginLeft: i ? -14 : 0}}><Avatar t={a} tone={[C.mint, C.gold, '#9CC9B0'][i % 3]} s={52} ring /></span>)}</span>
              <span style={{fontFamily: 'Archivo', fontWeight: 700, fontSize: 32}}>{p.toast.text}</span>
            </div>
          )}
        </Chapter>
      )}

      {/* C2: helper cards + push notification */}
      {f >= T.c2 && f < T.c3 && (
        <Chapter f={f} a={T.c2} up={T.c2 + 20} out={T.c3 - 12} lines={p.h[1]}>
          <div style={{position: 'absolute', left: 80, right: 80, top: 450, display: 'flex', flexDirection: 'column', gap: 26}}>
            {p.helpers.map((h, i) => {
              const v = r(f, T.c2 + 30 + i * 7, T.c2 + 46 + i * 7);
              return (
                <div key={i} style={{...card, padding: '30px 32px', display: 'flex', alignItems: 'center', gap: 26, transform: `translateX(${(1 - v) * 640}px) rotate(${(1 - v) * 6}deg)`, opacity: Math.min(1, v * 2)}}>
                  <Avatar t={h.init} tone={h.tone} s={88} />
                  <div style={{flex: 1}}>
                    <div style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 48}}>{h.title}</div>
                    <div style={{fontFamily: 'Newsreader', fontSize: 36, color: C.muted}}>{h.sub}</div>
                  </div>
                  <span style={{fontFamily: 'Archivo', fontSize: 40, color: C.muted}}>›</span>
                </div>
              );
            })}
          </div>
          {(() => {
            const v = r(f, T.c2 + 62, T.c2 + 80);
            return f >= T.c2 + 62 && (
              <div style={{position: 'absolute', left: 90, right: 90, top: 1400, ...card, borderRadius: 34, padding: '24px 28px', display: 'flex', gap: 20,
                transform: `translateY(${(1 - v) * 380}px) rotate(${(1 - v) * -6}deg)`, opacity: Math.min(1, v * 2)}}>
                <span style={{width: 76, height: 76, borderRadius: 20, background: C.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none'}}><Mark size={56} color={C.mint} /></span>
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: 'Plex', fontSize: 22, color: C.muted}}><span>{p.notif.app}</span><span>now</span></div>
                  <div style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 32}}>{p.notif.title}</div>
                  <div style={{fontFamily: 'Newsreader', fontSize: 30, lineHeight: 1.25}}>{p.notif.body}</div>
                </div>
              </div>
            );
          })()}
        </Chapter>
      )}

      {/* C3: thread with joins, live counter, list card with chips */}
      {f >= T.c3 && f < T.c4 && (
        <Chapter f={f} a={T.c3} up={T.c3 + 22} out={T.c4 - 12} lines={p.h[2]}>
          {(() => {
            const head = r(f, T.c3 + 30, T.c3 + 44, IO);
            const n = p.thread.joins.filter((_, i) => f >= T.c3 + 54 + i * 9).length;
            const bub = r(f, T.c3 + 40, T.c3 + 54);
            const lc = r(f, T.c3 + 84, T.c3 + 100);
            return (
              <>
                <div style={{position: 'absolute', left: 80, right: 80, top: 420, ...card, padding: '24px 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  transform: `scaleX(${lerp(0.3, 1, head)})`, transformOrigin: 'left center', opacity: head}}>
                  <div style={{opacity: r(head, 0.6, 1)}}>
                    <div style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 38}}>{p.thread.title}</div>
                    <div style={{fontFamily: 'Plex', fontSize: 22, color: C.muted}}>{n ? `${n} ${p.thread.counter}` : p.thread.sub}</div>
                  </div>
                  <span style={{display: 'flex'}}>
                    {p.thread.joins.map((j, i) => {
                      const v = r(f, T.c3 + 54 + i * 9, T.c3 + 62 + i * 9);
                      return <span key={i} style={{marginLeft: i ? -12 : 0, opacity: v, transform: `scale(${0.6 + 0.4 * v})`}}><Avatar t={j.init} tone={j.tone} s={50} ring /></span>;
                    })}
                  </span>
                </div>
                <div style={{position: 'absolute', left: 150, right: 80, top: 580, background: '#E3EFE7', border: `2.5px solid ${C.green}`, borderRadius: 26, padding: '22px 28px',
                  fontFamily: 'Newsreader', fontSize: 34, lineHeight: 1.3, transform: `translateX(${(1 - bub) * 200}px)`, opacity: bub}}>{p.thread.message}</div>
                <div style={{position: 'absolute', left: 80, right: 80, top: 790, display: 'flex', flexDirection: 'column', gap: 14}}>
                  {p.thread.joins.map((j, i) => {
                    const v = r(f, T.c3 + 54 + i * 9, T.c3 + 66 + i * 9);
                    return (
                      <div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, opacity: v, transform: `translateX(${(1 - v) * -60}px)`, fontFamily: 'Plex', fontSize: 27}}>
                        <Avatar t={j.init} tone={j.tone} s={40} /><span style={{color: C.green}}>{j.text}</span>
                      </div>
                    );
                  })}
                </div>
                {f >= T.c3 + 84 && (
                  <div style={{position: 'absolute', left: 80, right: 80, top: 1120, ...card, padding: '26px 30px', transform: `translateY(${(1 - lc) * 300}px) rotate(${(1 - lc) * 4}deg)`, opacity: Math.min(1, lc * 2)}}>
                    <div style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 34, marginBottom: 10}}>{p.listCard.title}</div>
                    {p.listCard.rows.map(([a, b], i) => {
                      const chip = r(f, T.c3 + 96 + i * 4, T.c3 + 104 + i * 4, IO);
                      return (
                        <div key={i} style={{display: 'flex', alignItems: 'center', gap: 20, padding: '12px 0', borderTop: `1.5px solid ${C.rule}`}}>
                          <span style={{fontFamily: 'Plex', fontSize: 24, color: C.muted, width: 70}}>{a}</span>
                          <span style={{flex: 1, fontFamily: 'Newsreader', fontSize: 34}}>{b}</span>
                          <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 22, background: C.mint, border: `2px solid ${C.ink}`, borderRadius: 999, padding: '4px 14px',
                            opacity: chip, transform: `scale(${0.8 + 0.2 * chip})`}}>{p.listCard.chip}</span>
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

      {/* C4: fan of cards, checklist, cursor click */}
      {f >= T.c4 && f < T.c5 && (
        <Chapter f={f} a={T.c4} up={T.c4 + 16} out={T.c5 - 12} lines={p.h[3]}>
          {p.fan.map((c, i) => {
            const v = r(f, T.c4 + 24 + i * 6, T.c4 + 44 + i * 6);
            const rot = [-9, 2, 10][i], x = [110, 380, 650][i], y = [480, 440, 500][i];
            return (
              <div key={i} style={{position: 'absolute', left: x, top: y, width: 320, ...card, borderRadius: 20, padding: 16, transform: `translateY(${(1 - v) * 500}px) rotate(${rot + (1 - v) * 20}deg)`,
                opacity: Math.min(1, v * 2), zIndex: i === 1 ? 2 : 1}}>
                <div style={{height: 220, borderRadius: 12, background: ['#DCEFE3', '#F7E7B4', '#E7E1D2'][i], display: 'flex', alignItems: 'center', justifyContent: 'center'}}><Icon k={c.icon} /></div>
                <div style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 28, marginTop: 12, textAlign: 'center'}}>{c.label}</div>
              </div>
            );
          })}
          {(() => {
            const v = r(f, T.c4 + 40, T.c4 + 58);
            const ticks = p.check.items.map((_, i) => r(f, T.c4 + 62 + i * 6, T.c4 + 70 + i * 6, IO));
            const done = ticks.filter((t) => t > 0.5).length;
            const click = T.c4 + 98;
            const press = Math.max(0, 1 - Math.abs(f - click - 2) / 4);
            const sent = f >= click + 2;
            const rip = r(f, click, click + 16);
            const cur = r(f, T.c4 + 72, click - 2, IO);
            return (
              <>
                <div style={{position: 'absolute', left: 90, right: 90, top: 860, ...card, padding: '28px 32px', transform: `translateY(${(1 - v) * 420}px)`, opacity: Math.min(1, v * 2), zIndex: 3}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', fontFamily: 'Archivo', fontWeight: 800, fontSize: 36}}>
                    <span>{p.check.title}</span><span style={{fontFamily: 'Plex', fontSize: 26, color: C.muted}}>{done}/{p.check.items.length}</span>
                  </div>
                  <div style={{height: 10, borderRadius: 9, background: C.rule, margin: '14px 0 10px', overflow: 'hidden'}}>
                    <div style={{height: '100%', width: `${(ticks.reduce((a, b) => a + b, 0) / ticks.length) * 100}%`, background: C.green}} />
                  </div>
                  {p.check.items.map((it, i) => (
                    <div key={i} style={{display: 'flex', alignItems: 'center', gap: 16, padding: '9px 0'}}>
                      <span style={{width: 40, height: 40, borderRadius: 10, border: `3px solid ${C.ink}`, background: ticks[i] > 0.3 ? C.mint : C.card, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <Check d={ticks[i]} color={C.ink} s={30} /></span>
                      <span style={{position: 'relative', fontFamily: 'Newsreader', fontSize: 32, color: ticks[i] > 0.5 ? C.muted : C.ink}}>
                        {it}<span style={{position: 'absolute', left: 0, top: '55%', height: 2.5, width: `${ticks[i] * 100}%`, background: C.muted}} /></span>
                    </div>
                  ))}
                  <div style={{position: 'relative', marginTop: 18, height: 84, borderRadius: 999, background: sent ? C.green : C.dark, color: C.card, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontFamily: 'Archivo', fontWeight: 800, fontSize: 32, transform: `scale(${1 - 0.04 * press})`, overflow: 'hidden'}}>
                    {sent ? <><Check d={r(f, click + 2, click + 12, IO)} color={C.mint} s={36} />&nbsp;{p.check.done}</> : <>→&nbsp;{p.check.button}</>}
                    {rip > 0 && rip < 1 && <span style={{position: 'absolute', left: '62%', top: '50%', width: 40, height: 40, marginLeft: -20, marginTop: -20, borderRadius: 99,
                      background: C.mint, opacity: 0.5 * (1 - rip), transform: `scale(${1 + rip * 20})`}} />}
                  </div>
                </div>
                {/* cursor with a "You" tag */}
                {f >= T.c4 + 72 && (
                  <div style={{position: 'absolute', left: lerp(1000, 660, cur), top: lerp(1800, 1262, cur), zIndex: 4, transform: `scale(${1 - 0.1 * press})`}}>
                    <svg viewBox="0 0 24 24" width={58} height={58}><path d="M4 2l15 10-6.5 1.5L9.5 20z" fill={C.ink} stroke={C.card} strokeWidth={1.4} strokeLinejoin="round" /></svg>
                    <span style={{position: 'absolute', left: 40, top: 52, background: C.ink, color: C.mint, fontFamily: 'Archivo', fontWeight: 800, fontSize: 22, borderRadius: 999, padding: '4px 14px'}}>You</span>
                  </div>
                )}
              </>
            );
          })()}
        </Chapter>
      )}

      {/* C5: mark draws, headline, benefits, footnote */}
      {f >= T.c5 && f < T.c6 && (
        <AbsoluteFill>
          <div style={{position: 'absolute', left: '50%', top: 170, transform: 'translateX(-50%)', opacity: 1 - r(f, T.c6 - 12, T.c6, IO)}}>
            <Mark size={130} color={C.ink} draw={r(f, T.c5, T.c5 + 26, IO)} />
          </div>
          <Chapter f={f} a={T.c5 + 6} up={T.c5 + 22} out={T.c6 - 12} lines={p.h[4]} topY={420}>
            <div style={{position: 'absolute', left: 90, right: 90, top: 640, display: 'flex', flexDirection: 'column', gap: 26}}>
              {p.benefits.map((b, i) => {
                const v = r(f, T.c5 + 32 + i * 6, T.c5 + 46 + i * 6);
                return (
                  <div key={i} style={{...card, padding: '30px 30px', display: 'flex', alignItems: 'center', gap: 20, opacity: v, transform: `translateY(${(1 - v) * 40}px) rotate(${(1 - v) * (i % 2 ? 2 : -2)}deg)`}}>
                    <Check d={r(f, T.c5 + 40 + i * 6, T.c5 + 50 + i * 6, IO)} s={38} /><span style={{fontFamily: 'Archivo', fontWeight: 700, fontSize: 44}}>{b}</span>
                  </div>
                );
              })}
              <div style={{marginTop: 70, textAlign: 'center', fontFamily: 'Newsreader', fontSize: 60, opacity: r(f, T.c5 + 62, T.c5 + 74), transform: `translateY(${(1 - r(f, T.c5 + 62, T.c5 + 74)) * 20}px)`}}>
                {p.foot[0]} <i style={{color: C.green}}>{p.foot[1]}</i>
              </div>
            </div>
          </Chapter>
        </AbsoluteFill>
      )}

      {/* C6: app tile + wordmark + CTA */}
      {f >= T.c6 && f < T.total && (() => {
        const t = r(f, T.c6, T.c6 + 18);
        const o = r(f, T.loop, T.loop + 10, IO);
        return (
          <AbsoluteFill style={{opacity: 1 - o, filter: o > 0 ? `blur(${o * 14}px)` : undefined}}>
            <div style={{position: 'absolute', left: '50%', top: 560, width: 260, height: 260, marginLeft: -130, borderRadius: 64, background: C.dark, display: 'flex', alignItems: 'center',
              justifyContent: 'center', transform: `scale(${0.7 + 0.3 * t}) rotate(${(1 - t) * -12}deg)`, opacity: t}}>
              <Mark size={180} color={C.mint} draw={r(f, T.c6 + 6, T.c6 + 30, IO)} />
            </div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 960}}>
              <Headline lines={p.h[5]} f={f} start={T.c6 + 8} size={120} />
            </div>
            <div style={{position: 'absolute', left: 0, right: 0, top: 1300, display: 'flex', justifyContent: 'center', opacity: r(f, T.c6 + 30, T.c6 + 42)}}>
              <span style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 34, background: C.mint, border: `3px solid ${C.ink}`, borderRadius: 999, padding: '10px 26px'}}>{p.end.chip}</span>
            </div>
          </AbsoluteFill>
        );
      })()}

      {/* loop: the C1 headline rises back in and lands exactly on frame 0 */}
      {loop && (
        <div style={{position: 'absolute', left: 0, right: 0, top: 860, transform: 'translateY(-50%)'}}>
          <Headline lines={p.h[0]} f={f} start={T.loop + 2} size={128} step={1.4} dur={9} full={f >= T.total - 1} />
        </div>
      )}
    </AbsoluteFill>
  );
};
