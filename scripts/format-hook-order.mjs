import { Visitor, visitorKeys } from 'oxc-parser';

import { hookName } from './hook-call.mjs';


const priorities = ['useTranslation', 'useTheme'];

function hookRank(statement) {
  const declarations = statement.declarations;
  if (declarations?.length === 1) {
    const rank = priorities.indexOf(hookName(declarations[0].init));
    if (rank !== -1) {
      return rank;
    }
  }

  return priorities.length;
}

function identifiers(node, names = new Set()) {
  if (node?.type === 'Identifier') {
    names.add(node.name);
  }
  for (const key of visitorKeys[node?.type] ?? []) {
    const child = node[key];
    if (Array.isArray(child)) {
      child.forEach((item) => identifiers(item, names));
    } else {
      identifiers(child, names);
    }
  }

  return names;
}

export function orderHookFields(code, parsed) {
  function order({ body }) {
    if (
      body?.type !== 'BlockStatement' ||
      !body.body.some((stmt) => hookRank(stmt) < priorities.length)
    ) {
      return;
    }
    const entries = [];
    let previousEnd = body.start + 1;
    for (const statement of body.body) {
      if (
        statement.directive === undefined &&
        statement.type !== 'VariableDeclaration' &&
        statement.type !== 'FunctionDeclaration' &&
        !hookName(statement.expression)
      ) {
        break;
      }
      // Move leading comments with their field, and keep same-line comments with the previous one.
      let start = statement.start;
      let end = statement.end;
      for (const comment of parsed.comments) {
        if (comment.start >= previousEnd && comment.end <= statement.start) {
          start = Math.min(start, comment.start);
        }
        if (comment.start >= end && /^[ \t]*$/u.test(code.slice(end, comment.start))) {
          end = comment.end;
        }
      }
      previousEnd = end;
      if (statement.directive === undefined) {
        entries.push({ statement, start, end, rank: hookRank(statement) });
      }
    }
    const sorted = [];
    for (const entry of entries) {
      let i = sorted.length;
      if (entry.rank < priorities.length) {
        const uses = identifiers(entry.statement);
        while (i > 0 && sorted[i - 1].rank > entry.rank) {
          const earlier = sorted[i - 1].statement;
          const bindings = earlier.declarations?.map(({ id }) => id) ?? [earlier.id];
          if (bindings.some((id) => [...identifiers(id)].some((name) => uses.has(name)))) {
            break;
          }
          i--;
        }
      }
      sorted.splice(i, 0, entry);
    }
    if (entries.every((entry, i) => entry === sorted[i])) {
      return;
    }
    const ordered = sorted.map(({ start, end }, i) => {
      const gap = i ? code.slice(entries[i - 1].end, entries[i].start) : '';

      return gap + code.slice(start, end);
    });
    code = code.slice(0, entries[0].start) + ordered.join('') + code.slice(entries.at(-1).end);
  }

  // Sorting preserves the enclosing range's length. Format nested functions first.
  new Visitor({
    'FunctionDeclaration:exit': order,
    'FunctionExpression:exit': order,
    'ArrowFunctionExpression:exit': order,
  }).visit(parsed.program);

  return code;
}
