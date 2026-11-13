import { Visitor } from 'oxc-parser';

import { hookName, unwrapExpression } from './hook-call.mjs';


const typeDeclarations = new Set([
  'TSTypeAliasDeclaration',
  'TSInterfaceDeclaration',
  'TSEnumDeclaration',
  'ClassDeclaration',
]);

function isTypeDeclaration(statement) {
  return typeDeclarations.has((statement.declaration ?? statement).type);
}

function isFunctionStatement(statement) {
  const declaration = statement.declaration ?? statement;
  if (
    declaration.type === 'FunctionDeclaration' ||
    declaration.type === 'FunctionExpression' ||
    declaration.type === 'ArrowFunctionExpression'
  ) {
    return true;
  }
  if (declaration.type === 'VariableDeclaration') {
    return declaration.declarations.some(({ init }) => {
      const value = unwrapExpression(init);

      return (
        value?.type === 'ArrowFunctionExpression' ||
        value?.type === 'FunctionExpression' ||
        hookName(value) === 'useCallback'
      );
    });
  }

  return Boolean(hookName(statement.expression));
}

export function separateStatements(code, parsed) {
  const edits = new Map();
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
    const whitespace = code.slice(end, limit).match(/^\s*/u)[0];
    const breaks = whitespace.match(/\r?\n/gu)?.length ?? 0;
    if (
      end + whitespace.length === code.length ||
      breaks === blankLines + 1 ||
      (blankLines === 0 && !breaks)
    ) {
      return;
    }
    const indent = whitespace.slice(whitespace.lastIndexOf('\n') + 1);
    edits.set(end, {
      length: whitespace.length,
      replacement: newline.repeat(blankLines + 1) + indent,
    });
  }

  function visitStatements(statements) {
    for (let i = 1; i < statements.length; i++) {
      const previous = statements[i - 1];
      const next = statements[i];
      if (previous.type === 'ImportDeclaration') {
        continue;
      }
      if (
        next.type === 'ReturnStatement' ||
        isFunctionStatement(previous) ||
        isFunctionStatement(next) ||
        (isTypeDeclaration(previous) && isTypeDeclaration(next))
      ) {
        padAfter(previous, next.start, 1);
      } else if (previous.type === 'VariableDeclaration' && next.type === 'VariableDeclaration') {
        padAfter(previous, next.start, 0);
      }
    }
  }

  for (const [index, statement] of parsed.program.body.entries()) {
    const next = parsed.program.body[index + 1];
    if (statement.type === 'ImportDeclaration' && next?.type !== 'ImportDeclaration') {
      padAfter(statement, next?.start ?? code.length, 2);
    }
  }
  new Visitor({
    Program: ({ body }) => visitStatements(body),
    BlockStatement: ({ body }) => visitStatements(body),
    TSModuleBlock: ({ body }) => visitStatements(body),
    StaticBlock: ({ body }) => visitStatements(body),
    SwitchCase: ({ consequent }) => visitStatements(consequent),
  }).visit(parsed.program);
  for (const [offset, { length, replacement }] of [...edits].sort(([a], [b]) => b - a)) {
    code = code.slice(0, offset) + replacement + code.slice(offset + length);
  }

  return code;
}
