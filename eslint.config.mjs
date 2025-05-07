import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  prettierConfig,
  eslintPluginPrettier,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-require-imports": "warn",
      "@typescript-eslint/no-empty-object-type": "off",
      "no-prototype-builtins": "off",
      "prettier/prettier": [
        "warn",
        {},
        {
          usePrettierrc: true,
        },
      ],
    },
  },
);
