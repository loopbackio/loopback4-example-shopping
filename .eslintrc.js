// Copyright IBM Corp. 2019,2020. All Rights Reserved.
// Node module: loopback4-example-shopping-monorepo
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

module.exports = {
  extends: ['@loopback/eslint-config'],
  overrides: [
    {
      files: ['**/*.js'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-misused-promises': 'off',
      },
    },
  ],
  rules: {
    'mocha/handle-done-callback': 'off',
  },
  parserOptions: {
    createDefaultProgram: true,
  },
};
