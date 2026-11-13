const httpMethods = new Set([
  'request',
  'get',
  'delete',
  'head',
  'options',
  'post',
  'put',
  'patch',
  'postForm',
  'putForm',
  'patchForm',
]);
const globals = new Set(['globalThis', 'window', 'self']);

export function propertyName(node) {
  return node.computed ? node.property.value : node.property.name;
}

export function binding(source, identifier) {
  for (let scope = source.getScope(identifier); scope; scope = scope.upper) {
    if (scope.set.has(identifier.name)) {
      return scope.set.get(identifier.name).defs[0];
    }
  }
}

// Resolve imports and local aliases so unrelated methods such as Map#get stay valid.
export function requestTarget(source, node, seen = new Set()) {
  if (!node || seen.has(node)) {
    return;
  }
  seen.add(node);
  if (node.type === 'Identifier') {
    const def = binding(source, node);
    if (!def) {
      if (globals.has(node.name)) {
        return 'global';
      }

      return memberTarget('global', node.name);
    } else if (def.parent?.source?.value === 'axios') {
      if (def.node.type === 'ImportSpecifier') {
        return memberTarget('client', def.node.imported.name);
      }

      return 'client';
    } else if (def.node.type === 'VariableDeclarator') {
      const origin = requestTarget(source, def.node.init, seen);
      if (def.node.id.type === 'ObjectPattern') {
        const property = def.node.id.properties.find((item) => item.value?.name === node.name);

        return memberTarget(origin, property?.key.name);
      }

      return origin;
    }
  } else if (
    ['ChainExpression', 'TSNonNullExpression', 'TSSatisfiesExpression', 'TSAsExpression'].includes(
      node.type,
    )
  ) {
    return requestTarget(source, node.expression, seen);
  } else if (node.type === 'MemberExpression') {
    return memberTarget(requestTarget(source, node.object, seen), propertyName(node));
  } else if (
    node.type === 'CallExpression' &&
    requestTarget(source, node.callee, seen) === 'factory'
  ) {
    return 'client';
  }
}

function memberTarget(origin, name) {
  if (origin === 'global' && (name === 'fetch' || name === 'XMLHttpRequest')) {
    return name;
  }
  if (origin === 'client') {
    if (name === 'default') {
      return 'client';
    }
    if (name === 'create') {
      return 'factory';
    }
    if (httpMethods.has(name)) {
      return 'request';
    }
  }
}
