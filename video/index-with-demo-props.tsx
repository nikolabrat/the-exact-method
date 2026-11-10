import React from 'react';
import {Composition, registerRoot} from 'remotion';
const C1 = {mint: '#6BE0A0', gold: '#F2B632', sage: '#9CC9B0', paper: '#ECE8DD'};
import {PileUp, PileUpProps, T} from './PileUp';
import {PhoneFilm, PhoneFilmProps, PT} from './PhoneFilm';
import {PileUp2, PileUp2Props, T2} from './PileUp2';
import {PhoneFilm2, PhoneFilm2Props, PF} from './PhoneFilm2';

// Demo content = V-5. The 13 labels are the 13 "Banned by default" bullets in
// github.com/ferndesk/no-slop-motion SKILL.md, shortened.
export const demo: PileUpProps = {
  kicker: 'Before your next AI video',
  hook: ['Install this', 'first.'],
  caption: 'AI video habits',
  items: [
    {text: 'Drop shadows', x: 90, y: 400, r: -5, anchor: 'l'},
    {text: 'Glows and vignettes', x: 990, y: 480, r: 4, anchor: 'r'},
    {text: 'Card grids', x: 540, y: 290, r: -2},
    {text: 'Slides that sit still', x: 80, y: 600, r: 3, anchor: 'l', mint: true},
    {text: 'Text parked at the top', x: 1000, y: 1265, r: -4, anchor: 'r'},
    {text: 'One-frame pops', x: 70, y: 1180, r: 4, anchor: 'l', mint: true},
    {text: 'Glitch transitions', x: 80, y: 1520, r: -3, anchor: 'l'},
    {text: 'Bouncy moves', x: 1000, y: 680, r: 5, anchor: 'r'},
    {text: 'CSS colour filters', x: 90, y: 1350, r: -2, anchor: 'l'},
    {text: 'Tweet-card quotes', x: 990, y: 1605, r: 3, anchor: 'r'},
    {text: 'Two CTAs in a frame', x: 540, y: 1730, r: 2},
    {text: 'A sound on every hit', x: 80, y: 760, r: -4, anchor: 'l'},
    {text: 'Stitched AI voices', x: 1010, y: 1435, r: 5, anchor: 'r'},
  ],
  answer: 'One skill.',
  pill: 'npx skills add ferndesk/no-slop-motion',
  proofKicker: 'What it does',
  proof: [
    {big: '13', text: 'habits banned before you build'},
    {big: '1', text: 'scan for one-frame pops after the render'},
  ],
  endTitle: 'The Video Brief',
  endSub: 'Free PDF · link in bio',
};

export const phoneDemo: PhoneFilmProps = {
  h1: ['AI that narrows', '25 ideas', 'to one.'],
  ask: 'Give me business ideas I could start',
  answerIntro: 'Here are 25 ideas to consider:',
  list: ['Pet sitting and dog walking', 'Online tutoring', 'Etsy print shop', 'Bookkeeping for cafés', 'Social media help', 'Meal prep', 'Bike repair',
    'Course creation', 'Virtual assistant', 'House cleaning', 'Dropshipping', 'Photo editing', 'Plant care', 'Resume writing', 'Language lessons',
    'Garden care', 'Event setup', 'Pet grooming', 'Moving help', 'Phone repair', 'Baby-sitting', 'Translation', 'Window cleaning', 'Car washing', 'Errand running'],
  card: {kicker: 'Prompt 3 · pick one', count: '1 of 25', before: 'Start with', accent: 'pet sitting and dog walking.', chips: ['10 h a week', '€0 to start', 'beginner'], button: 'Start here'},
  h2: ['Three prompts.', 'One', 'answer.'],
  steps: [{title: 'Go broad', sub: '25 ideas'}, {title: 'Add your limits', sub: '8 left'}, {title: 'Pick one', sub: '1 to start'}],
  caption: ['A suggestion to test.', 'You', ' make the call.'],
  end: ['The Narrowing', 'Method.'],
  endChip: 'Free PDF',
  cover: 'cover-narrowing.jpg',
};

