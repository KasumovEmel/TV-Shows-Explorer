// ECMAScript supplies positional arguments to these inline callbacks.
const collectionCallbacks = new Set([
  'map',
  'flatMap',
  'filter',
  'reduce',
  'reduceRight',
  'forEach',
  'every',
  'some',
  'find',
  'findIndex',
  'sort',
  'toSorted',
]);

function standardCallback(node) {
  const parent = node.parent;
  const callee = parent.callee;
  if (parent.type === 'NewExpression') {
    return callee.name === 'Promise' && parent.arguments[0] === node;
  }
  if (parent.type !== 'CallExpression' || callee.type !== 'MemberExpression') {
    return false;
  }
  if (callee.object.name === 'Array' && callee.property.name === 'from') {
    return parent.arguments[1] === node;
  }

  return collectionCallbacks.has(callee.property.name) && parent.arguments[0] === node;
}

export const objectParameters = {
  create(context) {
    function check(node) {
      const inputs = node.params.filter((param) => param.name !== 'this');
      if (
        (inputs.length > 1 || inputs.some((param) => param.type === 'RestElement')) &&
        !standardCallback(node)
      ) {
        context.report({
          node,
          loc: node.loc.start,
          message: 'Передавай несколько аргументов одним объектом параметров.',
        });
      }
    }

    return {
      FunctionDeclaration: check,
      FunctionExpression: check,
      ArrowFunctionExpression: check,
      TSFunctionType: check,
      TSConstructorType: check,
      TSDeclareFunction: check,
      TSMethodSignature: check,
      TSCallSignatureDeclaration: check,
      TSConstructSignatureDeclaration: check,
    };
  },
};
