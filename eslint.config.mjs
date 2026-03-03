
import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tsparser from '@typescript-eslint/parser';
import tseslint from 'typescript-eslint';

export default defineConfig(
    eslint.configs.recommended,
    tseslint.configs.strict,
    tseslint.configs.stylistic,
    {
        ignores: [
            "**/dist/**/*",
            "**/node_modules/**/*",
            "**/coverage/**/*"
        ]
    },
    {
        files: ["**/*.{ts}"],
        languageOptions: {
            parser: tsparser,
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module'
            }
        }
    },
    {
        rules: {
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-extraneous-class": "off",
            "@typescript-eslint/no-unsafe-function-type": "off",
            "@typescript-eslint/consistent-type-definitions": "off",
            "@typescript-eslint/consistent-type-imports": "error",
            "@typescript-eslint/unified-signatures": "off",
            "semi": ["error", "always"],
            "brace-style": ["error", "allman", { "allowSingleLine": true }],
            "no-console": "error",
            "no-undef": "off", // typescript handles this for us
        }
    }
);