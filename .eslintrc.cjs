module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: ['eslint:recommended'],
  overrides: [
    {
      // typescript
      files: ['*.ts', '*.tsx'],
      plugins: ['@typescript-eslint', 'eslint-plugin-tsdoc'],
      extends: ['plugin:@typescript-eslint/eslint-recommended', 'plugin:@typescript-eslint/recommended'],
      rules: {
        'tsdoc/syntax': 'warn',
        // note you must disable the base rule as it can report incorrect errors
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error', // or "error"
          {
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            caughtErrorsIgnorePattern: '^_',
          },
        ],
      },
    },
    {
      // configuration js files
      files: ['postcss.config.js', 'tailwind.config.js', '.eslintrc.cjs'],
      env: {
        node: true,
      },
    },
  ],
};
