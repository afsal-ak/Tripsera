// module.exports = {
//   root: true,
//   parser: '@typescript-eslint/parser',
//   parserOptions: {
//     ecmaVersion: 2020,
//     sourceType: 'module',
//     ecmaFeatures: { jsx: true },
//   },
//   env: { browser: true, es2021: true },
//   extends: [
//     'eslint:recommended',
//     'plugin:react/recommended',
//     'plugin:react-hooks/recommended',
//     'plugin:@typescript-eslint/recommended',
//     'plugin:prettier/recommended',
//   ],
//   plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier', 'unused-imports'],
//   settings: { react: { version: 'detect' } },
//   rules: {
//     'prettier/prettier': 'error',
//     'react/react-in-jsx-scope': 'off',
//     '@typescript-eslint/no-unused-vars': 'off', // Disable base rule
//     'unused-imports/no-unused-imports': 'error', // Remove unused imports
//     'unused-imports/no-unused-vars': [
//       'warn',
//       {
//         vars: 'all',
//         varsIgnorePattern: '^_',
//         args: 'after-used',
//         argsIgnorePattern: '^_',
//       },
//     ],
//     '@typescript-eslint/no-explicit-any': 'off', // Allow `any`
//     'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
//   },
//   ignorePatterns: ['dist', 'build', 'node_modules'],
// }
