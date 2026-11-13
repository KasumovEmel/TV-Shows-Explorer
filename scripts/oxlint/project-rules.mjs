import { requireRequestCatch } from './require-request-catch.mjs';
import { requireSharedRequest } from './require-shared-request.mjs';


const noNestedTernary = {
  create(context) {
    let depth = 0;

    return {
      ConditionalExpression(node) {
        if (depth > 0) {
          context.report({ node, message: 'Раздели вложенные тернарные выражения.' });
        }
        depth++;
      },
      'ConditionalExpression:exit'() {
        depth--;
      },
    };
  },
};

export default {
  meta: { name: 'project' },
  rules: {
    'require-shared-request': requireSharedRequest,
    'no-nested-ternary': noNestedTernary,
    'require-request-catch': requireRequestCatch,
  },
};
