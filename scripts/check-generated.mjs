import { execFileSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  symlinkSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';


const output = ['apps/web/src/api/generated', 'apps/server/src/generated'];
const temp = mkdtempSync(join(tmpdir(), 'season-one-orval-'));

function files(dir) {
  if (!existsSync(dir)) {
    return [];
  }

  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((e) => e.isFile())
    .map((e) => relative(dir, join(e.parentPath, e.name)))
    .sort();
}

try {
  for (const file of [
    'package.json',
    'apps/web/package.json',
    'apps/server/package.json',
    'packages/contracts',
    'orval.config.ts',
    'apps/web/src/app/utils/request.ts',
    'apps/server/src/generated/handlers',
    'apps/server/tsconfig.json',
    'apps/web/tsconfig.json',
  ]) {
    const target = join(temp, file);
    mkdirSync(dirname(target), { recursive: true });
    cpSync(file, target, { recursive: true });
  }
  symlinkSync(resolve('node_modules'), join(temp, 'node_modules'), 'dir');
  execFileSync(resolve('node_modules/.bin/orval'), [], { cwd: temp, stdio: 'inherit' });
  for (const dir of output) {
    const generated = join(temp, dir);
    const names = files(generated);
    if (
      JSON.stringify(names) !== JSON.stringify(files(dir)) ||
      names.some(
        (name) => !readFileSync(join(dir, name)).equals(readFileSync(join(generated, name))),
      )
    ) {
      throw new Error('Regenerate and commit ' + dir + ' with pnpm api:generate');
    }
  }
} finally {
  rmSync(temp, { recursive: true, force: true });
}
