import { objectParameters } from './object-parameters.mjs';
import { requireRequestCatch } from './require-request-catch.mjs';
import { requireSharedRequest } from './require-shared-request.mjs';
import { typeFiles } from './type-files.mjs';


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
    'object-parameters': objectParameters,
    'type-files': typeFiles,
    'require-shared-request': requireSharedRequest,
    'no-nested-ternary': noNestedTernary,
    'require-request-catch': requireRequestCatch,
  },
};
