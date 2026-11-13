import { unwrapExpression } from './hook-call.mjs';


function isDataField(member) {
  if (member.type !== 'PropertyDefinition' && member.type !== 'AccessorProperty') {
    return false;
  }
  const value = unwrapExpression(member.value);

  return value?.type !== 'ArrowFunctionExpression' && value?.type !== 'FunctionExpression';
}

export function separateClassMembers(members, padAfter) {
  for (let i = 1; i < members.length; i++) {
    const previous = members[i - 1];
    const next = members[i];
    const blankLines = isDataField(previous) && isDataField(next) ? 0 : 1;
    padAfter(previous, next.start, blankLines);
  }
}
