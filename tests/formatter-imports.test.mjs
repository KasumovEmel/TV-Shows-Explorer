import assert from 'node:assert/strict';
import test from 'node:test';

import { formatSource } from '../scripts/format-source.mjs';


void test('после блока импортов остаются ровно две пустые строки', async () => {
  const imports = "import './a';\nimport './b';";
  for (const tail of ['', ' // для импорта']) {
    const next = '// для функции\nexport function run() {}\n';
    const expected = imports + tail + '\n\n\n' + next;
    for (const separator of ['\n', '\n\n\n', '\n\n\n\n']) {
      assert.equal(
        await formatSource({ filename: 'module.ts', input: imports + tail + separator + next }),
        expected,
      );
    }
  }
  assert.equal(await formatSource({ filename: 'module.ts', input: imports }), imports + '\n');
  assert.equal(
    await formatSource({ filename: 'module.js', input: imports + '\nrun();' }),
    imports + '\n\n\nrun();\n',
  );
});

void test('типы завершают свою группу импортов в алфавитном порядке', async () => {
  const groups = [
    ["import { useState } from 'react';", "import type { ReactNode } from 'react';"],
    [
      "import axios from 'axios';",
      "import type { AxiosError } from 'axios';",
      "import type { TFunction } from 'i18next';",
    ],
    [
      "import { button } from './button';",
      "import type { A } from './a';",
      "import type { Z } from './z';",
    ],
    ["import './page.css';"],
  ];
  const code =
    'export type { A, AxiosError, ReactNode, TFunction, Z };\nexport { axios, button, useState };\n';
  const input = groups.flat().reverse().join('\n') + '\n' + code;
  const expected = groups.map((group) => group.join('\n')).join('\n\n') + '\n\n\n' + code;
  assert.equal(await formatSource({ filename: 'imports.ts', input }), expected);
});
