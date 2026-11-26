// P-5 shared UI: exact rebuilds of the real 26 Nov runs (text verbatim from workspace/reels/p5/runs/*.txt).
import React from 'react';
import {staticFile} from 'remotion';

export const C = {
  black: '#000000', gptCard: '#303030', gptBubble: '#303030', gptText: '#ECECEC', gptMuted: '#9B9B9B', gptRule: '#424242',
  clPage: '#1F1F1F', clCard: '#262626', clText: '#E8E6E3', clMuted: '#9A9893', clChip: '#424242',
  paper: '#E9E5DA', ink: '#181714', mint: '#6BE0A0', red: '#E5483D', amber: '#F2B43C', muted: '#7A7468',
};

export const Fonts: React.FC = () => (
  <style>{`
@font-face{font-family:Archivo;src:url(${staticFile('archivo-variable.woff2')}) format('woff2');font-weight:100 900;font-stretch:62% 125%}
@font-face{font-family:Plex;src:url(${staticFile('plex-mono-500.woff2')}) format('woff2');font-weight:500}
`}</style>
);

export const UI_FONT = "Inter, 'Noto Color Emoji', sans-serif";

// marker behind a token: p = draw progress 0..1 (left to right), col = marker colour
export const Mark: React.FC<{p?: number; col?: string; children: React.ReactNode; bold?: boolean}> = ({p = 1, col = C.red, children, bold}) => (
  <span style={{position: 'relative', display: 'inline-block', fontWeight: bold ? 700 : undefined, color: bold ? '#fff' : undefined}}>
    <span style={{position: 'absolute', left: -5, top: '8%', bottom: '4%', width: `calc((100% + 10px) * ${p})`, background: col, opacity: 0.62, borderRadius: 6}} />
    <span style={{position: 'relative'}}>{children}</span>
  </span>
);

// ring around a single character (exclamation marks, dash): p = draw progress 0..1
export const Ring: React.FC<{p?: number; col?: string; children: React.ReactNode; w?: number}> = ({p = 1, col = C.red, children, w = 46}) => {
  const r = w / 2 - 3, L = 2 * Math.PI * r;
  return (
    <span style={{position: 'relative', display: 'inline-block', margin: '0 14px 0 16px'}}>
      <svg width={w} height={w} style={{position: 'absolute', left: '50%', top: '52%', transform: 'translate(-50%,-50%) rotate(-100deg)', overflow: 'visible'}}>
        <circle cx={w / 2} cy={w / 2} r={r} fill="none" stroke={col} strokeWidth={5} strokeLinecap="round" strokeDasharray={L} strokeDashoffset={L * (1 - p)} />
      </svg>
      <span style={{position: 'relative', color: p > 0.5 ? col : undefined, fontWeight: p > 0.5 ? 800 : undefined}}>{children}</span>
    </span>
  );
};

// ChatGPT email draft (default run). m = marker progress per tell id.
export type GptMarks = Partial<Record<'x1' | 'x2' | 'x3' | 'x4' | 'bold' | 'dash' | 'miss' | 'perfect', number>>;
export const GptEmail: React.FC<{m?: GptMarks; col?: Partial<Record<keyof GptMarks, string>>; after?: boolean}> = ({m = {}, col = {}, after}) => {
  const M = (id: keyof GptMarks, t: React.ReactNode, bold?: boolean) =>
    m[id] !== undefined && (t === '!' || t === '—') ? <Ring p={m[id]} col={col[id] ?? C.red} w={t === '—' ? 60 : 42}>{t}</Ring> :
    m[id] !== undefined ? <Mark p={m[id]} col={col[id] ?? C.red} bold={bold}>{t}</Mark> : bold ? <b style={{color: '#fff'}}>{t}</b> : <>{t}</>;
  const P: React.CSSProperties = {margin: '0 0 22px 0'};
  return (
    <div style={{width: 1000, background: C.gptCard, borderRadius: 34, fontFamily: UI_FONT, color: C.gptText, fontSize: 31, lineHeight: 1.42, overflow: 'hidden'}}>
      <div style={{display: 'flex', alignItems: 'center', padding: '22px 30px 6px 34px'}}>
        <div style={{flex: 1, fontSize: 25, fontWeight: 600, color: C.gptMuted}}>Email</div>
        <div style={{fontSize: 24, color: C.gptText, background: '#3d3d3d', borderRadius: 30, padding: '8px 20px'}}>Connect email</div>
      </div>
      <div style={{padding: '10px 34px 14px', color: C.gptMuted, fontSize: 28, borderBottom: `2px solid ${C.gptRule}`, margin: '0 0 0 0'}}>Recipients</div>
      <div style={{padding: '16px 34px 16px', borderBottom: `2px solid ${C.gptRule}`}}>
        {after ? <>20% Off Everything This Weekend{M('x1', '!')}</> : <>20% Off Everything This Weekend{M('x1', '!')}</>}
      </div>
      <div style={{padding: '24px 34px 6px'}}>
        {after ? (
          <>
            <p style={P}>Hi there,</p>
            <p style={P}>Treat yourself to something handmade{M('x2', '!')} This weekend, enjoy 20% off everything in our handmade soap shop.</p>
            <p style={P}>Whether you're restocking your favourites or trying something new, it's {M('perfect', 'the perfect time')} to shop.</p>
            <p style={P}>The offer is available for this weekend only, so {M('miss', "don't miss out")}{M('x3', '!')}</p>
            <p style={P}>Thank you for supporting our small business.</p>
            <p style={P}>Happy shopping{M('x4', '!')}</p>
          </>
        ) : (
          <>
            <p style={P}>Hi everyone,</p>
            <p style={P}>It's time for a little something special{M('x2', '!')} This weekend, enjoy {M('bold', '20% off everything', true)} in our handmade soap shop.</p>
            <p style={P}>Whether you're treating yourself or picking up a gift for someone special, it's {M('perfect', 'the perfect time')} to stock up on your favourites.</p>
            <p style={P}>{M('miss', "Don't miss out")} {M('dash', '—')} the offer is available this weekend only{M('x3', '!')}</p>
            <p style={P}>Thank you for supporting our small business.</p>
            <p style={P}>Happy shopping{M('x4', '!')}</p>
          </>
        )}
      </div>
    </div>
  );
};

export const GptChrome: React.FC<{prompt?: string}> = ({prompt = 'Write a short email to my customers announcing 20% off everything in my handmade soap shop this weekend.'}) => (
  <div style={{fontFamily: UI_FONT, color: C.gptText}}>
    <div style={{display: 'flex', justifyContent: 'flex-end'}}>
      <div style={{maxWidth: 820, background: C.gptBubble, borderRadius: 30, padding: '20px 30px', fontSize: 30, lineHeight: 1.4}}>{prompt}</div>
    </div>
  </div>
);

export const RunTag: React.FC<{text: string; dark?: boolean}> = ({text, dark = true}) => (
  <div style={{fontFamily: 'Plex', fontSize: 22, letterSpacing: 1, color: dark ? '#8a8a8a' : C.muted, display: 'flex', alignItems: 'center', gap: 10}}>
    <span style={{width: 12, height: 12, borderRadius: 6, background: C.mint, display: 'inline-block'}} />
    {text}
  </div>
);
