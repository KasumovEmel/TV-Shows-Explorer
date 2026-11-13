import { Biome } from '@biomejs/js-api/nodejs';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseSync } from 'oxc-parser';
import { format } from 'oxfmt';

import config from '../.oxfmtrc.json' with { type: 'json' };
import lintConfig from './oxlint/format.json' with { type: 'json' };


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

async function formatStatements(filename, input) {
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
  // Oxlint counts comment lines as spacing and can move an import's trailing comment.
  const nextComment = lastImport && parsed.comments.find(({ start }) => start >= lastImport.end);
  if (!nextComment || code.slice(lastImport.end, nextComment.start).trim()) return code;

  let end = lastImport.end;
  for (const comment of parsed.comments) {
    if (comment.start < end) continue;
    if (!/^[ \t]*$/.test(code.slice(end, comment.start))) break;
    end = comment.end;
  }

  const rest = code.slice(end).trimStart();
  if (!rest) return code;
  const newline = code.includes('\r\n') ? '\r\n' : '\n';
  return (
    code.slice(0, end) +
    newline.repeat(lintConfig.rules['import/newline-after-import'][1].count + 1) +
    rest
  );
}

export async function formatSources(files) {
  if (!files.length) {
    return [];
  }
  // Oxlint fixes files on disk. Stage the editor buffer or the whole CLI batch in isolation.
  const directory = mkdtempSync(join(tmpdir(), 'tv-shows-format-'));
  try {
    const paths = [];
    for (const { filename, input } of files) {
      const path = join(directory, paths.length + extname(filename));
      writeFileSync(path, await formatStatements(filename, input));
      paths.push(path);
    }
    const cli = new URL('bin/oxlint', import.meta.resolve('oxlint/package.json'));
    const configPath = fileURLToPath(new URL('./oxlint/format.json', import.meta.url));
    const args = [fileURLToPath(cli), '-c', configPath, '-A', 'correctness', '--fix', '.'];
    execFileSync(process.execPath, args, {
      cwd: directory,
      stdio: ['ignore', process.stderr, process.stderr],
    });

    return paths.map((path) => readFileSync(path, 'utf8'));
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

export async function formatSource(filename, input) {
  const [formatted] = await formatSources([{ filename, input }]);

  return formatted;
}

if (process.argv[2] === '--stdin') {
  process.stdout.write(await formatSource(process.argv[3], readFileSync(0, 'utf8')));
}
