import assert from 'node:assert/strict';
import test from 'node:test';

import { formatSource } from '../scripts/format-source.mjs';


test('поля класса идут подряд, методы и стрелочные обработчики отделены', async () => {
  const members = [
    '  state = false;\n  private locked = false;',
    '  static recover() {}',
    '  componentDidUpdate() {}',
    '  /** Retry once. */\n  private restore = () => {};',
    '  render() {}',
  ];
  const expected = 'class Boundary {\n' + members.join('\n\n') + '\n}\n';
  const input = expected.replaceAll('\n\n', '\n').replace('  private locked', '\n  private locked');
  assert.equal(await formatSource('Boundary.tsx', input), expected);
  assert.equal(await formatSource('Boundary.tsx', expected), expected);
});
