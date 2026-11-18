import json
lines=[l.rstrip('\n').split('|',1) for l in open('lines.txt') if '|' in l]
for p in ['ig','tt']:
    T=json.load(open(f'timing_{p}.json')); A=json.load(open(f'align_{p}.json'))['words']
    ids=[i for i,_ in lines if not (i.startswith('06') and i!=f'06{p}')]
    txt=dict(lines); out=[]; k=0
    for i in ids:
        ws=txt[i].split(); n=len(ws); wd=A[k:k+n]; k+=n
        st=T['starts'][i[:2]]
        out.append({'start':round(st*30),'end':round((st+T['lens'][i[:2]])*30),'text':txt[i],
                    'words':[{'w':w,'s':round(a['start']*30),'e':round(a['end']*30)} for w,a in zip(ws,wd)]})
    end=round(T['end']*30); json.dump({'lines':out,'end':end,'total':end+30},open(f'../../src/v2timing_{p}.json','w'))
    print(p,end,end+30,len(out))