// Demo = V-5 (no-slop-motion). Hub numbers are from the repo README (10 gates, 13-item banned list,
// 7 templates, pop and flash detector). Stats: V-1 was 63.6 s at 30 fps = 1,908 frames; the scan caught
// 1 pop (the letter-by-letter headline). Scan rows are demo rows: replace with the real scan when used.
export const pile2: PileUp2Props = {
  prompt: 'every AI video|ships with',
  smash: [
    {word: 'SHADOWS', foot: 'box · text · drop'},
    {word: 'GLOWS', foot: 'gradients · flares · vignettes'},
    {word: 'POP-INS', foot: '1 frame · scale 0 → 1'},
    {word: 'BOUNCE', foot: 'elastic · overshoot'},
    {word: 'GLITCHES', foot: 'rgb split · shake · noise'},
  ],
  counterLabel: 'Frames to check by hand', counterTo: 1908,
  anotherWords: ['shadow', 'glow', 'pop-in', 'bounce', 'glitch', 'vignette'],
  tags: ['box-shadow: 0 8px 24px', 'filter: saturate(1.4)', 'ease: linear', 'bounce: 1.6', 'glow · 40px', 'vignette · 0.6', 'pop-in · 1 frame',
    'glitch · 6 frames', 'card grid · 3×2', 'text-shadow: 0 2px 8px', 'tweet card', 'whoosh.wav', 'CTA × 2', 'gradient · radial', 'stitched TTS',
    'typewriter text', 'static slide · 4 s', 'lens flare', 'drop-shadow: 0 4px', 'scale: 0 → 1', 'sound on every hit', 'filter: sepia(0.3)',
    'overshoot: 1.3', 'noise overlay', 'emoji rain', 'confetti burst', 'wipe · star', 'blur: 20px', 'zoom punch ×4', 'kinetic captions'],
  rgbSplit: false,
  answer: 'One skill.', pill: 'npx skills add ferndesk/no-slop-motion', pillTag: 'ONE SKILL', answerLabel: 'SKILLS TO INSTALL: 1',
  hubTitle: ['Everything it', 'checks.'],
  hub: [
    {value: 10, label: 'gates', icon: '▤'},
    {value: 13, label: 'banned habits', icon: '⊘'},
    {value: 7, label: 'templates', icon: '❐'},
    {value: 'pops', label: 'flash detector', icon: '◎'},
  ],
  marquee: ['shadows', 'glows', 'vignettes', 'card grids', 'static slides', 'pop-ins', 'glitches', 'linear moves', 'filters', 'tweet cards'],
  stats: [{value: 1908, suffix: '', label: 'frames scanned in one reel'}, {value: 1, suffix: '', label: "pop caught that I'd missed"}],
  scanTitle: 'LIVE · POP SCAN',
  scanRows: [{text: 'f0001–0240', ok: true}, {text: 'f0241–0480', ok: true}, {text: 'f0481–0720', ok: true}, {text: 'f0721 headline', ok: false},
    {text: 'f0722–0960', ok: true}, {text: 'f0961–1200', ok: true}, {text: 'f1201–1440', ok: true}, {text: 'f1441–1680', ok: true}, {text: 'f1681–1908', ok: true}],
  scanFoot: '1 scan · after every render',
  worksWith: ['Claude Code', 'HyperFrames', 'any .mp4'],
  endWord: 'The Exact Method', endLine: ['The Video Brief.', 'Free PDF.'], endPills: ['link in bio', 'Get the PDF →'],
};

