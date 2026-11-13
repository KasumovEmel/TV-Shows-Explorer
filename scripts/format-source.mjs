import { Biome } from '@biomejs/js-api/nodejs';
import { readFileSync } from 'node:fs';
import { parseSync } from 'oxc-parser';
import { format } from 'oxfmt';

import config from '../.oxfmtrc.json' with { type: 'json' };
import { orderHookFields } from './format-hook-order.mjs';
import { separateStatements } from './format-statements.mjs';


const biome = new Biome();
const { projectKey } = biome.openProject('.');
biome.applyConfiguration(projectKey, {
  formatter: { enabled: false },
  assist: { enabled: false },
  linter: {
    rules: {
      recommended: false,
      style: {
        useBlockStatements: { level: 'error', fix: 'safe' },
        useImportType: { level: 'error', options: { style: 'separatedType' } },
      },
    },
  },
});

export async function formatSource(filename, input) {
  input = biome.lintContent(projectKey, input, {
    filePath: filename,
    fixFileMode: 'safeFixes',
  }).content;
  const { code, errors } = await format(filename, input, config);
  if (errors.length) {
    throw new Error(filename + ': ' + errors[0].message);
  }

  const parsed = parseSync(filename, code);
  const ordered = orderHookFields(code, parsed);

  return separateStatements(ordered, ordered === code ? parsed : parseSync(filename, ordered));
}

export async function formatSources(files) {
  const formatted = [];
  for (const { filename, input } of files) {
    formatted.push(await formatSource(filename, input));
  }

  return formatted;
}

if (process.argv[2] === '--stdin') {
  process.stdout.write(await formatSource(process.argv[3], readFileSync(0, 'utf8')));
}
