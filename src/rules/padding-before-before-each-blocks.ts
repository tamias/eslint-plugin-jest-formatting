import padding from './padding';

export default {
  ...padding,
  create(context) {
    const ctx = Object.create(context, {
      options: {
        value: [{ blankLine: 'always', prev: '*', next: 'beforeEach' }],
      },
    });

    return padding.create(ctx);
  },
};
