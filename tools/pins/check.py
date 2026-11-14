import re,sys
sys.path.insert(0,'.')
from specs import *
def norm(s):
    s=s.replace('“','"').replace('”','"').replace('’',"'").replace('‘',"'")
    s=re.sub(r'-\s*\n\s*','-',s)  # hyphen line breaks
    return re.sub(r'\s+',' ',s).lower()
src={k:norm(open(f'src/{f}.txt').read()) for k,f in [('n','narrowing'),('p','plain'),('v','video')]}
bad=0
for p in PINS:
    for kind,label,text in p['blocks']:
        if label in (L1,L2): continue
        t=text.strip()
        if t.startswith('"') and t.endswith('"'): t=t[1:-1]
        for frag in re.split(r'…|\n| · |, (?=highlighting)|(?<=highlighting its) ',t):
            f=norm(frag).strip(' .;')
            if len(f)<6: continue
            if f not in src[p['g']] and f not in norm(P3).lower():
                bad+=1; print(p['slug'],'| NOT FOUND:',f[:90])
print('quote problems:',bad)
