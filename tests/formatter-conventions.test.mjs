import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';


function lint(files) {
  const dir = mkdtempSync(join(tmpdir(), 'season-one-conventions-'));
  try {
    for (const [name, source] of Object.entries(files)) {
      writeFileSync(join(dir, name), source);
    }
    const result = spawnSync(
      resolve('node_modules/.bin/oxlint'),
      ['-c', resolve('.oxlint-conventions.json'), '--format', 'json', ...Object.keys(files)],
      { cwd: dir, encoding: 'utf8' },
    );
    assert.ok(result.status === 0 || result.status === 1, result.stderr);

    return JSON.parse(result.stdout).diagnostics.map((issue) => issue.code);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

void test('параметры проверяются и в JS, и в сигнатурах типов', () => {
  const issues = lint({
    'helper.mjs': 'export const choose = (criteria, genre) => genre;',
    'types.ts': 'export interface Handler { run(page: number, jump: boolean): void }',
  });
  assert.equal(issues.length, 2);
  assert.ok(issues.every((code) => code.includes('object-parameters')));
});

void test('составной тип нельзя спрятать в переменной, пропсах или аргументе хука', () => {
  const issues = lint({
    'presenter.ts': "let state: 'empty' | 'loading'; const value = useRef<{ page: number }>(null);",
    'view.tsx': 'export function View(props: { selected: boolean }) {}',
  });
  assert.equal(issues.length, 3);
  assert.ok(issues.every((code) => code.includes('type-files')));
});

void test('именованные параметры, локальные файлы типов и контракт Array.map разрешены', () => {
  assert.deepEqual(
    lint({
      'paging.types.ts': 'export interface Jump { page: number; keyboard: boolean }',
      'view.ts':
        "import type { Jump } from './paging.types'; export const go = ({ page }: Jump) => [page].map((value, index) => value + index);",
    }),
    [],
  );
});
