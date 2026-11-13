export function unwrapExpression(expression) {
  while (
    ['TSAsExpression', 'TSSatisfiesExpression', 'TSNonNullExpression', 'ChainExpression'].includes(
      expression?.type,
    )
  ) {
    expression = expression.expression;
  }

  return expression;
}

export function hookName(expression) {
  const call = unwrapExpression(expression);
  if (call?.type !== 'CallExpression') {
    return '';
  }
  const { callee } = call;
  let name = callee.name;
  if (callee.type === 'MemberExpression') {
    name = callee.computed ? callee.property.value : callee.property.name;
  }

  return /^use(?:[A-Z0-9]|$)/u.test(name) ? name : '';
}
