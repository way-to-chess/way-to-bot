import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginPrettier from "eslint-plugin-prettier";

export default [
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  { files: ["../server/**/*.{ts,tsx}"] },
  {
    files: ["../server/**/*.{ts,tsx}"],
    languageOptions: { sourceType: "commonjs" },
  },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  {
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      "prettier/prettier": [
        "error",
        {
          semi: true,
          singleQuote: false,
          printWidth: 80,
          tabWidth: 2,
          trailingComma: "all",
          bracketSpacing: true,
          jsxBracketSameLine: false,
          arrowParens: "always",
        },
      ],
      semi: ["warn", "always"],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "next|res|req|err",
        },
      ],
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];
