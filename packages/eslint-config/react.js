import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import base from './base.js';

export default tseslint.config(
  ...base,

  {
    files: ['**/*.{ts,tsx}'],
  },

  // Language and global environment settings
  {
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    }
  },

  {
    plugins: {
      'react-hooks': reactHooks, // Plugin to enforce rules for React Hooks
      'react-refresh': reactRefresh, // Plugin to support React Fast Refresh compatibility
    }
  },

  {
    rules: {
      // Ensures only components (or optionally constants) are exported from modules,
      // to support fast refresh in React development
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  }
)