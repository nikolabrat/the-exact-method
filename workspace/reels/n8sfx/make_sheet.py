# N-8 sound sheet (plan.md §3): real-sfx library + uisfx + ElevenLabs. Based on W-7: a sound on every new element; library + uisfx + ElevenLabs (rip, tape, bigrip new 22 Nov)
import json,glob,os
UI='/root/.claude/skills/real-sfx/vendor/node_modules/uisfx/sounds/'
OV=os.path.expanduser('~/sfx-library/openverse-cc0/'); EL=os.path.expanduser('~/sfx-library/elevenlabs/')
def ov(cat,part,sl=None,g=-11): return (glob.glob(f'{OV}{cat}/*{part}*')[0],sl,g)
def ui(n,style='organic',g=-12,sl=None): return (f'{UI}{style}/{n}.mp3',sl,g)
def el(n,g=-11,sl=None): return (EL+n,sl,g)
S={'markerstroke':(EL+'markerstroke.wav',None,-14),'pencilcurve':(EL+'pencilcurve.wav',None,-15),'stickypress':(EL+'stickypress.wav',None,-13),'swoosh2':(EL+'swoosh2.wav',None,-15),'cardfan':(EL+'cardfan.wav',None,-14),'stampthunk':(EL+'stampthunk.wav',None,-8),'markersq':(EL+'markersq.wav',None,-14),'stampG2':(EL+'stamp.wav',None,-15),'cardslap':(EL+'cardslap.wav',None,-13),'bookthump':(EL+'bookthump.wav',None,-11),'receipt':(EL+'receipt.wav',None,-16),'phoneslide':(EL+'phoneslide.wav',None,-14),'vertigo':(EL+'vertigo.wav',None,-16),'blip':(EL+'chatblip.wav',None,-15),
 'slap':ov('drop','wood-knock-clean',[0,0.25],-17),'pill':el('numslam.wav',-14),'marker':el('markersq.wav',-11),'stampG':el('stamp.wav',-12),
 'impact':el('impact.wav',-10),'fall':el('zoomwhoosh.wav',-16,[0,0.35]),'deal1':el('cardfly.wav',-13),'deal2':ov('whoosh','swing-1-5',[0,0.4],-14),
 'strike1':ov('pencil_scratch','scribbling',[0,0.3],-12),'strike2':ov('pencil_scratch','signature',[0,0.35],-13),'pop1':el('pop.wav',-15),
 'zoomIn':ov('whoosh','digital-whoosh-soft',[0,0.5],-15),'label':el('tick.wav',-14),'type':ov('keyboard','typing',[0.0,0.8],-13),
 'chip':ov('paper_stack','papershuffle',[0,0.4],-13),'rip':el('rip.wav',-10),'burst':el('pop.wav',-16),'stk1':el('tape.wav',-15),'stk2':el('stack.wav',-15),
 'page':ov('paper_flip','page-turn-04',[0,0.5],-10),'sticker':el('tape.wav',-12),'split':el('puff.wav',-12),
 't1':ui('select','glass',-17),'t2':ui('check','glass',-16),'t3':ui('copy','glass',-16),'t4':ui('select','soft',-19),
 'shrink':ui('collapse','soft',-15),'pile':el('cardpile.wav',-12),'riser':el('riser.wav',-20),'slam':el('numslam.wav',-11),'thud':el('emptythud.wav',-14),
 'cross':el('focussnap.wav',-12),'oneJob':ui('badge','soft',-20),
 'whip':ov('swish','swing',[0,0.4],-13) if glob.glob(f'{OV}swish/*swing*') else ov('whoosh','swing-1-9',[0,0.4],-13),
 'redTag':ui('blocked','glass',-17),'hl1':el('markersq.wav',-13),'hl2':el('scratch.wav',-13),'tileL':ov('paper_slide','paper-slide',[0,0.3],-14) if glob.glob(f'{OV}paper_slide/*paper-slide*') else el('slide.wav',-13),
 'tileR':el('slide.wav',-13),'right':ov('stamp','thump',[0,0.3],-12),'crumple':el('crumple.wav',-11),'toss':ov('swish','swish-5',None,-14),'arrow':ov('pencil_scratch','signature',[0.6,1.0],-14),
 'halftone':el('scan.wav',-13),'lowthud':el('emptythud.wav',-12),'gold':el('slide.wav',-14),
 'flip':ov('paper_flip','page-turn-1',[0,0.5],-10),'orders':ui('badge','soft',-20),'write':ov('pen_tick','writing',[0.4,1.4],-15),
 'x1':ov('pencil_scratch','scribbling',[0.3,0.7],-12),'x2':ov('pencil_scratch','scribbling',[0.8,1.2],-12),'x3':ov('pencil_scratch','signature',[0.2,0.6],-11),
 'whip2':ov('whoosh','wooden-stick-swing',[0,0.4],-14),'keys':ov('keyboard','typing',[1.0,3.0],-17),'chipG':ui('select','soft',-18),'slideUp':el('slide.wav',-12),
 'hlR':el('markersq.wav',-13),'hlF':ov('pen_tick','sharpie',[0.3,0.7],-14),'fixed':ov('stamp','thump',[0,0.3],-11),'chime':ov('notification','approval',[0,0.8],-19),
 'bigrip':el('bigrip.wav',-8),'mark1':ov('pen_tick','sharpie',[0,0.5],-26),'mark2':el('markersq.wav',-12),'count1':el('clocktick.wav',-14),'count2':el('clocktick.wav',-14),'tile1':ui('badge','glass',-18),'tile2':el('coin.wav',-15),
 'cta':ov('whoosh','swing-1-5',[0,0.4],-14),'kw':ui('typing','mechanical',-13),'post':ui('press','glass',-12),'dm':el('notif.wav',-14,[0,0.3]),
 'tick1':ui('check','soft',-16),'tick2':ui('check','organic',-16),'wfw':el('tape.wav',-12),'loop':ov('swish','swish-5',None,-14),
 'flutter':el('flutter.wav',-15),'push':el('push.wav',-19),'slapS':el('slap.wav',-24),'tagT':ui('progress-step','minimal',-20),
 'strip':el('click.wav',-21),'cut44':el('clocktick.wav',-17),'penW':ov('pen_tick','writing',[0.0,0.6],-16),'video':ui('open','minimal',-19),
 'tagL':ui('snap','minimal',-19),'miniC':el('cardfan.wav',-14),'tear2':el('rip.wav',-13),'circleS':el('scratch.wav',-15),'headline':el('slap.wav',-16),
 'dust':el('flutter.wav',-20),'strikeS':ov('pencil_scratch','scribbling',[1.3,1.6],-14),'chip2':el('slap.wav',-16),'tg2':ui('select','minimal',-20),'tg3':ui('focus','minimal',-20),'tg4':ui('expand','minimal',-20),'tg5':ui('toggle-on','minimal',-20),'tg6':ui('swipe','minimal',-20),'tg7':ui('reaction','minimal',-20),
}
for k,(f,_,_) in S.items(): assert os.path.exists(f),(k,f)
HIT={'impact','slam','right','fixed','bigrip','stampG','pill'}
UIK={'tg2','tg3','tg4','tg5','tg6','tg7','tagT','tagL','kw','keys','post','chipG','tick1','tick2','t1','t2','t3','t4','pop1','shrink','t1','t2','t3','t4','shrink','oneJob','redTag','orders','chipG','kw','post','tick1','tick2','pop1','burst'}
for p in ['ig','tt']:
    T=json.load(open(f'../../remotion/src/n8timing_{p}.json'))
    L=[l['words'][0]['s'] for l in T['lines']]
    def w(li,wi): ws=T['lines'][li]['words']; return ws[min(wi,len(ws)-1)]['s']
    ig=p=='ig'; TOTAL=T['total']; END=TOTAL-21; kwI=1 if ig else 2
    twoA=L[2]-4; r1A=L[3]-6; pileA=w(5,0)-2; implodeA=w(5,14)-4; cardA=implodeA+12; numsA=w(6,2)-4; p1A=L[7]-6
    toggleAt=w(8,1); strikeA=w(8,5)-2; tabA=L[9]-6; limA=L[10]-6; chipAt=[w(10,5),w(10,9),w(10,13)]; tearAt=w(11,2)-2
    p3A=L[12]-8; verdictA=L[13]-8; hubA=w(13,2)-2; noteAt=w(14,1)-2; dollyA=w(14,4)-2; backAt=w(14,8)-4
    arrowAt=w(15,5)-2; stampAt=w(16,1)-2; clickAt=w(16,6)-2; ctaA=L[17]-8
    C=[]
    def c(fr,k,label):
        f,sl,g=S[k]; d={'t':round(max(fr,1)/30,3),'label':label,'file':f,'role':'foley','gain_db':g}
        if sl: d['slice']=sl
        if k in HIT: d['role']='hit'; d['highpass']=160
        if k in UIK: d['role']='ui'
        C.append(d)
    # 1 hook
    c(1,'cardslap','frame 0 on the desk'); c(3,'t4','price row 1 pulse'); c(8,'tg2','price row 2 pulse'); c(13,'tg3','price row 3 pulse')
    # 2 cut to one
    c(w(1,2)-2,'strike1','$59.99 struck'); c(w(1,5)-4,'shrink','rows collapse to one'); c(w(1,5)-2,'pop1','ChatGPT Plus row mint'); c(w(1,2)-4,'push','camera push')
    # 3 two phones
    c(twoA,'whip','whip to two phones'); c(twoA+4,'phoneslide','phone 12:27 slides up'); c(twoA+10,'tileR','phone 12:28 slides up')
    c(w(2,9)-2,'blip','Claude Pro answer'); c(w(2,11)-2,'tile1','ChatGPT Plus answer'); c(w(2,11),'slam','not-equal lands'); c(twoA+16,'tagL','one minute apart label')
    # 4 one line
    c(r1A,'zoomIn','phone takes the frame'); c(w(3,2)-4,'keys','question typed'); c(w(3,2),'chipG','no jobs'); c(w(3,2)+5,'t2','no budget'); c(w(3,2)+10,'t3','no plan'); c(w(3,7),'halftone','searching 10 websites')
    # 5 Claude Pro
    c(L[4]-2,'impact','overlay card pops'); c(L[4],'hl1','Claude Pro highlight')
    # 6 pile
    c(pileA,'deal1','chips start falling')
    for k in range(6): c(pileA+14+k*5,['stk1','stk2','slapS','chip2','stk1','stk2'][k],f'chip {k+1} lands')
    c(w(5,3),'sticker','what it remembered sticker'); c(implodeA,'fall','pile implodes'); c(implodeA+9,'cross','dot'); c(cardA,'page','old chats card'); c(w(5,19),'thud','my plan ?')
    # 7 rehook
    c(L[6]-6,'zoomIn','push through'); c(numsA,'slam','1'); c(numsA+9,'slam','2'); c(numsA+18,'impact','3')
    c(numsA+27,'deal1','card 1'); c(numsA+30,'deal2','card 2'); c(numsA+33,'deal1','card 3'); c(w(6,4)-2,'hlF','smaller swash')
    # 8-9 prompt 1, toggle, strike
    c(p1A,'whip2','whip to prompt 1'); c(p1A+2,'flip','card flips to phone'); c(p1A+6,'kw','prompt 1 typed'); c(w(7,11),'halftone','searching the web')
    c(toggleAt-6,'tagL','toggle card'); c(toggleAt,'post','web search on'); c(strikeA,'strike2','prices from memory struck'); c(strikeA+16,'tick2','today\'s prices')
    # 10 receipt
    c(tabA,'whip','whip to receipt'); c(tabA+2,'receipt','receipt prints')
    for i in range(3): c(w(9,1)-2+i*6,['count1','count2','count1'][i],f'price {i+1} rolls')
    c(w(9,5)-2,'stampG2','a tie')
    # 11 limits
    c(limA,'whip2','whip to limits'); c(limA+8,'tileL','plan rows')
    for i,a in enumerate(chipAt): c(a-3,['t1','t2','t3'][i],f'limit chip {i+1}')
    # 12 Gemini torn
    c(tearAt,'rip','Gemini torn out'); c(tearAt+3,'stampG','Gemini cut stamp'); c(tearAt+8,'dust','torn pieces')
    # 13 prompt 3
    c(p3A,'bookthump','3 flash'); c(p3A+8,'slideUp','phone rises'); c(p3A+10,'keys','prompt 3 typed')
    # 14 verdict + hub
    c(verdictA,'riser','lens-zoom in'); c(verdictA+10,'bigrip','verdict lands'); c(w(13,0)-2,'markersq','ChatGPT Plus highlight')
    c(hubA,'tile1','hub centre'); c(w(13,5)-2,'markerstroke','line to Claude'); c(w(13,5)+4,'pencilcurve','line to Gemini'); c(w(13,8)-2,'tick1','Claude free'); c(w(13,8)+4,'tile2','Gemini free')
    # 15 objection + dolly
    c(noteAt+4,'stickypress','ChatGPT picked itself note'); c(dollyA,'vertigo','dolly zoom'); c(backAt,'swoosh2','12:27 Claude Pro returns')
    # 16 when to switch
    c(arrowAt-4,'cardfan','switch excerpt'); c(arrowAt,'arrow','ink arrow'); c(arrowAt+8,'penW','when to switch'); c(w(15,11)-2,'hlR','Claude Pro gold')
    # 17 its pick + my call
    c(stampAt,'stampthunk','its pick stamp'); c(w(16,3)-6,'tagL','my call box'); c(clickAt,'post','cursor click'); c(clickAt+2,'tick2','tick')
    # 18 CTA
    c(ctaA,'cta','stripe wipe'); c(ctaA+6,'flutter','stripes out'); c(ctaA+10,'miniC','3 prompt cards fan'); c(ctaA+14,'tagT','comment box')
    c(w(17,kwI)-6,'kw','NARROW typed'); c(w(17,kwI)+10,'post','post'); c(w(17,3),'tg5','free guide tag')
    # 19 loop
    for i,k in enumerate(['t1','t2','t3']): c(w(18,0)-2+i*7,k,f'card {i+1} lights')
    c(END,'shrink','CTA out'); c(END+3,'loop','back to frame 0')
    # section tags
    for t,k in zip([L[3],L[6],L[7],L[10],L[12],L[13],L[17]],['tg2','tg3','tg4','tg5','tg6','tg7','tg2']): c(t+1,k,'section tag')
    C.sort(key=lambda d:d['t'])
    # variety pass: never the same recording twice (UI clicks excepted); swap to an unused file of the same family
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
    KEY={'dolly zoom','line to Claude','line to Gemini','ChatGPT picked itself note','12:27 Claude Pro returns','switch excerpt','ink arrow','its pick stamp','ChatGPT Plus highlight','a tie','verdict lands','frame 0 on the desk','Gemini torn out'}
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
        if d['label'] in ('1','2','3 flash'): d['gain_db']-=5; d['highpass']=160
    json.dump({'video':os.path.abspath(f'../../remotion/out/N8-{p}-raw.mp4'),'keep_audio':'yes','cues':C},open(f'sheet_{p}.json','w'),indent=0)
    print(p,len(C),'cues')
