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
 * Extend the base padding rule to make a new rule
 */
export const makeRule = ({ description, url, options }: RuleDef) => {
  return {
    meta: {
      // Take mose of the padding meta data
      ...padding.meta,
      // Customize docs
      docs: {
        ...padding.meta.docs,
        // Add description and url for new rule
        description,
        url,
      },
    },
    // Wrap original create with a function that modifies RuleContext
    // with the options for new rule
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
