import { propertyName, requestTarget } from './request-target.mjs';


function awaitedRequest(call) {
  let result = call;
  while (
    result.parent.type === 'MemberExpression' &&
    result.parent.object === result &&
    ['then', 'catch', 'finally'].includes(propertyName(result.parent)) &&
    result.parent.parent.type === 'CallExpression' &&
    result.parent.parent.callee === result.parent
  ) {
    result = result.parent.parent;
  }
  const list = result.parent;
  if (list.type === 'ArrayExpression' && list.parent.type === 'CallExpression') {
    const { callee } = list.parent;
    if (
      callee.type === 'MemberExpression' &&
      callee.object.name === 'Promise' &&
      ['all', 'allSettled', 'race', 'any'].includes(propertyName(callee))
    ) {
      result = list.parent;
    }
  }
  while (
    ['ChainExpression', 'TSNonNullExpression', 'TSSatisfiesExpression', 'TSAsExpression'].includes(
      result.parent.type,
    )
  ) {
    result = result.parent;
  }

  return result.parent.type === 'AwaitExpression';
}

function insideCaughtTry(node) {
  for (let child = node; child.parent; child = child.parent) {
    const parent = child.parent;
    if (parent.type.includes('Function')) {
      return false;
    }
    if (parent.type === 'TryStatement' && parent.block === child && parent.handler) {
      return parent.handler.body.body.some((statement) => statement.type !== 'EmptyStatement');
    }
  }

  return false;
}

export const requireRequestCatch = {
  create(context) {
    return {
      CallExpression(node) {
        const target = requestTarget(context.sourceCode, node.callee);
        if (target !== 'client' && target !== 'request' && target !== 'fetch') {
          return;
        }
        if (!awaitedRequest(node) || !insideCaughtTry(node)) {
          context.report({
            node,
            message: 'Дождись HTTP-запроса внутри try и обработай ошибку в catch.',
          });
        }
      },
    };
  },
};
