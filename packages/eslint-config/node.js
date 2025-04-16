import globals from 'globals';
import tseslint from 'typescript-eslint';
import base from './base.js';

export default tseslint.config(
  ...base,

  // Language and global environment settings
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
    },
  },
)