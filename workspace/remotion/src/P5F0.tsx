// P-5 frame-0 still: real ChatGPT run on top (tells marked), hook headline + Sage on paper below.
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, Fonts, GptChrome, GptEmail, RunTag, UI_FONT} from './p5ui';

const SPLIT = 1150;
const MOUTHX = 347.5;

export const P5F0: React.FC = () => {
  const k = 0.66, H = 1121 * k;
  return (
    <AbsoluteFill style={{background: C.black}}>
      <Fonts />
      {/* ChatGPT top bar */}
      <div style={{position: 'absolute', left: 40, top: 54, right: 40, display: 'flex', alignItems: 'center', fontFamily: UI_FONT, color: C.gptText}}>
        <div style={{fontSize: 34, fontWeight: 600}}>ChatGPT</div>
        <div style={{marginLeft: 22, fontSize: 24, color: C.gptMuted, border: `2px solid ${C.gptRule}`, borderRadius: 24, padding: '6px 16px'}}>Temporary chat</div>
      </div>
      <div style={{position: 'absolute', left: 40, right: 40, top: 130}}><GptChrome /></div>
      <div style={{position: 'absolute', left: 40, top: 316}}>
        <GptEmail m={{x1: 1, x2: 1, x3: 1, x4: 1, bold: 1, dash: 1}} />
      </div>
      <div style={{position: 'absolute', left: 44, top: SPLIT - 52}}><RunTag text="REAL RUN · CHATGPT FREE · 26 NOV" /></div>

      {/* paper panel */}
      <div style={{position: 'absolute', left: 0, right: 0, top: SPLIT, bottom: 0, background: C.paper}} />
      <div style={{position: 'absolute', left: 62, top: SPLIT + 44, width: 660, fontFamily: 'Archivo', fontWeight: 900, fontSize: 92, lineHeight: 0.98, letterSpacing: -2.5, color: C.ink}}>
        Lose sales with your AI email?
      </div>
      <div style={{position: 'absolute', left: 62, top: SPLIT + 345, display: 'flex', alignItems: 'center', gap: 14}}>
        <div style={{background: C.ink, color: C.paper, fontFamily: 'Archivo', fontWeight: 800, fontSize: 40, borderRadius: 40, padding: '10px 26px'}}>2 AIs.</div>
        <div style={{background: C.red, color: '#fff', fontFamily: 'Archivo', fontWeight: 800, fontSize: 40, borderRadius: 40, padding: '10px 26px'}}>2 signatures.</div>
      </div>
      {/* spoken caption */}
      <div style={{position: 'absolute', left: 62, top: SPLIT + 470, fontFamily: 'Archivo', fontWeight: 900, fontSize: 64, color: C.ink}}>
        <span style={{background: C.mint, padding: '0 12px', borderRadius: 8}}>Lose</span> sales
      </div>
      {/* Sage */}
      <div style={{position: 'absolute', left: 900 - MOUTHX * k, top: SPLIT + 60, width: 600, height: H}}>
        <Img src={staticFile('sage/s-present-open.png')} style={{position: 'absolute', left: 0, top: 0, height: H}} />
      </div>
    </AbsoluteFill>
  );
};
