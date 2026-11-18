import json,glob,os
U='/root/.claude/skills/real-sfx/vendor/node_modules/uisfx/sounds/organic/'
OV=os.path.expanduser('~/sfx-library/openverse-cc0/')
def ov(cat,part): return glob.glob(f'{OV}{cat}/*{part}*')[0]
def ui(n,g=-12): return (U+n+'.mp3',None,g)
S={
 'q1':ui('error',-16),'q2':ui('warning',-11),'q3':ui('invalid-drop',-11),'scribble':(ov('pencil_scratch','scribbling'),[0,0.45],-12),
 'swoosh_soft':(ov('whoosh','digital-whoosh-soft'),[0,0.6],-11),'paste':ui('paste',-19),
 'card':(ov('paper_slide','paper-slide-wav'),[0,0.6],-10),'typing':(ov('keyboard','typing'),[0,1.5],-2),'focus':ui('focus'),
 'ton':ui('toggle-on'),'toff':ui('toggle-off'),'check':ui('check'),'select':ui('select'),'collapse':ui('collapse'),
 'send':ui('send'),'copy':ui('copy'),
 'whoosh':(ov('whoosh','swing-1-5'),[0,0.5],-11),'marker':(ov('pen_tick','sharpie'),[0,0.55],-11),'success':ui('success'),
 'flip':(ov('paper_flip','page-turn-2_'),[0,0.5],-11),'complete':ui('complete'),'pen':(ov('pen_tick','pen-writing'),[0,0.4],-12),
 'slide2':(ov('paper_slide','sliding-envelope'),[0,0.5],-15),'progress':ui('progress-step'),'streak':ui('streak'),'check2':ui('checkpoint'),
 'ui_typing':ui('typing',-13),'press':ui('press'),'receive':ui('receive'),'stamp':(ov('stamp','thump'),[0,0.3],-18),'swish':(ov('swish','swish-5'),None,-12),
 'shuffle':(ov('paper_stack','es-papershuffle'),[0,0.45],-11),'knock':(ov('drop','wood-knock-clean'),[0,0.25],-13),
}
for p in ['ig','tt']:
    m=json.load(open(f'../../remotion/src/v2moments_{p}.json'))
    C=[]
    def c(fr,k,label):
        f,sl,g=S[k]; d={'t':round(fr/30,3),'label':label,'file':f,'role':'foley','gain_db':g}
        if sl: d['slice']=sl
        C.append(d)
    c(m['q1'],'q1','? 1'); c(m['q1']+8,'q2','? 2'); c(m['q1']+16,'q3','? 3'); c(m['q1']+20,'scribble','circle third ?')
    c(m['paste']-2,'swoosh_soft','magnifier drops'); c(m['paste']+2,'paste','PASTE THIS chip'); C[-1].update(slice=[0,0.15],gain_db=-26)
    c(m['B_in'],'card','prompt card'); c(m['B_in']+12,'typing','prompt typing'); c(m['phone'],'focus','phone icon')
    c(m['tog_on'],'ton','toggle on'); c(m['tog_off'],'toff','toggle off')
    c(m['r1'],'check','row late captions'); c(m['r2'],'select','row dead pauses'); c(m['r3'],'collapse','row tiny text')
    c(m['send'],'send','send'); c(m['send']+7,'copy','copy chip')
    c(m['C_in'],'whoosh','whip to proof'); c(m['circ1'],'marker','circle badge'); c(m['wipe1'],'success','badge fixed')
    c(m['swap'],'flip','swap to box'); c(m['circ2'],'scribble','circle box'); C[-1]['gain_db']-=4; c(m['wipe2'],'complete','box fixed')
    c(m['D_in']+6,'slide2','guide card'); c(m['count'],'progress','8 rolls'); c(m['wave1'],'streak','checks wave 1'); c(m['wave2'],'check2','checks wave 2')
    c(m['E_in'],'shuffle','CTA card'); c(m['kw'],'ui_typing','keyword typed'); c(m['post'],'press','post/send press'); c(m['dm'],'receive','DM arrives'); C[-1].update(slice=[0,0.18],gain_db=-26); c(m['dm']+8,'stamp','FREE stamp'); C[-1]['slice']=[0,0.1]; C[-1]['role']='tick'
    c(m['A2_in'],'swish','loop card')
    C.sort(key=lambda d:d['t'])
    json.dump({'video':os.path.abspath(f'../../remotion/out/V2-{p}-raw.mp4'),'keep_audio':'yes','cues':C},open(f'sheet_{p}.json','w'),indent=0)
    files=[d['file'] for d in C]; print(p,len(C),'cues',len(set(files)),'distinct sounds')
