import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import fs from 'fs';
const [,, comp, frames, outdir] = process.argv;
const cwd = process.cwd();
const serveUrl = await bundle({entryPoint: cwd + '/src/index.tsx', publicDir: cwd + '/public', webpackOverride: (c) => ({...c, resolve: {...c.resolve, alias: {...(c.resolve?.alias ?? {}), '@': cwd + '/src'}}})});
const browserExecutable = fs.readFileSync('.browser', 'utf8').trim();
const composition = await selectComposition({serveUrl, id: comp, browserExecutable, inputProps: {}});
for (const fr of frames.split(',').map(Number)) {
  await renderStill({composition, serveUrl, output: `${outdir}/${comp}_${String(fr).padStart(4, '0')}.png`, frame: fr, browserExecutable, imageFormat: 'png'});
  process.stdout.write(fr + ' ');
}
