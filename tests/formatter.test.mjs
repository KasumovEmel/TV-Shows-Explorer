import assert from 'node:assert/strict';
import test from 'node:test';

import { formatSource } from '../scripts/format-source.mjs';


test('поля перевода и темы идут первыми, функции и эффекты отделены', async () => {
  const input = `export function usePresenter(field) {
  'use custom'; // directive
  const heading = useId();

  const { theme } = useTheme(); // theme
  const { inputRef } = field;
  // Перевод экрана
  const { i18n, t } = useTranslation(); // translation
  const notify = useNotify();
  function clear() { inputRef.current?.focus(); }
  const submit = useCallback(() => notify(), [notify]);
  useEffect(() => clear(), []);
  return { heading, theme, i18n, t, submit };
}`;
  const expected = `export function usePresenter(field) {
  'use custom'; // directive
  // Перевод экрана
  const { i18n, t } = useTranslation(); // translation
  const { theme } = useTheme(); // theme
  const heading = useId();
  const { inputRef } = field;
  const notify = useNotify();

  function clear() {
    inputRef.current?.focus();
  }

  const submit = useCallback(() => notify(), [notify]);

  useEffect(() => clear(), []);

  return { heading, theme, i18n, t, submit };
}
`;
  assert.equal(await formatSource('usePresenter.ts', input), expected);
  assert.equal(await formatSource('usePresenter.ts', expected), expected);
});

test('локальный аргумент остаётся до вызова хука во вложенной функции', async () => {
  const input = `const View = () => {
  const props = readProps();
  const theme = useTheme();
  const useLabels = () => {
    const { scope } = props;
    const pending = useState(false);
    const { t } = useTranslation(scope);
    return { t, pending };
  };
  return { theme, useLabels };
};`;
  const formatted = await formatSource('View.tsx', input);
  assert.match(formatted, /const theme = useTheme\(\);\n  const props = readProps\(\);/u);
  assert.match(
    formatted,
    /const \{ scope \} = props;\n    const \{ t \} = useTranslation\(scope\);\n    const pending/u,
  );
  assert.equal(await formatSource('View.tsx', formatted), formatted);
});

test('после блока импортов остаются ровно две пустые строки', async () => {
  const imports = "import './a';\nimport './b';";
  for (const tail of ['', ' // для импорта']) {
    const next = '// для функции\nexport function run() {}\n';
    const expected = imports + tail + '\n\n\n' + next;
    for (const separator of ['\n', '\n\n\n', '\n\n\n\n']) {
      assert.equal(await formatSource('module.ts', imports + tail + separator + next), expected);
    }
  }
  assert.equal(await formatSource('module.ts', imports), imports + '\n');
  assert.equal(await formatSource('module.js', imports + '\nrun();'), imports + '\n\n\nrun();\n');
});

test('типы завершают свою группу импортов в алфавитном порядке', async () => {
  const groups = [
    ["import { useState } from 'react';", "import type { ReactNode } from 'react';"],
    [
      "import axios from 'axios';",
      "import type { AxiosError } from 'axios';",
      "import type { Key } from 'swr';",
    ],
    [
      "import { button } from './button';",
      "import type { A } from './a';",
      "import type { Z } from './z';",
    ],
    ["import './page.css';"],
  ];
  const code =
    'export type { A, AxiosError, Key, ReactNode, Z };\nexport { axios, button, useState };\n';
  const input = groups.flat().reverse().join('\n') + '\n' + code;
  const expected = groups.map((group) => group.join('\n')).join('\n\n') + '\n\n\n' + code;
  assert.equal(await formatSource('imports.ts', input), expected);
});
