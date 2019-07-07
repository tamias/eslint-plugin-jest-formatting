/**
 * @fileoverview This contains formatting rules for jest in jest
 * @author Dan
 */

import { makeRules } from './utils';

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

export const rules = makeRules({
  'padding-before-after-all-blocks': [
    { blankLine: 'always', prev: '*', next: 'afterAll' },
  ],
  'padding-before-after-each-blocks': [
    { blankLine: 'always', prev: '*', next: 'afterEach' },
  ],
  'padding-before-before-all-blocks': [
    { blankLine: 'always', prev: '*', next: 'beforeAll' },
  ],
  'padding-before-before-each-blocks': [
    { blankLine: 'always', prev: '*', next: 'beforeEach' },
  ],
  'padding-before-describe-blocks': [
    { blankLine: 'always', prev: '*', next: 'describe' },
  ],
  'padding-before-expect-statements': [
    { blankLine: 'always', prev: '*', next: 'expect' },
    { blankLine: 'any', prev: 'expect', next: 'expect' },
  ],
  'padding-before-test-blocks': [
    { blankLine: 'always', prev: '*', next: ['test', 'it'] },
  ],
  'padding-before-all': [
    {
      blankLine: 'always',
      prev: '*',
      next: [
        'afterAll',
        'afterEach',
        'beforeAll',
        'beforeEach',
        'describe',
        'expect',
        'it',
        'test',
      ],
    },
    { blankLine: 'any', prev: 'expect', next: 'expect' },
  ],
});
