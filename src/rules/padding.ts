/**
 * @fileoverview Rule to require or disallow newlines between jest functions,
 *   based on eslint/padding-line-between-statements by Toru Nagashima
 */
import { AST, Rule, SourceCode } from 'eslint';

const STATEMENT_LIST_PARENTS = new Set([
  'Program',
  'BlockStatement',
  'SwitchCase',
]);

const isTokenOnSameLine = (left: AST.Token, right: AST.Token): boolean => {
  return left.loc.end.line === right.loc.start.line;
};

const isSemicolonToken = (token: AST.Token): boolean => {
  return token.value === ';' && token.type === 'Punctuator';
};

// NOTE: Should probably be configurable
const isTestFile = (filename: string): boolean => {
  return filename.includes('test') || filename.includes('spec');
};

/**
 * Creates tester which check if an expression node has a certain name
 *
 * @returns {Object} the created tester.
 */
function newJestTokenTester(name: string) {
  return {
    test: (node, sourceCode: SourceCode): boolean => {
      const token = sourceCode.getFirstToken(node);

      return (
        node.type === 'ExpressionStatement' &&
        token.type === 'Identifier' &&
        token.value === name
      );
    },
  };
}

/**
 * Gets the actual last token.
 *
 * If a semicolon is semicolon-less style's semicolon, this ignores it.
 * For example:
 *
 *     foo()
 *     ;[1, 2, 3].forEach(bar)
 *
 * @param {ASTNode} node The node to get.
 */
function getActualLastToken(sourceCode: SourceCode, node): AST.Token {
  const semiToken = sourceCode.getLastToken(node);
  const prevToken = sourceCode.getTokenBefore(semiToken);
  const nextToken = sourceCode.getTokenAfter(semiToken);
  const isSemicolonLessStyle = Boolean(
    prevToken &&
      nextToken &&
      prevToken.range[0] >= node.range[0] &&
      isSemicolonToken(semiToken) &&
      semiToken.loc.start.line !== prevToken.loc.end.line &&
      semiToken.loc.end.line === nextToken.loc.start.line,
  );

  return isSemicolonLessStyle ? prevToken : semiToken;
}

/**
 * Check and report statements for `any` configuration. It does nothing.
 */
function verifyForAny(): void {}

/**
 * Check and report statements for `always` configuration.
 * This autofix inserts a blank line between the given 2 statements.
 * If the `prevNode` has trailing comments, it inserts a blank line after the
 * trailing comments.
 *
 * @param {ASTNode} prevNode The previous node to check.
 * @param {ASTNode} nextNode The next node to check.
 */
function verifyForAlways(
  context: Rule.RuleContext,
  prevNode,
  nextNode,
  paddingLines: AST.Token[],
): void {
  if (paddingLines.length > 0) {
    return;
  }

  context.report({
    node: nextNode,
    message: 'Expected blank line before this statement.',
    fix(fixer) {
      const sourceCode = context.getSourceCode();
      let prevToken = getActualLastToken(sourceCode, prevNode);
      const nextToken =
        sourceCode.getFirstTokenBetween(prevToken, nextNode, {
          includeComments: true,

          /**
           * Skip the trailing comments of the previous node.
           * This inserts a blank line after the last trailing comment.
           *
           * For example:
           *
           *     foo(); // trailing comment.
           *     // comment.
           *     bar();
           *
           * Get fixed to:
           *
           *     foo(); // trailing comment.
           *
           *     // comment.
           *     bar();
           */
          filter(token: AST.Token): boolean {
            if (isTokenOnSameLine(prevToken, token)) {
              prevToken = token;
              return false;
            }

            return true;
          },
        }) || nextNode;

      const insertText = isTokenOnSameLine(prevToken, nextToken)
        ? '\n\n'
        : '\n';

      return fixer.insertTextAfter(prevToken, insertText);
    },
  });
}

// TODO: Do these without `test` and `verify`
/**
 * Types of blank lines.
 * `any`  and `always` are defined.
 * Those have `verify` method to check and report statements.
 */
const PaddingTypes = {
  any: { verify: verifyForAny },
  always: { verify: verifyForAlways },
};

/**
 * Types of statements.
 * Those have `test` method to check it matches to the given statement.
 */
const StatementTypes = {
  '*': { test: () => true },
  afterAll: newJestTokenTester('afterAll'),
  afterEach: newJestTokenTester('afterEach'),
  beforeAll: newJestTokenTester('beforeAll'),
  beforeEach: newJestTokenTester('beforeEach'),
  describe: newJestTokenTester('describe'),
  expect: newJestTokenTester('expect'),
  it: newJestTokenTester('it'),
  test: newJestTokenTester('test'),
};

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

