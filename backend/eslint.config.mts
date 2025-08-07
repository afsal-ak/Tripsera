// import js from '@eslint/js';
// import globals from 'globals';
// import tseslint from 'typescript-eslint';
// import prettier from 'eslint-plugin-prettier';
// import configPrettier from 'eslint-config-prettier';
// import unusedImports from 'eslint-plugin-unused-imports';

// import 'dotenv/config';

// export default [
//   // Ignore build & node_modules
//   { ignores: ['dist/**', 'node_modules/**'] },

//   // JavaScript recommended rules
//   {
//     files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
//     languageOptions: { globals: globals.node },
//     ...js.configs.recommended,
//   },

//   // TypeScript recommended rules
//   ...tseslint.configs.recommended,

//   // Prettier integration
//   {
//     plugins: { prettier, 'unused-imports': unusedImports },
//     rules: {
//       '@typescript-eslint/no-explicit-any': 'off',
//       '@typescript-eslint/no-unused-vars': ['warn'],
//       'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
//     },
//   },

//   // Disable conflicting ESLint rules with Prettier
//   configPrettier,
// ];
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';
import configPrettier from 'eslint-config-prettier';
import unusedImports from 'eslint-plugin-unused-imports';

import 'dotenv/config';

export default [
  // Ignore build & node_modules
  { ignores: ['dist/**', 'node_modules/**'] },

  // JavaScript recommended rules
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    languageOptions: { globals: globals.node },
    ...js.configs.recommended,
  },

  // TypeScript recommended rules
  ...tseslint.configs.recommended,

  // Prettier, unused-imports, custom rules
  {
    plugins: {
      prettier,
      'unused-imports': unusedImports,
    },
    rules: {
      //  Auto-remove unused imports with --fix
      'unused-imports/no-unused-imports': 'error',

      // Optional: ignore unused vars that start with _
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // Others
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn'],
      //'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    },
  },

  // Prettier conflict resolution
  configPrettier,
];
