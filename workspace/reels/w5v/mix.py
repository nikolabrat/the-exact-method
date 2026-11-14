import subprocess, json, os
KEY = os.environ.get('ELEVENLABS_API_KEY') or open(os.path.expanduser('~/.private/el_key')).read().strip()
def dur(f): return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',f]))
texts = dict(l.strip().split('|',1) for l in open('lines.txt'))
for plat in ['ig','tt']:
    ids = ['01','02','03','04','05','06','07','08','09'+plat,'10']
    gap = {'02':0.32,'03':0.38,'04':0.42,'05':0.38,'06':0.22,'07':0.42,'08':0.42,'09'+plat:0.5,'10':0.35}
    t = 0.1; starts = {}; parts = []; inputs = []
    for i in ids:
        t += gap.get(i, 0); starts[i[:2]] = round(t, 3); d = dur(f'f{i}.wav')
        inputs += ['-i', f'f{i}.wav']; parts.append((t, d)); t += d
    end = round(t, 3)
    fl = ''.join(f'[{k}]adelay={int(s*1000)}|{int(s*1000)}[a{k}];' for k,(s,_) in enumerate(parts))
    fl += ''.join(f'[a{k}]' for k in range(len(parts))) + f'amix=inputs={len(parts)}:normalize=0,apad=whole_dur={end+1.2}[o]'
    subprocess.run(['ffmpeg','-nostdin','-y','-loglevel','error',*inputs,'-filter_complex',fl,'-map','[o]','-ar','48000','-ac','1',f'mix_{plat}.wav'],check=True)
    json.dump({'starts':starts,'end':end,'lens':{i[:2]:round(dur(f'f{i}.wav'),3) for i in ids}}, open(f'timing_{plat}.json','w'), indent=1)
    words=[]
    for i in ids:
        out = subprocess.run(['curl','-s','-X','POST','https://api.elevenlabs.io/v1/forced-alignment','-H',f'xi-api-key: {KEY}',
            '-F',f'file=@f{i}.wav','-F',f'text={texts[i]}'],capture_output=True,text=True,stdin=subprocess.DEVNULL).stdout
        d = json.loads(out); assert 'words' in d, out[:200]
        off = starts[i[:2]]
        for w in d['words']:
            words.append({'text': w['text'], 'start': round(w['start'] + off, 3), 'end': round(w['end'] + off, 3)})
    json.dump({'words': words}, open(f'align_{plat}.json','w'))
    print(plat, 'end', end, 'words', len(words), starts)
