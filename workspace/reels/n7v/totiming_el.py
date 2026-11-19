# word timings from ElevenLabs forced alignment of each processed line file (el_align.json)
import json
A=json.load(open('el_align.json'))
lines=[l.rstrip('\n').split('|',1) for l in open('lines.txt') if '|' in l]
for p in ['ig','tt']:
    T=json.load(open(f'timing_{p}.json')); out=[]
    for i,txt in lines:
        if i.startswith('09') and i!=f'09{p}': continue
        st=T['starts'][i[:2]]; W=A[i]; assert [w[0] for w in W]==txt.split(),i
        out.append({'start':round(st*30),'end':round((st+T['lens'][i[:2]])*30),'text':txt,
                    'words':[{'w':w,'s':round((st+a)*30),'e':round((st+b)*30)} for w,a,b in W]})
    end=round(T['end']*30); json.dump({'lines':out,'end':end,'total':end+30},open(f'../../src/n7timing_{p}.json','w')); print(p,end+30)
