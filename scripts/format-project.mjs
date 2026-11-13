import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { extname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { formatSources } from './format-source.mjs';
import { projectFiles } from './project-files.mjs';


const mode = process.argv[2];
if (!['--check', '--write'].includes(mode)) {
  throw new Error('Expected --check or --write');
}
const extensions = ['ts', 'tsx', 'mts', 'cts', 'js', 'jsx', 'mjs', 'cjs'];
const files = projectFiles()
  .filter((file) => extensions.includes(extname(file).slice(1)))
  .map((filename) => ({ filename, input: readFileSync(filename, 'utf8') }));
const formatted = await formatSources(files);
for (const [index, { filename, input }] of files.entries()) {
  if (formatted[index] === input) {
    continue;
  }
  if (mode === '--write') {
    writeFileSync(filename, formatted[index]);
  } else {
    console.error('Проверь форматирование: ' + filename);
    process.exitCode = 1;
  }
}

const cli = new URL('bin/oxfmt', import.meta.resolve('oxfmt/package.json'));
const otherFiles = '!**/*.{' + extensions.join(',') + '}';
execFileSync(process.execPath, [fileURLToPath(cli), mode, '.', otherFiles], { stdio: 'inherit' });
