# N-8: build src/n8timing_<p>.json (frames, W-7 format) and src/n8mouth_<p>.json from ElevenLabs alignment + mix RMS.
import json, subprocess, numpy as np
R = '/home/claude/the-exact-method/workspace/'
A = json.load(open(R + 'reels/n8/el_align.json'))
lines = dict(l.rstrip('\n').split('|', 1) for l in open(R + 'remotion/public/n8v/lines.txt'))
FPS = 30
DIGIT = {'01': [3], '02': [0], '07': [3], '10': [1], '18ig': [4], '18tt': [4], '19': [6]}  # word idx "three" -> "3"
for p in ['ig', 'tt']:
    ids = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18' + p,'19']
    W = A[p]; k = 0; out = []
    for i in ids:
        toks = lines[i].split()
        ws = []
        for j, t in enumerate(toks):
            a = W[k]; k += 1
            txt = t
            if j in DIGIT.get(i, []) and t.lower().startswith('three'): txt = '3' + t[5:]
            ws.append({'w': txt, 's': round(a[1] * FPS), 'e': max(round(a[2] * FPS), round(a[1] * FPS) + 2)})
        out.append({'start': ws[0]['s'], 'end': ws[-1]['e'], 'text': ' '.join(w['w'] for w in ws), 'words': ws})
    assert k == len(W), (p, k, len(W))
    end = out[-1]['end'] + 3
    total = end + 30
    json.dump({'lines': out, 'end': end, 'total': total}, open(R + f'remotion/src/n8timing_{p}.json', 'w'))
    pcm = subprocess.run(['ffmpeg', '-nostdin', '-loglevel', 'error', '-i', R + f'remotion/public/n8v/mix_{p}.wav', '-f', 'f32le', '-ac', '1', '-ar', '48000', '-'], capture_output=True).stdout
    x = np.frombuffer(pcm, np.float32); spf = 48000 // FPS
    n = total; rms = np.array([np.sqrt(np.mean(x[f*spf:(f+1)*spf] ** 2)) if f*spf < len(x) else 0 for f in range(n)])
    speak = np.zeros(n, bool)
    for l in out:
        for w in l['words']: speak[w['s']:w['e'] + 1] = True
    v = rms[speak]; lo, hi = np.percentile(v, 35), np.percentile(v, 70)
    lvl = [0 if not speak[f] else (2 if rms[f] >= hi else 1 if rms[f] >= lo else 0) for f in range(n)]
    json.dump(lvl, open(R + f'remotion/src/n8mouth_{p}.json', 'w'))
    print(p, 'end', end, 'total', total, 'lines', len(out), 'starts', [l['start'] for l in out])
