# P-6 sound sheet: a sound on every move and change; library + uisfx + ElevenLabs, nearly no repeats
import json,glob,os
UI='/root/.claude/skills/real-sfx/vendor/node_modules/uisfx/sounds/'
OV=os.path.expanduser('~/sfx-library/openverse-cc0/'); EL=os.path.expanduser('~/sfx-library/elevenlabs/')
def ov(cat,part,sl=None,g=-11): return (glob.glob(f'{OV}{cat}/*{part}*')[0],sl,g)
def ui(n,style='organic',g=-12,sl=None): return (f'{UI}{style}/{n}.mp3',sl,g)
def el(n,g=-11,sl=None): return (EL+n,sl,g)
S={
 'match':el('matchstrike.wav',-12),'push':ov('whoosh','digital-whoosh-soft',[0,0.5],-15),
 'nine':el('numslam.wav',-11),'ninetick':el('clocktick.wav',-12),
 'scan':el('scan.wav',-12),'puff':el('puff.wav',-12),'zero':ui('bonus','soft',-22),'stamp0':el('stampthunk.wav',-12),
 'grow':el('zoomwhoosh.wav',-14,[0,0.4]),'label':ov('paper_slide','paper-slide_7092',[0,0.4],-13),
 'whipA':ov('swish','swing-1-9',[0,0.4],-13) if glob.glob(f'{OV}swish/*swing-1-9*') else ov('whoosh','swing-1-9',[0,0.4],-13),
 'emoji':el('markersq.wav',-11),'b1':ov('pen_tick','sharpie',[0,0.4],-12),'b2':ov('pencil_scratch','scribbling',[0,0.35],-13),'b3':ov('paper_slide','underlining-stroke',[0,0.4],-11),
 'x1':ui('select','glass',-14),'x2':ui('check','glass',-14),'x3':ui('copy','glass',-14),'x4':ui('connect','glass',-14),'x5':ui('complete','glass',-14),
 'nineShake':el('emptythud.wav',-13),
 'turn':ov('paper_flip','page-turn-04',[0,0.5],-10),'badge':ui('badge','soft',-24),'vertigo':el('vertigo.wav',-13),
 'marksB':ov('pencil_scratch','scribbling',[0.5,1.0],-14),'seven':ui('blocked','glass',-15),'sevenShake':el('impact.wav',-14),
 'pushIn':ov('drop','wood-knock-clean',[0,0.25],-18),'type':ov('keyboard','typing',[0.0,0.9],-13),'send':ui('press','mechanical',-12),
 'crumple':el('crumple.wav',-11),'toss':el('cardfly.wav',-12),'riser':el('riser.wav',-19),
 's1':el('numslam.wav',-13),'s2':el('stamp.wav',-13),'s3':ov('drop','thud-pint',[0,0.3],-15),'s4':el('impact.wav',-10),
 'cIn':el('slide.wav',-12),'stampC':ov('stamp','thump',[0,0.3],-12),
 'whipE':ov('swish','knife-swish-2',[0,0.3],-16),'kw':ui('typing','mechanical',-13),'post':ui('press','glass',-12),'dm':el('notif.wav',-14,[0,0.3]),
 'tick1':ui('check','soft',-16),'tick2':ui('check','organic',-16),'fix':ov('paper_slide','sliding-envelope',[0,0.4],-12),'free':el('coin.wav',-15),'freeSt':ov('stamp','thump',[0,0.3],-14),
 'shrink':ui('collapse','soft',-15),'loop':ov('swish','swish-5',None,-13),
}
for k,(f,_,_) in S.items(): assert os.path.exists(f),(k,f)
for p in ['ig','tt']:
    T=json.load(open(f'../../remotion/src/p6timing_{p}.json'))
    L=[l['words'][0]['s'] for l in T['lines']]; w=lambda li,wi:T['lines'][li]['words'][wi]['s']
    ig=p=='ig'
    eA,b1,b2,b3=w(2,1),w(2,2),w(2,3),w(2,4); xs=[w(2,5),w(2,6),w(2,6)+5,w(2,7),w(2,7)+5]
    s0=w(3,4)-2; typeA=L[4]+1; sent=typeA+26; toss=sent+2; smash=sent+3; cIn=w(4,6)+4
    kw=w(5,1) if ig else w(5,2); post=w(5,3) if ig else w(5,4); dm=w(5,4) if ig else w(5,5)
    rules=w(5,7) if ig else w(5,8); line=w(5,10) if ig else w(5,11); free=w(5,11) if ig else w(5,12); END=L[6]
    C=[]
    def c(fr,k,label):
        f,sl,g=S[k]; d={'t':round(max(fr,1)/30,3),'label':label,'file':f,'role':'foley','gain_db':g}
        if sl: d['slice']=sl
        if k in ('nine','stamp0','s1','s2','s3','s4','stampC','freeSt','sevenShake','nineShake'): d['role']='hit'; d['highpass']=160
        if k in ('zero','badge','x1','x2','x3','x4','x5','seven','send','kw','post','tick1','tick2','shrink'): d['role']='ui'
        OV2={'x5':('foley',-27),'nineShake':('foley',-27),'s1':('foley',-19),'s2':('foley',-19),'s3':('foley',-20),'grow':('foley',-21),'seven':('foley',-20),'fix':('foley',-18)}
        if k in OV2: d['role'],d['gain_db']=OV2[k]
        C.append(d)
    c(1,'match','frame 0: match strike'); c(w(0,2)-4,'push','camera push'); c(w(0,8)-1,'nine','9 pill slam'); c(w(0,8)+5,'ninetick','counter tick')
    c(w(1,0)-2,'scan','scan sweeps A into C'); c(w(1,3)-3,'puff','giveaways blown out'); c(w(1,3),'zero','counter 9->0'); c(w(1,3)+2,'stamp0','0 GIVEAWAYS stamp')
    c(w(1,4)-6,'grow','card grows'); c(w(1,5)-4,'label','same prompt label')
    c(L[2]-6,'whipA','whip back to A')
    c(eA,'emoji','ring emoji'); c(b1,'b1','box bold 1'); c(b2,'b2','box bold 2'); c(b3,'b3','box bold 3')
    for i,t in enumerate(xs): c(t,f'x{i+1}',f'ring ! {i+1}')
    c(xs[-1]+4,'nineShake','count 9 shake')
    c(L[3]-6,'turn','page turn to B'); c(w(3,1)-2,'badge','instructions chips'); c(w(3,3)-6,'vertigo','dolly punch on B')
    c(s0,'marksB','7 marks scribbled'); c(w(3,6),'seven','seven left'); c(w(3,6)+2,'sevenShake','seven shake')
    c(L[4]-4,'pushIn','fix card lands'); c(typeA,'type','typing fix line'); c(sent,'send','send')
    c(toss,'crumple','B crumples'); c(toss+8,'toss','B tossed'); c(smash-14,'riser','riser into smash')
    for i,(dt,k) in enumerate([(0,'s1'),(5,'s2'),(9,'s3'),(12,'s4')]): c(smash+dt,k,f'smash cut {i+1}')
    c(cIn,'cIn','C slides in'); c(cIn+3,'stampC','0 LEFT stamp')
    c(L[5]-6,'whipE','whip to CTA'); c(kw-4,'kw','keyword typed'); c(post,'post','post'); c(dm,'dm','DM arrives')
    c(rules,'tick1','tick rules'); c(line-2,'fix','fix line slides in'); c(line+1,'tick2','tick fix line'); c(free,'free','free chime'); c(free+2,'freeSt','FREE stamp')
    c(END,'shrink','CTA shrinks'); c(END+3,'loop','pull back to start')
    C.sort(key=lambda d:d['t'])
    json.dump({'video':os.path.abspath(f'../../remotion/out/P6-{p}-raw.mp4'),'keep_audio':'yes','cues':C},open(f'sheet_{p}.json','w'),indent=0)
    print(p,len(C),'cues',len(set(d['file']+str(d.get('slice')) for d in C)),'distinct')
