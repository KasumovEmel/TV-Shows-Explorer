import { cpSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';


// Export the production entry from the same compilation Playwright serves.
const built = '.rsbuild/browser-tests';
const {
  entries: { index },
} = JSON.parse(readFileSync(join(built, 'manifest.json'), 'utf8'));
const files = new Set([
  ...index.html,
  ...index.assets,
  ...Object.values(index.initial).flat(),
  ...Object.values(index.async).flat(),
]);
rmSync('dist', { recursive: true, force: true });
cpSync('public', 'dist', { recursive: true });
for (const file of files) {
  const target = join('dist', file);
  mkdirSync(dirname(target), { recursive: true });
  cpSync(join(built, file), target);
}
