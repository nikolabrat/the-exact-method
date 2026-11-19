# N-7 sound sheet: a sound on every move and change, recordings from the library + uisfx + ElevenLabs, nearly no repeats
import json,glob,os
UI='/root/.claude/skills/real-sfx/vendor/node_modules/uisfx/sounds/'
OV=os.path.expanduser('~/sfx-library/openverse-cc0/'); EL=os.path.expanduser('~/sfx-library/elevenlabs/')
def ov(cat,part,sl=None,g=-11): return (glob.glob(f'{OV}{cat}/*{part}*')[0],sl,g)
def ui(n,style='organic',g=-12,sl=None): return (f'{UI}{style}/{n}.mp3',sl,g)
def el(n,g=-11,sl=None): return (EL+n,sl,g)
S={
 'open':ov('whoosh','digital-whoosh-soft',[0,0.5],-15),
 'push1':ov('whoosh','swing-1-9',[0,0.4],-15),'mark_red':el('markersq.wav',-11),
 'coin':el('coin.wav',-17),'stamp0':el('stampthunk.wav',-12),'mint0':ui('bonus','soft',-29),
 'push2':ov('swish','knife-swish-1',None,-16),'under':ov('paper_slide','underlining-stroke',[0,0.5],-11),
 'fan':el('cardfan.wav',-19),'same':ov('stamp','thump',[0,0.3],-12),
 'flyA':el('cardfly.wav',-10),'focus':el('focussnap.wav',-10),'shakeB':ov('drop','thud-pint',[0,0.3],-16),
 'mark1':ov('pen_tick','sharpie',[0,0.5],-12),'mark2':ui('select','glass',-13),'slideZ':ov('paper_slide','paper-slide_7092',[0,0.5],-11),
 'mark3':ov('pencil_scratch','scribbling',[0,0.4],-13),'stampB':el('stamp.wav',-12),
 'flyB':ov('whoosh','swing-1-5',[0,0.5],-12),'pushC':ov('drop','wood-knock-clean',[0,0.25],-18),
 'type1':ov('keyboard','typing',[0.0,0.65],-14),'send1':ov('mouse_click','left-mouse-click',None,-12),'video':ui('expand','minimal',-13),
 'scroll':ov('mouse_click','mouse-clicks',[0,0.6],-12),
 'turn1':ov('paper_flip','page-turn-04',[0,0.5],-10),'type2':ov('keyboard','typing',[1.2,1.9],-8),
 'chip5':el('clocktick.wav',-9),'chip0':ui('coupon','arcade',-29,[0,0.25]),'chipN':el('emptythud.wav',-13),
 'land1':ov('tap','step-wav',[0,0.2],-15),'land2':ov('tap','steps2',[0,0.2],-15),'land3':ov('tap','steps3',[0,0.2],-15),'note':ui('info','soft',-22),
 'turn2':ov('paper_flip','page-turn-02',[0,0.5],-10),'type3':ov('keyboard','typing',[2.5,3.2],-15),'think':ui('connecting','glass',-16),
 'answer':el('chatblip.wav',-11),'mark4':ov('pen_tick','pen-writing',[0,0.4],-13),
 'whipD':el('zoomwhoosh.wav',-13,[0,0.35]),'cover':ov('paper_stack','es-papershuffle',[0,0.4],-11),
 'c1':ov('paper_slide','paper-slide-wav',[0,0.4],-12),'c2':ov('paper_slide','sliding-envelope',[0,0.4],-12),'c3':el('slide.wav',-12),
 'riser':el('riser.wav',-18),'burst':ui('achievement','organic',-13),'mono':ui('badge','soft',-26),
 'whipE':ov('swish','knife-swish-2',[0,0.3],-30),'kw':ui('typing','mechanical',-13),'post':ui('press','glass',-12),
 'dm':el('notif.wav',-14,[0,0.3]),'free':ov('stamp','thump',[0,0.3],-13),'shrink':ui('collapse','soft',-15),'loop':ov('swish','swish-5',None,-13),
}
for p in ['ig','tt']:
    T=json.load(open(f'../../remotion/src/n7timing_{p}.json'))
    L=[l['words'][0]['s'] for l in T['lines']]; w=lambda li,wi:T['lines'][li]['words'][wi]['s']
    ig=p=='ig'; kw=w(8,1) if ig else w(8,2); post=w(8,4) if ig else w(8,5); dm=w(8,6) if ig else w(8,7)
    C=[]
    def c(fr,k,label,**kw2):
        f,sl,g=S[k]; d={'t':round(max(fr,1)/30,3),'label':label,'file':f,'role':'foley','gain_db':g}
        if sl: d['slice']=sl
        if k in ('stamp0','same','focus','stampB','free','burst'): d['role']='hit'
        if k in ('stamp0','same','stampB','free','chipN','shakeB','pushC','focus'): d['highpass']=160; d['gain_db']-=3
        if k in ('mark2','send1','video','note','kw','post','think','mono','mint0','shrink'): d['role']='ui'
        d.update(kw2); C.append(d)
    c(3,'open','frame 0 settle')
    c(w(0,2)-4,'push1','camera push to answer'); c(w(0,2)-1,'mark_red','red marker activity book')
    c(w(1,5),'coin','euro coin'); c(w(1,5)+3,'stamp0','EUR0 stamp'); c(w(1,5)+8,'mint0','headline EUR0 mint')
    c(w(2,3)-4,'push2','camera drift left'); c(w(2,6),'under','underline Amazon KDP')
    c(w(2,7),'fan','5 copies fan out'); c(w(2,8),'same','SAME AS EVERYONE stamp')
    c(L[3]-6,'flyA','first card flies off'); c(L[3]+2,'focus','third try snaps into focus'); c(L[3]+8,'shakeB','focus impact')
    c(w(3,3)-2,'mark1','highlight calculator'); c(w(3,3)+4,'slideZ','excerpt slides in'); c(w(3,7)-2,'mark2','highlight bakers')
    c(w(3,7)+4,'mark3','highlight no money'); c(w(3,8),'stampB','EUR0 TO MAKE stamp')
    c(L[4]-6,'flyB','card flies off'); c(L[4]+2,'pushC','prompt card lands')
    c(L[4]+4,'type1','typing prompt 1'); c(L[4]+14,'video','real footage opens'); c(L[4]+24,'scroll','footage scrolls')
    c(L[5]-6,'turn1','page turn'); c(L[5]+4,'type2','typing prompt 2')
    c(w(5,4)-2,'chip5','chip 5h'); c(w(5,4)+8,'land1','chip lands'); c(w(5,6)-2,'chip0','chip EUR0'); c(w(5,6)+8,'land2','chip lands')
    c(w(5,8)-2,'chipN','chip no audience'); c(w(5,8)+8,'land3','chip lands')
    c(L[6]-6,'turn2','page turn 2'); c(L[6]+4,'type3','typing prompt 3'); c(L[6]+14,'think','thinking')
    c(w(6,5)-2,'answer','answer arrives'); c(w(6,5)+6,'mark4','highlight answer')
    c(L[7]-6,'whipD','whip to guide'); c(L[7]+4,'cover','cover drops')
    c(L[7]+10,'c1','card 1'); c(L[7]+16,'c2','card 2'); c(L[7]+22,'c3','card 3')
    c(w(7,6)-22,'riser','riser into burst'); c(w(7,6),'burst','burst on Method')
    c(L[8]-4,'whipE','whip to CTA'); c(kw-4,'kw','keyword typed'); c(post,'post','post'); c(dm,'dm','DM arrives'); c(dm+8,'free','FREE stamp')
    c(L[9],'shrink','CTA shrinks'); c(L[9]+3,'loop','pull back to start')
    C.sort(key=lambda d:d['t'])
    json.dump({'video':os.path.abspath(f'../../remotion/out/N7-{p}-raw.mp4'),'keep_audio':'yes','cues':C},open(f'sheet_{p}.json','w'),indent=0)
    print(p,len(C),'cues',len(set(d['file']+str(d.get('slice')) for d in C)),'distinct')
