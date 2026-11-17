import json,glob,os
H=os.path.expanduser('~/sfx-library'); EL=H+'/elevenlabs/'; OV=H+'/openverse-cc0/'
def ov(cat,part): return glob.glob(f'{OV}{cat}/*{part}*')[0]
S={'whoosh':(ov('whoosh','digital-whoosh-soft'),[0,0.6],-9),'slide':(EL+'slide.wav',None,-9),'paper':(ov('paper_slide','paper-slide-wav'),[0,0.6],-9),
 'tick':(EL+'tick.wav',None,-10),'tick_soft':(EL+'tick.wav',None,-13),'click':(EL+'click.wav',None,-10),'pop':(EL+'pop.wav',None,-10),'stack':(EL+'stack.wav',None,-9),
 'stamp':(EL+'stamp.wav',[0,0.3],-8),'scratch':(EL+'scratch.wav',None,-10),'blip':(EL+'chatblip.wav',None,-9),'crumple':(EL+'crumple.wav',None,-8),
 'marker':(ov('pen_tick','sharpie'),[0,0.55],-10),'pen':(ov('pen_tick','pen-writing'),[0,0.45],-11),'scribble':(ov('pencil_scratch','scribbling'),[0,0.5],-11),
 'keys':(ov('keyboard','typing'),[0,0.5],-13),'keys_long':(ov('keyboard','typing'),[0,1.1],-14),'mouse':(ov('mouse_click','left-mouse'),None,-9),
 'swish':(ov('swish','knife-swish-1'),None,-11),'flip':(ov('paper_flip','page-turn-02'),[0,0.6],-10),'knock':(ov('drop','wood-knock-clean'),[0,0.25],-12),
 'envelope':(ov('paper_slide','sliding-envelope'),[0,0.5],-10),'shuffle':(ov('paper_stack','es-papershuffle'),[0,0.45],-11),'swish2':(ov('swish','knife-swish-2'),None,-12),
 'flip2':(ov('paper_flip','page-turn-1_'),[0,0.5],-11),'slide2':(ov('paper_slide','paper-slide_7092906e'),[0,0.5],-10)}
for p in ['ig','tt']:
    m=json.load(open(f'../../remotion/src/a1moments_{p}.json'))
    C=[]
    def c(fr,kind,label):
        f,sl,g=S[kind]; d={'t':round(fr/30,3),'label':label,'file':f,'role':'foley','gain_db':g}
        if sl: d['slice']=sl
        C.append(d)
    c(m['circle']+13,'marker','circle are you sure'); c(m['reply1'],'blip','reply 1'); c(m['reply2'],'blip','reply 2'); c(m['reply2']+3,'stack','x2 badge')
    c(m['B_in'],'paper','card 5 habits')
    for i in range(1,6): c(m['B_in']+4+i*2,'tick_soft' if i%2 else 'click',f'slot {i} in')
    c(m['slot5'],'pop','slot5 gold'); c(m['slot5']+4,'pen','squiggle')
    for i in range(1,5): c(m[f's{i}'],'tick',f'slot {i} lit')
    for k,n in [('C_in',1),('D_in',2),('E_in',3),('F_in',4),('G_in',5)]:
        c(m[k],'whoosh',f'whip habit {n}'); c(m[k]+6,'click',f'badge {n}')
    c(m['chipBiz']-2,'keys','prompt chip'); c(m['answerAny'],'envelope','answer'); c(m['crumple']-1,'crumple','crumple')
    c(m['dots'],'stack','dots grid'); c(m['limits'],'knock','limits chip'); c(m['ring'],'pop','start here ring'); c(m['ring']+2,'tick','start here label')
    c(m['D_in']+6,'shuffle','step box'); c(m['job1'],'slide','job 1'); c(m['job2'],'swish2','job 2'); c(m['guess'],'scribble','guess circle')
    c(m['split'],'swish','split'); c(m['split']+8,'tick','tick 1'); c(m['split']+13,'tick','tick 2'); c(m['split']+4,'stamp','one job each')
    for i in range(3): c(m['chips']+i*4,'tick_soft',f'tool {i}')
    c(m['tab'],'scratch','tab struck'); c(m['tab']+2,'tick_soft','cursor in'); c(m['click'],'mouse','click'); c(m['click']+1,'pop','burst')
    c(m['toolA'],'slide','tool A'); c(m['arrow'],'pen','ink arrow'); c(m['toolB'],'flip2','tool B'); c(m['tickB'],'tick','tick B')
    c(m['G_in']+6,'blip','are you sure bubble'); c(m['struck'],'scratch','strike'); c(m['notcheck'],'stamp','not a check'); c(m['notcheck']+3,'tick_soft','agrees line')
    c(m['G2_in'],'paper','claude card'); c(m['G2_in']+8,'keys_long','typing question'); c(m['gemini'],'pop','gemini chip')
    sent=m['G2_in']+8+33/1.6+4; c(sent,'blip','sent'); c(m['G2_in']+30,'tick_soft','same question label')
    c(m['H_in'],'paper','source card'); c(m['H_in']+6,'slide','browser'); c(m['source'],'marker','highlight'); c(m['stampSure'],'stamp','sounds sure stamp')
    c(m['I_in'],'paper','product card'); c(m['I_in']+6,'flip','cover')
    for i in range(5): c(m['habits']+i*3,'tick_soft' if i%2 else 'pen',f'habit tick {i}')
    c(m['J_in'],'slide2','comment box'); c(m['J_in']+4,'marker','habit one highlight'); c(m['kw']+1,'stamp','FREE stamp'); c(m['kw'],'keys','keyword typed'); c(m['post'],'mouse','post click'); c(m['post']+1,'pop','post burst')
    c(m['A2_in'],'whoosh','loop card')
    C.sort(key=lambda d:d['t'])
    json.dump({'video':os.path.abspath(f'../../remotion/out/A1-{p}-raw.mp4'),'keep_audio':'yes','cues':C},open(f'sheet_{p}.json','w'),indent=0)
    print(p,len(C),'cues')
