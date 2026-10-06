import assert from 'node:assert/strict';
import { lstat, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'docs');
const assets = [
  'gallery.png', 'owen.png', 'tracy.png', 'mika-portrait.png',
  'noah-portrait.png', 'noah-companion-green.png', 'tina-blue.png',
];
const expected = new Set([
  'index.html', 'style.css', 'demo.js', 'favicon.svg', '.nojekyll',
  ...assets.map(file => `assets/${file}`),
]);
const files = [];
async function walk(directory, prefix = '') {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const name = `${prefix}${entry.name}`;
    if (entry.isDirectory() && name === 'assets') await walk(path.join(directory, entry.name), `${name}/`);
    else {
      assert(entry.isFile(), `Output must contain regular files only: ${name}`);
      files.push(name);
    }
  }
}
await walk(output);
assert.deepEqual(new Set(files), expected, 'Pages output differs from the explicit static-file allowlist');
const [html, css, js] = await Promise.all(['index.html', 'style.css', 'demo.js'].map(file => readFile(path.join(output, file), 'utf8')));
for (const file of ['index.html', 'style.css', 'demo.js']) {
  assert.equal(await readFile(path.join(output, file), 'utf8'), await readFile(path.join(root, 'showcase', file), 'utf8'), `${file} is stale; rebuild the showcase`);
}
assert(/static\s+(?:showcase|demo|preview)/i.test(html), 'Explain the static demo boundary on the public page');
assert(/fictional\s+(?:adult|people|profile|character)/i.test(html + js), 'Label fictional demo profiles explicitly');
assert(/prototype/i.test(html), 'Label the prototype status on the public page');
assert(/ChatGPT/.test(html), 'Explain ChatGPT sign-in on the public page');
const liveApp = 'https://coffee-meets-codex.andydrewie.chatgpt.site/app';
assert(html.includes(`href="${liveApp}"`) || html.includes(`href='${liveApp}'`), 'Provide an absolute link to the real authenticated /app');
assert(!/<form\b/i.test(html), 'The showcase must not collect visitor profile data');
assert(!/<base\b/i.test(html), 'A base element can break repository-subpath assets');
assert(!/\b(?:fetch\s*\(|XMLHttpRequest\b|WebSocket\b|EventSource\b|sendBeacon\b|serviceWorker\b|localStorage\b|sessionStorage\b|indexedDB\b)/.test(js), 'The demo must stay local and in memory, without runtime network or persistence calls');
assert(!/OPENAI_API_KEY|api\.openai\.com|oai-authenticated|\/api\//i.test(html + css + js), 'Backend, model and identity endpoints must not enter the static target');
assert(/prefers-reduced-motion\s*:\s*reduce/.test(css), 'Provide a reduced-motion preference');
assert(/:focus-visible/.test(css), 'Provide visible keyboard focus');

const references = [];
for (const match of html.matchAll(/\b(?:src|href)\s*=\s*["']([^"']+)["']/g)) references.push(['index.html', match[1]]);
for (const match of css.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g)) references.push(['style.css', match[1]]);
for (const match of js.matchAll(/["'`]((?:\.\/)?assets\/[^"'`]+)["'`]/g)) references.push(['demo.js', match[1]]);
for (const source of [html, css, js]) {
  assert(!/["'`]\/(?!\/)[^"'`]*\.(?:png|svg|webp|jpg|jpeg|gif|css|js)/i.test(source), 'Root-relative assets break GitHub repository Pages URLs');
}
const base = new URL('https://andydrewie.github.io/coffee-meets-codex/');
let checked = 0;
for (const [file, ref] of references) {
  if (/^(?:https?:|mailto:|tel:|data:|#)/i.test(ref)) continue;
  assert(!ref.startsWith('/') && !ref.includes('${'), `Use a concrete repository-relative URL in ${file}: ${ref}`);
  const url = new URL(ref, base);
  assert(url.href.startsWith(base.href), `Asset escapes the repository Pages path: ${ref}`);
  const local = decodeURIComponent(url.pathname.slice(base.pathname.length));
  assert(expected.has(local), `Reference is outside the static allowlist in ${file}: ${ref}`);
  const stat = await lstat(path.join(output, local));
  assert(stat.isFile() && stat.size > 0, `Missing or empty local reference in ${file}: ${ref}`);
  checked += 1;
}
console.log(`Showcase checks passed: ${files.length} isolated static files, ${checked} repository-subpath references, fictional/prototype labels, authenticated /app handoff, keyboard/reduced-motion hooks, no runtime API calls.`);
