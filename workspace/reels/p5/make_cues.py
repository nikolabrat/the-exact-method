# P-5: named cue frames from the forced-alignment timing -> src/p5cues_<p>.json (used by P5.tsx and the sound sheet)
import json, re
R = '/home/claude/the-exact-method/workspace/remotion/src/'
for p in ['ig', 'tt']:
    T = json.load(open(R + f'p5timing_{p}.json'))
    Ls = [[w for w in l['words'] if w['w'].strip()] for l in T['lines']]
    L = lambda i: Ls[i][0]['s']
    w = lambda i, k: Ls[i][min(k, len(Ls[i]) - 1)]['s']
    def find(i, rx):
        for x in Ls[i]:
            if re.search(rx, x['w']): return x['s']
        raise SystemExit(f'{p}: no {rx} in line {i}')
    c = {}
    c['L'] = [L(i) for i in range(20)]
    c['two'] = find(1, r'^2$'); c['sig'] = find(1, r'signatures')
    c['side'] = L(2) - 4; c['claudeLand'] = find(2, r'Claude')
    c['shouts'] = find(3, r'shouts'); c['decor'] = find(3, r'decorates')
    c['gptZoom'] = L(4) - 6
    x0 = find(4, r'exclamation'); c['x'] = [x0 + 4 * k for k in range(4)]
    c['bold'] = find(4, r'bold'); c['dash'] = find(4, r'dash')
    c['miss'] = find(5, r"Don't")
    c['claudeZoom'] = L(6) - 6
    e0 = w(6, 1); c['emo'] = [e0 + 5 * k for k in range(3)]
    c['list'] = find(6, r'list'); c['world'] = find(7, r'truly')
    c['both'] = L(8) - 6; c['perfect'] = find(8, r'perfect')
    c['rule'] = L(9) - 4; c['typeEnd'] = find(9, r'rule'); c['strike'] = find(9, r"can't")
    c['slam1'] = w(10, 0); c['slam2'] = w(10, 2); c['slamOut'] = L(11) - 4
    c['fix'] = L(11); c['listWord'] = find(11, r'list')
    c['paste'] = find(12, r'paste'); c['settings'] = find(12, r'settings'); c['once'] = find(12, r'once')
    c['req'] = L(13) - 6; c['send'] = find(13, r'again') + 3
    c['claudeAfter'] = c['send'] + 12
    c['cnt'] = [w(14, 1), w(14, 3)]; c['dates'] = find(14, r'dates')
    c['gptAfter'] = L(15) - 6; c['goneBold'] = find(15, r'bold'); c['goneDash'] = find(15, r'dash'); c['gone'] = find(15, r'gone')
    c['kept'] = find(16, r'kept'); k0 = find(16, r'exclamation'); c['keptX'] = [k0 + 4 * k for k in range(4)]
    c['read'] = L(17); c['scanEnd'] = find(17, r'send')
    c['cta'] = L(18) - 6; c['kw'] = find(18, r'PLAIN'); c['sendC'] = c['kw'] + 14; c['fan'] = find(18, r'lists')
    c['loop'] = L(19) - 4; c['END'] = T['end']; c['TOTAL'] = T['total']
    json.dump(c, open(R + f'p5cues_{p}.json', 'w'))
    print(p, {k: v for k, v in c.items() if k != 'L'})
