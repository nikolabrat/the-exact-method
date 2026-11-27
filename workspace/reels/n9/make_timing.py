# N-9: src/n9timing_<p>.json (frames) + src/n9mouth_<p>.json from ElevenLabs alignment + mix RMS.
import json, subprocess, numpy as np
R = '/home/claude/the-exact-method/workspace/'
A = json.load(open(R + 'reels/n9/el_align.json'))
lines = dict(l.rstrip('\n').split('|', 1) for l in open(R + 'remotion/public/n9v/lines.txt'))
FPS = 30
# display text for caption chunks ('' = word not shown, timing kept)
import re as _re
NUM = {'hundred':'100','one':'1','two':'2','three':'3','five':'5','six':'6','eight':'8','ten':'10','twenty':'20','fifteen':'15','zero':'0','Two':'2','Three':'3','Six':'6','thirty-five':'35','seven-day':'7-day','one-line':'1-line'}
def SHOWF(t):
    m = _re.match(r"^([A-Za-z-]+)(.*)$", t)
    return (NUM.get(m.group(1), m.group(1)) + m.group(2)) if m else t
SKIP = {'18'}
for p in ['ig', 'tt']:
    ids = ['01','02','03','04','06','07','08','09','10','11','12','13','14','15','16','18','19','20','21','22','23','24' + p,'25']
    W = [w for w in A[p] if w['text'].strip()]; k = 0; out = []
    for i in ids:
        ws = []
        for t in lines[i].split():
            a = W[k]; k += 1
            txt = (SHOWF(t) if t.startswith('three') else t) if i[:2] in SKIP else SHOWF(t)
            ws.append({'w': txt, 's': round(a['start'] * FPS), 'e': max(round(a['end'] * FPS), round(a['start'] * FPS) + 2)})
        out.append({'id': i[:2], 'start': ws[0]['s'], 'end': ws[-1]['e'], 'text': ' '.join(w['w'] for w in ws if w['w']), 'words': ws})
    assert k == len(W), (p, k, len(W))
    end = out[-1]['end'] + 3
    total = end + 30
    json.dump({'lines': out, 'end': end, 'total': total}, open(R + f'remotion/src/n9timing_{p}.json', 'w'))
    pcm = subprocess.run(['ffmpeg', '-nostdin', '-loglevel', 'error', '-i', R + f'remotion/public/n9v/mix_{p}.wav', '-f', 'f32le', '-ac', '1', '-ar', '48000', '-'], capture_output=True).stdout
    x = np.frombuffer(pcm, np.float32); spf = 48000 // FPS
    n = total; rms = np.array([np.sqrt(np.mean(x[f*spf:(f+1)*spf] ** 2)) if f*spf < len(x) else 0 for f in range(n)])
    speak = np.zeros(n, bool)
    for l in out:
        for w in l['words']: speak[w['s']:w['e'] + 1] = True
    v = rms[speak]; lo, hi = np.percentile(v, 35), np.percentile(v, 70)
    lvl = [0 if not speak[f] else (2 if rms[f] >= hi else 1 if rms[f] >= lo else 0) for f in range(n)]
    json.dump(lvl, open(R + f'remotion/src/n9mouth_{p}.json', 'w'))
    print(p, 'end', end, 'total', total, [(l['id'], l['start']) for l in out])
