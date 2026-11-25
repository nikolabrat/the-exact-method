// V-3 frame-0 test still (plan.md §2). Real finished Reel (N-8 at 0:22) in the phone, brief card peeking.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

const C = {paper: '#E9E5DA', rule: '#D7D1C3', card: '#FCFBF7', ink: '#181714', mint: '#6BE0A0', red: '#D9534A', muted: '#7A7468', green: '#2F7A52', note: '#F6E7A8'};

const Fonts: React.FC = () => (
  <style>{`
@font-face{font-family:Archivo;src:url(${staticFile('archivo-variable.woff2')}) format('woff2');font-weight:100 900;font-stretch:62% 125%}
@font-face{font-family:Newsreader;src:url(${staticFile('newsreader-variable.woff2')}) format('woff2');font-weight:200 800;font-style:normal italic}
@font-face{font-family:Plex;src:url(${staticFile('plex-mono-500.woff2')}) format('woff2');font-weight:500}
`}</style>
);

const GRID: React.CSSProperties = {
  background: C.paper,
  backgroundImage: `repeating-linear-gradient(0deg, transparent 0 53px, ${C.rule} 53px 54px), repeating-linear-gradient(90deg, transparent 0 53px, ${C.rule} 53px 54px)`,
};

const MOUTHX = 347.5; // s-present
const BLOCKS = ['Who it’s for', 'Script', 'Look', 'Timing', 'Never', 'Export'];

export const V3F0: React.FC<{phoneSrc?: string}> = ({phoneSrc = 'v3v/n8_22.png'}) => {
  const k = 1.06, H = 1121 * k;
  return (
    <AbsoluteFill style={GRID}>
      <Fonts />
      {/* headline: the full hook, contrast on mute (strike on "editing") */}
      <div style={{position: 'absolute', left: 70, top: 250, width: 900, fontFamily: 'Archivo', fontWeight: 900, fontSize: 118, lineHeight: 1.02, letterSpacing: -3, color: C.ink}}>
        Stop{' '}
        <span style={{position: 'relative', display: 'inline-block'}}>
          editing
          <span style={{position: 'absolute', left: -6, right: -6, bottom: -10, height: 16, background: C.red, borderRadius: 8, transform: 'rotate(-1.5deg)'}} />
        </span>
        <br />
        your Reels.
      </div>

      {/* rail */}
      <div style={{position: 'absolute', left: 84, top: 600, width: 6, height: 700, background: C.ink, borderRadius: 3}} />
      {BLOCKS.map((_, i) => (
        <div key={i} style={{position: 'absolute', left: 72, top: 600 + i * 136, width: 30, height: 30, borderRadius: 15, border: `5px solid ${C.ink}`, background: C.card}} />
      ))}

      {/* brief card, tilted, peeking from behind the phone (payoff tease) */}
      <div style={{position: 'absolute', left: 150, top: 840, width: 470, height: 520, background: C.card, border: `4px solid ${C.ink}`, borderRadius: 16, transform: 'rotate(-5deg)', padding: '26px 28px', boxSizing: 'border-box'}}>
        <div style={{fontFamily: 'Plex', fontSize: 24, letterSpacing: 2, color: C.muted}}>THE BRIEF</div>
        <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 52, color: C.ink, marginTop: 4}}>
          6 <span style={{fontFamily: 'Newsreader', fontStyle: 'italic', fontWeight: 600, color: C.green}}>blocks</span>
        </div>
        {BLOCKS.slice(0, 4).map((b, i) => (
          <div key={b} style={{display: 'flex', alignItems: 'center', gap: 14, marginTop: 18}}>
            <div style={{width: 40, height: 40, borderRadius: 8, border: `3px solid ${C.ink}`, fontFamily: 'Archivo', fontWeight: 900, fontSize: 24, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{i + 1}</div>
            <div style={{fontFamily: 'Archivo', fontWeight: 800, fontSize: 30, color: C.ink}}>{b}</div>
          </div>
        ))}
      </div>

      {/* phone playing a finished Reel of ours */}
      <div style={{position: 'absolute', left: 470, top: 600, width: 430, height: 764, background: C.ink, borderRadius: 58, padding: 14, boxSizing: 'border-box', transform: 'rotate(3deg)'}}>
        <div style={{width: '100%', height: '100%', borderRadius: 46, overflow: 'hidden', position: 'relative'}}>
          <Img src={staticFile(phoneSrc)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </div>
        <div style={{position: 'absolute', left: -110, top: 48, background: C.mint, border: `4px solid ${C.ink}`, borderRadius: 40, padding: '12px 24px', fontFamily: 'Archivo', fontWeight: 900, fontSize: 32, color: C.ink, whiteSpace: 'nowrap', transform: 'rotate(-6deg)'}}>
          Made by Claude · no editing app
        </div>
      </div>

      {/* caption (spoken words), left of Sage */}
      <div style={{position: 'absolute', left: 70, top: 1440, fontFamily: 'Archivo', fontWeight: 900, fontSize: 66, color: C.ink, whiteSpace: 'nowrap'}}>
        <span style={{background: C.mint, padding: '0 10px', borderRadius: 8}}>Stop</span> editing
      </div>

      {/* Sage, bottom-right like N-8, mouth open on "Stop" */}
      <div style={{position: 'absolute', left: 872 - MOUTHX * k, top: 1388, width: 700, height: H}}>
        <Img src={staticFile('sage/s-present-open.png')} style={{position: 'absolute', left: 0, top: 0, height: H}} />
      </div>
    </AbsoluteFill>
  );
};
