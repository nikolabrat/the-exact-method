import json, re, html, sys, datetime, os
sys.path.insert(0, '.')
from specs import *
from specs_rep import REP
PINS = [REP.get(p['slug'], p) for p in PINS]

FONTS = os.path.join(os.path.dirname(os.path.abspath(__file__)), '../../workspace/remotion/public')
RAW = 'https://raw.githubusercontent.com/nikolabrat/the-exact-method/pin-media/b45/'
START = datetime.date(2026, 11, 16)

def clean_head(h): return h.replace('[', '').replace(']', '')

def short(t, n=72):
    t = t.replace('\n', ' ')
    return t if len(t) <= n else t[:n].rsplit(' ', 1)[0] + '…'

def alt(p, dark):
    parts = [f"{'Dark green' if dark else 'Light paper'} pin. Small label: {p['kicker']}. Headline: {clean_head(p['head'])}"]
    for kind, label, text in p['blocks']:
        if kind == 'code':
            parts.append(f"A dark copy block: {short(text)}")
        else:
            parts.append(f"A paper quote card from the guide: {short(text)}")
    parts.append(f"Bottom line: {p['take'][0]} {p['take'][1]}")
    parts.append(f"Mint footer: Free PDF: {GUIDES[p['g']]['name']}, theexactmethod.com.")
    return '. '.join(x.rstrip('.') for x in parts)

order = {'n': [], 'p': [], 'v': []}
for p in PINS: order[p['g']].append(p)
records = []
for g in 'npv':
    for i, p in enumerate(order[g]):
        dark = i % 2 == 1
        day = START + datetime.timedelta(days=i)
        r = dict(slug=p['slug'], board_id=p['board'], board=BOARD_NAMES[p['board']], keywords=p['kw'],
                 title=p['title'], description=p['desc'], alt_text=alt(p, dark), topics=p['topics'],
                 link=f"https://theexactmethod.com/{GUIDES[g]['path']}/?utm_source=pinterest&utm_medium=pin&utm_content={p['slug']}",
                 image=p['slug'] + '.png', media_url=RAW + p['slug'] + '.png',
                 publish_date=day.isoformat(), guide=GUIDES[g]['name'], dark=dark)
        records.append(r)

# ---- validator from the seo-pins skill ----
BANNED = ['only option', 'fastest', 'guaranteed', 'works in practice', 'before/after', 'before and after', ' of 3', 'prompt 2', 'prompt 3', 'then...', 'then…']
BOARDS = set(BOARD_NAMES)
bad = 0
for p in records:
    n = p['slug']
    def err(m):
        global bad; bad += 1; print(f'[{n}] {m}')
    t, d, a = p['title'], p['description'], p['alt_text']
    if len(t) > 100: err(f'title {len(t)} > 100')
    if p['keywords'][0].lower() not in t[:40].lower(): err('primary keyword not in the first 40 characters of the title')
    if not 150 <= len(d) <= 500: err(f'description {len(d)} not in 150-500')
    if len(a) > 500: err(f'alt text {len(a)} > 500')
    if a.lower().startswith(('image of', 'picture of', 'pin ')): err('alt text should describe, not announce')
    if not 5 <= len(p['keywords']) <= 8: err('need 5-8 keywords')
    if d.count('#') > 3: err('hashtag wall in description')
    if 'theexactmethod.com' not in p['link'] or 'utm_source=pinterest' not in p['link']: err('link needs the site and UTM tags')
    if str(p['board_id']) not in BOARDS: err('unknown board id')
    for f in (t, d, a):
        for w in BANNED:
            if w in f.lower(): err(f'banned phrase: {w!r}')
    if re.search(r'\d+\s*%|\$\d|€\d', t + d) and not p.get('source'): err('number without a source field')
heads = [len(clean_head(p['head']).split()) for p in PINS]
print('max headline words', max(heads), [p['slug'] for p in PINS if len(clean_head(p['head']).split()) > 10])
titles = [r['title'] for r in records]; print('dup titles', len(titles) - len(set(titles)))
print('OK' if not bad else f'{bad} problem(s)')
json.dump(records, open('pins.json', 'w'), indent=1, ensure_ascii=False)

# ---- HTML ----
def head_html(h):
    h = html.escape(h)
    return re.sub(r'(\S*)\[(.+?)\](\S*)', r'<span style="white-space:nowrap">\1<span class="hl">\2</span>\3</span>', h)

