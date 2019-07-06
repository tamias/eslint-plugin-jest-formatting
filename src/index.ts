/**
 * @fileoverview This contains formatting rules for jest in jest
 * @author Dan
 */

import padding from './rules/padding';
import { makeRules } from './utils';

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

const url = rule =>
  `https://github.com/dangreenisrael/eslint-plugin-jest-formatting/blob/master/docs/rules/${rule}.md`;

export const rules = {
  padding,
  ...makeRules({
    'padding-before-after-all-blocks': {
      description: 'require padding line before afterAll blocks',
      url: url('padding-before-after-all-blocks'),
      options: [{ blankLine: 'always', prev: '*', next: 'afterAll' }],
    },
    'padding-before-after-each-blocks': {
      description: 'require padding line before afterEach blocks',
      url: url('padding-before-after-each-blocks'),
      options: [{ blankLine: 'always', prev: '*', next: 'afterEach' }],
    },
    'padding-before-before-all-blocks': {
      description: 'require padding line before beforeAll blocks',
      url: url('padding-before-before-all-blocks'),
      options: [{ blankLine: 'always', prev: '*', next: 'beforeAll' }],
    },
    'padding-before-before-each-blocks': {
      description: 'require padding line before beforeEach blocks',
      url: url('padding-before-before-each-blocks'),
      options: [{ blankLine: 'always', prev: '*', next: 'beforeEach' }],
    },
    'padding-before-describe-blocks': {
      description: 'require padding line before describe blocks',
      url: url('padding-before-describe-blocks'),
      options: [{ blankLine: 'always', prev: '*', next: 'describe' }],
    },
    'padding-before-expect-statements': {
      description: 'require padding line before expect statements',
      url: url('padding-before-expect-statements'),
      options: [
        { blankLine: 'always', prev: '*', next: 'expect' },
        { blankLine: 'any', prev: 'expect', next: 'expect' },
      ],
    },
    'padding-before-test-blocks': {
      description: 'require padding line before test/it blocks',
      url: url('padding-before-test-blocks'),
      options: [{ blankLine: 'always', prev: '*', next: ['test', 'it'] }],
    },
    'padding-before-all': {
      description: 'require a padding line before all jest statements',
      url: url('padding-before-all'),
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
  }),
};
