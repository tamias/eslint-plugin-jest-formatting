import padding from './rules/padding';

type TokenIdentifier =
  | '*'
  | 'afterAll'
  | 'afterEach'
  | 'beforeAll'
  | 'beforeEach'
  | 'describe'
  | 'expect'
  | 'it'
  | 'test';

interface Option {
  blankLine: 'always' | 'any' | 'never';
  prev: TokenIdentifier | TokenIdentifier[];
  next: TokenIdentifier | TokenIdentifier[];
}

interface RuleDef {
  description: string;
  url: string;
  options: Option[];
}

interface RuleDefs {
  [name: string]: RuleDef;
}

/**
 * Extend and configure the base padding rule to make a new rule
 */
export const makeRule = ({ description, url, options }: RuleDef) => {
  return {
    meta: {
      ...padding.meta,
      docs: {
        ...padding.meta.docs,
        description,
        url,
      },
    },
    create(context) {
      // Copy the RuleContext and overwrite options; it's frozen and
      // we can't set them directly.
      const ctx = Object.create(context, { options: { value: options } });

      // Freeze it again
      Object.freeze(ctx);

      // Call the original create method
      return padding.create(ctx);
    },
  };
};

/**
 * Build a set of rules from a RuleDefs object
 */
export const makeRules = (ruleDefs: RuleDefs) => {
  return Object.keys(ruleDefs).reduce(
    (rules, key) => Object.assign(rules, { [key]: makeRule(ruleDefs[key]) }),
    {},
  );
};
