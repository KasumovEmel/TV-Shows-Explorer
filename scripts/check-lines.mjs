import { isUtf8 } from 'node:buffer';
import { readFileSync } from 'node:fs';

import lintConfig from '../.oxlintrc.json' with { type: 'json' };
import { projectFiles } from './project-files.mjs';


const { max } = lintConfig.rules['max-lines'][1];
for (const file of projectFiles()) {
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
