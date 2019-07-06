/**
 * @fileoverview This contains formatting rules for jest in jest
 * @author Dan
 */

import { makeRules } from './utils';

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

export const rules = makeRules({
  'padding-before-after-all-blocks': {
    description: 'require padding line before afterAll blocks',
    url: '',
    options: [{ blankLine: 'always', prev: '*', next: 'afterAll' }],
  },
  'padding-before-after-each-blocks': {
    description: 'require padding line before afterEach blocks',
    url: '',
    options: [{ blankLine: 'always', prev: '*', next: 'afterEach' }],
  },
  'padding-before-before-all-blocks': {
    description: 'require padding line before beforeAll blocks',
    url: '',
    options: [{ blankLine: 'always', prev: '*', next: 'beforeAll' }],
  },
  'padding-before-before-each-blocks': {
    description: 'require padding line before beforeEach blocks',
    url: '',
    options: [{ blankLine: 'always', prev: '*', next: 'beforeEach' }],
  },
  'padding-before-describe-blocks': {
    description: 'require padding line before describe blocks',
    url: '',
    options: [{ blankLine: 'always', prev: '*', next: 'describe' }],
  },
  'padding-before-expect-statements': {
    description: 'require padding line before expect statements',
    url: '',
    options: [
      { blankLine: 'always', prev: '*', next: 'expect' },
      { blankLine: 'any', prev: 'expect', next: 'expect' },
    ],
  },
  'padding-before-test-blocks': {
    description: 'require padding line before test/it blocks',
    url: '',
    options: [{ blankLine: 'always', prev: '*', next: ['test', 'it'] }],
  },
  'padding-before-all': {
    description: 'require a padding line before all jest statements',
    url: '',
    options: [
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
  },
});
