import eslintJs from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier/recommended";
import turbo from 'eslint-plugin-turbo';
import tseslint from "typescript-eslint";

export default tseslint.config([
  // Recommended JavaScript configuration
  eslintJs.configs.recommended,
  
  // Recommended TypeScript configuration
  ...tseslint.configs.recommended,

  // Turbo-specific rules for monorepos
  turbo.configs['flat/recommended'],
  
  // Disables rules that conflict with Prettier
  prettierConfig,
  
  // Recommended rules from the Prettier plugin
  prettierPlugin,
  
  // Directories ignored by ESLint
  {
    ignores: ["node_modules", "dist"],
  },
  
  // Prettier custom rules
  {
    rules: {
      "prettier/prettier": [
        "error",
        {
          singleQuote: true,
          trailingComma: "all",
          bracketSpacing: true,
          bracketSameLine: false,
          tabWidth: 2,
          endOfLine: "auto",
        },
      ],
    },
  },
]);