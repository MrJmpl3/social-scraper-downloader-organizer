/*
 * Copyright (c) 2021.
 *
 * File created to GLEN SOFT company.
 */

module.exports = {
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    parser: '@typescript-eslint/parser',
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:typescript-sort-keys/recommended',
    require.resolve('./rules/bestPractices'),
    require.resolve('./rules/errors'),
    require.resolve('./rules/node'),
    require.resolve('./rules/style'),
    require.resolve('./rules/variables'),
    require.resolve('./rules/es6'),
    require.resolve('./rules/import'),
    require.resolve('./rules/strict'),
  ],
  plugins: ['@typescript-eslint', 'typescript-sort-keys'],
  rules: {},
}
