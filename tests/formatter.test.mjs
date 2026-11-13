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
