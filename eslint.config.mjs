import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends(
    "eslint:recommended",
    "prettier",
    "plugin:node/recommended",
  ),
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },

      ecmaVersion: "latest",
      sourceType: "module",
    },

    settings: {
      node: {
        tryExtensions: [".js", ".json", ".node"],
      },
    },

    rules: {
      "no-console": "warn",

      "no-unused-vars": [
        "warn",
        {
          vars: "all",
          args: "none",
          ignoreRestSiblings: false,
        },
      ],

      "no-var": "error",
      "prefer-const": "error",
      "arrow-body-style": ["error", "as-needed"],
      eqeqeq: ["error", "always"],
      "no-duplicate-imports": "error",

      "node/no-unsupported-features/es-syntax": [
        "error",
        {
          version: ">=22.11.0",
          ignores: [],
        },
      ],

      "node/no-missing-import": [
        "error",
        {
          allowModules: [],
          resolvePaths: [],
          tryExtensions: [".js", ".json", ".node"],
        },
      ],
    },
  },
];
