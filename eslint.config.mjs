import react from 'eslint-plugin-react'
import hooks from 'eslint-plugin-react-hooks'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'

import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
export default [
  { ignores: ['.next/**', 'out/**', 'coverage/**'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.node },
    },
    settings: { react: { version: 'detect' } },
    plugins: {
      react,
      'react-hooks': hooks,
      '@stylistic': stylistic,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'react/jsx-uses-vars': 'error',
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
      'react/jsx-uses-react': 'error',
      'react/jsx-key': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^react', '^next', '^@next', '^[a-z]'],
            ['^@/i18n'],
            ['^@/constant'],
            ['^@/app/actions'],
            [
              '^@/context',
              '^@/hooks',
              '^@/store',
              '^@/modules/Dota/store',
              '^@/utils',
              '^@/helpers',
            ],
            [
              '^@/components/',
              '^@/modules/Dota/',
              '^@/components',
              '^@/modules',
              '^@/widgets',
              '^@/sections(?!.*/skeleton$)',
              '^\\.\\./',
            ],
            ['^@/sections.*/skeleton$', '^\\.\\./.*/skeleton$'],
            ['^\\./action'],
            ['^\\./(?!(index\\.module\\.scss|.*\\.css$))'],
            ['^.+\\.s?css$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',

      '@stylistic/comma-spacing': ['error', { before: false, after: true }],
      '@stylistic/object-curly-spacing': ['error', 'always'],

      '@stylistic/object-curly-newline': [
        'error',
        {
          ImportDeclaration: { multiline: true, minProperties: 4 },
          ExportDeclaration: { multiline: true, minProperties: 4 },
          ObjectExpression: { consistent: true },
          ObjectPattern: { consistent: true },
        },
      ],

      '@stylistic/object-property-newline': 'off',

      '@stylistic/indent': [
        'error',
        2,
        {
          SwitchCase: 1,
          ignoredNodes: [
            'LogicalExpression[right.type="JSXElement"]',
            'LogicalExpression[right.type="JSXFragment"]',
            'CallExpression > ObjectExpression',
          ],
        },
      ],
      '@stylistic/jsx-indent': 'off',
      '@stylistic/jsx-indent-props': ['error', 2],
      '@stylistic/jsx-wrap-multilines': 'off',
      '@stylistic/jsx-curly-newline': ['error', { multiline: 'require', singleline: 'consistent' }],
      '@stylistic/jsx-one-expression-per-line': 'error',
      '@stylistic/jsx-first-prop-new-line': ['error', 'multiprop'],
      '@stylistic/jsx-max-props-per-line': ['error', { maximum: 1 }],
      '@stylistic/jsx-closing-bracket-location': ['error', 'tag-aligned'],
      '@stylistic/jsx-closing-tag-location': 'error',
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/jsx-quotes': ['error', 'prefer-double'],
    },
  },
]
