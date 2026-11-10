import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {PileUp, PileUpProps, T} from './PileUp';
import {PhoneFilm, PhoneFilmProps, PT} from './PhoneFilm';

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

const Root: React.FC = () => (
  <>
  <Composition id="PhoneFilm" component={PhoneFilm as any} durationInFrames={PT.total} fps={30} width={1080} height={1920} defaultProps={phoneDemo} />
  <Composition id="PileUp" component={PileUp as any} durationInFrames={T.total} fps={30} width={1080} height={1920} defaultProps={demo} />
  </>
);
registerRoot(Root);
