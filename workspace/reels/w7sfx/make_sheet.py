# W-7 sound sheet: a sound on every new element; library + uisfx + ElevenLabs (rip, tape, bigrip new 22 Nov)
import json,glob,os
UI='/root/.claude/skills/real-sfx/vendor/node_modules/uisfx/sounds/'
OV=os.path.expanduser('~/sfx-library/openverse-cc0/'); EL=os.path.expanduser('~/sfx-library/elevenlabs/')
def ov(cat,part,sl=None,g=-11): return (glob.glob(f'{OV}{cat}/*{part}*')[0],sl,g)
def ui(n,style='organic',g=-12,sl=None): return (f'{UI}{style}/{n}.mp3',sl,g)
def el(n,g=-11,sl=None): return (EL+n,sl,g)
S={
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
UIK={'t1','t2','t3','t4','shrink','oneJob','redTag','orders','chipG','kw','post','tick1','tick2','pop1','burst'}
for p in ['ig','tt']:
    T=json.load(open(f'../../remotion/src/w7timing_{p}.json'))
    L=[l['words'][0]['s'] for l in T['lines']]; w=lambda li,wi:T['lines'][li]['words'][wi]['s']
    ig=p=='ig'; TOTAL=T['total']; END=TOTAL-21
    stampAt=w(1,0); dealAt=w(1,3)-4; strikeAt=w(1,8); splitAt=w(4,4); stepAt=[w(4,5),w(4,7),w(4,9),w(4,13)]
    pileA=L[5]-2; pileB=w(5,2)-4; dotAt=w(5,4); vsAt=w(6,9)-2; tossAt=w(6,16)+2; tearA=w(10,18)+4; kwI=1 if ig else 2
    C=[]
    def c(fr,k,label):
        f,sl,g=S[k]; d={'t':round(max(fr,1)/30,3),'label':label,'file':f,'role':'foley','gain_db':g}
        if sl: d['slice']=sl
        if k in HIT: d['role']='hit'; d['highpass']=160
        if k in UIK: d['role']='ui'
        C.append(d)
    c(1,'slap','frame 0: calculator on the desk'); c(w(0,0)-1,'pill','2 pill punch'); c(w(0,4),'marker','circle on 83.59'); c(w(0,8),'stampG','0 lines of code stamp')
    c(stampAt-6,'fall','1st try falls'); c(stampAt,'impact','1st try lands')
    c(dealAt,'deal1','card 1 deals in'); c(dealAt+6,'deal2','card 2 deals in'); c(strikeAt,'strike1','build struck 1'); c(strikeAt+4,'strike2','build struck 2'); c(w(1,9),'pop1','plan it'); c(w(1,9)+5,'pop1','brief it')
    c(L[2]-4,'zoomIn','prompt 1 card'); c(w(2,4)-2,'label','a build plan label'); c(w(2,6)-2,'type','typing the rule')
    c(L[3]-2,'chip','1 number = 2 jobs chip'); c(w(3,9)-1,'rip','chip tears'); 
    c(L[4]-4,'page','page to the real plan'); c(w(4,1)-3,'sticker','add ingredients sticker'); c(splitAt-2,'split','sticker splits')
    for i,(a,k) in enumerate(zip(stepAt,['t1','t2','t3','t4'])): c(a-3,k,f'step sticker {i+1}')
    c(L[5]-6,'shrink','plan shrinks'); c(pileA,'pile','strips pile up'); c(pileB-14,'riser','riser'); c(pileB,'slam','44 lands'); c(pileB+3,'thud','44 thud')
    c(dotAt-2,'cross','crosshair'); c(w(5,4),'oneJob','1 step = 1 job')
    c(L[6]-6,'whip','whip to the catch'); c(w(6,2),'redTag','without being asked'); c(w(6,5)-2,'hl1','highlight markup'); c(w(6,13)-2,'hl2','highlight 0.70')
    c(vsAt,'tileL','x1.30 tile'); c(vsAt+6,'tileR','/0.70 tile'); c(w(6,13),'arrow','ink arrow'); c(w(6,15),'right','right stamp'); c(tossAt,'crumple','x1.30 crumples'); c(tossAt+8,'toss','tossed')
    c(L[7]-4,'shrink','card shrinks'); c(L[7]+4,'halftone','halftone cut'); c(w(7,7),'lowthud','not for the AI'); c(w(7,7)+8,'gold','so prompt 2 sticker')
    c(L[8]-4,'flip','prompt 2 card'); c(w(8,5)-2,'orders','orders tag'); c(w(9,1)-30,'write','list written')
    c(w(9,1),'x1','merge struck'); c(w(9,3),'x2','skip struck'); c(w(9,5),'x3','reorder struck')
    c(L[10]-6,'whip2','whip to Claude'); c(L[10],'keys','Claude building'); c(L[10]+6,'chipG','sped up chip'); c(w(10,8)-2,'slideUp','rounding note slides up')
    c(w(10,15)-4,'hlR','highlight rounding'); c(w(10,16)+4,'hlF','highlight fixing'); c(w(10,18)-2,'fixed','fixed it itself stamp'); c(w(10,18)+2,'chime','success chime')
    c(tearA+3,'bigrip','paper tear reveal')
    c(w(11,3)-4,'tile1','to make tile'); c(w(11,3)+2,'count1','count 58.52')
    c(w(11,7)-2,'mark2','mark price'); c(w(11,7)-4,'tile2','to sell tile'); c(w(11,7)+2,'count2','count 83.59')
    c(L[12]-6,'cta','whip to CTA'); c(w(12,kwI)-4,'kw','keyword typed'); c(w(12,kwI+1),'post','post'); c(w(12,kwI+3),'dm','DM arrives')
    c(w(12,kwI+5),'tick1','tick prompt 1'); c(w(12,kwI+7)-2,'wfw','word for word sticker')
    c(END,'shrink','CTA shrinks'); c(END+3,'loop','pull back to start')
    # --- extra layer (23 Nov): tags, labels, videos, counts, camera pushes, debris ---
    for t,k in zip([L[1],L[2],L[6],L[8],L[10],L[11],L[12]],['tagT','tg2','tg3','tg4','tg5','tg6','tg7']): c(t+1,k,'section tag + dot step')
    c(L[2]+2,'video','plan video opens'); c(L[8]+2,'video','orders video opens'); c(L[10]+2,'video','Claude build video')
    c(L[4]+4,'tagL','rows label'); c(w(5,2),'tagL','each does one job label'); c(L[10]+4,'tagL','orders pasted in label')
    for k in range(6): c(pileA+3+k*int((pileB-pileA)/6),'cut44',f'44 count cut {k}')
    for k in range(0,44,8): c(pileA+round(k/43*(pileB-pileA))+6,'strip',f'strip {k} lands')
    c(stampAt+3,'dust','1st try dust')
    c(tearA+12,'flutter','tear debris'); c(w(3,9)+3,'dust','chip scraps')
    for a in [w(0,4)-4, L[4]+4, w(6,2)-2, w(10,15)-6, w(11,7)-4]: c(a,'push','camera push')
    for i,a in enumerate(stepAt[:3]): c(a+3,['slapS','stk2','slapS'][i],f'step sticker {i+1} slaps')
    c(w(9,1)-28,'penW','list item 2 written')
    c(w(12,kwI+5)-2,'miniC','prompt cards #1 #2'); c(w(12,kwI+5)+4,'chip2','card #2 lands')
    c(w(1,9)+2,'tg2','plan it'); c(w(1,9)+7,'tg5','brief it')
    c(L[7]+30,'tear2','halftone dots dissolve')
    C.sort(key=lambda d:d['t'])
    json.dump({'video':os.path.abspath(f'../../remotion/out/W7-{p}-raw.mp4'),'keep_audio':'yes','cues':C},open(f'sheet_{p}.json','w'),indent=0)
    print(p,len(C),'cues')
