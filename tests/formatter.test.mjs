import assert from 'node:assert/strict';
import test from 'node:test';

import { formatSource } from '../scripts/format-source.mjs';


void test('поля перевода и темы идут первыми, функции и эффекты отделены', async () => {
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
  assert.equal(await formatSource({ filename: 'usePresenter.ts', input }), expected);
  assert.equal(await formatSource({ filename: 'usePresenter.ts', input: expected }), expected);
});

void test('локальный аргумент остаётся до вызова хука во вложенной функции', async () => {
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
  const formatted = await formatSource({ filename: 'View.tsx', input });
  assert.match(formatted, /const theme = useTheme\(\);\n  const props = readProps\(\);/u);
  assert.match(
    formatted,
    /const \{ scope \} = props;\n    const \{ t \} = useTranslation\(scope\);\n    const pending/u,
  );
  assert.equal(await formatSource({ filename: 'View.tsx', input: formatted }), formatted);
});

void test('между константами и функциями, включая экспортируемые, одна пустая строка', async () => {
  const groups = [
    'const size = 2;\nconst paths = { icon: size };',
    'export function usePresenter() {\n  return paths;\n}',
    'export const read = () => paths;',
    'function local() {}',
    'export default function render() {\n  local();\n}',
  ];
  const expected = groups.join('\n\n') + '\n';
  for (const separator of ['\n', '\n\n\n', '\n\n']) {
    assert.equal(
      await formatSource({ filename: 'icon.ts', input: groups.join(separator) }),
      expected,
    );
  }
});

void test('соседние объявления типов отделены одной пустой строкой', async () => {
  const types = 'export interface A {}|interface B {}|type C = B;|enum D {}|class E {}'.split('|');
  const expected = types.join('\n\n') + '\n';
  assert.equal(await formatSource({ filename: 'types.ts', input: types.join('\n') }), expected);
});
