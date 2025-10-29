// ESLint 9+ Flat Config
export default [
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        node: true,
        es2021: true,
      },
    },
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'warn',
      'no-multiple-empty-lines': ['error', { max: 1 }],
      eqeqeq: ['error', 'always'],
    },
  },
];
