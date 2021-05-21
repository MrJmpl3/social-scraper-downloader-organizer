// Inspired from:
// airbnb/eslint-config-airbnb-base v14.2.1
// iamturns/eslint-config-airbnb-typescript v12.3.1

module.exports = {
  root: true,
  extends: [
    require.resolve('./eslint/airbnb-typescript'),
    'prettier'
  ],
  rules: {
    "no-console": 0,
    "no-restricted-syntax": 0,
    "no-await-in-loop": 0,
    "no-continue": 0,
    "@typescript-eslint/no-unused-vars": [
      "error",
      { args: "all", argsIgnorePattern: "^_" },
    ],
  },
};
