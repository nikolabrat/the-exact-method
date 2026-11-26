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
@font-face{font-family:Newsreader;src:url(${staticFile('newsreader-variable.woff2')}) format('woff2');font-weight:200 800;font-style:normal italic}
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
    <span style={{position: 'relative', display: 'inline-block', margin: `0 ${14 * Math.min(1, p * 3)}px 0 ${16 * Math.min(1, p * 3)}px`}}>
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

// wavy underline drawn left to right under a phrase (remocn squiggle idea, our own layer)
export const Wavy: React.FC<{p?: number; col?: string; children: React.ReactNode}> = ({p = 1, col = C.red, children}) => (
  <span style={{position: 'relative'}}>
    {children}
    <svg viewBox="0 0 200 12" preserveAspectRatio="none" style={{position: 'absolute', left: 0, bottom: -10, width: '100%', height: 14, overflow: 'visible'}}>
      <path d="M0 6 Q 6.25 0 12.5 6 T 25 6 T 37.5 6 T 50 6 T 62.5 6 T 75 6 T 87.5 6 T 100 6 T 112.5 6 T 125 6 T 137.5 6 T 150 6 T 162.5 6 T 175 6 T 187.5 6 T 200 6"
        stroke={col} strokeWidth={4.5} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} opacity={p > 0.02 ? 1 : 0} />
    </svg>
  </span>
);

export type ClMarks = Partial<Record<'e1' | 'e2' | 'e3' | 'list' | 'world' | 'perfect', number>>;
// Claude default run: the email widget ("A Warm & simple"), text verbatim from runs/claude_default.txt
export const ClaudeEmail: React.FC<{m?: ClMarks}> = ({m = {}}) => {
  const E = (id: 'e1' | 'e2' | 'e3', t: string) => (m[id] !== undefined ? <Ring p={m[id]} w={54}>{t}</Ring> : <>{t}</>);
  const M = (id: 'world' | 'perfect', t: string) => (m[id] !== undefined ? <Mark p={m[id]}>{t}</Mark> : <>{t}</>);
  const P: React.CSSProperties = {margin: '0 0 20px 0'};
  return (
    <div style={{width: 1000, height: 960, background: C.clCard, border: '2px solid #333', borderRadius: 26, fontFamily: UI_FONT, color: C.clText, fontSize: 29, lineHeight: 1.42, overflow: 'hidden', position: 'relative'}}>
      <div style={{padding: '22px 28px 16px'}}>
        <span style={{background: C.clChip, borderRadius: 12, padding: '8px 18px', fontSize: 25}}><span style={{color: C.clMuted, marginRight: 12}}>A</span>Warm &amp; simple</span>
      </div>
      <div style={{padding: '14px 28px', borderTop: '2px solid #333', borderBottom: '2px solid #333', display: 'flex', gap: 16, alignItems: 'baseline'}}>
        <span style={{fontSize: 22, color: C.clMuted}}>Subject:</span>
        <span>20% off everything this weekend {E('e1', '🧼')}</span>
      </div>
      <div style={{padding: '22px 28px'}}>
        <p style={P}>Hi [First name],</p>
        <p style={P}>This weekend only, everything in the shop is 20% off: {m.list !== undefined ? <Wavy p={m.list}>every bar, every scent, every gift set</Wavy> : 'every bar, every scent, every gift set'}.</p>
        <p style={P}>{M('perfect', "It's the perfect time")} to restock your favorites, try something new, or tuck away a few handmade gifts for the holidays.</p>
        <p style={{margin: 0}}>{E('e2', '🗓')} Saturday, November 28 – Sunday, November 29</p>
        <p style={P}>{E('e3', '💸')} 20% off everything, no code needed [or: use code WEEKEND20 at checkout]</p>
        <p style={P}>[Shop the sale →]</p>
        <p style={P}>Each bar is made by hand in small batches, so popular scents can sell out quickly. If you've had your eye on something, now's the time.</p>
        <p style={P}>Thank you for supporting a small, handmade business. {M('world', 'It truly means the world.')}</p>
        <p style={P}>Warmly,</p>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 70, background: `linear-gradient(transparent, ${C.clCard})`}} />
    </div>
  );
};

// Claude with the Plain Voice list (project instructions): plain reply, text verbatim from runs/claude_list.txt
export const ClaudeAfter: React.FC<{dates?: number}> = ({dates}) => {
  const P: React.CSSProperties = {margin: '0 0 22px 0'};
  const d = 'This Saturday and Sunday, November 28 and 29,';
  return (
    <div style={{width: 1000, fontFamily: "Newsreader, 'Noto Color Emoji', serif", color: C.clText, fontSize: 40, lineHeight: 1.36}}>
      <p style={P}>Subject: 20% off everything this weekend</p>
      <p style={P}>Hi [first name],</p>
      <p style={P}>{dates !== undefined ? <Mark p={dates} col={C.mint}>{d}</Mark> : d} everything in the shop is 20% off. That includes every bar, every scent and the gift sets.</p>
      <p style={P}>The discount applies at checkout, so you don't need a code. [If you use a code, replace this sentence with: Use code [CODE] at checkout.]</p>
      <p style={P}>Each soap is made by hand in small batches, and some scents sell out fast at full price. If one of them is your favorite, this weekend is a good time to stock up.</p>
      <p style={P}>The sale ends Sunday at [time and time zone]. You can shop here: [shop link]</p>
      <p style={P}>Thank you for supporting a small handmade business.</p>
    </div>
  );
};
