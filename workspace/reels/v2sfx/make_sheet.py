# V-2 sound sheet v2: a sound on every new thing, every card change has its own move sound, ~40 distinct recordings
import json,glob,os
UI='/root/.claude/skills/real-sfx/vendor/node_modules/uisfx/sounds/'
OV=os.path.expanduser('~/sfx-library/openverse-cc0/'); EL=os.path.expanduser('~/sfx-library/elevenlabs/')
def ov(cat,part,sl=None,g=-11): return (glob.glob(f'{OV}{cat}/*{part}*')[0],sl,g)
def ui(n,style='organic',g=-12,sl=None): return (f'{UI}{style}/{n}.mp3',sl,g)
def el(n,g=-11,sl=None): return (EL+n,sl,g)
S={
 'sweep':ov('whoosh','swing-1-9',[0,0.45],-15),
 'q1':ui('error','organic',-13),'q2':ui('warning','glass',-13),'q3':ui('invalid-drop','mechanical',-13),
 'scribble':ov('pencil_scratch','scribbling',[0,0.45],-12),'paste':ui('paste','soft',-14),
 'crash':el('zoomwhoosh.wav',-14,[0,0.35]),'land':ui('snap','glass',-13),
 'type1':ov('keyboard','typing',[0.0,2.3],-7),'type2':ov('keyboard','typing',[1.2,2.0],-9),'type3':ov('keyboard','typing',[2.6,3.4],-6),
 'phone':el('pop.wav',-12),
 'ton':ui('toggle-on','mechanical'),'waves':ui('volume-change','soft',-14),'toff':ui('toggle-off','mechanical'),'mute':ui('cancel','minimal',-14),
 'r1':ui('check','organic'),'r2':ui('check','glass',-16),'r3':ui('check','rubber'),'shrink':ui('collapse','minimal',-14),
 'send':ui('send','organic'),'copy':ui('copy','soft',-14),
 'fly':el('cardfly.wav',-10),'push':ov('drop','wood-knock-clean',[0,0.25],-13),
 'riser':el('riser.wav',-17),'marker':ov('pen_tick','sharpie',[0,0.55],-11),
 'scan1':el('scan.wav',-12),'ok1':ui('success','organic',-22),
 'turn':ov('paper_flip','page-turn-04',[0,0.5],-10),'scribble2':el('scratch.wav',-17,[0,0.3]),
 'scan2':ui('scanning','glass',-13,[0,0.5]),'ok2':ui('complete','soft'),'fixed':ov('stamp','thump',[0,0.3],-12),
 'turn2':ov('paper_flip','page-turn-02',[0,0.5],-10),'pile':el('cardpile.wav',-10),
 'impact':el('impact.wav',-26),'burst':ui('reward','soft',-14),
 'wave1':ui('snap','organic'),'wave2':ui('streak','organic',-21),
 'whip':ov('whoosh','swing-1-5',[0,0.5],-11),'kw':ui('typing','mechanical',-13),'post':ui('press','glass'),
 'dm':el('notif.wav',-15),'free':el('stamp.wav',-23),'loop':ov('swish','swish-5',None,-12),
}
for p in ['ig','tt']:
    m=json.load(open(f'../../remotion/src/v2moments_{p}.json'))
    T=json.load(open(f'../../remotion/src/v2timing_{p}.json')); w2=T['lines'][1]['words']
    C=[]
    def c(fr,k,label,**kw):
        f,sl,g=S[k]; d={'t':round(fr/30,3),'label':label,'file':f,'role':'foley','gain_db':g}
        if sl: d['slice']=sl
        if k in ('impact','fixed','free','crash'): d['role']='hit'
        if k in ('q1','q2','q3'): d['role']='ui'
        if k in ('r1','r2','r3','wave1','wave2','send','post','kw','ton','toff'): d['role']='ui'
        if k in ('impact','fixed','free','crash'): d['highpass']=150
        d.update(kw); C.append(d)
    c(5,'sweep','magnifier sweeps')
    c(m['q1'],'q1','? 1 slams'); c(m['q1']+8,'q2','? 2 slams'); c(m['q1']+16,'q3','? 3 slams'); c(m['q1']+20,'scribble','circle third ?')
    c(m['B_in']-6,'crash','crash zoom into chip')
    c(w2[0]['s'],'type1','typing the prompt')
    c(m['phone'],'phone','phone icon pops')
    c(m['tog_on'],'ton','toggle on'); c(m['tog_off'],'toff','toggle off')
    c(m['r1']+3,'r1','tick late captions'); c(m['r2']+3,'r2','tick dead pauses'); c(m['r3']+3,'r3','tick tiny text')
    c(m['send'],'send','send')
    c(m['C_in']-6,'fly','prompt card flies off'); c(m['C_in']+9,'push','proof card lands')
    c(m['circ1']-24,'riser','riser into proof'); c(m['circ1'],'marker','circle badge')
    c(m['wipe1'],'scan1','scan line badge')
    c(m['swap']+7,'turn','page turn to box'); c(m['circ2'],'scribble2','circle box')
    c(m['wipe2']+11,'fixed','FIXED stamp')
    c(m['D_in']-6,'turn2','page turn to guide'); c(m['D_in']+10,'pile','checks pile up')
    c(m['count'],'impact','8 lands')
    c(m['wave1'],'wave1','checks snap 1'); c(m['wave2'],'wave2','checks snap 2')
    c(m['E_in'],'whip','whip to CTA'); c(m['kw'],'kw','keyword typed'); c(m['post'],'post','post/send')
    c(m['dm'],'dm','DM arrives'); c(m['dm']+9,'free','FREE stamp')
    c(m['A2_in'],'loop','pull back to start')
    C.sort(key=lambda d:d['t'])
    json.dump({'video':os.path.abspath(f'../../remotion/out/V2-{p}-raw.mp4'),'keep_audio':'yes','cues':C},open(f'sheet_{p}.json','w'),indent=0)
    print(p,len(C),'cues',len(set(d['file']+str(d.get('slice')) for d in C)),'distinct')
