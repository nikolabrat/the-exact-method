# V-3: src/v3timing_<p>.json (frames) + src/v3mouth_<p>.json from ElevenLabs alignment + mix RMS.
import json, subprocess, numpy as np
R = '/home/claude/the-exact-method/workspace/'
A = json.load(open(R + 'reels/v3/el_align.json'))
lines = dict(l.rstrip('\n').split('|', 1) for l in open(R + 'remotion/public/v3v/lines.txt'))
FPS = 30
# display text for caption chunks ('' = word not shown, timing kept)
SHOW = {'six-block': '6-block', 'Ten': '1080', 'eighty': '', 'by': '×', 'nineteen': '1920', 'twenty,': '', 'minus': '−14.', 'fourteen.': '', 'eight': '8', 'A.I.': 'AI.'}
ONLY = {'15': True, '18': True, '02': True, '05': True}  # lines where SHOW applies
for p in ['ig', 'tt']:
    ids = [f'{i:02d}' for i in range(1, 20)] + ['20' + p, '21']
    W = [w for w in A[p] if w['text'].strip()]; k = 0; out = []
    for i in ids:
        ws = []
        for t in lines[i].split():
            a = W[k]; k += 1
            txt = SHOW.get(t, t) if i[:2] in ONLY else t
            ws.append({'w': txt, 's': round(a['start'] * FPS), 'e': max(round(a['end'] * FPS), round(a['start'] * FPS) + 2)})
        out.append({'id': i[:2], 'start': ws[0]['s'], 'end': ws[-1]['e'], 'text': ' '.join(w['w'] for w in ws if w['w']), 'words': ws})
    assert k == len(W), (p, k, len(W))
    end = out[-1]['end'] + 3
    total = end + 30
    json.dump({'lines': out, 'end': end, 'total': total}, open(R + f'remotion/src/v3timing_{p}.json', 'w'))
    pcm = subprocess.run(['ffmpeg', '-nostdin', '-loglevel', 'error', '-i', R + f'remotion/public/v3v/mix_{p}.wav', '-f', 'f32le', '-ac', '1', '-ar', '48000', '-'], capture_output=True).stdout
    x = np.frombuffer(pcm, np.float32); spf = 48000 // FPS
    n = total; rms = np.array([np.sqrt(np.mean(x[f*spf:(f+1)*spf] ** 2)) if f*spf < len(x) else 0 for f in range(n)])
    speak = np.zeros(n, bool)
    for l in out:
        for w in l['words']: speak[w['s']:w['e'] + 1] = True
    v = rms[speak]; lo, hi = np.percentile(v, 35), np.percentile(v, 70)
    lvl = [0 if not speak[f] else (2 if rms[f] >= hi else 1 if rms[f] >= lo else 0) for f in range(n)]
    json.dump(lvl, open(R + f'remotion/src/v3mouth_{p}.json', 'w'))
    print(p, 'end', end, 'total', total, [(l['id'], l['start']) for l in out])
