# N-9 sound sheet (visual_plan.md): a sound on everything new, N-8 palette (library + uisfx + ElevenLabs), cues from p5cues.
import json,glob,os
src=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'../n8sfx/make_sheet.py')).read()
exec(src[:src.index("for k,(f,_,_) in S.items()")])
for k,(f,_,_) in S.items(): assert os.path.exists(f),(k,f)
PEAK={'A guess stamp'}
HIT={'impact','slam','right','fixed','bigrip','stampG','pill','stampthunk','bookthump'}
UIK={k for k,v in S.items() if '/uisfx/' in v[0]}
for p in ['ig','tt']:
    c_=json.load(open(f'../../remotion/src/n9cues_{p}.json'))
    C=[]
    def c(fr,k,label,dg=0):
        f,sl,g=S[k]; d={'t':round(max(fr,1)/30,3),'label':label,'file':f,'role':'foley','gain_db':g+dg}
        if sl: d['slice']=sl
        if k in HIT: d['role']='hit'; d['highpass']=220
        if k in UIK: d['role']='ui'
        if k not in ('riser','chime'): d['anchor']='arrive'
        if label in PEAK: d['anchor']='peak'
        if d['role']=='foley': d['highpass']=140
        C.append(d)
    q=c_
    # hook
    c(q['six'],'pill','6 pulses',-3); c(q['need1'],'tile2','1 pulses',-2)
    # calculator + twice
    c(q['calc']-2,'phoneslide','calculator card in'); 
    for i,k in enumerate(['t1','t2','t3','t4']): c(q['calc']+6+i*5,k,f'calc row {i+1}',-4)
    c(q['asked'],'blip','asked ChatGPT pill'); c(q['calc']+2,'headline','1 question 2 ways',-6)
    c(q['twice'],'deal1','two answers back'); c(q['oneLine'],'redTag','1 line tag'); c(q['threeSteps'],'tagT','3 steps tag')
    # one-line answer
    c(q['ans1'],'whip','whip to the chart'); c(q['ans1']+8,'tile1','bars grow',-3)
    for i,k in enumerate(['chip','chip2','chipG','stk1']): c(q['chips'][i],k,f'chip {i+1}',-3)
    for i,k in enumerate(['hl1','hl2','hlR']): c([q['fb35'],q['pin20'],q['red15']][i],k,f'row {i+1} red',-2)
    c(q['small'],'circleS','small print ring'); c(q['guess']-1,'stampthunk','A guess stamp')
    # hour vs 6
    c(q['hour']-2,'swoosh2','1 hour a day in'); c(q['hour']+6,'deal2','6 channel tiles',-3); c(q['hour'],'headline','1 hour 6 channels',-6)
    c(q['cant6'],'strikeS','6 channels struck'); c(q['cant6']+8,'strike2','strikes',-4)
    # steps
    c(q['steps3'],'slam','3 step tiles'); c(q['steps3']+5,'tileL','step 2',-3); c(q['steps3']+10,'tileR','step 3',-3)
    c(q['p1'],'slideUp','prompt 1 bubble'); c(q['p1']+2,'keys','prompt 1 typed',-4); c(q['p1']+6,'oneJob','step 1 question mark',-2)
    c(q['found8'],'cardfan','8 options land'); c(q['calcs3'],'x1','competitor 1',-2); c(q['calcs3']+6,'x2','competitor 2',-2); c(q['calcs3']+12,'x3','competitor 3',-2)
    c(q['exist'],'label','already exist label',-3)
    c(q['p2'],'push','prompt 2 bubble'); 
    for i,k in enumerate(['markerstroke','marker','markersq']): c([q['k1'],q['k2'],q['k3']][i],k,f'constraint {i+1} marked',-2)
    c(q['left3'],'shrink','5 options drop'); c(q['left3']+4,'fall','drop',-4)
    for i,k in enumerate(['tick1','tick2','mark1']): c(q[['fb','ig','rd'][i]],k,f'kept {i+1} lit',-2)
    # step 3
    c(q['p3'],'type','prompt 3 typed'); c(q['p3end']-6,'vertigo','answer zooms in'); c(q['start'],'right','Facebook unblurred')
    c(q['start']+2,'gold','Start Facebook headline',-3)
    for i,k in enumerate(['cross','strike1','tear2']): c(q[['notIG','notRD','notTT'][i]],k,f'not {i+1}',-2)
    c(q['followers'],'penW','bullet 1 marked')
    # days + goal
    c(q['d1']-4,'whip2','days in'); c(q['d1'],'sticker','day 1',-2); c(q['d2'],'stk2','day 2',-2); c(q['d3'],'slapS','day 3',-2)
    c(q['goal'],'count1','counter runs'); c(q['ten']+12,'fixed','10 lands',-4)
    # CTA
    c(q['cta'],'cta','comment bar in'); c(q['kw']-3,'kw','NARROW typed'); c(q['sendC'],'post','send'); c(q['fan']-2,'dm','prompts arrive'); c(q['fan'],'flip','three prompts fan out')
    # loop
    c(q['loop'],'loop','back to frame 0'); c(q['loop']+10,'gold','headline back',-2)
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
    KEY={'A guess stamp','3 step tiles','answer zooms in','three prompts fan out','8 options land'}
    used=set(d['file'] for d in C if d['label'] in KEY)
    last=None
    for d in C:
        if d['role']=='ui' or d['label'] in KEY: last=d['file']; continue
        if d['file'] in used:
            alt=[x for x in fam(d['file']) if x not in used and os.path.exists(x)]
            if not alt and d['file'].startswith(EL):
                alt=[x for v in EL_FAM.values() for x in [EL+y+'.wav' for y in v] if x not in used and os.path.exists(x)]
            if alt: d['file']=alt[0]; d.pop('slice',None)
        used.add(d['file'])
    for d in C:
        if d['role']!='hit': d['gain_db']+=0
    json.dump({'video':os.path.abspath(f'../../remotion/out/N9-{p}-raw.mp4'),'keep_audio':'yes','cues':C},open(f'sheet_{p}.json','w'),indent=0)
    print(p,len(C),'cues', len(set(d['file'] for d in C)),'distinct')
