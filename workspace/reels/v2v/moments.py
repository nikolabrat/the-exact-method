import json
M = {
 'q1':(0,3,-2),'paste':(0,8,-3),
 'B_in':('L',1,-6),'phone':(1,9,-2),'tog_on':(2,1,-3),'tog_off':(2,3,-3),
 'r1':(2,4,-3),'r2':(2,6,-3),'r3':(2,8,-3),'send':(2,13,-2),
 'C_in':('L',3,-6),'circ1':(3,3,-2),'swap':(3,15,-8),'circ2':(3,16,-4),'wipe1':(3,11,-4),'wipe2':(3,-1,-2),
 'D_in':('L',4,-5),'count':(4,3,-3),'wave1':(4,4,0),'wave2':(4,7,0),
 'E_in':('L',5,-4),'kw':(5,'KW',-2),'post':(5,'POST',0),'dm':(5,-1,-4),
 'A2_in':('L',6,-4),
}
for p in ['ig','tt']:
    T=json.load(open(f'../../src/v2timing_{p}.json')); Ls=T['lines']; out={}
    for k,v in M.items():
        if v[0]=='L': out[k]=Ls[v[1]]['start']+v[2]; continue
        li,wi,o=v
        if wi=='KW': wi=1 if p=='ig' else 2
        if wi=='POST': wi=2 if p=='ig' else 3
        out[k]=Ls[li]['words'][wi]['s']+o
    out['L']=[l['start'] for l in Ls]; out['TOTAL']=T['total']
    json.dump(out,open(f'../../src/v2moments_{p}.json','w')); print(p,out)
