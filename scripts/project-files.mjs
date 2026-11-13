import { execFileSync } from 'node:child_process';
import { lstatSync } from 'node:fs';


export function projectFiles() {
  const paths = ['.', ':!pnpm-lock.yaml', ':!.agents/skills/openspec-*/**'];

  return execFileSync(
    'git',
    ['ls-files', '-z', '--cached', '--others', '--exclude-standard', '--', ...paths],
    { encoding: 'utf8' },
  )
    .split('\0')
    .filter((file) => file && lstatSync(file, { throwIfNoEntry: false })?.isFile());
}
