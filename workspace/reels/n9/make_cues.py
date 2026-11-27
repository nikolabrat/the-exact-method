# N-9: named cue frames from forced-alignment timing -> src/n9cues_<p>.json (used by N9.tsx and the sound sheet)
import json, re
R = '/home/claude/the-exact-method/workspace/remotion/src/'
for p in ['ig', 'tt']:
    T = json.load(open(R + f'n9timing_{p}.json'))
    Ls = [l['words'] for l in T['lines']]
    L = lambda i: Ls[i][0]['s']
    w = lambda i, k: Ls[i][min(k, len(Ls[i]) - 1)]['s']
    def find(i, rx, nth=0):
        hits = [x['s'] for x in Ls[i] if re.search(rx, x['w'])]
        if len(hits) <= nth: raise SystemExit(f'{p}: no {rx} in line {i}: {[x["w"] for x in Ls[i]]}')
        return hits[nth]
    c = {'L': [L(i) for i in range(len(Ls))]}
    c['six'] = find(1, r'^6'); c['need1'] = find(1, r'^1')
    c['calc'] = L(2) - 4; c['bakers'] = find(2, r'bakers'); c['asked'] = find(2, r'asked')
    c['twice'] = L(3) - 3; c['oneLine'] = find(3, r'^1$'); c['threeSteps'] = find(3, r'^3$')
    c['ans1'] = L(4) - 6
    c['chips'] = [find(5, r'^6$'), find(5, r'^7-day'), find(5, r'^20$'), find(5, r'chart')]
    c['fb35'] = find(6, r'Facebook'); c['pin20'] = find(6, r'Pinterest'); c['red15'] = find(6, r'Reddit')
    c['small'] = find(7, r'small'); c['notG'] = find(7, r'^Not$')
    c['guess'] = L(8)
    c['hour'] = find(9, r'hour'); c['cant6'] = find(9, r"^6")
    c['steps3'] = L(10) - 2
    c['p1'] = L(11) - 4; c['p1end'] = find(11, r'shortlist')
    c['found8'] = find(12, r'^8'); c['calcs3'] = find(12, r'calculators'); c['exist'] = find(12, r'exist')
    c['p2'] = L(13) - 4; c['k1'] = find(13, r'hour'); c['k2'] = find(13, r'budget'); c['k3'] = find(13, r'followers')
    c['left3'] = L(14); c['fb'] = find(14, r'Facebook'); c['ig'] = find(14, r'Instagram'); c['rd'] = find(14, r'Reddit')
    c['p3'] = L(15) - 4; c['p3end'] = find(15, r'why')
    c['start'] = L(16); c['notIG'] = find(16, r'Instagram'); c['notRD'] = find(16, r'Reddit'); c['notTT'] = find(16, r'TikTok')
    c['why'] = L(17); c['followers'] = find(18, r'followers'); c['already'] = find(18, r'already')
    c['d1'] = L(19); c['d2'] = find(19, r'answer'); c['d3'] = find(19, r'post')
    c['goal'] = L(20); c['ten'] = find(20, r'^10$')
    c['cta'] = L(21) - 6; c['kw'] = find(21, r'NARROW'); c['sendC'] = c['kw'] + 14; c['fan'] = find(21, r'prompts')
    c['loop'] = L(22) - 4; c['END'] = T['end']; c['TOTAL'] = T['total']
    json.dump(c, open(R + f'n9cues_{p}.json', 'w'))
    print(p, {k: v for k, v in c.items() if k != 'L'})
