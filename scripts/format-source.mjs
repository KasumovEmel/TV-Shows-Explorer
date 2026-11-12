import { Biome } from '@biomejs/js-api/nodejs';
import { readFileSync } from 'node:fs';
import { parseSync } from 'oxc-parser';
import { format } from 'oxfmt';

import config from '../.oxfmtrc.json' with { type: 'json' };


const biome = new Biome();
const { projectKey } = biome.openProject('.');
biome.applyConfiguration(projectKey, {
  formatter: { enabled: false },
  assist: { enabled: false },
  linter: {
    rules: {
      recommended: false,
      style: { useImportType: { level: 'error', options: { style: 'separatedType' } } },
    },
  },
});

export async function formatSource(filename, input) {
  if (/\.(?:[cm]?ts|tsx)$/i.test(filename)) {
    input = biome.lintContent(projectKey, input, {
      filePath: filename,
      fixFileMode: 'safeFixes',
    }).content;
  }
  const { code, errors } = await format(filename, input, config);
  if (errors.length) throw new Error(filename + ': ' + errors[0].message);

  const parsed = parseSync(filename, code);
  const lastImport = parsed.module.staticImports.at(-1);
  if (!lastImport) return code;

  // Комментарий в строке импорта остаётся с ним, а JSDoc на следующей — с компонентом.
  let end = lastImport.end;
  for (const comment of parsed.comments) {
    if (comment.start < end) continue;
    if (!/^[ \t]*$/.test(code.slice(end, comment.start))) break;
    end = comment.end;
  }

  const rest = code.slice(end).trimStart();
  if (!rest) return code;
  const newline = code.includes('\r\n') ? '\r\n' : '\n';
  return code.slice(0, end) + newline.repeat(3) + rest;
}

if (process.argv[2] === '--stdin') {
  process.stdout.write(await formatSource(process.argv[3], readFileSync(0, 'utf8')));
}
