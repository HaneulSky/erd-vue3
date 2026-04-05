import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';
import vueParser from 'vue-eslint-parser';

export default tseslint.config(
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '*.min.js',
      'coverage/**',
      '.env*',
      '*.log',
      'eslint.config.ts',
    ],
  },

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'comma-dangle': ['error', 'always-multiline'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'keyword-spacing': ['error', { before: true, after: true }],
      'space-infix-ops': 'error', // a + b вместо a+b
      'space-before-function-paren': ['error', 'always'],
      'space-before-blocks': ['error', 'always'],
      'no-trailing-spaces': 'error',
      'eol-last': ['error', 'always'],
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],
    },
  },

  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  ...pluginVue.configs['flat/recommended'],

  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'vue/attributes-order': [
        'error',
        {
          order: [
            'DEFINITION', 'LIST_RENDERING', 'CONDITIONALS',
            'GLOBAL', 'UNIQUE', 'OTHER_ATTR', 'EVENTS', 'CONTENT',
          ],
        },
      ],
      'vue/max-attributes-per-line': [
        'error',
        { singleline: { max: 3 }, multiline: { max: 1 } },
      ],
      'vue/html-closing-bracket-newline': [
        'error',
        { singleline: 'never', multiline: 'always' },
      ],
      'vue/html-self-closing': [
        'error',
        {
          html: { void: 'always', normal: 'always', component: 'always' },
          svg: 'always',
          math: 'always',
        },
      ],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/multi-word-component-names': 'off',
      'vue/require-v-for-key': 'error',

      'indent': 'off',
      '@typescript-eslint/indent': ['error', 2],

      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
      ],
    },
  },

  eslintConfigPrettier
);