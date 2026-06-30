import eslintReact from "@eslint-react/eslint-plugin";
import eslintJs from "@eslint/js";
import tseslint from "typescript-eslint";

import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import reactRefresh from "eslint-plugin-react-refresh";
import pluginQuery from "@tanstack/eslint-plugin-query";

export default defineConfig([
  globalIgnores(["**/dist", "**/coverage", "**/rollup.config.js"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      eslintJs.configs.recommended,
      tseslint.configs.recommended,
      eslintReact.configs["recommended-typescript"],
      ...pluginQuery.configs['flat/recommended-strict'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // TODO: Remove these rules incrementally so we have default and more strict linting
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-empty-function": ["off"],
      "@typescript-eslint/no-unsafe-assignment": ["warn"],
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
      "react-hooks/rules-of-hooks": "off",
      "@eslint-react/no-create-ref": "warn",
      "@eslint-react/no-leaked-conditional-rendering": "warn",
      "@eslint-react/unsupported-syntax": "warn",
      "@eslint-react/jsx-no-key-after-spread": "warn",
      "@eslint-react/rules-of-hooks": "warn",
      "@tanstack/query/prefer-query-options": "off",
    },
    ignores: [
      "client/config/**",
      "client/src/app/client/**",
      "client/types/**",
    ],
  },
]);
