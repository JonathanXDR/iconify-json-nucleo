import eslint from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores([
    '**/node_modules/**',
    '**/dist/**',
    '**/icons.json',
    'packages/families/**',
    'scripts/templates/**',
  ]),
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      globals: { ...globals.node },
      parserOptions: {
        projectService: {
          allowDefaultProject: ['eslint.config.ts', 'commitlint.config.ts'],
        },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-undef': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
    },
  },
  {
    files: ['**/*.test.ts'],
    rules: {
      // bun:test types its rejection matchers (.rejects.toThrow) as returning
      // void, yet they must be awaited so the assertion settles. Awaiting them
      // is correct at runtime, so these type-aware checks do not apply here.
      '@typescript-eslint/await-thenable': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'off',
    },
  },
);
