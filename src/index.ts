/**
 * @fileoverview This contains formatting rules for jest in jest
 * @author Dan
 */

import padding from './rules/padding';
import paddingBeforeAfterAllBlocks from './rules/padding-before-after-all-blocks';
import paddingBeforeAfterEachBlocks from './rules/padding-before-after-each-blocks';
import paddingBeforeBeforeAllBlocks from './rules/padding-before-before-all-blocks';
import paddingBeforeBeforeEachBlocks from './rules/padding-before-before-each-blocks';
import paddingBeforeDescribeBlocks from './rules/padding-before-describe-blocks';
import paddingBeforeExpectStatements from './rules/padding-before-expect-statements';
import paddingBeforeTestBlocks from './rules/padding-before-test-blocks';

//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

// import all rules in lib/rules

export const rules = {
  padding,
  'padding-before-after-all-blocks': paddingBeforeAfterAllBlocks,
  'padding-before-after-each-blocks': paddingBeforeAfterEachBlocks,
  'padding-before-before-all-blocks': paddingBeforeBeforeAllBlocks,
  'padding-before-before-each-blocks': paddingBeforeBeforeEachBlocks,
  'padding-before-describe-blocks': paddingBeforeDescribeBlocks,
  'padding-before-expect-statements': paddingBeforeExpectStatements,
  'padding-before-test-blocks': paddingBeforeTestBlocks,
};