CSS = """
@font-face{font-family:Archivo;src:url(FONTS/archivo-variable.woff2)}
@font-face{font-family:Newsreader;src:url(FONTS/newsreader-variable.woff2)}
@font-face{font-family:Plex;src:url(FONTS/plex-mono-400.woff2);font-weight:400}
@font-face{font-family:Plex;src:url(FONTS/plex-mono-500.woff2);font-weight:500}
*{margin:0;box-sizing:border-box}
body{width:1000px;height:1500px;overflow:hidden;font-family:Archivo}
.pin{width:1000px;height:1500px;display:flex;flex-direction:column;background:var(--bg);color:var(--ink)}
.light{--bg:#ECE8DD;--ink:#10261C;--k:#2F6B4A;--acc:#1E8A55;background-image:repeating-linear-gradient(#ECE8DD 0 47px,#E2DDCF 47px 48px)}
.dark{--bg:#10261C;--ink:#ECE8DD;--k:#6BE0A0;--acc:#6BE0A0;background-image:radial-gradient(#22402F 1.6px,transparent 1.7px);background-size:28px 28px}
.main{flex:1;padding:58px 52px 0;display:flex;flex-direction:column;min-height:0;overflow:hidden}
.kick{font-weight:800;font-size:22px;letter-spacing:.14em;text-transform:uppercase;color:var(--k);display:flex;align-items:center;gap:14px}
.kick:before{content:"";width:40px;height:5px;background:var(--acc)}
h1{font-weight:900;font-size:84px;line-height:.98;letter-spacing:-.02em;margin-top:22px}
.hl{display:inline-block;background:#6BE0A0;color:#10261C;border:4px solid #10261C;border-radius:16px;padding:0 14px 6px;transform:rotate(-2deg);box-shadow:5px 5px 0 #10261C;margin:4px 0}
.dark .hl{box-shadow:5px 5px 0 #0A1A13}
.ev{flex:1;display:flex;flex-direction:column;justify-content:center;gap:34px;padding:36px 0}
.code{background:#10261C;color:#ECE8DD;border-radius:20px;padding:30px 34px}
.dark .code{background:#0A1A13;border:3px solid #2E5A43}
.code .l,.quote .l{font-family:Plex;font-weight:500;font-size:19px;letter-spacing:.08em;text-transform:uppercase;color:#6BE0A0;margin-bottom:14px}
.code .t{font-family:Plex;font-size:33px;line-height:1.38;white-space:pre-wrap}
.quote{background:#FFFDF7;color:#10261C;border:4px solid #10261C;border-radius:22px;padding:28px 34px;box-shadow:8px 8px 0 #10261C}
.dark .quote{box-shadow:8px 8px 0 #0A1A13}
.quote .l{color:#4A5A50}
.quote .t{font-family:Newsreader;font-size:42px;line-height:1.28;white-space:pre-wrap}
.take{font-weight:850;font-size:48px;line-height:1.12;padding:0 0 40px}
.take span{color:var(--acc)}
.foot{height:200px;background:#6BE0A0;color:#10261C;border-top:5px solid #10261C;padding:30px 52px}
.foot b{display:block;font-weight:900;font-size:50px;line-height:1}
.foot i{display:block;font-style:normal;font-weight:700;font-size:31px;margin-top:12px}
.foot code{display:block;font-family:Plex;font-size:28px;margin-top:10px}
""".replace('url(FONTS/', 'url(data:font/woff2;base64,')
import base64
for f in ['archivo-variable.woff2','newsreader-variable.woff2','plex-mono-400.woff2','plex-mono-500.woff2']:
    CSS = CSS.replace('base64,'+f+')', 'base64,'+base64.b64encode(open(FONTS+'/'+f,'rb').read()).decode()+')')

def page(p, r):
    g = GUIDES[p['g']]
    blocks = ''
    for kind, label, text in p['blocks']:
        blocks += f'<div class="{kind}"><div class="l">{html.escape(label)}</div><div class="t">{html.escape(text)}</div></div>'
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body>
<div class="pin {'dark' if r['dark'] else 'light'}"><div class="main" id="main">
<div class="kick">{html.escape(p['kicker'])}</div><h1>{head_html(p['head'])}</h1>
<div class="ev">{blocks}</div>
<div class="take">{html.escape(p['take'][0])} <span>{html.escape(p['take'][1])}</span></div></div>
<div class="foot"><b>Free PDF: {html.escape(g['name'])}</b><i>{html.escape(g['sub'])}</i><code>theexactmethod.com</code></div></div></body></html>"""

if '--render' in sys.argv:
    import os
    from playwright.sync_api import sync_playwright
    os.makedirs('out', exist_ok=True)
    bym = {p['slug']: p for p in PINS}
    only = [a for a in sys.argv[2:] if not a.startswith('--')]
    with sync_playwright() as pw:
        b = pw.chromium.launch(); pg = b.new_page(viewport={'width': 1000, 'height': 1500})
        for r in records:
            if only and r['slug'] not in only: continue
            pg.set_content(page(bym[r['slug']], r)); pg.wait_for_timeout(250)
            ov = pg.evaluate("(()=>{const m=document.getElementById('main');return m.scrollHeight-m.clientHeight})()")
            if ov > 0: print('OVERFLOW', r['slug'], ov)
            pg.screenshot(path=f"out/{r['slug']}.png")
        b.close()
    print('rendered')
