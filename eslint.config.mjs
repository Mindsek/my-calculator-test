
import nextPlugin from '@next/eslint-plugin-next';
import checkFiles from 'eslint-plugin-check-file';
import importPlugin from 'eslint-plugin-import';
import playwright from 'eslint-plugin-playwright';
import hooksPlugin from 'eslint-plugin-react-hooks';
import vitest from 'eslint-plugin-vitest';
import globals from 'globals';
import tseslint from 'typescript-eslint';


export default tseslint.config(
  // Targeted files
  { files: ['**/*.{js,ts,tsx}'] },

  // Ignore useless files
  {
    ignores: ['dist/', 'build/', '**/*.css', '**/*.ico', '**/*.png'],
  },

  // Base config: TypeScript parser + globals
  {
    languageOptions: {
      parser: tseslint.parser,
      globals: { ...globals.browser, ...globals.node },
    },
  },

  // Base TypeScript rules
  ...tseslint.configs.recommended,

  // Next.js config
  {
    plugins: {
      '@next/next': nextPlugin,
      'react-hooks': hooksPlugin,
      import: importPlugin,
      vitest: vitest,
      playwright: playwright,
      'check-file': checkFiles,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
      ...hooksPlugin.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          args: 'all',
          argsIgnorePattern: '^_',
          caughtErrors: 'all',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      'react-hooks/rules-of-hooks': 'warn',
      'react-hooks/exhaustive-deps': 'off',
      'react/no-unescaped-entities': 'off',
      '@next/next/no-img-element': 'off',
      '@next/next/no-duplicate-head': 'off',
      'import/no-unresolved': ['error', { ignore: ['server-only'] }],
      'import/no-cycle': 'error',
    },
    settings: {
      'import/resolver': {
        typescript: {},
      },
    },
  },

  // Vitest (unit tests) config
  {
    files: ['**/*.test.{ts,tsx}'],
    plugins: { vitest },
    rules: {
      ...vitest.configs.recommended.rules,
      'vitest/prefer-lowercase-title': 'off',
    },
  },

  // Playwright (E2E tests) config
  {
    files: ['**/*.spec.{ts,tsx}', '**/*.e2e.ts'],
    plugins: { playwright },
    rules: {
      ...playwright.configs.recommended.rules,
    },
  },

  // Naming rules (files and folders)
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/**/__tests__/**'],
    plugins: { 'check-file': checkFiles },
    rules: {
      'check-file/no-index': 'error',
      'check-file/filename-naming-convention': [
        'error',
        { '**/*.{ts,tsx}': 'KEBAB_CASE' },
        { ignoreMiddleExtensions: true },
      ],
      'check-file/folder-naming-convention': [
        'error',
        { 'src/**': 'KEBAB_CASE' },
      ],
    },
  },
);