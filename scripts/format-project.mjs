import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { extname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { formatSource } from './format-source.mjs';
import { projectFiles } from './project-files.mjs';


const mode = process.argv[2];
if (!['--check', '--write'].includes(mode)) throw new Error('Expected --check or --write');
const extensions = ['ts', 'tsx', 'mts', 'cts', 'js', 'jsx', 'mjs', 'cjs'];
for (const file of projectFiles()) {
  if (!extensions.includes(extname(file).slice(1))) continue;
  const original = readFileSync(file, 'utf8');
  const formatted = await formatSource(file, original);
  if (formatted === original) continue;
  if (mode === '--write') writeFileSync(file, formatted);
  else {
    console.error('Проверь форматирование: ' + file);
    process.exitCode = 1;
  }
}

const cli = new URL('bin/oxfmt', import.meta.resolve('oxfmt/package.json'));
const otherFiles = '!**/*.{' + extensions.join(',') + '}';
execFileSync(process.execPath, [fileURLToPath(cli), mode, '.', otherFiles], { stdio: 'inherit' });
