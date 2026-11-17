const typeFile = /(?:^|[/\\.])types\.[cm]?tsx?$|[/\\]types[/\\]|\.d\.[cm]?ts$/u;

export const typeFiles = {
  create(context) {
    if (typeFile.test(context.filename)) {
      return {};
    }

    function report(node) {
      context.report({
        node,
        message: 'Опиши тип в types.ts или в файле *.types.ts рядом с владельцем.',
      });
    }

    function union(node) {
      const members = node.types.filter(
        (type) => !['TSNullKeyword', 'TSUndefinedKeyword'].includes(type.type),
      );
      // An optional named type is still the same type; a union of domain values needs a name.
      if (members.length > 1 || members.some((type) => type.type === 'TSLiteralType')) {
        report(node);
      }
    }

    return {
      TSTypeAliasDeclaration: report,
      TSInterfaceDeclaration: report,
      TSEnumDeclaration: report,
      TSTypeLiteral: report,
      TSTupleType: report,
      TSFunctionType: report,
      TSIntersectionType: report,
      TSMappedType: report,
      TSConditionalType: report,
      TSUnionType: union,
    };
  },
};
