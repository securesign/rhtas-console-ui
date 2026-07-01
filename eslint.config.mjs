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
    linterOptions: {
      reportUnusedDisableDirectives: "off",
    },
    rules: {
      // TODO: Remove these rules incrementally so we have default and more strict linting
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "react-refresh/only-export-components": "off",
      "@eslint-react/no-create-ref": "off",
      "@eslint-react/unsupported-syntax": "off",
      "@eslint-react/jsx-no-key-after-spread": "off",
      "@eslint-react/no-use-context": "off",
      "@eslint-react/no-unnecessary-use-prefix": "off",
      "@eslint-react/no-context-provider": "off",
      "@eslint-react/no-array-index-key": "off",
      "@eslint-react/use-state": "off",
      "@eslint-react/purity": "off",
      "@tanstack/query/prefer-query-options": "off",
    },
    ignores: [
      "client/config/**",
      "client/src/app/client/**",
      "client/types/**",
    ],
  },
]);
