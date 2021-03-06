/*
 * Copyright (c) 2021.
 *
 * File created to GLEN SOFT company.
 */

// Inspired from:
// airbnb/eslint-config-airbnb-base v14.2.1
// iamturns/eslint-config-airbnb-typescript v12.3.1

module.exports = {
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    require.resolve('./shared'),
  ],
};