export default <Rule.RuleModule>{
  meta: {
    fixable: 'whitespace',
    schema: {
      definitions: {
        paddingType: {
          enum: Object.keys(PaddingTypes),
        },
        statementType: {
          anyOf: [
            { enum: Object.keys(StatementTypes) },
            {
              type: 'array',
              items: { enum: Object.keys(StatementTypes) },
              minItems: 1,
              uniqueItems: true,
              additionalItems: false,
            },
          ],
        },
      },
      type: 'array',
      items: {
        type: 'object',
        properties: {
          blankLine: { $ref: '#/definitions/paddingType' },
          prev: { $ref: '#/definitions/statementType' },
          next: { $ref: '#/definitions/statementType' },
        },
        additionalProperties: false,
        required: ['blankLine', 'prev', 'next'],
      },
      additionalItems: false,
    },
  },
  create(context: Rule.RuleContext): Rule.RuleListener {
    const filename = context.getFilename();

    if (!isTestFile(filename)) {
      return {};
    }

    const sourceCode = context.getSourceCode();
    const configureList = context.options || [];
    let scopeInfo = null;

    /**
     * Processes to enter to new scope.
     * This manages the current previous statement.
     */
    function enterScope(): void {
      scopeInfo = {
        upper: scopeInfo,
        prevNode: null,
      };
    }

    /**
     * Processes to exit from the current scope.
     */
    function exitScope(): void {
      scopeInfo = scopeInfo.upper;
    }

    /**
     * Checks whether the given node matches the given type.
     *
     * @param {ASTNode} node The statement node to check.
     *
     * TODO: Make a Type for "type" with valid values?
     */
    function match(node, type: string | string[]): boolean {
      let innerStatementNode = node;

      while (innerStatementNode.type === 'LabeledStatement') {
        innerStatementNode = innerStatementNode.body;
      }

      if (Array.isArray(type)) {
        return type.some(match.bind(null, innerStatementNode));
      }

      return StatementTypes[type].test(innerStatementNode, sourceCode);
    }

    /**
     * Finds the last matched configure from configureList.
     *
     * @param {ASTNode} prevNode The previous statement to match.
     * @param {ASTNode} nextNode The current statement to match.
     * @returns {Object} The tester of the last matched configure.
     * @private
     */
    function getPaddingType(prevNode, nextNode) {
      for (let i = configureList.length - 1; i >= 0; --i) {
        const configure = configureList[i];
        const matched =
          match(prevNode, configure.prev) && match(nextNode, configure.next);

        if (matched) {
          return PaddingTypes[configure.blankLine];
        }
      }

      return PaddingTypes.any;
    }

    /**
     * Gets padding line sequences between the given 2 statements.
     * Comments are separators of the padding line sequences.
     *
     * @param {ASTNode} prevNode The previous statement to count.
     * @param {ASTNode} nextNode The current statement to count.
     */
    function getPaddingLineSequences(prevNode, nextNode): AST.Token[] {
      const pairs = [];
      let prevToken = getActualLastToken(sourceCode, prevNode);

      if (nextNode.loc.start.line - prevToken.loc.end.line >= 2) {
        do {
          const token = sourceCode.getTokenAfter(prevToken, {
            includeComments: true,
          });

          if (token.loc.start.line - prevToken.loc.end.line >= 2) {
            pairs.push([prevToken, token]);
          }

          prevToken = token;
        } while (prevToken.range[0] < nextNode.range[0]);
      }

      return pairs;
    }

    /**
     * Verify padding lines between the given node and the previous node.
     *
     * @param {ASTNode} node The node to verify.
     */
    function verify(node): void {
      const parentType = node.parent.type;
      const validParent =
        STATEMENT_LIST_PARENTS.has(parentType) ||
        parentType === 'SwitchStatement';

      if (!validParent) {
        return;
      }

      // Save this node as the current previous statement.
      const { prevNode } = scopeInfo;

      // Verify.
      if (prevNode) {
        const type = getPaddingType(prevNode, node);
        const paddingLines = getPaddingLineSequences(prevNode, node);

        type.verify(context, prevNode, node, paddingLines);
      }

      scopeInfo.prevNode = node;
    }

    /**
     * Verify padding lines between the given node and the previous node.
     * Then process to enter to new scope.
     *
     * @param {ASTNode} node The node to verify.
     */
    function verifyThenEnterScope(node): void {
      verify(node);
      enterScope();
    }

    return {
      Program: enterScope,
      BlockStatement: enterScope,
      SwitchStatement: enterScope,
      'Program:exit': exitScope,
      'BlockStatement:exit': exitScope,
      'SwitchStatement:exit': exitScope,
      ':statement': verify,
      SwitchCase: verifyThenEnterScope,
      'SwitchCase:exit': exitScope,
    };
  },
};