// Demo = The Narrowing Method. The 25 ideas and the 25 → 8 → 1 flow are from the approved phone
// reference; the limit counts per line (cut 9 / 5 / 3) are demo numbers: replace with a real run.
const w = (t: string, a?: 1 | 2) => ({t, a});
export const phone2: PhoneFilm2Props = {
  h: [
    [[w('AI'), w('that'), w('narrows')], [w('25 ideas', 1)], [w('to'), w('one.')]],
    [[w('It'), w('takes')], [w('three', 1), w('prompts.')]],
    [[w('Your'), w('limits')], [w('do the work.', 1)]],
    [[w('Then'), w('you')], [w('pick one.', 2)]],
    [[w('Less'), w('guessing.', 1)]],
    [[w('The'), w('Narrowing')], [w('Method.', 1)]],
  ],
  phone: {app: 'Chat', sub: 'your AI tool', ask: 'Give me business ideas I could start', intro: 'Here are 25 ideas to consider:',
    list: ['Pet sitting and dog walking', 'Online tutoring', 'Etsy print shop', 'Bookkeeping for cafés', 'Social media help', 'Meal prep', 'Bike repair',
      'Course creation', 'Virtual assistant', 'House cleaning', 'Dropshipping', 'Photo editing', 'Plant care', 'Resume writing', 'Language lessons',
      'Garden care', 'Event setup', 'Pet grooming', 'Moving help', 'Phone repair', 'Baby-sitting', 'Translation', 'Window cleaning', 'Car washing', 'Errand running']},
  result: {kicker: 'Prompt 3 · pick one', title: 'Start here', rows: [['Idea', 'Pet sitting and dog walking'], ['Fits', '10 h a week · €0 · beginner']], badge: 'picked'},
  toast: {avatars: ['P1', 'P2', 'P3'], text: '25 ideas → 1 to start'},
  helpers: [
    {init: 'P1', title: 'Go broad', sub: 'A long list of real options', tone: C1.mint},
    {init: 'P2', title: 'Add your limits', sub: 'Time, budget, skills', tone: C1.gold},
    {init: 'P3', title: 'Pick one', sub: 'And say why', tone: C1.sage},
    {init: 'You', title: 'Make the call', sub: 'It is a suggestion to test', tone: C1.paper},
  ],
  notif: {app: 'Your AI tool', title: 'Prompt 3', body: 'Start with pet sitting and dog walking. It fits your 10 hours a week.'},
  thread: {title: 'Your limits', sub: 'none added yet', counter: 'limits in', message: 'I have 10 hours a week, €0 to start, and I am a beginner.',
    joins: [{init: 'h', text: '10 h a week — cut 9 ideas', tone: C1.mint}, {init: '€', text: '€0 to start — cut 5 ideas', tone: C1.gold}, {init: 'B', text: 'beginner — cut 3 ideas', tone: C1.sage}]},
  listCard: {title: 'Shortlist · 8 left', rows: [['01', 'Pet sitting and dog walking'], ['02', 'Online tutoring'], ['03', 'Plant care']], chip: 'fits'},
  fan: [{label: 'Pet sitting', icon: 'paw'}, {label: 'Tutoring', icon: 'book'}, {label: 'Bike repair', icon: 'bike'}],
  check: {title: 'First week', items: ['Tell 5 neighbours', 'Post in the local group', 'Set a price', 'Book the first walk'], button: 'Start this week', done: 'Started'},
  benefits: ['One idea that fits your time', 'Nothing to buy first', 'Your limits, not a guru’s', 'You make the call'],
  foot: ['More time to', 'actually start.'],
  end: {chip: 'Free PDF · link in bio'},
};

const Root: React.FC = () => (
  <>
  <Composition id="PhoneFilm2" component={PhoneFilm2 as any} durationInFrames={PF.total} fps={30} width={1080} height={1920} defaultProps={phone2} />
  <Composition id="PileUp2" component={PileUp2 as any} durationInFrames={T2.total} fps={30} width={1080} height={1920} defaultProps={pile2} />
  <Composition id="PhoneFilm" component={PhoneFilm as any} durationInFrames={PT.total} fps={30} width={1080} height={1920} defaultProps={phoneDemo} />
  <Composition id="PileUp" component={PileUp as any} durationInFrames={T.total} fps={30} width={1080} height={1920} defaultProps={demo} />
  </>
);
registerRoot(Root);
