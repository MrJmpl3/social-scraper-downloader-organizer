module.exports = {
  env: {
    browser: true,
  },
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
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
};
