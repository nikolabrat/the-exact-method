# P-5 sound sheet (visual_plan.md): a sound on everything new, N-8 palette (library + uisfx + ElevenLabs), cues from p5cues.
import json,glob,os
src=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'../n8sfx/make_sheet.py')).read()
exec(src[:src.index("for k,(f,_,_) in S.items()")])
for k,(f,_,_) in S.items(): assert os.path.exists(f),(k,f)
PEAK={'Claude reply lands','Shouts stamp','Decorates stamp'}
HIT={'impact','slam','right','fixed','bigrip','stampG','pill','stampthunk','bookthump'}
UIK={k for k,v in S.items() if '/uisfx/' in v[0]}
for p in ['ig','tt']:
    c_=json.load(open(f'../../remotion/src/p5cues_{p}.json'))
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
    c(q['two'],'tile1','2 AIs pill pulses',-2); c(q['sig'],'tile2','2 signatures pill pulses',-2); c(q['two']+2,'push','push into the email',-4)
    # hook -> two-up
    c(q['side'],'whip','whip to two-up'); c(q['side']+6,'deal1','Claude card slides in'); c(q['claudeLand'],'blip','Claude reply lands')
    c(q['side']+8,'tagL','tool labels',-2); c(q['side']+4,'headline','same email headline',-5)
    c(q['shouts']+4,'stampthunk','Shouts stamp'); c(q['decor']+4,'stampG','Decorates stamp')
    # ChatGPT tells
    c(q['gptZoom'],'zoomIn','zoom into ChatGPT'); c(q['gptZoom']+4,'tg2','evidence header',-2)
    for i,k in enumerate(['x1','x2','x3','arrow']): c(q['x'][i],k,f'ring ! {i+1}',-2)
    c(q['x'][0]+1,'chip2','chip ! ! ! !',-4)
    c(q['bold'],'markerstroke','bold marker'); c(q['bold']+2,'tg3','chip bold',-2)
    c(q['dash'],'circleS','dash ring'); c(q['dash']+2,'tg4','chip dash',-2)
    c(q['miss'],'markersq','dont miss out marker'); c(q['miss']+2,'tg5','chip dont miss out',-2)
    # Claude tells
    c(q['claudeZoom'],'whip2','whip to Claude'); c(q['claudeZoom']+4,'tagT','Claude header')
    for i,k in enumerate(['t1','t3','t4']): c(q['emo'][i],k,f'emoji ring {i+1}')
    c(q['emo'][0]+1,'chipG','chip emoji',-2)
    c(q['list'],'pencilcurve','list squiggle'); c(q['list']+2,'tg6','chip list of 3',-2)
    c(q['world'],'hlR','means the world marker'); c(q['world']+2,'tg7','chip means the world',-2)
    # both
    c(q['both']-5,'deal2','back to two-up'); c(q['perfect'],'mark2','perfect time marked in both'); c(q['perfect']+4,'stk1','both chip'); c(q['perfect']+6,'pill','same phrase banner',-4)
    # rehook
    c(q['rule']-4,'page','instructions box in'); c(q['rule']+4,'type','typing write like a human'); c(q['strike'],'strikeS','rule struck')
    c(q['slam1'],'impact','2 tools slam (the one big hit)'); c(q['slam2'],'bookthump','2 mistakes slam',-3)
    c(q['fix']+2,'flip','rule swapped to 1 list per tool'); c(q['fix']+2,'headline','1 list per tool headline',-6)
    # lists into settings
    c(q['listWord']-4,'halftone','ChatGPT list card rim draws'); c(q['listWord']+1,'cardslap','Claude list card rim draws')
    c(q['paste']-6,'tileL','settings frames appear'); c(q['settings'],'stickypress','cards drop into settings')
    c(q['once']-1,'t2','saved ticks'); c(q['once'],'tick1','pasted once chip')
    # same request
    c(q['req'],'slideUp','prompt box in'); c(q['req']+2,'keys','prompt typed',-2); c(q['send']-2,'post','send pressed'); c(q['send'],'vertigo','dive through send')
    # after: Claude
    c(q['claudeAfter'],'push','Claude reply with list arrives'); c(q['claudeAfter']+2,'tile1','after header')
    c(q['cnt'][0],'count1','emoji counts to 0'); c(q['cnt'][0]+12,'tile2','emoji 0 lands'); c(q['cnt'][1],'count2','perfect time counts to 0')
    c(q['dates'],'hl1','real dates marked'); c(q['dates']+1,'fixed','real dates chip',-4)
    # after: ChatGPT
    c(q['gptAfter'],'swoosh2','whip to ChatGPT with list'); c(q['goneBold'],'tick2','bold gone chip'); c(q['goneDash'],'tg2','dash gone chip',-2)
    c(q['gone']-4,'strike2','bold and dash struck')
    for i,k in enumerate(['x1','x2','x3','arrow']): c(q['keptX'][i],k,f'amber ring {i+1}',-3)
    c(q['keptX'][0]+1,'thud','kept chip'); c(q['keptX'][3]+10,'hlF','dont miss out amber'); c(q['keptX'][3]+16,'mark1','perfect time amber',6)
    # read once
    c(q['read'],'headline','read it once headline',-5); c(q['read']+6,'halftone','scan line')
    # CTA
    c(q['cta'],'cta','comment bar in'); c(q['kw']-3,'kw','PLAIN typed'); c(q['sendC'],'post','send'); c(q['fan']-2,'dm','lists arrive'); c(q['fan'],'cardfan','three lists fan out')
    # loop
    c(q['loop'],'loop','back to the frame-0 chat'); c(q['loop']+10,'gold','hook headline back',-2); c(q['loop']+12,'markerstroke','rings redraw',-6)
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
    KEY={'2 tools slam (the one big hit)','Shouts stamp','Decorates stamp','dive through send','three lists fan out','same phrase banner'}
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
    json.dump({'video':os.path.abspath(f'../../remotion/out/P5-{p}-raw.mp4'),'keep_audio':'yes','cues':C},open(f'sheet_{p}.json','w'),indent=0)
    print(p,len(C),'cues', len(set(d['file'] for d in C)),'distinct')
