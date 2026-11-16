"""Build mix_ig.wav / mix_tt.wav, timing_<plat>.json and align_<plat>.json (word timings for captions).
Run inside public/<reel>v/ after process.sh. Edit IDS and GAP for the Reel.
Word timings come from faster-whisper (no API key needed), snapped to the script's own words."""
import subprocess, json, re, difflib, sys
IDS = ['01','02','03','04','05','06','07','08','09{p}','10']          # '{p}' = platform line
BIAS = 0.1   # whisper word starts run ~0.1 s early vs ElevenLabs alignment (measured on W-5)
GAP = {'02':0.32,'03':0.38,'04':0.42,'05':0.38,'06':0.22,'07':0.42,'08':0.42,'09':0.5,'10':0.35}

def dur(f): return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]))
texts = dict(l.rstrip('\n').split('|',1) for l in open('lines.txt') if '|' in l)
from faster_whisper import WhisperModel
import numpy as np
model = WhisperModel('small.en', compute_type='int8')
def norm(w): return re.sub(r"[^a-z0-9']", '', w.lower())
def words_for(wav, text):
    pcm = subprocess.run(['ffmpeg','-nostdin','-loglevel','error','-i',wav,'-f','f32le','-ac','1','-ar','16000','-'],capture_output=True).stdout
    segs,_ = model.transcribe(np.frombuffer(pcm, np.float32), word_timestamps=True, language='en')
    heard = [w for s in segs for w in s.words]
    script = text.split()
    sm = difflib.SequenceMatcher(a=[norm(w) for w in script], b=[norm(w.word) for w in heard], autojunk=False)
    t = [None]*len(script)
    for a,b,n in sm.get_matching_blocks():
        for k in range(n): t[a+k] = (heard[b+k].start, heard[b+k].end)
    end = dur(wav)  # fill words whisper missed by spreading them between known neighbours
    for i in range(len(script)):
        if t[i] is None:
            j = i
            while j < len(script) and t[j] is None: j += 1
            lo = t[i-1][1] if i else 0.0; hi = t[j][0] if j < len(script) else end
            step = (hi-lo)/(j-i+1)
            for k in range(i, j): t[k] = (lo+step*(k-i), lo+step*(k-i+1))
    ratio = sm.ratio()
    if ratio < 0.8:  # names like Claude are often heard as 'Clod': read the line and judge
        print(f'CHECK {wav}: heard "{"".join(w.word for w in heard).strip()}" vs text "{text}" ({ratio:.0%})', file=sys.stderr)
    return [{'text': w, 'start': s, 'end': e} for w,(s,e) in zip(script, t)]

for plat in ['ig','tt']:
    ids = [i.format(p=plat) for i in IDS]
    t = 0.1; starts = {}; parts = []; inputs = []
    for i in ids:
        t += GAP.get(i[:2], 0); starts[i[:2]] = round(t, 3); d = dur(f'f{i}.wav')
        inputs += ['-i', f'f{i}.wav']; parts.append((t, d)); t += d
    end = round(t, 3)
    fl = ''.join(f'[{k}]adelay={int(s*1000)}|{int(s*1000)}[a{k}];' for k,(s,_) in enumerate(parts))
    fl += ''.join(f'[a{k}]' for k in range(len(parts))) + f'amix=inputs={len(parts)}:normalize=0,apad=whole_dur={end+1.2}[o]'
    subprocess.run(['ffmpeg','-nostdin','-y','-loglevel','error',*inputs,'-filter_complex',fl,'-map','[o]','-ar','48000','-ac','1',f'mix_{plat}.wav'],check=True)
    json.dump({'starts':starts,'end':end,'lens':{i[:2]:round(dur(f'f{i}.wav'),3) for i in ids}}, open(f'timing_{plat}.json','w'), indent=1)
    words = []
    for i in ids:
        off = starts[i[:2]]
        words += [{'text':w['text'],'start':round(w['start']+off+BIAS,3),'end':round(w['end']+off+BIAS,3)} for w in words_for(f'f{i}.wav', texts[i])]
    json.dump({'words': words}, open(f'align_{plat}.json','w'))
    print(plat, 'end', end, 'words', len(words), starts)
