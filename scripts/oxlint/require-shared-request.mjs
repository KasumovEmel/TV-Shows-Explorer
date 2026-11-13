import { binding, requestTarget } from './request-target.mjs';


const message = 'Для запросов используй request() из @/app/utils/request.';

export const requireSharedRequest = {
  create(context) {
    function checkSource(node) {
      if (!node) {
        return;
      }
      const name =
        node.type === 'TemplateLiteral' && !node.expressions.length
          ? node.quasis[0].value.cooked
          : node.value;
      if (typeof name === 'string' && (name === 'axios' || name.startsWith('axios/'))) {
        context.report({ node, message });
      }
    }

    return {
      ImportExpression(node) {
        checkSource(node.source);
      },
      CallExpression(node) {
        if (node.callee.name === 'require' && !binding(context.sourceCode, node.callee)) {
          checkSource(node.arguments[0]);
        } else if (requestTarget(context.sourceCode, node.callee) === 'fetch') {
          context.report({ node, message });
        }
      },
      NewExpression(node) {
        if (requestTarget(context.sourceCode, node.callee) === 'XMLHttpRequest') {
          context.report({ node, message });
        }
      },
      TSExternalModuleReference(node) {
        if (node.parent.importKind !== 'type') {
          checkSource(node.expression);
        }
      },
    };
  },
};
