const { resolve } = require('path');

module.exports = {
  root: true,
  parserOptions: {
    project: resolve(__dirname, './tsconfig.json'),
    tsconfigRootDir: __dirname,
  },
  extends: [require.resolve('./eslint/airbnb-typescript'), 'prettier'],
  rules: {
    'no-console': 0,
    'no-restricted-syntax': 0,
    'no-await-in-loop': 0,
    'no-continue': 0,
    'no-param-reassign': [
      2,
      { props: true, ignorePropertyModificationsFor: ['task'] },
    ],
    '@typescript-eslint/no-floating-promises': 0,
    '@typescript-eslint/no-unsafe-assignment': 0,
    '@typescript-eslint/no-unsafe-call': 0,
    '@typescript-eslint/no-unsafe-member-access': 0,
    '@typescript-eslint/restrict-template-expressions': 0,
    '@typescript-eslint/no-unused-vars': [
      'error',
      { args: 'all', argsIgnorePattern: '^_' },
    ],
  },
};
