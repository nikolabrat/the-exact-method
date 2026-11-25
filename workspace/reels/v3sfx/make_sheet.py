# V-3 sound sheet (plan.md §5): a sound on everything new, subtle; library (openverse cc0) + uisfx + ElevenLabs.
import json,glob,os
src=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'../n8sfx/make_sheet.py')).read()
exec(src[:src.index("for k,(f,_,_) in S.items()")])   # same sound palette as N-8 (S, ui, ov, el)
for k,(f,_,_) in S.items(): assert os.path.exists(f),(k,f)
HIT={'impact','slam','right','fixed','bigrip','stampG','pill','stampthunk','lowthud'}
UIK={k for k,v in S.items() if '/uisfx/' in v[0]}
for p in ['ig','tt']:
    T=json.load(open(f'../../remotion/src/v3timing_{p}.json'))
    for l in T['lines']: l['words']=[x for x in l['words'] if x['w'].strip()]
    L=[l['words'][0]['s'] for l in T['lines']]
    def w(li,wi): ws=T['lines'][li]['words']; return ws[min(wi,len(ws)-1)]['s']
    ig=p=='ig'; TOTAL=T['total']; END=T['end']
    kw=[x['s'] for x in T['lines'][19]['words'] if 'VIDEO' in x['w']][0]
    pushA=L[2]-6; neverAt=w(2,6); outA=L[3]-4
    openAt=[L[4]-6,L[5]-6,L[6]-6,L[8]-6,L[10]-6,L[14]-6]; codeA=L[15]-6; phoneA=L[16]-6; ansA=L[18]-6; ctaA=L[19]-6; loopA=L[20]-4
    railA=w(3,6)-4
    C=[]
    def c(fr,k,label,dg=0):
        f,sl,g=S[k]; d={'t':round(max(fr,1)/30,3),'label':label,'file':f,'role':'foley','gain_db':g+dg}
        if sl: d['slice']=sl
        if k in HIT: d['role']='hit'; d['highpass']=160
        if k in UIK: d['role']='ui'
        if k not in ('riser','chime'): d['anchor']='arrive'
        C.append(d)
    heads=[L[1],L[2],L[3],L[4],L[5],L[6],L[7],L[8],L[9],L[10],L[11],L[13],L[14],L[15],L[16],L[18],L[19],L[20]]
    # 1-2 hook, brief
    c(w(1,5)-4,'count1','6 blocks spins'); c(w(1,6)-6,'tileR','brief card nudges up')
    # 3 proof, never opened
    c(pushA,'zoomIn','push into the phone'); c(neverAt-4,'tagL','editing app card'); c(neverAt-2,'stampthunk','never opened stamp')
    c(w(2,9)-2,'x1','editing app crossed',-5); c(w(2,9)+3,'x2','second cross')
    # 4 pull back, card to centre, blocks flick
    c(outA,'whip','phone out, card in'); c(outA+6,'gold','card lands centre')
    for i in range(6): c(railA+8+i*6,['tg2','tg3','tg4','tg5','tg6','tg7'][i],f'block {i+1} flick',-7)
    # block opens + rail ticks
    for i,a in enumerate(openAt):
        c(a,['tick1','tick2','t1','t2','tick1','t3'][i],f'rail dot {i+1}'); c(a+3,'shrink',f'block {i+1} opens',-4)
    c(w(3,12)-2,'stampG2','copy-paste ready stamp',-4)
    # 5 who
    c(w(4,4)-1,'sticker','mine sticker'); c(w(4,5)-2,'penW','people who build'); c(w(4,7),'hl1','build highlight')
    # 6 script rows
    for i,a in enumerate([w(5,2),w(5,4),w(5,6)]): c(a-2,['tileL','slideUp','tileR'][i],f'voice file row {i+1}')
    # 7 look
    for i in range(4): c(w(6,3)-2+i*5,['t4','tg2','tg3','tg4'][i],f'swatch {i+1}')
    for i in range(3): c(w(6,7)-2+i*6,['chipG','tg5','tg6'][i],f'font chip {i+1}')
    c(L[7]-2,'page','Archivo specimen'); c(w(7,4)+3,'tg2','font flip 1'); c(w(7,4)+7,'tg3','font flip 2'); c(w(7,6)-2,'riser','mint wipe',3)
    # 9-10 timing
    c(L[8]-2,'strip','waveform strip slides in',4); c(w(9,1)-4,'tagL','cue chip every cue'); c(w(9,6)-4,'post','cue chip real voice'); c(w(9,16)-4,'tick2','cue chip word')
    c(w(9,16)+11,'thud','late guess lands'); c(w(9,22),'strike1','guess struck')
    # 11-14 never
    c(L[10]-6,'impact','rehook punch',-4); c(w(11,1)-2,'stampG','NEVER stamp')
    c(L[12]-4,'deal2','default sample in')
    for i,(a,k) in enumerate([(w(12,0),'redTag'),(w(12,2),'redTag'),(w(12,5),'redTag')]): c(a-2,k,f'never item {i+1}',-2)
    c(w(12,1),'x1','glow struck'); c(w(12,3),'x2','bounce struck'); c(w(12,10)-2,'x3','hand struck')
    c(w(13,2),'pile','defaults pile up'); c(w(13,6)-2,'stickypress','everyones default sticker')
    # 15 export
    c(w(14,2)-4,'count2','1080 spins'); c(w(14,4)-4,'count1','1920 spins'); c(w(14,5)-4,'tagT','loudness meter'); c(w(14,7)+2,'right','needle settles -14',-4)
    # 16 code + stills
    c(codeA,'swoosh2','card slides left'); c(codeA+10,'arrow','arrow to code'); c(w(15,2)-2,'keys','code lines',-2)
    for i in range(3): c(w(15,10)-4+i*6,['deal1','deal2','deal1'][i],f'still {i+1}')
    for i,a in enumerate([w(15,13),w(15,14),w(15,15)]): c(a,['tick1','tick2','t2'][i],f'still check {i+1}',-3)
    c(w(15,17)-2,'fixed','then render stamp',-3)
    # 17-18 phone twice
    c(phoneA,'phoneslide','phone returns'); c(w(16,3)-2,'stampG2','x2 badge'); c(w(17,0)-4,'video','speaker on'); c(w(17,3)-2,'post','muted')
    for i in range(8): c(w(17,6)-6+i*2.5+6,['t1','t2','t3','t4','tick1','tick2','tg2','tg3'][i],f'check {i+1}',-5)
    # 19 answer
    c(ansA,'swoosh2','full brief returns'); c(w(18,4)-3,'strike2','editing struck'); c(w(18,6)-2,'chime','writing the brief (the one chime)')
    # 20 CTA
    c(ctaA,'cta','comment bar in'); c(kw-3,'kw','VIDEO typed'); c(m:=w(19,2 if ig else 3),'post','send'); c(w(19,4 if ig else 5)-4,'dm','our DM arrives'); c(w(19,4 if ig else 5)+6,'miniC','brief card in DM')
    # 21 loop
    c(loopA,'loop','back to the phone'); c(loopA+8,'tileL','card back under the phone'); c(w(20,6)-2,'markerstroke','underline on editing',-3)
    HS=['headline','tileR','flutter','stk1','stk2','split','deal1','push','gold']
    for i,t in enumerate(heads): c(t-2,HS[i%len(HS)],'headline swap',-7)
    C.sort(key=lambda d:d['t'])
    EL_FAM={'hit':['bookthump','impact','numslam','stampthunk','stamp','emptythud','focussnap','coin','slap'],'paper':['phoneslide','stickypress','cardslap','receipt','tape','stack','cardfly','cardfan','cardpile','slide','flutter','puff','crumple','rip'],
            'mark':['markerstroke','pencilcurve','markersq','scratch','tick','clocktick','click','matchstrike'],'air':['airwhoosh','swoosh2','push','zoomwhoosh','riser','vertigo','scan','chatblip','notif','pop']}
    def fam(path):
        b=os.path.basename(path).split('.')[0]
        if path.startswith(EL):
            for k,v in EL_FAM.items():
                if b in v: return [EL+x+'.wav' for x in v]
            return [path]
        if path.startswith(OV):
            cat=os.path.basename(os.path.dirname(path)); return sorted(glob.glob(f'{OV}{cat}/*.mp3'))+sorted(glob.glob(f'{OV}{cat}/*.wav'))
        return [path]
    KEY={'never opened stamp','NEVER stamp','writing the brief (the one chime)','mint wipe','rehook punch','defaults pile up','mine sticker','our DM arrives'}
    used=set(d['file'] for d in C if d['label'] in KEY)
    for d in C:
        if d['role']=='ui' or d['label'] in KEY: continue
        if d['file'] in used:
            alt=[x for x in fam(d['file']) if x not in used and os.path.exists(x)]
            if not alt and d['file'].startswith(EL):
                alt=[x for v in EL_FAM.values() for x in [EL+y+'.wav' for y in v] if x not in used and os.path.exists(x)]
            if alt: d['file']=alt[0]; d.pop('slice',None)
            else: d['drop']=True
        used.add(d['file'])
    C=[d for d in C if not d.get('drop')]
    for d in C:
        if d['role']!='hit': d['gain_db']+=3
    json.dump({'video':os.path.abspath(f'../../remotion/out/V3-{p}-raw.mp4'),'keep_audio':'yes','cues':C},open(f'sheet_{p}.json','w'),indent=0)
    print(p,len(C),'cues')
