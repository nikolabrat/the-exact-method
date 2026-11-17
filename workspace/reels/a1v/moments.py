import json
# name: (line, word, offset_frames)  or ('L', line, offset)
M = {
 'circle':(0,2,-2), 'reply1':(0,5,-2), 'reply2':(0,10,-3),
 'B_in':('L',1,-6), 'slot5':(1,4,-2), 's1':(1,6,0), 's2':(1,6,5), 's3':(1,7,2), 's4':(1,8,0),
 'C_in':('L',2,-4), 'chipBiz':(3,0,-3), 'answerAny':(3,6,-2), 'crumple':(4,0,-6), 'dots':(4,3,-4), 'limits':(4,8,-3), 'fade3':(4,11,0),
 'pick':(5,2,-2), 'ring':(5,5,-2),
 'D_in':('L',6,-4), 'job1':(7,2,-2), 'job2':(7,3,0), 'guess':(7,9,-2), 'split':(8,1,-2),
 'E_in':('L',9,-4), 'chips':(9,1,-2), 'tab':(9,8,-2), 'click':(9,11,2),
 'F_in':('L',10,-4), 'toolA':(10,3,-2), 'arrow':(10,8,-4), 'toolB':(10,8,4), 'tickB':(10,9,2),
 'G_in':('L',11,-4), 'struck':(11,3,-2), 'notcheck':(11,5,2),
 'G2_in':('L',12,-8), 'gemini':(12,3,-2),
 'H_in':('L',13,-4), 'source':(13,5,-3), 'stampSure':(14,0,-1),
 'I_in':('L',15,-4), 'habits':(15,1,-2), 'pages':(15,6,0),
 'J_in':('L',16,-3), 'kw':(16,'KW',-2), 'post':(16,-1,6),
 'A2_in':('L',17,-4),
}
for p in ['ig','tt']:
    T=json.load(open(f'../../src/a1timing_{p}.json')); Ls=T['lines']
    out={}
    for k,v in M.items():
        if v[0]=='L': out[k]=Ls[v[1]]['start']+v[2]
        else:
            li,wi,o=v
            if wi=='KW': wi=1 if p=='ig' else 2
            out[k]=Ls[li]['words'][wi]['s']+o
    out['L']=[l['start'] for l in Ls]; out['TOTAL']=T['total']
    json.dump(out,open(f'../../src/a1moments_{p}.json','w'))
    print(p, {k:out[k] for k in ['circle','reply1','reply2','B_in','C_in','crumple','D_in','E_in','F_in','G_in','G2_in','H_in','I_in','J_in','post','A2_in']}, out['TOTAL'])
