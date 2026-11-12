import { isUtf8 } from 'node:buffer';
import { execFileSync } from 'node:child_process';
import { lstatSync, readFileSync } from 'node:fs';
import lintConfig from '../.oxlintrc.json' with { type: 'json' };

const { max } = lintConfig.rules['max-lines'][1];
const files = execFileSync(
  'git',
  [
    'ls-files',
    '-z',
    '--cached',
    '--others',
    '--exclude-standard',
    '--',
    '.',
    ':!pnpm-lock.yaml',
    ':!.agents/skills/openspec-*/**',
  ],
  { encoding: 'utf8' },
)
  .split('\0')
  .filter(Boolean);

for (const file of files) {
  if (!lstatSync(file, { throwIfNoEntry: false })?.isFile()) continue;
  const bytes = readFileSync(file);
  if (bytes.includes(0) || !isUtf8(bytes)) continue;
  const contents = bytes.toString();
  const lines = contents.split(/\r\n|\r|\n/);
  if (lines.at(-1) === '') lines.pop();
  if (lines.length > max) {
    console.error(`${file} — ${lines.length} строк при лимите ${max}`);
    process.exitCode = 1;
  }
}
