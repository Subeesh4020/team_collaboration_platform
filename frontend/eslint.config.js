// @ts-check
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import boundaries from 'eslint-plugin-boundaries';
import { importX } from 'eslint-plugin-import-x';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import { configs as tsConfigs } from 'typescript-eslint';

/**
 * Architecture elements. Dependency direction: pages → features → components/lib.
 * See README "Folder rules" for the human-readable version of these policies.
 */
const elements = [
  { type: 'app', pattern: 'src/app' },
  { type: 'pages', pattern: 'src/pages' },
  { type: 'feature', pattern: 'src/features/*', capture: ['feature'] },
  { type: 'ui', pattern: 'src/components/ui' },
  { type: 'layout', pattern: 'src/components/layout' },
  { type: 'hooks', pattern: 'src/hooks' },
  { type: 'lib', pattern: 'src/lib/*', capture: ['lib'] },
  { type: 'config', pattern: 'src/config' },
  { type: 'types', pattern: 'src/types' },
  { type: 'styles', pattern: 'src/styles' },
  { type: 'assets', pattern: 'src/assets' },
  { type: 'mocks', pattern: 'src/mocks' },
  { type: 'test', pattern: 'src/test' },
];

/** @param {string[]} types */
const toTypes = (types) => ({ to: { element: { types } } });

const shared = ['lib', 'config', 'types', 'assets'];

export default defineConfig(
  {
    ignores: ['dist', 'coverage', 'node_modules', 'public/mockServiceWorker.js'],
  },
  {
    linterOptions: { reportUnusedDisableDirectives: 'error' },
  },
  js.configs.recommended,
  tsConfigs.strictTypeChecked,
  tsConfigs.stylisticTypeChecked,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'import-x/resolver-next': [createTypeScriptImportResolver({ alwaysTryTypes: true })],
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      'import-x/no-cycle': ['error', { ignoreExternal: true }],
      'import-x/no-default-export': 'error',
      'import-x/no-duplicates': ['error', { 'prefer-inline': true }],
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [{ pattern: '@/**', group: 'internal' }],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ...reactHooks.configs.flat['recommended-latest'],
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ...jsxA11y.flatConfigs.recommended,
    languageOptions: {
      ...jsxA11y.flatConfigs.recommended.languageOptions,
      globals: { ...globals.browser },
    },
    rules: {
      ...jsxA11y.flatConfigs.recommended.rules,
      // Scrollable regions (e.g. the message log) must be keyboard-focusable.
      'jsx-a11y/no-noninteractive-tabindex': [
        'error',
        { tags: [], roles: ['tabpanel', 'log', 'region'] },
      ],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { boundaries },
    settings: {
      'boundaries/elements': elements,
      'boundaries/legacy-templates': false,
      'boundaries/include': ['src/**/*'],
      // The entry file only wires app, mocks and global styles together.
      'boundaries/ignore': ['src/main.tsx'],
      'boundaries/files': [{ pattern: '**/*.test.{ts,tsx}', category: 'test' }],
      'import/resolver': { typescript: { alwaysTryTypes: true } },
    },
    rules: {
      'boundaries/no-unknown-files': 'error',
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            // Files inside the same element may import each other freely.
            { allow: { dependency: { relationship: { to: 'internal' } } } },

            {
              from: { element: { type: 'app' } },
              allow: toTypes(['pages', 'feature', 'ui', 'layout', 'hooks', ...shared]),
            },
            {
              from: { element: { type: 'pages' } },
              allow: toTypes(['feature', 'ui', 'layout', 'hooks', ...shared]),
            },
            // Features: only shared layers, plus other features through their index.ts.
            { from: { element: { type: 'feature' } }, allow: toTypes(['ui', 'hooks', ...shared]) },
            {
              from: { element: { type: 'feature' } },
              allow: { to: { element: { type: 'feature', fileInternalPath: 'index.ts' } } },
            },
            { from: { element: { type: 'layout' } }, allow: toTypes(['ui', 'hooks', ...shared]) },
            { from: { element: { type: 'ui' } }, allow: toTypes(['ui', ...shared]) },
            { from: { element: { type: 'hooks' } }, allow: toTypes(shared) },
            { from: { element: { type: 'lib' } }, allow: toTypes(['lib', 'config', 'types']) },
            { from: { element: { type: 'config' } }, allow: toTypes(['types']) },
            {
              from: { element: { type: 'mocks' } },
              allow: [
                toTypes(shared),
                { to: { element: { type: 'feature', fileInternalPath: 'index.ts' } } },
              ],
            },
            {
              from: { element: { type: 'test' } },
              allow: toTypes(['app', 'mocks', 'feature', ...shared]),
            },
            // Test files may additionally use test utilities and mocks.
            { from: { file: { categories: 'test' } }, allow: toTypes(['test', 'mocks']) },
          ],
        },
      ],
    },
  },
  {
    files: ['src/pages/**/*Page.tsx'],
    rules: {
      // Route-level pages are lazy-loaded and may use default exports.
      'import-x/no-default-export': 'off',
    },
  },
  {
    files: ['*.config.{js,ts}'],
    languageOptions: { globals: { ...globals.node } },
    rules: { 'import-x/no-default-export': 'off' },
  },
  {
    files: ['**/*.js'],
    extends: [tsConfigs.disableTypeChecked],
  },
  eslintConfigPrettier,
);
