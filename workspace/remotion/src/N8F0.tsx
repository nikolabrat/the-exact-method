// N-8 frame-0 test (planning only): the hook frame from the real run, to check it at feed size.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';

const C = {paper: '#E9E5DA', rule: '#D7D1C3', card: '#FCFBF7', ink: '#181714', mint: '#6BE0A0', red: '#D9534A', green: '#2F7A52', muted: '#7A7468', dark: '#151515'};
const Fonts = () => (
  <style>{`
@font-face{font-family:Archivo;src:url(${staticFile('archivo-variable.woff2')}) format('woff2');font-weight:100 900}
@font-face{font-family:Plex;src:url(${staticFile('plex-mono-500.woff2')}) format('woff2');font-weight:500}
`}</style>
);
const Mono: React.FC<{children: React.ReactNode; size?: number; color?: string}> = ({children, size = 24, color = C.muted}) => (
  <div style={{fontFamily: 'Plex', fontSize: size, color, letterSpacing: 0.5}}>{children}</div>
);

export const N8F0: React.FC = () => (
  <AbsoluteFill style={{background: C.paper, backgroundImage: `repeating-linear-gradient(0deg, transparent 0 63px, ${C.rule} 63px 65px)`}}>
    <Fonts />
    {/* headline: the full hook, y 250-560 */}
    <div style={{position: 'absolute', left: 66, top: 250, fontFamily: 'Archivo', fontWeight: 900, fontSize: 148, lineHeight: 1.0, letterSpacing: -5, color: C.ink}}>
      <div>Stop paying</div>
      <div>for <span style={{background: C.mint, borderRadius: 14, padding: '0 14px'}}>3 AI tools.</span></div>
    </div>
    {/* left: the 3 prices from the real run */}
    <div style={{position: 'absolute', left: 50, top: 640, width: 480, transform: 'rotate(-2deg)'}}>
      <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 52, color: C.ink, marginBottom: 10}}>3 tools</div>
      <div style={{background: C.dark, border: `4px solid ${C.ink}`, borderRadius: 20, padding: '22px 24px'}}>
        {[['ChatGPT Plus', '$20'], ['Claude Pro', '$20'], ['Google AI Pro', '$19.99']].map(([a, b]) => (
          <div key={a} style={{display: 'flex', justifyContent: 'space-between', fontFamily: 'Archivo', fontWeight: 600, fontSize: 43, color: '#E6E6E6', lineHeight: 1.5}}>
            <span>{a}</span><span>{b}</span>
          </div>
        ))}
      </div>
      <div style={{position: 'relative', display: 'inline-block', marginTop: 14, fontFamily: 'Archivo', fontWeight: 900, fontSize: 124, letterSpacing: -3, color: C.red}}>
        $59.99<div style={{fontFamily: 'Plex', fontSize: 26, letterSpacing: 0, color: C.muted, marginTop: -8}}>a month, all 3</div>
        
      </div>
    </div>
    {/* right: the real verdict */}
    <div style={{position: 'absolute', left: 556, top: 640, width: 480, transform: 'rotate(2deg)'}}>
      <div style={{fontFamily: 'Archivo', fontWeight: 900, fontSize: 52, color: C.ink, marginBottom: 10}}>1 tool</div>
      <div style={{background: C.card, border: `4px solid ${C.ink}`, borderRadius: 20, padding: '20px 24px', fontFamily: 'Archivo', fontWeight: 600, fontSize: 45, lineHeight: 1.2, color: C.ink}}>
        “spend your €20 on <span style={{background: C.mint, borderRadius: 8, padding: '0 6px'}}>ChatGPT Plus</span>, keep the other two free”
      </div>
      <div style={{marginTop: 14, fontFamily: 'Archivo', fontWeight: 900, fontSize: 124, letterSpacing: -3, color: C.green}}>
        $20<div style={{fontFamily: 'Plex', fontSize: 26, letterSpacing: 0, color: C.muted, marginTop: -8}}>a month, 1 tool</div>
      </div>
    </div>
    <div style={{position: 'absolute', left: 66, top: 1230}}><Mono>excerpt · real run · ChatGPT · 24 Nov 2026</Mono></div>
    {/* caption chunk 1 */}
    <div style={{position: 'absolute', left: 66, top: 1280, fontFamily: 'Archivo', fontWeight: 900, fontSize: 66, letterSpacing: -1.5, color: C.ink}}>
      <span style={{background: C.mint, borderRadius: 10, padding: '0 8px'}}>Stop</span> paying for
    </div>
    {/* Sage bust, P-6/W-7 position */}
    <div style={{position: 'absolute', left: 872 - 347.5 * 1.06, top: 1388, width: 700}}>
      <Img src={staticFile('sage/s-present.png')} style={{height: 1121 * 1.06}} />
    </div>
  </AbsoluteFill>
);
