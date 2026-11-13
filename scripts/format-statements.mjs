import { Visitor } from 'oxc-parser';

import lintConfig from './oxlint/format.json' with { type: 'json' };


function isHookCall(expression) {
  if (
    ['TSAsExpression', 'TSSatisfiesExpression', 'TSNonNullExpression', 'ChainExpression'].includes(
      expression?.type,
    )
  ) {
    return isHookCall(expression.expression);
  }
  if (expression?.type !== 'CallExpression') {
    return false;
  }
  const { callee } = expression;
  let name = callee.name;
  if (callee.type === 'MemberExpression') {
    name = callee.computed ? callee.property.value : callee.property.name;
  }

  return /^use(?:[A-Z0-9]|$)/u.test(name);
}

function callsHook(statement) {
  if (statement.type === 'VariableDeclaration') {
    return statement.declarations.some(({ init }) => isHookCall(init));
  }

  return isHookCall(statement.expression) || isHookCall(statement.argument);
}

export function separateStatements(code, parsed) {
  const insertions = new Map();
  const newline = code.includes('\r\n') ? '\r\n' : '\n';

  function padAfter(statement, limit, blankLines) {
    // Keep trailing comments with this statement and leading comments with the next.
    let end = statement.end;
    for (const comment of parsed.comments) {
      if (comment.start < end) {
        continue;
      }
      if (comment.start >= limit || !/^[ \t]*$/u.test(code.slice(end, comment.start))) {
        break;
      }
      end = comment.end;
    }
    const gap = code.slice(end);
    const whitespace = gap.match(/^\s*/u)[0];
    if (whitespace.length === gap.length) {
      return;
    }
    const missing = blankLines + 1 - (whitespace.split(newline).length - 1);
    if (missing > 0) {
      insertions.set(end, Math.max(missing, insertions.get(end) ?? 0));
    }
  }

  function visitStatements(statements) {
    for (let i = 1; i < statements.length; i++) {
      const previous = statements[i - 1];
      const next = statements[i];
      if (next.type === 'ReturnStatement' || callsHook(previous) || callsHook(next)) {
        padAfter(previous, next.start, 1);
      }
    }
  }
  const lastImport = parsed.module.staticImports.at(-1);
  // Oxlint counts comment lines as spacing and can move an import's trailing comment.
  const nextComment = lastImport && parsed.comments.find(({ start }) => start >= lastImport.end);
  if (nextComment && !code.slice(lastImport.end, nextComment.start).trim()) {
    padAfter(lastImport, code.length, lintConfig.rules['import/newline-after-import'][1].count);
  }
  new Visitor({
    Program: ({ body }) => visitStatements(body),
    BlockStatement: ({ body }) => visitStatements(body),
    StaticBlock: ({ body }) => visitStatements(body),
    SwitchCase: ({ consequent }) => visitStatements(consequent),
  }).visit(parsed.program);
  for (const [offset, count] of [...insertions].sort(([a], [b]) => b - a)) {
    code = code.slice(0, offset) + newline.repeat(count) + code.slice(offset);
  }

  return code;
}
