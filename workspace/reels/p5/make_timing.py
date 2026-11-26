# V-3: src/p5timing_<p>.json (frames) + src/p5mouth_<p>.json from ElevenLabs alignment + mix RMS.
import json, subprocess, numpy as np
R = '/home/claude/the-exact-method/workspace/'
A = json.load(open(R + 'reels/p5/el_align.json'))
lines = dict(l.rstrip('\n').split('|', 1) for l in open(R + 'remotion/public/p5v/lines.txt'))
FPS = 30
# display text for caption chunks ('' = word not shown, timing kept)
SHOW = {'two': '2', 'Two': '2', 'four': '4', 'three': '3', 'three.': '3.', 'one': '1', 'zero': '0'}
ONLY = {k: True for k in ['02', '05', '07', '10', '11', '12', '15', '17', '19']}
for p in ['ig', 'tt']:
    ids = [f'{i:02d}' for i in range(1, 19)] + ['19' + p, '20']
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
    json.dump({'lines': out, 'end': end, 'total': total}, open(R + f'remotion/src/p5timing_{p}.json', 'w'))
    pcm = subprocess.run(['ffmpeg', '-nostdin', '-loglevel', 'error', '-i', R + f'remotion/public/p5v/mix_{p}.wav', '-f', 'f32le', '-ac', '1', '-ar', '48000', '-'], capture_output=True).stdout
    x = np.frombuffer(pcm, np.float32); spf = 48000 // FPS
    n = total; rms = np.array([np.sqrt(np.mean(x[f*spf:(f+1)*spf] ** 2)) if f*spf < len(x) else 0 for f in range(n)])
    speak = np.zeros(n, bool)
    for l in out:
        for w in l['words']: speak[w['s']:w['e'] + 1] = True
    v = rms[speak]; lo, hi = np.percentile(v, 35), np.percentile(v, 70)
    lvl = [0 if not speak[f] else (2 if rms[f] >= hi else 1 if rms[f] >= lo else 0) for f in range(n)]
    json.dump(lvl, open(R + f'remotion/src/p5mouth_{p}.json', 'w'))
    print(p, 'end', end, 'total', total, [(l['id'], l['start']) for l in out])
