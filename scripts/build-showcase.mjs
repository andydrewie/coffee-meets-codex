import { copyFile, lstat, mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'docs');
const assets = [
  'gallery.png', 'owen.png', 'cmc-blue-codex-companion.png', 'mika-portrait.png',
  'noah-portrait.png', 'noah-companion-green.png', 'tina-blue.png',
];
const copies = [
  ...['index.html', 'style.css', 'demo.js'].map(file => [`showcase/${file}`, file]),
  ['public/favicon.svg', 'favicon.svg'],
  ...assets.map(file => [`public/assets/${file}`, `assets/${file}`]),
];
const allowed = new Set([...copies.map(([, destination]) => destination), '.nojekyll']);

// A fixed allowlist keeps backend code, runtime configuration and account data
// out of the public Pages target. Refuse unfamiliar output rather than erase it.
async function inspect(directory, prefix = '') {
  let entries;
  try { entries = await readdir(directory, { withFileTypes: true }); }
  catch (error) { if (error.code === 'ENOENT') return; throw error; }
  for (const entry of entries) {
    const name = `${prefix}${entry.name}`;
    if (entry.isDirectory() && name === 'assets') {
      await inspect(path.join(directory, entry.name), `${name}/`);
    } else if (!entry.isFile() || !allowed.has(name)) {
      throw new Error(`Unexpected file in Pages output: docs/${name}. Review it before rebuilding.`);
    }
  }
}

for (const [source] of copies) {
  const stat = await lstat(path.join(root, source));
  if (!stat.isFile()) throw new Error(`Expected a regular source file: ${source}`);
}
await inspect(output);
await mkdir(path.join(output, 'assets'), { recursive: true });
for (const [source, destination] of copies) {
  await copyFile(path.join(root, source), path.join(output, destination));
}
await writeFile(path.join(output, '.nojekyll'), '');
console.log(`Built docs/ from 3 static showcase files and ${assets.length} approved demo assets. No app or server bundle included.`);
